import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Production source maps disabled
  productionBrowserSourceMaps: false,

  // Use Webpack instead of Turbopack to handle Hebrew directory names
  webpack: (config) => {
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

  // Environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
}

export default nextConfig
