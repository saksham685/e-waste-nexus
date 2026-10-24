import { Router } from 'express';
import { createPickup, getPickups, getPickupById, updatePickupStatus, cancelPickup } from '../controllers/pickupController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.post('/', createPickup);
router.get('/', getPickups);
router.get('/:id', getPickupById);
router.patch('/:id/status', updatePickupStatus);
router.post('/:id/cancel', cancelPickup);

export default router;
