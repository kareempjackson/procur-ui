import { NextRequest, NextResponse } from "next/server";

// ISO country code → Procur country code mapping for geo-redirect
const COUNTRY_TO_CODE: Record<string, string> = {
  GD: "gda", // Grenada
  TT: "tnt", // Trinidad & Tobago
  VC: "svg", // St. Vincent & the Grenadines
  DM: "dma", // Dominica
  LC: "lca", // St. Lucia
  BB: "brb", // Barbados
  AG: "atg", // Antigua & Barbuda
  JM: "jam", // Jamaica
  KN: "kna", // St. Kitts & Nevis
};

const DEFAULT_COUNTRY = "gda";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function createCountrySlug(location?: string | null): string {
  if (!location) return "caribbean";
  return location
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

async function resolveLegacySellerRedirect(
  sellerId: string,
): Promise<string | null> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
    const res = await fetch(
      `${apiUrl}/marketplace/sellers/${encodeURIComponent(sellerId)}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    const seller = (await res.json()) as {
      slug?: string;
      location?: string;
    };
    if (!seller.slug) return null;
    return `/sellers/${createCountrySlug(seller.location)}/${seller.slug}`;
  } catch {
    return null;
  }
}

// Routes that should NOT be treated as country codes
const RESERVED_PATHS = new Set([
  "buyer",
  "seller",
  "government",
  "gov",
  "cart",
  "checkout",
  "inbox",
  "saved",
  "orders",
  "account",
  "notifications",
  "onboarding",
  "order-confirmation",
  "requests",
  "product",
  "login",
  "signup",
  "auth",
  "api",
  "admin",
  "marketplace",
  "browse",
  "suppliers",
  "help",
  "legal",
  "company",
  "blog",
  "solutions",
  "purchasers",
  "check-email",
  "forgot-password",
  "verify",
  "p",
  "test",
  "components",
  "studio",
  "_next",
  "fonts",
  "images",
  "favicon.ico",
]);

// Cache of active country codes (refreshed every 5 min)
let countryCodesCache: string[] = [];
let cacheExpiry = 0;
const CACHE_TTL = 5 * 60 * 1000;

async function getActiveCountryCodes(req: NextRequest): Promise<string[]> {
  if (Date.now() < cacheExpiry && countryCodesCache.length > 0) {
    return countryCodesCache;
  }

  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
    const res = await fetch(`${apiUrl}/countries`, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const data = await res.json();
      countryCodesCache = (data.countries || []).map(
        (i: { code: string }) => i.code,
      );
      cacheExpiry = Date.now() + CACHE_TTL;
      return countryCodesCache;
    }
  } catch {
    // API unavailable — fall back to default
  }

  return countryCodesCache.length > 0 ? countryCodesCache : [DEFAULT_COUNTRY];
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip static assets and internal routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/images") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Legacy seller URL: /sellers/<uuid> → 308 to /sellers/<country>/<slug>
  const legacySellerMatch = pathname.match(/^\/sellers\/([^/]+)\/?$/);
  if (legacySellerMatch && UUID_REGEX.test(legacySellerMatch[1])) {
    const destination = await resolveLegacySellerRedirect(legacySellerMatch[1]);
    if (destination) {
      const url = req.nextUrl.clone();
      url.pathname = destination;
      return NextResponse.redirect(url, 308);
    }
    // Fall through to 404 if seller can't be resolved
  }

  // Root path → redirect to country (prefer existing cookie, then geo-IP, then default)
  if (pathname === "/") {
    const existingCode = req.cookies.get("country_code")?.value;
    const isoCode = req.headers.get("x-vercel-ip-country") || "";
    const geoCode = COUNTRY_TO_CODE[isoCode] || DEFAULT_COUNTRY;
    const countryCode = existingCode || geoCode;
    const url = req.nextUrl.clone();
    url.pathname = `/${countryCode}`;
    const response = NextResponse.redirect(url);
    response.cookies.set("country_code", countryCode, {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return response;
  }

  // Check if first path segment is an island code
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (!firstSegment || RESERVED_PATHS.has(firstSegment)) {
    // Not a country path — pass through
    return NextResponse.next();
  }

  // Check if it's a valid country code (2-4 lowercase letters)
  if (/^[a-z]{2,4}$/.test(firstSegment)) {
    const activeCountries = await getActiveCountryCodes(req);
    if (activeCountries.includes(firstSegment)) {
      // Valid active country — set cookie and continue
      const response = NextResponse.next();
      response.cookies.set("country_code", firstSegment, {
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30,
      });
      return response;
    }

    // Looks like a country code but inactive/invalid → redirect to default
    if (activeCountries.length > 0) {
      const url = req.nextUrl.clone();
      url.pathname = `/${DEFAULT_COUNTRY}${pathname.slice(firstSegment.length + 1)}`;
      return NextResponse.redirect(url);
    }
  }

  // Not an island path — pass through
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
