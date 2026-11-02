'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { pickupRequestSchema, PickupRequestFormData } from '@/lib/validations';
import { PickupRequest, PickupStatus } from '@/lib/types';

export async function createPickupAction(data: PickupRequestFormData, userDetails: { id: string; name: string; email: string; phone?: string }) {
  // 1. Server-side validation with Zod
  const validated = pickupRequestSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message || 'Validation failed',
    };
  }

  const payload = validated.data;
  const now = new Date().toISOString();

  const newPickup: PickupRequest = {
    id: 'pick_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    userId: userDetails.id,
    userName: userDetails.name,
    userEmail: userDetails.email,
    userPhone: userDetails.phone || '+1 (555) 000-0000',
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
        changedBy: userDetails.id,
        changedByName: userDetails.name,
        note: 'Pickup request submitted via Next.js Server Action',
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  db.pickups.insert(newPickup);
  db.logAudit(
    userDetails.id,
    userDetails.name,
    'individual',
    'CREATE_PICKUP',
    'pickup',
    newPickup.id,
    null,
    newPickup
  );

  // 2. Incremental Revalidation (Next.js App Router Data Caching & Revalidation)
  revalidatePath('/pickups');
  revalidatePath('/admin');
  revalidatePath('/analytics');

  return {
    success: true,
    pickup: newPickup,
  };
}

export async function updatePickupStatusAction(
  pickupId: string,
  newStatus: PickupStatus,
  actor: { id: string; name: string; role: any },
  note?: string
) {
  const pickup = db.pickups.findById(pickupId);
  if (!pickup) {
    return { success: false, error: 'Pickup not found' };
  }

  const previousStatus = pickup.currentStatus;
  const now = new Date().toISOString();

  const updatedHistory = [
    ...pickup.statusHistory,
    {
      status: newStatus,
      timestamp: now,
      changedBy: actor.id,
      changedByName: actor.name,
      note: note || `Status updated from ${previousStatus} to ${newStatus}`,
    },
  ];

  const updated = db.pickups.update(pickupId, {
    currentStatus: newStatus,
    statusHistory: updatedHistory,
    updatedAt: now,
  });

  db.logAudit(
    actor.id,
    actor.name,
    actor.role,
    'UPDATE_STATUS',
    'pickup',
    pickupId,
    { status: previousStatus },
    { status: newStatus }
  );

  revalidatePath('/pickups');
  revalidatePath(`/pickups/${pickupId}`);
  revalidatePath('/admin');
  revalidatePath('/partner');
  revalidatePath('/recycler');

  return {
    success: true,
    pickup: updated,
  };
}

export async function cancelPickupAction(pickupId: string, userId: string, userName: string) {
  return updatePickupStatusAction(
    pickupId,
    'Cancelled',
    { id: userId, name: userName, role: 'individual' },
    'Cancelled by user request'
  );
}
