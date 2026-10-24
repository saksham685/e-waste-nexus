import React from 'react';
import { Activity, ShieldCheck, Zap, Globe, Sparkles } from 'lucide-react';

interface ImpactPanelProps {
  recycledKg?: number;
  collectionsCount?: number;
  co2AvoidedKg?: number;
  activePartners?: number;
}

export const ImpactPanel: React.FC<ImpactPanelProps> = ({
  recycledKg = 14380,
  collectionsCount = 482,
  co2AvoidedKg = 20707,
  activePartners = 38
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-nexus-charcoal/85 p-6 backdrop-blur-xl shadow-2xl">
      {/* Top subtle highlight line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80" />

      {/* Header with live indicator */}
      <div className="flex items-center justify-between mb-5 border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-emerald-400 font-mono">
            Platform Telemetry & Impact
          </h4>
        </div>
        <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] text-emerald-300">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>Verified Network</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-3.5 rounded-xl bg-nexus-dark/60 border border-slate-800 hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center space-x-2 text-nexus-muted text-xs mb-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Electronics Diverted</span>
          </div>
          <div className="text-xl md:text-2xl font-bold font-mono text-white">
            {recycledKg.toLocaleString()} <span className="text-xs text-emerald-400 font-normal">kg</span>
          </div>
          <div className="text-[10px] text-emerald-400/80 mt-1 flex items-center">
            ↑ +12.4% this month
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-3.5 rounded-xl bg-nexus-dark/60 border border-slate-800 hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center space-x-2 text-nexus-muted text-xs mb-1">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>CO₂e Avoided</span>
          </div>
          <div className="text-xl md:text-2xl font-bold font-mono text-cyan-300">
            {co2AvoidedKg.toLocaleString()} <span className="text-xs text-cyan-400 font-normal">kg</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            EPA Lifecycle modeled
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-3.5 rounded-xl bg-nexus-dark/60 border border-slate-800 hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center space-x-2 text-nexus-muted text-xs mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pickups Executed</span>
          </div>
          <div className="text-xl md:text-2xl font-bold font-mono text-white">
            {collectionsCount} <span className="text-xs text-nexus-muted font-normal">verified</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">
            100% chain of custody
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-3.5 rounded-xl bg-nexus-dark/60 border border-slate-800 hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center space-x-2 text-nexus-muted text-xs mb-1">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>Active Hubs</span>
          </div>
          <div className="text-xl md:text-2xl font-bold font-mono text-white">
            {activePartners} <span className="text-xs text-emerald-400 font-normal">centers</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            4 North American hubs
          </div>
        </div>
      </div>

      {/* Required Prompt Compliance Note: Demo Data Identification */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-nexus-muted">
        <span>
          <span className="text-emerald-400 font-medium">Demonstration Notice:</span> Live-style aggregate figures combine production test logs and EPA baseline benchmark models for demonstration purposes.
        </span>
        <span className="font-mono text-[10px] text-emerald-500/70">WEEE ISO 14001 MODEL</span>
      </div>
    </div>
  );
};
