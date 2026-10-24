import { Request, Response } from 'express';
import { db } from '../db/database.js';

export function getCenters(req: Request, res: Response): void {
  try {
    const { category, search, city } = req.query;
    let list = db.centers.find();

    if (category && typeof category === 'string') {
      list = list.filter(c => c.acceptedCategories.includes(category as any));
    }

    if (city && typeof city === 'string') {
      list = list.filter(c => c.city.toLowerCase() === city.toLowerCase());
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: list.length, centers: list });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch collection centers' });
  }
}

export function getCenterById(req: Request, res: Response): void {
  try {
    const { id } = req.params;
    const center = db.centers.findById(id);
    if (!center) {
      res.status(404).json({ success: false, message: 'Collection center not found.' });
      return;
    }
    res.json({ success: true, center });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch center' });
  }
}
