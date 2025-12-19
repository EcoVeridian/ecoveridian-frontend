"use client";

import { Logo } from '@/components/common/logo';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Mail, Instagram, Linkedin } from 'lucide-react';

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

          {/* Bottom bar - branding */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col items-center gap-3 max-w-3xl mx-auto text-center">
              <Logo />
              
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} EcoVeridian.</p>
                <p>All rights reserved.</p>
              </div>

              <div className="flex items-center gap-4 mt-2">
                <a
                  href="mailto:ecoveridian@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/ecoveridian/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/company/ecoveridian"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
