import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface CameraProps {
  targetPosition: THREE.Vector3;
}

export function Camera({ targetPosition }: CameraProps) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3());

  useFrame(() => {
    // Camera follows player from behind and above
    const offset = new THREE.Vector3(0, 8, 10);
    const idealPosition = new THREE.Vector3().copy(targetPosition).add(offset);

    // Smooth camera movement
    camera.position.lerp(idealPosition, 0.1);

    // Look at the player
    targetRef.current.lerp(targetPosition, 0.1);
    camera.lookAt(targetRef.current);
  });

  return null;
}
