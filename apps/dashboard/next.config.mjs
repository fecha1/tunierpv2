/** @type {import('next').NextConfig} */
const apiUrl = process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:4060';

const nextConfig = {
  output: process.env.DOCKER_BUILD === '1' ? 'standalone' : undefined,
  reactStrictMode: true,
  transpilePackages: ['@tunierp/core', '@tunierp/auth'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
