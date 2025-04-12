import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useTelemetryStore } from '../hooks/useWebSocketTelemetry';

const Skateboard = () => {
    const group = useRef<THREE.Group>(null!);
    const { rotation } = useTelemetryStore();

    // Load the glTF model
    const { scene } = useGLTF('/skateboard/scene.gltf');

    useFrame(() => {
        const euler = new THREE.Euler(
            rotation.y, // pitch (beta → X)
            rotation.z, // roll (gamma → Y)
            rotation.x, // yaw (alpha → Z)
            'ZXY'
        );

        group.current.setRotationFromEuler(euler);
    });

    return (
        <primitive ref={group} object={scene} scale={1} />
    );
};

export default Skateboard;
