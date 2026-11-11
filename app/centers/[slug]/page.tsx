import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { Metadata } from 'next';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Truck,
  Award,
  AlertTriangle,
} from 'lucide-react';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const reqSlug = params.slug?.toLowerCase();
  const center =
    db.centers.find(
      (c) =>
        c.slug?.toLowerCase() === reqSlug ||
        c.id?.toLowerCase() === reqSlug ||
        c.name?.toLowerCase().includes(reqSlug)
    )[0] || db.centers.find()[0];

  if (!center) return { title: 'Facility Specifications | E-Waste Nexus' };

  return {
    title: `${center.name} | E-Waste Nexus`,
    description: `Authorized intake specifications, operating hours, and accepted hazardous material categories for ${center.name}.`,
  };
}

export default async function CenterDetailPage({ params }: Props) {
  const reqSlug = params.slug?.toLowerCase();
  const center =
    db.centers.find(
      (c) =>
        c.slug?.toLowerCase() === reqSlug ||
        c.id?.toLowerCase() === reqSlug ||
        c.name?.toLowerCase().includes(reqSlug)
    )[0] || db.centers.find()[0];

  if (!center) {
    notFound();
  }

  return (
    <div className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link
        href="/centers"
        className="inline-flex items-center space-x-2 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Centers Directory</span>
      </Link>

      <div className="bg-nexus-card border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-6 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-2">
              <span>CPCB Authorized E-Waste Collection Facility</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {center.name}
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Facility Identifier: <span className="font-mono text-emerald-400">{center.id}</span>
            </p>
          </div>

          <div>
            <span className="px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified R2 / ISO 14001</span>
            </span>
          </div>
        </div>

        {/* Core Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-nexus-dark/60 border border-emerald-500/20 text-xs font-mono mb-8">
          <div>
            <span className="text-gray-500 block text-[10px]">OPERATING HOURS</span>
            <span className="text-white font-bold">{center.operatingHours}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px]">TELEPHONE DISPATCH</span>
            <span className="text-emerald-400 font-bold">{center.phone}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px]">OFFICIAL CORRESPONDENCE</span>
            <span className="text-cyan-400 font-bold">{center.email}</span>
          </div>
        </div>

        {/* Accepted Waste Streams */}
        <div className="mb-8">
          <h2 className="text-base font-bold text-white mb-3 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Authorized Intake Categories</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {center.acceptedCategories.map((cat, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-nexus-dark/80 border border-emerald-500/20 flex items-center space-x-3"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-gray-200">{cat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Environmental Standards */}
        <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 mb-8">
          <h3 className="text-sm font-bold text-emerald-300 mb-2 flex items-center space-x-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Chain-of-Custody Protocols</span>
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            All materials delivered to this facility undergo certified gross-tare weighing on
            NIST-calibrated electronic weigh scales. Storage bays feature non-permeable acid-resistant
            linings with sealed drainage systems to prevent ground chemical dispersion.
          </p>
        </div>

        {/* Book Pickup CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-emerald-500/20">
          <div className="text-xs text-gray-400">
            Need doorstep logistics rather than on-site drop-off?
          </div>
          <Link
            href="/pickups"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 text-nexus-dark font-bold text-xs shadow-glow-green hover:scale-105 transition-transform text-center flex items-center justify-center space-x-2"
          >
            <Truck className="w-4 h-4" />
            <span>Schedule Doorstep Pickup Instead</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
