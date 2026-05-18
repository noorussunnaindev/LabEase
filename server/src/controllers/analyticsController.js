import { getRepository } from '../utils/database.js';
import { User } from '../entities/User.js';
import { Test } from '../entities/Test.js';
import { Booking } from '../entities/Booking.js';
import { Payment } from '../entities/Payment.js';
import { AppError } from '../middleware/errorHandler.js';

export const getAnalytics = async (req, res, next) => {
  try {
    const userRepo = getRepository(User);
    const testRepo = getRepository(Test);
    const bookingRepo = getRepository(Booking);
    const paymentRepo = getRepository(Payment);

    // Count total users
    const totalUsers = await userRepo.count();

    // Count total tests
    const totalTests = await testRepo.count();

    // Count total bookings
    const totalBookings = await bookingRepo.count();

    // Calculate total revenue from paid bookings
    const bookings = await bookingRepo.find({
      where: { paymentStatus: 'PAID' }
    });
    const totalRevenue = bookings.reduce((sum, booking) => sum + parseFloat(booking.totalAmount || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalTests,
        totalBookings,
        totalRevenue: parseFloat(totalRevenue.toFixed(2))
      }
    });
  } catch (error) {
    next(error);
  }
};
