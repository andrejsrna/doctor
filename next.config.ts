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
          value: 'origin-when-cross-origin'
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
  
    webpack: (config, { dev, isServer }) => {
      // Production optimizations
      if (!dev && !isServer) {
        config.optimization.splitChunks = {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          cacheGroups: {
            default: false,
            vendors: false,
            framework: {
              chunks: 'all',
              name: 'framework',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name(module: { context: string }) {
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)?.[1] || 'unknown'
                return `npm.${packageName?.replace('@', '')}`
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
          },
        }
      }
      return config
    },

  images: {
    domains: ["dnbdoctor.com"],
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
