import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains'
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        },
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        }
      ]
    }
  ],

  compress: true,
  poweredByHeader: false,
  generateEtags: true,


  images: {
      remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dnbdoctor.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'dnbdoctor.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.dnbdoctor.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '*.dnbdoctor.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
};

export default nextConfig;
