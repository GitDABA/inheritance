export type Role = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  points: number;
  pointsSpent: number;
  isAdmin: boolean;
  token?: {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    expires_at: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  distributionId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  currentBid?: number;
  highestBidder?: string;
}

export interface Distribution {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'completed';
  createdBy: string;
  items?: Item[];
  totalItems?: number;
  participationRate?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ItemAllocation {
  id: string;
  itemId: string;
  userId: string;
  distributionId: string;
  pointsAllocated: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// Business Rules Configuration
export const BUSINESS_RULES = {
  // Points System
  INITIAL_POINTS_PER_USER: 1000,
  MIN_POINTS_PER_ITEM: 10,
  
  // Time Windows
  DEFAULT_DISTRIBUTION_DURATION_DAYS: 7,
  MINIMUM_DISTRIBUTION_DURATION_HOURS: 24,
  
  // Allocation Rules
  MAX_ITEMS_PER_USER: 50, // Soft limit, can be overridden by admin
  MIN_POINTS_DIFFERENCE_FOR_TIEBREAK: 50, // Points difference needed to avoid tie
  
  // Tiebreaker Rules
  TIEBREAKER_FACTORS: {
    TOTAL_POINTS_WEIGHT: 0.4, // 40% weight for total points remaining
    TIME_WEIGHT: 0.3, // 30% weight for submission time
    ITEMS_WEIGHT: 0.3, // 30% weight for number of items requested
  },
  
  // Notifications
  REMINDER_HOURS_BEFORE_END: [48, 24, 12, 6], // Hours before end to send reminders
};
