import { Router, Response } from 'express';
import { upload } from '../middleware/upload.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticateToken, upload.single('file'), (req: AuthRequest, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ success: false, message: 'No file uploaded or file format not supported.' });
    return;
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    message: 'Evidence document uploaded successfully.',
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size
  });
});

export default router;
