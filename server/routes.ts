import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { highScoreSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get high scores
  app.get("/api/highscores", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const scores = await storage.getHighScores(limit);
      res.json(scores);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch high scores" });
    }
  });

  // Save high score
  app.post("/api/highscores", async (req, res) => {
    try {
      const validated = highScoreSchema.parse(req.body);
      const score = await storage.saveHighScore({
        score: validated.score,
        playerName: validated.playerName,
        date: new Date().toISOString(),
      });
      res.json(score);
    } catch (error) {
      res.status(400).json({ error: "Invalid high score data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
