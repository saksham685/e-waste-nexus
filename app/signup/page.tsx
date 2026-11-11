import React from 'react';
import { AuthSplitScreen } from '@/components/AuthSplitScreen';

export const metadata = {
  title: 'Create Account | E-Waste Nexus 3D Portal',
  description: 'Join India’s premier circular economy and certified e-waste recycling platform.',
};

export default function SignupPage() {
  return <AuthSplitScreen initialMode="signup" />;
}
