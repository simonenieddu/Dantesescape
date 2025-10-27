import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useGame } from "@/lib/stores/useGame";
import { findPath } from "@/lib/pathfinding";
import { getLevel } from "@/lib/levels";

interface MonsterProps {
  initialPosition: [number, number, number];
  modelPath: string;
  name: string;
  speed: number;
  targetPosition: THREE.Vector3;
  onCatchPlayer?: () => void;
}

function Monster({ initialPosition, modelPath, name, speed, targetPosition, onCatchPlayer }: MonsterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { phase, currentLevel } = useGame();
  const level = getLevel(currentLevel);
  const [path, setPath] = useState<THREE.Vector3[]>([]);
  const currentTargetIndexRef = useRef(0);
  const pathUpdateTimerRef = useRef(0);
  const { scene } = useGLTF(modelPath);

  // Update path periodically
  useEffect(() => {
    if (phase === "playing" && groupRef.current) {
      const newPath = findPath(
        groupRef.current.position.clone(),
        targetPosition.clone(),
        new THREE.Vector3(1.2, 1.5, 1.2),
        200,
        level.walls
      );
      setPath(newPath);
      currentTargetIndexRef.current = 0;
    }
  }, [phase, currentLevel]);

  useFrame((state, delta) => {
    if (!groupRef.current || phase !== "playing") return;

    // Update path every 2 seconds
    pathUpdateTimerRef.current += delta;
    if (pathUpdateTimerRef.current > 2) {
      pathUpdateTimerRef.current = 0;
      const newPath = findPath(
        groupRef.current.position.clone(),
        targetPosition.clone(),
        new THREE.Vector3(1.2, 1.5, 1.2),
        200,
        level.walls
      );
      setPath(newPath);
      currentTargetIndexRef.current = 0;
    }

    const distanceToPlayer = groupRef.current.position.distanceTo(targetPosition);

    // Check if caught the player
    if (distanceToPlayer < 1.5) {
      console.log(`${name} caught the player!`);
      if (onCatchPlayer) {
        onCatchPlayer();
      }
      return;
    }

    // Follow path if available
    if (path.length > 0) {
      const currentTarget = path[currentTargetIndexRef.current] || targetPosition;
      const direction = new THREE.Vector3();
      direction.subVectors(currentTarget, groupRef.current.position);
      const distance = direction.length();

      // If close to current waypoint, move to next one
      if (distance < 1) {
        currentTargetIndexRef.current = Math.min(currentTargetIndexRef.current + 1, path.length - 1);
      }

      // Move towards current waypoint
      if (distance > 0.1) {
        direction.normalize();
        groupRef.current.position.add(direction.multiplyScalar(speed * delta));
      }

      // Make the monster face the direction it's moving
      if (direction.length() > 0) {
        groupRef.current.lookAt(currentTarget);
      }
    }
  });

  return (
    <group ref={groupRef} position={initialPosition} castShadow receiveShadow>
      <primitive object={scene.clone()} scale={2.5} />
    </group>
  );
}

interface MonstersProps {
  playerPosition: THREE.Vector3;
  onCatchPlayer: () => void;
  monsterConfigs: Array<{
    position: [number, number, number];
    speed: number;
  }>;
}

export function Monsters({ playerPosition, onCatchPlayer, monsterConfigs }: MonstersProps) {
  const monsterData = [
    { modelPath: "/models/lupo.glb", name: "Lupo" },
    { modelPath: "/models/leone.glb", name: "Leone" },
    { modelPath: "/models/leopardo.glb", name: "Leopardo" }
  ];

  return (
    <group>
      {monsterConfigs.map((config, i) => (
        <Monster
          key={`monster-${i}`}
          initialPosition={config.position}
          modelPath={monsterData[i]?.modelPath || "/models/lupo.glb"}
          name={monsterData[i]?.name || `Monster ${i + 1}`}
          speed={config.speed}
          targetPosition={playerPosition}
          onCatchPlayer={onCatchPlayer}
        />
      ))}
    </group>
  );
}

useGLTF.preload("/models/lupo.glb");
useGLTF.preload("/models/leone.glb");
useGLTF.preload("/models/leopardo.glb");
