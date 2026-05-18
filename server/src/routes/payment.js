import express from 'express';
import {
  createPaymentSession,
  getPaymentStatus,
  handleWebhook,
  getPaymentsByUser,
  getAllPayments,
  getPaymentStats,
  getAdminPaymentStats
} from '../controllers/paymentController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Webhook (no auth needed)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Specific routes (must come before parameterized routes)
router.get('/stats', authenticate, getPaymentStats);
router.get('/my-payments', authenticate, authorize('CUSTOMER'), getPaymentsByUser);

// Parameterized routes
router.get('/status/:sessionId', authenticate, getPaymentStatus);

// Customer routes
router.post('/create-session', authenticate, authorize('CUSTOMER'), createPaymentSession);

// Admin routes
router.get('/', authenticate, authorize('ADMIN'), getAllPayments);

export default router;
