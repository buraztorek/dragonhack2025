"use client";

import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
// Import the hook and store action
import { useWebSocketTelemetry, useTelemetryStore } from '../hooks/useWebSocketTelemetry';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
// Import Physics and Debug
import { Physics } from '@react-three/rapier';

const Skateboard = dynamic(() => import('@/components/skateboard'), { ssr: false });

export default function Home() {
  const { sendMessage } = useWebSocketTelemetry("ws://localhost:8000/ws/viewer");
  // Get the reset trigger function from the store
  const triggerReset = useTelemetryStore((state) => state.triggerReset);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleSendMessage = (trick: string) => {
    if (activeButton === trick) {
      sendMessage({ type: "stop" });
      setActiveButton(null);
    } else {
      sendMessage({ type: trick });
      setActiveButton(trick);
    }
  };

  const handleResetPosition = () => {
    console.log("Resetting position...");
    triggerReset(); // Call the reset function from the store
  };

  return (
    <>
      <div style={{ width: '100vw', height: '100vh', background: '#111', position: 'relative' }}>
        <Canvas camera={{ position: [5, 3, 5], fov: 60 }} shadows>
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          {/* <Physics gravity={[0, -9.81, 0]}> */}
            <Skateboard />
          {/* </Physics> */}

          <OrbitControls />
          <Environment preset="sunset" />
        </Canvas>

        {/* --- UI Buttons --- */}
         {/* Reset Button */}
         <Button
          onClick={handleResetPosition}
          style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}
        >
          Reset Position
        </Button>

        {/* Trick Buttons */}
        <Button
          onClick={() => handleSendMessage("ollie")}
          disabled={activeButton !== null && activeButton !== "ollie"}
          style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}
        >
          Ollie
        </Button>
        <Button
          onClick={() => handleSendMessage("kickflip")}
          disabled={activeButton !== null && activeButton !== "kickflip"}
          style={{ position: 'absolute', top: '50px', right: '10px', zIndex: 10 }}
        >
          Kickflip
        </Button>
        <Button
          onClick={() => handleSendMessage("shuvit")}
          disabled={activeButton !== null && activeButton !== "shuvit"}
          style={{ position: 'absolute', top: '90px', right: '10px', zIndex: 10 }}
        >
          Shuvit
        </Button>
      </div>
    </>
  );
}