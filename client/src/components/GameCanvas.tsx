import { useEffect, useRef } from 'react';
import { Position, Enemy, MAZE_LAYOUT, CELL_SIZE } from '@shared/schema';

interface GameCanvasProps {
  dantePosition: Position;
  enemies: Enemy[];
  dots: Position[];
  powerUps: Position[];
  isPoweredUp: boolean;
  danteDirection: 'up' | 'down' | 'left' | 'right';
}

export function GameCanvas({ 
  dantePosition, 
  enemies, 
  dots, 
  powerUps, 
  isPoweredUp,
  danteDirection 
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const animationPhaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      animationPhaseRef.current += 0.1;
      drawGame(ctx);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dantePosition, enemies, dots, powerUps, isPoweredUp, danteDirection]);

  const drawGame = (ctx: CanvasRenderingContext2D) => {
    const width = MAZE_LAYOUT[0].length * CELL_SIZE;
    const height = MAZE_LAYOUT.length * CELL_SIZE;

    ctx.clearRect(0, 0, width, height);

    // Draw maze background
    ctx.fillStyle = '#1C1917';
    ctx.fillRect(0, 0, width, height);

    // Draw maze walls
    MAZE_LAYOUT.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 0) {
          // Wall
          ctx.fillStyle = '#78716C';
          ctx.strokeStyle = '#57534E';
          ctx.lineWidth = 1;
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      });
    });

    // Draw dots
    dots.forEach(dot => {
      const centerX = dot.x * CELL_SIZE + CELL_SIZE / 2;
      const centerY = dot.y * CELL_SIZE + CELL_SIZE / 2;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#F59E0B';
      ctx.fill();
    });

    // Draw power-ups with pulsing animation
    powerUps.forEach(powerUp => {
      const centerX = powerUp.x * CELL_SIZE + CELL_SIZE / 2;
      const centerY = powerUp.y * CELL_SIZE + CELL_SIZE / 2;
      const pulse = Math.sin(animationPhaseRef.current) * 2 + 8;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulse, 0, Math.PI * 2);
      ctx.fillStyle = '#FCD34D';
      ctx.fill();
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw laurel cross symbol
      ctx.font = 'bold 16px serif';
      ctx.fillStyle = '#78716C';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✦', centerX, centerY);
    });

    // Draw enemies
    enemies.forEach(enemy => {
      const centerX = enemy.position.x * CELL_SIZE + CELL_SIZE / 2;
      const centerY = enemy.position.y * CELL_SIZE + CELL_SIZE / 2;
      
      // Enemy body
      ctx.beginPath();
      ctx.arc(centerX, centerY, CELL_SIZE / 2 - 2, 0, Math.PI * 2);
      
      if (enemy.isFleeing) {
        ctx.fillStyle = '#3B82F6';
      } else {
        switch (enemy.type) {
          case 'wolf':
            ctx.fillStyle = '#6B7280';
            break;
          case 'lion':
            ctx.fillStyle = '#D97706';
            break;
          case 'leopard':
            ctx.fillStyle = '#92400E';
            break;
        }
      }
      ctx.fill();
      ctx.strokeStyle = '#1C1917';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Enemy icon (letter identifier)
      ctx.font = 'bold 14px serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const icon = enemy.isFleeing ? '!' : 
                   enemy.type === 'wolf' ? 'W' : 
                   enemy.type === 'lion' ? 'L' : 'P';
      ctx.fillText(icon, centerX, centerY);
    });

    // Draw Dante with glow when powered up
    const danteCenterX = dantePosition.x * CELL_SIZE + CELL_SIZE / 2;
    const danteCenterY = dantePosition.y * CELL_SIZE + CELL_SIZE / 2;
    
    if (isPoweredUp) {
      const glowPulse = Math.sin(animationPhaseRef.current * 2) * 3 + 15;
      ctx.beginPath();
      ctx.arc(danteCenterX, danteCenterY, glowPulse, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(
        danteCenterX, danteCenterY, 0,
        danteCenterX, danteCenterY, glowPulse
      );
      gradient.addColorStop(0, 'rgba(252, 211, 77, 0.4)');
      gradient.addColorStop(1, 'rgba(252, 211, 77, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();
    }
    
    // Dante body
    ctx.beginPath();
    ctx.arc(danteCenterX, danteCenterY, CELL_SIZE / 2 - 1, 0, Math.PI * 2);
    ctx.fillStyle = '#B91C1C';
    ctx.fill();
    ctx.strokeStyle = '#7F1D1D';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Dante icon
    ctx.font = 'bold 16px serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('D', danteCenterX, danteCenterY);
  };

  const width = MAZE_LAYOUT[0].length * CELL_SIZE;
  const height = MAZE_LAYOUT.length * CELL_SIZE;

  return (
    <div className="flex justify-center p-4">
      <div className="relative border-4 border-maze-stone rounded-md shadow-2xl bg-background overflow-hidden">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="block"
          data-testid="game-canvas"
          style={{
            imageRendering: 'crisp-edges',
          }}
        />
      </div>
    </div>
  );
}
