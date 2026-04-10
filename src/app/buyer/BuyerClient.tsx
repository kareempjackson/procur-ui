"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import { useToast } from "@/components/ui/Toast";
import {
  fetchProducts,
  fetchSellers,
  fetchHarvestUpdates,
  fetchMarketplaceStats,
  setSelectedCategory as setSelectedCategoryAction,
} from "@/store/slices/buyerMarketplaceSlice";
import { fetchCart, addToCartAsync } from "@/store/slices/buyerCartSlice";
import {
  fetchActiveCountries,
  selectCountry,
  selectCountries,
  setCountry,
} from "@/store/slices/countrySlice";

function CountryFlag({ code, size = 20 }: { code: string; size?: number }) {
  return (
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function SH({ title, linkText, linkHref }: { title: string; linkText?: string; linkHref?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", margin: "0 0 20px" }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-.35px", color: "#1c2b23", margin: 0 }}>{title}</h2>
      {linkText && linkHref && (
        <Link href={linkHref} style={{ fontSize: 12, fontWeight: 600, color: "#2d4a3e", textDecoration: "none" }}>{linkText} →</Link>
      )}
    </div>
  );
}

function ProductImg({ src, alt, sizes }: { src?: string | null; alt: string; sizes?: string }) {
  const [err, setErr] = useState(false);
  const fb = "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=400&fit=crop";
  return <Image src={err || !src ? fb : src} alt={alt} fill className="object-cover" sizes={sizes ?? "180px"} onError={() => setErr(true)} />;
}

const FARM_COVERS = [
  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=200&fit=crop",
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=200&fit=crop",
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=200&fit=crop",
  "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=200&fit=crop",
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=200&fit=crop",
];
function farmCoverFb(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return FARM_COVERS[h % FARM_COVERS.length];
}

function SellerCoverImg({ src, alt, name }: { src?: string | null; alt: string; name: string }) {
  const [err, setErr] = useState(false);
  return <Image src={err || !src ? farmCoverFb(name) : src} alt={alt} fill className="object-cover" sizes="400px" onError={() => setErr(true)} />;
}

function SellerLogoImg({ src, alt, name, size }: { src?: string | null; alt: string; name: string; size: number }) {
  const [err, setErr] = useState(false);
  if (!src || err) return <span style={{ fontSize: size * 0.4, fontWeight: 700, color: "#f5f1ea" }}>{name.charAt(0).toUpperCase()}</span>;
  return <Image src={src} alt={alt} fill className="object-cover" sizes={`${size}px`} onError={() => setErr(true)} />;
}

const AVATAR_COLORS = ["#2d4a3e", "#3e5549", "#1c2b23", "#407178", "#653011", "#c26838"];
function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
const COVER_COLORS = ["#1e3a2f", "#2d4a3e", "#3a5a4a", "#1a2e25", "#243530"];
function coverColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 17 + name.charCodeAt(i)) & 0xffff;
  return COVER_COLORS[h % COVER_COLORS.length];
}

const CATEGORIES = [
  "Vegetables", "Fruits", "Herbs", "Grains", "Legumes",
  "Root Crops", "Meat & Poultry", "Leafy Greens", "Organic", "Export Ready",
];

const HERO_BG = [
  "linear-gradient(135deg, #1c2b23 0%, #2d4a3e 60%, #3a5a4a 100%)",
  "linear-gradient(135deg, #243530 0%, #1e3a2f 60%, #2d4a3e 100%)",
  "linear-gradient(135deg, #1a2e25 0%, #2d4a3e 60%, #1c2b23 100%)",
];

