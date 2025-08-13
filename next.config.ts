import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Completely disable all development indicators and tools
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
  },
  // Disable webpack bundle analyzer and other dev tools
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Disable source maps in development for cleaner output
      config.devtool = false;
      // Disable any webpack dev tools
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      };
    }
    return config;
  },
  // Disable experimental features that might show dev indicators
  experimental: {
    // Disable any experimental dev features
    webpackBuildWorker: false,
  },
  // Disable any other dev-related features
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
