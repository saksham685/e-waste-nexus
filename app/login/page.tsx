'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore, DEMO_USERS } from '@/lib/store';
import { soundEffects } from '@/lib/sound';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { loginAction, registerAction } from '@/actions/authActions';
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
  Zap,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, switchDemoRole } = useAuthStore();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('user@nexus.eco');
  const [password, setPassword] = useState('User@123');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'individual' | 'partner' | 'recycler'>('individual');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
          setSuccessMsg(`Welcome, ${res.user.name}! Your account has been registered.`);
          setUser(res.user, res.token);
          voiceAssistant.speak(`Welcome to E-Waste Nexus, ${res.user.name}.`);
          setTimeout(() => router.push('/pickups'), 700);
        } else {
          soundEffects.playError();
          setErrorMsg(res.error || 'Registration failed');
        }
      } else {
        const res = await loginAction({ email, password });
        if (res.success && res.user) {
          soundEffects.playSuccess();
          setSuccessMsg(`Authenticated successfully. Redirecting to workspace...`);
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
      setErrorMsg(err?.message || 'Authentication service error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (demoKey: keyof typeof DEMO_USERS) => {
    soundEffects.playSuccess();
    switchDemoRole(demoKey);
    const demo = DEMO_USERS[demoKey];
    setEmail(demo.email);
    setPassword(demoKey === 'admin' ? 'Admin@123' : demoKey === 'partner' ? 'Partner@123' : demoKey === 'recycler' ? 'Recycler@123' : 'User@123');
    setSuccessMsg(`Switched credentials to ${demo.name} (${demoKey.toUpperCase()})`);
    voiceAssistant.speak(`Activated ${demoKey} persona for ${demo.name}.`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Dual-Pane Container */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
        
        {/* Left Column: Brand & Security Showcase */}
        <div className="lg:col-span-5 bg-gradient-to-br from-nexus-card/90 via-nexus-card/70 to-nexus-dark/95 border border-emerald-500/30 rounded-3xl p-8 sm:p-10 backdrop-blur-2xl shadow-2xl flex flex-col justify-between relative overflow-hidden group">
          {/* Subtle Corner Hologram */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-emerald-500/15 via-teal-400/5 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Logo Badge */}
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-lime-400 p-0.5 shadow-glow-green">
                <div className="w-full h-full bg-nexus-dark rounded-[14px] flex items-center justify-center">
                  <Recycle className="w-6 h-6 text-emerald-400 animate-spin-slow" />
                </div>
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-wider block leading-none">
                  E-WASTE <span className="bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent">NEXUS</span>
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/80">
                  Circular Electronics OS
                </span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-3">
              Certified Chain-of-Custody &amp; EPR Governance
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light mb-8">
              Access your decentralized circular recycling ledger. Trace discarded electronic assets from doorstep pickup to 99.9% pure gold bullion assay.
            </p>

            {/* Feature Highlights */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3.5 p-3 rounded-2xl bg-nexus-dark/60 border border-emerald-500/15">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Fingerprint className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">NIST SP 800-88 R1 Sanitization</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">Automated digital Certificates of Destruction.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-3 rounded-2xl bg-nexus-dark/60 border border-emerald-500/15">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Hydrometallurgical Precious Assay</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">Fine gold, silver, and high-conductivity copper recovery.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-3 rounded-2xl bg-nexus-dark/60 border border-emerald-500/15">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Statutory CPCB EPR Quota Credits</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">Audited compliance tokens for IT hardware producers.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Footer */}
          <div className="pt-6 border-t border-emerald-500/20 flex items-center justify-between text-[11px] font-mono text-gray-400">
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>TLS 1.3 &bull; 256-Bit Encrypted</span>
            </span>
            <span className="text-gray-500">ISO 14001 Compliant</span>
          </div>
        </div>

        {/* Right Column: Authentication Terminal */}
        <div className="lg:col-span-7 bg-nexus-card/95 border-2 border-emerald-500/40 rounded-3xl p-8 sm:p-10 backdrop-blur-2xl shadow-2xl flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-lime-400" />

          <div>
            {/* Header Tabs: Sign In / Create Account */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">
                  {isRegister ? 'Register Identity' : 'Nexus Security Gate'}
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  {isRegister ? 'Create your official e-waste management credentials' : 'Authenticate to access chain-of-custody controls'}
                </p>
              </div>

              {/* Segmented Switcher */}
              <div className="flex bg-nexus-dark p-1 rounded-2xl border border-emerald-500/30">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    setIsRegister(false);
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    !isRegister
                      ? 'bg-gradient-to-r from-emerald-500 to-lime-500 text-nexus-dark shadow-glow-green'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    setIsRegister(true);
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isRegister
                      ? 'bg-gradient-to-r from-emerald-500 to-lime-500 text-nexus-dark shadow-glow-green'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Error & Success Feedback Banners */}
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 font-mono">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="Dr. Evelyn Vance"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={isRegister}
                      className="w-full bg-nexus-dark/90 border border-emerald-500/30 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all font-sans"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 font-mono">
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
                    className="w-full bg-nexus-dark/90 border border-emerald-500/30 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 font-mono">
                    Access Password
                  </label>
                  {!isRegister && (
                    <span className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 cursor-pointer">
                      Demo: User@123
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
                    className="w-full bg-nexus-dark/90 border border-emerald-500/30 rounded-2xl pl-10 pr-11 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono"
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 font-mono">
                    Institutional Role &amp; Access Tier
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full bg-nexus-dark/90 border border-emerald-500/30 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 font-sans"
                  >
                    <option value="individual">Citizen Consignor (Individual Hardware Owner)</option>
                    <option value="partner">GreenRoute Fleet Logistics Partner</option>
                    <option value="recycler">EcoRefine Smelter &amp; Hydrometallurgy Facility</option>
                  </select>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-nexus-dark font-black text-sm tracking-wide shadow-glow-green hover:shadow-glow-cyan hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center space-x-2">
                    <span className="w-4 h-4 border-2 border-nexus-dark border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Cryptographic Credentials...</span>
                  </span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    <span>{isRegister ? 'Complete Verification & Register' : 'Authorize Session Login'}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick 1-Click Evaluation Personas */}
          <div className="mt-8 pt-6 border-t border-emerald-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase text-gray-400 tracking-wider flex items-center space-x-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-400" />
                <span>Quick-Fill Evaluator Personas:</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                1-Click Autofill
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickDemo('individual')}
                className="p-3 rounded-2xl bg-nexus-dark/80 hover:bg-emerald-500/15 border border-emerald-500/20 hover:border-emerald-400 text-left transition-all duration-200 group"
              >
                <div className="flex items-center space-x-1.5 mb-1 text-emerald-400">
                  <UserIcon className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold group-hover:text-emerald-300">Consumer</span>
                </div>
                <div className="text-[10px] text-gray-400 font-mono truncate">Sarah Jenkins</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('partner')}
                className="p-3 rounded-2xl bg-nexus-dark/80 hover:bg-cyan-500/15 border border-cyan-500/20 hover:border-cyan-400 text-left transition-all duration-200 group"
              >
                <div className="flex items-center space-x-1.5 mb-1 text-cyan-400">
                  <Truck className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold group-hover:text-cyan-300">Logistics</span>
                </div>
                <div className="text-[10px] text-gray-400 font-mono truncate">Marcus Sterling</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('recycler')}
                className="p-3 rounded-2xl bg-nexus-dark/80 hover:bg-amber-500/15 border border-amber-500/20 hover:border-amber-400 text-left transition-all duration-200 group"
              >
                <div className="flex items-center space-x-1.5 mb-1 text-amber-400">
                  <Building2 className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold group-hover:text-amber-300">Smelter</span>
                </div>
                <div className="text-[10px] text-gray-400 font-mono truncate">Elena Rostova</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="p-3 rounded-2xl bg-nexus-dark/80 hover:bg-red-500/15 border border-red-500/20 hover:border-red-400 text-left transition-all duration-200 group"
              >
                <div className="flex items-center space-x-1.5 mb-1 text-red-400">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold group-hover:text-red-300">Auditor</span>
                </div>
                <div className="text-[10px] text-gray-400 font-mono truncate">Dr. Evelyn Vance</div>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
