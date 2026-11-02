import { NextRequest, NextResponse } from 'next/server';
import { sendWebsiteAccessAlert, getRecentSMSLogs, MONITORED_NUMBERS } from '@/lib/smsService';

export async function POST(req: NextRequest) {
  try {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Unknown Client';
    const sourceUrl = req.headers.get('referer') || req.nextUrl.href;

    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'medium',
    });

    const dispatchResults = await sendWebsiteAccessAlert({
      ip,
      userAgent,
      timestamp,
      sourceUrl,
    });

    return NextResponse.json({
      success: true,
      timestamp,
      monitoredNumbers: MONITORED_NUMBERS.map((n) => n.raw),
      dispatches: dispatchResults,
    });
  } catch (error: any) {
    console.error('Error dispatching access SMS alert:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  const logs = getRecentSMSLogs();
  return NextResponse.json({
    monitoredNumbers: MONITORED_NUMBERS,
    logs: logs.slice(0, 10),
  });
}
