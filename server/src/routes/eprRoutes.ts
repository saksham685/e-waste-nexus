import { Router } from 'express';
import { createEPRRecord, getEPRRecords, approveEPRRecord, downloadEPRCsvReport } from '../controllers/eprController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.post('/records', requireRole('recycler', 'admin'), createEPRRecord);
router.get('/records', getEPRRecords);
router.patch('/records/:id/approve', requireRole('admin'), approveEPRRecord);
router.get('/reports/csv', downloadEPRCsvReport);

export default router;
