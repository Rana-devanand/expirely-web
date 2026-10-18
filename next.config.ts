import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.openfoodfacts.org',
      }
    ],
  },
  allowedDevOrigins: ['10.155.112.83', '10.122.225.83', 'localhost', '127.0.0.1'],
};

export default nextConfig;
