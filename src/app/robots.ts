import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://procur.io";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/studio/",
          "/api/",
          "/buyer/",
          "/seller/",
          "/government/",
          "/cart",
          "/checkout",
          "/saved",
          "/inbox",
          "/notifications",
          "/requests",
          "/account/",
          "/suppliers",
          "/auth/",
          "/verify",
          "/check-email",
          "/forgot-password",
          "/login",
          "/signup",
          "/test/",
          "/loader-demo",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
