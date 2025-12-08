import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  
  // Empty turbopack config to acknowledge we're using Turbopack
  // and silence the migration warning
  turbopack: {},
  
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
