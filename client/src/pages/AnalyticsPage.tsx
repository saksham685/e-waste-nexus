import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Zap,
  Activity,
  Droplets,
  ShieldAlert,
  Info,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

const COLORS = ['#22c55e', '#06b6d4', '#10b981', '#3b82f6', '#a855f7', '#f59e0b', '#ec4899'];

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const res = await api.analytics.getMetrics();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-nexus-muted">
        Loading environmental telemetry data...
      </div>
    );
  }

  const { metrics, categoryBreakdown, monthlyTrends, partnerPerformance, regionalDistribution, disclaimer } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-nexus-charcoal via-nexus-card to-nexus-charcoal border border-emerald-500/30">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-1 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            <span>Circularity Telemetry & Life-Cycle Analysis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Analytics & Environmental Accounting
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Empirical material recovery volumes, avoided greenhouse gases, and logistics partner performance.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-nexus-dark px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Real-time EPA WEEE Model</span>
        </div>
      </div>

      {/* Top Avoided Environmental Impact Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-nexus-charcoal border border-slate-800">
          <div className="text-xs text-nexus-muted mb-1 flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Modeled CO₂e Avoided</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {metrics.co2eAvoidedKg.toLocaleString()} <span className="text-xs font-normal">kg</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Equivalent to ~85 mature trees planted</div>
        </div>

        <div className="p-4 rounded-xl bg-nexus-charcoal border border-slate-800">
          <div className="text-xs text-nexus-muted mb-1 flex items-center space-x-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
            <span>Toxic Heavy Metals Diverted</span>
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-300">
            {metrics.toxicSubstancesDivertedKg.toLocaleString()} <span className="text-xs font-normal">kg</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Lead, mercury, and cadmium contained</div>
        </div>

        <div className="p-4 rounded-xl bg-nexus-charcoal border border-slate-800">
          <div className="text-xs text-nexus-muted mb-1 flex items-center space-x-1.5">
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
            <span>Groundwater Runoff Saved</span>
          </div>
          <div className="text-2xl font-bold font-mono text-blue-400">
            {metrics.waterPollutionAvoidedLiters.toLocaleString()} <span className="text-xs font-normal">liters</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Aquifer contamination averted</div>
        </div>

        <div className="p-4 rounded-xl bg-nexus-charcoal border border-slate-800">
          <div className="text-xs text-nexus-muted mb-1 flex items-center space-x-1.5">
            <Activity className="w-3.5 h-3.5 text-lime-400" />
            <span>End-to-End Completion Rate</span>
          </div>
          <div className="text-2xl font-bold font-mono text-lime-400">
            {metrics.completionRate}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">From doorstep to recycler assay</div>
        </div>
      </div>

      {/* Charts Grid Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chart 1: Monthly Collection Trends (Area Chart) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-nexus-charcoal border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-mono">
                Monthly E-Waste Volume & EPR Credit Trajectory
              </h3>
              <p className="text-xs text-slate-400">Gross intake vs refined output vs credits issued</p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">Kilograms & Units</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCredits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0e131d', borderColor: '#334155', borderRadius: 8, fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Area type="monotone" dataKey="collectedKg" name="Collected (kg)" stroke="#22c55e" fillOpacity={1} fill="url(#colorCollected)" />
                <Area type="monotone" dataKey="eprCredits" name="EPR Credits Issued" stroke="#06b6d4" fillOpacity={1} fill="url(#colorCredits)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Waste Category Volume Breakdown (Donut/Pie Chart) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-nexus-charcoal border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase font-mono">Category Volume Share</h3>
            <p className="text-xs text-slate-400">Total weight distribution by electronic category</p>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="weightKg"
                  nameKey="name"
                >
                  {categoryBreakdown.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0e131d', borderColor: '#334155', borderRadius: 8, fontSize: 12 }}
                  formatter={(val: any) => [`${val} kg`, 'Weight']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-2 text-[10px]">
            {categoryBreakdown.slice(0, 4).map((c: any, i: number) => (
              <div key={i} className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-slate-300 truncate max-w-[100px]">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Grid Row 2: Regional Distribution & Partner Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Regional Distribution */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-nexus-charcoal border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase font-mono">
              Regional Collection Volume (kg)
            </h3>
            <p className="text-xs text-slate-400">Geographic concentration across certified municipal corridors</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalDistribution} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis dataKey="region" type="category" stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0e131d', borderColor: '#334155', borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="weightKg" name="Collected Weight (kg)" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Partner Performance Metrics */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-nexus-charcoal border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase font-mono">
              Logistics Fleet Performance
            </h3>
            <p className="text-xs text-slate-400">Authorized partners by completed pickups & weight intake</p>
          </div>

          <div className="space-y-3">
            {partnerPerformance.map((p: any) => (
              <div key={p.partnerId} className="p-3.5 rounded-xl bg-nexus-dark border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-white">{p.organization}</div>
                  <div className="text-[10px] text-slate-400">Operator: {p.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-400">{p.totalWeightKg} kg</div>
                  <div className="text-[10px] text-slate-500">{p.completedCollections} collections • ★ {p.rating}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mandatory Regulatory & Environmental Modeling Disclosure */}
      <div className="p-4 rounded-xl bg-nexus-dark border border-slate-800 text-[11px] text-slate-400 leading-relaxed flex items-start space-x-3">
        <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-white font-semibold">Methodological Governance Note: </span>
          {disclaimer}
        </div>
      </div>
    </div>
  );
};
