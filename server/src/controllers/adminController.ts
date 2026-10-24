import { Response } from 'express';
import { db } from '../db/database.js';
import { AuthRequest } from '../middleware/auth.js';

export function getAdminOverview(req: AuthRequest, res: Response): void {
  try {
    const users = db.users.find();
    const pickups = db.pickups.find();
    const collections = db.collections.find();
    const recyclers = db.recyclers.find();
    const epr = db.epr.find();

    const totalWeightCollected = collections.reduce((acc, c) => acc + (c.verifiedWeightKg || c.submittedWeightKg || 0), 0);
    const totalWeightRecycled = recyclers.reduce((acc, r) => acc + (r.processedWeightKg || 0), 0);
    const totalApprovedCredits = epr.filter(e => e.approvalStatus === 'Approved').reduce((acc, e) => acc + e.creditUnits, 0);

    const pendingWeightVerifications = collections.filter(c => c.verificationStatus === 'unverified');
    const pendingEprReviews = epr.filter(e => e.approvalStatus === 'Pending');
    const pendingPickups = pickups.filter(p => p.currentStatus === 'Requested' || p.currentStatus === 'Approved');

    res.json({
      success: true,
      stats: {
        totalUsers: users.length,
        usersByRole: {
          individuals: users.filter(u => u.role === 'individual').length,
          partners: users.filter(u => u.role === 'partner').length,
          recyclers: users.filter(u => u.role === 'recycler').length,
          admins: users.filter(u => u.role === 'admin').length
        },
        totalPickups: pickups.length,
        pendingPickupsCount: pendingPickups.length,
        totalWeightCollectedKg: Math.round(totalWeightCollected * 10) / 10,
        totalWeightRecycledKg: Math.round(totalWeightRecycled * 10) / 10,
        totalApprovedEprCredits: Math.round(totalApprovedCredits * 10) / 10,
        pendingWeightVerificationCount: pendingWeightVerifications.length,
        pendingEprReviewCount: pendingEprReviews.length
      },
      queues: {
        pendingWeightVerifications: pendingWeightVerifications.slice(0, 10),
        pendingEprReviews: pendingEprReviews.slice(0, 10),
        recentPickups: pickups.slice(0, 10)
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch admin overview' });
  }
}

export function getAdminUsers(req: AuthRequest, res: Response): void {
  try {
    const { role, status, search } = req.query;
    let list = db.users.find();

    if (role && typeof role === 'string') {
      list = list.filter(u => u.role === role);
    }

    if (status && typeof status === 'string') {
      list = list.filter(u => u.status === status);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.organization && u.organization.toLowerCase().includes(q))
      );
    }

    // Exclude password hashes from response
    const sanitized = list.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      phone: u.phone,
      address: u.address,
      organization: u.organization,
      createdAt: u.createdAt
    }));

    res.json({ success: true, count: sanitized.length, users: sanitized });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch users' });
  }
}

export function updateUserStatus(req: AuthRequest, res: Response): void {
  try {
    const user = req.user!;
    const { id } = req.params;
    const { status, role } = req.body;

    const targetUser = db.users.findById(id);
    if (!targetUser) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const prev = { ...targetUser };
    const updated = db.users.update(id, {
      ...(status ? { status } : {}),
      ...(role ? { role } : {}),
      updatedAt: new Date().toISOString()
    });

    db.logAudit(
      user.id,
      user.name,
      user.role,
      'UPDATE_USER_ACCOUNT',
      'User',
      id,
      { status: prev.status, role: prev.role },
      { status: updated?.status, role: updated?.role }
    );

    res.json({ success: true, message: 'User account updated successfully.', user: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update user' });
  }
}

export function getAuditLogs(req: AuthRequest, res: Response): void {
  try {
    const { entityType, search } = req.query;
    let list = db.auditLogs.find();

    if (entityType && typeof entityType === 'string') {
      list = list.filter(l => l.entityType === entityType);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(l =>
        l.action.toLowerCase().includes(q) ||
        l.actorName.toLowerCase().includes(q) ||
        l.entityId.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.json({ success: true, count: list.length, logs: list.slice(0, 100) });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch audit logs' });
  }
}
