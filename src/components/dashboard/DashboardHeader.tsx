'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { logOut } from '@/lib/auth-utils';
import { Logo } from '@/components/common/logo';
import { Button } from '@/components/ui/button';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function DashboardHeader() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logOut();
    router.push('/');
  };

  return (
    <header className="glass sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
        {/* Logo */}
        <Logo />

        {/* User Info & Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium">{user?.email}</p>
            <p className="text-xs text-muted-foreground">Dashboard</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
