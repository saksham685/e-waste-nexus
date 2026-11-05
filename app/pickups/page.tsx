'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { soundEffects } from '@/lib/sound';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { wasteCategories } from '@/lib/validations';
import { createPickupAction } from '@/actions/pickupActions';
import { PickupRequest } from '@/lib/types';
import { CertificateModal } from '@/components/CertificateModal';
import {
  Truck,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  MapPin,
  Package,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Laptop,
  BatteryCharging,
  Tv,
  Printer,
  Zap,
  Coins,
  Search,
} from 'lucide-react';

interface CategoryPreset {
  name: (typeof wasteCategories)[number];
  icon: any;
  avgWeightKg: number;
  rewardPerUnit: number;
}

const CATEGORY_PRESETS: CategoryPreset[] = [
  { name: 'Laptops and Computers', icon: Laptop, avgWeightKg: 2.5, rewardPerUnit: 1200 },
  { name: 'Smartphones and Tablets', icon: Smartphone, avgWeightKg: 0.25, rewardPerUnit: 450 },
  { name: 'Batteries and Chargers', icon: BatteryCharging, avgWeightKg: 0.8, rewardPerUnit: 180 },
  { name: 'Televisions and Monitors', icon: Tv, avgWeightKg: 6.0, rewardPerUnit: 850 },
  { name: 'Printers and Office Electronics', icon: Printer, avgWeightKg: 4.5, rewardPerUnit: 600 },
  { name: 'Other Electronic Waste', icon: Package, avgWeightKg: 1.5, rewardPerUnit: 250 },
];

