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
  ChevronRight,
  CheckCircle2,
  BarChart2,
  Lock,
  Building2,
  Fingerprint,
  Radio,
  Flame,
  Globe2,
} from 'lucide-react';
import { ImpactCalculator } from '@/components/ImpactCalculator';
import { LiveActivityFeed } from '@/components/LiveActivityFeed';
import { TiltCard3D } from '@/components/TiltCard3D';
import { RealtimeWorldIntelligence } from '@/components/RealtimeWorldIntelligence';

// Next.js Unit V: Lazy Loading Three.js Heavy 3D Canvas elements with code splitting
const Globe3D = dynamic(() => import('@/components/Globe3D').then((mod) => mod.Globe3D), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[440px] flex flex-col items-center justify-center bg-nexus-card/50 rounded-3xl border border-emerald-500/20 backdrop-blur-xl">
      <div className="w-12 h-12 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin mb-4" />
      <span className="text-emerald-400 font-mono text-xs tracking-wider animate-pulse">
        INITIALIZING 3D ORBITAL WEBGL SPHERE...
      </span>
    </div>
  ),
});

const Device3DViewer = dynamic(
  () => import('@/components/Device3DViewer').then((mod) => mod.Device3DViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[440px] flex flex-col items-center justify-center bg-nexus-card/50 rounded-3xl border border-emerald-500/20 backdrop-blur-xl">
        <div className="w-12 h-12 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mb-4" />
        <span className="text-cyan-400 font-mono text-xs tracking-wider animate-pulse">
          MOUNTING 3D HARDWARE EXPLOSION ASSAY...
        </span>
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title: 'E-Waste Nexus | Next.js 14 Circular Electronics Operating System',
  description:
    'Closed-loop electronic waste lifecycle management, 3D interactive hardware deconstruction, statutory EPR credit governance, and AI speech synthesis.',
};

export default function HomePage() {
  return (
    <div className="w-full flex flex-col items-center overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative w-full pt-16 pb-20 sm:pt-24 sm:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Glow orb */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Syllabus Tech Pill */}
        <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-mono tracking-wide mb-8 shadow-glow-green backdrop-blur-xl animate-fade-in">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold">Next.js 14 App Router</span>
          <span className="text-emerald-500">&bull;</span>
          <span>Three.js 3D WebGL</span>
          <span className="text-emerald-500">&bull;</span>
          <span>AURA AI Voice</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.12] max-w-5xl">
          Transform Discarded Electronics Into{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-300 bg-clip-text text-transparent underline decoration-emerald-500/40 decoration-wavy">
            Certified Gold Bullion
          </span>{' '}
          &amp; Statutory EPR Credits
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-gray-300 max-w-3xl leading-relaxed font-light">
          A high-performance closed-loop operating system connecting consumer pickups, calibrated freight logistics, and certified hydrometallurgical refineries with tamper-evident cryptographic chain-of-custody.
        </p>

        {/* Hero CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 relative z-10">
          <Link
            href="/pickups"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-nexus-dark font-black text-base tracking-wide shadow-glow-green hover:shadow-glow-cyan hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex items-center space-x-2.5 group"
          >
            <span>Schedule Doorstep Pickup</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/cinema"
            className="px-8 py-4 rounded-2xl bg-nexus-card/90 hover:bg-emerald-500/10 text-white font-bold text-base border border-emerald-500/40 hover:border-emerald-400 tracking-wide backdrop-blur-xl transition-all duration-300 flex items-center space-x-2.5 group shadow-lg"
          >
            <Film className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Watch 4K Video Cinema (Hindi &amp; English)</span>
          </Link>

          <Link
            href="/login"
            className="px-6 py-4 rounded-2xl bg-nexus-dark/90 hover:bg-slate-800 text-emerald-400 font-semibold text-sm border border-emerald-500/30 hover:border-emerald-400 transition-all flex items-center space-x-2 font-mono"
          >
            <Lock className="w-4 h-4" />
            <span>Login Gate</span>
          </Link>
        </div>

        {/* Live Metric KPI Cards */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full max-w-5xl">
          <TiltCard3D>
            <div className="bg-nexus-card/90 border border-emerald-500/30 rounded-3xl p-5 sm:p-6 backdrop-blur-2xl shadow-xl h-full flex flex-col justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5 mb-2">
                <Recycle className="w-3.5 h-3.5" />
                <span>Total Diversion</span>
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white font-mono">1,842.5</div>
              <div className="text-xs text-gray-400 mt-1">Metric Tons Zero-Landfill</div>
            </div>
          </TiltCard3D>

          <TiltCard3D>
            <div className="bg-nexus-card/90 border border-amber-500/30 rounded-3xl p-5 sm:p-6 backdrop-blur-2xl shadow-xl h-full flex flex-col justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 flex items-center space-x-1.5 mb-2">
                <Cpu className="w-3.5 h-3.5" />
                <span>Fine Gold Assayed</span>
              </span>
              <div className="text-3xl sm:text-4xl font-black text-amber-300 font-mono">48.6 kg</div>
              <div className="text-xs text-gray-400 mt-1">99.9% Hydrometallurgical Au</div>
            </div>
          </TiltCard3D>

          <TiltCard3D>
            <div className="bg-nexus-card/90 border border-cyan-500/30 rounded-3xl p-5 sm:p-6 backdrop-blur-2xl shadow-xl h-full flex flex-col justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5 mb-2">
                <Fingerprint className="w-3.5 h-3.5" />
                <span>Chain of Custody</span>
              </span>
              <div className="text-3xl sm:text-4xl font-black text-cyan-300 font-mono">99.98%</div>
              <div className="text-xs text-gray-400 mt-1">NIST Cryptographic Verification</div>
            </div>
          </TiltCard3D>

          <TiltCard3D>
            <div className="bg-nexus-card/90 border border-lime-500/30 rounded-3xl p-5 sm:p-6 backdrop-blur-2xl shadow-xl h-full flex flex-col justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-lime-400 flex items-center space-x-1.5 mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>EPR Credits Minted</span>
              </span>
              <div className="text-3xl sm:text-4xl font-black text-lime-400 font-mono">14,820</div>
              <div className="text-xs text-gray-400 mt-1">CPCB Statutory Certificates</div>
            </div>
          </TiltCard3D>
        </div>
      </section>

      {/* REAL-TIME WORLD INTELLIGENCE & COMMODITIES PULSE */}
      <RealtimeWorldIntelligence />

      {/* 2. ROLE-BASED ECOSYSTEM PORTAL CARDS */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Role-Based Access Control Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Integrated Ecosystem Operating Tiers
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-400">
            Dedicated Next.js interfaces tailored for citizens, logistics drivers, smelter engineers, and government compliance officers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/pickups" className="group block">
            <TiltCard3D>
              <div className="bg-nexus-card border border-emerald-500/20 group-hover:border-emerald-400 rounded-3xl p-6 transition-all duration-300 shadow-xl h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                    <Recycle className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Citizen &amp; Enterprise
                  </h3>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    Schedule free doorstep collection, trace physical journey, and receive tamper-evident Destruction Certificates.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-emerald-500/15 flex items-center justify-between text-xs font-bold text-emerald-400">
                  <span>Book Pickup</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </TiltCard3D>
          </Link>

          <Link href="/partner" className="group block">
            <TiltCard3D>
              <div className="bg-nexus-card border border-cyan-500/20 group-hover:border-cyan-400 rounded-3xl p-6 transition-all duration-300 shadow-xl h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                    <Truck className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Logistics Fleet Dock
                  </h3>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    Verify consignment manifests, calibrate tare weights on electronic weighbridges, and record chain-of-custody handoffs.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-cyan-500/15 flex items-center justify-between text-xs font-bold text-cyan-400">
                  <span>Partner Portal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </TiltCard3D>
          </Link>

          <Link href="/recycler" className="group block">
            <TiltCard3D>
              <div className="bg-nexus-card border border-amber-500/20 group-hover:border-amber-400 rounded-3xl p-6 transition-all duration-300 shadow-xl h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    Certified Smelter Hub
                  </h3>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    Document hydrometallurgical leaching batches, log gold/copper mass yields, and mint verifiable EPR compliance credits.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-amber-500/15 flex items-center justify-between text-xs font-bold text-amber-400">
                  <span>Recycler Console</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </TiltCard3D>
          </Link>

          <Link href="/admin" className="group block">
            <TiltCard3D>
              <div className="bg-nexus-card border border-red-500/20 group-hover:border-red-400 rounded-3xl p-6 transition-all duration-300 shadow-xl h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-red-300 transition-colors">
                    Regulatory Audit Center
                  </h3>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    Oversee municipal quotas, audit cryptographic scale logs, and simulate role-based authorization parameters.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-red-500/15 flex items-center justify-between text-xs font-bold text-red-400">
                  <span>Governance Center</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </TiltCard3D>
          </Link>
        </div>
      </section>

      {/* 3. 3D INTERACTIVE HARDWARE & PLANETARY EARTH */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Interactive WebGL 3D Simulation Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Interactive Hardware &amp; Global Telemetry
          </h2>
          <p className="mt-3 text-sm text-gray-400 leading-relaxed">
            Drag the slider to deconstruct discarded electronic assets into modular printed circuit boards, or rotate the planetary globe to inspect international circular hubs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* 3D Hardware Assay Viewer */}
          <div className="w-full">
            <Device3DViewer />
          </div>

          {/* 3D Global Earth Network */}
          <div className="w-full">
            <Globe3D />
          </div>
        </div>
      </section>

      {/* 4. COMMODITY IMPACT CALCULATOR */}
      <ImpactCalculator />

      {/* 5. 4K CINEMA TEASER BANNER */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/40 bg-gradient-to-r from-nexus-dark via-emerald-950/30 to-nexus-dark p-8 sm:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-mono uppercase tracking-wider mb-4">
              <Film className="w-3.5 h-3.5" />
              <span>4K High-Definition Cinema Theater</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Curated E-Waste Documentaries in Hindi &amp; English
            </h3>
            <p className="mt-4 text-gray-300 text-sm sm:text-base leading-relaxed font-light">
              Experience cinema-grade educational coverage featuring Apple Daisy disassembly robotics, urban gold mining hydrometallurgy, and investigative ground reports from Seelampur and Agbogbloshie.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/cinema"
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-lime-500 text-nexus-dark font-black text-sm tracking-wide shadow-glow-green hover:scale-105 active:scale-95 transition-all flex items-center space-x-2"
              >
                <span>Enter Video Cinema (8 Curated Films)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-xs font-mono text-emerald-400">
                &bull; 4K UHD Streams &bull; Dual Audio (हिन्दी / English) &bull; Theater Mode
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. NEXT.JS SYLLABUS PILLARS & LIVE AUDIT FEED */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 4 Next.js Core Architecture Pillars */}
          <div className="lg:col-span-7 space-y-4">
            <div className="mb-6">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-1">
                ENGINEERING SPECIFICATION
              </span>
              <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
                <Layers className="w-6 h-6 text-emerald-400" />
                <span>Next.js 14 &amp; React Enterprise Architecture</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TiltCard3D>
                <div className="bg-nexus-card border border-emerald-500/20 p-5 rounded-2xl h-full">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs mb-3">
                    01
                  </div>
                  <h4 className="text-sm font-bold text-white">App Router &amp; Server Actions</h4>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    Direct server mutations (`&apos;use server&apos;`) with Zod schema validation, optimistic UI updates, and instant route revalidation.
                  </p>
                </div>
              </TiltCard3D>

              <TiltCard3D>
                <div className="bg-nexus-card border border-cyan-500/20 p-5 rounded-2xl h-full">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs mb-3">
                    02
                  </div>
                  <h4 className="text-sm font-bold text-white">SSR, SSG &amp; ISR Hybrid</h4>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    Dynamic pickups rendered server-side, static collection centers cached via SSG, and analytics revalidated on a 60-second ISR cycle.
                  </p>
                </div>
              </TiltCard3D>

              <TiltCard3D>
                <div className="bg-nexus-card border border-amber-500/20 p-5 rounded-2xl h-full">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-xs mb-3">
                    03
                  </div>
                  <h4 className="text-sm font-bold text-white">Zustand &amp; Voice Synthesis</h4>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    Lightweight reactive global store paired with Web Speech API for real-time speech narration and microphone speech-to-text.
                  </p>
                </div>
              </TiltCard3D>

              <TiltCard3D>
                <div className="bg-nexus-card border border-lime-500/20 p-5 rounded-2xl h-full">
                  <div className="w-9 h-9 rounded-xl bg-lime-500/20 text-lime-400 flex items-center justify-center font-mono font-bold text-xs mb-3">
                    04
                  </div>
                  <h4 className="text-sm font-bold text-white">Three.js 3D WebGL Shaders</h4>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    Client-side hardware explosion shaders and orbital globe models lazy loaded via dynamic imports to guarantee optimal SSR hydration.
                  </p>
                </div>
              </TiltCard3D>
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
