import React from 'react';
import { Recycle, ShieldCheck, FileCheck, ArrowUpRight, Cpu, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full border-t border-slate-800 bg-nexus-dark/95 text-nexus-muted pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust & Transparency Feature Highlight */}
        <div className="mb-14 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-nexus-charcoal via-nexus-card to-nexus-charcoal border border-emerald-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">Verifiable Chain-of-Custody</h4>
                <p className="text-xs leading-relaxed text-slate-400">
                  Every gram of collected electronics maintains an immutable, tamper-evident audit record from physical pickup to smelter assay.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">Strict EPR Credit Governance</h4>
                <p className="text-xs leading-relaxed text-slate-400">
                  Zero credits issued without verified recycler assay evidence. Built-in mathematical anti-duplicate protections prevent credit inflation.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-lime-500/10 border border-lime-500/30 text-lime-400 shrink-0">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">Circular Commodity Recovery</h4>
                <p className="text-xs leading-relaxed text-slate-400">
                  Redirects precious gold, copper, cobalt, and lithium back into industrial production loops, averting virgin open-pit mining.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
                <Recycle className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                E-WASTE <span className="text-emerald-400">NEXUS</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              An enterprise-grade circular logistics and Extended Producer Responsibility (EPR) intelligence system. Bridging consumers, authorized hubs, recyclers, and producers with verifiable sustainability accounting.
            </p>
            <div className="flex items-center space-x-3 text-xs text-emerald-400">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono text-[11px]">System Status: All Operational Nodes Active</span>
            </div>
          </div>

          {/* Column 1: Platform */}
          <div>
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider font-mono mb-3">Ecosystem</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('pickups')} className="hover:text-emerald-400 transition-colors">
                  Schedule Pickup
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('centers')} className="hover:text-emerald-400 transition-colors">
                  Collection Centers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('epr')} className="hover:text-emerald-400 transition-colors">
                  EPR Credit Registry
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('analytics')} className="hover:text-emerald-400 transition-colors">
                  Lifecycle Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Portals */}
          <div>
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider font-mono mb-3">Access Portals</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('pickups')} className="hover:text-emerald-400 transition-colors">
                  Individual Consumer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('partner')} className="hover:text-emerald-400 transition-colors">
                  Logistics Partner
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('recycler')} className="hover:text-emerald-400 transition-colors">
                  Certified Recycler
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-emerald-400 transition-colors">
                  Admin Control Center
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Governance */}
          <div>
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider font-mono mb-3">Transparency</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>ISO 14001 WEEE Standards</li>
              <li>EPA Life-Cycle Assessment</li>
              <li>Anti-Fraud Verification Policy</li>
              <li>Data Privacy & Security</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar & Mandatory Regulatory Transparency Statement */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500 space-y-4 md:space-y-0">
          <div>
            © 2026 E-Waste Nexus Platform. All rights reserved. Built for university demonstration and enterprise technical review.
          </div>
          <div className="text-right max-w-md text-[10px] leading-tight text-slate-500">
            <span className="text-emerald-500/80 font-medium">Compliance Disclosure:</span> This platform implements certified EPR logic models and chain-of-custody tracking. Sample metrics and conversion factors are calibrated according to standard WEEE directives.
          </div>
        </div>
      </div>
    </footer>
  );
};
