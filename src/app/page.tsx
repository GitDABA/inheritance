'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import ItemForm from '@/components/items/ItemForm';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
          <div className="text-lg">
            Available Points: <span className="font-semibold">{user.points}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Add New Item</h2>
            <ItemForm
              onSubmit={async (itemData) => {
                // TODO: Implement item submission
                console.log('Submitting item:', itemData);
              }}
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Your Items</h2>
            {/* TODO: Add ItemList component */}
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-500">No items added yet.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
