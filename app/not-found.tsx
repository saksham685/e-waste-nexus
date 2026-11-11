import React from 'react';
import Link from 'next/link';
import {
  Compass,
  Home,
  ArrowRight,
  Truck,
  MapPin,
  Award,
  Shield,
  Layers,
} from 'lucide-react';

export default function NotFound() {
  const quickDestinations = [
    {
      title: 'Doorstep Collections & Schedule',
      desc: 'Book doorstep pickup, track calendar slots and live dispatches',
      href: '/pickups',
      icon: Truck,
      color: 'text-emerald-400',
    },
    {
      title: 'Authorized Collection Centers',
      desc: 'Search local accredited depots, operating hours & intake criteria',
      href: '/centers',
      icon: MapPin,
      color: 'text-cyan-400',
    },
    {
      title: 'EPR Credit Exchange',
      desc: 'Form-6 statutory recycling credits, trading ledger & CPCB quotas',
      href: '/epr',
      icon: Award,
      color: 'text-amber-400',
    },
    {
      title: 'Stakeholder Role Portals',
      desc: 'Logistics partner fleet dock, smelter assay and admin governance',
      href: '/partner',
      icon: Shield,
      color: 'text-lime-400',
    },
  ];

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto space-y-8">
      {/* Icon Badge */}
      <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.25)]">
        <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '24s' }} />
      </div>

      {/* Headline & Description */}
      <div className="space-y-3 max-w-xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <span>Navigation Assist &bull; 404 Route</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Unmapped Ledger Destination
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed font-normal">
          The requested record, route, or manifest does not exist in this active circular chain-of-custody. Choose any verified portal below to continue:
        </p>
      </div>

      {/* Quick Destination Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-2xl text-left">
        {quickDestinations.map((dest) => {
          const Icon = dest.icon;
          return (
            <Link
              key={dest.href}
              href={dest.href}
              className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800/80 transition-all group flex items-start space-x-3 shadow-lg"
            >
              <div className="p-2 rounded-xl bg-slate-950 border border-white/5 shrink-0 mt-0.5">
                <Icon className={`w-4 h-4 ${dest.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors flex items-center justify-between">
                  <span>{dest.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 group-hover:text-emerald-400 transition-all" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{dest.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Primary Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-glow-green hover:opacity-95 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Back to Ecosystem Overview</span>
        </Link>
        <Link
          href="/pickups"
          className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/30 text-emerald-300 hover:text-white text-xs font-semibold flex items-center space-x-2 transition-all"
        >
          <Truck className="w-4 h-4" />
          <span>Doorstep Schedule Board</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
