'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck,
  Scale,
  Flame,
  Shield,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Cpu,
  Coins,
  Award,
  Layers,
  ChevronRight,
  Fingerprint,
} from 'lucide-react';
import { soundEffects } from '@/lib/sound';

interface WorkflowStep {
  id: string;
  number: string;
  title: string;
  stakeholder: string;
  roleBadge: string;
  route: string;
  color: string;
  borderColor: string;
  bgColor: string;
  icon: any;
  metric: string;
  metricLabel: string;
  features: string[];
  description: string;
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 'citizen',
    number: '01',
    title: 'Doorstep Scheduling & PIN',
    stakeholder: 'Citizen Consignor',
    roleBadge: 'Individual Persona',
    route: '/pickups',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/40',
    bgColor: 'bg-emerald-500/10',
    icon: Truck,
    metric: '₹1,200',
    metricLabel: 'Avg. Scrap UPI Payout',
    features: [
      '30-second doorstep slot booking',
      'Doorstep handover verification PIN / OTP',
      'Live 5-stage tracking timeline',
      'Instant UPI bank transfer guarantee',
    ],
    description:
      'Households and IT managers request electronic waste collection, calculate live scrap value, and receive calibrated pickup schedules.',
  },
  {
    id: 'partner',
    number: '02',
    title: 'Calibrated Scale Weighbridge',
    stakeholder: 'Logistics Partner',
    roleBadge: 'Collection Terminal',
    route: '/partner',
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/40',
    bgColor: 'bg-cyan-500/10',
    icon: Scale,
    metric: '±0.05 kg',
    metricLabel: 'Scale Sensor Accuracy',
    features: [
      'Fleet driver & vehicle dispatch',
      'Digital gross, tare & net scale calibration',
      'Legal Metrology Act certified weighbridge',
      'Direct dispatch to certified smelters',
    ],
    description:
      'Authorized logistics operators weigh consignments on Class-III digital weighbridges, sealing physical weights into the digital ledger.',
  },
  {
    id: 'recycler',
    number: '03',
    title: 'Smelting & Precious Metals',
    stakeholder: 'Certified Smelter',
    roleBadge: 'Hydrometallurgy Hub',
    route: '/recycler',
    color: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    bgColor: 'bg-amber-500/10',
    icon: Flame,
    metric: '99.9%',
    metricLabel: 'Pure Gold Extraction',
    features: [
      'Zero-cyanide acid leaching assay',
      'Gold, Copper, Lithium & Silver assay',
      'Target OEM producer quota allocation',
      'Automated EPR certificate minting',
    ],
    description:
      'Refining facilities process PCB batches, assay commodity yields, and mint statutory EPR credits for manufacturer compliance.',
  },
  {
    id: 'admin',
    number: '04',
    title: 'CPCB Form-6 & National Ledger',
    stakeholder: 'CPCB Administrator',
    roleBadge: 'Tier-1 Governance',
    route: '/admin',
    color: 'text-red-400',
    borderColor: 'border-red-500/40',
    bgColor: 'bg-red-500/10',
    icon: Shield,
    metric: '850,000 MT',
    metricLabel: 'Statutory National Quota',
    features: [
      'National 850K MT quota oversight',
      'Auditable CPCB Form-6 manifests',
      'Cryptographic SHA-256 ledger integrity',
      'Nationwide 450+ city dispatch feed',
    ],
    description:
      'Government compliance officers monitor national quota fulfillment, inspect immutable action logs, and issue legal certificates.',
  },
];

export const PlatformArchitectureWorkflow: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const activeStep = WORKFLOW_STEPS[activeStepIndex];

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5" />
          <span>Closed-Loop Digital Architecture</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          How the 4-Stakeholder Network Operates
        </h2>
        <p className="text-sm sm:text-base text-gray-400 leading-relaxed font-light">
          A unified, tamper-evident pipeline connecting consumers, collection fleets, smelters, and government regulators into one seamless circular system.
        </p>
      </div>

      {/* Interactive 4-Node Pipeline Flow Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {WORKFLOW_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === activeStepIndex;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setActiveStepIndex(idx);
              }}
              className={`p-5 rounded-3xl border text-left transition-all duration-300 relative overflow-hidden cursor-pointer group ${
                isActive
                  ? `${step.borderColor} ${step.bgColor} shadow-2xl scale-[1.02]`
                  : 'bg-slate-900/60 border-white/10 hover:border-white/20 hover:bg-slate-900/90'
              }`}
            >
              {/* Subtle top indicator bar */}
              <div
                className={`h-1 w-full absolute top-0 left-0 transition-all ${
                  isActive ? 'bg-gradient-to-r from-emerald-400 to-cyan-400' : 'bg-transparent'
                }`}
              />

              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-black text-gray-500 group-hover:text-white transition-colors">
                  PHASE {step.number}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${step.bgColor} ${step.color} border ${step.borderColor}`}>
                  {step.roleBadge}
                </span>
              </div>

              <div className="flex items-center space-x-3 mb-2">
                <div className={`w-9 h-9 rounded-xl ${step.bgColor} border ${step.borderColor} flex items-center justify-center ${step.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {step.title}
                  </h4>
                  <div className="text-[11px] text-gray-400 font-medium">
                    {step.stakeholder}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                <span className="text-gray-400">{step.metricLabel}</span>
                <span className={`font-bold ${step.color}`}>{step.metric}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Node Interactive Deep-Dive Card */}
      <div className="bg-nexus-card border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Details & Description */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                PHASE {activeStep.number} &bull; {activeStep.stakeholder.toUpperCase()}
              </span>
              <span className="text-xs font-mono text-gray-400">
                Route: <code className="text-cyan-400">{activeStep.route}</code>
              </span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {activeStep.title}
            </h3>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
              {activeStep.description}
            </p>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {activeStep.features.map((feat, fIdx) => (
                <div
                  key={fIdx}
                  className="flex items-center space-x-2.5 p-3 rounded-2xl bg-nexus-dark/60 border border-white/5 text-xs text-gray-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href={activeStep.route}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-glow-green transition-all flex items-center space-x-2 group cursor-pointer"
              >
                <span>Launch {activeStep.stakeholder} Portal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <span className="text-xs font-mono text-gray-400">
                Statutory CPCB E-Waste Compliance &bull; Instant Data Persistence
              </span>
            </div>
          </div>

          {/* Right Column: Key Metric Highlight Box */}
          <div className="lg:col-span-5 bg-nexus-dark/80 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                Real-Time Benchmark
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="space-y-1">
              <div className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${activeStep.color}`}>
                {activeStep.metric}
              </div>
              <div className="text-xs font-mono text-gray-300">
                {activeStep.metricLabel}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/5 space-y-2 text-xs font-mono text-gray-400">
              <div className="flex justify-between items-center">
                <span>Security Standard</span>
                <span className="text-white font-bold">NIST 800-88 Multi-Pass</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Regulatory Authority</span>
                <span className="text-white font-bold">CPCB / MoEFCC India</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Data Integrity</span>
                <span className="text-emerald-400 font-bold">SHA-256 Ledger Hash</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
