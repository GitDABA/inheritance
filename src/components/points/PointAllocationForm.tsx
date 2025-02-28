'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { Item } from '@/types';

interface PointAllocationFormProps {
  item: Item;
  distributionId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export default function PointAllocationForm({
  item,
  distributionId,
  onSuccess,
  onError
}: PointAllocationFormProps) {
  const { user } = useAuth();
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const availablePoints = user ? user.points - user.pointsSpent : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/.netlify/functions/point-allocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          itemId: item.id,
          points,
          distributionId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to allocate points');
      }

      setPoints(0);
      onSuccess?.();
    } catch (error) {
      console.error('Error allocating points:', error);
      onError?.(error instanceof Error ? error : new Error('Failed to allocate points'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="points" className="block text-sm font-medium text-gray-700">
          Allocate Points
        </label>
        <div className="mt-1">
          <input
            type="number"
            name="points"
            id="points"
            min="0"
            max={availablePoints}
            value={points}
            onChange={(e) => setPoints(Math.min(Number(e.target.value), availablePoints))}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Available points: {availablePoints}
        </p>
      </div>

      <button
        type="submit"
        disabled={loading || points <= 0 || points > availablePoints}
        className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
      >
        {loading ? 'Allocating...' : 'Allocate Points'}
      </button>
    </form>
  );
}
