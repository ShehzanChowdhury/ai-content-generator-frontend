'use client';

import { Provider } from 'react-redux';
import { store } from '../store/store';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { initializeAuth, getCurrentUser } from '../store/authSlice';
import LoadingSpinner from './ui/LoadingSpinner';

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      dispatch(initializeAuth());
      
      if (token) {
        try {
          await dispatch(getCurrentUser()).unwrap();
        } catch {
          // Token is invalid, clear it
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setHasCheckedAuth(true);
    };

    initAuth();
  }, [dispatch]);

  // Show loading during initial auth check
  // Wait until we've checked auth AND loading is complete
  if (!hasCheckedAuth || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <div className="mt-4 text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}

