'use client';

import { useState } from 'react';
// Import with support for both default and named exports
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ImageUpload from '@/components/ui/ImageUpload';
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/Card';

export default function DesignSystem() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Design System</h1>
      
      {/* Typography */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Typography</CardTitle>
          <CardDescription>Text styles and headings used throughout the application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <h1 className="text-4xl font-bold">Heading 1</h1>
          <h2 className="text-3xl font-bold">Heading 2</h2>
          <h3 className="text-2xl font-bold">Heading 3</h3>
          <h4 className="text-xl font-bold">Heading 4</h4>
          <p className="text-base">Body text</p>
          <p className="text-sm">Small text</p>
        </CardContent>
      </Card>

      {/* Colors */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Colors</CardTitle>
          <CardDescription>Primary color palette and semantic colors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="h-20 bg-primary-500 rounded-md mb-2"></div>
              <p className="text-sm">Primary 500</p>
            </div>
            <div>
              <div className="h-20 bg-primary-600 rounded-md mb-2"></div>
              <p className="text-sm">Primary 600</p>
            </div>
            <div>
              <div className="h-20 bg-success-500 rounded-md mb-2"></div>
              <p className="text-sm">Success 500</p>
            </div>
            <div>
              <div className="h-20 bg-error-500 rounded-md mb-2"></div>
              <p className="text-sm">Error 500</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>Button variants and sizes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button>Default Button</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </CardContent>
      </Card>

      {/* Inputs */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Form Elements</CardTitle>
          <CardDescription>Input fields and form controls</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Default Input"
            placeholder="Enter some text"
          />
          <Input
            label="Email Input"
            type="email"
            placeholder="Enter your email"
          />
          <Input
            label="Error Input"
            error="This field is required"
            placeholder="Enter some text"
          />
          <Input
            label="Disabled Input"
            disabled
            placeholder="This input is disabled"
          />
        </CardContent>
      </Card>

      {/* Image Upload */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Image Upload</CardTitle>
          <CardDescription>Upload and preview images</CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUpload
            selectedFile={uploadedImage}
            onFileSelect={setUploadedImage}
            maxSizeMB={5}
          />
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">
            {uploadedImage
              ? `Selected file: ${uploadedImage.name}`
              : 'No file selected'}
          </p>
        </CardFooter>
      </Card>

      {/* Cards */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Card Variants</CardTitle>
          <CardDescription>Different card styles and layouts</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="default">
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>With shadow</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is a default card with shadow.</p>
            </CardContent>
          </Card>
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Bordered Card</CardTitle>
              <CardDescription>With border</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is a bordered card without shadow.</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
