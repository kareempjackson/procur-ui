import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allow production builds to successfully complete even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
  turbopack: {
    root: __dirname,
  },
  /* config options here */
};

export default nextConfig;
