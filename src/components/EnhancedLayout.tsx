'use client';

import React from 'react';
import Link from 'next/link';
import '@/app/ui-enhancements.css';
import {
  enhancedPageContainer,
  enhancedCard,
  enhancedCardHeader,
  enhancedCardContent,
  enhancedCardFooter,
  enhancedButton
} from '@/lib/ui-enhancer';
import { useAuth } from '@/lib/auth/AuthContext';

interface EnhancedLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showNavigation?: boolean;
}

/**
 * A wrapper component that applies enhanced UI styling to any content
 * without modifying the existing components or structure.
 */
export default function EnhancedLayout({
  children,
  title,
  description,
  showNavigation = true
}: EnhancedLayoutProps) {
  const { user } = useAuth();

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Distributions', href: '/distributions' },
    { label: 'Items', href: '/items' },
    { label: 'Design System', href: '/design-system' },
    { label: 'UI Examples', href: '/enhanced-example' }
  ];

  return (
    <div className={enhancedPageContainer()}>
      {/* Enhanced Header */}
      <header className="mb-6">
        <div className={enhancedCard('mb-6')}>
          <div className={enhancedCardHeader('flex justify-between items-center')}>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Inheritance Distribution
              </h1>
              {user && (
                <p className="text-sm text-gray-600">
                  Welcome, {user.name} | {user.points} Points Available
                  {user.role === 'admin' && <span className="ml-2 text-blue-600">(Administrator)</span>}
                </p>
              )}
            </div>
            <div>
              <img
                src="/logo.png"
                alt="Logo"
                className="h-10 w-auto"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>
          
          {showNavigation && (
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex overflow-x-auto">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="text-gray-600 hover:text-blue-600 px-4 py-2 text-sm font-medium whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Page Title Section */}
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>}
          {description && <p className="text-gray-600 mt-1">{description}</p>}
          <div className="h-1 w-20 bg-blue-600 mt-2 rounded-full"></div>
        </div>
      )}

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Enhanced Footer */}
      <footer className="mt-12 pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Inheritance Distribution App
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-blue-600">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:text-blue-600">
              Terms of Service
            </Link>
            <Link href="/help" className="text-sm text-gray-500 hover:text-blue-600">
              Help Center
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
