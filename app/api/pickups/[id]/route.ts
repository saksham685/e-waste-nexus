import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/pickups/:id - Retrieve specific pickup request
export async function GET(req: NextRequest, { params }: RouteParams) {
  const pickup = db.pickups.findById(params.id);
  if (!pickup) {
    return NextResponse.json({ error: 'Pickup request not found' }, { status: 404 });
  }

  // Related collection and recycler info
  const collection = db.collections.findOne((c) => c.pickupId === params.id);
  const recycler = db.recyclers.findOne((r) => r.pickupId === params.id);
  const epr = db.epr.findOne((e) => e.pickupId === params.id);

  return NextResponse.json({
    data: pickup,
    collection,
    recycler,
    epr,
  });
}

// PATCH /api/pickups/:id - Update status, partner assignment, or notes
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const pickup = db.pickups.findById(params.id);
    if (!pickup) {
      return NextResponse.json({ error: 'Pickup request not found' }, { status: 404 });
    }

    const body = await req.json();
    const now = new Date().toISOString();

    const previous = { ...pickup };
    let statusHistory = [...pickup.statusHistory];

    if (body.currentStatus && body.currentStatus !== pickup.currentStatus) {
      statusHistory.push({
        status: body.currentStatus,
        timestamp: now,
        changedBy: body.actorId || 'system',
        changedByName: body.actorName || 'Nexus Controller',
        note: body.note || `Status transition to ${body.currentStatus}`,
      });
    }

    const updated = db.pickups.update(params.id, {
      ...body,
      statusHistory,
      updatedAt: now,
    });

    db.logAudit(
      body.actorId || 'system',
      body.actorName || 'Nexus Controller',
      body.actorRole || 'admin',
      'UPDATE_PICKUP',
      'pickup',
      params.id,
      previous,
      updated
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 500 });
  }
}

// DELETE /api/pickups/:id - Cancel or delete pickup
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const pickup = db.pickups.findById(params.id);
  if (!pickup) {
    return NextResponse.json({ error: 'Pickup request not found' }, { status: 404 });
  }

  // Soft cancel by setting status to Cancelled
  const updated = db.pickups.update(params.id, {
    currentStatus: 'Cancelled',
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true, message: 'Pickup cancelled', data: updated });
}
