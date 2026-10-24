import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { User, AuditLog, CollectionRecord, EPRRecord } from '../types';
import {
  Shield,
  Users,
  Scale,
  Award,
  Truck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  FileText,
  Activity,
  History,
  Lock,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState<any>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [collections, setCollections] = useState<CollectionRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'verifications' | 'users' | 'audit'>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');

  // Weight Verification Modal State
  const [verifyModalOpen, setVerifyModalOpen] = useState<boolean>(false);
  const [selectedCol, setSelectedCol] = useState<CollectionRecord | null>(null);
  const [verifiedWeightInput, setVerifiedWeightInput] = useState<string>('');
  const [auditNotes, setAuditNotes] = useState<string>('');
  const [submittingVerify, setSubmittingVerify] = useState<boolean>(false);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [ovRes, userRes, logRes, colRes] = await Promise.all([
        api.admin.getOverview(),
        api.admin.getUsers(),
        api.admin.getAuditLogs(),
        api.collections.getAll()
      ]);
      if (ovRes.success) setOverview(ovRes);
      if (userRes.success) setUsersList(userRes.users);
      if (logRes.success) setAuditLogs(logRes.logs);
      if (colRes.success) setCollections(colRes.collections);
    } catch (err) {
      console.error('Failed to load admin telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [user]);

  const handleOpenVerifyModal = (col: CollectionRecord) => {
    setSelectedCol(col);
    setVerifiedWeightInput(col.submittedWeightKg.toString());
    setAuditNotes('Weigh-slip and tare certification verified against regional hub scale calibration standard.');
    setVerifyModalOpen(true);
  };

  const handleConfirmWeightVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCol) return;
    setSubmittingVerify(true);
    try {
      const res = await api.collections.verify(selectedCol.id, {
        verifiedWeightKg: parseFloat(verifiedWeightInput),
        status: 'verified',
        notes: auditNotes
      });
      if (res.success) {
        confetti({ particleCount: 50, spread: 60 });
        setMessage(`Collection #${selectedCol.id} officially verified at ${verifiedWeightInput} kg.`);
        setVerifyModalOpen(false);
        await loadAdminData();
      }
    } catch (err: any) {
      alert(err.message || 'Verification failed');
    } finally {
      setSubmittingVerify(false);
    }
  };

  const handleUserStatusToggle = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    if (!window.confirm(`Are you sure you want to change user status to ${newStatus.toUpperCase()}?`)) return;

    try {
      const res = await api.admin.updateUserStatus(userId, { status: newStatus });
      if (res.success) {
        setMessage(`User account status updated to ${newStatus}.`);
        await loadAdminData();
      }
    } catch (err: any) {
      alert(err.message || 'Status toggle failed');
    }
  };

  const pendingCollections = collections.filter(c => c.verificationStatus === 'unverified');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-nexus-charcoal via-nexus-card to-nexus-charcoal border border-emerald-500/40">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-1 uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Executive Governance Node</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Administrator Control Center</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Platform telemetry, weight QA verification queue, user governance, and cryptographic audit logs.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadAdminData}
            className="p-2.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition-colors"
            title="Refresh admin records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
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

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'overview'
              ? 'bg-emerald-500 text-slate-950 shadow-glow-green'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          System Overview
        </button>
        <button
          onClick={() => setActiveTab('verifications')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all relative ${
            activeTab === 'verifications'
              ? 'bg-emerald-500 text-slate-950 shadow-glow-green'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span>Weight Verification Queue</span>
          {pendingCollections.length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-slate-950 font-bold">
              {pendingCollections.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'users'
              ? 'bg-emerald-500 text-slate-950 shadow-glow-green'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          User Governance ({usersList.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'audit'
              ? 'bg-emerald-500 text-slate-950 shadow-glow-green'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Immutable Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: SYSTEM OVERVIEW */}
      {activeTab === 'overview' && overview && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-nexus-charcoal border border-slate-800">
              <div className="text-xs text-nexus-muted mb-1 flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Registered Users</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white">{overview.stats.totalUsers}</div>
              <div className="text-[10px] text-slate-400 mt-1">
                {overview.stats.usersByRole.partners} partners • {overview.stats.usersByRole.recyclers} recyclers
              </div>
            </div>

            <div className="p-4 rounded-xl bg-nexus-charcoal border border-slate-800">
              <div className="text-xs text-nexus-muted mb-1 flex items-center space-x-1.5">
                <Truck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Total Pickup Requests</span>
              </div>
              <div className="text-2xl font-bold font-mono text-cyan-300">{overview.stats.totalPickups}</div>
              <div className="text-[10px] text-slate-400 mt-1">
                {overview.stats.pendingPickupsCount} pending dispatch
              </div>
            </div>

            <div className="p-4 rounded-xl bg-nexus-charcoal border border-slate-800">
              <div className="text-xs text-nexus-muted mb-1 flex items-center space-x-1.5">
                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Clean Weight</span>
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {overview.stats.totalWeightCollectedKg} <span className="text-xs font-normal">kg</span>
              </div>
              <div className="text-[10px] text-emerald-500/80 mt-1">100% QA inspected</div>
            </div>

            <div className="p-4 rounded-xl bg-nexus-charcoal border border-slate-800">
              <div className="text-xs text-nexus-muted mb-1 flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5 text-lime-400" />
                <span>Approved EPR Credits</span>
              </div>
              <div className="text-2xl font-bold font-mono text-lime-400">
                {overview.stats.totalApprovedEprCredits} <span className="text-xs font-normal">units</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Dual-signature certified</div>
            </div>
          </div>

          {/* Verification Alert Callout */}
          {pendingCollections.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-center justify-between">
              <div className="flex items-center space-x-3 text-xs text-amber-300">
                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
                <div>
                  <span className="font-bold">Attention Required:</span> {pendingCollections.length} physical collection weight record(s) are awaiting QA calibration audit.
                </div>
              </div>
              <button
                onClick={() => setActiveTab('verifications')}
                className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors"
              >
                Inspect Queue
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: WEIGHT VERIFICATION QUEUE */}
      {activeTab === 'verifications' && (
        <div className="rounded-2xl border border-slate-800 bg-nexus-charcoal overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase font-mono">
              Physical Weight Inspection Queue ({pendingCollections.length} Pending)
            </h3>
            <span className="text-xs text-nexus-muted">Strict chain-of-custody enforcement</span>
          </div>

          {pendingCollections.length === 0 ? (
            <div className="p-12 text-center text-xs text-nexus-muted space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="text-slate-300 font-medium">All physical collection records are fully verified</div>
              <p className="text-slate-500">No unverified weigh-scale tickets in queue.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-nexus-dark/70 text-nexus-muted uppercase font-mono text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-3">Collection ID & Date</th>
                    <th className="px-6 py-3">Associated Pickup</th>
                    <th className="px-6 py-3">Fleet Partner</th>
                    <th className="px-6 py-3">Submitted Weight</th>
                    <th className="px-6 py-3">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {pendingCollections.map(col => (
                    <tr key={col.id} className="hover:bg-nexus-dark/40 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-white">{col.id}</td>
                      <td className="px-6 py-4 font-mono text-slate-300">{col.pickupId}</td>
                      <td className="px-6 py-4 text-slate-200">{col.partnerName}</td>
                      <td className="px-6 py-4 font-mono font-bold text-amber-400">
                        {col.submittedWeightKg} kg (Unverified)
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleOpenVerifyModal(col)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 text-xs transition-colors flex items-center space-x-1"
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span>Audit & Verify Weight</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: USER GOVERNANCE */}
      {activeTab === 'users' && (
        <div className="rounded-2xl border border-slate-800 bg-nexus-charcoal overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase font-mono">Platform User Accounts</h3>
            <span className="text-xs text-nexus-muted">{usersList.length} total registered accounts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-nexus-dark/70 text-nexus-muted uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3">Name & Organization</th>
                  <th className="px-6 py-3">Email Address</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Account Status</th>
                  <th className="px-6 py-3">Governance Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {usersList.map(u => (
                  <tr key={u.id} className="hover:bg-nexus-dark/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{u.name}</div>
                      <div className="text-[10px] text-slate-400">{u.organization || 'Individual Account'}</div>
                    </td>

                    <td className="px-6 py-4 font-mono text-slate-300">{u.email}</td>

                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-emerald-400 border border-emerald-500/30">
                        {u.role}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          u.status === 'active'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : 'bg-red-950 text-red-300 border border-red-500/40'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleUserStatusToggle(u.id, u.status)}
                          className={`px-2.5 py-1 rounded text-[10px] font-medium border ${
                            u.status === 'active'
                              ? 'border-red-500/40 text-red-400 hover:bg-red-950/40'
                              : 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/40'
                          }`}
                        >
                          {u.status === 'active' ? 'Suspend Account' : 'Activate Account'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: IMMUTABLE AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="rounded-2xl border border-slate-800 bg-nexus-charcoal overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase font-mono">
              Immutable Cryptographic Audit Trail
            </h3>
            <span className="text-xs text-nexus-muted">Tamper-evident system log</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-nexus-dark/70 text-nexus-muted uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">Actor & Role</th>
                  <th className="px-6 py-3">Action Type</th>
                  <th className="px-6 py-3">Entity Type & ID</th>
                  <th className="px-6 py-3">Diff / Modified Values</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-nexus-dark/40 transition-colors">
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-200">{log.actorName}</div>
                      <div className="text-[10px] font-mono text-emerald-400 uppercase">{log.actorRole}</div>
                    </td>

                    <td className="px-6 py-4 font-mono font-bold text-white">{log.action}</td>

                    <td className="px-6 py-4 font-mono text-[11px] text-slate-300">
                      {log.entityType} ({log.entityId})
                    </td>

                    <td className="px-6 py-4 text-[10px] font-mono text-slate-400 max-w-xs truncate">
                      {log.updatedValues ? JSON.stringify(log.updatedValues) : 'Record created'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* WEIGHT VERIFICATION MODAL */}
      {verifyModalOpen && selectedCol && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-nexus-charcoal border border-emerald-500/40 p-6 shadow-2xl space-y-5">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Authorized Weight Verification Audit</h3>
                <p className="text-xs text-slate-400">Record: #{selectedCol.id} (Pickup: {selectedCol.pickupId})</p>
              </div>
              <button onClick={() => setVerifyModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleConfirmWeightVerification} className="space-y-4">
              <div className="p-3 rounded-xl bg-nexus-dark border border-slate-800 text-xs">
                <span className="text-nexus-muted block text-[10px]">Submitted Partner Scale Weight:</span>
                <span className="font-mono text-base font-bold text-amber-400">
                  {selectedCol.submittedWeightKg} kg
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Officially Audited Net Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={verifiedWeightInput}
                  onChange={e => setVerifiedWeightInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-nexus-dark border border-slate-800 text-white font-mono text-sm outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  QA Audit Notes & Calibration Certificate Reference
                </label>
                <textarea
                  rows={3}
                  required
                  value={auditNotes}
                  onChange={e => setAuditNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-nexus-dark border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setVerifyModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingVerify}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all disabled:opacity-50"
                >
                  {submittingVerify ? 'Certifying...' : 'Officially Certify Weight'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
