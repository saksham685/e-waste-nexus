import { Router } from 'express';
import { submitRecycling, getRecyclingRecords, updateRecyclingStatus } from '../controllers/recyclerController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.post('/', requireRole('recycler', 'admin'), submitRecycling);
router.get('/', getRecyclingRecords);
router.patch('/:id/status', requireRole('recycler', 'admin'), updateRecyclingStatus);

export default router;
