import React, { useState } from 'react';
import { formatPKR } from '../utils/currency.js';
import toast from 'react-hot-toast';

export default function BookingCheckout({
  tests = [],
  totalAmount = 0,
  bookingData = {},
  onProceedToPayment = () => {},
  onBack = () => {},
  loading = false
}) {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    if (!time) return 'N/A';
    return time;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Booking Summary</h1>

      <div className="space-y-6">
        {/* Selected Tests */}
        <div className="card">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="text-xl">🔬</span>
            Selected Tests
          </h2>
          
          {tests && tests.length > 0 ? (
            <div className="space-y-3">
              {tests.map((test, index) => (
                <div
                  key={test.id || index}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{test.testName}</p>
                    {test.category && (
                      <p className="text-sm text-gray-600">{test.category}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{formatPKR(test.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No tests selected</p>
          )}
        </div>

        {/* Booking Details */}
        <div className="card">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="text-xl">📋</span>
            Booking Details
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 font-medium">Booking Type</p>
              <p className="font-semibold text-gray-900 mt-1">
                {bookingData.bookingType === 'LAB_VISIT' ? '🏥 Lab Visit' : '🏠 Home Sampling'}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 font-medium">Date</p>
              <p className="font-semibold text-gray-900 mt-1">
                {formatDate(bookingData.appointmentDate)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 font-medium">Time</p>
              <p className="font-semibold text-gray-900 mt-1">
                {formatTime(bookingData.appointmentTime)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 font-medium">Number of Tests</p>
              <p className="font-semibold text-gray-900 mt-1">{tests?.length || 0}</p>
            </div>
          </div>

          {/* Address if Home Sampling */}
          {bookingData.bookingType === 'HOME_SAMPLING' && bookingData.address && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-600 font-medium mb-2">Delivery Address</p>
              <div className="text-gray-900">
                <p className="font-semibold">{bookingData.address}</p>
                <p className="text-sm">
                  {bookingData.city && `${bookingData.city}, `}
                  {bookingData.state && `${bookingData.state} `}
                  {bookingData.pincode}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="text-xl">💳</span>
            Payment Summary
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-blue-200">
              <span className="text-gray-700">Subtotal ({tests?.length || 0} tests)</span>
              <span className="font-semibold text-gray-900">{formatPKR(totalAmount)}</span>
            </div>
            
            <div className="flex justify-between items-center pb-3 border-b border-blue-200">
              <span className="text-gray-700">Tax</span>
              <span className="font-semibold text-gray-900">Rs. 0</span>
            </div>
            
            <div className="flex justify-between items-center pt-3">
              <span className="text-lg font-bold text-gray-900">Total Amount</span>
              <span className="text-2xl font-bold text-blue-600">{formatPKR(totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
          <p className="text-sm text-green-800">
            <strong>✓</strong> Secure payment through Stripe
          </p>
          <p className="text-sm text-green-800 mt-1">
            <strong>✓</strong> Your booking will be confirmed after successful payment
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-between pt-4">
          <button
            onClick={onBack}
            disabled={loading}
            className="btn-secondary flex-1"
          >
            ← Back to Selection
          </button>
          <button
            onClick={onProceedToPayment}
            disabled={loading || !tests?.length}
            className="btn-primary flex-1"
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin mr-2">⟳</span>
                Processing...
              </>
            ) : (
              <>
                💳 Proceed to Payment
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
