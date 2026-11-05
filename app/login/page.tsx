'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { soundEffects } from '@/lib/sound';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { loginAction } from '@/actions/authActions';
import {
  Recycle,
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  KeyRound,
  Sparkles,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  // Form states - clean, empty by default
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const getDestination = () => {
    if (typeof window === 'undefined') return '/';
    const redirect = new URLSearchParams(window.location.search).get('redirect');
    return redirect && redirect.startsWith('/') ? redirect : '/';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playClick();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      soundEffects.playError();
      setErrorMsg('Please enter your email address.');
      return;
    }

    if (!password) {
      soundEffects.playError();
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginAction({
        email: email.trim().toLowerCase(),
        password,
      });

      if (res.success && res.user) {
        soundEffects.playSuccess();
        setSuccessMsg(`Welcome back, ${res.user.name}! Opening platform...`);

        // Set session cookie for Next.js Edge Middleware
        if (res.token) {
          document.cookie = `nexus_token=${res.token}; path=/; max-age=604800; SameSite=Lax`;
        }

        setUser(res.user, res.token);
        voiceAssistant.speak(`Welcome back, ${res.user.name}. Opening your workspace.`);

        const target = getDestination();
        setTimeout(() => {
          window.location.href = target;
        }, 300);
      } else {
        soundEffects.playError();
        setErrorMsg(res.error || 'Invalid email or password. Please verify your credentials or create an account.');
      }
    } catch (err: any) {
      soundEffects.playError();
      setErrorMsg(err?.message || 'Authentication error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Professional Login Card */}
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
            Sign In to Your Account
          </h1>
          <p className="text-xs text-gray-400">
            Enter your authorized email and password to access the platform
          </p>
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

        {/* Real Authentic Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
                autoComplete="email"
                className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-mono transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-mono transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-2.5 text-gray-400 hover:text-emerald-300"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center space-x-2 text-gray-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-emerald-500/30 text-emerald-500 focus:ring-0 bg-nexus-dark"
              />
              <span>Remember this device</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-nexus-dark font-black text-sm tracking-wide shadow-glow-green transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer hover:scale-102 active:scale-98"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Clear Sign Up Direct CTA */}
        <div className="text-center pt-4 border-t border-emerald-500/20 text-xs text-gray-400 space-y-2">
          <div>Don&apos;t have an account yet?</div>
          <Link
            href="/signup"
            onClick={() => soundEffects.playClick()}
            className="w-full py-2.5 px-4 rounded-xl bg-nexus-dark hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 hover:border-emerald-400 font-bold flex items-center justify-center space-x-2 transition-all shadow-sm cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New Free Account (Sign Up)</span>
          </Link>
        </div>

        {/* Security Trust Footnote */}
        <div className="pt-2 text-center flex items-center justify-center space-x-1.5 text-[10px] text-gray-500 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400/80" />
          <span>Secured with 256-bit SSL &amp; CPCB Compliance Verification</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-nexus-card border border-emerald-500/40 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center space-x-2 text-white font-bold text-base">
              <KeyRound className="w-5 h-5 text-emerald-400" />
              <span>Password Recovery</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              If you forgot your password, you can register a new account instantly with your email address or use your existing credentials.
            </p>
            <div className="flex space-x-2 pt-2">
              <Link
                href="/signup"
                onClick={() => setForgotModalOpen(false)}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 text-nexus-dark font-bold text-xs text-center hover:bg-emerald-400"
              >
                Go to Sign Up
              </Link>
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="py-2 px-4 rounded-xl bg-nexus-dark border border-gray-700 text-gray-300 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
