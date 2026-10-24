import React, { useState, useEffect, useRef } from 'react';
import { useAuth, DEMO_CREDENTIALS } from '../context/AuthContext';
import { UserRole } from '../types';
import { soundEffects } from '../utils/sound';
import { voiceAssistant } from '../utils/voiceAssistant';
import * as THREE from 'three';
import {
  Shield,
  Lock,
  Mail,
  User as UserIcon,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Recycle,
  Cpu,
  KeyRound,
  Terminal,
  Building,
  Fingerprint
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthGateProps {
  onAuthorized: () => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({ onAuthorized }) => {
  const { login, register, switchDemoRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loadingRole, setLoadingRole] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  // Terminal log animation
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'INIT: Quantum TLS 1.3 handshaking with Node #819...',
    'AUTH: Zero-Knowledge chain-of-custody active',
    'GOV: WEEE ISO 14001 compliance standards loaded',
    'READY: Clearance verification required to proceed.'
  ]);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('individual');
  const [organization, setOrganization] = useState('');

  // 3D Emblem Canvas Ref
  const emblemMountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = emblemMountRef.current;
    if (!container) return;

    const width = 140;
    const height = 140;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 22;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Torus Ring
    const torusGeo = new THREE.TorusGeometry(6.5, 0.4, 16, 32);
    const torusMat = new THREE.MeshBasicMaterial({ color: 0x22c55e, wireframe: true });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    group.add(torus);

    // Core Octahedron
    const coreGeo = new THREE.OctahedronGeometry(4, 0);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Orbiting Satellites
    const satGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const satMat = new THREE.MeshBasicMaterial({ color: 0x4ade80 });
    const satellites: THREE.Mesh[] = [];

    for (let i = 0; i < 3; i++) {
      const sat = new THREE.Mesh(satGeo, satMat);
      group.add(sat);
      satellites.push(sat);
    }

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      group.rotation.y += 0.015;
      group.rotation.x = Math.sin(Date.now() * 0.001) * 0.2;
      core.rotation.y -= 0.02;

      satellites.forEach((sat, idx) => {
        const angle = (Date.now() * 0.002) + (idx * (Math.PI * 2 / 3));
        sat.position.set(Math.cos(angle) * 8.5, Math.sin(angle) * 3, Math.sin(angle) * 8.5);
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const handle1ClickLogin = async (role: UserRole) => {
    soundEffects.playClick();
    setLoadingRole(role);
    setError('');
    try {
      await switchDemoRole(role);
      soundEffects.playUnlock();
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      const titles: Record<UserRole, string> = {
        admin: 'Global Administrator',
        partner: 'Logistics Fleet Partner',
        recycler: 'Certified Recycler',
        individual: 'Consumer Member'
      };
      voiceAssistant.speak(`Welcome to E-Waste Nexus. Clearance granted as ${titles[role]}. Chain of custody node active.`);
      onAuthorized();
    } catch (err: any) {
      setError(err.message || 'Authorization failed');
    } finally {
      setLoadingRole(null);
    }
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playClick();
    setLoadingRole('manual');
    setError('');
    try {
      await login(email, password);
      soundEffects.playUnlock();
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      voiceAssistant.speak('Authentication successful. Welcome to E-Waste Nexus platform.');
      onAuthorized();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoadingRole(null);
    }
  };

  const handleManualRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playClick();
    setLoadingRole('register');
    setError('');
    try {
      await register({
        name,
        email,
        password,
        role: selectedRole,
        organization
      });
      soundEffects.playUnlock();
      confetti({ particleCount: 100, spread: 90, origin: { y: 0.6 } });
      voiceAssistant.speak('Registration complete. Welcome to E-Waste Nexus.');
      onAuthorized();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoadingRole(null);
    }
  };

  const handleSSO = () => {
    soundEffects.playClick();
    alert('Connecting to Enterprise IdP (Okta / Azure AD SAML 2.0). Fast-forwarding via Demo Credentials.');
    handle1ClickLogin('admin');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative z-20 py-12">
      <div className="w-full max-w-xl space-y-6">
        {/* Holographic 3D Header Emblem */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div ref={emblemMountRef} className="w-36 h-36 flex items-center justify-center drop-shadow-[0_0_25px_rgba(34,197,94,0.4)]" />

          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-red-950/70 border border-red-500/40 text-[11px] font-mono text-red-300">
            <Lock className="w-3 h-3 text-red-400 animate-pulse" />
            <span>AUTHENTICATION GATEWAY — PLATFORM ACCESS RESTRICTED</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            E-WASTE <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-400">NEXUS</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
            Please authenticate to unlock the circular platform, chain-of-custody tracking, and Extended Producer Responsibility (EPR) credit ledger.
          </p>

          {/* Compliance Stamps */}
          <div className="flex items-center space-x-3 text-[10px] font-mono text-slate-400">
            <span className="px-2 py-0.5 rounded bg-nexus-charcoal border border-slate-800">SOC 2 Type II</span>
            <span className="px-2 py-0.5 rounded bg-nexus-charcoal border border-slate-800">ISO 14001 WEEE</span>
            <span className="px-2 py-0.5 rounded bg-nexus-charcoal border border-slate-800">TLS 1.3 Strict</span>
          </div>
        </div>

        {/* 1-Click Fast Pass Box */}
        <div className="p-6 rounded-3xl bg-nexus-charcoal/95 border border-emerald-500/40 shadow-2xl backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-emerald-300 uppercase">
                1-Click Instant Evaluation Pass
              </span>
            </div>
            <span className="text-[10px] text-nexus-muted font-mono">Bypass typing for live grading</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Admin Pass */}
            <button
              onClick={() => handle1ClickLogin('admin')}
              disabled={!!loadingRole}
              className="p-3.5 rounded-2xl bg-nexus-dark/90 border border-slate-800 hover:border-emerald-400 hover:bg-emerald-950/30 text-left transition-all group flex items-center justify-between shadow-sm"
            >
              <div>
                <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  <span>Dr. Evelyn Vance</span>
                </div>
                <div className="text-[10px] text-purple-400 font-mono mt-0.5">Global Administrator</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </button>

            {/* Partner Pass */}
            <button
              onClick={() => handle1ClickLogin('partner')}
              disabled={!!loadingRole}
              className="p-3.5 rounded-2xl bg-nexus-dark/90 border border-slate-800 hover:border-cyan-400 hover:bg-cyan-950/30 text-left transition-all group flex items-center justify-between shadow-sm"
            >
              <div>
                <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <Recycle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Marcus Sterling</span>
                </div>
                <div className="text-[10px] text-cyan-400 font-mono mt-0.5">Logistics Fleet Partner</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </button>

            {/* Recycler Pass */}
            <button
              onClick={() => handle1ClickLogin('recycler')}
              disabled={!!loadingRole}
              className="p-3.5 rounded-2xl bg-nexus-dark/90 border border-slate-800 hover:border-lime-400 hover:bg-lime-950/30 text-left transition-all group flex items-center justify-between shadow-sm"
            >
              <div>
                <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5 text-lime-400" />
                  <span>Elena Rostova</span>
                </div>
                <div className="text-[10px] text-lime-400 font-mono mt-0.5">Certified Recycler Hub</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-lime-400 group-hover:translate-x-1 transition-all" />
            </button>

            {/* Individual Pass */}
            <button
              onClick={() => handle1ClickLogin('individual')}
              disabled={!!loadingRole}
              className="p-3.5 rounded-2xl bg-nexus-dark/90 border border-slate-800 hover:border-emerald-400 hover:bg-emerald-950/30 text-left transition-all group flex items-center justify-between shadow-sm"
            >
              <div>
                <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sarah Jenkins</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Individual Consumer</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>

        {/* Credentials Form Terminal */}
        <div className="p-6 rounded-3xl bg-nexus-charcoal/95 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setError(''); soundEffects.playClick(); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'login'
                  ? 'bg-emerald-500 text-slate-950 shadow-glow-green'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Direct Credentials Sign In
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setError(''); soundEffects.playClick(); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'register'
                  ? 'bg-emerald-500 text-slate-950 shadow-glow-green'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register New Persona
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleManualLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@nexus.eco"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-nexus-dark border border-slate-800 text-xs text-white outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
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

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loadingRole === 'manual'}
                  className="flex-1 py-3 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all shadow-glow-green disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{loadingRole === 'manual' ? 'Verifying...' : 'Authenticate & Unlock'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSSO}
                  className="px-4 py-3 rounded-xl text-xs font-semibold bg-nexus-dark border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition-colors flex items-center space-x-1.5"
                  title="Corporate Single Sign-On"
                >
                  <Fingerprint className="w-4 h-4 text-cyan-400" />
                  <span className="hidden sm:inline">SSO</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleManualRegister} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-3 py-2 rounded-xl bg-nexus-dark border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Role Persona</label>
                  <select
                    value={selectedRole}
                    onChange={e => setSelectedRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl bg-nexus-dark border border-slate-800 text-xs text-white outline-none capitalize"
                  >
                    <option value="individual">Individual Consumer</option>
                    <option value="partner">Logistics Partner</option>
                    <option value="recycler">Certified Recycler</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@nexus.eco"
                  className="w-full px-3 py-2 rounded-xl bg-nexus-dark border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full px-3 py-2 rounded-xl bg-nexus-dark border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={loadingRole === 'register'}
                className="w-full py-3 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all shadow-glow-green disabled:opacity-50 mt-1"
              >
                {loadingRole === 'register' ? 'Registering...' : 'Complete Registration & Enter'}
              </button>
            </form>
          )}

          {/* Terminal Console Output */}
          <div className="p-3 rounded-xl bg-nexus-dark border border-slate-900 font-mono text-[10px] text-slate-500 space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-400/80 mb-1">
              <Terminal className="w-3 h-3" />
              <span>TLS Security Terminal Trace</span>
            </div>
            {terminalLogs.map((log, i) => (
              <div key={i} className="truncate">{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
