import { Response } from 'express';
import { db } from '../db/database.js';
import { AuthRequest } from '../middleware/auth.js';
import { CollectionRecord, PickupStatus } from '../types.js';

export function submitCollection(req: AuthRequest, res: Response): void {
  try {
    const user = req.user!;
    const { pickupId, submittedWeightKg, notes, evidenceUrls } = req.body;

    if (!pickupId || !submittedWeightKg) {
      res.status(400).json({ success: false, message: 'Pickup ID and submitted weight are required.' });
      return;
    }

    const weight = Number(submittedWeightKg);
    if (isNaN(weight) || weight <= 0) {
      res.status(400).json({ success: false, message: 'Submitted weight must be a positive number.' });
      return;
    }

    const pickup = db.pickups.findById(pickupId);
    if (!pickup) {
      res.status(404).json({ success: false, message: 'Associated pickup request not found.' });
      return;
    }

    // Check if collection already exists for this pickup
    const existing = db.collections.findOne(c => c.pickupId === pickupId);
    if (existing) {
      res.status(400).json({ success: false, message: 'A collection record already exists for this pickup.' });
      return;
    }

    const newRecord: CollectionRecord = {
      id: 'col_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      pickupId,
      partnerId: user.id,
      partnerName: user.name + (user.organization ? ` (${user.organization})` : ''),
      submittedWeightKg: weight,
      // Rule: Collected weight must remain unverified until authorized verification step
      verificationStatus: 'unverified',
      evidenceUrls: Array.isArray(evidenceUrls) ? evidenceUrls : evidenceUrls ? [evidenceUrls] : [],
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.collections.insert(newRecord);

    // Also update pickup status to Weighed
    db.pickups.update(pickupId, {
      currentStatus: 'Weighed',
      statusHistory: [
        ...pickup.statusHistory,
        {
          status: 'Weighed' as PickupStatus,
          timestamp: new Date().toISOString(),
          changedBy: user.id,
          changedByName: `${user.name} (Partner)`,
          note: `Physical weight recorded: ${weight} kg. Status: Unverified pending QA.`
        }
      ],
      updatedAt: new Date().toISOString()
    });

    db.logAudit(
      user.id,
      user.name,
      user.role,
      'SUBMIT_COLLECTION_RECORD',
      'CollectionRecord',
      newRecord.id,
      undefined,
      { pickupId, submittedWeightKg: weight, evidenceCount: newRecord.evidenceUrls.length }
    );

    res.status(201).json({
      success: true,
      message: 'Collection weight and evidence recorded. Awaiting official verification.',
      collection: newRecord
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to submit collection' });
  }
}

export function getCollections(req: AuthRequest, res: Response): void {
  try {
    const user = req.user!;
    const { status, partnerId } = req.query;

    let list = db.collections.find();

    if (user.role === 'partner') {
      list = list.filter(c => c.partnerId === user.id);
    } else if (partnerId && typeof partnerId === 'string') {
      list = list.filter(c => c.partnerId === partnerId);
    }

    if (status && typeof status === 'string') {
      list = list.filter(c => c.verificationStatus === status);
    }

    // Enrich with pickup details
    const enriched = list.map(col => {
      const pickup = db.pickups.findById(col.pickupId);
      return {
        ...col,
        pickupDetails: pickup ? {
          category: pickup.category,
          address: pickup.address,
          scheduledDate: pickup.scheduledDate,
          userName: pickup.userName,
          currentStatus: pickup.currentStatus
        } : undefined
      };
    });

    enriched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({ success: true, count: enriched.length, collections: enriched });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch collections' });
  }
}

export function verifyCollection(req: AuthRequest, res: Response): void {
  try {
    const user = req.user!;
    const { id } = req.params;
    const { verifiedWeightKg, status, notes } = req.body;

    // Only Admin can officially verify weights
    if (user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Only authorized administrators can verify collection records.' });
      return;
    }

    const record = db.collections.findById(id);
    if (!record) {
      res.status(404).json({ success: false, message: 'Collection record not found.' });
      return;
    }

    const prev = { ...record };
    const finalWeight = verifiedWeightKg !== undefined ? Number(verifiedWeightKg) : record.submittedWeightKg;

    const updated = db.collections.update(id, {
      verifiedWeightKg: finalWeight,
      verificationStatus: status || 'verified',
      verifiedBy: user.id,
      verifiedAt: new Date().toISOString(),
      ...(notes ? { notes: (record.notes ? record.notes + '\n' : '') + `[Admin Audit]: ${notes}` } : {}),
      updatedAt: new Date().toISOString()
    });

    db.logAudit(
      user.id,
      user.name,
      user.role,
      'VERIFY_COLLECTION_RECORD',
      'CollectionRecord',
      id,
      prev,
      { verifiedWeightKg: finalWeight, verificationStatus: status || 'verified' }
    );

    res.json({
      success: true,
      message: `Collection weight verified at ${finalWeight} kg. Audit trail updated.`,
      collection: updated
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to verify collection' });
  }
}
