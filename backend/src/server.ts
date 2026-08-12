import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

import authRoutes from './routes/authRoutes';
import vehicleRoutes from './routes/vehicleRoutes';
import serviceRoutes from './routes/serviceRoutes';
import bookingRoutes from './routes/bookingRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend server is running correctly.' });
});

// Serve frontend in production
// Resolve the __dirname for ES modules or CommonJS
const isESM = typeof __dirname === 'undefined';
const currentDir = isESM ? path.dirname(new URL(import.meta.url).pathname) : __dirname;

// Path to the frontend build directory (../dist since we are in backend/src or backend/dist)
const frontendDistPath = path.join(currentDir, '..', '..', 'dist');

app.use(express.static(frontendDistPath));

// Catch-all route to serve the React app for non-API requests
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
