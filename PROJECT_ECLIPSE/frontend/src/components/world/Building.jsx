import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

// Detailed Realistic Residential House / Villa
function ResidentialHouse({ width = 1.0, depth = 1.0, height = 1.2, isNight = false, isSelected, hovered, onClick, onPointerOver, onPointerOut }) {
  const roofHeight = 0.55;

  return (
    <group 
      position={[0, 0, 0]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Foundation Concrete Base */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[width * 1.1, 0.08, depth * 1.1]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>

      {/* Main House Body (Stucco / Brick Walls) */}
      <mesh position={[0, height / 2 + 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial 
          color={isSelected ? "#38bdf8" : hovered ? "#fde047" : "#e2e8f0"} 
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Pitched Sloped Roof (Terracotta / Dark Slate) */}
      <group position={[0, height + 0.08 + roofHeight / 2, 0]}>
        <mesh castShadow rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[Math.max(width, depth) * 0.8, roofHeight, 4]} />
          <meshStandardMaterial color="#991b1b" roughness={0.6} metalness={0.2} />
        </mesh>
        {/* Chimney */}
        <mesh position={[width * 0.25, 0.1, depth * 0.2]} castShadow>
          <boxGeometry args={[0.14, 0.4, 0.14]} />
          <meshStandardMaterial color="#7f1d1d" roughness={0.9} />
        </mesh>
      </group>

      {/* Front Entrance Wooden Door */}
      <mesh position={[0, 0.28, depth / 2 + 0.01]}>
        <boxGeometry args={[0.22, 0.44, 0.02]} />
        <meshStandardMaterial color="#78350f" roughness={0.5} />
      </mesh>
      {/* Door Canopy Awning */}
      <mesh position={[0, 0.52, depth / 2 + 0.08]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.34, 0.04, 0.18]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Glass Windows with Frames & Night Glow */}
      {[-0.3, 0.3].map((wx, i) => (
        <group key={i} position={[wx, 0.45, depth / 2 + 0.01]}>
          <mesh>
            <boxGeometry args={[0.22, 0.24, 0.02]} />
            <meshStandardMaterial 
              color={isNight ? "#fef08a" : "#38bdf8"} 
              emissive={isNight ? "#fef08a" : "#000000"}
              emissiveIntensity={isNight ? 0.9 : 0}
              roughness={0.1}
            />
          </mesh>
          {/* Window Frame Cross */}
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[0.02, 0.24, 0.01]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[0.22, 0.02, 0.01]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Detailed Realistic Modern Skyscraper
function ModernSkyscraper({ width = 1.0, depth = 1.0, height = 4.0, floors = 20, isNight = false, isSelected, hovered, hazard, type, onClick, onPointerOver, onPointerOut }) {
  const isBlackout = hazard === 'blackout';
  const isHospital = type === 'hospital';

  return (
    <group 
      position={[0, 0, 0]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Ground Floor Entrance Lobby */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[width * 1.05, 0.7, depth * 1.05]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Glass Lobby Windows */}
      <mesh position={[0, 0.35, depth * 1.05 / 2 + 0.01]}>
        <planeGeometry args={[width * 0.9, 0.5]} />
        <meshStandardMaterial 
          color={isNight ? "#67e8f9" : "#38bdf8"} 
          emissive={isNight ? "#0284c7" : "#000000"} 
          emissiveIntensity={isNight ? 0.6 : 0}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Main Tower Body (Curtain Glass Facade with Metallic Mullions) */}
      <mesh position={[0, height / 2 + 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height - 0.35, depth]} />
        <meshStandardMaterial 
          color={
            isSelected ? "#38bdf8" : 
            hovered ? "#60a5fa" : 
            isBlackout ? "#090d16" : 
            (isHospital ? "#f8fafc" : "#1e293b")
          }
          metalness={0.85}
          roughness={0.2}
          emissive={
            isBlackout ? "#000000" :
            isNight ? (isHospital ? "#ef4444" : "#0284c7") : "#000000"
          }
          emissiveIntensity={isNight && !isBlackout ? 0.25 : 0}
        />
      </mesh>

      {/* Window Grid Stripes (Horizontal floor levels) */}
      {!isBlackout && Array.from({ length: Math.min(floors, 12) }).map((_, fIdx) => {
        const yPos = 0.8 + fIdx * ((height - 1.0) / Math.min(floors, 12));
        return (
          <group key={fIdx}>
            {/* Front Windows */}
            <mesh position={[0, yPos, depth / 2 + 0.005]}>
              <planeGeometry args={[width * 0.86, 0.12]} />
              <meshBasicMaterial color={isNight ? (fIdx % 3 === 0 ? "#fef08a" : "#93c5fd") : "#0284c7"} />
            </mesh>
            {/* Back Windows */}
            <mesh position={[0, yPos, -depth / 2 - 0.005]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[width * 0.86, 0.12]} />
              <meshBasicMaterial color={isNight ? (fIdx % 2 === 0 ? "#fef08a" : "#60a5fa") : "#0284c7"} />
            </mesh>
          </group>
        );
      })}

      {/* Hospital Red Cross Signage */}
      {isHospital && (
        <group position={[0, height - 0.2, depth / 2 + 0.02]}>
          <mesh>
            <boxGeometry args={[0.3, 0.08, 0.02]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
          <mesh>
            <boxGeometry args={[0.08, 0.3, 0.02]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
      )}

      {/* Rooftop Architecture: HVAC units, Helipad & Communication Mast */}
      <group position={[0, height + 0.35, 0]}>
        {/* Roof Border */}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[width * 0.92, 0.08, depth * 0.92]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        {/* HVAC Chiller Unit */}
        <mesh position={[-width * 0.22, 0.15, -depth * 0.2]} castShadow>
          <boxGeometry args={[0.35, 0.22, 0.3]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} />
        </mesh>
        {/* Helipad "H" Marking */}
        {height > 3.5 && (
          <group position={[width * 0.15, 0.09, width * 0.15]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.3, 16]} />
              <meshBasicMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.26, 0.28, 16]} />
              <meshBasicMaterial color="#fde047" />
            </mesh>
          </group>
        )}
        {/* Antenna Mast with Warning Beacon */}
        {height > 3.0 && (
          <group position={[0, 0.35, 0]}>
            <mesh>
              <cylinderGeometry args={[0.015, 0.03, 0.7, 6]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
            <mesh position={[0, 0.38, 0]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshBasicMaterial color={isNight ? "#ef4444" : "#ffffff"} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
}

// Detailed Realistic Green Bio-Park
function RealisticPark({ width = 1.0, depth = 1.0, isSelected, hovered, onClick, onPointerOver, onPointerOut }) {
  return (
    <group 
      position={[0, 0.02, 0]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Stone Border Perimeter */}
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <boxGeometry args={[width * 1.25, 0.06, depth * 1.25]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>
      {/* Manicured Grass Turf */}
      <mesh position={[0, 0.065, 0]} receiveShadow>
        <boxGeometry args={[width * 1.18, 0.02, depth * 1.18]} />
        <meshStandardMaterial color={hovered ? "#4ade80" : "#166534"} roughness={0.9} />
      </mesh>
      {/* Cross Stone Walking Paths */}
      <mesh position={[0, 0.076, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width * 1.15, 0.25]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.077, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.25, depth * 1.15]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.8} />
      </mesh>

      {/* Central Water Fountain */}
      <group position={[0, 0.1, 0]}>
        <mesh>
          <cylinderGeometry args={[0.28, 0.32, 0.1, 16]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.04, 16]} />
          <meshStandardMaterial color="#0284c7" roughness={0.1} />
        </mesh>
      </group>

      {/* 4 Realistic Pine / Deciduous Trees */}
      {[
        [-0.38, -0.38],
        [0.38, -0.38],
        [-0.38, 0.38],
        [0.38, 0.38]
      ].map(([tx, tz], i) => (
        <group key={i} position={[tx, 0.08, tz]}>
          {/* Wood Trunk */}
          <mesh position={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.06, 0.4, 6]} />
            <meshStandardMaterial color="#78350f" roughness={0.9} />
          </mesh>
          {/* Layered Foliage Clusters */}
          <mesh position={[0, 0.45, 0]} castShadow>
            <coneGeometry args={[0.28, 0.4, 7]} />
            <meshStandardMaterial color="#15803d" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.65, 0]} castShadow>
            <coneGeometry args={[0.22, 0.35, 7]} />
            <meshStandardMaterial color="#16a34a" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Master Building Component
export function Building({ 
  id, 
  type = 'residential', 
  name, 
  world_x, 
  world_z, 
  width = 1.0, 
  depth = 1.0, 
  height = 2.5, 
  floors = 10,
  hazard = null,
  isNight = false,
  isSelected = false,
  onSelect
}) {
  const [hovered, setHovered] = useState(false);
  const fireRef = useRef();

  const isFire = hazard === 'fire';
  const isResidentialLow = type === 'residential' && height < 2.0;

  useFrame(({ clock }) => {
    if (isFire && fireRef.current) {
      const t = clock.getElapsedTime() * 8;
      const s = 1 + Math.sin(t) * 0.25;
      fireRef.current.scale.set(s, s * 1.4, s);
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect && onSelect({ id, type, name, world_x, world_z, height, hazard, floors });
  };

  return (
    <group position={[world_x, 0, world_z]}>
      {type === 'park' ? (
        <RealisticPark 
          width={width} 
          depth={depth} 
          isSelected={isSelected} 
          hovered={hovered} 
          onClick={handleClick}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
          onPointerOut={() => setHovered(false)}
        />
      ) : isResidentialLow ? (
        <ResidentialHouse
          width={width}
          depth={depth}
          height={height}
          isNight={isNight}
          isSelected={isSelected}
          hovered={hovered}
          onClick={handleClick}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
          onPointerOut={() => setHovered(false)}
        />
      ) : (
        <ModernSkyscraper
          width={width}
          depth={depth}
          height={height}
          floors={floors}
          isNight={isNight}
          isSelected={isSelected}
          hovered={hovered}
          hazard={hazard}
          type={type}
          onClick={handleClick}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
          onPointerOut={() => setHovered(false)}
        />
      )}

      {/* Realistic Fire Smoke / Flame Particles for Disasters */}
      {isFire && (
        <group ref={fireRef} position={[0, height + 0.4, 0]}>
          <mesh>
            <dodecahedronGeometry args={[0.5, 1]} />
            <meshBasicMaterial color="#ff4500" transparent opacity={0.85} />
          </mesh>
          <pointLight color="#ff3300" distance={6} intensity={3.0} />
        </group>
      )}
    </group>
  );
}
