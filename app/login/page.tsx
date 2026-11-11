import React from 'react';
import { AuthSplitScreen } from '@/components/AuthSplitScreen';

export const metadata = {
  title: 'Sign In | E-Waste Nexus 3D Portal',
  description: 'Sign in to access your certified e-waste dashboard and EPR credits.',
};

export default function LoginPage() {
  return <AuthSplitScreen initialMode="signin" />;
}
