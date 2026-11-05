'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { soundEffects } from '@/lib/sound';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { registerAction } from '@/actions/authActions';
import {
  Recycle,
  User as UserIcon,
  Mail,
  Lock,
  Phone,
  Building2,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Eye,
  EyeOff,
  LogIn,
  Check,
  Award,
  Zap,
  Globe2,
} from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState<'individual' | 'partner' | 'recycler'>('individual');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Live Password Strength Calculation
  const passwordChecks = {
    length: password.length >= 6,
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    match: password.length > 0 && password === confirmPassword,
  };

  const strengthScore = [
    passwordChecks.length,
    passwordChecks.hasUpper,
    passwordChecks.hasNumber,
    password.length >= 8,
  ].filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playClick();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Client-side validations
    if (!name.trim()) {
      soundEffects.playError();
      setErrorMsg('Please enter your full legal name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      soundEffects.playError();
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      soundEffects.playError();
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (!/[A-Z]/.test(password)) {
      soundEffects.playError();
      setErrorMsg('Password must contain at least one uppercase letter (e.g. A-Z).');
      return;
    }

    if (!/[0-9]/.test(password)) {
      soundEffects.playError();
      setErrorMsg('Password must contain at least one numeric digit (e.g. 0-9).');
      return;
    }

    if (password !== confirmPassword) {
      soundEffects.playError();
      setErrorMsg('Passwords do not match. Please verify both password fields.');
      return;
    }

    if (!agreedToTerms) {
      soundEffects.playError();
      setErrorMsg('You must agree to the CPCB E-Waste compliance guidelines to proceed.');
      return;
    }

    setIsLoading(true);

    try {
      const fullOrg = [organization, city ? `City: ${city}` : ''].filter(Boolean).join(' | ');

      const res = await registerAction({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        organization: fullOrg || undefined,
        phone: phone.trim() || undefined,
      });

      if (res.success && res.user) {
        soundEffects.playSuccess();
        setSuccessMsg(`Welcome aboard, ${res.user.name}! Your account has been registered successfully.`);

        // Set session cookie for Next.js Edge Middleware
        if (res.token) {
          document.cookie = `nexus_token=${res.token}; path=/; max-age=604800; SameSite=Lax`;
        }

        setUser(res.user, res.token);
        voiceAssistant.speak(`Welcome to E-Waste Nexus, ${res.user.name}. Launching your verified dashboard.`);

        const redirect = typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('redirect')
          : null;
        const target = redirect && redirect.startsWith('/') ? redirect : '/';

        setTimeout(() => {
          window.location.href = target;
        }, 600);
      } else {
        soundEffects.playError();
        setErrorMsg(res.error || 'Registration failed. Please check your details and try again.');
      }
    } catch (err: any) {
      soundEffects.playError();
      setErrorMsg(err?.message || 'A network error occurred while connecting to the registry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative">
        {/* Left Side: Brand Value Proposition & Trust Badges */}
        <div className="lg:col-span-5 bg-gradient-to-b from-nexus-card via-nexus-dark to-nexus-card border border-emerald-500/30 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-6 relative">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center space-x-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-lime-400 p-0.5 shadow-glow-green group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-nexus-dark rounded-[14px] flex items-center justify-center">
                  <Recycle className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight">
                  E-WASTE <span className="text-emerald-400">NEXUS</span>
                </span>
                <span className="block text-[9px] font-mono uppercase tracking-widest text-emerald-400/80">
                  Government Certified EPR Network
                </span>
              </div>
            </Link>

            <div className="space-y-3 pt-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Create Your Official Account
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
                Join India&apos;s digital chain-of-custody platform for transparent electronic waste disposal, green cash rewards, and CPCB EPR credit compliance.
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="space-y-3 pt-4 border-t border-emerald-500/20 text-xs">
              <div className="flex items-start space-x-3 text-gray-300">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-white block font-medium">CPCB 2022 Certified</strong>
                  <span className="text-gray-400 text-[11px]">Official digital certificates for every kilograms recycled.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-gray-300">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-white block font-medium">Doorstep Pickup &amp; Cash Rewards</strong>
                  <span className="text-gray-400 text-[11px]">Instant UPI green points &amp; live doorstep collection manifests.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-gray-300">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-white block font-medium">EPR Trade Marketplace</strong>
                  <span className="text-gray-400 text-[11px]">Real-time regulatory compliance credits for electronics producers.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Assurance */}
          <div className="pt-6 border-t border-emerald-500/20 flex items-center space-x-2 text-[11px] text-gray-400 font-mono">
            <Globe2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Encrypted under Indian Environmental IT Act 2022</span>
          </div>
        </div>

        {/* Right Side: Professional Registration Form */}
        <div className="lg:col-span-7 bg-nexus-card border border-emerald-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white">Sign Up</h3>
              <p className="text-xs text-gray-400">Fill in the fields below to create your authorized account</p>
            </div>
            <Link
              href="/login"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center space-x-1"
            >
              <span>Have an account?</span>
              <span className="underline ml-0.5">Sign In</span>
            </Link>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Account Persona Selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                I am registering as:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    setRole('individual');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    role === 'individual'
                      ? 'border-emerald-400 bg-emerald-500/20 text-white shadow-glow-green scale-102'
                      : 'border-emerald-500/20 bg-nexus-dark/70 text-gray-400 hover:text-white hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <UserIcon className="w-4 h-4 text-emerald-400" />
                    {role === 'individual' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div className="font-bold text-xs">Citizen / Consumer</div>
                  <div className="text-[10px] text-gray-400">Sell old gadgets &amp; earn rewards</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    setRole('partner');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    role === 'partner'
                      ? 'border-cyan-400 bg-cyan-500/20 text-white shadow-glow-cyan scale-102'
                      : 'border-emerald-500/20 bg-nexus-dark/70 text-gray-400 hover:text-white hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Truck className="w-4 h-4 text-cyan-400" />
                    {role === 'partner' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                  <div className="font-bold text-xs">Logistics Fleet</div>
                  <div className="text-[10px] text-gray-400">Transport &amp; weigh consignments</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    setRole('recycler');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    role === 'recycler'
                      ? 'border-amber-400 bg-amber-500/20 text-white shadow-lg scale-102'
                      : 'border-emerald-500/20 bg-nexus-dark/70 text-gray-400 hover:text-white hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    {role === 'recycler' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <div className="font-bold text-xs">Recycler Facility</div>
                  <div className="text-[10px] text-gray-400">Smelting, refining &amp; EPR credits</div>
                </button>
              </div>
            </div>

            {/* 2. Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Full Name <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Rahul Verma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Email Address <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    placeholder="rahul@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 font-mono transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 3. Phone & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Mobile Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    placeholder="+91 98101 23456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 font-mono transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  City / State (India)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Noida, Delhi NCR"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Optional Organization */}
            {role !== 'individual' && (
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Company / Organization Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. GreenTech Recyclers Pvt Ltd"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* 4. Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Create Password <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 font-mono transition-colors"
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

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Confirm Password <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 font-mono transition-colors"
                  />
                  {confirmPassword && (
                    <div className="absolute right-3.5 top-2.5">
                      {password === confirmPassword ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <span className="text-[10px] text-red-400 font-mono">Mismatch</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Password Validation Micro-Indicator */}
            {password.length > 0 && (
              <div className="p-2.5 rounded-xl bg-nexus-dark/80 border border-emerald-500/20 text-[11px] font-mono grid grid-cols-3 gap-2">
                <span className={`flex items-center space-x-1 ${passwordChecks.length ? 'text-emerald-400 font-bold' : 'text-gray-500'}`}>
                  <span>{passwordChecks.length ? '✓' : '•'}</span>
                  <span>6+ characters</span>
                </span>
                <span className={`flex items-center space-x-1 ${passwordChecks.hasUpper ? 'text-emerald-400 font-bold' : 'text-gray-500'}`}>
                  <span>{passwordChecks.hasUpper ? '✓' : '•'}</span>
                  <span>1 uppercase (A-Z)</span>
                </span>
                <span className={`flex items-center space-x-1 ${passwordChecks.hasNumber ? 'text-emerald-400 font-bold' : 'text-gray-500'}`}>
                  <span>{passwordChecks.hasNumber ? '✓' : '•'}</span>
                  <span>1 digit (0-9)</span>
                </span>
              </div>
            )}

            {/* Terms Agreement */}
            <div className="flex items-start space-x-2.5 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 rounded border-emerald-500/30 text-emerald-500 focus:ring-0 bg-nexus-dark"
              />
              <label htmlFor="terms" className="text-xs text-gray-400 cursor-pointer select-none leading-relaxed">
                I agree to the <span className="text-emerald-400 font-semibold">CPCB E-Waste Rules 2022</span> guidelines and authorize safe, environmentally sound collection of consigned electronic assets.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-nexus-dark font-black text-sm tracking-wide shadow-glow-green transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer hover:scale-101 active:scale-99"
            >
              {isLoading ? (
                <span>Creating Your Account...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Create Account &amp; Open Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Already have an account footer */}
          <div className="text-center pt-2 border-t border-emerald-500/20 text-xs text-gray-400">
            Already registered?{' '}
            <Link
              href="/login"
              className="text-emerald-400 font-bold hover:underline ml-1"
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
