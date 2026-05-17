import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="card text-center max-w-md">
        <div className="text-6xl mb-4">✕</div>
        <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-8">Your payment was cancelled. Your booking is still saved and you can try again.</p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/customer/bookings')}
            className="btn-primary flex-1"
          >
            My Bookings
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-secondary flex-1"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
