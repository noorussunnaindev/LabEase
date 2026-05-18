import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { FiLock, FiUser, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('customer'); // 'customer', 'staff', 'admin'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  if (isAuthenticated) {
    navigate('/');
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleQuickLogin = (email, password) => {
    setFormData({ email, password });
    handleSubmit(new Event('submit'), email, password);
  };

  const handleSubmit = async (e, emailOverride = null, passwordOverride = null) => {
    e.preventDefault();
    setLoading(true);

    const email = emailOverride || formData.email;
    const password = passwordOverride || formData.password;

    const result = await login(email, password);

    if (result.success) {
      toast.success(`Login successful! Welcome ${result.user.firstName}`);
      // Map role to dashboard path
      const rolePath = result.user.role === 'LAB_STAFF' ? 'staff' : result.user.role.toLowerCase();
      navigate(`/${rolePath}/dashboard`);
    } else {
      toast.error(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold">LE</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">LabEase</h1>
          <p className="text-gray-600 text-sm mt-2">Smart Medical Test Management</p>
        </div>

        {/* Role Tabs */}
        <div className="mb-6 flex gap-2 bg-white rounded-lg p-1 shadow-subtle">
          <button
            onClick={() => setUserType('customer')}
            className={`flex-1 py-2 px-3 rounded-md font-medium text-sm transition-all flex items-center justify-center gap-2 ${
              userType === 'customer'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FiUser size={16} />
            Customer
          </button>
          <button
            onClick={() => setUserType('staff')}
            className={`flex-1 py-2 px-3 rounded-md font-medium text-sm transition-all flex items-center justify-center gap-2 ${
              userType === 'staff'
                ? 'bg-green-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FiLock size={16} />
            Lab Staff
          </button>
          <button
            onClick={() => setUserType('admin')}
            className={`flex-1 py-2 px-3 rounded-md font-medium text-sm transition-all flex items-center justify-center gap-2 ${
              userType === 'admin'
                ? 'bg-red-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FiShield size={16} />
            Admin
          </button>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-card p-8">
          {/* Role Info */}
          {userType === 'customer' && (
            <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Customer:</strong> Book tests, view reports, manage bookings
              </p>
            </div>
          )}
          {userType === 'staff' && (
            <div className="mb-6 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-900">
                <strong>Lab Staff:</strong> Process samples, upload reports, manage tasks
              </p>
            </div>
          )}
          {userType === 'admin' && (
            <div className="mb-6 p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-900">
                <strong>Admin:</strong> Manage users, tests, bookings, and system settings
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-600 mb-3 uppercase">Demo Credentials</p>
            <div className="space-y-2">
              {userType === 'customer' && (
                <button
                  onClick={() => handleQuickLogin('customer@labease.com', 'password123')}
                  disabled={loading}
                  className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  <div className="font-medium text-blue-900">Customer Demo</div>
                  <div className="text-blue-700 text-xs">customer@labease.com / password123</div>
                </button>
              )}
              {userType === 'staff' && (
                <button
                  onClick={() => handleQuickLogin('staff@labease.com', 'staff123')}
                  disabled={loading}
                  className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  <div className="font-medium text-green-900">Lab Staff Demo</div>
                  <div className="text-green-700 text-xs">staff@labease.com / staff123</div>
                </button>
              )}
              {userType === 'admin' && (
                <button
                  onClick={() => handleQuickLogin('admin@labease.com', 'admin123')}
                  disabled={loading}
                  className="w-full text-left p-3 bg-red-50 hover:bg-red-100 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  <div className="font-medium text-red-900">Admin Demo</div>
                  <div className="text-red-700 text-xs">admin@labease.com / admin123</div>
                </button>
              )}
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6">
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
