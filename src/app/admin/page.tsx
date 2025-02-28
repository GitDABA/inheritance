'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { User, Distribution } from '@/types';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin' || !user.token) {
      router.push('/');
      return;
    }

    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user?.token) return;

    try {
      const headers = {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      };

      const [usersRes, distributionsRes, analyticsRes] = await Promise.all([
        fetch('/.netlify/functions/admin-users', { headers }),
        fetch('/.netlify/functions/admin-distributions', { headers }),
        fetch('/.netlify/functions/analytics', { headers }),
      ]);

      if (!usersRes.ok || !distributionsRes.ok || !analyticsRes.ok) {
        throw new Error('One or more API requests failed');
      }

      const [usersData, distributionsData, analyticsData] = await Promise.all([
        usersRes.json(),
        distributionsRes.json(),
        analyticsRes.json(),
      ]);

      setUsers(usersData);
      setDistributions(distributionsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Users Overview */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <p className="text-gray-600">Total Users: {users.length}</p>
          {/* Add more user statistics */}
        </div>

        {/* Distributions Overview */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Distributions</h2>
          <p className="text-gray-600">Active Distributions: {
            distributions.filter(d => d.status === 'active').length
          }</p>
          {/* Add more distribution statistics */}
        </div>

        {/* Analytics Overview */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Analytics</h2>
          {analytics && (
            <>
              <p className="text-gray-600">Total Items: {analytics.totalItems}</p>
              {/* Add more analytics data */}
            </>
          )}
        </div>
      </div>

      {/* Detailed Lists */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Users List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Email</th>
                  <th className="text-left py-2">Points</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 5).map(user => (
                  <tr key={user.id}>
                    <td className="py-2">{user.name}</td>
                    <td className="py-2">{user.email}</td>
                    <td className="py-2">{user.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Distributions List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Distributions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Start Date</th>
                </tr>
              </thead>
              <tbody>
                {distributions.slice(0, 5).map(dist => (
                  <tr key={dist.id}>
                    <td className="py-2">{dist.name}</td>
                    <td className="py-2">{dist.status}</td>
                    <td className="py-2">{new Date(dist.startDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
