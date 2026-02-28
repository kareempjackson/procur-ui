"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store";
import { selectAuthUser } from "@/store/slices/authSlice";
import { getApiClient } from "@/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────
type LandingSeller = {
  id: string;
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
  { id: "1", name: "Plantain", category: "Vegetables", current_price: 2.50, unit: "lb", image_url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop", seller: { id: "s1", name: "Samaritan Farm", location: "St. Andrew", is_verified: true, completed_orders: 45 } },
  { id: "2", name: "Plantain", category: "Vegetables", current_price: 2.50, unit: "lb", image_url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop", seller: { id: "s2", name: "AgrowFo", location: "St. Mark", is_verified: true, completed_orders: 67 } },
  { id: "3", name: "Plantain", category: "Vegetables", current_price: 2.00, unit: "lb", image_url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop", seller: { id: "s3", name: "R&K Farms", location: "St. George", is_verified: true, completed_orders: 32 } },
  { id: "4", name: "Banana (ripe)", category: "Fruits", current_price: 1.50, unit: "lb", image_url: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&h=400&fit=crop", seller: { id: "s2", name: "AgrowFo", location: "St. Mark", is_verified: true, completed_orders: 67 } },
  { id: "5", name: "Bok Choi", category: "Vegetables", current_price: 2.50, unit: "lb", image_url: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=400&h=400&fit=crop", seller: { id: "s1", name: "Samaritan Farm", location: "St. Andrew", is_verified: true, completed_orders: 45 } },
  { id: "6", name: "Tania", category: "Root Crops", current_price: 6.00, unit: "lb", image_url: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400&h=400&fit=crop", seller: { id: "s2", name: "AgrowFo", location: "St. Mark", is_verified: true, completed_orders: 67 } },
  { id: "7", name: "Pumpkin", category: "Vegetables", current_price: 2.75, unit: "lb", image_url: "https://images.unsplash.com/photo-1509622905150-fa66d3906e09?w=400&h=400&fit=crop", seller: { id: "s2", name: "AgrowFo", location: "St. Mark", is_verified: true, completed_orders: 67 } },
  { id: "8", name: "Gospo Sweet", category: "Fruits", current_price: 0.50, unit: "lb", image_url: "https://images.unsplash.com/photo-1587162146766-e06b1189b907?w=400&h=400&fit=crop", seller: { id: "s4", name: "Agro-Tech", location: "St. Patrick", is_verified: true, completed_orders: 20 } },
];

const FALLBACK_SELLERS: LandingSeller[] = [
  { id: "s1", name: "Samaritan Farm", location: "St. Andrew, Grenada", is_verified: true, average_rating: 4.9, review_count: 24, completed_orders: 45 },
  { id: "s3", name: "R&K Farms", location: "St. George, Grenada", is_verified: true, average_rating: 4.8, review_count: 18, completed_orders: 32 },
  { id: "s5", name: "Sequoia Eco Garden", location: "St. Patrick, Grenada", is_verified: true, average_rating: 5.0, review_count: 11, completed_orders: 15 },
  { id: "s2", name: "AgrowFo", location: "St. Mark, Grenada", is_verified: true, average_rating: 4.9, review_count: 31, completed_orders: 67 },
];

// ─── Static content ───────────────────────────────────────────────────────────
const HERO_SLIDES = [
  { img: "/images/hero/hanna-long-JbGA85iuTiY-unsplash.jpg", imgPosition: "center center", h2: "Fresh from the field.\nDirect to you.", p: "Shop verified Grenadian produce: plantain, bok choi, dasheen and more, sourced straight from the farm.", cta: "Shop now", href: "/browse" },
  { img: "/images/hero/shelley-pauls-G7WdvR8rDPg-unsplash.jpg", imgPosition: "center center", h2: "Know exactly where\nyour food comes from.", p: "Every supplier on Procur is reviewed and verified. No middlemen, no surprises. Just transparent, local supply.", cta: "Browse produce", href: "/browse" },
  { img: "/images/hero/land-o-lakes-inc-BlXa_riHlp4-unsplash.jpg", imgPosition: "center 10%", h2: "Grow your reach.\nGrow your revenue.", p: "List your produce and connect with buyers, restaurants and hotels across Grenada, all in one place.", cta: "Get started", href: "/signup?accountType=seller" },
];

const SELLER_COVERS = [
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=200&fit=crop",
  "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=600&h=200&fit=crop",
  "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&h=200&fit=crop",
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=200&fit=crop",
];

const TESTIMONIALS = [
  { quote: "An excellent venture that's far more convenient for farmers. I'm very pleased.", name: "Jude Durham", farm: "Samaritan Farm", location: "St. Andrew, Grenada", role: "Supplier" },
  { quote: "Everything arrived on time. The customer service was very responsive and professional.", name: "Brown Girl Cafe", location: "St. George, Grenada", role: "Buyer" },
  { quote: "Procur makes weekly produce sourcing seamless. The quality and consistency are exactly what a restaurant needs.", name: "Island Grill Kitchen", location: "Grand Anse, Grenada", role: "Buyer, Restaurant" },
  { quote: "Connecting directly with local farmers has transformed our sourcing. Fresher produce, fairer prices, every time.", name: "Karibea Hotels", location: "St. George, Grenada", role: "Buyer, Hotel" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const SEL_COLORS = ["#2d4a3e", "#d4783c", "#5a7650", "#1c2b23", "#407178"];

function selColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i));
  return SEL_COLORS[Math.abs(h) % SEL_COLORS.length];
}

function toProductHref(p: LandingProduct): string {
  const name = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `/products/${name}-${p.id}`;
}

function productImage(p: LandingProduct): string {
  if (p.image_url) return p.image_url;
  const cat = p.category.toLowerCase();
  if (cat.includes("fruit")) return "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&h=400&fit=crop";
  return "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop";
}

// ─── Product image with graceful fallback ─────────────────────────────────────
const PRODUCT_FALLBACK = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop";
function ProductImg({ src, alt, lazy }: { src: string; alt: string; sizes?: string; lazy?: boolean }) {
  const [imgSrc, setImgSrc] = React.useState(src);
  React.useEffect(() => { setImgSrc(src); }, [src]);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      alt={alt}
      loading={lazy ? "lazy" : "eager"}
      onError={() => setImgSrc(PRODUCT_FALLBACK)}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SecH({ title, linkText, linkHref }: { title: string; linkText?: string; linkHref?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", margin: "28px 0 12px" }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-.2px", color: "#1c2b23" }}>{title}</h2>
      {linkText && linkHref && (
        <Link href={linkHref} style={{ fontSize: 12, fontWeight: 600, color: "#2d4a3e", textDecoration: "none" }}>
          {linkText}
        </Link>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Home() {
  const user = useAppSelector(selectAuthUser);
  const router = useRouter();

  // Data state — empty until both requests settle; skeleton shown in the interim
  const [products, setProducts] = useState<LandingProduct[]>([]);
  const [sellers, setSellers] = useState<LandingSeller[]>([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [heroIdx, setHeroIdx] = useState(0);
  const [prevHeroIdx, setPrevHeroIdx] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  // ── Data loading — sessionStorage SWR + API refresh ──────────────────────────
  //    1. If sessionStorage has fresh data (< 2 min), render immediately (no skeleton).
  //    2. Always fire an API refresh in the background; update state + cache when done.
  //    This makes revisits within the same browser session feel near-instant.
  useEffect(() => {
    let cancelled = false;
    const api = getApiClient(() => null);
    const CACHE_KEY = "procur:home:v2";
    const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

    function parseProducts(raw: Record<string, unknown>[]): LandingProduct[] {
      return raw.map((p): LandingProduct => ({
        id: String(p.id), name: String(p.name), category: String(p.category ?? "Other"),
        current_price: typeof p.current_price === "number" ? p.current_price : 0,
        unit: String(p.unit ?? "lb"),
        image_url: (p.image_url as string | null) ?? ((p.images as string[])?.[0] ?? null),
        seller: {
          id: String((p.seller as Record<string, unknown>)?.id ?? ""),
          name: String((p.seller as Record<string, unknown>)?.name ?? "Seller"),
          logo_url: ((p.seller as Record<string, unknown>)?.logo_url as string | null) ?? null,
          location: ((p.seller as Record<string, unknown>)?.location as string | null) ?? null,
          average_rating: ((p.seller as Record<string, unknown>)?.average_rating as number | null) ?? null,
          review_count: ((p.seller as Record<string, unknown>)?.review_count as number | null) ?? null,
          completed_orders: ((p.seller as Record<string, unknown>)?.completed_orders as number | null) ?? null,
          is_verified: ((p.seller as Record<string, unknown>)?.is_verified as boolean | null) ?? null,
        },
      }));
    }

    function parseSellers(raw: Record<string, unknown>[]): LandingSeller[] {
      return raw.map((s): LandingSeller => ({
        id: String(s.id), name: String(s.name),
        logo_url: (s.logo_url as string | null) ?? null,
        header_image_url: (s.header_image_url as string | null) ?? null,
        location: (s.location as string | null) ?? null,
        average_rating: (s.average_rating as number | null) ?? null,
        review_count: (s.review_count as number | null) ?? null,
        completed_orders: (s.completed_orders as number | null) ?? null,
        is_verified: (s.is_verified as boolean | null) ?? null,
      }));
    }

    // Step 1: Try to hydrate from sessionStorage immediately
    let hasFreshCache = false;
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const { products: cp, sellers: cs, ts } = JSON.parse(raw);
        if (Date.now() - ts < CACHE_TTL && Array.isArray(cp) && Array.isArray(cs)) {
          setProducts(cp);
          setSellers(cs);
          setLoading(false);
          hasFreshCache = true;
        }
      }
    } catch { /* sessionStorage unavailable (SSR/private mode) — fall through */ }

    // Step 2: Always refresh from API (background if cache hit, blocking if not)
    Promise.allSettled([
      api.get("/marketplace/products", { params: { in_stock: true, limit: 30 } }),
      api.get("/marketplace/sellers", { params: { limit: 40 } }),
    ]).then(([pResult, sResult]) => {
      if (cancelled) return;

      let newProducts: LandingProduct[] = [];
      let newSellers: LandingSeller[] = [];

      if (pResult.status === "fulfilled") {
        const pData = pResult.value?.data?.products;
        newProducts = Array.isArray(pData) && pData.length > 0
          ? parseProducts(pData)
          : FALLBACK_PRODUCTS;
      } else {
        newProducts = FALLBACK_PRODUCTS;
      }

      if (sResult.status === "fulfilled") {
        const sData = sResult.value?.data?.sellers;
        newSellers = Array.isArray(sData) && sData.length > 0
          ? parseSellers(sData)
          : FALLBACK_SELLERS;
      } else {
        newSellers = FALLBACK_SELLERS;
      }

      // Only update state (and trigger re-render) when there was no fresh cache.
      // If we already rendered from cache, skip the state update to prevent flicker —
      // just silently refresh sessionStorage so the next visit gets updated data.
      if (!hasFreshCache) {
        setProducts(newProducts);
        setSellers(newSellers);
        setLoading(false);
      }

      // Always refresh sessionStorage so the next visit gets the latest data
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ products: newProducts, sellers: newSellers, ts: Date.now() }));
      } catch { /* quota exceeded or unavailable — non-fatal */ }
    });

    return () => { cancelled = true; };
  }, []);

  // ── Hero auto-rotation ────────────────────────────────────────────────────────
  const heroTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bestSellersRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  function scrollSect(ref: React.RefObject<HTMLDivElement | null>, dir: number) {
    ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  }
  function startHeroTimer() {
    if (heroTimerRef.current) clearInterval(heroTimerRef.current);
    heroTimerRef.current = setInterval(() => setHeroIdx(i => (i + 1) % 3), 5000);
  }
  useEffect(() => {
    startHeroTimer();
    return () => { if (heroTimerRef.current) clearInterval(heroTimerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function goHero(i: number) { setPrevHeroIdx(heroIdx); setHeroIdx(i); startHeroTimer(); }

  // ── Search ────────────────────────────────────────────────────────────────────
  function handleSearch() {
    const q = searchInput.trim();
    router.push(q ? `/browse?q=${encodeURIComponent(q)}` : "/browse");
  }

  // ── Computed ──────────────────────────────────────────────────────────────────
  const bestSellers = useMemo(() =>
    [...products].sort((a, b) => (b.seller.completed_orders ?? 0) - (a.seller.completed_orders ?? 0)).slice(0, 8),
    [products]
  );

  const categoryBlocks = useMemo(() => {
    const grouped: Record<string, Map<string, LandingProduct>> = {};
    products.forEach(p => {
      if (!grouped[p.category]) grouped[p.category] = new Map();
      if (!grouped[p.category].has(p.name) && grouped[p.category].size < 4) {
        grouped[p.category].set(p.name, p);
      }
    });
    return Object.entries(grouped).slice(0, 4).map(([cat, prodMap]) => ({
      title: cat,
      browseHref: `/browse?category=${encodeURIComponent(cat.toLowerCase())}`,
      link: `Browse ${cat.toLowerCase()} →`,
      items: Array.from(prodMap.values()).map(p => ({ img: productImage(p), label: p.name })),
    }));
  }, [products]);

  const cats = useMemo(() => [...new Set(products.map(p => p.category))].slice(0, 6), [products]);

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
  const userName = (user as { firstName?: string; email?: string } | null)?.firstName
    || (user as { firstName?: string; email?: string } | null)?.email?.split("@")[0]
    || null;

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Urbanist', system-ui, sans-serif", background: "#faf8f4", color: "#1c2b23", WebkitFontSmoothing: "antialiased" }}>

      {/* ── Menu overlay ── */}
      <div
        onClick={() => setMenuOpen(false)}
        style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,.3)", zIndex: 200, opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none", transition: "opacity .3s" }}
      />

      {/* ── Menu drawer ── */}
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 300, background: "#fff", zIndex: 201, transform: menuOpen ? "translateX(0)" : "translateX(100%)", transition: "transform .35s cubic-bezier(.4,0,.2,1)", display: "flex", flexDirection: "column", borderRadius: "16px 0 0 16px" }}>
        <div style={{ padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Image src="/images/logos/procur-logo.svg" alt="Procur" width={72} height={19} />
          <button onClick={() => setMenuOpen(false)} style={{ width: 30, height: 30, borderRadius: "50%", background: "#f5f1ea", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6a7f73" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={13} height={13}><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
        {userName && (
          <div style={{ padding: "0 18px 14px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#2d4a3e", color: "#f5f1ea", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{userName}</div>
              <div style={{ fontSize: 10.5, color: "#8a9e92" }}>View profile</div>
            </div>
          </div>
        )}
        <div style={{ flex: 1, padding: "4px 8px", overflowY: "auto" }}>
          {[
            { label: "Browse Produce", href: "/browse" },
            { label: "Sellers", href: "/sellers" },
          ].map(l => (
            <Link key={l.label} href={l.href} onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center", padding: "9px 12px", borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#1c2b23", textDecoration: "none" }}>
              {l.label}
            </Link>
          ))}
          <div style={{ height: 1, background: "#ebe7df", margin: "6px 12px" }} />
          {[
            { label: "Become a Supplier", href: "/signup?accountType=seller" },
          ].map(l => (
            <Link key={l.label} href={l.href} onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center", padding: "9px 12px", borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#1c2b23", textDecoration: "none" }}>
              {l.label}
            </Link>
          ))}
        </div>
        <div style={{ padding: "12px 18px", borderTop: "1px solid #ebe7df" }}>
          {user
            ? <Link href="/auth/signout" style={{ display: "block", padding: 9, background: "#2d4a3e", color: "#f5f1ea", fontSize: 12, fontWeight: 700, textAlign: "center", borderRadius: 10, textDecoration: "none" }}>Log out</Link>
            : <Link href="/login" style={{ display: "block", padding: 9, background: "#2d4a3e", color: "#f5f1ea", fontSize: 12, fontWeight: 700, textAlign: "center", borderRadius: 10, textDecoration: "none" }}>Sign in</Link>
          }
        </div>
      </div>

      {/* ── Filter drawer (left) ── */}
      <div
        onClick={() => setFilterOpen(false)}
        style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,.3)", zIndex: 200, opacity: filterOpen ? 1 : 0, pointerEvents: filterOpen ? "auto" : "none", transition: "opacity .3s" }}
      />
      <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: 280, background: "#fff", zIndex: 201, transform: filterOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform .35s cubic-bezier(.4,0,.2,1)", display: "flex", flexDirection: "column", borderRadius: "0 16px 16px 0" }}>
        <div style={{ padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ebe7df" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#1c2b23" }}>Filter by Category</span>
          <button onClick={() => setFilterOpen(false)} style={{ width: 30, height: 30, borderRadius: "50%", background: "#f5f1ea", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6a7f73" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={13} height={13}><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div style={{ flex: 1, padding: "8px", overflowY: "auto" }}>
          <a href="/browse" onClick={() => setFilterOpen(false)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, fontSize: 13, fontWeight: 700, color: "#1c2b23", textDecoration: "none", background: "#f5f1ea" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={15} height={15}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            All Categories
          </a>
          <div style={{ height: 1, background: "#ebe7df", margin: "6px 4px" }} />
          {cats.map(cat => (
            <a key={cat} href={`/browse?category=${encodeURIComponent(cat.toLowerCase())}`} onClick={() => setFilterOpen(false)} style={{ display: "flex", alignItems: "center", padding: "10px 12px", borderRadius: 10, fontSize: 13, fontWeight: 500, color: "#2d4a3e", textDecoration: "none" }}>
              {cat}
            </a>
          ))}
        </div>
      </div>

      {/* ── Sticky header ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "#2d4a3e" }}>
        {/* Main header row */}
        <div style={{ height: 58, display: "flex", alignItems: "center", padding: "0 60px" }}>
          {/* Logo */}
          <Link href="/" style={{ flexShrink: 0, marginRight: 20, textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 3 }}>
            <Image src="/images/logos/procur-logo.svg" alt="Procur" width={88} height={23} style={{ filter: "brightness(0) invert(1)" }} priority />
            <span style={{ fontSize: 9.5, fontWeight: 600, color: "rgba(245,241,234,.72)", lineHeight: 1, letterSpacing: ".03em" }}>🇬🇩 Grenada</span>
          </Link>
          {/* Search bar — navigates to /browse?q=... */}
          <div style={{ flex: 1, display: "flex", justifyContent: "center", margin: "0 16px" }}>
          <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,.12)", borderRadius: 999, height: 38, border: "1px solid rgba(255,255,255,.14)", padding: "0 4px 0 16px", width: "100%", maxWidth: 560 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="rgba(245,241,234,.45)" strokeWidth="2" width={15} height={15} style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>
            <input
              type="text"
              placeholder="Search produce, sellers..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSearch(); }}
              style={{ flex: 1, border: "none", outline: "none", fontFamily: "inherit", fontSize: 13, color: "#f5f1ea", fontWeight: 400, background: "transparent", padding: "0 10px", caretColor: "#f5f1ea" }}
            />
            {searchInput && (
              <button onClick={() => setSearchInput("")} style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,.15)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(245,241,234,.7)", flexShrink: 0, marginRight: 4 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={10} height={10}><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            )}
            <button onClick={handleSearch} style={{ height: 28, width: 28, background: "#d4783c", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "none", cursor: "pointer", borderRadius: "50%", marginRight: 2 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={13} height={13}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>
            </button>
          </div>
          </div>
          {/* Nav right */}
          <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
            <button
              onClick={() => setMenuOpen(true)}
              style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "6px 10px", borderRadius: 4, cursor: "pointer", border: "1px solid transparent", background: "none" }}
            >
              <span style={{ fontSize: 9.5, color: "rgba(245,241,234,.45)", lineHeight: 1 }}>
                {userName ? `Hello, ${userName}` : "Sign in"}
              </span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#f5f1ea", lineHeight: 1.3, display: "flex", alignItems: "center", gap: 3 }}>
                Account
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width={10} height={10} style={{ opacity: .5 }}><path d="M6 9l6 6 6-6" /></svg>
              </span>
            </button>
            <Link href={user ? "/cart" : "/login?redirect=/cart"} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 10px", borderRadius: 4, cursor: "pointer", position: "relative", border: "1px solid transparent", textDecoration: "none" }}>
              <div style={{ position: "relative" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#f5f1ea" strokeWidth="1.5" width={26} height={26}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" /></svg>
                <span style={{ position: "absolute", top: -4, right: -6, background: "#d4783c", color: "#fff", fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>0</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#f5f1ea" }}>Cart</span>
            </Link>
          </div>
        </div>
        {/* Sub-nav — categories link to /browse?category=... */}
        <div style={{ background: "#243530", height: 34 }}>
          <div className="v6-sn-scroll" style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 60px", overflowX: "auto" }}>
            <button
              onClick={() => setFilterOpen(true)}
              style={{ display: "flex", alignItems: "center", gap: 6, paddingRight: 14, height: "100%", fontSize: 12, fontWeight: 700, color: "#f5f1ea", cursor: "pointer", flexShrink: 0, marginRight: 4, background: "none", border: "none" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={16} height={16}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
              All
            </button>
            {cats.map(cat => (
              <Link key={cat} href={`/browse?category=${encodeURIComponent(cat.toLowerCase())}`} style={{ padding: "0 12px", height: "100%", display: "flex", alignItems: "center", fontSize: 11.5, fontWeight: 500, color: "rgba(245,241,234,.55)", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
                {cat}
              </Link>
            ))}
            <Link href="/signup?accountType=seller" style={{ padding: "0 12px", height: "100%", display: "flex", alignItems: "center", fontSize: 11.5, fontWeight: 600, color: "#d4783c", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
              Become a Supplier
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero carousel ── */}
      <div style={{ position: "relative", height: 580, overflow: "hidden" }}>
        {HERO_SLIDES.map((slide, i) => {
          const isActive = heroIdx === i;
          const isPrev = prevHeroIdx === i;
          return (
            <div key={i} style={{
              position: "absolute", inset: 0,
              opacity: isActive ? 1 : 0,
              zIndex: isActive ? 2 : isPrev ? 1 : 0,
              transition: "opacity .95s cubic-bezier(.4,0,.2,1)",
              display: "flex", alignItems: "center",
            }}>
              <Image src={slide.img} alt={slide.h2} fill className="object-cover" style={{ objectPosition: slide.imgPosition }} sizes="100vw" priority={i === 0} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(108deg, rgba(10,16,12,.92) 0%, rgba(10,16,12,.56) 38%, rgba(10,16,12,.08) 70%, transparent 100%)" }} />
              <div style={{
                position: "relative", zIndex: 1,
                padding: "0 80px", maxWidth: 1300, margin: "0 auto", width: "100%",
                opacity: isActive ? 1 : 0,
                transform: isActive ? "translateY(0)" : "translateY(20px)",
                transition: isActive
                  ? "opacity .7s ease .38s, transform .7s cubic-bezier(.22,1,.36,1) .38s"
                  : "opacity .2s ease, transform .2s ease",
              }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(245,241,234,.45)", letterSpacing: ".12em", textTransform: "uppercase", margin: "0 0 16px" }}>Procur · Grenada</p>
                <h2 style={{ fontSize: 54, fontWeight: 800, color: "#f5f1ea", lineHeight: 1.08, letterSpacing: "-1.5px", maxWidth: 520, whiteSpace: "pre-line", margin: "0 0 14px" }}>{slide.h2}</h2>
                <p style={{ fontSize: 15, color: "rgba(245,241,234,.75)", maxWidth: 400, lineHeight: 1.65, fontWeight: 400, margin: 0 }}>{slide.p}</p>
                <Link href={slide.href} style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 30, padding: "13px 28px", background: "#d4783c", color: "#fff", fontSize: 13, fontWeight: 700, borderRadius: 999, textDecoration: "none" }}>
                  {slide.cta}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={13} height={13}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </Link>
              </div>
            </div>
          );
        })}

        {/* Prev / Next */}
        <button onClick={() => goHero((heroIdx - 1 + 3) % 3)} style={{ position: "absolute", top: "50%", left: 20, transform: "translateY(-50%)", zIndex: 3, width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(245,241,234,.12)", color: "rgba(245,241,234,.85)", cursor: "pointer", border: "1px solid rgba(245,241,234,.18)", transition: "background .2s" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={15} height={15}><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button onClick={() => goHero((heroIdx + 1) % 3)} style={{ position: "absolute", top: "50%", right: 20, transform: "translateY(-50%)", zIndex: 3, width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(245,241,234,.12)", color: "rgba(245,241,234,.85)", cursor: "pointer", border: "1px solid rgba(245,241,234,.18)", transition: "background .2s" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={15} height={15}><path d="M9 18l6-6-6-6" /></svg>
        </button>

        {/* Dots — bottom left */}
        <div style={{ position: "absolute", bottom: 26, left: 80, zIndex: 3, display: "flex", gap: 5, alignItems: "center" }}>
          {[0, 1, 2].map(i => (
            <button key={i} onClick={() => goHero(i)} style={{ width: heroIdx === i ? 26 : 6, height: 6, borderRadius: 999, background: heroIdx === i ? "#f5f1ea" : "rgba(245,241,234,.28)", cursor: "pointer", border: "none", padding: 0, transition: "all .45s cubic-bezier(.4,0,.2,1)" }} />
          ))}
        </div>
      </div>

      {/* ── Main content wrapper ── */}
      <div className="v6-cw">

        {/* ── Category blocks (overlaps hero) ── */}
        <div className="v6-cat-grid">
          {loading
            ? [...Array(4)].map((_, i) => (
                <div key={i} className="skel" style={{ borderRadius: 10, height: 192 }} />
              ))
            : categoryBlocks.map(block => (
              <div key={block.title} style={{ background: "#f5f1ea", borderRadius: 10, padding: "12px 14px 14px", border: "1px solid #e8e4dc" }}>
                <h3 style={{ fontSize: 11, fontWeight: 700, marginBottom: 8, color: "#3e5549", letterSpacing: ".06em", textTransform: "uppercase" }}>{block.title}</h3>
                <div className="v6-cb-grid">
                  {block.items.map(item => (
                    <div key={item.label}>
                      <div style={{ width: "100%", aspectRatio: "1/1", borderRadius: 7, overflow: "hidden", position: "relative", background: "#ebe7df" }}>
                        <ProductImg src={item.img} alt={item.label} sizes="80px" />
                      </div>
                      <span style={{ display: "block", fontSize: 9.5, fontWeight: 600, color: "#5a7060", marginTop: 3, letterSpacing: ".01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</span>
                    </div>
                  ))}
                </div>
                <Link href={block.browseHref} style={{ display: "inline-block", marginTop: 8, fontSize: 10.5, fontWeight: 700, color: "#2d4a3e", textDecoration: "none", letterSpacing: ".02em" }}>
                  {block.link}
                </Link>
              </div>
            ))}
        </div>

        {/* ── Best sellers scroll ── */}
        <SecH title="Best sellers in Grenada" linkText="View all" linkHref="/browse" />
        <div style={{ position: "relative" }}>
          <div ref={bestSellersRef} className="v6-prod-scroll">
            {loading
              ? [...Array(8)].map((_, i) => (
                  <div key={i} className="skel" style={{ flex: "0 0 180px", borderRadius: 12, height: 240, flexShrink: 0 }} />
                ))
              : bestSellers.map(p => (
              <Link key={p.id + p.seller.id} href={toProductHref(p)} style={{ flex: "0 0 180px", background: "#f5f1ea", borderRadius: 12, overflow: "hidden", cursor: "pointer", textDecoration: "none", color: "inherit", flexShrink: 0 }}>
                <div style={{ width: "100%", aspectRatio: "1/1", overflow: "hidden", position: "relative" }}>
                  <ProductImg src={productImage(p)} alt={p.name} sizes="180px" />
                </div>
                <div style={{ padding: "10px 12px 12px" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23", marginBottom: 1 }}>{p.name}</div>
                  <div style={{ fontSize: 10.5, color: "#8a9e92", marginBottom: 4 }}>{p.seller.name}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#2d4a3e" }}>
                    ${p.current_price.toFixed(2)}{" "}
                    <span style={{ fontWeight: 400, fontSize: 10, color: "#8a9e92" }}>/{p.unit}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <button onClick={() => scrollSect(bestSellersRef, -1)} style={{ position: "absolute", left: -16, top: "50%", transform: "translateY(-50%)", zIndex: 2, width: 34, height: 34, borderRadius: "50%", background: "#fff", border: "1px solid #ebe7df", boxShadow: "0 2px 8px rgba(28,43,35,.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#3e5549" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={14} height={14}><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button onClick={() => scrollSect(bestSellersRef, 1)} style={{ position: "absolute", right: -16, top: "50%", transform: "translateY(-50%)", zIndex: 2, width: 34, height: 34, borderRadius: "50%", background: "#fff", border: "1px solid #ebe7df", boxShadow: "0 2px 8px rgba(28,43,35,.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#3e5549" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={14} height={14}><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>

        {/* ── Meet the farmers ── */}
        <SecH title="Meet the farmers" linkText="All sellers" linkHref="/sellers" />
        <div className="v6-seller-grid">
          {loading
            ? [...Array(4)].map((_, i) => (
                <div key={i} className="skel" style={{ borderRadius: 12, height: 200 }} />
              ))
            : popularSellers.map((s: LandingSeller, idx: number) => (
            <Link key={s.id} href={`/sellers/${s.id}`} style={{ background: "#f5f1ea", borderRadius: 12, overflow: "hidden", cursor: "pointer", textDecoration: "none", color: "inherit", display: "block" }}>
              {/* Cover — use seller's own header image, fall back to static covers */}
              <div style={{ width: "100%", height: 100, position: "relative" }}>
                <Image
                  src={s.header_image_url || SELLER_COVERS[idx % SELLER_COVERS.length]}
                  alt={s.name}
                  fill
                  className="object-cover"
                  sizes="300px"
                />
              </div>
              <div style={{ padding: "0 16px 16px", position: "relative" }}>
                {/* Avatar — logo if available, else coloured initial */}
                <div style={{ width: 48, height: 48, borderRadius: 12, marginTop: -24, border: "3px solid #f5f1ea", position: "relative", zIndex: 1, background: selColor(s.name), flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {s.logo_url ? (
                    <Image src={s.logo_url} alt={s.name} width={48} height={48} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                  ) : (
                    <span style={{ fontSize: 18, fontWeight: 700, color: "#f5f1ea" }}>{s.name.charAt(0)}</span>
                  )}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 8, color: "#1c2b23" }}>{s.name}</div>
                <div style={{ fontSize: 11, color: "#8a9e92", marginBottom: 10 }}>{s.location || "Grenada"}</div>
                <div style={{ fontSize: 11.5, color: "#6a7f73", lineHeight: 1.4, marginBottom: 10 }}>
                  {s.completed_orders != null ? `${s.completed_orders} orders completed` : "Verified supplier on Procur"}
                </div>
                <div style={{ display: "flex", gap: 14 }}>
                  {s.average_rating != null && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <svg viewBox="0 0 24 24" fill="#d4783c" width={12} height={12}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" /></svg>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#3e5549" }}>{s.average_rating.toFixed(1)}</span>
                    </div>
                  )}
                  {s.review_count != null && (
                    <span style={{ fontSize: 11, color: "#8a9e92" }}>{s.review_count} reviews</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Testimonials ── */}
        <SecH title="What buyers & sellers say" />
        <div style={{ position: "relative" }}>
          <div ref={testimonialsRef} style={{ display: "flex", gap: 12, overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none", paddingBottom: 4 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ flex: "0 0 300px", background: "#f5f1ea", borderRadius: 14, padding: "22px 22px 20px", display: "flex", flexDirection: "column", scrollSnapAlign: "start" }}>
                <div style={{ fontSize: 36, lineHeight: .9, color: "#2d4a3e", opacity: .2, fontFamily: "Georgia, 'Times New Roman', serif", marginBottom: 8, userSelect: "none" }}>&ldquo;</div>
                <p style={{ fontSize: 13.5, fontWeight: 500, lineHeight: 1.6, color: "#1c2b23", flex: 1, margin: 0 }}>
                  {t.quote}
                </p>
                <div style={{ marginTop: 18, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23" }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "#8a9e92", marginTop: 2 }}>
                      {"farm" in t ? (t as typeof t & { farm: string }).farm : t.location}
                    </div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#2d4a3e", background: "rgba(45,74,62,.1)", borderRadius: 999, padding: "4px 10px", whiteSpace: "nowrap", flexShrink: 0 }}>{t.role}</span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => scrollSect(testimonialsRef, -1)} style={{ position: "absolute", left: -16, top: "50%", transform: "translateY(-50%)", zIndex: 2, width: 34, height: 34, borderRadius: "50%", background: "#fff", border: "1px solid #ebe7df", boxShadow: "0 2px 8px rgba(28,43,35,.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#3e5549" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={14} height={14}><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button onClick={() => scrollSect(testimonialsRef, 1)} style={{ position: "absolute", right: -16, top: "50%", transform: "translateY(-50%)", zIndex: 2, width: 34, height: 34, borderRadius: "50%", background: "#fff", border: "1px solid #ebe7df", boxShadow: "0 2px 8px rgba(28,43,35,.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#3e5549" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={14} height={14}><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>

        {/* ── Pre-footer CTA ── */}
        <div style={{ margin: "56px 0 8px", background: "#2d4a3e", borderRadius: 18, padding: "60px 52px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f5f1ea", marginBottom: 6, letterSpacing: "-.2px" }}>Ready to buy fresh produce?</h2>
            <p style={{ fontSize: 13, color: "rgba(245,241,234,.55)", lineHeight: 1.55, margin: 0 }}>Source directly from verified Grenadian farms at fair, transparent prices.</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/browse" style={{ padding: "11px 26px", background: "#f5f1ea", color: "#1c2b23", fontSize: 13, fontWeight: 700, borderRadius: 999, textDecoration: "none" }}>
              Browse Produce
            </Link>
            <Link href="/signup?accountType=seller" style={{ padding: "11px 26px", background: "transparent", border: "1px solid rgba(245,241,234,.25)", color: "#f5f1ea", fontSize: 13, fontWeight: 600, borderRadius: 999, textDecoration: "none" }}>
              Become a Supplier
            </Link>
          </div>
        </div>

      </div>{/* end v6-cw */}

      {/* ── Footer ── */}
      <footer style={{ background: "#0a0a0a", color: "#f5f1ea" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 20px" }}>

          <div style={{ padding: "80px 0 64px" }}>
            <h2 style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.15, maxWidth: 520, marginBottom: 16, letterSpacing: "-.5px", color: "#f5f1ea" }}>
              Building stronger food systems across the Caribbean and beyond.
            </h2>
            <p style={{ fontSize: 14, color: "rgba(245,241,234,.65)", maxWidth: 440, lineHeight: 1.65, marginBottom: 28, margin: "0 0 28px 0" }}>
              Procur connects buyers directly with verified farmers: transparent pricing, reliable supply, and produce that&apos;s never more than a day from harvest.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/signup?accountType=buyer" style={{ padding: "12px 28px", background: "#f5f1ea", color: "#1c2b23", fontSize: 13, fontWeight: 700, borderRadius: 999, textDecoration: "none" }}>
                Start buying
              </Link>
              <Link href="/signup?accountType=seller" style={{ padding: "12px 28px", background: "transparent", color: "#f5f1ea", fontSize: 13, fontWeight: 600, borderRadius: 999, border: "1px solid rgba(245,241,234,.2)", textDecoration: "none" }}>
                Become a supplier
              </Link>
            </div>
          </div>

          <div style={{ height: 1, background: "rgba(245,241,234,.08)" }} />

          <div style={{ display: "flex", gap: 60, padding: "48px 0 40px" }}>
            <div style={{ flexShrink: 0, width: 240 }}>
              <Image src="/images/logos/procur-logo.svg" alt="Procur" width={80} height={21} style={{ filter: "brightness(0) invert(1)", opacity: 0.75 }} />
              <p style={{ fontSize: 12, color: "rgba(245,241,234,.55)", lineHeight: 1.65, marginTop: 16, marginBottom: 0 }}>
                Procur is Grenada&apos;s agricultural marketplace, purpose-built to shorten supply chains and strengthen local food economies.
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                {[
                  <svg key="x" viewBox="0 0 24 24" fill="currentColor" width={14} height={14}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.65l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
                  <svg key="ig" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={14} height={14}><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4.5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>,
                  <svg key="li" viewBox="0 0 24 24" fill="currentColor" width={14} height={14}><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>,
                  <svg key="fb" viewBox="0 0 24 24" fill="currentColor" width={14} height={14}><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>,
                ].map((icon, i) => (
                  <a key={i} href="#" style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid rgba(245,241,234,.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(245,241,234,.55)", textDecoration: "none" }}>
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
              {[
                { title: "Platform", links: [{ label: "Browse Produce", href: "/browse" }, { label: "For Suppliers", href: "/signup?accountType=seller" }, { label: "For Buyers", href: "/signup?accountType=buyer" }, { label: "Log in", href: "/login" }] },
                { title: "Solutions", links: [{ label: "Restaurants", href: "/solutions/restaurants" }, { label: "Hotels", href: "/solutions/hotels" }, { label: "Grocery", href: "/solutions/grocery" }, { label: "Government", href: "/solutions/government" }, { label: "Agriculture", href: "/solutions/agriculture" }] },
                { title: "Company", links: [{ label: "About Procur", href: "/company/about" }, { label: "Newsroom", href: "/newsroom" }, { label: "Contact", href: "/company/contact" }] },
                { title: "Resources", links: [{ label: "Help Center", href: "/help" }, { label: "FAQ", href: "/help/faq" }, { label: "Blog", href: "/newsroom" }, { label: "Supplier Guide", href: "/supplier-guide" }, { label: "Buyer Guide", href: "/buyer-guide" }] },
              ].map(col => (
                <div key={col.title}>
                  <h5 style={{ fontSize: 10, fontWeight: 700, color: "rgba(245,241,234,.5)", marginBottom: 14, letterSpacing: ".08em", textTransform: "uppercase" }}>{col.title}</h5>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {col.links.map(link => (
                      <li key={link.label} style={{ marginBottom: 8 }}>
                        <Link href={link.href} style={{ fontSize: 12.5, color: "rgba(245,241,234,.55)", textDecoration: "none" }}>{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div style={{ paddingTop: 18, paddingBottom: 28, borderTop: "1px solid rgba(245,241,234,.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: 11, color: "rgba(245,241,234,.35)", margin: 0 }}>&copy; 2026 Procur Grenada Ltd. All rights reserved.</p>
            <div style={{ display: "flex", gap: 16 }}>
              {[{ label: "Privacy", href: "/legal/privacy" }, { label: "Terms", href: "/legal/terms" }, { label: "Cookies", href: "/legal/cookies" }, { label: "Accessibility", href: "/accessibility" }].map(l => (
                <Link key={l.label} href={l.href} style={{ fontSize: 11, color: "rgba(245,241,234,.35)", textDecoration: "none" }}>{l.label}</Link>
              ))}
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
