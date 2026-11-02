'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { soundEffects } from '@/lib/sound';
import { TiltCard3D } from './TiltCard3D';
import {
  Smartphone,
  Laptop,
  Monitor,
  Server,
  BatteryCharging,
  Cpu,
  Flame,
  Award,
  DollarSign,
  Droplets,
  Sparkles,
} from 'lucide-react';

interface DevicePreset {
  name: string;
  icon: any;
  goldMg: number; // milligrams
  silverMg: number;
  copperG: number; // grams
  co2Kg: number;
  toxicLeadG: number;
  rebateValue: number;
}

const DEVICE_PRESETS: Record<string, DevicePreset> = {
  smartphone: {
    name: 'Smartphones',
    icon: Smartphone,
    goldMg: 34,
    silverMg: 350,
    copperG: 16,
    co2Kg: 2.1,
    toxicLeadG: 1.2,
    rebateValue: 12,
  },
  laptop: {
    name: 'Laptops / Notebooks',
    icon: Laptop,
    goldMg: 220,
    silverMg: 1200,
    copperG: 450,
    co2Kg: 18.5,
    toxicLeadG: 8.5,
    rebateValue: 45,
  },
  desktop: {
    name: 'Desktop Towers',
    icon: Monitor,
    goldMg: 350,
    silverMg: 1800,
    copperG: 1200,
    co2Kg: 35.0,
    toxicLeadG: 22.0,
    rebateValue: 65,
  },
  server: {
    name: 'Enterprise Servers',
    icon: Server,
    goldMg: 1400,
    silverMg: 7500,
    copperG: 5200,
    co2Kg: 140.0,
    toxicLeadG: 65.0,
    rebateValue: 280,
  },
  battery: {
    name: 'Li-Ion Battery Packs',
    icon: BatteryCharging,
    goldMg: 0,
    silverMg: 80,
    copperG: 850,
    co2Kg: 12.0,
    toxicLeadG: 0,
    rebateValue: 25,
  },
  pcb: {
    name: 'Motherboards / High-Grade PCBs',
    icon: Cpu,
    goldMg: 550,
    silverMg: 2200,
    copperG: 1800,
    co2Kg: 42.0,
    toxicLeadG: 18.0,
    rebateValue: 90,
  },
};

