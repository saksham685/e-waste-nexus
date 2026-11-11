import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import {
  Recycle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Truck,
  Award,
  Film,
  Zap,
  Layers,
  CheckCircle2,
  Lock,
  Building2,
  Fingerprint,
  Radio,
  Globe2,
  TrendingUp,
  BookOpen,
  ArrowUpRight,
  Shield,
  Coins,
  Compass,
} from 'lucide-react';
import { ImpactCalculator } from '@/components/ImpactCalculator';
import { LiveActivityFeed } from '@/components/LiveActivityFeed';
import { RealtimeWorldIntelligence } from '@/components/RealtimeWorldIntelligence';

// Next.js Unit V: Lazy Loading Three.js Heavy 3D Canvas elements with code splitting
const Globe3D = dynamic(() => import('@/components/Globe3D').then((mod) => mod.Globe3D), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[460px] flex flex-col items-center justify-center bg-slate-950/70 rounded-3xl border border-white/10 backdrop-blur-xl">
      <div className="w-10 h-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mb-3" />
      <span className="text-cyan-400 font-mono text-xs tracking-wider animate-pulse">
        MOUNTING 3D ORBITAL GLOBE ENGINE...
      </span>
    </div>
  ),
});

const Device3DViewer = dynamic(
  () => import('@/components/Device3DViewer').then((mod) => mod.Device3DViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[460px] flex flex-col items-center justify-center bg-slate-950/70 rounded-3xl border border-white/10 backdrop-blur-xl">
        <div className="w-10 h-10 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin mb-3" />
        <span className="text-emerald-400 font-mono text-xs tracking-wider animate-pulse">
          INITIALIZING 3D HARDWARE EXPLOSION ASSAY...
        </span>
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title: 'E-Waste Nexus | Circular Electronics Operating System',
  description:
    'Closed-loop electronic waste lifecycle management, 3D interactive hardware deconstruction, statutory EPR credit governance, and AI speech synthesis.',
};

export default function HomePage() {
  return (
    <div className="w-full flex flex-col items-center overflow-x-hidden selection:bg-emerald-500 selection:text-slate-950">
      
      {/* =================================================================== */}
      {/* 1. HERO SECTION: ULTRA-MODERN HIGH-TECH SAAS PRESENTATION           */}
      {/* =================================================================== */}
      <section className="relative w-full pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Ambient Glowing Background Orbs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[360px] bg-gradient-to-r from-emerald-500/15 via-cyan-500/15 to-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Floating Top Badge */}
        <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-emerald-300 text-xs sm:text-sm font-mono tracking-wide mb-8 shadow-sm backdrop-blur-xl animate-fade-in hover:border-emerald-500/40 transition-colors">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">Central CPCB 2022 Certified</span>
          <span className="text-slate-500">&bull;</span>
          <span className="text-slate-300">Next.js 14 App Router</span>
          <span className="text-slate-500">&bull;</span>
          <span className="text-cyan-400 font-semibold">Web Speech API</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-5xl font-sans">
          The Intelligent Circular Operating System for{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Electronic Waste &amp; EPR Credits
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed font-light">
          Bridge consumers, certified logistics fleets, and hydrometallurgical smelters into a verifiable, tamper-evident digital ledger. Schedule doorstep collection, mint statutory compliance credits, and track precious gold recovery.
        </p>

        {/* Primary Call-to-Actions */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4 relative z-10">
          <Link
            href="/pickups"
            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 font-black text-sm tracking-wide shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-2 cursor-pointer group"
          >
            <Truck className="w-4 h-4" />
            <span>Schedule Doorstep Pickup</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/epr"
            className="px-7 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm border border-white/10 hover:border-emerald-500/40 backdrop-blur-xl transition-all flex items-center space-x-2 cursor-pointer shadow-lg"
          >
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Explore EPR Credits</span>
          </Link>

          <Link
            href="/centers"
            className="px-6 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-xs sm:text-sm border border-white/10 hover:border-emerald-500/40 transition-all flex items-center space-x-2"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Find 450+ Certified Centers</span>
          </Link>
        </div>

        {/* =============================================================== */}
        {/* HERO BENTO METRIC BAR: 4 HIGH-IMPACT LIVE COUNTERS              */}
        {/* =============================================================== */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl">
          <div className="p-5 rounded-3xl bg-slate-900/70 border border-white/10 hover:border-emerald-500/30 transition-all text-left backdrop-blur-xl shadow-lg group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Total Diversion</span>
              <Recycle className="w-4 h-4 text-emerald-400 group-hover:rotate-45 transition-transform" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">1,842.5 MT</div>
            <div className="text-[11px] text-emerald-400/90 font-mono mt-1">Zero-Landfill Diverted</div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/70 border border-white/10 hover:border-amber-500/30 transition-all text-left backdrop-blur-xl shadow-lg group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Pure Gold Yield</span>
              <Coins className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">48.6 kg</div>
            <div className="text-[11px] text-amber-400/90 font-mono mt-1">99.9% Hydrometallurgy Au</div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/70 border border-white/10 hover:border-cyan-500/30 transition-all text-left backdrop-blur-xl shadow-lg group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Chain of Custody</span>
              <Fingerprint className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono">99.98%</div>
            <div className="text-[11px] text-cyan-400/90 font-mono mt-1">NIST Cryptographic Proof</div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/70 border border-white/10 hover:border-purple-500/30 transition-all text-left backdrop-blur-xl shadow-lg group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">EPR Certificates</span>
              <Award className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-purple-300 font-mono">14,820</div>
            <div className="text-[11px] text-purple-400/90 font-mono mt-1">CPCB Registered Credits</div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. REAL-TIME COMMODITIES & WORLD INTELLIGENCE STREAM                */}
      {/* =================================================================== */}
      <RealtimeWorldIntelligence />

      {/* =================================================================== */}
      {/* 3. INTERACTIVE 3D WEBGL LAB: HARDWARE ASSAY & PLANETARY TELEMETRY   */}
      {/* =================================================================== */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>WebGL Three.js 3D Interactive Telemetry</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Interactive Hardware &amp; Global Circular Hubs
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
            Deconstruct an electronic device layer-by-layer to analyze hazardous materials, and interact with the 3D globe to trace certified smelters across India.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="w-full">
            <Device3DViewer />
          </div>
          <div className="w-full">
            <Globe3D />
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 4. ROLE-BASED ACCESS CONTROL (RBAC) PORTAL SUITE                    */}
      {/* =================================================================== */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Multi-Tenant Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Role-Based Portal Modules
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 font-light">
            Custom-tailored workflows for citizens, logistics fleet partners, certified smelters, and government compliance officers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Citizen */}
          <Link href="/pickups" className="group block">
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 group-hover:border-emerald-500/40 transition-all duration-300 h-full flex flex-col justify-between shadow-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                  <Recycle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Citizen &amp; Household
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Book free doorstep pickup, trace calibrated weighbridge manifests, and earn instant UPI Green Points.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>Book Pickup</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Card 2: Partner */}
          <Link href="/partner" className="group block">
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 group-hover:border-cyan-500/40 transition-all duration-300 h-full flex flex-col justify-between shadow-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Logistics Partner Dock
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Calibrate electronic weighbridge readings, record chain-of-custody handoffs, and manage route dispatches.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-cyan-400">
                <span>Fleet Portal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Card 3: Recycler */}
          <Link href="/recycler" className="group block">
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 group-hover:border-amber-500/40 transition-all duration-300 h-full flex flex-col justify-between shadow-lg hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  Smelter &amp; Refining Hub
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Log hydrometallurgical batch yields (Au, Cu, Pd), mint verifiable EPR credits, and issue certificates.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-amber-400">
                <span>Smelter Console</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Card 4: Governance */}
          <Link href="/admin" className="group block">
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 group-hover:border-purple-500/40 transition-all duration-300 h-full flex flex-col justify-between shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                  Central CPCB Audit
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Statutory quota compliance, cryptographic ledger inspection, and national recycling quota oversight.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-purple-400">
                <span>Governance Center</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 5. INTERACTIVE COMMODITY YIELD & CARBON IMPACT CALCULATOR           */}
      {/* =================================================================== */}
      <ImpactCalculator />

      {/* =================================================================== */}
      {/* 6. 4K CINEMA DOCUMENTARY THEATER TEASER                             */}
      {/* =================================================================== */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-[32px] overflow-hidden border border-white/15 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-8 sm:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-mono uppercase tracking-wider mb-4">
              <Film className="w-3.5 h-3.5" />
              <span>4K High-Definition Cinema Hub</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Investigative Ground Documentaries in Hindi &amp; English
            </h3>
            <p className="mt-4 text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
              Watch cinematic investigations on urban gold mining, hazardous informal smelting in Seelampur and Agbogbloshie, and Apple Daisy robotics teardowns in 4K resolution with native bilingual audio.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link
                href="/cinema"
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-black text-sm tracking-wide shadow-glow-green hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 cursor-pointer"
              >
                <span>Watch 8 Documentaries Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-xs font-mono text-emerald-400">
                &bull; Dual Audio (हिन्दी / English) &bull; Theater Mode &bull; 4K UHD
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 7. NATIONAL E-WASTE LOGISTICS & PRECIOUS METAL YIELDS               */}
      {/* =================================================================== */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: 4 Advanced Enterprise Logistics Capabilities */}
          <div className="lg:col-span-7 space-y-4">
            <div className="mb-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Statutory Chain of Custody &amp; Refining</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                National Logistics &amp; Smelter Yields
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
                Real-time dispatch telemetry, statutory Form-6 consignment generation, and certified rare-earth recovery.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-emerald-500/30 transition-all">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs mb-3">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Statutory CPCB Form-6 Manifests</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-light">
                  Automated generation of state compliance manifests with tamper-evident digital tracking for all consignments.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-amber-500/30 transition-all">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs mb-3">
                  <Coins className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Hydrometallurgical Gold Assays</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-light">
                  High-efficiency recovery of 99.9% pure gold, copper, palladium, and silver per metric ton of processed PCBs.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-cyan-500/30 transition-all">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs mb-3">
                  <Truck className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Dual-Weighbridge Telemetry</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-light">
                  Gross and tare weight calibration at fleet docks, preventing informal leakage and ensuring full audit readiness.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-purple-500/30 transition-all">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs mb-3">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Direct Consignor UPI Payouts</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-light">
                  Automated settlements and green credit points credited directly to households upon certified collection.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/centers"
                className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>Explore 450+ Certified Recycling Centers Across India &rarr;</span>
              </Link>
            </div>
          </div>

          {/* Right: Live Circular Audit Stream */}
          <div className="lg:col-span-5">
            <LiveActivityFeed />
          </div>
        </div>
      </section>

    </div>
  );
}
