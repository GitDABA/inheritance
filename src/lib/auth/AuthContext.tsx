'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  points: number;
  pointsSpent: number;
  isAdmin: boolean;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  authReady: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  signUp: async () => ({ success: false, message: '' }),
  logout: async () => {},
  authReady: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.full_name || session.user.email!.split('@')[0],
          isAdmin: session.user.user_metadata?.is_admin || false,
          points: session.user.user_metadata?.points || 1000,
          pointsSpent: session.user.user_metadata?.points_spent || 0,
          role: session.user.user_metadata?.role || 'user',
        });
      }
      setAuthReady(true);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.full_name || session.user.email!.split('@')[0],
          isAdmin: session.user.user_metadata?.is_admin || false,
          points: session.user.user_metadata?.points || 1000,
          pointsSpent: session.user.user_metadata?.points_spent || 0,
          role: session.user.user_metadata?.role || 'user',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      return { success: true, message: 'Registration successful! Please check your email to confirm your account.' };
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    signUp,
    logout,
    authReady,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
