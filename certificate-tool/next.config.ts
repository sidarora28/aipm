import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // googleapis and pdf-lib are server-only and must not be bundled for the client.
  serverExternalPackages: ['googleapis', 'pdf-lib'],

  // The template and fonts are read from disk at runtime, so they must be
  // traced into the serverless bundle — Next cannot infer a dynamic readFile.
  outputFileTracingIncludes: {
    '/api/lookup': ['./assets/**/*'],
  },
};

export default nextConfig;
