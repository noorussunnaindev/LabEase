import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../../api/index.js';
import toast from 'react-hot-toast';

export default function StaffDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await bookingAPI.getStats();
      setStats(res.data.data);
    } catch (error) {
      toast.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Staff Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage test bookings and upload reports</p>
      </div>

      {!loading && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <div className="text-blue-600 text-3xl font-bold">{stats?.pending || 0}</div>
            <p className="text-gray-600 mt-2">Pending Tests</p>
          </div>
          <div className="card">
            <div className="text-yellow-600 text-3xl font-bold">0</div>
            <p className="text-gray-600 mt-2">In Progress</p>
          </div>
          <div className="card">
            <div className="text-green-600 text-3xl font-bold">{stats?.completed || 0}</div>
            <p className="text-gray-600 mt-2">Completed</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <a href="/staff/bookings" className="card-hover">
          <div className="text-2xl mb-3">📋</div>
          <h3 className="font-bold mb-2">View All Bookings</h3>
          <p className="text-sm text-gray-600">Manage customer test bookings</p>
        </a>
        <div className="card">
          <div className="text-2xl mb-3">📤</div>
          <h3 className="font-bold mb-2">Upload Report</h3>
          <p className="text-sm text-gray-600">Upload PDF test reports</p>
        </div>
      </div>
    </div>
  );
}
