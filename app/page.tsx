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
} from 'lucide-react';
import { ImpactCalculator } from '@/components/ImpactCalculator';
import { LiveActivityFeed } from '@/components/LiveActivityFeed';
import { TiltCard3D } from '@/components/TiltCard3D';

// Next.js Unit V: Lazy Loading Three.js Heavy 3D Canvas elements
const Globe3D = dynamic(() => import('@/components/Globe3D').then((mod) => mod.Globe3D), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] flex items-center justify-center bg-nexus-card/40 rounded-3xl border border-emerald-500/20">
      <div className="text-emerald-400 font-mono text-sm animate-pulse flex items-center space-x-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
        <span>Synthesizing Three.js Planetary WebGL Grid...</span>
      </div>
    </div>
  ),
});

const Device3DViewer = dynamic(
  () => import('@/components/Device3DViewer').then((mod) => mod.Device3DViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] flex items-center justify-center bg-nexus-card/40 rounded-3xl border border-emerald-500/20">
        <div className="text-emerald-400 font-mono text-sm animate-pulse flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span>Mounting 3D Hardware Deconstruction Canvas...</span>
        </div>
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title: 'Next-Gen Circular Electronics Platform | E-Waste Nexus',
  description:
    'Closed-loop e-waste recycling, 3D interactive hardware deconstruction, statutory EPR credit governance, and AI-assisted logistics.',
};

