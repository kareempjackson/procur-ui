"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectAuthUser, signout } from "@/store/slices/authSlice";
import {
  fetchActiveCountries,
  setCountry,
  setCountryFromCode,
  selectCountry,
  selectCountries,
} from "@/store/slices/countrySlice";
import { getApiClient } from "@/lib/apiClient";
import { buildSellerUrl } from "@/lib/sellerUrl";
import BuyerTopNavigation from "@/components/navigation/BuyerTopNavigation";
import CountryPulseSection from "@/components/landing/CountryPulseSection";
import CountryTicker from "@/components/landing/CountryTicker";
import dynamic from "next/dynamic";
const BuyerClient = dynamic(() => import("./buyer/BuyerClient"), {
  ssr: false,
  loading: () => null,
});
import SellerTopNavigation from "@/components/navigation/SellerTopNavigation";
import { ToastProvider } from "@/components/ui/Toast";

// ─── Types ────────────────────────────────────────────────────────────────────
type LandingSeller = {
  id: string;
  slug?: string | null;
  name: string;
  logo_url?: string | null;
  header_image_url?: string | null;
  location?: string | null;
  average_rating?: number | null;
  review_count?: number | null;
  completed_orders?: number | null;
  is_verified?: boolean | null;
};

type LandingProduct = {
  id: string;
  name: string;
  category: string;
  current_price: number;
  unit: string;
  image_url?: string | null;
  seller: LandingSeller;
};

// ─── Fallback data ────────────────────────────────────────────────────────────
const FALLBACK_PRODUCTS: LandingProduct[] = [
  {
    id: "1",
    name: "Plantain",
    category: "Vegetables",
    current_price: 2.5,
    unit: "lb",
    image_url:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
    seller: {
      id: "s1",
      name: "Samaritan Farm",
      location: "St. Andrew",
      is_verified: true,
      completed_orders: 45,
    },
  },
  {
    id: "2",
    name: "Plantain",
    category: "Vegetables",
    current_price: 2.5,
    unit: "lb",
    image_url:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
    seller: {
      id: "s2",
      name: "AgrowFo",
      location: "St. Mark",
      is_verified: true,
      completed_orders: 67,
    },
  },
  {
    id: "3",
    name: "Plantain",
    category: "Vegetables",
    current_price: 2.0,
    unit: "lb",
    image_url:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
    seller: {
      id: "s3",
      name: "R&K Farms",
      location: "St. George",
      is_verified: true,
      completed_orders: 32,
    },
  },
  {
    id: "4",
    name: "Banana (ripe)",
    category: "Fruits",
    current_price: 1.5,
    unit: "lb",
    image_url:
      "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&h=400&fit=crop",
    seller: {
      id: "s2",
      name: "AgrowFo",
      location: "St. Mark",
      is_verified: true,
      completed_orders: 67,
    },
  },
  {
    id: "5",
    name: "Bok Choi",
    category: "Vegetables",
    current_price: 2.5,
    unit: "lb",
    image_url:
      "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=400&h=400&fit=crop",
    seller: {
      id: "s1",
      name: "Samaritan Farm",
      location: "St. Andrew",
      is_verified: true,
      completed_orders: 45,
    },
  },
  {
    id: "6",
    name: "Tania",
    category: "Root Crops",
    current_price: 6.0,
    unit: "lb",
    image_url:
      "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400&h=400&fit=crop",
    seller: {
      id: "s2",
      name: "AgrowFo",
      location: "St. Mark",
      is_verified: true,
      completed_orders: 67,
    },
  },
  {
    id: "7",
    name: "Pumpkin",
    category: "Vegetables",
    current_price: 2.75,
    unit: "lb",
    image_url:
      "https://images.unsplash.com/photo-1509622905150-fa66d3906e09?w=400&h=400&fit=crop",
    seller: {
      id: "s2",
      name: "AgrowFo",
      location: "St. Mark",
      is_verified: true,
      completed_orders: 67,
    },
  },
  {
    id: "8",
    name: "Gospo Sweet",
    category: "Fruits",
    current_price: 0.5,
    unit: "lb",
    image_url:
      "https://images.unsplash.com/photo-1587162146766-e06b1189b907?w=400&h=400&fit=crop",
    seller: {
      id: "s4",
      name: "Agro-Tech",
      location: "St. Patrick",
      is_verified: true,
      completed_orders: 20,
    },
  },
];

const FALLBACK_SELLERS: LandingSeller[] = [
  {
    id: "s1",
    name: "Samaritan Farm",
    location: "St. Andrew, Grenada",
    is_verified: true,
    average_rating: 4.9,
    review_count: 24,
    completed_orders: 45,
  },
  {
    id: "s3",
    name: "R&K Farms",
    location: "St. George, Grenada",
    is_verified: true,
    average_rating: 4.8,
    review_count: 18,
    completed_orders: 32,
  },
  {
    id: "s5",
    name: "Sequoia Eco Garden",
    location: "St. Patrick, Grenada",
    is_verified: true,
    average_rating: 5.0,
    review_count: 11,
    completed_orders: 15,
  },
  {
    id: "s2",
    name: "AgrowFo",
    location: "St. Mark, Grenada",
    is_verified: true,
    average_rating: 4.9,
    review_count: 31,
    completed_orders: 67,
  },
];

// ─── Static content ───────────────────────────────────────────────────────────
function getHeroSlides(countryName: string) {
  return [
    {
      img: "/images/hero/hanna-long-JbGA85iuTiY-unsplash.jpg",
      imgPosition: "center center",
      h2: "Fresh from the field.\nDirect to you.",
      p: `Shop verified produce from ${countryName}: plantain, bok choi, dasheen and more, sourced straight from the farm.`,
      cta: "Shop now",
      href: "/browse",
    },
    {
      img: "/images/hero/shelley-pauls-G7WdvR8rDPg-unsplash.jpg",
      imgPosition: "center center",
      h2: "Know exactly where\nyour food comes from.",
      p: "Every supplier on Procur is reviewed and verified. No middlemen, no surprises. Just transparent, local supply.",
      cta: "Browse produce",
      href: "/browse",
    },
    {
      img: "/images/hero/land-o-lakes-inc-BlXa_riHlp4-unsplash.jpg",
      imgPosition: "center 10%",
      h2: "Grow your reach.\nGrow your revenue.",
      p: `List your produce and connect with buyers, restaurants and hotels across ${countryName}, all in one place.`,
      cta: "Get started",
      href: "/signup?accountType=seller",
    },
  ];
}

const SELLER_COVERS = [
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=200&fit=crop",
  "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=600&h=200&fit=crop",
  "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&h=200&fit=crop",
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=200&fit=crop",
];

