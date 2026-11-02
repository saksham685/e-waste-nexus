'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { soundEffects } from '@/lib/sound';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { updatePickupStatusAction } from '@/actions/pickupActions';
import { PickupRequest } from '@/lib/types';
import { TiltCard3D } from '@/components/TiltCard3D';
import {
  Truck,
  Scale,
  Camera,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
  FileCheck,
  ShieldAlert,
} from 'lucide-react';

export default function PartnerPortalPage() {
  const { user } = useAuthStore();
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [selectedPickup, setSelectedPickup] = useState<PickupRequest | null>(null);
  const [scaleWeight, setScaleWeight] = useState<string>('14.2');
  const [tareWeight, setTareWeight] = useState<string>('1.8');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchPickups = async () => {
    try {
      const res = await fetch('/api/pickups');
      if (res.ok) {
        const data = await res.json();
        setPickups(data.pickups || []);
        if (data.pickups?.length > 0 && !selectedPickup) {
          setSelectedPickup(data.pickups[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  const handleUpdateWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPickup) return;

    soundEffects.playClick();
    setIsUpdating(true);
    setMessage(null);

    const netWeight = (Number(scaleWeight) - Number(tareWeight)).toFixed(1);

    try {
      const res = await updatePickupStatusAction(
        selectedPickup.id,
        'ReceivedAtCenter',
        {
          id: user?.id || 'demo_partner_1',
          name: user?.name || 'Apex Green Fleet (Logistics)',
          role: 'partner',
        },
        `Weighed on calibrated scale #WS-942. Gross: ${scaleWeight}kg, Tare: ${tareWeight}kg, Net Certified: ${netWeight}kg.`
      );

      if (res.success) {
        soundEffects.playSuccess();
        setMessage(`Consignment #${selectedPickup.id.slice(-6)} verified with certified net weight ${netWeight}kg.`);
        voiceAssistant.speak(`Consignment weighed and certified at ${netWeight} kilograms.`);
        await fetchPickups();
      } else {
        soundEffects.playError();
        setMessage(res.error || 'Update failed');
      }
    } catch (err: any) {
      soundEffects.playError();
      setMessage(err?.message || 'Error updating status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Truck className="w-3.5 h-3.5" />
            <span>Role-Based Access &bull; Logistics Partner Console</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Logistics &amp; Calibrated Intake Operations
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Logged in as <span className="text-emerald-400 font-mono">{user?.name}</span> ({user?.organization || 'Apex Green Fleet'})
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Pickup Selection Queue */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center justify-between">
            <span>Assigned Consignment Queue</span>
            <span className="text-xs font-mono text-emerald-400">{pickups.length} manifests</span>
          </h2>

          <div className="space-y-3">
            {pickups.map((p) => {
              const isSelected = selectedPickup?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    soundEffects.playClick();
                    setSelectedPickup(p);
                  }}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-400 shadow-glow-green'
                      : 'bg-nexus-card border-emerald-500/15 hover:border-emerald-500/40 text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      #{p.id.slice(-8)}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-nexus-dark text-cyan-300 border border-emerald-500/20">
                      {p.currentStatus}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-white">{p.category}</h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">{p.address}</p>

                  <div className="mt-3 pt-2 border-t border-emerald-500/10 flex items-center justify-between text-[11px] font-mono text-gray-400">
                    <span>Est: {p.estimatedWeightKg} kg</span>
                    <span className="text-emerald-400">Pick: {p.scheduledDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Certified Scale Weight Calibration Terminal */}
        <div className="lg:col-span-7 bg-nexus-card border border-emerald-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          {selectedPickup ? (
            <div>
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4 mb-6">
                <div>
                  <span className="text-xs font-mono text-emerald-400">MANIFEST CALIBRATION DOCK</span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {selectedPickup.category} &bull; #{selectedPickup.id.slice(-8)}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-nexus-dark border border-emerald-500/30 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-emerald-400" />
                </div>
              </div>

              {message && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              <form onSubmit={handleUpdateWeight} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">
                      GROSS SCALE WEIGHT (KG)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={scaleWeight}
                      onChange={(e) => setScaleWeight(e.target.value)}
                      required
                      className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl px-4 py-3 text-base font-mono text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">
                      CONTAINER TARE WEIGHT (KG)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={tareWeight}
                      onChange={(e) => setTareWeight(e.target.value)}
                      required
                      className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl px-4 py-3 text-base font-mono text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-nexus-dark/70 border border-emerald-500/20 flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-400">COMPUTED NET CERTIFIED WEIGHT:</span>
                  <span className="text-2xl font-mono font-bold text-emerald-400">
                    {(Number(scaleWeight) - Number(tareWeight)).toFixed(1)} kg
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-nexus-dark font-extrabold text-sm shadow-glow-green transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>{isUpdating ? 'Sealing Scale Telemetry...' : 'Stamp Tare Weight & Seal Manifest'}</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="py-20 text-center text-gray-400 text-sm">
              Select a manifest from the left queue to begin intake calibration.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
