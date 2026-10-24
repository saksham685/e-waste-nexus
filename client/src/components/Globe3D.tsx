import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface CityHub {
  name: string;
  lat: number;
  lon: number;
  capacity: string;
  country: string;
}

const CITY_HUBS: CityHub[] = [
  { name: 'Silicon Valley Hub', lat: 37.77, lon: -122.41, capacity: '4,200 tons/yr', country: 'United States' },
  { name: 'New York Vault', lat: 40.71, lon: -74.00, capacity: '3,800 tons/yr', country: 'United States' },
  { name: 'London Circular Depot', lat: 51.50, lon: -0.12, capacity: '2,900 tons/yr', country: 'United Kingdom' },
  { name: 'Berlin Smelting Works', lat: 52.52, lon: 13.40, capacity: '3,400 tons/yr', country: 'Germany' },
  { name: 'Tokyo Rare-Metals Plant', lat: 35.67, lon: 139.65, capacity: '5,100 tons/yr', country: 'Japan' },
  { name: 'Singapore CleanTech Terminal', lat: 1.35, lon: 103.81, capacity: '3,100 tons/yr', country: 'Singapore' },
  { name: 'New Delhi E-Depository', lat: 28.61, lon: 77.20, capacity: '4,800 tons/yr', country: 'India' },
  { name: 'Nairobi WEEE Center', lat: -1.29, lon: 36.82, capacity: '1,700 tons/yr', country: 'Kenya' },
  { name: 'Sydney Pacific Hub', lat: -33.86, lon: 151.20, capacity: '2,200 tons/yr', country: 'Australia' },
  { name: 'São Paulo Eco-Vault', lat: -23.55, lon: -46.63, capacity: '1,900 tons/yr', country: 'Brazil' }
];

