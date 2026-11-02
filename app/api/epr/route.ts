import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const material = searchParams.get('material');

  let eprRecords = db.epr.find();

  if (status) {
    eprRecords = eprRecords.filter((r) => (r.creditStatus || '').toLowerCase() === status.toLowerCase());
  }
  if (material) {
    eprRecords = eprRecords.filter((r) => r.materialCategory === material || r.category === material);
  }

  const totalCredits = eprRecords.reduce((acc, r) => acc + (r.creditUnits || 0), 0);
  const eligibleWeight = eprRecords.reduce((acc, r) => acc + (r.eligibleWeightKg || 0), 0);

  return NextResponse.json({
    totalRecords: eprRecords.length,
    totalCreditsIssued: totalCredits,
    totalEligibleWeightKg: eligibleWeight,
    eprRecords,
    data: eprRecords,
  });
}
