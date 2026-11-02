'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, switchDemoRole } = useAuthStore();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('user@nexus.eco');
  const [password, setPassword] = useState('User@123');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'individual' | 'partner' | 'recycler'>('individual');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playClick();
    setErrorMsg(null);
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
          setUser(res.user, res.token);
          voiceAssistant.speak(`Welcome to E-Waste Nexus, ${res.user.name}.`);
          router.push('/pickups');
        } else {
          soundEffects.playError();
          setErrorMsg(res.error || 'Registration failed');
        }
      } else {
        const res = await loginAction({ email, password });
        if (res.success && res.user) {
          soundEffects.playSuccess();
          setUser(res.user, res.token);
          voiceAssistant.speak(`Welcome back, ${res.user.name}.`);
          if (res.user.role === 'partner') router.push('/partner');
          else if (res.user.role === 'recycler') router.push('/recycler');
          else if (res.user.role === 'admin') router.push('/admin');
          else router.push('/pickups');
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

  const handleQuickDemo = (demoKey: keyof typeof DEMO_USERS) => {
    soundEffects.playSuccess();
    switchDemoRole(demoKey);
    const demo = DEMO_USERS[demoKey];
    voiceAssistant.speak(`Logged in as ${demo.name} with ${demoKey} credentials.`);
    if (demoKey === 'partner') router.push('/partner');
    else if (demoKey === 'recycler') router.push('/recycler');
    else if (demoKey === 'admin') router.push('/admin');
    else router.push('/pickups');
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <TiltCard3D>
          <div className="bg-nexus-card border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-400 p-0.5 shadow-glow-green">
                <div className="w-full h-full bg-nexus-dark rounded-[14px] flex items-center justify-center">
                  <Lock className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                {isRegister ? 'Register Identity' : 'Nexus Security Gate'}
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Next.js Session Management &bull; HttpOnly Cookie Authentication
              </p>
            </div>

            {/* Tab switch */}
            <div className="flex bg-nexus-dark p-1 rounded-xl mb-6 border border-emerald-500/20">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setIsRegister(false);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  !isRegister
                    ? 'bg-emerald-500 text-nexus-dark shadow-glow-green'
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
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isRegister
                    ? 'bg-emerald-500 text-nexus-dark shadow-glow-green'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Full Legal Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Dr. Evelyn Vance"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={isRegister}
                      className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 font-sans"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    placeholder="user@nexus.eco"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>
              </div>

              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Account Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400 font-sans"
                  >
                    <option value="individual">Citizen Consignor (Individual)</option>
                    <option value="partner">Logistics Partner Fleet</option>
                    <option value="recycler">Hydrometallurgy Recycler Smelter</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 text-nexus-dark font-extrabold text-xs tracking-wide shadow-glow-green hover:opacity-90 active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{isLoading ? 'Verifying...' : isRegister ? 'Create Account' : 'Authenticate Identity'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Simulator Buttons */}
            <div className="mt-6 pt-6 border-t border-emerald-500/15">
              <span className="text-[10px] font-mono uppercase text-gray-500 tracking-wider block mb-2 text-center">
                Instant 1-Click Evaluation Personas:
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('individual')}
                  className="p-2 rounded-lg bg-nexus-dark border border-emerald-500/20 hover:border-emerald-400 text-gray-300 hover:text-white transition-colors text-left"
                >
                  &bull; Citizen Consignor
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('partner')}
                  className="p-2 rounded-lg bg-nexus-dark border border-cyan-500/20 hover:border-cyan-400 text-gray-300 hover:text-white transition-colors text-left"
                >
                  &bull; Logistics Partner
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('recycler')}
                  className="p-2 rounded-lg bg-nexus-dark border border-amber-500/20 hover:border-amber-400 text-gray-300 hover:text-white transition-colors text-left"
                >
                  &bull; Certified Recycler
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin')}
                  className="p-2 rounded-lg bg-nexus-dark border border-red-500/20 hover:border-red-400 text-gray-300 hover:text-white transition-colors text-left"
                >
                  &bull; EPA Chief Auditor
                </button>
              </div>
            </div>
          </div>
        </TiltCard3D>
      </div>
    </div>
  );
}
