'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    netlifyIdentity.init();

    netlifyIdentity.on('login', (user) => {
      setUser({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || '',
        isAdmin: user.app_metadata?.roles?.includes('admin') || false,
        points: 1000, // Default points, should be fetched from Supabase
        pointsSpent: 0,
        token: user.token.access_token,
      });
    });

    netlifyIdentity.on('logout', () => {
      setUser(null);
    });

    // Check if user is already logged in
    const currentUser = netlifyIdentity.currentUser();
    if (currentUser) {
      setUser({
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.user_metadata?.full_name || '',
        isAdmin: currentUser.app_metadata?.roles?.includes('admin') || false,
        points: 1000, // Default points, should be fetched from Supabase
        pointsSpent: 0,
        token: currentUser.token.access_token,
      });
    }

    setIsLoading(false);

    return () => {
      netlifyIdentity.off('login');
      netlifyIdentity.off('logout');
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
