import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export function Landmarks({ isNight = false }) {
  const globeRef = useRef();
  const ringRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (globeRef.current) {
      globeRef.current.rotation.y = t * 0.4;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.6;
      ringRef.current.rotation.z = t * 0.3;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Plaza Base */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <cylinderGeometry args={[0.95, 1.05, 0.08, 16]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} />
      </mesh>

      {/* Central Monument Spire */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.18, 3.6, 6]} />
        <meshStandardMaterial 
          color="#38bdf8" 
          metalness={0.9} 
          roughness={0.1}
          emissive={isNight ? "#0284c7" : "#000000"}
          emissiveIntensity={isNight ? 0.6 : 0}
        />
      </mesh>

      {/* Rotating Holographic Globe Ring */}
      <group position={[0, 3.2, 0]} ref={globeRef}>
        <mesh>
          <sphereGeometry args={[0.32, 12, 12]} />
          <meshBasicMaterial color="#38bdf8" wireframe />
        </mesh>
        <mesh ref={ringRef}>
          <torusGeometry args={[0.48, 0.02, 8, 24]} />
          <meshBasicMaterial color={isNight ? "#c084fc" : "#0ea5e9"} />
        </mesh>
      </group>
    </group>
  );
}
