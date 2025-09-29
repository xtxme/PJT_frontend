import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  compiler: {
    styledComponents: {
      ssr: true,
      displayName: true,
    },
  },
};

export default nextConfig;
