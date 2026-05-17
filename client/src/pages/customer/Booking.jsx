import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { testAPI, bookingAPI, paymentAPI } from '../../api/index.js';
import toast from 'react-hot-toast';

export default function Booking() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    testIds: [],
    bookingType: 'LAB_VISIT',
    appointmentDate: '',
    appointmentTime: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create booking
      const bookingRes = await bookingAPI.createBooking(formData);
      const booking = bookingRes.data.data;

      // Create payment session
      const paymentRes = await paymentAPI.createSession(booking.id);
      const { sessionId } = paymentRes.data.data;

      // Redirect to Stripe checkout
      window.location.href = `${process.env.VITE_STRIPE_REDIRECT_URL}?session_id=${sessionId}`;
    } catch (error) {
      toast.error('Failed to create booking');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Book a Test</h1>

      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Step indicators */}
        <div className="flex gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full ${
                s <= step ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Select Booking Type</h2>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="bookingType"
                  value="LAB_VISIT"
                  checked={formData.bookingType === 'LAB_VISIT'}
                  onChange={(e) => setFormData({ ...formData, bookingType: e.target.value })}
                />
                <div>
                  <p className="font-medium">Lab Visit</p>
                  <p className="text-sm text-gray-600">Visit our lab at your preferred time</p>
                </div>
              </label>
              <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="bookingType"
                  value="HOME_SAMPLING"
                  checked={formData.bookingType === 'HOME_SAMPLING'}
                  onChange={(e) => setFormData({ ...formData, bookingType: e.target.value })}
                />
                <div>
                  <p className="font-medium">Home Sampling</p>
                  <p className="text-sm text-gray-600">Our phlebotomist will visit your home</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Select Date & Time</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Time</label>
                <input
                  type="time"
                  value={formData.appointmentTime}
                  onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Address Details</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Pincode</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4 justify-between">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="btn-secondary"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="btn-primary ml-auto"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="btn-primary ml-auto"
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
