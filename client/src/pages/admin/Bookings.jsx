import React, { useState, useEffect } from 'react';
import { bookingAPI, invoiceAPI } from '../../api/index.js';
import toast from 'react-hot-toast';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [deleting, setDeleting] = useState(null);

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

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setUpdating(bookingId);
      
      // If changing to COMPLETED, ensure invoice exists first
      if (newStatus === 'COMPLETED') {
        try {
          await invoiceAPI.createInvoice(bookingId);
        } catch (error) {
          // Invoice might already exist, which is fine
          if (error.response?.status !== 409) {
            console.log('Invoice creation info:', error.response?.data?.message);
          }
        }
      }

      const res = await bookingAPI.updateBookingStatus(bookingId, newStatus);
      setBookings(bookings.map(b => b.id === bookingId ? res.data.data : b));
      toast.success(`Booking status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to update booking status');
    } finally {
      setUpdating(null);
    }
  };

  const handlePaymentStatusToggle = async (bookingId, currentStatus) => {
    const newStatus = currentStatus === 'PAID' ? 'UNPAID' : 'PAID';
    try {
      setUpdating(bookingId);
      const res = await bookingAPI.updatePaymentStatus(bookingId, { paymentStatus: newStatus });
      setBookings(bookings.map(b => b.id === bookingId ? res.data.data : b));
      toast.success(`Payment status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to update payment status');
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteBooking = async (bookingId, bookingNumber) => {
    if (!window.confirm(`Are you sure you want to delete booking "${bookingNumber}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(bookingId);
      await bookingAPI.deleteBooking(bookingId);
      setBookings(bookings.filter(b => b.id !== bookingId));
      toast.success('Booking deleted successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete booking');
    } finally {
      setDeleting(null);
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
              <th className="text-left py-3 px-4 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500">
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
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      disabled={updating === booking.id}
                      className="px-2 py-1 rounded text-xs font-semibold border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: booking.status === 'COMPLETED' ? '#dcfce7' : booking.status === 'CANCELLED' ? '#fee2e2' : '#dbeafe',
                        color: booking.status === 'COMPLETED' ? '#166534' : booking.status === 'CANCELLED' ? '#991b1b' : '#1e40af',
                        borderColor: booking.status === 'COMPLETED' ? '#86efac' : booking.status === 'CANCELLED' ? '#fca5a5' : '#93c5fd'
                      }}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handlePaymentStatusToggle(booking.id, booking.paymentStatus)}
                      disabled={updating === booking.id}
                      className="px-2 py-1 rounded text-xs font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: booking.paymentStatus === 'PAID' ? '#dcfce7' : '#fef3c7',
                        color: booking.paymentStatus === 'PAID' ? '#166534' : '#92400e'
                      }}
                    >
                      {booking.paymentStatus}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(booking.appointmentDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDeleteBooking(booking.id, booking.bookingNumber)}
                      disabled={deleting === booking.id}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {deleting === booking.id ? 'Deleting...' : 'Delete'}
                    </button>
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
