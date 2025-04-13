"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";

const trickData = {
  ollie: {
    name: "Ollie",
    difficulty: "Beginner",
    score: 320,
  },
  shuvit: {
    name: "Shuvit",
    difficulty: "Intermediate",
    score: 540,
  },
  kickflip: {
    name: "Kickflip",
    difficulty: "Advanced",
    score: 750,
  },
};

export default function HighlightRender({ highlightId }: { highlightId: keyof typeof trickData }) {
  return (
    <div className="w-full">
      <div className="aspect-video rounded-xl overflow-hidden border-2 border-black">
        <Canvas shadows camera={{ position: [3, 2, 5], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
          <Environment preset="sunset" />
          <Scene />
          <OrbitControls enablePan={false} />
        </Canvas>
      </div>
      <div className="mt-2 text-center text-sm text-black font-medium">
        <p>{trickData[highlightId].name} • Difficulty: {trickData[highlightId].difficulty}</p>
        <p>Score: {trickData[highlightId].score}</p>
      </div>
    </div>
  );
}

function Scene() {
  const { scene } = useGLTF("/skateboard/scene.gltf");
  const boardRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (boardRef.current) {
      boardRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group>
      <primitive object={scene} ref={boardRef} scale={0.5} position={[0, 0.3, 0]} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#333" roughness={0.8} metalness={0.2} />
      </mesh>
    </group>
  );
}
