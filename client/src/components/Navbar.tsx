import React, { useState } from 'react';
import { useAuth, DEMO_CREDENTIALS } from '../context/AuthContext';
import { UserRole } from '../types';
import { soundEffects } from '../utils/sound';
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
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const { user, logout, switchDemoRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundEffects.isMuted());
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleNavClick = (tab: string) => {
    soundEffects.playClick();
    onNavigate(tab);
  };

  const handleToggleSound = () => {
    const nextState = soundEffects.toggleMute();
    setIsMuted(!nextState);
    if (nextState) soundEffects.playClick();
  };

  const handleDemoSwitch = async (role: UserRole) => {
    soundEffects.playSuccess();
    await switchDemoRole(role);
    setDemoDropdownOpen(false);
    if (role === 'individual') onNavigate('pickups');
    else if (role === 'partner') onNavigate('partner');
    else if (role === 'recycler') onNavigate('recycler');
    else if (role === 'admin') onNavigate('admin');
  };

  const navLinks = [
    { id: 'landing', label: 'Ecosystem', icon: Layers },
    { id: 'pickups', label: 'Schedule Pickup', icon: Truck },
    { id: 'centers', label: 'Centers', icon: MapPin },
    { id: 'epr', label: 'EPR Credits', icon: Award },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const roleTabs = [];
  if (user?.role === 'partner' || user?.role === 'admin') {
    roleTabs.push({ id: 'partner', label: 'Partner Portal', icon: Truck });
  }
  if (user?.role === 'recycler' || user?.role === 'admin') {
    roleTabs.push({ id: 'recycler', label: 'Recycler Hub', icon: Building2 });
  }
  if (user?.role === 'admin') {
    roleTabs.push({ id: 'admin', label: 'Admin Center', icon: Shield });
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-emerald-500/20 bg-nexus-dark/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => handleNavClick('landing')}
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
              </div>
              <div className="text-[9px] tracking-widest text-emerald-400/80 uppercase font-mono">
                Circular EPR Intelligence
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </button>
              );
            })}

            {/* Role Dashboards Dropdown/Tabs */}
            {roleTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleNavClick(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                      : 'text-cyan-400 hover:bg-cyan-950/40 border border-cyan-500/20'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Controls: Audio Toggle, Notifications, Persona Switcher & Profile */}
          <div className="hidden md:flex items-center space-x-2.5">
            {/* Audio Toggle */}
            <button
              onClick={handleToggleSound}
              className="p-2 rounded-xl bg-nexus-charcoal border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
              title={isMuted ? 'Unmute UI Audio' : 'Mute UI Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl bg-nexus-charcoal border border-slate-800 text-slate-400 hover:text-white relative transition-colors"
                title="System Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-nexus-charcoal border border-slate-700 shadow-2xl p-3 z-50 text-xs animate-in fade-in space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[10px] uppercase font-mono text-emerald-400 font-bold">
                    <span>System Alerts</span>
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

            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-[11px] font-mono text-emerald-300 hover:bg-emerald-900/50 transition-colors shadow-sm"
                title="Switch demo persona for testing"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="capitalize">Persona: {user?.role || 'Guest'}</span>
                <ChevronDown className="w-3 h-3 text-emerald-400" />
              </button>

              {demoDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-nexus-charcoal border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-mono text-nexus-muted tracking-wider border-b border-slate-800 mb-1">
                    Select Evaluation Persona
                  </div>
                  {(['individual', 'partner', 'recycler', 'admin'] as UserRole[]).map(role => (
                    <button
                      key={role}
                      onClick={() => handleDemoSwitch(role)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        user?.role === role
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="font-semibold capitalize">{DEMO_CREDENTIALS[role].title}</div>
                        <div className="text-[10px] text-nexus-muted font-mono">{DEMO_CREDENTIALS[role].email}</div>
                      </div>
                      {user?.role === role && <span className="text-emerald-400 text-xs font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile & Logout */}
            {user && (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold text-white truncate max-w-[110px]">{user.name}</span>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase">{user.role}</span>
                </div>
                <button
                  onClick={() => { soundEffects.playClick(); logout(); }}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={handleToggleSound}
              className="p-1.5 text-slate-400"
            >
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
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => {
                handleNavClick(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${
                currentTab === link.id
                  ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <link.icon className="w-4 h-4" />
              <span>{link.label}</span>
            </button>
          ))}

          {roleTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                handleNavClick(tab.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-cyan-300 ${
                currentTab === tab.id ? 'bg-cyan-500/20 font-semibold' : 'hover:bg-slate-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}

          <div className="pt-2 border-t border-slate-800">
            <div className="text-xs text-nexus-muted mb-2 font-mono uppercase">Quick Switch Persona:</div>
            <div className="grid grid-cols-2 gap-2">
              {(['individual', 'partner', 'recycler', 'admin'] as UserRole[]).map(role => (
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
        </div>
      )}
    </nav>
  );
};
