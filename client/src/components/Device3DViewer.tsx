import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Cpu, ShieldCheck, Sparkles, RotateCcw } from 'lucide-react';

export const Device3DViewer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeLayer, setActiveLayer] = useState<'all' | 'gold' | 'battery' | 'pcb'>('all');

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 18, 42);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const deviceGroup = new THREE.Group();
    scene.add(deviceGroup);

    // 1. Motherboard PCB
    const pcbGeo = new THREE.BoxGeometry(26, 1.2, 18);
    const pcbMat = new THREE.MeshBasicMaterial({ color: 0x064e3b, wireframe: true });
    const pcbMesh = new THREE.Mesh(pcbGeo, pcbMat);
    deviceGroup.add(pcbMesh);

    // 2. CPU Silicon Die with Gold Heat Spreader
    const cpuGeo = new THREE.BoxGeometry(7, 1.4, 7);
    const cpuMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, wireframe: true });
    const cpuMesh = new THREE.Mesh(cpuGeo, cpuMat);
    cpuMesh.position.set(-4, 1.3, -2);
    deviceGroup.add(cpuMesh);

    // 3. Lithium-Ion Battery Pack Module
    const batGeo = new THREE.BoxGeometry(9, 2.2, 13);
    const batMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true });
    const batMesh = new THREE.Mesh(batGeo, batMat);
    batMesh.position.set(6, 1.6, 0);
    deviceGroup.add(batMesh);

    // 4. Memory Capacitors & Rare-Earth Inductors
    const capGeo = new THREE.CylinderGeometry(1, 1, 3, 12);
    const capMat = new THREE.MeshBasicMaterial({ color: 0x22c55e, wireframe: true });

    for (let i = 0; i < 4; i++) {
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.set(-9 + i * 2.2, 1.5, 5);
      deviceGroup.add(cap);
    }

    // Interactive Drag to Rotate
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
      deviceGroup.rotation.y += dx * 0.01;
      deviceGroup.rotation.x += dy * 0.01;
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
        deviceGroup.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative rounded-2xl bg-nexus-charcoal/90 border border-slate-800 p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
          <Cpu className="w-4 h-4" />
          <span>3D Hardware Assay Decomposition</span>
        </div>
        <span className="text-[10px] text-nexus-muted font-mono">Interactive Drag to Rotate</span>
      </div>

      <div ref={mountRef} className="w-full h-56 cursor-grab active:cursor-grabbing flex items-center justify-center" />

      <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800 text-[10px] font-mono">
        <div className="p-1.5 rounded bg-nexus-dark text-amber-300 border border-amber-500/20 text-center">
          Au/Pd Contact Pins
        </div>
        <div className="p-1.5 rounded bg-nexus-dark text-cyan-300 border border-cyan-500/20 text-center">
          Li/Co Polymer Cell
        </div>
        <div className="p-1.5 rounded bg-nexus-dark text-emerald-300 border border-emerald-500/20 text-center">
          Cu/Al Trace Bus
        </div>
      </div>
    </div>
  );
};
