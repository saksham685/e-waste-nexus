import React, { useState } from 'react';
import { useAuth, DEMO_CREDENTIALS } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Recycle,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface LoginPageProps {
  onNavigate: (tab: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, switchDemoRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      onNavigate('pickups');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handle1ClickDemo = async (role: UserRole) => {
    setLoading(true);
    try {
      await switchDemoRole(role);
      if (role === 'individual') onNavigate('pickups');
      else if (role === 'partner') onNavigate('partner');
      else if (role === 'recycler') onNavigate('recycler');
      else if (role === 'admin') onNavigate('admin');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Card Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-lime-400 p-0.5 shadow-glow-green mb-2">
            <div className="w-full h-full bg-nexus-dark rounded-[14px] flex items-center justify-center">
              <Recycle className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Sign In to E-Waste Nexus</h2>
          <p className="text-xs text-slate-400">
            Access your circular telemetry, collection dispatches, and EPR records
          </p>
        </div>

        {/* 1-Click Evaluation Personas Box */}
        <div className="p-4 rounded-2xl bg-nexus-charcoal border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Hackathon & Demo Login</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handle1ClickDemo('individual')}
              className="p-2.5 rounded-xl bg-nexus-dark border border-slate-800 hover:border-emerald-400 text-left transition-colors"
            >
              <div className="font-semibold text-white">Sarah Jenkins</div>
              <div className="text-[10px] text-emerald-400 font-mono">Individual Consumer</div>
            </button>

            <button
              type="button"
              onClick={() => handle1ClickDemo('partner')}
              className="p-2.5 rounded-xl bg-nexus-dark border border-slate-800 hover:border-emerald-400 text-left transition-colors"
            >
              <div className="font-semibold text-white">Marcus Sterling</div>
              <div className="text-[10px] text-cyan-400 font-mono">Logistics Fleet</div>
            </button>

            <button
              type="button"
              onClick={() => handle1ClickDemo('recycler')}
              className="p-2.5 rounded-xl bg-nexus-dark border border-slate-800 hover:border-emerald-400 text-left transition-colors"
            >
              <div className="font-semibold text-white">Elena Rostova</div>
              <div className="text-[10px] text-lime-400 font-mono">Certified Recycler</div>
            </button>

            <button
              type="button"
              onClick={() => handle1ClickDemo('admin')}
              className="p-2.5 rounded-xl bg-nexus-dark border border-slate-800 hover:border-emerald-400 text-left transition-colors"
            >
              <div className="font-semibold text-white">Dr. Evelyn Vance</div>
              <div className="text-[10px] text-purple-400 font-mono">Administrator</div>
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <div className="p-6 rounded-2xl bg-nexus-charcoal border border-slate-800 shadow-xl space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@nexus.eco"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-nexus-dark border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-nexus-dark border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all shadow-glow-green disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-emerald-400 font-semibold hover:underline"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
