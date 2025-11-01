import { z } from "zod";

// Game Types
export interface Position {
  x: number;
  y: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';
export type EnemyType = 'wolf' | 'lion' | 'leopard';
export type GameStatus = 'start' | 'playing' | 'paused' | 'victory' | 'defeat';

export interface Enemy {
  id: string;
  type: EnemyType;
  position: Position;
  direction: Direction;
  isFleeing: boolean;
}

export interface GameState {
  status: GameStatus;
  score: number;
  lives: number;
  level: number;
  dantePosition: Position;
  danteDirection: Direction;
  enemies: Enemy[];
  dots: Position[];
  powerUps: Position[];
  isPoweredUp: boolean;
  powerUpTimeRemaining: number;
  highScore: number;
}

// High Score Schema
export const highScoreSchema = z.object({
  id: z.string().optional(),
  score: z.number(),
  playerName: z.string().optional(),
  date: z.string(),
});

export type HighScore = z.infer<typeof highScoreSchema>;
export type InsertHighScore = Omit<HighScore, 'id'>;

// Maze Configuration
export const MAZE_WIDTH = 19;
export const MAZE_HEIGHT = 21;
export const CELL_SIZE = 24;
export const POWER_UP_DURATION = 8000; // 8 seconds
export const ENEMY_SCARED_POINTS = 200;
export const DOT_POINTS = 10;
export const POWER_UP_POINTS = 50;

// Maze layout (0 = wall, 1 = path, 2 = power-up spawn)
export const MAZE_LAYOUT = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0],
  [0,1,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,1,0],
  [0,2,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,2,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,0,0,1,0,1,0,0,0,0,0,1,0,1,0,0,1,0],
  [0,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,0],
  [0,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,0],
  [1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1],
  [0,0,0,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,0],
  [0,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,0],
  [0,0,0,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,0],
  [1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1],
  [0,0,0,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0],
  [0,1,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,1,0],
  [0,2,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,2,0],
  [0,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,1,0,0],
  [0,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,0],
  [0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];
