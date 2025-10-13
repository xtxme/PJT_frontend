// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  compiler: { styledComponents: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
    ],
  },
  async rewrites() {
    return [
      // ส่งทุกอย่างใต้ /warehouse/* ไปที่แบ็กเอนด์พอร์ต 5002
      { source: '/warehouse/:path*', destination: 'http://localhost:5002/warehouse/:path*' },
    ];
  },
};

export default nextConfig;
