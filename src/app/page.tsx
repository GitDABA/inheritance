'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';
import LoginForm from '@/components/auth/LoginForm';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/Card';

interface Item {
  id: string;
  created_at: string;
  title: string;
  description: string;
  image_url: string;
  points: number;
  owner_id: string;
  status: 'available' | 'claimed' | 'archived';
}

export default function Home() {
  const { user, loading } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    image_url: '',
    points: 0,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingItems, setIsLoadingItems] = useState(false);

  // Load existing items
  useEffect(() => {
    if (user) {
      loadItems();
    }
  }, [user]);

  const loadItems = async () => {
    if (!user) return;
    
    setIsLoadingItems(true);
    setError(null);
    
    try {
      console.log('Loading items for user:', user.id);
      
      const { data, error: itemsError } = await supabase
        .from('items')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (itemsError) {
        console.error('Supabase error loading items:', itemsError);
        if (itemsError.code === 'PGRST116') {
          // Table doesn't exist, create it
          const { error: createError } = await supabase.rpc('setup_database');
          if (createError) {
            throw createError;
          }
          // Try loading items again
          const { data: retryData, error: retryError } = await supabase
            .from('items')
            .select('*')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false });
          
          if (retryError) throw retryError;
          setItems(retryData || []);
          return;
        }
        throw itemsError;
      }

      console.log('Items loaded successfully:', data);
      setItems(data || []);
    } catch (err) {
      console.error('Error in loadItems:', err);
      setError(err instanceof Error ? err.message : 'Failed to load items. Please ensure the database is set up correctly.');
    } finally {
      setIsLoadingItems(false);
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!user) {
        throw new Error('You must be logged in to create items');
      }

      if (newItem.points <= 0) {
        throw new Error('Points must be greater than 0');
      }

      // First, upload the image if one is selected
      let image_url = '';
      if (selectedImage) {
        const fileExt = selectedImage.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        console.log('Uploading image...', { filePath });
        
        try {
          // Upload directly to the existing bucket instead of checking/creating it
          const { error: uploadError, data: uploadData } = await supabase.storage
            .from('item-images')
            .upload(filePath, selectedImage);

          if (uploadError) {
            console.error('Image upload error:', uploadError);
            throw new Error(`Failed to upload image: ${uploadError.message}`);
          }

          console.log('Image uploaded successfully', { uploadData });

          const { data: { publicUrl } } = supabase.storage
            .from('item-images')
            .getPublicUrl(filePath);

          image_url = publicUrl;
          console.log('Generated public URL:', { publicUrl });
        } catch (error) {
          console.error('Image upload process failed:', error);
          // Continue without the image if upload fails
          alert('Image upload failed. Continuing without an image.');
        }
      }

      console.log('Creating item...', {
        title: newItem.title,
        description: newItem.description,
        image_url,
        points: newItem.points,
        owner_id: user.id,
      });

      // Create the item
      const { data: item, error: insertError } = await supabase
        .from('items')
        .insert({
          title: newItem.title,
          description: newItem.description,
          image_url,
          points: newItem.points,
          owner_id: user.id,
          status: 'available',
        })
        .select()
        .single();

      if (insertError) {
        console.error('Item creation error:', insertError);
        throw new Error(`Failed to create item: ${insertError.message}`);
      }

      console.log('Item created successfully:', item);

      // Refresh items list
      await loadItems();

      // Reset form
      setNewItem({
        title: '',
        description: '',
        image_url: '',
        points: 0,
      });
      setSelectedImage(null);
    } catch (err) {
      console.error('Error in handleCreateItem:', err);
      setError(err instanceof Error ? err.message : 'Failed to create item');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user.name}!</CardTitle>
          <CardDescription>
            Available Points: <span className="font-semibold">{user.points}</span>
            {user.role === 'admin' && <span className="ml-2 text-blue-500">(Admin)</span>}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Item</CardTitle>
          <CardDescription>Create a new item to share with others</CardDescription>
        </CardHeader>
        <form onSubmit={handleCreateItem}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <Input
              label="Title"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              placeholder="Enter item title"
              required
              disabled={isSubmitting}
            />
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="input-base min-h-[100px]"
                placeholder="Enter item description"
                required
                disabled={isSubmitting}
              />
            </div>

            <Input
              type="number"
              label="Points"
              value={newItem.points || ''}
              onChange={(e) => setNewItem({ ...newItem, points: parseInt(e.target.value) || 0 })}
              placeholder="Enter points value"
              required
              min="1"
              disabled={isSubmitting}
            />
            
            <ImageUpload
              selectedFile={selectedImage}
              onFileSelect={setSelectedImage}
              className="w-full"
              maxSizeMB={5}
              disabled={isSubmitting}
            />
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Item'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Items</CardTitle>
          <CardDescription>Items you've created</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingItems ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-500 p-4 rounded-md text-sm">
              {error}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No items yet. Create your first item above!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                  <p className="text-sm font-medium mt-2">Points: {item.points}</p>
                  <p className="text-xs text-gray-400 mt-1">Status: {item.status}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
