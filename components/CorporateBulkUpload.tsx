'use client';

import React, { useState, useMemo } from 'react';
import { z } from 'zod';
import {
  Building2,
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Coins,
  ShieldCheck,
  Server,
  Laptop,
  ArrowRight,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { soundEffects } from '@/lib/sound';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { createPickupAction } from '@/actions/pickupActions';

// Zod Schema for Corporate Asset Items (Syllabus: Form Handling & Zod Validation)
const bulkItemSchema = z.object({
  assetTag: z.string().min(2, 'Asset tag required'),
  category: z.enum([
    'Laptops and Computers',
    'Printers and Office Electronics',
    'Televisions and Monitors',
    'Other Electronic Waste',
  ]),
  brandModel: z.string().min(2, 'Model required'),
  units: z.number().min(1, 'Units must be at least 1'),
  weightKg: z.number().min(0.5, 'Weight must be at least 0.5kg'),
});

type BulkItem = z.infer<typeof bulkItemSchema>;

const SAMPLE_CORPORATE_BATCH: BulkItem[] = [
  { assetTag: 'SRV-DL-8821', category: 'Laptops and Computers', brandModel: 'Dell PowerEdge R740 Server', units: 6, weightKg: 126.0 },
  { assetTag: 'LPT-MB-4019', category: 'Laptops and Computers', brandModel: 'Apple MacBook Pro 16" (2020)', units: 28, weightKg: 58.8 },
  { assetTag: 'LPT-TP-1120', category: 'Laptops and Computers', brandModel: 'Lenovo ThinkPad T14 Gen 2', units: 34, weightKg: 51.0 },
  { assetTag: 'NET-CS-9941', category: 'Other Electronic Waste', brandModel: 'Cisco Catalyst 2960 Switch', units: 8, weightKg: 36.4 },
  { assetTag: 'MON-DE-3320', category: 'Televisions and Monitors', brandModel: 'Dell UltraSharp 27" 4K Monitor', units: 18, weightKg: 108.0 },
];

export const CorporateBulkUpload: React.FC = () => {
  const [items, setItems] = useState<BulkItem[]>(SAMPLE_CORPORATE_BATCH);
  const [companyName, setCompanyName] = useState<string>('TechCorp Global Solutions Pvt Ltd');
  const [pickupAddress, setPickupAddress] = useState<string>('Tower C, Cyber City Phase 2, Gurugram, Haryana 122002');
  const [dataSanitizationConsent, setDataSanitizationConsent] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Computed Totals using ES6 .reduce() (Syllabus: JavaScript ES6+ & Array methods)
  const batchSummary = useMemo(() => {
    const totalUnits = items.reduce((acc, item) => acc + item.units, 0);
    const totalWeightKg = items.reduce((acc, item) => acc + item.weightKg, 0);
    const totalTonnage = Math.round((totalWeightKg / 1000) * 100) / 100;
    const estimatedValueInr = Math.round(totalWeightKg * 420);
    const estimatedGoldGrams = Math.round(totalWeightKg * 0.38 * 10) / 10;
    const co2SavedKg = Math.round(totalWeightKg * 1.84);

    return {
      totalUnits,
      totalWeightKg: Math.round(totalWeightKg * 10) / 10,
      totalTonnage,
      estimatedValueInr: estimatedValueInr.toLocaleString('en-IN'),
      estimatedGoldGrams,
      co2SavedKg,
    };
  }, [items]);

  const handleLoadSample = () => {
    soundEffects.playClick();
    setItems(SAMPLE_CORPORATE_BATCH);
    setSuccessMsg('Loaded 94 enterprise IT decommissioning assets.');
  };

  const handleClear = () => {
    soundEffects.playClick();
    setItems([]);
  };

  const handleSubmitBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMsg('Please add or load at least one asset item.');
      return;
    }

    soundEffects.playClick();
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const result = await createPickupAction(
        {
          category: 'Laptops and Computers',
          estimatedQuantity: batchSummary.totalUnits,
          estimatedWeightKg: batchSummary.totalWeightKg,
          address: pickupAddress,
          scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          timeSlot: 'Morning (09:00 - 12:00)',
          specialInstructions: `Corporate Decommissioning: ${companyName}. NIST 800-88 Data Sanitization Certified. Total Assets: ${batchSummary.totalUnits} units (${batchSummary.totalWeightKg}kg).`,
        },
        {
          id: 'corp_' + Date.now(),
          name: companyName,
          email: 'it-assets@techcorp.com',
          phone: '+91 98112 04821',
        }
      );

      if (result.success && result.pickup) {
        soundEffects.playSuccess();
        setSuccessMsg(
          `Corporate Bulk Manifest #${result.pickup.id.slice(-6)} booked! NIST 800-88 sanitization scheduled with dedicated heavy logistics fleet.`
        );
        voiceAssistant.speak(
          `Corporate decommissioning batch of ${batchSummary.totalUnits} assets registered with certified CPCB chain-of-custody.`
        );
      } else {
        soundEffects.playError();
        setErrorMsg(result.error || 'Failed to submit bulk corporate manifest.');
      }
    } catch (e: any) {
      soundEffects.playError();
      setErrorMsg(e?.message || 'Error submitting corporate batch.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-nexus-card border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Enterprise B2B IT Asset Decommissioning</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Bulk E-Waste Disposal &amp; NIST 800-88 Sanitization
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Bulk lot disposal for enterprise data centers, corporate IT fleets, and office campuses.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleLoadSample}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40 flex items-center space-x-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load 94 IT Assets</span>
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-red-500/40 text-gray-400 hover:text-red-400 cursor-pointer"
            title="Clear list"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Corporate Summary Metric Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-nexus-dark/70 border border-emerald-500/20 text-xs font-mono">
        <div>
          <span className="text-gray-500 block text-[10px]">TOTAL ASSETS</span>
          <span className="text-white font-black text-lg">{batchSummary.totalUnits} units</span>
        </div>
        <div>
          <span className="text-gray-500 block text-[10px]">TOTAL WEIGHT</span>
          <span className="text-cyan-400 font-black text-lg">{batchSummary.totalWeightKg} kg</span>
        </div>
        <div>
          <span className="text-gray-500 block text-[10px]">EST. SCRAP VALUE</span>
          <span className="text-lime-400 font-black text-lg">₹{batchSummary.estimatedValueInr}</span>
        </div>
        <div>
          <span className="text-gray-500 block text-[10px]">EST. GOLD YIELD</span>
          <span className="text-amber-400 font-black text-lg">{batchSummary.estimatedGoldGrams} g Au</span>
        </div>
      </div>

      {/* Assets Table */}
      <div className="border border-white/10 rounded-2xl overflow-hidden bg-slate-950/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-slate-900/80 border-b border-white/10 text-gray-400 text-[10px] uppercase">
                <th className="py-2.5 px-3">Asset Tag</th>
                <th className="py-2.5 px-3">Make / Brand / Spec</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Units</th>
                <th className="py-2.5 px-3">Weight (kg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/5">
                  <td className="py-2.5 px-3 font-bold text-emerald-400">{item.assetTag}</td>
                  <td className="py-2.5 px-3 text-white font-sans font-medium">{item.brandModel}</td>
                  <td className="py-2.5 px-3 text-gray-400 text-[11px]">{item.category}</td>
                  <td className="py-2.5 px-3 text-cyan-300 font-bold">{item.units}</td>
                  <td className="py-2.5 px-3 font-bold">{item.weightKg} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submission Form */}
      <form onSubmit={handleSubmitBatch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Company / Entity Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Facility / Campus Pickup Address
            </label>
            <input
              type="text"
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              required
              className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        {/* NIST 800-88 Data Sanitization Agreement Checkbox */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-500/20 flex items-start space-x-3 text-xs">
          <input
            type="checkbox"
            id="nistConsent"
            checked={dataSanitizationConsent}
            onChange={(e) => setDataSanitizationConsent(e.target.checked)}
            className="mt-0.5 rounded border-emerald-500 text-emerald-500 focus:ring-0 cursor-pointer"
          />
          <label htmlFor="nistConsent" className="text-gray-300 cursor-pointer text-[11px] leading-relaxed">
            <strong className="text-white">Require Certified NIST 800-88 Rev 1 Data Sanitization:</strong>{' '}
            All storage drives (SSDs, NVMe, SAS HDDs) must undergo cryptographically verified multi-pass data shredding and physical degaussing with state compliance certificate.
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !dataSanitizationConsent}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-nexus-dark font-black text-sm tracking-wide shadow-glow-green transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <span>Allocating Heavy Logistics Fleet &bull; CPCB Manifest...</span>
          ) : (
            <>
              <Building2 className="w-4 h-4" />
              <span>Schedule Corporate Decommissioning Batch ({batchSummary.totalUnits} Assets)</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
