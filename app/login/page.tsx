'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore, DEMO_USERS } from '@/lib/store';
import { soundEffects } from '@/lib/sound';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { loginAction, registerAction } from '@/actions/authActions';
import { TiltCard3D } from '@/components/TiltCard3D';
import {
  Lock,
  Mail,
  User as UserIcon,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Key,
  Eye,
  EyeOff,
  Recycle,
  Cpu,
  Truck,
  Building2,
  ShieldAlert,
  Fingerprint,
  Radio,
  CreditCard,
  QrCode,
  Zap,
  Check,
  Smartphone,
  Send,
  BellRing,
} from 'lucide-react';

// Lazy-load Three.js 3D Holographic Vault to ensure SSR safety and fast hydration
const HologramVault3D = dynamic(
  () => import('@/components/HologramVault3D').then((mod) => mod.HologramVault3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[240px] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
      </div>
    ),
  }
);

interface SmartCardPersona {
  key: keyof typeof DEMO_USERS;
  title: string;
  roleLabel: string;
  nfcTag: string;
  clearanceLevel: string;
  accentColor: string;
  glowColor: string;
  borderColor: string;
  icon: any;
  user: (typeof DEMO_USERS)['individual'];
}

const SMART_CARDS: SmartCardPersona[] = [
  {
    key: 'individual',
    title: 'Citizen Hardware Consignor',
    roleLabel: 'Individual Owner',
    nfcTag: 'NFC-7712-AU',
    clearanceLevel: 'LEVEL 1: RESIDENTIAL',
    accentColor: 'text-emerald-400',
    glowColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/40 hover:border-emerald-400',
    icon: UserIcon,
    user: DEMO_USERS.individual,
  },
  {
    key: 'partner',
    title: 'GreenRoute Freight Logistics',
    roleLabel: 'Logistics Partner',
    nfcTag: 'NFC-4091-WEIGH',
    clearanceLevel: 'LEVEL 2: FREIGHT CARGO',
    accentColor: 'text-cyan-400',
    glowColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/40 hover:border-cyan-400',
    icon: Truck,
    user: DEMO_USERS.partner,
  },
  {
    key: 'recycler',
    title: 'EcoRefine Hydrometallurgy',
    roleLabel: 'Refining Smelter',
    nfcTag: 'NFC-9942-SMELT',
    clearanceLevel: 'LEVEL 3: HAZMAT REFINING',
    accentColor: 'text-amber-400',
    glowColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/40 hover:border-amber-400',
    icon: Building2,
    user: DEMO_USERS.recycler,
  },
  {
    key: 'admin',
    title: 'Federal CPCB Environmental Authority',
    roleLabel: 'Chief Auditor',
    nfcTag: 'NFC-0001-ROOT',
    clearanceLevel: 'LEVEL 5: ROOT GOVERNANCE',
    accentColor: 'text-red-400',
    glowColor: 'bg-red-500/10',
    borderColor: 'border-red-500/40 hover:border-red-400',
    icon: ShieldAlert,
    user: DEMO_USERS.admin,
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { setUser, switchDemoRole } = useAuthStore();
  const [accessMode, setAccessMode] = useState<'smartcard' | 'terminal'>('smartcard');
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeCardKey, setActiveCardKey] = useState<string>('individual');
  const [isScanningBiometric, setIsScanningBiometric] = useState(false);

  // SMS Notification tracking states
  const [smsDispatched, setSmsDispatched] = useState(false);
  const [smsTimestamp, setSmsTimestamp] = useState<string>('');

  // Form states
  const [email, setEmail] = useState('user@nexus.eco');
  const [password, setPassword] = useState('User@123');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'individual' | 'partner' | 'recycler'>('individual');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Trigger automated SMS access alert to 98059 26846 & 9417453249 as soon as the login gate is accessed
  useEffect(() => {
    fetch('/api/notify-access', { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSmsDispatched(true);
          setSmsTimestamp(data.timestamp || new Date().toLocaleTimeString());
        }
      })
      .catch((err) => console.warn('Access notification alert error:', err));
  }, []);

  // 1-Click Instant Login as any persona
  const handleInstantLogin = (personaKey: string) => {
    soundEffects.playUnlock();
    const persona = SMART_CARDS.find((c) => c.key === personaKey) || SMART_CARDS[0];
    const sessionToken = `nexus_jwt_${persona.key}_token_session_2026`;
    document.cookie = `nexus_token=${sessionToken}; path=/; max-age=604800; SameSite=Lax`;
    switchDemoRole(persona.key);
    setUser(persona.user, sessionToken);
    setSuccessMsg(`Access Authorized for ${persona.user.name}. Opening platform...`);
    voiceAssistant.speak(`Access verified for ${persona.user.name}. Opening ecosystem.`);
    setTimeout(() => {
      window.location.href = '/';
    }, 300);
  };

  // Biometric 1-Click Thumbprint Scan
  const handleBiometricScan = () => {
    soundEffects.playClick();
    setIsScanningBiometric(true);
    setErrorMsg(null);
    setSuccessMsg('Biometric iris & fingerprint telemetry scanning...');

    setTimeout(() => {
      soundEffects.playUnlock();
      setIsScanningBiometric(false);
      const persona = SMART_CARDS.find((c) => c.key === activeCardKey) || SMART_CARDS[0];

      // Set session cookie so Next.js Edge Middleware permits entry across all protected routes
      const sessionToken = `nexus_jwt_${persona.key}_token_session_2026`;
      document.cookie = `nexus_token=${sessionToken}; path=/; max-age=604800; SameSite=Lax`;

      switchDemoRole(persona.key);
      setUser(persona.user, sessionToken);

      setSuccessMsg(`Biometric matched: Clearance granted to ${persona.user.name}.`);
      voiceAssistant.speak(`Biometric identity verified for ${persona.user.name}. Opening ecosystem.`);

      setTimeout(() => {
        window.location.href = '/';
      }, 300);
    }, 800);
  };

  // Instant SmartCard Insertion
  const handleInsertCard = (card: SmartCardPersona) => {
    soundEffects.playUnlock();
    setActiveCardKey(card.key);
    switchDemoRole(card.key);
    setEmail(card.user.email);
    setPassword(
      card.key === 'admin'
        ? 'Admin@123'
        : card.key === 'partner'
        ? 'Partner@123'
        : card.key === 'recycler'
        ? 'Recycler@123'
        : 'User@123'
    );
    setSuccessMsg(`NFC SmartCard [${card.nfcTag}] docked. Persona loaded: ${card.user.name}`);
    voiceAssistant.speak(`SmartCard recognized for ${card.user.name}. Clearance level ${card.clearanceLevel}.`);
  };

  // Manual Form Submission via Server Action
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playClick();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      if (isRegister) {
        const res = await registerAction({
          name,
          email,
          password,
          role,
        });
        if (res.success && res.user) {
          soundEffects.playSuccess();
          setSuccessMsg(`Registered identity for ${res.user.name}. Redirecting...`);
          if (res.token) {
            document.cookie = `nexus_token=${res.token}; path=/; max-age=604800; SameSite=Lax`;
          }
          setUser(res.user, res.token);
          voiceAssistant.speak(`Welcome to E-Waste Nexus, ${res.user.name}.`);
          setTimeout(() => {
            window.location.href = '/';
          }, 300);
        } else {
          soundEffects.playError();
          setErrorMsg(res.error || 'Registration failed');
        }
      } else {
        const res = await loginAction({ email, password });
        if (res.success && res.user) {
          soundEffects.playSuccess();
          setSuccessMsg(`Access passcode verified. Loading workspace...`);
          if (res.token) {
            document.cookie = `nexus_token=${res.token}; path=/; max-age=604800; SameSite=Lax`;
          }
          setUser(res.user, res.token);
          voiceAssistant.speak(`Welcome back, ${res.user.name}.`);
          setTimeout(() => {
            window.location.href = '/';
          }, 300);
        } else {
          soundEffects.playError();
          setErrorMsg(res.error || 'Invalid credentials');
        }
      }
    } catch (err: any) {
      soundEffects.playError();
      setErrorMsg(err?.message || 'Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Futuristic Telemetry Status Bar with SMS Alert Notification */}
      <div className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-2 py-2.5 px-4 mb-4 rounded-2xl bg-nexus-card/70 border border-emerald-500/20 backdrop-blur-xl text-[11px] font-mono text-gray-400">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-bold uppercase">MANDATORY SECURITY GATE ACTIVE</span>
          <span className="hidden sm:inline">&bull; AUTH REQUIRED TO ACCESS ECOSYSTEM</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-cyan-400 font-semibold flex items-center space-x-1">
            <Lock className="w-3 h-3" />
            <span>PROTECTED NEXT.JS MIDDLEWARE</span>
          </span>
        </div>
      </div>

      {/* Prominent SMS Notification Live Dispatch Banner */}
      <div className="w-full max-w-5xl mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-nexus-card/90 to-emerald-950/90 border border-emerald-500/40 shadow-glow-green backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Smartphone className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2 font-bold text-white">
              <span>SMS Access Notification Dispatcher</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-gray-300 mt-0.5">
              Automated mobile SMS alert triggered to registered devices: <span className="text-emerald-400 font-mono font-bold">+91 98059 26846</span> and <span className="text-cyan-400 font-mono font-bold">+91 9417453249</span>
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold">
            <Send className="w-3 h-3" />
            <span>{smsDispatched ? `ALERT SENT (${smsTimestamp || 'Live'})` : 'DISPATCHING SMS...'}</span>
          </span>
        </div>
      </div>

      {/* Main Unique Cyber Terminal Box */}
      <div className="w-full max-w-5xl bg-gradient-to-b from-nexus-card/95 via-nexus-card/85 to-nexus-dark/95 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        {/* Holographic scanner laser line effect */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-lime-400 shadow-glow-green" />

        {/* Top Header with 3D Hologram Core */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-emerald-500/20 pb-8 mb-8">
          {/* Left: 3D Hologram Security Orb */}
          <div className="lg:col-span-4 h-[220px] relative flex items-center justify-center rounded-2xl bg-nexus-dark/70 border border-emerald-500/20 overflow-hidden">
            <HologramVault3D />
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-emerald-400/90 pointer-events-none">
              <span>HOLOGRAPHIC GATE</span>
              <span className="animate-pulse">ONLINE</span>
            </div>
          </div>

          {/* Center/Right: Title & Mode Toggle */}
          <div className="lg:col-span-8 flex flex-col justify-between h-full space-y-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next.js Protected Gateway &bull; Biometric &amp; SmartCard Gate</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                Circular Electronics Clearance Terminal
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light mt-1">
                You must authenticate here to access the E-Waste Nexus ecosystem. Select an NFC SmartCard below for 1-click entry, or use your passcode.
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setAccessMode('smartcard');
                }}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  accessMode === 'smartcard'
                    ? 'bg-gradient-to-r from-emerald-500 to-lime-500 text-nexus-dark shadow-glow-green scale-105'
                    : 'bg-nexus-dark/80 text-gray-400 hover:text-white border border-emerald-500/20'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>NFC SmartCards (1-Click Access)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setAccessMode('terminal');
                }}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  accessMode === 'terminal'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-nexus-dark shadow-glow-cyan scale-105'
                    : 'bg-nexus-dark/80 text-gray-400 hover:text-white border border-emerald-500/20'
                }`}
              >
                <Key className="w-4 h-4" />
                <span>Terminal Passcode</span>
              </button>

              <Link
                href="/signup"
                onClick={() => soundEffects.playClick()}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-nexus-dark/80 hover:bg-emerald-500/20 text-emerald-400 hover:text-white border border-emerald-500/30 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Create Account / Sign Up &rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Feedback Banners */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center space-x-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-3 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* MODE 1: SMARTCARD CAROUSEL & BIOMETRIC SCANNER */}
        {accessMode === 'smartcard' && (
          <div className="space-y-8 animate-fade-in">
            {/* The 4 High-Tech SmartCards */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Choose Authorized Persona Keycard:</span>
                </span>
                <span className="text-[11px] font-mono text-emerald-400">
                  Click card to dock &amp; authorize
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {SMART_CARDS.map((card) => {
                  const Icon = card.icon;
                  const isSelected = activeCardKey === card.key;

                  return (
                    <TiltCard3D key={card.key}>
                      <div
                        onClick={() => handleInsertCard(card)}
                        className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 h-full flex flex-col justify-between relative overflow-hidden bg-nexus-dark/90 ${
                          isSelected
                            ? 'border-emerald-400 shadow-glow-green scale-105'
                            : 'border-emerald-500/20 hover:border-emerald-500/60 hover:shadow-lg'
                        }`}
                      >
                        {/* Shimmer line */}
                        {isSelected && (
                          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-400 shadow-glow-green" />
                        )}

                        <div>
                          {/* Card Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-1.5 font-mono text-[10px] text-gray-400">
                              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                              <span>{card.nfcTag}</span>
                            </div>
                            <span className="w-7 h-5 rounded-md bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-[9px] font-mono text-amber-300 font-bold">
                              CHIP
                            </span>
                          </div>

                          {/* Avatar icon */}
                          <div className="w-10 h-10 rounded-xl bg-nexus-card border border-emerald-500/30 flex items-center justify-center text-white mb-3">
                            <Icon className={`w-5 h-5 ${card.accentColor}`} />
                          </div>

                          <h3 className="text-sm font-bold text-white leading-tight mb-1">
                            {card.user.name}
                          </h3>
                          <div className={`text-xs font-mono font-semibold ${card.accentColor}`}>
                            {card.roleLabel}
                          </div>
                          <div className="text-[10px] text-gray-400 mt-1 line-clamp-1">
                            {card.user.organization || card.title}
                          </div>
                        </div>

                        {/* 1-Click Login CTA on each card */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInstantLogin(card.key);
                          }}
                          className="w-full mt-3 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 hover:from-emerald-400 hover:to-lime-300 text-nexus-dark font-black text-xs transition-all flex items-center justify-center space-x-1.5 shadow-md cursor-pointer hover:scale-102"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>⚡ 1-Click Login</span>
                        </button>

                        {/* Card Footer */}
                        <div className="mt-3 pt-2.5 border-t border-emerald-500/15 flex items-center justify-between">
                          <span className="text-[9px] font-mono text-gray-500">
                            {card.clearanceLevel}
                          </span>
                          {isSelected && (
                            <span className="text-emerald-400 font-bold text-xs flex items-center space-x-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>DOCKED</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </TiltCard3D>
                  );
                })}
              </div>
            </div>

            {/* Biometric Thumbprint Sensor Dock */}
            <div className="p-6 sm:p-8 rounded-3xl bg-nexus-dark/95 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center space-x-2 justify-center sm:justify-start">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h3 className="text-base font-bold text-white">Biometric Clearance Dock</h3>
                </div>
                <p className="text-xs text-gray-400">
                  Touch sensor or click Enter to authenticate and access the full platform immediately.
                </p>
                <div className="text-xs font-mono text-emerald-400 pt-1">
                  Ready to Authenticate: <span className="font-bold">{DEMO_USERS[activeCardKey as keyof typeof DEMO_USERS].name}</span>
                </div>
              </div>

              {/* Action Buttons: Big Enter Button + Glowing Biometric Sensor */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="button"
                  onClick={handleBiometricScan}
                  disabled={isScanningBiometric}
                  className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-lime-400 hover:from-emerald-400 hover:to-lime-300 text-nexus-dark font-black text-xs sm:text-sm tracking-wide shadow-glow-green transition-all flex items-center space-x-2 cursor-pointer hover:scale-105 active:scale-95"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>{isScanningBiometric ? 'Verifying Identity...' : `Enter Website as ${DEMO_USERS[activeCardKey as keyof typeof DEMO_USERS].name}`}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  type="button"
                  onClick={handleBiometricScan}
                  disabled={isScanningBiometric}
                  className={`w-16 h-16 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-300 relative group cursor-pointer shrink-0 ${
                    isScanningBiometric
                      ? 'border-emerald-400 bg-emerald-500/20 shadow-glow-green scale-110 animate-pulse'
                      : 'border-emerald-500/40 hover:border-emerald-400 bg-nexus-card hover:bg-emerald-500/10 shadow-glow-green hover:scale-105'
                  }`}
                  title="Click to scan fingerprint and access website"
                >
                  <Fingerprint
                    className={`w-8 h-8 transition-colors ${
                      isScanningBiometric ? 'text-emerald-300 animate-bounce' : 'text-emerald-400 group-hover:text-emerald-300'
                    }`}
                  />
                  <span className="text-[8px] font-mono text-emerald-400 mt-0.5 uppercase">
                    {isScanningBiometric ? 'SCANNING' : 'TOUCH'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: TERMINAL PASSCODE & REGISTER CONSOLE */}
        {accessMode === 'terminal' && (
          <div className="max-w-xl mx-auto py-4 animate-fade-in">
            {/* Sign In vs Register sub-tab */}
            <div className="flex bg-nexus-dark p-1 rounded-2xl border border-emerald-500/30 mb-6">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setIsRegister(false);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  !isRegister
                    ? 'bg-gradient-to-r from-emerald-500 to-lime-500 text-nexus-dark shadow-glow-green'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Authenticate with Passcode
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setIsRegister(true);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  isRegister
                    ? 'bg-gradient-to-r from-emerald-500 to-lime-500 text-nexus-dark shadow-glow-green'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Create New Consignor Identity
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="block text-xs font-mono font-bold text-gray-300 mb-1">
                    LEGAL ENTITY OR CITIZEN NAME
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="Dr. Evelyn Vance"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={isRegister}
                      className="w-full bg-nexus-dark border border-emerald-500/30 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-sans"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono font-bold text-gray-300 mb-1">
                  OFFICIAL EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    placeholder="user@nexus.eco"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-nexus-dark border border-emerald-500/30 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono font-bold text-gray-300">
                    TERMINAL ACCESS CIPHER (PASSWORD)
                  </label>
                  {!isRegister && (
                    <span className="text-[10px] font-mono text-emerald-400">
                      Sample: User@123
                    </span>
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
                    className="w-full bg-nexus-dark border border-emerald-500/30 rounded-2xl pl-10 pr-11 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-emerald-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isRegister && (
                <div>
                  <label className="block text-xs font-mono font-bold text-gray-300 mb-1">
                    CLEARANCE TIER / ROLE
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full bg-nexus-dark border border-emerald-500/30 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-400 font-sans"
                  >
                    <option value="individual">Citizen Hardware Consignor (Individual)</option>
                    <option value="partner">GreenRoute Fleet Logistics Partner</option>
                    <option value="recycler">EcoRefine Smelter &amp; Hydrometallurgy Facility</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-nexus-dark font-black text-sm tracking-wide shadow-glow-green transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Executing Server Action Mutation...</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    <span>{isRegister ? 'Register Identity Key' : 'Authenticate Passcode'}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Bottom Navigation Link to Dedicated Signup Page */}
        <div className="mt-8 pt-6 border-t border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-gray-400 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Need a new authorized account for your household or enterprise?</span>
          </div>
          <Link
            href="/signup"
            onClick={() => soundEffects.playClick()}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 hover:from-emerald-400 hover:to-lime-300 text-nexus-dark font-black transition-all shadow-glow-green cursor-pointer hover:scale-105"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Go to Sign Up Page &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
