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
      setTests(res.data.data.data);
    } catch (error) {
      toast.error('Failed to load tests');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Medical Tests</h1>
        <p className="text-gray-600 mt-2">Manage medical tests catalog</p>
      </div>

      {loading ? <div>Loading...</div> : <div className="card">Tests table</div>}
    </div>
  );
}
