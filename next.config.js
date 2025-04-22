/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
    ],
  },
  experimental: {
    serverActions: false,
    swcMinify: true,
  },
};

module.exports = nextConfig; 