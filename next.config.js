/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:5279'],
    },
  },
  // Ensure Next.js works with Netlify's function directory
  distDir: '.next',
}

module.exports = nextConfig;
