'use client';

import { Logo } from '@/components/common/logo';
import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { usePathname } from 'next/navigation';

// Footer section with CTA and two-column navigation
export default function Footer() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const pathname = usePathname();

  return (
    <footer className="bg-background border-t border-border py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div
          ref={ref}
          className={`text-center ${
            isVisible ? 'scroll-animate-visible' : 'scroll-animate'
          }`}
        >
          {/* Final CTA section */}
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
            Start Your Journey to Sustainability Today
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
            Start making informed decisions. Add EcoVeridian to your browser for
            free.
          </p>

          {/* Bottom bar - Two columns */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 max-w-4xl mx-auto">
              {/* Left side - Resources navigation */}
              <div className="flex flex-col items-start gap-3 text-sm">
                <h3 className="font-semibold text-foreground">Resources</h3>
                <Link
                  href="/team"
                  className={pathname === '/team' ? 'text-primary font-medium transition-colors' : 'text-muted-foreground hover:text-primary transition-colors'}
                >
                  Team
                </Link>
                <Link
                  href="/legal"
                  className={pathname === '/legal' ? 'text-primary font-medium transition-colors' : 'text-muted-foreground hover:text-primary transition-colors'}
                >
                  Legal
                </Link>
                <Link
                  href="/privacy"
                  className={pathname === '/privacy' ? 'text-primary font-medium transition-colors' : 'text-muted-foreground hover:text-primary transition-colors'}
                >
                  Privacy Policy
                </Link>
              </div>

              {/* Right side - Branding */}
              <div className="flex flex-col items-start md:items-end gap-3">
                {/* Logo */}
                <Logo />
                {/* Copyright */}
                <p className="text-sm text-muted-foreground">
                  &copy; {new Date().getFullYear()} EcoVeridian.
                </p>
                <p className="text-sm text-muted-foreground">
                  All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
