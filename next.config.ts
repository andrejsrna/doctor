import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['framer-motion', 'react-icons'],
    optimizeServerReact: true,
  },
  
  // Compiler options for modern browsers
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Headers for performance and security
  headers: async () => [
    {
      source: '/api/auth/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store, max-age=0'
        }
      ]
    },
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
          value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://static.cloudflareinsights.com https://*.google-analytics.com https://connect.facebook.net data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com data:; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' https://challenges.cloudflare.com https://static.cloudflareinsights.com https://*.google-analytics.com https://graph.facebook.com https://connect.facebook.net https://www.facebook.com https://admin.dnbdoctor.com https://*.dnbdoctor.com https://api.iconify.design https://api.simplesvg.com https://api.unisvg.com data: blob:; frame-src 'self' https://challenges.cloudflare.com https://w.soundcloud.com https://www.youtube.com https://open.spotify.com; media-src 'self' data: https: blob:; object-src 'none';"
        },
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        }
      ]
    }
  ],

  // Compression and caching
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
    // Optimized device sizes for better responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Optimized image sizes for common display sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Enable modern image formats
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
      {
        source: "/ingest/flags",
        destination: "https://eu.i.posthog.com/flags",
      },
    ];
  },
};

export default nextConfig;
