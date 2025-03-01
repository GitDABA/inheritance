'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import '@/app/ui-enhancements.css';
import {
  enhancedCard, 
  enhancedCardHeader, 
  enhancedCardContent, 
  enhancedCardFooter,
  enhancedButton,
  enhancedInput,
  enhancedInputLabel,
  enhancedImageUpload,
  enhancedSpinner,
  enhancedItemCard,
  enhancedItemCardImage,
  enhancedItemCardBody,
  enhancedItemCardPoints,
  enhancedPageContainer,
  enhancedSectionHeader,
  enhancedSectionTitle,
  enhancedStatusBadge,
  enhancedToastContainer,
  enhancedToast
} from '@/lib/ui-enhancer';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const mockItems = [
  {
    id: '1',
    title: 'Vintage Record Player',
    description: 'A beautifully maintained vintage record player from the 1970s.',
    image_url: 'https://images.unsplash.com/photo-1594759795050-aae018d5060b?auto=format&fit=crop&q=80&w=500&h=350',
    points: 350,
    status: 'available' as const
  },
  {
    id: '2',
    title: 'Antique Desk Lamp',
    description: 'Art deco desk lamp with brass finish, fully functional.',
    image_url: 'https://images.unsplash.com/photo-1580130732478-4e339fb6836f?auto=format&fit=crop&q=80&w=500&h=350',
    points: 150,
    status: 'claimed' as const
  },
  {
    id: '3',
    title: 'Vintage Camera',
    description: 'Working film camera from the 1960s with original leather case.',
    image_url: 'https://images.unsplash.com/photo-1517271710308-aa99f1519490?auto=format&fit=crop&q=80&w=500&h=350',
    points: 250,
    status: 'archived' as const
  }
];

export default function EnhancedExample() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setToastType('success');
      setShowToast(true);
      
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }, 1500);
  };
  
  const triggerErrorToast = () => {
    setToastType('error');
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className={enhancedPageContainer()}>
      <div className={enhancedSectionHeader()}>
        <h1 className={enhancedSectionTitle()}>Enhanced UI Examples</h1>
        <p className="text-gray-600">A showcase of the enhanced UI components and styling</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Card Example */}
        <div className={enhancedCard()}>
          <div className={enhancedCardHeader()}>
            <h2 className="text-xl font-semibold text-gray-900">Enhanced Card</h2>
            <p className="text-sm text-gray-600">With gradient header and styled footer</p>
          </div>
          <div className={enhancedCardContent()}>
            <p>This card demonstrates the enhanced styling with smooth gradients, subtle shadows, and rounded corners.</p>
            
            <div className="mt-4 space-y-2">
              <button className={enhancedButton('primary')}>
                Primary Button
              </button>
              <button className={enhancedButton('secondary')}>
                Secondary Button
              </button>
            </div>
          </div>
          <div className={enhancedCardFooter()}>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Last updated: Today</span>
              <Link href="#" className="text-blue-600 hover:text-blue-800 text-sm">
                See more
              </Link>
            </div>
          </div>
        </div>
        
        {/* Form Example */}
        <div className={enhancedCard()}>
          <div className={enhancedCardHeader()}>
            <h2 className="text-xl font-semibold text-gray-900">Enhanced Form</h2>
            <p className="text-sm text-gray-600">With improved input and button styling</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className={enhancedCardContent()}>
              <div className="space-y-4">
                <div>
                  <label className={enhancedInputLabel()}>Item Name</label>
                  <input 
                    type="text" 
                    className={enhancedInput()} 
                    placeholder="Enter item name"
                  />
                </div>
                
                <div>
                  <label className={enhancedInputLabel()}>Description</label>
                  <textarea 
                    className={enhancedInput()} 
                    placeholder="Enter description"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className={enhancedInputLabel()}>Item Image</label>
                  <div className={enhancedImageUpload()}>
                    <ImageUpload
                      selectedFile={selectedImage}
                      onFileSelect={setSelectedImage}
                      maxSizeMB={5}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={enhancedCardFooter()}>
              <div className="flex justify-end space-x-3">
                <button 
                  type="button" 
                  className={enhancedButton('secondary')}
                  onClick={triggerErrorToast}
                >
                  Show Error
                </button>
                <button 
                  type="submit" 
                  className={enhancedButton('primary')}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <div className={enhancedSpinner('h-4 w-4 mr-2')} />
                      Submitting...
                    </span>
                  ) : 'Submit'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <div className={enhancedSectionHeader()}>
        <h2 className={enhancedSectionTitle()}>Item Cards</h2>
        <p className="text-gray-600">Enhanced item display with hover effects and status badges</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {mockItems.map(item => (
          <div key={item.id} className={enhancedItemCard()}>
            <div className="relative">
              <img 
                src={item.image_url} 
                alt={item.title} 
                className={enhancedItemCardImage()} 
              />
              <div className="absolute top-2 right-2">
                <span className={enhancedItemCardPoints()}>
                  {item.points} Points
                </span>
              </div>
            </div>
            <div className={enhancedItemCardBody()}>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <div className="flex justify-between items-center">
                <button className={enhancedButton('primary', 'text-sm py-1 px-3')}>
                  View Details
                </button>
                <span className={enhancedStatusBadge(item.status)}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Toast container */}
      {showToast && (
        <div className={enhancedToastContainer()}>
          <div className={enhancedToast(toastType)}>
            <div className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                {toastType === 'success' ? (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                )}
              </svg>
              <div>
                {toastType === 'success' ? 'Successfully saved changes!' : 'An error occurred. Please try again.'}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <Link href="/" className={enhancedButton('secondary')}>
          Return to Home
        </Link>
      </div>
    </div>
  );
}
