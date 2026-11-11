'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Smartphone,
  Laptop,
  Tv,
  BatteryCharging,
  Cpu,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Coins,
  Recycle,
  HelpCircle,
  Truck,
} from 'lucide-react';

interface DeviceOption {
  id: string;
  name: string;
  icon: any;
  basePrice: number;
  goldRecoveryMg: number;
  copperRecoveryG: number;
  co2SavedKg: number;
}

const DEVICES: DeviceOption[] = [
  { id: 'phone', name: 'Smartphone / iPhone', icon: Smartphone, basePrice: 1450, goldRecoveryMg: 28, copperRecoveryG: 16, co2SavedKg: 8.5 },
  { id: 'laptop', name: 'Laptop / MacBook', icon: Laptop, basePrice: 3850, goldRecoveryMg: 120, copperRecoveryG: 450, co2SavedKg: 32.0 },
  { id: 'tv', name: 'TV / Display Monitor', icon: Tv, basePrice: 1200, goldRecoveryMg: 45, copperRecoveryG: 850, co2SavedKg: 44.5 },
  { id: 'battery', name: 'Lithium Battery Pack', icon: BatteryCharging, basePrice: 480, goldRecoveryMg: 0, copperRecoveryG: 80, co2SavedKg: 12.0 },
  { id: 'pcb', name: 'PC Motherboard / CPUs', icon: Cpu, basePrice: 1950, goldRecoveryMg: 240, copperRecoveryG: 620, co2SavedKg: 18.0 },
];

const CONDITIONS = [
  { id: 'working', label: 'Working Fine', multiplier: 1.4, desc: 'Powers on, normal wear' },
  { id: 'minor', label: 'Minor Issues', multiplier: 1.0, desc: 'Scratched or degraded battery' },
  { id: 'dead', label: 'Dead / Broken', multiplier: 0.75, desc: 'Not turning on or cracked' },
  { id: 'scrap', label: 'Bare Scrap Only', multiplier: 0.5, desc: 'Dismantled or ancient scrap' },
];

export const InstantValuationCalculator: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<string>('phone');
  const [selectedCondition, setSelectedCondition] = useState<string>('minor');
  const [quantity, setQuantity] = useState<number>(1);

  const device = DEVICES.find((d) => d.id === selectedDevice) || DEVICES[0];
  const condition = CONDITIONS.find((c) => c.id === selectedCondition) || CONDITIONS[1];

  const estimatedPayout = Math.round(device.basePrice * condition.multiplier * quantity);
  const greenPoints = Math.round(estimatedPayout * 0.15);
  const totalGoldMg = (device.goldRecoveryMg * quantity).toFixed(0);
  const totalCopperG = (device.copperRecoveryG * quantity).toFixed(0);
  const totalCo2Kg = (device.co2SavedKg * quantity).toFixed(1);

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Coins className="w-3.5 h-3.5" />
          <span>Instant Scrap Valuation &amp; Payout Estimator</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          How much is your old electronic scrap worth?
        </h2>
        <p className="mt-2 text-sm text-zinc-400 font-light">
          Select your old or dead device to see real-time cash payout, recovered precious metals, and CO₂ savings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Device Selection & Condition Options */}
        <div className="lg:col-span-7 space-y-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
          
          {/* Step 1: Device Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
              1. Select Device Category:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {DEVICES.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedDevice === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedDevice(item.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-sm'
                        : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-emerald-400' : 'text-zinc-500'}`} />
                    <div className="text-xs font-bold leading-snug">{item.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Device Condition */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
              2. Select Device Physical Condition:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CONDITIONS.map((cond) => {
                const isSelected = selectedCondition === cond.id;
                return (
                  <button
                    key={cond.id}
                    type="button"
                    onClick={() => setSelectedCondition(cond.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-800 border-emerald-500/80 text-white'
                        : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-semibold">{cond.label}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5 leading-tight">{cond.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Quantity Counter */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
            <div>
              <span className="block text-xs font-bold text-white">Number of Units:</span>
              <span className="text-[11px] text-zinc-400">Total devices to hand over</span>
            </div>
            <div className="flex items-center space-x-3 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm flex items-center justify-center transition-colors cursor-pointer"
              >
                -
              </button>
              <span className="font-mono text-base font-bold text-white px-2">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(50, quantity + 1))}
                className="w-7 h-7 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm flex items-center justify-center transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Right: Instant Valuation Card & Direct Booking CTA */}
        <div className="lg:col-span-5 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Badge */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-mono text-emerald-400 font-semibold">
              Live Estimated Value
            </span>
            <span className="text-[10px] text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-full border border-zinc-700">
              On-the-spot UPI Payout
            </span>
          </div>

          {/* Large Estimated Cash Display */}
          <div>
            <div className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight">
              ₹{estimatedPayout.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-zinc-400 mt-1 flex items-center space-x-2">
              <span className="text-emerald-400 font-semibold">+{greenPoints} Eco Green Points</span>
              <span>&bull;</span>
              <span>Free Doorstep Pickup</span>
            </div>
          </div>

          {/* Precious Metals & Environmental Recovery Stats */}
          <div className="grid grid-cols-3 gap-2.5 py-4 border-y border-zinc-800 text-left">
            <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80">
              <div className="text-[10px] font-mono text-amber-400 font-bold">Gold (Au)</div>
              <div className="text-sm font-bold text-white font-mono mt-0.5">{totalGoldMg} mg</div>
              <div className="text-[9px] text-zinc-500">Pure 24K Bond</div>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80">
              <div className="text-[10px] font-mono text-cyan-400 font-bold">Copper (Cu)</div>
              <div className="text-sm font-bold text-white font-mono mt-0.5">{totalCopperG} g</div>
              <div className="text-[9px] text-zinc-500">Refined Grade-A</div>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80">
              <div className="text-[10px] font-mono text-emerald-400 font-bold">CO₂ Saved</div>
              <div className="text-sm font-bold text-white font-mono mt-0.5">{totalCo2Kg} kg</div>
              <div className="text-[9px] text-zinc-500">Zero-Landfill</div>
            </div>
          </div>

          {/* Guarantees List */}
          <div className="space-y-2 text-xs text-zinc-300 font-light">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Certified DoD / NIST military-grade data sanitization.</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Calibrated digital weighing scale on-spot before payout.</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Official CPCB Form-6 statutory green certificate.</span>
            </div>
          </div>

          {/* Direct Booking Button */}
          <Link
            href="/pickups"
            className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-sm tracking-wide transition-all flex items-center justify-center space-x-2 shadow-lg cursor-pointer group"
          >
            <Truck className="w-4 h-4 text-zinc-900" />
            <span>Schedule Free Doorstep Pickup</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};
