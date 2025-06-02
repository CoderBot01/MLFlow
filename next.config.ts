
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Prevent 'async_hooks' from being bundled on the client, as it's a Node.js core module.
      // OpenTelemetry (a Genkit dependency) might try to import it.

      // Ensure config.resolve exists
      if (!config.resolve) {
        config.resolve = {};
      }
      // Ensure config.resolve.fallback exists
      if (!config.resolve.fallback) {
        config.resolve.fallback = {};
      }
      // Set the fallback for async_hooks
      config.resolve.fallback.async_hooks = false;
    }
    return config;
  },
};

export default nextConfig;
