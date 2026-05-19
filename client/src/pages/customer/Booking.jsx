import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { testAPI, bookingAPI, categoryAPI, paymentAPI } from '../../api/index.js';
import toast from 'react-hot-toast';

export default function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tests, setTests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTests, setSelectedTests] = useState([]);
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

  useEffect(() => {
    fetchCategoriesAndTests();
    // Pre-select test if passed from TestCatalog
    if (location.state?.selectedTest) {
      const selectedTest = location.state.selectedTest;
      setSelectedTests([selectedTest]);
      // Set category if test has one
      if (selectedTest.categoryId) {
        setSelectedCategory(selectedTest.categoryId);
      }
    }
  }, [location.state?.selectedTest, selectedCategory]);

  const fetchCategoriesAndTests = async () => {
    try {
      const [catRes, testRes] = await Promise.all([
        categoryAPI.getCategories(),
        testAPI.getTests(1, 100, selectedCategory),
      ]);
      setCategories(catRes.data.data);
      setTests(testRes.data.data.data);
    } catch (error) {
      toast.error('Failed to load tests');
    }
  };

  const handleTestToggle = (test) => {
    const isSelected = selectedTests.some(t => t.id === test.id);
    if (isSelected) {
      setSelectedTests(selectedTests.filter(t => t.id !== test.id));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const getTotalPrice = () => {
    return selectedTests.reduce((sum, test) => sum + parseFloat(test.price || 0), 0).toFixed(2);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (selectedTests.length === 0) {
        toast.error('Please select at least one test');
        return;
      }
      setFormData({
        ...formData,
        testIds: selectedTests.map(t => t.id)
      });
    }
    setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create booking
      const bookingData = {
        ...formData,
        testIds: selectedTests.map(t => t.id)
      };
      const bookingRes = await bookingAPI.createBooking(bookingData);
      const booking = bookingRes.data.data;

      toast.success('Booking created successfully');
      navigate(`/customer/bookings/${booking.id}`);
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
          {[1, 2, 3, 4].map((s) => (
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
            <h2 className="text-lg font-bold">Select Tests</h2>
            
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium mb-3">Categories</label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className={`block w-full text-left px-4 py-2 rounded border-2 ${
                    !selectedCategory ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  All Tests
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`block w-full text-left px-4 py-2 rounded border-2 ${
                      selectedCategory === cat.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tests List */}
            <div>
              <label className="block text-sm font-medium mb-3">Available Tests</label>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {tests.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No tests available</p>
                ) : (
                  tests.map((test) => (
                    <label
                      key={test.id}
                      className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTests.some(t => t.id === test.id)}
                        onChange={() => handleTestToggle(test)}
                        className="mt-1 w-5 h-5"
                      />
                      <div className="ml-4 flex-1">
                        <p className="font-medium">{test.testName}</p>
                        <p className="text-sm text-gray-600">{test.description}</p>
                        <p className="text-xs text-gray-500 mt-1">⏱ {test.duration} mins</p>
                      </div>
                      <span className="ml-4 text-lg font-bold text-blue-600">${parseFloat(test.price || 0).toFixed(2)}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Selected Tests Summary */}
            {selectedTests.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-medium mb-2">Selected Tests ({selectedTests.length})</p>
                <div className="space-y-1">
                  {selectedTests.map((test) => (
                    <div key={test.id} className="flex justify-between text-sm">
                      <span>{test.testName}</span>
                      <span>${parseFloat(test.price || 0).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-blue-200 mt-2 pt-2 font-bold text-lg">
                  Total: ${getTotalPrice()}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
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

        {step === 3 && (
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

        {step === 4 && (
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
          {step < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
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
              {loading ? 'Processing...' : 'Create Booking'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
