'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Distribution, Item } from '@/types';
import { getDistribution } from '@/lib/api/distributions';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ImageUpload } from '@/components/ui/ImageUpload';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/Card';

export default function DistributionPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [distribution, setDistribution] = useState<Distribution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    imageUrl: '',
    price: '',
  });

  const isAdmin = user?.role === 'admin';
  const isActive = distribution?.status === 'active';
  const items = distribution?.items || [];

  useEffect(() => {
    const fetchDistribution = async () => {
      try {
        const data = await getDistribution(params.id as string);
        setDistribution(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchDistribution();
  }, [params.id]);

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation for creating item
    console.log('Creating item:', newItem);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="mx-auto max-w-2xl mt-8">
        <CardHeader>
          <CardTitle className="text-error-600">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-error-600">{error.message}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push('/distributions')}>
            Back to Distributions
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{distribution?.name}</CardTitle>
          <CardDescription>
            Status: <span className="capitalize">{distribution?.status}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{distribution?.description}</p>
        </CardContent>
      </Card>

      {isAdmin && isActive && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Item</CardTitle>
            <CardDescription>Create a new item for this distribution</CardDescription>
          </CardHeader>
          <form onSubmit={handleCreateItem}>
            <CardContent className="space-y-4">
              <Input
                label="Title"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                placeholder="Enter item title"
                required
              />
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  className="w-full rounded-md border border-input px-3 py-2 text-sm"
                  rows={4}
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Enter item description"
                  required
                />
              </div>

              <ImageUpload
                onChange={(file) => setNewItem({ ...newItem, imageUrl: file ? URL.createObjectURL(file) : '' })}
                value={newItem.imageUrl}
                maxSizeMB={5}
              />

              <Input
                label="Price"
                type="number"
                min="0"
                step="0.01"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                placeholder="Enter item price"
                required
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" size="lg">
                Create Item
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Distribution Items</CardTitle>
          <CardDescription>Items available in this distribution</CardDescription>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No items added yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item: Item) => (
                <Card key={item.id} variant="bordered">
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>Price: ${item.price}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                    )}
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </CardContent>
                  {isAdmin && (
                    <CardFooter>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="ml-2"
                      >
                        Delete
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
