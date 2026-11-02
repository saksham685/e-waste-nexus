'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { soundEffects } from '@/lib/sound';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { registerAction } from '@/actions/authActions';
import {
  User as UserIcon,
  Mail,
  Lock,
  Phone,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Recycle,
  Truck,
  Sparkles,
  Smartphone,
  Eye,
  EyeOff,
  LogIn,
  Check,
} from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'individual' | 'partner' | 'recycler'>('individual');
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [smsDispatched, setSmsDispatched] = useState(false);
  const [smsTimestamp, setSmsTimestamp] = useState<string>('');

  // Dispatch automated SMS access alert to admin numbers on signup page open
  useEffect(() => {
    fetch('/api/notify-access', { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSmsDispatched(true);
          setSmsTimestamp(data.timestamp || new Date().toLocaleTimeString());
        }
      })
      .catch((err) => console.warn('Signup page notify error:', err));
  }, []);

  const handleRoleSelect = (selectedRole: 'individual' | 'partner' | 'recycler') => {
    soundEffects.playClick();
    setRole(selectedRole);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playClick();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Basic password match validation
    if (password !== confirmPassword) {
      soundEffects.playError();
      setErrorMsg('Passwords do not match. Please verify both fields.');
      return;
    }

    if (!agreedToTerms) {
      soundEffects.playError();
      setErrorMsg('You must agree to the CPCB E-Waste compliance guidelines to continue.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await registerAction({
        name,
        email,
        password,
        role,
        organization: organization || undefined,
        phone: phone || undefined,
      });

      if (res.success && res.user) {
        soundEffects.playSuccess();
        setSuccessMsg(`Welcome aboard, ${res.user.name}! Your account has been registered.`);

        // Set session cookie for Next.js middleware
        if (res.token) {
          document.cookie = `nexus_token=${res.token}; path=/; max-age=604800; SameSite=Lax`;
        }

        setUser(res.user, res.token);
        voiceAssistant.speak(`Welcome to E-Waste Nexus, ${res.user.name}. Launching your workspace.`);

        setTimeout(() => {
          window.location.href = '/';
        }, 600);
      } else {
        soundEffects.playError();
        setErrorMsg(res.error || 'Registration failed. Please check your inputs.');
      }
    } catch (err: any) {
      soundEffects.playError();
      setErrorMsg(err?.message || 'A network or server error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-lime-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* SMS Alert Live Status Bar */}
      <div className="w-full max-w-2xl mb-4 p-3 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-nexus-card/90 to-emerald-950/80 border border-emerald-500/30 backdrop-blur-xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Smartphone className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-white flex items-center space-x-1.5">
              <span>SMS Access Notification</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px]">
                LIVE
              </span>
            </div>
            <p className="text-[10px] text-gray-300">
              Alert configured for: <span className="text-emerald-400 font-mono font-bold">+91 98059 26846</span> &amp; <span className="text-cyan-400 font-mono font-bold">+91 9417453249</span>
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold text-emerald-300 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 shrink-0">
          {smsDispatched ? `DISPATCHED (${smsTimestamp || 'Live'})` : 'CONNECTING...'}
        </span>
      </div>

      {/* Main Signup Form Container */}
      <div className="w-full max-w-2xl bg-gradient-to-b from-nexus-card/95 via-nexus-card/85 to-nexus-dark/95 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-lime-400 shadow-glow-green" />

        {/* Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create New Circular Account</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Sign Up for E-Waste Nexus
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-md mx-auto">
            Join India&apos;s premier certified electronics lifecycle, recycling &amp; EPR credit ecosystem.
          </p>
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

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Role Selector Cards */}
          <div>
            <label className="block text-xs font-mono font-bold text-gray-300 uppercase tracking-wider mb-2">
              Select Your Account Persona / Role
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Individual */}
              <button
                type="button"
                onClick={() => handleRoleSelect('individual')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  role === 'individual'
                    ? 'border-emerald-400 bg-emerald-500/15 shadow-glow-green scale-102'
                    : 'border-emerald-500/20 bg-nexus-dark/70 hover:border-emerald-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <UserIcon className="w-5 h-5 text-emerald-400" />
                  {role === 'individual' && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="font-bold text-xs text-white">Individual Citizen</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Household e-waste &amp; Green Points</div>
              </button>

              {/* Logistics Partner */}
              <button
                type="button"
                onClick={() => handleRoleSelect('partner')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  role === 'partner'
                    ? 'border-cyan-400 bg-cyan-500/15 shadow-glow-cyan scale-102'
                    : 'border-emerald-500/20 bg-nexus-dark/70 hover:border-emerald-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Truck className="w-5 h-5 text-cyan-400" />
                  {role === 'partner' && <Check className="w-4 h-4 text-cyan-400" />}
                </div>
                <div className="font-bold text-xs text-white">Logistics Partner</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Fleet collection &amp; weight manifests</div>
              </button>

              {/* Recycler Facility */}
              <button
                type="button"
                onClick={() => handleRoleSelect('recycler')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  role === 'recycler'
                    ? 'border-amber-400 bg-amber-500/15 shadow-lg scale-102'
                    : 'border-emerald-500/20 bg-nexus-dark/70 hover:border-emerald-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Building2 className="w-5 h-5 text-amber-400" />
                  {role === 'recycler' && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <div className="font-bold text-xs text-white">Recycler Facility</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Hydrometallurgy &amp; EPR credits</div>
              </button>
            </div>
          </div>

          {/* 2. Full Name & Email (2 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-gray-300 mb-1">
                FULL LEGAL NAME *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-nexus-dark border border-emerald-500/30 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-gray-300 mb-1">
                OFFICIAL EMAIL *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="ramesh@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-nexus-dark border border-emerald-500/30 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-mono"
                />
              </div>
            </div>
          </div>

          {/* 3. Phone & Organization (2 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-gray-300 mb-1">
                MOBILE PHONE NUMBER
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  placeholder="+91 98059 26846"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-nexus-dark border border-emerald-500/30 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-gray-300 mb-1">
                ORGANIZATION / COMPANY <span className="text-gray-500 text-[10px]">(OPTIONAL)</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. EcoGreen Solutions"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full bg-nexus-dark border border-emerald-500/30 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* 4. Password & Confirm Password (2 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-mono font-bold text-gray-300">
                  CREATE PASSWORD *
                </label>
                <span className="text-[10px] font-mono text-gray-500">Min 6, 1 uppercase, 1 number</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="User@123"
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

            <div>
              <label className="block text-xs font-mono font-bold text-gray-300 mb-1">
                CONFIRM PASSWORD *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="User@123"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-nexus-dark border border-emerald-500/30 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-mono"
                />
              </div>
            </div>
          </div>

          {/* 5. Terms Checkbox */}
          <div className="flex items-start space-x-3 pt-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-emerald-500/40 bg-nexus-dark text-emerald-500 focus:ring-emerald-400 focus:ring-offset-nexus-dark"
            />
            <label htmlFor="terms" className="text-xs text-gray-300 leading-snug cursor-pointer select-none">
              I agree to the <span className="text-emerald-400 font-semibold">Central Pollution Control Board (CPCB) E-Waste Rules 2022</span> and certify that scheduled consignments meet hazardous material handling standards.
            </label>
          </div>

          {/* 6. Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-nexus-dark font-black text-sm tracking-wide shadow-glow-green transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <span>Creating Account &amp; Enrolling Persona...</span>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Complete Registration &amp; Enter Platform</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Bottom Switcher: Already Have Account? -> /login */}
        <div className="mt-8 pt-6 border-t border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span className="text-gray-400">
            Already have an authorized account?
          </span>
          <Link
            href="/login"
            onClick={() => soundEffects.playClick()}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-nexus-dark border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 hover:text-white font-bold transition-all shadow-sm"
          >
            <LogIn className="w-4 h-4" />
            <span>Go to Login / Sign In Gate &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
