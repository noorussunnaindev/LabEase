import { BookingService } from '../services/BookingService.js';
import { AppError } from '../middleware/errorHandler.js';

const bookingService = new BookingService();

export const createBooking = async (req, res, next) => {
  try {
    const { testIds, bookingType, appointmentDate, appointmentTime, address, city, state, pincode, notes } = req.body;

    if (!testIds || !bookingType || !appointmentDate || !appointmentTime) {
      throw new AppError('Missing required fields', 400);
    }

    const booking = await bookingService.createBooking(req.user.id, {
      testIds,
      bookingType,
      appointmentDate,
      appointmentTime,
      address,
      city,
      state,
      pincode,
      notes
    });

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking created successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await bookingService.getBookingById(id);

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await bookingService.getBookingsByUserId(req.user.id, page, limit);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || null;

    const result = await bookingService.getAllBookings(page, limit, status);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      throw new AppError('Status required', 400);
    }

    const booking = await bookingService.updateBookingStatus(id, status);

    res.status(200).json({
      success: true,
      data: booking,
      message: 'Booking status updated'
    });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await bookingService.cancelBooking(id);

    res.status(200).json({
      success: true,
      data: booking,
      message: 'Booking cancelled'
    });
  } catch (error) {
    next(error);
  }
};

export const searchBookings = async (req, res, next) => {
  try {
    const criteria = {
      status: req.query.status,
      userId: req.query.userId,
      bookingNumber: req.query.bookingNumber,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };

    // Filter out undefined values
    Object.keys(criteria).forEach(key => criteria[key] === undefined && delete criteria[key]);

    const bookings = await bookingService.searchBookings(criteria);

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingStats = async (req, res, next) => {
  try {
    // Admin gets all stats, customers get their own stats
    const userId = req.user.role === 'ADMIN' ? null : req.user.id;
    const stats = await bookingService.getBookingStats(userId);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!paymentStatus) {
      throw new AppError('Payment status required', 400);
    }

    if (!['UNPAID', 'PAID', 'PENDING'].includes(paymentStatus)) {
      throw new AppError('Invalid payment status', 400);
    }

    const booking = await bookingService.updatePaymentStatus(id, paymentStatus);

    res.status(200).json({
      success: true,
      data: booking,
      message: 'Payment status updated'
    });
  } catch (error) {
    next(error);
  }
};
