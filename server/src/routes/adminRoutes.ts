import { Router } from 'express';
import { getAdminOverview, getAdminUsers, updateUserStatus, getAuditLogs } from '../controllers/adminController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);
router.use(requireRole('admin'));

router.get('/overview', getAdminOverview);
router.get('/users', getAdminUsers);
router.patch('/users/:id/status', updateUserStatus);
router.get('/audit-logs', getAuditLogs);

export default router;
