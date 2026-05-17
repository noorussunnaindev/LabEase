import express from 'express';
import {
  createBooking,
  getBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
  searchBookings,
  getBookingStats
} from '../controllers/bookingController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Customer routes
router.post('/', authenticate, authorize('CUSTOMER'), createBooking);
router.get('/my-bookings', authenticate, authorize('CUSTOMER'), getMyBookings);

// Stats - accessible to all authenticated users (filtered by role in controller)
router.get('/stats', authenticate, getBookingStats);
router.get('/id/:id', authenticate, getBooking);
router.put('/:id/cancel', authenticate, cancelBooking);

// Staff and Admin routes
router.get('/', authenticate, authorize('ADMIN', 'LAB_STAFF'), getAllBookings);
router.put('/:id/status', authenticate, authorize('ADMIN', 'LAB_STAFF'), updateBookingStatus);

// Search
router.get('/search', authenticate, authorize('ADMIN', 'LAB_STAFF', 'CUSTOMER'), searchBookings);

export default router;
