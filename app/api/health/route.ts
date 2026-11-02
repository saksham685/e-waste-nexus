import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    platform: 'E-Waste Nexus Next.js Enterprise Suite',
    framework: 'Next.js App Router + React 18',
    timestamp: new Date().toISOString(),
  });
}
