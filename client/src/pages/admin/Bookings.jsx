import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../../api/index.js';
import toast from 'react-hot-toast';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await bookingAPI.getAllBookings();
      setBookings(res.data.data.data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">All Bookings</h1>
        <p className="text-gray-600 mt-2">Manage all test bookings</p>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              <th className="text-left py-3 px-4 font-bold">Booking #</th>
              <th className="text-left py-3 px-4 font-bold">Customer</th>
              <th className="text-left py-3 px-4 font-bold">Tests</th>
              <th className="text-left py-3 px-4 font-bold">Type</th>
              <th className="text-left py-3 px-4 font-bold">Amount</th>
              <th className="text-left py-3 px-4 font-bold">Status</th>
              <th className="text-left py-3 px-4 font-bold">Payment</th>
              <th className="text-left py-3 px-4 font-bold">Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{booking.bookingNumber}</td>
                  <td className="py-3 px-4">
                    {booking.user?.firstName} {booking.user?.lastName}
                  </td>
                  <td className="py-3 px-4">
                    {booking.bookingTests?.length || 0} test(s)
                  </td>
                  <td className="py-3 px-4">{booking.bookingType}</td>
                  <td className="py-3 px-4 font-semibold">${parseFloat(booking.totalAmount || 0).toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded text-xs font-semibold" style={{
                      backgroundColor: booking.status === 'COMPLETED' ? '#dcfce7' : booking.status === 'CANCELLED' ? '#fee2e2' : '#dbeafe',
                      color: booking.status === 'COMPLETED' ? '#166534' : booking.status === 'CANCELLED' ? '#991b1b' : '#1e40af'
                    }}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded text-xs font-semibold" style={{
                      backgroundColor: booking.paymentStatus === 'PAID' ? '#dcfce7' : '#fef3c7',
                      color: booking.paymentStatus === 'PAID' ? '#166534' : '#92400e'
                    }}>
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(booking.appointmentDate).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
