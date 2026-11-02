'use client';

import React, { useState } from 'react';
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

  // Form states
  const [email, setEmail] = useState('user@nexus.eco');
  const [password, setPassword] = useState('User@123');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'individual' | 'partner' | 'recycler'>('individual');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
      switchDemoRole(persona.key);
      setSuccessMsg(`Biometric matched: Clearance granted to ${persona.user.name}.`);
      voiceAssistant.speak(`Biometric identity verified for ${persona.user.name}. Welcome.`);

      setTimeout(() => {
        if (persona.key === 'partner') router.push('/partner');
        else if (persona.key === 'recycler') router.push('/recycler');
        else if (persona.key === 'admin') router.push('/admin');
        else router.push('/pickups');
      }, 700);
    }, 1200);
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
          setUser(res.user, res.token);
          voiceAssistant.speak(`Welcome to E-Waste Nexus, ${res.user.name}.`);
          setTimeout(() => router.push('/pickups'), 600);
        } else {
          soundEffects.playError();
          setErrorMsg(res.error || 'Registration failed');
        }
      } else {
        const res = await loginAction({ email, password });
        if (res.success && res.user) {
          soundEffects.playSuccess();
          setSuccessMsg(`Access passcode verified. Loading workspace...`);
          setUser(res.user, res.token);
          voiceAssistant.speak(`Welcome back, ${res.user.name}.`);
          setTimeout(() => {
            if (res.user?.role === 'partner') router.push('/partner');
            else if (res.user?.role === 'recycler') router.push('/recycler');
            else if (res.user?.role === 'admin') router.push('/admin');
            else router.push('/pickups');
          }, 600);
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
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Futuristic Telemetry Status Bar */}
      <div className="w-full max-w-5xl flex items-center justify-between py-2 px-4 mb-6 rounded-2xl bg-nexus-card/60 border border-emerald-500/20 backdrop-blur-xl text-[11px] font-mono text-gray-400">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-bold uppercase">SECURITY GATE ACTIVE</span>
          <span className="hidden sm:inline">&bull; ZERO-KNOWLEDGE ENCLAVE</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="hidden md:inline text-cyan-400 font-semibold">CIPHER: AES-256-GCM</span>
          <span className="text-gray-400 font-mono">PORTAL ID: #NX-8820</span>
        </div>
      </div>

      {/* Main Unique Cyber Terminal Box */}
      <div className="w-full max-w-5xl bg-gradient-to-b from-nexus-card/95 via-nexus-card/80 to-nexus-dark/95 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        {/* Holographic scanner laser line effect */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-lime-400 shadow-glow-green" />

        {/* Top Header with 3D Hologram Core */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-emerald-500/20 pb-8 mb-8">
          {/* Left: 3D Hologram Security Orb */}
          <div className="lg:col-span-4 h-[220px] relative flex items-center justify-center rounded-2xl bg-nexus-dark/70 border border-emerald-500/20 overflow-hidden">
            <HologramVault3D />
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-emerald-400/90 pointer-events-none">
              <span>HOLOGRAPHIC VAULT</span>
              <span className="animate-pulse">ONLINE</span>
            </div>
          </div>

          {/* Center/Right: Title & Mode Toggle */}
          <div className="lg:col-span-8 flex flex-col justify-between h-full space-y-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next.js App Router &bull; Biometric &amp; SmartCard Gate</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                Circular Electronics Clearance Terminal
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light mt-1">
                Select an institutional NFC SmartCard below for 1-click clearance, or switch to the manual Passcode Terminal.
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
                <span>Terminal Passcode &amp; Register</span>
              </button>
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

                        {/* Card Footer */}
                        <div className="mt-4 pt-3 border-t border-emerald-500/15 flex items-center justify-between">
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
                  Touch sensor to simulate biometric thumbprint scanning and instant sign in for the docked persona.
                </p>
                <div className="text-xs font-mono text-emerald-400 pt-1">
                  Ready to Authenticate: <span className="font-bold">{DEMO_USERS[activeCardKey as keyof typeof DEMO_USERS].name}</span>
                </div>
              </div>

              {/* Glowing Sensor Button */}
              <button
                type="button"
                onClick={handleBiometricScan}
                disabled={isScanningBiometric}
                className={`w-20 h-20 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-300 relative group cursor-pointer shrink-0 ${
                  isScanningBiometric
                    ? 'border-emerald-400 bg-emerald-500/20 shadow-glow-green scale-110 animate-pulse'
                    : 'border-emerald-500/40 hover:border-emerald-400 bg-nexus-card hover:bg-emerald-500/10 shadow-glow-green hover:scale-105'
                }`}
                title="Click to scan fingerprint"
              >
                <Fingerprint
                  className={`w-10 h-10 transition-colors ${
                    isScanningBiometric ? 'text-emerald-300 animate-bounce' : 'text-emerald-400 group-hover:text-emerald-300'
                  }`}
                />
                <span className="text-[8px] font-mono text-emerald-400 mt-1 uppercase">
                  {isScanningBiometric ? 'SCANNING' : 'TOUCH'}
                </span>
              </button>
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
      </div>
    </div>
  );
}
