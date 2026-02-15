/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
    unoptimized: true, // For static export if needed
  },
  // Enable static file serving
  trailingSlash: true,
  // Enable standalone output for Docker
  output: 'standalone',
  // Security: Disable X-Powered-By header
  poweredByHeader: false,
  // Security: Compress responses
  compress: true,
}

module.exports = nextConfig

