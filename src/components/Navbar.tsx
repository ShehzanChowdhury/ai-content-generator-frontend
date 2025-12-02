'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logoutUser } from '../store/authSlice';
import Drawer from './ui/Drawer';

export default function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setIsDrawerOpen(false);
    router.push('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  const NavLinks = () => (
    <>
      <Link
        href="/dashboard"
        onClick={() => setIsDrawerOpen(false)}
        className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium block"
      >
        Dashboard
      </Link>
      <Link
        href="/create"
        onClick={() => setIsDrawerOpen(false)}
        className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium block"
      >
        Create Content
      </Link>
    </>
  );

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4 sm:space-x-8">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="md:hidden text-gray-700 hover:text-gray-900 p-2 rounded-md"
                aria-label="Open menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              <Link
                href="/dashboard"
                className="text-xl font-bold text-gray-900"
              >
                AI Content Generator
              </Link>

              {/* Desktop navigation links */}
              <div className="hidden md:flex space-x-4">
                <NavLinks />
              </div>
            </div>

            {/* Desktop user info and logout */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>

            {/* Mobile user info */}
            <div className="md:hidden flex items-center">
              <span className="text-sm text-gray-700 truncate max-w-[120px]">
                {user?.name}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <div className="space-y-4">
          <div className="pb-4 border-b border-gray-200">
            <p className="text-sm text-gray-600">Welcome,</p>
            <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
          </div>
          <nav className="space-y-2">
            <NavLinks />
          </nav>
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </Drawer>
    </>
  );
}


