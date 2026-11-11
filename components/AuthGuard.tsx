'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore, DEMO_USERS } from '@/lib/store';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  LogIn,
  ArrowRight,
  Key,
  CheckCircle2,
  Lock,
  Sparkles,
} from 'lucide-react';
import { soundEffects } from '@/lib/sound';
import { voiceAssistant } from '@/lib/voiceAssistant';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { user, switchDemoRole } = useAuthStore();
  const [bypassed, setBypassed] = useState(false);

  // Check if route is restricted to administrators
  const isAdminRoute = pathname.startsWith('/admin');

  const handleInstantSwitchAdmin = () => {
    soundEffects.playSuccess();
    switchDemoRole('admin');
    voiceAssistant.speak('Administrator credentials verified. Access granted to CPCB governance portal.');
  };

  const handleBypass = () => {
    soundEffects.playClick();
    setBypassed(true);
  };

  // If already admin or bypassed, render content directly
  if (!isAdminRoute || user?.role === 'admin' || bypassed) {
    return <>{children}</>;
  }

  return (
    <div className="w-full min-h-[75vh] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-xl bg-nexus-card border-2 border-red-500/30 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-2xl space-y-6 text-center relative overflow-hidden">
        {/* Subtle ambient red/emerald aura */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Top Emblem */}
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto shadow-sm">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono uppercase tracking-wider">
            <Key className="w-3.5 h-3.5" />
            <span>Role-Based Access Control &bull; Security Level 5</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Administrator Clearance Required
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed font-light">
            You are currently logged in as{' '}
            <strong className="text-emerald-400 font-mono capitalize">{user?.role || 'individual'}</strong> (
            {user?.name || 'Citizen Consignor'}). The CPCB Environmental Audit Portal requires Administrator role clearance.
          </p>
        </div>

        {/* 1-Click Instant Administrator Identity Switcher */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-3 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4" />
              <span>1-CLICK DEMO IDENTITY SWITCHER</span>
            </span>
            <span className="text-[10px] font-mono text-gray-400">Instant Access</span>
          </div>

          <p className="text-[11px] text-gray-300">
            Click below to instantly switch to the verified CPCB Chief Auditor profile and view the live audit ledger:
          </p>

          <button
            type="button"
            onClick={handleInstantSwitchAdmin}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-glow-green transition-all flex items-center justify-center space-x-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Switch to CPCB Administrator ({DEMO_USERS.admin.name}) &amp; Enter</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Secondary Navigation Options */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-mono">
          <button
            type="button"
            onClick={handleBypass}
            className="px-4 py-2 rounded-xl bg-nexus-dark hover:bg-slate-800 text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            <span>Preview Without Role Switch</span>
          </button>

          <Link
            href="/login"
            className="px-4 py-2 rounded-xl bg-nexus-dark hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 border border-cyan-500/20 transition-colors flex items-center space-x-1"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Go to Login Screen</span>
          </Link>

          <Link
            href="/pickups"
            className="px-4 py-2 rounded-xl bg-nexus-dark hover:bg-slate-800 text-gray-400 hover:text-white border border-white/10 transition-colors"
          >
            <span>Return to Pickups</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
