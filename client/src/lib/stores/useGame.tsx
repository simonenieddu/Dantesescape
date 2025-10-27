import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "ready" | "playing" | "won" | "lost";

interface GameState {
  phase: GamePhase;
  startTime: number;
  endTime: number;
  currentLevel: number;
  
  // Actions
  start: () => void;
  restart: () => void;
  retryLevel: () => void;
  win: () => void;
  lose: () => void;
  nextLevel: () => void;
}

export const useGame = create<GameState>()(
  subscribeWithSelector((set) => ({
    phase: "ready",
    startTime: 0,
    endTime: 0,
    currentLevel: 1,
    
    start: () => {
      set((state) => {
        if (state.phase === "ready") {
          return { phase: "playing", startTime: Date.now(), endTime: 0 };
        }
        return {};
      });
    },
    
    restart: () => {
      set(() => ({ phase: "ready", startTime: 0, endTime: 0, currentLevel: 1 }));
    },
    
    retryLevel: () => {
      set(() => ({ phase: "ready", startTime: 0, endTime: 0 }));
    },
    
    win: () => {
      set((state) => {
        if (state.phase === "playing") {
          return { phase: "won", endTime: Date.now() };
        }
        return {};
      });
    },
    
    lose: () => {
      set((state) => {
        if (state.phase === "playing") {
          return { phase: "lost", endTime: Date.now() };
        }
        return {};
      });
    },
    
    nextLevel: () => {
      set((state) => ({ 
        currentLevel: state.currentLevel + 1, 
        phase: "ready",
        startTime: 0,
        endTime: 0
      }));
    }
  }))
);
