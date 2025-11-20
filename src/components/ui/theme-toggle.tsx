'use client';

import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

// Theme toggle button with sun/moon icons
export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Mount effect
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    // Cycle through light -> dark -> light
    if (resolvedTheme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        aria-label="Toggle theme"
        disabled
      >
        <SunIcon className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="h-9 w-9"
    >
      {/* Show Sun in light mode, Moon in dark mode */}
      {resolvedTheme === 'dark' ? (
        <MoonIcon className="h-5 w-5" />
      ) : (
        <SunIcon className="h-5 w-5" />
      )}
    </Button>
  );
}
