'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Distribution, Item } from '@/types';
import { getDistribution } from '@/lib/api/distributions';
import { useAuth } from '@/lib/auth/AuthContext';
import ItemForm from '@/components/items/ItemForm';

export default function DistributionPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [distribution, setDistribution] = useState<Distribution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showItemForm, setShowItemForm] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isActive = distribution?.status === 'active';
  const items = distribution?.items || [];

  useEffect(() => {
    if (!params.id) {
      router.push('/distributions');
      return;
    }
    loadDistribution();
  }, [params.id]);

  const loadDistribution = async () => {
    try {
      const data = await getDistribution(params.id as string);
      setDistribution({
        ...data,
        items: data.items || [], // Ensure items is always an array
      });
      setError(null);
    } catch (err) {
      console.error('Error loading distribution:', err);
      setError(err instanceof Error ? err : new Error('Failed to load distribution'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !distribution) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-600">{error?.message || 'Distribution not found'}</p>
          <button
            onClick={() => router.push('/distributions')}
            className="mt-4 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Back to Distributions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.push('/distributions')}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            ← Back to Distributions
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{distribution.name}</h1>
              <div className="flex space-x-4 text-sm text-gray-500">
                <p>Start: {new Date(distribution.startDate).toLocaleDateString()}</p>
                <p>End: {new Date(distribution.endDate).toLocaleDateString()}</p>
                <p className="capitalize">Status: {distribution.status}</p>
                {distribution.totalItems !== undefined && (
                  <p>Total Items: {distribution.totalItems}</p>
                )}
                {distribution.participationRate !== undefined && (
                  <p>Participation: {distribution.participationRate}%</p>
                )}
              </div>
            </div>

            {isAdmin && (
              <button
                onClick={() => router.push(`/distributions/${distribution.id}/edit`)}
                className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Edit Distribution
              </button>
            )}
          </div>
        </div>

        {(isAdmin || isActive) && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Items ({items.length})</h2>
              {isAdmin && (
                <button
                  onClick={() => setShowItemForm(!showItemForm)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {showItemForm ? 'Hide Form' : 'Add Item'}
                </button>
              )}
            </div>

            {showItemForm && (
              <div className="mb-8">
                <ItemForm
                  distributionId={distribution.id}
                  onSuccess={() => {
                    setShowItemForm(false);
                    loadDistribution();
                  }}
                  onError={(error) => {
                    alert(error.message);
                  }}
                />
              </div>
            )}

            {items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item: Item) => (
                  <div key={item.id} className="bg-white shadow rounded-lg p-6">
                    {item.imageUrl && (
                      <div className="mb-4 aspect-w-16 aspect-h-9">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="object-cover rounded-md"
                        />
                      </div>
                    )}
                    <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                    {item.description && (
                      <p className="text-gray-500 text-sm mb-2">{item.description}</p>
                    )}
                    {item.price && (
                      <p className="text-gray-700 font-medium">${item.price.toFixed(2)}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 p-8">No items have been added yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
