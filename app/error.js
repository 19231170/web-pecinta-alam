'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
        <p className="text-gray-700 mb-4">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>
        <div className="bg-gray-100 p-4 rounded my-4">
          <p className="text-sm text-gray-800 font-mono">
            {error?.message || 'Unknown error occurred'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <Link href="/" className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors text-center">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
