import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['livekit-server-sdk', '@livekit/protocol'],
  transpilePackages: ['@lobehub/icons'],
  async rewrites() {
    return [
      {
        source: '/api/agents/:path*',
        destination: 'http://localhost:8880/api/agents/:path*',
      },
    ];
  },
};

export default nextConfig;
