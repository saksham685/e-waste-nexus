import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import { TiltCard3D } from '@/components/TiltCard3D';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Building2,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Certified Collection Depots & Drop-Off Hubs | E-Waste Nexus',
  description:
    'Discover authorized e-waste intake centers, operating hours, accepted hazardous material categories, and verified chain-of-custody protocols.',
};

// Next.js Server Component (Unit II: Server Components & Static Generation)
export default async function CentersPage() {
  const centers = db.centers.find();

  return (
    <div className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span>Next.js App Router &bull; SSG / SSR Hub Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Authorized E-Waste Collection &amp; Intake Depots
        </h1>
        <p className="mt-3 text-gray-400 text-sm sm:text-base">
          Drop off consumer and industrial electronic waste at verified collection facilities
          equipped with calibrated scales and zero-landfill assurance.
        </p>
      </div>

      {/* Centers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {centers.map((center) => (
          <TiltCard3D key={center.id}>
            <div className="bg-nexus-card border border-emerald-500/20 rounded-3xl p-6 h-full flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-glow-green transition-all duration-300">
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-nexus-dark border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  {center.isVerified && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1 shrink-0">
                      <ShieldCheck className="w-3 h-3" />
                      <span>R2 Certified</span>
                    </span>
                  )}
                </div>

                <h2 className="text-base font-bold text-white leading-snug mb-2">{center.name}</h2>

                {/* Details */}
                <div className="space-y-2 text-xs text-gray-400 mb-6">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      {center.address}, {center.city}, {center.state} {center.postalCode}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="font-mono text-[11px]">{center.operatingHours}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-mono text-[11px]">{center.phone}</span>
                  </div>
                </div>

                {/* Accepted Categories */}
                <div className="mb-6">
                  <span className="text-[10px] font-mono uppercase text-gray-500 tracking-wider block mb-2">
                    Accepted Materials:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {center.acceptedCategories.map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-nexus-dark text-[11px] font-mono text-emerald-300 border border-emerald-500/20"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Link */}
              <div className="pt-4 border-t border-emerald-500/10">
                <Link
                  href={`/centers/${center.slug}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-nexus-dark hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold text-xs transition-colors flex items-center justify-between group"
                >
                  <span>Facility Spec &amp; Logistics Guide</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </TiltCard3D>
        ))}
      </div>
    </div>
  );
}
