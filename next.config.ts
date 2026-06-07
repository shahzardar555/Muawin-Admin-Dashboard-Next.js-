import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint:  {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  experimental: {
    // @ts-expect-error - valid runtime option even if not in types
    missingSuspenseWithCSRBailout: false,
  },
  transpilePackages: ['lucide-react', 'recharts'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
