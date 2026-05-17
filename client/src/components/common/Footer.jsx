import React from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">LE</span>
              </div>
              <span className="font-bold text-white">LabEase</span>
            </div>
            <p className="text-sm text-gray-400">
              Smart Medical Test Booking & Report Management System
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/tests" className="hover:text-blue-400">Tests Catalog</Link></li>
              <li><Link to="/about" className="hover:text-blue-400">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-white mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400">Home Sampling</a></li>
              <li><a href="#" className="hover:text-blue-400">Lab Visit</a></li>
              <li><a href="#" className="hover:text-blue-400">Online Reports</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <FiPhone size={16} />
                <span>1-800-LABEASE</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiMail size={16} />
                <span>info@labease.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiMapPin size={16} />
                <span>Healthcare Hub, USA</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex justify-between items-center text-sm text-gray-400">
            <p>&copy; 2024 LabEase. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
