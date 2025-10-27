import { useState, useRef, useCallback, useEffect } from "react";
import * as THREE from "three";
import { Dante } from "./Dante";
import { Forest } from "./Forest";
import { Monsters } from "./Monsters";
import { Lighting } from "./Lighting";
import { Camera } from "./Camera";
import { useGame } from "@/lib/stores/useGame";
import { useFrame } from "@react-three/fiber";
import { getLevel } from "@/lib/levels";

export function Game() {
  const { win, lose, phase, currentLevel } = useGame();
  const level = getLevel(currentLevel);
  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3(...level.danteStart));
  const hasWonRef = useRef(false);
  const hasLostRef = useRef(false);
  
  // Reset player position when level changes
  useEffect(() => {
    setPlayerPosition(new THREE.Vector3(...level.danteStart));
  }, [currentLevel]);

  const handlePositionChange = useCallback((position: THREE.Vector3) => {
    setPlayerPosition(position.clone());
  }, []);

  const handleCatchPlayer = useCallback(() => {
    if (!hasLostRef.current && phase === "playing") {
      hasLostRef.current = true;
      lose();
    }
  }, [lose, phase]);
  
  const handleWin = useCallback(() => {
    if (!hasWonRef.current && phase === "playing") {
      hasWonRef.current = true;
      win();
    }
  }, [win, phase]);

  useFrame(() => {
    if (phase !== "playing") return;

    // Check if player reached the exit
    const exitPosition = new THREE.Vector3(...level.exitPosition);
    const distance = playerPosition.distanceTo(exitPosition);

    if (distance < 2) {
      handleWin();
    }
  });

  // Reset flags when game restarts
  if (phase === "ready") {
    hasWonRef.current = false;
    hasLostRef.current = false;
  }

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 5, 25]} />

      <Lighting targetPosition={playerPosition} />
      <Camera targetPosition={playerPosition} />

      <Forest />
      <Dante position={level.danteStart} onPositionChange={handlePositionChange} />
      
      {phase === "playing" && (
        <Monsters 
          playerPosition={playerPosition} 
          onCatchPlayer={handleCatchPlayer}
          monsterConfigs={level.monsterStarts.map((pos, i) => ({
            position: pos,
            speed: level.monsterSpeeds[i]
          }))}
        />
      )}
    </>
  );
}
