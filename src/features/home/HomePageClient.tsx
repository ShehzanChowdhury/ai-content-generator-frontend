'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../store/hooks';
import HomePage from './HomePage';

export default function HomePageClient() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Don't render anything if still loading or if authenticated (redirecting)
  if (isLoading || isAuthenticated) {
    return null;
  }

  return <HomePage />;
}


