import { Payment } from '../entities/Payment.js';
import { Invoice } from '../entities/Invoice.js';
import { Booking } from '../entities/Booking.js';
import { getRepository, createEntity, updateEntity, findAllEntities, paginate } from '../utils/database.js';
import { createCheckoutSession } from '../utils/stripe.js';
import { AppError } from '../middleware/errorHandler.js';

export class PaymentService {
  async createPaymentSession(bookingId, userId) {
    const bookingRepo = getRepository(Booking);
    const booking = await bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['user', 'bookingTests', 'bookingTests.test']
    });

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    const tests = booking.bookingTests.map(bt => bt.test);
    const session = await createCheckoutSession(booking, tests, booking.user);

    // Create payment record
    const payment = await createEntity(Payment, {
      bookingId,
      userId,
      amount: booking.totalAmount,
      status: 'PENDING',
      stripeSessionId: session.id,
      paymentMethod: 'STRIPE',
      description: `Payment for booking ${booking.bookingNumber}`
    });

    return {
      payment,
      sessionId: session.id
    };
  }

  async getPaymentBySessionId(sessionId) {
    const paymentRepo = getRepository(Payment);
    return paymentRepo.findOne({ where: { stripeSessionId: sessionId } });
  }

  async updatePaymentStatus(paymentId, status, transactionId = null) {
    const paymentRepo = getRepository(Payment);
    const updateData = { status };

    if (transactionId) {
      updateData.transactionId = transactionId;
    }

    const payment = await updateEntity(Payment, paymentId, updateData);

    // Update booking payment status
    if (status === 'COMPLETED' && payment.bookingId) {
      const bookingRepo = getRepository(Booking);
      await updateEntity(Booking, payment.bookingId, { paymentStatus: 'COMPLETED' });

      // Update invoice status
      const invoiceRepo = getRepository(Invoice);
      const invoice = await invoiceRepo.findOne({ where: { bookingId: payment.bookingId } });
      if (invoice) {
        await updateEntity(Invoice, invoice.id, { paymentStatus: 'COMPLETED' });
      }
    }

    return payment;
  }

  async getPaymentsByUserId(userId, page = 1, limit = 10) {
    return paginate(Payment, page, limit, { userId });
  }

  async getAllPayments(page = 1, limit = 10) {
    return paginate(Payment, page, limit, {});
  }

  async getPaymentStats(userId = null) {
    const paymentRepo = getRepository(Payment);
    let query = paymentRepo.createQueryBuilder('payment');

    if (userId) {
      query = query.where('payment.userId = :userId', { userId });
    }

    const totalRevenue = await query
      .andWhere('payment.status = :status', { status: 'COMPLETED' })
      .select('SUM(payment.amount)', 'total')
      .getRawOne();

    const totalPayments = await paymentRepo.countBy({
      ...(userId && { userId }),
      status: 'COMPLETED'
    });

    return {
      totalRevenue: parseFloat(totalRevenue?.total || 0),
      totalPayments
    };
  }
}
