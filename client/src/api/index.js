import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  verify: () => api.get('/auth/verify'),
};

// Test API calls
export const testAPI = {
  getTests: (page = 1, limit = 10, categoryId = null) =>
    api.get('/tests', { params: { page, limit, categoryId } }),
  getTestById: (id) => api.get(`/tests/${id}`),
  searchTests: (query) => api.get('/tests/search', { params: { query } }),
  createTest: (data) => api.post('/tests', data),
  updateTest: (id, data) => api.put(`/tests/${id}`, data),
  deleteTest: (id) => api.delete(`/tests/${id}`),
};

// Category API calls
export const categoryAPI = {
  getCategories: () => api.get('/categories'),
  getCategoryById: (id) => api.get(`/categories/${id}`),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

// Booking API calls
export const bookingAPI = {
  createBooking: (data) => api.post('/bookings', data),
  getMyBookings: (page = 1, limit = 10) =>
    api.get('/bookings/my-bookings', { params: { page, limit } }),
  getBooking: (id) => api.get(`/bookings/id/${id}`),
  getAllBookings: (page = 1, limit = 10, status = null) =>
    api.get('/bookings', { params: { page, limit, status } }),
  updateBookingStatus: (id, status) =>
    api.put(`/bookings/${id}/status`, { status }),
  updatePaymentStatus: (id, data) =>
    api.put(`/bookings/${id}/payment`, data),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
  deleteBooking: (id) => api.delete(`/bookings/${id}`),
  searchBookings: (criteria) => api.get('/bookings/search', { params: criteria }),
  getStats: () => api.get('/bookings/stats'),
};

// Report API calls
export const reportAPI = {
  uploadReport: (bookingId, formData) =>
    api.post('/reports/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  markReportReady: (bookingId) =>
    api.put('/reports/mark-ready', { bookingId }),
  getReport: (bookingId) => api.get(`/reports/${bookingId}`),
  getMyReports: () => api.get('/reports/my-reports'),
};

// Payment API calls
export const paymentAPI = {
  createSession: (bookingId) =>
    api.post('/payments/create-session', { bookingId }),
  getPaymentStatus: (sessionId) =>
    api.get(`/payments/status/${sessionId}`),
  getMyPayments: (page = 1, limit = 10) =>
    api.get('/payments/my-payments', { params: { page, limit } }),
  getStats: () => api.get('/payments/stats'),
};

// User API calls
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.post('/users/change-password', data),
  getAllUsers: (page = 1, limit = 10, role = null) =>
    api.get('/users', { params: { page, limit, role } }),
  activateUser: (id) => api.put(`/users/${id}/activate`),
  deactivateUser: (id) => api.put(`/users/${id}/deactivate`),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getStats: () => api.get('/users/stats'),
};

// Analytics API calls
export const analyticsAPI = {
  getAnalytics: () => api.get('/analytics'),
};

// Invoice API calls
export const invoiceAPI = {
  getInvoice: (bookingId) => api.get(`/invoices/booking/${bookingId}`),
  createInvoice: (bookingId) => api.post(`/invoices/create/${bookingId}`),
  downloadInvoice: (bookingId) => api.get(`/invoices/download/${bookingId}`),
  getMyInvoices: (page = 1, limit = 10) =>
    api.get('/invoices/my-invoices', { params: { page, limit } }),
};

export default api;
