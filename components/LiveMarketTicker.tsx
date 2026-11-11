'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { TrendingUp, TrendingDown, Radio, Activity, Sparkles, Globe } from 'lucide-react';

interface CommodityItem {
  id: string;
  name: string;
  symbol: string;
  chemicalSymbol: string;
  pricePerUnit: number;
  unit: string;
  change24h: number;
  trend: 'up' | 'down';
}

const INITIAL_COMMODITIES: CommodityItem[] = [
  { id: 'gold', name: 'Gold (24K Recovered)', symbol: 'Au', chemicalSymbol: 'Au', pricePerUnit: 88420, unit: '10g', change24h: +1.65, trend: 'up' },
  { id: 'silver', name: 'Silver (99.9%)', symbol: 'Ag', chemicalSymbol: 'Ag', pricePerUnit: 98150, unit: 'kg', change24h: +2.18, trend: 'up' },
  { id: 'copper', name: 'Grade-A Copper', symbol: 'Cu', chemicalSymbol: 'Cu', pricePerUnit: 894, unit: 'kg', change24h: +0.92, trend: 'up' },
  { id: 'palladium', name: 'Palladium', symbol: 'Pd', chemicalSymbol: 'Pd', pricePerUnit: 3180, unit: 'g', change24h: +1.45, trend: 'up' },
  { id: 'lithium', name: 'Lithium (Battery)', symbol: 'Li', chemicalSymbol: 'Li', pricePerUnit: 1460, unit: 'kg', change24h: -0.35, trend: 'down' },
  { id: 'cobalt', name: 'Refined Cobalt', symbol: 'Co', chemicalSymbol: 'Co', pricePerUnit: 2840, unit: 'kg', change24h: +0.48, trend: 'up' },
];

export const LiveMarketTicker: React.FC = () => {
  const pathname = usePathname();
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const [commodities, setCommodities] = useState<CommodityItem[]>(INITIAL_COMMODITIES);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Live');

  // Real-time polling from Next.js Route Handler /api/market-rates every 12 seconds
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('/api/market-rates');
        const data = await res.json();
        if (data.success && data.commodities) {
          setCommodities(data.commodities);
          setLastRefreshed(new Date().toLocaleTimeString());
        }
      } catch (err) {
        // Fallback gracefully
      }
    };

    const interval = setInterval(fetchRates, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-nexus-dark/95 border-b border-emerald-500/20 backdrop-blur-md overflow-hidden select-none relative z-30 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left Pulse Badge */}
        <div className="flex items-center space-x-2 shrink-0 pr-3 border-r border-emerald-500/20 text-xs font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px] hidden sm:inline">
            Global Urban Mining Spot
          </span>
          <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px] sm:hidden">
            Spot Rates
          </span>
        </div>

        {/* Scrolling Commodities Ticker */}
        <div className="flex-1 overflow-x-auto no-scrollbar py-0.5 flex items-center space-x-6 text-xs font-mono">
          {commodities.map((item) => {
            const isUp = item.change24h >= 0;
            return (
              <div
                key={item.id}
                className="inline-flex items-center space-x-2 shrink-0 py-0.5 px-2 rounded-lg bg-nexus-card/60 border border-emerald-500/10 hover:border-emerald-500/30 transition-colors"
              >
                <span className="text-gray-400 font-semibold">{item.symbol}:</span>
                <span className="text-white font-bold">
                  ₹{item.pricePerUnit.toLocaleString('en-IN')}/{item.unit}
                </span>
                <span
                  className={`inline-flex items-center space-x-0.5 text-[10px] font-bold ${
                    isUp ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {isUp ? (
                    <TrendingUp className="w-3 h-3 stroke-[2.5]" />
                  ) : (
                    <TrendingDown className="w-3 h-3 stroke-[2.5]" />
                  )}
                  <span>
                    {isUp ? '+' : ''}
                    {item.change24h}%
                  </span>
                </span>
              </div>
            );
          })}
        </div>

        {/* Right Timestamp Indicator */}
        <div className="hidden lg:flex items-center space-x-2 text-[10px] font-mono text-gray-400 shrink-0 pl-3 border-l border-emerald-500/20">
          <Activity className="w-3 h-3 text-emerald-400" />
          <span>CPCB/LME Feed: {lastRefreshed}</span>
        </div>
      </div>
    </div>
  );
};
