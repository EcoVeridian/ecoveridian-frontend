'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { detectBrowser, getExtensionUrl } from '@/lib/browser-utils';

// Hero section - main headline and CTA
export default function Hero() {
  const [browser, setBrowser] = useState<'chrome' | 'edge' | 'other'>('other');
  const [showUnsupportedMessage, setShowUnsupportedMessage] = useState(false);

  useEffect(() => {
    // Detect browser on mount
    setBrowser(detectBrowser());
  }, []);

  const handleDownloadClick = () => {
    const url = getExtensionUrl(browser);
    
    if (url) {
      // Open the store URL in a new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      // Show unsupported message
      setShowUnsupportedMessage(true);
      setTimeout(() => setShowUnsupportedMessage(false), 5000);
    }
  };

  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-4">
      <div className="container mx-auto max-w-5xl text-center">
        {/* Main headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 animate-fade-in-up animate-delay-100 opacity-0 animation-fill-both">
          Clarity in Corporate <br className="hidden md:block" />
          Sustainability.
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up animate-delay-200 opacity-0 animation-fill-both leading-relaxed">
          Our extension delivers instant sustainability scores, helping you make
          responsible decisions with confidence.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animate-delay-300 opacity-0 animation-fill-both">
          <Link href="/auth">
            <Button
              size="lg"
              className="rounded-full px-8 h-12 text-base font-medium w-full sm:w-auto hover-lift"
            >
              Get started <ArrowRightIcon className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            onClick={handleDownloadClick}
            className="rounded-full px-8 h-12 text-base font-medium w-full sm:w-auto border-input hover:bg-secondary/50 hover-lift"
          >
            <ArrowDownTrayIcon className="mr-2 w-4 h-4" /> Download Extension
          </Button>
        </div>

        {/* Unsupported browser message */}
        {showUnsupportedMessage && (
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-600 dark:text-yellow-400 text-sm max-w-md mx-auto animate-fade-in">
            <p className="font-medium mb-1">Extension Not Available</p>
            <p>
              Our extension is currently available for Chrome and Edge browsers only. 
              Please use one of these browsers to download.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
