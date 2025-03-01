/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['xwnayrioxkcjwbefhkcu.supabase.co', 'images.unsplash.com'],
  },
  // Simple configuration with no experimental features
};

module.exports = nextConfig;
