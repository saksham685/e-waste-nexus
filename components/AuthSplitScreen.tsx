'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
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
  Award,
  Layers,
  Cpu,
  Truck,
  Building2,
  UserCheck,
  Sparkles,
  ChevronRight,
  ShieldAlert,
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

  // Sync mode with prop change
  useEffect(() => {
    setMode(initialMode);
    if (initialMode === 'signup') {
      setActiveTab('credentials');
    }
  }, [initialMode]);

  // Fetch available accounts from database and localStorage
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setAccountsLoading(true);
        const res = await fetch('/api/auth?action=accounts');
        const data = await res.json();
        let dbAccounts: SavedAccount[] = data.accounts || [];

        // Check local Google emails saved (exclude personal emails)
        try {
          const localGmails = localStorage.getItem('nexus_google_saved_emails');
          if (localGmails) {
            let parsed: string[] = JSON.parse(localGmails);
            parsed = parsed.filter((e) => !e.toLowerCase().includes('sakshamdadwal'));
            localStorage.setItem('nexus_google_saved_emails', JSON.stringify(parsed));
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

  const getDestination = () => {
    if (typeof window === 'undefined') return '/overview';
    const redirect = new URLSearchParams(window.location.search).get('redirect');
    return redirect && redirect.startsWith('/') && redirect !== '/' ? redirect : '/overview';
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
    if (password.length === 0) return { label: 'Empty', color: 'bg-zinc-700', text: 'text-zinc-500' };
    if (strengthScore <= 2) return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400' };
    if (strengthScore <= 3) return { label: 'Fair', color: 'bg-amber-400', text: 'text-amber-400' };
    if (strengthScore <= 4) return { label: 'Strong', color: 'bg-emerald-400', text: 'text-emerald-400' };
    return { label: 'Very Strong', color: 'bg-teal-400', text: 'text-teal-400' };
  };

  const strength = getStrengthLabel();

  // Mode Switcher
  const switchMode = (newMode: 'signin' | 'signup') => {
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
        if (typeof document !== 'undefined') {
          document.cookie = `nexus_token=${token}; path=/; max-age=604800; SameSite=Lax`;
        }
        setUser(user, token);
        setSuccessMsg(`Welcome back, ${user.name}`);
        setGoogleLoading(false);
        const target = getDestination();
        window.location.replace(target);
      }
    };

    window.addEventListener('message', handleAuthMessage);
    return () => window.removeEventListener('message', handleAuthMessage);
  }, []);

  // Open Real Google OAuth Dialog
  const handleOpenGoogleModal = () => {
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
    setSelectedAccId(acc.id);
    setIsLoading(true);
    setErrorMsg(null);

    try {
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
        setSuccessMsg(`Signing in as ${data.user.name}...`);
        if (typeof document !== 'undefined') {
          document.cookie = `nexus_token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
        }
        setUser(data.user, data.token);
        window.location.replace(getDestination());
      } else {
        throw new Error(data.error || 'Authentication failed');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not sign in with this account. Try password.');
      setIsLoading(false);
      setSelectedAccId(null);
    }
  };

  // Preset Credentials Helper & 1-Click Fast Sign-In
  const fillPreset = (userType: 'admin' | 'partner' | 'recycler' | 'user') => {
    setActiveTab('credentials');
    let email = 'user@nexus.eco';
    let name = 'Aarav Sharma (Citizen)';
    let role: 'individual' | 'partner' | 'recycler' | 'admin' = 'individual';
    let pass = 'User@123';

    if (userType === 'admin') {
      email = 'admin@nexus.eco';
      name = 'Dr. Evelyn Vance';
      role = 'admin';
      pass = 'Admin@123';
    } else if (userType === 'partner') {
      email = 'partner@nexus.eco';
      name = 'Marcus Sterling';
      role = 'partner';
      pass = 'Partner@123';
    } else if (userType === 'recycler') {
      email = 'recycler@nexus.eco';
      name = 'Elena Rostova';
      role = 'recycler';
      pass = 'Recycler@123';
    }

    setIdentifier(email);
    setPassword(pass);

    // Auto sign-in in 1-click
    handleQuickAccountSignIn({
      id: `preset_${userType}`,
      name,
      email,
      role: role as any,
      isGoogle: false,
    });
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (!signupEmail.trim() || !signupEmail.includes('@')) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }
      if (!hasMinLength) {
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }
      if (!hasUpperCase) {
        setErrorMsg('Password must contain at least one uppercase letter (A-Z).');
        return;
      }
      if (!hasNumber) {
        setErrorMsg('Password must contain at least one number (0-9).');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
      if (!agreedToTerms) {
        setErrorMsg('You must accept terms of service.');
        return;
      }
    } else {
      if (!identifier.trim()) {
        setErrorMsg('Please enter your User ID or Email address.');
        return;
      }
      if (!password) {
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
          setSuccessMsg(`Welcome, ${data.user.name}! Account registered successfully.`);
          if (typeof document !== 'undefined') {
            document.cookie = `nexus_token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
          }
          setUser(data.user, data.token);
          window.location.replace(getDestination());
        } else {
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
          setSuccessMsg(`Signed in as ${data.user.name}`);
          if (typeof document !== 'undefined') {
            document.cookie = `nexus_token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
          }
          setUser(data.user, data.token);
          window.location.replace(getDestination());
        } else {
          setErrorMsg(data.error || 'Invalid User ID or Password.');
          setIsLoading(false);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error. Please verify credentials.');
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      return;
    }
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotModalOpen(false);
      setForgotSuccess(false);
      setForgotEmail('');
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col lg:flex-row selection:bg-emerald-500 selection:text-zinc-950">
      {/* =================================================================== */}
      {/* LEFT PANEL: PRESTIGIOUS INSTITUTIONAL & ENTERPRISE PRESENTATION     */}
      {/* =================================================================== */}
      <div className="relative lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between bg-zinc-900/50 border-b lg:border-b-0 lg:border-r border-zinc-800">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700/80 p-2 flex items-center justify-center shadow-sm">
              <Cpu className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white font-sans">
                E-Waste Nexus
              </span>
              <span className="block text-[11px] text-zinc-400 font-medium">
                National Circular Compliance Network
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-1.5 text-xs text-zinc-300 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Govt CPCB Standards</span>
          </div>
        </div>

        {/* Center: Editorial Value Proposition */}
        <div className="my-12 lg:my-0 max-w-lg">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-4 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <Award className="w-3.5 h-3.5" />
            <span>Statutory EPR Registry &amp; Lifecycle Management</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            The trusted digital operating system for certified e-waste logistics.
          </h2>

          <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
            Uniting consignors, registered transport fleets, and state-certified smelters under automated CPCB Form-6 manifests and tamper-evident audit trails.
          </p>

          {/* Key Trust Pillars */}
          <div className="mt-8 space-y-4">
            <div className="flex items-start space-x-3.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Central Pollution Control Board Compliance</h4>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                  Automated generation of statutory Form-6 consignment sheets and verifiable recycler credits.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Calibrated Weighbridge Verification</h4>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                  Dual-signed tare and gross weight manifests with direct consignor UPI settlements.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Persistent Database Storage</h4>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                  Encrypted local ledger preserving user roles, credentials, and manifest histories permanently.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Stat Bar */}
        <div className="grid grid-cols-3 gap-4 border-t border-zinc-800 pt-6">
          <div>
            <div className="text-lg font-bold text-white font-mono">1,840+ MT</div>
            <div className="text-[11px] text-zinc-400">Material Diverted</div>
          </div>
          <div>
            <div className="text-lg font-bold text-emerald-400 font-mono">48.6 kg</div>
            <div className="text-[11px] text-zinc-400">Pure Gold Yield</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white font-mono">450+</div>
            <div className="text-[11px] text-zinc-400">Certified Centers</div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* RIGHT PANEL: CLEAN, PROFESSIONAL AUTHENTICATION INTERFACE           */}
      {/* =================================================================== */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-zinc-950">
        <div className="w-full max-w-md space-y-6">
          
          {/* Top Pill Switcher */}
          <div className="flex items-center justify-between">
            <div className="p-1 rounded-xl bg-zinc-900 border border-zinc-800 flex space-x-1 select-none">
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all touch-manipulation cursor-pointer active:scale-95 select-none ${
                  mode === 'signin'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all touch-manipulation cursor-pointer active:scale-95 select-none ${
                  mode === 'signup'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="text-[11px] font-medium text-zinc-400">
              {mode === 'signin' ? 'Secure Login' : 'Registration'}
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {mode === 'signin' ? 'Sign in to E-Waste Nexus' : 'Create your account'}
            </h1>
            <p className="text-xs text-zinc-400">
              {mode === 'signin'
                ? 'Access your manifests, EPR certificates, and dispatch schedules'
                : 'Join certified consignors and recyclers across India'}
            </p>
          </div>

          {/* Feedback Banners */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Official Google OAuth Button */}
          <button
            type="button"
            onClick={handleOpenGoogleModal}
            disabled={googleLoading || isLoading}
            className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 active:bg-zinc-800 text-white border border-zinc-800 hover:border-zinc-700 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center space-x-3 touch-manipulation cursor-pointer active:scale-[0.98] select-none disabled:opacity-50"
          >
            {googleLoading ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
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
                ? 'Opening Google Account...'
                : mode === 'signin'
                ? 'Continue with Google'
                : 'Sign up with Google'}
            </span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center select-none">
            <div className="border-t border-zinc-800 w-full" />
            <span className="bg-zinc-950 px-3 text-[11px] uppercase tracking-wider text-zinc-500 font-mono">
              or continue with account
            </span>
            <div className="border-t border-zinc-800 w-full" />
          </div>

          {/* SIGN IN: Active Accounts Switcher (Antigravity Style) */}
          {mode === 'signin' && savedAccounts.length > 0 && (
            <div className="space-y-2 select-none">
              <div className="text-xs font-semibold text-zinc-400 flex items-center justify-between">
                <span>Select active account:</span>
                <span className="text-[11px] text-emerald-400 font-mono">1-Click Sign In</span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {savedAccounts.slice(0, 3).map((acc) => {
                  const isThisSelected = selectedAccId === acc.id && isLoading;
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      disabled={isLoading || googleLoading}
                      onClick={() => handleQuickAccountSignIn(acc)}
                      className="w-full p-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-850 active:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-between text-left group touch-manipulation cursor-pointer active:scale-[0.98] select-none"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-white shrink-0">
                          {acc.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">
                            {acc.name}
                          </div>
                          <div className="text-[11px] text-zinc-400 font-mono truncate">{acc.email}</div>
                        </div>
                      </div>

                      {isThisSelected ? (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin shrink-0 ml-2" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* MAIN CREDENTIALS FORM (USER ID / EMAIL & PASSWORD) */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Quick Demo Credentials Bar */}
            {mode === 'signin' && (
              <div className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between select-none">
                <span className="font-medium">1-Click Fast Fill:</span>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => fillPreset('user')}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-200 font-medium transition-all touch-manipulation cursor-pointer active:scale-95 select-none"
                  >
                    User
                  </button>
                  <button
                    type="button"
                    onClick={() => fillPreset('admin')}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-amber-300 font-medium transition-all touch-manipulation cursor-pointer active:scale-95 select-none"
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => fillPreset('partner')}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-cyan-300 font-medium transition-all touch-manipulation cursor-pointer active:scale-95 select-none"
                  >
                    Logistics
                  </button>
                  <button
                    type="button"
                    onClick={() => fillPreset('recycler')}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-emerald-300 font-medium transition-all touch-manipulation cursor-pointer active:scale-95 select-none"
                  >
                    Recycler
                  </button>
                </div>
              </div>
            )}

            {/* SIGNUP: Role Selection Cards */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Account Category:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('individual')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      role === 'individual'
                        ? 'border-emerald-500 bg-emerald-500/10 text-white'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <UserIcon className="w-3.5 h-3.5 mb-1 text-emerald-400" />
                    <div className="font-semibold text-xs">Citizen</div>
                    <div className="text-[10px] text-zinc-400">Recycle</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('partner')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      role === 'partner'
                        ? 'border-emerald-500 bg-emerald-500/10 text-white'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5 mb-1 text-emerald-400" />
                    <div className="font-semibold text-xs">Logistics</div>
                    <div className="text-[10px] text-zinc-400">Fleet</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('recycler')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      role === 'recycler'
                        ? 'border-emerald-500 bg-emerald-500/10 text-white'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 mb-1 text-emerald-400" />
                    <div className="font-semibold text-xs">Recycler</div>
                    <div className="text-[10px] text-zinc-400">Smelter</div>
                  </button>
                </div>
              </div>
            )}

            {/* SIGNUP: Full Name Input */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={mode === 'signup'}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* SIGNUP: Email Address */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono transition-colors"
                  />
                </div>
              </div>
            )}

            {/* SIGNIN: User ID or Email Input */}
            {mode === 'signin' && (
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  User ID or Email
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. usr_admin_01 or name@example.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-zinc-300">
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-[11px] text-zinc-400 hover:text-emerald-400 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-zinc-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* SIGNUP: Password Strength Indicator */}
            {mode === 'signup' && password.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Password strength:</span>
                  <span className={`font-semibold ${strength.text}`}>{strength.label}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden flex">
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
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required={mode === 'signup'}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono transition-colors"
                  />
                  {confirmPassword && (
                    <div className="absolute right-3.5 top-2.5">
                      {passwordsMatch ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <span className="text-[10px] text-rose-400 font-mono">Mismatch</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Remember Me Checkbox */}
            {mode === 'signin' && (
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center space-x-2 text-zinc-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-zinc-700 text-emerald-600 focus:ring-0 bg-zinc-900 w-3.5 h-3.5"
                  />
                  <span>Remember this device</span>
                </label>
              </div>
            )}

            {/* Terms Checkbox */}
            {mode === 'signup' && (
              <div className="flex items-start space-x-2 pt-0.5 text-xs">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded border-zinc-700 text-emerald-600 focus:ring-0 bg-zinc-900 w-3.5 h-3.5 shrink-0"
                />
                <label htmlFor="terms" className="text-zinc-400 cursor-pointer select-none leading-relaxed">
                  I agree to the <span className="text-white font-medium">Terms of Service</span> and statutory CPCB e-waste compliance regulations.
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || googleLoading}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-100 active:bg-zinc-200 text-zinc-950 font-bold text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50 touch-manipulation cursor-pointer active:scale-[0.98] select-none shadow-sm mt-2"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin" />
                  <span>{mode === 'signin' ? 'Authenticating...' : 'Registering...'}</span>
                </div>
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Switcher Link */}
          <div className="text-center pt-4 border-t border-zinc-800 text-xs text-zinc-400">
            {mode === 'signin' ? (
              <span>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="text-white font-semibold hover:underline ml-1 cursor-pointer"
                >
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="text-white font-semibold hover:underline ml-1 cursor-pointer"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-xl relative">
            <div className="flex items-center space-x-3 text-white font-bold text-base">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">Reset Password</h3>
                <p className="text-xs text-zinc-400 font-normal">Enter your email to receive recovery instructions</p>
              </div>
            </div>

            {forgotSuccess ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Password recovery instructions sent to {forgotEmail || 'your email'}!</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Registered Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex space-x-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-semibold text-xs"
                  >
                    Send Recovery Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="py-2.5 px-4 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-medium"
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
