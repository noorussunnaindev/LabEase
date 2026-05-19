import React, { useState, useEffect } from 'react';
import { testAPI } from '../../api/index.js';
import toast from 'react-hot-toast';

export default function AdminTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
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

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Medical Tests</h1>
        <p className="text-gray-600 mt-2">Manage medical tests catalog</p>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              <th className="text-left py-3 px-4 font-bold">Name</th>
              <th className="text-left py-3 px-4 font-bold">Category</th>
              <th className="text-left py-3 px-4 font-bold">Price</th>
              <th className="text-left py-3 px-4 font-bold">Duration</th>
              <th className="text-left py-3 px-4 font-bold">Description</th>
            </tr>
          </thead>
          <tbody>
            {tests.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
