import { PaymentService } from '../services/PaymentService.js';
import { AppError } from '../middleware/errorHandler.js';
import { constructWebhookEvent, retrieveSession } from '../utils/stripe.js';
import { BookingService } from '../services/BookingService.js';
import { BOOKING_STATUS } from '../constants/index.js';

const paymentService = new PaymentService();
const bookingService = new BookingService();

export const createPaymentSession = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      throw new AppError('Booking ID required', 400);
    }

    const result = await paymentService.createPaymentSession(bookingId, req.user.id);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentStatus = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      throw new AppError('Session ID required', 400);
    }

    const session = await retrieveSession(sessionId);
    const payment = await paymentService.getPaymentBySessionId(sessionId);

    res.status(200).json({
      success: true,
      data: {
        payment,
        session: {
          status: session.payment_status,
          paymentIntentId: session.payment_intent
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const handleWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['stripe-signature'];

    const event = constructWebhookEvent(
      req.rawBody,
      signature
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const payment = await paymentService.getPaymentBySessionId(session.id);

      if (payment) {
        await paymentService.updatePaymentStatus(
          payment.id,
          'COMPLETED',
          session.payment_intent
        );

        // Update booking status to SAMPLE_COLLECTED
        if (payment.bookingId) {
          await bookingService.updateBookingStatus(
            payment.bookingId,
            BOOKING_STATUS.SAMPLE_COLLECTED
          );
        }
      }
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
};

export const getPaymentsByUser = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await paymentService.getPaymentsByUserId(req.user.id, page, limit);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPayments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await paymentService.getAllPayments(page, limit);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentStats = async (req, res, next) => {
  try {
    // Admin gets all stats, customers get their own stats
    const userId = req.user.role === 'ADMIN' ? null : req.user.id;
    const stats = await paymentService.getPaymentStats(userId);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminPaymentStats = async (req, res, next) => {
  try {
    const stats = await paymentService.getPaymentStats();

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
