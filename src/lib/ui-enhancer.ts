/**
 * UI Enhancer - Helper functions to apply enhanced UI styling
 * 
 * This file provides utility functions to help apply the enhanced styling
 * defined in ui-enhancements.css to components without modifying their core structure.
 */

import { cn } from './utils';

// Card enhancements
export const enhancedCard = (className?: string) => 
  cn('enhanced-card', className);

export const enhancedCardHeader = (className?: string) =>
  cn('enhanced-card-header', className);
  
export const enhancedCardContent = (className?: string) =>
  cn('enhanced-card-content', className);
  
export const enhancedCardFooter = (className?: string) =>
  cn('enhanced-card-footer', className);

// Button enhancements
export const enhancedButton = (variant: 'primary' | 'secondary' = 'primary', className?: string) =>
  cn('btn-enhanced', variant === 'primary' ? 'btn-primary-enhanced' : 'btn-secondary-enhanced', className);

// Form control enhancements
export const enhancedInput = (className?: string) =>
  cn('input-enhanced', className);
  
export const enhancedInputLabel = (className?: string) =>
  cn('input-label-enhanced', className);

// Image upload enhancements
export const enhancedImageUpload = (isDragging: boolean = false, className?: string) =>
  cn('image-upload-enhanced', isDragging && 'dragging', className);

// Loading spinner
export const enhancedSpinner = (className?: string) =>
  cn('spinner-enhanced', className);

// Item card styling
export const enhancedItemCard = (className?: string) =>
  cn('item-card', className);
  
export const enhancedItemCardImage = (className?: string) =>
  cn('item-card-img', className);
  
export const enhancedItemCardBody = (className?: string) =>
  cn('item-card-body', className);

export const enhancedItemCardPoints = (className?: string) =>
  cn('item-card-points', className);

// Layout improvements
export const enhancedPageContainer = (className?: string) =>
  cn('page-container', className);
  
export const enhancedSectionHeader = (className?: string) =>
  cn('section-header', className);
  
export const enhancedSectionTitle = (className?: string) =>
  cn('section-title', className);

// Status badges
export const enhancedStatusBadge = (status: 'available' | 'claimed' | 'archived', className?: string) =>
  cn('status-badge', {
    'status-available': status === 'available',
    'status-claimed': status === 'claimed',
    'status-archived': status === 'archived',
  }, className);

// Toast notifications
export const enhancedToastContainer = (className?: string) =>
  cn('toast-container', className);
  
export const enhancedToast = (type: 'success' | 'error', className?: string) =>
  cn('toast', {
    'toast-success': type === 'success',
    'toast-error': type === 'error',
  }, className);
