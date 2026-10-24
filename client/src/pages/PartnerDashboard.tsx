import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { PickupRequest, CollectionRecord } from '../types';
import {
  Truck,
  CheckCircle2,
  Clock,
  Scale,
  Camera,
  FileText,
  Search,
  Filter,
  Phone,
  MapPin,
  AlertTriangle,
  Upload,
  User,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PartnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [collections, setCollections] = useState<CollectionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPickup, setSelectedPickup] = useState<PickupRequest | null>(null);

  // Weight Entry Modal State
  const [weightModalOpen, setWeightModalOpen] = useState<boolean>(false);
  const [submittedWeight, setSubmittedWeight] = useState<string>('');
  const [collectionNotes, setCollectionNotes] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [submittingWeight, setSubmittingWeight] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [pickupRes, colRes] = await Promise.all([
        api.pickups.getAll(),
        api.collections.getAll()
      ]);
      if (pickupRes.success) setPickups(pickupRes.pickups);
      if (colRes.success) setCollections(colRes.collections);
    } catch (err) {
      console.error('Failed to load partner records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await api.upload(file);
      setUploadedUrls(prev => [...prev, res.url]);
    } catch (err: any) {
      alert(err.message || 'Evidence upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleOpenWeightModal = (pickup: PickupRequest) => {
    setSelectedPickup(pickup);
    setSubmittedWeight(pickup.estimatedWeightKg.toString());
    setUploadedUrls([]);
    setCollectionNotes('');
    setWeightModalOpen(true);
  };

  const handleSubmitWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPickup) return;
    setSubmittingWeight(true);
    try {
      const res = await api.collections.submit({
        pickupId: selectedPickup.id,
        submittedWeightKg: parseFloat(submittedWeight),
        notes: collectionNotes,
        evidenceUrls: uploadedUrls.length > 0 ? uploadedUrls : ['/uploads/evidence_digital_scale_receipt.jpg']
      });

      if (res.success) {
        confetti({ particleCount: 50, spread: 60 });
        setMessage('Physical weight logged. Record marked as UNVERIFIED pending QA verification.');
        setWeightModalOpen(false);
        await loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit weight record');
    } finally {
      setSubmittingWeight(false);
    }
  };

  const handleUpdateStatus = async (pickupId: string, newStatus: string) => {
    try {
      const res = await api.pickups.updateStatus(pickupId, {
        status: newStatus,
        note: `Status updated by logistics partner fleet operator`
      });
      if (res.success) {
        await loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Status update failed');
    }
  };

  // Filtered Pickups
  const filteredPickups = pickups.filter(p => {
    const matchesSearch =
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.currentStatus.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Partner Stats
  const assignedCount = pickups.filter(p => p.assignedPartnerId === user?.id || p.currentStatus === 'Assigned').length;
  const collectedCount = pickups.filter(p => ['Collected', 'Weighed', 'Sent for Recycling', 'Completed'].includes(p.currentStatus)).length;
  const totalWeightLogged = collections.reduce((acc, c) => acc + c.submittedWeightKg, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-nexus-charcoal border border-emerald-500/30">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-1 uppercase tracking-wider">
            <Truck className="w-4 h-4" />
            <span>GreenRoute Certified Fleet Ops</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Collection Partner Operations Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch management, physical weight capture, chain-of-custody photo evidence, and delivery handoffs.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-nexus-dark px-3 py-2 rounded-xl border border-slate-800 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">Fleet ID: {user?.id}</span>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage('')} className="text-emerald-400">✕</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-nexus-charcoal border border-slate-800">
          <div className="text-xs text-nexus-muted mb-1 flex items-center space-x-1.5">
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Assigned Dispatches</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">{assignedCount}</div>
        </div>

        <div className="p-4 rounded-xl bg-nexus-charcoal border border-slate-800">
          <div className="text-xs text-nexus-muted mb-1 flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Completed Intakes</span>
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-300">{collectedCount}</div>
        </div>

        <div className="p-4 rounded-xl bg-nexus-charcoal border border-slate-800">
          <div className="text-xs text-nexus-muted mb-1 flex items-center space-x-1.5">
            <Scale className="w-3.5 h-3.5 text-emerald-400" />
            <span>Logged Scale Cargo</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {totalWeightLogged.toFixed(1)} <span className="text-xs font-normal">kg</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-nexus-charcoal border border-slate-800">
          <div className="text-xs text-nexus-muted mb-1 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
            <span>Fleet Quality Rating</span>
          </div>
          <div className="text-2xl font-bold font-mono text-lime-400">4.9 / 5.0</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-nexus-charcoal border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search address, ID, category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-nexus-dark border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-nexus-dark border border-slate-800 text-xs text-slate-200 outline-none"
          >
            <option value="all">All Pickup Statuses</option>
            <option value="Assigned">Assigned</option>
            <option value="Collected">Collected</option>
            <option value="Weighed">Weighed</option>
            <option value="Sent for Recycling">Sent for Recycling</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Pickups Table */}
      <div className="rounded-2xl border border-slate-800 bg-nexus-charcoal overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase font-mono">Assigned Cargo Manifest</h3>
          <span className="text-xs text-nexus-muted">{filteredPickups.length} shipments</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-nexus-dark/70 text-nexus-muted uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-6 py-3">Pickup ID & Date</th>
                <th className="px-6 py-3">Category & Est. Weight</th>
                <th className="px-6 py-3">Customer Contact (Authorized)</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions & Custody</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredPickups.map(pickup => {
                const existingCol = collections.find(c => c.pickupId === pickup.id);
                return (
                  <tr key={pickup.id} className="hover:bg-nexus-dark/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono font-bold text-white">{pickup.id}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{pickup.scheduledDate} ({pickup.timeSlot || 'Day'})</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-200">{pickup.category}</div>
                      <div className="text-[11px] text-slate-400">
                        {pickup.estimatedQuantity} units • ~{pickup.estimatedWeightKg} kg
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-200">{pickup.userName}</div>
                      <div className="text-[11px] text-emerald-400 flex items-center space-x-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span>{pickup.userPhone || 'Confidential direct link'}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">{pickup.address}</div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${
                          pickup.currentStatus === 'Completed'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : pickup.currentStatus === 'Weighed'
                            ? 'bg-teal-950 text-teal-300 border border-teal-500/40'
                            : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                        }`}
                      >
                        {pickup.currentStatus}
                      </span>

                      {existingCol && (
                        <div className="mt-1 text-[10px] font-mono">
                          {existingCol.verificationStatus === 'verified' ? (
                            <span className="text-emerald-400">✓ Verified: {existingCol.verifiedWeightKg} kg</span>
                          ) : (
                            <span className="text-amber-400">⚠ Unverified: {existingCol.submittedWeightKg} kg</span>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Action 1: Mark Collected */}
                        {pickup.currentStatus === 'Assigned' && (
                          <button
                            onClick={() => handleUpdateStatus(pickup.id, 'Collected')}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 text-[11px] font-medium"
                          >
                            Mark Collected
                          </button>
                        )}

                        {/* Action 2: Enter Physical Scale Weight */}
                        {['Collected', 'Weighed'].includes(pickup.currentStatus) && !existingCol && (
                          <button
                            onClick={() => handleOpenWeightModal(pickup)}
                            className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 text-[11px] font-medium flex items-center space-x-1"
                          >
                            <Scale className="w-3 h-3" />
                            <span>Log Scale Weight</span>
                          </button>
                        )}

                        {/* Action 3: Dispatch to Recycler */}
                        {pickup.currentStatus === 'Weighed' && (
                          <button
                            onClick={() => handleUpdateStatus(pickup.id, 'Sent for Recycling')}
                            className="px-2.5 py-1.5 rounded-lg bg-lime-500/20 text-lime-300 border border-lime-500/40 hover:bg-lime-500/30 text-[11px] font-medium flex items-center space-x-1"
                          >
                            <span>Handoff to Recycler</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* WEIGHT ENTRY & PHOTO EVIDENCE MODAL */}
      {weightModalOpen && selectedPickup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-nexus-charcoal border border-emerald-500/40 p-6 shadow-2xl space-y-5">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Log Physical Collection Weight</h3>
                <p className="text-xs text-slate-400">Cargo: {selectedPickup.category} (#{selectedPickup.id})</p>
              </div>
              <button onClick={() => setWeightModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {/* Mandatory Compliance Warning */}
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-300 text-xs flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>
                <strong>Audit Compliance:</strong> Submitted physical weight will remain in <em>unverified</em> status until inspected by central QA. Original submitted values are permanently preserved in audit history.
              </p>
            </div>

            <form onSubmit={handleSubmitWeight} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Calibrated Scale Weight (kg)
                </label>
                <div className="relative">
                  <Scale className="absolute left-3 top-3 w-4 h-4 text-emerald-400" />
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    required
                    value={submittedWeight}
                    onChange={e => setSubmittedWeight(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-nexus-dark border border-slate-800 text-white font-mono text-sm outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Upload Supporting Weigh-Scale Slip or Photo Evidence
                </label>
                <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-xl p-4 text-center cursor-pointer relative bg-nexus-dark/50">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Camera className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                  <span className="text-xs text-slate-300 font-medium block">
                    {uploading ? 'Uploading Evidence...' : 'Click to upload weight scale slip / cargo photo'}
                  </span>
                  <span className="text-[10px] text-slate-500">Supports JPG, PNG, PDF up to 10MB</span>
                </div>

                {uploadedUrls.length > 0 && (
                  <div className="mt-2 text-xs text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{uploadedUrls.length} evidence file(s) attached</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Field Notes / Condition Description
                </label>
                <textarea
                  rows={2}
                  value={collectionNotes}
                  onChange={e => setCollectionNotes(e.target.value)}
                  placeholder="e.g. Battery condition intact, no visible leaking, weighed on scale unit #4"
                  className="w-full px-3 py-2 rounded-xl bg-nexus-dark border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setWeightModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingWeight || uploading}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all disabled:opacity-50"
                >
                  {submittingWeight ? 'Logging...' : 'Submit Physical Weight'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
