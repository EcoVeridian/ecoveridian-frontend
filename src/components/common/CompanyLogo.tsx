'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BuildingOffice2Icon } from '@heroicons/react/24/outline';

interface CompanyLogoProps {
  domain: string;
  companyName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Company Logo component that fetches logos from Clearbit or Google Favicon API
 * Falls back to a building icon if no logo is available
 */
export default function CompanyLogo({ 
  domain, 
  companyName, 
  size = 'md',
  className = '' 
}: CompanyLogoProps) {
  const [hasError, setHasError] = useState(false);
  const [logoSrc, setLogoSrc] = useState<string>(() => {
    // Clean the domain - remove protocol and www
    const cleanDomain = domain
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0];
    
    // Use Clearbit Logo API (free, no API key required for basic usage)
    return `https://logo.clearbit.com/${cleanDomain}`;
  });

  // Size mappings
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const handleError = () => {
    if (!hasError) {
      // Try Google Favicon as fallback
      const cleanDomain = domain
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .split('/')[0];
      
      setLogoSrc(`https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`);
      setHasError(true);
    }
  };

  // If both APIs fail, show fallback icon
  const [showFallback, setShowFallback] = useState(false);

  if (showFallback) {
    return (
      <div 
        className={`${sizeClasses[size]} rounded-lg bg-primary/10 flex items-center justify-center ${className}`}
        title={companyName}
      >
        <BuildingOffice2Icon className={`${iconSizes[size]} text-primary`} />
      </div>
    );
  }

  return (
    <div 
      className={`${sizeClasses[size]} rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-border ${className}`}
      title={companyName}
    >
      <Image
        src={logoSrc}
        alt={`${companyName} logo`}
        width={size === 'lg' ? 64 : size === 'md' ? 48 : 32}
        height={size === 'lg' ? 64 : size === 'md' ? 48 : 32}
        className="object-contain p-1"
        onError={() => {
          if (hasError) {
            // Both APIs failed, show fallback
            setShowFallback(true);
          } else {
            handleError();
          }
        }}
        unoptimized // Required for external image URLs
      />
    </div>
  );
}
