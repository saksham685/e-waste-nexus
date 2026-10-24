import { Response } from 'express';
import { db } from '../db/database.js';
import { AuthRequest } from '../middleware/auth.js';
import { PickupRequest, PickupStatus, WasteCategory } from '../types.js';

const VALID_CATEGORIES: WasteCategory[] = [
  'Smartphones and Tablets',
  'Laptops and Computers',
  'Batteries and Chargers',
  'Televisions and Monitors',
  'Printers and Office Electronics',
  'Large Electrical Appliances',
  'Other Electronic Waste'
];

export function createPickup(req: AuthRequest, res: Response): void {
  try {
    const user = req.user!;
    const { category, estimatedQuantity, estimatedWeightKg, address, scheduledDate, timeSlot, specialInstructions } = req.body;

    if (!category || !estimatedQuantity || !estimatedWeightKg || !address || !scheduledDate) {
      res.status(400).json({ success: false, message: 'Missing required pickup details.' });
      return;
    }

    if (!VALID_CATEGORIES.includes(category)) {
      res.status(400).json({ success: false, message: 'Invalid electronic waste category.' });
      return;
    }

    const qty = Number(estimatedQuantity);
    const weight = Number(estimatedWeightKg);

    if (isNaN(qty) || qty <= 0 || isNaN(weight) || weight <= 0) {
      res.status(400).json({ success: false, message: 'Quantity and weight must be positive numeric values.' });
      return;
    }

    const fullUser = db.users.findById(user.id);

    const newPickup: PickupRequest = {
      id: 'pck_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userPhone: fullUser?.phone || '',
      category,
      estimatedQuantity: qty,
      estimatedWeightKg: weight,
      address,
      scheduledDate,
      timeSlot: timeSlot || '09:00 AM - 12:00 PM',
      specialInstructions: specialInstructions || '',
      currentStatus: 'Requested',
      statusHistory: [
        {
          status: 'Requested',
          timestamp: new Date().toISOString(),
          changedBy: user.id,
          changedByName: user.name,
          note: 'Pickup request submitted by customer'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.pickups.insert(newPickup);

    db.logAudit(user.id, user.name, user.role, 'CREATE_PICKUP_REQUEST', 'PickupRequest', newPickup.id, undefined, newPickup);

    res.status(201).json({
      success: true,
      message: 'Pickup request submitted successfully. Our team will review and assign a certified logistics partner.',
      pickup: newPickup
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to create pickup request' });
  }
}

export function getPickups(req: AuthRequest, res: Response): void {
  try {
    const user = req.user!;
    const { status, category, search } = req.query;

    let list = db.pickups.find();

    // Role-based visibility
    if (user.role === 'individual') {
      list = list.filter(p => p.userId === user.id);
    } else if (user.role === 'partner') {
      list = list.filter(p => p.assignedPartnerId === user.id || p.currentStatus === 'Approved');
    } else if (user.role === 'recycler') {
      list = list.filter(p => ['Collected', 'Weighed', 'Sent for Recycling', 'Completed'].includes(p.currentStatus));
    }
    // Admin sees all

    if (status && typeof status === 'string') {
      list = list.filter(p => p.currentStatus.toLowerCase() === status.toLowerCase());
    }

    if (category && typeof category === 'string') {
      list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.id.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.userName.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({ success: true, count: list.length, pickups: list });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch pickups' });
  }
}

export function getPickupById(req: AuthRequest, res: Response): void {
  try {
    const user = req.user!;
    const { id } = req.params;

    const pickup = db.pickups.findById(id);
    if (!pickup) {
      res.status(404).json({ success: false, message: 'Pickup request not found.' });
      return;
    }

    // Role barrier check
    if (user.role === 'individual' && pickup.userId !== user.id) {
      res.status(403).json({ success: false, message: 'Access denied to this pickup record.' });
      return;
    }

    const collectionRecord = db.collections.findOne(c => c.pickupId === id);
    const recyclerRecord = db.recyclers.findOne(r => r.pickupId === id);
    const eprRecord = db.epr.findOne(e => e.pickupId === id);

    res.json({
      success: true,
      pickup,
      collectionRecord,
      recyclerRecord,
      eprRecord
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to retrieve pickup' });
  }
}

export function updatePickupStatus(req: AuthRequest, res: Response): void {
  try {
    const user = req.user!;
    const { id } = req.params;
    const { status, note, assignedPartnerId } = req.body;

    const pickup = db.pickups.findById(id);
    if (!pickup) {
      res.status(404).json({ success: false, message: 'Pickup request not found.' });
      return;
    }

    const previousStatus = pickup.currentStatus;

    // Role-based transition permissions
    if (user.role === 'individual') {
      if (status !== 'Cancelled') {
        res.status(403).json({ success: false, message: 'Individuals can only cancel their own pending pickups.' });
        return;
      }
      if (!['Requested', 'Approved', 'Assigned'].includes(previousStatus)) {
        res.status(400).json({ success: false, message: `Cannot cancel pickup once it is in '${previousStatus}' status.` });
        return;
      }
    } else if (user.role === 'partner') {
      const allowedPartnerTransitions: PickupStatus[] = ['Collected', 'Weighed', 'Sent for Recycling'];
      if (!allowedPartnerTransitions.includes(status)) {
        res.status(403).json({ success: false, message: `Partners can only transition to: ${allowedPartnerTransitions.join(', ')}` });
        return;
      }
    } else if (user.role === 'recycler') {
      if (status !== 'Completed' && status !== 'Sent for Recycling') {
        res.status(403).json({ success: false, message: 'Recyclers can only mark pickups as Sent for Recycling or Completed.' });
        return;
      }
    }

    // If partner assignment is being set or updated
    let assignedPartnerName = pickup.assignedPartnerName;
    if (assignedPartnerId) {
      const partner = db.users.findById(assignedPartnerId);
      if (partner) {
        assignedPartnerName = `${partner.name} (${partner.organization || 'Fleet'})`;
      }
    }

    const historyEntry = {
      status: status as PickupStatus,
      timestamp: new Date().toISOString(),
      changedBy: user.id,
      changedByName: `${user.name} (${user.role.toUpperCase()})`,
      note: note || `Status updated to ${status}`
    };

    const updated = db.pickups.update(id, {
      currentStatus: status as PickupStatus,
      ...(assignedPartnerId ? { assignedPartnerId, assignedPartnerName } : {}),
      statusHistory: [...pickup.statusHistory, historyEntry],
      updatedAt: new Date().toISOString()
    });

    db.logAudit(user.id, user.name, user.role, 'UPDATE_PICKUP_STATUS', 'PickupRequest', id, { status: previousStatus }, { status });

    res.json({ success: true, message: `Pickup status updated to ${status}.`, pickup: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update pickup status' });
  }
}

export function cancelPickup(req: AuthRequest, res: Response): void {
  try {
    const user = req.user!;
    const { id } = req.params;
    const { reason } = req.body;

    const pickup = db.pickups.findById(id);
    if (!pickup) {
      res.status(404).json({ success: false, message: 'Pickup not found.' });
      return;
    }

    if (user.role === 'individual' && pickup.userId !== user.id) {
      res.status(403).json({ success: false, message: 'Unauthorized to cancel this pickup.' });
      return;
    }

    if (!['Requested', 'Approved', 'Assigned'].includes(pickup.currentStatus)) {
      res.status(400).json({ success: false, message: `Cannot cancel pickup once in status: ${pickup.currentStatus}` });
      return;
    }

    const updated = db.pickups.update(id, {
      currentStatus: 'Cancelled',
      statusHistory: [
        ...pickup.statusHistory,
        {
          status: 'Cancelled',
          timestamp: new Date().toISOString(),
          changedBy: user.id,
          changedByName: `${user.name} (${user.role})`,
          note: reason || 'Cancelled by user request'
        }
      ],
      updatedAt: new Date().toISOString()
    });

    db.logAudit(user.id, user.name, user.role, 'CANCEL_PICKUP', 'PickupRequest', id, { status: pickup.currentStatus }, { status: 'Cancelled', reason });

    res.json({ success: true, message: 'Pickup request cancelled successfully.', pickup: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to cancel pickup' });
  }
}