export const Globe3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredHub, setHoveredHub] = useState<CityHub | null>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    try {
      const canvas = document.createElement('canvas');
      const gl = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      if (!gl) { setHasWebGL(false); return; }
    } catch (e) {
      setHasWebGL(false); return;
    }

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 550;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const sphereRadius = 75;

    // Helper: lat/lon to 3D vector
    function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    }

    // 1. Dark Core Globe & Wireframe Sphere
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 40, 40);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x064e3b,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    });
    const globeSphere = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(globeSphere);

    const innerGeo = new THREE.SphereGeometry(sphereRadius - 1.2, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x03100c,
      transparent: true,
      opacity: 0.90
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    globeGroup.add(innerSphere);

    // 2. Realistic Continent Point Matrix (Procedural clusters around real world landmasses)
    const continentPoints: THREE.Vector3[] = [];
    const landmassRegions = [
      { minLat: 25, maxLat: 60, minLon: -125, maxLon: -70, count: 280 }, // North America
      { minLat: -45, maxLat: 10, minLon: -75, maxLon: -35, count: 180 },  // South America
      { minLat: 36, maxLat: 65, minLon: -10, maxLon: 45, count: 260 },   // Europe
      { minLat: -30, maxLat: 35, minLon: -15, maxLon: 50, count: 240 },  // Africa
      { minLat: 10, maxLat: 65, minLon: 60, maxLon: 140, count: 420 },   // Asia
      { minLat: -40, maxLat: -12, minLon: 115, maxLon: 155, count: 140 } // Australia
    ];

    landmassRegions.forEach(reg => {
      for (let i = 0; i < reg.count; i++) {
        const lat = reg.minLat + Math.random() * (reg.maxLat - reg.minLat);
        const lon = reg.minLon + Math.random() * (reg.maxLon - reg.minLon);
        continentPoints.push(latLonToVector3(lat, lon, sphereRadius + 0.3));
      }
    });

    const continentGeo = new THREE.BufferGeometry().setFromPoints(continentPoints);
    const continentMat = new THREE.PointsMaterial({
      color: 0x10b981,
      size: 1.4,
      transparent: true,
      opacity: 0.55
    });
    const continentPointCloud = new THREE.Points(continentGeo, continentMat);
    globeGroup.add(continentPointCloud);

    // 3. City Hub Nodes
    const hubVectors: THREE.Vector3[] = [];
    const nodeGeo = new THREE.SphereGeometry(1.8, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x4ade80 });

    CITY_HUBS.forEach(hub => {
      const v = latLonToVector3(hub.lat, hub.lon, sphereRadius);
      hubVectors.push(v);

      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(v);
      globeGroup.add(nodeMesh);

      // Pulsing outer ring
      const ringGeo = new THREE.RingGeometry(2.4, 3.8, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x22c55e,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(v);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
      globeGroup.add(ringMesh);
    });

    // 4. Geodesic Recycling Arcs & Dynamic Moving Light Packets
    const arcCurves: THREE.QuadraticBezierCurve3[] = [];
    const lightPackets: { mesh: THREE.Mesh; curveIndex: number; progress: number; speed: number }[] = [];
    const lightGeo = new THREE.SphereGeometry(1.2, 8, 8);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xecfdf5 });

    const arcPairs = [
      [0, 1], [0, 4], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 0]
    ];

    arcPairs.forEach(([i1, i2], idx) => {
      const v1 = hubVectors[i1];
      const v2 = hubVectors[i2];
      const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
      const dist = v1.distanceTo(v2);
      mid.normalize().multiplyScalar(sphereRadius + dist * 0.28);

      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      arcCurves.push(curve);

      const points = curve.getPoints(45);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: 0x22c55e,
        transparent: true,
        opacity: 0.65
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      globeGroup.add(arcLine);

      // Add a moving photon packet on each arc
      const packet = new THREE.Mesh(lightGeo, lightMat);
      globeGroup.add(packet);
      lightPackets.push({
        mesh: packet,
        curveIndex: idx,
        progress: Math.random(),
        speed: 0.004 + Math.random() * 0.003
      });
    });

    // 5. Orbiting Satellites with Solar Panels
    const satelliteGroup = new THREE.Group();
    globeGroup.add(satelliteGroup);

    const satBodyGeo = new THREE.BoxGeometry(2, 2, 2);
    const satWingGeo = new THREE.BoxGeometry(6, 0.4, 1.8);
    const satMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const wingMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    for (let i = 0; i < 4; i++) {
      const sat = new THREE.Group();
      const body = new THREE.Mesh(satBodyGeo, satMat);
      const wing = new THREE.Mesh(satWingGeo, wingMat);
      sat.add(body);
      sat.add(wing);

      const angle = (i / 4) * Math.PI * 2;
      const r = sphereRadius + 26;
      sat.position.set(Math.cos(angle) * r, Math.sin(angle) * 18, Math.sin(angle) * r);
      sat.lookAt(0, 0, 0);
      satelliteGroup.add(sat);
    }

    // Mouse Interaction
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

    const handleMouseUp = () => { isDragging = false; };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isDragging) {
        globeGroup.rotation.y += 0.0024;
        globeGroup.rotation.x = Math.sin(Date.now() * 0.0003) * 0.08;
      }

      satelliteGroup.rotation.y -= 0.003;

      // Move light packets along curves
      lightPackets.forEach(lp => {
        lp.progress = (lp.progress + lp.speed) % 1;
        const curve = arcCurves[lp.curveIndex];
        const pt = curve.getPoint(lp.progress);
        lp.mesh.position.copy(pt);
      });

      renderer.render(scene, camera);
    };

    animate();

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
      cancelAnimationFrame(animId);
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
    <div className="relative w-full h-[450px] md:h-[550px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none">
      <div className="absolute inset-0 bg-radial from-emerald-500/10 via-emerald-950/20 to-transparent pointer-events-none rounded-full blur-3xl" />

      <div ref={mountRef} className="w-full h-full" />

      {/* Floating Interactive Hubs Quick Selector Bar */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] pointer-events-auto">
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1 max-w-full">
          {CITY_HUBS.slice(0, 4).map((hub, idx) => (
            <button
              key={idx}
              onClick={() => setHoveredHub(hub)}
              className="px-2.5 py-1 rounded-full bg-nexus-charcoal/90 border border-slate-700 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/60 font-mono text-[10px] whitespace-nowrap transition-colors"
            >
              ◉ {hub.name}
            </button>
          ))}
        </div>

        <div className="hidden sm:block text-[10px] font-mono text-emerald-400/80 bg-nexus-dark/80 px-2.5 py-1 rounded-full border border-slate-800 shrink-0 ml-2">
          ✦ Drag to rotate 3D Earth
        </div>
      </div>

      {/* City Hub Tooltip Overlay */}
      {hoveredHub && (
        <div className="absolute top-4 left-4 p-3 rounded-xl bg-nexus-charcoal/95 border border-emerald-500/50 shadow-2xl backdrop-blur-md text-xs space-y-1 animate-in fade-in z-20 max-w-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white">{hoveredHub.name}</span>
            <button onClick={() => setHoveredHub(null)} className="text-slate-500 hover:text-white ml-2">✕</button>
          </div>
          <div className="text-[10px] text-emerald-400 font-mono">{hoveredHub.country}</div>
          <div className="text-[10px] text-slate-300">Annual Processing Capacity: {hoveredHub.capacity}</div>
        </div>
      )}
    </div>
  );
};
