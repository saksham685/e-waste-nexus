import { Response } from 'express';
import { db } from '../db/database.js';
import { AuthRequest } from '../middleware/auth.js';
import { RecyclerRecord, PickupStatus } from '../types.js';

export function submitRecycling(req: AuthRequest, res: Response): void {
  try {
    const user = req.user!;
    const { collectionRecordId, receivedWeightKg, processedWeightKg, processingStatus, notes, processingEvidenceUrls } = req.body;

    if (!collectionRecordId || receivedWeightKg === undefined) {
      res.status(400).json({ success: false, message: 'Collection record ID and received weight are required.' });
      return;
    }

    const collection = db.collections.findById(collectionRecordId);
    if (!collection) {
      res.status(404).json({ success: false, message: 'Collection record not found.' });
      return;
    }

    const pickup = db.pickups.findById(collection.pickupId);
    if (!pickup) {
      res.status(404).json({ success: false, message: 'Associated pickup request not found.' });
      return;
    }

    const rWeight = Number(receivedWeightKg);
    const pWeight = processedWeightKg !== undefined ? Number(processedWeightKg) : 0;

    const newRecord: RecyclerRecord = {
      id: 'rec_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      collectionRecordId,
      pickupId: pickup.id,
      recyclerId: user.id,
      recyclerName: `${user.name} (${user.organization || 'Certified Recycler'})`,
      receivedWeightKg: rWeight,
      processedWeightKg: pWeight,
      category: pickup.category,
      processingEvidenceUrls: Array.isArray(processingEvidenceUrls) ? processingEvidenceUrls : processingEvidenceUrls ? [processingEvidenceUrls] : [],
      processingStatus: processingStatus || 'Received',
      notes: notes || '',
      processedAt: processingStatus === 'Recycled' ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.recyclers.insert(newRecord);

    // If fully processed & recycled, update pickup status to Completed
    if (processingStatus === 'Recycled') {
      db.pickups.update(pickup.id, {
        currentStatus: 'Completed',
        statusHistory: [
          ...pickup.statusHistory,
          {
            status: 'Completed' as PickupStatus,
            timestamp: new Date().toISOString(),
            changedBy: user.id,
            changedByName: `${user.name} (Recycler)`,
            note: `Material processing complete: ${pWeight} kg successfully recycled into secondary raw commodities.`
          }
        ],
        updatedAt: new Date().toISOString()
      });
    } else {
      // Sent for Recycling
      db.pickups.update(pickup.id, {
        currentStatus: 'Sent for Recycling',
        statusHistory: [
          ...pickup.statusHistory,
          {
            status: 'Sent for Recycling' as PickupStatus,
            timestamp: new Date().toISOString(),
            changedBy: user.id,
            changedByName: `${user.name} (Recycler)`,
            note: `Material received at recycling facility. Processing status: ${processingStatus || 'Received'}`
          }
        ],
        updatedAt: new Date().toISOString()
      });
    }

    db.logAudit(
      user.id,
      user.name,
      user.role,
      'SUBMIT_RECYCLING_RECORD',
      'RecyclerRecord',
      newRecord.id,
      undefined,
      { collectionRecordId, receivedWeightKg: rWeight, processedWeightKg: pWeight, processingStatus }
    );

    res.status(201).json({
      success: true,
      message: 'Recycler intake and assay record documented.',
      recyclingRecord: newRecord
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to submit recycling record' });
  }
}

export function getRecyclingRecords(req: AuthRequest, res: Response): void {
  try {
    const user = req.user!;
    const { status, category } = req.query;

    let list = db.recyclers.find();

    if (user.role === 'recycler') {
      list = list.filter(r => r.recyclerId === user.id);
    }

    if (status && typeof status === 'string') {
      list = list.filter(r => r.processingStatus === status);
    }

    if (category && typeof category === 'string') {
      list = list.filter(r => r.category === category);
    }

    // Enrich with pickup and collection info
    const enriched = list.map(rec => {
      const collection = db.collections.findById(rec.collectionRecordId);
      const pickup = db.pickups.findById(rec.pickupId);
      return {
        ...rec,
        collectionInfo: collection,
        pickupInfo: pickup
      };
    });

    enriched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({ success: true, count: enriched.length, records: enriched });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch recycling records' });
  }
}

export function updateRecyclingStatus(req: AuthRequest, res: Response): void {
  try {
    const user = req.user!;
    const { id } = req.params;
    const { processingStatus, processedWeightKg, notes, processingEvidenceUrls } = req.body;

    const record = db.recyclers.findById(id);
    if (!record) {
      res.status(404).json({ success: false, message: 'Recycling record not found.' });
      return;
    }

    if (user.role === 'recycler' && record.recyclerId !== user.id) {
      res.status(403).json({ success: false, message: 'You can only update your own recycling operations.' });
      return;
    }

    const prev = { ...record };
    const pWeight = processedWeightKg !== undefined ? Number(processedWeightKg) : record.processedWeightKg;

    const updated = db.recyclers.update(id, {
      ...(processingStatus ? { processingStatus } : {}),
      processedWeightKg: pWeight,
      ...(notes ? { notes: `${record.notes || ''}\n${notes}`.trim() } : {}),
      ...(processingEvidenceUrls ? { processingEvidenceUrls } : {}),
      ...(processingStatus === 'Recycled' ? { processedAt: new Date().toISOString() } : {}),
      updatedAt: new Date().toISOString()
    });

    if (processingStatus === 'Recycled' && record.pickupId) {
      const pickup = db.pickups.findById(record.pickupId);
      if (pickup && pickup.currentStatus !== 'Completed') {
        db.pickups.update(record.pickupId, {
          currentStatus: 'Completed',
          statusHistory: [
            ...pickup.statusHistory,
            {
              status: 'Completed' as PickupStatus,
              timestamp: new Date().toISOString(),
              changedBy: user.id,
              changedByName: `${user.name} (${user.role})`,
              note: `Recycling processing confirmed complete. Yield: ${pWeight} kg.`
            }
          ],
          updatedAt: new Date().toISOString()
        });
      }
    }

    db.logAudit(
      user.id,
      user.name,
      user.role,
      'UPDATE_RECYCLING_STATUS',
      'RecyclerRecord',
      id,
      prev,
      { processingStatus, processedWeightKg: pWeight }
    );

    res.json({
      success: true,
      message: 'Recycling progress updated successfully.',
      record: updated
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update recycling status' });
  }
}
