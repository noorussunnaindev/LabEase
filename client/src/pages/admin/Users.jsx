import React, { useState, useEffect } from 'react';
import { userAPI } from '../../api/index.js';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await userAPI.getAllUsers();
      setUsers(res.data.data.data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-gray-600 mt-2">Manage system users</p>
      </div>

      {loading ? <div>Loading...</div> : <div className="card">Users table</div>}
    </div>
  );
}
