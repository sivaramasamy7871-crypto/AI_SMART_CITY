import React, { useMemo } from 'react';
import * as THREE from 'three';
import { latLngToTile, getTileUrl } from '../../services/liveGeolocationService';

function MapTileMesh({ tileX, tileY, zoom, offsetX, offsetZ }) {
  const texture = useMemo(() => {
    const url = getTileUrl(tileX, tileY, zoom);
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    const tex = loader.load(url);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, [tileX, tileY, zoom]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[offsetX, 0.005, offsetZ]} receiveShadow>
      <planeGeometry args={[7.2, 7.2]} />
      <meshStandardMaterial map={texture} roughness={0.9} />
    </mesh>
  );
}

export function RealMapGround({ lat = 13.0827, lng = 80.2707, zoom = 15 }) {
  const centerTile = useMemo(() => latLngToTile(lat, lng, zoom), [lat, lng, zoom]);

  // Generate 3x3 real map tile grid around the center GPS coordinate
  const tiles = [];
  const tileSizeWorld = 7.2;

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      tiles.push({
        tileX: centerTile.x + dx,
        tileY: centerTile.y + dy,
        offsetX: dx * tileSizeWorld,
        offsetZ: dy * tileSizeWorld,
        key: `${centerTile.x + dx}-${centerTile.y + dy}`
      });
    }
  }

  return (
    <group position={[0, 0, 0]}>
      {/* 3x3 Real-World OpenStreetMap / CartoDB Dark Matter Satellite & Street Tiles */}
      {tiles.map((t) => (
        <MapTileMesh
          key={t.key}
          tileX={t.tileX}
          tileY={t.tileY}
          zoom={zoom}
          offsetX={t.offsetX}
          offsetZ={t.offsetZ}
        />
      ))}
    </group>
  );
}