const TESTIMONIALS = [
  {
    quote:
      "An excellent venture that's far more convenient for farmers. I'm very pleased.",
    name: "Jude Durham",
    farm: "Samaritan Farm",
    location: "St. Andrew, Grenada",
    role: "Supplier",
  },
  {
    quote:
      "You just farm, you produce, you receive your money.",
    name: "Alvin Forsyth",
    farm: "AgrowFo",
    location: "Grenada",
    role: "Supplier",
  },
  {
    quote:
      "Everything arrived on time. The customer service was very responsive and professional.",
    name: "Brown Girl Cafe",
    location: "St. George, Grenada",
    role: "Buyer",
  },
  {
    quote:
      "Working with Procur has completely transformed the way I operate as a farmer. In the past, getting my produce to market was one of the hardest parts of the job. Dealing with transportation, finding buyers, and ensuring timely payment was always a challenge. Procur has given me access to reliable markets and helped me run my farm more professionally. I would strongly recommend them to any farmer looking to expand their reach and simplify their operations.",
    name: "Carmelo Alexis",
    farm: "T/A Agro-Tech Enterprise",
    location: "Grenada",
    role: "Supplier",
  },
  {
    quote:
      "Our experience with Procur has grown to be immensely satisfying. Not only have the relationship between our restaurant and the Procur team meshed as a unit, the ease of not having to run around to different supermarkets or vendors searching for a specific product has been one of the greatest time-saving benefits for us. Though at inception the running was not as smooth, the Procur team ensured all discrepancies were handled in a timely manner, which contributed to building our trust and reliability in them. We can now scroll, tap and wait for our produce to be delivered right to our doorsteps. Thank you Procur.",
    name: "Lloyd Panchoo",
    farm: "Choos",
    location: "Grenada",
    role: "Buyer",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const SEL_COLORS = ["#2d4a3e", "#d4783c", "#5a7650", "#1c2b23", "#407178"];

function selColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = h * 31 + name.charCodeAt(i);
  return SEL_COLORS[Math.abs(h) % SEL_COLORS.length];
}

function toProductHref(p: LandingProduct): string {
  const countrySlug = (p.seller.location ?? "caribbean")
    .toLowerCase()
    .replace(/\s+/g, "-");
  const productSlug = `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${p.id}`;
  return `/products/${countrySlug}/${productSlug}`;
}

function productImage(p: LandingProduct): string {
  if (p.image_url) return p.image_url;
  const cat = p.category.toLowerCase();
  if (cat.includes("fruit"))
    return "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&h=400&fit=crop";
  return "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop";
}

// ─── Product image with graceful fallback ─────────────────────────────────────
const PRODUCT_FALLBACK =
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop";
function ProductImg({
  src,
  alt,
  sizes,
  lazy,
}: {
  src: string;
  alt: string;
  sizes?: string;
  lazy?: boolean;
}) {
  const [imgSrc, setImgSrc] = React.useState(src);
  React.useEffect(() => {
    setImgSrc(src);
  }, [src]);
  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      sizes={sizes ?? "180px"}
      loading={lazy ? "lazy" : "eager"}
      onError={() => setImgSrc(PRODUCT_FALLBACK)}
      style={{ objectFit: "cover" }}
    />
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SecH({
  title,
  linkText,
  linkHref,
}: {
  title: string;
  linkText?: string;
  linkHref?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        margin: "28px 0 12px",
      }}
    >
      <h2
        style={{
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: "-.2px",
          color: "#1c2b23",
        }}
      >
        {title}
      </h2>
      {linkText && linkHref && (
        <Link
          href={linkHref}
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#2d4a3e",
            textDecoration: "none",
          }}
        >
          {linkText}
        </Link>
      )}
    </div>
  );
}

// ─── Reduced motion hook ──────────────────────────────────────────────────────
function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

// ─── Main page ────────────────────────────────────────────────────────────────
// Flag image component using flagcdn.com
function CountryFlag({ code, size = 20 }: { code: string; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
      srcSet={`https://flagcdn.com/w80/${code.toLowerCase()}.png 2x`}
      alt={code}
      width={size}
      height={Math.round(size * 0.75)}
      style={{ borderRadius: 2, objectFit: "cover", display: "block" }}
    />
  );
}

