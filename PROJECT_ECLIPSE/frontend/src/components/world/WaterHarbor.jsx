import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export function WaterHarbor({ isNight = false }) {
  const waterRef = useRef();
  const shipRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (shipRef.current) {
      shipRef.current.position.x = ((t * 0.3) % 18) - 9;
      shipRef.current.position.y = -0.04 + Math.sin(t * 1.5) * 0.02;
      shipRef.current.rotation.z = Math.sin(t * 1.2) * 0.02;
    }
  });

  return (
    <group position={[0, 0, 7.8]}>
      {/* Ocean Water Plane */}
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 1.8]}>
        <planeGeometry args={[22, 5.5, 32, 16]} />
        <meshStandardMaterial 
          color={isNight ? "#061325" : "#0c4a6e"} 
          roughness={0.1} 
          metalness={0.8}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Docking Pier & Sea Wall */}
      <mesh position={[0, 0.05, -0.8]}>
        <boxGeometry args={[18, 0.2, 0.6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Mooring Bollards */}
      {[-6, -3, 0, 3, 6].map((bx, i) => (
        <group key={i} position={[bx, 0.18, -0.6]}>
          <mesh>
            <cylinderGeometry args={[0.04, 0.04, 0.12, 8]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Autonomous Cyber Cargo Ship */}
      <group ref={shipRef} position={[0, -0.02, 1.8]}>
        {/* Hull */}
        <mesh castShadow>
          <boxGeometry args={[1.6, 0.28, 0.6]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} />
        </mesh>
        {/* Bridge */}
        <mesh position={[-0.5, 0.22, 0]}>
          <boxGeometry args={[0.35, 0.25, 0.45]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
        {/* Cargo Containers */}
        <mesh position={[0.2, 0.2, 0]}>
          <boxGeometry args={[0.75, 0.18, 0.42]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        {/* Ship Beacon Light */}
        <mesh position={[-0.5, 0.4, 0]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshBasicMaterial color={isNight ? "#22c55e" : "#38bdf8"} />
        </mesh>
      </group>
    </group>
  );
}
