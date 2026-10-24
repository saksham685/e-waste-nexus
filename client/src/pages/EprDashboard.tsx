import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { EPRRecord } from '../types';
import {
  Award,
  Download,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  Layers,
  Sparkles,
  Info,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const EprDashboard: React.FC = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<EPRRecord[]>([]);
  const [summary, setSummary] = useState({
    totalApprovedCredits: 0,
    pendingReviewCredits: 0,
    totalEligibleWeightKg: 0,
    totalRecords: 0
  });
  const [conversionFactors, setConversionFactors] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [message, setMessage] = useState<string>('');

  const loadEprData = async () => {
    setLoading(true);
    try {
      const res = await api.epr.getAll();
      if (res.success) {
        setRecords(res.records);
        setSummary(res.summary);
        setConversionFactors(res.conversionFactors || {});
      }
    } catch (err) {
      console.error('Failed to load EPR records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEprData();
  }, [user]);

  const handleApprove = async (id: string) => {
    try {
      const res = await api.epr.approve(id, {
        approvalStatus: 'Approved',
        creditStatus: 'Available',
        notes: 'Compliance criteria validated against recycler assay logs.'
      });
      if (res.success) {
        confetti({ particleCount: 70, spread: 80 });
        setMessage(`EPR Credit record #${id} successfully APPROVED.`);
        await loadEprData();
      }
    } catch (err: any) {
      alert(err.message || 'Approval action failed');
    }
  };

  const handleFlag = async (id: string) => {
    const reason = prompt('Enter compliance flag reason:');
    if (!reason) return;
    try {
      const res = await api.epr.approve(id, {
        approvalStatus: 'Flagged',
        creditStatus: 'Rejected',
        notes: `Compliance Flagged: ${reason}`
      });
      if (res.success) {
        setMessage(`EPR Credit record #${id} flagged for review.`);
        await loadEprData();
      }
    } catch (err: any) {
      alert(err.message || 'Flag action failed');
    }
  };

  const filteredRecords = records.filter(r => {
    const matchesSearch =
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.materialCategory.toLowerCase().includes(search.toLowerCase()) ||
      (r.targetProducer && r.targetProducer.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || r.creditStatus.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Flagship Header */}
      <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl bg-gradient-to-r from-nexus-charcoal via-nexus-card to-nexus-charcoal border border-emerald-500/40 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs font-mono text-emerald-300 mb-2">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>EXTENDED PRODUCER RESPONSIBILITY (EPR) REGISTRY</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              EPR Credit Management Module
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Verifiable circular credits generated exclusively from audited recycler separation assays. Immutable traceability prevents duplicate claims and ensures statutory enterprise compliance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={api.epr.getCsvUrl()}
              download
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all shadow-glow-green flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV Audit Report</span>
            </a>
          </div>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{message}</span>
          </div>
          <button onClick={() => setMessage('')} className="text-emerald-400">✕</button>
        </div>
      )}

      {/* Workflow Progress Banner */}
      <div className="p-5 rounded-2xl bg-nexus-charcoal/80 border border-slate-800">
        <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mandatory Multi-Tier EPR Verification Lifecycle</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-lg bg-nexus-dark border border-slate-800">
            <div className="text-[10px] text-nexus-muted">Stage 1</div>
            <div className="font-semibold text-slate-200 mt-0.5">Collection Record</div>
          </div>
          <div className="p-2.5 rounded-lg bg-nexus-dark border border-slate-800">
            <div className="text-[10px] text-nexus-muted">Stage 2</div>
            <div className="font-semibold text-slate-200 mt-0.5">Weight Verification</div>
          </div>
          <div className="p-2.5 rounded-lg bg-nexus-dark border border-slate-800">
            <div className="text-[10px] text-nexus-muted">Stage 3</div>
            <div className="font-semibold text-slate-200 mt-0.5">Recycler Evidence</div>
          </div>
          <div className="p-2.5 rounded-lg bg-nexus-dark border border-slate-800">
            <div className="text-[10px] text-nexus-muted">Stage 4</div>
            <div className="font-semibold text-slate-200 mt-0.5">Eligibility Review</div>
          </div>
          <div className="p-2.5 rounded-lg bg-nexus-dark border border-slate-800">
            <div className="text-[10px] text-nexus-muted">Stage 5</div>
            <div className="font-semibold text-slate-200 mt-0.5">Admin Approval</div>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
            <div className="text-[10px] text-emerald-400">Final</div>
            <div className="font-bold mt-0.5">EPR Credit Issued</div>
          </div>
        </div>
      </div>

      {/* Summary Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-nexus-charcoal border border-slate-800">
          <div className="text-xs text-nexus-muted mb-1 flex items-center space-x-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Total Approved Credits</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {summary.totalApprovedCredits} <span className="text-xs font-normal">units</span>
          </div>
          <div className="text-[10px] text-emerald-500/80 mt-1">Available for compliance retirement</div>
        </div>

        <div className="p-4 rounded-xl bg-nexus-charcoal border border-slate-800">
          <div className="text-xs text-nexus-muted mb-1 flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Pending Compliance Review</span>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300">
            {summary.pendingReviewCredits} <span className="text-xs font-normal">units</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Under technical audit</div>
        </div>

        <div className="p-4 rounded-xl bg-nexus-charcoal border border-slate-800">
          <div className="text-xs text-nexus-muted mb-1 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Verified Recycled Mass</span>
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-300">
            {summary.totalEligibleWeightKg} <span className="text-xs font-normal">kg</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">100% assay backed</div>
        </div>

        <div className="p-4 rounded-xl bg-nexus-charcoal border border-slate-800">
          <div className="text-xs text-nexus-muted mb-1 flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Audit Trail Entries</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">{summary.totalRecords}</div>
          <div className="text-[10px] text-slate-400 mt-1">Zero duplicate collisions</div>
        </div>
      </div>

      {/* Credit Conversion Factor Reference Table (Configurable Model) */}
      <div className="p-5 rounded-2xl bg-nexus-charcoal border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-300 uppercase">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>EPR Credit Conversion Matrix (Weight-to-Credit Multipliers)</span>
          </div>
          <span className="text-[10px] text-nexus-muted">Calibrated to rare-metal intensity</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs">
          {Object.entries(conversionFactors).map(([cat, factor]) => (
            <div key={cat} className="p-2.5 rounded-lg bg-nexus-dark border border-slate-800">
              <span className="text-[10px] text-nexus-muted block truncate">{cat}</span>
              <span className="font-mono font-bold text-emerald-400 text-sm mt-0.5 block">{factor}x</span>
              <span className="text-[9px] text-slate-500">credits / kg</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and EPR Table */}
      <div className="rounded-2xl border border-slate-800 bg-nexus-charcoal overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search record ID, producer, category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-nexus-dark border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-nexus-dark border border-slate-800 text-xs text-slate-200 outline-none"
            >
              <option value="all">All Credit Statuses</option>
              <option value="Available">Available</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Utilized">Utilized</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-nexus-dark/70 text-nexus-muted uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-6 py-3">Record ID & Period</th>
                <th className="px-6 py-3">Material Category & Weight</th>
                <th className="px-6 py-3">Credit Units</th>
                <th className="px-6 py-3">Beneficiary Enterprise</th>
                <th className="px-6 py-3">Approval Status</th>
                <th className="px-6 py-3">Audit Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredRecords.map(item => (
                <tr key={item.id} className="hover:bg-nexus-dark/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-mono font-bold text-white flex items-center space-x-1.5">
                      <span>{item.id}</span>
                      {item.isDemoRecord && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-800 text-amber-300 border border-amber-500/30">
                          Demo
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Period: {item.reportingPeriod}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-200">{item.materialCategory}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {item.eligibleWeightKg} kg verified output
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-mono text-base font-bold text-emerald-400">
                      {item.creditUnits}
                    </span>
                    <span className="text-[10px] text-nexus-muted ml-1">credits</span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-300">{item.targetProducer || 'Unassigned EPR Pool'}</div>
                    <div className="text-[10px] text-slate-500">
                      Status: {item.creditStatus}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${
                        item.approvalStatus === 'Approved'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : item.approvalStatus === 'Flagged'
                          ? 'bg-red-950 text-red-300 border border-red-500/40'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {item.approvalStatus}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {user?.role === 'admin' && item.approvalStatus === 'Pending' ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 text-[10px]"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleFlag(item.id)}
                          className="px-2.5 py-1 rounded border border-red-500/40 text-red-400 hover:bg-red-950/40 text-[10px]"
                        >
                          Flag
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono">
                        {item.approvedAt ? `Audited ${new Date(item.approvedAt).toLocaleDateString()}` : 'Awaiting admin review'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mandatory Statutory Disclaimer from Prompt */}
      <div className="p-4 rounded-xl bg-nexus-dark border border-slate-800 text-[11px] text-slate-400 leading-relaxed flex items-start space-x-3">
        <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-white font-semibold">Regulatory Governance Disclosure:</span> E-Waste Nexus operates strict mathematical conversion factors and dual-signature verification prior to EPR credit creation. In accordance with platform transparency guidelines, demonstration credits are segregated from production credits, and the platform claims certification solely against documented technical standards.
        </div>
      </div>
    </div>
  );
};
