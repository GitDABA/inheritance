'use client';

import './globals.css';
import './ui-enhancements.css'; // Import enhanced UI styles
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth/AuthContext';

const inter = Inter({ subsets: ['latin'] });

// This metadata will be handled client-side since we're using 'use client'
// For server components, this would be exported as a metadata object
const siteMetadata = {
  title: 'Fair Item Distribution App',
  description: 'Equitably allocate desired items among multiple users with our fairness-first approach',
  keywords: 'fair distribution, item sharing, inheritance, family items, priority system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <head>
        <title>{siteMetadata.title}</title>
        <meta name="description" content={siteMetadata.description} />
        <meta name="keywords" content={siteMetadata.keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} min-h-full`}>
        <AuthProvider>
          <div className="min-h-screen">
            <main className="container mx-auto px-4 py-8 animate-fade-in">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
