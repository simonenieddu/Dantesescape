import { useEffect } from "react";
import { useAudio } from "@/lib/stores/useAudio";
import { useGame } from "@/lib/stores/useGame";

export function SoundManager() {
  const { setBackgroundMusic, setHitSound, setSuccessSound, isMuted } = useAudio();
  const { phase } = useGame();

  useEffect(() => {
    // Initialize background music
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    setBackgroundMusic(bgMusic);

    // Initialize hit sound (when monster catches player)
    const hitSnd = new Audio("/sounds/hit.mp3");
    hitSnd.volume = 0.5;
    setHitSound(hitSnd);

    // Initialize success sound (when player wins)
    const successSnd = new Audio("/sounds/success.mp3");
    successSnd.volume = 0.6;
    setSuccessSound(successSnd);

    return () => {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    };
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  // Control background music based on game phase
  useEffect(() => {
    const bgMusic = document.querySelector('audio[src="/sounds/background.mp3"]') as HTMLAudioElement;
    
    if (!bgMusic) return;

    if (phase === "playing" && !isMuted) {
      bgMusic.play().catch((e) => console.log("Background music blocked:", e));
    } else {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    }
  }, [phase, isMuted]);

  return null;
}
