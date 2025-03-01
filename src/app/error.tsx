'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong!</h2>
        <button
          onClick={() => reset()}
          className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
