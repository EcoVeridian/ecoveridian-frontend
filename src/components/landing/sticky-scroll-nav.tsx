'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock3, Home, Scale, ShieldCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/common/logo';
import ThemeToggle from '@/components/ui/theme-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { NavBar } from '@/components/ui/tubelight-navbar';

const navItems = [
  { name: 'Home', url: '/', icon: Home },
  { name: 'Team', url: '/team', icon: Users },
  { name: 'Events', url: '/events', icon: Calendar },
  { name: 'Changelog', url: '/changelog', icon: Clock3 },
  { name: 'Privacy', url: '/privacy', icon: ShieldCheck },
  { name: 'Terms', url: '/terms', icon: Scale },
];

export default function StickyScrollNav() {
  const [isVisible, setIsVisible] = useState(false);
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // Check if we're on the home page
  const isHomePage = pathname === '/';

  useEffect(() => {
    // If not on home page, show immediately
    if (!isHomePage) {
      setIsVisible(true);
      return;
    }

    // If on home page, show after scrolling
    const handleScroll = () => {
      const showAfter = 800;
      setIsVisible(window.scrollY > showAfter);
    };

    handleScroll(); // Check initial scroll position
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  if (!isVisible) return null;

  return (
    <nav className="glass sticky top-0 z-50 border-b border-border animate-fade-in">
      {/* Mobile Layout: Stacked with everything in one bar */}
      <div className="sm:hidden px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <Logo />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {!loading && (
              <Link href={user ? '/dashboard' : '/auth'}>
                <Button className="rounded-full px-4 font-medium hover-lift" size="sm">
                  {user ? 'Dashboard' : 'Get started'}
                </Button>
              </Link>
            )}
          </div>
        </div>
        <div className="flex justify-center">
          <NavBar items={navItems} variant="inline" className="w-full" />
        </div>
      </div>

      {/* Desktop Layout: Original horizontal layout */}
      <div className="hidden sm:block container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo */}
          <Logo />

          {/* Center: Navigation menu */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <NavBar items={navItems} variant="inline" className="w-auto" />
          </div>

          {/* Right: Theme toggle and Dashboard button */}
          <div className="flex items-center gap-3">
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
      </div>
    </nav>
  );
}
