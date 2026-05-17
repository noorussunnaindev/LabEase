import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../../api/index.js';
import toast from 'react-hot-toast';

export default function StaffBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await bookingAPI.getAllBookings();
      setBookings(res.data.data.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      BOOKED: 'bg-blue-100 text-blue-800',
      SAMPLE_COLLECTED: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-yellow-100 text-yellow-800',
      REPORT_READY: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Bookings</h1>
        <p className="text-gray-600 mt-2">Manage all customer test bookings</p>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto card">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Booking #</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 font-medium">{booking.bookingNumber}</td>
                  <td className="px-6 py-4">
                    {booking.user?.firstName} {booking.user?.lastName}
                  </td>
                  <td className="px-6 py-4">{new Date(booking.appointmentDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">${booking.totalAmount}</td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-700">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
