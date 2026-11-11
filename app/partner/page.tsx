'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { soundEffects } from '@/lib/sound';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  recordWeighbridgeAction,
  assignPartnerAction,
  updatePickupStatusAction,
} from '@/actions/pickupActions';
import { PickupRequest } from '@/lib/types';
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
  Calendar,
  Sparkles,
  ArrowRight,
  UserCheck,
  Hash,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export default function PartnerPortalPage() {
  const { user } = useAuthStore();
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [selectedPickup, setSelectedPickup] = useState<PickupRequest | null>(null);
  const [scaleWeight, setScaleWeight] = useState<string>('14.2');
  const [tareWeight, setTareWeight] = useState<string>('1.8');
  const [scaleSerial, setScaleSerial] = useState<string>('AVERY-INDIA-WB940');
  const [driverName, setDriverName] = useState<string>('Rajesh Sharma');
  const [vehicleNumber, setVehicleNumber] = useState<string>('DL-12-EA-9821');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchPickups = async () => {
    try {
      const res = await fetch('/api/pickups');
      if (res.ok) {
        const data = await res.json();
        const list = data.pickups || data.data || [];
        setPickups(list);
        if (list.length > 0 && !selectedPickup) {
          setSelectedPickup(list[0]);
          setScaleWeight((list[0].estimatedWeightKg + 1.2).toFixed(1));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  const handleSelectPickup = (p: PickupRequest) => {
    soundEffects.playClick();
    setSelectedPickup(p);
    setScaleWeight((p.estimatedWeightKg + 1.2).toFixed(1));
    setMessage(null);
    setErrorMsg(null);
  };

  // Assign Driver & Fleet Vehicle
  const handleAssignFleet = async () => {
    if (!selectedPickup) return;
    soundEffects.playClick();
    setIsUpdating(true);
    setMessage(null);
    setErrorMsg(null);

    try {
      const actor = {
        id: user?.id || 'partner_apex_fleet',
        name: user?.name || 'Apex Green Fleet (Logistics)',
        role: 'partner',
      };

      const res = await assignPartnerAction(
        selectedPickup.id,
        actor.id,
        user?.organization || 'Apex Green Logistics Ltd',
        driverName,
        vehicleNumber,
        actor
      );

      if (res.success && res.pickup) {
        soundEffects.playSuccess();
        setMessage(`Fleet assigned: Driver ${driverName} (${vehicleNumber}) allocated to Consignment #${selectedPickup.id.slice(-6)}.`);
        voiceAssistant.speak(`Fleet dispatched with driver ${driverName}.`);
        setSelectedPickup(res.pickup);
        await fetchPickups();
      } else {
        soundEffects.playError();
        setErrorMsg(res.error || 'Failed to assign fleet.');
      }
    } catch (e: any) {
      soundEffects.playError();
      setErrorMsg(e?.message || 'Error assigning fleet.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Record Calibrated Weighbridge Reading
  const handleUpdateWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPickup) return;

    soundEffects.playClick();
    setIsUpdating(true);
    setMessage(null);
    setErrorMsg(null);

    const gross = Number(scaleWeight);
    const tare = Number(tareWeight);

    if (gross <= tare) {
      setErrorMsg('Gross scale weight must exceed container tare weight.');
      setIsUpdating(false);
      return;
    }

    const netWeight = (gross - tare).toFixed(1);

    try {
      const actor = {
        id: user?.id || 'partner_apex_fleet',
        name: user?.name || 'Apex Green Fleet (Logistics)',
        role: 'partner',
      };

      const res = await recordWeighbridgeAction(
        selectedPickup.id,
        gross,
        tare,
        scaleSerial,
        actor
      );

      if (res.success && res.pickup) {
        soundEffects.playSuccess();
        setMessage(`Consignment #${selectedPickup.id.slice(-6)} verified with certified net weight ${netWeight}kg.`);
        voiceAssistant.speak(`Consignment weighed and certified at ${netWeight} kilograms.`);
        setSelectedPickup(res.pickup);
        await fetchPickups();
      } else {
        soundEffects.playError();
        setErrorMsg(res.error || 'Update failed');
      }
    } catch (err: any) {
      soundEffects.playError();
      setErrorMsg(err?.message || 'Error updating status');
    } finally {
      setIsUpdating(false);
    }
  };

  // Dispatch to Certified Smelter
  const handleDispatchToSmelter = async () => {
    if (!selectedPickup) return;
    soundEffects.playClick();
    setIsUpdating(true);
    setMessage(null);
    setErrorMsg(null);

    try {
      const actor = {
        id: user?.id || 'partner_apex_fleet',
        name: user?.name || 'Apex Green Fleet (Logistics)',
        role: 'partner',
      };

      const res = await updatePickupStatusAction(
        selectedPickup.id,
        'ReceivedAtCenter',
        actor,
        `Sealed consignment handed over to smelter transit hub under manifest #MF-${selectedPickup.id.slice(-6)}.`
      );

      if (res.success && res.pickup) {
        soundEffects.playSuccess();
        setMessage(`Consignment dispatched to certified smelter hub.`);
        voiceAssistant.speak(`Consignment transferred to certified hydrometallurgy smelter.`);
        setSelectedPickup(res.pickup);
        await fetchPickups();
      } else {
        soundEffects.playError();
        setErrorMsg(res.error || 'Dispatch update failed');
      }
    } catch (e: any) {
      soundEffects.playError();
      setErrorMsg(e?.message || 'Error dispatching');
    } finally {
      setIsUpdating(false);
    }
  };

  const netCalculated = Math.max(0, Number(scaleWeight) - Number(tareWeight)).toFixed(1);

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-500/20 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Truck className="w-3.5 h-3.5" />
            <span>Authorized Collection Center &bull; Logistics Terminal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Logistics &amp; Calibrated Intake Operations
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Logged in as <span className="text-cyan-400 font-mono font-medium">{user?.name}</span> &bull; Facility:{' '}
            <span className="text-white">{user?.organization || 'Apex Green Fleet Hub #04'}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            soundEffects.playClick();
            fetchPickups();
          }}
          className="self-start md:self-auto px-4 py-2 rounded-xl bg-nexus-card border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-300 text-xs font-mono flex items-center space-x-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Pickup Selection Queue */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Truck className="w-4 h-4 text-cyan-400" />
              <span>Assigned Consignments Queue</span>
            </h2>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
              {pickups.length} manifests
            </span>
          </div>

          <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
            {pickups.map((p) => {
              const isSelected = selectedPickup?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectPickup(p)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                      : 'bg-nexus-card border-cyan-500/15 hover:border-cyan-500/40 text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      #{p.id.slice(-8)}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-nexus-dark text-cyan-300 border border-cyan-500/30">
                      {p.currentStatus}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-white">{p.category}</h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">{p.address}</p>

                  <div className="mt-3 pt-2 border-t border-cyan-500/10 flex items-center justify-between text-[11px] font-mono text-gray-400">
                    <span>
                      Est: <strong>{p.estimatedWeightKg} kg</strong> &bull; {p.estimatedQuantity} units
                    </span>
                    <span className="text-cyan-300 font-bold">{p.scheduledDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Certified Scale Weight Calibration Terminal */}
        <div className="lg:col-span-7 bg-nexus-card border border-cyan-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          {selectedPickup ? (
            <div>
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-6">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-cyan-400">CALIBRATED INTAKE DOCK</span>
                    <span className="text-xs font-mono text-gray-500">PIN: CPCB-{selectedPickup.id.slice(-4).toUpperCase()}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {selectedPickup.category} &bull; #{selectedPickup.id.slice(-8)}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Consignor: {selectedPickup.userName} &bull; {selectedPickup.userPhone}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <Scale className="w-6 h-6 text-cyan-400" />
                </div>
              </div>

              {/* Section 1: Dispatch & Driver Allocation */}
              <div className="p-4 rounded-2xl bg-nexus-dark/60 border border-cyan-500/20 space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-gray-300 flex items-center space-x-1.5">
                    <UserCheck className="w-4 h-4 text-cyan-400" />
                    <span>FLEET DRIVER ALLOCATION</span>
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400">
                    Status: {selectedPickup.currentStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1">
                      ASSIGNED DRIVER NAME
                    </label>
                    <input
                      type="text"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1">
                      VEHICLE REGISTRATION NUMBER
                    </label>
                    <input
                      type="text"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleAssignFleet}
                    disabled={isUpdating}
                    className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/40 flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Assign Fleet Vehicle</span>
                  </button>
                </div>
              </div>

              {/* Section 2: Certified Weighbridge Telemetry Form */}
              <form onSubmit={handleUpdateWeight} className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-gray-300 flex items-center space-x-1.5">
                    <Scale className="w-4 h-4 text-emerald-400" />
                    <span>DIGITAL WEIGHBRIDGE SCALE TELEMETRY</span>
                  </span>
                  <span className="text-[11px] font-mono text-gray-500">Legal Metrology Act</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1">
                      SCALE SERIAL ID
                    </label>
                    <input
                      type="text"
                      value={scaleSerial}
                      onChange={(e) => setScaleSerial(e.target.value)}
                      className="w-full bg-nexus-dark border border-cyan-500/30 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1">
                      GROSS WEIGHT (KG)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={scaleWeight}
                      onChange={(e) => setScaleWeight(e.target.value)}
                      required
                      className="w-full bg-nexus-dark border border-cyan-500/30 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1">
                      TARE WEIGHT (KG)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={tareWeight}
                      onChange={(e) => setTareWeight(e.target.value)}
                      required
                      className="w-full bg-nexus-dark border border-cyan-500/30 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Net Verified Weight Readout */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-nexus-dark to-emerald-950/70 border border-cyan-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-gray-400 block">COMPUTED NET CERTIFIED WEIGHT</span>
                    <span className="text-[11px] text-gray-500">NIST 800-88 &amp; CPCB Calibrated</span>
                  </div>
                  <span className="text-3xl font-mono font-black text-cyan-300">
                    {netCalculated} <span className="text-base font-sans text-gray-400">kg</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-nexus-dark font-extrabold text-xs shadow-glow-green transition-all disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>{isUpdating ? 'Sealing Telemetry...' : 'Stamp Certified Scale Weight'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDispatchToSmelter}
                    disabled={isUpdating}
                    className="py-3.5 px-4 rounded-xl bg-nexus-dark hover:bg-slate-800 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>Dispatch to Smelter Facility</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="py-24 text-center text-gray-400 text-sm space-y-2">
              <Scale className="w-10 h-10 text-cyan-500/40 mx-auto" />
              <div>Select a consignment manifest from the queue on the left to begin intake calibration.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
