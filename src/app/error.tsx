'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log the error to client-side console
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
          <h2 className="text-2xl font-bold">Something went wrong</h2>
          <p className="mt-2 opacity-90">We encountered an error processing your request.</p>
        </div>
        
        <div className="p-6">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <p className="text-sm text-red-700">
              Error: {error.message || 'An unexpected error occurred'}
            </p>
            {error.digest && (
              <p className="text-xs text-red-500 mt-1">
                Reference ID: {error.digest}
              </p>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => reset()}
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Try again
            </button>
            
            <Link
              href="/"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition text-center focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Go to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
