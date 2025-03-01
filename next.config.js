/** @type {import('next').NextConfig} */
const path = require('path');
const { pathsToAliasResolver } = require('./next.alias.config.js');

// Determine if we're running on Netlify
const isNetlify = process.env.NETLIFY === 'true';

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['xwnayrioxkcjwbefhkcu.supabase.co', 'images.unsplash.com'],
  },
  // Output standalone to optimize for Netlify
  output: 'standalone',
  
  // Minimize CSS output
  optimizeFonts: true,
  
  // Optimize production builds
  productionBrowserSourceMaps: false,
  
  // Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Path aliases for module resolution
  webpack: (config, { dev, isServer }) => {
    // Ensure path aliases work correctly
    config.resolve.alias = {
      ...config.resolve.alias,
      ...pathsToAliasResolver,
      '@': path.join(__dirname, 'src'),
    };
    
    // Production optimizations only
    if (!dev) {
      // Split chunks for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
      };
      
      // Use terser for smaller bundles
      config.optimization.minimize = true;
    }
    
    return config;
  },
  // Add environment variables for Tailwind config path
  env: {
    TAILWIND_CONFIG_PATH: isNetlify ? './tailwind.netlify.config.js' : './tailwind.config.js',
  },
};

module.exports = nextConfig;
