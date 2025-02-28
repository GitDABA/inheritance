'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import netlifyIdentity from 'netlify-identity-widget';

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
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  authReady: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  authReady: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  const transformNetlifyUser = (netlifyUser: any): User => ({
    id: netlifyUser.id,
    email: netlifyUser.email,
    name: netlifyUser.user_metadata?.full_name || netlifyUser.email.split('@')[0],
    isAdmin: netlifyUser.app_metadata?.roles?.includes('admin') || false,
    points: 1000, // Default points
    pointsSpent: 0,
    role: netlifyUser.app_metadata?.roles?.[0] || 'user',
    token: netlifyUser.token,
  });

  useEffect(() => {
    const initCallback = (netlifyUser: any) => {
      if (netlifyUser) {
        setUser(transformNetlifyUser(netlifyUser));
      }
      setAuthReady(true);
      setLoading(false);
    };

    const loginCallback = (netlifyUser: any) => {
      setUser(transformNetlifyUser(netlifyUser));
      netlifyIdentity.close();
      setLoading(false);
    };

    const logoutCallback = () => {
      setUser(null);
      setLoading(false);
    };

    const errorCallback = (err: Error) => {
      console.error('Netlify Identity error:', err);
      setLoading(false);
    };

    netlifyIdentity.on('init', initCallback);
    netlifyIdentity.on('login', loginCallback);
    netlifyIdentity.on('logout', logoutCallback);
    netlifyIdentity.on('error', errorCallback);

    netlifyIdentity.init();

    return () => {
      netlifyIdentity.off('init', initCallback);
      netlifyIdentity.off('login', loginCallback);
      netlifyIdentity.off('logout', logoutCallback);
      netlifyIdentity.off('error', errorCallback);
    };
  }, []);

  const login = () => {
    netlifyIdentity.open();
  };

  const logout = () => {
    netlifyIdentity.logout();
  };

  const context = {
    user,
    loading,
    login,
    logout,
    authReady,
  };

  return (
    <AuthContext.Provider value={context}>
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
