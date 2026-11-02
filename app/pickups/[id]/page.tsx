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
} from 'lucide-react';

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pickup = db.pickups.findById(params.id);
  if (!pickup) return { title: 'Pickup Not Found | E-Waste Nexus' };

  return {
    title: `Pickup Manifest #${pickup.id.slice(-8)} | E-Waste Nexus`,
    description: `Real-time custody tracking for ${pickup.category} (${pickup.currentStatus}).`,
  };
}

// Server Component (Next.js Unit II: Server-side Data Fetching & SSR)
export default async function PickupDetailsPage({ params }: Props) {
  const pickup = db.pickups.findById(params.id);

  if (!pickup) {
    notFound();
  }

  return (
    <div className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Back Link */}
      <Link
        href="/pickups"
        className="inline-flex items-center space-x-2 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to All Pickups</span>
      </Link>

      {/* Main Header Card */}
      <div className="bg-nexus-card border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-6 mb-6">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <span className="text-xs font-mono bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">
                DYNAMIC ROUTE: /pickups/[id]
              </span>
              <span className="text-xs font-mono text-gray-400">ID: {pickup.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {pickup.category}
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Consignor: <span className="text-white font-medium">{pickup.userName}</span> ({pickup.userEmail})
            </p>
          </div>

          <div className="sm:text-right">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold font-mono uppercase bg-emerald-500 text-nexus-dark shadow-glow-green inline-block">
              {pickup.currentStatus}
            </span>
            <div className="text-[11px] font-mono text-gray-400 mt-2">
              Updated: {new Date(pickup.updatedAt).toLocaleString()}
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
            <span className="text-gray-500 block text-[10px]">CERTIFIED TARE WEIGHT</span>
            <span className="text-emerald-400 font-bold">
              {pickup.actualWeightKg ? `${pickup.actualWeightKg} kg` : 'Pending Scale'}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px]">UNITS / ASSETS</span>
            <span className="text-white font-bold">{pickup.estimatedQuantity} units</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px]">DISPATCH WINDOW</span>
            <span className="text-cyan-400 font-bold">{pickup.scheduledDate}</span>
          </div>
        </div>

        {/* Pickup Address & Notes */}
        <div className="space-y-3 text-xs text-gray-300">
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-gray-500 block text-[10px] font-mono">COLLECTION POINT</span>
              <span>{pickup.address}</span>
            </div>
          </div>

          {pickup.specialInstructions && (
            <div className="flex items-start space-x-2">
              <FileText className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-gray-500 block text-[10px] font-mono">CONSIGNOR NOTES</span>
                <span className="italic">{pickup.specialInstructions}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custody Timeline */}
      <div className="bg-nexus-card border border-emerald-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
          <Clock className="w-5 h-5 text-emerald-400" />
          <span>Chain-of-Custody Immutable Timeline</span>
        </h2>

        <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-500/30">
          {pickup.statusHistory.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Dot */}
              <div className="absolute -left-[29px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-nexus-dark shadow-glow-green" />

              <div className="bg-nexus-dark/70 border border-emerald-500/20 rounded-2xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <span className="text-sm font-bold text-white font-mono">{item.status}</span>
                  <span className="text-[11px] font-mono text-gray-500">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-300 mt-1">{item.note}</p>
                <div className="text-[10px] font-mono text-emerald-400/80 mt-2">
                  Actor: {item.changedByName} (ID: {item.changedBy})
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
