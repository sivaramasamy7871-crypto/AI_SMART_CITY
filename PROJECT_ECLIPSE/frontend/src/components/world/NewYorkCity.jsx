import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

// 1. Iconic Empire State Building (Art Deco Stepped Skyscraper)
function EmpireStateBuilding({ position = [0, 0, 0], isNight = false }) {
  const antennaRef = useRef();

  useFrame(({ clock }) => {
    if (antennaRef.current && isNight) {
      const flash = Math.sin(clock.getElapsedTime() * 4) > 0;
      antennaRef.current.material.color.set(flash ? '#ef4444' : '#ffffff');
    }
  });

  return (
    <group position={position}>
      {/* Base Tier 1 */}
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 2.4, 1.3]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Mid Tier 2 */}
      <mesh position={[0, 2.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 1.6, 0.95]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Upper Tier 3 */}
      <mesh position={[0, 4.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.75, 1.4, 0.65]} />
        <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Observation Deck Cap */}
      <mesh position={[0, 5.05, 0]}>
        <boxGeometry args={[0.55, 0.3, 0.45]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      {/* Tower Mooring Mast & Spire */}
      <mesh position={[0, 5.7, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.16, 1.0, 8]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Top Antenna Beacon */}
      <mesh ref={antennaRef} position={[0, 6.35, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color={isNight ? "#ef4444" : "#ffffff"} />
      </mesh>
      {/* Night Architectural Floodlighting */}
      {isNight && (
        <group position={[0, 4.9, 0]}>
          <pointLight color="#38bdf8" distance={6} intensity={2.5} />
        </group>
      )}
    </group>
  );
}

// 2. One World Trade Center (Freedom Tower - Chamfered Facets & Spire)
function OneWorldTradeCenter({ position = [0, 0, 0], isNight = false }) {
  return (
    <group position={position}>
      {/* Main Prismatic Tower */}
      <mesh position={[0, 3.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 1.2, 6.4, 8]} />
        <meshStandardMaterial 
          color="#0284c7" 
          metalness={0.9} 
          roughness={0.1}
          emissive={isNight ? "#0369a1" : "#000000"}
          emissiveIntensity={isNight ? 0.35 : 0}
        />
      </mesh>
      {/* Parapet Ring */}
      <mesh position={[0, 6.45, 0]}>
        <cylinderGeometry args={[0.68, 0.68, 0.1, 16]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>
      {/* Communications Spire */}
      <mesh position={[0, 7.3, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.08, 1.6, 6]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
      </mesh>
      <mesh position={[0, 8.15, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color={isNight ? "#ffffff" : "#cbd5e1"} />
      </mesh>
    </group>
  );
}

// 3. Chrysler Building (Stepped Sunburst Crown & Spire)
function ChryslerBuilding({ position = [0, 0, 0], isNight = false }) {
  return (
    <group position={position}>
      {/* Base Tower */}
      <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 4.4, 1.2]} />
        <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.5} />
      </mesh>
      {/* Sunburst Crown Tiers */}
      <mesh position={[0, 4.6, 0]}>
        <cylinderGeometry args={[0.45, 0.6, 0.4, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.05} />
      </mesh>
      <mesh position={[0, 4.95, 0]}>
        <cylinderGeometry args={[0.3, 0.45, 0.3, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.05} />
      </mesh>
      <mesh position={[0, 5.2, 0]}>
        <cylinderGeometry args={[0.15, 0.3, 0.2, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.05} />
      </mesh>
      {/* Iconic Needle Spire */}
      <mesh position={[0, 5.85, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.08, 1.1, 6]} />
        <meshStandardMaterial color="#ffffff" metalness={1.0} roughness={0.0} />
      </mesh>
      {isNight && (
        <pointLight position={[0, 5.0, 0]} color="#fef08a" distance={5} intensity={2.0} />
      )}
    </group>
  );
}

// 4. Times Square Tower with Animated Neon Advertising Billboards
function TimesSquareTower({ position = [0, 0, 0], isNight = false }) {
  const ad1Ref = useRef();
  const ad2Ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ad1Ref.current) {
      const col = Math.floor(t % 3);
      ad1Ref.current.material.color.set(col === 0 ? '#ec4899' : (col === 1 ? '#38bdf8' : '#eab308'));
    }
    if (ad2Ref.current) {
      const col = Math.floor((t + 1.5) % 3);
      ad2Ref.current.material.color.set(col === 0 ? '#22c55e' : (col === 1 ? '#a855f7' : '#f97316'));
    }
  });

  return (
    <group position={position}>
      {/* Tower Body */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.3, 5.0, 1.3]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Mega Billboard 1 (Front Broadway View) */}
      <mesh ref={ad1Ref} position={[0, 3.2, 0.66]}>
        <planeGeometry args={[1.1, 1.6]} />
        <meshBasicMaterial color="#ec4899" />
      </mesh>

      {/* Mega Billboard 2 (Side Avenue View) */}
      <mesh ref={ad2Ref} position={[0.66, 2.0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.1, 1.2]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* Broadway Neon Ticker Ring */}
      <mesh position={[0, 4.4, 0]}>
        <boxGeometry args={[1.35, 0.25, 1.35]} />
        <meshBasicMaterial color="#fde047" />
      </mesh>
    </group>
  );
}

// 5. Classic NYC Brownstone Townhouses
function NYC言Brownstone({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Red Brick / Sandstone Wall */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 1.5, 0.9]} />
        <meshStandardMaterial color="#7f1d1d" roughness={0.8} />
      </mesh>
      {/* Roof Cornice */}
      <mesh position={[0, 1.54, 0]}>
        <boxGeometry args={[0.76, 0.08, 0.96]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Front Entrance Stoop Stairs */}
      <mesh position={[0, 0.18, 0.52]}>
        <boxGeometry args={[0.26, 0.36, 0.22]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.48, 0.46]}>
        <boxGeometry args={[0.18, 0.38, 0.02]} />
        <meshStandardMaterial color="#1e1b4b" />
      </mesh>
      {/* Windows with White Trim */}
      {[-0.2, 0.2].map((wx, i) =>
        [0.85, 1.25].map((wy, j) => (
          <mesh key={`${i}-${j}`} position={[wx, wy, 0.46]}>
            <boxGeometry args={[0.16, 0.22, 0.02]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.2} />
          </mesh>
        ))
      )}
    </group>
  );
}

