/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['xwnayrioxkcjwbefhkcu.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Enable experimental features needed for ESM compatibility
  experimental: {
    serverComponentsExternalPackages: [
      '@supabase/supabase-js',
      'jose',
      'undici',
      'node-fetch',
    ],
    esmExternals: 'loose', // To help with ESM/CJS interop
  },
  // Work around top-level await issues
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Keep listed packages as ESM
      config.experiments = {
        ...config.experiments,
        topLevelAwait: true,
      };
    }
    return config;
  },
};

export default nextConfig;
