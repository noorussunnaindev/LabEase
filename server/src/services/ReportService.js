import { Report } from '../entities/Report.js';
import { Booking } from '../entities/Booking.js';
import { getRepository, updateEntity, findEntity } from '../utils/database.js';
import { AppError } from '../middleware/errorHandler.js';

export class ReportService {
  async uploadReport(bookingId, file) {
    const bookingRepo = getRepository(Booking);
    const reportRepo = getRepository(Report);

    const booking = await bookingRepo.findOne({ where: { id: bookingId } });
    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    const report = await reportRepo.findOne({ where: { bookingId } });
    if (!report) {
      throw new AppError('Report not found', 404);
    }

    const fileUrl = `/uploads/${file.filename}`;

    return updateEntity(Report, report.id, {
      reportFile: file.filename,
      fileUrl,
      readyDate: new Date(),
      isReady: true
    });
  }

  async markReportReady(bookingId) {
    const reportRepo = getRepository(Report);
    const report = await reportRepo.findOne({ where: { bookingId } });

    if (!report) {
      throw new AppError('Report not found', 404);
    }

    return updateEntity(Report, report.id, {
      isReady: true,
      readyDate: new Date()
    });
  }

  async getReportByBookingId(bookingId) {
    const reportRepo = getRepository(Report);
    const report = await reportRepo.findOne({ where: { bookingId } });

    if (!report) {
      throw new AppError('Report not found', 404);
    }

    return report;
  }

  async getReportsByUserId(userId) {
    const reportRepo = getRepository(Report);
    const bookingRepo = getRepository(Booking);

    const bookings = await bookingRepo.find({ where: { userId } });
    const bookingIds = bookings.map(b => b.id);

    if (bookingIds.length === 0) {
      return [];
    }

    return reportRepo
      .createQueryBuilder('report')
      .where('report.bookingId IN (:...bookingIds)', { bookingIds })
      .leftJoinAndSelect('report.booking', 'booking')
      .orderBy('report.createdAt', 'DESC')
      .getMany();
  }

  async deleteReport(bookingId) {
    const reportRepo = getRepository(Report);
    const report = await reportRepo.findOne({ where: { bookingId } });

    if (report && report.reportFile) {
      // File deletion can be implemented separately
      return reportRepo.remove(report);
    }

    throw new AppError('Report not found', 404);
  }
}
