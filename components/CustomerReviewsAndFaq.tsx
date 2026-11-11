'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Star,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Building,
  User,
  BadgeIndianRupee,
} from 'lucide-react';

interface Review {
  id: string;
  name: string;
  city: string;
  role: string;
  devices: string;
  payout: string;
  rating: number;
  comment: string;
}

const REVIEWS: Review[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    city: 'New Delhi (Dwarka)',
    role: 'Individual Citizen',
    devices: '2 Dead Android Phones & 1 Broken Tablet',
    payout: '₹2,680 via UPI',
    rating: 5,
    comment:
      'Super easy and transparent! The agent arrived right on schedule, weighed the phones on an electronic digital scale, and within 30 seconds I got the UPI confirmation on my PhonePe. No haggling with local scrap dealers.',
  },
  {
    id: '2',
    name: 'Vikramaditya Mehta',
    city: 'Bengaluru (Koramangala)',
    role: 'IT Operations Lead, FinCorp',
    devices: '18 Obsolete Laptops & 6 Server UPS Units',
    payout: '₹58,400 + CPCB Form-6',
    rating: 5,
    comment:
      'We needed proper CPCB compliance certificates and certified data wiping for our corporate IT asset retirement. E-Waste Nexus provided serialized NIST 800-88 data destruction certificates and seamless doorstep fleet dispatch.',
  },
  {
    id: '3',
    name: 'Ananya Deshmukh',
    city: 'Pune (Viman Nagar)',
    role: 'Household Consignor',
    devices: 'Old CRT Monitor, 4 Chargers & Power Bank',
    payout: '₹1,450 via GPay',
    rating: 5,
    comment:
      'I was so happy to find a platform that actually recycles e-waste scientifically instead of burning wires in informal slums. Also earned 240 Green Eco-Points on my dashboard!',
  },
];

const FAQS = [
  {
    q: 'Do you accept completely dead, water-damaged, or cracked devices?',
    a: 'Yes, absolutely! Unlike refurbished gadget buyers, we are a certified electronic waste and metallurgical refining platform. We extract precious raw elements (Gold, Copper, Silver, Palladium, Lithium) from all devices regardless of condition, age, or physical damage.',
  },
  {
    q: 'Is doorstep collection really 100% free?',
    a: 'Yes! There are zero doorstep inspection or pickup charges across our network in 450+ cities across India. You get paid the full transparent scale weight value directly.',
  },
  {
    q: 'What happens to the personal data, photos, and files on my old devices?',
    a: 'Data privacy is our highest priority. All data-bearing storage chips (SSDs, eMMC, hard drives) undergo military-grade 3-pass data wipe or physical hydraulic punch destruction in compliance with DoD 5220.22-M and NIST 800-88 guidelines. A signed Certificate of Data Destruction is issued to you.',
  },
  {
    q: 'How and when do I get paid for my e-waste?',
    a: 'Payment is made immediately on the spot! As soon as the field agent weighs and inspects your devices with the calibrated digital scale, payment is transferred directly to your UPI (GPay, PhonePe, Paytm) or bank account within 60 seconds.',
  },
  {
    q: 'Can companies or institutions book bulk commercial pickups?',
    a: 'Yes! For corporate offices, schools, hospitals, and datacenters disposing of 50+ units or bulk IT scrap, we provide dedicated heavy transport vehicles, GST billing, and statutory CPCB Form-6 consignment certificates for corporate ESG and EPR auditing.',
  },
];

const POPULAR_CITIES = [
  { city: 'Delhi NCR', centers: '42 Active Hubs', avgPickupTime: 'Within 2 Hours' },
  { city: 'Mumbai', centers: '38 Active Hubs', avgPickupTime: 'Within 3 Hours' },
  { city: 'Bengaluru', centers: '45 Active Hubs', avgPickupTime: 'Same Day' },
  { city: 'Hyderabad', centers: '28 Active Hubs', avgPickupTime: 'Same Day' },
  { city: 'Pune', centers: '24 Active Hubs', avgPickupTime: 'Within 4 Hours' },
  { city: 'Chennai', centers: '31 Active Hubs', avgPickupTime: 'Same Day' },
];

export const CustomerReviewsAndFaq: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* 1. VERIFIED CUSTOMER REVIEWS & PAYOUT PROOFS */}
      <div>
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>4.9 / 5 Rating from 12,400+ Verified Consignors</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Loved by Citizens, Housing Societies &amp; Enterprises
          </h2>
          <p className="mt-2 text-sm text-zinc-400 font-light">
            Real feedback from people who disposed of electronic waste responsibly and got paid instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-lg"
            >
              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed font-light italic mb-4">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">{rev.name}</div>
                    <div className="text-[11px] text-zinc-400">{rev.city}</div>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {rev.payout}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-500 font-mono truncate">
                  Disposed: {rev.devices}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. SERVING 450+ CITIES NATIONWIDE QUICK BAR */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Doorstep Pickup Available in 450+ Cities Across India</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Instant fleet dispatch with verified scales in all tier-1 and tier-2 metropolitan clusters.
            </p>
          </div>
          <Link
            href="/centers"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center space-x-1 shrink-0"
          >
            <span>View All Authorized Drop-off Centers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {POPULAR_CITIES.map((c) => (
            <div key={c.city} className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-left">
              <div className="text-xs font-bold text-white">{c.city}</div>
              <div className="text-[10px] text-emerald-400 font-mono mt-0.5">{c.centers}</div>
              <div className="text-[9px] text-zinc-500 mt-0.5">{c.avgPickupTime}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. INTERACTIVE ACCORDION FAQS */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-medium mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-white cursor-pointer hover:bg-zinc-850/50 transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs text-zinc-400 leading-relaxed font-light border-t border-zinc-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
