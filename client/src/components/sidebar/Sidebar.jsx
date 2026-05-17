import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiCalendar, FiFileText, FiCreditCard, FiUsers, FiSettings, FiBarChart2 } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Sidebar({ isOpen, userType }) {
  const location = useLocation();
  const { user } = useAuth();

  const getMenuItems = () => {
    switch (userType) {
      case 'customer':
        return [
          { id: 'customer-dashboard', icon: FiHome, label: 'Dashboard', path: '/customer/dashboard' },
          { id: 'customer-bookings', icon: FiCalendar, label: 'My Bookings', path: '/customer/bookings' },
          { id: 'customer-reports', icon: FiFileText, label: 'Reports', path: '/customer/reports' },
          { id: 'customer-payments', icon: FiCreditCard, label: 'Payments', path: '/customer/dashboard' },
          { id: 'customer-settings', icon: FiSettings, label: 'Settings', path: '/customer/dashboard' },
        ];
      case 'staff':
        return [
          { id: 'staff-dashboard', icon: FiHome, label: 'Dashboard', path: '/staff/dashboard' },
          { id: 'staff-bookings', icon: FiCalendar, label: 'Bookings', path: '/staff/bookings' },
          { id: 'staff-reports', icon: FiFileText, label: 'Reports', path: '/staff/bookings' },
        ];
      case 'admin':
        return [
          { id: 'admin-dashboard', icon: FiHome, label: 'Dashboard', path: '/admin/dashboard' },
          { id: 'admin-bookings', icon: FiCalendar, label: 'Bookings', path: '/admin/bookings' },
          { id: 'admin-tests', icon: FiFileText, label: 'Tests', path: '/admin/tests' },
          { id: 'admin-users', icon: FiUsers, label: 'Users', path: '/admin/users' },
          { id: 'admin-analytics', icon: FiBarChart2, label: 'Analytics', path: '/admin/dashboard' },
        ];
      default:
        return [];
    }
  };

  const items = getMenuItems();

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-64px)] bg-white border-r border-gray-200 transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <nav className="space-y-2 p-4">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              title={!isOpen ? item.label : ''}
            >
              <Icon size={20} className="flex-shrink-0" />
              {isOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
