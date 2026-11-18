import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '50');
  const action = searchParams.get('action');
  const userId = searchParams.get('userId');

  let logs = db.auditLogs.find();

  if (action) {
    logs = logs.filter((l) => l.action === action);
  }
  if (userId) {
    logs = logs.filter((l) => l.actorId === userId);
  }

  // Sort by most recent first
  logs = logs.sort((a, b) =>
    new Date(b.timestamp || 0).getTime() -
    new Date(a.timestamp || 0).getTime()
  );

  const paged = logs.slice(0, limit);

  return NextResponse.json({
    total: logs.length,
    auditLogs: paged,
    data: paged,
  });
}
