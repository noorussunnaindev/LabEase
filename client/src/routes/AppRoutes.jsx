import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import MainLayout from '../layouts/MainLayout.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import StaffLayout from '../layouts/StaffLayout.jsx';
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';
import Home from '../pages/public/Home.jsx';
import TestCatalog from '../pages/public/TestCatalog.jsx';
import CustomerDashboard from '../pages/customer/Dashboard.jsx';
import MyBookings from '../pages/customer/MyBookings.jsx';
import BookingDetails from '../pages/customer/BookingDetails.jsx';
import Booking from '../pages/customer/Booking.jsx';
import MyReports from '../pages/customer/MyReports.jsx';
import PaymentSuccess from '../pages/customer/PaymentSuccess.jsx';
import PaymentCancel from '../pages/customer/PaymentCancel.jsx';
import StaffDashboard from '../pages/staff/Dashboard.jsx';
import StaffBookings from '../pages/staff/Bookings.jsx';
import AdminDashboard from '../pages/admin/Dashboard.jsx';
import AdminBookings from '../pages/admin/Bookings.jsx';
import AdminTests from '../pages/admin/Tests.jsx';
import AdminUsers from '../pages/admin/Users.jsx';
import AdminAnalytics from '../pages/admin/Analytics.jsx';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div>Loading...</div></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/tests" element={<MainLayout><TestCatalog /></MainLayout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer Routes */}
      <Route
        path="/customer/*"
        element={
          <ProtectedRoute requiredRole="CUSTOMER">
            <DashboardLayout>
              <Routes>
                <Route path="dashboard" element={<CustomerDashboard />} />
                <Route path="bookings" element={<MyBookings />} />
                <Route path="booking/:id" element={<BookingDetails />} />
                <Route path="new-booking" element={<Booking />} />
                <Route path="reports" element={<MyReports />} />
                <Route path="payment-success" element={<PaymentSuccess />} />
                <Route path="payment-cancel" element={<PaymentCancel />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Staff Routes */}
      <Route
        path="/staff/*"
        element={
          <ProtectedRoute requiredRole="LAB_STAFF">
            <StaffLayout>
              <Routes>
                <Route path="dashboard" element={<StaffDashboard />} />
                <Route path="bookings" element={<StaffBookings />} />
              </Routes>
            </StaffLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="tests" element={<AdminTests />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="analytics" element={<AdminAnalytics />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
