import React, { useState, useEffect } from 'react';
import { bookingAPI, paymentAPI } from '../../api/index.js';
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function CustomerDashboard() {
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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your health overview.</p>
      </div>

      {/* Stats Cards */}
      {!loading && (
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
            <p className="text-gray-600 mt-2">Total Spent</p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <a href="/customer/new-booking" className="card-hover">
          <div className="text-2xl mb-3">📋</div>
          <h3 className="font-bold mb-2">Book New Test</h3>
          <p className="text-sm text-gray-600">Schedule a new medical test</p>
        </a>
        <a href="/customer/bookings" className="card-hover">
          <div className="text-2xl mb-3">📅</div>
          <h3 className="font-bold mb-2">My Bookings</h3>
          <p className="text-sm text-gray-600">View and manage your bookings</p>
        </a>
        <a href="/customer/reports" className="card-hover">
          <div className="text-2xl mb-3">📄</div>
          <h3 className="font-bold mb-2">My Reports</h3>
          <p className="text-sm text-gray-600">Download your test reports</p>
        </a>
      </div>
    </div>
  );
}
