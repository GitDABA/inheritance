'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface ImageUploadProps {
  className?: string;
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
  maxSizeMB?: number;
}

export function ImageUpload({
  className,
  selectedFile,
  onFileSelect,
  disabled,
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      setError(null);

      if (!file) {
        setPreview(null);
        onFileSelect(null);
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File size must be less than ${maxSizeMB}MB`);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      onFileSelect(file);
    },
    [onFileSelect, maxSizeMB]
  );

  const handleRemove = useCallback(() => {
    setPreview(null);
    onFileSelect(null);
    setError(null);
  }, [onFileSelect]);

  return (
    <div className={cn('space-y-4', className)}>
      <div
        className={cn(
          'flex flex-col items-center justify-center w-full p-6',
          'border-2 border-dashed rounded-lg',
          'transition-colors duration-200',
          disabled
            ? 'bg-gray-50 border-gray-200'
            : 'bg-white border-gray-300 hover:border-blue-500',
          'cursor-pointer'
        )}
      >
        {selectedFile ? (
          <div className="relative w-full max-w-md">
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              className="w-full h-auto rounded-lg shadow-md"
            />
            <Button
              type="button"
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white"
              onClick={handleRemove}
              disabled={disabled}
            >
              Remove
            </Button>
          </div>
        ) : (
          <label className="w-full cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
              disabled={disabled}
            />
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and
                drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to {maxSizeMB}MB
              </p>
            </div>
          </label>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}

export default ImageUpload;
