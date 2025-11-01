import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GameHUDProps {
  score: number;
  lives: number;
  isPoweredUp: boolean;
  powerUpTimeRemaining: number;
  level: number;
}

export function GameHUD({ score, lives, isPoweredUp, powerUpTimeRemaining, level }: GameHUDProps) {
  const powerUpPercentage = isPoweredUp ? (powerUpTimeRemaining / 8000) * 100 : 0;
  
  return (
    <div className="w-full bg-card border-b-2 border-card-border p-3 md:p-4">
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-serif">Punteggio</span>
            <span className="text-2xl font-mono font-bold text-foreground" data-testid="text-score">
              {score.toString().padStart(6, '0')}
            </span>
          </div>
          
          <div className="h-10 w-px bg-border" />
          
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-serif">Livello</span>
            <span className="text-2xl font-mono font-bold text-foreground" data-testid="text-level">
              {level}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isPoweredUp && (
            <div className="flex flex-col items-center gap-1">
              <Badge variant="default" className="bg-laurel-gold text-foreground border-laurel-gold/50">
                <span className="text-xs font-serif">Corona d'Alloro</span>
              </Badge>
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden border border-border">
                <div 
                  className="h-full bg-laurel-gold transition-all duration-100"
                  style={{ width: `${powerUpPercentage}%` }}
                  data-testid="powerup-timer-bar"
                />
              </div>
            </div>
          )}
          
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground font-serif mb-1">Vite</span>
            <div className="flex gap-1" data-testid="lives-display">
              {Array.from({ length: lives }).map((_, i) => (
                <Heart 
                  key={i} 
                  className="w-6 h-6 fill-dante-red text-dante-red"
                  data-testid={`life-${i}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
