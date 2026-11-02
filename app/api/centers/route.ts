import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city');

  let centers = db.centers.find();
  if (city) {
    centers = centers.filter((c) => c.city.toLowerCase() === city.toLowerCase());
  }

  return NextResponse.json({
    total: centers.length,
    data: centers,
  });
}
