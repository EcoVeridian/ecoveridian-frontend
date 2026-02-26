'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { detectBrowser, getExtensionUrl, isMobile, mobileSupportsExtensions } from '@/lib/browser-utils';
import { useAuth } from '@/contexts/AuthContext';

// Hero section - full-screen forest parallax with CTA
export default function Hero() {
    const [browser, setBrowser] = useState<'chrome' | 'edge' | 'firefox' | 'other'>('other');
    const [isOnMobile, setIsOnMobile] = useState(false);
    const [canInstallOnMobile, setCanInstallOnMobile] = useState(false);
    const [showUnsupportedMessage, setShowUnsupportedMessage] = useState(false);
    const [unsupportedMessage, setUnsupportedMessage] = useState<string | null>(null);
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        setBrowser(detectBrowser());
        setIsOnMobile(isMobile());
        setCanInstallOnMobile(mobileSupportsExtensions());
    }, []);

    const handleDownloadClick = () => {
        if (isOnMobile) {
            if (canInstallOnMobile && browser === 'firefox') {
                const url = getExtensionUrl('firefox');
                if (url) {
                    window.open(url, '_blank', 'noopener,noreferrer');
                    return;
                }
            }
            setUnsupportedMessage(
                "Most mobile browsers don't support extensions. However, Firefox for Android does! " +
                "Download Firefox for Android to install the EcoVeridian extension on your phone, " +
                "or use a desktop browser."
            );
            setShowUnsupportedMessage(true);
            setTimeout(() => setShowUnsupportedMessage(false), 9000);
            return;
        }

        const url = getExtensionUrl(browser);
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            setUnsupportedMessage(
                'Our extension is available for Chrome, Edge, Brave, Vivaldi, Firefox, and other major browsers. ' +
                'Please use one of these browsers to download.'
            );
            setShowUnsupportedMessage(true);
            setTimeout(() => setShowUnsupportedMessage(false), 7000);
        }
    };

    return (
        <section className="relative h-screen w-full overflow-hidden">
            {/* Dark forest background — visible in dark mode, hidden in light mode */}
            <div
                className="absolute inset-0 z-[1] opacity-0 dark:opacity-100 transition-opacity duration-700 ease-in-out"
                style={{
                    backgroundImage: 'url(/backgroundimgfull.png)',
                    backgroundAttachment: 'fixed',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                }}
            />

            {/* Light forest background — visible in light mode, hidden in dark mode */}
            <div
                className="absolute inset-0 z-0 opacity-100 dark:opacity-0 transition-opacity duration-700 ease-in-out"
                style={{
                    backgroundImage: 'url(/lightbackgroundimgfull.png)',
                    backgroundAttachment: 'fixed',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                }}
            />

            {/* Gradient overlay — automatically switches via Tailwind dark variant */}
            <div
                className="absolute inset-0 z-[2] transition-colors duration-700 bg-gradient-to-b from-black/35 via-black/15 to-black/50 dark:from-black/60 dark:via-black/40 dark:to-black/70"
            />

            {/* Foreground content */}
            <div className="relative z-10 flex h-full items-center justify-center px-4">
                <div className="container mx-auto max-w-5xl text-center">
                    {/* Main headline */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 animate-fade-in-up animate-delay-100 opacity-0 animation-fill-both text-white drop-shadow-lg">
                        Clarity in Corporate <br className="hidden md:block" />
                        Sustainability.
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 animate-fade-in-up animate-delay-200 opacity-0 animation-fill-both leading-relaxed drop-shadow-md">
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
                            className="rounded-full px-8 h-12 text-base font-medium w-full sm:w-auto border border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:text-white transition-all duration-300"
                        >
                            <ArrowDownTrayIcon className="mr-2 w-4 h-4" /> Download Extension
                        </Button>
                    </div>

                    {/* Unsupported browser message */}
                    {showUnsupportedMessage && (
                        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-300 text-sm max-w-md mx-auto animate-fade-in backdrop-blur-sm">
                            <p className="font-medium mb-1">Extension Not Available</p>
                            <p>{unsupportedMessage ?? 'Our extension is available for Chrome, Edge, Brave, Vivaldi, Firefox, and other major browsers. Please use one of these browsers to download.'}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom gradient fade — cleanly blends into site background using Tailwind vars */}
            <div
                className="absolute bottom-0 left-0 right-0 z-10 h-40 pointer-events-none transition-colors duration-700 bg-gradient-to-b from-transparent to-background"
            />
        </section>
    );
}
