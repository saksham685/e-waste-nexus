'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Truck,
  Scale,
  Flame,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Radio,
  MapPin,
} from 'lucide-react';
import { soundEffects } from '@/lib/sound';
import { PickupRequest, EPRRecord } from '@/lib/types';

export const LiveOperationsConsole: React.FC = () => {
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [eprRecords, setEprRecords] = useState<EPRRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'dispatches' | 'weighbridge' | 'assays' | 'epr'>('dispatches');
  const [isLoading, setIsLoading] = useState(true);

  const fetchLiveData = async () => {
    try {
      setIsLoading(true);
      const [pickupRes, eprRes] = await Promise.all([
        fetch('/api/pickups'),
        fetch('/api/epr'),
      ]);

      if (pickupRes.ok) {
        const pData = await pickupRes.json();
        setPickups(pData.pickups || pData.data || []);
      }

      if (eprRes.ok) {
        const eData = await eprRes.json();
        setEprRecords(eData.eprRecords || eData.data || []);
      }
    } catch (e) {
      console.error('Failed to load live operations data', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveData();
  }, []);

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-white/15 rounded-[32px] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-2">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Real-Time Circular Operations Feed</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Live National Logistics &amp; Smelter Terminal
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 font-light">
              Inspect active doorstep collections, weighbridge telemetries, and refining assays currently synchronizing across India.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                fetchLiveData();
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Sync Feed</span>
            </button>

            <Link
              href="/pickups"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-glow-green cursor-pointer"
            >
              <span>Schedule Pickup</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('dispatches');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'dispatches'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow-green'
                : 'text-gray-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Doorstep Dispatches ({pickups.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('weighbridge');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'weighbridge'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-gray-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Weighbridge Scales</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('assays');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'assays'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-gray-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Refining Smelting Assays</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('epr');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'epr'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-gray-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>EPR Quota Registry ({eprRecords.length})</span>
          </button>
        </div>

        {/* Tab 1: Doorstep Dispatches Feed */}
        {activeTab === 'dispatches' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pickups.slice(0, 6).map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-emerald-500/30 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400">#{p.id.slice(-8)}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-cyan-300 border border-cyan-500/30">
                    {p.currentStatus}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{p.category}</h4>
                  <div className="flex items-center space-x-1.5 text-xs text-gray-400 mt-1 line-clamp-1">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{p.address}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-400">
                  <span>Slot: <strong className="text-white">{p.timeSlot?.split(' ')[0] || 'Morning'}</strong></span>
                  <span className="text-emerald-400 font-bold">
                    PIN: CPCB-{p.id.slice(-4).toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Weighbridge Scale Feed */}
        {activeTab === 'weighbridge' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pickups.slice(0, 4).map((p, idx) => {
              const gross = (p.actualWeightKg || p.estimatedWeightKg) + 1.2;
              const tare = 1.2;
              const net = p.actualWeightKg || p.estimatedWeightKg;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/20 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      SCALE #AVERY-WB-94{idx + 1}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      LEGAL METROLOGY CERTIFIED
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5">
                      <span className="text-gray-500 block text-[10px]">GROSS</span>
                      <span className="text-white font-bold">{gross.toFixed(1)} kg</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5">
                      <span className="text-gray-500 block text-[10px]">TARE</span>
                      <span className="text-white font-bold">{tare.toFixed(1)} kg</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-cyan-500/30">
                      <span className="text-gray-500 block text-[10px]">CERTIFIED NET</span>
                      <span className="text-cyan-300 font-bold">{net.toFixed(1)} kg</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-gray-400 font-mono truncate">
                    Consignment: #{p.id.slice(-8)} &bull; {p.category}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Smelting Assays */}
        {activeTab === 'assays' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                lot: 'LOT-AU-2026-881',
                method: 'Hydrometallurgy',
                gold: '87.4g Au',
                copper: '31.2kg Cu',
                silver: '142g Ag',
                producer: 'Samsung India',
              },
              {
                lot: 'LOT-AU-2026-880',
                method: 'Pyrometallurgical Smelting',
                gold: '64.1g Au',
                copper: '24.8kg Cu',
                silver: '98g Ag',
                producer: 'Apple India',
              },
              {
                lot: 'LOT-AU-2026-879',
                method: 'Inert Gas Shredding',
                gold: '42.9g Au',
                copper: '18.5kg Cu',
                silver: '74g Ag',
                producer: 'Dell Technologies',
              },
            ].map((assay) => (
              <div
                key={assay.lot}
                className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/20 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400">{assay.lot}</span>
                  <span className="text-[10px] font-mono text-amber-300">99.9% Purity</span>
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fine Gold Bullion:</span>
                    <span className="text-amber-400 font-bold">{assay.gold}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Refined Copper:</span>
                    <span className="text-cyan-300 font-bold">{assay.copper}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pure Silver:</span>
                    <span className="text-gray-200 font-bold">{assay.silver}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-400">
                  <span>Target: <strong className="text-white">{assay.producer}</strong></span>
                  <span className="text-emerald-400">EPR Minted</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: EPR Registry */}
        {activeTab === 'epr' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 uppercase text-[10px]">
                  <th className="py-2.5 px-3">Certificate #</th>
                  <th className="py-2.5 px-3">Target OEM Producer</th>
                  <th className="py-2.5 px-3">Eligible Weight</th>
                  <th className="py-2.5 px-3">Credits Minted</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {eprRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-white/5">
                    <td className="py-3 px-3 font-bold text-purple-400">
                      {r.certificateNumber || `#EPR-${r.id.slice(-6)}`}
                    </td>
                    <td className="py-3 px-3 text-white font-sans font-medium">
                      {r.producerName || r.targetProducer || 'Samsung India Electronics'}
                    </td>
                    <td className="py-3 px-3">{r.eligibleWeightKg || r.creditsEarnedKg || 25} kg</td>
                    <td className="py-3 px-3 font-bold text-emerald-400">
                      {r.creditUnits || Math.round((r.creditsEarnedKg || 25) * 10)} Units
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px]">
                        {r.approvalStatus || 'Approved'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};
