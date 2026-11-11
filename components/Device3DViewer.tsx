'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Cpu, Sliders, RotateCw, Sparkles, Layers, ShieldCheck, Zap } from 'lucide-react';

export const Device3DViewer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [explosion, setExplosion] = useState<number>(35); // 0% to 100%
  const [selectedComponent, setSelectedComponent] = useState<string>('cpu');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const explosionRef = useRef<number>(35);
  const autoRotateRef = useRef<boolean>(true);

  const meshesRef = useRef<{
    chassis?: THREE.Mesh;
    pcb?: THREE.Mesh;
    cpu?: THREE.Mesh;
    heatsink?: THREE.Mesh;
    battery?: THREE.Mesh;
    ram?: THREE.Mesh;
    capacitors?: THREE.Mesh[];
  }>({});

  useEffect(() => {
    explosionRef.current = explosion;
  }, [explosion]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 550;
    const height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 26, 52);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Studio Lighting for High-End Photorealism
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(20, 40, 30);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.0); // Soft cyan fill
    fillLight.position.set(-20, 20, -20);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x10b981, 2.5, 80); // Emerald rim highlight
    rimLight.position.set(0, -10, -25);
    scene.add(rimLight);

    const deviceGroup = new THREE.Group();
    scene.add(deviceGroup);

    // 1. Titanium / Aluminum Bottom Unibody Chassis
    const chassisGeo = new THREE.BoxGeometry(32, 1.5, 22);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x18181b, // Deep matte titanium
      metalness: 0.85,
      roughness: 0.35,
    });
    const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
    chassisMesh.position.set(0, -2, 0);
    deviceGroup.add(chassisMesh);
    meshesRef.current.chassis = chassisMesh;

    // 2. Multilayer Glass-Fiber Motherboard PCB (Dark Emerald Substrate)
    const pcbGeo = new THREE.BoxGeometry(30, 0.9, 20);
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b, // Rich PCB green
      metalness: 0.3,
      roughness: 0.4,
    });
    const pcbMesh = new THREE.Mesh(pcbGeo, pcbMat);
    deviceGroup.add(pcbMesh);
    meshesRef.current.pcb = pcbMesh;

    // 3. Central CPU Processor with Gold Substrate & Heat-Spreader
    const cpuGeo = new THREE.BoxGeometry(8, 1.4, 8);
    const cpuMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // 24K Gold sheen
      metalness: 0.9,
      roughness: 0.15,
    });
    const cpuMesh = new THREE.Mesh(cpuGeo, cpuMat);
    cpuMesh.position.set(-5, 1.2, -2);
    deviceGroup.add(cpuMesh);
    meshesRef.current.cpu = cpuMesh;

    // 4. Pure Sintered Copper Heat Pipe Conduit
    const heatGeo = new THREE.BoxGeometry(18, 0.7, 3.5);
    const heatMat = new THREE.MeshStandardMaterial({
      color: 0xb45309, // Pure refined copper
      metalness: 0.92,
      roughness: 0.2,
    });
    const heatsink = new THREE.Mesh(heatGeo, heatMat);
    heatsink.position.set(0, 2.2, -2);
    deviceGroup.add(heatsink);
    meshesRef.current.heatsink = heatsink;

    // 5. High-Density Lithium-Cobalt Polymer Battery Pack
    const batGeo = new THREE.BoxGeometry(11, 2.2, 14);
    const batMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Slate obsidian polymer
      metalness: 0.6,
      roughness: 0.4,
    });
    const batMesh = new THREE.Mesh(batGeo, batMat);
    batMesh.position.set(7.5, 1.4, 1.5);
    deviceGroup.add(batMesh);
    meshesRef.current.battery = batMesh;

    // 6. Dual RAM Memory Modules with Gold Pins
    const ramGeo = new THREE.BoxGeometry(10, 0.8, 3.2);
    const ramMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // High-performance blue
      metalness: 0.7,
      roughness: 0.25,
    });
    const ramMesh = new THREE.Mesh(ramGeo, ramMat);
    ramMesh.position.set(-5, 1.2, 5.5);
    deviceGroup.add(ramMesh);
    meshesRef.current.ram = ramMesh;

    // 7. Rare-Earth Tantalum & Electrolytic Capacitors
    const capGeo = new THREE.CylinderGeometry(1.0, 1.0, 2.8, 16);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0x10b981, // Emerald green casing
      metalness: 0.75,
      roughness: 0.3,
    });
    const caps: THREE.Mesh[] = [];

    for (let i = 0; i < 4; i++) {
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.set(-11 + i * 2.6, 1.6, -7);
      deviceGroup.add(cap);
      caps.push(cap);
    }
    meshesRef.current.capacitors = caps;

    // Mouse / Touch Drag Orbit Interaction
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      deviceGroup.rotation.y += dx * 0.007;
      deviceGroup.rotation.x += dy * 0.007;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isDragging && autoRotateRef.current) {
        deviceGroup.rotation.y += 0.0035;
      }

      const factor = explosionRef.current / 100;

      // Smooth 3D Layer Explosion
      if (meshesRef.current.chassis) {
        meshesRef.current.chassis.position.y = -2 - factor * 8;
      }
      if (meshesRef.current.pcb) {
        meshesRef.current.pcb.position.y = 0;
      }
      if (meshesRef.current.cpu) {
        meshesRef.current.cpu.position.y = 1.2 + factor * 9;
      }
      if (meshesRef.current.heatsink) {
        meshesRef.current.heatsink.position.y = 2.2 + factor * 16;
      }
      if (meshesRef.current.battery) {
        meshesRef.current.battery.position.x = 7.5 + factor * 9;
        meshesRef.current.battery.position.z = 1.5 + factor * 7;
        meshesRef.current.battery.position.y = 1.4 + factor * 4;
      }
      if (meshesRef.current.ram) {
        meshesRef.current.ram.position.y = 1.2 + factor * 6;
        meshesRef.current.ram.position.z = 5.5 + factor * 6;
      }
      if (meshesRef.current.capacitors) {
        meshesRef.current.capacitors.forEach((c, idx) => {
          c.position.y = 1.6 + factor * 5;
          c.position.z = -7 - factor * (4 + idx * 1.5);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const componentDetails: Record<
    string,
    { title: string; subtitle: string; recovery: string; purity: string; valueRate: string }
  > = {
    cpu: {
      title: 'Silicon Core & 24K Gold Wire Bondings',
      subtitle: 'Microprocessor packaging with gold substrate pins, copper slug, and palladium traces',
      recovery: '0.24g Pure Gold (Au) per unit • 99.98% Smelter Yield',
      purity: 'High Rare-Earth Yield',
      valueRate: '₹2,120 / unit recovered value',
    },
    battery: {
      title: 'Lithium-Nickel-Manganese-Cobalt (NMC)',
      subtitle: 'Secondary energy storage cell refined via closed-loop hydrometallurgical leaching',
      recovery: '120g Refined Cobalt (Co) & Lithium Carbonate (Li2CO3)',
      purity: 'Critical Mineral Standard',
      valueRate: '₹480 / pack raw assay yield',
    },
    copper: {
      title: 'Grade-A Deoxidized Sintered Copper Heat Pipe',
      subtitle: 'High-thermal conductivity sintered powder capillary heat dissipation conduit',
      recovery: '450g Pure Electrolytic Copper (Cu) • 100% Infinitely Recyclable',
      purity: 'Industrial Commodity',
      valueRate: '₹402 / chassis recovered value',
    },
    pcb: {
      title: 'Multilayer FR-4 Substrate with Palladium Rails',
      subtitle: 'Printed circuit board containing tin-lead solder, fiberglass, and precious metal surface finishes',
      recovery: '1.2 kg Mixed High-Grade Base & Precious Scrap per motherboard',
      purity: 'CPCB Category-1 Recyclable',
      valueRate: '₹650 / board manifest rate',
    },
  };

  const currentDetail = componentDetails[selectedComponent] || componentDetails.cpu;

  return (
    <div className="relative rounded-3xl bg-zinc-950/80 border border-zinc-800/80 p-6 shadow-2xl space-y-4 backdrop-blur-xl">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              3D Hardware Deconstruction Lab
            </h3>
            <p className="text-[11px] text-zinc-400">
              Interactive WebGL Component &amp; Rare-Metal Assay
            </p>
          </div>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border flex items-center space-x-1.5 transition-colors cursor-pointer ${
              autoRotate
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <RotateCw className={`w-3 h-3 ${autoRotate ? 'animate-spin-slow' : ''}`} />
            <span>{autoRotate ? 'Rotating' : 'Paused'}</span>
          </button>

          <button
            type="button"
            onClick={() => setExplosion(explosion > 50 ? 10 : 80)}
            className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            {explosion > 50 ? 'Assemble' : 'Explode 3D'}
          </button>
        </div>
      </div>

      {/* 3D Canvas Mounting Container */}
      <div className="relative w-full h-[320px] sm:h-[350px] rounded-2xl overflow-hidden bg-gradient-to-b from-zinc-900/40 via-zinc-950 to-zinc-950 border border-zinc-800/60 cursor-grab active:cursor-grabbing">
        <div ref={mountRef} className="w-full h-full" />

        {/* Top-Right Floating Hint */}
        <div className="absolute top-3 right-3 text-[10px] font-mono text-zinc-500 bg-zinc-950/80 px-2.5 py-1 rounded-md border border-zinc-800 pointer-events-none backdrop-blur-sm">
          Drag to Orbit 360°
        </div>

        {/* Bottom Floating Value Badge */}
        <div className="absolute bottom-3 left-3 bg-zinc-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-800 flex items-center space-x-2 pointer-events-none">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-semibold text-white font-mono">{currentDetail.valueRate}</span>
        </div>
      </div>

      {/* Explosion Separation Slider */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400 flex items-center space-x-1.5">
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span>Layer Separation Distance:</span>
          </span>
          <span className="font-mono text-emerald-400 font-bold">{explosion}% Exploded</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={explosion}
          onChange={(e) => setExplosion(Number(e.target.value))}
          className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
      </div>

      {/* Component Selector Buttons */}
      <div className="grid grid-cols-4 gap-2 pt-1">
        {[
          { id: 'cpu', label: 'Gold CPU', icon: 'Au' },
          { id: 'battery', label: 'Lithium Pack', icon: 'Li' },
          { id: 'copper', label: 'Copper Pipe', icon: 'Cu' },
          { id: 'pcb', label: 'FR-4 PCB', icon: 'PCB' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedComponent(item.id)}
            className={`py-2 px-2 rounded-xl text-center border text-xs font-semibold transition-all cursor-pointer ${
              selectedComponent === item.id
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-sm'
                : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            <span className="block font-mono text-[10px] text-zinc-500">{item.icon}</span>
            <span className="truncate block mt-0.5">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Active Component Assay Inspector Card */}
      <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white">{currentDetail.title}</h4>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            {currentDetail.purity}
          </span>
        </div>
        <p className="text-[11px] text-zinc-400 leading-relaxed font-light">{currentDetail.subtitle}</p>
        <div className="pt-1 flex items-center space-x-1.5 text-xs text-amber-300 font-mono font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{currentDetail.recovery}</span>
        </div>
      </div>
    </div>
  );
};
