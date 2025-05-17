/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['hgrohapbnvejwwblmmyw.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hgrohapbnvejwwblmmyw.supabase.co',
        pathname: '/storage/v1/object/public/property-images/**',
      },
    ],
    // Adds aggressive caching for images
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
    // Disable image preloading to avoid unnecessary network requests
    dangerouslyAllowSVG: true,
    disableStaticImages: false,
    unoptimized: false,
  },
  // Optimize build output
  swcMinify: true,
  // Optimize production build
  poweredByHeader: false,
  // Improve compression
  compress: true,
}

export default nextConfig
