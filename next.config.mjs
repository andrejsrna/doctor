/** @type {import('next').NextConfig} */
const nextConfig = {
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
  },
};

export default nextConfig; 