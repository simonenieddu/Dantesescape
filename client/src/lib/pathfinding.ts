import * as THREE from "three";
import { getMazeWalls, createAABB, checkAABBCollision, type AABB } from "./collision";

interface PathNode {
  position: THREE.Vector3;
  g: number; // Cost from start
  h: number; // Heuristic to goal
  f: number; // Total cost
  parent: PathNode | null;
}

function heuristic(a: THREE.Vector3, b: THREE.Vector3): number {
  return a.distanceTo(b);
}

function getNeighbors(position: THREE.Vector3, stepSize: number = 2): THREE.Vector3[] {
  const neighbors: THREE.Vector3[] = [];
  const directions = [
    new THREE.Vector3(stepSize, 0, 0),
    new THREE.Vector3(-stepSize, 0, 0),
    new THREE.Vector3(0, 0, stepSize),
    new THREE.Vector3(0, 0, -stepSize),
    new THREE.Vector3(stepSize, 0, stepSize),
    new THREE.Vector3(stepSize, 0, -stepSize),
    new THREE.Vector3(-stepSize, 0, stepSize),
    new THREE.Vector3(-stepSize, 0, -stepSize),
  ];

  for (const dir of directions) {
    neighbors.push(position.clone().add(dir));
  }

  return neighbors;
}

function isPositionValid(position: THREE.Vector3, walls: AABB[], monsterSize: THREE.Vector3): boolean {
  const monsterAABB = createAABB(position, monsterSize);
  
  for (const wall of walls) {
    if (checkAABBCollision(monsterAABB, wall)) {
      return false;
    }
  }
  
  // Check bounds
  if (Math.abs(position.x) > 20 || Math.abs(position.z) > 20) {
    return false;
  }
  
  return true;
}

function vectorKey(v: THREE.Vector3): string {
  return `${Math.round(v.x)},${Math.round(v.z)}`;
}

export function findPath(
  start: THREE.Vector3,
  goal: THREE.Vector3,
  monsterSize: THREE.Vector3 = new THREE.Vector3(1.2, 1.5, 1.2),
  maxIterations: number = 200,
  levelWalls?: Array<{
    position: [number, number, number];
    rotation?: [number, number, number];
    length: number;
  }>
): THREE.Vector3[] {
  const walls = getMazeWalls(levelWalls);
  const openSet: PathNode[] = [];
  const closedSet = new Set<string>();
  
  const startNode: PathNode = {
    position: start.clone(),
    g: 0,
    h: heuristic(start, goal),
    f: heuristic(start, goal),
    parent: null
  };
  
  openSet.push(startNode);
  let iterations = 0;
  
  while (openSet.length > 0 && iterations < maxIterations) {
    iterations++;
    
    // Find node with lowest f score
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift()!;
    
    // Check if we reached the goal
    if (current.position.distanceTo(goal) < 2) {
      // Reconstruct path
      const path: THREE.Vector3[] = [];
      let node: PathNode | null = current;
      while (node) {
        path.unshift(node.position);
        node = node.parent;
      }
      return path;
    }
    
    closedSet.add(vectorKey(current.position));
    
    // Check neighbors
    const neighbors = getNeighbors(current.position);
    for (const neighborPos of neighbors) {
      const key = vectorKey(neighborPos);
      
      if (closedSet.has(key)) continue;
      if (!isPositionValid(neighborPos, walls, monsterSize)) continue;
      
      const g = current.g + current.position.distanceTo(neighborPos);
      const h = heuristic(neighborPos, goal);
      const f = g + h;
      
      // Check if this neighbor is already in open set
      const existingIndex = openSet.findIndex(n => vectorKey(n.position) === key);
      
      if (existingIndex >= 0) {
        if (g < openSet[existingIndex].g) {
          openSet[existingIndex].g = g;
          openSet[existingIndex].f = f;
          openSet[existingIndex].parent = current;
        }
      } else {
        openSet.push({
          position: neighborPos,
          g,
          h,
          f,
          parent: current
        });
      }
    }
  }
  
  // No path found, return direct line
  return [start, goal];
}
