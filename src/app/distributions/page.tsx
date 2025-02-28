'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import DistributionList from '@/components/distributions/DistributionList';
import DistributionForm from '@/components/distributions/DistributionForm';

export default function DistributionsPage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Distributions</h1>
          {isAdmin && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {showForm ? 'Hide Form' : 'Create Distribution'}
            </button>
          )}
        </div>

        {showForm && (
          <div className="mb-8">
            <DistributionForm
              onSuccess={() => {
                setShowForm(false);
                // Force DistributionList to reload
                window.location.reload();
              }}
              onError={(error) => {
                alert(error.message);
              }}
            />
          </div>
        )}

        <DistributionList />
      </div>
    </div>
  );
}
