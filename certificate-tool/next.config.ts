import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // googleapis and pdf-lib are server-only and must not be bundled for the client.
  serverExternalPackages: ['googleapis', 'pdf-lib'],
};

export default nextConfig;