// 6. Central Park (Manhattan Green Oasis)
function CentralParkNYC({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Park Ground Lawn */}
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <boxGeometry args={[2.8, 0.06, 3.6]} />
        <meshStandardMaterial color="#15803d" roughness={0.9} />
      </mesh>
      {/* Central Park Lake (The Reservoir) */}
      <mesh position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.4, 1.8]} />
        <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.6} />
      </mesh>
      {/* Walking Paths */}
      <mesh position={[0, 0.062, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.7, 16]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>
      {/* Clustered Trees */}
      {[
        [-0.9, -1.2], [-0.9, 1.2], [0.9, -1.2], [0.9, 1.2],
        [-1.0, 0], [1.0, 0], [0, -1.4], [0, 1.4]
      ].map(([tx, tz], i) => (
        <group key={i} position={[tx, 0.06, tz]}>
          <mesh position={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.06, 0.4, 6]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0, 0.48, 0]} castShadow>
            <coneGeometry args={[0.26, 0.5, 7]} />
            <meshStandardMaterial color="#166534" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 7. Brooklyn Suspension Bridge across East River
function BrooklynBridgeNYC({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Gothic Stone Suspension Tower */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[0.5, 2.8, 1.2]} />
        <meshStandardMaterial color="#78716c" roughness={0.9} />
      </mesh>
      {/* Gothic Arches cutouts */}
      <mesh position={[0, 1.1, 0.25]}>
        <boxGeometry args={[0.55, 1.2, 0.4]} />
        <meshBasicMaterial color="#1c1917" />
      </mesh>
      <mesh position={[0, 1.1, -0.25]}>
        <boxGeometry args={[0.55, 1.2, 0.4]} />
        <meshBasicMaterial color="#1c1917" />
      </mesh>
      {/* Bridge Road Deck */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.4, 0.1, 6.5]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Main Steel Cables */}
      <mesh position={[0, 2.1, 0]} rotation={[0, 0, 0.1]}>
        <cylinderGeometry args={[0.015, 0.015, 6.2, 6]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
      </mesh>
    </group>
  );
}

// 8. NYC Street Details: Subway Entrance & Hot Dog Cart
function NYCStreetFurniture({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Subway Entrance Stairs & Green Globe Lamp */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[0.4, 0.16, 0.6]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0.18, 0.28, 0.25]}>
          <cylinderGeometry args={[0.015, 0.015, 0.35, 6]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.18, 0.45, 0.25]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
      </group>

      {/* NYC Hot Dog Cart */}
      <group position={[0.6, 0, 0.3]}>
        <mesh position={[0, 0.14, 0]}>
          <boxGeometry args={[0.24, 0.18, 0.32]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
        </mesh>
        {/* Yellow/Blue Umbrella */}
        <mesh position={[0, 0.38, 0]}>
          <coneGeometry args={[0.22, 0.12, 8]} />
          <meshStandardMaterial color="#eab308" />
        </mesh>
      </group>
    </group>
  );
}

