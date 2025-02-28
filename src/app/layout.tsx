'use client';

import { Inter } from 'next/font/google';
import { useEffect } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import { AuthProvider } from '@/lib/auth/AuthContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    netlifyIdentity.init();
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
