import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface StartScreenProps {
  onStart: () => void;
  highScore: number;
}

export function StartScreen({ onStart, highScore }: StartScreenProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-background via-parchment/10 to-background p-4">
      <Card className="w-full max-w-2xl border-2 border-primary/20 shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-4">
          <div className="flex justify-center">
            <Sparkles className="w-12 h-12 text-laurel-gold" />
          </div>
          <CardTitle className="text-4xl md:text-6xl font-serif font-bold text-primary tracking-wide">
            IL LABIRINTO<br />DI DANTE
          </CardTitle>
          <p className="text-lg md:text-xl text-muted-foreground italic">
            Fuggi dalle Fiere
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6 p-6">
          <div className="bg-muted/30 p-6 rounded-md border border-border">
            <h3 className="font-serif text-xl mb-4 text-center text-foreground">
              Come Giocare
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-dante-red rounded-full border-2 border-foreground flex items-center justify-center text-xs font-bold text-white">
                    D
                  </div>
                  <span className="text-foreground">Dante (Tu)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-dot-golden rounded-full border-2 border-foreground/30"></div>
                  <span className="text-foreground">Puntini da raccogliere</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-laurel-gold rounded-full border-2 border-foreground flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-foreground" />
                  </div>
                  <span className="text-foreground">Corona d'Alloro</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-wolf-gray rounded-full border-2 border-foreground flex items-center justify-center text-xs font-bold text-white">
                    W
                  </div>
                  <span className="text-foreground">Il Lupo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-lion-gold rounded-full border-2 border-foreground flex items-center justify-center text-xs font-bold text-white">
                    L
                  </div>
                  <span className="text-foreground">Il Leone</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-leopard-tan rounded-full border-2 border-foreground flex items-center justify-center text-xs font-bold text-white">
                    P
                  </div>
                  <span className="text-foreground">Il Leopardo</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-accent/30 p-4 rounded-md border border-accent-border">
            <h4 className="font-serif font-semibold mb-2 text-center text-foreground">
              Controlli
            </h4>
            <div className="flex justify-center gap-4 text-sm text-foreground">
              <div className="text-center">
                <kbd className="px-3 py-1 bg-card border border-card-border rounded-md font-mono text-xs">↑ ↓ ← →</kbd>
                <p className="mt-1 text-xs text-muted-foreground">Frecce</p>
              </div>
              <div className="text-center">
                <kbd className="px-3 py-1 bg-card border border-card-border rounded-md font-mono text-xs">W A S D</kbd>
                <p className="mt-1 text-xs text-muted-foreground">Tasti</p>
              </div>
              <div className="text-center">
                <kbd className="px-3 py-1 bg-card border border-card-border rounded-md font-mono text-xs">P</kbd>
                <p className="mt-1 text-xs text-muted-foreground">Pausa</p>
              </div>
            </div>
          </div>

          <div className="text-center space-y-3">
            {highScore > 0 && (
              <div className="text-lg font-serif text-muted-foreground">
                Punteggio Migliore: <span className="text-primary font-bold">{highScore}</span>
              </div>
            )}
            
            <Button 
              onClick={onStart}
              size="lg"
              className="w-full md:w-auto px-12 text-lg font-serif"
              data-testid="button-start-game"
            >
              INIZIA PARTITA
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground italic">
            "Nel mezzo del cammin di nostra vita<br />
            mi ritrovai per una selva oscura..."
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
