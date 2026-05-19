import express from 'express';
import {
  getInvoiceByBookingId,
  createInvoice,
  downloadInvoice,
  getInvoicesByUser
} from '../controllers/invoiceController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get user's invoices
router.get('/my-invoices', authenticate, authorize('CUSTOMER'), getInvoicesByUser);

// Get invoice by booking ID
router.get('/booking/:bookingId', authenticate, getInvoiceByBookingId);

// Create invoice for booking
router.post('/create/:bookingId', authenticate, createInvoice);

// Download invoice for booking
router.get('/download/:bookingId', authenticate, downloadInvoice);

export default router;
