import { useState } from 'react';
import Image from 'next/image';
import { Item } from '@/types';
import { createItem } from '@/lib/api/items';

interface ItemFormProps {
  distributionId?: string;
  onSuccess?: (item: Item) => void;
  onError?: (error: Error) => void;
}

export default function ItemForm({ distributionId, onSuccess, onError }: ItemFormProps) {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const itemData: Partial<Item> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: formData.get('price') ? Number(formData.get('price')) : undefined,
      imageUrl: imagePreview || undefined,
      distributionId,
    };
    
    try {
      const item = await createItem(itemData);
      e.currentTarget.reset();
      setImagePreview(null);
      onSuccess?.(item);
    } catch (error) {
      console.error('Error submitting item:', error);
      onError?.(error instanceof Error ? error : new Error('Failed to create item'));
    } finally {
      setLoading(false);
    }
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Implement actual image upload to storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title *
        </label>
        <input
          type="text"
          name="title"
          id="title"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>
      
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            name="price"
            id="price"
            min="0"
            step="0.01"
            className="pl-7 block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          Image
        </label>
        <input
          type="file"
          name="image"
          id="image"
          accept="image/*"
          onChange={handleImageUpload}
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-primary-50 file:text-primary-700
            hover:file:bg-primary-100"
        />
        {imagePreview && (
          <div className="mt-2 relative w-32 h-32">
            <Image
              src={imagePreview}
              alt="Preview"
              fill
              className="rounded-lg object-cover"
            />
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Add Item'}
        </button>
      </div>
    </form>
  );
}
