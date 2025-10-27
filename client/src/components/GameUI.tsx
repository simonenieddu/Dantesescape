import { useGame } from "@/lib/stores/useGame";
import { useAudio } from "@/lib/stores/useAudio";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

export function GameUI() {
  const { phase, start, restart, retryLevel, startTime, endTime, currentLevel, nextLevel } = useGame();
  const { isMuted, toggleMute, playSuccess, playHit } = useAudio();

  const getElapsedTime = () => {
    if (phase === "ready") return 0;
    const end = endTime || Date.now();
    return Math.floor((end - startTime) / 1000);
  };

  // Menu screen
  if (phase === "ready") {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-10 p-4">
        <div className="bg-gray-900 p-4 sm:p-6 md:p-8 rounded-lg shadow-2xl border-2 border-red-900 max-w-md w-full text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 mb-3 sm:mb-4">La Selva Oscura</h1>
          <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base md:text-lg leading-relaxed">
            Nel mezzo del cammin di nostra vita<br />
            mi ritrovai per una selva oscura...
          </p>
          <div className="bg-gray-800 p-3 sm:p-4 rounded mb-4 sm:mb-6 text-left">
            <p className="text-gray-200 text-xs sm:text-sm mb-2">
              <span className="font-bold text-yellow-400">Obiettivo:</span> Raggiungi l'uscita verde
            </p>
            <p className="text-gray-200 text-xs sm:text-sm mb-2">
              <span className="font-bold text-yellow-400">Controlli:</span> WASD per muoverti
            </p>
            <p className="text-gray-200 text-xs sm:text-sm">
              <span className="font-bold text-red-400">Attenzione:</span> Tre bestie ti inseguono!
            </p>
          </div>
          <Button 
            onClick={start}
            className="bg-red-700 hover:bg-red-800 text-white text-base sm:text-lg md:text-xl px-6 py-4 sm:px-8 sm:py-6 w-full sm:w-auto"
          >
            Inizia
          </Button>
        </div>
      </div>
    );
  }

  // Playing HUD
  if (phase === "playing") {
    return (
      <>
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
          <div className="bg-black bg-opacity-70 p-2 sm:p-3 md:p-4 rounded-lg border border-yellow-600">
            <p className="text-yellow-400 font-bold text-sm sm:text-base md:text-lg">
              Livello {currentLevel}
            </p>
            <p className="text-gray-300 font-bold text-xs sm:text-sm md:text-md mt-1">
              Tempo: {getElapsedTime()}s
            </p>
            <p className="text-gray-300 text-xs sm:text-sm mt-1 hidden sm:block">
              Trova l'uscita verde!
            </p>
          </div>
        </div>
        
        {/* Sound toggle button */}
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10">
          <Button
            onClick={toggleMute}
            variant="outline"
            size="icon"
            className="bg-black bg-opacity-70 border-yellow-600 hover:bg-opacity-90 h-8 w-8 sm:h-10 sm:w-10"
          >
            {isMuted ? <VolumeX className="text-yellow-400 h-4 w-4 sm:h-5 sm:w-5" /> : <Volume2 className="text-yellow-400 h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>
        </div>
      </>
    );
  }

  // Victory screen
  if (phase === "won") {
    const hasMoreLevels = currentLevel < 3;
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-10 p-4">
        <div className="bg-gray-900 p-4 sm:p-6 md:p-8 rounded-lg shadow-2xl border-2 border-green-600 max-w-md w-full text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-500 mb-3 sm:mb-4">Salvezza!</h1>
          <p className="text-gray-300 mb-2 text-sm sm:text-base md:text-lg">
            Livello {currentLevel} completato!
          </p>
          <p className="text-yellow-400 text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6">
            Tempo: {getElapsedTime()} secondi
          </p>
          <div className="flex flex-col gap-2 sm:gap-3">
            {hasMoreLevels && (
              <Button 
                onClick={nextLevel}
                className="bg-green-700 hover:bg-green-800 text-white text-base sm:text-lg md:text-xl px-6 py-4 sm:px-8 sm:py-6 w-full"
              >
                Livello Successivo
              </Button>
            )}
            <Button 
              onClick={restart}
              variant="outline"
              className="bg-gray-800 hover:bg-gray-700 text-white text-sm sm:text-base md:text-lg px-6 py-3 sm:px-8 sm:py-4 border-green-600 w-full"
            >
              Ricomincia dal Livello 1
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Defeat screen
  if (phase === "lost") {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-10 p-4">
        <div className="bg-gray-900 p-4 sm:p-6 md:p-8 rounded-lg shadow-2xl border-2 border-red-600 max-w-md w-full text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 mb-3 sm:mb-4">Catturato!</h1>
          <p className="text-gray-300 mb-2 text-sm sm:text-base md:text-lg">
            Le bestie ti hanno raggiunto...
          </p>
          <p className="text-yellow-400 text-sm sm:text-base md:text-md mb-2">
            Livello {currentLevel}
          </p>
          <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">
            Sei sopravvissuto {getElapsedTime()} secondi
          </p>
          <div className="flex flex-col gap-2 sm:gap-3">
            <Button 
              onClick={retryLevel}
              className="bg-red-700 hover:bg-red-800 text-white text-base sm:text-lg md:text-xl px-6 py-4 sm:px-8 sm:py-6 w-full"
            >
              Riprova Livello {currentLevel}
            </Button>
            <Button 
              onClick={restart}
              variant="outline"
              className="bg-gray-800 hover:bg-gray-700 text-white text-sm sm:text-base md:text-lg px-6 py-3 sm:px-8 sm:py-4 border-red-600 w-full"
            >
              Ricomincia dal Livello 1
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
