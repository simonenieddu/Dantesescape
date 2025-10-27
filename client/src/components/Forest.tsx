import { useMemo } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { useGame } from "@/lib/stores/useGame";
import { getLevel } from "@/lib/levels";

interface TreeProps {
  position: [number, number, number];
  scale?: number;
}

function Tree({ position, scale = 1 }: TreeProps) {
  const woodTexture = useTexture("/textures/wood.jpg");
  
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.3, 0.45, 3.5, 16]} />
        <meshStandardMaterial map={woodTexture} color="#3D2817" roughness={0.9} />
      </mesh>
      
      {/* Multiple layers of foliage for volume */}
      {/* Bottom layer */}
      <mesh castShadow receiveShadow position={[0, 2.8, 0]}>
        <coneGeometry args={[1.8, 2, 12]} />
        <meshStandardMaterial color="#1a4d1a" roughness={0.8} />
      </mesh>
      
      {/* Middle layer */}
      <mesh castShadow receiveShadow position={[0, 3.8, 0]}>
        <coneGeometry args={[1.4, 1.8, 12]} />
        <meshStandardMaterial color="#1e5a1e" roughness={0.8} />
      </mesh>
      
      {/* Top layer */}
      <mesh castShadow receiveShadow position={[0, 4.8, 0]}>
        <coneGeometry args={[1, 1.5, 12]} />
        <meshStandardMaterial color="#226622" roughness={0.8} />
      </mesh>
    </group>
  );
}

interface WallProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  length: number;
}

function Wall({ position, rotation = [0, 0, 0], length }: WallProps) {
  const grassTexture = useTexture("/textures/grass.png");
  
  // Configure texture for hedge appearance
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(length / 2, 1.5);
  
  return (
    <group position={position} rotation={rotation}>
      {/* Main hedge body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[length, 3, 0.8]} />
        <meshStandardMaterial 
          map={grassTexture}
          color="#2d5016"
          roughness={0.85}
        />
      </mesh>
      
      {/* Top rounded part for hedge effect */}
      <mesh castShadow receiveShadow position={[0, 1.3, 0]}>
        <boxGeometry args={[length, 0.6, 0.6]} />
        <meshStandardMaterial 
          color="#3a6b20"
          roughness={0.9}
        />
      </mesh>
      
      {/* Add some depth variations */}
      <mesh castShadow receiveShadow position={[0, -0.5, 0]}>
        <boxGeometry args={[length, 1, 1]} />
        <meshStandardMaterial 
          color="#234010"
          roughness={0.95}
        />
      </mesh>
    </group>
  );
}

export function Forest() {
  const { currentLevel } = useGame();
  const level = getLevel(currentLevel);
  const grassTexture = useTexture("/textures/grass.png");
  
  // Configure texture repeat for natural look
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(50, 50);

  // Pre-calculate tree positions and scales to avoid using Math.random in render
  const treeData = useMemo(() => {
    const data: { position: [number, number, number]; scale: number }[] = [];
    const gridSize = 60;
    const spacing = 6;
    
    // Create a dense forest around the maze
    for (let x = -gridSize; x <= gridSize; x += spacing) {
      for (let z = -gridSize; z <= gridSize; z += spacing) {
        // Skip the center area where the maze is
        if (Math.abs(x) > 15 || Math.abs(z) > 15) {
          // Add some randomness to tree positions and sizes
          const offsetX = (Math.random() - 0.5) * 3;
          const offsetZ = (Math.random() - 0.5) * 3;
          const scale = 0.8 + Math.random() * 0.6; // Random scale between 0.8 and 1.4
          data.push({
            position: [x + offsetX, 0, z + offsetZ],
            scale
          });
        }
      }
    }
    
    return data;
  }, []);

  return (
    <group>
      {/* Ground - Forest floor with grass and dirt */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial 
          map={grassTexture}
          color="#3a5a2a"
          roughness={0.9}
        />
      </mesh>

      {/* Trees */}
      {treeData.map((tree, i) => (
        <Tree key={`tree-${i}`} position={tree.position} scale={tree.scale} />
      ))}

      {/* Maze walls from current level */}
      {level.walls.map((wall, i) => (
        <Wall key={`wall-${i}`} {...wall} />
      ))}

      {/* Exit point - glowing green box */}
      <mesh position={level.exitPosition} castShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Exit light */}
      <pointLight position={[level.exitPosition[0], level.exitPosition[1] + 2, level.exitPosition[2]]} color="#00ff00" intensity={2} distance={10} />
    </group>
  );
}
