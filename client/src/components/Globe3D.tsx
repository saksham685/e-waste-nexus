import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const Globe3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch (e) {
      setHasWebGL(false);
      return;
    }

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 550;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group to hold globe and orbits
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Core Globe Wireframe / Sphere
    const sphereRadius = 75;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 36, 36);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x071e16,
      wireframe: true,
      transparent: true,
      opacity: 0.28
    });
    const globeSphere = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(globeSphere);

    // Inner glowing dark sphere
    const innerGeo = new THREE.SphereGeometry(sphereRadius - 1.5, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x03100c,
      transparent: true,
      opacity: 0.85
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    globeGroup.add(innerSphere);

    // 2. Glowing Nodes on surface (Recycling Hubs & Clean Tech Cities)
    const hubCoords = [
      { lat: 37.77, lon: -122.41, name: 'Silicon Valley Hub' },
      { lat: 40.71, lon: -74.00, name: 'New York Depot' },
      { lat: 51.50, lon: -0.12, name: 'London Circular' },
      { lat: 35.67, lon: 139.65, name: 'Tokyo Rare-Metals' },
      { lat: 1.35, lon: 103.81, name: 'Singapore CleanTech' },
      { lat: -1.29, lon: 36.82, name: 'Nairobi WEEE Center' },
      { lat: 52.52, lon: 13.40, name: 'Berlin Smelting Plant' },
      { lat: 28.61, lon: 77.20, name: 'New Delhi E-Depot' },
      { lat: -33.86, lon: 151.20, name: 'Sydney Pacific Hub' }
    ];

    function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    }

    const nodeVectors: THREE.Vector3[] = [];
    const nodeGeometry = new THREE.SphereGeometry(1.6, 12, 12);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x4ade80 });

    hubCoords.forEach(hub => {
      const v = latLonToVector3(hub.lat, hub.lon, sphereRadius);
      nodeVectors.push(v);
      const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
      nodeMesh.position.copy(v);
      globeGroup.add(nodeMesh);

      // Outer pulse halo around node
      const haloGeo = new THREE.RingGeometry(2.2, 3.4, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0x22c55e,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.position.copy(v);
      haloMesh.lookAt(new THREE.Vector3(0, 0, 0));
      globeGroup.add(haloMesh);
    });

    // 3. Illuminated Recycling Routes (Curved Geodesic Arcs)
    const arcPairs = [
      [0, 1], [0, 3], [1, 2], [2, 6], [3, 4], [4, 7], [4, 8], [6, 7], [7, 5]
    ];

    arcPairs.forEach(([i1, i2]) => {
      const v1 = nodeVectors[i1];
      const v2 = nodeVectors[i2];
      const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
      const distance = v1.distanceTo(v2);
      mid.normalize().multiplyScalar(sphereRadius + distance * 0.28);

      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      const points = curve.getPoints(40);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: 0x22c55e,
        transparent: true,
        opacity: 0.75,
        linewidth: 1.5
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      globeGroup.add(arcLine);
    });

    // 4. Floating Electronic Microchip / Component Objects in Orbit
    const chipGroup = new THREE.Group();
    globeGroup.add(chipGroup);

    const chipGeo = new THREE.BoxGeometry(4.5, 4.5, 1.2);
    const chipMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true
    });

    const numChips = 8;
    const chips: THREE.Mesh[] = [];
    for (let i = 0; i < numChips; i++) {
      const chip = new THREE.Mesh(chipGeo, chipMat);
      const angle = (i / numChips) * Math.PI * 2;
      const r = sphereRadius + 18 + (i % 3) * 6;
      chip.position.set(Math.cos(angle) * r, Math.sin(angle) * (r * 0.4), Math.sin(angle) * r * 0.8);
      chip.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      chipGroup.add(chip);
      chips.push(chip);
    }

    // 5. Ambient Stardust / Particle Swarm
    const particleCount = 280;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const r = sphereRadius + 30 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      particlePositions[i] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = r * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 1.8,
      transparent: true,
      opacity: 0.65
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Interaction for subtle parallax and manual rotation
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isDragging) {
        globeGroup.rotation.y += 0.0028;
        globeGroup.rotation.x = Math.sin(Date.now() * 0.0004) * 0.1;
      }

      particles.rotation.y += 0.0006;
      chipGroup.rotation.y -= 0.004;

      chips.forEach((c, idx) => {
        c.rotation.x += 0.01 + idx * 0.002;
        c.rotation.y += 0.015;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      className="relative w-full h-[450px] md:h-[550px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-radial from-emerald-500/10 via-emerald-950/20 to-transparent pointer-events-none rounded-full blur-3xl" />

      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Static Fallback if WebGL is unsupported */}
      {!hasWebGL && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-56 h-56 rounded-full border-2 border-emerald-500/40 bg-emerald-950/40 flex items-center justify-center shadow-glow-green animate-pulse-slow">
            <div className="w-44 h-44 rounded-full border border-dashed border-emerald-400/60 flex items-center justify-center">
              <span className="text-emerald-400 font-mono text-sm">GLOBAL CIRCULAR NEXUS</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-nexus-muted">Hardware acceleration disabled. Standard display fallback active.</p>
        </div>
      )}

      {/* Interactive Drag Hint */}
      <div className={`absolute bottom-3 right-4 px-3 py-1 rounded-full bg-slate-900/80 border border-emerald-500/20 text-[11px] text-emerald-400/80 backdrop-blur transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-60'}`}>
        ✦ Drag to rotate Earth & nodes
      </div>
    </div>
  );
};
