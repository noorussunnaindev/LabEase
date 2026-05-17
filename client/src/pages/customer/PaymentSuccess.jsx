import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const bookingId = params.get('booking_id');

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="card text-center max-w-md">
        <div className="text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">Your test booking has been confirmed. You'll receive a confirmation email shortly.</p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate(`/customer/booking/${bookingId}`)}
            className="btn-primary flex-1"
          >
            View Booking
          </button>
          <button
            onClick={() => navigate('/customer/bookings')}
            className="btn-secondary flex-1"
          >
            All Bookings
          </button>
        </div>
      </div>
    </div>
  );
}
