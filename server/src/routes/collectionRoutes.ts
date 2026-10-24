import { Router } from 'express';
import { submitCollection, getCollections, verifyCollection } from '../controllers/collectionController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.post('/', requireRole('partner', 'admin'), submitCollection);
router.get('/', getCollections);
router.patch('/:id/verify', requireRole('admin'), verifyCollection);

export default router;
