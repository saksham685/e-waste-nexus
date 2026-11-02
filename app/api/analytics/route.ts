import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const pickups = db.pickups.find();
  const collections = db.collections.find();
  const recyclers = db.recyclers.find();
  const epr = db.epr.find();

  // Lifecycle calculations
  const totalWeightProcessed = recyclers.reduce((acc, r) => acc + (r.processedWeightKg || 0), 0);
  const totalVerifiedWeight = collections.reduce((acc, c) => acc + (c.verifiedWeightKg || c.submittedWeightKg || 0), 0);
  const totalPickupsCompleted = pickups.filter((p) => p.currentStatus === 'Completed').length;
  
  // EPA WEEE Conversion multipliers
  const co2AvoidedKg = totalWeightProcessed * 1.44;
  const heavyMetalsDivertedKg = totalWeightProcessed * 0.082;
  const preciousMetalsYieldGram = totalWeightProcessed * 0.28; // Gold & palladium assay

  return NextResponse.json({
    metrics: {
      totalPickups: pickups.length,
      pickupsCompleted: totalPickupsCompleted,
      totalWeightProcessedKg: Math.round(totalWeightProcessed * 10) / 10,
      totalVerifiedWeightKg: Math.round(totalVerifiedWeight * 10) / 10,
      co2AvoidedKg: Math.round(co2AvoidedKg * 10) / 10,
      heavyMetalsDivertedKg: Math.round(heavyMetalsDivertedKg * 10) / 10,
      preciousMetalsYieldGram: Math.round(preciousMetalsYieldGram * 10) / 10,
      eprCreditsIssued: epr.reduce((acc, r) => acc + (r.creditUnits || 0), 0),
    },
    categoryBreakdown: [
      { category: 'Laptops and Computers', share: 34, color: '#10b981' },
      { category: 'Smartphones and Tablets', share: 28, color: '#06b6d4' },
      { category: 'Batteries and Chargers', share: 18, color: '#eab308' },
      { category: 'Televisions and Monitors', share: 12, color: '#8b5cf6' },
      { category: 'Other Electronic Waste', share: 8, color: '#f97316' },
    ],
  });
}
