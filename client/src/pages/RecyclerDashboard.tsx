import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { RecyclerRecord, CollectionRecord } from '../types';
import {
  Building2,
  Recycle,
  Scale,
  Award,
  FileCheck,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  AlertCircle,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RecyclerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<RecyclerRecord[]>([]);
  const [collections, setCollections] = useState<CollectionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [showIntakeModal, setShowIntakeModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  // Intake Form State
  const [selectedColId, setSelectedColId] = useState<string>('');
  const [receivedWeight, setReceivedWeight] = useState<string>('');
  const [processedWeight, setProcessedWeight] = useState<string>('');
  const [processingStatus, setProcessingStatus] = useState<string>('In-Processing');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [recRes, colRes] = await Promise.all([
        api.recycling.getAll(),
        api.collections.getAll()
      ]);
      if (recRes.success) setRecords(recRes.records);
      if (colRes.success) setCollections(colRes.collections);
    } catch (err) {
      console.error('Failed to load recycler data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleOpenIntake = () => {
    if (collections.length > 0) {
      setSelectedColId(collections[0].id);
      setReceivedWeight(collections[0].submittedWeightKg.toString());
      setProcessedWeight((collections[0].submittedWeightKg * 0.94).toFixed(1)); // Realistic separation recovery yield
    }
    setShowIntakeModal(true);
  };

  const handleIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedColId) return;
    setSubmitting(true);
    try {
      const res = await api.recycling.submit({
        collectionRecordId: selectedColId,
        receivedWeightKg: parseFloat(receivedWeight),
        processedWeightKg: parseFloat(processedWeight),
        processingStatus,
        notes,
        processingEvidenceUrls: ['/uploads/aerosmelt_assay_yield_report.pdf']
      });

      if (res.success) {
        confetti({ particleCount: 50, spread: 60 });
        setMessage('Recycling intake and material assay recorded successfully.');
        setShowIntakeModal(false);
        await loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Intake recording failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClaimEprCredit = async (record: RecyclerRecord) => {
    try {
      const res = await api.epr.create({
        sourceRecyclerRecordId: record.id,
        targetProducer: 'OmniConsumer Tech Global',
        notes: `EPR credit claim generated for certified batch yield: ${record.processedWeightKg} kg`
      });

      if (res.success) {
        confetti({ particleCount: 70, spread: 70 });
        setMessage('EPR Credit Claim Submitted! Sent to Administration for compliance verification.');
      }
    } catch (err: any) {
      alert(err.message || 'EPR claim failed');
    }
  };

  const filteredRecords = records.filter(r =>
    r.id.toLowerCase().includes(search.toLowerCase()) ||
    r.category.toLowerCase().includes(search.toLowerCase()) ||
    r.recyclerName.toLowerCase().includes(search.toLowerCase())
  );

  const totalReceived = records.reduce((sum, r) => sum + r.receivedWeightKg, 0);
  const totalProcessed = records.reduce((sum, r) => sum + r.processedWeightKg, 0);
  const recoveryEfficiency = totalReceived > 0 ? ((totalProcessed / totalReceived) * 100).toFixed(1) : '95.4';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-nexus-charcoal border border-cyan-500/30">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1 uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>AeroSmelt Refining Technologies</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Certified Recycler Processing Hub</h1>
          <p className="text-xs text-slate-400 mt-1">
            Material assays, pyrometallurgy recovery yield tracking, and Extended Producer Responsibility (EPR) credit generation.
          </p>
        </div>

        <button
          onClick={handleOpenIntake}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Log Incoming Material Batch</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage('')} className="text-cyan-400">✕</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-nexus-charcoal border border-slate-800">
          <div className="text-xs text-nexus-muted mb-1 flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Total Intake Batches</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">{records.length}</div>
        </div>

        <div className="p-4 rounded-xl bg-nexus-charcoal border border-slate-800">
          <div className="text-xs text-nexus-muted mb-1 flex items-center space-x-1.5">
            <Scale className="w-3.5 h-3.5 text-slate-400" />
            <span>Gross Received Weight</span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-200">
            {totalReceived.toFixed(1)} <span className="text-xs font-normal">kg</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-nexus-charcoal border border-slate-800">
          <div className="text-xs text-nexus-muted mb-1 flex items-center space-x-1.5">
            <Recycle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Processed Output</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {totalProcessed.toFixed(1)} <span className="text-xs font-normal">kg</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-nexus-charcoal border border-slate-800">
          <div className="text-xs text-nexus-muted mb-1 flex items-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5 text-lime-400" />
            <span>Commodity Recovery Yield</span>
          </div>
          <div className="text-2xl font-bold font-mono text-lime-400">{recoveryEfficiency}%</div>
        </div>
      </div>

      {/* Search and Records Table */}
      <div className="rounded-2xl border border-slate-800 bg-nexus-charcoal overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search batches, categories, IDs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-nexus-dark border border-slate-800 text-xs text-white outline-none focus:border-cyan-500"
            />
          </div>
          <span className="text-xs text-nexus-muted font-mono">{filteredRecords.length} active processing records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-nexus-dark/70 text-nexus-muted uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-6 py-3">Batch ID & Date</th>
                <th className="px-6 py-3">Waste Category</th>
                <th className="px-6 py-3">Received vs Processed Weight</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Assay Evidence & EPR Claim</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredRecords.map(record => (
                <tr key={record.id} className="hover:bg-nexus-dark/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-mono font-bold text-white">{record.id}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-200">{record.category}</div>
                    <div className="text-[10px] text-slate-400">{record.notes || 'Pyrometallurgical extraction'}</div>
                  </td>

                  <td className="px-6 py-4 font-mono">
                    <div className="text-slate-300">Intake: {record.receivedWeightKg} kg</div>
                    <div className="text-emerald-400 font-bold">Yield: {record.processedWeightKg} kg</div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${
                        record.processingStatus === 'Recycled'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                      }`}
                    >
                      {record.processingStatus}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleClaimEprCredit(record)}
                        disabled={record.processingStatus !== 'Recycled'}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center space-x-1.5 transition-all ${
                          record.processingStatus === 'Recycled'
                            ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-glow-green'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Claim EPR Credit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INTAKE BATCH MODAL */}
      {showIntakeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-nexus-charcoal border border-cyan-500/40 p-6 shadow-2xl space-y-5">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Log Material Intake & Refining Run</h3>
                <p className="text-xs text-slate-400">Record incoming shipments from logistics partners</p>
              </div>
              <button onClick={() => setShowIntakeModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleIntakeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Source Collection Record
                </label>
                <select
                  value={selectedColId}
                  onChange={e => {
                    setSelectedColId(e.target.value);
                    const col = collections.find(c => c.id === e.target.value);
                    if (col) {
                      setReceivedWeight(col.submittedWeightKg.toString());
                      setProcessedWeight((col.submittedWeightKg * 0.94).toFixed(1));
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-nexus-dark border border-slate-800 text-xs text-white outline-none focus:border-cyan-500"
                >
                  {collections.map(col => (
                    <option key={col.id} value={col.id}>
                      {col.id} — {col.submittedWeightKg} kg ({col.pickupDetails?.category || 'E-Waste'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Received Gross Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={receivedWeight}
                    onChange={e => setReceivedWeight(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-nexus-dark border border-slate-800 text-xs text-white font-mono outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Processed Recovered Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={processedWeight}
                    onChange={e => setProcessedWeight(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-nexus-dark border border-slate-800 text-xs text-emerald-400 font-mono outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Processing Phase
                </label>
                <select
                  value={processingStatus}
                  onChange={e => setProcessingStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-nexus-dark border border-slate-800 text-xs text-white outline-none focus:border-cyan-500"
                >
                  <option value="Received">Received (In Quarantine)</option>
                  <option value="In-Processing">In-Processing (Disassembly & Smelting)</option>
                  <option value="Recycled">Recycled (Pure Commodities Recovered)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Assay Report & Refining Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Hydro-metallurgical closed-loop recovery executed. High cobalt and copper yield."
                  className="w-full px-3 py-2 rounded-xl bg-nexus-dark border border-slate-800 text-xs text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIntakeModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Recording...' : 'Save Recycler Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
