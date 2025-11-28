'use client';

import { Logo } from '@/components/common/logo';
import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// Footer section with CTA and two-column navigation
export default function Footer() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

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
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Team
                </Link>
                <a
                  href="https://risithcha.com/blog/building-ecoveridian-v100"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Read The Journey
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Changelog
                </a>
              </div>

              {/* Right side - Branding and legal */}
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
                {/* Legal links */}
                <p className="text-xs text-muted-foreground">
                  <Link
                    href="/legal"
                    className="underline hover:text-foreground transition-colors"
                  >
                    Legal
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
