import { Invoice } from '../entities/Invoice.js';
import { Booking } from '../entities/Booking.js';
import { AppError } from '../middleware/errorHandler.js';
import { getRepository, findEntity } from '../utils/database.js';
import { generateInvoiceNumber } from '../utils/helpers.js';

export const getInvoiceByBookingId = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const invoiceRepo = getRepository(Invoice);
    const invoice = await invoiceRepo.findOne({
      where: { bookingId }
    });

    if (!invoice) {
      throw new AppError('Invoice not found for this booking', 404);
    }

    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    next(error);
  }
};

export const createInvoice = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    // Check if booking exists
    const bookingRepo = getRepository(Booking);
    const booking = await bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['invoice']
    });

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    // Check if invoice already exists
    if (booking.invoice) {
      return res.status(200).json({
        success: true,
        data: booking.invoice,
        message: 'Invoice already exists for this booking'
      });
    }

    // Create new invoice
    const invoiceRepo = getRepository(Invoice);
    const invoiceNumber = generateInvoiceNumber();

    const invoice = invoiceRepo.create({
      invoiceNumber,
      bookingId,
      subtotal: booking.totalAmount,
      tax: 0,
      totalAmount: booking.totalAmount,
      invoiceDate: new Date(),
      paymentStatus: booking.paymentStatus || 'PENDING'
    });

    const savedInvoice = await invoiceRepo.save(invoice);

    res.status(201).json({
      success: true,
      data: savedInvoice,
      message: 'Invoice created successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const downloadInvoice = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    // Get invoice for booking
    const invoiceRepo = getRepository(Invoice);
    const invoice = await invoiceRepo.findOne({
      where: { bookingId }
    });

    if (!invoice) {
      throw new AppError('Invoice not found for this booking', 404);
    }

    // Get booking details for invoice content
    const bookingRepo = getRepository(Booking);
    const booking = await bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['user', 'bookingTests', 'bookingTests.test']
    });

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    // Generate invoice HTML/PDF content
    const invoiceContent = generateInvoiceContent(invoice, booking);

    // Return invoice data for download
    res.status(200).json({
      success: true,
      data: {
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: invoice.invoiceDate,
        booking: {
          bookingNumber: booking.bookingNumber,
          appointmentDate: booking.appointmentDate,
          totalAmount: booking.totalAmount
        },
        customer: {
          firstName: booking.user?.firstName,
          lastName: booking.user?.lastName,
          email: booking.user?.email,
          phone: booking.user?.phone
        },
        tests: booking.bookingTests?.map(bt => ({
          name: bt.test?.testName,
          price: bt.price
        })) || [],
        invoice: {
          subtotal: invoice.subtotal,
          tax: invoice.tax,
          totalAmount: invoice.totalAmount,
          paymentStatus: invoice.paymentStatus
        },
        htmlContent: invoiceContent
      }
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to generate invoice HTML content
function generateInvoiceContent(invoice, booking) {
  const testsHtml = booking.bookingTests?.map(bt => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${bt.test?.testName || 'Test'}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${parseFloat(bt.price).toFixed(2)}</td>
    </tr>
  `).join('') || '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { border-bottom: 2px solid #0066cc; padding-bottom: 20px; margin-bottom: 20px; }
        .header h1 { margin: 0; color: #0066cc; }
        .invoice-details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .section { background: #f9f9f9; padding: 15px; border-radius: 4px; }
        .section h3 { margin-top: 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #0066cc; color: white; padding: 10px; text-align: left; }
        .total-section { background: #e8f0fe; padding: 20px; border-radius: 4px; }
        .total-row { display: flex; justify-content: space-between; margin: 10px 0; }
        .total-row.final { font-size: 18px; font-weight: bold; color: #0066cc; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Invoice</h1>
          <p>Invoice #: ${invoice.invoiceNumber}</p>
          <p>Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}</p>
        </div>

        <div class="invoice-details">
          <div class="section">
            <h3>From:</h3>
            <p><strong>LabEase</strong></p>
            <p>Medical Laboratory Services</p>
          </div>
          <div class="section">
            <h3>Bill To:</h3>
            <p><strong>${booking.user?.firstName} ${booking.user?.lastName}</strong></p>
            <p>Email: ${booking.user?.email}</p>
            <p>Phone: ${booking.user?.phone}</p>
          </div>
        </div>

        <div class="section">
          <h3>Booking Details</h3>
          <p><strong>Booking #:</strong> ${booking.bookingNumber}</p>
          <p><strong>Appointment Date:</strong> ${new Date(booking.appointmentDate).toLocaleDateString()}</p>
          <p><strong>Appointment Time:</strong> ${booking.appointmentTime}</p>
        </div>

        <h3>Tests</h3>
        <table>
          <thead>
            <tr>
              <th>Test Name</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${testsHtml}
          </tbody>
        </table>

        <div class="total-section">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>$${parseFloat(invoice.subtotal).toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Tax:</span>
            <span>$${parseFloat(invoice.tax).toFixed(2)}</span>
          </div>
          <div class="total-row final">
            <span>Total Amount:</span>
            <span>$${parseFloat(invoice.totalAmount).toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Payment Status:</span>
            <span>${invoice.paymentStatus}</span>
          </div>
        </div>

        <p style="text-align: center; color: #666; margin-top: 40px; font-size: 12px;">
          Thank you for choosing LabEase. For support, contact our customer service.
        </p>
      </div>
    </body>
    </html>
  `;
}

export const getInvoicesByUser = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const invoiceRepo = getRepository(Invoice);
    const bookingRepo = getRepository(Booking);

    // Get user's bookings
    const [bookings] = await bookingRepo.findAndCount({
      where: { userId: req.user.id },
      skip: (page - 1) * limit,
      take: limit
    });

    const bookingIds = bookings.map(b => b.id);

    // Get invoices for these bookings
    const [invoices, total] = await invoiceRepo.findAndCount({
      where: { bookingId: bookingIds }
    });

    res.status(200).json({
      success: true,
      data: {
        data: invoices,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
