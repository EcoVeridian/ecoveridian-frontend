import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  
  // Empty turbopack config to acknowledge we're using Turbopack
  // and silence the migration warning
  turbopack: {},
  
  // Configure external image domains for company logos
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
        pathname: '/s2/favicons/**',
      },
    ],
  },
  
  webpack: (config) => {
    // Exclude Veridian folder from compilation
    config.module.rules.push({
      test: /\.(ts|tsx|js|jsx)$/,
      exclude: /Veridian/,
    });
    return config;
  },
};

export default nextConfig;
