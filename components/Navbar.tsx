'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore, useUIStore } from '@/lib/store';
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
  Volume2,
  VolumeX,
  Bell,
  Sparkles,
  Film,
  LogIn,
  BookOpen,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { isMuted, toggleMute, setNexusGPTOpen } = useUIStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Hide Navbar completely on dedicated authentication pages for a clean full-screen experience
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const handleNavClick = () => {
    soundEffects.playClick();
    setMobileMenuOpen(false);
  };

  const handleToggleSound = () => {
    toggleMute();
    const nextState = soundEffects.toggleMute();
    if (nextState) soundEffects.playClick();
  };

  const handleLogout = () => {
    soundEffects.playClick();
    document.cookie = 'nexus_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    logout();
    window.location.href = '/logout';
  };

  const navLinks = [
    { href: '/', label: 'Overview', icon: Layers },
    { href: '/pickups', label: 'Doorstep Pickup', icon: Truck },
    { href: '/centers', label: 'Centers Map', icon: MapPin },
    { href: '/epr', label: 'EPR Exchange', icon: Award },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/cinema', label: '4K Cinema', icon: Film },
  ];

  const roleTabs = [];
  if (user?.role === 'partner' || user?.role === 'admin') {
    roleTabs.push({ href: '/partner', label: 'Logistics Dock', icon: Truck });
  }
  if (user?.role === 'recycler' || user?.role === 'admin') {
    roleTabs.push({ href: '/recycler', label: 'Smelter Hub', icon: Building2 });
  }
  if (user?.role === 'admin') {
    roleTabs.push({ href: '/admin', label: 'CPCB Audit', icon: Shield });
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/85 backdrop-blur-2xl border-b border-white/[0.08] transition-all">
      {/* Top subtle glow line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link
            href="/"
            onClick={handleNavClick}
            className="flex items-center space-x-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-0.5 shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Recycle className="w-5 h-5 text-emerald-400 group-hover:rotate-45 transition-transform duration-500" />
              </div>
            </div>
            <div>
              <div className="text-base font-black tracking-tight text-white flex items-center space-x-1.5 font-sans">
                <span>E-WASTE</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  NEXUS
                </span>
              </div>
              <div className="text-[9px] tracking-widest text-slate-400 font-mono uppercase">
                Circular Operating System
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 p-1 rounded-2xl bg-slate-900/60 border border-white/[0.06]">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Role-Specific Portal Links */}
            {roleTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={handleNavClick}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                      : 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Ask AI Pill Trigger */}
            <button
              onClick={() => {
                soundEffects.playClick();
                setNexusGPTOpen(true);
              }}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-purple-500/10 border border-white/10 hover:border-emerald-500/40 text-xs font-semibold text-emerald-300 hover:text-white transition-all duration-200 cursor-pointer shadow-sm group"
              title="Open NexusGPT 4.0 AI Assistant"
            >
              <div className="relative flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute" />
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
              </div>
              <span className="font-mono">Ask AI</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-white/[0.06] text-slate-400 font-mono">
                ⌘K
              </span>
            </button>

            {/* Audio Toggle Button */}
            <button
              onClick={handleToggleSound}
              className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors cursor-pointer"
              title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* User Profile & Session Controls */}
            {user ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-white/10">
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-2 p-1.5 pr-3 rounded-2xl bg-slate-900 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-purple-500 to-cyan-400 p-0.5 flex items-center justify-center">
                      <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-white font-bold text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="text-left hidden lg:block">
                      <div className="text-xs font-bold text-white leading-tight truncate max-w-[100px]">
                        {user.name}
                      </div>
                      <div className="text-[9px] font-mono text-emerald-400 uppercase leading-tight">
                        {user.role}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-950 border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in space-y-1">
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-0.5">
                        <div className="text-xs font-bold text-white truncate">{user.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">{user.email}</div>
                        <div className="text-[9px] font-mono text-emerald-400 uppercase pt-1">
                          Role: {user.role}
                        </div>
                      </div>

                      <Link
                        href="/pickups"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                      >
                        <Truck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>My Consignments</span>
                      </Link>

                      <Link
                        href="/epr"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                      >
                        <Award className="w-3.5 h-3.5 text-cyan-400" />
                        <span>EPR Credit Ledger</span>
                      </Link>

                      <div className="pt-1 border-t border-white/10">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 pl-2 border-l border-white/10">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 hover:opacity-95 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex xl:hidden items-center space-x-2">
            <button
              onClick={handleToggleSound}
              className="p-2 text-slate-400 hover:text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-950 border-b border-white/10 px-4 py-4 space-y-2 animate-page-enter-3d">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  className={`flex items-center space-x-2 p-2.5 rounded-xl text-xs font-medium ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-900/80 text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {user && (
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                Logged in as <strong className="text-white">{user.name}</strong>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
