'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { soundEffects } from '@/lib/sound';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { recordSmelterAssayAction } from '@/actions/pickupActions';
import { PickupRequest, EPRRecord } from '@/lib/types';
import { CertificateModal } from '@/components/CertificateModal';
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
  AlertCircle,
  FileText,
  Scale,
  RefreshCw,
  Coins,
  Package,
} from 'lucide-react';

const PRODUCER_ORGANIZATIONS = [
  'Samsung India Electronics Pvt Ltd',
  'Apple India Pvt Ltd',
  'Dell Technologies India',
  'HP India Sales Pvt Ltd',
  'Lenovo India Pvt Ltd',
  'Xiaomi Technology India',
];

export default function RecyclerHubPage() {
  const { user } = useAuthStore();
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [selectedPickup, setSelectedPickup] = useState<PickupRequest | null>(null);
  const [eprRecords, setEprRecords] = useState<EPRRecord[]>([]);
  const [selectedCertPickup, setSelectedCertPickup] = useState<PickupRequest | null>(null);

  const [method, setMethod] = useState<'Hydrometallurgy' | 'Pyrometallurgy' | 'Mechanical Shredding'>(
    'Hydrometallurgy'
  );
  const [targetProducer, setTargetProducer] = useState<string>(PRODUCER_ORGANIZATIONS[0]);
  const [inputWeightKg, setInputWeightKg] = useState<number>(25.0);
  const [goldGrams, setGoldGrams] = useState<number>(8.5);
  const [copperKg, setCopperKg] = useState<number>(5.2);
  const [lithiumKg, setLithiumKg] = useState<number>(1.8);
  const [silverGrams, setSilverGrams] = useState<number>(18.0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchConsignments = async () => {
    try {
      const [pickupRes, eprRes] = await Promise.all([
        fetch('/api/pickups'),
        fetch('/api/epr'),
      ]);

      if (pickupRes.ok) {
        const pData = await pickupRes.json();
        const list: PickupRequest[] = pData.pickups || pData.data || [];
        setPickups(list);
        if (list.length > 0 && !selectedPickup) {
          const defaultPick = list.find((p) => p.currentStatus === 'Weighed' || p.currentStatus === 'ReceivedAtCenter') || list[0];
          setSelectedPickup(defaultPick);
          const weight = defaultPick.actualWeightKg || defaultPick.estimatedWeightKg || 25.0;
          setInputWeightKg(weight);
          setGoldGrams(Math.round(weight * 0.35 * 10) / 10);
          setCopperKg(Math.round(weight * 0.22 * 10) / 10);
          setLithiumKg(Math.round(weight * 0.08 * 10) / 10);
          setSilverGrams(Math.round(weight * 0.75 * 10) / 10);
        }
      }

      if (eprRes.ok) {
        const eData = await eprRes.json();
        setEprRecords(eData.eprRecords || eData.data || []);
      }
    } catch (e) {
      console.error('Failed to load recycler hub data', e);
    }
  };

  useEffect(() => {
    fetchConsignments();
  }, []);

  const handleSelectPickup = (p: PickupRequest) => {
    soundEffects.playClick();
    setSelectedPickup(p);
    const weight = p.actualWeightKg || p.estimatedWeightKg || 25.0;
    setInputWeightKg(weight);
    setGoldGrams(Math.round(weight * 0.35 * 10) / 10);
    setCopperKg(Math.round(weight * 0.22 * 10) / 10);
    setLithiumKg(Math.round(weight * 0.08 * 10) / 10);
    setSilverGrams(Math.round(weight * 0.75 * 10) / 10);
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  const handleRecordAssay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPickup) return;

    soundEffects.playClick();
    setIsSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const actor = {
        id: user?.id || 'usr_recycler_01',
        name: user?.name || 'EcoRefine Hydrometallurgy Ltd',
        role: 'recycler',
      };

      const res = await recordSmelterAssayAction(
        selectedPickup.id,
        {
          method,
          inputWeightKg,
          goldGrams,
          copperKg,
          lithiumKg,
          silverGrams,
          targetProducer,
        },
        actor
      );

      if (res.success && res.eprRecord) {
        soundEffects.playSuccess();
        setSuccessMsg(
          `Refining assay certified! Minted ${res.eprRecord.creditUnits} EPR credit units (#${res.eprRecord.certificateNumber}) allocated to ${targetProducer}.`
        );
        voiceAssistant.speak(
          `Hydrometallurgical refining batch logged with ${goldGrams} grams of fine gold recovered.`
        );
        await fetchConsignments();
      } else {
        soundEffects.playError();
        setErrorMsg(res.error || 'Failed to mint EPR credits.');
      }
    } catch (err: any) {
      soundEffects.playError();
      setErrorMsg(err?.message || 'Error recording assay.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/20 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Certified Smelter &bull; Hydrometallurgy &amp; EPR Credit Minting</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Refining Assay &amp; EPR Credit Minting Console
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Operating Facility:{' '}
            <span className="text-amber-400 font-mono font-medium">
              {user?.organization || 'EcoRefine Hydrometallurgy Ltd (CPCB Smelter #08)'}
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            soundEffects.playClick();
            fetchConsignments();
          }}
          className="self-start md:self-auto px-4 py-2 rounded-xl bg-nexus-card border border-amber-500/30 hover:border-amber-500/50 text-amber-300 text-xs font-mono flex items-center space-x-2 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Smelter Queue</span>
        </button>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Received Consignments Queue */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Package className="w-4 h-4 text-amber-400" />
              <span>Incoming Intake Manifests</span>
            </h2>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              {pickups.length} shipments
            </span>
          </div>

          <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
            {pickups.map((p) => {
              const isSelected = selectedPickup?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectPickup(p)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                      : 'bg-nexus-card border-amber-500/15 hover:border-amber-500/40 text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      #{p.id.slice(-8)}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-nexus-dark text-amber-300 border border-amber-500/30">
                      {p.currentStatus}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-white">{p.category}</h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">{p.address}</p>

                  <div className="mt-3 pt-2 border-t border-amber-500/10 flex items-center justify-between text-[11px] font-mono text-gray-400">
                    <span>
                      Scale: <strong>{p.actualWeightKg ? `${p.actualWeightKg} kg` : `${p.estimatedWeightKg} kg`}</strong>
                    </span>
                    <span className="text-amber-300 font-bold">{p.scheduledDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Smelting Assay & EPR Minting Terminal */}
        <div className="lg:col-span-7 bg-nexus-card border border-amber-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          {selectedPickup ? (
            <div>
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-4 mb-6">
                <div>
                  <span className="text-xs font-mono text-amber-400">SMELTING &amp; ASSAY LOT TERMINAL</span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {selectedPickup.category} &bull; #{selectedPickup.id.slice(-8)}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Weighbridge Net: <strong className="text-amber-400">{selectedPickup.actualWeightKg || selectedPickup.estimatedWeightKg} kg</strong>
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-amber-400" />
                </div>
              </div>

              <form onSubmit={handleRecordAssay} className="space-y-4">
                {/* Method */}
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

                {/* Target Producer */}
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">
                    TARGET PRODUCER / OEM (EPR QUOTA ALLOCATION)
                  </label>
                  <select
                    value={targetProducer}
                    onChange={(e) => setTargetProducer(e.target.value)}
                    className="w-full bg-nexus-dark border border-amber-500/30 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 font-sans"
                  >
                    {PRODUCER_ORGANIZATIONS.map((org) => (
                      <option key={org} value={org}>
                        {org}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Yield Commodities */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">
                      GOLD (Au) RECOVERED (GRAMS)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={goldGrams}
                      onChange={(e) => setGoldGrams(Number(e.target.value))}
                      required
                      className="w-full bg-nexus-dark border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">
                      COPPER (Cu) RECOVERED (KG)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={copperKg}
                      onChange={(e) => setCopperKg(Number(e.target.value))}
                      required
                      className="w-full bg-nexus-dark border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">
                      LITHIUM / COBALT (KG)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={lithiumKg}
                      onChange={(e) => setLithiumKg(Number(e.target.value))}
                      className="w-full bg-nexus-dark border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-xs font-mono text-emerald-300 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">
                      SILVER (Ag) RECOVERED (GRAMS)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={silverGrams}
                      onChange={(e) => setSilverGrams(Number(e.target.value))}
                      className="w-full bg-nexus-dark border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-xs font-mono text-gray-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Minting Preview Box */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/70 via-nexus-dark to-amber-950/70 border border-amber-500/30 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-gray-300 block font-bold">STATUTORY CPCB EPR CREDITS MINTED:</span>
                    <span className="text-[11px] text-gray-500">Form-6 Recycling Manifest</span>
                  </div>
                  <span className="text-2xl font-mono font-bold text-amber-400">
                    {Math.round(inputWeightKg * 10)} <span className="text-xs text-gray-400">Credits</span>
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-nexus-dark font-extrabold text-sm shadow-glow-amber transition-all disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? 'Minting CPCB Form-6 Manifest...' : 'Mint Official EPR Credit & Seal Batch'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </form>
            </div>
          ) : (
            <div className="py-24 text-center text-gray-400 text-sm">
              Select a manifest from the left queue to begin smelting assay.
            </div>
          )}
        </div>
      </div>

      {/* Minted EPR Credits Ledger Table */}
      <div className="bg-nexus-card border border-amber-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/15 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Certified EPR Credits Minted by Recycler ({eprRecords.length})</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              CPCB statutory quotas fulfilled for participating OEM producers
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-amber-500/20 text-gray-400 uppercase text-[10px]">
                <th className="py-3 px-3">Certificate #</th>
                <th className="py-3 px-3">Target OEM Producer</th>
                <th className="py-3 px-3">Eligible Weight</th>
                <th className="py-3 px-3">EPR Credits</th>
                <th className="py-3 px-3">Approval Status</th>
                <th className="py-3 px-3 text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-500/10 text-gray-300">
              {eprRecords.map((r) => (
                <tr key={r.id} className="hover:bg-amber-500/5 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-amber-400">
                    {r.certificateNumber || `#EPR-${r.id.slice(-6)}`}
                  </td>
                  <td className="py-3.5 px-3 text-white font-sans font-medium">
                    {r.producerName || r.targetProducer || 'Samsung India Electronics'}
                  </td>
                  <td className="py-3.5 px-3">{r.eligibleWeightKg || r.creditsEarnedKg || 25} kg</td>
                  <td className="py-3.5 px-3 font-bold text-emerald-400">
                    {r.creditUnits || Math.round((r.creditsEarnedKg || 25) * 10)} Units
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px]">
                      {r.approvalStatus || 'Approved'}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playClick();
                        const matchingPickup = pickups.find((p) => p.id === r.pickupId) || {
                          id: r.id,
                          userId: 'user_sample',
                          userName: r.producerName,
                          userEmail: 'cpcb@nexus.eco',
                          userPhone: '+91 98059 26846',
                          category: (r.materialCategory as any) || 'Laptops and Computers',
                          estimatedQuantity: 5,
                          estimatedWeightKg: r.creditsEarnedKg || 25,
                          actualWeightKg: r.creditsEarnedKg || 25,
                          address: 'Industrial Area Phase 2, Okhla, New Delhi 110020',
                          scheduledDate: new Date().toISOString().split('T')[0],
                          currentStatus: 'Certified',
                          statusHistory: [],
                          createdAt: r.issuedAt || new Date().toISOString(),
                          updatedAt: r.issuedAt || new Date().toISOString(),
                        };
                        setSelectedCertPickup(matchingPickup as any);
                      }}
                      className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-sans border border-amber-500/30 cursor-pointer"
                    >
                      View Form-6
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedCertPickup && (
        <CertificateModal
          pickup={selectedCertPickup}
          onClose={() => setSelectedCertPickup(null)}
        />
      )}
    </div>
  );
}
