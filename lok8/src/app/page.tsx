"use client";

import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useWebSocketTelemetry } from '../hooks/useWebSocketTelemetry';

const Skateboard = dynamic(() => import('@/components/skateboard'), { ssr: false });

export default function Home() {
  useWebSocketTelemetry("ws://localhost:8000/ws/viewer");

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas camera={{ position: [5, 3, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Skateboard />
        <OrbitControls />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}
