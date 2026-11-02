import React from 'react';
import Link from 'next/link';
import { Compass, Home, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
        <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '20s' }} />
      </div>

      <div className="space-y-2 max-w-md">
        <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-mono">
          404: UNMAPPED COORDINATES
        </div>
        <p className="text-sm text-slate-400">
          The requested electronic waste ledger record or route does not exist in this circular chain-of-custody.
        </p>
      </div>

      <div className="flex items-center space-x-3">
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-glow-green"
        >
          <Home className="w-4 h-4" />
          <span>Back to Ecosystem</span>
        </Link>
        <Link
          href="/pickups"
          className="px-6 py-3 rounded-xl bg-nexus-charcoal border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-2"
        >
          <span>Schedule Pickup</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
