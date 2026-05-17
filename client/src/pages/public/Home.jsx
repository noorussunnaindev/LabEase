import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiUsers, FiTrendingUp } from 'react-icons/fi';

export default function Home() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Healthcare Made Simple
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Book medical tests, get instant reports, and manage your health with LabEase - the smart medical test booking platform.
              </p>
              <div className="flex gap-4">
                <Link to="/tests" className="btn-primary flex items-center space-x-2">
                  <span>Browse Tests</span>
                  <FiArrowRight size={18} />
                </Link>
                <Link to="/register" className="btn-secondary">
                  Get Started
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl h-96 flex items-center justify-center text-white">
              <div className="text-center">
                <div className="text-6xl mb-4">🏥</div>
                <p className="text-lg">Professional Medical Tests</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose LabEase?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: FiCheckCircle, title: 'Easy Booking', desc: 'Book tests in just a few clicks' },
            { icon: FiTrendingUp, title: 'Quick Reports', desc: 'Get your test reports instantly' },
            { icon: FiUsers, title: 'Expert Care', desc: 'Professional certified lab staff' },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="card hover:shadow-card-hover transition-shadow">
                <Icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular Tests */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Popular Tests</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Blood Test', price: '$25' },
              { name: 'COVID-19 RT-PCR', price: '$50' },
              { name: 'Thyroid Profile', price: '$80' },
              { name: 'Full Body Checkup', price: '$150' },
            ].map((test, i) => (
              <div key={i} className="card">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4"></div>
                <h3 className="font-bold mb-2">{test.name}</h3>
                <p className="text-blue-600 font-bold mb-4">{test.price}</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Learn More →
                </button>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/tests" className="btn-primary inline-flex items-center space-x-2">
              <span>View All Tests</span>
              <FiArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Test?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of patients who trust LabEase for their medical testing needs
          </p>
          <Link to="/register" className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100">
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
}
