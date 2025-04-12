"use client";

import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useWebSocketTelemetry } from '../hooks/useWebSocketTelemetry';
import Landing from '@/components/landing';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Skateboard = dynamic(() => import('@/components/skateboard'), { ssr: false });

export default function Home() {
  const { sendMessage } = useWebSocketTelemetry("ws://localhost:8000/ws/viewer");
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

  return (
    <>
      {/* <Landing /> */}

      <div style={{ width: '100vw', height: '100vh', background: '#000', position: 'relative' }}>
        <Canvas camera={{ position: [5, 3, 5], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Skateboard />
          <OrbitControls />
          <Environment preset="sunset" />
        </Canvas>
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
