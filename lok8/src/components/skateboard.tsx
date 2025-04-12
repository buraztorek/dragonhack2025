import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useTelemetryStore } from '../hooks/useWebSocketTelemetry';

const Skateboard = () => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const { rotation } = useTelemetryStore();

    useFrame(() => {
        // Convert DeviceMotion rotation (ZXY) to Three.js Euler
        const euler = new THREE.Euler(
            rotation.y,  // pitch (beta → X)
            rotation.z,  // roll (gamma → Y)
            rotation.x,  // yaw (alpha → Z)
            'ZXY'        // DeviceMotion uses ZXY
        );

        meshRef.current.setRotationFromEuler(euler);
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[3, 0.1, 0.8]} />
            <meshStandardMaterial color="orange" />
        </mesh>
    );
};

export default Skateboard;
