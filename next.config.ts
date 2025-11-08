import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  compiler: {
    emotion: true,
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
