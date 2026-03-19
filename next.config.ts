import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Production source maps disabled
  productionBrowserSourceMaps: false,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
    ],
  },
}

export default nextConfig
