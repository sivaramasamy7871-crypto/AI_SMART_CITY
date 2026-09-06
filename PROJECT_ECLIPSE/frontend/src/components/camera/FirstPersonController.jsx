import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function FirstPersonController({ active = false, onExit }) {
  const { camera } = useThree();
  const keys = useRef({ forward: false, backward: false, left: false, right: false });
  const pos = useRef(new THREE.Vector3(0, 0.4, 3));
  const yaw = useRef(0);

  useEffect(() => {
    if (!active) return;

    // Reset camera position to street level
    camera.position.set(pos.current.x, pos.current.y, pos.current.z);

    const handleKeyDown = (e) => {
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') keys.current.forward = true;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') keys.current.backward = true;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') keys.current.left = true;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') keys.current.right = true;
      if (e.key === 'Escape') onExit && onExit();
    };

    const handleKeyUp = (e) => {
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') keys.current.forward = false;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') keys.current.backward = false;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') keys.current.left = false;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') keys.current.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [active, camera, onExit]);

  useFrame((_, delta) => {
    if (!active) return;

    const moveSpeed = 3.5 * delta;
    const rotateSpeed = 1.8 * delta;

    if (keys.current.left) yaw.current += rotateSpeed;
    if (keys.current.right) yaw.current -= rotateSpeed;

    const dir = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);
    const side = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);

    if (keys.current.forward) pos.current.addScaledVector(dir, moveSpeed);
    if (keys.current.backward) pos.current.addScaledVector(dir, -moveSpeed);

    // Clamp inside city perimeter
    pos.current.x = Math.max(-8, Math.min(8, pos.current.x));
    pos.current.z = Math.max(-8, Math.min(8, pos.current.z));
    pos.current.y = 0.38;

    camera.position.copy(pos.current);
    camera.lookAt(pos.current.clone().add(dir));
  });

  if (!active) return null;

  return null;
}
