'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Truck, Cpu, Award, ArrowUpRight } from 'lucide-react';

interface AuditItem {
  id: string;
  type: 'pickup' | 'weight' | 'refine' | 'epr';
  title: string;
  subtitle: string;
  time: string;
  hash: string;
}

const INITIAL_EVENTS: AuditItem[] = [
  {
    id: 'ev-1',
    type: 'pickup',
    title: 'Decommissioned Server Rack Picked Up',
    subtitle: 'Silicon Valley Innovation Hub • Chain-of-Custody Manifest #4092',
    time: '2 mins ago',
    hash: '0x8f2a...c31e',
  },
  {
    id: 'ev-2',
    type: 'weight',
    title: 'Calibrated Scale Certification: 142.8 kg',
    subtitle: 'Apex Green Fleet Freight Depot #2 • Tare Verified',
    time: '8 mins ago',
    hash: '0x3b19...fa88',
  },
  {
    id: 'ev-3',
    type: 'refine',
    title: 'Hydrometallurgy Gold Yield: 48.2g Au (99.9%)',
    subtitle: 'EcoRefine Processing Plant #4 • Zero Cyanide Leaching',
    time: '14 mins ago',
    hash: '0x99e4...10d2',
  },
  {
    id: 'ev-4',
    type: 'epr',
    title: 'EPR Credit Certificate Minted (#EPR-2026-994)',
    subtitle: 'Central Pollution Control Board Registry • Compliance Credit',
    time: '21 mins ago',
    hash: '0x12c8...8e44',
  },
];

export const LiveActivityFeed: React.FC = () => {
  const [events, setEvents] = useState<AuditItem[]>(INITIAL_EVENTS);

  useEffect(() => {
    const timer = setInterval(() => {
      const types: ('pickup' | 'weight' | 'refine' | 'epr')[] = ['pickup', 'weight', 'refine', 'epr'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const cities = ['Bengaluru', 'Tokyo', 'San Jose', 'Berlin', 'Munich', 'Singapore', 'Austin'];
      const city = cities[Math.floor(Math.random() * cities.length)];

      const newEvent: AuditItem = {
        id: `ev-${Date.now()}`,
        type: randomType,
        title:
          randomType === 'pickup'
            ? `Smart Pickup Dispatched in ${city}`
            : randomType === 'weight'
            ? `Certified Gross Weight Entry: ${(Math.random() * 50 + 10).toFixed(1)} kg`
            : randomType === 'refine'
            ? `Precious Metal Lot Refining Verified (${city})`
            : `Statutory EPR Credit Disbursed`,
        subtitle: `Cryptographic Hash Recorded • Tamper-Evident Ledger`,
        time: 'Just now',
        hash: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 4)]);
    }, 12000);

    return () => clearInterval(timer);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'pickup':
        return <Truck className="w-4 h-4 text-cyan-400" />;
      case 'weight':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'refine':
        return <Cpu className="w-4 h-4 text-amber-400" />;
      case 'epr':
        return <Award className="w-4 h-4 text-lime-400" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="w-full bg-nexus-dark/80 border border-emerald-500/20 rounded-3xl p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Live Circular Audit Stream
          </h3>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          Sync: Realtime
        </span>
      </div>

      <div className="space-y-3">
        {events.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-2xl bg-nexus-card/70 border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-nexus-dark border border-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                {getIcon(item.type)}
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gray-200 group-hover:text-emerald-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-gray-400">{item.subtitle}</p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] font-mono text-emerald-400/80 block">{item.hash}</span>
              <span className="text-[10px] font-mono text-gray-500">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
