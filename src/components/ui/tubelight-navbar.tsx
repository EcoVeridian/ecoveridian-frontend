"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
  variant?: 'floating' | 'inline';
}

export function NavBar({ items, className, variant = 'floating' }: NavBarProps) {
  const pathname = usePathname();
  const fallbackActive = items[0]?.name ?? '';
  const [activeTab, setActiveTab] = useState(fallbackActive);

  useEffect(() => {
    if (!items.length) return;

    const match = items.find((item) =>
      pathname === item.url || pathname.startsWith(`${item.url}/`),
    );
    setActiveTab(match?.name ?? fallbackActive);
  }, [pathname, items, fallbackActive]);

  if (!items.length) return null;

  const isInline = variant === 'inline';

  return (
    <div
      className={cn(
        isInline
          ? 'relative w-full flex justify-center px-1'
          : 'fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-3',
        className,
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center gap-1 sm:gap-3 bg-background/80 border border-border backdrop-blur-xl py-1 px-1 rounded-full shadow-lg shadow-black/10 dark:shadow-black/30',
          isInline && 'w-full',
        )}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative cursor-pointer text-xs sm:text-sm font-semibold px-3 sm:px-5 py-2 sm:py-2 rounded-full transition-colors',
                'text-foreground/80 hover:text-primary',
                isActive && 'bg-muted text-primary',
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                    <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
