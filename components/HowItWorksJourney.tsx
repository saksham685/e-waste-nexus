'use client';

import React from 'react';
import Link from 'next/link';
import {
  CalendarClock,
  Scale,
  BadgeIndianRupee,
  ShieldCheck,
  HardDriveDownload,
  Lock,
  ArrowRight,
  FileCheck,
  Sparkles,
} from 'lucide-react';

export const HowItWorksJourney: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Schedule in 30 Seconds',
      description:
        'Select your electronic devices, enter your pickup address, and choose a convenient morning or evening time slot.',
      icon: CalendarClock,
      badge: 'Zero Booking Fee',
    },
    {
      number: '02',
      title: 'Doorstep Digital Weighing',
      description:
        'Our background-verified field agent arrives with calibrated electronic scales and verifies weights right in front of your eyes.',
      icon: Scale,
      badge: '100% Transparent',
    },
    {
      number: '03',
      title: 'Instant UPI Payout & Certificate',
      description:
        'Payment is credited directly to your UPI (GPay, PhonePe, Paytm) within 60 seconds along with a statutory CPCB green certificate.',
      icon: BadgeIndianRupee,
      badge: 'Immediate Settlement',
    },
  ];

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simple, Transparent &amp; Safe</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          How Doorstep E-Waste Collection Works
        </h2>
        <p className="mt-2 text-sm text-zinc-400 font-light">
          No haggling with informal scrap vendors. Get certified recycling, transparent scale readings, and instant cash payouts.
        </p>
      </div>

      {/* 3-Step Journey Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between relative group"
            >
              {/* Top Step Number & Icon */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-3xl font-black text-zinc-800 group-hover:text-zinc-700 transition-colors">
                    {step.number}
                  </span>
                </div>

                <div className="inline-block text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 mb-2">
                  {step.badge}
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-light">{step.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center text-xs text-zinc-500 font-mono">
                <span>Step {idx + 1} of 3</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Military-Grade Data Security Guarantee Banner */}
      <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-start space-x-4 max-w-2xl">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white flex items-center space-x-2">
              <span>100% Certified Data Sanitization Guarantee</span>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                NIST 800-88
              </span>
            </h4>
            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed font-light">
              Worried about old photos, passwords, or company files? Every device storage chip undergoes certified 3-pass cryptographic wipe or physical hydraulic punch destruction before smelting. A signed Data Destruction Certificate is delivered to your email.
            </p>
          </div>
        </div>

        <Link
          href="/pickups"
          className="px-6 py-3 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-bold transition-all shrink-0 flex items-center space-x-2 shadow-sm cursor-pointer"
        >
          <span>Book Your Free Pickup</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};
