import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../../api/index.js';
import toast from 'react-hot-toast';
import { FiUsers, FiFileText, FiCalendar, FiDollarSign } from 'react-icons/fi';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalTests: 0,
    totalBookings: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await analyticsAPI.getAnalytics();
      setAnalytics(res.data.data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-gray-600 mt-2">Platform statistics and metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.totalUsers}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FiUsers size={28} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Tests Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Tests</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.totalTests}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <FiFileText size={28} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Total Bookings Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.totalBookings}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <FiCalendar size={28} className="text-purple-600" />
            </div>
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">${analytics.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <FiDollarSign size={28} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
