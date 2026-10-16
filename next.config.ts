import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  allowedDevOrigins: ['192.168.*.*'],
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    localPatterns: [
      {
        pathname: '/uploads/**',
      },
      {
        pathname: '/upload/**',
      },
      {
        pathname: '/**',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
