import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-emerald-500/30 animate-ping" />
        </div>
      </div>
      <div className="text-center space-y-1">
        <div className="font-mono text-xs text-emerald-400 tracking-widest uppercase animate-pulse">
          Next.js Neural Stream Loading...
        </div>
        <p className="text-[11px] text-slate-500 font-mono">
          Fetching verified ledger records & 3D matrices
        </p>
      </div>
    </div>
  );
}
