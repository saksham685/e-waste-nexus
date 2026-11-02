'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const CyberBackground3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090e, 0.0018);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 15, 60);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // 1. Cyber Grid Plane
    const gridHelper = new THREE.GridHelper(200, 50, 0x10b981, 0x064e3b);
    gridHelper.position.y = -20;
    scene.add(gridHelper);

    // 2. Floating 3D Electronic Microchip Cubes
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);

    const cubes: THREE.Mesh[] = [];
    const cubeGeo = new THREE.BoxGeometry(2.5, 2.5, 2.5);
    const cubeMaterials = [
      new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true }),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true }),
      new THREE.MeshBasicMaterial({ color: 0x22c55e, wireframe: true }),
    ];

    for (let i = 0; i < 35; i++) {
      const mat = cubeMaterials[i % cubeMaterials.length];
      const mesh = new THREE.Mesh(cubeGeo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 60 + 5,
        (Math.random() - 0.5) * 80
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      cubeGroup.add(mesh);
      cubes.push(mesh);
    }

    // 3. Neon Data Particles / Stardust
    const particleCount = 400;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 160;
      particlePos[i + 1] = (Math.random() - 0.5) * 100;
      particlePos[i + 2] = (Math.random() - 0.5) * 100;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x4ade80,
      size: 0.7,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Tracking Parallax
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow camera drift with mouse parallax
      camera.position.x += (mouseX * 8 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 6 + 15 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      // Rotate microchip cubes
      cubes.forEach((cube, index) => {
        cube.rotation.x += 0.003 * (index % 2 === 0 ? 1 : -1);
        cube.rotation.y += 0.005;
        cube.position.y += Math.sin(elapsedTime + index) * 0.02;
      });

      // Slowly rotate particle field
      particles.rotation.y = elapsedTime * 0.02;

      // Animate cyber grid ground wave
      gridHelper.position.z = (elapsedTime * 6) % 4;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      cubeGeo.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none -z-20 overflow-hidden"
      aria-hidden="true"
    />
  );
};
