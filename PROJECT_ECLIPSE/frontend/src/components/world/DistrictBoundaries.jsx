import React from 'react';

export function DistrictBoundaries({ isNight = false }) {
  const districts = [
    { name: "CYBER TECH HUB", pos: [0, 0.05, -5.4], color: "#38bdf8" },
    { name: "NEO-HARBOR DOCKS", pos: [0, 0.05, 5.4], color: "#34d399" },
    { name: "FINANCIAL DOWNTOWN", pos: [-5.4, 0.05, 0], color: "#c084fc" },
    { name: "BIO-GREEN ENCLAVE", pos: [5.4, 0.05, 0], color: "#4ade80" }
  ];

  return (
    <group>
      {/* Perimeter Laser Grid Lines */}
      {[-6.2, 6.2].map((coord, i) => (
        <React.Fragment key={i}>
          {/* X Line */}
          <mesh position={[0, 0.015, coord]}>
            <boxGeometry args={[18, 0.02, 0.04]} />
            <meshBasicMaterial color={isNight ? "#38bdf8" : "#1e293b"} transparent opacity={0.6} />
          </mesh>
          {/* Z Line */}
          <mesh position={[coord, 0.015, 0]}>
            <boxGeometry args={[0.04, 0.02, 18]} />
            <meshBasicMaterial color={isNight ? "#38bdf8" : "#1e293b"} transparent opacity={0.6} />
          </mesh>
        </React.Fragment>
      ))}

      {/* District Zone Corner Pylons */}
      {districts.map((d, idx) => (
        <group key={idx} position={d.pos}>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.04, 0.06, 0.3, 6]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0.32, 0]}>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshBasicMaterial color={d.color} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
