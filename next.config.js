/** @type {import('next').NextConfig} */
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
  
  // Optimizations for smaller bundles
  webpack: (config, { dev, isServer }) => {
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
};

module.exports = nextConfig;
