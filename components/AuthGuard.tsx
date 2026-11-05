'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  const isPublicPage = pathname === '/login' || pathname === '/signup' || pathname === '/logout';

  useEffect(() => {
    // Check if cookie exists
    const hasCookie = typeof document !== 'undefined' && document.cookie.includes('nexus_token=');

    if (!isPublicPage && !user && !token && !hasCookie) {
      // Strictly gate unauthenticated visitors to login page
      window.location.href = `/login?redirect=${encodeURIComponent(pathname)}`;
    } else {
      setIsChecking(false);
    }
  }, [pathname, user, token, isPublicPage]);

  // If on a protected route and not authenticated, render loading screen until redirect takes effect
  if (!isPublicPage && !user && !token) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-nexus-dark text-emerald-400 p-4 font-mono text-xs">
        <div className="w-12 h-12 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin mb-4" />
        <span className="animate-pulse">AUTHENTICATION REQUIRED: REDIRECTING TO LOGIN GATE...</span>
      </div>
    );
  }

  return <>{children}</>;
};
