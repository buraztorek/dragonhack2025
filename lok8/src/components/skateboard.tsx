import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useTelemetryStore } from '../hooks/useWebSocketTelemetry';

const Skateboard = () => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const { rotation } = useTelemetryStore();

    useFrame((_, delta) => {
        // Apply gyroscope-based rotation (integrated per frame)
        meshRef.current.rotation.x += rotation.x * delta;
        meshRef.current.rotation.y += rotation.y * delta;
        meshRef.current.rotation.z += rotation.z * delta;
    });


    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[3, 0.1, 0.8]} />
            <meshStandardMaterial color="orange" />
        </mesh>
    );
};

export default Skateboard;