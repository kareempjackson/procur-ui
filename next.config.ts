import type { NextConfig } from "next";

// Derive Supabase hostname from env so both dev/prod projects work
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseHostFromEnv = (() => {
  try {
    return new URL(SUPABASE_URL).host;
  } catch {
    return undefined;
  }
})();

// Hardcoded production Supabase project host — reliable fallback when env
// var isn't resolved at config-evaluation time (e.g. Turbopack cold starts).
const SUPABASE_PROD_HOST = "dbuxyviftwahgrgiftrw.supabase.co";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ["sanity", "@sanity/client", "@sanity/image-url"],
  webpack(config) {
    // Sanity 5.15+ imports `useEffectEvent` as a named export from React,
    // but stable React 19.x does not export it. Disabling webpack's strict
    // named-export check globally so the build succeeds.
    // The runtime polyfill in react-polyfill.ts supplies the implementation.
    config.module.parser = {
      ...config.module.parser,
      javascript: {
        ...(config.module.parser?.javascript ?? {}),
        exportsPresence: false,
      },
    };
    return config;
  },
  turbopack: {
    root: __dirname,
    resolveAlias: {
      // Next.js bundles its own React canary internally which doesn't expose
      // useEffectEvent. Force Sanity (and all client code) to use the project's
      // react@19.1.x which does export it.
      react: "./node_modules/react",
      "react-dom": "./node_modules/react-dom",
    },
  },
  images: {
    remotePatterns: [
      // ── Supabase storage (hardcoded prod project) ──────────────────────────
      // Product images are uploaded to the "procur-img" bucket via the admin
      // panel and served from this host. Allow all paths so both public and
      // signed-URL paths work without having to enumerate every bucket prefix.
      {
        protocol: "https" as const,
        hostname: SUPABASE_PROD_HOST,
        pathname: "/**",
      },
      // ── Supabase storage (env-derived, for staging / other projects) ───────
      ...(supabaseHostFromEnv && supabaseHostFromEnv !== SUPABASE_PROD_HOST
        ? [{ protocol: "https" as const, hostname: supabaseHostFromEnv, pathname: "/**" }]
        : []),
      // ── Local NestJS API (development image serving) ───────────────────────
      {
        protocol: "http" as const,
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      // ── Sanity CDN ─────────────────────────────────────────────────────────
      {
        protocol: "https" as const,
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
      // ── Unsplash (landing page fallback / demo images) ─────────────────────
      {
        protocol: "https" as const,
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https" as const,
        hostname: "plus.unsplash.com",
      },
      // ── Avatar / placeholder services ──────────────────────────────────────
      {
        protocol: "https" as const,
        hostname: "ui-avatars.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
