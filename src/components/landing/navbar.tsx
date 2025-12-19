'use client';

import Link from 'next/link';
import { Clock3, Home, Scale, ShieldCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/common/logo';
import ThemeToggle from '@/components/ui/theme-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { NavBar } from '@/components/ui/tubelight-navbar';

// Fixed navbar with logo and navigation
const navItems = [
  { name: 'Home', url: '/', icon: Home },
  { name: 'Team', url: '/team', icon: Users },
  { name: 'Changelog', url: '/changelog', icon: Clock3 },
  { name: 'TOS', url: '/tos', icon: Scale },
  { name: 'Privacy', url: '/privacy', icon: ShieldCheck },
];

export default function Navbar() {
  const { user, loading } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-none border-none shadow-none animate-fade-in">
      <div className="container mx-auto px-4 py-3 grid grid-cols-1 grid-rows-[auto_auto] gap-2 sm:grid-cols-3 sm:grid-rows-1 sm:items-center">
        {/* top row on mobile: logo + mobile controls; on desktop this stays in col 1 */}
        <div className="flex items-center justify-between w-full sm:justify-start sm:col-start-1">
          <Logo />

          <div className="flex items-center gap-3 sm:hidden">
            <ThemeToggle />
            {!loading && (
              <Link href={user ? '/dashboard' : '/auth'}>
                <Button className="rounded-full px-5 font-medium hover-lift" size="sm">
                  {user ? 'Dashboard' : 'Get started'}
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* nav centered: full width on mobile (row 2), centered in col 2 on desktop */}
        <div className="flex justify-center w-full sm:col-start-2">
          <NavBar items={navItems} variant="inline" className="w-full sm:w-auto" />
        </div>

        {/* desktop controls: hidden on mobile, placed in col 3 on desktop */}
        <div className="hidden sm:flex items-center justify-end gap-3 sm:col-start-3">
          <ThemeToggle />
          {!loading && (
            <Link href={user ? '/dashboard' : '/auth'}>
              <Button className="rounded-full px-5 font-medium hover-lift" size="sm">
                {user ? 'Dashboard' : 'Get started'}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
