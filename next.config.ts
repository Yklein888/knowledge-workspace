import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Production source maps disabled
  productionBrowserSourceMaps: false,

  // Explicitly use Webpack to avoid Turbopack issues with Hebrew paths
  webpack: (config, { isServer }) => {
    return config
  },

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
