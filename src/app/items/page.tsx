'use client';

import { useState } from 'react';
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
  title: string;
  description: string;
  imageUrl: string;
  price: number;
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    imageUrl: '',
    price: '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically upload the image first and get a URL
    // Then create the item with the image URL
    const item: Item = {
      id: Date.now().toString(),
      title: newItem.title,
      description: newItem.description,
      imageUrl: newItem.imageUrl,
      price: parseFloat(newItem.price),
    };

    setItems([...items, item]);
    setNewItem({
      title: '',
      description: '',
      imageUrl: '',
      price: '',
    });
    setSelectedImage(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-4xl">Welcome, testadmin!</CardTitle>
          <CardDescription>
            Available Points: <span className="font-semibold">1000</span>
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Item</CardTitle>
          <CardDescription>Create a new item to share with others</CardDescription>
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
              selectedFile={selectedImage}
              onFileSelect={(file) => {
                setSelectedImage(file);
                setNewItem({ ...newItem, imageUrl: file ? URL.createObjectURL(file) : '' });
              }}
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

      <Card>
        <CardHeader>
          <CardTitle>Your Items</CardTitle>
          <CardDescription>Manage your created items</CardDescription>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No items added yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
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
                  <CardFooter>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="ml-2"
                      onClick={() => {
                        setItems(items.filter((i) => i.id !== item.id));
                      }}
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
