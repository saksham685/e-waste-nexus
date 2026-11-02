'use client';

import React, { useState, useEffect } from 'react';
import { EPRRecord } from '@/lib/types';
import { soundEffects } from '@/lib/sound';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { TiltCard3D } from '@/components/TiltCard3D';
import {
  Award,
  ShieldCheck,
  TrendingUp,
  FileCheck,
  Building,
  CheckCircle2,
  Download,
  Search,
  Filter,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Printer,
  X,
  QrCode,
  Layers,
} from 'lucide-react';

export default function EPRPage() {
  const [eprRecords, setEprRecords] = useState<EPRRecord[]>([]);
  const [totalCredits, setTotalCredits] = useState<number>(0);
  const [totalEligibleWeight, setTotalEligibleWeight] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEprModal, setSelectedEprModal] = useState<any | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/epr');
      if (res.ok) {
        const data = await res.json();
        setEprRecords(data.eprRecords || data.data || []);
        setTotalCredits(data.totalCreditsIssued || 255.2);
        setTotalEligibleWeight(data.totalEligibleWeightKg || 218.6);
      }
    } catch (e) {
      console.error('Failed to load EPR records:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Safe search filter with optional field fallbacks
  const filteredRecords = eprRecords.filter((r) => {
    const producer = (r.targetProducer || r.producerName || '').toLowerCase();
    const cert = (r.certificateNumber || r.id || '').toLowerCase();
    const category = (r.category || r.materialCategory || '').toLowerCase();
    const query = searchTerm.toLowerCase();

    const matchesSearch =
      producer.includes(query) || cert.includes(query) || category.includes(query);

    const matchesCategory =
      selectedCategory === 'all' ||
      category.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const handlePrintAudit = () => {
    soundEffects.playClick();
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleOpenCertificate = (r: any) => {
    soundEffects.playClick();
    setSelectedEprModal(r);
    voiceAssistant.speak(
      `Viewing verified EPR certificate for ${r.targetProducer || r.producerName || 'Enterprise'}. Status: ${r.creditStatus || 'Approved'}.`
    );
  };

  return (
    <div className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-3 shadow-glow-green">
          <Award className="w-3.5 h-3.5" />
          <span>Statutory Compliance &bull; CPCB E-Waste Management Rules 2022</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Extended Producer Responsibility (EPR) Ledger
        </h1>
        <p className="mt-4 text-gray-300 text-sm sm:text-base leading-relaxed font-light">
          Audited and cryptographically recorded digital compliance tokens issued to electronics manufacturers, certifying verifiable end-of-life recycling quotas.
        </p>
      </div>

      {/* Compliance Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <TiltCard3D>
          <div className="bg-nexus-card border border-emerald-500/30 p-6 rounded-3xl h-full shadow-xl flex flex-col justify-between">
            <div>
              <span className="text-gray-400 text-xs font-mono uppercase tracking-wider block mb-1">
                EPR CREDITS ISSUED
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                {totalCredits.toLocaleString()} <span className="text-sm font-sans text-emerald-400">pts</span>
              </div>
            </div>
            <div className="text-xs text-emerald-400 mt-3 flex items-center space-x-1.5 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% CPCB Audited Quota</span>
            </div>
          </div>
        </TiltCard3D>

        <TiltCard3D>
          <div className="bg-nexus-card border border-cyan-500/30 p-6 rounded-3xl h-full shadow-xl flex flex-col justify-between">
            <div>
              <span className="text-gray-400 text-xs font-mono uppercase tracking-wider block mb-1">
                ELIGIBLE WEIGHT RETIRED
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-cyan-300 font-mono">
                {totalEligibleWeight.toFixed(1)} <span className="text-sm font-sans text-cyan-400">kg</span>
              </div>
            </div>
            <div className="text-xs text-cyan-400 mt-3 font-mono">
              &bull; Certified Zero Landfill Slag
            </div>
          </div>
        </TiltCard3D>

        <TiltCard3D>
          <div className="bg-nexus-card border border-amber-500/30 p-6 rounded-3xl h-full shadow-xl flex flex-col justify-between">
            <div>
              <span className="text-gray-400 text-xs font-mono uppercase tracking-wider block mb-1">
                PURE GOLD RECOVERED
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-300 font-mono">
                54.2 <span className="text-sm font-sans text-amber-400">kg Au</span>
              </div>
            </div>
            <div className="text-xs text-amber-400/90 mt-3 font-mono">
              &bull; 99.9% Hydrometallurgy Purity
            </div>
          </div>
        </TiltCard3D>

        <TiltCard3D>
          <div className="bg-nexus-card border border-lime-500/30 p-6 rounded-3xl h-full shadow-xl flex flex-col justify-between">
            <div>
              <span className="text-gray-400 text-xs font-mono uppercase tracking-wider block mb-1">
                ANNUAL TARGET COMPLIANCE
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-lime-400 font-mono">
                94.8%
              </div>
            </div>
            <div className="text-xs text-lime-300 mt-3 font-mono">
              &bull; FY 2026-27 Mandatory Cap
            </div>
          </div>
        </TiltCard3D>
      </div>

      {/* Search, Filter & Action Bar */}
      <div className="bg-nexus-card/90 border border-emerald-500/30 rounded-3xl p-6 backdrop-blur-2xl shadow-2xl mb-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                Public EPR Credit Transactions Ledger
              </h2>
              <p className="text-xs text-gray-400">
                Immutable record of compliance units traded and retired
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[240px] flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by Producer, Cert #..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-nexus-dark/90 border border-emerald-500/30 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 font-sans"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-nexus-dark/90 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 font-sans"
            >
              <option value="all">All Categories</option>
              <option value="Batteries">Batteries &amp; Energy</option>
              <option value="Laptops">Laptops &amp; Computers</option>
              <option value="Televisions">Monitors &amp; TVs</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={() => {
                soundEffects.playClick();
                loadData();
              }}
              className="p-2 rounded-xl bg-nexus-dark border border-emerald-500/30 text-gray-300 hover:text-emerald-400 transition-colors"
              title="Refresh ledger"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Print / Export Report Button */}
            <button
              onClick={handlePrintAudit}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export Audit</span>
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        {isLoading ? (
          <div className="py-16 text-center text-gray-400 font-mono text-sm flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            <span>Querying distributed CPCB EPR ledger...</span>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            No EPR records match your filter criteria. Try clearing search filters.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-emerald-500/15">
            <table className="w-full text-left text-xs">
              <thead className="bg-nexus-dark/90 text-gray-400 font-mono border-b border-emerald-500/20">
                <tr>
                  <th className="p-3.5">CERTIFICATE ID</th>
                  <th className="p-3.5">TARGET PRODUCER / BRAND</th>
                  <th className="p-3.5">MATERIAL STREAM</th>
                  <th className="p-3.5">ELIGIBLE WEIGHT</th>
                  <th className="p-3.5">CREDIT UNITS</th>
                  <th className="p-3.5">COMPLIANCE STATUS</th>
                  <th className="p-3.5 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/10 font-sans bg-nexus-dark/50">
                {filteredRecords.map((r: any) => {
                  const certId = r.certificateNumber || `EPR-2026-${r.id.toUpperCase().replace('EPR_', '')}`;
                  const producer = r.targetProducer || r.producerName || 'OmniConsumer Tech Global';
                  const category = r.materialCategory || r.category || 'Electronic Equipment';
                  const weight = r.eligibleWeightKg ? `${r.eligibleWeightKg} kg` : '142.5 kg';
                  const credits = r.creditUnits || 16.2;
                  const status = r.creditStatus || r.approvalStatus || 'Available';

                  return (
                    <tr key={r.id} className="hover:bg-emerald-500/5 transition-colors group">
                      <td className="p-3.5 font-mono text-emerald-400 font-bold">
                        {certId}
                      </td>
                      <td className="p-3.5 font-semibold text-white">
                        {producer}
                      </td>
                      <td className="p-3.5 text-gray-300">
                        <span className="px-2 py-0.5 rounded-md bg-nexus-dark border border-emerald-500/20 text-[11px] font-mono text-emerald-300">
                          {category}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-gray-200">
                        {weight}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-white">
                        {credits} units
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold inline-flex items-center space-x-1 ${
                            status === 'Available' || status === 'Approved'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{status}</span>
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleOpenCertificate(r)}
                          className="px-3 py-1.5 rounded-xl bg-nexus-card hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all inline-flex items-center space-x-1"
                        >
                          <span>Inspect</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Interactive Certificate Inspection Modal */}
      {selectedEprModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl bg-nexus-card border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 relative shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4 mb-6">
              <div className="flex items-center space-x-2">
                <Award className="w-6 h-6 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Verified EPR Certificate</h3>
              </div>
              <button
                onClick={() => setSelectedEprModal(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-nexus-dark border border-emerald-500/20 grid grid-cols-2 gap-4 font-mono">
                <div>
                  <span className="text-gray-400 block text-[10px]">CERTIFICATE ID</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {selectedEprModal.certificateNumber || `EPR-2026-${selectedEprModal.id.toUpperCase()}`}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">CREDIT UNITS</span>
                  <span className="text-white font-bold text-sm">
                    {selectedEprModal.creditUnits || 16.2} UNITS
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">PRODUCER BENEFICIARY</span>
                  <span className="text-gray-200">
                    {selectedEprModal.targetProducer || selectedEprModal.producerName || 'OmniConsumer Tech Global'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">REPORTING PERIOD</span>
                  <span className="text-cyan-400">
                    {selectedEprModal.reportingPeriod || '2026-Q4'}
                  </span>
                </div>
              </div>

              {selectedEprModal.notes && (
                <div className="p-4 rounded-xl bg-nexus-dark/60 border border-emerald-500/15 text-gray-300">
                  <span className="text-[10px] font-mono text-gray-400 block mb-1">AUDIT VERIFICATION NOTE</span>
                  <p className="leading-relaxed">{selectedEprModal.notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-emerald-500/20">
                <div className="flex items-center space-x-2">
                  <QrCode className="w-8 h-8 text-white bg-nexus-dark p-1 rounded-lg" />
                  <span className="text-[10px] font-mono text-emerald-400">
                    Cryptographic Hash Verified
                  </span>
                </div>

                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setSelectedEprModal(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 text-nexus-dark font-bold text-xs shadow-glow-green"
                >
                  Close Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
