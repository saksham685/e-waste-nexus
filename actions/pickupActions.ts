'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { pickupRequestSchema, PickupRequestFormData } from '@/lib/validations';
import { PickupRequest, PickupStatus, EPRRecord, RecyclerRecord, CollectionRecord } from '@/lib/types';

export async function createPickupAction(
  data: PickupRequestFormData,
  userDetails: { id: string; name: string; email: string; phone?: string }
) {
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
    userPhone: userDetails.phone || '+91 98059 26846',
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
        note: 'Pickup request submitted via CPCB Chain-of-Custody Portal',
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

  revalidatePath('/pickups');
  revalidatePath('/admin');
  revalidatePath('/partner');
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

export async function assignPartnerAction(
  pickupId: string,
  partnerId: string,
  partnerName: string,
  driverName: string,
  vehicleNumber: string,
  actor: { id: string; name: string; role: any }
) {
  const pickup = db.pickups.findById(pickupId);
  if (!pickup) return { success: false, error: 'Pickup not found' };

  const now = new Date().toISOString();
  const note = `Logistics assigned to ${partnerName}. Driver: ${driverName} (${vehicleNumber}).`;

  const updatedHistory = [
    ...pickup.statusHistory,
    {
      status: 'Assigned' as PickupStatus,
      timestamp: now,
      changedBy: actor.id,
      changedByName: actor.name,
      note,
    },
  ];

  const updated = db.pickups.update(pickupId, {
    assignedPartnerId: partnerId,
    assignedPartnerName: `${partnerName} • Driver: ${driverName} [${vehicleNumber}]`,
    currentStatus: 'Assigned',
    statusHistory: updatedHistory,
    updatedAt: now,
  });

  db.logAudit(actor.id, actor.name, actor.role, 'ASSIGN_PARTNER', 'pickup', pickupId, null, {
    partnerId,
    partnerName,
    driverName,
    vehicleNumber,
  });

  revalidatePath('/pickups');
  revalidatePath('/partner');
  revalidatePath('/admin');

  return { success: true, pickup: updated };
}

export async function recordWeighbridgeAction(
  pickupId: string,
  grossWeightKg: number,
  tareWeightKg: number,
  scaleSerial: string,
  actor: { id: string; name: string; role: any }
) {
  const pickup = db.pickups.findById(pickupId);
  if (!pickup) return { success: false, error: 'Pickup not found' };

  const netWeightKg = Math.max(0.1, Math.round((grossWeightKg - tareWeightKg) * 10) / 10);
  const now = new Date().toISOString();
  const note = `Calibrated weighbridge scale #${scaleSerial} certified: Gross ${grossWeightKg}kg, Tare ${tareWeightKg}kg, Net ${netWeightKg}kg.`;

  const updatedHistory = [
    ...pickup.statusHistory,
    {
      status: 'Weighed' as PickupStatus,
      timestamp: now,
      changedBy: actor.id,
      changedByName: actor.name,
      note,
    },
  ];

  const updated = db.pickups.update(pickupId, {
    actualWeightKg: netWeightKg,
    currentStatus: 'Weighed',
    statusHistory: updatedHistory,
    updatedAt: now,
  });

  // Create or update collection record
  const collectionRecord: CollectionRecord = {
    id: 'col_' + Date.now(),
    pickupId: pickup.id,
    partnerId: actor.id,
    partnerName: actor.name,
    submittedWeightKg: pickup.estimatedWeightKg,
    verifiedWeightKg: netWeightKg,
    verificationStatus: 'verified',
    evidenceUrls: ['https://cpcb.gov.in/weighbridge/cert_' + pickup.id + '.pdf'],
    notes: note,
    verifiedBy: actor.name,
    verifiedAt: now,
    createdAt: now,
    pickupDetails: {
      category: pickup.category,
      address: pickup.address,
      scheduledDate: pickup.scheduledDate,
      userName: pickup.userName,
      currentStatus: 'Weighed',
    },
  };

  db.collections.insert(collectionRecord);
  db.logAudit(actor.id, actor.name, actor.role, 'RECORD_WEIGHBRIDGE', 'collection', collectionRecord.id, null, {
    netWeightKg,
    scaleSerial,
  });

  revalidatePath('/pickups');
  revalidatePath(`/pickups/${pickupId}`);
  revalidatePath('/partner');
  revalidatePath('/recycler');
  revalidatePath('/admin');

  return { success: true, pickup: updated, collection: collectionRecord };
}

export async function recordSmelterAssayAction(
  pickupId: string,
  assayData: {
    method: 'Hydrometallurgy' | 'Pyrometallurgy' | 'Mechanical Shredding';
    inputWeightKg: number;
    goldGrams: number;
    copperKg: number;
    lithiumKg?: number;
    silverGrams?: number;
    targetProducer: string;
  },
  actor: { id: string; name: string; role: any }
) {
  const pickup = db.pickups.findById(pickupId);
  if (!pickup) return { success: false, error: 'Pickup not found' };

  const now = new Date().toISOString();
  const certNumber = 'CPCB-EPR-2026-' + Math.floor(100000 + Math.random() * 900000);
  const netWeight = pickup.actualWeightKg || assayData.inputWeightKg || pickup.estimatedWeightKg;

  const note = `Assay logged via ${assayData.method}. Recovered: ${assayData.goldGrams}g Au, ${assayData.copperKg}kg Cu, ${assayData.silverGrams || 0}g Ag. Target: ${assayData.targetProducer}.`;

  const updatedHistory = [
    ...pickup.statusHistory,
    {
      status: 'Processed' as PickupStatus,
      timestamp: now,
      changedBy: actor.id,
      changedByName: actor.name,
      note,
    },
    {
      status: 'Certified' as PickupStatus,
      timestamp: now,
      changedBy: actor.id,
      changedByName: actor.name,
      note: `CPCB Form-6 Certificate #${certNumber} issued & EPR credit minted.`,
    },
  ];

  const updated = db.pickups.update(pickupId, {
    actualWeightKg: netWeight,
    currentStatus: 'Certified',
    statusHistory: updatedHistory,
    updatedAt: now,
  });

  // Mint EPR Record
  const eprRecord: EPRRecord = {
    id: 'epr_' + Date.now(),
    pickupId: pickup.id,
    materialCategory: pickup.category,
    category: pickup.category,
    producerName: assayData.targetProducer,
    certificateNumber: certNumber,
    creditsEarnedKg: netWeight,
    creditUnits: Math.round(netWeight * 10),
    recyclerName: actor.name,
    status: 'Certified & Active',
    issuedAt: now,
    reportingPeriod: 'FY 2026-27 Q3',
    eligibleWeightKg: netWeight,
    creditStatus: 'Available',
    approvalStatus: 'Approved',
    approvedBy: 'CPCB Automated Verifier #882',
    approvedAt: now,
    targetProducer: assayData.targetProducer,
    notes: note,
    createdAt: now,
  };

  db.epr.insert(eprRecord);

  // Mint Recycler Record
  const recyclerRecord: RecyclerRecord = {
    id: 'rec_' + Date.now(),
    collectionRecordId: 'col_' + pickup.id,
    pickupId: pickup.id,
    recyclerId: actor.id,
    recyclerName: actor.name,
    receivedWeightKg: netWeight,
    processedWeightKg: netWeight,
    category: pickup.category,
    processingEvidenceUrls: ['https://cpcb.gov.in/manifests/' + certNumber + '.pdf'],
    processingStatus: 'Recycled',
    notes: note,
    processedAt: now,
    createdAt: now,
  };

  db.recyclers.insert(recyclerRecord);

  db.logAudit(actor.id, actor.name, actor.role, 'RECORD_SMELTER_ASSAY', 'epr', eprRecord.id, null, {
    certNumber,
    goldGrams: assayData.goldGrams,
    copperKg: assayData.copperKg,
    producer: assayData.targetProducer,
  });

  revalidatePath('/pickups');
  revalidatePath(`/pickups/${pickupId}`);
  revalidatePath('/recycler');
  revalidatePath('/epr');
  revalidatePath('/admin');

  return { success: true, pickup: updated, eprRecord, recyclerRecord };
}

export async function simulateAdvancePickupStep(
  pickupId: string,
  actor: { id: string; name: string; role: any }
) {
  const pickup = db.pickups.findById(pickupId);
  if (!pickup) return { success: false, error: 'Pickup not found' };

  const current = pickup.currentStatus;

  if (current === 'Requested') {
    return assignPartnerAction(
      pickupId,
      'partner_apex_fleet',
      'Apex Green Logistics Ltd',
      'Rajesh Sharma',
      'DL-12-EA-9821',
      actor
    );
  }

  if (current === 'Assigned' || current === 'Scheduled') {
    return updatePickupStatusAction(
      pickupId,
      'InTransit',
      actor,
      'Driver Rajesh Sharma en route to doorstep collection.'
    );
  }

  if (current === 'InTransit' || current === 'Collected') {
    return recordWeighbridgeAction(
      pickupId,
      pickup.estimatedWeightKg + 0.8,
      0.8,
      'AVERY-INDIA-WB940',
      actor
    );
  }

  if (current === 'Weighed' || current === 'ReceivedAtCenter' || current === 'TransferredToRecycler') {
    return recordSmelterAssayAction(
      pickupId,
      {
        method: 'Hydrometallurgy',
        inputWeightKg: pickup.actualWeightKg || pickup.estimatedWeightKg,
        goldGrams: Math.round(pickup.estimatedWeightKg * 4.2 * 10) / 10,
        copperKg: Math.round(pickup.estimatedWeightKg * 0.45 * 10) / 10,
        silverGrams: Math.round(pickup.estimatedWeightKg * 8.5 * 10) / 10,
        targetProducer: 'Samsung India Electronics Pvt Ltd',
      },
      actor
    );
  }

  if (current === 'Processed') {
    return updatePickupStatusAction(
      pickupId,
      'Certified',
      actor,
      'CPCB Form-6 Certificate Minted & Auditable Manifest Confirmed.'
    );
  }

  return { success: false, error: 'Pickup is already fully certified.' };
}

export async function cancelPickupAction(pickupId: string, userId: string, userName: string) {
  return updatePickupStatusAction(
    pickupId,
    'Cancelled',
    { id: userId, name: userName, role: 'individual' },
    'Cancelled by user request'
  );
}
