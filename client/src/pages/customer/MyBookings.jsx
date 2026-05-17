import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../../api/index.js';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchBookings();
  }, [page]);

  const fetchBookings = async () => {
    try {
      const res = await bookingAPI.getMyBookings(page);
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
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600 mt-2">View and manage all your test bookings</p>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : bookings.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">No bookings found</p>
          <Link to="/customer/new-booking" className="btn-primary inline-block mt-4">
            Book Your First Test
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Booking #</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tests</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">{booking.bookingNumber}</td>
                  <td className="px-6 py-4 text-sm">{new Date(booking.appointmentDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm">
                    {booking.bookingTests?.length || 0} test(s)
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">${booking.totalAmount}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`badge ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Link to={`/customer/booking/${booking.id}`} className="text-blue-600 hover:text-blue-700">
                      View
                    </Link>
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
