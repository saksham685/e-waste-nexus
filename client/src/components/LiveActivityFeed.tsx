import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Truck, Recycle, Award, Sparkles } from 'lucide-react';

interface ActivityItem {
  id: string;
  actor: string;
  role: string;
  action: string;
  location: string;
  timeAgo: string;
  icon: any;
  color: string;
}

const INITIAL_ACTIVITIES: ActivityItem[] = [
  { id: 'act_1', actor: 'GreenRoute Fleet #04', role: 'Partner', action: 'Collected 14.5 kg laptops & servers', location: 'San Jose, CA', timeAgo: '2m ago', icon: Truck, color: 'text-emerald-400' },
  { id: 'act_2', actor: 'Dr. Evelyn Vance', role: 'Admin', action: 'Certified scale calibration #COL-201', location: 'Central QA Vault', timeAgo: '4m ago', icon: ShieldCheck, color: 'text-purple-400' },
  { id: 'act_3', actor: 'AeroSmelt Refining', role: 'Recycler', action: 'Achieved 98.1% Lithium recovery yield', location: 'Nevada Smelter', timeAgo: '9m ago', icon: Recycle, color: 'text-cyan-400' },
  { id: 'act_4', actor: 'OmniConsumer Tech', role: 'Enterprise', action: 'Retired 16.2 EPR Compliance Credits', location: 'Registry Pool', timeAgo: '14m ago', icon: Award, color: 'text-lime-400' },
  { id: 'act_5', actor: 'Pacific Terminal', role: 'Hub', action: 'Inbound 68.0 kg display glass quarantined', location: 'Seattle, WA', timeAgo: '21m ago', icon: Activity, color: 'text-emerald-400' },
];

export const LiveActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % activities.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [activities.length]);

  const current = activities[activeIndex];
  const Icon = current.icon;

  return (
    <div className="w-full bg-nexus-charcoal/90 border-y border-emerald-500/20 py-2.5 px-4 backdrop-blur-md relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
        {/* Left Badge */}
        <div className="flex items-center space-x-2 shrink-0 pr-4 border-r border-slate-800">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Live Circular Stream</span>
          </span>
        </div>

        {/* Center Animated Activity Item */}
        <div className="flex-1 px-4 flex items-center space-x-3 overflow-hidden">
          <div className="flex items-center space-x-2 text-slate-200 truncate animate-in fade-in duration-500">
            <div className={`p-1 rounded-md bg-nexus-dark border border-slate-800 ${current.color}`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-white">{current.actor}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
              {current.role}
            </span>
            <span className="text-slate-400 hidden sm:inline">— {current.action}</span>
            <span className="text-nexus-muted text-[11px] hidden md:inline">({current.location})</span>
          </div>
        </div>

        {/* Right Timestamp & SLA */}
        <div className="shrink-0 pl-4 border-l border-slate-800 text-[11px] font-mono text-slate-400 hidden sm:flex items-center space-x-2">
          <span className="text-emerald-400 font-semibold">{current.timeAgo}</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-500">EPA Audit Sync 100%</span>
        </div>
      </div>
    </div>
  );
};
