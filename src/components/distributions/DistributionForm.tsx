import { useState } from 'react';
import { Distribution } from '@/types';
import { createDistribution, updateDistribution } from '@/lib/api/distributions';

interface DistributionFormProps {
  distribution?: Distribution;
  onSuccess?: (distribution: Distribution) => void;
  onError?: (error: Error) => void;
}

export default function DistributionForm({ distribution, onSuccess, onError }: DistributionFormProps) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!distribution;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      startDate: new Date(formData.get('startDate') as string).toISOString(),
      endDate: new Date(formData.get('endDate') as string).toISOString(),
      status: (formData.get('status') as Distribution['status']) || 'draft'
    };

    try {
      const result = isEditing
        ? await updateDistribution(distribution.id, data)
        : await createDistribution(data);
      
      onSuccess?.(result);
      if (!isEditing) {
        e.currentTarget.reset();
      }
    } catch (error) {
      console.error('Error submitting distribution:', error);
      onError?.(error instanceof Error ? error : new Error('Failed to save distribution'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Distribution Name *
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          defaultValue={distribution?.name}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
          Start Date *
        </label>
        <input
          type="datetime-local"
          name="startDate"
          id="startDate"
          required
          defaultValue={distribution?.startDate?.split('Z')[0]}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
          End Date *
        </label>
        <input
          type="datetime-local"
          name="endDate"
          id="endDate"
          required
          defaultValue={distribution?.endDate?.split('Z')[0]}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          name="status"
          id="status"
          defaultValue={distribution?.status || 'draft'}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Distribution' : 'Create Distribution'}
        </button>
      </div>
    </form>
  );
}
