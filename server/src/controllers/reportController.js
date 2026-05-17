import { ReportService } from '../services/ReportService.js';
import { AppError } from '../middleware/errorHandler.js';

const reportService = new ReportService();

export const uploadReport = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }

    const { bookingId } = req.body;

    if (!bookingId) {
      throw new AppError('Booking ID required', 400);
    }

    const report = await reportService.uploadReport(bookingId, req.file);

    res.status(200).json({
      success: true,
      data: report,
      message: 'Report uploaded successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const markReportReady = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      throw new AppError('Booking ID required', 400);
    }

    const report = await reportService.markReportReady(bookingId);

    res.status(200).json({
      success: true,
      data: report,
      message: 'Report marked as ready'
    });
  } catch (error) {
    next(error);
  }
};

export const getReport = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const report = await reportService.getReportByBookingId(bookingId);

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

export const getMyReports = async (req, res, next) => {
  try {
    const reports = await reportService.getReportsByUserId(req.user.id);

    res.status(200).json({
      success: true,
      data: reports
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReport = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    await reportService.deleteReport(bookingId);

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
