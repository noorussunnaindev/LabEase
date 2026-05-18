import express from 'express';
import {
  createBooking,
  getBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  updatePaymentStatus,
  cancelBooking,
  deleteBooking,
  searchBookings,
  getBookingStats
} from '../controllers/bookingController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Specific routes (must come before parameterized routes)
router.get('/my-bookings', authenticate, authorize('CUSTOMER'), getMyBookings);
router.get('/stats', authenticate, getBookingStats);
router.get('/search', authenticate, authorize('ADMIN', 'LAB_STAFF', 'CUSTOMER'), searchBookings);

// Parameterized routes
router.get('/id/:id', authenticate, getBooking);
router.get('/', authenticate, authorize('ADMIN', 'LAB_STAFF'), getAllBookings);

// Create booking
router.post('/', authenticate, authorize('CUSTOMER'), createBooking);

// Update routes
router.put('/:id/cancel', authenticate, cancelBooking);
router.put('/:id/payment', authenticate, authorize('CUSTOMER'), updatePaymentStatus);
router.put('/:id/status', authenticate, authorize('ADMIN', 'LAB_STAFF'), updateBookingStatus);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteBooking);

export default router;
