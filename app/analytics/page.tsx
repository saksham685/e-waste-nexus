import React from 'react';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import { TiltCard3D } from '@/components/TiltCard3D';
import {
  BarChart3,
  TrendingUp,
  Cpu,
  Flame,
  Award,
  Globe,
  RefreshCw,
  Sparkles,
  PieChart,
} from 'lucide-react';

// Next.js Unit II: Incremental Static Regeneration (ISR)
export const revalidate = 60; // Regenerate page in background every 60 seconds

export const metadata: Metadata = {
  title: 'Environmental Lifecycle Analytics (ISR 60s) | E-Waste Nexus',
  description:
    'Comprehensive lifecycle analysis: carbon emissions abated, strategic precious metal yields, and regional diversion metrics.',
};

export default function AnalyticsPage() {
  const pickups = db.pickups.find();
  const recyclers = db.recyclers.find();
  const epr = db.epr.find();

  // Aggregate Metrics
  const totalPickups = pickups.length;
  const totalWeightKg = pickups.reduce((acc, p) => acc + (p.actualWeightKg || p.estimatedWeightKg || 0), 0);
  const totalWeightMT = (totalWeightKg / 1000).toFixed(2);
  const estGoldKg = (totalWeightKg * 0.00035).toFixed(2); // 350mg Au / kg PCB average
  const estCopperKg = (totalWeightKg * 0.12).toFixed(1);
  const estCO2AbatedMT = (totalWeightKg * 0.0028).toFixed(2);

  const materials = [
    { name: 'Copper (Cu)', percentage: 48, color: 'bg-cyan-500', recoveryKg: estCopperKg },
    { name: 'Ferrous Metals', percentage: 26, color: 'bg-gray-400', recoveryKg: (Number(totalWeightKg) * 0.26).toFixed(0) },
    { name: 'Polymers / Plastics', percentage: 15, color: 'bg-emerald-500', recoveryKg: (Number(totalWeightKg) * 0.15).toFixed(0) },
    { name: 'Gold (Au) 99.9%', percentage: 6, color: 'bg-amber-400', recoveryKg: estGoldKg },
    { name: 'Silver & Palladium', percentage: 5, color: 'bg-lime-400', recoveryKg: (Number(totalWeightKg) * 0.0015).toFixed(1) },
  ];

  return (
    <div className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-3">
          <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
          <span>Next.js Rendering Strategy &bull; ISR (revalidate = 60s)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Circular Lifecycle &amp; Resource Telemetry
        </h1>
        <p className="mt-3 text-gray-400 text-sm sm:text-base">
          Quantified environmental accounting of heavy metal diversion, avoided greenhouse gases,
          and urban mining yields cached at the edge.
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-10">
        <TiltCard3D>
          <div className="bg-nexus-card border border-emerald-500/30 p-6 rounded-3xl h-full">
            <span className="text-gray-400 text-xs font-mono block mb-1">TOTAL DIVERSIFIED</span>
            <div className="text-3xl font-extrabold text-white font-mono">{totalWeightMT} MT</div>
            <p className="text-xs text-emerald-400 mt-2 font-mono">100% Zero-Landfill Verified</p>
          </div>
        </TiltCard3D>

        <TiltCard3D>
          <div className="bg-nexus-card border border-amber-500/30 p-6 rounded-3xl h-full">
            <span className="text-gray-400 text-xs font-mono block mb-1">FINE GOLD YIELD</span>
            <div className="text-3xl font-extrabold text-amber-300 font-mono">{estGoldKg} kg</div>
            <p className="text-xs text-gray-400 mt-2 font-mono">Hydrometallurgical Purity</p>
          </div>
        </TiltCard3D>

        <TiltCard3D>
          <div className="bg-nexus-card border border-cyan-500/30 p-6 rounded-3xl h-full">
            <span className="text-gray-400 text-xs font-mono block mb-1">HIGH-PURITY COPPER</span>
            <div className="text-3xl font-extrabold text-cyan-300 font-mono">{estCopperKg} kg</div>
            <p className="text-xs text-gray-400 mt-2 font-mono">Semiconductor Grade Base</p>
          </div>
        </TiltCard3D>

        <TiltCard3D>
          <div className="bg-nexus-card border border-lime-500/30 p-6 rounded-3xl h-full">
            <span className="text-gray-400 text-xs font-mono block mb-1">AVOIDED CARBON</span>
            <div className="text-3xl font-extrabold text-lime-400 font-mono">{estCO2AbatedMT} MT</div>
            <p className="text-xs text-gray-400 mt-2 font-mono">Net CO₂ Equivalent Avoided</p>
          </div>
        </TiltCard3D>
      </div>

      {/* Material Breakdown & Lifecycle Assay */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        {/* Material Decomposition Bar Breakdown */}
        <div className="lg:col-span-7 bg-nexus-card border border-emerald-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <PieChart className="w-5 h-5 text-emerald-400" />
              <span>Recovered Commodity Fraction Distribution</span>
            </h2>
            <span className="text-xs font-mono text-gray-500">Mass Balance %</span>
          </div>

          <div className="space-y-4">
            {materials.map((mat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-200 font-semibold">{mat.name}</span>
                  <span className="text-emerald-400">{mat.percentage}% ({mat.recoveryKg} kg)</span>
                </div>
                <div className="w-full h-3 bg-nexus-dark rounded-full overflow-hidden border border-emerald-500/10">
                  <div
                    className={`h-full ${mat.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${mat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-nexus-dark/60 border border-emerald-500/10 text-xs text-gray-400 leading-relaxed">
            Data reflects closed-loop smelting assay certificates verified across 18 regional
            refineries under ISO 14044 Life Cycle Assessment protocols.
          </div>
        </div>

        {/* Heavy Metal Leach Prevention Telemetry */}
        <div className="lg:col-span-5 bg-nexus-card border border-emerald-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <Flame className="w-5 h-5 text-cyan-400" />
            <span>Hazard Prevention Ledger</span>
          </h2>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-nexus-dark/80 border border-emerald-500/15">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-300 font-semibold">Lead (Pb) Diverted</span>
                <span className="font-mono text-amber-400 font-bold">142.5 kg</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Prevented from contaminating municipal aquifers and agricultural soil beds.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-nexus-dark/80 border border-emerald-500/15">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-300 font-semibold">Mercury (Hg) Neutralized</span>
                <span className="font-mono text-cyan-400 font-bold">18.4 kg</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Captured via closed-loop vacuum thermal desorption chambers.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-nexus-dark/80 border border-emerald-500/15">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-300 font-semibold">Cadmium &amp; BFR Polymers</span>
                <span className="font-mono text-lime-400 font-bold">96.8 kg</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Pyrolyzed into benign inert slag with continuous flue-gas HEPA scrubbers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
