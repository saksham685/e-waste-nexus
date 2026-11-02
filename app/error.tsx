'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Next.js Caught Route Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          System Circuit Interrupt
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          {error.message || 'An unexpected rendering error occurred during this lifecycle pass.'}
        </p>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center space-x-2 hover:bg-emerald-400 transition-all shadow-glow-green cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Operation</span>
        </button>

        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-nexus-charcoal border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-2 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
