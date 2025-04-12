import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useTelemetryStore } from '../hooks/useWebSocketTelemetry';

const Skateboard = () => {
    const group = useRef<THREE.Group>(null!);
    const { rotation } = useTelemetryStore();
    const { scene } = useGLTF('/skateboard/scene.gltf');

    // Flip model upright if needed
    const modelUpCorrection = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(1, 0, 0),
        Math.PI // flip 180° around X to match board orientation
    );

    useFrame(() => {
        const euler = new THREE.Euler(
            rotation.y,        // yaw
            rotation.x + 1.7,       // roll (flipped for better alignment)
            -rotation.z,        // pitch
            'YXZ'
        );

        const deviceQuat = new THREE.Quaternion().setFromEuler(euler);

        // Combine device rotation with model correction
        const finalQuat = deviceQuat.multiply(modelUpCorrection);

        // Apply to the board
        group.current.quaternion.copy(finalQuat);
    });

    return (
        <primitive
            ref={group}
            object={scene}
            scale={1}
        />
    );
};

export default Skateboard;