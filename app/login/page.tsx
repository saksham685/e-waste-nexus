import React, { Suspense } from 'react';
import { AuthSplitScreen } from '@/components/AuthSplitScreen';

export const metadata = {
  title: 'Sign In | E-Waste Nexus 3D Portal',
  description: 'Sign in to access your certified e-waste dashboard and EPR credits.',
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <AuthSplitScreen initialMode="signin" />
    </Suspense>
  );
}
