"use client";

import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useWebSocketTelemetry } from '../hooks/useWebSocketTelemetry';
import Landing from '@/components/landing';
import { Button } from '@/components/ui/button';

const Skateboard = dynamic(() => import('@/components/skateboard'), { ssr: false });

export default function Home() {
  const { sendMessage } = useWebSocketTelemetry("ws://localhost:8000/ws/viewer");

  const handleSendMessage = () => {
    sendMessage({ type: "TOGGLE_TRACKING" });
  };

  return (
    <>
      {/* <Landing /> */}
      <Button onClick={handleSendMessage}>Send Message</Button>

      {/* <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
        <Canvas camera={{ position: [5, 3, 5], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Skateboard />
          <OrbitControls />
          <Environment preset="sunset" />
        </Canvas>
      </div>  */}

    </>
  );
}
