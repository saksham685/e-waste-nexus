'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { soundEffects } from '@/lib/sound';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  ShieldCheck,
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Check,
  Sparkles,
  Award,
  Layers,
  Cpu,
  Truck,
  Building2,
  UserCheck,
  PlusCircle,
  LogIn,
  Key,
} from 'lucide-react';

interface SavedAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  isGoogle?: boolean;
}

interface AuthSplitScreenProps {
  initialMode?: 'signin' | 'signup';
}

export const AuthSplitScreen: React.FC<AuthSplitScreenProps> = ({ initialMode = 'signin' }) => {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [activeTab, setActiveTab] = useState<'accounts' | 'credentials'>('accounts');

  // Accounts state for Antigravity-style switcher
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);

  // Common Form States (Supports User ID or Email)
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Signup-specific states
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'individual' | 'partner' | 'recycler'>('individual');
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [selectedAccId, setSelectedAccId] = useState<string | null>(null);
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
    if (initialMode === 'signup') {
      setActiveTab('credentials');
    }
  }, [initialMode]);

  // Fetch available accounts from database and localStorage (Antigravity Style)
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setAccountsLoading(true);
        const res = await fetch('/api/auth?action=accounts');
        const data = await res.json();
        let dbAccounts: SavedAccount[] = data.accounts || [];

        // Check if there are local Google emails saved
        try {
          const localGmails = localStorage.getItem('nexus_google_saved_emails');
          if (localGmails) {
            const parsed: string[] = JSON.parse(localGmails);
            parsed.forEach((gEmail) => {
              if (!dbAccounts.some((a) => a.email.toLowerCase() === gEmail.toLowerCase())) {
                const namePart = gEmail.split('@')[0].replace(/[._-]/g, ' ');
                const formattedName = namePart
                  .split(' ')
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(' ');
                dbAccounts.unshift({
                  id: 'usr_g_' + Math.random().toString(36).substring(2, 7),
                  name: formattedName,
                  email: gEmail,
                  role: 'individual',
                  isGoogle: true,
                });
              }
            });
          }
        } catch {
          // Ignore
        }

        setSavedAccounts(dbAccounts);
      } catch (err) {
        console.error('Failed to load accounts', err);
      } finally {
        setAccountsLoading(false);
      }
    };

    fetchAccounts();
  }, []);

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
        setSuccessMsg(`Welcome, ${user.name}! Authenticated via Google.`);
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

  // Open Real Google OAuth Dialog (Popup Window)
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
      window.location.href = '/auth/google';
    } else {
      const checkPopupClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopupClosed);
          setGoogleLoading(false);
        }
      }, 1000);
    }
  };

  // Antigravity 1-Click Fast Account Sign-In
  const handleQuickAccountSignIn = async (acc: SavedAccount) => {
    soundEffects.playClick();
    setSelectedAccId(acc.id);
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // Authenticate directly with the chosen account
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'google',
          email: acc.email,
          name: acc.name,
          role: acc.role,
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        soundEffects.playSuccess();
        setSuccessMsg(`Welcome back, ${data.user.name}!`);
        setUser(data.user, data.token);
        voiceAssistant.speak(`Welcome back, ${data.user.name}. Opening your workspace.`);
        setTimeout(() => {
          window.location.href = getDestination();
        }, 350);
      } else {
        throw new Error(data.error || 'Authentication failed');
      }
    } catch (err: any) {
      soundEffects.playError();
      setErrorMsg(err.message || 'Could not sign in with this account. Try password.');
      setIsLoading(false);
      setSelectedAccId(null);
    }
  };

  // Preset Credentials Helper
  const fillPreset = (userType: 'admin' | 'partner' | 'recycler' | 'user') => {
    soundEffects.playClick();
    setActiveTab('credentials');
    if (userType === 'admin') {
      setIdentifier('admin@nexus.eco');
      setPassword('Admin@123');
    } else if (userType === 'partner') {
      setIdentifier('partner@nexus.eco');
      setPassword('Partner@123');
    } else if (userType === 'recycler') {
      setIdentifier('recycler@nexus.eco');
      setPassword('Recycler@123');
    } else {
      setIdentifier('user@nexus.eco');
      setPassword('User@123');
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playClick();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (mode === 'signup') {
      if (!name.trim()) {
        soundEffects.playError();
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (!signupEmail.trim() || !signupEmail.includes('@')) {
        soundEffects.playError();
        setErrorMsg('Please enter a valid email address.');
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
        setErrorMsg('Passwords do not match.');
        return;
      }
      if (!agreedToTerms) {
        soundEffects.playError();
        setErrorMsg('You must accept terms of service.');
        return;
      }
    } else {
      if (!identifier.trim()) {
        soundEffects.playError();
        setErrorMsg('Please enter your User ID or Email address.');
        return;
      }
      if (!password) {
        soundEffects.playError();
        setErrorMsg('Please enter your password.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'register',
            name: name.trim(),
            email: signupEmail.trim().toLowerCase(),
            password,
            role,
          }),
        });

        const data = await res.json();
        if (data.success && data.user) {
          soundEffects.playSuccess();
          setSuccessMsg(`Welcome, ${data.user.name}! Your account is saved in database.`);
          setUser(data.user, data.token);
          voiceAssistant.speak(`Account created successfully. Welcome, ${data.user.name}.`);
          setTimeout(() => {
            window.location.href = getDestination();
          }, 400);
        } else {
          soundEffects.playError();
          setErrorMsg(data.error || 'Registration failed');
          setIsLoading(false);
        }
      } else {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'login',
            email: identifier.trim(),
            password,
            rememberMe,
          }),
        });

        const data = await res.json();
        if (data.success && data.user) {
          soundEffects.playSuccess();
          setSuccessMsg(`Signed in as ${data.user.name}`);
          setUser(data.user, data.token);
          voiceAssistant.speak(`Authentication successful. Welcome, ${data.user.name}.`);
          setTimeout(() => {
            window.location.href = getDestination();
          }, 350);
        } else {
          soundEffects.playError();
          setErrorMsg(data.error || 'Invalid User ID or Password.');
          setIsLoading(false);
        }
      }
    } catch (err: any) {
      soundEffects.playError();
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
      setIsLoading(false);
    }
  };

  // Forgot password handler
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playClick();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      soundEffects.playError();
      return;
    }
    setForgotSuccess(true);
    soundEffects.playSuccess();
    setTimeout(() => {
      setForgotModalOpen(false);
      setForgotSuccess(false);
      setForgotEmail('');
    }, 2500);
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] text-slate-100 flex flex-col lg:flex-row overflow-x-hidden selection:bg-purple-500 selection:text-white">
      {/* =================================================================== */}
      {/* LEFT PANEL: 3D CYBER-HOLOGRAPHIC ECOSYSTEM VISUALIZER               */}
      {/* =================================================================== */}
      <div
        ref={leftPanelRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/80 border-b lg:border-b-0 lg:border-r border-white/10"
      >
        {/* Futuristic Glowing Grid Background */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.25) 0%, transparent 60%),
                             linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
            backgroundSize: '100% 100%, 40px 40px, 40px 40px',
          }}
        />

        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-purple-600/25 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Header / Brand */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1.5px] shadow-[0_0_20px_rgba(147,51,234,0.5)]">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Cpu className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="text-lg font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-purple-300 font-mono">
                E-WASTE NEXUS
              </span>
              <span className="block text-[10px] text-cyan-400 font-mono tracking-widest uppercase">
                Govt CPCB Gateway 2026
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Database Online</span>
          </div>
        </div>

        {/* Center: Interactive 3D Holographic Cyber Orb */}
        <div className="relative z-10 my-10 flex flex-col items-center justify-center">
          <div
            className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center transition-transform duration-200 ease-out"
            style={{
              transform: `perspective(1000px) rotateY(${mousePos.x * 25}deg) rotateX(${-mousePos.y * 25}deg)`,
            }}
          >
            {/* Outer Orbit Rings */}
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 border-dashed animate-spin-slow" />
            <div className="absolute inset-4 rounded-full border border-cyan-400/25 animate-reverse-spin" />
            <div className="absolute inset-10 rounded-full border border-white/10" />

            {/* Glowing Core */}
            <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[2px] shadow-[0_0_80px_rgba(147,51,234,0.6)] animate-pulse-glow flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-4">
                <ShieldCheck className="w-10 h-10 text-cyan-400 mb-1" />
                <span className="text-xs font-black text-white tracking-wider">CPCB SECURED</span>
                <span className="text-[9px] text-slate-400 font-mono">256-Bit Storage</span>
              </div>
            </div>

            {/* Floating 3D Micro-Chips */}
            <div
              className="absolute -top-3 left-4 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-purple-500/40 backdrop-blur-md shadow-lg flex items-center space-x-2"
              style={{ transform: `translateZ(40px) translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)` }}
            >
              <Award className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[11px] font-mono font-semibold text-white">EPR Certified</span>
            </div>

            <div
              className="absolute -bottom-3 right-4 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 backdrop-blur-md shadow-lg flex items-center space-x-2"
              style={{ transform: `translateZ(40px) translate(${-mousePos.x * 15}px, ${-mousePos.y * 15}px)` }}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px] font-mono font-semibold text-white">₹4.8 Cr+ Paid</span>
            </div>
          </div>

          <div className="text-center mt-6 max-w-sm">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              India’s Circular E-Waste Infrastructure
            </h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed font-light">
              AI-assisted manifest tracking, CPCB Form-6 compliance, and real-time weighbridge settlements.
            </p>
          </div>
        </div>

        {/* Bottom Metrics Bar */}
        <div className="relative z-10 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
            <div className="text-base sm:text-lg font-black text-white font-mono">1,420+ MT</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Processed</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
            <div className="text-base sm:text-lg font-black text-cyan-400 font-mono">99.8%</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Audit Pass</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
            <div className="text-base sm:text-lg font-black text-emerald-400 font-mono">0.00ms</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Latency</div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* RIGHT PANEL: AUTHENTICATION INTERFACE (ANTIGRAVITY ACCOUNTS + FORM) */}
      {/* =================================================================== */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-14 bg-slate-950 relative">
        {/* Subtle Background Glows */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md space-y-6 relative z-10">
          {/* Mode Pill Toggle (Sign In vs Sign Up) */}
          <div className="flex items-center justify-between">
            <div className="p-1 rounded-full bg-slate-900 border border-white/10 flex space-x-1">
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  mode === 'signin'
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  mode === 'signup'
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            <div className="flex items-center space-x-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CPCB Safe Gate</span>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {mode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-light">
              {mode === 'signin'
                ? 'Sign in with your Google session, User ID, or password'
                : 'Register and save your credentials in certified database'}
            </p>
          </div>

          {/* Feedback Banners */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SIGN IN TABS: Active Accounts (Antigravity Style) vs User ID / Password */}
          {mode === 'signin' && (
            <div className="flex border-b border-white/10 space-x-6 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setActiveTab('accounts');
                }}
                className={`pb-2.5 border-b-2 flex items-center space-x-2 transition-colors ${
                  activeTab === 'accounts'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Google &amp; Active Accounts</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setActiveTab('credentials');
                }}
                className={`pb-2.5 border-b-2 flex items-center space-x-2 transition-colors ${
                  activeTab === 'credentials'
                    ? 'border-purple-400 text-purple-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>User ID &amp; Password</span>
              </button>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 1: ANTIGRAVITY ACTIVE ACCOUNTS & GMAIL SELECTOR                 */}
          {/* =================================================================== */}
          {mode === 'signin' && activeTab === 'accounts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Select an account to sign in:</span>
                <span className="text-[10px] text-cyan-400 font-mono">1-Click Fast Access</span>
              </div>

              {/* List of active accounts in database/browser */}
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {savedAccounts.slice(0, 4).map((acc) => {
                  const isSigningInThis = selectedAccId === acc.id && isLoading;
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      disabled={isLoading || googleLoading}
                      onClick={() => handleQuickAccountSignIn(acc)}
                      className="w-full p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-white/10 hover:border-cyan-400/50 transition-all flex items-center justify-between text-left group cursor-pointer disabled:opacity-50"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1.5px] shrink-0">
                          <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center font-bold text-white text-xs">
                            {acc.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                            {acc.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono truncate">{acc.email}</div>
                          <div className="text-[9px] text-emerald-400 font-mono uppercase tracking-wider">
                            Role: {acc.role}
                          </div>
                        </div>
                      </div>

                      {isSigningInThis ? (
                        <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin shrink-0 ml-2" />
                      ) : (
                        <div className="flex items-center space-x-1.5 text-[11px] text-cyan-400 font-semibold shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform">
                          <span>Sign In</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Real Google Account OAuth Button (Opens Popup) */}
              <button
                type="button"
                onClick={handleOpenGoogleModal}
                disabled={googleLoading || isLoading}
                className="w-full py-3 px-4 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm transition-all flex items-center justify-center space-x-3 shadow-md cursor-pointer disabled:opacity-50"
              >
                {googleLoading ? (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
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
                <span>{googleLoading ? 'Connecting to Google...' : 'Use Another Google Account'}</span>
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('credentials')}
                  className="text-xs text-purple-400 hover:text-purple-300 font-medium hover:underline"
                >
                  Or enter User ID and Password instead →
                </button>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 2 / SIGNUP: USER ID & PASSWORD FORM                             */}
          {/* =================================================================== */}
          {(mode === 'signup' || activeTab === 'credentials') && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Quick Preset Selector for Easy Testing */}
              {mode === 'signin' && (
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1.5">
                  <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                    <span>Quick Fill Demo Credentials:</span>
                    <span className="text-purple-400">1-Click</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    <button
                      type="button"
                      onClick={() => fillPreset('user')}
                      className="py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-200 font-semibold transition-colors"
                    >
                      👤 Citizen
                    </button>
                    <button
                      type="button"
                      onClick={() => fillPreset('admin')}
                      className="py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] text-amber-300 font-semibold transition-colors"
                    >
                      👑 Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => fillPreset('partner')}
                      className="py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] text-cyan-300 font-semibold transition-colors"
                    >
                      🚚 Logistics
                    </button>
                    <button
                      type="button"
                      onClick={() => fillPreset('recycler')}
                      className="py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] text-emerald-300 font-semibold transition-colors"
                    >
                      ♻️ Recycler
                    </button>
                  </div>
                </div>
              )}

              {/* SIGNUP: Role Selection Cards */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Account Category:
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
                          : 'border-white/10 bg-slate-900/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      <UserIcon className="w-3.5 h-3.5 mb-1 text-purple-400" />
                      <div className="font-bold text-[11px]">Citizen</div>
                      <div className="text-[9px] text-slate-400">Recycle</div>
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
                          : 'border-white/10 bg-slate-900/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5 mb-1 text-cyan-400" />
                      <div className="font-bold text-[11px]">Logistics</div>
                      <div className="text-[9px] text-slate-400">Fleet</div>
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
                          : 'border-white/10 bg-slate-900/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5 mb-1 text-emerald-400" />
                      <div className="font-bold text-[11px]">Recycler</div>
                      <div className="text-[9px] text-slate-400">Smelter</div>
                    </button>
                  </div>
                </div>
              )}

              {/* SIGNUP: Full Name Input */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Legal Name <span className="text-purple-400">*</span>
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

              {/* SIGNUP: Email Address */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address <span className="text-purple-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      className="w-full bg-slate-900/80 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 font-mono transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* SIGNIN: User ID or Email Input */}
              {mode === 'signin' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    User ID or Email Address <span className="text-purple-400">*</span>
                  </label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. sakshamdadwal543@gmail.com, usr_admin_01, or name"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                      className="w-full bg-slate-900/80 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 font-mono transition-colors"
                    />
                  </div>
                </div>
              )}

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

              {/* SIGNUP: Password Strength Indicator */}
              {mode === 'signup' && password.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Strength:</span>
                    <span className={`font-bold ${strength.text}`}>{strength.label}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden flex">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${(strengthScore / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* SIGNUP: Confirm Password */}
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

              {/* Remember Me Checkbox */}
              {mode === 'signin' && (
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center space-x-2 text-slate-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-white/20 text-purple-600 focus:ring-0 bg-slate-900 w-3.5 h-3.5"
                    />
                    <span>Remember this device (Persist Session)</span>
                  </label>
                </div>
              )}

              {/* Terms Checkbox */}
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
                    <span>{mode === 'signin' ? 'Authenticating & Verifying...' : 'Saving to Database...'}</span>
                  </div>
                ) : (
                  <>
                    <span>{mode === 'signin' ? 'Sign In with Password' : 'Create & Save Account'}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>
          )}

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