export default function HomePage() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. HERO SECTION */}
      <section className="relative w-full pt-16 pb-20 sm:pt-24 sm:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-mono tracking-wide mb-8 shadow-glow-green animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Next.js 14 App Router • Three.js 3D WebGL • AI Voice Synthesis</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-5xl">
          Transform Discarded Electronics Into{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-400 bg-clip-text text-transparent underline decoration-emerald-500/30 decoration-wavy">
            Certified Gold Bullion
          </span>{' '}
          &amp; Statutory EPR Credits
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-3xl leading-relaxed font-light">
          A fully integrated closed-loop platform uniting consumers, certified logistics fleets,
          and hydrometallurgical smelters with immutable chain-of-custody tracking.
        </p>

        {/* CTA Button Group */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/pickups"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-nexus-dark font-extrabold text-base tracking-wide shadow-glow-green hover:shadow-glow-cyan hover:scale-105 active:scale-95 transition-all duration-300 flex items-center space-x-2 group"
          >
            <span>Schedule Free Pickup</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/cinema"
            className="px-8 py-4 rounded-2xl bg-nexus-card hover:bg-emerald-500/10 text-white font-bold text-base border border-emerald-500/40 hover:border-emerald-400 tracking-wide transition-all duration-300 flex items-center space-x-2 group"
          >
            <Film className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Watch 4K Video Cinema (Hindi &amp; English)</span>
          </Link>
        </div>

        {/* Live Metric Tickers */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full max-w-5xl">
          <div className="bg-nexus-card/80 border border-emerald-500/20 rounded-2xl p-4 sm:p-6 backdrop-blur-xl">
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">1,842.5</div>
            <div className="text-xs sm:text-sm font-medium text-emerald-400 uppercase tracking-wider mt-1">
              Metric Tons Diverted
            </div>
          </div>
          <div className="bg-nexus-card/80 border border-emerald-500/20 rounded-2xl p-4 sm:p-6 backdrop-blur-xl">
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">48.6 kg</div>
            <div className="text-xs sm:text-sm font-medium text-amber-400 uppercase tracking-wider mt-1">
              Pure Gold Recovered
            </div>
          </div>
          <div className="bg-nexus-card/80 border border-emerald-500/20 rounded-2xl p-4 sm:p-6 backdrop-blur-xl">
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">99.98%</div>
            <div className="text-xs sm:text-sm font-medium text-cyan-400 uppercase tracking-wider mt-1">
              Chain-of-Custody Integrity
            </div>
          </div>
          <div className="bg-nexus-card/80 border border-emerald-500/20 rounded-2xl p-4 sm:p-6 backdrop-blur-xl">
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">14,200+</div>
            <div className="text-xs sm:text-sm font-medium text-lime-400 uppercase tracking-wider mt-1">
              Verified EPR Credits
            </div>
          </div>
        </div>
      </section>

      {/* 2. 3D INTERACTIVE DUAL SHOWCASE */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span>Realtime WebGL 3D Simulation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Interactive Hardware &amp; Global Telemetry
          </h2>
          <p className="mt-4 text-gray-400 text-base">
            Rotate the exploded hardware assay to examine internal PCB precious metals, or rotate
            the 3D planetary Earth to inspect live circular processing nodes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left: 3D Hardware Deconstruction Viewer */}
          <div className="w-full">
            <Device3DViewer />
          </div>

          {/* Right: 3D Global Earth Network */}
          <div className="w-full">
            <Globe3D />
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE IMPACT CALCULATOR */}
      <ImpactCalculator />

      {/* 4. 4K CINEMA TEASER BANNER */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/40 bg-gradient-to-r from-nexus-dark via-emerald-950/40 to-nexus-dark p-8 sm:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-mono uppercase tracking-wider mb-4">
              <Film className="w-3.5 h-3.5" />
              <span>4K High-Definition Cinema Theater</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Curated E-Waste Documentaries in Hindi &amp; English
            </h3>
            <p className="mt-4 text-gray-300 text-base leading-relaxed">
              Experience cinema-grade educational coverage featuring Apple Daisy disassembly robotics,
              urban gold mining hydrometallurgy, and investigative ground reports from Seelampur and Agbogbloshie.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/cinema"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 text-nexus-dark font-bold text-sm tracking-wide shadow-glow-green hover:scale-105 transition-all"
              >
                Enter Video Cinema (8 Curated Films)
              </Link>
              <span className="text-xs font-mono text-emerald-400">
                • 4K Video Stream • Dual Audio • Theater Mode
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LIVE ACTIVITY FEED & SYLLABUS FEATURE PILLARS */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 4 Next.js Core Architecture Pillars */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>Next.js 14 &amp; React Enterprise Architecture</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TiltCard3D>
                <div className="bg-nexus-card border border-emerald-500/20 p-5 rounded-2xl h-full">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-3">
                    01
                  </div>
                  <h4 className="text-base font-bold text-white">App Router &amp; Server Actions</h4>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    Zero-waterfall server data mutations (`&apos;use server&apos;`) with Zod schema validation
                    and automatic route revalidation.
                  </p>
                </div>
              </TiltCard3D>

              <TiltCard3D>
                <div className="bg-nexus-card border border-cyan-500/20 p-5 rounded-2xl h-full">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold mb-3">
                    02
                  </div>
                  <h4 className="text-base font-bold text-white">SSR, SSG &amp; ISR Hybrid</h4>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    Dynamic pickups rendered server-side, static collection centers cached via SSG, and
                    analytics revalidated on a 60s ISR schedule.
                  </p>
                </div>
              </TiltCard3D>

              <TiltCard3D>
                <div className="bg-nexus-card border border-amber-500/20 p-5 rounded-2xl h-full">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold mb-3">
                    03
                  </div>
                  <h4 className="text-base font-bold text-white">Zustand &amp; Voice Synthesis</h4>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    Lightweight global state management paired with Web Speech API for real-time speech
                    synthesis and mic dictation.
                  </p>
                </div>
              </TiltCard3D>

              <TiltCard3D>
                <div className="bg-nexus-card border border-lime-500/20 p-5 rounded-2xl h-full">
                  <div className="w-10 h-10 rounded-xl bg-lime-500/20 text-lime-400 flex items-center justify-center font-bold mb-3">
                    04
                  </div>
                  <h4 className="text-base font-bold text-white">Three.js 3D WebGL Shaders</h4>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    Client-side hardware explosion shaders and orbital globe models lazy loaded via
                    `next/dynamic` to ensure pristine SSR performance.
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
