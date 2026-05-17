import React from 'react';
import Navbar from '../components/navbar/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
