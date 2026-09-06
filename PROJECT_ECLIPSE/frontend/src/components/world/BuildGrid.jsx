import React, { useState } from 'react';

export function BuildGrid({ activeBuildType, existingBuildings = [], onPlaceBuilding }) {
  const [hoverCoord, setHoverCoord] = useState(null);

  if (!activeBuildType) return null;

  // Grid range -3 to 3
  const gridCells = [];
  for (let x = -3; x <= 3; x++) {
    for (let z = -3; z <= 3; z++) {
      const isOccupied = existingBuildings.some((b) => b.grid_x === x && b.grid_z === z);
      gridCells.push({ x, z, worldX: x * 1.7, worldZ: z * 1.7, isOccupied });
    }
  }

  return (
    <group position={[0, 0.02, 0]}>
      {gridCells.map((cell) => {
        const isHovered = hoverCoord && hoverCoord.x === cell.x && hoverCoord.z === cell.z;
        const isValid = !cell.isOccupied;

        return (
          <group key={`${cell.x}-${cell.z}`} position={[cell.worldX, 0, cell.worldZ]}>
            {/* Clickable Grid Tile */}
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoverCoord({ x: cell.x, z: cell.z });
              }}
              onPointerOut={() => setHoverCoord(null)}
              onClick={(e) => {
                e.stopPropagation();
                if (isValid) {
                  onPlaceBuilding && onPlaceBuilding(activeBuildType, cell.x, cell.z);
                }
              }}
            >
              <planeGeometry args={[1.5, 1.5]} />
              <meshBasicMaterial
                color={
                  isHovered
                    ? (isValid ? '#22c55e' : '#ef4444')
                    : (isValid ? '#3b82f6' : '#64748b')
                }
                wireframe={!isHovered}
                transparent
                opacity={isHovered ? 0.6 : 0.25}
              />
            </mesh>

            {/* Ghost Structure Preview on Hover */}
            {isHovered && isValid && (
              <mesh position={[0, 0.75, 0]}>
                <boxGeometry args={[1.0, 1.5, 1.0]} />
                <meshStandardMaterial
                  color="#22c55e"
                  transparent
                  opacity={0.5}
                  emissive="#15803d"
                  emissiveIntensity={0.6}
                />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}
