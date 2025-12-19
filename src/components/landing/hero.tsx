'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { detectBrowser, getExtensionUrl, isMobile } from '@/lib/browser-utils';
import InteractiveBackground from '@/components/landing/interactive-background';
import { useAuth } from '@/contexts/AuthContext';

// Hero section - main headline and CTA
export default function Hero() {
  const [browser, setBrowser] = useState<'chrome' | 'edge' | 'firefox' | 'other'>('other');
  const [isOnMobile, setIsOnMobile] = useState(false);
  const [showUnsupportedMessage, setShowUnsupportedMessage] = useState(false);
  const [unsupportedMessage, setUnsupportedMessage] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    // Detect browser and device on mount
    setBrowser(detectBrowser());
    setIsOnMobile(isMobile());
  }, []);

  const handleDownloadClick = () => {
    // If on mobile, show message that extensions require desktop browsers
    if (isOnMobile) {
      setUnsupportedMessage("Extensions can't be installed on phones. Use a desktop browser to install the EcoVeridian extension.");
      setShowUnsupportedMessage(true);
      setTimeout(() => setShowUnsupportedMessage(false), 7000);
      return;
    }

    // Firefox support is still under development
    if (browser === 'firefox') {
      setUnsupportedMessage('Mozilla Firefox support is currently under development. Please use a Chromium-based browser (Chrome, Edge, Brave, Vivaldi, etc.) to install the extension.');
      setShowUnsupportedMessage(true);
      setTimeout(() => setShowUnsupportedMessage(false), 7000);
      return;
    }

    const url = getExtensionUrl(browser);
    if (url) {
      // Open the store URL in a new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      // Generic unsupported message
      setUnsupportedMessage('Our extension is available for Chromium-based browsers (Chrome, Edge, Brave, Vivaldi, and others). Please use one of those browsers to download.');
      setShowUnsupportedMessage(true);
      setTimeout(() => setShowUnsupportedMessage(false), 7000);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Interactive cursor-reactive background */}
      <InteractiveBackground />
      
      <div className="container mx-auto max-w-5xl text-center relative z-10">
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
          {!authLoading && (
            <Link href={user ? '/dashboard' : '/auth'}>
              <Button
                size="lg"
                className="rounded-full px-8 h-12 text-base font-medium w-full sm:w-auto hover-lift"
              >
                {user ? 'Go to Dashboard' : 'Get started'} <ArrowRightIcon className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          )}
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
            <p>{unsupportedMessage ?? 'Our extension is currently available for Chromium-based browsers (Chrome, Edge, Brave, Vivaldi, and others). Please use one of those browsers to download.'}</p>
          </div>
        )}
      </div>
    </section>
  );
}
