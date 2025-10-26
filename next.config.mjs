// next.config.mjs
/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'standalone',
  compiler: {
    styledComponents: {
      ssr: true,
      displayName: true,
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
    ],
  }
};

export default nextConfig;
