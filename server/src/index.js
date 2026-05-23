import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { AppDataSource } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import testRoutes from './routes/test.js';
import categoryRoutes from './routes/category.js';
import bookingRoutes from './routes/booking.js';
import reportRoutes from './routes/report.js';
import paymentRoutes from './routes/payment.js';
import userRoutes from './routes/user.js';
import analyticsRoutes from './routes/analytics.js';
import invoiceRoutes from './routes/invoice.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware for raw body (Stripe webhooks)
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://labease-1-2wwp.onrender.com"
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Initialize Database
AppDataSource.initialize()
  .then(() => console.log('✓ Database connected successfully'))
  .catch((err) => console.error('✗ Database connection failed:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/invoices', invoiceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 LabEase Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api\n`);
});
