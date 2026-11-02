'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { soundEffects } from '@/lib/sound';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { TiltCard3D } from '@/components/TiltCard3D';
import {
  Building2,
  Cpu,
  Flame,
  Award,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function RecyclerHubPage() {
  const { user } = useAuthStore();
  const [method, setMethod] = useState<'Hydrometallurgy' | 'Pyrometallurgy' | 'Mechanical Shredding'>(
    'Hydrometallurgy'
  );
  const [inputWeightKg, setInputWeightKg] = useState<number>(250);
  const [goldGrams, setGoldGrams] = useState<number>(87.5);
  const [copperKg, setCopperKg] = useState<number>(31.2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRecordAssay = (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playClick();
    setIsSubmitting(true);
    setSuccessMsg(null);

    setTimeout(() => {
      soundEffects.playSuccess();
      setSuccessMsg(
        `Assay Lot #RF-${Date.now().toString().slice(-6)} recorded. 99.9% fine gold bullion minted & EPR credit created!`
      );
      voiceAssistant.speak(
        `Hydrometallurgical refining batch logged with ${goldGrams} grams of fine gold recovered.`
      );
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-wider mb-2">
          <Building2 className="w-3.5 h-3.5" />
          <span>Certified Smelter &amp; Hydrometallurgy Operations</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Refining Assay &amp; EPR Credit Minting Console
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Operating Facility:{' '}
          <span className="text-amber-400 font-mono">
            {user?.organization || 'EcoRefine Hydrometallurgy Ltd'}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Assay Entry Form */}
        <div className="lg:col-span-6 bg-nexus-card border border-amber-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-amber-400" />
            <span>Document Refining Lot &amp; Commodity Yield</span>
          </h2>

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleRecordAssay} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">
                REFINING METHODOLOGY
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="w-full bg-nexus-dark border border-amber-500/30 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 font-sans"
              >
                <option value="Hydrometallurgy">Hydrometallurgy (Zero-Cyanide Acid Leach)</option>
                <option value="Pyrometallurgy">Pyrometallurgical Smelting &amp; Slag Separation</option>
                <option value="Mechanical Shredding">Inert Gas Mechanical Shredding &amp; Optical Sort</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">
                BATCH INPUT FEEDSTOCK (KG)
              </label>
              <input
                type="number"
                value={inputWeightKg}
                onChange={(e) => setInputWeightKg(Number(e.target.value))}
                required
                className="w-full bg-nexus-dark border border-amber-500/30 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-amber-400 mb-1">
                  FINE GOLD YIELD (GRAMS)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={goldGrams}
                  onChange={(e) => setGoldGrams(Number(e.target.value))}
                  required
                  className="w-full bg-nexus-dark border border-amber-500/30 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-cyan-400 mb-1">
                  COPPER YIELD (KG)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={copperKg}
                  onChange={(e) => setCopperKg(Number(e.target.value))}
                  required
                  className="w-full bg-nexus-dark border border-amber-500/30 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-nexus-dark font-extrabold text-sm shadow-glow-green hover:opacity-90 transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Verifying Spectrometry...' : 'Mint Verified Lot & Issue EPR Credit'}</span>
            </button>
          </form>
        </div>

        {/* Right: Certified Lots & Smelter Telemetry */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-nexus-card border border-amber-500/20 rounded-3xl p-6 backdrop-blur-xl">
            <h3 className="text-sm font-mono text-amber-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Recent Facility Smelter Assays</span>
            </h3>

            <div className="space-y-3">
              {[
                {
                  id: 'LOT-9014',
                  feedstock: 'Printed Circuit Boards (Grade A)',
                  weight: '450 kg',
                  gold: '158.4g Au',
                  copper: '54.0 kg Cu',
                  date: 'Today, 11:20 AM',
                },
                {
                  id: 'LOT-9012',
                  feedstock: 'Telecom Server Motherboards',
                  weight: '320 kg',
                  gold: '112.2g Au',
                  copper: '38.4 kg Cu',
                  date: 'Yesterday',
                },
                {
                  id: 'LOT-9008',
                  feedstock: 'Smartphone Logic Boards',
                  weight: '180 kg',
                  gold: '63.0g Au',
                  copper: '21.6 kg Cu',
                  date: '3 days ago',
                },
              ].map((lot) => (
                <div
                  key={lot.id}
                  className="p-4 rounded-2xl bg-nexus-dark/70 border border-amber-500/10 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-amber-400">{lot.id}</span>
                      <span className="text-xs text-white">{lot.feedstock}</span>
                    </div>
                    <div className="text-[11px] font-mono text-gray-400 mt-1">
                      Input: {lot.weight} &bull; {lot.date}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-amber-300 block">
                      {lot.gold}
                    </span>
                    <span className="text-[11px] font-mono text-cyan-400">{lot.copper}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
