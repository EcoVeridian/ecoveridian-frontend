'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky nav after scrolling 800px past hero section
      const showAfter = 800;
      setIsVisible(window.scrollY > showAfter);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <nav className="glass sticky top-0 z-50 border-b border-border animate-fade-in">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
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
    </nav>
  );
}
