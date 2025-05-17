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
  },
}

export default nextConfig
