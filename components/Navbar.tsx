'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore, useUIStore, DEMO_USERS } from '@/lib/store';
import { UserRole } from '@/lib/types';
import { soundEffects } from '@/lib/sound';
import {
  Recycle,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Shield,
  Layers,
  BarChart3,
  MapPin,
  Truck,
  Building2,
  Award,
  ChevronDown,
  Volume2,
  VolumeX,
  Bell,
  Sparkles,
  Film,
  LogIn,
  BookOpen
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, switchDemoRole } = useAuthStore();
  const { isMuted, toggleMute, setNexusGPTOpen } = useUIStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleNavClick = () => {
    soundEffects.playClick();
  };

  const handleToggleSound = () => {
    toggleMute();
    const nextState = soundEffects.toggleMute();
    if (nextState) soundEffects.playClick();
  };

  const handleDemoSwitch = (role: UserRole) => {
    soundEffects.playSuccess();
    switchDemoRole(role);
    setDemoDropdownOpen(false);
    if (role === 'individual') router.push('/pickups');
    else if (role === 'partner') router.push('/partner');
    else if (role === 'recycler') router.push('/recycler');
    else if (role === 'admin') router.push('/admin');
  };

  const handleLogout = () => {
    soundEffects.playClick();
    document.cookie = 'nexus_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    logout();
    window.location.href = '/logout';
  };

  const navLinks = [
    { href: '/', label: 'Ecosystem', icon: Layers },
    { href: '/pickups', label: 'Schedule Pickup', icon: Truck },
    { href: '/centers', label: 'Centers', icon: MapPin },
    { href: '/epr', label: 'EPR Credits', icon: Award },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/cinema', label: 'Video Cinema', icon: Film, is4K: true },
    { href: '/syllabus', label: 'Syllabus Map', icon: BookOpen },
  ];

  const roleTabs = [];
  if (user?.role === 'partner' || user?.role === 'admin') {
    roleTabs.push({ href: '/partner', label: 'Partner Portal', icon: Truck });
  }
  if (user?.role === 'recycler' || user?.role === 'admin') {
    roleTabs.push({ href: '/recycler', label: 'Recycler Hub', icon: Building2 });
  }
  if (user?.role === 'admin') {
    roleTabs.push({ href: '/admin', label: 'Admin Center', icon: Shield });
  }

  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-emerald-500/20 bg-nexus-dark/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            onClick={handleNavClick}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-lime-400 p-0.5 shadow-glow-green group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-nexus-dark rounded-[10px] flex items-center justify-center">
                <Recycle className="w-5 h-5 text-emerald-400 group-hover:rotate-45 transition-transform duration-500" />
              </div>
            </div>
            <div>
              <div className="text-base font-extrabold tracking-tight text-white flex items-center space-x-1 font-sans">
                <span>E-WASTE</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-400">
                  NEXUS
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  NEXT.JS
                </span>
              </div>
              <div className="text-[9px] tracking-widest text-emerald-400/80 uppercase font-mono">
                Circular EPR Intelligence
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                  {link.is4K && (
                    <span className="text-[9px] font-mono px-1 rounded bg-red-500/30 border border-red-500/50 text-red-300 font-bold uppercase animate-pulse">
                      4K
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Role Dashboards Links */}
            {roleTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={handleNavClick}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                      : 'text-cyan-400 hover:bg-cyan-950/40 border border-cyan-500/20'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Controls */}
          <div className="hidden md:flex items-center space-x-2.5">
            {/* Ask NexusGPT Trigger */}
            <button
              onClick={() => {
                soundEffects.playClick();
                setNexusGPTOpen(true);
              }}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-lime-500/20 border border-emerald-500/40 hover:border-emerald-400 text-xs font-semibold text-emerald-300 hover:text-white transition-all shadow-glow-green cursor-pointer group"
              title="Open ChatGPT-style AI Assistant (Written & Spoken Answers)"
            >
              <div className="relative flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute" />
                <Sparkles className="w-3.5 h-3.5 text-lime-400 group-hover:rotate-12 transition-transform" />
              </div>
              <span className="font-mono">Ask NexusGPT</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 uppercase tracking-widest font-mono">
                AI
              </span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={handleToggleSound}
              className="p-2 rounded-xl bg-nexus-charcoal border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors cursor-pointer"
              title={isMuted ? 'Unmute UI Audio' : 'Mute UI Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl bg-nexus-charcoal border border-slate-800 text-slate-400 hover:text-white relative transition-colors cursor-pointer"
                title="System Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-nexus-charcoal border border-slate-700 shadow-2xl p-3 z-50 text-xs animate-in fade-in space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[10px] uppercase font-mono text-emerald-400 font-bold">
                    <span>System Alerts (Next.js Stream)</span>
                    <button onClick={() => setNotificationsOpen(false)}>✕</button>
                  </div>
                  <div className="p-2 rounded-lg bg-nexus-dark border border-slate-800 space-y-1">
                    <div className="font-semibold text-white">Chain-of-Custody Verified</div>
                    <p className="text-[11px] text-slate-400">14.5 kg server assets cleared pyrometallurgy assay.</p>
                    <span className="text-[9px] text-emerald-400 font-mono">10m ago</span>
                  </div>
                  <div className="p-2 rounded-lg bg-nexus-dark border border-slate-800 space-y-1">
                    <div className="font-semibold text-white">EPR Compliance Pool Updated</div>
                    <p className="text-[11px] text-slate-400">16.2 credits approved for Q4 retirement window.</p>
                    <span className="text-[9px] text-cyan-400 font-mono">25m ago</span>
                  </div>
                </div>
              )}
            </div>



            {/* Profile, Switch & Prominent Logout */}
            {user ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                <div className="hidden xl:flex items-center space-x-2 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-white truncate max-w-[90px] leading-tight">{user.name}</span>
                    <span className="text-[9px] font-mono text-emerald-400 uppercase leading-tight">{user.role}</span>
                  </div>
                </div>

                <Link
                  href="/login"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Switch account"
                >
                  <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>Switch</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-red-950/60 border border-red-500/40 hover:bg-red-900/80 hover:border-red-400 text-xs font-bold text-red-300 hover:text-white transition-all shadow-sm cursor-pointer group"
                  title="Logout of E-Waste Nexus"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-400 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                <Link
                  href="/login"
                  onClick={handleNavClick}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-bold text-xs transition-all cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/signup"
                  onClick={handleNavClick}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-950 font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-glow-green cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <button onClick={handleToggleSound} className="p-1.5 text-slate-400">
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-nexus-charcoal px-4 pt-2 pb-4 space-y-2">
          {/* Mobile NexusGPT CTA */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setNexusGPTOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-lime-500/20 border border-emerald-500/40 text-emerald-300 font-semibold text-xs"
          >
            <span className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-lime-400" />
              <span>Ask NexusGPT AI (Write & Speak)</span>
            </span>
            <span className="text-[10px] font-mono uppercase bg-emerald-500/30 px-2 py-0.5 rounded-full text-white">OPEN</span>
          </button>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => {
                handleNavClick();
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${
                pathname === link.href ? 'bg-emerald-500/20 text-emerald-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <link.icon className="w-4 h-4" />
              <span>{link.label}</span>
              {link.is4K && (
                <span className="text-[9px] font-mono px-1 rounded bg-red-500/30 text-red-300 uppercase font-bold ml-auto">
                  4K
                </span>
              )}
            </Link>
          ))}

          {roleTabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={() => {
                handleNavClick();
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-cyan-300 ${
                pathname === tab.href ? 'bg-cyan-500/20 font-semibold' : 'hover:bg-slate-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </Link>
          ))}

          <div className="pt-2 border-t border-slate-800">
            <div className="text-xs text-nexus-muted mb-2 font-mono uppercase">Quick Switch Persona:</div>
            <div className="grid grid-cols-2 gap-2">
              {(['individual', 'partner', 'recycler', 'admin'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    handleDemoSwitch(role);
                    setMobileMenuOpen(false);
                  }}
                  className="px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-emerald-400 capitalize hover:border-emerald-500 text-left"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            {user ? (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center space-x-1.5"
                >
                  <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>Switch</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="p-2.5 rounded-xl bg-red-950/70 border border-red-500/40 text-xs font-bold text-red-300 flex items-center justify-center space-x-1.5"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-400" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Login / Sign In</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
