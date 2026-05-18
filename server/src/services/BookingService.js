import { Booking } from '../entities/Booking.js';
import { BookingTest } from '../entities/BookingTest.js';
import { Test } from '../entities/Test.js';
import { Invoice } from '../entities/Invoice.js';
import { Report } from '../entities/Report.js';
import { getRepository, createEntity, updateEntity, findEntity, paginate, deleteEntity } from '../utils/database.js';
import { generateBookingNumber, generateInvoiceNumber } from '../utils/helpers.js';
import { BOOKING_STATUS } from '../constants/index.js';
import { AppError } from '../middleware/errorHandler.js';

export class BookingService {
  async createBooking(userId, bookingData) {
    const bookingRepo = getRepository(Booking);
    const bookingTestRepo = getRepository(BookingTest);
    const testRepo = getRepository(Test);
    const invoiceRepo = getRepository(Invoice);

    // Calculate total amount
    let totalAmount = 0;
    const bookingTests = [];

    for (const testId of bookingData.testIds) {
      const test = await testRepo.findOne({ where: { id: testId } });
      if (!test) {
        throw new AppError(`Test with ID ${testId} not found`, 404);
      }
      totalAmount += parseFloat(test.price);
      bookingTests.push({ testId, price: test.price });
    }

    // Create booking
    const booking = bookingRepo.create({
      userId,
      bookingNumber: generateBookingNumber(),
      status: BOOKING_STATUS.BOOKED,
      bookingType: bookingData.bookingType,
      appointmentDate: bookingData.appointmentDate,
      appointmentTime: bookingData.appointmentTime,
      address: bookingData.address,
      city: bookingData.city,
      state: bookingData.state,
      pincode: bookingData.pincode,
      totalAmount,
      paymentStatus: 'PENDING',
      notes: bookingData.notes
    });

    const savedBooking = await bookingRepo.save(booking);

    // Create booking tests
    for (const test of bookingTests) {
      const bookingTest = bookingTestRepo.create({
        bookingId: savedBooking.id,
        testId: test.testId,
        price: test.price
      });
      await bookingTestRepo.save(bookingTest);
    }

    // Create invoice
    const invoiceNumber = generateInvoiceNumber();
    const invoice = invoiceRepo.create({
      invoiceNumber,
      bookingId: savedBooking.id,
      subtotal: totalAmount,
      tax: 0,
      totalAmount: totalAmount,
      invoiceDate: new Date(),
      paymentStatus: 'PENDING'
    });

    await invoiceRepo.save(invoice);

    // Create report placeholder
    const reportRepo = getRepository(Report);
    const report = reportRepo.create({
      bookingId: savedBooking.id,
      isReady: false
    });
    await reportRepo.save(report);

    return this.getBookingById(savedBooking.id);
  }

  async getBookingById(id) {
    const repository = getRepository(Booking);
    return repository.findOne({
      where: { id },
      relations: ['user', 'bookingTests', 'bookingTests.test', 'report', 'invoice', 'payment']
    });
  }

  async getBookingsByUserId(userId, page = 1, limit = 10) {
    return paginate(Booking, page, limit, { userId });
  }

  async getAllBookings(page = 1, limit = 10, status = null) {
    const criteria = status ? { status } : {};
    return paginate(Booking, page, limit, criteria, ['user', 'bookingTests', 'bookingTests.test']);
  }

  async updateBookingStatus(id, status) {
    if (!Object.values(BOOKING_STATUS).includes(status)) {
      throw new AppError('Invalid status', 400);
    }

    return updateEntity(Booking, id, { status });
  }

  async cancelBooking(id) {
    const booking = await findEntity(Booking, { id });

    if (booking.status === BOOKING_STATUS.CANCELLED) {
      throw new AppError('Booking already cancelled', 400);
    }

    return updateEntity(Booking, id, { status: BOOKING_STATUS.CANCELLED });
  }

  async deleteBooking(id) {
    const booking = await findEntity(Booking, { id });
    if (!booking) {
      throw new AppError('Booking not found', 404);
    }
    return deleteEntity(Booking, id);
  }

  async searchBookings(criteria = {}) {
    const repository = getRepository(Booking);
    let query = repository.createQueryBuilder('booking');

    if (criteria.status) {
      query = query.where('booking.status = :status', { status: criteria.status });
    }

    if (criteria.userId) {
      query = query.andWhere('booking.userId = :userId', { userId: criteria.userId });
    }

    if (criteria.bookingNumber) {
      query = query.andWhere('booking.bookingNumber LIKE :bookingNumber', { 
        bookingNumber: `%${criteria.bookingNumber}%` 
      });
    }

    if (criteria.startDate && criteria.endDate) {
      query = query.andWhere('booking.appointmentDate BETWEEN :startDate AND :endDate', {
        startDate: criteria.startDate,
        endDate: criteria.endDate
      });
    }

    return query
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.bookingTests', 'bookingTests')
      .leftJoinAndSelect('bookingTests.test', 'test')
      .orderBy('booking.createdAt', 'DESC')
      .getMany();
  }

  async getBookingStats(userId = null) {
    const repository = getRepository(Booking);
    let query = repository.createQueryBuilder('booking');

    if (userId) {
      query = query.where('booking.userId = :userId', { userId });
    }

    const total = await query.getCount();
    
    const completed = await repository.countBy({
      ...(userId && { userId }),
      status: BOOKING_STATUS.COMPLETED
    });

    const pending = await repository.countBy({
      ...(userId && { userId }),
      status: BOOKING_STATUS.BOOKED
    });

    return { total, completed, pending };
  }

  async updatePaymentStatus(bookingId, paymentStatus) {
    return updateEntity(Booking, bookingId, { paymentStatus });
  }
}
