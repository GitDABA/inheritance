'use client';

import { useEffect } from 'react';
import netlifyIdentity from 'netlify-identity-widget';

export default function LoginForm() {
  useEffect(() => {
    netlifyIdentity.init({
      locale: 'en'
    });
  }, []);

  const handleLogin = () => {
    netlifyIdentity.open('login');
  };

  const handleSignup = () => {
    netlifyIdentity.open('signup');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome to Inheritance</h1>
        <div className="space-y-4">
          <button
            onClick={handleLogin}
            className="w-full px-4 py-2 text-white bg-primary-600 rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Log In
          </button>
          <button
            onClick={handleSignup}
            className="w-full px-4 py-2 text-primary-600 border border-primary-600 rounded hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
