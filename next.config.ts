import type { NextConfig } from "next";

// Derive Supabase hostname from env so both dev/prod projects work
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseHost = (() => {
  try {
    return new URL(SUPABASE_URL).host;
  } catch {
    return undefined;
  }
})();

const nextConfig: NextConfig = {
  eslint: {
    // Allow production builds to successfully complete even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
  turbopack: {
    root: __dirname,
  },
  images: {
    // Allow common remote hosts used across the app
    domains: [
      // Placeholder images in seed/demo data
      "example.com",
      // Avatars
      "ui-avatars.com",
      // Supabase storage host derived from env
      ...(supabaseHost ? [supabaseHost] : []),
      // Sanity CDN domains
      "cdn.sanity.io",
    ],
    remotePatterns: [
      // Explicitly allow Supabase public bucket paths
      ...(supabaseHost
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHost,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
      // Sanity image assets
      {
        protocol: "https" as const,
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
