import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Minimal stable config suitable for Vercel
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
