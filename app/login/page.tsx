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
  Check,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, switchDemoRole } = useAuthStore();

  // Mode: 'login' or 'signup'
  const [isSignUp, setIsSignUp] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('user@nexus.eco');
  const [password, setPassword] = useState('User@123');
  const [role, setRole] = useState<'individual' | 'partner' | 'recycler'>('individual');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const getDestination = () => {
    if (typeof window === 'undefined') return '/';
    const redirect = new URLSearchParams(window.location.search).get('redirect');
    return redirect && redirect.startsWith('/') ? redirect : '/';
  };

  // Instant 1-Click Login (Standard One-Tap Access)
  const handleInstantLogin = (personaKey: keyof typeof DEMO_USERS = 'individual') => {
    soundEffects.playUnlock();
    const persona = DEMO_USERS[personaKey];
    const sessionToken = `nexus_jwt_${personaKey}_token_session_2026`;

    document.cookie = `nexus_token=${sessionToken}; path=/; max-age=604800; SameSite=Lax`;
    switchDemoRole(personaKey);
    setUser(persona, sessionToken);

    setSuccessMsg(`Welcome, ${persona.name}! Logging you in...`);
    voiceAssistant.speak(`Welcome back, ${persona.name}. Opening dashboard.`);

    const target = getDestination();
    setTimeout(() => {
      window.location.href = target;
    }, 200);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playClick();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        const res = await registerAction({
          name: name.trim() || 'New User',
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
          const target = getDestination();
          setTimeout(() => {
            window.location.href = target;
          }, 300);
        } else {
          soundEffects.playError();
          setErrorMsg(res.error || 'Registration failed. Please try again.');
        }
      } else {
        const res = await loginAction({ email: email.trim(), password });
        if (res.success && res.user) {
          soundEffects.playSuccess();
          setSuccessMsg(`Welcome back, ${res.user.name}!`);
          if (res.token) {
            document.cookie = `nexus_token=${res.token}; path=/; max-age=604800; SameSite=Lax`;
          }
          setUser(res.user, res.token);
          const target = getDestination();
          setTimeout(() => {
            window.location.href = target;
          }, 300);
        } else {
          soundEffects.playError();
          setErrorMsg(res.error || 'Invalid email or password.');
        }
      }
    } catch (err: any) {
      soundEffects.playError();
      setErrorMsg(err?.message || 'Authentication error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Standard Clean Card */}
      <div className="w-full max-w-md bg-nexus-card border border-emerald-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-lime-400 p-0.5 shadow-glow-green group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-nexus-dark rounded-[10px] flex items-center justify-center">
                <Recycle className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <span className="text-xl font-black text-white tracking-tight">
              E-WASTE <span className="text-emerald-400">NEXUS</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black text-white tracking-tight pt-1">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-xs text-gray-400">
            {isSignUp
              ? 'Join India’s certified e-waste & EPR credit platform'
              : 'Enter your credentials to access your dashboard'}
          </p>
        </div>

        {/* 1-Click Fast Access Button (Standard Fast-Login like Google login on other sites) */}
        <div>
          <button
            type="button"
            onClick={() => handleInstantLogin('individual')}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 hover:from-emerald-400 hover:to-lime-300 text-nexus-dark font-black text-xs sm:text-sm tracking-wide shadow-glow-green transition-all flex items-center justify-center space-x-2 cursor-pointer hover:scale-102 active:scale-98"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>⚡ 1-Click Demo Login (Instant Access)</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-emerald-500/20 w-full" />
          <span className="bg-nexus-card px-3 text-[11px] font-mono uppercase text-gray-500 shrink-0">
            Or sign in with email
          </span>
          <div className="border-t border-emerald-500/20 w-full" />
        </div>

        {/* Feedback Banners */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Standard Clean Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isSignUp}
                  className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-mono transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-300">
                Password
              </label>
              {!isSignUp && (
                <span className="text-[10px] text-gray-400 font-mono">Sample: User@123</span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-mono transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-2.5 text-gray-400 hover:text-emerald-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Account Type
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400 font-sans"
              >
                <option value="individual">Citizen (Sell &amp; Recycle Household E-Waste)</option>
                <option value="partner">Logistics Partner (Pickup &amp; Fleet Transport)</option>
                <option value="recycler">Recycler Facility (Smelter &amp; Refining)</option>
              </select>
            </div>
          )}

          {!isSignUp && (
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 text-gray-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-emerald-500/30 text-emerald-500 focus:ring-0 bg-nexus-dark"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setEmail('user@nexus.eco');
                  setPassword('User@123');
                  soundEffects.playClick();
                }}
                className="text-emerald-400 hover:underline text-xs"
              >
                Auto-fill demo credentials
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-nexus-dark font-black text-sm tracking-wide shadow-glow-green transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer hover:scale-102 active:scale-98"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{isSignUp ? 'Create Free Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle between Login and Sign Up (Just like standard websites) */}
        <div className="text-center pt-2 border-t border-emerald-500/20 text-xs text-gray-400">
          {isSignUp ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setIsSignUp(false);
                  setErrorMsg(null);
                }}
                className="text-emerald-400 font-bold hover:underline ml-1 cursor-pointer"
              >
                Sign in here
              </button>
            </span>
          ) : (
            <span>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setIsSignUp(true);
                  setErrorMsg(null);
                }}
                className="text-emerald-400 font-bold hover:underline ml-1 cursor-pointer"
              >
                Sign up for free
              </button>
            </span>
          )}
        </div>

        {/* Quick Role Badges (1-Click switch) */}
        <div className="pt-2 text-center">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-2">
            Switch quick demo role:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => handleInstantLogin('individual')}
              className="px-2.5 py-1 rounded-lg bg-nexus-dark border border-emerald-500/20 hover:border-emerald-400 text-emerald-400 transition-colors"
            >
              Citizen
            </button>
            <button
              type="button"
              onClick={() => handleInstantLogin('partner')}
              className="px-2.5 py-1 rounded-lg bg-nexus-dark border border-cyan-500/20 hover:border-cyan-400 text-cyan-400 transition-colors"
            >
              Logistics
            </button>
            <button
              type="button"
              onClick={() => handleInstantLogin('recycler')}
              className="px-2.5 py-1 rounded-lg bg-nexus-dark border border-amber-500/20 hover:border-amber-400 text-amber-400 transition-colors"
            >
              Recycler
            </button>
            <button
              type="button"
              onClick={() => handleInstantLogin('admin')}
              className="px-2.5 py-1 rounded-lg bg-nexus-dark border border-purple-500/20 hover:border-purple-400 text-purple-400 transition-colors"
            >
              Auditor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