const MIN_ORDER = 30;

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function BuyerClient() {
  const dispatch = useAppDispatch();
  const { show } = useToast();

  const { products, sellers, harvestUpdates, selectedCategory, status, pagination } =
    useAppSelector((s) => s.buyerMarketplace);
  const { cart, optimisticCount } = useAppSelector((s) => s.buyerCart);
  const { code: activeCountryCode, name: activeCountryName } = useAppSelector(selectCountry);
  const availableCountries = useAppSelector(selectCountries);

  useEffect(() => {
    dispatch(fetchActiveCountries());
  }, [dispatch]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selAvail, setSelAvail] = useState<string[]>([]);
  const [selCountries, setSelCountries] = useState<string[]>([]);
  const [selCerts, setSelCerts] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [heroSlide, setHeroSlide] = useState(0);
  const [showHarvestDrawer, setShowHarvestDrawer] = useState(false);

  const productScrollRef = useRef<HTMLDivElement | null>(null);

  type Sort = "newest" | "price_asc" | "price_desc" | "popular";
  const [sort, setSort] = useState<Sort>("newest");
  const [qtys, setQtys] = useState<Record<string, number>>({});

  const productsRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const inFlightRef = useRef<number | null>(null);

  // Hero auto-rotate
  useEffect(() => {
    const id = setInterval(() => setHeroSlide((s) => (s + 1) % 3), 5000);
    return () => clearInterval(id);
  }, []);

  const sortQ = useMemo(() => {
    if (sort === "price_asc") return { sort_by: "current_price", sort_order: "asc" as const };
    if (sort === "price_desc") return { sort_by: "current_price", sort_order: "desc" as const };
    if (sort === "popular") return { sort_by: "popularity", sort_order: "desc" as const };
    return { sort_by: "created_at", sort_order: "desc" as const };
  }, [sort]);

  useEffect(() => {
    dispatch(fetchSellers({ page: 1, limit: 6, country_id: activeCountryCode || undefined }));
    dispatch(fetchHarvestUpdates({ page: 1, limit: 12 }));
    dispatch(fetchMarketplaceStats());
  }, [dispatch, activeCountryCode]);

  useEffect(() => {
    const id = setTimeout(() => {
      dispatch(fetchProducts({
        search: searchQuery || undefined,
        category: selectedCategory !== "All Categories" ? selectedCategory : undefined,
        in_stock: selAvail.includes("Available Now") ? true : undefined,
        tags: selCerts.length ? selCerts : undefined,
        min_price: priceRange[0] !== 0 ? priceRange[0] : undefined,
        max_price: priceRange[1] !== 100 ? priceRange[1] : undefined,
        country_id: activeCountryCode || undefined,
        ...sortQ, page: 1, limit: pagination.itemsPerPage || 20,
      }));
    }, 300);
    return () => clearTimeout(id);
  }, [searchQuery, selectedCategory, selAvail, selCerts, priceRange, sortQ, pagination.itemsPerPage, activeCountryCode, dispatch]);

  const currentQ = useMemo(() => ({
    search: searchQuery || undefined,
    category: selectedCategory !== "All Categories" ? selectedCategory : undefined,
    in_stock: selAvail.includes("Available Now") ? true : undefined,
    tags: selCerts.length ? selCerts : undefined,
    min_price: priceRange[0] !== 0 ? priceRange[0] : undefined,
    max_price: priceRange[1] !== 100 ? priceRange[1] : undefined,
    country_id: activeCountryCode || undefined,
    ...sortQ, limit: pagination.itemsPerPage || 20,
  }), [searchQuery, selectedCategory, selAvail, selCerts, priceRange, sortQ, pagination.itemsPerPage, activeCountryCode]);

  const currentQKey = useMemo(() => JSON.stringify(currentQ), [currentQ]);

  const canLoadMore = products.length > 0 && products.length < pagination.totalItems && pagination.currentPage < pagination.totalPages;

  const loadMore = () => {
    if (!canLoadMore || status === "loading") return;
    const next = (pagination.currentPage || 1) + 1;
    if (inFlightRef.current === next) return;
    inFlightRef.current = next;
    dispatch(fetchProducts({ ...currentQ, page: next }));
  };

  useEffect(() => { inFlightRef.current = null; }, [currentQKey]);
  useEffect(() => { if (status !== "loading") inFlightRef.current = null; }, [status, pagination.currentPage]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e?.isIntersecting && canLoadMore) loadMore(); }, { rootMargin: "400px 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, [canLoadMore, status, pagination.currentPage, currentQKey]);

  const getMin = (p?: number) => Math.max(1, Math.ceil(MIN_ORDER / (p && p > 0 ? p : 1)));

  useEffect(() => {
    setQtys((prev) => {
      const n = { ...prev };
      products.forEach((p) => { const id = String(p.id); if (n[id] == null) n[id] = getMin(p.current_price); });
      return n;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  // How many units of this product are already in the cart
  const cartQtyFor = (productId: string): number => {
    if (!cart?.seller_groups) return 0;
    for (const g of cart.seller_groups)
      for (const item of g.items)
        if (String(item.product_id) === String(productId)) return item.quantity;
    return 0;
  };

  // Returns { can: true } when orderable, or { can: false, label } when not
  const orderStatus = (p: (typeof products)[0]): { can: boolean; label: string } => {
    if (!p.stock_quantity || p.stock_quantity <= 0) return { can: false, label: "Sold out" };
    const min = getMin(p.current_price);
    if (p.stock_quantity < min) return { can: false, label: "Low stock" };
    const remaining = p.stock_quantity - cartQtyFor(String(p.id));
    if (remaining <= 0) return { can: false, label: "In cart" };
    if (remaining < min) return { can: false, label: "In cart" };
    return { can: true, label: "" };
  };

  const canOrder = (p: (typeof products)[0]) => orderStatus(p).can;

  const addToCart = async (productId: string) => {
    const id = String(productId);
    const p = products.find((x) => String(x.id) === id);
    if (!p) { show({ variant: "error", title: "Couldn't add to cart", message: "Product not found." }); return; }
    const status = orderStatus(p);
    if (!status.can) { show({ variant: "warning", title: "Can't add to cart", message: status.label }); return; }
    const min = getMin(p.current_price);
    const remaining = p.stock_quantity - cartQtyFor(id);
    const qty = Math.max(min, Math.min(remaining, qtys[id] ?? min));
    try {
      await dispatch(addToCartAsync({ productId: id, quantity: qty })).unwrap();
      show({ variant: "success", title: "Added to cart", message: `Added ${qty} ${p.unit_of_measurement}.` });
    } catch (e: any) {
      show({ variant: "error", title: "Couldn't add", message: e?.message || "Please try again." });
    }
  };

  const countries = useMemo(() => {
    const ex = (loc?: string) => loc?.split(",").at(-1)?.trim() ?? "";
    return [...new Set(products.map((p) => ex(p.seller.location)))].filter(Boolean).sort();
  }, [products]);

  const certs = useMemo(() => [...new Set(products.flatMap((p) => p.tags || []))].sort(), [products]);

  const displayed = useMemo(() => {
    const ex = (loc?: string) => loc?.split(",").at(-1)?.trim() ?? "";
    const [lo, hi] = priceRange;
    let list = products;
    if (selCountries.length) list = list.filter((p) => selCountries.includes(ex(p.seller.location)));
    if (lo !== 0 || hi !== 100) list = list.filter((p) => { const pr = Number(p.current_price); return isFinite(pr) && pr >= lo && pr <= (hi || Infinity); });
    if (sort === "price_asc") list = [...list].sort((a, b) => (a.current_price ?? 0) - (b.current_price ?? 0));
    if (sort === "price_desc") list = [...list].sort((a, b) => (b.current_price ?? 0) - (a.current_price ?? 0));
    return list;
  }, [products, selCountries, priceRange, sort]);

  const filterCount = selAvail.length + selCountries.length + selCerts.length + (priceRange[0] !== 0 || priceRange[1] !== 100 ? 1 : 0);

  const toggle = (arr: string[], set: (v: string[]) => void, val: string) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const clearFilters = () => {
    setSelAvail([]); setSelCountries([]); setSelCerts([]); setPriceRange([0, 100]);
    setSearchQuery(""); setSort("newest"); dispatch(setSelectedCategoryAction("All Categories"));
  };

  const cartCount = (cart?.unique_products ?? 0) + optimisticCount;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Urbanist', system-ui, sans-serif", background: "#faf8f4", minHeight: "100vh", overflowX: "hidden", color: "#1c2b23" }}>

      {/* ── Filter overlay ── */}
      <div onClick={() => setShowFilters(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.35)", zIndex: 300, opacity: showFilters ? 1 : 0, pointerEvents: showFilters ? "auto" : "none", transition: "opacity .2s" }} />

      {/* ── Filter drawer ── */}
      <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: 300, background: "#fff", zIndex: 301, transform: showFilters ? "translateX(0)" : "translateX(-100%)", transition: "transform .3s cubic-bezier(.4,0,.2,1)", display: "flex", flexDirection: "column", borderRadius: "0 16px 16px 0" }}>
        <div style={{ padding: "16px 18px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ebe7df" }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>Filters</span>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={clearFilters} style={{ fontSize: 11.5, fontWeight: 600, color: "#d4783c", background: "none", border: "none", cursor: "pointer" }}>Clear all</button>
            <button onClick={() => setShowFilters(false)} style={{ width: 26, height: 26, borderRadius: "50%", background: "#f5f1ea", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#1c2b23" strokeWidth="2" strokeLinecap="round" width={13} height={13}><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        <div style={{ padding: "14px 18px", flex: 1, overflowY: "auto" }}>
          {/* Availability */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#8a9e92", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>Availability</div>
            {["Available Now", "Pre-order"].map((opt) => (
              <label key={opt} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, cursor: "pointer" }}>
                <input type="checkbox" checked={selAvail.includes(opt)} onChange={() => toggle(selAvail, setSelAvail, opt)} style={{ accentColor: "#d4783c", width: 14, height: 14 }} />
                <span style={{ fontSize: 13 }}>{opt}</span>
              </label>
            ))}
          </div>
          {/* Country */}
          {countries.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#8a9e92", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>Country</div>
              {countries.map((c) => (
                <label key={c} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, cursor: "pointer" }}>
                  <input type="checkbox" checked={selCountries.includes(c)} onChange={() => toggle(selCountries, setSelCountries, c)} style={{ accentColor: "#d4783c", width: 14, height: 14 }} />
                  <span style={{ fontSize: 13 }}>{c}</span>
                </label>
              ))}
            </div>
          )}
          {/* Certifications */}
          {certs.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#8a9e92", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>Certifications</div>
              {certs.map((c) => (
                <label key={c} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, cursor: "pointer" }}>
                  <input type="checkbox" checked={selCerts.includes(c)} onChange={() => toggle(selCerts, setSelCerts, c)} style={{ accentColor: "#d4783c", width: 14, height: 14 }} />
                  <span style={{ fontSize: 13 }}>{c}</span>
                </label>
              ))}
            </div>
          )}
          {/* Price */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#8a9e92", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>Price per unit</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])} placeholder="Min" style={{ width: 76, padding: "6px 8px", border: "1px solid #e8e4dc", borderRadius: 8, fontSize: 13, outline: "none" }} />
              <span style={{ color: "#8a9e92" }}>–</span>
              <input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], +e.target.value])} placeholder="Max" style={{ width: 76, padding: "6px 8px", border: "1px solid #e8e4dc", borderRadius: 8, fontSize: 13, outline: "none" }} />
            </div>
          </div>
        </div>
        <div style={{ padding: "12px 18px 18px", borderTop: "1px solid #ebe7df" }}>
          <button onClick={() => setShowFilters(false)} style={{ width: "100%", padding: 11, background: "#2d4a3e", color: "#f5f1ea", border: "none", borderRadius: 999, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Show results</button>
        </div>
      </div>

      {/* ── Harvest drawer overlay ── */}
      <div onClick={() => setShowHarvestDrawer(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 400, opacity: showHarvestDrawer ? 1 : 0, pointerEvents: showHarvestDrawer ? "auto" : "none", transition: "opacity .25s" }} />

      {/* ── Harvest timeline drawer (right side) ── */}
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 380, background: "#faf8f4", zIndex: 401, transform: showHarvestDrawer ? "translateX(0)" : "translateX(100%)", transition: "transform .35s cubic-bezier(.4,0,.2,1)", display: "flex", flexDirection: "column" }}>
        {/* Drawer header */}
        <div style={{ padding: "22px 24px 18px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#1c2b23", letterSpacing: "-.3px" }}>Farm Updates</div>
            <div style={{ fontSize: 12, color: "#8a9e92", marginTop: 3 }}>Live reports from your suppliers</div>
          </div>
          <button onClick={() => setShowHarvestDrawer(false)} style={{ width: 32, height: 32, borderRadius: "50%", background: "#ebe7df", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#1c2b23" strokeWidth="2" strokeLinecap="round" width={13} height={13}><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Update list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 16px" }}>
          {harvestUpdates.length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 0", color: "#8a9e92" }}>
              <div style={{ fontSize: 28, marginBottom: 10, opacity: 0.4 }}>🌾</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#3e5549" }}>No updates yet</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Farmers haven&apos;t posted updates yet</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {harvestUpdates.map((u, idx) => {
                const text = u.content?.trim() || "";
                const timeLabel = u.time_ago || "Recently";
                return (
                  <div key={u.id} style={{ padding: "18px 0", borderBottom: idx < harvestUpdates.length - 1 ? "1px solid #ebe7df" : "none" }}>
                    {/* Farm row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: avatarColor(u.farm_name || ""), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#f5f1ea" }}>{(u.farm_name || "?").charAt(0).toUpperCase()}</span>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23" }}>{u.farm_name || "Unknown Farm"}</span>
                      </div>
                      <span style={{ fontSize: 10.5, color: "#b0b8b4" }}>{timeLabel}</span>
                    </div>

                    {/* Crop details */}
                    {u.crop && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: text ? 7 : 10 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#2d4a3e" }}>{u.crop}</span>
                        {u.quantity != null && <span style={{ fontSize: 11.5, color: "#8a9e92" }}>· {u.quantity}{u.unit ? ` ${u.unit}` : ""}</span>}
                        {u.expected_harvest_window && <span style={{ fontSize: 11, color: "#aab4b0" }}>· {u.expected_harvest_window}</span>}
                      </div>
                    )}

                    {/* Notes */}
                    {text && (
                      <p style={{ fontSize: 12, color: "#6a7f73", lineHeight: 1.6, margin: "0 0 10px" }}>{text}</p>
                    )}

                    <Link href={`/suppliers/${u.seller_org_id}`} onClick={() => setShowHarvestDrawer(false)} style={{ fontSize: 11.5, fontWeight: 600, color: "#2d4a3e", textDecoration: "none" }}>
                      View farm →
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer footer */}
        <div style={{ padding: "14px 16px 24px", flexShrink: 0 }}>
          <Link href="/requests" onClick={() => setShowHarvestDrawer(false)} style={{ display: "block", textAlign: "center", padding: "12px", background: "#1c2b23", color: "#f5f1ea", borderRadius: 12, fontSize: 13, fontWeight: 700, textDecoration: "none", letterSpacing: "-.1px" }}>
            View all harvest reports
          </Link>
        </div>
      </div>

      {/* ── Category sub-nav (NOT sticky — scrolls with page, no gap) ── */}
      <div style={{ background: "#243530" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 20px", height: 38, display: "flex", alignItems: "center", gap: 4, overflowX: "auto", scrollbarWidth: "none" }}>
          {/* Filter toggle */}
          <button onClick={() => setShowFilters(true)} style={{ display: "flex", alignItems: "center", gap: 5, paddingRight: 14, height: "100%", fontSize: 12, fontWeight: 700, color: "#f5f1ea", cursor: "pointer", flexShrink: 0, marginRight: 4, background: "none", border: "none", borderRight: "1px solid rgba(245,241,234,.12)" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={13} height={13}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            Filters
            {filterCount > 0 && <span style={{ background: "#d4783c", color: "#fff", fontSize: 9, fontWeight: 700, width: 14, height: 14, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{filterCount}</span>}
          </button>
          {/* Category chips */}
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => dispatch(setSelectedCategoryAction(selectedCategory === cat ? "All Categories" : cat))} style={{ padding: "2px 11px", fontSize: 11.5, fontWeight: selectedCategory === cat ? 700 : 500, color: selectedCategory === cat ? "#fff" : "rgba(245,241,234,.55)", background: "transparent", border: "none", borderBottom: selectedCategory === cat ? "2px solid #fff" : "2px solid transparent", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "color .15s", paddingBottom: 4 }}>
              {cat}
            </button>
          ))}
          <button
            onClick={() => setShowHarvestDrawer(true)}
            style={{ display: "flex", alignItems: "center", gap: 5, marginLeft: "auto", flexShrink: 0, paddingLeft: 16, background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "rgba(245,241,234,.7)", whiteSpace: "nowrap", fontFamily: "inherit" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={12} height={12}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="M12 8v4l3 3" /></svg>
            Farm Updates
            {harvestUpdates.length > 0 && <span style={{ background: "rgba(212,120,60,.8)", color: "#fff", fontSize: 9, fontWeight: 700, minWidth: 14, height: 14, borderRadius: 999, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 3px" }}>{harvestUpdates.length}</span>}
          </button>
        </div>
      </div>

      {/* ── Cart reminder ── */}
      {cartCount > 0 && (
        <div style={{ background: "#fff7f0", borderBottom: "1px solid #f0d5c0", padding: "9px 0" }}>
          <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", gap: 10 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#d4783c" strokeWidth="1.5" width={16} height={16}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" /></svg>
            <span style={{ fontSize: 13, color: "#1c2b23" }}>
              <strong>{cartCount} item{cartCount !== 1 ? "s" : ""}</strong> in your cart
              {cart?.subtotal ? ` ($${Number(cart.subtotal).toFixed(2)})` : ""}
            </span>
            <Link href="/cart" style={{ fontSize: 13, fontWeight: 700, color: "#d4783c", textDecoration: "none", marginLeft: 2 }}>Complete order →</Link>
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <div
        style={{
          background: HERO_BG[heroSlide],
          minHeight: 360,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "stretch",
        }}
      >
        {/* Subtle circle decoration */}
        <div style={{ position: "absolute", top: -80, right: -100, width: 500, height: 500, borderRadius: "50%", background: "rgba(255,255,255,.025)", pointerEvents: "none" }} />

        <div
          style={{
            maxWidth: 1300,
            margin: "0 auto",
            padding: "52px 20px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 32,
          }}
        >
          {/* Left: text */}
          <div style={{ flex: 1, maxWidth: 520 }}>
            <h1
              className="buyer-hero-h1"
              key={heroSlide}
              style={{ fontSize: 42, fontWeight: 800, color: "#f5f1ea", lineHeight: 1.12, letterSpacing: "-1px", margin: "0 0 16px" }}
            >
              {[
                "Fresh Caribbean produce, direct from the farm",
                "See what's growing before it's harvested",
                "Build trusted supplier relationships",
              ][heroSlide]}
            </h1>
            <p style={{ fontSize: 15, color: "rgba(245,241,234,.68)", lineHeight: 1.65, margin: "0 0 32px", maxWidth: 420 }}>
              {[
                "Shop verified farms, track your orders, and get produce that's never more than a day from harvest.",
                "Harvest updates from real farmers: crops, quantities, timelines. Pre-order before it sells out.",
                "Message suppliers directly, compare pricing, and lock in reliable sourcing for your business.",
              ][heroSlide]}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <a href="#all-harvests" style={{ padding: "13px 28px", background: "#d4783c", color: "#fff", fontSize: 14, fontWeight: 700, borderRadius: 999, textDecoration: "none" }}>
                Shop now
              </a>
              <button onClick={() => setShowHarvestDrawer(true)} style={{ padding: "13px 24px", background: "rgba(255,255,255,.1)", color: "#f5f1ea", fontSize: 13, fontWeight: 600, borderRadius: 999, border: "1px solid rgba(255,255,255,.15)", cursor: "pointer", fontFamily: "inherit" }}>
                Farm updates
              </button>
            </div>
          </div>

          {/* Right: Featured Picks — 3-card CSS grid (hidden when no products) */}
          {(status === "loading" || products.length >= 3) && <div className="hero-picks" style={{ flexShrink: 0, width: 320 }}>
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".12em", color: "rgba(245,241,234,.45)", textTransform: "uppercase" }}>Featured picks</span>
              <Link href="/suppliers" style={{ fontSize: 11.5, fontWeight: 600, color: "rgba(245,241,234,.6)", textDecoration: "none" }}>View all →</Link>
            </div>

            {products.length >= 3 ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "140px 140px", gap: 8, height: 288 }}>
                {/* Left large card — spans 2 rows */}
                <Link href={`/product/${products[0].id}`} style={{ gridRow: "1 / 3", position: "relative", borderRadius: 14, overflow: "hidden", textDecoration: "none", display: "block" }}>
                  <ProductImg src={products[0].image_url} alt={products[0].name} sizes="160px" />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,.82) 100%)" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 12px 14px" }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", marginBottom: 4, lineHeight: 1.2 }}>{products[0].name}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#d4783c" }}>
                      ${products[0].current_price?.toFixed(2)}<span style={{ fontSize: 10, fontWeight: 400, color: "rgba(255,255,255,.55)" }}>/{products[0].unit_of_measurement}</span>
                    </div>
                    {canOrder(products[0])
                      ? <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(products[0].id); }} style={{ marginTop: 8, width: "100%", padding: "7px 0", background: "#d4783c", color: "#fff", border: "none", borderRadius: 999, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>+ Add to cart</button>
                      : <div style={{ marginTop: 8, width: "100%", padding: "7px 0", background: "rgba(255,255,255,.15)", color: "rgba(255,255,255,.5)", borderRadius: 999, fontSize: 11, fontWeight: 600, textAlign: "center", fontFamily: "inherit" }}>{orderStatus(products[0]).label}</div>}
                  </div>
                </Link>

                {/* Top-right card */}
                <Link href={`/product/${products[1].id}`} style={{ position: "relative", borderRadius: 12, overflow: "hidden", textDecoration: "none", background: "rgba(255,255,255,.09)", display: "flex", flexDirection: "column" }}>
                  <div style={{ position: "relative", flex: 1 }}>
                    <ProductImg src={products[1].image_url} alt={products[1].name} sizes="160px" />
                  </div>
                  <div style={{ padding: "8px 10px 10px", background: "rgba(0,0,0,.35)" }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{products[1].name}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 3 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#d4783c" }}>${products[1].current_price?.toFixed(2)}</span>
                      {canOrder(products[1])
                        ? <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(products[1].id); }} style={{ width: 22, height: 22, borderRadius: "50%", background: "#d4783c", color: "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", lineHeight: 1 }}>+</button>
                        : <span style={{ fontSize: 9, color: "rgba(255,255,255,.45)", fontWeight: 600 }}>{orderStatus(products[1]).label}</span>}
                    </div>
                  </div>
                </Link>

                {/* Bottom-right card */}
                <Link href={`/product/${products[2].id}`} style={{ position: "relative", borderRadius: 12, overflow: "hidden", textDecoration: "none", background: "rgba(255,255,255,.09)", display: "flex", flexDirection: "column" }}>
                  <div style={{ position: "relative", flex: 1 }}>
                    <ProductImg src={products[2].image_url} alt={products[2].name} sizes="160px" />
                  </div>
                  <div style={{ padding: "8px 10px 10px", background: "rgba(0,0,0,.35)" }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{products[2].name}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 3 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#d4783c" }}>${products[2].current_price?.toFixed(2)}</span>
                      {canOrder(products[2])
                        ? <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(products[2].id); }} style={{ width: 22, height: 22, borderRadius: "50%", background: "#d4783c", color: "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", lineHeight: 1 }}>+</button>
                        : <span style={{ fontSize: 9, color: "rgba(255,255,255,.45)", fontWeight: 600 }}>{orderStatus(products[2]).label}</span>}
                    </div>
                  </div>
                </Link>
              </div>
            ) : (
              /* Skeleton while loading */
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "140px 140px", gap: 8, height: 288 }}>
                <div className="skel" style={{ gridRow: "1/3", borderRadius: 14 }} />
                <div className="skel" style={{ borderRadius: 12 }} />
                <div className="skel" style={{ borderRadius: 12 }} />
              </div>
            )}
          </div>}
        </div>

        {/* Slide dots */}
        <div style={{ position: "absolute", bottom: 18, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
          {[0, 1, 2].map((i) => (
            <button key={i} onClick={() => setHeroSlide(i)} style={{ width: i === heroSlide ? 20 : 6, height: 6, borderRadius: 3, background: i === heroSlide ? "#d4783c" : "rgba(245,241,234,.3)", border: "none", cursor: "pointer", transition: "width .3s, background .3s", padding: 0 }} />
          ))}
        </div>
      </div>

      {/* ── Country filter pills ── */}
      {availableCountries.length > 1 && (
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "32px 20px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#8a9e92", flexShrink: 0, marginRight: 4 }}>Country</span>
            {/* All countries toggle */}
            <button
              onClick={() => {
                dispatch(setCountry({ code: "", name: "", currency: "XCD" }));
              }}
              style={{
                padding: "7px 14px",
                borderRadius: 999,
                border: "none",
                background: !activeCountryCode ? "#2d4a3e" : "rgba(0,0,0,.04)",
                cursor: "pointer",
                fontSize: 12.5,
                fontWeight: 600,
                color: !activeCountryCode ? "#fff" : "#3e5549",
                flexShrink: 0,
                transition: "all .15s",
              }}
            >
              All Countries
            </button>
            {availableCountries.map((c) => {
              const isActive = c.code === activeCountryCode;
              return (
                <button
                  key={c.code}
                  onClick={() => {
                    dispatch(setCountry({ code: c.code, name: c.name, currency: c.currency }));
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "7px 14px",
                    borderRadius: 999,
                    border: "none",
                    background: isActive ? "#2d4a3e" : "rgba(0,0,0,.04)",
                    cursor: "pointer",
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: isActive ? "#fff" : "#3e5549",
                    flexShrink: 0,
                    transition: "all .15s",
                  }}
                >
                  <CountryFlag code={c.country_code} size={18} />
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Empty state when no products ── */}
      {status === "succeeded" && products.length === 0 && sellers.length === 0 && (
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 999,
            background: "rgba(45,74,62,.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#8a9e92" strokeWidth="1.5" strokeLinecap="round" width={26} height={26}>
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1c2b23", margin: "0 0 8px" }}>
            Nothing available{activeCountryName ? ` in ${activeCountryName}` : ""} at the moment
          </h3>
          <p style={{ fontSize: 14, color: "#8a9e92", maxWidth: 360, margin: "0 auto", lineHeight: 1.5 }}>
            Check back soon or browse produce from other countries.
          </p>
        </div>
      )}

      {/* ── Best of the Season ── */}
      {products.length > 0 && <div style={{ paddingTop: 28 }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 20px" }}>
          <SH title={`Best of the season${activeCountryName ? ` in ${activeCountryName}` : ""}`} linkText="Browse all" linkHref="/suppliers" />
          {/* Scroll container with arrow buttons */}
          <div style={{ position: "relative" }}>
            {/* Left arrow */}
            <button
              onClick={() => productScrollRef.current?.scrollBy({ left: -340, behavior: "smooth" })}
              aria-label="Scroll left"
              style={{ position: "absolute", left: -14, top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 34, height: 34, borderRadius: "50%", background: "#fff", border: "1px solid #e8e4dc", boxShadow: "0 2px 8px rgba(0,0,0,.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#1c2b23" strokeWidth="2.5" strokeLinecap="round" width={14} height={14}><path d="M15 18l-6-6 6-6" /></svg>
            </button>

            <div ref={productScrollRef} className="v6-prod-scroll" style={{ paddingBottom: 6 }}>
              {status === "loading" && products.length === 0
                ? [...Array(6)].map((_, i) => <div key={i} className="skel" style={{ flex: "0 0 176px", height: 240, borderRadius: 12, flexShrink: 0 }} />)
                : products.slice(0, 12).map((p) => (
                    <Link key={p.id} href={`/product/${p.id}`} style={{ flex: "0 0 176px", background: "#f5f1ea", borderRadius: 12, overflow: "hidden", textDecoration: "none", color: "inherit", flexShrink: 0, border: "1px solid #e8e4dc" }}>
                      <div style={{ width: "100%", aspectRatio: "1/1", position: "relative" }}>
                        <ProductImg src={p.image_url} alt={p.name} sizes="180px" />
                        {p.sale_price && p.sale_price < p.base_price && (
                          <div style={{ position: "absolute", top: 6, left: 6, background: "#d4783c", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4 }}>
                            {Math.round(((p.base_price - p.sale_price) / p.base_price) * 100)}% off
                          </div>
                        )}
                      </div>
                      <div style={{ padding: "10px 12px 12px" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                        <div style={{ fontSize: 10.5, color: "#8a9e92", marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.seller?.name}</div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: "#2d4a3e" }}>
                            ${p.current_price?.toFixed(2)}<span style={{ fontSize: 10, fontWeight: 400, color: "#8a9e92" }}> /{p.unit_of_measurement}</span>
                          </div>
                          {(() => { const os = orderStatus(p); return os.can
                            ? <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(p.id); }} style={{ background: "#d4783c", color: "#fff", border: "none", borderRadius: 999, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Add</button>
                            : <span style={{ fontSize: 10, color: "#8a9e92" }}>{os.label}</span>; })()}
                        </div>
                      </div>
                    </Link>
                  ))}
            </div>

            {/* Right arrow */}
            <button
              onClick={() => productScrollRef.current?.scrollBy({ left: 340, behavior: "smooth" })}
              aria-label="Scroll right"
              style={{ position: "absolute", right: -14, top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 34, height: 34, borderRadius: "50%", background: "#fff", border: "1px solid #e8e4dc", boxShadow: "0 2px 8px rgba(0,0,0,.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#1c2b23" strokeWidth="2.5" strokeLinecap="round" width={14} height={14}><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </div>
      </div>}

      {/* ── Meet the Farmers ── */}
      {sellers.length > 0 && <div style={{ paddingTop: 48 }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 20px" }}>
          <SH title={`Meet the farmers${activeCountryName ? ` in ${activeCountryName}` : ""}`} linkText="All suppliers" linkHref="/suppliers" />
          <div className="v6-seller-grid">
            {status === "loading" && sellers.length === 0
              ? [...Array(4)].map((_, i) => <div key={i} className="skel" style={{ borderRadius: 12, height: 200 }} />)
              : sellers.slice(0, 4).map((seller) => (
                  <Link key={seller.id} href={`/suppliers/${seller.id}`} style={{ background: "#f5f1ea", borderRadius: 12, overflow: "hidden", textDecoration: "none", color: "inherit", display: "block", border: "1px solid #e8e4dc" }}>
                    <div style={{ height: 96, position: "relative", background: coverColor(seller.name), overflow: "hidden" }}>
                      <SellerCoverImg src={seller.header_image_url} alt={seller.name} name={seller.name} />
                    </div>
                    <div style={{ padding: "0 14px 14px", marginTop: -22, position: "relative" }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: avatarColor(seller.name), display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8, border: "2px solid #f5f1ea", position: "relative", overflow: "hidden" }}>
                        <SellerLogoImg src={seller.logo_url} alt={seller.name} name={seller.name} size={44} />
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, marginTop: 6, marginBottom: 2 }}>{seller.name}</div>
                      <div style={{ fontSize: 11, color: "#8a9e92", marginBottom: 8 }}>{seller.location || ""}</div>
                      {seller.completed_orders != null
                        ? <div style={{ fontSize: 11, color: "#6a7f73" }}>{seller.completed_orders} orders completed</div>
                        : <div style={{ fontSize: 11, color: "#6a7f73" }}>Verified supplier</div>}
                      {seller.average_rating != null && (
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
                          <svg viewBox="0 0 24 24" fill="#d4783c" width={11} height={11}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" /></svg>
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#3e5549" }}>{seller.average_rating.toFixed(1)}</span>
                          {seller.review_count != null && <span style={{ fontSize: 11, color: "#8a9e92" }}>({seller.review_count})</span>}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </div>}

      {/* ── Browse other countries ── */}
      {availableCountries.length > 1 && activeCountryCode && (
        <div style={{ paddingTop: 48 }}>
          <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 20px" }}>
            <SH title="Available in other countries" />
            <div style={{ display: "flex", gap: 12, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 8 }}>
              {availableCountries.filter((c) => c.code !== activeCountryCode).map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      dispatch(setCountry({ code: c.code, name: c.name, currency: c.currency }));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "16px 24px",
                      borderRadius: 16,
                      border: "none",
                      background: "#f5f1ea",
                      cursor: "pointer",
                      flexShrink: 0,
                      textAlign: "left",
                      transition: "all .2s",
                      minWidth: 200,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#ede9e0"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#f5f1ea"; }}
                  >
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: "rgba(45,74,62,.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      overflow: "hidden",
                    }}>
                      <CountryFlag code={c.country_code} size={32} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14.5, fontWeight: 650, color: "#1c2b23", lineHeight: 1.2 }}>{c.name}</div>
                      <div style={{ fontSize: 11.5, color: "#8a9e92", marginTop: 3 }}>Browse produce in {c.currency}</div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ── All Harvests ── */}
      {(status === "loading" || products.length > 0) && <div id="all-harvests" style={{ paddingTop: 52, paddingBottom: 64 }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 20px" }}>
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-.35px", margin: 0 }}>
                {selectedCategory && selectedCategory !== "All Categories" ? selectedCategory : `All Harvests${activeCountryName ? ` in ${activeCountryName}` : ""}`}
              </h2>
              {pagination.totalItems > 0 && <p style={{ fontSize: 12, color: "#8a9e92", margin: "2px 0 0" }}>{Math.min(displayed.length, pagination.totalItems)} of {pagination.totalItems} products</p>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Inline search */}
              <div style={{ display: "flex", alignItems: "center", background: "#f5f1ea", border: "1px solid #e8e4dc", borderRadius: 999, height: 34, paddingLeft: 10 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#8a9e92" strokeWidth="2" strokeLinecap="round" width={13} height={13}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                <input type="text" placeholder="Search…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ background: "transparent", border: "none", outline: "none", fontSize: 13, padding: "0 10px", width: 130, fontFamily: "inherit" }} />
              </div>
              {selectedCategory && selectedCategory !== "All Categories" && (
                <button onClick={() => dispatch(setSelectedCategoryAction("All Categories"))} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: "#f5f1ea", border: "1px solid #e8e4dc", borderRadius: 999, fontSize: 12, fontWeight: 600, color: "#3e5549", cursor: "pointer" }}>{selectedCategory} ×</button>
              )}
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} style={{ padding: "5px 10px", background: "#f5f1ea", border: "1px solid #e8e4dc", borderRadius: 999, fontSize: 12, fontWeight: 600, color: "#1c2b23", cursor: "pointer", outline: "none" }}>
                <option value="newest">Newest</option>
                <option value="price_asc">Price ↑</option>
                <option value="price_desc">Price ↓</option>
                <option value="popular">Popular</option>
              </select>
            </div>
          </div>

          {/* Active filter chips */}
          {filterCount > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              {[...selAvail.map((f) => ({ f, arr: selAvail, set: setSelAvail })), ...selCountries.map((f) => ({ f, arr: selCountries, set: setSelCountries })), ...selCerts.map((f) => ({ f, arr: selCerts, set: setSelCerts }))].map(({ f, arr, set }) => (
                <span key={f} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", background: "rgba(212,120,60,.1)", color: "#d4783c", borderRadius: 999, fontSize: 11, fontWeight: 600 }}>
                  {f}<button onClick={() => toggle(arr, set, f)} style={{ background: "none", border: "none", cursor: "pointer", color: "#d4783c", padding: 0, fontSize: 13 }}>×</button>
                </span>
              ))}
              <button onClick={clearFilters} style={{ fontSize: 11, fontWeight: 600, color: "#8a9e92", background: "none", border: "none", cursor: "pointer" }}>Clear all</button>
            </div>
          )}

          {/* Grid */}
          <div ref={productsRef}>
            {status === "loading" && products.length === 0 ? (
              <div className="v6-pgrid">{[...Array(8)].map((_, i) => <div key={i} className="skel" style={{ borderRadius: 12, height: 260 }} />)}</div>
            ) : displayed.length === 0 ? (
              <div style={{ padding: "56px 0", textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>No products found</div>
                <div style={{ fontSize: 13, color: "#8a9e92", marginBottom: 20 }}>Try adjusting your filters or search</div>
                <button onClick={clearFilters} style={{ padding: "10px 24px", background: "#2d4a3e", color: "#f5f1ea", border: "none", borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Clear filters</button>
              </div>
            ) : (
              <div className="v6-pgrid">
                {displayed.map((p) => {
                  const rating = typeof p.average_rating === "number" ? p.average_rating : typeof p.seller?.average_rating === "number" ? p.seller.average_rating : null;
                  const min = getMin(p.current_price);
                  const qty = qtys[String(p.id)] ?? min;
                  return (
                    <Link key={p.id} href={`/product/${p.id}`} style={{ background: "#f5f1ea", borderRadius: 12, overflow: "hidden", textDecoration: "none", color: "inherit", display: "block", border: "1px solid #e8e4dc" }}>
                      <div style={{ position: "relative", height: 140 }}>
                        <ProductImg src={p.image_url} alt={p.name} sizes="220px" />
                        {p.sale_price && p.sale_price < p.base_price && (
                          <div style={{ position: "absolute", top: 6, left: 6, background: "#d4783c", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4 }}>{Math.round(((p.base_price - p.sale_price) / p.base_price) * 100)}% off</div>
                        )}
                        {rating !== null && (
                          <div style={{ position: "absolute", bottom: 6, right: 6, background: "rgba(255,255,255,.9)", borderRadius: 999, padding: "2px 7px", display: "flex", alignItems: "center", gap: 3 }}>
                            <svg viewBox="0 0 24 24" fill="#d4783c" width={10} height={10}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" /></svg>
                            <span style={{ fontSize: 10, fontWeight: 700 }}>{(rating as number).toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      <div style={{ padding: "10px 12px 12px" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                        <div style={{ fontSize: 10.5, color: "#8a9e92", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 3 }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={9} height={9}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                          {p.seller.location || "Caribbean"}
                        </div>
                        {(p.tags || []).slice(0, 2).length > 0 && (
                          <div style={{ display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" }}>
                            {(p.tags || []).slice(0, 2).map((t) => <span key={t} style={{ padding: "1px 7px", background: "#ebe7df", borderRadius: 4, fontSize: 10, fontWeight: 600, color: "#3e5549" }}>{t}</span>)}
                          </div>
                        )}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid #e8e4dc" }}>
                          <div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: "#2d4a3e", lineHeight: 1 }}>${p.current_price?.toFixed(2)}<span style={{ fontSize: 10, fontWeight: 400, color: "#8a9e92" }}> /{p.unit_of_measurement}</span></div>
                            <div style={{ fontSize: 10, color: "#8a9e92", marginTop: 2 }}>{(() => { const os = orderStatus(p); return os.can ? `${p.stock_quantity - cartQtyFor(String(p.id))} ${p.unit_of_measurement} avail.` : os.label; })()}</div>
                          </div>
                          {!canOrder(p) ? (
                            <span style={{ fontSize: 10, color: "#8a9e92", fontWeight: 600, padding: "5px 10px", background: "#ebe7df", borderRadius: 999 }}>{orderStatus(p).label}</span>
                          ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 3, border: "1px solid #e8e4dc", borderRadius: 999, padding: "3px 5px" }}>
                                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQtys((prev) => ({ ...prev, [String(p.id)]: Math.max(min, qty - 1) })); }} style={{ width: 18, height: 18, borderRadius: "50%", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                                <span style={{ fontSize: 11, fontWeight: 600, minWidth: 20, textAlign: "center" }}>{qty}</span>
                                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQtys((prev) => ({ ...prev, [String(p.id)]: Math.min(p.stock_quantity || 5000, qty + 1) })); }} style={{ width: 18, height: 18, borderRadius: "50%", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                              </div>
                              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(p.id); }} style={{ padding: "5px 11px", background: "#d4783c", color: "#fff", border: "none", borderRadius: 999, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Add</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Infinite scroll sentinel */}
            {displayed.length > 0 && (
              <div style={{ marginTop: 24, textAlign: "center" }}>
                {canLoadMore ? (
                  <div ref={sentinelRef} style={{ padding: "16px 0" }}>
                    {status === "loading" ? (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 13, color: "#8a9e92" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={16} height={16} style={{ animation: "spin 1s linear infinite" }}>
                          <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity=".25" /><path d="M21 12a9 9 0 00-9-9" />
                        </svg>
                        Loading more…
                      </div>
                    ) : <span style={{ fontSize: 12, color: "#8a9e92" }}>Scroll for more</span>}
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: "#8a9e92", padding: "12px 0" }}>All {pagination.totalItems} products shown</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>}

    </div>
  );
}
