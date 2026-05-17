// User roles
export const ROLES = {
  ADMIN: 'ADMIN',
  LAB_STAFF: 'LAB_STAFF',
  CUSTOMER: 'CUSTOMER'
};

// Booking statuses
export const BOOKING_STATUS = {
  BOOKED: 'BOOKED',
  SAMPLE_COLLECTED: 'SAMPLE_COLLECTED',
  PROCESSING: 'PROCESSING',
  REPORT_READY: 'REPORT_READY',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
};

// Booking types
export const BOOKING_TYPE = {
  HOME_SAMPLING: 'HOME_SAMPLING',
  LAB_VISIT: 'LAB_VISIT'
};

// Status colors for frontend
export const STATUS_COLORS = {
  BOOKED: 'info',
  SAMPLE_COLLECTED: 'warning',
  PROCESSING: 'warning',
  REPORT_READY: 'success',
  COMPLETED: 'success',
  CANCELLED: 'danger'
};
