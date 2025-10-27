import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface LightingProps {
  targetPosition: THREE.Vector3;
}

export function Lighting({ targetPosition }: LightingProps) {
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef<THREE.Object3D>(null);

  useFrame(() => {
    if (spotLightRef.current && targetRef.current) {
      // Make the spotlight follow the player
      spotLightRef.current.position.set(
        targetPosition.x,
        targetPosition.y + 10,
        targetPosition.z
      );
      targetRef.current.position.copy(targetPosition);
    }
  });

  return (
    <>
      {/* Ambient light - bright for better visibility */}
      <ambientLight intensity={1.2} />

      {/* Spotlight that follows Dante - this creates the circle of light */}
      <spotLight
        ref={spotLightRef}
        intensity={80}
        angle={0.5}
        penumbra={0.3}
        distance={30}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        color="#ffffff"
      >
        <primitive object={new THREE.Object3D()} ref={targetRef} />
      </spotLight>

      {/* Directional light for visibility */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />
      
      {/* Additional fill light */}
      <directionalLight
        position={[-5, 8, -5]}
        intensity={1.0}
      />
    </>
  );
}
