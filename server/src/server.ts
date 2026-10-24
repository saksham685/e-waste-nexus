import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import pickupRoutes from './routes/pickupRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import recyclerRoutes from './routes/recyclerRoutes.js';
import eprRoutes from './routes/eprRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import centerRoutes from './routes/centerRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { db } from './db/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads serving
const uploadsPath = path.resolve(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'E-Waste Nexus Platform API',
    version: '1.0.0-enterprise',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/recycling', recyclerRoutes);
app.use('/api/epr', eprRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/centers', centerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);

// Serve compiled React frontend directly via Node.js Express
const clientDistCandidates = [
  path.resolve(process.cwd(), '../client/dist'),
  path.resolve(process.cwd(), 'client/dist'),
  path.resolve(__dirname, '../../client/dist'),
  path.resolve(__dirname, '../../../client/dist')
];

const clientDist = clientDistCandidates.find(p => fs.existsSync(p));
if (clientDist) {
  console.log(`📦 Node.js serving frontend build from: ${clientDist}`);
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 E-WASTE NEXUS BACKEND ONLINE`);
  console.log(`⚡ Server running on: http://localhost:${PORT}`);
  console.log(`📡 Health Check:     http://localhost:${PORT}/api/health`);
  console.log(`======================================================\n`);
});

export default app;
