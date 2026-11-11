'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  FileText,
  Lock,
  Sparkles,
} from 'lucide-react';
import { soundEffects } from '@/lib/sound';

// Zod Schema for certificate search input (Syllabus: Form handling & Zod validation)
const certSearchSchema = z.string().min(4, 'Certificate ID must have at least 4 characters');

export default function CertificateLookupPage() {
  const router = useRouter();
  const [certInput, setCertInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playClick();
    setErrorMsg(null);

    const validation = certSearchSchema.safeParse(certInput.trim());
    if (!validation.success) {
      soundEffects.playError();
      setErrorMsg(validation.error.issues[0]?.message || 'Invalid certificate format');
      return;
    }

    soundEffects.playSuccess();
    router.push(`/verify/${encodeURIComponent(certInput.trim())}`);
  };

  return (
    <div className="w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Central Pollution Control Board Registry</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Verify CPCB Form-6 Manifest
        </h1>
        <p className="text-sm sm:text-base text-gray-300 font-light">
          Verify official E-Waste Recycling Certificates and statutory EPR compliance manifests issued under Central E-Waste Rules 2022.
        </p>
      </div>

      {/* Verification Search Box */}
      <div className="bg-nexus-card border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl space-y-6">
        <form onSubmit={handleVerify} className="space-y-4">
          <label className="block text-xs font-semibold text-gray-300">
            Enter Certificate Number or Consignment ID:
          </label>

          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="e.g. CPCB-EPR-2026-9482 or pick_1794383454642"
              value={certInput}
              onChange={(e) => setCertInput(e.target.value)}
              className="w-full bg-slate-950 border border-emerald-500/30 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-500 font-mono focus:outline-none focus:border-emerald-400 shadow-inner"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-gray-400">
              <span>Quick Samples:</span>
              <button
                type="button"
                onClick={() => setCertInput('CPCB-EPR-2026-884210')}
                className="text-emerald-400 hover:underline cursor-pointer"
              >
                #884210
              </button>
              <span>&bull;</span>
              <button
                type="button"
                onClick={() => setCertInput('CPCB-EPR-2026-449102')}
                className="text-cyan-400 hover:underline cursor-pointer"
              >
                #449102
              </button>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-glow-green cursor-pointer hover:scale-102 active:scale-98 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Verify Legitimacy</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="pt-6 border-t border-emerald-500/15 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-gray-400">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>NIST 800-88 Data Erased</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>SHA-256 Ledger Stamp</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Auditable Form-6 Manifest</span>
          </div>
        </div>
      </div>
    </div>
  );
}
