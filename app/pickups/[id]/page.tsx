import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { Metadata } from 'next';
import {
  ArrowLeft,
  Truck,
  ShieldCheck,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  Package,
  Cpu,
  FileText,
  Key,
  Shield,
  Layers,
  ArrowRight,
  Scale,
} from 'lucide-react';
import { DriverRouteSimulator } from '@/components/DriverRouteSimulator';

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pickup = db.pickups.findById(params.id);
  if (!pickup) return { title: 'Pickup Not Found | E-Waste Nexus' };

  return {
    title: `Consignment Manifest #${pickup.id.slice(-8)} | E-Waste Nexus`,
    description: `Real-time custody tracking for ${pickup.category} (${pickup.currentStatus}).`,
  };
}

export default async function PickupDetailsPage({ params }: Props) {
  const pickup = db.pickups.findById(params.id);

  if (!pickup) {
    notFound();
  }

  const otpCode = `CPCB-${pickup.id.slice(-4).toUpperCase()}`;
  const isCertified = pickup.currentStatus === 'Certified' || pickup.currentStatus === 'Processed';

  return (
    <div className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
      {/* Back Link */}
      <Link
        href="/pickups"
        className="inline-flex items-center space-x-2 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Doorstep Collection Board</span>
      </Link>

      {/* Main Header Card */}
      <div className="bg-nexus-card border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-6 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-mono bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">
                CPCB Form-6 Manifest &bull; Chain-of-Custody
              </span>
              <span className="text-xs font-mono text-gray-400">UUID: {pickup.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {pickup.category}
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Consignor: <span className="text-white font-medium">{pickup.userName}</span> ({pickup.userEmail}) &bull; {pickup.userPhone}
            </p>
          </div>

          <div className="sm:text-right">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold font-mono uppercase bg-emerald-500 text-nexus-dark shadow-glow-green inline-block">
              {pickup.currentStatus}
            </span>
            <div className="text-[11px] font-mono text-gray-400 mt-2">
              Last Updated: {new Date(pickup.updatedAt).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Spec Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-nexus-dark/60 border border-emerald-500/20 text-xs font-mono mb-6">
          <div>
            <span className="text-gray-500 block text-[10px]">ESTIMATED WEIGHT</span>
            <span className="text-white font-bold">{pickup.estimatedWeightKg} kg</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px]">CERTIFIED NET SCALE</span>
            <span className="text-emerald-400 font-bold">
              {pickup.actualWeightKg ? `${pickup.actualWeightKg} kg` : 'Pending Scale'}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px]">REGISTERED UNITS</span>
            <span className="text-white font-bold">{pickup.estimatedQuantity} assets</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px]">DISPATCH WINDOW</span>
            <span className="text-cyan-400 font-bold">{pickup.scheduledDate}</span>
          </div>
        </div>

        {/* Pickup Address & Logistics Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-300">
          <div className="p-4 rounded-2xl bg-nexus-dark/50 border border-emerald-500/15 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-mono font-bold">
              <MapPin className="w-4 h-4" />
              <span>Doorstep Collection Point</span>
            </div>
            <p className="text-gray-200">{pickup.address}</p>
            {pickup.specialInstructions && (
              <p className="text-[11px] text-gray-400 italic">
                Note: &ldquo;{pickup.specialInstructions}&rdquo;
              </p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-nexus-dark/50 border border-emerald-500/15 space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono font-bold">
              <Truck className="w-4 h-4" />
              <span>Assigned Logistics &amp; Security</span>
            </div>
            <p className="text-gray-200 font-medium">
              {pickup.assignedPartnerName || 'Apex Green Fleet • Driver: Rajesh Sharma (DL-12-EA-9821)'}
            </p>
            <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 pt-1">
              <span>Handover PIN: <strong className="text-emerald-400">{otpCode}</strong></span>
              <span>Window: <strong className="text-cyan-400">{pickup.timeSlot || 'Morning'}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Driver GPS Route Simulator */}
      <DriverRouteSimulator
        pickupId={pickup.id}
        address={pickup.address}
        driverName={pickup.assignedPartnerName?.split('•')[1]?.split('(')[0]?.trim() || 'Rajesh Sharma'}
        vehicleNumber="DL-12-EA-9821"
        otpCode={otpCode}
      />

      {/* Custody Timeline */}
      <div className="bg-nexus-card border border-emerald-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
        <div className="flex items-center justify-between border-b border-emerald-500/15 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            <span>Chain-of-Custody Immutable Audit Log ({pickup.statusHistory.length} Events)</span>
          </h2>

          {isCertified && (
            <Link
              href={`/verify/${pickup.id}`}
              className="text-xs font-mono text-emerald-300 bg-emerald-500/20 hover:bg-emerald-500/30 px-3 py-1.5 rounded-full border border-emerald-500/40 flex items-center space-x-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verify Form-6 Public Registry &rarr;</span>
            </Link>
          )}
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-500/30">
          {pickup.statusHistory.map((item, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -left-[29px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-nexus-dark shadow-glow-green" />

              <div className="bg-nexus-dark/70 border border-emerald-500/20 rounded-2xl p-4 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <span className="text-sm font-bold text-white font-mono">{item.status}</span>
                  <span className="text-[11px] font-mono text-gray-500">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-300 mt-1">{item.note}</p>
                <div className="text-[10px] font-mono text-emerald-400/80 mt-2">
                  Verified Actor: {item.changedByName} (ID: {item.changedBy})
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
