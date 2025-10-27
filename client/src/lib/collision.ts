import * as THREE from "three";

export interface AABB {
  min: THREE.Vector3;
  max: THREE.Vector3;
}

export function createAABB(position: THREE.Vector3, size: THREE.Vector3): AABB {
  return {
    min: new THREE.Vector3(
      position.x - size.x / 2,
      position.y - size.y / 2,
      position.z - size.z / 2
    ),
    max: new THREE.Vector3(
      position.x + size.x / 2,
      position.y + size.y / 2,
      position.z + size.z / 2
    )
  };
}

export function checkAABBCollision(a: AABB, b: AABB): boolean {
  return (
    a.min.x <= b.max.x &&
    a.max.x >= b.min.x &&
    a.min.y <= b.max.y &&
    a.max.y >= b.min.y &&
    a.min.z <= b.max.z &&
    a.max.z >= b.min.z
  );
}

// Define all maze walls as AABBs from level configuration
export function getMazeWalls(levelWalls?: Array<{
  position: [number, number, number];
  rotation?: [number, number, number];
  length: number;
}>): AABB[] {
  // Default to level 1 walls if not provided
  const defaultWalls = [
    { position: [0, 1.5, -20] as [number, number, number], rotation: [0, 0, 0] as [number, number, number], length: 40 },
    { position: [0, 1.5, 20] as [number, number, number], rotation: [0, 0, 0] as [number, number, number], length: 40 },
    { position: [-20, 1.5, 0] as [number, number, number], rotation: [0, Math.PI / 2, 0] as [number, number, number], length: 40 },
    { position: [20, 1.5, 0] as [number, number, number], rotation: [0, Math.PI / 2, 0] as [number, number, number], length: 40 },
    { position: [-10, 1.5, -15] as [number, number, number], rotation: [0, Math.PI / 2, 0] as [number, number, number], length: 10 },
    { position: [-10, 1.5, 5] as [number, number, number], rotation: [0, Math.PI / 2, 0] as [number, number, number], length: 20 },
    { position: [10, 1.5, -5] as [number, number, number], rotation: [0, Math.PI / 2, 0] as [number, number, number], length: 20 },
    { position: [0, 1.5, -10] as [number, number, number], rotation: [0, 0, 0] as [number, number, number], length: 15 },
    { position: [5, 1.5, 0] as [number, number, number], rotation: [0, 0, 0] as [number, number, number], length: 15 },
    { position: [-5, 1.5, 10] as [number, number, number], rotation: [0, 0, 0] as [number, number, number], length: 12 },
    { position: [15, 1.5, 10] as [number, number, number], rotation: [0, 0, 0] as [number, number, number], length: 10 },
    { position: [0, 1.5, 15] as [number, number, number], rotation: [0, Math.PI / 2, 0] as [number, number, number], length: 8 }
  ];
  
  const wallsConfig = levelWalls || defaultWalls;
  const walls: AABB[] = [];

  for (const wall of wallsConfig) {
    const isVertical = wall.rotation && Math.abs(wall.rotation[1]) > 0.1;
    const size = isVertical 
      ? new THREE.Vector3(0.5, 3, wall.length)
      : new THREE.Vector3(wall.length, 3, 0.5);
    
    walls.push(createAABB(new THREE.Vector3(...wall.position), size));
  }

  return walls;
}
