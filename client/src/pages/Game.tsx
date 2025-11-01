import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { GameCanvas } from '@/components/GameCanvas';
import { GameHUD } from '@/components/GameHUD';
import { StartScreen } from '@/components/StartScreen';
import { GameOverScreen } from '@/components/GameOverScreen';
import { Button } from '@/components/ui/button';
import { Pause, Play } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { 
  GameState, 
  Enemy, 
  Position, 
  MAZE_LAYOUT, 
  POWER_UP_DURATION,
  DOT_POINTS,
  POWER_UP_POINTS,
  ENEMY_SCARED_POINTS,
  type HighScore 
} from '@shared/schema';

export default function Game() {
  const [gameState, setGameState] = useState<GameState>(() => createInitialGameState());
  const [highScore, setHighScore] = useState(0);
  const gameLoopRef = useRef<number>();
  const powerUpTimerRef = useRef<number>();
  const enemyMoveTimerRef = useRef<number>();
  const lastMoveTimeRef = useRef<{ [key: string]: number }>({});
  const lastDanteMoveRef = useRef<number>(0);
  const currentDirectionRef = useRef<'up' | 'down' | 'left' | 'right'>('up');
  const nextDirectionRef = useRef<'up' | 'down' | 'left' | 'right' | null>(null);

  // Initialize dots and power-ups from maze layout
  function createInitialGameState(): GameState {
    const dots: Position[] = [];
    const powerUps: Position[] = [];
    
    MAZE_LAYOUT.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 1) {
          // Skip starting positions
          if ((x === 9 && y === 16) || // Dante start
              (x === 9 && y === 9) || // Wolf start
              (x === 8 && y === 9) || // Lion start
              (x === 10 && y === 9)) { // Leopard start
            return;
          }
          dots.push({ x, y });
        } else if (cell === 2) {
          powerUps.push({ x, y });
        }
      });
    });

    return {
      status: 'start',
      score: 0,
      lives: 3,
      level: 1,
      dantePosition: { x: 9, y: 16 },
      danteDirection: 'up',
      enemies: [
        { id: 'wolf', type: 'wolf', position: { x: 9, y: 9 }, direction: 'left', isFleeing: false },
        { id: 'lion', type: 'lion', position: { x: 8, y: 9 }, direction: 'right', isFleeing: false },
        { id: 'leopard', type: 'leopard', position: { x: 10, y: 9 }, direction: 'up', isFleeing: false },
      ],
      dots,
      powerUps,
      isPoweredUp: false,
      powerUpTimeRemaining: 0,
      highScore: 0,
    };
  }

  // Fetch high scores from backend
  const { data: highScores } = useQuery<HighScore[]>({
    queryKey: ['/api/highscores'],
  });

  // Save high score mutation
  const saveHighScoreMutation = useMutation({
    mutationFn: async (score: number) => {
      return await apiRequest('POST', '/api/highscores', {
        score,
        date: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/highscores'] });
    },
  });

  // Load high score on mount
  useEffect(() => {
    // Use backend high scores if available, fallback to localStorage
    if (highScores && highScores.length > 0) {
      const topScore = highScores[0].score;
      setHighScore(topScore);
      setGameState(prev => ({ ...prev, highScore: topScore }));
      localStorage.setItem('danteHighScore', topScore.toString());
    } else {
      const savedHighScore = localStorage.getItem('danteHighScore');
      if (savedHighScore) {
        const score = parseInt(savedHighScore, 10);
        setHighScore(score);
        setGameState(prev => ({ ...prev, highScore: score }));
      }
    }
  }, [highScores]);

  // Save high score
  const saveHighScore = useCallback((score: number) => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('danteHighScore', score.toString());
      setGameState(prev => ({ ...prev, highScore: score }));
      
      // Save to backend
      saveHighScoreMutation.mutate(score);
    }
  }, [highScore, saveHighScoreMutation]);

  // Check if position is valid (not a wall)
  const isValidPosition = (pos: Position): boolean => {
    if (pos.y < 0 || pos.y >= MAZE_LAYOUT.length || pos.x < 0 || pos.x >= MAZE_LAYOUT[0].length) {
      return false;
    }
    return MAZE_LAYOUT[pos.y][pos.x] !== 0;
  };

  // Get next position based on direction
  const getNextPosition = (pos: Position, direction: string): Position => {
    const newPos = { ...pos };
    switch (direction) {
      case 'up': newPos.y -= 1; break;
      case 'down': newPos.y += 1; break;
      case 'left': newPos.x -= 1; break;
      case 'right': newPos.x += 1; break;
    }
    return newPos;
  };

  // Handle keyboard input - set desired direction
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.status !== 'playing') return;

      let newDirection: 'up' | 'down' | 'left' | 'right' | null = null;
      
      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          newDirection = 'up';
          break;
        case 'arrowdown':
        case 's':
          newDirection = 'down';
          break;
        case 'arrowleft':
        case 'a':
          newDirection = 'left';
          break;
        case 'arrowright':
        case 'd':
          newDirection = 'right';
          break;
        case 'p':
          setGameState(prev => ({
            ...prev,
            status: prev.status === 'playing' ? 'paused' : 'playing'
          }));
          return;
      }

      if (newDirection) {
        e.preventDefault();
        // Store the next direction to try
        nextDirectionRef.current = newDirection;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.status]);

  // Game loop for continuous movement, collision detection and updates
  useEffect(() => {
    if (gameState.status !== 'playing') return;

    const gameLoop = () => {
      const now = Date.now();
      
      setGameState(prev => {
        const newState = { ...prev };

        // Continuous Dante movement (Pac-Man style)
        const MOVE_DELAY = 150; // milliseconds between moves
        if (now - lastDanteMoveRef.current >= MOVE_DELAY) {
          lastDanteMoveRef.current = now;

          // Try to change direction if a new one was requested
          if (nextDirectionRef.current) {
            const nextPos = getNextPosition(newState.dantePosition, nextDirectionRef.current);
            if (isValidPosition(nextPos)) {
              currentDirectionRef.current = nextDirectionRef.current;
              nextDirectionRef.current = null;
            }
          }

          // Move Dante in current direction
          const nextPos = getNextPosition(newState.dantePosition, currentDirectionRef.current);
          if (isValidPosition(nextPos)) {
            newState.dantePosition = nextPos;
            newState.danteDirection = currentDirectionRef.current;
          }
        }

        // Check dot collection
        const dotIndex = newState.dots.findIndex(
          dot => dot.x === newState.dantePosition.x && dot.y === newState.dantePosition.y
        );
        if (dotIndex !== -1) {
          newState.dots = [...newState.dots];
          newState.dots.splice(dotIndex, 1);
          newState.score += DOT_POINTS;

          // Check victory
          if (newState.dots.length === 0) {
            saveHighScore(newState.score);
            return { ...newState, status: 'victory' };
          }
        }

        // Check power-up collection
        const powerUpIndex = newState.powerUps.findIndex(
          pu => pu.x === newState.dantePosition.x && pu.y === newState.dantePosition.y
        );
        if (powerUpIndex !== -1) {
          newState.powerUps = [...newState.powerUps];
          newState.powerUps.splice(powerUpIndex, 1);
          newState.score += POWER_UP_POINTS;
          newState.isPoweredUp = true;
          newState.powerUpTimeRemaining = POWER_UP_DURATION;
          newState.enemies = newState.enemies.map(e => ({ ...e, isFleeing: true }));
        }

        // Check enemy collision
        const enemyCollision = newState.enemies.find(
          enemy => enemy.position.x === newState.dantePosition.x && 
                  enemy.position.y === newState.dantePosition.y
        );

        if (enemyCollision) {
          if (newState.isPoweredUp && enemyCollision.isFleeing) {
            // Eat the enemy
            newState.score += ENEMY_SCARED_POINTS;
            // Reset enemy to starting position
            const startPos = enemyCollision.type === 'wolf' ? { x: 9, y: 9 } :
                           enemyCollision.type === 'lion' ? { x: 8, y: 9 } :
                           { x: 10, y: 9 };
            newState.enemies = newState.enemies.map(e => 
              e.id === enemyCollision.id 
                ? { ...e, position: startPos, isFleeing: false }
                : e
            );
          } else if (!enemyCollision.isFleeing) {
            // Dante loses a life
            newState.lives -= 1;
            if (newState.lives <= 0) {
              saveHighScore(newState.score);
              return { ...newState, status: 'defeat' };
            }
            // Reset positions
            newState.dantePosition = { x: 9, y: 16 };
            newState.enemies = newState.enemies.map((e, i) => ({
              ...e,
              position: i === 0 ? { x: 9, y: 9 } : i === 1 ? { x: 8, y: 9 } : { x: 10, y: 9 },
              isFleeing: false,
            }));
            newState.isPoweredUp = false;
            newState.powerUpTimeRemaining = 0;
          }
        }

        return newState;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState.status, saveHighScore]);

  // Power-up timer
  useEffect(() => {
    if (gameState.status !== 'playing' || !gameState.isPoweredUp) return;

    const interval = setInterval(() => {
      setGameState(prev => {
        if (prev.powerUpTimeRemaining <= 100) {
          return {
            ...prev,
            isPoweredUp: false,
            powerUpTimeRemaining: 0,
            enemies: prev.enemies.map(e => ({ ...e, isFleeing: false })),
          };
        }
        return {
          ...prev,
          powerUpTimeRemaining: prev.powerUpTimeRemaining - 100,
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [gameState.status, gameState.isPoweredUp]);

  // Enemy AI movement
  useEffect(() => {
    if (gameState.status !== 'playing') return;

    const moveEnemies = () => {
      setGameState(prev => {
        const newEnemies = prev.enemies.map(enemy => {
          // Enemies move less frequently
          const now = Date.now();
          const lastMove = lastMoveTimeRef.current[enemy.id] || 0;
          const moveDelay = enemy.isFleeing ? 300 : 200; // Fleeing enemies are slower
          
          if (now - lastMove < moveDelay) {
            return enemy;
          }
          
          lastMoveTimeRef.current[enemy.id] = now;

          // Simple AI: move randomly with slight preference towards Dante
          const possibleDirections: Array<'up' | 'down' | 'left' | 'right'> = ['up', 'down', 'left', 'right'];
          const validMoves = possibleDirections.filter(dir => {
            const nextPos = getNextPosition(enemy.position, dir);
            return isValidPosition(nextPos);
          });

          if (validMoves.length === 0) return enemy;

          let chosenDirection: 'up' | 'down' | 'left' | 'right';
          
          if (enemy.isFleeing) {
            // Flee from Dante
            const awayFromDante = validMoves.reduce((best, dir) => {
              const pos = getNextPosition(enemy.position, dir);
              const currentDist = Math.abs(pos.x - prev.dantePosition.x) + Math.abs(pos.y - prev.dantePosition.y);
              const bestPos = getNextPosition(enemy.position, best);
              const bestDist = Math.abs(bestPos.x - prev.dantePosition.x) + Math.abs(bestPos.y - prev.dantePosition.y);
              return currentDist > bestDist ? dir : best;
            }, validMoves[0]);
            chosenDirection = Math.random() < 0.7 ? awayFromDante : validMoves[Math.floor(Math.random() * validMoves.length)];
          } else {
            // Chase Dante
            const towardsDante = validMoves.reduce((best, dir) => {
              const pos = getNextPosition(enemy.position, dir);
              const currentDist = Math.abs(pos.x - prev.dantePosition.x) + Math.abs(pos.y - prev.dantePosition.y);
              const bestPos = getNextPosition(enemy.position, best);
              const bestDist = Math.abs(bestPos.x - prev.dantePosition.x) + Math.abs(bestPos.y - prev.dantePosition.y);
              return currentDist < bestDist ? dir : best;
            }, validMoves[0]);
            chosenDirection = Math.random() < 0.6 ? towardsDante : validMoves[Math.floor(Math.random() * validMoves.length)];
          }

          return {
            ...enemy,
            position: getNextPosition(enemy.position, chosenDirection),
            direction: chosenDirection,
          };
        });

        return { ...prev, enemies: newEnemies };
      });
    };

    const interval = setInterval(moveEnemies, 50);
    return () => clearInterval(interval);
  }, [gameState.status]);

  const startGame = () => {
    setGameState(prev => ({ ...prev, status: 'playing' }));
  };

  const restartGame = () => {
    lastMoveTimeRef.current = {};
    lastDanteMoveRef.current = 0;
    currentDirectionRef.current = 'up';
    nextDirectionRef.current = null;
    setGameState(createInitialGameState());
    setGameState(prev => ({ ...prev, status: 'playing', highScore }));
  };

  const goToMainMenu = () => {
    lastMoveTimeRef.current = {};
    lastDanteMoveRef.current = 0;
    currentDirectionRef.current = 'up';
    nextDirectionRef.current = null;
    setGameState(prev => ({ ...createInitialGameState(), highScore }));
  };

  const togglePause = () => {
    setGameState(prev => ({
      ...prev,
      status: prev.status === 'playing' ? 'paused' : 'playing'
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-parchment/5 to-background">
      {gameState.status === 'start' && (
        <StartScreen onStart={startGame} highScore={highScore} />
      )}

      {(gameState.status === 'victory' || gameState.status === 'defeat') && (
        <GameOverScreen
          isVictory={gameState.status === 'victory'}
          score={gameState.score}
          highScore={highScore}
          onRestart={restartGame}
          onMainMenu={goToMainMenu}
        />
      )}

      {(gameState.status === 'playing' || gameState.status === 'paused') && (
        <div className="flex flex-col min-h-screen">
          <GameHUD
            score={gameState.score}
            lives={gameState.lives}
            isPoweredUp={gameState.isPoweredUp}
            powerUpTimeRemaining={gameState.powerUpTimeRemaining}
            level={gameState.level}
          />

          <div className="flex-1 flex flex-col items-center justify-center py-4">
            <GameCanvas
              dantePosition={gameState.dantePosition}
              enemies={gameState.enemies}
              dots={gameState.dots}
              powerUps={gameState.powerUps}
              isPoweredUp={gameState.isPoweredUp}
              danteDirection={gameState.danteDirection}
            />

            <div className="mt-4 flex gap-2">
              <Button
                onClick={togglePause}
                variant="outline"
                size="sm"
                className="font-serif"
                data-testid="button-pause"
              >
                {gameState.status === 'paused' ? (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Riprendi
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pausa
                  </>
                )}
              </Button>
              <Button
                onClick={goToMainMenu}
                variant="outline"
                size="sm"
                className="font-serif"
                data-testid="button-menu"
              >
                Menu
              </Button>
            </div>

            {gameState.status === 'paused' && (
              <div className="mt-4 text-center">
                <p className="text-2xl font-serif text-primary font-bold">PAUSA</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Premi P o clicca Riprendi per continuare
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
