import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { bookingAPI } from '../../api/index.js';
import toast from 'react-hot-toast';

export default function BookingDetails() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      const res = await bookingAPI.getBooking(id);
      setBooking(res.data.data);
    } catch (error) {
      toast.error('Failed to load booking');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!booking) return <div>Booking not found</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Booking Details</h1>
        <p className="text-gray-600">#{booking.bookingNumber}</p>
      </div>

      {/* Status */}
      <div className="card">
        <h2 className="font-bold mb-4">Status</h2>
        <div className="flex items-center space-x-4">
          <div className={`badge badge-${booking.status === 'COMPLETED' ? 'success' : 'info'}`}>
            {booking.status}
          </div>
          <p className="text-gray-600">Payment: {booking.paymentStatus}</p>
        </div>
      </div>

      {/* Details */}
      <div className="card">
        <h2 className="font-bold mb-4">Booking Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600">Date</p>
            <p className="font-medium">{new Date(booking.appointmentDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Time</p>
            <p className="font-medium">{booking.appointmentTime}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Type</p>
            <p className="font-medium">{booking.bookingType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="font-medium">${booking.totalAmount}</p>
          </div>
        </div>
      </div>

      {/* Tests */}
      <div className="card">
        <h2 className="font-bold mb-4">Selected Tests</h2>
        <div className="space-y-3">
          {booking.bookingTests?.map((bt) => (
            <div key={bt.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">{bt.test?.testName}</p>
                <p className="text-sm text-gray-600">{bt.test?.category?.name}</p>
              </div>
              <p className="font-medium">${bt.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Address */}
      {booking.address && (
        <div className="card">
          <h2 className="font-bold mb-4">Address</h2>
          <p className="text-gray-600">
            {booking.address}<br />
            {booking.city}, {booking.state} {booking.pincode}
          </p>
        </div>
      )}
    </div>
  );
}
