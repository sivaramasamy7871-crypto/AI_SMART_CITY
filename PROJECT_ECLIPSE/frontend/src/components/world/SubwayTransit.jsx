import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export function SubwayTransit({ isNight = false }) {
  const trainRef = useRef();

  // Rail path parameters
  const railHeight = 2.2;
  const radius = 6.2;

  useFrame(({ clock }) => {
    if (!trainRef.current) return;
    const t = clock.getElapsedTime() * 0.45;
    trainRef.current.position.x = Math.cos(t) * radius;
    trainRef.current.position.z = Math.sin(t) * radius;
    trainRef.current.position.y = railHeight;
    trainRef.current.rotation.y = -t - Math.PI / 2;
  });

  // Generate support pillars along the circular track
  const pillarAngles = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, (5 * Math.PI) / 4, (3 * Math.PI) / 2, (7 * Math.PI) / 4];

  return (
    <group>
      {/* 1. Elevated Circular Monorail Track */}
      <mesh position={[0, railHeight - 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.12, radius + 0.12, 64]} />
        <meshStandardMaterial 
          color="#334155" 
          metalness={0.8} 
          roughness={0.2} 
        />
      </mesh>

      {/* Glowing Rail Luminescence */}
      <mesh position={[0, railHeight - 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.04, radius + 0.04, 64]} />
        <meshBasicMaterial color={isNight ? "#38bdf8" : "#0284c7"} />
      </mesh>

      {/* 2. Track Support Pillars */}
      {pillarAngles.map((angle, i) => {
        const px = Math.cos(angle) * radius;
        const pz = Math.sin(angle) * radius;
        return (
          <group key={i} position={[px, railHeight / 2, pz]}>
            <mesh>
              <cylinderGeometry args={[0.08, 0.1, railHeight, 8]} />
              <meshStandardMaterial color="#1e293b" metalness={0.6} />
            </mesh>
            {/* Top Bracket */}
            <mesh position={[0, railHeight / 2 - 0.05, 0]}>
              <boxGeometry args={[0.35, 0.08, 0.25]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
          </group>
        );
      })}

      {/* 3. Futuristic Maglev Train Consist */}
      <group ref={trainRef}>
        {/* Lead Car */}
        <mesh position={[0, 0.14, 0.45]} castShadow>
          <boxGeometry args={[0.26, 0.22, 0.75]} />
          <meshStandardMaterial 
            color="#0f172a" 
            metalness={0.9} 
            roughness={0.1}
            emissive={isNight ? "#0284c7" : "#000000"}
            emissiveIntensity={isNight ? 0.3 : 0}
          />
        </mesh>
        {/* Headlight */}
        <mesh position={[0, 0.12, 0.84]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        {isNight && (
          <pointLight position={[0, 0.12, 1.0]} color="#38bdf8" distance={4} intensity={1.5} />
        )}

        {/* Mid Car */}
        <mesh position={[0, 0.14, -0.38]} castShadow>
          <boxGeometry args={[0.25, 0.22, 0.7]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        {/* Glowing Windows */}
        {[-0.14, 0.14].map((wx, j) => (
          <mesh key={j} position={[wx, 0.14, 0.05]}>
            <boxGeometry args={[0.01, 0.08, 1.4]} />
            <meshBasicMaterial color={isNight ? "#67e8f9" : "#e0f2fe"} />
          </mesh>
        ))}

        {/* Rear Car */}
        <mesh position={[0, 0.14, -1.18]} castShadow>
          <boxGeometry args={[0.26, 0.22, 0.75]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
        {/* Taillight */}
        <mesh position={[0, 0.12, -1.57]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>
    </group>
  );
}
