import React from 'react';
import { Globe3D } from '../components/Globe3D';
import { ImpactPanel } from '../components/ImpactPanel';
import {
  Truck,
  Building2,
  Recycle,
  Award,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Cpu,
  Layers,
  CheckCircle,
  FileText,
  MapPin,
  ChevronRight
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const featureCards = [
    {
      id: 'collection',
      number: '01',
      title: 'Smart E-Waste Collection',
      description: 'Users can submit pickup requests for discarded electronic devices with door-step GPS dispatch, item categorization, and live status timelines.',
      icon: Truck,
      color: 'from-emerald-500/20 to-teal-500/10',
      border: 'border-emerald-500/30',
      actionTab: 'pickups'
    },
    {
      id: 'centers',
      number: '02',
      title: 'Authorized Collection Centers',
      description: 'Discover verified collection centers and their operating details with interactive regional mapping, accepted category filters, and operational hours.',
      icon: MapPin,
      color: 'from-cyan-500/20 to-blue-500/10',
      border: 'border-cyan-500/30',
      actionTab: 'centers'
    },
    {
      id: 'recyclers',
      number: '03',
      title: 'Recycler Network',
      description: 'Connect collection partners with registered recycling organizations to log physical weight assays, pyrometallurgy yield, and refining documentation.',
      icon: Building2,
      color: 'from-lime-500/20 to-emerald-500/10',
      border: 'border-lime-500/30',
      actionTab: 'recycler'
    },
    {
      id: 'epr',
      number: '04',
      title: 'EPR Credit Management',
      description: 'Track eligible recycling records and manage EPR-related documentation. Strict dual-authorization compliance prevents duplicate credit claims.',
      icon: Award,
      color: 'from-emerald-500/25 to-lime-500/15',
      border: 'border-emerald-400/40',
      actionTab: 'epr'
    },
    {
      id: 'transparency',
      number: '05',
      title: 'Transparent Operations',
      description: 'Maintain collection records, verified weights, processing statuses, and comprehensive audit trails across every actor in the circular supply chain.',
      icon: ShieldCheck,
      color: 'from-teal-500/20 to-emerald-500/10',
      border: 'border-teal-500/30',
      actionTab: 'analytics'
    }
  ];

  const workflowSteps = [
    { step: '01', title: 'Schedule Request', desc: 'Individual or business books pickup with category & weight estimates', icon: FileText },
    { step: '02', title: 'Physical Pickup', desc: 'Authorized fleet collects cargo, logs scale weight & photo evidence', icon: Truck },
    { step: '03', title: 'Weight QA Audit', desc: 'Central logistics auditor inspects tare receipts and certifies net weight', icon: ShieldCheck },
    { step: '04', title: 'Material Refining', desc: 'Recycler conducts recovery of precious copper, gold, cobalt & lithium', icon: Recycle },
    { step: '05', title: 'EPR Credit Issuance', desc: 'Verified recovery yields certified EPR credits for enterprise compliance', icon: Award }
  ];

  return (
    <div className="relative overflow-hidden w-full">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-3/4 left-1/4 w-[500px] h-[400px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* 1. HERO SECTION */}
      <section className="relative pt-10 pb-20 md:pt-16 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-xs font-mono text-emerald-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>AI-POWERED CIRCULAR LOGISTICS & EPR SUITE</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Transform E-Waste Into a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-400">
                Sustainable Future.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              The unified intelligence platform connecting individuals, corporate enterprises, authorized collection centers, and certified recyclers. Automating traceable end-to-end chain of custody and verifiable Extended Producer Responsibility (EPR) compliance credits.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => onNavigate('pickups')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 hover:from-emerald-400 hover:to-lime-400 transition-all shadow-glow-green flex items-center justify-center space-x-2 group"
              >
                <span>Schedule a Pickup</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('epr')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm bg-nexus-charcoal/80 border border-slate-700 hover:border-emerald-500/50 text-slate-200 hover:text-white transition-all backdrop-blur flex items-center justify-center space-x-2"
              >
                <span>Explore EPR Registry</span>
                <ChevronRight className="w-4 h-4 text-emerald-400" />
              </button>
            </div>

            {/* Trust indicators */}
            <div className="pt-4 flex items-center justify-center lg:justify-start space-x-6 text-xs text-slate-400">
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Zero Unverified Credits</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Dual-Audit Custody</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>WEEE Directive Aligned</span>
              </div>
            </div>
          </div>

          {/* Right 3D Earth Globe */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <Globe3D />
          </div>
        </div>

        {/* Live-style Impact Panel Below Hero */}
        <div className="mt-12">
          <ImpactPanel />
        </div>
      </section>

      {/* 2. PLATFORM OVERVIEW SECTION */}
      <section className="py-20 bg-nexus-charcoal/40 border-y border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center space-x-1.5 text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Enterprise Architectural Pillar</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              One Connected Ecosystem. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-400">
                Zero Unmanaged E-Waste.
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Eliminating fragmented informal dumpsites through standardized digital intake, transparent physical weight verifications, and cryptographic auditability.
            </p>
          </div>

          {/* 5 Premium Feature Cards with 3D Hover & Glow */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={() => onNavigate(card.actionTab)}
                  className={`group relative p-7 rounded-2xl bg-gradient-to-b ${card.color} to-nexus-dark/90 border ${card.border} hover:border-emerald-400/80 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover cursor-pointer backdrop-blur-sm ${
                    idx === 3 ? 'md:col-span-2 lg:col-span-1 border-emerald-400/50 shadow-glow-green/30' : ''
                  }`}
                >
                  {/* Subtle card top glow */}
                  <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-nexus-dark/80 border border-slate-700/80 group-hover:border-emerald-400 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-emerald-400 transition-colors">
                      {card.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                    {card.description}
                  </p>

                  <div className="flex items-center text-xs font-medium text-emerald-400 group-hover:text-emerald-300">
                    <span>Explore module</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. VERIFIABLE CIRCULAR LIFECYCLE WORKFLOW */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            End-To-End Traceability
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            How E-Waste Nexus Operates
          </h2>
          <p className="text-slate-400 text-sm">
            From consumer doorstep to industrial commodity recovery without a single blind spot.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {workflowSteps.map((ws, i) => {
            const Icon = ws.icon;
            return (
              <div
                key={ws.step}
                className="relative p-5 rounded-xl bg-nexus-charcoal/80 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-mono text-xs text-emerald-400 font-bold">
                      {ws.step}
                    </span>
                    <Icon className="w-5 h-5 text-slate-500" />
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-2">{ws.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{ws.desc}</p>
                </div>
                {i < 4 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-emerald-400/50">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. CALL TO ACTION BANNER */}
      <section className="pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-nexus-charcoal to-emerald-950/60 border border-emerald-500/30 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to Dispose of E-Waste Responsibly?
            </h3>
            <p className="text-sm text-slate-300">
              Schedule your first collection today, explore authorized drop-off vaults, or review EPR documentation.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('pickups')}
                className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all shadow-glow-green"
              >
                Schedule Doorstep Pickup
              </button>
              <button
                onClick={() => onNavigate('centers')}
                className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:border-slate-500 transition-colors"
              >
                Find Collection Centers
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
