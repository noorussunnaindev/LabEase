import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI } from '../../api/index.js';
import { FiCalendar, FiCheckCircle, FiClock, FiFileText, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function StaffDashboard() {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        bookingAPI.getStats(),
        bookingAPI.getAllBookings(1, 5),
      ]);

      setStats(statsRes.data.data);
      setRecentBookings(bookingsRes.data.data.data || []);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      BOOKED: <FiCalendar className="w-5 h-5" />,
      SAMPLE_COLLECTED: <FiCheckCircle className="w-5 h-5" />,
      PROCESSING: <FiClock className="w-5 h-5" />,
      REPORT_READY: <FiFileText className="w-5 h-5" />,
      COMPLETED: <FiCheckCircle className="w-5 h-5" />,
    };
    return icons[status] || <FiCalendar className="w-5 h-5" />;
  };

  const getStatusColor = (status) => {
    const colors = {
      BOOKED: 'bg-blue-50 text-blue-700 border-blue-200',
      SAMPLE_COLLECTED: 'bg-purple-50 text-purple-700 border-purple-200',
      PROCESSING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      REPORT_READY: 'bg-green-50 text-green-700 border-green-200',
      COMPLETED: 'bg-green-50 text-green-700 border-green-200',
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Lab Staff Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage test bookings, collect samples, and upload reports</p>
      </div>

      {/* Stats Cards */}
      {!loading && stats && (
        <div className="grid md:grid-cols-4 gap-6">
          {/* New Bookings */}
          <Link to="/staff/bookings?filter=BOOKED" className="card hover:shadow-card-hover transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <FiCalendar className="w-6 h-6 text-blue-600" />
              </div>
              <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <div className="text-blue-600 text-4xl font-bold">{stats?.pending || 0}</div>
            <p className="text-gray-600 mt-2">New Bookings</p>
            <p className="text-xs text-gray-500 mt-2">Ready to collect samples</p>
          </Link>

          {/* Samples Collected */}
          <Link to="/staff/bookings?filter=SAMPLE_COLLECTED" className="card hover:shadow-card-hover transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <FiCheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
            </div>
            <div className="text-purple-600 text-4xl font-bold">{stats?.inProgress || 0}</div>
            <p className="text-gray-600 mt-2">Samples Collected</p>
            <p className="text-xs text-gray-500 mt-2">Awaiting processing</p>
          </Link>

          {/* Processing */}
          <Link to="/staff/bookings?filter=PROCESSING" className="card hover:shadow-card-hover transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                <FiClock className="w-6 h-6 text-yellow-600" />
              </div>
              <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-600 transition-colors" />
            </div>
            <div className="text-yellow-600 text-4xl font-bold">0</div>
            <p className="text-gray-600 mt-2">Processing</p>
            <p className="text-xs text-gray-500 mt-2">Tests in progress</p>
          </Link>

          {/* Completed */}
          <Link to="/staff/bookings?filter=COMPLETED" className="card hover:shadow-card-hover transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <FiFileText className="w-6 h-6 text-green-600" />
              </div>
              <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
            </div>
            <div className="text-green-600 text-4xl font-bold">{stats?.completed || 0}</div>
            <p className="text-gray-600 mt-2">Completed</p>
            <p className="text-xs text-gray-500 mt-2">Reports uploaded</p>
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Link
          to="/staff/bookings"
          className="card hover:shadow-card-hover transition-all group cursor-pointer border-2 border-blue-200 hover:border-blue-400"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-4xl mb-3">📋</div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">Manage All Bookings</h3>
              <p className="text-sm text-gray-600">View, filter, and manage all customer test bookings. Collect samples and update statuses.</p>
              <div className="mt-4 flex items-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all">
                View All <FiArrowRight size={18} />
              </div>
            </div>
          </div>
        </Link>

        <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <div>
            <div className="text-4xl mb-3">📤</div>
            <h3 className="font-bold text-lg mb-2">Upload Reports</h3>
            <p className="text-sm text-gray-600">Upload test reports directly from the bookings page when processing is complete.</p>
            <div className="mt-4 flex items-center gap-2 text-green-600 font-medium">
              See Instructions <FiArrowRight size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recent Bookings</h2>
          <Link to="/staff/bookings" className="text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="card text-center py-8">
            <div className="text-4xl mb-3">✨</div>
            <p className="text-gray-600">No recent bookings</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <Link
                key={booking.id}
                to="/staff/bookings"
                className="card hover:shadow-card-hover transition-all p-4 flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-3 rounded-lg ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">
                      {booking.user?.firstName} {booking.user?.lastName}
                    </div>
                    <p className="text-sm text-gray-600">
                      Booking {booking.bookingNumber} • {new Date(booking.appointmentDate).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {booking.tests?.slice(0, 2).map((test) => (
                        <span key={test.id} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {test.testName?.substring(0, 15)}
                        </span>
                      ))}
                      {booking.tests?.length > 2 && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          +{booking.tests.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-blue-600">${booking.totalAmount}</p>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full border ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-3">How to Use Staff Dashboard</h3>
        <ol className="space-y-2 text-sm text-blue-800 list-decimal list-inside">
          <li>Go to <strong>Manage All Bookings</strong> to see all customer test bookings</li>
          <li>Click <strong>Manage</strong> on a booking to view details</li>
          <li>For <strong>BOOKED</strong> status: Click "Confirm Sample Collection" after collecting the sample</li>
          <li>For <strong>SAMPLE_COLLECTED</strong> status: Click "Start Processing" to begin analysis</li>
          <li>For <strong>PROCESSING</strong> status: Upload the report (PDF/Image) and click "Update to REPORT_READY"</li>
          <li>Customers will receive notifications when reports are ready</li>
        </ol>
      </div>
    </div>
  );
}
