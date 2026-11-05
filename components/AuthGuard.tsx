'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import Link from 'next/link';
import { ShieldAlert, LogIn, ArrowRight } from 'lucide-react';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { user } = useAuthStore();

  // Only the Admin route is strictly restricted to administrator roles
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute && (!user || user.role !== 'admin')) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Administrator Access Required</h2>
        <p className="text-sm text-gray-400 max-w-md">
          The Central CPCB Environmental Audit Portal requires administrator clearance credentials. Please log in as an authorized auditor.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 text-nexus-dark font-bold text-sm shadow-glow-green"
        >
          <LogIn className="w-4 h-4" />
          <span>Go to Login Gate</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return <>{children}</>;
};
