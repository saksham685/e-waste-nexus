'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { EPRRecord } from '@/lib/types';
import { soundEffects } from '@/lib/sound';
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
} from 'lucide-react';

export default function EPRPage() {
  const [eprRecords, setEprRecords] = useState<EPRRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/epr');
        if (res.ok) {
          const data = await res.json();
          setEprRecords(data.eprRecords || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredRecords = eprRecords.filter(
    (r) =>
      r.producerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.category || r.materialCategory || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-lime-500/10 border border-lime-500/30 text-lime-400 text-xs font-mono uppercase tracking-wider mb-3">
          <Award className="w-3.5 h-3.5" />
          <span>Statutory Compliance &bull; CPCB E-Waste Rules 2022</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Extended Producer Responsibility (EPR) Credit Registry
        </h1>
        <p className="mt-3 text-gray-400 text-sm sm:text-base">
          Audited and cryptographically stamped digital credits issued to electronic manufacturers,
          certifying end-of-life recycling quotas.
        </p>
      </div>

      {/* Compliance Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-10">
        <TiltCard3D>
          <div className="bg-nexus-card border border-emerald-500/30 p-5 rounded-2xl h-full">
            <div className="text-gray-400 text-xs font-mono mb-1">TOTAL CREDITS ISSUED</div>
            <div className="text-3xl font-extrabold text-white font-mono">14,820</div>
            <div className="text-[11px] text-emerald-400 mt-2 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>100% CPCB Audited</span>
            </div>
          </div>
        </TiltCard3D>

        <TiltCard3D>
          <div className="bg-nexus-card border border-cyan-500/30 p-5 rounded-2xl h-full">
            <div className="text-gray-400 text-xs font-mono mb-1">METRIC TONS RETIRED</div>
            <div className="text-3xl font-extrabold text-cyan-300 font-mono">2,145.4</div>
            <div className="text-[11px] text-gray-400 mt-2">Zero-landfill certified</div>
          </div>
        </TiltCard3D>

        <TiltCard3D>
          <div className="bg-nexus-card border border-amber-500/30 p-5 rounded-2xl h-full">
            <div className="text-gray-400 text-xs font-mono mb-1">GOLD RECOVERED</div>
            <div className="text-3xl font-extrabold text-amber-300 font-mono">54.2 kg</div>
            <div className="text-[11px] text-amber-400/80 mt-2">Hydrometallurgical 99.9%</div>
          </div>
        </TiltCard3D>

        <TiltCard3D>
          <div className="bg-nexus-card border border-lime-500/30 p-5 rounded-2xl h-full">
            <div className="text-gray-400 text-xs font-mono mb-1">COMPLIANCE QUOTA</div>
            <div className="text-3xl font-extrabold text-lime-400 font-mono">94.8%</div>
            <div className="text-[11px] text-lime-300 mt-2">Fiscal Year 2026-27</div>
          </div>
        </TiltCard3D>
      </div>

      {/* Search & Ledger Table */}
      <div className="bg-nexus-card border border-emerald-500/20 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Public Credit Transactions Ledger</h2>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Brand or Cert #"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-gray-400 font-mono text-sm animate-pulse">
            Querying distributed EPR credit ledger...
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">
            No EPR records match your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-nexus-dark/80 text-gray-400 font-mono border-b border-emerald-500/20">
                <tr>
                  <th className="p-3.5">CERTIFICATE #</th>
                  <th className="p-3.5">PRODUCER / BRAND</th>
                  <th className="p-3.5">CATEGORY</th>
                  <th className="p-3.5">CREDITS (MT)</th>
                  <th className="p-3.5">RECYCLER PARTNER</th>
                  <th className="p-3.5">STATUS</th>
                  <th className="p-3.5 text-right">DATE ISSUED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/10 font-sans">
                {filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-emerald-500/5 transition-colors">
                    <td className="p-3.5 font-mono text-emerald-400 font-bold">
                      {r.certificateNumber}
                    </td>
                    <td className="p-3.5 font-semibold text-white">{r.producerName}</td>
                    <td className="p-3.5 text-gray-300">{r.category}</td>
                    <td className="p-3.5 font-mono font-bold text-white">
                      {r.creditsEarnedKg ? `${(r.creditsEarnedKg / 1000).toFixed(2)} MT` : '1.25 MT'}
                    </td>
                    <td className="p-3.5 text-gray-400">{r.recyclerName}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-gray-400 text-right">
                      {new Date(r.issuedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
