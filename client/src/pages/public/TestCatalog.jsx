import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { testAPI, categoryAPI } from '../../api/index.js';
import { FiSearch, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function TestCatalog() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCategoriesAndTests();
  }, [selectedCategory, page]);

  const fetchCategoriesAndTests = async () => {
    try {
      setLoading(true);
      const [catRes, testRes] = await Promise.all([
        categoryAPI.getCategories(),
        testAPI.getTests(page, 10, selectedCategory),
      ]);

      setCategories(catRes.data.data);
      setTests(testRes.data.data.data);
    } catch (error) {
      toast.error('Failed to load tests');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const res = await testAPI.searchTests(searchQuery);
      setTests(res.data.data);
    } catch (error) {
      toast.error('Search failed');
    }
  };

  const handleBookNow = (test) => {
    navigate('/customer/new-booking', { state: { selectedTest: test } });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Medical Tests</h1>
          <p className="text-gray-600 mt-2">Browse and book from our comprehensive range of medical tests</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field flex-1"
            />
            <button type="submit" className="btn-primary">
              <FiSearch size={18} />
            </button>
          </form>
        </div>

        {/* Filters and Tests */}
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="md:col-span-1">
            <div className="card">
              <h3 className="font-bold mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setPage(1);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded ${
                    !selectedCategory ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                  }`}
                >
                  All Tests
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setPage(1);
                    }}
                    className={`block w-full text-left px-4 py-2 rounded ${
                      selectedCategory === cat.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tests Grid */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : tests.length === 0 ? (
              <div className="text-center py-12 text-gray-600">No tests found</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {tests.map((test) => (
                  <div key={test.id} className="card-hover">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{test.testName}</h3>
                        <p className="text-sm text-gray-500">{test.category?.name}</p>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">${test.price}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{test.description}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                      <span>⏱ {test.duration} mins</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleBookNow(test)}
                      className="btn-primary w-full"
                    >
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
