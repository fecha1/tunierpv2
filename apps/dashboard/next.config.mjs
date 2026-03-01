/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@tunierp/core', '@tunierp/auth'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4060/api/:path*',
      },
    ];
  },
};

export default nextConfig;