export default function PickupsPage() {
  const { user } = useAuthStore();
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [selectedCertPickup, setSelectedCertPickup] = useState<PickupRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [category, setCategory] = useState<(typeof wasteCategories)[number]>('Laptops and Computers');
  const [quantity, setQuantity] = useState<number>(2);
  const [weightKg, setWeightKg] = useState<number>(5.0);
  const [address, setAddress] = useState<string>(user?.address || 'Flat 402, Green Valley Apartments, Sector 62, Noida, Uttar Pradesh');
  const [scheduledDate, setScheduledDate] = useState<string>(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState<string>('Morning (09:00 - 12:00)');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  // Fetch Pickups
  const fetchPickups = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/pickups');
      if (res.ok) {
        const data = await res.json();
        setPickups(data.pickups || []);
      }
    } catch (err) {
      console.error('Error fetching pickups:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  // Estimated Reward calculation
  const estimatedReward = useMemo(() => {
    const preset = CATEGORY_PRESETS.find((p) => p.name === category) || CATEGORY_PRESETS[0];
    const totalCash = preset.rewardPerUnit * quantity;
    const greenPoints = Math.round(weightKg * 100);
    return {
      cash: totalCash.toLocaleString('en-IN'),
      points: greenPoints.toLocaleString('en-IN'),
    };
  }, [category, quantity, weightKg]);

  // Handle Preset Select
  const handleSelectPreset = (preset: CategoryPreset) => {
    soundEffects.playClick();
    setCategory(preset.name);
    setWeightKg(Math.round(preset.avgWeightKg * quantity * 10) / 10);
  };

  // Quick Auto-fill sample details
  const handleAutoFill = () => {
    soundEffects.playClick();
    setCategory('Smartphones and Tablets');
    setQuantity(4);
    setWeightKg(1.2);
    setAddress('C-14, Green Park Extension, New Delhi, Delhi 110016');
    setTimeSlot('Morning (09:00 - 12:00)');
    setSpecialInstructions('Packaged in protective box with charging cables.');
  };

  const handleCreatePickup = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playClick();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      const userPayload = {
        id: user?.id || 'citizen_user_1',
        name: user?.name || 'Authorized Citizen Consignor',
        email: user?.email || 'citizen@nexus.eco',
        phone: user?.phone || '+91 98059 26846',
      };

      const result = await createPickupAction(
        {
          category,
          estimatedQuantity: Number(quantity),
          estimatedWeightKg: Number(weightKg),
          address,
          scheduledDate,
          timeSlot,
          specialInstructions: specialInstructions || 'Standard doorstep collection requested.',
        },
        userPayload
      );

      if (result.success && result.pickup) {
        soundEffects.playSuccess();
        setSuccessMsg(`Pickup Request #${result.pickup.id.slice(-6)} scheduled successfully!`);
        voiceAssistant.speak(`Your pickup request for ${category} has been submitted with certified CPCB chain-of-custody.`);
        await fetchPickups();
      } else {
        soundEffects.playError();
        setErrorMsg(result.error || 'Failed to submit pickup request.');
      }
    } catch (err: any) {
      soundEffects.playError();
      setErrorMsg(err?.message || 'Network error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPickups = useMemo(() => {
    if (!searchQuery.trim()) return pickups;
    const q = searchQuery.toLowerCase();
    return pickups.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.currentStatus.toLowerCase().includes(q)
    );
  }, [pickups, searchQuery]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Requested':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Requested</span>
          </span>
        );
      case 'Scheduled':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Scheduled</span>
          </span>
        );
      case 'InTransit':
      case 'PickedUp':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
            <Truck className="w-3 h-3" />
            <span>In Transit</span>
          </span>
        );
      case 'Certified':
      case 'Processed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Certified &amp; Recovered</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-gray-500/20 text-gray-300 border border-gray-500/30">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider">
          <Truck className="w-4 h-4" />
          <span>Doorstep E-Waste Collection &bull; CPCB Certified</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Schedule Free Doorstep Pickup
        </h1>
        <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
          Dispose of old phones, laptops, and electronics safely. Receive tamper-evident tracking, earn Green Cash points, and get an official CPCB E-Waste Recycling Certificate.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Booking Form */}
        <div className="lg:col-span-5 bg-nexus-card border border-emerald-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
            <div className="flex items-center space-x-2">
              <PlusCircle className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">Book New Collection</h2>
            </div>
            <button
              type="button"
              onClick={handleAutoFill}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/30 transition-all cursor-pointer"
            >
              ⚡ Auto-Fill Sample
            </button>
          </div>

          {/* Feedback Banners */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreatePickup} className="space-y-4">
            {/* 1. Item Category Quick Grid */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Select E-Waste Category:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORY_PRESETS.map((preset) => {
                  const Icon = preset.icon;
                  const isSelected = category === preset.name;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-500/20 text-white shadow-glow-green scale-102'
                          : 'border-emerald-500/20 bg-nexus-dark/70 text-gray-400 hover:text-white hover:border-emerald-500/50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-emerald-300' : 'text-gray-400'}`} />
                      <span className="text-[11px] font-bold leading-tight line-clamp-1">{preset.name.split(' ')[0]}</span>
                      <span className="text-[9px] text-gray-500 mt-0.5">~₹{preset.rewardPerUnit}/ea</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Quantity & Weight */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Quantity (Units)
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  required
                  className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Est. Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="5000"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Math.max(0.1, Number(e.target.value)))}
                  required
                  className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>
            </div>

            {/* Reward Preview Badge */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/80 via-nexus-dark to-emerald-950/80 border border-emerald-500/30 flex items-center justify-between text-xs">
              <span className="text-gray-300 flex items-center space-x-1.5">
                <Coins className="w-4 h-4 text-emerald-400" />
                <span>Estimated Reward:</span>
              </span>
              <span className="text-emerald-400 font-mono font-bold">
                ₹{estimatedReward.cash} + {estimatedReward.points} pts
              </span>
            </div>

            {/* 3. Address */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Pickup Doorstep Address (India)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="House/Office No., Street, Sector, City, State"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* 4. Date & Time Window */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                  className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Time Window
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400 font-sans"
                >
                  <option value="Morning (09:00 - 12:00)">Morning (09:00 - 12:00)</option>
                  <option value="Afternoon (13:00 - 17:00)">Afternoon (13:00 - 17:00)</option>
                  <option value="Evening (17:00 - 20:00)">Evening (17:00 - 20:00)</option>
                </select>
              </div>
            </div>

            {/* 5. Special Instructions */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Special Instructions (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Call before arrival, gate code, fragile packaging"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-nexus-dark font-black text-sm tracking-wide shadow-glow-green transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer hover:scale-102 active:scale-98"
            >
              {isSubmitting ? (
                <span>Submitting Pickup Manifest...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Confirm Doorstep Pickup</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Active Consignment Manifests */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Package className="w-5 h-5 text-emerald-400" />
                <span>Your Scheduled Consignments ({filteredPickups.length})</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Track real-time status &amp; view CPCB certified certificates</p>
            </div>

            {/* Search Filter */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search pickups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-gray-400 font-mono text-sm space-y-2">
              <div className="w-8 h-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin mx-auto" />
              <div>Loading certified pickup manifests...</div>
            </div>
          ) : filteredPickups.length === 0 ? (
            <div className="p-8 text-center bg-nexus-card border border-emerald-500/20 rounded-2xl text-gray-400 space-y-2">
              <Package className="w-10 h-10 text-gray-500 mx-auto" />
              <div className="font-bold text-white text-sm">No manifests found</div>
              <div className="text-xs">Submit your first pickup on the left to start recycling!</div>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredPickups.map((p) => (
                <div
                  key={p.id}
                  className="bg-nexus-card border border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl p-5 transition-all shadow-md space-y-3 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/10 pb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-emerald-400">#{p.id.slice(-8)}</span>
                        {getStatusBadge(p.currentStatus)}
                      </div>
                      <h3 className="font-bold text-white text-sm mt-1">{p.category}</h3>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-white">
                        {p.estimatedQuantity} Units &bull; {p.estimatedWeightKg} kg
                      </div>
                      <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                        Date: {p.scheduledDate}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-300">
                    <div className="flex items-center space-x-1.5 text-gray-400 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{p.address}</span>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {(p.currentStatus === 'Certified' || p.currentStatus === 'Processed') && (
                        <button
                          type="button"
                          onClick={() => {
                            soundEffects.playClick();
                            setSelectedCertPickup(p);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-mono text-xs font-bold flex items-center space-x-1 border border-emerald-500/40 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Certificate</span>
                        </button>
                      )}
                      <Link
                        href={`/pickups/${p.id}`}
                        className="px-3 py-1.5 rounded-lg bg-nexus-dark hover:bg-slate-800 text-gray-300 hover:text-white border border-emerald-500/20 text-xs font-medium flex items-center space-x-1"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedCertPickup && (
        <CertificateModal
          pickup={selectedCertPickup}
          onClose={() => setSelectedCertPickup(null)}
        />
      )}
    </div>
  );
}
