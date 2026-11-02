'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Next.js Caught Route Boundary Error:', error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center space-y-6 max-w-xl mx-auto">
      <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-glow-green">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          Route Recovery Boundary &bull; Next.js App Router
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Temporary Display Interruption
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-md mx-auto">
          The application encountered an unexpected state while loading this component. Your session remains secure.
        </p>
      </div>

      {error.message && (
        <div className="w-full p-4 rounded-2xl bg-nexus-card border border-amber-500/20 text-xs font-mono text-amber-300/90 text-left overflow-x-auto">
          <span className="text-gray-500 block text-[10px] uppercase tracking-wider mb-1">Diagnostic Detail:</span>
          {error.message}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={() => reset()}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 text-nexus-dark font-extrabold text-xs flex items-center space-x-2 hover:scale-105 active:scale-95 transition-all shadow-glow-green cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reload Component</span>
        </button>

        <Link
          href="/"
          className="px-6 py-3 rounded-2xl bg-nexus-card border border-emerald-500/30 text-gray-200 hover:text-white hover:border-emerald-400 text-xs font-semibold flex items-center space-x-2 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
