// components/EnvironmentSetup.tsx
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const EnvironmentSetup = () => {
    const concreteTexture = useLoader(THREE.TextureLoader, '/textures/road.jpg');
    concreteTexture.wrapS = concreteTexture.wrapT = THREE.RepeatWrapping;
    concreteTexture.repeat.set(4, 2); // Tile texture

    const wallTexture = useLoader(THREE.TextureLoader, '/textures/1.png');
    wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(3, 2); // Tile texture

    return (
        <>
            {/* Floor */}
            <RigidBody type="fixed" restitution={0.2} friction={1.0}>
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                    <planeGeometry args={[40, 20]} /> {/* Slightly larger plane */}
                    <meshStandardMaterial map={concreteTexture} roughness={0.8} metalness={0.2} />
                </mesh>
                {/* Implicit plane collider is infinite, use Cuboid for finite floor */}
                {/* <CuboidCollider args={[20, 0.1, 10]} position={[0, -0.1, 0]} /> */}
            </RigidBody>

            {/* Back wall */}
            <RigidBody type="fixed">
                <mesh position={[0, 5, -10]} receiveShadow> {/* Adjusted position/size */}
                    <boxGeometry args={[40, 10, 0.2]} />
                    <meshStandardMaterial map={wallTexture} roughness={0.8} metalness={0.2} />
                </mesh>
                {/* Collider matches geometry */}
                <CuboidCollider args={[20, 5, 0.1]} position={[0, 5, -10]} />
            </RigidBody>

            {/* Side walls */}
            <RigidBody type="fixed">
                <mesh position={[-20, 5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
                    <boxGeometry args={[20, 10, 0.2]} />
                    <meshStandardMaterial color="#333" />
                </mesh>
                <CuboidCollider args={[0.1, 5, 10]} position={[-20, 5, 0]} />
            </RigidBody>
            <RigidBody type="fixed">
                <mesh position={[20, 5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
                    <boxGeometry args={[20, 10, 0.2]} />
                    <meshStandardMaterial color="#333" />
                </mesh>
                <CuboidCollider args={[0.1, 5, 10]} position={[20, 5, 0]} />
            </RigidBody>

            {/* Ramp */}
            <RigidBody type="fixed" friction={0.8}>
                {/* Visual mesh */}
                <mesh position={[-10, 0.5, 0]} rotation={[0, 0, -Math.PI / 8]}>
                    <boxGeometry args={[4, 1, 6]} />
                    <meshStandardMaterial color="#666" />
                </mesh>
                {/* Collider - needs careful positioning and rotation */}
                <CuboidCollider
                    args={[2, 0.5, 3]} // half-extents
                    position={[-10, 0.5, 0]}
                    rotation={[0, 0, -Math.PI / 8]}
                />
            </RigidBody>

            {/* Manual pad */}
            <RigidBody type="fixed" friction={0.7}>
                <mesh position={[5, 0.2, 2]} receiveShadow castShadow>
                    <boxGeometry args={[2, 0.4, 1]} />
                    <meshStandardMaterial color="#555" />
                </mesh>
                {/* Collider matches geometry */}
                <CuboidCollider args={[1, 0.2, 0.5]} position={[5, 0.2, 2]} />
            </RigidBody>
        </>
    );
};

export default EnvironmentSetup;