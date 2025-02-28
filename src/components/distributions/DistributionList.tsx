import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Distribution } from '@/types';
import { getDistributions, deleteDistribution } from '@/lib/api/distributions';
import { useAuth } from '@/lib/auth/AuthContext';

export default function DistributionList() {
  const { user } = useAuth();
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    loadDistributions();
  }, []);

  const loadDistributions = async () => {
    try {
      const data = await getDistributions();
      setDistributions(data);
      setError(null);
    } catch (err) {
      console.error('Error loading distributions:', err);
      setError(err instanceof Error ? err : new Error('Failed to load distributions'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this distribution?')) return;

    try {
      await deleteDistribution(id);
      setDistributions(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error('Error deleting distribution:', err);
      alert('Failed to delete distribution');
    }
  };

  const getStatusColor = (status: Distribution['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error: {error.message}
      </div>
    );
  }

  if (distributions.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        No distributions found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {distributions.map((distribution) => (
          <li key={distribution.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <Link
                  href={`/distributions/${distribution.id}`}
                  className="text-lg font-medium text-primary-600 hover:text-primary-700"
                >
                  {distribution.name}
                </Link>
                <div className="ml-2 flex-shrink-0 flex">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(distribution.status)}`}>
                    {distribution.status}
                  </span>
                </div>
              </div>
              
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    Start: {new Date(distribution.startDate).toLocaleDateString()}
                  </p>
                  <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                    End: {new Date(distribution.endDate).toLocaleDateString()}
                  </p>
                </div>
                
                {isAdmin && (
                  <div className="mt-2 flex items-center text-sm sm:mt-0">
                    <Link
                      href={`/distributions/${distribution.id}/edit`}
                      className="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(distribution.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
