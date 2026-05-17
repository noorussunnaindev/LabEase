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

// Stats - accessible to all authenticated users (filtered by role in controller)
router.get('/stats', authenticate, getPaymentStats);

// Customer routes
router.post('/create-session', authenticate, authorize('CUSTOMER'), createPaymentSession);
router.get('/status/:sessionId', authenticate, getPaymentStatus);
router.get('/my-payments', authenticate, authorize('CUSTOMER'), getPaymentsByUser);

// Admin routes
router.get('/', authenticate, authorize('ADMIN'), getAllPayments);

export default router;
