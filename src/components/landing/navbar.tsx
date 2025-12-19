'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/common/logo';
import ThemeToggle from '@/components/ui/theme-toggle';
import { useAuth } from '@/contexts/AuthContext';

// Fixed navbar with logo and navigation
export default function Navbar() {
  const { user, loading } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass animate-fade-in">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Logo />

        {/* Right-aligned navigation */}
        <div className="flex items-center gap-4">
          {/* Theme toggle (sun/moon) */}
          <ThemeToggle />
          {/* Primary CTA - changes based on auth state */}
          {!loading && (
            <Link href={user ? '/dashboard' : '/auth'}>
              <Button className="rounded-full px-6 font-medium hover-lift" size="sm">
                {user ? 'Dashboard' : 'Get started'}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
