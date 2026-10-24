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
      new THREE.MeshBasicMaterial({ color: 0x22c55e, wireframe: true })
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
      particlePos[i + 1] = (Math.random() - 0.5) * 80;
      particlePos[i + 2] = (Math.random() - 0.5) * 120;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 1.5,
      transparent: true,
      opacity: 0.6
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow camera sway
      camera.position.x += (mouseX * 8 - camera.position.x) * 0.03;
      camera.position.y += (mouseY * 4 + 15 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      // Rotate cubes
      cubes.forEach((c, idx) => {
        c.rotation.x += 0.008 + (idx % 3) * 0.003;
        c.rotation.y += 0.012;
        c.position.y += Math.sin(elapsedTime + idx) * 0.03;
      });

      // Scroll grid forward to create endless flight
      gridHelper.position.z = (elapsedTime * 6) % 4;

      particles.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const newW = window.innerWidth;
      const newH = window.innerHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
    />
  );
};
