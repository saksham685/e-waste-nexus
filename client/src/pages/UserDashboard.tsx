import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { PickupRequest, WasteCategory } from '../types';
import { StatusTimeline } from '../components/StatusTimeline';
import {
  Smartphone,
  Laptop,
  BatteryCharging,
  Tv,
  Printer,
  Refrigerator,
  Box,
  Calendar,
  Clock,
  MapPin,
  FileText,
  AlertCircle,
  Plus,
  RefreshCw,
  XCircle,
  CheckCircle2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CATEGORIES: { id: WasteCategory; label: string; icon: any; hint: string }[] = [
  { id: 'Smartphones and Tablets', label: 'Phones & Tablets', icon: Smartphone, hint: 'iPhones, Androids, iPads, e-readers' },
  { id: 'Laptops and Computers', label: 'Laptops & PCs', icon: Laptop, hint: 'MacBooks, Desktop towers, Servers, CPUs' },
  { id: 'Batteries and Chargers', label: 'Batteries & Cells', icon: BatteryCharging, hint: 'Lithium-ion, Lead-acid, Powerbanks, Cables' },
  { id: 'Televisions and Monitors', label: 'TVs & Monitors', icon: Tv, hint: 'OLED, LCD screens, CRTs, Displays' },
  { id: 'Printers and Office Electronics', label: 'Printers & Office', icon: Printer, hint: 'Laser printers, Scanners, Copiers, Fax' },
  { id: 'Large Electrical Appliances', label: 'Large Appliances', icon: Refrigerator, hint: 'Refrigerators, AC units, Microwaves' },
  { id: 'Other Electronic Waste', label: 'Other E-Waste', icon: Box, hint: 'Motherboards, Circuit cards, Audio, IoT' }
];

export const UserDashboard: React.FC = () => {
  const { user, login } = useAuth();
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [selectedPickup, setSelectedPickup] = useState<PickupRequest | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Form State
  const [category, setCategory] = useState<WasteCategory>('Laptops and Computers');
  const [quantity, setQuantity] = useState<number>(2);
  const [weightKg, setWeightKg] = useState<number>(5.5);
  const [address, setAddress] = useState<string>(user?.address || '420 Innovation Way, Silicon Valley, CA 94025');
  const [scheduledDate, setScheduledDate] = useState<string>('2026-11-02');
  const [timeSlot, setTimeSlot] = useState<string>('10:00 AM - 01:00 PM');
  const [instructions, setInstructions] = useState<string>('');

  const loadPickups = async () => {
    setLoading(true);
    try {
      const res = await api.pickups.getAll();
      if (res.success) {
        setPickups(res.pickups);
        if (res.pickups.length > 0 && !selectedPickup) {
          setSelectedPickup(res.pickups[0]);
        }
      }
    } catch (err: any) {
      console.error('Failed to load pickups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPickups();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await api.pickups.create({
        category,
        estimatedQuantity: quantity,
        estimatedWeightKg: weightKg,
        address,
        scheduledDate,
        timeSlot,
        specialInstructions: instructions
      });

      if (res.success) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
        setSuccessMessage('Pickup scheduled successfully! Assigned to our certified eco-fleet.');
        setShowForm(false);
        await loadPickups();
        setSelectedPickup(res.pickup);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit pickup request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelPickup = async (pickupId: string) => {
    if (!window.confirm('Are you sure you want to cancel this scheduled pickup?')) return;
    try {
      const res = await api.pickups.cancel(pickupId, 'Cancelled by user via dashboard');
      if (res.success) {
        setSuccessMessage('Pickup cancelled.');
        await loadPickups();
        if (selectedPickup?.id === pickupId) {
          setSelectedPickup(res.pickup);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Cancellation failed.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-nexus-charcoal via-nexus-card to-nexus-charcoal border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-1 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Certified Consumer Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Smart E-Waste Collection</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Schedule door-step pickups, track chain-of-custody status, and verify environmental diversion.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all shadow-glow-green flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>{showForm ? 'View Active Pickups' : 'Schedule New Pickup'}</span>
          </button>
          <button
            onClick={loadPickups}
            className="p-2.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition-colors"
            title="Refresh records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="text-emerald-400 hover:text-white">✕</button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')} className="text-red-400 hover:text-white">✕</button>
        </div>
      )}

      {/* SCHEDULE PICKUP FORM MODAL / COLLAPSIBLE */}
      {showForm ? (
        <div className="p-6 md:p-8 rounded-2xl bg-nexus-charcoal border border-emerald-500/30 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white">Schedule Discarded Device Pickup</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Fill in your electronic waste details. Our logistics team will inspect and weigh items at your location.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Grid Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider font-mono">
                1. Select Waste Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-glow-green/40'
                          : 'bg-nexus-dark/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 mb-1.5">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-xs font-semibold ${isSelected ? 'text-emerald-300' : 'text-slate-200'}`}>
                          {cat.label}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{cat.hint}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quantity and Weight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Approximate Quantity (Units)
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  required
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-nexus-dark border border-slate-800 focus:border-emerald-500 text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Estimated Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="5000"
                  required
                  value={weightKg}
                  onChange={e => setWeightKg(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-nexus-dark border border-slate-800 focus:border-emerald-500 text-white text-xs outline-none"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Pickup Address & Floor / Suite
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-emerald-400" />
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Street address, city, state, postal code"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-nexus-dark border border-slate-800 focus:border-emerald-500 text-white text-xs outline-none"
                />
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Preferred Pickup Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-emerald-400" />
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={e => setScheduledDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-nexus-dark border border-slate-800 focus:border-emerald-500 text-white text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Time Slot Window
                </label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-3 w-4 h-4 text-emerald-400" />
                  <select
                    value={timeSlot}
                    onChange={e => setTimeSlot(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-nexus-dark border border-slate-800 focus:border-emerald-500 text-white text-xs outline-none"
                  >
                    <option value="09:00 AM - 12:00 PM">09:00 AM - 12:00 PM (Morning Slot)</option>
                    <option value="12:00 PM - 03:00 PM">12:00 PM - 03:00 PM (Afternoon Slot)</option>
                    <option value="03:00 PM - 06:00 PM">03:00 PM - 06:00 PM (Evening Slot)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Special Handling Instructions or Building Access Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder="e.g. Loading dock access, battery packaging notes, security check instructions"
                className="w-full px-3.5 py-2 rounded-xl bg-nexus-dark border border-slate-800 focus:border-emerald-500 text-white text-xs outline-none resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white border border-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all shadow-glow-green disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Confirm Pickup Request'}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {/* DASHBOARD CONTENT: ACTIVE & PAST PICKUPS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Pickup Requests List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-mono">
              Your Pickup Requests ({pickups.length})
            </h3>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-nexus-muted">Loading pickup telemetry...</div>
          ) : pickups.length === 0 ? (
            <div className="p-8 rounded-2xl bg-nexus-charcoal border border-slate-800 text-center space-y-3">
              <Box className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-sm font-medium text-slate-300">No scheduled pickups yet</div>
              <p className="text-xs text-slate-400">
                You haven't scheduled any electronic waste pickups yet.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-xs"
              >
                Schedule Your First Pickup
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {pickups.map(p => {
                const isSelected = selectedPickup?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPickup(p)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-nexus-card border-emerald-500/70 shadow-[0_0_15px_rgba(34,197,94,0.15)]'
                        : 'bg-nexus-charcoal/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-white">{p.id}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          p.currentStatus === 'Completed'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : p.currentStatus === 'Cancelled' || p.currentStatus === 'Rejected'
                            ? 'bg-red-950 text-red-300 border border-red-500/40'
                            : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                        }`}
                      >
                        {p.currentStatus}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-200 mb-1">{p.category}</div>
                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span>{p.estimatedQuantity} units • ~{p.estimatedWeightKg} kg</span>
                      <span>{p.scheduledDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Detailed Inspection & Live Tracking Timeline */}
        <div className="lg:col-span-7">
          {selectedPickup ? (
            <div className="p-6 md:p-8 rounded-2xl bg-nexus-charcoal border border-slate-800 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
                <div>
                  <div className="text-xs font-mono text-emerald-400">Request #{selectedPickup.id}</div>
                  <h3 className="text-xl font-bold text-white mt-0.5">{selectedPickup.category}</h3>
                </div>

                {/* Cancel button if eligible */}
                {['Requested', 'Approved', 'Assigned'].includes(selectedPickup.currentStatus) && (
                  <button
                    onClick={() => handleCancelPickup(selectedPickup.id)}
                    className="px-3.5 py-1.5 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-950/40 text-xs font-medium transition-colors flex items-center space-x-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel Request</span>
                  </button>
                )}
              </div>

              {/* Progress Timeline */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-2">
                  Chain-of-Custody Progress
                </h4>
                <div className="p-4 rounded-xl bg-nexus-dark/60 border border-slate-800">
                  <StatusTimeline currentStatus={selectedPickup.currentStatus} history={selectedPickup.statusHistory} />
                </div>
              </div>

              {/* Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-nexus-dark border border-slate-800">
                  <span className="text-nexus-muted block text-[10px]">Estimated Quantity</span>
                  <span className="font-semibold text-white text-sm">{selectedPickup.estimatedQuantity} units</span>
                </div>
                <div className="p-3 rounded-lg bg-nexus-dark border border-slate-800">
                  <span className="text-nexus-muted block text-[10px]">Estimated Weight</span>
                  <span className="font-semibold text-emerald-400 text-sm">{selectedPickup.estimatedWeightKg} kg</span>
                </div>
                <div className="p-3 rounded-lg bg-nexus-dark border border-slate-800">
                  <span className="text-nexus-muted block text-[10px]">Scheduled Slot</span>
                  <span className="font-semibold text-white">{selectedPickup.timeSlot || 'Standard'}</span>
                </div>
              </div>

              {/* Address & Partner */}
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-lg bg-nexus-dark border border-slate-800">
                  <span className="text-nexus-muted block text-[10px] mb-1">Pickup Location</span>
                  <span className="text-slate-200">{selectedPickup.address}</span>
                </div>

                {selectedPickup.assignedPartnerName && (
                  <div className="p-3.5 rounded-lg bg-nexus-dark border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-nexus-muted block text-[10px]">Dispatched Fleet Partner</span>
                      <span className="text-emerald-300 font-medium">{selectedPickup.assignedPartnerName}</span>
                    </div>
                    <span className="px-2 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-[10px] text-emerald-300">
                      GPS En Route
                    </span>
                  </div>
                )}

                {selectedPickup.specialInstructions && (
                  <div className="p-3.5 rounded-lg bg-nexus-dark border border-slate-800">
                    <span className="text-nexus-muted block text-[10px] mb-1">Special Instructions</span>
                    <span className="text-slate-300 italic">"{selectedPickup.specialInstructions}"</span>
                  </div>
                )}
              </div>

              {/* Status Audit Log Mini Table */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-2">
                  Event History
                </h4>
                <div className="space-y-2">
                  {selectedPickup.statusHistory.map((h, i) => (
                    <div key={i} className="text-[11px] p-2.5 rounded bg-nexus-dark/40 border border-slate-800/80 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-200">{h.status}</span>
                        {h.note && <span className="text-slate-400 ml-2">— {h.note}</span>}
                      </div>
                      <span className="text-nexus-muted text-[10px] font-mono shrink-0">
                        {new Date(h.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-nexus-muted rounded-2xl bg-nexus-charcoal border border-slate-800">
              Select a pickup request to inspect tracking telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
