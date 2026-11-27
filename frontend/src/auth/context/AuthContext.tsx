import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthUser, Role } from '../../types';

interface AuthContextType {
  user: AuthUser | null;
  login: (data: AuthUser) => void;
  logout: () => void;
  isRole: (role: Role) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('auth');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (data: AuthUser) => {
    localStorage.setItem('auth', JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setUser(null);
  };

  const isRole = (role: Role) => user?.role === role;

  return (
    <AuthContext.Provider value={{ user, login, logout, isRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
