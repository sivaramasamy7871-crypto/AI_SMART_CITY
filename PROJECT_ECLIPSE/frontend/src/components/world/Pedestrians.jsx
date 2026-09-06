import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

// Detailed Realistic Human Model with Animated Arms, Legs, Head, Hair & Clothing
export function PedestrianAgent({
  id,
  name,
  job,
  mood,
  thought,
  current_pos = [0, 0],
  target_pos = [0, 0],
  speed = 0.3,
  isSelected = false,
  onSelect
}) {
  const groupRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();

  // Pick deterministic clothing colors based on citizen name hash
  const hash = name ? name.charCodeAt(0) + name.charCodeAt(name.length - 1) : 42;
  const shirtColor = ['#38bdf8', '#fbbf24', '#4ade80', '#c084fc', '#f43f5e', '#ffffff', '#1e293b'][hash % 7];
  const pantsColor = ['#1e293b', '#334155', '#475569', '#1e1b4b'][hash % 4];
  const hairColor = ['#18181b', '#78350f', '#451a03', '#d97706'][hash % 4];
  const skinTone = ['#fed7aa', '#fcd34d', '#f59e0b', '#78350f'][hash % 4];

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime() * 7;
    
    // Natural Walking Animation (Counter-Swinging Legs & Arms)
    if (leftLegRef.current && rightLegRef.current) {
      leftLegRef.current.rotation.x = Math.sin(t) * 0.55;
      rightLegRef.current.rotation.x = -Math.sin(t) * 0.55;
    }
    if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.x = -Math.sin(t) * 0.5;
      rightArmRef.current.rotation.x = Math.sin(t) * 0.5;
    }

    // Walking vertical bobbing motion
    groupRef.current.position.x = current_pos[0];
    groupRef.current.position.z = current_pos[1];
    groupRef.current.position.y = 0.09 + Math.abs(Math.sin(t * 2)) * 0.025;

    // Rotation facing walking direction
    const dx = target_pos[0] - current_pos[0];
    const dz = target_pos[1] - current_pos[1];
    if (Math.abs(dx) > 0.01 || Math.abs(dz) > 0.01) {
      groupRef.current.rotation.y = Math.atan2(dx, dz);
    }
  });

  return (
    <group 
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelect && onSelect({ id, name, job, mood, thought, current_pos });
      }}
    >
      {/* 1. Torso / Shirt */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[0.13, 0.16, 0.08]} />
        <meshStandardMaterial color={isSelected ? "#38bdf8" : shirtColor} roughness={0.6} />
      </mesh>

      {/* 2. Head & Neck */}
      <group position={[0, 0.35, 0]}>
        {/* Head */}
        <mesh castShadow>
          <sphereGeometry args={[0.055, 10, 10]} />
          <meshStandardMaterial color={skinTone} roughness={0.7} />
        </mesh>
        {/* Hair Style */}
        <mesh position={[0, 0.025, -0.01]}>
          <sphereGeometry args={[0.058, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={hairColor} roughness={0.9} />
        </mesh>
      </group>

      {/* 3. Arms with Hands */}
      {/* Left Arm */}
      <group position={[-0.085, 0.28, 0]} ref={leftArmRef}>
        <mesh position={[0, -0.07, 0]} castShadow>
          <boxGeometry args={[0.035, 0.14, 0.04]} />
          <meshStandardMaterial color={shirtColor} />
        </mesh>
        {/* Left Hand */}
        <mesh position={[0, -0.15, 0]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshStandardMaterial color={skinTone} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.085, 0.28, 0]} ref={rightArmRef}>
        <mesh position={[0, -0.07, 0]} castShadow>
          <boxGeometry args={[0.035, 0.14, 0.04]} />
          <meshStandardMaterial color={shirtColor} />
        </mesh>
        {/* Right Hand */}
        <mesh position={[0, -0.15, 0]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshStandardMaterial color={skinTone} />
        </mesh>
      </group>

      {/* 4. Legs with Shoes */}
      {/* Left Leg */}
      <group position={[-0.04, 0.14, 0]} ref={leftLegRef}>
        {/* Pants */}
        <mesh position={[0, -0.07, 0]} castShadow>
          <boxGeometry args={[0.045, 0.14, 0.05]} />
          <meshStandardMaterial color={pantsColor} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.14, 0.02]} castShadow>
          <boxGeometry args={[0.045, 0.03, 0.08]} />
          <meshStandardMaterial color="#090d16" roughness={0.9} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group position={[0.04, 0.14, 0]} ref={rightLegRef}>
        {/* Pants */}
        <mesh position={[0, -0.07, 0]} castShadow>
          <boxGeometry args={[0.045, 0.14, 0.05]} />
          <meshStandardMaterial color={pantsColor} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.14, 0.02]} castShadow>
          <boxGeometry args={[0.045, 0.03, 0.08]} />
          <meshStandardMaterial color="#090d16" roughness={0.9} />
        </mesh>
      </group>

      {/* Selection Holographic Halo Beacon */}
      {isSelected && (
        <mesh position={[0, 0.48, 0]}>
          <ringGeometry args={[0.08, 0.1, 16]} rotation={[-Math.PI / 2, 0, 0]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      )}
    </group>
  );
}

export function PedestriansList({ citizens = [], selectedCitizenId = null, onSelectCitizen }) {
  return (
    <group>
      {citizens.map((c) => (
        <PedestrianAgent 
          key={c.id} 
          {...c} 
          isSelected={selectedCitizenId === c.id} 
          onSelect={onSelectCitizen} 
        />
      ))}
    </group>
  );
}
