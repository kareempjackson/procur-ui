"use client";

import React, { useEffect, useMemo, useRef, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchActiveCountries,
  selectCountry,
  selectCountries,
  setCountryFromCode,
} from "@/store/slices/countrySlice";
import { getApiClient } from "@/lib/apiClient";

// ─── Country flag ────────────────────────────────────────────────────────────
function CountryFlag({ code, size = 14 }: { code: string; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
      srcSet={`https://flagcdn.com/w80/${code.toLowerCase()}.png 2x`}
      alt={code}
      width={size}
      height={Math.round(size * 0.75)}
      style={{
        borderRadius: 2,
        objectFit: "cover",
        display: "inline-block",
        verticalAlign: "middle",
      }}
    />
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────
type BrowseProduct = {
  id: string;
  name: string;
  category: string;
  current_price: number;
  unit: string;
  image_url?: string | null;
  in_stock?: boolean | null;
  seller: {
    id: string;
    name: string;
    logo_url?: string | null;
    location?: string | null;
    average_rating?: number | null;
    review_count?: number | null;
    completed_orders?: number | null;
    is_verified?: boolean | null;
  };
};

// ─── Fallback data ────────────────────────────────────────────────────────────
const FALLBACK: BrowseProduct[] = [
  {
    id: "1",
    name: "Plantain",
    category: "Vegetables",
    current_price: 2.5,
    unit: "lb",
    in_stock: true,
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
    in_stock: true,
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
    in_stock: true,
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
    in_stock: true,
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
    in_stock: true,
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
    in_stock: true,
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
    in_stock: true,
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
    in_stock: true,
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
  {
    id: "9",
    name: "Dasheen",
    category: "Root Crops",
    current_price: 3.5,
    unit: "lb",
    in_stock: true,
    image_url:
      "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400&h=400&fit=crop",
    seller: {
      id: "s3",
      name: "R&K Farms",
      location: "St. George",
      is_verified: true,
      completed_orders: 32,
    },
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const IMG_FALLBACK =
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop";

function PImg({ src, alt }: { src: string; alt: string }) {
  const [s, setS] = useState(src);
  useEffect(() => {
    setS(src);
  }, [src]);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={s}
      alt={alt}
      onError={() => setS(IMG_FALLBACK)}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  );
}

function toHref(p: BrowseProduct) {
  const countrySlug = (p.seller.location ?? "caribbean")
    .toLowerCase()
    .replace(/\s+/g, "-");
  const productSlug = `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${p.id}`;
  return `/products/${countrySlug}/${productSlug}`;
}

function parseBrowseProduct(p: Record<string, unknown>): BrowseProduct {
  const seller = (p.seller as Record<string, unknown>) ?? {};
  return {
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
    in_stock: (p.in_stock as boolean | null) ?? null,
    seller: {
      id: String(seller.id ?? ""),
      name: String(seller.name ?? "Seller"),
      logo_url: (seller.logo_url as string | null) ?? null,
      location: (seller.location as string | null) ?? null,
      average_rating: (seller.average_rating as number | null) ?? null,
      review_count: (seller.review_count as number | null) ?? null,
      completed_orders: (seller.completed_orders as number | null) ?? null,
      is_verified: (seller.is_verified as boolean | null) ?? null,
    },
  };
}

const PAGE_LIMIT = 40;

// ─── Browse content (requires Suspense for useSearchParams) ──────────────────
function BrowseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initQ = searchParams.get("q") ?? "";
  const initCat = searchParams.get("category") ?? "";

  const [searchInput, setSearchInput] = useState(initQ);
  const [query, setQuery] = useState(initQ);
  const [selectedCats, setSelectedCats] = useState<string[]>(
    initCat ? [initCat] : [],
  );
  const [sortBy, setSortBy] = useState("relevance");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [products, setProducts] = useState<BrowseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Country context (Redux + cookie hydration) ──
  const dispatch = useAppDispatch();
  const { code: countryCode, name: countryName } = useAppSelector(selectCountry);
  const countries = useAppSelector(selectCountries);
  const [cookieCountryCode, setCookieCountryCode] = useState<string | null>(null);
  const effectiveCountryCode = countryCode || cookieCountryCode || "gda";

  useEffect(() => {
    dispatch(fetchActiveCountries());
    const fromCookie =
      typeof document !== "undefined"
        ? document.cookie.match(/(?:^|;\s*)country_code=([^;]*)/)?.[1] || null
        : null;
    if (fromCookie && fromCookie !== cookieCountryCode) {
      setCookieCountryCode(fromCookie);
    }
    if (!countryCode && fromCookie) {
      dispatch(setCountryFromCode(fromCookie));
    }
  }, [dispatch, countryCode, cookieCountryCode]);

  const currentCountry = countries.find((c) => c.code === effectiveCountryCode);
  const currentCountryIso = currentCountry?.country_code || "GD";
  const currentCountryName = currentCountry?.name || countryName || "Grenada";

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset pagination when country changes
  useEffect(() => {
    setPage(1);
  }, [effectiveCountryCode]);

  // Fetch the current page — appends when page > 1, replaces on page 1
  useEffect(() => {
    let cancelled = false;
    const api = getApiClient(() => null);
    const isFirstPage = page === 1;
    if (isFirstPage) setLoading(true);
    else setLoadingMore(true);
    (async () => {
      try {
        const params: Record<string, string | number> = {
          limit: PAGE_LIMIT,
          page,
        };
        if (effectiveCountryCode) params.country_id = effectiveCountryCode;
        const res = await api.get("/marketplace/products", { params });
        if (cancelled) return;
        const raw = res?.data?.products;
        const t = typeof res?.data?.total === "number" ? res.data.total : 0;
        const parsed = Array.isArray(raw) ? raw.map(parseBrowseProduct) : [];
        setTotal(t);
        if (isFirstPage) {
          setProducts(parsed.length > 0 ? parsed : FALLBACK);
        } else if (parsed.length > 0) {
          setProducts((prev) => [...prev, ...parsed]);
        }
      } catch {
        if (!cancelled && isFirstPage) setProducts(FALLBACK);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [effectiveCountryCode, page]);

  // Infinite scroll: request next page when sentinel enters view
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const hasMore = products.length < total;
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0]?.isIntersecting &&
          !loading &&
          !loadingMore &&
          products.length < total
        ) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loading, loadingMore, products.length, total]);

  // ── Mobile detection ──
  useEffect(() => {
    function check() { setIsMobile(window.innerWidth < 768); }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Derived ──
  const cats = useMemo(
    () => [...new Set(products.map((p) => p.category))].sort(),
    [products],
  );

  const catCounts = useMemo(() => {
    const m: Record<string, number> = {};
    products.forEach((p) => {
      m[p.category] = (m[p.category] ?? 0) + 1;
    });
    return m;
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return products
      .filter((p) => {
        const catOk =
          selectedCats.length === 0 ||
          selectedCats.some(
            (c) => p.category.toLowerCase() === c.toLowerCase(),
          );
        const qOk =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.seller.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q);
        const availOk = !availableOnly || p.in_stock === true;
        return catOk && qOk && availOk;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return a.current_price - b.current_price;
        if (sortBy === "price_desc") return b.current_price - a.current_price;
        return 0;
      });
  }, [products, selectedCats, query, sortBy, availableOnly]);

  // ── URL helpers ──
  function pushURL(params: { q?: string; category?: string }) {
    const p = new URLSearchParams(window.location.search);
    if (params.q !== undefined) params.q ? p.set("q", params.q) : p.delete("q");
    if (params.category !== undefined)
      params.category
        ? p.set("category", params.category)
        : p.delete("category");
    const base = `/${effectiveCountryCode}/browse`;
    router.replace(`${base}${p.toString() ? "?" + p.toString() : ""}`, {
      scroll: false,
    });
  }

  function handleSearch() {
    const q = searchInput.trim();
    setQuery(q);
    pushURL({ q });
  }

  function toggleCat(cat: string) {
    setSelectedCats((prev) => {
      const next = prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat];
      pushURL({ category: next.length === 1 ? next[0] : "" });
      return next;
    });
  }

  function resetFilters() {
    setSelectedCats([]);
    setQuery("");
    setSearchInput("");
    setAvailableOnly(false);
    setSidebarOpen(false);
    router.replace(`/${effectiveCountryCode}/browse`, { scroll: false });
  }

  const activeCount =
    selectedCats.length + (query ? 1 : 0) + (availableOnly ? 1 : 0);

  // ── Render ──
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fafaf9",
        fontFamily: "'Urbanist', system-ui, sans-serif",
        WebkitFontSmoothing: "antialiased",
        color: "#1c2b23",
      }}
    >
      {/* ── Menu overlay ── */}
      <div
        onClick={() => setMenuOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
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
          width: 280,
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
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6a7f73"
              strokeWidth="2.5"
              strokeLinecap="round"
              width={13}
              height={13}
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div style={{ flex: 1, padding: "4px 8px", overflowY: "auto" }}>
          {[
            { label: "Home", href: "/" },
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
        </div>
        <div style={{ padding: "12px 18px", borderTop: "1px solid #ebe7df" }}>
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
        </div>
      </div>

      {/* ── Teal header ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "#2d4a3e",
        }}
      >
        <div
          style={{
            height: 58,
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
          }}
        >
          <Link
            href="/"
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
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <CountryFlag code={currentCountryIso} size={11} />
              {currentCountryName}
            </span>
          </Link>
          {/* Search bar */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              background: "rgba(255,255,255,.12)",
              borderRadius: 999,
              height: 38,
              margin: "0 16px",
              border: "1px solid rgba(255,255,255,.14)",
              padding: "0 4px 0 16px",
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
                onClick={() => {
                  setSearchInput("");
                  setQuery("");
                  pushURL({ q: "" });
                }}
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
          {/* Right */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => setMenuOpen(true)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "6px 10px",
                borderRadius: 4,
                cursor: "pointer",
                border: "none",
                background: "none",
              }}
            >
              <span
                style={{
                  fontSize: 9.5,
                  color: "rgba(245,241,234,.45)",
                  lineHeight: 1,
                }}
              >
                Sign in
              </span>
              <span
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
            <Link
              href="/cart"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "6px 10px",
                borderRadius: 4,
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
              <span style={{ fontSize: 11, fontWeight: 700, color: "#f5f1ea" }}>
                Cart
              </span>
            </Link>
          </div>
        </div>
        {/* Sub-nav */}
        <div style={{ background: "#243530", height: 34 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              padding: "0 20px",
              overflowX: "auto",
              scrollbarWidth: "none",
            }}
          >
            <Link
              href="/browse"
              onClick={resetFilters}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                paddingRight: 14,
                height: "100%",
                fontSize: 12,
                fontWeight: 700,
                color: "#f5f1ea",
                textDecoration: "none",
                flexShrink: 0,
                marginRight: 4,
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
            </Link>
            {cats.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCats([cat]);
                  pushURL({ category: cat.toLowerCase() });
                }}
                style={{
                  padding: "0 12px",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  fontSize: 11.5,
                  fontWeight: selectedCats.includes(cat) ? 700 : 500,
                  color: selectedCats.includes(cat)
                    ? "#f5f1ea"
                    : "rgba(245,241,234,.55)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  borderBottom: selectedCats.includes(cat)
                    ? "2px solid #d4783c"
                    : "2px solid transparent",
                }}
              >
                {cat}
              </button>
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
      </header>

      {/* ── Results banner ── */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #ebe7df",
          padding: "10px 24px",
          fontSize: 13,
          color: "#6a7f73",
        }}
      >
        {loading ? (
          "Loading…"
        ) : (
          <>
            {query && (
              <>
                <span style={{ color: "#1c2b23", fontWeight: 600 }}>
                  {filtered.length} results
                </span>{" "}
                for &ldquo;
                <span style={{ color: "#1c2b23", fontWeight: 700 }}>
                  {query}
                </span>
                &rdquo;
              </>
            )}
            {!query && selectedCats.length > 0 && (
              <>
                <span style={{ color: "#1c2b23", fontWeight: 600 }}>
                  {filtered.length} products
                </span>{" "}
                in{" "}
                <span style={{ color: "#1c2b23", fontWeight: 700 }}>
                  {selectedCats.join(", ")}
                </span>
              </>
            )}
            {!query && selectedCats.length === 0 && (
              <>
                <span style={{ color: "#1c2b23", fontWeight: 600 }}>
                  {filtered.length}
                </span>{" "}
                products available in {currentCountryName}
              </>
            )}
          </>
        )}
      </div>

      {/* ── Main layout ── */}
      <div
        style={{
          maxWidth: 1300,
          margin: "0 auto",
          padding: isMobile ? "16px" : "20px 24px",
          display: "flex",
          gap: isMobile ? 0 : 28,
          alignItems: "flex-start",
        }}
      >
        {/* ── Mobile filter backdrop ── */}
        {isMobile && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 298 }}
          />
        )}

        {/* ── Left sidebar ── */}
        <aside
          style={{
            width: isMobile ? 280 : 220,
            flexShrink: 0,
            ...(isMobile
              ? {
                  position: "fixed" as const,
                  top: 0,
                  left: 0,
                  bottom: 0,
                  zIndex: 299,
                  background: "#fff",
                  transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
                  transition: "transform .3s cubic-bezier(.4,0,.2,1)",
                  overflowY: "auto" as const,
                  padding: "16px",
                  boxShadow: sidebarOpen ? "4px 0 24px rgba(0,0,0,.15)" : "none",
                }
              : { position: "sticky" as const, top: 110 }),
          }}
        >
          {/* Mobile sidebar header */}
          {isMobile && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #ebe7df" }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#1c2b23" }}>Filters</span>
              <button onClick={() => setSidebarOpen(false)} style={{ width: 30, height: 30, borderRadius: "50%", background: "#f5f1ea", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#6a7f73" strokeWidth="2.5" strokeLinecap="round" width={13} height={13}><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
          )}

          {activeCount > 0 && (
            <button
              onClick={resetFilters}
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#2d4a3e",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0 0 16px",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                width={11}
                height={11}
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
              Clear all filters
            </button>
          )}

          {/* Department */}
          <div
            style={{
              marginBottom: 20,
              paddingBottom: 20,
              borderBottom: "1px solid #ebe7df",
            }}
          >
            <h4
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#1c2b23",
                marginBottom: 12,
                letterSpacing: "-.1px",
              }}
            >
              Department
            </h4>
            <button
              onClick={() => {
                setSelectedCats([]);
                pushURL({ category: "" });
              }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                padding: "4px 0",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: selectedCats.length === 0 ? 700 : 400,
                color: selectedCats.length === 0 ? "#1c2b23" : "#407178",
                textAlign: "left",
              }}
            >
              <span>All Departments</span>
              <span style={{ fontSize: 11, color: "#8a9e92" }}>
                {products.length}
              </span>
            </button>
            {cats.map((cat) => {
              const active = selectedCats.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCat(cat)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    padding: "4px 0 4px 10px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: 13,
                    fontWeight: active ? 700 : 400,
                    color: active ? "#1c2b23" : "#407178",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 5 }}
                  >
                    {active && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#2d4a3e"
                        strokeWidth="3"
                        strokeLinecap="round"
                        width={9}
                        height={9}
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    )}
                    {cat}
                  </span>
                  <span style={{ fontSize: 11, color: "#8a9e92" }}>
                    {catCounts[cat] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Availability */}
          <div
            style={{
              marginBottom: 20,
              paddingBottom: 20,
              borderBottom: "1px solid #ebe7df",
            }}
          >
            <h4
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#1c2b23",
                marginBottom: 12,
                letterSpacing: "-.1px",
              }}
            >
              Availability
            </h4>
            <button
              onClick={() => setAvailableOnly((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "4px 0",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: availableOnly ? 700 : 400,
                color: availableOnly ? "#1c2b23" : "#407178",
                textAlign: "left",
                width: "100%",
              }}
            >
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  border: `2px solid ${availableOnly ? "#2d4a3e" : "#c5bdb0"}`,
                  background: availableOnly ? "#2d4a3e" : "transparent",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background .15s, border-color .15s",
                }}
              >
                {availableOnly && (
                  <svg viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" width={9} height={9}>
                    <path d="M2 6l3 3 5-5" />
                  </svg>
                )}
              </span>
              In Stock
            </button>
          </div>

          {/* Sort */}
          <div>
            <h4
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#1c2b23",
                marginBottom: 12,
              }}
            >
              Sort By
            </h4>
            {[
              { label: "Relevance", value: "relevance" },
              { label: "Price: Low to High", value: "price_asc" },
              { label: "Price: High to Low", value: "price_desc" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "4px 0",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 13,
                  fontWeight: sortBy === opt.value ? 700 : 400,
                  color: sortBy === opt.value ? "#1c2b23" : "#407178",
                  textAlign: "left",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </aside>

        {/* ── Results ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Mobile: Filters toggle button */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                background: "#fff",
                border: "1px solid #d8d2c8",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                color: "#1c2b23",
                cursor: "pointer",
                fontFamily: "inherit",
                marginBottom: 10,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={13} height={13}>
                <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="10" y1="18" x2="14" y2="18" />
              </svg>
              Filters{activeCount > 0 ? ` (${activeCount})` : ""}
            </button>
          )}

          {/* Top bar: active chips + sort */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
              paddingBottom: 12,
              borderBottom: "1px solid #ebe7df",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {selectedCats.map((cat) => (
                <span
                  key={cat}
                  onClick={() => toggleCat(cat)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "4px 10px",
                    background: "#2d4a3e",
                    color: "#f5f1ea",
                    fontSize: 11,
                    fontWeight: 600,
                    borderRadius: 999,
                    cursor: "pointer",
                  }}
                >
                  {cat}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    width={9}
                    height={9}
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </span>
              ))}
              {availableOnly && (
                <span
                  onClick={() => setAvailableOnly(false)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "4px 10px",
                    background: "#2d4a3e",
                    color: "#f5f1ea",
                    fontSize: 11,
                    fontWeight: 600,
                    borderRadius: 999,
                    cursor: "pointer",
                  }}
                >
                  In Stock
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    width={9}
                    height={9}
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </span>
              )}
              {query && (
                <span
                  onClick={() => {
                    setQuery("");
                    setSearchInput("");
                    pushURL({ q: "" });
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "4px 10px",
                    background: "#d4783c",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 600,
                    borderRadius: 999,
                    cursor: "pointer",
                  }}
                >
                  &ldquo;{query}&rdquo;
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    width={9}
                    height={9}
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </span>
              )}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                fontSize: 12,
                color: "#1c2b23",
                border: "1px solid #d8d2c8",
                borderRadius: 6,
                padding: "5px 10px",
                background: "#fff",
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          {/* Grid */}
          {loading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 12,
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  style={{
                    borderRadius: 12,
                    background: "#ebe7df",
                    aspectRatio: "1/1",
                    animation: "pulse 1.5s ease-in-out infinite",
                  }}
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "80px 0", textAlign: "center" }}>
              <p style={{ fontSize: 16, color: "#8a9e92", marginBottom: 16 }}>
                No products match your search.
              </p>
              <button
                onClick={resetFilters}
                style={{
                  padding: "10px 24px",
                  background: "#2d4a3e",
                  color: "#f5f1ea",
                  border: "none",
                  borderRadius: 999,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 12,
              }}
            >
              {filtered.map((p) => (
                <Link
                  key={p.id + p.seller.id}
                  href={toHref(p)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    background: "#fff",
                    borderRadius: 12,
                    overflow: "hidden",
                    textDecoration: "none",
                    color: "inherit",
                    border: "1px solid #ebe7df",
                    transition: "box-shadow .15s",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "1/1",
                      overflow: "hidden",
                      position: "relative",
                      background: "#f5f1ea",
                    }}
                  >
                    <PImg src={p.image_url || IMG_FALLBACK} alt={p.name} />
                  </div>
                  <div
                    style={{
                      padding: "10px 12px 12px",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#1c2b23",
                        marginBottom: 2,
                        lineHeight: 1.2,
                      }}
                    >
                      {p.name}
                    </div>
                    <div
                      style={{
                        fontSize: 10.5,
                        color: "#6a7f73",
                        marginBottom: 6,
                        flex: 1,
                      }}
                    >
                      {p.seller.name}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#2d4a3e",
                        }}
                      >
                        ${p.current_price.toFixed(2)}
                        <span
                          style={{
                            fontWeight: 400,
                            color: "#8a9e92",
                            fontSize: 10,
                          }}
                        >
                          /{p.unit}
                        </span>
                      </span>
                      {p.seller.is_verified && (
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            color: "#407178",
                            background: "rgba(64,113,120,.1)",
                            borderRadius: 4,
                            padding: "2px 5px",
                          }}
                        >
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <div
                      style={{ marginTop: 6, fontSize: 10.5, color: "#8a9e92" }}
                    >
                      {p.seller.location || ""}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Infinite-scroll sentinel + loading indicator */}
          {products.length < total && (
            <div
              ref={sentinelRef}
              style={{
                padding: "32px 0 8px",
                textAlign: "center",
                fontSize: 12,
                color: "#8a9e92",
              }}
            >
              {loadingMore ? "Loading more…" : ""}
            </div>
          )}
        </div>
      </div>
      {/* ── Footer ── */}
      <footer style={{ background: "#0a0a0a", color: "#f5f1ea" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: isMobile ? "0 16px" : "0 20px" }}>
          <div style={{ padding: isMobile ? "40px 0 32px" : "80px 0 64px" }}>
            <h2
              style={{
                fontSize: isMobile ? 24 : 40,
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

          <div style={{ display: "flex", flexDirection: isMobile ? "column" : undefined, gap: isMobile ? 24 : 60, padding: isMobile ? "24px 0 20px" : "48px 0 40px" }}>
            <div style={{ flexShrink: 0, width: isMobile ? "100%" : 240 }}>
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
                Procur is {currentCountryName}&apos;s agricultural marketplace,
                purpose-built to shorten supply chains and strengthen local food
                economies.
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                {[
                  <svg
                    key="x"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width={14}
                    height={14}
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.65l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>,
                  <svg
                    key="ig"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    width={14}
                    height={14}
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4.5" />
                    <circle
                      cx="17.5"
                      cy="6.5"
                      r="1"
                      fill="currentColor"
                      stroke="none"
                    />
                  </svg>,
                  <svg
                    key="li"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width={14}
                    height={14}
                  >
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>,
                  <svg
                    key="fb"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width={14}
                    height={14}
                  >
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>,
                ].map((icon, i) => (
                  <a
                    key={i}
                    href="#"
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
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            <div
              style={{
                flex: 1,
                display: "grid",
                gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
                gap: isMobile ? "16px 24px" : 20,
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
                    { label: "Pricing", href: "/pricing" },
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
                    { label: "About Procur", href: "/about" },
                    { label: "Blog", href: "/blog" },
                    { label: "Contact", href: "/contact" },
                    { label: "Careers", href: "/careers" },
                  ],
                },
                {
                  title: "Resources",
                  links: [
                    { label: "Help Center", href: "/help" },
                    { label: "FAQ", href: "/faq" },
                    { label: "Blog", href: "/blog" },
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
            style={{
              paddingTop: 18,
              paddingBottom: 28,
              borderTop: "1px solid rgba(245,241,234,.1)",
              display: "flex",
              flexDirection: isMobile ? "column" : undefined,
              justifyContent: "space-between",
              alignItems: isMobile ? "flex-start" : "center",
              gap: isMobile ? 10 : undefined,
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
            <div style={{ display: "flex", gap: 16 }}>
              {[
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
                { label: "Cookies", href: "/cookies" },
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
  );
}

// ─── Page export with Suspense boundary ───────────────────────────────────────
export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "#fafaf9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Urbanist', system-ui, sans-serif",
            fontSize: 14,
            color: "#8a9e92",
          }}
        >
          Loading…
        </div>
      }
    >
      <BrowseContent />
    </Suspense>
  );
}