export default function Home() {
  const user = useAppSelector(selectAuthUser);
  const router = useRouter();
  const pathname = usePathname();
  const appDispatch = useAppDispatch();
  const reducedMotion = usePrefersReducedMotion();

  // Island state
  const { code: countryCode, name: countryName } = useAppSelector(selectCountry);
  const countries = useAppSelector(selectCountries);
  const [countryPickerOpen, setCountryPickerOpen] = useState(false);
  const countryPickerRef = useRef<HTMLDivElement>(null);

  // Read cookie inside an effect (not during render) so the first client
  // render matches the SSR HTML exactly — otherwise the cookie-derived
  // country code produces a hydration mismatch on the logo Link href.
  const [cookieCountryCode, setCookieCountryCode] = useState<string | null>(null);
  const effectiveCountryCode = countryCode || cookieCountryCode || "gda";

  useEffect(() => {
    appDispatch(fetchActiveCountries());
    const fromCookie =
      typeof document !== "undefined"
        ? document.cookie.match(/(?:^|;\s*)country_code=([^;]*)/)?.[1] || null
        : null;
    if (fromCookie && fromCookie !== cookieCountryCode) {
      setCookieCountryCode(fromCookie);
    }
    // If Redux has no country but cookie does, hydrate Redux from cookie
    if (!countryCode && fromCookie) {
      appDispatch(setCountryFromCode(fromCookie));
    }
  }, [appDispatch, countryCode, cookieCountryCode]);

  // Modal has its own backdrop click-to-close — no outside-click listener needed

  const currentCountry = countries.find((i) => i.code === effectiveCountryCode);
  const currentCountryIso = currentCountry?.country_code || "GD";
  const currentCountryName = currentCountry?.name || countryName || "Grenada";

  const heroSlides = useMemo(() => getHeroSlides(currentCountryName), [currentCountryName]);

  const handleCountrySelect = (code: string) => {
    setCountryPickerOpen(false);

    // Find the selected country to get its full data
    const selected = countries.find((i) => i.code === code);

    // Update Redux state immediately so flag + name under logo updates
    appDispatch(setCountry({
      code,
      name: selected?.name || code.toUpperCase(),
      currency: selected?.currency || "XCD",
    }));

    // Set cookie so the API client sends the new country header
    document.cookie = `country_code=${code}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;

    // Navigate to the country path — use router.replace for proper Next.js routing
    const segments = (pathname || "").split("/").filter(Boolean);
    const firstSeg = segments[0];
    const isCountryPath = countries.some((i) => i.code === firstSeg);
    if (isCountryPath) {
      segments[0] = code;
    } else {
      segments.unshift(code);
    }
    router.replace(`/${segments.join("/")}`);
  };

  // Data state — empty until both requests settle; skeleton shown on first load only
  const [products, setProducts] = useState<LandingProduct[]>([]);
  const [sellers, setSellers] = useState<LandingSeller[]>([]);
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const hasLoadedOnce = useRef(false);

  // UI state
  const [heroIdx, setHeroIdx] = useState(0);
  const [prevHeroIdx, setPrevHeroIdx] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  // ── Data loading — sessionStorage SWR + API refresh ──────────────────────────
  //    1. If sessionStorage has fresh data (< 2 min), render immediately (no skeleton).
  //    2. Always fire an API refresh in the background; update state + cache when done.
  //    This makes revisits within the same browser session feel near-instant.
  useEffect(() => {
    let cancelled = false;
    // Only show full skeleton on first load; subsequent switches use a subtle fade
    if (hasLoadedOnce.current) {
      setTransitioning(true);
    } else {
      setLoading(true);
    }
    const api = getApiClient(() => null);
    const activeCountryCode = effectiveCountryCode;
    const CACHE_KEY = `procur:home:v2:${activeCountryCode}`;
    const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

    function parseProducts(raw: Record<string, unknown>[]): LandingProduct[] {
      return raw.map(
        (p): LandingProduct => ({
          id: String(p.id),
          name: String(p.name),
          category: String(p.category ?? "Other"),
          current_price:
            typeof p.current_price === "number" ? p.current_price : 0,
          unit: String(p.unit ?? "lb"),
          image_url:
            (p.image_url as string | null) ??
            (p.images as string[])?.[0] ??
            null,
          seller: {
            id: String((p.seller as Record<string, unknown>)?.id ?? ""),
            name: String(
              (p.seller as Record<string, unknown>)?.name ?? "Seller",
            ),
            logo_url:
              ((p.seller as Record<string, unknown>)?.logo_url as
                | string
                | null) ?? null,
            location:
              ((p.seller as Record<string, unknown>)?.location as
                | string
                | null) ?? null,
            average_rating:
              ((p.seller as Record<string, unknown>)?.average_rating as
                | number
                | null) ?? null,
            review_count:
              ((p.seller as Record<string, unknown>)?.review_count as
                | number
                | null) ?? null,
            completed_orders:
              ((p.seller as Record<string, unknown>)?.completed_orders as
                | number
                | null) ?? null,
            is_verified:
              ((p.seller as Record<string, unknown>)?.is_verified as
                | boolean
                | null) ?? null,
          },
        }),
      );
    }

    function parseSellers(raw: Record<string, unknown>[]): LandingSeller[] {
      return raw.map(
        (s): LandingSeller => ({
          id: String(s.id),
          name: String(s.name),
          logo_url: (s.logo_url as string | null) ?? null,
          header_image_url: (s.header_image_url as string | null) ?? null,
          location: (s.location as string | null) ?? null,
          average_rating: (s.average_rating as number | null) ?? null,
          review_count: (s.review_count as number | null) ?? null,
          completed_orders: (s.completed_orders as number | null) ?? null,
          is_verified: (s.is_verified as boolean | null) ?? null,
        }),
      );
    }

    // Step 1: Try to hydrate from sessionStorage immediately
    let hasFreshCache = false;
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const { products: cp, sellers: cs, ts } = JSON.parse(raw);
        if (
          Date.now() - ts < CACHE_TTL &&
          Array.isArray(cp) &&
          Array.isArray(cs)
        ) {
          setProducts(cp);
          setSellers(cs);
          setLoading(false);
          setTransitioning(false);
          hasLoadedOnce.current = true;
          hasFreshCache = true;
        }
      }
    } catch {
      /* sessionStorage unavailable (SSR/private mode) — fall through */
    }

    // Step 2: Always refresh from API (background if cache hit, blocking if not)
    Promise.allSettled([
      api.get("/marketplace/products", {
        params: { in_stock: true, limit: 30 },
      }),
      api.get("/marketplace/sellers", { params: { limit: 40 } }),
    ]).then(([pResult, sResult]) => {
      if (cancelled) return;

      let newProducts: LandingProduct[] = [];
      let newSellers: LandingSeller[] = [];

      // Only use fallback data for Grenada (the primary market with hardcoded demo data)
      const useFallback = activeCountryCode === "gda";

      if (pResult.status === "fulfilled") {
        const pData = pResult.value?.data?.products;
        newProducts =
          Array.isArray(pData) && pData.length > 0
            ? parseProducts(pData)
            : useFallback ? FALLBACK_PRODUCTS : [];
      } else {
        newProducts = useFallback ? FALLBACK_PRODUCTS : [];
      }

      if (sResult.status === "fulfilled") {
        const sData = sResult.value?.data?.sellers;
        newSellers =
          Array.isArray(sData) && sData.length > 0
            ? parseSellers(sData)
            : useFallback ? FALLBACK_SELLERS : [];
      } else {
        newSellers = useFallback ? FALLBACK_SELLERS : [];
      }

      setProducts(newProducts);
      setSellers(newSellers);
      setLoading(false);
      setTransitioning(false);
      hasLoadedOnce.current = true;

      // Always refresh sessionStorage so the next visit gets the latest data
      try {
        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            products: newProducts,
            sellers: newSellers,
            ts: Date.now(),
          }),
        );
      } catch {
        /* quota exceeded or unavailable — non-fatal */
      }
    });

    return () => {
      cancelled = true;
    };
  }, [effectiveCountryCode]);

  // ── Hero auto-rotation ────────────────────────────────────────────────────────
  const heroTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bestSellersRef = useRef<HTMLDivElement>(null);
  function scrollSect(
    ref: React.RefObject<HTMLDivElement | null>,
    dir: number,
  ) {
    ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  }
  function startHeroTimer() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (heroTimerRef.current) clearInterval(heroTimerRef.current);
    heroTimerRef.current = setInterval(
      () => setHeroIdx((i) => (i + 1) % 3),
      5000,
    );
  }
  useEffect(() => {
    startHeroTimer();
    function handleVisibility() {
      if (document.hidden) {
        if (heroTimerRef.current) clearInterval(heroTimerRef.current);
        heroTimerRef.current = null;
      } else {
        startHeroTimer();
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      if (heroTimerRef.current) clearInterval(heroTimerRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goHero(i: number) {
    setPrevHeroIdx(heroIdx);
    setHeroIdx(i);
    startHeroTimer();
  }

  // ── Search ────────────────────────────────────────────────────────────────────
  function handleSearch() {
    const q = searchInput.trim();
    router.push(q ? `/browse?q=${encodeURIComponent(q)}` : "/browse");
  }

  // ── Computed ──────────────────────────────────────────────────────────────────
  const bestSellers = useMemo(
    () =>
      [...products]
        .sort(
          (a, b) =>
            (b.seller.completed_orders ?? 0) - (a.seller.completed_orders ?? 0),
        )
        .slice(0, 8),
    [products],
  );

  const categoryBlocks = useMemo(() => {
    const grouped: Record<string, Map<string, LandingProduct>> = {};
    products.forEach((p) => {
      if (!grouped[p.category]) grouped[p.category] = new Map();
      if (!grouped[p.category].has(p.name) && grouped[p.category].size < 4) {
        grouped[p.category].set(p.name, p);
      }
    });
    return Object.entries(grouped)
      .slice(0, 4)
      .map(([cat, prodMap]) => ({
        title: cat,
        browseHref: `/browse?category=${encodeURIComponent(cat.toLowerCase())}`,
        link: `Browse ${cat.toLowerCase()} →`,
        items: Array.from(prodMap.values()).map((p) => ({
          img: productImage(p),
          label: p.name,
        })),
      }));
  }, [products]);

  const cats = useMemo(
    () => [...new Set(products.map((p) => p.category))].slice(0, 6),
    [products],
  );

  const popularSellers = useMemo(() => {
    const base = sellers.length > 0 ? sellers : FALLBACK_SELLERS;
    return [...base]
      .sort((a, b) => {
        const ordersA = a.completed_orders ?? 0;
        const ordersB = b.completed_orders ?? 0;
        if (ordersB !== ordersA) return ordersB - ordersA;
        const ratingA = (a.average_rating ?? 0) * (a.review_count ?? 0);
        const ratingB = (b.average_rating ?? 0) * (b.review_count ?? 0);
        return ratingB - ratingA;
      })
      .slice(0, 4);
  }, [sellers]);
  const userName =
    (user as { firstName?: string; email?: string } | null)?.firstName ||
    (user as { firstName?: string; email?: string } | null)?.email?.split(
      "@",
    )[0] ||
    null;

  // ─── Buyer branch: logged-in buyers get their personalized marketplace at / ──
  if (user?.accountType === "buyer") {
    return (
      <ToastProvider>
        <div style={{ fontFamily: "'Urbanist', system-ui, sans-serif", background: "#faf8f4", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <BuyerTopNavigation />
          <main style={{ flex: 1 }}>
            <BuyerClient />
          </main>
          <footer style={{ background: "#0a0a0a", color: "#f5f1ea" }}>
            <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 20px" }}>
              <div style={{ padding: "80px 0 64px" }}>
                <h2 style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.15, maxWidth: 520, marginBottom: 16, letterSpacing: "-.5px", color: "#f5f1ea" }}>
                  Building stronger food systems across the Caribbean and beyond.
                </h2>
                <p style={{ fontSize: 14, color: "rgba(245,241,234,.65)", maxWidth: 440, lineHeight: 1.65, margin: "0 0 28px" }}>
                  Procur connects buyers directly with verified farmers: transparent pricing, reliable supply, and produce that&apos;s never more than a day from harvest.
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Link href={`/${effectiveCountryCode}`} style={{ padding: "12px 28px", background: "#f5f1ea", color: "#1c2b23", fontSize: 13, fontWeight: 700, borderRadius: 999, textDecoration: "none" }}>Browse marketplace</Link>
                  <Link href="/signup?accountType=seller" style={{ padding: "12px 28px", background: "transparent", color: "#f5f1ea", fontSize: 13, fontWeight: 600, borderRadius: 999, border: "1px solid rgba(245,241,234,.2)", textDecoration: "none" }}>Become a supplier</Link>
                </div>
              </div>
              <div style={{ height: 1, background: "rgba(245,241,234,.08)" }} />
              <div style={{ display: "flex", gap: 60, padding: "48px 0 40px" }}>
                <div style={{ flexShrink: 0, width: 240 }}>
                  <Image src="/images/logos/procur-logo.svg" alt="Procur" width={80} height={21} style={{ filter: "brightness(0) invert(1)", opacity: 0.75 }} />
                  <p style={{ fontSize: 12, color: "rgba(245,241,234,.55)", lineHeight: 1.65, marginTop: 16, marginBottom: 0 }}>
                    Procur is {currentCountryName}&apos;s agricultural marketplace, purpose-built to shorten supply chains and strengthen local food economies.
                  </p>
                </div>
                <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
                  {[
                    { title: "Platform", links: [{ label: "Browse Produce", href: "/" }, { label: "For Suppliers", href: "/signup?accountType=seller" }, { label: "For Buyers", href: "/signup?accountType=buyer" }, { label: "Log in", href: "/login" }] },
                    { title: "Solutions", links: [{ label: "Restaurants", href: "/solutions/restaurants" }, { label: "Hotels", href: "/solutions/hotels" }, { label: "Grocery", href: "/solutions/grocery" }, { label: "Government", href: "/solutions/government" }] },
                    { title: "Company", links: [{ label: "About Procur", href: "/company/about" }, { label: "Blog", href: "/blog" }, { label: "Contact", href: "/company/contact" }] },
                    { title: "Resources", links: [{ label: "Help Center", href: "/help" }, { label: "FAQ", href: "/help/faq" }, { label: "Buyer Guide", href: "/buyer-guide" }] },
                  ].map((col) => (
                    <div key={col.title}>
                      <h5 style={{ fontSize: 10, fontWeight: 700, color: "rgba(245,241,234,.5)", marginBottom: 14, letterSpacing: ".08em", textTransform: "uppercase" }}>{col.title}</h5>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {col.links.map((l) => (
                          <li key={l.label} style={{ marginBottom: 8 }}>
                            <Link href={l.href} style={{ fontSize: 12.5, color: "rgba(245,241,234,.55)", textDecoration: "none" }}>{l.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ paddingTop: 18, paddingBottom: 28, borderTop: "1px solid rgba(245,241,234,.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: 11, color: "rgba(245,241,234,.35)", margin: 0 }}>&copy; 2026 Procur {currentCountryName} Ltd. All rights reserved.</p>
                <div style={{ display: "flex", gap: 16 }}>
                  {[{ label: "Privacy", href: "/legal/privacy" }, { label: "Terms", href: "/legal/terms" }, { label: "Cookies", href: "/legal/cookies" }, { label: "Accessibility", href: "/accessibility" }].map((l) => (
                    <Link key={l.label} href={l.href} style={{ fontSize: 11, color: "rgba(245,241,234,.35)", textDecoration: "none" }}>{l.label}</Link>
                  ))}
                </div>
              </div>
            </div>
          </footer>
        </div>
      </ToastProvider>
    );
  }

  // ─── Seller branch: logged-in sellers browse the marketplace with their nav ──
  const isSellerBrowsing = user?.accountType === "seller";

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      {isSellerBrowsing && <SellerTopNavigation />}
      <div
        style={{
          fontFamily: "'Urbanist', system-ui, sans-serif",
          background: "#faf8f4",
          color: "#1c2b23",
          WebkitFontSmoothing: "antialiased",
          overflowX: "hidden",
        }}
      >
      {/* ── Menu overlay ── */}
      <div
        onClick={() => setMenuOpen(false)}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,.3)",
          zIndex: 200,
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity .3s",
        }}
      />

      {/* ── Menu drawer ── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 300,
          background: "#fff",
          zIndex: 201,
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform .35s cubic-bezier(.4,0,.2,1)",
          display: "flex",
          flexDirection: "column",
          borderRadius: "16px 0 0 16px",
        }}
      >
        <div
          style={{
            padding: "16px 18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Image
            src="/images/logos/procur-logo.svg"
            alt="Procur"
            width={72}
            height={19}
          />
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "#f5f1ea",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6a7f73",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              width={13}
              height={13}
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        {userName && (
          <div
            style={{
              padding: "0 18px 14px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#2d4a3e",
                color: "#f5f1ea",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{userName}</div>
              <div style={{ fontSize: 10.5, color: "#8a9e92" }}>
                View profile
              </div>
            </div>
          </div>
        )}
        <div style={{ flex: 1, padding: "4px 8px", overflowY: "auto" }}>
          {[
            { label: "Browse Produce", href: "/browse" },
            { label: "Sellers", href: "/sellers" },
          ].map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "9px 12px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                color: "#1c2b23",
                textDecoration: "none",
              }}
            >
              {l.label}
            </Link>
          ))}
          <div
            style={{ height: 1, background: "#ebe7df", margin: "6px 12px" }}
          />
          {[
            { label: "Become a Supplier", href: "/signup?accountType=seller" },
          ].map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "9px 12px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                color: "#1c2b23",
                textDecoration: "none",
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div style={{ padding: "12px 18px", borderTop: "1px solid #ebe7df" }}>
          {user ? (
            <button
              onClick={() => { setMenuOpen(false); setLogoutModalOpen(true); }}
              style={{
                display: "block",
                width: "100%",
                padding: 9,
                background: "#2d4a3e",
                color: "#f5f1ea",
                fontSize: 12,
                fontWeight: 700,
                textAlign: "center",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
              }}
            >
              Log out
            </button>
          ) : (
            <Link
              href="/login"
              style={{
                display: "block",
                padding: 9,
                background: "#2d4a3e",
                color: "#f5f1ea",
                fontSize: 12,
                fontWeight: 700,
                textAlign: "center",
                borderRadius: 10,
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      {/* ── Mobile search modal ── */}
      <div
        onClick={() => setSearchModalOpen(false)}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: "rgba(0,0,0,.55)",
          zIndex: 300,
          opacity: searchModalOpen ? 1 : 0,
          pointerEvents: searchModalOpen ? "auto" : "none",
          transition: "opacity .2s",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 301,
          background: "#2d4a3e",
          padding: "14px 16px",
          transform: searchModalOpen ? "translateY(0)" : "translateY(-100%)",
          transition: "transform .25s cubic-bezier(.4,0,.2,1)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            background: "rgba(255,255,255,.14)",
            borderRadius: 999,
            height: 44,
            border: "1px solid rgba(255,255,255,.16)",
            padding: "0 4px 0 14px",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="rgba(245,241,234,.5)" strokeWidth="2" width={16} height={16} style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={mobileSearchRef}
            type="text"
            placeholder="Search produce, sellers..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { setSearchModalOpen(false); handleSearch(); } }}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontFamily: "inherit",
              fontSize: 15,
              color: "#f5f1ea",
              fontWeight: 400,
              background: "transparent",
              padding: "0 10px",
              caretColor: "#f5f1ea",
            }}
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "rgba(255,255,255,.15)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(245,241,234,.7)",
                flexShrink: 0,
                marginRight: 4,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={11} height={11}>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            onClick={() => { setSearchModalOpen(false); handleSearch(); }}
            style={{
              height: 32,
              width: 32,
              background: "#d4783c",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              border: "none",
              cursor: "pointer",
              borderRadius: "50%",
              marginRight: 2,
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={14} height={14}>
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </div>
        <button
          onClick={() => setSearchModalOpen(false)}
          style={{
            flexShrink: 0,
            background: "none",
            border: "none",
            color: "rgba(245,241,234,.7)",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            padding: "0 4px",
          }}
        >
          Cancel
        </button>
      </div>

      {/* ── Filter drawer (left) ── */}
      <div
        onClick={() => setFilterOpen(false)}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,.3)",
          zIndex: 200,
          opacity: filterOpen ? 1 : 0,
          pointerEvents: filterOpen ? "auto" : "none",
          transition: "opacity .3s",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 280,
          background: "#fff",
          zIndex: 201,
          transform: filterOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform .35s cubic-bezier(.4,0,.2,1)",
          display: "flex",
          flexDirection: "column",
          borderRadius: "0 16px 16px 0",
        }}
      >
        <div
          style={{
            padding: "16px 18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #ebe7df",
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 700, color: "#1c2b23" }}>
            Filter by Category
          </span>
          <button
            onClick={() => setFilterOpen(false)}
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "#f5f1ea",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6a7f73",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              width={13}
              height={13}
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div style={{ flex: 1, padding: "8px", overflowY: "auto" }}>
          <a
            href="/browse"
            onClick={() => setFilterOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 12px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              color: "#1c2b23",
              textDecoration: "none",
              background: "#f5f1ea",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              width={15}
              height={15}
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            All Categories
          </a>
          <div
            style={{ height: 1, background: "#ebe7df", margin: "6px 4px" }}
          />
          {cats.map((cat) => (
            <a
              key={cat}
              href={`/browse?category=${encodeURIComponent(cat.toLowerCase())}`}
              onClick={() => setFilterOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 12px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 500,
                color: "#2d4a3e",
                textDecoration: "none",
              }}
            >
              {cat}
            </a>
          ))}
        </div>
      </div>

      {/* ── Sticky header (public/logged-out only; sellers use SellerTopNavigation) ── */}
      {!isSellerBrowsing && <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "#2d4a3e",
        }}
      >
        {/* Main header row */}
        <div
          className="v6-hdr-row"
          style={{
            height: 58,
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <Link
            href={`/${effectiveCountryCode}`}
            style={{
              flexShrink: 0,
              marginRight: 20,
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 3,
            }}
          >
            <Image
              src="/images/logos/procur-logo.svg"
              alt="Procur"
              width={88}
              height={23}
              style={{ filter: "brightness(0) invert(1)" }}
              priority
            />
            <span
              style={{
                fontSize: 9.5,
                fontWeight: 600,
                color: "rgba(245,241,234,.72)",
                lineHeight: 1,
                letterSpacing: ".03em",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><CountryFlag code={currentCountryIso} size={14} /> {currentCountryName}</span>
            </span>
          </Link>
          {/* Search bar — navigates to /browse?q=... */}
          <div
            className="v6-hdr-search"
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(255,255,255,.12)",
                borderRadius: 999,
                height: 38,
                border: "1px solid rgba(255,255,255,.14)",
                padding: "0 4px 0 16px",
                width: "100%",
                maxWidth: 560,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(245,241,234,.45)"
                strokeWidth="2"
                width={15}
                height={15}
                style={{ flexShrink: 0 }}
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search produce, sellers..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontFamily: "inherit",
                  fontSize: 13,
                  color: "#f5f1ea",
                  fontWeight: 400,
                  background: "transparent",
                  padding: "0 10px",
                  caretColor: "#f5f1ea",
                }}
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,.15)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(245,241,234,.7)",
                    flexShrink: 0,
                    marginRight: 4,
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    width={10}
                    height={10}
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
              <button
                onClick={handleSearch}
                style={{
                  height: 28,
                  width: 28,
                  background: "#d4783c",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "50%",
                  marginRight: 2,
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  width={13}
                  height={13}
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </button>
            </div>
          </div>
          {/* Nav right */}
          <div
            className="v6-hdr-right"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexShrink: 0,
            }}
          >
            {/* Country picker */}
            <div ref={countryPickerRef} style={{ position: "relative" }}>
              <button
                onClick={() => setCountryPickerOpen(!countryPickerOpen)}
                aria-label="Change country"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "5px 8px",
                  borderRadius: 999,
                  cursor: "pointer",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  flexShrink: 0,
                }}
              >
                <CountryFlag code={currentCountryIso} size={22} />
                <span className="v6-acct-desktop" style={{ fontSize: 11.5, fontWeight: 600, color: "#f5f1ea", lineHeight: 1 }}>{currentCountryName}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="rgba(245,241,234,.5)" strokeWidth="2" width={10} height={10}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </div>
            {/* Country selector modal */}
            {countryPickerOpen && (
              <>
                <div
                  onClick={() => setCountryPickerOpen(false)}
                  style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,.4)",
                    backdropFilter: "blur(4px)",
                    WebkitBackdropFilter: "blur(4px)",
                    zIndex: 9998,
                  }}
                />
                <div
                  style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "#fff",
                    borderRadius: 24,
                    zIndex: 9999,
                    width: "90%",
                    maxWidth: 400,
                    overflow: "hidden",
                  }}
                >
                  <div style={{ padding: "24px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a", margin: 0, letterSpacing: "-0.01em" }}>
                      Choose your country
                    </h3>
                    <button
                      onClick={() => setCountryPickerOpen(false)}
                      style={{ width: 30, height: 30, borderRadius: 999, border: "none", outline: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" width={18} height={18}>
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div style={{ padding: "16px 16px 20px", maxHeight: 400, overflowY: "auto" }}>
                    {countries.map((c) => {
                      const isActive = c.code === countryCode;
                      return (
                        <button
                          key={c.code}
                          onClick={() => handleCountrySelect(c.code)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            width: "100%",
                            padding: "14px 16px",
                            border: "none",
                            borderRadius: 14,
                            background: isActive ? "#2d4a3e" : "transparent",
                            cursor: "pointer",
                            textAlign: "left",
                            outline: "none",
                            transition: "background .15s ease",
                            marginBottom: 4,
                          }}
                          onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(0,0,0,.035)"; }}
                          onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                        >
                          <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: isActive ? "rgba(255,255,255,.15)" : "rgba(0,0,0,.04)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            overflow: "hidden",
                          }}>
                            <CountryFlag code={c.country_code} size={28} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14.5, fontWeight: 600, color: isActive ? "#fff" : "#1a1a1a", lineHeight: 1.2 }}>
                              {c.name}
                            </div>
                            <div style={{ fontSize: 11.5, color: isActive ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.35)", marginTop: 3, lineHeight: 1 }}>
                              {c.currency}
                            </div>
                          </div>
                          {isActive && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={18} height={18} style={{ flexShrink: 0, opacity: 0.8 }}>
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Mobile search icon — hidden on desktop via CSS */}
            <button
              onClick={() => { setSearchModalOpen(true); setTimeout(() => mobileSearchRef.current?.focus(), 80); }}
              className="v6-search-mobile-btn"
              style={{
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                width: 38,
                height: 38,
                borderRadius: 4,
                cursor: "pointer",
                border: "none",
                background: "none",
                flexShrink: 0,
              }}
              aria-label="Search"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#f5f1ea" strokeWidth="2.2" strokeLinecap="round" width={20} height={20}>
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="v6-menu-btn"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "6px 10px",
                borderRadius: 4,
                cursor: "pointer",
                border: "1px solid transparent",
                background: "none",
              }}
            >
              {/* Mobile hamburger icon */}
              <svg
                className="v6-menu-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f5f1ea"
                strokeWidth="2.5"
                strokeLinecap="round"
                width={22}
                height={22}
              >
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
              {/* Desktop labels */}
              <span
                className="v6-acct-desktop"
                style={{
                  fontSize: 9.5,
                  color: "rgba(245,241,234,.45)",
                  lineHeight: 1,
                }}
              >
                {userName ? `Hello, ${userName}` : "Sign in"}
              </span>
              <span
                className="v6-acct-desktop"
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: "#f5f1ea",
                  lineHeight: 1.3,
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                Account
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  width={10}
                  height={10}
                  style={{ opacity: 0.5 }}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </button>
            {(!user || user.accountType?.toLowerCase() === "buyer") && (
            <Link
              href="/cart"
              className="v6-cart-link"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "6px 10px",
                borderRadius: 4,
                cursor: "pointer",
                position: "relative",
                border: "1px solid transparent",
                textDecoration: "none",
              }}
            >
              <div style={{ position: "relative" }}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f5f1ea"
                  strokeWidth="1.5"
                  width={26}
                  height={26}
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                </svg>
                <span
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -6,
                    background: "#d4783c",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 700,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  0
                </span>
              </div>
              <span className="v6-cart-label" style={{ fontSize: 11, fontWeight: 700, color: "#f5f1ea" }}>
                Cart
              </span>
            </Link>
            )}
          </div>
        </div>
        {/* Sub-nav — categories link to /browse?category=... */}
        <div style={{ background: "#243530", height: 34 }}>
          <div
            className="v6-sn-scroll v6-sn-row"
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              overflowX: "auto",
            }}
          >
            <button
              onClick={() => setFilterOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                paddingRight: 14,
                height: "100%",
                fontSize: 12,
                fontWeight: 700,
                color: "#f5f1ea",
                cursor: "pointer",
                flexShrink: 0,
                marginRight: 4,
                background: "none",
                border: "none",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                width={16}
                height={16}
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              All
            </button>
            {cats.map((cat) => (
              <Link
                key={cat}
                href={`/browse?category=${encodeURIComponent(cat.toLowerCase())}`}
                style={{
                  padding: "0 12px",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  fontSize: 11.5,
                  fontWeight: 500,
                  color: "rgba(245,241,234,.55)",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {cat}
              </Link>
            ))}
            <Link
              href="/signup?accountType=seller"
              style={{
                padding: "0 12px",
                height: "100%",
                display: "flex",
                alignItems: "center",
                fontSize: 11.5,
                fontWeight: 600,
                color: "#d4783c",
                textDecoration: "none",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              Become a Supplier
            </Link>
          </div>
        </div>
      </header>}

      {/* ── Hero carousel ── */}
      <div className="v6-hero-wrap" style={{ position: "relative", height: 580, overflow: "hidden" }}>
        {heroSlides.map((slide, i) => {
          const isActive = heroIdx === i;
          const isPrev = prevHeroIdx === i;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                opacity: isActive ? 1 : 0,
                zIndex: isActive ? 2 : isPrev ? 1 : 0,
                transition: reducedMotion ? "opacity .01s" : "opacity .95s cubic-bezier(.4,0,.2,1)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Image
                src={slide.img}
                alt={slide.h2}
                fill
                className="object-cover"
                style={{ objectPosition: slide.imgPosition }}
                sizes="100vw"
                priority={i === 0}
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  background:
                    "linear-gradient(108deg, rgba(10,16,12,.92) 0%, rgba(10,16,12,.56) 38%, rgba(10,16,12,.08) 70%, transparent 100%)",
                }}
              />
              <div
                className="v6-hero-pad"
                style={{
                  position: "relative",
                  zIndex: 1,
                  padding: "0 80px",
                  maxWidth: 1300,
                  margin: "0 auto",
                  width: "100%",
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "translateY(0)" : "translateY(20px)",
                  transition: reducedMotion
                    ? "opacity .01s"
                    : isActive
                    ? "opacity .7s ease .38s, transform .7s cubic-bezier(.22,1,.36,1) .38s"
                    : "opacity .2s ease, transform .2s ease",
                }}
              >
                <p
                  className="v6-hero-label"
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "rgba(245,241,234,.45)",
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    margin: "0 0 16px",
                  }}
                >
                  Procur · {currentCountryName}
                </p>
                <h2
                  className="v6-hero-h2"
                  style={{
                    fontSize: 54,
                    fontWeight: 800,
                    color: "#f5f1ea",
                    lineHeight: 1.08,
                    letterSpacing: "-1.5px",
                    maxWidth: 520,
                    whiteSpace: "pre-line",
                    margin: "0 0 14px",
                  }}
                >
                  {slide.h2}
                </h2>
                <p
                  className="v6-hero-body"
                  style={{
                    fontSize: 15,
                    color: "rgba(245,241,234,.75)",
                    maxWidth: 400,
                    lineHeight: 1.65,
                    fontWeight: 400,
                    margin: 0,
                  }}
                >
                  {slide.p}
                </p>
                <Link
                  href={slide.href}
                  className="v6-hero-cta"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    marginTop: 30,
                    padding: "13px 28px",
                    background: "#d4783c",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    borderRadius: 999,
                    textDecoration: "none",
                  }}
                >
                  {slide.cta}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    width={13}
                    height={13}
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          );
        })}

        {/* Prev / Next */}
        <button
          className="v6-slide-btn"
          onClick={() => goHero((heroIdx - 1 + 3) % 3)}
          style={{
            position: "absolute",
            top: "50%",
            left: 24,
            transform: "translateY(-50%)",
            zIndex: 3,
            width: 36,
            height: 36,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f5f1ea",
            color: "#1c2b23",
            cursor: "pointer",
            border: "none",
            transition: "opacity .2s",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={15} height={15}>
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          className="v6-slide-btn"
          onClick={() => goHero((heroIdx + 1) % 3)}
          style={{
            position: "absolute",
            top: "50%",
            right: 24,
            transform: "translateY(-50%)",
            zIndex: 3,
            width: 36,
            height: 36,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f5f1ea",
            color: "#1c2b23",
            cursor: "pointer",
            border: "none",
            transition: "opacity .2s",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={15} height={15}>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* ── Country Ticker (overlay at hero bottom) ── */}
        <CountryTicker />

      </div>

      {/* ── Main content wrapper ── */}
      <div className="v6-cw" style={{
        opacity: transitioning ? 0.4 : 1,
        transition: "opacity .3s ease",
        pointerEvents: transitioning ? "none" : "auto",
      }}>
        {/* ── Category shelf (overlaps hero) ── */}
        {(loading || categoryBlocks.length > 0) && (
        <div className="v6-shelf">
          {loading
            ? [...Array(3)].map((_, i) => (
                <div key={i} className="v6-shelf-cat">
                  <div className="skel" style={{ width: 80, height: 18, borderRadius: 6, marginBottom: 12 }} />
                  <div style={{ display: "flex", gap: 10 }}>
                    {[0, 1].map((j) => (
                      <div key={j} className="skel" style={{ width: 130, height: 164, borderRadius: 12, flexShrink: 0 }} />
                    ))}
                  </div>
                </div>
              ))
            : categoryBlocks.map((block) => (
                <div key={block.title} className="v6-shelf-cat">
                  <div className="v6-shelf-header">
                    <h3 className="v6-shelf-title">{block.title}</h3>
                    <Link href={block.browseHref} className="v6-shelf-see-all">
                      See all
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </Link>
                  </div>
                  <div className="v6-shelf-items">
                    {block.items.map((item) => (
                      <Link
                        key={item.label}
                        href={block.browseHref}
                        className="v6-shelf-item"
                      >
                        <div className="v6-shelf-item-img">
                          <ProductImg src={item.img} alt={item.label} sizes="140px" />
                        </div>
                        <span className="v6-shelf-item-label">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
        </div>
        )}

        {/* ── Country Pulse ── */}
        <CountryPulseSection
          countryCode={effectiveCountryCode}
          countryName={currentCountryName}
        />

        {/* ── Empty state when no products for this country ── */}
        {!loading && products.length === 0 && (
          <div style={{ textAlign: "center", padding: "120px 20px 80px" }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: 999,
              background: "rgba(45,74,62,.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}>
              <CountryFlag code={currentCountryIso} size={40} />
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 700, color: "#1c2b23", margin: "0 0 10px", lineHeight: 1.3, letterSpacing: "-0.01em" }}>
              Coming soon to {currentCountryName}
            </h3>
            <p style={{ fontSize: 14.5, color: "#8a9e92", maxWidth: 380, margin: "0 auto 40px", lineHeight: 1.6 }}>
              We&apos;re working to bring Procur to {currentCountryName}. Explore fresh produce available in other countries.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
              {countries.filter((c) => c.code !== countryCode).map((c) => (
                <button
                  key={c.code}
                  onClick={() => handleCountrySelect(c.code)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "14px 22px",
                    borderRadius: 14,
                    border: "none",
                    background: "rgba(45,74,62,.045)",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#2d4a3e",
                    transition: "all .2s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(45,74,62,.09)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(45,74,62,.045)"; }}
                >
                  <CountryFlag code={c.country_code} size={22} />
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Best sellers scroll ── */}
        {products.length > 0 && <SecH
          title={`Best sellers in ${currentCountryName}`}
          linkText="View all"
          linkHref="/browse"
        />}
        {(loading || products.length > 0) && <div style={{ position: "relative" }}>
          <div ref={bestSellersRef} className="v6-prod-scroll">
            {loading
              ? [...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="skel"
                    style={{
                      flex: "0 0 180px",
                      borderRadius: 12,
                      height: 240,
                      flexShrink: 0,
                    }}
                  />
                ))
              : bestSellers.map((p) => (
                  <Link
                    key={p.id + p.seller.id}
                    href={toProductHref(p)}
                    style={{
                      flex: "0 0 180px",
                      background: "#f5f1ea",
                      borderRadius: 12,
                      overflow: "hidden",
                      cursor: "pointer",
                      textDecoration: "none",
                      color: "inherit",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "1/1",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <ProductImg
                        src={productImage(p)}
                        alt={p.name}
                        sizes="180px"
                      />
                    </div>
                    <div style={{ padding: "10px 12px 12px" }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#1c2b23",
                          marginBottom: 1,
                        }}
                      >
                        {p.name}
                      </div>
                      <div
                        style={{
                          fontSize: 10.5,
                          color: "#8a9e92",
                          marginBottom: 4,
                        }}
                      >
                        {p.seller.name}
                      </div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#2d4a3e",
                        }}
                      >
                        ${p.current_price.toFixed(2)}{" "}
                        <span
                          style={{
                            fontWeight: 400,
                            fontSize: 10,
                            color: "#8a9e92",
                          }}
                        >
                          /{p.unit}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
          <button
            className="v6-arr v6-arr-l"
            onClick={() => scrollSect(bestSellersRef, -1)}
            style={{
              position: "absolute",
              left: -16,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "#fff",
              border: "1px solid #ebe7df",
              boxShadow: "0 2px 8px rgba(28,43,35,.1)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#3e5549",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              width={14}
              height={14}
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            className="v6-arr v6-arr-r"
            onClick={() => scrollSect(bestSellersRef, 1)}
            style={{
              position: "absolute",
              right: -16,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "#fff",
              border: "1px solid #ebe7df",
              boxShadow: "0 2px 8px rgba(28,43,35,.1)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#3e5549",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              width={14}
              height={14}
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>}

        {/* ── Meet the farmers ── */}
        {(loading || sellers.length > 0) && <SecH
          title="Meet the farmers"
          linkText="All sellers"
          linkHref="/sellers"
        />}
        {(loading || sellers.length > 0) && <div className="v6-seller-grid">
          {loading
            ? [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="skel"
                  style={{ borderRadius: 12, height: 200 }}
                />
              ))
            : popularSellers.map((s: LandingSeller, idx: number) => (
                <Link
                  key={s.id}
                  href={buildSellerUrl({
                    id: s.id,
                    slug: s.slug ?? undefined,
                    location: s.location ?? undefined,
                  })}
                  style={{
                    background: "#f5f1ea",
                    borderRadius: 12,
                    overflow: "hidden",
                    cursor: "pointer",
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                  }}
                >
                  {/* Cover — use seller's own header image, fall back to static covers */}
                  <div
                    style={{ width: "100%", height: 100, position: "relative" }}
                  >
                    <Image
                      src={
                        s.header_image_url ||
                        SELLER_COVERS[idx % SELLER_COVERS.length]
                      }
                      alt={s.name}
                      fill
                      className="object-cover"
                      sizes="300px"
                    />
                  </div>
                  <div style={{ padding: "0 16px 16px", position: "relative" }}>
                    {/* Avatar — logo if available, else coloured initial */}
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        marginTop: -24,
                        border: "3px solid #f5f1ea",
                        position: "relative",
                        zIndex: 1,
                        background: selColor(s.name),
                        flexShrink: 0,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {s.logo_url ? (
                        <Image
                          src={s.logo_url}
                          alt={s.name}
                          width={48}
                          height={48}
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            fontSize: 18,
                            fontWeight: 700,
                            color: "#f5f1ea",
                          }}
                        >
                          {s.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        marginTop: 8,
                        color: "#1c2b23",
                      }}
                    >
                      {s.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#8a9e92",
                        marginBottom: 10,
                      }}
                    >
                      {s.location || currentCountryName}
                    </div>
                  </div>
                </Link>
              ))}
        </div>}

        {/* ── Browse other countries ── */}
        {!loading && products.length > 0 && countries.length > 1 && (
          <div style={{ padding: "20px 0 0" }}>
            <SecH title="Browse other countries" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {countries.filter((c) => c.code !== countryCode).map((c) => (
                <button
                  key={c.code}
                  onClick={() => handleCountrySelect(c.code)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 20px",
                    borderRadius: 12,
                    border: "1.5px solid rgba(45,74,62,.1)",
                    background: "#f5f1ea",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#2d4a3e",
                    transition: "all .15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#2d4a3e"; e.currentTarget.style.background = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(45,74,62,.1)"; e.currentTarget.style.background = "#f5f1ea"; }}
                >
                  <CountryFlag code={c.country_code} size={28} />
                  <div style={{ textAlign: "left" }}>
                    <div style={{ lineHeight: 1.2 }}>{c.name}</div>
                    <div style={{ fontSize: 11, fontWeight: 400, color: "#8a9e92", marginTop: 2 }}>{c.currency}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Testimonials ── */}
        <SecH title="What buyers & sellers say" />
        <div
          className="v6-ticker"
          style={{
            position: "relative",
            overflow: "hidden",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0, #000 80px, #000 calc(100% - 80px), transparent 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0, #000 80px, #000 calc(100% - 80px), transparent 100%)",
          }}
        >
          <div
            className="v6-ticker-track"
            style={{
              display: "flex",
              gap: 12,
              width: "max-content",
              animation: "v6-ticker-scroll 60s linear infinite",
            }}
          >
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => {
              const sub =
                "farm" in t
                  ? (t as typeof t & { farm: string }).farm
                  : t.location;
              return (
                <figure
                  key={i}
                  aria-hidden={i >= TESTIMONIALS.length}
                  style={{
                    flex: "0 0 380px",
                    minHeight: 280,
                    padding: "8px 32px 8px 0",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    margin: 0,
                  }}
                >
                  <blockquote
                    style={{
                      fontSize: 14,
                      fontWeight: 400,
                      lineHeight: 1.65,
                      color: "#3e5549",
                      margin: 0,
                      letterSpacing: "-0.1px",
                    }}
                  >
                    {t.quote}
                  </blockquote>
                  <figcaption
                    style={{
                      marginTop: 16,
                      fontSize: 12,
                      color: "#8a9e92",
                      letterSpacing: "-0.05px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <span style={{ fontWeight: 700, color: "#1c2b23" }}>
                      {t.name}
                    </span>
                    <span style={{ margin: "0 6px", opacity: 0.5 }}>·</span>
                    {sub}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>

        {/* ── Pre-footer CTA ── */}
        <div
          className="v6-cta-box"
          style={{
            margin: "56px 0 80px",
            background: "#2d4a3e",
            borderRadius: 18,
            padding: "120px 52px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#f5f1ea",
                marginBottom: 6,
                letterSpacing: "-.2px",
              }}
            >
              Ready to buy fresh produce?
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "rgba(245,241,234,.55)",
                lineHeight: 1.55,
                margin: 0,
              }}
            >
              Source directly from verified {currentCountryName} farms at fair,
              transparent prices.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link
              href="/browse"
              style={{
                padding: "11px 26px",
                background: "#f5f1ea",
                color: "#1c2b23",
                fontSize: 13,
                fontWeight: 700,
                borderRadius: 999,
                textDecoration: "none",
              }}
            >
              Browse Produce
            </Link>
            <Link
              href="/signup?accountType=seller"
              style={{
                padding: "11px 26px",
                background: "transparent",
                border: "1px solid rgba(245,241,234,.25)",
                color: "#f5f1ea",
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 999,
                textDecoration: "none",
              }}
            >
              Become a Supplier
            </Link>
          </div>
        </div>
      </div>
      {/* end v6-cw */}

      {/* ── Footer ── */}
      <footer style={{ background: "#0a0a0a", color: "#f5f1ea" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 20px" }}>
          <div className="v6-ft-top" style={{ padding: "80px 0 64px" }}>
            <h2
              className="v6-ft-h2"
              style={{
                fontSize: 40,
                fontWeight: 700,
                lineHeight: 1.15,
                maxWidth: 520,
                marginBottom: 16,
                letterSpacing: "-.5px",
                color: "#f5f1ea",
              }}
            >
              Building stronger food systems across the Caribbean and beyond.
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "rgba(245,241,234,.65)",
                maxWidth: 440,
                lineHeight: 1.65,
                marginBottom: 28,
                margin: "0 0 28px 0",
              }}
            >
              Procur connects buyers directly with verified farmers: transparent
              pricing, reliable supply, and produce that&apos;s never more than
              a day from harvest.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link
                href="/signup?accountType=buyer"
                style={{
                  padding: "12px 28px",
                  background: "#f5f1ea",
                  color: "#1c2b23",
                  fontSize: 13,
                  fontWeight: 700,
                  borderRadius: 999,
                  textDecoration: "none",
                }}
              >
                Start buying
              </Link>
              <Link
                href="/signup?accountType=seller"
                style={{
                  padding: "12px 28px",
                  background: "transparent",
                  color: "#f5f1ea",
                  fontSize: 13,
                  fontWeight: 600,
                  borderRadius: 999,
                  border: "1px solid rgba(245,241,234,.2)",
                  textDecoration: "none",
                }}
              >
                Become a supplier
              </Link>
            </div>
          </div>

          <div style={{ height: 1, background: "rgba(245,241,234,.08)" }} />

          <div className="v6-ft-row" style={{ display: "flex", gap: 60, padding: "48px 0 40px" }}>
            <div className="v6-ft-brand" style={{ flexShrink: 0, width: 240 }}>
              <Image
                src="/images/logos/procur-logo.svg"
                alt="Procur"
                width={80}
                height={21}
                style={{ filter: "brightness(0) invert(1)", opacity: 0.75 }}
              />
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(245,241,234,.55)",
                  lineHeight: 1.65,
                  marginTop: 16,
                  marginBottom: 0,
                }}
              >
                Procur is {currentCountryName}&apos;s agricultural marketplace, purpose-built
                to shorten supply chains and strengthen local food economies.
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                {[
                  {
                    href: "https://www.facebook.com/procurapp",
                    icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" width={14} height={14}>
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                      </svg>
                    ),
                  },
                  {
                    href: "https://www.linkedin.com/company/procurinc",
                    icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" width={14} height={14}>
                        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    ),
                  },
                  {
                    href: "https://www.instagram.com/procurhq",
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={14} height={14}>
                        <rect x="2" y="2" width="20" height="20" rx="5" />
                        <circle cx="12" cy="12" r="4.5" />
                        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                      </svg>
                    ),
                  },
                ].map((social) => (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      border: "1px solid rgba(245,241,234,.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "rgba(245,241,234,.55)",
                      textDecoration: "none",
                    }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <div
              className="v6-ft-cols"
              style={{
                flex: 1,
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 20,
              }}
            >
              {[
                {
                  title: "Platform",
                  links: [
                    { label: "Browse Produce", href: "/browse" },
                    {
                      label: "For Suppliers",
                      href: "/signup?accountType=seller",
                    },
                    { label: "For Buyers", href: "/signup?accountType=buyer" },
                    { label: "Log in", href: "/login" },
                  ],
                },
                {
                  title: "Solutions",
                  links: [
                    { label: "Restaurants", href: "/solutions/restaurants" },
                    { label: "Hotels", href: "/solutions/hotels" },
                    { label: "Grocery", href: "/solutions/grocery" },
                    { label: "Government", href: "/solutions/government" },
                    { label: "Agriculture", href: "/solutions/agriculture" },
                  ],
                },
                {
                  title: "Company",
                  links: [
                    { label: "About Procur", href: "/company/about" },
                    { label: "Blog", href: "/blog" },
                    { label: "Contact", href: "/company/contact" },
                  ],
                },
                {
                  title: "Resources",
                  links: [
                    { label: "Help Center", href: "/help" },
                    { label: "FAQ", href: "/help/faq" },
                    { label: "Supplier Guide", href: "/supplier-guide" },
                    { label: "Buyer Guide", href: "/buyer-guide" },
                  ],
                },
              ].map((col) => (
                <div key={col.title}>
                  <h5
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "rgba(245,241,234,.5)",
                      marginBottom: 14,
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {col.title}
                  </h5>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {col.links.map((link) => (
                      <li key={link.label} style={{ marginBottom: 8 }}>
                        <Link
                          href={link.href}
                          style={{
                            fontSize: 12.5,
                            color: "rgba(245,241,234,.55)",
                            textDecoration: "none",
                          }}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div
            className="v6-ft-bar"
            style={{
              paddingTop: 18,
              paddingBottom: 28,
              borderTop: "1px solid rgba(245,241,234,.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontSize: 11,
                color: "rgba(245,241,234,.35)",
                margin: 0,
              }}
            >
              &copy; 2026 Procur {currentCountryName} Ltd. All rights reserved.
            </p>
            <div className="v6-ft-links" style={{ display: "flex", gap: 16 }}>
              {[
                { label: "Privacy", href: "/legal/privacy" },
                { label: "Terms", href: "/legal/terms" },
                { label: "Cookies", href: "/legal/cookies" },
                { label: "Accessibility", href: "/accessibility" },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  style={{
                    fontSize: 11,
                    color: "rgba(245,241,234,.35)",
                    textDecoration: "none",
                  }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>

    {/* Logout confirmation modal */}
    {logoutModalOpen && (
      <>
        <div
          onClick={() => setLogoutModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.4)",
            backdropFilter: "blur(3px)",
            WebkitBackdropFilter: "blur(3px)",
            zIndex: 9998,
          }}
        />
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#fff",
            borderRadius: 20,
            padding: "32px 28px 24px",
            width: "90%",
            maxWidth: 340,
            zIndex: 9999,
            textAlign: "center",
          }}
        >
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 999,
            background: "rgba(220,38,38,.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 18px",
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" width={24} height={24}>
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1c2b23", margin: "0 0 6px" }}>
            Log out?
          </h3>
          <p style={{ fontSize: 13.5, color: "#8a9e92", margin: "0 0 24px", lineHeight: 1.5 }}>
            Are you sure you want to log out of your account?
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setLogoutModalOpen(false)}
              style={{
                flex: 1,
                padding: "11px 0",
                borderRadius: 12,
                border: "1.5px solid rgba(0,0,0,.1)",
                background: "#fff",
                fontSize: 13.5,
                fontWeight: 600,
                color: "#1c2b23",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setLogoutModalOpen(false);
                appDispatch(signout());
                router.replace("/login");
              }}
              style={{
                flex: 1,
                padding: "11px 0",
                borderRadius: 12,
                border: "none",
                background: "#dc2626",
                fontSize: 13.5,
                fontWeight: 600,
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Log out
            </button>
          </div>
        </div>
      </>
    )}
    </>
  );
}
