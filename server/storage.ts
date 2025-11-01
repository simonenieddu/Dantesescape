import { type HighScore, type InsertHighScore } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getHighScores(limit?: number): Promise<HighScore[]>;
  saveHighScore(score: InsertHighScore): Promise<HighScore>;
}

export class MemStorage implements IStorage {
  private highScores: Map<string, HighScore>;

  constructor() {
    this.highScores = new Map();
  }

  async getHighScores(limit: number = 10): Promise<HighScore[]> {
    const scores = Array.from(this.highScores.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    return scores;
  }

  async saveHighScore(insertScore: InsertHighScore): Promise<HighScore> {
    const id = randomUUID();
    const score: HighScore = { ...insertScore, id };
    this.highScores.set(id, score);
    return score;
  }
}

export const storage = new MemStorage();
