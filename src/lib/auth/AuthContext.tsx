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
    const fetchUser = async () => {
      try {
        // Check if user is signed in
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching user profile:', error);
            setUser(null);
          } else if (data) {
            setUser({
              id: data.id,
              email: session.user.email || '',
              name: data.full_name || '',
              role: data.role || 'user',
              points: data.points || 0,
              pointsSpent: data.points_spent || 0,
              isAdmin: data.role === 'admin',
            });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth error:', error);
        setUser(null);
      } finally {
        setLoading(false);
        setAuthReady(true);
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (!error && data) {
            setUser({
              id: data.id,
              email: session.user.email || '',
              name: data.full_name || '',
              role: data.role || 'user',
              points: data.points || 0,
              pointsSpent: data.points_spent || 0,
              isAdmin: data.role === 'admin',
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      return { success: true, message: 'Check your email for confirmation link' };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { success: false, message: error.message || 'Signup failed' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signUp,
        logout,
        authReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Export the useAuth hook
export const useAuth = () => useContext(AuthContext);

// Export the AuthContext as default export
export default AuthContext;
