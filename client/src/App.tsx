import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { KeyboardControls } from "@react-three/drei";
import { Game } from "./components/Game";
import { GameUI } from "./components/GameUI";
import { SoundManager } from "./components/SoundManager";
import "@fontsource/inter";

// Define control keys for the game
enum Controls {
  forward = 'forward',
  back = 'back',
  left = 'left',
  right = 'right',
}

const controls = [
  { name: Controls.forward, keys: ["KeyW", "ArrowUp"] },
  { name: Controls.back, keys: ["KeyS", "ArrowDown"] },
  { name: Controls.left, keys: ["KeyA", "ArrowLeft"] },
  { name: Controls.right, keys: ["KeyD", "ArrowRight"] },
];

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <KeyboardControls map={controls}>
        <Canvas
          shadows
          camera={{
            position: [0, 10, 15],
            fov: 60,
            near: 0.1,
            far: 1000
          }}
          gl={{
            antialias: true,
            powerPreference: "default"
          }}
        >
          <Suspense fallback={null}>
            <Game />
          </Suspense>
        </Canvas>
        <GameUI />
        <SoundManager />
      </KeyboardControls>
    </div>
  );
}

export default App;
