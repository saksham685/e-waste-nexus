import React from 'react';
import Link from 'next/link';
import { Recycle, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800 bg-nexus-dark/90 backdrop-blur-md pt-12 pb-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Recycle className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-sm tracking-tight">E-WASTE NEXUS</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Next.js 14</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              AI-Powered E-Waste Collection & Extended Producer Responsibility (EPR) Credit Management Platform. Built strictly with Next.js App Router, React 18, Zod & Zustand.
            </p>
            <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>WEEE & ISO 14001 Compliant Audit Trails</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white font-mono uppercase text-[11px] tracking-wider">Circular Navigation</h4>
            <ul className="space-y-1.5">
              <li><Link href="/" className="hover:text-emerald-400 transition-colors">Ecosystem Overview</Link></li>
              <li><Link href="/pickups" className="hover:text-emerald-400 transition-colors">Smart Collection Portal</Link></li>
              <li><Link href="/centers" className="hover:text-emerald-400 transition-colors">Authorized Collection Centers</Link></li>
              <li><Link href="/epr" className="hover:text-emerald-400 transition-colors">EPR Credit Ledger</Link></li>
              <li><Link href="/cinema" className="hover:text-emerald-400 transition-colors">4K Video Cinema (Hindi & English)</Link></li>
            </ul>
          </div>

          {/* Portals */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white font-mono uppercase text-[11px] tracking-wider">Role Portals (RBAC)</h4>
            <ul className="space-y-1.5">
              <li><Link href="/partner" className="hover:text-cyan-400 transition-colors">Collection Fleet Partner Portal</Link></li>
              <li><Link href="/recycler" className="hover:text-cyan-400 transition-colors">Certified Recycler Hub & Smelter</Link></li>
              <li><Link href="/admin" className="hover:text-cyan-400 transition-colors">Administrator Control Center</Link></li>
              <li><Link href="/analytics" className="hover:text-cyan-400 transition-colors">Environmental Lifecycle Analytics</Link></li>
            </ul>
          </div>

          {/* Technical Architecture */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white font-mono uppercase text-[11px] tracking-wider">Tech Stack Standards</h4>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['Next.js 14', 'App Router', 'Server Components', 'Server Actions', 'Zod Schema', 'Zustand State', 'Tailwind CSS', 'Web Speech API', 'Three.js 3D'].map((tech) => (
                <span key={tech} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <div>
            © 2026 E-Waste Nexus. Extended Producer Responsibility Ledger Systems.
          </div>
          <div className="flex items-center space-x-1 mt-2 sm:mt-0 font-mono">
            <span>Engineering Zero Unmanaged E-Waste</span>
            <Heart className="w-3 h-3 text-emerald-400 fill-current ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
