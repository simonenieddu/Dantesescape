import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useGame } from "@/lib/stores/useGame";
import { getMazeWalls, createAABB, checkAABBCollision } from "@/lib/collision";
import { getLevel } from "@/lib/levels";

enum Controls {
  forward = 'forward',
  back = 'back',
  left = 'left',
  right = 'right',
}

interface DanteProps {
  position: [number, number, number];
  onPositionChange?: (position: THREE.Vector3) => void;
}

export function Dante({ position: initialPosition, onPositionChange }: DanteProps) {
  const groupRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Group>(null);
  const velocityRef = useRef(new THREE.Vector3());
  const animationTimeRef = useRef(0);
  const { phase, currentLevel } = useGame();
  const [, getControls] = useKeyboardControls<Controls>();
  const level = getLevel(currentLevel);
  const mazeWallsRef = useRef(getMazeWalls(level.walls));
  const { scene } = useGLTF("/models/dante.glb");
  
  // Update walls when level changes
  useEffect(() => {
    mazeWallsRef.current = getMazeWalls(level.walls);
  }, [currentLevel]);
  
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(...initialPosition);
    }
  }, [initialPosition]);

  useFrame((state, delta) => {
    if (!groupRef.current || phase !== "playing") return;

    const controls = getControls();
    const speed = 5;
    const velocity = velocityRef.current;

    // Reset velocity
    velocity.set(0, 0, 0);

    // Handle movement - WASD controls
    if (controls.forward) {
      velocity.z -= speed * delta;
      console.log("Moving forward");
    }
    if (controls.back) {
      velocity.z += speed * delta;
      console.log("Moving back");
    }
    if (controls.left) {
      velocity.x -= speed * delta;
      console.log("Moving left");
    }
    if (controls.right) {
      velocity.x += speed * delta;
      console.log("Moving right");
    }

    // Calculate new position
    const newPosition = groupRef.current.position.clone().add(velocity);
    
    // Create AABB for Dante at new position
    const danteSize = new THREE.Vector3(0.8, 1.8, 0.8);
    const danteAABB = createAABB(newPosition, danteSize);
    
    // Check collision with all maze walls
    let hasCollision = false;
    for (const wall of mazeWallsRef.current) {
      if (checkAABBCollision(danteAABB, wall)) {
        hasCollision = true;
        break;
      }
    }
    
    // Only apply movement if no collision
    if (!hasCollision) {
      groupRef.current.position.copy(newPosition);
    }

    // Rotate model to face movement direction (only yaw rotation around Y axis)
    const isMoving = velocity.length() > 0.01;
    if (isMoving) {
      const yaw = Math.atan2(velocity.x, velocity.z);
      // Add offset to compensate for model's default orientation (270 degrees)
      groupRef.current.rotation.y = yaw + (3 * Math.PI / 2);
    }

    // Running animation
    if (modelRef.current) {
      if (isMoving) {
        // Update animation timer when moving
        animationTimeRef.current += delta * 8; // Speed of animation
        
        // Bobbing effect (up and down movement)
        const bobAmount = Math.sin(animationTimeRef.current) * 0.15;
        modelRef.current.position.y = bobAmount;
        
        // Slight side-to-side tilt while running
        const tiltAmount = Math.sin(animationTimeRef.current) * 0.1;
        modelRef.current.rotation.z = tiltAmount;
      } else {
        // Smoothly return to neutral position when not moving
        modelRef.current.position.y *= 0.9;
        modelRef.current.rotation.z *= 0.9;
      }
    }

    // Notify position change
    if (onPositionChange) {
      onPositionChange(groupRef.current.position);
    }
  });

  return (
    <group ref={groupRef} castShadow receiveShadow>
      <group ref={modelRef}>
        <primitive object={scene.clone()} scale={2.5} />
      </group>
    </group>
  );
}

useGLTF.preload("/models/dante.glb");
