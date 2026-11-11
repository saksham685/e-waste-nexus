'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Truck,
  MapPin,
  Phone,
  ShieldCheck,
  Clock,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  Key,
} from 'lucide-react';
import { soundEffects } from '@/lib/sound';
import { voiceAssistant } from '@/lib/voiceAssistant';

interface DriverRouteSimulatorProps {
  pickupId: string;
  address: string;
  driverName?: string;
  vehicleNumber?: string;
  otpCode: string;
}

export const DriverRouteSimulator: React.FC<DriverRouteSimulatorProps> = ({
  pickupId,
  address,
  driverName = 'Rajesh Sharma',
  vehicleNumber = 'DL-12-EA-9821',
  otpCode,
}) => {
  const [progress, setProgress] = useState<number>(35); // 0% to 100%
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [hasArrived, setHasArrived] = useState<boolean>(false);

  // Live distance and ETA calculations using useMemo (Syllabus: React hooks & memoization)
  const routeTelemetry = useMemo(() => {
    const totalDistanceKm = 5.6;
    const remainingKm = Math.max(0, Math.round((totalDistanceKm * (1 - progress / 100)) * 10) / 10);
    const etaMinutes = Math.max(0, Math.round(remainingKm * 3.2));

    return {
      totalDistanceKm,
      remainingKm,
      etaMinutes,
      statusText:
        progress >= 100
          ? 'Vehicle Arrived at Doorstep!'
          : progress >= 75
          ? 'Approaching your sector gate'
          : progress >= 40
          ? 'En route via Outer Ring Road'
          : 'Departed from Apex Logistics Hub #04',
    };
  }, [progress]);

  // Animated progress timer (Syllabus: useEffect side effects with cleanup)
  useEffect(() => {
    if (!isSimulating || progress >= 100) {
      if (progress >= 100 && !hasArrived) {
        setHasArrived(true);
        soundEffects.playSuccess();
        voiceAssistant.speak('Logistics fleet van has arrived at your doorstep. Please share your handover PIN.');
      }
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1.5 * speedMultiplier;
        return next >= 100 ? 100 : next;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isSimulating, progress, speedMultiplier, hasArrived]);

  const handleFastForward = () => {
    soundEffects.playClick();
    setProgress(95);
    setIsSimulating(true);
  };

  const handleReset = () => {
    soundEffects.playClick();
    setProgress(15);
    setHasArrived(false);
    setIsSimulating(true);
  };

  // SVG coordinates along a bezier curve
  // Start: (40, 200), Waypoint 1: (180, 70), Waypoint 2: (340, 250), End: (520, 90)
  const t = progress / 100;
  // Cubic Bezier formula: B(t) = (1-t)^3*P0 + 3(1-t)^2*t*P1 + 3(1-t)*t^2*P2 + t^3*P3
  const p0 = { x: 50, y: 190 };
  const p1 = { x: 190, y: 60 };
  const p2 = { x: 330, y: 260 };
  const p3 = { x: 510, y: 90 };

  const vanX =
    Math.pow(1 - t, 3) * p0.x +
    3 * Math.pow(1 - t, 2) * t * p1.x +
    3 * (1 - t) * Math.pow(t, 2) * p2.x +
    Math.pow(t, 3) * p3.x;

  const vanY =
    Math.pow(1 - t, 3) * p0.y +
    3 * Math.pow(1 - t, 2) * t * p1.y +
    3 * (1 - t) * Math.pow(t, 2) * p2.y +
    Math.pow(t, 3) * p3.y;

  return (
    <div className="bg-nexus-card border-2 border-cyan-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">
            <Navigation className="w-3.5 h-3.5 animate-pulse" />
            <span>Live Doorstep Route Telemetry &bull; GPS Active</span>
          </div>
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <span>Fleet Dispatched &bull; Handover Tracking</span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Consignment #{pickupId.slice(-8)} &bull; Real-time vehicle telemetry
          </p>
        </div>

        {/* Speed / Fast Forward simulator controls */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleFastForward}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-mono border border-cyan-500/40 flex items-center space-x-1 cursor-pointer"
            title="Fast forward route simulation"
          >
            <Play className="w-3 h-3" />
            <span>Fast Forward</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-500/40 text-gray-400 hover:text-white cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Map Visualizer Canvas */}
      <div className="relative w-full h-64 sm:h-72 rounded-2xl bg-slate-950 border border-cyan-500/30 overflow-hidden shadow-inner flex flex-col justify-between p-4">
        {/* Subtle Map Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#082f4915_1px,transparent_1px),linear-gradient(to_bottom,#082f4915_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

        {/* Ambient road glows */}
        <svg
          viewBox="0 0 560 280"
          className="absolute inset-0 w-full h-full preserve-3d"
          fill="none"
        >
          {/* Background route track (gray) */}
          <path
            d="M 50 190 C 190 60, 330 260, 510 90"
            stroke="#1e293b"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Dotted center lane */}
          <path
            d="M 50 190 C 190 60, 330 260, 510 90"
            stroke="#334155"
            strokeWidth="2"
            strokeDasharray="6 8"
            strokeLinecap="round"
          />

          {/* Active completed route (cyan glowing) */}
          <path
            d="M 50 190 C 190 60, 330 260, 510 90"
            stroke="#06b6d4"
            strokeWidth="6"
            strokeDasharray="600"
            strokeDashoffset={600 - (600 * progress) / 100}
            strokeLinecap="round"
            className="transition-all duration-300"
            style={{
              filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.8))',
            }}
          />

          {/* Origin: Logistics Hub Node */}
          <circle cx="50" cy="190" r="14" fill="#0f172a" stroke="#06b6d4" strokeWidth="3" />
          <circle cx="50" cy="190" r="6" fill="#06b6d4" />
          <text x="30" y="225" fill="#94a3b8" fontSize="10" fontFamily="monospace" fontWeight="bold">
            Apex Hub #04
          </text>

          {/* Destination: Citizen Doorstep Node */}
          <circle cx="510" cy="90" r="16" fill="#0f172a" stroke="#10b981" strokeWidth="3" />
          <circle cx="510" cy="90" r="7" fill="#10b981" />
          <text x="440" y="65" fill="#34d399" fontSize="10" fontFamily="monospace" fontWeight="bold">
            Your Doorstep
          </text>

          {/* Dynamic Moving Logistics Van Node */}
          <g transform={`translate(${vanX - 16}, ${vanY - 16})`}>
            {/* Pulsing beacon */}
            <circle cx="16" cy="16" r="22" fill="#06b6d4" opacity="0.25" className="animate-ping" />
            <circle cx="16" cy="16" r="16" fill="#0891b2" stroke="#ffffff" strokeWidth="2" />
            {/* Van icon indicator */}
            <circle cx="16" cy="16" r="8" fill="#ffffff" />
          </g>
        </svg>

        {/* Live floating HUD card */}
        <div className="relative z-10 self-start p-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 text-xs font-mono space-y-1 shadow-lg">
          <div className="flex items-center space-x-1.5 text-cyan-300 font-bold">
            <Navigation className="w-3.5 h-3.5 animate-spin" />
            <span>{routeTelemetry.statusText}</span>
          </div>
          <div className="text-[11px] text-gray-400">
            Destination: <span className="text-white truncate max-w-xs">{address}</span>
          </div>
        </div>

        {/* Live ETA Ticker Bottom HUD */}
        <div className="relative z-10 self-end flex items-center space-x-3 p-3 rounded-xl bg-slate-950/90 backdrop-blur-md border border-emerald-500/40 text-xs font-mono shadow-lg">
          <div>
            <span className="text-gray-400 block text-[9px] uppercase">ESTIMATED ARRIVAL</span>
            <span className="text-lg font-black text-emerald-400">
              {progress >= 100 ? 'ARRIVED NOW' : `${routeTelemetry.etaMinutes} mins`}
            </span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div>
            <span className="text-gray-400 block text-[9px] uppercase">DISTANCE</span>
            <span className="text-sm font-bold text-cyan-300">
              {progress >= 100 ? '0.0 km' : `${routeTelemetry.remainingKm} km`}
            </span>
          </div>
        </div>
      </div>

      {/* Driver Card & Doorstep Handover PIN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Driver Details */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-lg">
              {driverName.charAt(0)}
            </div>
            <div>
              <div className="text-xs font-mono text-gray-400">ASSIGNED FLEET OPERATOR</div>
              <div className="text-sm font-bold text-white">{driverName}</div>
              <div className="text-[11px] font-mono text-cyan-300">
                Reg: <strong>{vehicleNumber}</strong> &bull; 4.9★ (384 Pickups)
              </div>
            </div>
          </div>

          <a
            href="tel:+919811204821"
            className="p-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors"
            title="Call Driver"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>

        {/* Handover OTP PIN */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-950 to-emerald-950/70 border border-emerald-500/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-gray-400 block uppercase">
              DOORSTEP VERIFICATION PIN
            </span>
            <span className="text-xs text-gray-300">Share with driver upon van arrival</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-emerald-500/40 text-lg font-mono font-black text-emerald-400 tracking-widest shadow-glow-green">
            {otpCode}
          </div>
        </div>
      </div>
    </div>
  );
};
