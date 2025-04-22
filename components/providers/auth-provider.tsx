"use client";

import { useEffect, createContext, useContext, ReactNode, useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  isTenant: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  isOwner: false,
  isTenant: false,
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

const publicRoutes = ['/', '/login', '/register', '/about', '/contact', '/forgot-password'];

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, userData, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if route needs authentication
    const needsAuth = !publicRoutes.includes(pathname);
    
    if (!isLoading) {
      if (needsAuth && !user) {
        // Redirect to login if not authenticated and route requires auth
        router.push('/login');
      } else if (user && pathname === '/login') {
        // Redirect to dashboard if already authenticated and trying to access login
        router.push('/dashboard');
      } else {
        setLoading(false);
      }
    }
  }, [user, isLoading, router, pathname]);

  // Wait for auth state to be determined
  if (isLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const authContextValue: AuthContextType = {
    isAuthenticated: !!user,
    isAdmin: userData?.role === 'admin',
    isOwner: userData?.role === 'owner',
    isTenant: userData?.role === 'tenant',
    isLoading,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
} 