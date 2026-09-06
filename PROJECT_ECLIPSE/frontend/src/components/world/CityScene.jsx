import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Building } from './Building';
import { VehiclesList } from './Vehicles';
import { PedestriansList } from './Pedestrians';
import { BuildGrid } from './BuildGrid';
import { SubwayTransit } from './SubwayTransit';
import { WaterHarbor } from './WaterHarbor';
import { Landmarks } from './Landmarks';
import { DistrictBoundaries } from './DistrictBoundaries';
import { RealMapGround } from './RealMapGround';
import { NewYorkCityManhattan } from './NewYorkCity';
import { DenseManhattanSkyline } from './DenseManhattanSkyline';
import { FirstPersonController } from '../camera/FirstPersonController';

function TrafficLight({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const lightRef = useRef();

  useFrame(({ clock }) => {
    if (!lightRef.current) return;
    const cycle = Math.floor(clock.getElapsedTime() % 6);
    if (cycle < 3) {
      lightRef.current.material.color.set('#22c55e');
      lightRef.current.material.emissive.set('#16a34a');
    } else if (cycle === 3) {
      lightRef.current.material.color.set('#eab308');
      lightRef.current.material.emissive.set('#ca8a04');
    } else {
      lightRef.current.material.color.set('#ef4444');
      lightRef.current.material.emissive.set('#dc2626');
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.025, 0.03, 0.8, 6]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[0.08, 0.22, 0.08]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh ref={lightRef} position={[0, 0.8, 0.045]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

function StreetLight({ position = [0, 0, 0], isNight = false }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.025, 1.0, 6]} />
        <meshStandardMaterial color="#64748b" metalness={0.7} />
      </mesh>
      <mesh position={[0.1, 1.0, 0]}>
        <boxGeometry args={[0.2, 0.04, 0.08]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0.18, 0.98, 0]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshBasicMaterial color={isNight ? "#fef08a" : "#94a3b8"} />
      </mesh>
      {isNight && (
        <pointLight position={[0.18, 0.95, 0]} color="#fef08a" distance={4.5} intensity={0.9} />
      )}
    </group>
  );
}

function RainParticles({ weather }) {
  const count = weather === 'storm' ? 650 : 350;
  const rainGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = Math.random() * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 22;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  const rainRef = useRef();

  useFrame(() => {
    if (!rainRef.current) return;
    const positions = rainRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] -= (weather === 'storm' ? 0.35 : 0.22);
      if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 1] = 12;
      }
    }
    rainRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={rainRef} geometry={rainGeo}>
      <pointsMaterial color="#93c5fd" size={0.06} transparent opacity={0.65} />
    </points>
  );
}

