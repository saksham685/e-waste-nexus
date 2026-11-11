import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pickupRequestSchema } from '@/lib/validations';
import { PickupRequest } from '@/lib/types';

// GET /api/pickups - Fetch pickups with optional filters (role, status, category)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const status = searchParams.get('status');
  const category = searchParams.get('category');
  const partnerId = searchParams.get('partnerId');

  let pickups = db.pickups.find();

  if (userId) {
    pickups = pickups.filter((p) => p.userId === userId);
  }
  if (status) {
    pickups = pickups.filter((p) => p.currentStatus.toLowerCase() === status.toLowerCase());
  }
  if (category) {
    pickups = pickups.filter((p) => p.category === category);
  }
  if (partnerId) {
    pickups = pickups.filter((p) => p.assignedPartnerId === partnerId);
  }

  return NextResponse.json({
    total: pickups.length,
    pickups: pickups,
    data: pickups,
  });
}

// POST /api/pickups - Create a new pickup request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = pickupRequestSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const payload = validated.data;
    const now = new Date().toISOString();

    const newPickup: PickupRequest = {
      id: 'pick_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId: body.userId || 'usr_individual_01',
      userName: body.userName || 'Sarah Jenkins',
      userEmail: body.userEmail || 'user@nexus.eco',
      userPhone: body.userPhone || '+1 (555) 612-9901',
      category: payload.category,
      estimatedQuantity: payload.estimatedQuantity,
      estimatedWeightKg: payload.estimatedWeightKg,
      address: payload.address,
      scheduledDate: payload.scheduledDate,
      timeSlot: payload.timeSlot || 'Morning (09:00 - 12:00)',
      specialInstructions: payload.specialInstructions || '',
      currentStatus: 'Requested',
      statusHistory: [
        {
          status: 'Requested',
          timestamp: now,
          changedBy: body.userId || 'usr_individual_01',
          changedByName: body.userName || 'Sarah Jenkins',
          note: 'Online pickup booking logged',
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    db.pickups.insert(newPickup);
    db.logAudit(
      newPickup.userId,
      newPickup.userName,
      'individual',
      'CREATE_PICKUP',
      'pickup',
      newPickup.id,
      null,
      newPickup
    );

    return NextResponse.json({ success: true, data: newPickup }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create pickup' }, { status: 500 });
  }
}
