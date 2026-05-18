import express from 'express';
import { getAnalytics } from '../controllers/analyticsController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin only - get analytics data
router.get('/', authenticate, authorize('ADMIN'), getAnalytics);

export default router;
