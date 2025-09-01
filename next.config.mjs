/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Only apply redirects in development environment
      ...(process.env.NODE_ENV === 'development' ? [
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'localhost:3001',
            },
          ],
          destination: 'http://localhost:3000/:path*',
          permanent: false,
        },
      ] : []),
    ];
  },
  env: {
    // Properly handle NEXTAUTH_URL based on environment
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 
      (process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000' 
        : process.env.VERCEL_URL 
          ? `https://${process.env.VERCEL_URL}` 
          : 'https://your-production-url.com'),
  },
  // Make sure output is set to standalone for better compatibility with hosting platforms
  output: 'standalone'

export default nextConfig;
