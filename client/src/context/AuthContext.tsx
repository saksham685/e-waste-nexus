import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api, setAuthToken, getAuthToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo account credentials for 1-click evaluation
export const DEMO_CREDENTIALS: Record<UserRole, { email: string; pass: string; title: string }> = {
  admin: { email: 'admin@nexus.eco', pass: 'Admin@123', title: 'Global Administrator' },
  partner: { email: 'partner@nexus.eco', pass: 'Partner@123', title: 'Logistics Partner' },
  recycler: { email: 'recycler@nexus.eco', pass: 'Recycler@123', title: 'Certified Recycler' },
  individual: { email: 'user@nexus.eco', pass: 'User@123', title: 'Individual Consumer' }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(getAuthToken());
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    try {
      if (getAuthToken()) {
        const res = await api.auth.getMe();
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          logout();
        }
      }
    } catch (err) {
      console.warn('Session expired or server unavailable:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.auth.login({ email, password });
    if (res.success && res.token) {
      setAuthToken(res.token);
      setTokenState(res.token);
      setUser(res.user);
    }
  };

  const register = async (userData: any) => {
    const res = await api.auth.register(userData);
    if (res.success && res.token) {
      setAuthToken(res.token);
      setTokenState(res.token);
      setUser(res.user);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setTokenState(null);
    setUser(null);
  };

  const switchDemoRole = async (role: UserRole) => {
    setLoading(true);
    try {
      const demo = DEMO_CREDENTIALS[role];
      await login(demo.email, demo.pass);
    } catch (err) {
      console.error('Failed to switch demo role:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        switchDemoRole,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
