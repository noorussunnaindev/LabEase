import express from 'express';
import {
  uploadReport,
  markReportReady,
  getReport,
  getMyReports,
  deleteReport
} from '../controllers/reportController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadReport as uploadReportMiddleware } from '../middleware/upload.js';

const router = express.Router();

// Lab staff routes
router.post('/upload', authenticate, authorize('LAB_STAFF', 'ADMIN'), uploadReportMiddleware.single('report'), uploadReport);
router.put('/mark-ready', authenticate, authorize('LAB_STAFF', 'ADMIN'), markReportReady);

// Customer routes
router.get('/my-reports', authenticate, authorize('CUSTOMER'), getMyReports);

// General routes
router.get('/:bookingId', authenticate, getReport);
router.delete('/:bookingId', authenticate, authorize('LAB_STAFF', 'ADMIN'), deleteReport);

export default router;
