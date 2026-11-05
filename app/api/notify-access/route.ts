import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ success: true, message: 'SMS notification disabled' });
}

export async function GET() {
  return NextResponse.json({ success: true, message: 'SMS notification disabled' });
}
