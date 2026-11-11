'use client';

import React from 'react';

/**
 * Enterprise Modern Ambient Background (Zero video-game grid, zero arcade cubes)
 * Features subtle, high-performance radial mesh glows inspired by Linear, Apple Pro, and Stripe.
 */
export const CyberBackground3D: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none -z-20 overflow-hidden bg-slate-950"
      aria-hidden="true"
    >
      {/* Top subtle ambient emerald aura */}
      <div className="absolute -top-40 left-1/4 w-[600px] h-[500px] bg-emerald-500/[0.07] rounded-full blur-[140px]" />

      {/* Top-right subtle cyan aura */}
      <div className="absolute -top-20 right-1/4 w-[500px] h-[450px] bg-cyan-500/[0.06] rounded-full blur-[130px]" />

      {/* Center ambient deep indigo glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-teal-500/[0.04] rounded-full blur-[160px]" />

      {/* Subtle modern dot matrix pattern overlay (1px crisp enterprise feel) */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

      {/* Bottom subtle ambient glow */}
      <div className="absolute -bottom-40 right-1/3 w-[700px] h-[400px] bg-emerald-600/[0.05] rounded-full blur-[150px]" />
    </div>
  );
};
