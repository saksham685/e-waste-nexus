import React, { useState } from 'react';
import { Smartphone, Laptop, BatteryCharging, Tv, Sparkles, ArrowRight, Zap, DollarSign, Award, ShieldCheck } from 'lucide-react';
import { soundEffects } from '../utils/sound';

interface ImpactCalculatorProps {
  onScheduleForEstimate: (data: { category: string; quantity: number; weight: number }) => void;
}

export const ImpactCalculator: React.FC<ImpactCalculatorProps> = ({ onScheduleForEstimate }) => {
  const [smartphones, setSmartphones] = useState<number>(4);
  const [laptops, setLaptops] = useState<number>(2);
  const [batteries, setBatteries] = useState<number>(10);
  const [monitors, setMonitors] = useState<number>(1);

  // Material recovery formulas based on USGS & EPA Electronics Life-Cycle benchmarks:
  // Smartphone: ~0.034g Au, ~16g Cu, ~0.18kg CO2e, ~0.18kg weight
  // Laptop: ~0.22g Au, ~450g Cu, ~18.5kg CO2e, ~2.4kg weight
  // Battery: ~120g Cobalt/Lithium, ~3.2kg CO2e, ~0.35kg weight
  // Monitor: ~0.02g Au, ~350g Cu, ~24.0kg CO2e, ~5.8kg weight

  const totalGoldGrams = (smartphones * 0.034 + laptops * 0.22 + monitors * 0.02).toFixed(3);
  const totalCopperKg = ((smartphones * 0.016 + laptops * 0.45 + monitors * 0.35) * 1.0).toFixed(2);
  const totalLithiumKg = ((batteries * 0.12 + smartphones * 0.025) * 1.0).toFixed(2);
  const totalCo2Avoided = Math.round(smartphones * 0.18 + laptops * 18.5 + batteries * 3.2 + monitors * 24.0);
  const estimatedWeightKg = (smartphones * 0.18 + laptops * 2.4 + batteries * 0.35 + monitors * 5.8).toFixed(1);

  // EPR Credit Value: $2.80 per credit unit
  const estimatedEprCredits = Math.round(parseFloat(estimatedWeightKg) * 1.4 * 10) / 10;
  const estimatedDollarValue = Math.round(estimatedEprCredits * 2.8);

  const handleSliderChange = (setter: React.Dispatch<React.SetStateAction<number>>, val: number) => {
    setter(val);
    soundEffects.playClick();
  };

  const handleBook = () => {
    soundEffects.playSuccess();
    onScheduleForEstimate({
      category: laptops > 0 ? 'Laptops and Computers' : 'Smartphones and Tablets',
      quantity: smartphones + laptops + batteries + monitors,
      weight: parseFloat(estimatedWeightKg)
    });
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-nexus-charcoal/90 border border-emerald-500/30 p-6 md:p-10 shadow-2xl backdrop-blur-xl">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-xs font-mono text-emerald-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>INTERACTIVE COMMODITY YIELD & EPR ESTIMATOR</span>
          </div>
          <h3 className="text-2xl font-extrabold text-white">
            Simulate Your Circular Environmental Recovery
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Adjust discarded electronic quantities below to calculate real recoverable metals and EPA emissions savings.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-nexus-dark px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>USGS Baseline Calibrated</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Interactive Input Sliders */}
        <div className="lg:col-span-7 space-y-6">
          {/* Slider 1: Laptops */}
          <div className="p-4 rounded-2xl bg-nexus-dark/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
                <Laptop className="w-4 h-4 text-emerald-400" />
                <span>Laptops & Computers</span>
              </div>
              <span className="font-mono text-sm font-bold text-emerald-400">{laptops} units</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={laptops}
              onChange={e => handleSliderChange(setLaptops, parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-nexus-muted">
              <span>0 units</span>
              <span>50 units</span>
            </div>
          </div>

          {/* Slider 2: Smartphones */}
          <div className="p-4 rounded-2xl bg-nexus-dark/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>Smartphones & Tablets</span>
              </div>
              <span className="font-mono text-sm font-bold text-cyan-400">{smartphones} units</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={smartphones}
              onChange={e => handleSliderChange(setSmartphones, parseInt(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-nexus-muted">
              <span>0 units</span>
              <span>100 units</span>
            </div>
          </div>

          {/* Slider 3: Batteries */}
          <div className="p-4 rounded-2xl bg-nexus-dark/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
                <BatteryCharging className="w-4 h-4 text-lime-400" />
                <span>Lithium Batteries & Powerbanks</span>
              </div>
              <span className="font-mono text-sm font-bold text-lime-400">{batteries} packs</span>
            </div>
            <input
              type="range"
              min="0"
              max="150"
              value={batteries}
              onChange={e => handleSliderChange(setBatteries, parseInt(e.target.value))}
              className="w-full accent-lime-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-nexus-muted">
              <span>0 packs</span>
              <span>150 packs</span>
            </div>
          </div>

          {/* Slider 4: Monitors */}
          <div className="p-4 rounded-2xl bg-nexus-dark/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
                <Tv className="w-4 h-4 text-purple-400" />
                <span>Monitors & Televisions</span>
              </div>
              <span className="font-mono text-sm font-bold text-purple-400">{monitors} units</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              value={monitors}
              onChange={e => handleSliderChange(setMonitors, parseInt(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-nexus-muted">
              <span>0 units</span>
              <span>20 units</span>
            </div>
          </div>
        </div>

        {/* Right: Live Dynamic Yield Outputs */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-b from-emerald-950/40 via-nexus-dark to-nexus-dark border border-emerald-500/40 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
              Projected Resource Recovery
            </div>
            <div className="text-xl font-bold text-white mt-0.5">
              Est. Cargo Mass: <span className="text-emerald-400 font-mono">{estimatedWeightKg} kg</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* Metric 1: Gold */}
            <div className="p-3.5 rounded-xl bg-nexus-charcoal border border-slate-800">
              <span className="text-[10px] text-amber-300 block">24k Pure Gold</span>
              <span className="font-mono text-lg font-bold text-white">{totalGoldGrams}</span>
              <span className="text-[10px] text-nexus-muted ml-1">grams</span>
            </div>

            {/* Metric 2: Copper */}
            <div className="p-3.5 rounded-xl bg-nexus-charcoal border border-slate-800">
              <span className="text-[10px] text-emerald-400 block">Industrial Copper</span>
              <span className="font-mono text-lg font-bold text-white">{totalCopperKg}</span>
              <span className="text-[10px] text-nexus-muted ml-1">kg</span>
            </div>

            {/* Metric 3: Lithium/Cobalt */}
            <div className="p-3.5 rounded-xl bg-nexus-charcoal border border-slate-800">
              <span className="text-[10px] text-cyan-300 block">Lithium / Cobalt</span>
              <span className="font-mono text-lg font-bold text-white">{totalLithiumKg}</span>
              <span className="text-[10px] text-nexus-muted ml-1">kg</span>
            </div>

            {/* Metric 4: CO2 Avoided */}
            <div className="p-3.5 rounded-xl bg-nexus-charcoal border border-slate-800">
              <span className="text-[10px] text-lime-400 block">CO₂e Avoided</span>
              <span className="font-mono text-lg font-bold text-white">{totalCo2Avoided}</span>
              <span className="text-[10px] text-nexus-muted ml-1">kg</span>
            </div>
          </div>

          {/* Value Calculation Card */}
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-emerald-400 uppercase font-mono block">
                Estimated EPR Compliance Value
              </span>
              <div className="text-2xl font-extrabold text-white font-mono flex items-center">
                <span>{estimatedEprCredits} Credits</span>
                <span className="text-xs text-emerald-400 font-normal ml-2">(~${estimatedDollarValue} USD)</span>
              </div>
            </div>
            <Award className="w-8 h-8 text-emerald-400" />
          </div>

          {/* Action CTA */}
          <button
            onClick={handleBook}
            className="w-full py-3.5 rounded-xl font-bold text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all shadow-glow-green flex items-center justify-center space-x-2"
          >
            <span>Schedule Pickup for this Estimate</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
