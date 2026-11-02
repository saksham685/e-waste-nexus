'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { soundEffects } from '@/lib/sound';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { wasteCategories } from '@/lib/validations';
import { createPickupAction } from '@/actions/pickupActions';
import { PickupRequest } from '@/lib/types';
import { CertificateModal } from '@/components/CertificateModal';
import { TiltCard3D } from '@/components/TiltCard3D';
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
  Weight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function PickupsPage() {
  const { user } = useAuthStore();
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [selectedCertPickup, setSelectedCertPickup] = useState<PickupRequest | null>(null);

  // Form State
  const [category, setCategory] = useState<(typeof wasteCategories)[number]>('Laptops and Computers');
  const [quantity, setQuantity] = useState<number>(2);
  const [weightKg, setWeightKg] = useState<number>(4.5);
  const [address, setAddress] = useState<string>(user?.address || '742 Evergreen Terrace, Sector 4, Silicon Valley, CA');
  const [scheduledDate, setScheduledDate] = useState<string>(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState<string>('Morning (09:00 - 12:00)');
  const [specialInstructions, setSpecialInstructions] = useState<string>('Batteries packaged in anti-static ESD bags.');

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

  const handleCreatePickup = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playClick();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      const userPayload = {
        id: user?.id || 'guest_user',
        name: user?.name || 'Authorized Citizen Consignor',
        email: user?.email || 'citizen@nexus.io',
        phone: user?.phone || '+1 (415) 555-0199',
      };

      const result = await createPickupAction(
        {
          category,
          estimatedQuantity: Number(quantity),
          estimatedWeightKg: Number(weightKg),
          address,
          scheduledDate,
          timeSlot,
          specialInstructions,
        },
        userPayload
      );

      if (result.success && result.pickup) {
        soundEffects.playSuccess();
        setSuccessMsg(`Pickup Request #${result.pickup.id.slice(-6)} created successfully!`);
        voiceAssistant.speak(`Your pickup request for ${category} has been submitted with certified chain-of-custody.`);
        // Refresh pickups
        await fetchPickups();
      } else {
        soundEffects.playError();
        setErrorMsg(result.error || 'Failed to submit pickup request');
      }
    } catch (err: any) {
      soundEffects.playError();
      setErrorMsg(err?.message || 'Network error occurred during submission');
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-3">
          <Truck className="w-3.5 h-3.5" />
          <span>Next.js App Router &bull; Server Actions &bull; Zod Validation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          On-Demand Certified E-Waste Collection
        </h1>
        <p className="mt-3 text-gray-400 text-sm sm:text-base">
          Schedule free doorstep pickup of discarded electrical equipment with tamper-evident
          custody logging and instant destruction certification.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Server Action Booking Form */}
        <div className="lg:col-span-5 bg-nexus-card border border-emerald-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <PlusCircle className="w-5 h-5 text-emerald-400" />
              <span>Schedule New Collection</span>
            </h2>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Form Validation: Zod
            </span>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreatePickup} className="space-y-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                E-Waste Material Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400 font-sans"
              >
                {wasteCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity and Weight */}
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
                  onChange={(e) => setQuantity(Number(e.target.value))}
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
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  required
                  className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Pickup Street Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Target Date
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
                  className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400 font-sans"
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
                Notes &amp; Handling Precautions
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={2}
                className="w-full bg-nexus-dark border border-emerald-500/30 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* Submit Button (Server Action Trigger) */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-nexus-dark font-extrabold text-sm shadow-glow-green transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Mutating via Server Action...' : 'Confirm Certified Pickup'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Existing Pickups Manifest */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Truck className="w-5 h-5 text-emerald-400" />
              <span>Your Active Consignment Manifests ({pickups.length})</span>
            </h2>
            <button
              onClick={fetchPickups}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Refresh
            </button>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-gray-400 font-mono text-sm animate-pulse">
              Hydrating server pickup manifests...
            </div>
          ) : pickups.length === 0 ? (
            <div className="p-8 text-center bg-nexus-card border border-emerald-500/20 rounded-2xl text-gray-400">
              No pickup manifests found. Submit your first request using the form on the left.
            </div>
          ) : (
            <div className="space-y-4">
              {pickups.map((p) => (
                <TiltCard3D key={p.id}>
                  <div className="bg-nexus-card border border-emerald-500/20 rounded-2xl p-5 hover:border-emerald-500/40 transition-all duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/10 pb-3 mb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-emerald-400">
                            #{p.id.slice(-8)}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs font-semibold text-white">{p.category}</span>
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          Consignor: {p.userName} &bull; {p.scheduledDate} ({p.timeSlot})
                        </div>
                      </div>

                      <div>{getStatusBadge(p.currentStatus)}</div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-gray-300 mb-4">
                      <div>
                        <span className="text-gray-500 block text-[10px]">QUANTITY</span>
                        <span>{p.estimatedQuantity} units</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px]">CERTIFIED WEIGHT</span>
                        <span className="text-emerald-300 font-bold">
                          {p.actualWeightKg ? `${p.actualWeightKg} kg` : `${p.estimatedWeightKg} kg (Est.)`}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500 block text-[10px]">PICKUP LOCATION</span>
                        <span className="truncate block">{p.address}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-emerald-500/10">
                      <Link
                        href={`/pickups/${p.id}`}
                        className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                      >
                        <span>View Dynamic Route &bull; [id]</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      {(p.currentStatus === 'Certified' || p.currentStatus === 'Processed') && (
                        <button
                          onClick={() => {
                            soundEffects.playClick();
                            setSelectedCertPickup(p);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 text-nexus-dark text-xs font-bold shadow-glow-green flex items-center space-x-1.5 hover:scale-105 transition-transform"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>View Official Certificate</span>
                        </button>
                      )}
                    </div>
                  </div>
                </TiltCard3D>
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
