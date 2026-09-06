import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

// Detailed Realistic Car Model with 4 Wheels, Windshield, Mirrors, Grille, and Headlights
function RealisticCarMesh({ type = 'sedan', isNight = false, isEmergency = false, strobeRef }) {
  const isPolice = type === 'police';
  const isTaxi = type === 'taxi';
  const isBus = type === 'bus';
  const isFireTruck = type === 'fire';
  const isAmbulance = type === 'ambulance';

  const bodyColor = 
    isPolice ? '#0f172a' :
    isTaxi ? '#eab308' :
    isFireTruck ? '#dc2626' :
    isAmbulance ? '#ffffff' :
    isBus ? '#0284c7' :
    (type === 'sports' ? '#ef4444' : '#334155');

  const length = isBus ? 1.4 : (isFireTruck ? 1.2 : 0.65);
  const width = isBus ? 0.38 : (isFireTruck ? 0.36 : 0.32);
  const height = isBus ? 0.42 : (isFireTruck ? 0.38 : 0.24);

  return (
    <group position={[0, 0.08, 0]}>
      {/* 1. Main Car Lower Body Chassis */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <boxGeometry args={[width, 0.14, length]} />
        <meshStandardMaterial color={bodyColor} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Front Chrome Grille */}
      <mesh position={[0, 0.08, length / 2 + 0.005]}>
        <boxGeometry args={[width * 0.7, 0.08, 0.01]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 2. Cabin & Tinted Glass Windshield */}
      {!isBus && (
        <group position={[0, 0.18, -length * 0.05]}>
          {/* Cabin Shell */}
          <mesh castShadow>
            <boxGeometry args={[width * 0.85, 0.12, length * 0.52]} />
            <meshStandardMaterial color={bodyColor} metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Front Windshield Glass */}
          <mesh position={[0, 0, length * 0.26 + 0.005]} rotation={[-0.35, 0, 0]}>
            <planeGeometry args={[width * 0.75, 0.11]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} transparent opacity={0.8} />
          </mesh>
          {/* Rear Glass */}
          <mesh position={[0, 0, -length * 0.26 - 0.005]} rotation={[0.35, Math.PI, 0]}>
            <planeGeometry args={[width * 0.75, 0.11]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} transparent opacity={0.8} />
          </mesh>
          {/* Side Windows */}
          {[-width * 0.425 - 0.002, width * 0.425 + 0.002].map((sx, idx) => (
            <mesh key={idx} position={[sx, 0, 0]} rotation={[0, sx > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
              <planeGeometry args={[length * 0.45, 0.09]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
            </mesh>
          ))}
        </group>
      )}

      {/* Bus Upper Deck Windows */}
      {isBus && (
        <group position={[0, 0.24, 0]}>
          <mesh castShadow>
            <boxGeometry args={[width * 0.95, 0.2, length * 0.95]} />
            <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
          </mesh>
          {/* Front Destination LED Board */}
          <mesh position={[0, 0.05, length / 2 + 0.005]}>
            <planeGeometry args={[width * 0.7, 0.06]} />
            <meshBasicMaterial color="#fde047" />
          </mesh>
        </group>
      )}

      {/* 3. 4 Rubber Wheels with Silver Rims */}
      {[
        [-width / 2 - 0.015, length * 0.28],
        [width / 2 + 0.015, length * 0.28],
        [-width / 2 - 0.015, -length * 0.28],
        [width / 2 + 0.015, -length * 0.28]
      ].map(([wx, wz], i) => (
        <group key={i} position={[wx, 0.04, wz]} rotation={[0, 0, Math.PI / 2]}>
          {/* Black Rubber Tire */}
          <mesh castShadow>
            <cylinderGeometry args={[0.075, 0.075, 0.04, 12]} />
            <meshStandardMaterial color="#090d16" roughness={0.9} />
          </mesh>
          {/* Metallic Hubcap Rim */}
          <mesh position={[0, wx > 0 ? 0.022 : -0.022, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.005, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* 4. Side Mirrors */}
      {[-width / 2 - 0.025, width / 2 + 0.025].map((mx, j) => (
        <mesh key={j} position={[mx, 0.16, length * 0.12]}>
          <boxGeometry args={[0.025, 0.025, 0.04]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
      ))}

      {/* 5. Headlights with Beam (Night) */}
      <group position={[0, 0.08, length / 2 + 0.01]}>
        {[-width * 0.35, width * 0.35].map((hx, k) => (
          <mesh key={k} position={[hx, 0, 0]}>
            <boxGeometry args={[0.06, 0.04, 0.01]} />
            <meshStandardMaterial 
              color="#fef08a" 
              emissive={isNight ? "#fef08a" : "#000000"} 
              emissiveIntensity={isNight ? 1.5 : 0} 
            />
          </mesh>
        ))}
      </group>

      {/* 6. Red Taillights (Night) */}
      <group position={[0, 0.09, -length / 2 - 0.01]}>
        {[-width * 0.35, width * 0.35].map((tx, l) => (
          <mesh key={l} position={[tx, 0, 0]}>
            <boxGeometry args={[0.06, 0.035, 0.01]} />
            <meshStandardMaterial 
              color="#ef4444" 
              emissive={isNight ? "#ef4444" : "#000000"} 
              emissiveIntensity={isNight ? 1.2 : 0} 
            />
          </mesh>
        ))}
      </group>

      {/* 7. Emergency Flashing Lightbar for Police / Ambulance / Fire */}
      {isEmergency && (
        <group position={[0, isBus ? 0.36 : 0.27, 0]}>
          <mesh ref={strobeRef}>
            <boxGeometry args={[0.16, 0.05, 0.08]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
      )}

      {/* Taxi Roof Sign */}
      {isTaxi && (
        <mesh position={[0, 0.26, 0]}>
          <boxGeometry args={[0.12, 0.03, 0.06]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
      )}
    </group>
  );
}

export function Vehicle({
  type = 'sedan',
  axis = 'x',
  roadCoord = 0,
  speed = 0.5,
  offset = 0,
  isNight = false,
  hasEmergency = false,
  onSelectVehicle
}) {
  const meshRef = useRef();
  const strobeRef = useRef();

  const isPolice = type === 'police';
  const isAmbulance = type === 'ambulance';
  const isFireTruck = type === 'fire';
  const isEmergency = isPolice || isAmbulance || isFireTruck || hasEmergency;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = (clock.getElapsedTime() * speed + offset) % 18 - 9;
    
    if (axis === 'x') {
      meshRef.current.position.set(t, 0.01, roadCoord);
      meshRef.current.rotation.set(0, speed > 0 ? Math.PI / 2 : -Math.PI / 2, 0);
    } else {
      meshRef.current.position.set(roadCoord, 0.01, t);
      meshRef.current.rotation.set(0, speed > 0 ? 0 : Math.PI, 0);
    }

    if (isEmergency && strobeRef.current) {
      const flash = Math.sin(clock.getElapsedTime() * 16) > 0;
      strobeRef.current.material.color.set(flash ? (isPolice ? '#ef4444' : '#f97316') : '#3b82f6');
    }
  });

  return (
    <group 
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelectVehicle && onSelectVehicle({ type, axis, roadCoord, speed });
      }}
    >
      <RealisticCarMesh 
        type={type} 
        isNight={isNight} 
        isEmergency={isEmergency} 
        strobeRef={strobeRef} 
      />
    </group>
  );
}

export function DeliveryDrone({ id, startX = 0, startZ = 0, speed = 0.8, isNight = false }) {
  const droneRef = useRef();

  useFrame(({ clock }) => {
    if (!droneRef.current) return;
    const t = clock.getElapsedTime() * speed;
    const radius = 3.5;
    droneRef.current.position.x = startX + Math.cos(t) * radius;
    droneRef.current.position.z = startZ + Math.sin(t) * radius;
    droneRef.current.position.y = 3.8 + Math.sin(t * 2) * 0.3;
    droneRef.current.rotation.y = -t + Math.PI / 2;
  });

  return (
    <group ref={droneRef}>
      <mesh castShadow>
        <boxGeometry args={[0.2, 0.06, 0.2]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} />
      </mesh>
      {[-0.15, 0.15].map((rx, i) =>
        [-0.15, 0.15].map((rz, j) => (
          <mesh key={`${i}-${j}`} position={[rx, 0.04, rz]}>
            <cylinderGeometry args={[0.08, 0.08, 0.01, 8]} />
            <meshBasicMaterial color="#38bdf8" wireframe />
          </mesh>
        ))
      )}
      <mesh position={[0, -0.04, 0]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshBasicMaterial color={isNight ? "#22c55e" : "#0284c7"} />
      </mesh>
    </group>
  );
}

export function VehiclesList({ isNight = false, hasEmergency = false, onSelectVehicle }) {
  return (
    <group>
      {/* Traffic along North-South Avenues (axis='z') */}
      <Vehicle type="taxi" axis="z" roadCoord={0.0} speed={0.45} offset={0} isNight={isNight} onSelectVehicle={onSelectVehicle} />
      <Vehicle type="sedan" axis="z" roadCoord={0.0} speed={0.52} offset={7} isNight={isNight} onSelectVehicle={onSelectVehicle} />
      <Vehicle type="bus" axis="z" roadCoord={-1.4} speed={0.32} offset={3} isNight={isNight} onSelectVehicle={onSelectVehicle} />
      <Vehicle type="taxi" axis="z" roadCoord={-2.8} speed={-0.48} offset={5} isNight={isNight} onSelectVehicle={onSelectVehicle} />
      <Vehicle type="sports" axis="z" roadCoord={1.4} speed={-0.58} offset={2} isNight={isNight} onSelectVehicle={onSelectVehicle} />
      <Vehicle type="sedan" axis="z" roadCoord={2.8} speed={0.42} offset={8} isNight={isNight} onSelectVehicle={onSelectVehicle} />
      <Vehicle type="taxi" axis="z" roadCoord={-4.2} speed={0.4} offset={4} isNight={isNight} onSelectVehicle={onSelectVehicle} />
      <Vehicle type="bus" axis="z" roadCoord={4.2} speed={-0.3} offset={6} isNight={isNight} onSelectVehicle={onSelectVehicle} />
      
      {/* FDR Drive Waterfront Traffic (axis='z' at roadCoord=5.4) */}
      <Vehicle type="sports" axis="z" roadCoord={5.4} speed={0.7} offset={1} isNight={isNight} onSelectVehicle={onSelectVehicle} />
      <Vehicle type="sedan" axis="z" roadCoord={5.4} speed={0.65} offset={9} isNight={isNight} onSelectVehicle={onSelectVehicle} />

      {/* Traffic along East-West Cross Streets (axis='x') */}
      <Vehicle type="taxi" axis="x" roadCoord={0.0} speed={0.42} offset={2} isNight={isNight} onSelectVehicle={onSelectVehicle} />
      <Vehicle type="sedan" axis="x" roadCoord={2.0} speed={-0.45} offset={5} isNight={isNight} onSelectVehicle={onSelectVehicle} />
      <Vehicle type="bus" axis="x" roadCoord={-2.0} speed={0.35} offset={8} isNight={isNight} onSelectVehicle={onSelectVehicle} />
      <Vehicle type="taxi" axis="x" roadCoord={4.0} speed={-0.5} offset={1} isNight={isNight} onSelectVehicle={onSelectVehicle} />
      <Vehicle type="sedan" axis="x" roadCoord={-4.0} speed={0.44} offset={6} isNight={isNight} onSelectVehicle={onSelectVehicle} />
      <Vehicle type="sports" axis="x" roadCoord={6.0} speed={-0.6} offset={3} isNight={isNight} onSelectVehicle={onSelectVehicle} />

      {/* Emergency Responders */}
      <Vehicle type="police" axis="z" roadCoord={1.4} speed={0.8} offset={11} isNight={isNight} hasEmergency={hasEmergency} onSelectVehicle={onSelectVehicle} />
      <Vehicle type="ambulance" axis="x" roadCoord={0.0} speed={0.75} offset={4} isNight={isNight} hasEmergency={hasEmergency} onSelectVehicle={onSelectVehicle} />
      {hasEmergency && (
        <Vehicle type="fire" axis="z" roadCoord={-1.4} speed={0.85} offset={1} isNight={isNight} hasEmergency={true} onSelectVehicle={onSelectVehicle} />
      )}

      {/* Autonomous Delivery Drones */}
      <DeliveryDrone id="drone-1" startX={0} startZ={0} speed={0.4} isNight={isNight} />
      <DeliveryDrone id="drone-2" startX={-2} startZ={2} speed={0.6} isNight={isNight} />
      <DeliveryDrone id="drone-3" startX={2} startZ={-2} speed={0.5} isNight={isNight} />
    </group>
  );
}
