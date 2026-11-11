'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { soundEffects } from '@/lib/sound';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { wasteCategories } from '@/lib/validations';
import {
  createPickupAction,
  simulateAdvancePickupStep,
} from '@/actions/pickupActions';
import { PickupRequest } from '@/lib/types';
import { CertificateModal } from '@/components/CertificateModal';
import { CorporateBulkUpload } from '@/components/CorporateBulkUpload';
import { GreenWalletModal } from '@/components/GreenWalletModal';
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
  Filter,
  UserCheck,
  Phone,
  Hash,
  ChevronRight,
  RefreshCw,
  Award,
  ArrowUpRight,
  ShieldAlert,
  Building2,
  Gift,
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
  const [advancingId, setAdvancingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [selectedCertPickup, setSelectedCertPickup] = useState<PickupRequest | null>(null);
  const [activeTab, setActiveTab] = useState<'schedule' | 'book' | 'corporate' | 'list'>('schedule');
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'tomorrow' | 'upcoming'>('all');
  const [slotFilter, setSlotFilter] = useState<string>('all');

  // Form State
  const [category, setCategory] = useState<(typeof wasteCategories)[number]>('Laptops and Computers');
  const [quantity, setQuantity] = useState<number>(2);
  const [weightKg, setWeightKg] = useState<number>(5.0);
  const [address, setAddress] = useState<string>(
    user?.address || 'Flat 402, Green Valley Apartments, Sector 62, Noida, Uttar Pradesh 201309'
  );
  const [scheduledDate, setScheduledDate] = useState<string>(() => {
    const d = new Date(Date.now() + 86400000 * 2);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState<string>('Morning (09:00 - 12:00)');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  // Fetch Pickups
  const fetchPickups = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/pickups');
      if (res.ok) {
        const data = await res.json();
        setPickups(data.pickups || data.data || []);
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

  // Overall Statistics
  const stats = useMemo(() => {
    const totalCount = pickups.length;
    const completedCount = pickups.filter(
      (p) => p.currentStatus === 'Certified' || p.currentStatus === 'Processed'
    ).length;
    const totalWeightKg = pickups.reduce((acc, p) => acc + (p.actualWeightKg || p.estimatedWeightKg || 0), 0);
    const totalRewards = pickups.reduce((acc, p) => acc + (p.estimatedQuantity * 350), 0);

    return {
      totalCount,
      completedCount,
      totalWeightKg: Math.round(totalWeightKg * 10) / 10,
      totalRewards: totalRewards.toLocaleString('en-IN'),
    };
  }, [pickups]);

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
    setSpecialInstructions('Packaged in protective cardboard box with charging adapters.');
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
        voiceAssistant.speak(
          `Your collection has been scheduled for ${result.pickup.scheduledDate} in the ${timeSlot} slot.`
        );
        await fetchPickups();
        setActiveTab('schedule');
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

  // Advance Pipeline Step (Fast simulate testing)
  const handleAdvanceStep = async (pickupId: string) => {
    soundEffects.playClick();
    setAdvancingId(pickupId);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const actor = {
        id: user?.id || 'sim_operator_1',
        name: user?.name || 'Apex Green Operations',
        role: user?.role || 'partner',
      };

      const res = await simulateAdvancePickupStep(pickupId, actor);
      if (res.success) {
        soundEffects.playSuccess();
        const nextStatus = (res as any).pickup?.currentStatus;
        setSuccessMsg(`Consignment #${pickupId.slice(-6)} advanced to: ${nextStatus}`);
        voiceAssistant.speak(`Consignment updated to ${nextStatus}.`);
        await fetchPickups();
      } else {
        soundEffects.playError();
        setErrorMsg(res.error || 'Could not advance pickup.');
      }
    } catch (e: any) {
      soundEffects.playError();
      setErrorMsg(e?.message || 'Error advancing step.');
    } finally {
      setAdvancingId(null);
    }
  };

  // Filtered Pickups for Schedule & List
  const filteredPickups = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    return pickups.filter((p) => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          p.id.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.currentStatus.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Date filter
      if (dateFilter === 'today' && p.scheduledDate !== todayStr) return false;
      if (dateFilter === 'tomorrow' && p.scheduledDate !== tomorrowStr) return false;
      if (dateFilter === 'upcoming') {
        if (p.currentStatus === 'Certified' || p.currentStatus === 'Cancelled') return false;
      }

      // Slot filter
      if (slotFilter !== 'all' && p.timeSlot && !p.timeSlot.includes(slotFilter)) return false;

      return true;
    });
  }, [pickups, searchQuery, dateFilter, slotFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Requested':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Requested</span>
          </span>
        );
      case 'Assigned':
      case 'Scheduled':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Scheduled &amp; Assigned</span>
          </span>
        );
      case 'InTransit':
      case 'PickedUp':
      case 'Collected':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
            <Truck className="w-3 h-3 animate-pulse" />
            <span>In Transit &bull; Doorstep</span>
          </span>
        );
      case 'Weighed':
      case 'ReceivedAtCenter':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Weighed &amp; Calibrated</span>
          </span>
        );
      case 'Processed':
      case 'Certified':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3" />
            <span>CPCB Certified &bull; Form-6</span>
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

  // 5-Stage Stepper calculation
  const getStepProgress = (status: string) => {
    switch (status) {
      case 'Requested':
        return 1;
      case 'Assigned':
      case 'Scheduled':
        return 2;
      case 'InTransit':
      case 'PickedUp':
      case 'Collected':
        return 3;
      case 'Weighed':
      case 'ReceivedAtCenter':
        return 4;
      case 'Processed':
      case 'Certified':
        return 5;
      default:
        return 1;
    }
  };

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider">
          <Truck className="w-4 h-4" />
          <span>CPCB Certified Doorstep Collection &amp; Dispatch Ledger</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          E-Waste Collection &amp; Schedule Hub
        </h1>
        <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
          Connect citizens, authorized collection logistics, and smelters. Book doorstep collections, track scheduled time windows, verify calibrated scale weights, and mint auditable CPCB Form-6 recycling manifests.
        </p>
      </div>

      {/* High-Level Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-nexus-card border border-emerald-500/25 rounded-2xl p-4.5 backdrop-blur-xl">
          <div className="text-gray-400 text-xs font-mono flex items-center justify-between">
            <span>TOTAL CONSIGNMENTS</span>
            <Package className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 font-mono">
            {stats.totalCount}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">Booked across 450+ hub cities</div>
        </div>

        <div className="bg-nexus-card border border-cyan-500/25 rounded-2xl p-4.5 backdrop-blur-xl">
          <div className="text-gray-400 text-xs font-mono flex items-center justify-between">
            <span>VERIFIED WEIGHT DIVERTED</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300 mt-1.5 font-mono">
            {stats.totalWeightKg} <span className="text-base text-gray-400 font-sans">kg</span>
          </div>
          <div className="text-[11px] text-gray-500 mt-1">NIST 800-88 certified scale weighings</div>
        </div>

        <div className="bg-nexus-card border border-amber-500/25 rounded-2xl p-4.5 backdrop-blur-xl">
          <div className="text-gray-400 text-xs font-mono flex items-center justify-between">
            <span>CERTIFIED FORM-6 MANIFESTS</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 mt-1.5 font-mono">
            {stats.completedCount}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">EPR credits minted for OEM quotas</div>
        </div>

        <div className="bg-nexus-card border border-lime-500/25 rounded-2xl p-4.5 backdrop-blur-xl">
          <div className="text-gray-400 text-xs font-mono flex items-center justify-between">
            <span>ESTIMATED CASH &amp; REWARDS</span>
            <Coins className="w-4 h-4 text-lime-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-lime-300 mt-1.5 font-mono">
            ₹{stats.totalRewards}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">Instant UPI doorstep payouts</div>
        </div>
      </div>

      {/* Main Mode Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center space-x-2 bg-nexus-dark/80 p-1.5 rounded-2xl border border-emerald-500/25">
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('schedule');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'schedule'
                ? 'bg-emerald-500 text-nexus-dark shadow-glow-green'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Scheduled Pickups Board</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900/60 font-mono">
              {pickups.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('book');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'book'
                ? 'bg-emerald-500 text-nexus-dark shadow-glow-green'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Book Doorstep Collection</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('corporate');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'corporate'
                ? 'bg-emerald-500 text-nexus-dark shadow-glow-green'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Corporate B2B Bulk Disposal</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('list');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'list'
                ? 'bg-emerald-500 text-nexus-dark shadow-glow-green'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>All Consignments Directory</span>
          </button>
        </div>

        {/* Global Refresh & Green Wallet Button */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              setIsWalletOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-lime-500/20 hover:from-emerald-500/30 hover:to-lime-500/30 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-mono font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-glow-green"
          >
            <Coins className="w-4 h-4 text-emerald-400" />
            <span>Green Wallet (1,450 Pts)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              fetchPickups();
            }}
            className="p-2 rounded-xl bg-nexus-card border border-emerald-500/25 hover:border-emerald-500/50 text-gray-300 hover:text-white transition-all cursor-pointer flex items-center space-x-1.5 text-xs font-mono"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Notifications / Alerts */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: SCHEDULE & LIVE TRACKING TIMELINE BOARD                           */}
      {/* ========================================================================= */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          {/* Schedule Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-nexus-card border border-emerald-500/25 rounded-2xl p-4 backdrop-blur-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-gray-400 mr-2 flex items-center space-x-1">
                <Filter className="w-3.5 h-3.5 text-emerald-400" />
                <span>Schedule Filters:</span>
              </span>

              <button
                type="button"
                onClick={() => setDateFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  dateFilter === 'all'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'text-gray-400 hover:text-white bg-nexus-dark/50'
                }`}
              >
                All Dates
              </button>

              <button
                type="button"
                onClick={() => setDateFilter('today')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  dateFilter === 'today'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'text-gray-400 hover:text-white bg-nexus-dark/50'
                }`}
              >
                Today
              </button>

              <button
                type="button"
                onClick={() => setDateFilter('tomorrow')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  dateFilter === 'tomorrow'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'text-gray-400 hover:text-white bg-nexus-dark/50'
                }`}
              >
                Tomorrow
              </button>

              <button
                type="button"
                onClick={() => setDateFilter('upcoming')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  dateFilter === 'upcoming'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'text-gray-400 hover:text-white bg-nexus-dark/50'
                }`}
              >
                Active Only
              </button>
            </div>

            {/* Time Slot Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-gray-400">Slot:</span>
              <select
                value={slotFilter}
                onChange={(e) => setSlotFilter(e.target.value)}
                className="bg-nexus-dark border border-emerald-500/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400 font-sans"
              >
                <option value="all">All Windows</option>
                <option value="Morning">Morning (09:00 - 12:00)</option>
                <option value="Afternoon">Afternoon (13:00 - 17:00)</option>
                <option value="Evening">Evening (17:00 - 20:00)</option>
              </select>
            </div>
          </div>

          {/* Scheduled Cards Grid */}
          {isLoading ? (
            <div className="p-16 text-center text-gray-400 font-mono text-sm space-y-3">
              <div className="w-10 h-10 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin mx-auto" />
              <div>Synchronizing live doorstep schedule ledger...</div>
            </div>
          ) : filteredPickups.length === 0 ? (
            <div className="p-12 text-center bg-nexus-card border border-emerald-500/20 rounded-3xl text-gray-400 space-y-4">
              <Calendar className="w-12 h-12 text-emerald-400/40 mx-auto" />
              <div className="font-bold text-white text-base">No collections scheduled for this view</div>
              <p className="text-xs max-w-md mx-auto text-gray-400">
                You have no scheduled pickups matching your selected date or window filter. Book a new collection to dispatch an authorized logistics partner.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('book')}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-nexus-dark font-bold text-xs shadow-glow-green"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Schedule a Doorstep Pickup Now</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {filteredPickups.map((p) => {
                const step = getStepProgress(p.currentStatus);
                const isCertified = p.currentStatus === 'Certified' || p.currentStatus === 'Processed';
                const otpCode = `CPCB-${p.id.slice(-4).toUpperCase()}`;

                return (
                  <div
                    key={p.id}
                    className="bg-nexus-card border border-emerald-500/25 hover:border-emerald-500/45 rounded-3xl p-6 transition-all shadow-xl space-y-5 group relative overflow-hidden"
                  >
                    {/* Top Header Row */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-emerald-500/15 pb-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                            #{p.id.slice(-8)}
                          </span>
                          {getStatusBadge(p.currentStatus)}
                          <span className="text-[11px] font-mono text-gray-400 flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-cyan-400" />
                            <span className="text-white font-medium">{p.scheduledDate}</span>
                            <span className="text-gray-500">&bull;</span>
                            <span className="text-cyan-300">{p.timeSlot || 'Morning (09:00 - 12:00)'}</span>
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mt-1.5 flex items-center space-x-2">
                          <span>{p.category}</span>
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Consignor: <span className="text-gray-200">{p.userName}</span> &bull; {p.userPhone}
                        </p>
                      </div>

                      {/* Right Handover Badge */}
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-nexus-dark/90 border border-emerald-500/30 text-right">
                          <span className="text-[10px] font-mono text-gray-400 block">DOORSTEP HANDOVER PIN</span>
                          <span className="text-sm font-mono font-black text-emerald-400 tracking-wider">
                            {otpCode}
                          </span>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-white">
                            {p.estimatedQuantity} Units &bull; {p.actualWeightKg ? `${p.actualWeightKg} kg (Net)` : `${p.estimatedWeightKg} kg (Est)`}
                          </div>
                          <div className="text-[11px] font-mono text-emerald-400 mt-0.5">
                            Est. ₹{(p.estimatedQuantity * 350).toLocaleString('en-IN')} UPI
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 5-Step Visual Stepper */}
                    <div className="bg-nexus-dark/60 rounded-2xl p-4 border border-emerald-500/15">
                      <div className="text-[11px] font-mono text-gray-400 mb-3 flex items-center justify-between">
                        <span>CHAIN-OF-CUSTODY AUDIT TRAIL</span>
                        <span className="text-emerald-400">Step {step} of 5</span>
                      </div>

                      <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-mono">
                        {/* Step 1 */}
                        <div className="space-y-1.5">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              step >= 1 ? 'bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-gray-800'
                            }`}
                          />
                          <span className={step >= 1 ? 'text-cyan-300 font-bold' : 'text-gray-500'}>
                            1. Booked
                          </span>
                        </div>

                        {/* Step 2 */}
                        <div className="space-y-1.5">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              step >= 2 ? 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]' : 'bg-gray-800'
                            }`}
                          />
                          <span className={step >= 2 ? 'text-blue-300 font-bold' : 'text-gray-500'}>
                            2. Logistics
                          </span>
                        </div>

                        {/* Step 3 */}
                        <div className="space-y-1.5">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              step >= 3 ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'bg-gray-800'
                            }`}
                          />
                          <span className={step >= 3 ? 'text-amber-300 font-bold' : 'text-gray-500'}>
                            3. In-Transit
                          </span>
                        </div>

                        {/* Step 4 */}
                        <div className="space-y-1.5">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              step >= 4 ? 'bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]' : 'bg-gray-800'
                            }`}
                          />
                          <span className={step >= 4 ? 'text-indigo-300 font-bold' : 'text-gray-500'}>
                            4. Weighed
                          </span>
                        </div>

                        {/* Step 5 */}
                        <div className="space-y-1.5">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              step >= 5 ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-gray-800'
                            }`}
                          />
                          <span className={step >= 5 ? 'text-emerald-300 font-bold' : 'text-gray-500'}>
                            5. Certified
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Logistics Partner & Address Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-nexus-dark/50 border border-emerald-500/10 flex items-start space-x-2.5">
                        <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-mono text-gray-500 block uppercase">Doorstep Address</span>
                          <span className="text-gray-200 line-clamp-2">{p.address}</span>
                          {p.specialInstructions && (
                            <span className="text-[11px] text-gray-400 italic block mt-1">
                              Note: &ldquo;{p.specialInstructions}&rdquo;
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-nexus-dark/50 border border-emerald-500/10 flex items-start space-x-2.5">
                        <Truck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-mono text-gray-500 block uppercase">Assigned Fleet Partner</span>
                          <span className="text-gray-200 font-medium">
                            {p.assignedPartnerName || 'Apex Green Logistics • Driver: Vikram Singh (DL-12-EA-9821)'}
                          </span>
                          <span className="text-[11px] text-cyan-400/90 font-mono block mt-0.5">
                            Calibrated Scale: AVERY-INDIA-WB940 &bull; Net: {p.actualWeightKg ? `${p.actualWeightKg} kg` : 'Pending weighbridge'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-emerald-500/10 pt-4">
                      {/* Fast-Track Simulation Button */}
                      <div>
                        {!isCertified ? (
                          <button
                            type="button"
                            onClick={() => handleAdvanceStep(p.id)}
                            disabled={advancingId === p.id}
                            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 hover:from-cyan-500/30 hover:to-emerald-500/30 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-mono font-bold flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
                            title="Simulate advancing consignment to the next physical stage"
                          >
                            <Sparkles className={`w-3.5 h-3.5 ${advancingId === p.id ? 'animate-spin' : ''}`} />
                            <span>
                              {advancingId === p.id
                                ? 'Advancing Ledger...'
                                : step === 1
                                ? '⚡ Dispatch Partner (Step 2)'
                                : step === 2
                                ? '⚡ En Route to Doorstep (Step 3)'
                                : step === 3
                                ? '⚡ Calibrated Weighbridge (Step 4)'
                                : '⚡ Smelt & Mint Form-6 (Step 5)'}
                            </span>
                          </button>
                        ) : (
                          <div className="inline-flex items-center space-x-1.5 text-xs font-mono text-emerald-400">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Consignment Fully Certified &amp; Minted</span>
                          </div>
                        )}
                      </div>

                      {/* Right Detail / Certificate Links */}
                      <div className="flex items-center space-x-2">
                        {isCertified && (
                          <button
                            type="button"
                            onClick={() => {
                              soundEffects.playClick();
                              setSelectedCertPickup(p);
                            }}
                            className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-mono text-xs font-bold flex items-center space-x-1.5 border border-emerald-500/40 cursor-pointer shadow-glow-green"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View CPCB Form-6</span>
                          </button>
                        )}

                        <Link
                          href={`/pickups/${p.id}`}
                          className="px-3.5 py-2 rounded-xl bg-nexus-dark hover:bg-slate-800 text-gray-300 hover:text-white border border-emerald-500/25 text-xs font-medium flex items-center space-x-1 transition-all"
                        >
                          <span>Full Manifest</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BOOK NEW DOORSTEP COLLECTION FORM                                 */}
      {/* ========================================================================= */}
      {activeTab === 'book' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form */}
          <div className="lg:col-span-7 bg-nexus-card border border-emerald-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
              <div className="flex items-center space-x-2">
                <PlusCircle className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Book Doorstep E-Waste Collection</h2>
              </div>
              <button
                type="button"
                onClick={handleAutoFill}
                className="text-xs font-mono text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/30 transition-all cursor-pointer"
              >
                ⚡ Auto-Fill Sample
              </button>
            </div>

            <form onSubmit={handleCreatePickup} className="space-y-4">
              {/* Category Picker */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Select Equipment Category:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {CATEGORY_PRESETS.map((preset) => {
                    const Icon = preset.icon;
                    const isSelected = category === preset.name;
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'border-emerald-400 bg-emerald-500/20 text-white shadow-glow-green scale-102'
                            : 'border-emerald-500/20 bg-nexus-dark/70 text-gray-400 hover:text-white hover:border-emerald-500/50'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-emerald-300' : 'text-gray-400'}`} />
                        <span className="text-xs font-bold leading-tight">{preset.name.split(' ')[0]}</span>
                        <span className="text-[10px] text-gray-400 mt-1">~₹{preset.rewardPerUnit}/ea</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity & Weight */}
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
                    Estimated Weight (kg)
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

              {/* Reward Preview */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/80 via-nexus-dark to-emerald-950/80 border border-emerald-500/30 flex items-center justify-between text-xs">
                <span className="text-gray-300 flex items-center space-x-1.5">
                  <Coins className="w-4 h-4 text-emerald-400" />
                  <span>Doorstep Valuation &amp; Credit:</span>
                </span>
                <span className="text-emerald-400 font-mono font-bold">
                  ₹{estimatedReward.cash} UPI + {estimatedReward.points} Green Points
                </span>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Pickup Doorstep Address (All India Hubs)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="House/Office No., Street, Sector, City, Pincode"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Date & Time Window */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Scheduled Date
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
                    Doorstep Window
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

              {/* Special Instructions */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Access &amp; Handling Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Call 10 mins prior, fragile monitor, gate code #402"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-3 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-nexus-dark font-black text-sm tracking-wide shadow-glow-green transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer hover:scale-101 active:scale-99"
              >
                {isSubmitting ? (
                  <span>Registering Consignment on CPCB Ledger...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Confirm &amp; Dispatch Doorstep Collection</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Highlights & Verification Guarantees */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-nexus-card border border-emerald-500/20 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Our 4-Point Doorstep Assurance</span>
              </h3>

              <div className="space-y-3 text-xs text-gray-300">
                <div className="p-3 rounded-xl bg-nexus-dark/60 border border-emerald-500/10 space-y-1">
                  <div className="font-bold text-white flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Calibrated On-Site Weighbridge</span>
                  </div>
                  <p className="text-gray-400 text-[11px]">
                    Every logistics vehicle carries a certified Class-III digital scale calibrated under the Legal Metrology Act.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-nexus-dark/60 border border-emerald-500/10 space-y-1">
                  <div className="font-bold text-white flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Instant Doorstep UPI Remittance</span>
                  </div>
                  <p className="text-gray-400 text-[11px]">
                    Scrap value payout is transferred via UPI directly to your bank account before the driver leaves your premises.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-nexus-dark/60 border border-emerald-500/10 space-y-1">
                  <div className="font-bold text-white flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>NIST 800-88 Data Sanitization</span>
                  </div>
                  <p className="text-gray-400 text-[11px]">
                    All laptops, smartphones, and hard drives undergo cryptographic multi-pass data shredding or physical degaussing.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-nexus-dark/60 border border-emerald-500/10 space-y-1">
                  <div className="font-bold text-white flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                    <span>Statutory CPCB Form-6 Manifest</span>
                  </div>
                  <p className="text-gray-400 text-[11px]">
                    Receive an official government recycling certificate with tamper-evident SHA-256 hash proofs for tax or CSR filings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ALL CONSIGNMENTS DIRECTORY TABLE                                   */}
      {/* ========================================================================= */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Package className="w-5 h-5 text-emerald-400" />
                <span>All Consignments Directory ({filteredPickups.length})</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Complete historical record of all citizen submissions and status changes
              </p>
            </div>

            {/* Search Filter */}
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by ID, Category, Address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {filteredPickups.length === 0 ? (
            <div className="p-8 text-center bg-nexus-card border border-emerald-500/20 rounded-2xl text-gray-400">
              No matching consignments found.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPickups.map((p) => (
                <div
                  key={p.id}
                  className="bg-nexus-card border border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl p-4 transition-all shadow-md space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/10 pb-2.5">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-emerald-400">#{p.id.slice(-8)}</span>
                        {getStatusBadge(p.currentStatus)}
                      </div>
                      <h4 className="font-bold text-white text-sm mt-1">{p.category}</h4>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-white">
                        {p.estimatedQuantity} Units &bull; {p.actualWeightKg ? `${p.actualWeightKg} kg` : `${p.estimatedWeightKg} kg`}
                      </div>
                      <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                        Date: {p.scheduledDate} &bull; {p.timeSlot || 'Morning'}
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
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CORPORATE B2B BULK ASSET DISPOSAL                                  */}
      {/* ========================================================================= */}
      {activeTab === 'corporate' && <CorporateBulkUpload />}

      {/* Certificate Modal */}
      {selectedCertPickup && (
        <CertificateModal
          pickup={selectedCertPickup}
          onClose={() => setSelectedCertPickup(null)}
        />
      )}

      {/* Green Wallet Modal */}
      {isWalletOpen && (
        <GreenWalletModal onClose={() => setIsWalletOpen(false)} />
      )}
    </div>
  );
}
