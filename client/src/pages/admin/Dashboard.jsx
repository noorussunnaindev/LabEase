import React, { useState, useEffect } from 'react';
import { bookingAPI, paymentAPI } from '../../api/index.js';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [paymentStats, setPaymentStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [bookRes, payRes] = await Promise.all([
        bookingAPI.getStats(),
        paymentAPI.getStats(),
      ]);

      setStats(bookRes.data.data);
      setPaymentStats(payRes.data.data);
    } catch (error) {
      toast.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your platform</p>
      </div>

      {!loading && (
        <>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="card">
              <div className="text-blue-600 text-3xl font-bold">{stats?.total || 0}</div>
              <p className="text-gray-600 mt-2">Total Bookings</p>
            </div>
            <div className="card">
              <div className="text-green-600 text-3xl font-bold">{stats?.completed || 0}</div>
              <p className="text-gray-600 mt-2">Completed</p>
            </div>
            <div className="card">
              <div className="text-yellow-600 text-3xl font-bold">{stats?.pending || 0}</div>
              <p className="text-gray-600 mt-2">Pending</p>
            </div>
            <div className="card">
              <div className="text-purple-600 text-3xl font-bold">${paymentStats?.totalRevenue || 0}</div>
              <p className="text-gray-600 mt-2">Total Revenue</p>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <a href="/admin/bookings" className="card-hover">
              <div className="text-2xl mb-3">📋</div>
              <h3 className="font-bold mb-2">Bookings</h3>
              <p className="text-sm text-gray-600">Manage all bookings</p>
            </a>
            <a href="/admin/tests" className="card-hover">
              <div className="text-2xl mb-3">🧪</div>
              <h3 className="font-bold mb-2">Tests</h3>
              <p className="text-sm text-gray-600">Manage medical tests</p>
            </a>
            <a href="/admin/users" className="card-hover">
              <div className="text-2xl mb-3">👥</div>
              <h3 className="font-bold mb-2">Users</h3>
              <p className="text-sm text-gray-600">Manage users</p>
            </a>
            <div className="card-hover">
              <div className="text-2xl mb-3">📊</div>
              <h3 className="font-bold mb-2">Analytics</h3>
              <p className="text-sm text-gray-600">View reports</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
