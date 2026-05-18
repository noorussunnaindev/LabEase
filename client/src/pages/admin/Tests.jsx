import React, { useState, useEffect } from 'react';
import { testAPI, categoryAPI } from '../../api/index.js';
import toast from 'react-hot-toast';

export default function AdminTests() {
  const [tests, setTests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    testName: '',
    description: '',
    price: '',
    duration: '',
    categoryId: '',
    preparationInstructions: ''
  });

  useEffect(() => {
    fetchTests();
    fetchCategories();
  }, []);

  const fetchTests = async () => {
    try {
      const res = await testAPI.getTests();
      setTests(res.data.data.data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load tests');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getCategories();
      setCategories(res.data.data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load categories');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateTest = async (e) => {
    e.preventDefault();

    if (!formData.testName || !formData.price || !formData.duration || !formData.categoryId) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setCreating(true);
      const res = await testAPI.createTest({
        testName: formData.testName,
        description: formData.description,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        categoryId: parseInt(formData.categoryId),
        preparationInstructions: formData.preparationInstructions
      });

      setTests([res.data.data, ...tests]);
      setFormData({
        testName: '',
        description: '',
        price: '',
        duration: '',
        categoryId: '',
        preparationInstructions: ''
      });
      setShowCreateForm(false);
      toast.success('Test created successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to create test');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTest = async (testId, testName) => {
    if (!window.confirm(`Are you sure you want to delete "${testName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(testId);
      await testAPI.deleteTest(testId);
      setTests(tests.filter(t => t.id !== testId));
      toast.success('Test deleted successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete test');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Medical Tests</h1>
          <p className="text-gray-600 mt-2">Manage medical tests catalog</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          {showCreateForm ? 'Cancel' : '+ Add Test'}
        </button>
      </div>

      {showCreateForm && (
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Create New Test</h2>
          <form onSubmit={handleCreateTest} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Test Name *</label>
                <input
                  type="text"
                  name="testName"
                  value={formData.testName}
                  onChange={handleInputChange}
                  placeholder="e.g., Blood Test"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Category *</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., 50"
                  step="0.01"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Duration (minutes) *</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g., 30"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Test description"
                rows="3"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Preparation Instructions</label>
              <textarea
                name="preparationInstructions"
                value={formData.preparationInstructions}
                onChange={handleInputChange}
                placeholder="Any instructions for test preparation"
                rows="2"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={creating}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
              >
                {creating ? 'Creating...' : 'Create Test'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              <th className="text-left py-3 px-4 font-bold">Name</th>
              <th className="text-left py-3 px-4 font-bold">Category</th>
              <th className="text-left py-3 px-4 font-bold">Price</th>
              <th className="text-left py-3 px-4 font-bold">Duration</th>
              <th className="text-left py-3 px-4 font-bold">Description</th>
              <th className="text-left py-3 px-4 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tests.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No tests found
                </td>
              </tr>
            ) : (
              tests.map((test) => (
                <tr key={test.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{test.testName}</td>
                  <td className="py-3 px-4">{test.category?.name || '-'}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-blue-600">${parseFloat(test.price || 0).toFixed(2)}</span>
                  </td>
                  <td className="py-3 px-4">{test.duration || '-'} mins</td>
                  <td className="py-3 px-4 text-gray-600 truncate">
                    {test.description ? test.description.substring(0, 50) + '...' : '-'}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDeleteTest(test.id, test.testName)}
                      disabled={deleting === test.id}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {deleting === test.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
