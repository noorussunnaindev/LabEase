import React, { useState, useEffect } from 'react';
import { categoryAPI, testAPI } from '../api/index.js';
import { formatPKR } from '../utils/currency.js';
import toast from 'react-hot-toast';

export default function TestSelectionStep({
  selectedTestIds = [],
  onTestsSelected = () => {},
}) {
  const [categories, setCategories] = useState([]);
  const [tests, setTests] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTests, setSelectedTests] = useState(selectedTestIds || []);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchTests(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryAPI.getCategories();
      setCategories(res.data.data);
      if (res.data.data.length > 0) {
        setSelectedCategory(res.data.data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Failed to load test categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchTests = async (categoryId) => {
    try {
      setLoading(true);
      const res = await testAPI.getTests(1, 100, categoryId);
      setTests(res.data.data.data || res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch tests:', error);
      toast.error('Failed to load tests');
    } finally {
      setLoading(false);
    }
  };

  const toggleTest = (testId) => {
    const newSelected = selectedTests.includes(testId)
      ? selectedTests.filter(id => id !== testId)
      : [...selectedTests, testId];
    
    setSelectedTests(newSelected);
    onTestsSelected(newSelected);
  };

  const selectAll = () => {
    const allTestIds = tests.map(t => t.id);
    setSelectedTests(allTestIds);
    onTestsSelected(allTestIds);
  };

  const clearAll = () => {
    setSelectedTests([]);
    onTestsSelected([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="text-xl">🔬</span>
          Select Medical Tests
        </h2>
        <p className="text-gray-600 mb-4">
          Choose from our comprehensive range of medical tests. You can select multiple tests.
        </p>
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium mb-3">Test Categories</label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-3 rounded-lg border-2 transition text-center font-medium text-sm ${
                selectedCategory === category.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="text-lg">{category.icon || '📋'}</span>
              <p className="mt-1 truncate">{category.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Tests in Selected Category */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium">
            Available Tests ({selectedTests.length} selected)
          </label>
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="text-xs px-3 py-1 text-blue-600 hover:bg-blue-50 rounded border border-blue-200"
            >
              Select All
            </button>
            <button
              onClick={clearAll}
              className="text-xs px-3 py-1 text-gray-600 hover:bg-gray-50 rounded border border-gray-200"
            >
              Clear All
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin">⟳</div>
          </div>
        ) : tests && tests.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {tests.map((test) => (
              <label
                key={test.id}
                className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
                  selectedTests.includes(test.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedTests.includes(test.id)}
                  onChange={() => toggleTest(test.id)}
                  className="mt-1 w-4 h-4"
                />
                <div className="flex-1 ml-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{test.testName}</p>
                      <p className="text-sm text-gray-600 mt-1">{test.description}</p>
                    </div>
                    <span className="ml-4 font-bold text-blue-600 whitespace-nowrap">
                      {formatPKR(test.price)}
                    </span>
                  </div>
                  {test.preparationInstructions && (
                    <p className="text-xs text-gray-500 mt-2 italic">
                      📝 {test.preparationInstructions}
                    </p>
                  )}
                </div>
              </label>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            <p>No tests available in this category</p>
          </div>
        )}
      </div>

      {/* Summary Card */}
      {selectedTests.length > 0 && (
        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
          <p className="text-sm text-green-800">
            <strong>✓ {selectedTests.length} test{selectedTests.length !== 1 ? 's' : ''} selected</strong>
          </p>
          <p className="text-xs text-green-700 mt-1">
            Total: {formatPKR(
              tests
                .filter(t => selectedTests.includes(t.id))
                .reduce((sum, t) => sum + parseFloat(t.price), 0)
            )}
          </p>
        </div>
      )}

      {selectedTests.length === 0 && (
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
          <p className="text-sm text-yellow-800">
            <strong>⚠ Please select at least one test to proceed</strong>
          </p>
        </div>
      )}
    </div>
  );
}
