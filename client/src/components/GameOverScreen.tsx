import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Skull } from "lucide-react";

interface GameOverScreenProps {
  isVictory: boolean;
  score: number;
  highScore: number;
  onRestart: () => void;
  onMainMenu: () => void;
}

export function GameOverScreen({ 
  isVictory, 
  score, 
  highScore, 
  onRestart, 
  onMainMenu 
}: GameOverScreenProps) {
  const isNewHighScore = score > highScore && score > 0;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4 z-50">
      <Card className="w-full max-w-md border-2 shadow-2xl animate-in fade-in zoom-in duration-300"
        style={{
          borderColor: isVictory ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'
        }}
      >
        <CardHeader className="text-center space-y-4 pb-4">
          <div className="flex justify-center">
            {isVictory ? (
              <Trophy className="w-16 h-16 text-laurel-gold animate-bounce" />
            ) : (
              <Skull className="w-16 h-16 text-destructive" />
            )}
          </div>
          <CardTitle className="text-4xl md:text-5xl font-serif font-bold"
            style={{
              color: isVictory ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'
            }}
          >
            {isVictory ? 'SALVATO!' : 'PERDUTO!'}
          </CardTitle>
          {isVictory && (
            <p className="text-lg text-muted-foreground italic font-serif">
              Hai completato il labirinto!
            </p>
          )}
          {!isVictory && (
            <p className="text-lg text-muted-foreground italic font-serif">
              Le fiere ti hanno catturato...
            </p>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6 p-6">
          <div className="bg-muted/30 p-6 rounded-md border border-border text-center space-y-3">
            <div>
              <p className="text-sm text-muted-foreground font-serif mb-1">
                Punteggio Finale
              </p>
              <p className="text-4xl font-mono font-bold text-foreground" data-testid="text-final-score">
                {score.toString().padStart(6, '0')}
              </p>
            </div>
            
            {isNewHighScore && (
              <div className="pt-2 border-t border-border">
                <Badge variant="default" className="bg-laurel-gold text-foreground text-sm px-3 py-1">
                  <Trophy className="w-3 h-3 mr-1" />
                  Nuovo Record!
                </Badge>
              </div>
            )}
            
            {!isNewHighScore && highScore > 0 && (
              <div className="pt-2 border-t border-border">
                <p className="text-sm text-muted-foreground font-serif">
                  Punteggio Migliore
                </p>
                <p className="text-2xl font-mono font-bold text-muted-foreground">
                  {highScore.toString().padStart(6, '0')}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={onRestart}
              size="lg"
              className="w-full text-lg font-serif"
              data-testid="button-restart"
            >
              RIPROVA
            </Button>
            <Button 
              onClick={onMainMenu}
              variant="outline"
              size="lg"
              className="w-full text-lg font-serif"
              data-testid="button-main-menu"
            >
              MENU PRINCIPALE
            </Button>
          </div>

          {isVictory ? (
            <p className="text-xs text-center text-muted-foreground italic font-serif">
              "E quindi uscimmo a riveder le stelle."
            </p>
          ) : (
            <p className="text-xs text-center text-muted-foreground italic font-serif">
              "Lasciate ogne speranza, voi ch'intrate."
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
