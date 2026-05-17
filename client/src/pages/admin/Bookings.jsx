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
      setBookings(res.data.data.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">All Bookings</h1>
        <p className="text-gray-600 mt-2">Manage all test bookings</p>
      </div>

      {loading ? <div>Loading...</div> : <div className="card">Bookings table</div>}
    </div>
  );
}
