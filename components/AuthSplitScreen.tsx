'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
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
  UserPlus,
  LogIn,
  KeyRound,
  Sparkles,
  Shield,
  Cpu,
  Layers,
  Check,
  Globe,
  Truck,
  Building2,
  TrendingUp,
  Zap,
} from 'lucide-react';

interface AuthSplitScreenProps {
  initialMode?: 'signin' | 'signup';
}

export const AuthSplitScreen: React.FC<AuthSplitScreenProps> = ({ initialMode = 'signin' }) => {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  // Common Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Signup-specific states
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'individual' | 'partner' | 'recycler'>('individual');
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // 3D Tilt state on left container
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const leftPanelRef = useRef<HTMLDivElement>(null);

  // Sync mode with prop change
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!leftPanelRef.current) return;
    const rect = leftPanelRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const getDestination = () => {
    if (typeof window === 'undefined') return '/';
    const redirect = new URLSearchParams(window.location.search).get('redirect');
    return redirect && redirect.startsWith('/') ? redirect : '/';
  };

  // Password Strength Calculation
  const hasMinLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const strengthScore = [
    hasMinLength,
    hasUpperCase,
    hasNumber,
    password.length >= 10,
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  const getStrengthLabel = () => {
    if (password.length === 0) return { label: 'Empty', color: 'bg-slate-700', text: 'text-slate-500' };
    if (strengthScore <= 2) return { label: 'Weak', color: 'bg-red-500', text: 'text-red-400' };
    if (strengthScore <= 3) return { label: 'Fair', color: 'bg-amber-400', text: 'text-amber-400' };
    if (strengthScore <= 4) return { label: 'Strong', color: 'bg-emerald-400', text: 'text-emerald-400' };
    return { label: 'Very Strong', color: 'bg-cyan-400', text: 'text-cyan-400' };
  };

  const strength = getStrengthLabel();

  // Mode Switcher
  const switchMode = (newMode: 'signin' | 'signup') => {
    soundEffects.playClick();
    setMode(newMode);
    setErrorMsg(null);
    setSuccessMsg(null);
    if (typeof window !== 'undefined') {
      const redirect = new URLSearchParams(window.location.search).get('redirect');
      const query = redirect ? `?redirect=${encodeURIComponent(redirect)}` : '';
      window.history.pushState(null, '', newMode === 'signin' ? `/login${query}` : `/signup${query}`);
    }
  };

  // Real Google OAuth Popup Listener
  useEffect(() => {
    const handleAuthMessage = (event: MessageEvent) => {
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        const { user, token } = event.data;
        setUser(user, token);
        soundEffects.playSuccess();
        setSuccessMsg(`Welcome, ${user.name}! Signed in via ${user.email}.`);
        voiceAssistant.speak(`Welcome, ${user.name}. Google authentication verified.`);
        setGoogleLoading(false);
        const target = getDestination();
        setTimeout(() => {
          window.location.href = target;
        }, 400);
      }
    };

    window.addEventListener('message', handleAuthMessage);
    return () => window.removeEventListener('message', handleAuthMessage);
  }, []);

  // Open Real Google OAuth Dialog (Separate browser popup window like Canva, Notion, Spotify)
  const handleOpenGoogleModal = () => {
    soundEffects.playClick();
    setErrorMsg(null);
    setGoogleLoading(true);

    const width = 500;
    const height = 620;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;

    const popup = window.open(
      '/auth/google',
      'GoogleOAuthWindow',
      `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no,scrollbars=yes`
    );

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      // If browser popup blocker intercepts, fallback to direct in-tab redirection
      window.location.href = '/auth/google';
    } else {
      // Monitor popup close in case user cancels
      const checkPopupClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopupClosed);
          setGoogleLoading(false);
        }
      }, 1000);
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playClick();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validation
    if (!email.trim() || !email.includes('@')) {
      soundEffects.playError();
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        soundEffects.playError();
        setErrorMsg('Please enter your full legal name.');
        return;
      }
      if (!hasMinLength) {
        soundEffects.playError();
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }
      if (!hasUpperCase) {
        soundEffects.playError();
        setErrorMsg('Password must contain at least one uppercase letter (A-Z).');
        return;
      }
      if (!hasNumber) {
        soundEffects.playError();
        setErrorMsg('Password must contain at least one number (0-9).');
        return;
      }
      if (password !== confirmPassword) {
        soundEffects.playError();
        setErrorMsg('Passwords do not match. Please verify both fields.');
        return;
      }
      if (!agreedToTerms) {
        soundEffects.playError();
        setErrorMsg('You must agree to CPCB environmental compliance terms.');
        return;
      }
    } else {
      if (!password) {
        soundEffects.playError();
        setErrorMsg('Please enter your password.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const res = await registerAction({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role,
        });

        if (res.success && res.user) {
          soundEffects.playSuccess();
          setSuccessMsg(`Welcome, ${res.user.name}! Your account has been registered.`);

          if (res.token) {
            document.cookie = `nexus_token=${res.token}; path=/; max-age=604800; SameSite=Lax`;
          }
          setUser(res.user, res.token);
          voiceAssistant.speak(`Welcome to E-Waste Nexus, ${res.user.name}. Opening your workspace.`);

          const target = getDestination();
          setTimeout(() => {
            window.location.href = target;
          }, 400);
        } else {
          soundEffects.playError();
          setErrorMsg(res.error || 'Registration failed. An account with this email may already exist.');
        }
      } else {
        const res = await loginAction({
          email: email.trim().toLowerCase(),
          password,
        });

        if (res.success && res.user) {
          soundEffects.playSuccess();
          setSuccessMsg(`Welcome back, ${res.user.name}! Opening platform...`);

          if (res.token) {
            document.cookie = `nexus_token=${res.token}; path=/; max-age=604800; SameSite=Lax`;
          }
          setUser(res.user, res.token);
          voiceAssistant.speak(`Welcome back, ${res.user.name}.`);

          const target = getDestination();
          setTimeout(() => {
            window.location.href = target;
          }, 300);
        } else {
          soundEffects.playError();
          setErrorMsg(res.error || 'Invalid email or password. Please verify your credentials or create a new account.');
        }
      }
    } catch (err: any) {
      soundEffects.playError();
      setErrorMsg(err?.message || 'Authentication error. Please check your network and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playSuccess();
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setForgotModalOpen(false);
      setForgotEmail('');
    }, 2500);
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      {/* 3D Atmospheric Glowing Orbs */}
      <div className="absolute top-1/6 left-1/4 -translate-x-1/2 w-[650px] h-[650px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/6 right-1/4 translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Cyber Background Mesh Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(rgba(147, 51, 234, 0.25) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Main Split-Screen Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 rounded-[32px] border border-white/10 bg-slate-950/70 backdrop-blur-2xl shadow-[0_20px_80px_-15px_rgba(0,0,0,0.85)] overflow-hidden relative z-10 transition-all duration-500">
        
        {/* ================================================================ */}
        {/* LEFT PANEL: 3D FUTURISTIC ABSTRACT VISUAL & BRAND EXPERIENCE    */}
        {/* ================================================================ */}
        <div
          ref={leftPanelRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="lg:col-span-5 relative hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-slate-900/90 via-purple-950/30 to-slate-950 border-r border-white/10 overflow-hidden perspective-1000"
        >
          {/* Subtle Ambient Laser Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400" />

          {/* Top Brand Tag */}
          <div className="relative z-20">
            <Link href="/" className="inline-flex items-center space-x-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-cyan-500 to-emerald-400 p-0.5 shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Recycle className="w-5 h-5 text-emerald-400 group-hover:rotate-45 transition-transform duration-500" />
                </div>
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight flex items-center space-x-1.5 font-sans">
                  <span>E-WASTE</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400">
                    NEXUS
                  </span>
                </span>
                <span className="text-[10px] font-mono tracking-widest text-cyan-400/90 uppercase block">
                  Next-Gen Circular Tech
                </span>
              </div>
            </Link>
          </div>

          {/* Center 3D Interactive Holographic Visual Box */}
          <div
            className="my-auto py-8 relative flex items-center justify-center preserve-3d transition-transform duration-200 ease-out"
            style={{
              transform: `rotateY(${mousePos.x * 24}deg) rotateX(${-mousePos.y * 24}deg)`,
            }}
          >
            {/* Outer Orbit Rings */}
            <div className="w-64 h-64 rounded-full border border-purple-500/20 border-dashed animate-spin [animation-duration:35s] absolute" />
            <div className="w-52 h-52 rounded-full border border-cyan-500/25 border-dotted animate-spin [animation-duration:22s] [animation-direction:reverse] absolute" />
            
            {/* Center Glowing 3D Orb / Core */}
            <div className="relative w-36 h-36 rounded-3xl bg-gradient-to-tr from-purple-900/60 via-slate-900 to-cyan-900/60 border border-white/20 backdrop-blur-xl shadow-[0_0_50px_rgba(168,85,247,0.35)] flex flex-col items-center justify-center p-4 text-center group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-cyan-400 p-0.5 shadow-lg mb-2">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Shield className="w-7 h-7 text-cyan-400" />
                </div>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300 font-bold">
                EPR VAULT
              </span>
              <span className="text-[9px] text-gray-400 font-mono">CPCB SECURED</span>
            </div>

            {/* Floating 3D Micro-Chips (Orbiting Around) */}
            <div
              className="absolute -top-4 -left-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-purple-500/40 backdrop-blur-md shadow-lg flex items-center space-x-2 text-xs text-white"
              style={{ transform: 'translateZ(40px)' }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[11px]">CPCB Certified</span>
            </div>

            <div
              className="absolute -bottom-3 -right-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 backdrop-blur-md shadow-lg flex items-center space-x-2 text-xs text-white"
              style={{ transform: 'translateZ(45px)' }}
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono text-[11px]">256-Bit Vault</span>
            </div>

            <div
              className="absolute top-1/2 -right-6 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur-md shadow-lg flex items-center space-x-1.5 text-xs text-white"
              style={{ transform: 'translateZ(35px)' }}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-[11px]">₹4.8 Cr+ Paid</span>
            </div>
          </div>

          {/* Bottom Value Props */}
          <div className="relative z-20 space-y-3 pt-6 border-t border-white/10">
            <h3 className="text-xl font-extrabold text-white leading-snug">
              India&apos;s High-Velocity E-Waste &amp; EPR Credit Network
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Automated doorstep collections, verified pyrometallurgical recycling assays, and tamper-proof regulatory certificates for conscious citizens and enterprises.
            </p>

            <div className="flex items-center space-x-4 pt-2 text-[11px] font-mono text-slate-400">
              <span className="flex items-center space-x-1">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Carbon Footprint</span>
              </span>
              <span className="flex items-center space-x-1">
                <Check className="w-3.5 h-3.5 text-cyan-400" />
                <span>Instant UPI Rewards</span>
              </span>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* RIGHT PANEL: CLEAN, ELEGANT & FUNCTIONAL AUTHENTICATION FORM     */}
        {/* ================================================================ */}
        <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-center relative bg-slate-950/40">
          
          {/* Top Pill Tab Switcher */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <div className="flex p-1 rounded-2xl bg-slate-900/80 border border-white/10 shadow-inner">
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.35)] scale-102'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => switchMode('signup')}
                className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.35)] scale-102'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center space-x-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CPCB Safe Gate</span>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-1.5 mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {mode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-light">
              {mode === 'signin'
                ? 'Enter your verified credentials to access your dashboard'
                : 'Join India’s premier certified circular e-waste ecosystem'}
            </p>
          </div>

          {/* Feedback Banners */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2.5 animate-page-enter-3d">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2.5 animate-page-enter-3d">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Continue with Google Button */}
          <button
            type="button"
            onClick={handleOpenGoogleModal}
            disabled={googleLoading || isLoading}
            className="w-full py-3 px-4 rounded-2xl bg-slate-900/90 hover:bg-slate-850 text-white border border-white/15 hover:border-purple-500/40 text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-3 cursor-pointer hover:shadow-lg disabled:opacity-50 group mb-5"
          >
            {googleLoading ? (
              <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>
              {googleLoading
                ? 'Connecting with Google...'
                : mode === 'signin'
                ? 'Continue with Google'
                : 'Sign Up with Google'}
            </span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-slate-950 px-3 text-[11px] font-mono uppercase text-slate-500 shrink-0">
              Or continue with email
            </span>
            <div className="border-t border-white/10 w-full" />
          </div>

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* SIGNUP: Role Selection Cards */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Account Type / Category:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      setRole('individual');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      role === 'individual'
                        ? 'border-purple-400 bg-purple-500/20 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                        : 'border-white/10 bg-slate-900/60 text-slate-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <UserIcon className="w-3.5 h-3.5 mb-1 text-purple-400" />
                    <div className="font-bold text-[11px]">Citizen</div>
                    <div className="text-[9px] text-slate-400 leading-tight">Recycle &amp; Earn</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      setRole('partner');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      role === 'partner'
                        ? 'border-cyan-400 bg-cyan-500/20 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                        : 'border-white/10 bg-slate-900/60 text-slate-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5 mb-1 text-cyan-400" />
                    <div className="font-bold text-[11px]">Logistics</div>
                    <div className="text-[9px] text-slate-400 leading-tight">Fleet Pickups</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      setRole('recycler');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      role === 'recycler'
                        ? 'border-emerald-400 bg-emerald-500/20 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                        : 'border-white/10 bg-slate-900/60 text-slate-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 mb-1 text-emerald-400" />
                    <div className="font-bold text-[11px]">Recycler</div>
                    <div className="text-[9px] text-slate-400 leading-tight">Smelter Yield</div>
                  </button>
                </div>
              </div>
            )}

            {/* SIGNUP: Full Name Input */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name <span className="text-purple-400">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={mode === 'signup'}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email Address Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address <span className="text-purple-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full bg-slate-900/80 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 font-mono transition-colors"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Password <span className="text-purple-400">*</span>
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-[11px] text-purple-400 hover:text-purple-300 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-2xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 font-mono transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* SIGNUP: Password Strength Indicator Bar */}
            {mode === 'signup' && password.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Password Strength:</span>
                  <span className={`font-bold ${strength.text}`}>{strength.label}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${(strengthScore / 5) * 100}%` }}
                  />
                </div>
                <div className="flex items-center space-x-3 text-[10px] font-mono pt-0.5 text-slate-400">
                  <span className={hasMinLength ? 'text-emerald-400 font-bold' : ''}>
                    {hasMinLength ? '✓' : '•'} 6+ chars
                  </span>
                  <span className={hasUpperCase ? 'text-emerald-400 font-bold' : ''}>
                    {hasUpperCase ? '✓' : '•'} Uppercase
                  </span>
                  <span className={hasNumber ? 'text-emerald-400 font-bold' : ''}>
                    {hasNumber ? '✓' : '•'} Digit (0-9)
                  </span>
                </div>
              </div>
            )}

            {/* SIGNUP: Confirm Password Input */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Confirm Password <span className="text-purple-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required={mode === 'signup'}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-2xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 font-mono transition-colors"
                  />
                  {confirmPassword && (
                    <div className="absolute right-3.5 top-2.5">
                      {passwordsMatch ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <span className="text-[10px] text-red-400 font-mono">Mismatch</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SIGNIN: Remember Me Checkbox */}
            {mode === 'signin' && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2 text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-white/20 text-purple-600 focus:ring-0 bg-slate-900 w-3.5 h-3.5"
                  />
                  <span>Remember this device</span>
                </label>
              </div>
            )}

            {/* SIGNUP: Terms & Conditions Checkbox */}
            {mode === 'signup' && (
              <div className="flex items-start space-x-2 pt-1 text-xs">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded border-white/20 text-purple-600 focus:ring-0 bg-slate-900 w-3.5 h-3.5 shrink-0"
                />
                <label htmlFor="terms" className="text-slate-400 cursor-pointer select-none leading-relaxed">
                  I agree to the <span className="text-purple-400 font-semibold">Terms of Service</span> and CPCB hazardous e-waste compliance regulations.
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || googleLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-black text-sm tracking-wide shadow-[0_0_30px_rgba(147,51,234,0.4)] transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>{mode === 'signin' ? 'Authenticating...' : 'Creating Account...'}</span>
                </div>
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In to Portal' : 'Create My Account'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Switcher Link */}
          <div className="text-center pt-6 border-t border-white/10 text-xs text-slate-400 mt-6">
            {mode === 'signin' ? (
              <span>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="text-purple-400 hover:text-purple-300 font-bold hover:underline ml-1 cursor-pointer"
                >
                  Sign Up for Free
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="text-purple-400 hover:text-purple-300 font-bold hover:underline ml-1 cursor-pointer"
                >
                  Sign In Here
                </button>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-page-enter-3d">
          <div className="bg-slate-950 border border-purple-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-[0_0_60px_rgba(147,51,234,0.3)] relative">
            <div className="flex items-center space-x-3 text-white font-bold text-lg">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">Reset Your Password</h3>
                <p className="text-xs text-slate-400 font-light">Enter your email to receive recovery instructions</p>
              </div>
            </div>

            {forgotSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2.5">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                <span>Password reset link sent to {forgotEmail || 'your email'}! Please check your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Registered Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div className="flex space-x-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs hover:opacity-90"
                  >
                    Send Recovery Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="py-2.5 px-4 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
