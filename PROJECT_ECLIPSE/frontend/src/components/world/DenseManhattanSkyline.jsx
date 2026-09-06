import React, { useMemo } from 'react';
import * as THREE from 'three';

// Generate procedural window grid textures for realistic skyscraper and house facades
function createBuildingTexture(style, isNight) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (style === 'glass' || style === 'supertall') {
    // Modern Glass Curtain Wall
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#0c2340');
    grad.addColorStop(0.5, '#1e3a5f');
    grad.addColorStop(1, '#081426');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 512);

    // Glass window grids
    ctx.fillStyle = isNight ? 'rgba(254, 240, 138, 0.85)' : 'rgba(186, 230, 253, 0.55)';
    for (let y = 8; y < 510; y += 14) {
      for (let x = 6; x < 250; x += 12) {
        if (Math.sin(x * 3 + y * 7) > (isNight ? 0.2 : -0.3)) {
          ctx.fillRect(x, y, 8, 9);
        }
      }
    }
  } else if (style === 'art_deco' || style === 'stone') {
    // Warm Limestone / Sandstone Art Deco
    ctx.fillStyle = '#c5b4a0';
    ctx.fillRect(0, 0, 256, 512);

    // Vertical stone piers
    ctx.fillStyle = '#8c7355';
    for (let x = 0; x < 256; x += 18) {
      ctx.fillRect(x, 0, 3, 512);
    }

    // Windows
    ctx.fillStyle = isNight ? 'rgba(254, 215, 170, 0.9)' : '#2b231b';
    for (let y = 10; y < 510; y += 18) {
      for (let x = 4; x < 250; x += 18) {
        if (Math.cos(x * 5 + y * 2) > (isNight ? 0.15 : -0.5)) {
          ctx.fillRect(x, y, 10, 11);
        }
      }
    }
  } else {
    // Warm NYC Brick Brownstone & Townhouses
    ctx.fillStyle = '#854d0e';
    ctx.fillRect(0, 0, 256, 512);

    // Brick mortar lines
    ctx.fillStyle = '#713f12';
    for (let y = 0; y < 512; y += 8) {
      ctx.fillRect(0, y, 256, 1);
    }

    ctx.fillStyle = isNight ? 'rgba(254, 243, 199, 0.9)' : '#1e1b18';
    for (let y = 14; y < 500; y += 24) {
      for (let x = 8; x < 248; x += 22) {
        ctx.fillRect(x, y, 12, 14);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Hyper-Realistic Manhattan City Grid with clearly visible wide Avenues, Cross Streets, Sidewalks, and Spaced-out Buildings
export function DenseManhattanSkyline({ isNight = false }) {
  const glassTex = useMemo(() => createBuildingTexture('glass', isNight), [isNight]);
  const stoneTex = useMemo(() => createBuildingTexture('art_deco', isNight), [isNight]);
  const brownstoneTex = useMemo(() => createBuildingTexture('brownstone', isNight), [isNight]);

  // Defined Avenue and Cross Street Grid Lines
  const avenuesX = useMemo(() => [-4.2, -2.8, -1.4, 0.0, 1.4, 2.8, 4.2], []);
  const streetsZ = useMemo(() => [-8.0, -6.0, -4.0, -2.0, 0.0, 2.0, 4.0, 6.0, 8.0], []);

  // Generate City Blocks neatly nestled between Avenues and Cross Streets
  const cityBlocks = useMemo(() => {
    const blocks = [];

    for (let i = 0; i < avenuesX.length - 1; i++) {
      const xLeft = avenuesX[i];
      const xRight = avenuesX[i + 1];
      const blockCenterX = (xLeft + xRight) / 2;
      const blockWidth = (xRight - xLeft) - 0.42; // Leaves 0.42 road clearance

      for (let j = 0; j < streetsZ.length - 1; j++) {
        const zTop = streetsZ[j];
        const zBottom = streetsZ[j + 1];
        const blockCenterZ = (zTop + zBottom) / 2;
        const blockDepth = (zBottom - zTop) - 0.45; // Leaves 0.45 road clearance

        // Central Park Area (Skip building blocks for park greenery)
        if (Math.abs(blockCenterX) < 1.0 && blockCenterZ >= -3.5 && blockCenterZ <= -0.5) {
          continue;
        }

        // UN Headquarters Area
        if (blockCenterX > 3.0 && Math.abs(blockCenterZ - 1.0) < 1.2) {
          continue;
        }

        // Empire State Building Area
        if (Math.abs(blockCenterX - 0.7) < 0.5 && Math.abs(blockCenterZ - 1.0) < 0.5) {
          continue;
        }

        // Chrysler Building Area
        if (Math.abs(blockCenterX - 2.1) < 0.5 && Math.abs(blockCenterZ - 1.0) < 0.5) {
          continue;
        }

        // One WTC Area (Downtown Financial District)
        if (Math.abs(blockCenterX + 0.7) < 0.5 && blockCenterZ > 6.5) {
          continue;
        }

        const seed = Math.abs(Math.sin(blockCenterX * 31.7 + blockCenterZ * 67.3) * 43758.5453) % 1;
        const distFromMidtown = Math.hypot(blockCenterX, blockCenterZ - 1.0);
        const distFromDowntown = Math.hypot(blockCenterX, blockCenterZ - 7.0);

        // Decide block archetype: Single Skyscraper, Twin Towers, or 4 Brownstones/Houses
        const isSingleTower = seed > 0.45 || distFromMidtown < 2.2 || distFromDowntown < 1.8;

        if (isSingleTower) {
          let height = 1.4 + seed * 2.8;
          let style = 'stone';
          let color = '#e2d5c5';

          if (distFromMidtown < 2.5) {
            height = 3.5 + seed * 4.5; // Midtown Supertalls
            style = seed > 0.4 ? 'glass' : 'art_deco';
            color = seed > 0.4 ? '#38bdf8' : '#fde047';
          } else if (distFromDowntown < 2.0) {
            height = 2.8 + seed * 3.8; // Downtown towers
            style = 'glass';
            color = '#60a5fa';
          } else if (Math.abs(blockCenterX) > 2.0 || blockCenterZ < -4.0) {
            height = 1.0 + seed * 1.6; // Coastal & Upper residential
            style = 'brownstone';
            color = '#9a3412';
          }

          blocks.push({
            id: `b_${i}_${j}_single`,
            type: 'single',
            cx: blockCenterX,
            cz: blockCenterZ,
            bw: blockWidth * 0.85,
            bd: blockDepth * 0.82,
            h: height,
            style,
            color,
            hasSetback: height > 3.2,
            hasWaterTank: seed > 0.5
          });
        } else {
          // Subdivide block into 2 to 4 distinct townhouses / mid-rises with alleys in between!
          const subW = (blockWidth * 0.44);
          const subD = (blockDepth * 0.44);

          const subOffsets = [
            [-blockWidth * 0.23, -blockDepth * 0.23],
            [blockWidth * 0.23, -blockDepth * 0.23],
            [-blockWidth * 0.23, blockDepth * 0.23],
            [blockWidth * 0.23, blockDepth * 0.23]
          ];

          subOffsets.forEach(([ox, oz], subIdx) => {
            const subSeed = Math.abs(Math.sin((blockCenterX + ox) * 19.3 + (blockCenterZ + oz) * 51.7) * 43758.5453) % 1;
            const subH = 0.7 + subSeed * 1.4;
            blocks.push({
              id: `b_${i}_${j}_sub_${subIdx}`,
              type: 'sub',
              cx: blockCenterX + ox,
              cz: blockCenterZ + oz,
              bw: subW,
              bd: subD,
              h: subH,
              style: subSeed > 0.5 ? 'brownstone' : 'stone',
              color: subSeed > 0.5 ? '#78350f' : '#cbd5e1',
              hasSetback: false,
              hasWaterTank: subSeed > 0.6
            });
          });
        }
      }
    }
    return blocks;
  }, [avenuesX, streetsZ]);

  return (
    <group>
      {/* 1. VISIBLE ROAD NETWORK (Manhattan Avenues and Cross Streets) */}
      {/* North-South Avenues (Long Avenues with Yellow Centerlines & Crossings) */}
      {avenuesX.map((ax, idx) => (
        <group key={`ave_${idx}`} position={[ax, 0.015, 0]}>
          {/* Dark Asphalt Road Surface */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[0.42, 20]} />
            <meshStandardMaterial color="#1e293b" roughness={0.65} />
          </mesh>
          {/* Yellow Centerline */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
            <planeGeometry args={[0.02, 19.8]} />
            <meshBasicMaterial color="#eab308" />
          </mesh>
          {/* White Lane Dashes */}
          {[-0.1, 0.1].map((lx, lIdx) => (
            <mesh key={lIdx} rotation={[-Math.PI / 2, 0, 0]} position={[lx, 0.002, 0]}>
              <planeGeometry args={[0.012, 19.8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          ))}
        </group>
      ))}

      {/* East-West Cross Streets */}
      {streetsZ.map((sz, idx) => (
        <group key={`str_${idx}`} position={[0, 0.016, sz]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[11.5, 0.38]} />
            <meshStandardMaterial color="#1e293b" roughness={0.65} />
          </mesh>
          {/* Center White Dashed Line */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
            <planeGeometry args={[11.4, 0.015]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}

      {/* 2. FDR Drive Waterfront Highway (East River Side) */}
      <group position={[5.4, 0.018, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[0.6, 20]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
          <planeGeometry args={[0.03, 19.8]} />
          <meshBasicMaterial color="#eab308" />
        </mesh>
      </group>

      {/* 3. East River (Foreground Right) & Hudson River (Left) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[8.5, 0.005, 0]}>
        <planeGeometry args={[5.5, 24]} />
        <meshStandardMaterial 
          color={isNight ? "#030712" : "#0c4a6e"} 
          roughness={0.15} 
          metalness={0.8} 
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-8.5, 0.005, 0]}>
        <planeGeometry args={[5.5, 24]} />
        <meshStandardMaterial 
          color={isNight ? "#030712" : "#0c4a6e"} 
          roughness={0.15} 
          metalness={0.8} 
        />
      </mesh>

      {/* 4. Concrete Sidewalk Plinths for every City Block */}
      {cityBlocks.map((b) => (
        <mesh key={`plinth_${b.id}`} position={[b.cx, 0.03, b.cz]} receiveShadow>
          <boxGeometry args={[b.bw + 0.12, 0.04, b.bd + 0.12]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.8} />
        </mesh>
      ))}

      {/* 5. Buildings neatly placed INSIDE their parcels with clear road gaps */}
      {cityBlocks.map((b) => (
        <group key={b.id} position={[b.cx, 0.05, b.cz]}>
          {/* Main Building Body */}
          <mesh position={[0, b.h / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[b.bw, b.h, b.bd]} />
            <meshStandardMaterial
              map={b.style === 'glass' ? glassTex : (b.style === 'brownstone' ? brownstoneTex : stoneTex)}
              color={b.color}
              metalness={b.style === 'glass' ? 0.85 : 0.25}
              roughness={b.style === 'glass' ? 0.15 : 0.75}
            />
          </mesh>

          {/* Stepped Architectural Setback */}
          {b.hasSetback && (
            <mesh position={[0, b.h + (b.h * 0.16) / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[b.bw * 0.7, b.h * 0.16, b.bd * 0.7]} />
              <meshStandardMaterial
                map={b.style === 'glass' ? glassTex : stoneTex}
                color={b.color}
                metalness={0.5}
                roughness={0.4}
              />
            </mesh>
          )}

          {/* Rooftop Water Tanks & HVAC Penthouses */}
          {b.hasWaterTank && (
            <group position={[0, b.h * (b.hasSetback ? 1.16 : 1.0) + 0.06, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.05, 0.05, 0.12, 8]} />
                <meshStandardMaterial color="#78350f" roughness={0.9} />
              </mesh>
            </group>
          )}
        </group>
      ))}

      {/* 6. ICONIC LANDMARKS (With generous open plazas around them) */}
      {/* United Nations Headquarters (East River Waterfront) */}
      <group position={[4.5, 0.05, 1.0]}>
        {/* Plaza Ground */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[1.2, 0.03, 2.0]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
        </mesh>
        {/* Secretariat Glass Tower Slab */}
        <mesh position={[0.2, 2.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.22, 4.8, 1.3]} />
          <meshStandardMaterial map={glassTex} color="#38bdf8" metalness={0.92} roughness={0.08} />
        </mesh>
        {/* General Assembly Dome */}
        <mesh position={[-0.3, 0.4, -0.4]} castShadow>
          <boxGeometry args={[0.5, 0.8, 0.8]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
        </mesh>
        {/* Waterfront Pier & Circular Structure */}
        <mesh position={[0.8, 0.2, 0.5]} castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.4, 16]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
        </mesh>
      </group>

      {/* Chrysler Building */}
      <group position={[2.1, 0.05, 1.0]}>
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[1.0, 0.03, 1.4]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
        <mesh position={[0, 2.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.75, 5.2, 0.75]} />
          <meshStandardMaterial map={stoneTex} color="#fef08a" roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[0, 5.4, 0]} castShadow>
          <boxGeometry args={[0.55, 0.8, 0.55]} />
          <meshStandardMaterial map={stoneTex} color="#fde047" />
        </mesh>
        <mesh position={[0, 6.0, 0]} castShadow>
          <coneGeometry args={[0.32, 1.2, 8]} />
          <meshStandardMaterial color="#ffffff" metalness={0.98} roughness={0.05} />
        </mesh>
        <mesh position={[0, 7.0, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.04, 1.4, 8]} />
          <meshStandardMaterial color="#ffffff" metalness={1.0} />
        </mesh>
      </group>

      {/* Empire State Building */}
      <group position={[0.7, 0.05, 1.0]}>
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[1.0, 0.03, 1.4]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
        <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.85, 4.8, 0.85]} />
          <meshStandardMaterial map={stoneTex} color="#fef08a" roughness={0.35} metalness={0.35} />
        </mesh>
        <mesh position={[0, 5.1, 0]} castShadow>
          <boxGeometry args={[0.58, 1.2, 0.58]} />
          <meshStandardMaterial map={stoneTex} color="#fde047" />
        </mesh>
        <mesh position={[0, 6.2, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.06, 1.6, 8]} />
          <meshStandardMaterial color="#ffffff" metalness={0.95} />
        </mesh>
      </group>

      {/* Central Park (Generous green park in Uptown) */}
      <group position={[0.0, 0.03, -2.0]}>
        <mesh position={[0, 0.01, 0]} receiveShadow>
          <boxGeometry args={[2.4, 0.04, 3.4]} />
          <meshStandardMaterial color="#15803d" roughness={0.95} />
        </mesh>
        {/* Reservoir Lake */}
        <mesh position={[0.2, 0.035, -0.4]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.4, 1.6]} />
          <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.7} />
        </mesh>
        {/* Tree clusters */}
        {[-0.6, 0.6].map((tx, idx) => (
          <group key={idx} position={[tx, 0.12, 0.6]}>
            <mesh castShadow>
              <coneGeometry args={[0.2, 0.35, 6]} />
              <meshStandardMaterial color="#166534" roughness={0.9} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 7. Supertall Pencil Towers along Central Park South (Billionaires' Row) */}
      {/* 432 Park Avenue */}
      <group position={[0.7, 0.05, -0.3]}>
        <mesh position={[0, 4.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.32, 8.4, 0.32]} />
          <meshStandardMaterial map={glassTex} color="#e0f2fe" metalness={0.88} roughness={0.12} />
        </mesh>
      </group>

      {/* 111 W 57th (Steinway Feathered Supertall) */}
      <group position={[-0.7, 0.05, -0.3]}>
        <mesh position={[0, 4.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.28, 8.8, 0.25]} />
          <meshStandardMaterial map={glassTex} color="#fbbf24" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* 8. One World Trade Center (Downtown Anchor) */}
      <group position={[-0.7, 0.05, 7.0]}>
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[1.0, 0.03, 1.4]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
        <mesh position={[0, 4.0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.42, 0.85, 8.0, 8]} />
          <meshStandardMaterial map={glassTex} color="#0284c7" metalness={0.95} roughness={0.05} />
        </mesh>
        <mesh position={[0, 8.8, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.06, 1.8, 6]} />
          <meshStandardMaterial color="#ffffff" metalness={1.0} />
        </mesh>
      </group>

      {/* 9. Bridges */}
      {/* Queensboro Bridge */}
      <group position={[5.6, 0.05, -2.0]}>
        <mesh position={[0, 1.4, 0]} castShadow>
          <boxGeometry args={[0.35, 2.8, 0.6]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.25, 0.08, 4.0]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>
    </group>
  );
}
