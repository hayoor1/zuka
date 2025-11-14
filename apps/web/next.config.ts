import type { NextConfig } from 'next';

const config: NextConfig = {
  // TypeScript - faster dev builds
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Logging
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  
  // Dev indicators
  devIndicators: {
    position: 'bottom-right',
  },
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp'], // Reduced formats for faster dev
    deviceSizes: [640, 828, 1200, 1920], // Reduced sizes for faster dev
    imageSizes: [16, 32, 48, 64, 96, 128], // Reduced sizes for faster dev
    minimumCacheTTL: 60, // Cache images for 60 seconds
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@gemcart/ui'],
  },
  
  // Faster dev server - keep fewer pages in memory
  onDemandEntries: {
    maxInactiveAge: 25 * 1000, // 25 seconds
    pagesBufferLength: 2, // Only keep 2 pages
  },
};

export default config;
