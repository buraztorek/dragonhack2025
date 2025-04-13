import { useFrame, useLoader } from '@react-three/fiber';
import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useGLTF, Environment } from '@react-three/drei';
import { useTelemetryStore } from '../hooks/useWebSocketTelemetry';
import { Text } from '@react-three/drei';

const Skateboard = () => {
    const group = useRef<THREE.Group>(null!);
    const textRef = useRef<THREE.Mesh>(null!);
    const { rotation, acceleration, timestamp } = useTelemetryStore();
    const lastTimestamp = useRef<number>(timestamp);
    const { scene } = useGLTF('/skateboard/scene.gltf');
    const velocity = useRef(new THREE.Vector3());
    const position = useRef(new THREE.Vector3());
    // Handle trick changes and trigger animations
    const trick = useTelemetryStore().skill; // e.g., 'kickflip', 'ollie', null

    // Text animation states
    const [displayText, setDisplayText] = useState<string | null>(null);
    const [textOpacity, setTextOpacity] = useState(0);
    const [textScale, setTextScale] = useState(0);
    const prevTrickRef = useRef<string | null>(null);

    // Load floor texture
    const concreteTexture = useLoader(THREE.TextureLoader, '/textures/road.jpg');
    concreteTexture.wrapS = concreteTexture.wrapT = THREE.ClampToEdgeWrapping;

    const wallTexture = useLoader(THREE.TextureLoader, '/textures/fri.png');
    wallTexture.wrapS = wallTexture.wrapT = THREE.ClampToEdgeWrapping;

    // Flip board upright
    const modelUpCorrection = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(1, 0, 0),
        Math.PI
    );

    // Create an enhanced fire-like shader material
    const fireShaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                baseColor: { value: new THREE.Color(0xff7700) },
                tipColor: { value: new THREE.Color(0xff0000) },
                opacity: { value: 1.0 }  // Add opacity uniform for fading
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 baseColor;
                uniform vec3 tipColor;
                uniform float opacity;
                varying vec2 vUv;

                // Improved noise function for more organic fire movement
                float random(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
                }

                float noise(vec2 st) {
                    vec2 i = floor(st);
                    vec2 f = fract(st);

                    float a = random(i);
                    float b = random(i + vec2(1.0, 0.0));
                    float c = random(i + vec2(0.0, 1.0));
                    float d = random(i + vec2(1.0, 1.0));

                    vec2 u = f * f * (3.0 - 2.0 * f);
                    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
                }

                void main() {
                    // Enhanced fire effect using multiple layers of noise
                    float n = noise(vUv * 5.0 + vec2(0.0, -time * 2.0));
                    n += 0.5 * noise(vUv * 10.0 + vec2(0.0, -time * 3.0));
                    n += 0.25 * noise(vUv * 20.0 + vec2(0.0, -time * 4.0));

                    // Create vertical gradient for natural flame look
                    float gradient = 1.0 - vUv.y;

                    // Combine noise and gradient for more realistic fire effect
                    float fire = n * gradient * 1.5;
                    fire = clamp(fire, 0.0, 1.0);

                    // Add horizontal distortion for flickering edges
                    float edgeFlicker = noise(vec2(vUv.x * 20.0, time * 5.0)) * 0.1;
                    fire *= 1.0 - edgeFlicker * (1.0 - vUv.y);

                    // Interpolate between base and tip colors
                    vec3 color = mix(baseColor, tipColor, 1.0 - fire);

                    // Add yellow-white to the hotter/brighter parts
                    if (fire > 0.7) {
                        color = mix(color, vec3(1.0, 0.9, 0.5), (fire - 0.7) * 3.0);
                    }

                    // Boost intensity near text center
                    float centerBoost = 1.0 - 2.0 * length(vUv - vec2(0.5, 0.5));
                    centerBoost = max(0.0, centerBoost * 0.3);
                    color += vec3(1.0, 0.7, 0.3) * centerBoost;

                    // Apply global opacity for text fade in/out
                    gl_FragColor = vec4(color, (fire > 0.1 ? 1.0 : fire * 10.0) * opacity);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
    }, []);

    useEffect(() => {
        // Only animate if the trick changes
        if (trick !== prevTrickRef.current) {
            // If there's a new trick
            if (trick) {
                // Set the new display text
                if (trick !== '') {
                    setDisplayText(trick);
                }

                // Animate in
                let startTime = Date.now();
                const animateIn = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / 500, 1); // 500ms animation

                    setTextOpacity(progress);
                    setTextScale(Math.min(1, progress * 1.2)); // Slight overshoot for bounce effect

                    if (progress < 1) {
                        requestAnimationFrame(animateIn);
                    } else {
                        // After animation completes, set timeout to fade out
                        setTimeout(() => {
                            // Animate out
                            startTime = Date.now();
                            const animateOut = () => {
                                const elapsed = Date.now() - startTime;
                                const progress = Math.min(elapsed / 800, 1); // 800ms fade out

                                setTextOpacity(1 - progress);

                                if (progress < 1) {
                                    requestAnimationFrame(animateOut);
                                } else {
                                    setDisplayText(null); // Remove text after fade out
                                }
                            };
                            requestAnimationFrame(animateOut);
                        }, 5000); // Wait 5 seconds before fading out
                    }
                };
                requestAnimationFrame(animateIn);
            } else {
                // If the trick has been reset to null, handle appropriately
                setTextOpacity(0);
                setTimeout(() => setDisplayText(null), 800);
            }

            // Update the previous trick ref
            prevTrickRef.current = trick;
        }
    }, [trick]);

    useFrame(({ clock }) => {
        // Update skateboard rotation
        const euler = new THREE.Euler(
            -rotation.y + Math.PI,
            rotation.x + 1.7,
            -rotation.z,
            'YXZ'
        );
        const deviceQuat = new THREE.Quaternion().setFromEuler(euler);
        const finalQuat = deviceQuat.multiply(modelUpCorrection);
        group.current.quaternion.copy(finalQuat);

        // Update fire effect
        if (fireShaderMaterial && fireShaderMaterial.uniforms) {
            fireShaderMaterial.uniforms.time.value = clock.getElapsedTime();
            fireShaderMaterial.uniforms.opacity.value = textOpacity;
        }

        // Subtle floating animation for text
        if (textRef.current && displayText) {
            textRef.current.position.y = 2 + Math.sin(clock.getElapsedTime() * 1.5) * 0.03;
        }
    });

    return (
        <>
            {/* Skateboard */}
            <primitive ref={group} object={scene} scale={0.5} position={[0, 0.3, 0]} />

            {/* Fire Text (appears when trick is detected) */}
            {displayText && (
            <group scale={[textScale, textScale, textScale]}>
                {/* Shadow text layer for depth */}
                <Text
                    position={[0.02, 1.97, -0.02]}
                    fontSize={1}
                    color="black"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.02}
                    outlineColor="black"
                    material-transparent={true}
                    material-opacity={textOpacity * 0.7}
                >
                    {displayText}
                </Text>

                {/* Glow layer behind text */}
                <Text
                    position={[0, 2, -0.01]}
                    fontSize={1.02}
                    color="orange"
                    anchorX="center"
                    anchorY="middle"
                    material-transparent={true}
                    material-opacity={textOpacity * 0.3}
                    material-blending={THREE.AdditiveBlending}
                >
                    {displayText}
                </Text>

                {/* Main text with fire effect */}
                <Text
                    ref={textRef}
                    position={[0, 2, 0]}
                    fontSize={1}
                    anchorX="center"
                    anchorY="middle"
                    material={fireShaderMaterial}
                >
                    {displayText}
                </Text>
            </group>
            )}

            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[40, 15]} />
                <meshStandardMaterial map={concreteTexture} roughness={0.8} metalness={0.2} />
            </mesh>

            {/* Back wall */}
            <mesh position={[0, 5, -7.5]} rotation={[0, 0, 0]} receiveShadow>
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
            <mesh position={[-7, -0.1, 0]} rotation={[0, 0, -Math.PI / 8]}>
                <boxGeometry args={[2, 1, 6]} />
                <meshStandardMaterial color="#666" />
            </mesh>

            {/* Manual pad */}
            <mesh position={[5, 0.2, 2]} receiveShadow castShadow>
                <boxGeometry args={[2, 0.4, 1]} />
                <meshStandardMaterial color="#555" />
            </mesh>

            {/* Axes Helper */}
            {/*<axesHelper args={[5]} />*/}

            {/* Sky and lighting */}
            <color attach="background" args={['#111']} />
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
            <Environment preset="sunset" />
        </>
    );
};

export default Skateboard;