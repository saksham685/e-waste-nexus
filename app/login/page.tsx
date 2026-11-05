'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore, DEMO_USERS } from '@/lib/store';
import { soundEffects } from '@/lib/sound';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { loginAction, registerAction } from '@/actions/authActions';
import {
  Recycle,
  Lock,
  Mail,
  User as UserIcon,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Zap,
  Truck,
  Building2,
  ShieldAlert,
  LogIn,
  UserPlus,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, switchDemoRole } = useAuthStore();

  // Mode: 'login' or 'signup'
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('user@nexus.eco');
  const [password, setPassword] = useState('User@123');
  const [role, setRole] = useState<'individual' | 'partner' | 'recycler'>('individual');
  const [showPassword, setShowPassword] = useState(false);

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 1-Click Instant Demo Login (Zero Friction)
  const handleInstantDemoLogin = (personaKey: keyof typeof DEMO_USERS = 'individual') => {
    soundEffects.playUnlock();
    const persona = DEMO_USERS[personaKey];
    const sessionToken = `nexus_jwt_${personaKey}_token_session_2026`;

    // Set cookie and store
    document.cookie = `nexus_token=${sessionToken}; path=/; max-age=604800; SameSite=Lax`;
    switchDemoRole(personaKey);
    setUser(persona, sessionToken);

    setSuccessMsg(`Welcome, ${persona.name}! Logging you in directly...`);
    voiceAssistant.speak(`Welcome to E-Waste Nexus, ${persona.name}.`);

    setTimeout(() => {
      window.location.href = '/';
    }, 250);
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playClick();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const res = await registerAction({
          name: name.trim() || 'New Member',
          email: email.trim(),
          password,
          role,
        });

        if (res.success && res.user) {
          soundEffects.playSuccess();
          setSuccessMsg(`Account created for ${res.user.name}! Opening platform...`);
          if (res.token) {
            document.cookie = `nexus_token=${res.token}; path=/; max-age=604800; SameSite=Lax`;
          }
          setUser(res.user, res.token);
          setTimeout(() => {
            window.location.href = '/';
          }, 300);
        } else {
          soundEffects.playError();
          setErrorMsg(res.error || 'Registration failed. Please check your inputs.');
        }
      } else {
        const res = await loginAction({ email: email.trim(), password });
        if (res.success && res.user) {
          soundEffects.playSuccess();
          setSuccessMsg(`Welcome back, ${res.user.name}! Opening dashboard...`);
          if (res.token) {
            document.cookie = `nexus_token=${res.token}; path=/; max-age=604800; SameSite=Lax`;
          }
          setUser(res.user, res.token);
          setTimeout(() => {
            window.location.href = '/';
          }, 300);
        } else {
          soundEffects.playError();
          setErrorMsg(res.error || 'Invalid email or password.');
        }
      }
    } catch (err: any) {
      soundEffects.playError();
      setErrorMsg(err?.message || 'Authentication error. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-lg bg-gradient-to-b from-nexus-card/95 via-nexus-card/90 to-nexus-dark/95 border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden space-y-6">
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-lime-400" />

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-lime-400 p-0.5 shadow-glow-green mx-auto">
            <div className="w-full h-full bg-nexus-dark rounded-[14px] flex items-center justify-center">
              <Recycle className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            E-Waste Nexus Portal
          </h1>
          <p className="text-xs sm:text-sm text-gray-300">
            Sign in or create a new account to enter the circular electronics platform.
          </p>
        </div>

        {/* 1-Click Fast Track Button (Direct Entry) */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-nexus-card to-emerald-950/80 border border-emerald-500/40 text-center space-y-2">
          <div className="text-xs text-gray-300 font-medium">
            Fastest Way &bull; No password required:
          </div>
          <button
            type="button"
            onClick={() => handleInstantDemoLogin('individual')}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-lime-400 hover:from-emerald-400 hover:to-lime-300 text-nexus-dark font-black text-xs sm:text-sm tracking-wide shadow-glow-green transition-all flex items-center justify-center space-x-2 cursor-pointer hover:scale-102 active:scale-98"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>⚡ Direct 1-Click Enter (Open Website)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector Tabs: Login vs Sign Up */}
        <div className="flex p-1 rounded-2xl bg-nexus-dark border border-emerald-500/20">
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              setMode('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              mode === 'login'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-nexus-dark shadow-glow-green'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In (Login)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              setMode('signup');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              mode === 'signup'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-nexus-dark shadow-glow-green'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account (Sign Up)</span>
          </button>
        </div>

        {/* Feedback Banners */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* The Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1">
                Your Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={mode === 'signup'}
                  className="w-full bg-nexus-dark border border-emerald-500/30 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3.5" />
              <input
                type="email"
                placeholder="user@nexus.eco"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-nexus-dark border border-emerald-500/30 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-mono font-bold text-gray-300 uppercase">
                Password
              </label>
              {mode === 'login' && (
                <span className="text-[10px] font-mono text-emerald-400">Sample: User@123</span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-nexus-dark border border-emerald-500/30 rounded-2xl pl-10 pr-11 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-gray-400 hover:text-emerald-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1">
                Account Type / Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-nexus-dark border border-emerald-500/30 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="individual">Citizen Consignor (Sell/Recycle Home Devices)</option>
                <option value="partner">GreenRoute Fleet Logistics Partner</option>
                <option value="recycler">EcoRefine Smelter &amp; Refining Facility</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-lime-400 hover:from-emerald-400 hover:to-lime-300 text-nexus-dark font-black text-sm tracking-wide shadow-glow-green transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <span>Processing...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In & Enter Dashboard' : 'Create Account & Enter'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Persona Switchers */}
        <div className="pt-3 border-t border-emerald-500/20">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-2 text-center">
            Or select a role for 1-click test access:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleInstantDemoLogin('individual')}
              className="p-2 rounded-xl bg-nexus-dark border border-emerald-500/20 hover:border-emerald-400 text-center transition-all group"
            >
              <div className="text-emerald-400 font-bold text-xs">Citizen</div>
              <div className="text-[9px] text-gray-500 group-hover:text-gray-300">Alex Mercer</div>
            </button>

            <button
              type="button"
              onClick={() => handleInstantDemoLogin('partner')}
              className="p-2 rounded-xl bg-nexus-dark border border-cyan-500/20 hover:border-cyan-400 text-center transition-all group"
            >
              <div className="text-cyan-400 font-bold text-xs">Logistics</div>
              <div className="text-[9px] text-gray-500 group-hover:text-gray-300">Fleet Partner</div>
            </button>

            <button
              type="button"
              onClick={() => handleInstantDemoLogin('recycler')}
              className="p-2 rounded-xl bg-nexus-dark border border-amber-500/20 hover:border-amber-400 text-center transition-all group"
            >
              <div className="text-amber-400 font-bold text-xs">Recycler</div>
              <div className="text-[9px] text-gray-500 group-hover:text-gray-300">Smelter Hub</div>
            </button>

            <button
              type="button"
              onClick={() => handleInstantDemoLogin('admin')}
              className="p-2 rounded-xl bg-nexus-dark border border-purple-500/20 hover:border-purple-400 text-center transition-all group"
            >
              <div className="text-purple-400 font-bold text-xs">Auditor</div>
              <div className="text-[9px] text-gray-500 group-hover:text-gray-300">CPCB Admin</div>
            </button>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center pt-2">
          <Link
            href="/"
            onClick={() => soundEffects.playClick()}
            className="text-xs text-gray-400 hover:text-emerald-400 transition-colors"
          >
            &larr; View Website Without Logging In
          </Link>
        </div>
      </div>
    </div>
  );
}
