'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Initialize Netlify Identity
    if (typeof window !== 'undefined') {
      const netlifyIdentity = require('netlify-identity-widget');
      netlifyIdentity.init({
        APIUrl: process.env.NEXT_PUBLIC_NETLIFY_IDENTITY_URL
      });

      // Handle login event
      netlifyIdentity.on('login', async (user: any) => {
        try {
          const response = await fetch('/.netlify/functions/get-user-data', {
            headers: {
              Authorization: `Bearer ${user.token.access_token}`
            }
          });
          
          if (!response.ok) throw new Error('Failed to fetch user data');
          
          const userData = await response.json();
          setUser(userData);
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      });

      // Handle logout
      netlifyIdentity.on('logout', () => {
        setUser(null);
      });

      // Check initial session
      const currentUser = netlifyIdentity.currentUser();
      if (currentUser) {
        netlifyIdentity.refresh().then((jwt: any) => {
          netlifyIdentity.gotrue.currentUser().getUserData()
            .then((userData: any) => {
              setUser(userData);
            })
            .catch((err: Error) => {
              setError(err);
            })
            .finally(() => {
              setLoading(false);
            });
        });
      } else {
        setLoading(false);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const netlifyIdentity = require('netlify-identity-widget');
      await netlifyIdentity.login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Login failed'));
      throw err;
    }
  };

  const logout = async () => {
    try {
      const netlifyIdentity = require('netlify-identity-widget');
      await netlifyIdentity.logout();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Logout failed'));
      throw err;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const netlifyIdentity = require('netlify-identity-widget');
      await netlifyIdentity.signup(email, password, { data: { name } });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Signup failed'));
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, signup }}>
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
