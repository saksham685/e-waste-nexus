'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { soundEffects } from '@/lib/sound';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { logoutAction } from '@/actions/authActions';
import {
  ShieldCheck,
  Lock,
  LogIn,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Recycle,
  KeyRound,
  Shield,
  Smartphone,
} from 'lucide-react';

export default function LogoutPage() {
  const router = useRouter();
  const { logout, user } = useAuthStore();
  const [loggedOutUser, setLoggedOutUser] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<string>('');

  useEffect(() => {
    // Capture user name before clearing
    if (user?.name) {
      setLoggedOutUser(user.name);
    }
    setTimestamp(new Date().toLocaleTimeString());

    // Play security audio cue
    soundEffects.playUnlock();

    // 1. Next.js Server Action: Delete HttpOnly server cookie
    logoutAction().catch(() => {});

    // 2. Client-side cookie purge
    if (typeof document !== 'undefined') {
      document.cookie = 'nexus_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    }

    // 3. Zustand Global Store purge
    logout();

    // 4. Voice Assistant notification
    voiceAssistant.speak('Your session has been securely closed. The ecosystem is now protected behind the login gate.');
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Logout Confirmation Card */}
      <div className="w-full max-w-lg bg-gradient-to-b from-nexus-card/95 via-nexus-card/85 to-nexus-dark/95 border-2 border-emerald-500/30 rounded-3xl p-8 sm:p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden text-center space-y-6">
        {/* Top laser accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-lime-400 shadow-glow-green" />

        {/* Shield Icon Badge */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-lime-400 p-0.5 mx-auto shadow-glow-green">
          <div className="w-full h-full bg-nexus-dark rounded-[22px] flex items-center justify-center">
            <ShieldCheck className="w-10 h-10 text-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Headings */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] uppercase font-bold tracking-wider">
            <Lock className="w-3 h-3" />
            <span>SESSION REVOKED &bull; LOGGED OUT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            You Have Safely Logged Out
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
            {loggedOutUser ? (
              <span>Goodbye, <strong className="text-emerald-400">{loggedOutUser}</strong>. Your authenticated session has been terminated.</span>
            ) : (
              <span>Your cryptographic session token has been securely revoked from this device.</span>
            )}
          </p>
        </div>

        {/* Security Audit Telemetry Breakdown */}
        <div className="p-4 rounded-2xl bg-nexus-dark/90 border border-emerald-500/20 text-left font-mono text-xs space-y-2.5">
          <div className="flex items-center justify-between text-gray-400 pb-2 border-b border-emerald-500/15">
            <span className="flex items-center space-x-1.5">
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              <span>JWT Session Token:</span>
            </span>
            <span className="text-emerald-400 font-bold">EXPIRED &amp; REMOVED</span>
          </div>

          <div className="flex items-center justify-between text-gray-400 pb-2 border-b border-emerald-500/15">
            <span className="flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Edge Middleware Gate:</span>
            </span>
            <span className="text-cyan-400 font-bold">RE-ENGAGED (307)</span>
          </div>

          <div className="flex items-center justify-between text-gray-400">
            <span className="flex items-center space-x-1.5">
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>Registered Monitors:</span>
            </span>
            <span className="text-gray-300 font-bold text-[11px]">98059 26846 / 9417453249</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Link
            href="/login"
            onClick={() => soundEffects.playClick()}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-nexus-dark font-black text-sm tracking-wide shadow-glow-green transition-all flex items-center justify-center space-x-2 cursor-pointer hover:scale-102 active:scale-98"
          >
            <LogIn className="w-4 h-4 fill-current" />
            <span>Sign In to E-Waste Nexus Again</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/signup"
            onClick={() => soundEffects.playClick()}
            className="w-full py-3 px-6 rounded-2xl bg-nexus-dark/90 hover:bg-slate-800 text-gray-300 hover:text-white border border-emerald-500/30 hover:border-emerald-400 text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Register a Different Account (Sign Up)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
