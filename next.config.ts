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
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://static.cloudflareinsights.com https://*.google-analytics.com https://connect.facebook.net data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com data:; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' https://challenges.cloudflare.com https://static.cloudflareinsights.com https://*.google-analytics.com https://graph.facebook.com https://connect.facebook.net https://www.facebook.com https://admin.dnbdoctor.com https://*.dnbdoctor.com data: blob:; frame-src 'self' https://challenges.cloudflare.com https://w.soundcloud.com https://www.youtube.com https://open.spotify.com; media-src 'self' data: https: blob:; object-src 'none';"
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
