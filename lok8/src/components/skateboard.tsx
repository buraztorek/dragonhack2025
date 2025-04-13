import { useFrame, useLoader } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useGLTF, Environment } from '@react-three/drei';
import { useTelemetryStore } from '../hooks/useWebSocketTelemetry';

const Skateboard = () => {
    const group = useRef<THREE.Group>(null!);
    const { rotation, acceleration, timestamp } = useTelemetryStore();
    const lastTimestamp = useRef<number>(timestamp);
    const { scene } = useGLTF('/skateboard/scene.gltf');
    const velocity = useRef(new THREE.Vector3());
    const position = useRef(new THREE.Vector3());


    // Load floor texture
    const concreteTexture = useLoader(THREE.TextureLoader, '/textures/road.jpg');
    concreteTexture.wrapS = concreteTexture.wrapT = THREE.ClampToEdgeWrapping;

    const wallTexture = useLoader(THREE.TextureLoader, '/textures/1.png');
    wallTexture.wrapS = wallTexture.wrapT = THREE.ClampToEdgeWrapping;

    // Flip board upright
    const modelUpCorrection = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(1, 0, 0),
        Math.PI
    );

    useFrame(() => {
        const euler = new THREE.Euler(
            -rotation.y + Math.PI,
            rotation.x + 1.7,
            -rotation.z,
            'YXZ'
        );
        const deviceQuat = new THREE.Quaternion().setFromEuler(euler);
        const finalQuat = deviceQuat.multiply(modelUpCorrection);
        group.current.quaternion.copy(finalQuat);
    });

    return (
        <>
            {/* Skateboard */}
            <primitive ref={group} object={scene} scale={0.5} position={[0, 0.3, 0]} />

            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[40, 15]} />
                <meshStandardMaterial map={concreteTexture} roughness={0.8} metalness={0.2} />
            </mesh>

            {/* Back wall */}
            <mesh position={[0, 2.5, -7.5]} rotation={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[28, 15]} />
                <meshStandardMaterial map={wallTexture} roughness={0.8} metalness={0.2} />
            </mesh>

            {/* Side walls */}
            <mesh position={[-14, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
                <planeGeometry args={[15, 5]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            <mesh position={[14, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
                <planeGeometry args={[15, 5]} />
                <meshStandardMaterial color="#333" />
            </mesh>

            {/* Skate ramp (quarter pipe) */}
            <mesh position={[-10, -0.1, 0]} rotation={[0, 0, -Math.PI / 8]}>
                <boxGeometry args={[2, 1, 6]} />
                <meshStandardMaterial color="#666" />
            </mesh>

            {/* Manual pad */}
            <mesh position={[5, 0.2, 2]} receiveShadow castShadow>
                <boxGeometry args={[2, 0.4, 1]} />
                <meshStandardMaterial color="#555" />
            </mesh>

            {/* Axes Helper */}
            <axesHelper args={[5]} />

            {/* Sky and lighting */}
            <color attach="background" args={['#111']} />
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
            <Environment preset="sunset" />
        </>
    );
};

export default Skateboard;