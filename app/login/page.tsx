'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore, DEMO_USERS } from '@/lib/store';
import { soundEffects } from '@/lib/sound';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { loginAction } from '@/actions/authActions';
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
  Truck,
  Building2,
  ShieldAlert,
  Smartphone,
  Send,
  Zap,
  Check,
  Shield,
  Award,
  Globe2,
} from 'lucide-react';

interface PersonaProfile {
  key: keyof typeof DEMO_USERS;
  name: string;
  roleTitle: string;
  badge: string;
  badgeColor: string;
  icon: any;
  email: string;
  desc: string;
}

const PERSONAS: PersonaProfile[] = [
  {
    key: 'individual',
    name: 'Alex Mercer (Citizen)',
    roleTitle: 'Household Consignor',
    badge: 'CITIZEN',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    icon: UserIcon,
    email: 'user@nexus.eco',
    desc: 'Schedule pickups, sell used electronics, earn Green Cash rewards',
  },
  {
    key: 'partner',
    name: 'GreenRoute Logistics',
    roleTitle: 'Fleet Logistics Partner',
    badge: 'LOGISTICS',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    icon: Truck,
    email: 'partner@nexus.eco',
    desc: 'Verify weigh-ins, optimize transport routes & chain-of-custody',
  },
  {
    key: 'recycler',
    name: 'EcoRefine Hydrometallurgy',
    roleTitle: 'Refining Smelter Facility',
    badge: 'RECYCLER',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    icon: Building2,
    email: 'recycler@nexus.eco',
    desc: 'Precious metal recovery, pyrometallurgy assay & EPR yield',
  },
  {
    key: 'admin',
    name: 'Central CPCB Auditor',
    roleTitle: 'E-Waste Governance Officer',
    badge: 'GOVERNANCE',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    icon: ShieldAlert,
    email: 'admin@nexus.eco',
    desc: 'National EPR credit approvals, statutory quota monitoring',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { setUser, switchDemoRole } = useAuthStore();

  // Form states
  const [email, setEmail] = useState('user@nexus.eco');
  const [password, setPassword] = useState('User@123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // SMS Notification states
  const [smsDispatched, setSmsDispatched] = useState(false);
  const [smsTimestamp, setSmsTimestamp] = useState<string>('');

  // Dispatch automated SMS access alert to admin phone numbers on visit
  useEffect(() => {
    fetch('/api/notify-access', { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSmsDispatched(true);
          setSmsTimestamp(data.timestamp || new Date().toLocaleTimeString());
        }
      })
      .catch((err) => console.warn('Notification error:', err));
  }, []);

  // 1-Click Instant Login as any demo persona
  const handleInstantLogin = (personaKey: keyof typeof DEMO_USERS) => {
    soundEffects.playUnlock();
    const persona = DEMO_USERS[personaKey];
    const sessionToken = `nexus_jwt_${personaKey}_token_session_2026`;

    // Set cookie for Next.js middleware verification
    document.cookie = `nexus_token=${sessionToken}; path=/; max-age=604800; SameSite=Lax`;
    switchDemoRole(personaKey);
    setUser(persona, sessionToken);

    setSuccessMsg(`Welcome, ${persona.name}! Access authorized. Opening dashboard...`);
    voiceAssistant.speak(`Identity verified for ${persona.name}. Welcome to E-Waste Nexus.`);

    setTimeout(() => {
      window.location.href = '/';
    }, 400);
  };

  // Form Submission via Server Action
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playClick();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await loginAction({ email, password });
      if (res.success && res.user) {
        soundEffects.playSuccess();
        setSuccessMsg(`Passcode verified! Loading your workspace...`);

        if (res.token) {
          document.cookie = `nexus_token=${res.token}; path=/; max-age=604800; SameSite=Lax`;
        }

        setUser(res.user, res.token);
        voiceAssistant.speak(`Welcome back, ${res.user.name}.`);

        setTimeout(() => {
          window.location.href = '/';
        }, 400);
      } else {
        soundEffects.playError();
        setErrorMsg(res.error || 'Invalid email or password. Please try again.');
      }
    } catch (err: any) {
      soundEffects.playError();
      setErrorMsg(err?.message || 'Authentication error. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[400px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Real-time SMS Dispatch Status Banner */}
      <div className="w-full max-w-6xl mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-nexus-card/90 to-emerald-950/80 border border-emerald-500/30 backdrop-blur-xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Smartphone className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2 font-bold text-white">
              <span>SMS Security Access Alert</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-gray-300 mt-0.5">
              Automated mobile SMS notification triggered to: <span className="text-emerald-400 font-mono font-bold">+91 98059 26846</span> &amp; <span className="text-cyan-400 font-mono font-bold">+91 9417453249</span>
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold">
            <Send className="w-3 h-3" />
            <span>{smsDispatched ? `ALERT SENT (${smsTimestamp || 'Live'})` : 'DISPATCHING SMS...'}</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Left Hero Branding + Right Sign-In Form */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Side: Ecosystem Impact & 1-Click Access Personas */}
        <div className="lg:col-span-7 rounded-3xl bg-nexus-card/70 border border-emerald-500/20 p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between shadow-2xl relative overflow-hidden">
          {/* Subtle Accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-lime-400" />

          <div>
            {/* Header Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-4">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified CPCB E-Waste Infrastructure</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-3">
              Circular Electronics &amp; EPR Compliance Platform
            </h1>
            <p className="text-sm text-gray-300 leading-relaxed max-w-xl">
              Log in to schedule certified e-waste collections, audit precious metal recovery assays, and trade statutory Extended Producer Responsibility (EPR) compliance credits.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 my-6 pt-2">
              <div className="p-3.5 rounded-2xl bg-nexus-dark/80 border border-emerald-500/20 text-center">
                <div className="text-lg sm:text-2xl font-black text-emerald-400">45.8k kg</div>
                <div className="text-[10px] font-mono text-gray-400 uppercase mt-0.5">E-Waste Diverted</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-nexus-dark/80 border border-emerald-500/20 text-center">
                <div className="text-lg sm:text-2xl font-black text-cyan-400">₹14.2M</div>
                <div className="text-[10px] font-mono text-gray-400 uppercase mt-0.5">EPR Traded</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-nexus-dark/80 border border-emerald-500/20 text-center">
                <div className="text-lg sm:text-2xl font-black text-amber-400">100%</div>
                <div className="text-[10px] font-mono text-gray-400 uppercase mt-0.5">CPCB Verified</div>
              </div>
            </div>

            {/* 1-Click Persona Access Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-gray-300 font-bold flex items-center space-x-1.5">
                  <Zap className="w-4 h-4 text-emerald-400 fill-current" />
                  <span>Instant 1-Click Demo Profiles:</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400">Click to enter directly</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PERSONAS.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={p.key}
                      onClick={() => handleInstantLogin(p.key)}
                      className="group cursor-pointer rounded-2xl p-4 bg-nexus-dark/80 border border-emerald-500/20 hover:border-emerald-400 hover:bg-emerald-500/10 transition-all duration-300 shadow-sm hover:shadow-glow-green hover:scale-102 flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="w-9 h-9 rounded-xl bg-nexus-card border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase border ${p.badgeColor}`}>
                          {p.badge}
                        </span>
                      </div>

                      <div>
                        <div className="font-bold text-white text-xs group-hover:text-emerald-300 transition-colors">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                          {p.desc}
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-emerald-500/15 flex items-center justify-between text-[10px] font-mono text-emerald-400 group-hover:text-emerald-300 font-bold">
                        <span>⚡ 1-Click Enter</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-500/20 flex items-center justify-between text-[11px] text-gray-400 font-mono">
            <span>Next.js 14 App Router &bull; React 18 &bull; Edge Middleware</span>
            <span className="text-emerald-400 flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5" />
              <span>TLS 256-bit Encrypted</span>
            </span>
          </div>
        </div>

        {/* Right Side: Passcode Login Form & Direct Access */}
        <div className="lg:col-span-5 rounded-3xl bg-gradient-to-b from-nexus-card/95 via-nexus-card/90 to-nexus-dark/95 border-2 border-emerald-500/30 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl flex flex-col justify-between relative overflow-hidden">
          {/* Top glow accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-lime-400" />

          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-lime-400 p-0.5 shadow-glow-green">
                <div className="w-full h-full bg-nexus-dark rounded-[14px] flex items-center justify-center">
                  <Recycle className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-black text-white tracking-tight">
                  Sign In to E-Waste Nexus
                </h2>
                <p className="text-xs text-gray-400">
                  Enter your credentials to access your dashboard
                </p>
              </div>
            </div>

            {/* Error & Success Feedback */}
            {errorMsg && (
              <div className="mb-4 p-3.5 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2.5 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2.5 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    placeholder="user@nexus.eco"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-nexus-dark border border-emerald-500/30 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-mono transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">
                    Access Password
                  </label>
                  <span className="text-[10px] font-mono text-emerald-400">
                    Default: User@123
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-nexus-dark border border-emerald-500/30 rounded-2xl pl-10 pr-11 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-mono transition-colors"
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-nexus-dark font-black text-sm tracking-wide shadow-glow-green transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer hover:scale-102 active:scale-98"
              >
                {isLoading ? (
                  <span>Authenticating Credentials...</span>
                ) : (
                  <>
                    <span>Sign In to Platform</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Pre-fills */}
            <div className="mt-5 pt-4 border-t border-emerald-500/20">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-2">
                Quick Credential Fill:
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('user@nexus.eco');
                    setPassword('User@123');
                    soundEffects.playClick();
                  }}
                  className="p-2 rounded-xl bg-nexus-dark border border-emerald-500/20 hover:border-emerald-400 text-gray-300 hover:text-white transition-all text-left"
                >
                  <span className="text-emerald-400 font-bold block">Citizen</span>
                  <span className="text-[10px] text-gray-400">user@nexus.eco</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('partner@nexus.eco');
                    setPassword('Partner@123');
                    soundEffects.playClick();
                  }}
                  className="p-2 rounded-xl bg-nexus-dark border border-emerald-500/20 hover:border-cyan-400 text-gray-300 hover:text-white transition-all text-left"
                >
                  <span className="text-cyan-400 font-bold block">Logistics</span>
                  <span className="text-[10px] text-gray-400">partner@nexus.eco</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Card: Link to Sign Up */}
          <div className="mt-6 pt-5 border-t border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-gray-400">
              Don&apos;t have an account yet?
            </span>
            <Link
              href="/signup"
              onClick={() => soundEffects.playClick()}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 hover:text-white font-bold transition-all shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Create Account / Sign Up &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