export function CityScene({
  cityId = 'newyork',
  lat = 40.7128,
  lng = -74.0060,
  simTimeHours = 14.5,
  weather = 'clear',
  buildings = [],
  citizens = [],
  incidents = [],
  activeBuildType = null,
  selectedEntity = null,
  cameraMode = 'orbit', // orbit, topdown, fpv
  onSelectBuilding,
  onSelectCitizen,
  onSelectVehicle,
  onPlaceBuilding,
  onExitFPV
}) {
  const controlsRef = useRef();
  const lightningLightRef = useRef();

  const isNight = simTimeHours < 6.0 || simTimeHours > 18.5;
  const sunAngle = ((simTimeHours - 6.0) / 12.0) * Math.PI;
  const sunX = Math.cos(sunAngle) * 12;
  const sunY = Math.max(0.5, Math.sin(sunAngle) * 14);
  const sunZ = 8;

  const skyColor = useMemo(() => {
    if (weather === 'storm') return '#070b14';
    if (weather === 'fog' || weather === 'night_fog') return '#111827';
    if (simTimeHours >= 5.5 && simTimeHours <= 7.0) return '#d97706';
    if (simTimeHours >= 16.5 && simTimeHours <= 18.5) return '#fed7aa'; // Golden hour sunset glow
    if (isNight) return '#060a12';
    return '#7dd3fc'; // Vibrant daytime sky
  }, [simTimeHours, weather, isNight]);

  const isGoldenHour = (simTimeHours >= 6.0 && simTimeHours <= 8.0) || (simTimeHours >= 16.5 && simTimeHours <= 18.5);
  const ambientIntensity = isNight ? 0.25 : (weather === 'storm' ? 0.35 : (isGoldenHour ? 0.85 : 0.75));
  const sunIntensity = isNight ? 0.1 : (weather === 'storm' ? 0.4 : (isGoldenHour ? 1.8 : 1.4));
  const sunColor = isGoldenHour ? '#ffbe76' : (simTimeHours < 9.0 || simTimeHours > 16.0 ? '#fde047' : '#ffffff');

  useFrame(({ clock }) => {
    if (weather === 'storm' && lightningLightRef.current) {
      const flash = Math.sin(clock.getElapsedTime() * 12) > 0.96;
      lightningLightRef.current.intensity = flash ? 3.5 : 0.0;
    }
  });

  const hasFire = buildings.some((b) => b.hazard === 'fire') || incidents.some((i) => i.type === 'fire');
  const roadPositions = [-5.8, -3.9, -2, 0, 2, 3.9, 5.8];

  return (
    <>
      <color attach="background" args={[skyColor]} />
      <fog 
        attach="fog" 
        args={[
          skyColor, 
          weather === 'fog' || weather === 'storm' ? 8 : (isGoldenHour ? 20 : 25), 
          weather === 'fog' || weather === 'storm' ? 24 : 45
        ]} 
      />

      {/* Ambient Skylight (Soft blue shadows) */}
      <ambientLight intensity={ambientIntensity} color={isNight ? '#60a5fa' : (isGoldenHour ? '#93c5fd' : '#ffffff')} />
      
      {/* Primary Directional Golden Sunlight */}
      <directionalLight
        position={[sunX, sunY, sunZ]}
        intensity={sunIntensity}
        color={sunColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={45}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
      />
      
      {/* Secondary Fill Light for Shadow Side Realism */}
      {!isNight && (
        <directionalLight
          position={[-sunX, sunY * 0.5, -sunZ]}
          intensity={0.35}
          color="#38bdf8"
        />
      )}

      {weather === 'storm' && (
        <directionalLight ref={lightningLightRef} position={[0, 20, 0]} color="#e0f2fe" intensity={0} />
      )}

      {(weather === 'rain' || weather === 'storm') && <RainParticles weather={weather} />}

      {/* Real-World OpenStreetMap / Satellite Ground Tiles */}
      <RealMapGround lat={lat} lng={lng} />

      {/* Base Ground Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[26, 26]} />
        <meshStandardMaterial color={isNight ? "#080e1a" : "#111a2e"} roughness={0.9} />
      </mesh>

      {/* Road Grid for Non-NYC Cities */}
      {cityId !== 'newyork' && (
        <group>
          {roadPositions.map((p) => (
            <React.Fragment key={`road-${p}`}>
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[p, 0.01, 0]} receiveShadow>
                <planeGeometry args={[0.7, 18]} />
                <meshStandardMaterial color="#1e293b" roughness={0.7} />
              </mesh>
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, p]} receiveShadow>
                <planeGeometry args={[18, 0.7]} />
                <meshStandardMaterial color="#1e293b" roughness={0.7} />
              </mesh>
            </React.Fragment>
          ))}

          {[-3.9, 0, 3.9].map((ix) =>
            [-3.9, 0, 3.9].map((iz) => (
              <React.Fragment key={`infra-${ix}-${iz}`}>
                <TrafficLight position={[ix + 0.45, 0, iz + 0.45]} />
                <StreetLight position={[ix - 0.45, 0, iz - 0.45]} isNight={isNight} />
              </React.Fragment>
            ))
          )}
        </group>
      )}

      {/* 3D District Boundaries & Markers */}
      <DistrictBoundaries isNight={isNight} />

      {/* Massive Dense 3D Manhattan Island Skyline matching Real NYC Aerial View */}
      {cityId === 'newyork' ? (
        <DenseManhattanSkyline isNight={isNight} />
      ) : (
        <>
          {/* 3D Landmarks & Spire */}
          <Landmarks isNight={isNight} />
          {/* 3D Elevated Maglev Subway Transit System */}
          <SubwayTransit isNight={isNight} />
          {/* 3D Ocean Water Harbor & Cyber Cargo Ships */}
          <WaterHarbor isNight={isNight} />
        </>
      )}

      {/* 3D Buildings */}
      {cityId !== 'newyork' && (
        <group>
          {buildings.map((b) => (
            <Building
              key={b.id}
              {...b}
              isNight={isNight}
              isSelected={selectedEntity && selectedEntity.id === b.id}
              onSelect={onSelectBuilding}
            />
          ))}
        </group>
      )}

      {/* 3D Traffic & Emergency Responders */}
      <VehiclesList 
        isNight={isNight} 
        hasEmergency={hasFire} 
        onSelectVehicle={onSelectVehicle} 
      />

      {/* 3D AI Pedestrians & Citizen Agents */}
      <PedestriansList
        citizens={citizens}
        selectedCitizenId={selectedEntity ? selectedEntity.id : null}
        onSelectCitizen={onSelectCitizen}
      />

      {/* Interactive Build Mode Placement Grid */}
      <BuildGrid
        activeBuildType={activeBuildType}
        existingBuildings={buildings}
        onPlaceBuilding={onPlaceBuilding}
      />

      {/* First-Person Controller (WASD walking mode) */}
      {cameraMode === 'fpv' && (
        <FirstPersonController active={true} onExit={onExitFPV} />
      )}

      {/* Orbit Controls (Active when not in FPV) */}
      {cameraMode !== 'fpv' && (
        <OrbitControls
          ref={controlsRef}
          maxPolarAngle={cameraMode === 'topdown' ? 0.05 : Math.PI / 2.05}
          minDistance={cameraMode === 'topdown' ? 12 : 3}
          maxDistance={32}
          enableDamping
          dampingFactor={0.05}
        />
      )}
    </>
  );
}
