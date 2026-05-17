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

// Customer routes
router.post('/create-session', authenticate, authorize('CUSTOMER'), createPaymentSession);
router.get('/status/:sessionId', authenticate, getPaymentStatus);
router.get('/my-payments', authenticate, authorize('CUSTOMER'), getPaymentsByUser);
router.get('/stats', authenticate, authorize('CUSTOMER'), getPaymentStats);

// Admin routes
router.get('/', authenticate, authorize('ADMIN'), getAllPayments);
router.get('/admin/stats', authenticate, authorize('ADMIN'), getAdminPaymentStats);

export default router;