// Master Authentic New York City Component
export function NewYorkCityManhattan({ isNight = false }) {
  return (
    <group>
      {/* 1. Hudson River (West Side) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-7.8, -0.04, 0]}>
        <planeGeometry args={[4.5, 20]} />
        <meshStandardMaterial color={isNight ? "#061325" : "#0284c7"} roughness={0.1} metalness={0.7} />
      </mesh>

      {/* 2. East River (East Side) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[7.8, -0.04, 0]}>
        <planeGeometry args={[4.5, 20]} />
        <meshStandardMaterial color={isNight ? "#061325" : "#0284c7"} roughness={0.1} metalness={0.7} />
      </mesh>

      {/* 3. Brooklyn Bridge spanning East River */}
      <BrooklynBridgeNYC position={[7.6, 0, 2.5]} />

      {/* 4. One World Trade Center (Downtown / Financial District) */}
      <OneWorldTradeCenter position={[-2.4, 0, 4.2]} isNight={isNight} />

      {/* 5. Empire State Building (Midtown Manhattan) */}
      <EmpireStateBuilding position={[0, 0, -0.8]} isNight={isNight} />

      {/* 6. Chrysler Building (East Midtown) */}
      <ChryslerBuilding position={[2.6, 0, -1.8]} isNight={isNight} />

      {/* 7. Times Square Animated Billboards (Broadway & 7th Ave) */}
      <TimesSquareTower position={[-2.2, 0, -2.2]} isNight={isNight} />

      {/* 8. Central Park (Upper Manhattan) */}
      <CentralParkNYC position={[0, 0, -4.8]} />

      {/* 9. NYC Brownstone Residential Streets */}
      <NYC言Brownstone position={[-4.2, 0, -1.2]} />
      <NYC言Brownstone position={[-4.2, 0, 0.4]} />
      <NYC言Brownstone position={[-4.2, 0, 2.0]} />
      <NYC言Brownstone position={[4.2, 0, -1.2]} />
      <NYC言Brownstone position={[4.2, 0, 0.4]} />

      {/* 10. Wall Street Commercial High-Rises */}
      <mesh position={[0, 2.2, 3.8]} castShadow receiveShadow>
        <boxGeometry args={[1.3, 4.4, 1.1]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[2.4, 1.8, 3.8]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 3.6, 1.2]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* 11. NYC Street Life: Subway Entrance & Hot Dog Carts */}
      <NYCStreetFurniture position={[-1.2, 0, 0.8]} />
      <NYCStreetFurniture position={[1.2, 0, -3.2]} />
    </group>
  );
}