export const ImpactCalculator: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<string>('laptop');
  const [quantity, setQuantity] = useState<number>(5);

  const device = DEVICE_PRESETS[selectedDevice];
  const totalGoldG = ((device.goldMg * quantity) / 1000).toFixed(2);
  const totalSilverG = ((device.silverMg * quantity) / 1000).toFixed(1);
  const totalCopperKg = ((device.copperG * quantity) / 1000).toFixed(2);
  const totalCO2Kg = (device.co2Kg * quantity).toFixed(1);
  const totalLeadG = (device.toxicLeadG * quantity).toFixed(1);
  const totalRebate = (device.rebateValue * quantity).toLocaleString();

  const handleDeviceChange = (key: string) => {
    soundEffects.playClick();
    setSelectedDevice(key);
  };

  const handleConfetti = () => {
    soundEffects.playSuccess();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#10b981', '#34d399', '#06b6d4', '#eab308'],
      });
    } catch (e) {}
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Circular Yield Engine</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Calculate Your Discarded Hardware Potential
        </h2>
        <p className="mt-4 text-gray-400 text-base">
          Determine the strategic precious metals recovered, toxic leach prevention, and estimated
          EPR green credits for any volume of decommissioned electronic assets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Configurator Column */}
        <div className="lg:col-span-5 bg-nexus-card border border-emerald-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
            <span>1. Select Device Class</span>
            <span className="text-xs font-mono text-emerald-400">ISO 14040 Metrics</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {Object.entries(DEVICE_PRESETS).map(([key, data]) => {
              const Icon = data.icon;
              const isSelected = selectedDevice === key;
              return (
                <button
                  key={key}
                  onClick={() => handleDeviceChange(key)}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-glow-green scale-[1.02]'
                      : 'bg-nexus-dark/60 border-emerald-500/15 text-gray-400 hover:border-emerald-500/40 hover:text-gray-200'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 mb-2 ${
                      isSelected ? 'text-emerald-400' : 'text-gray-500'
                    }`}
                  />
                  <div>
                    <div className="text-xs font-semibold leading-tight">{data.name}</div>
                    <div className="text-[10px] font-mono text-emerald-400/80 mt-1">
                      {data.goldMg > 0 ? `~${data.goldMg}mg Au` : 'Cobalt Rich'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-emerald-500/20">
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="volume-slider" className="text-sm font-semibold text-gray-200">2. Asset Volume (Units)</label>
              <div className="px-3 py-1 rounded-xl bg-nexus-dark border border-emerald-500/40 text-emerald-400 font-mono font-bold text-base">
                {quantity} units
              </div>
            </div>

            <input
              id="volume-slider"
              type="range"
              min="1"
              max="250"
              value={quantity}
              onChange={(e) => {
                setQuantity(parseInt(e.target.value));
              }}
              className="w-full h-2 bg-nexus-dark rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[11px] font-mono text-gray-500 mt-1">
              <span>1 unit</span>
              <span>50 units</span>
              <span>100 units</span>
              <span>250+ units</span>
            </div>
          </div>

          <button
            onClick={handleConfetti}
            className="w-full mt-6 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-nexus-dark font-bold text-sm shadow-glow-green transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Certified ESG Assessment</span>
          </button>
        </div>

        {/* Right Output Dashboard */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Gold Recovered */}
          <TiltCard3D>
            <div className="bg-nexus-card border border-amber-500/30 rounded-3xl p-6 relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold font-mono">
                  Au
                </div>
                <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  99.9% Bullion
                </span>
              </div>
              <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
                {totalGoldG} <span className="text-sm font-sans text-gray-400 font-normal">grams</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Hydrometallurgical fine gold recovered without cyanide or toxic open burning.
              </p>
            </div>
          </TiltCard3D>

          {/* Silver & Copper */}
          <TiltCard3D>
            <div className="bg-nexus-card border border-cyan-500/30 rounded-3xl p-6 relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold font-mono">
                  Cu + Ag
                </div>
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                  Industrial Base
                </span>
              </div>
              <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
                {totalCopperKg} <span className="text-sm font-sans text-gray-400 font-normal">kg Cu</span>
                <span className="text-xl text-cyan-400 ml-2 font-normal">+{totalSilverG}g Ag</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Strategic industrial copper and silver reintroduced into semiconductor manufacturing.
              </p>
            </div>
          </TiltCard3D>

          {/* Avoided CO2 */}
          <TiltCard3D>
            <div className="bg-nexus-card border border-emerald-500/30 rounded-3xl p-6 relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Flame className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Carbon Abatement
                </span>
              </div>
              <div className="text-3xl font-extrabold text-emerald-300 tracking-tight font-mono">
                {totalCO2Kg} <span className="text-sm font-sans text-gray-400 font-normal">kg CO₂e</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Avoided greenhouse gases compared to raw open-pit mining and smelting.
              </p>
            </div>
          </TiltCard3D>

          {/* Heavy Metal & Value */}
          <TiltCard3D>
            <div className="bg-nexus-card border border-lime-500/30 rounded-3xl p-6 relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-lime-500/20 flex items-center justify-center text-lime-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-lime-400 uppercase tracking-widest bg-lime-500/10 px-2.5 py-0.5 rounded-full border border-lime-500/20">
                  EPR Green Value
                </span>
              </div>
              <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
                ${totalRebate} <span className="text-xs font-mono text-emerald-400">({totalLeadG}g Pb Diverted)</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Direct financial reclamation dividend and certified prevention of ground aquifer lead poisoning.
              </p>
            </div>
          </TiltCard3D>
        </div>
      </div>
    </section>
  );
};
