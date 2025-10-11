// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  compiler: { styledComponents: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
    ],
  },
};

export default nextConfig;
