"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchSellerProducts, fetchSellerById } from "@/store/slices/buyerMarketplaceSlice";
import { addToCartAsync } from "@/store/slices/buyerCartSlice";
import ProcurLoader from "@/components/ProcurLoader";
import { getApiClient } from "@/lib/apiClient";
import { useSelector } from "react-redux";
import { selectAuthToken } from "@/store/slices/authSlice";

const MIN_ORDER = 30;

function getMinQty(price?: number) {
  return !price || price <= 0 ? 1 : Math.max(1, Math.ceil(MIN_ORDER / price));
}

export default function SupplierClient({ supplierId }: { supplierId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const authToken = useSelector(selectAuthToken);

  const { sellerProducts, currentSeller, sellers, sellerProductsStatus, sellerProductsError } =
    useAppSelector((s) => s.buyerMarketplace);

  const [tab, setTab] = useState<"products" | "about">("products");
  const [cardQty, setCardQty] = useState<Record<string, number>>({});
  const [isStartingConvo, setIsStartingConvo] = useState(false);
  const [cartErrors, setCartErrors] = useState<Record<string, string>>({});
  const [cartAdding, setCartAdding] = useState<Record<string, boolean>>({});

  useEffect(() => {
    dispatch(fetchSellerById(supplierId));
    dispatch(fetchSellerProducts(supplierId));
  }, [dispatch, supplierId]);

  const fallback = {
    id: supplierId,
    name: searchParams.get("name") || "Supplier",
    description: "",
    location: searchParams.get("location") || "",
    average_rating: 0,
    total_reviews: 0,
    is_verified: searchParams.get("verified") === "1",
    product_count: Number(searchParams.get("products") || 0),
    review_count: 0,
    created_at: "",
    specialties: [] as string[],
    business_type: undefined as string | undefined,
    years_in_business: undefined as number | undefined,
    logo_url: searchParams.get("logo_url") || searchParams.get("logo") || undefined,
    header_image_url: searchParams.get("header_image_url") || searchParams.get("header") || undefined,
  };

  const sellerFromList = useMemo(
    () => sellers.find((s) => String(s.id) === String(supplierId)) || null,
    [sellers, supplierId]
  );

  const supplier: typeof fallback = (currentSeller || sellerFromList || fallback) as typeof fallback;

  const products = useMemo(
    () =>
      sellerProducts.map((p) => {
        const price = p.sale_price || p.base_price || 0;
        return {
          id: p.id,
          name: p.name,
          price,
          unit: p.unit_of_measurement,
          category: p.category,
          image:
            p.images?.[0] ||
            "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
          tags: p.tags || [],
          discount:
            p.sale_price && p.base_price && p.sale_price < p.base_price
              ? `${Math.round(((p.base_price - p.sale_price) / p.base_price) * 100)}% off`
              : null,
          in_stock: p.stock_quantity > 0,
          stock_quantity: p.stock_quantity,
          minQty: getMinQty(price),
        };
      }),
    [sellerProducts]
  );

  useEffect(() => {
    setCardQty((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const p of products) {
        if (next[p.id] == null) { next[p.id] = p.minQty; changed = true; }
      }
      return changed ? next : prev;
    });
  }, [products]);

  const handleAddToCart = async (productId: string) => {
    const p = products.find((x) => x.id === productId);
    if (!p || !p.in_stock) return;
    setCartErrors((prev) => { const n = { ...prev }; delete n[productId]; return n; });
    setCartAdding((prev) => ({ ...prev, [productId]: true }));
    const qty = Math.max(p.minQty, Math.min(cardQty[productId] ?? p.minQty, p.stock_quantity || 9999));
    try {
      await dispatch(addToCartAsync({ productId, quantity: qty })).unwrap();
    } catch (err: any) {
      const msg = typeof err === "string" ? err : err?.message || "Failed to add to cart";
      setCartErrors((prev) => ({ ...prev, [productId]: msg }));
    } finally {
      setCartAdding((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleMessage = async () => {
    if (!authToken) return router.push("/login");
    setIsStartingConvo(true);
    try {
      const client = getApiClient(() => authToken);
      const { data } = await client.post("/conversations/start", {
        contextType: "supplier",
        contextId: supplierId,
        title: `Chat with ${supplier.name}`,
      });
      if (data?.id) router.push(`/inbox?conversationId=${data.id}`);
    } catch { /* silent */ }
    finally { setIsStartingConvo(false); }
  };

  if (sellerProductsStatus === "loading") return <ProcurLoader size="lg" />;

  if (sellerProductsStatus === "failed" && sellerProductsError) {
    return (
      <div style={{ minHeight: "60vh", background: "#fafaf9", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Urbanist', system-ui, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1c2b23", marginBottom: 8 }}>Failed to load supplier</h2>
          <p style={{ color: "#8a9e92", marginBottom: 16 }}>{sellerProductsError}</p>
          <Link href="/suppliers" style={{ padding: "12px 24px", background: "#d4783c", color: "#fff", borderRadius: 999, fontWeight: 700, textDecoration: "none", display: "inline-block" }}>
            Browse All Farms
          </Link>
        </div>
      </div>
    );
  }

  const displayName = supplier.name || "Supplier";
  const sellerInit = displayName.trim().charAt(0).toUpperCase();
  const readableLocation = supplier.location || "";
  const rating = supplier.average_rating ?? 0;
  const reviewCount = supplier.total_reviews || supplier.review_count || 0;

  const demoReviews = reviewCount > 0 ? [
    { id: "1", initials: "SM", name: "Verified buyer", rating: rating, date: "Recently", comment: "Consistently reliable quality and very responsive on delivery timelines." },
    { id: "2", initials: "JR", name: "Program partner", rating: Math.max(0, rating - 0.2), date: "This season", comment: "Great communication and clear grading on produce. Easy to work with for repeat orders." },
    { id: "3", initials: "AL", name: "Hospitality buyer", rating: Math.max(0, rating - 0.3), date: "Earlier this year", comment: "Fresh product and thoughtful packing. Would recommend to other buyers on Procur." },
  ] : [];

  return (
    <div style={{ minHeight: "100vh", background: "#fafaf9", fontFamily: "'Urbanist', system-ui, sans-serif", WebkitFontSmoothing: "antialiased" as any, color: "#1c2b23" }}>
      <style>{`
        @media (max-width: 768px) {
          .seller-hero-card { padding: 16px 18px !important; }
          .seller-card-inner { flex-direction: column !important; }
          .seller-ctas { flex-direction: row !important; flex-wrap: wrap; }
          .products-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)) !important; }
          .reviews-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Seller hero ── */}
      <section style={{ position: "relative" }}>
        {/* Cover */}
        <div style={{ height: 240, position: "relative", overflow: "hidden" }}>
          {supplier.header_image_url ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={supplier.header_image_url}
                alt={`${displayName} cover`}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,16,12,.2) 0%, rgba(10,16,12,.55) 100%)" }} />
            </>
          ) : (
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(140deg, #2d4a3e 0%, #3e6b58 60%, #c26838 100%)" }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 75% 50%, rgba(255,255,255,.06) 0%, transparent 65%)" }} />
              {/* Pattern texture */}
              <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "url(/images/pattern.svg)", backgroundSize: "200px 200px", backgroundRepeat: "repeat", opacity: 0.06, mixBlendMode: "overlay" as any }} />
            </div>
          )}
        </div>

        {/* Seller identity card */}
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 20px" }}>
          <div
            className="seller-hero-card"
            style={{ background: "#fff", borderRadius: 20, border: "1px solid #e8e4dc", padding: "24px 28px", marginTop: -48, position: "relative", zIndex: 1 }}
          >
            <div className="seller-card-inner" style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }}>

              {/* Avatar — pulls up above card */}
              <div style={{ marginTop: -56, flexShrink: 0, position: "relative", zIndex: 2 }}>
                <div style={{ width: 80, height: 80, borderRadius: 16, border: "3px solid #fff", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,0,0,.14)" }}>
                  {supplier.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={supplier.logo_url} alt={displayName} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "linear-gradient(155deg, #1e3528 0%, #2d5a42 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: "-.5px" }}>{sellerInit}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" as any }}>
                  <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1c2b23", letterSpacing: "-.5px", margin: 0 }}>
                    {displayName}
                  </h1>
                  {supplier.is_verified && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#2d4a3e", background: "#eef4f1", border: "1px solid #c8ddd4", padding: "3px 10px", borderRadius: 999, letterSpacing: ".04em", flexShrink: 0 }}>
                      ✓ Verified
                    </span>
                  )}
                </div>

                {supplier.business_type && (
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#8a9e92", textTransform: "uppercase", letterSpacing: ".08em", margin: "0 0 10px" }}>
                    {supplier.business_type}
                  </p>
                )}

                {/* Pill stats */}
                <div style={{ display: "flex", flexWrap: "wrap" as any, gap: 8, marginBottom: 12 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6a7f73", background: "#f5f1ea", padding: "5px 12px", borderRadius: 999 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={11} height={11}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    {readableLocation}
                  </span>
                  {products.length > 0 && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6a7f73", background: "#f5f1ea", padding: "5px 12px", borderRadius: 999 }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={11} height={11}><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                      {products.length} products
                    </span>
                  )}
                  {rating > 0 && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6a7f73", background: "#f5f1ea", padding: "5px 12px", borderRadius: 999 }}>
                      <svg viewBox="0 0 24 24" fill="#f59e0b" width={11} height={11}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                      <span style={{ fontWeight: 700, color: "#1c2b23" }}>{rating.toFixed(1)}</span>
                      <span>({reviewCount} reviews)</span>
                    </span>
                  )}
                  {typeof supplier.years_in_business === "number" && supplier.years_in_business > 0 && (
                    <span style={{ fontSize: 12, color: "#6a7f73", background: "#f5f1ea", padding: "5px 12px", borderRadius: 999 }}>
                      {supplier.years_in_business}+ yrs farming
                    </span>
                  )}
                </div>

                {/* Specialties */}
                {supplier.specialties && supplier.specialties.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap" as any, gap: 6, marginBottom: 12 }}>
                    {supplier.specialties.slice(0, 5).map((s) => (
                      <span key={s} style={{ fontSize: 11, color: "#2d4a3e", background: "#eef4f1", border: "1px solid #c8ddd4", padding: "3px 10px", borderRadius: 999 }}>
                        {s}
                      </span>
                    ))}
                    {supplier.specialties.length > 5 && (
                      <span style={{ fontSize: 11, color: "#8a9e92", padding: "3px 0" }}>+{supplier.specialties.length - 5} more</span>
                    )}
                  </div>
                )}

                {supplier.description && (
                  <p style={{ fontSize: 14, color: "#6a7f73", lineHeight: 1.65, margin: 0, maxWidth: 600 }}>
                    {supplier.description}
                  </p>
                )}
              </div>

              {/* CTAs */}
              <div className="seller-ctas" style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                <button
                  onClick={handleMessage}
                  disabled={isStartingConvo}
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 20px", background: "#2d4a3e", color: "#f5f1ea", fontSize: 13, fontWeight: 700, borderRadius: 999, border: "none", cursor: isStartingConvo ? "not-allowed" : "pointer", opacity: isStartingConvo ? 0.6 : 1, fontFamily: "'Urbanist', system-ui, sans-serif", whiteSpace: "nowrap" as any }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                  {isStartingConvo ? "Connecting…" : "Message supplier"}
                </button>
                <Link
                  href="/suppliers"
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "10px 20px", background: "#fff", color: "#1c2b23", fontSize: 13, fontWeight: 600, borderRadius: 999, textDecoration: "none", border: "1px solid #e8e4dc", whiteSpace: "nowrap" as any }}
                >
                  ← All farms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Products + tabs ── */}
      <main style={{ maxWidth: 1300, margin: "0 auto", padding: "40px 20px 80px" }}>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 32, borderBottom: "1px solid #e8e4dc", paddingBottom: 0 }}>
          {(["products", "about"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "10px 18px",
                fontSize: 13,
                fontWeight: 700,
                background: "none",
                border: "none",
                borderBottom: tab === t ? "2px solid #2d4a3e" : "2px solid transparent",
                color: tab === t ? "#2d4a3e" : "#8a9e92",
                cursor: "pointer",
                fontFamily: "'Urbanist', system-ui, sans-serif",
                marginBottom: -1,
              }}
            >
              {t === "products" ? `Products (${products.length})` : "About"}
            </button>
          ))}
        </div>

        {/* Products tab */}
        {tab === "products" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1c2b23", margin: "0 0 4px", letterSpacing: "-.3px" }}>
                  Available products
                </h2>
                <p style={{ fontSize: 13, color: "#8a9e92", margin: 0 }}>
                  Currently listed by {displayName}
                </p>
              </div>
              <span style={{ fontSize: 12, color: "#8a9e92" }}>
                {products.length} item{products.length !== 1 ? "s" : ""}
              </span>
            </div>

            {products.length === 0 ? (
              <div style={{ padding: "40px 28px", borderRadius: 16, border: "1px dashed #d8d2c8", textAlign: "center" }}>
                <p style={{ fontSize: 14, color: "#8a9e92", margin: "0 0 14px" }}>
                  This supplier doesn&apos;t have any listings yet.
                </p>
                <Link href="/" style={{ fontSize: 13, fontWeight: 700, color: "#2d4a3e", textDecoration: "none" }}>
                  Browse all produce →
                </Link>
              </div>
            ) : (
              <div
                className="products-grid"
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}
              >
                {products.map((p) => (
                  <div
                    key={p.id}
                    style={{ textDecoration: "none", display: "flex", flexDirection: "column", borderRadius: 18, border: "1px solid #e8e4dc", background: "#fff", overflow: "hidden" }}
                  >
                    <Link href={`/product/${p.id}`} style={{ textDecoration: "none", display: "block" }}>
                      <div style={{ height: 180, position: "relative", overflow: "hidden", flexShrink: 0 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        {!p.in_stock && (
                          <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,.7)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>
                            Out of stock
                          </div>
                        )}
                        {p.discount && (
                          <div style={{ position: "absolute", top: 10, right: 10, background: "#d4783c", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 999 }}>
                            {p.discount}
                          </div>
                        )}
                      </div>
                      <div style={{ padding: "14px 16px 16px" }}>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1c2b23", margin: "0 0 6px", letterSpacing: "-.1px", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {p.name}
                        </h3>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                          <span style={{ fontSize: 16, fontWeight: 800, color: "#1c2b23" }}>
                            ${p.price.toFixed(2)}
                            <span style={{ fontSize: 11, fontWeight: 400, color: "#8a9e92" }}> /{p.unit}</span>
                          </span>
                          <span style={{ fontSize: 11, color: "#8a9e92", background: "#f5f1ea", padding: "2px 8px", borderRadius: 999 }}>
                            {p.category}
                          </span>
                        </div>
                        {p.tags.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap" as any, gap: 5, marginBottom: 10 }}>
                            {p.tags.slice(0, 3).map((t) => (
                              <span key={t} style={{ fontSize: 10, color: "#6a7f73", background: "#f5f1ea", padding: "2px 8px", borderRadius: 999 }}>
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Add to cart row — outside the link */}
                    {p.in_stock && (
                      <div style={{ padding: "0 16px 16px", marginTop: "auto" }}>
                        {cartErrors[p.id] && (
                          <p style={{ fontSize: 10.5, color: "#b43c3c", margin: "0 0 6px", fontWeight: 600 }}>
                            {cartErrors[p.id]}
                          </p>
                        )}
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid #ebe7df", borderRadius: 8, overflow: "hidden", height: 32, flex: 1 }}>
                            <button
                              onClick={() => setCardQty((prev) => ({ ...prev, [p.id]: Math.max(p.minQty, (prev[p.id] ?? p.minQty) - 1) }))}
                              style={{ width: 32, height: "100%", background: "#faf8f4", border: "none", cursor: "pointer", color: "#3e5549", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Urbanist', system-ui, sans-serif" }}
                            >−</button>
                            <input
                              type="number"
                              value={cardQty[p.id] ?? p.minQty}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                const v = parseInt(e.target.value);
                                if (!isNaN(v)) setCardQty((prev) => ({ ...prev, [p.id]: Math.max(p.minQty, Math.min(v, p.stock_quantity || 9999)) }));
                              }}
                              style={{ flex: 1, height: "100%", border: "none", borderLeft: "1px solid #ebe7df", borderRight: "1px solid #ebe7df", textAlign: "center", fontSize: 12, fontWeight: 700, color: "#1c2b23", background: "#fff", outline: "none", fontFamily: "'Urbanist', system-ui, sans-serif" }}
                            />
                            <button
                              onClick={() => setCardQty((prev) => ({ ...prev, [p.id]: Math.min((prev[p.id] ?? p.minQty) + 1, p.stock_quantity || 9999) }))}
                              style={{ width: 32, height: "100%", background: "#faf8f4", border: "none", cursor: "pointer", color: "#3e5549", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Urbanist', system-ui, sans-serif" }}
                            >+</button>
                          </div>
                          <button
                            onClick={() => handleAddToCart(p.id)}
                            disabled={cartAdding[p.id] || (cartErrors[p.id] || "").toLowerCase().includes("stock")}
                            style={{ padding: "0 16px", height: 32, background: cartAdding[p.id] || (cartErrors[p.id] || "").toLowerCase().includes("stock") ? "#d8d2c8" : "#d4783c", color: "#fff", fontSize: 12, fontWeight: 700, borderRadius: 8, border: "none", cursor: cartAdding[p.id] || (cartErrors[p.id] || "").toLowerCase().includes("stock") ? "not-allowed" : "pointer", fontFamily: "'Urbanist', system-ui, sans-serif", flexShrink: 0, transition: "background .15s" }}
                          >
                            {cartAdding[p.id] ? "…" : "Add"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Reviews */}
            {demoReviews.length > 0 && (
              <section style={{ marginTop: 56 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1c2b23", margin: "0 0 4px", letterSpacing: "-.3px" }}>Reviews</h2>
                    <p style={{ fontSize: 13, color: "#8a9e92", margin: 0 }}>
                      {rating > 0 ? `${rating.toFixed(1)} avg · ` : ""}{reviewCount} reviews from Procur buyers
                    </p>
                  </div>
                </div>
                <div className="reviews-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                  {demoReviews.map((review) => (
                    <div key={review.id} style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e4dc", padding: "18px 20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f5f1ea", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#2d4a3e", flexShrink: 0 }}>
                            {review.initials}
                          </div>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23", margin: "0 0 1px" }}>{review.name}</p>
                            <p style={{ fontSize: 11, color: "#8a9e92", margin: 0 }}>{review.date}</p>
                          </div>
                        </div>
                        <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 700, color: "#1c2b23", background: "#f5f1ea", padding: "4px 10px", borderRadius: 999 }}>
                          <svg viewBox="0 0 24 24" fill="#f59e0b" width={11} height={11}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                          {review.rating.toFixed(1)}
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: "#6a7f73", lineHeight: 1.6, margin: 0 }}>{review.comment}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* About tab */}
        {tab === "about" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, maxWidth: 900 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", border: "1px solid #e8e4dc" }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1c2b23", margin: "0 0 10px" }}>About {displayName}</h2>
                <p style={{ fontSize: 14, color: "#6a7f73", lineHeight: 1.7, margin: 0 }}>
                  {supplier.description || "No description provided."}
                </p>
              </div>
              {supplier.specialties && supplier.specialties.length > 0 && (
                <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", border: "1px solid #e8e4dc" }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1c2b23", margin: "0 0 12px" }}>Specialties</h2>
                  <div style={{ display: "flex", flexWrap: "wrap" as any, gap: 8 }}>
                    {supplier.specialties.map((spec) => (
                      <span key={spec} style={{ fontSize: 11, color: "#2d4a3e", background: "#eef4f1", border: "1px solid #c8ddd4", padding: "5px 12px", borderRadius: 999 }}>
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div style={{ background: "#2d4a3e", borderRadius: 16, padding: "20px 24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {[
                  { val: products.length, label: "Products" },
                  { val: rating > 0 ? rating.toFixed(1) : "—", label: "Rating" },
                  { val: reviewCount || "—", label: "Reviews" },
                  { val: supplier.created_at ? new Date(supplier.created_at).getFullYear() : "—", label: "Est." },
                ].map((s) => (
                  <div key={s.label}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#f5f1ea", lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(245,241,234,.5)", marginTop: 3, textTransform: "uppercase", letterSpacing: ".06em" }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(245,241,234,.12)", fontSize: 13, color: "rgba(245,241,234,.6)" }}>
                {readableLocation}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
