'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Recycle, ShieldCheck, Heart, ArrowRight, CheckCircle2, Globe2 } from 'lucide-react';
import { soundEffects } from '@/lib/sound';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  // Hide Footer on full-screen authentication pages
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    soundEffects.playSuccess();
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 3000);
  };

  return (
    <footer className="w-full border-t border-white/[0.08] bg-slate-950/90 backdrop-blur-2xl pt-14 pb-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter / Notification Banner */}
        <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] uppercase font-bold tracking-wider mb-2">
              <Globe2 className="w-3 h-3" />
              <span>CPCB Regulatory Compliance Dispatch</span>
            </div>
            <h4 className="text-lg font-bold text-white">Subscribe to CPCB EPR Gazette &amp; Gold Yield Index</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xl font-light">
              Receive weekly updates on e-waste statutory rules, spot gold recycling prices, and regional collection manifests.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex items-center space-x-2 shrink-0">
            {subscribed ? (
              <div className="px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Subscribed to Gazette!</span>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  required
                  placeholder="name@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono w-60 sm:w-72"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs hover:opacity-90 flex items-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </form>
        </div>

        {/* 4 Column Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Recycle className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <span className="font-extrabold text-white text-sm tracking-tight">E-WASTE NEXUS</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Next.js 14
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed font-light">
              Autonomous Closed-Loop E-Waste Operating System &amp; Extended Producer Responsibility (EPR) Credit Settlement.
            </p>
            <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CPCB 2022 &bull; ISO 14001 Audited</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white font-mono uppercase text-[11px] tracking-wider">
              Circular Ecosystem
            </h4>
            <ul className="space-y-1.5 font-light">
              <li><Link href="/" className="hover:text-emerald-400 transition-colors">Ecosystem Overview</Link></li>
              <li><Link href="/pickups" className="hover:text-emerald-400 transition-colors">Doorstep Collection Portal</Link></li>
              <li><Link href="/centers" className="hover:text-emerald-400 transition-colors">Authorized Centers Map</Link></li>
              <li><Link href="/epr" className="hover:text-emerald-400 transition-colors">EPR Credit Trading Exchange</Link></li>
              <li><Link href="/cinema" className="hover:text-emerald-400 transition-colors">4K Video Cinema (Hindi &amp; English)</Link></li>
            </ul>
          </div>

          {/* Portals */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white font-mono uppercase text-[11px] tracking-wider">
              Role Portals (RBAC)
            </h4>
            <ul className="space-y-1.5 font-light">
              <li><Link href="/partner" className="hover:text-cyan-400 transition-colors">Logistics Partner Fleet Dock</Link></li>
              <li><Link href="/recycler" className="hover:text-cyan-400 transition-colors">Certified Recycler Hub &amp; Smelter</Link></li>
              <li><Link href="/admin" className="hover:text-cyan-400 transition-colors">Central Governance Audit Center</Link></li>
              <li><Link href="/analytics" className="hover:text-cyan-400 transition-colors">Lifecycle Carbon Telemetry</Link></li>
              <li><Link href="/syllabus" className="hover:text-purple-400 transition-colors">React &amp; Next.js Syllabus Lab</Link></li>
            </ul>
          </div>

          {/* Technical Architecture */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white font-mono uppercase text-[11px] tracking-wider">
              Curriculum Stack
            </h4>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                'Next.js 14',
                'App Router',
                'Server Actions',
                'Zod Validations',
                'Zustand Store',
                'Web Speech API',
                'Three.js 3D WebGL',
                'Tailwind CSS',
                'Edge Middleware',
              ].map((tech) => (
                <span key={tech} className="px-2 py-0.5 rounded-lg bg-slate-900 border border-white/10 text-[10px] font-mono text-slate-300">
                  {tech}
                </span>
              ))}
            </div>
            <div className="pt-2">
              <span className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>All Systems Operational (99.98% Uptime)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <div>
            &copy; 2026 E-Waste Nexus Circular Foundation. Government of India Environmental Protection Act 1986 &amp; E-Waste Rules 2022.
          </div>
          <div className="flex items-center space-x-1 mt-2 sm:mt-0 font-mono">
            <span>Crafted for Circular Zero-Landfill Future</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
