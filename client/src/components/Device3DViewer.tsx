import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Cpu, ShieldCheck, Sparkles, Layers, Sliders, Info } from 'lucide-react';
import { soundEffects } from '../utils/sound';

export const Device3DViewer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [explosion, setExplosion] = useState<number>(30); // 0% to 100%
  const [selectedComponent, setSelectedComponent] = useState<string>('cpu');
  const explosionRef = useRef<number>(30);

  // References to meshes for dynamic explosion transformation
  const meshesRef = useRef<{
    cpu?: THREE.Mesh;
    battery?: THREE.Mesh;
    capacitors?: THREE.Mesh[];
    heatsink?: THREE.Mesh;
  }>({});

  useEffect(() => {
    explosionRef.current = explosion;
  }, [explosion]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 340;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 22, 48);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const deviceGroup = new THREE.Group();
    scene.add(deviceGroup);

    // 1. Motherboard Substrate PCB (Base)
    const pcbGeo = new THREE.BoxGeometry(28, 1.2, 20);
    const pcbMat = new THREE.MeshBasicMaterial({ color: 0x064e3b, wireframe: true });
    const pcbMesh = new THREE.Mesh(pcbGeo, pcbMat);
    deviceGroup.add(pcbMesh);

    // 2. CPU Silicon Die with Gold Substrate Pins
    const cpuGeo = new THREE.BoxGeometry(8, 1.6, 8);
    const cpuMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, wireframe: true });
    const cpuMesh = new THREE.Mesh(cpuGeo, cpuMat);
    cpuMesh.position.set(-5, 1.4, -2);
    deviceGroup.add(cpuMesh);
    meshesRef.current.cpu = cpuMesh;

    // 3. Copper Vapor Chamber Heat Pipe
    const heatGeo = new THREE.BoxGeometry(16, 0.8, 4);
    const heatMat = new THREE.MeshBasicMaterial({ color: 0xf97316, wireframe: true });
    const heatsink = new THREE.Mesh(heatGeo, heatMat);
    heatsink.position.set(0, 2.5, -2);
    deviceGroup.add(heatsink);
    meshesRef.current.heatsink = heatsink;

    // 4. Lithium-Cobalt High-Capacity Battery Pack
    const batGeo = new THREE.BoxGeometry(10, 2.5, 14);
    const batMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true });
    const batMesh = new THREE.Mesh(batGeo, batMat);
    batMesh.position.set(7, 1.8, 1);
    deviceGroup.add(batMesh);
    meshesRef.current.battery = batMesh;

    // 5. Array of Rare-Earth Capacitors & Inductors
    const capGeo = new THREE.CylinderGeometry(1.2, 1.2, 3.2, 16);
    const capMat = new THREE.MeshBasicMaterial({ color: 0x22c55e, wireframe: true });
    const caps: THREE.Mesh[] = [];

    for (let i = 0; i < 4; i++) {
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.set(-10 + i * 2.6, 1.8, 6);
      deviceGroup.add(cap);
      caps.push(cap);
    }
    meshesRef.current.capacitors = caps;

    // Drag Interaction
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
      deviceGroup.rotation.y += dx * 0.008;
      deviceGroup.rotation.x += dy * 0.008;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseUp = () => { isDragging = false; };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isDragging) {
        deviceGroup.rotation.y += 0.004;
      }

      // Apply Exploded View Interpolation based on explosionRef
      const factor = explosionRef.current / 100; // 0.0 to 1.0

      if (meshesRef.current.cpu) {
        meshesRef.current.cpu.position.y = 1.4 + factor * 8;
      }
      if (meshesRef.current.heatsink) {
        meshesRef.current.heatsink.position.y = 2.5 + factor * 14;
      }
      if (meshesRef.current.battery) {
        meshesRef.current.battery.position.x = 7 + factor * 8;
        meshesRef.current.battery.position.z = 1 + factor * 6;
      }
      if (meshesRef.current.capacitors) {
        meshesRef.current.capacitors.forEach((c, idx) => {
          c.position.z = 6 + factor * (5 + idx * 2);
          c.position.y = 1.8 + factor * 4;
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

  const componentDetails: Record<string, { title: string; subtitle: string; recovery: string; purity: string }> = {
    cpu: {
      title: 'CPU Silicon & 24k Gold Contact Array',
      subtitle: 'Microprocessor packaging with gold bond wires and palladium trace contacts',
      recovery: '0.22g Au per unit • 99.98% smelting purity yield',
      purity: 'High Rare-Earth Value'
    },
    battery: {
      title: 'Lithium-Nickel-Manganese-Cobalt (NMC) Polymer',
      subtitle: 'Secondary energy storage cell refined via closed-loop hydrometallurgy',
      recovery: '120g Li2CO3 & CoSO4 per pack • 98.1% elemental yield',
      purity: 'Critical Mineral Directive'
    },
    copper: {
      title: 'Multi-layer Sintered Copper Heat Pipe',
      subtitle: 'Deoxidized high-phosphorus pure copper thermal dissipation conduit',
      recovery: '450g Cu per laptop chassis • 100% infinitely recyclable',
      purity: 'Industrial Raw Commodity'
    }
  };

  const currentDetail = componentDetails[selectedComponent] || componentDetails.cpu;

  return (
    <div className="relative rounded-3xl bg-nexus-charcoal/95 border border-slate-800 p-6 shadow-2xl space-y-4">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase font-mono">
              3D Exploded Hardware Assay
            </h4>
            <span className="text-[10px] text-emerald-400 font-mono">Interactive WebGL Disassembly</span>
          </div>
        </div>

        {/* 3D Explode View Slider */}
        <div className="flex items-center space-x-3 bg-nexus-dark px-3 py-1.5 rounded-xl border border-slate-800">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] font-mono text-slate-300">Explode:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={explosion}
            onChange={e => {
              setExplosion(parseInt(e.target.value));
              soundEffects.playClick();
            }}
            className="w-24 accent-emerald-500 h-1.5 bg-slate-800 rounded cursor-pointer"
          />
          <span className="text-[10px] font-mono font-bold text-emerald-400 w-8">{explosion}%</span>
        </div>
      </div>

      {/* 3D Canvas Mount Point */}
      <div
        ref={mountRef}
        className="w-full h-64 sm:h-72 cursor-grab active:cursor-grabbing flex items-center justify-center relative select-none"
      >
        <div className="absolute top-2 right-2 text-[10px] font-mono text-nexus-muted bg-nexus-dark/80 px-2 py-0.5 rounded border border-slate-800">
          ✦ Drag to rotate in 3D
        </div>
      </div>

      {/* Component Layer Buttons */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <button
          onClick={() => { setSelectedComponent('cpu'); soundEffects.playClick(); }}
          className={`p-2 rounded-xl border text-center transition-all ${
            selectedComponent === 'cpu'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
              : 'bg-nexus-dark border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Au/Pd Silicon Die
        </button>

        <button
          onClick={() => { setSelectedComponent('battery'); soundEffects.playClick(); }}
          className={`p-2 rounded-xl border text-center transition-all ${
            selectedComponent === 'battery'
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
              : 'bg-nexus-dark border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Li-Ion Polymer Cell
        </button>

        <button
          onClick={() => { setSelectedComponent('copper'); soundEffects.playClick(); }}
          className={`p-2 rounded-xl border text-center transition-all ${
            selectedComponent === 'copper'
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
              : 'bg-nexus-dark border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Copper Heatpipe Bus
        </button>
      </div>

      {/* Selected Component Technical Callout */}
      <div className="p-3.5 rounded-xl bg-nexus-dark/90 border border-slate-800 text-xs space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white">{currentDetail.title}</span>
          <span className="text-[10px] font-mono text-emerald-400 uppercase">{currentDetail.purity}</span>
        </div>
        <p className="text-[11px] text-slate-400">{currentDetail.subtitle}</p>
        <div className="text-[10px] text-cyan-300 font-mono pt-1">
          ✓ Assay Metric: {currentDetail.recovery}
        </div>
      </div>
    </div>
  );
};
