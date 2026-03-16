"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchProductDetail } from "@/store/slices/buyerMarketplaceSlice";
import { addToCartAsync } from "@/store/slices/buyerCartSlice";
import { getApiClient } from "@/lib/apiClient";
import ProcurLoader from "@/components/ProcurLoader";
import { useToast } from "@/components/ui/Toast";

const C = {
  white: "#fff",
  cream: "#f5f1ea",
  creamL: "#faf8f4",
  warm: "#ebe7df",
  dark: "#1c2b23",
  teal: "#2d4a3e",
  tealD: "#253d33",
  orange: "#d4783c",
  orangeH: "#c06830",
  green: "#2e7d4f",
  t3: "#6a7f73",
  t4: "#8a9e92",
  font: "'Urbanist', system-ui, sans-serif",
};

const MIN_ORDER = 30;

export default function ProductClient({ productId }: { productId: string }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { show } = useToast();

  const { currentProduct: product, productDetailStatus, productDetailError } =
    useAppSelector((s) => s.buyerMarketplace);
  const authToken = useAppSelector((s) => s.auth.accessToken);

  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [isStartingConvo, setIsStartingConvo] = useState(false);
  const [related, setRelated] = useState<any[]>([]);

  const minQty = () =>
    !product ? 1 : Math.max(1, Math.ceil(MIN_ORDER / product.current_price));

  const stock = product?.stock_quantity ?? 0;
  const isOOS = !product || stock <= 0;
  const meetsMin = !!product && product.current_price * quantity >= MIN_ORDER;
  const canAdd = meetsMin && !isOOS;

  useEffect(() => {
    dispatch(fetchProductDetail(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (product?.current_price) setQuantity((q) => Math.max(q, minQty()));
  }, [product?.current_price]);

  useEffect(() => {
    if (!product?.seller?.id) return;
    const client = getApiClient(() => authToken);
    client
      .get(`/buyers/marketplace/sellers/${product.seller.id}/products`)
      .then(({ data }) => {
        const items = Array.isArray(data.products)
          ? data.products
          : Array.isArray(data)
            ? data
            : [];
        setRelated(items.filter((p: any) => p.id !== productId).slice(0, 8));
      })
      .catch(() => {});
  }, [product?.seller?.id, productId, authToken]);

  const handleAddToCart = async () => {
    if (!product) return;
    if (isOOS) return show("This item is currently out of stock.");
    if (!meetsMin) return show(`Minimum order is $${MIN_ORDER.toFixed(2)}.`);
    try {
      await dispatch(addToCartAsync({ productId, quantity })).unwrap();
      show(`Added ${quantity} ${product.unit_of_measurement || "items"} to cart!`);
    } catch (err: any) {
      show(typeof err === "string" ? err : err?.message || "Failed to add to cart.");
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    if (isOOS) return show("This item is currently out of stock.");
    if (!meetsMin) return show(`Minimum order is $${MIN_ORDER.toFixed(2)}.`);
    try {
      await dispatch(addToCartAsync({ productId, quantity })).unwrap();
      window.location.href = "/checkout";
    } catch (err: any) {
      show(typeof err === "string" ? err : err?.message || "Failed to add to cart.");
    }
  };

  const handleMessage = async () => {
    if (!product || !authToken) return;
    setIsStartingConvo(true);
    try {
      const client = getApiClient(() => authToken);
      const { data } = await client.post("/conversations/start", {
        contextType: "product",
        contextId: product.id,
        withUserId: product.seller.id,
        title: `Re: ${product.name}`,
      });
      router.push(`/inbox?conversationId=${data.id}`);
    } catch {
      show("Failed to start conversation. Please try again.");
    } finally {
      setIsStartingConvo(false);
    }
  };

  const handleAddRelated = async (relProductId: string) => {
    try {
      await dispatch(addToCartAsync({ productId: relProductId, quantity: 1 })).unwrap();
      show("Added to cart!");
    } catch (err: any) {
      show(typeof err === "string" ? err : err?.message || "Failed to add to cart.");
    }
  };

  if (productDetailStatus === "loading") return <ProcurLoader size="lg" />;

  if (productDetailStatus === "failed" || !product) {
    return (
      <div
        style={{
          minHeight: "60vh",
          background: C.creamL,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: C.font,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.dark, marginBottom: 8 }}>
            Product Not Found
          </h2>
          <p style={{ color: C.t4, marginBottom: 16 }}>
            {productDetailError || "The product you're looking for doesn't exist."}
          </p>
          <Link
            href="/"
            style={{
              padding: "12px 24px",
              background: C.orange,
              color: "#fff",
              borderRadius: 10,
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.image_url
        ? [product.image_url]
        : ["/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"];

  const lowStock = stock > 0 && stock < 5;
  const stockColor = stock > 0 ? C.green : "#dc2626";
  const stockDotColor = lowStock ? C.orange : stockColor;

  const hasRating = typeof product.seller?.average_rating === "number";
  const sellerName = product.seller?.name || "Supplier";
  const sellerLoc = product.seller?.location || "Grenada";
  const sellerInit = sellerName.trim().charAt(0).toUpperCase();

  const harvestUpdate = product.harvest_update;
  const hasHarvestUpdate =
    stock <= 0 &&
    !!harvestUpdate &&
    (!!harvestUpdate.content?.trim() ||
      !!harvestUpdate.notes?.trim() ||
      !!harvestUpdate.expected_harvest_window?.trim() ||
      typeof harvestUpdate.quantity === "number" ||
      (Array.isArray(harvestUpdate.images) && harvestUpdate.images.length > 0));

  const productUpdate = product.product_update;
  const hasProductUpdate =
    !!productUpdate &&
    (!!productUpdate.title?.trim() || !!productUpdate.content?.trim());

  const discountPct =
    product.sale_price && product.sale_price < product.base_price
      ? Math.round(((product.base_price - product.sale_price) / product.base_price) * 100)
      : 0;

  const bullets = [
    product.is_organic && "Certified Organic",
    product.is_featured && "Featured by Procur",
    `${stock} ${product.unit_of_measurement} available`,
    `Sold by ${sellerName}${product.seller?.is_verified ? " · Verified Supplier" : ""}`,
    `Origin: ${sellerLoc}`,
  ].filter(Boolean) as string[];

  return (
    <div style={{ background: "#fafaf9", fontFamily: C.font, minHeight: "100vh" }}>
      <style>{`
        .bpd-wrap { max-width: 1300px; margin: 0 auto; padding: 0 20px 96px; }
        .bpd-layout {
          display: grid;
          grid-template-columns: 500px 1fr 296px;
          gap: 40px;
          align-items: start;
        }
        .bpd-detail-grid { display: grid; grid-template-columns: 1fr 1fr; }
        @media (max-width: 1100px) {
          .bpd-layout { grid-template-columns: 1fr 280px; gap: 28px; }
          .bpd-gallery { grid-column: 1 / 3; max-width: 600px; }
          .bpd-info { grid-column: 1 / 2; }
          .bpd-buybox { grid-column: 2 / 3; grid-row: 2; }
        }
        @media (max-width: 720px) {
          .bpd-layout { grid-template-columns: 1fr; gap: 20px; }
          .bpd-gallery, .bpd-info, .bpd-buybox { grid-column: auto !important; grid-row: auto !important; }
          .bpd-sticky { position: static !important; top: auto !important; }
          .bpd-detail-grid { grid-template-columns: 1fr; }
          .bpd-related { padding: 0 0 32px !important; }
        }
      `}</style>

      {/* Breadcrumb */}
      <nav
        style={{
          maxWidth: 1300,
          margin: "0 auto",
          padding: "18px 20px 28px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          color: "#8a9e92",
          flexWrap: "wrap",
        }}
      >
        <Link href="/" style={{ color: "#2d4a3e", fontWeight: 600, textDecoration: "none" }}>
          Home
        </Link>
        <span>/</span>
        <Link href="/marketplace" style={{ color: "#2d4a3e", fontWeight: 600, textDecoration: "none" }}>
          Marketplace
        </Link>
        <span>/</span>
        <span style={{ color: "#8a9e92" }}>{product.category}</span>
        <span>/</span>
        <span style={{ color: "#1c2b23", fontWeight: 600 }}>{product.name}</span>
      </nav>

      <div className="bpd-wrap">
        <div className="bpd-layout">

          {/* ── Col 1: Image gallery ── */}
          <div className="bpd-gallery">
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", width: "100%" }}>
              {/* Vertical thumbnail rail */}
              {images.length > 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                  {images.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImg(i)}
                      style={{
                        width: 66,
                        height: 66,
                        padding: 2,
                        borderRadius: 8,
                        border: `2px solid ${activeImg === i ? C.teal : "#e8e4dc"}`,
                        background: "#fafaf9",
                        cursor: "pointer",
                        overflow: "hidden",
                        flexShrink: 0,
                        display: "block",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`${product.name} ${i + 1}`}
                        style={{ objectFit: "cover", borderRadius: 5, display: "block", width: "100%", height: "100%" }}
                      />
                    </button>
                  ))}
                </div>
              )}
              {/* Main image */}
              <div
                style={{
                  flex: 1,
                  position: "relative",
                  aspectRatio: "1 / 1",
                  background: "#f5f1ea",
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid #e8e4dc",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[activeImg] || images[0]}
                  alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                {stock === 0 && (
                  <div style={{ position: "absolute", top: 14, left: 14, background: "rgba(0,0,0,.72)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 999 }}>
                    Out of stock
                  </div>
                )}
                {discountPct > 0 && stock > 0 && (
                  <div style={{ position: "absolute", top: 14, left: 14, background: C.orange, color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 999 }}>
                    {discountPct}% Off
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Col 2: Product info ── */}
          <div className="bpd-info">
            {/* Category */}
            <p style={{ fontSize: 11, fontWeight: 700, color: "#8a9e92", textTransform: "uppercase", letterSpacing: ".08em", margin: "0 0 8px" }}>
              {product.category}{product.subcategory ? ` › ${product.subcategory}` : ""}
            </p>

            {/* Title */}
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1c2b23", letterSpacing: "-.5px", lineHeight: 1.2, margin: "0 0 10px" }}>
              {product.name}
            </h1>

            {/* Badges */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
              {product.is_organic && (
                <span style={{ fontSize: 11, fontWeight: 700, color: "#2d4a3e", background: "#eef4f1", border: "1px solid #c8ddd4", padding: "3px 10px", borderRadius: 999 }}>
                  Organic
                </span>
              )}
              {product.is_featured && (
                <span style={{ fontSize: 11, fontWeight: 700, color: "#92610a", background: "#fef9ec", border: "1px solid #f0d48a", padding: "3px 10px", borderRadius: 999 }}>
                  Featured
                </span>
              )}
              {discountPct > 0 && (
                <span style={{ fontSize: 11, fontWeight: 700, color: C.orange, background: "#fdf0e8", border: "1px solid #f0c4a0", padding: "3px 10px", borderRadius: 999 }}>
                  {discountPct}% Off
                </span>
              )}
            </div>

            {/* Rating */}
            {hasRating && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #f0ece6" }}>
                <span style={{ display: "inline-flex", gap: 2 }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} viewBox="0 0 24 24" fill={s <= Math.round(product.seller.average_rating ?? 0) ? "#f59e0b" : "#e0dbd2"} width={14} height={14}>
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.teal }}>
                  {(product.seller.average_rating ?? 0).toFixed(1)}
                </span>
                <span style={{ fontSize: 13, color: "#8a9e92" }}>
                  ({product.seller.review_count || 0} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 32, fontWeight: 800, color: "#1c2b23", letterSpacing: "-.5px" }}>
                  ${product.current_price.toFixed(2)}
                </span>
                <span style={{ fontSize: 15, color: "#8a9e92", fontWeight: 500 }}>
                  per {product.unit_of_measurement}
                </span>
              </div>
              {product.sale_price && product.sale_price < product.base_price && (
                <p style={{ fontSize: 13, color: "#8a9e92", margin: "4px 0 0" }}>
                  Was <span style={{ textDecoration: "line-through" }}>${product.base_price.toFixed(2)}</span>{" "}
                  <span style={{ color: C.orange, fontWeight: 700 }}>{discountPct}% off</span>
                </p>
              )}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "#f0ece6", marginBottom: 20 }} />

            {/* Bullet features */}
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 10 }}>
              {bullets.map((b, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "#3a4f44", lineHeight: 1.45 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.teal, flexShrink: 0, marginTop: 6, display: "inline-block" }} />
                  <span>{b}</span>
                </li>
              ))}
              {product.tags && product.tags.length > 0 && (
                <li style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "#3a4f44" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.teal, flexShrink: 0, marginTop: 6, display: "inline-block" }} />
                  <span>{product.tags.slice(0, 5).join(" · ")}</span>
                </li>
              )}
            </ul>

            {/* Divider */}
            <div style={{ height: 1, background: "#f0ece6", marginBottom: 24 }} />

            {/* About this product */}
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1c2b23", margin: "0 0 10px", letterSpacing: "-.2px" }}>
                About this product
              </h2>
              <p style={{ fontSize: 14, color: "#4a5f54", lineHeight: 1.75, margin: 0 }}>
                {product.description || product.short_description || `Fresh ${product.name} sourced directly from verified Grenadian farms.`}
              </p>
            </div>

            {/* Product details table */}
            <div style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: 14, overflow: "hidden", marginBottom: 24 }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #f0ece6", background: "#fafaf8" }}>
                <h3 style={{ fontSize: 12, fontWeight: 700, color: "#1c2b23", margin: 0, letterSpacing: ".02em", textTransform: "uppercase" }}>
                  Product details
                </h3>
              </div>
              <div className="bpd-detail-grid">
                {[
                  { label: "Category", value: product.category },
                  product.subcategory ? { label: "Type", value: product.subcategory } : null,
                  { label: "Unit", value: product.unit_of_measurement },
                  { label: "Condition", value: product.condition },
                  { label: "Origin", value: sellerLoc },
                  { label: "In Stock", value: `${stock} ${product.unit_of_measurement}` },
                ].filter(Boolean).map((item) => (
                  <div key={item!.label} style={{ padding: "12px 20px", borderBottom: "1px solid #f5f1ea", display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#8a9e92", textTransform: "uppercase", letterSpacing: ".06em" }}>{item!.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#1c2b23" }}>{item!.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Seller card */}
            <div style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: 16, padding: "20px 22px", marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, overflow: "hidden", flexShrink: 0, border: "1px solid #e8e4dc", background: `linear-gradient(155deg, #1e3528 0%, #2d5a42 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {product.seller?.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.seller.logo_url} alt={sellerName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{sellerInit}</span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#1c2b23" }}>{sellerName}</span>
                    {product.seller?.is_verified && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#2d4a3e", background: "#eef4f1", border: "1px solid #c8ddd4", padding: "1px 7px", borderRadius: 999 }}>
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: "#8a9e92", margin: "0 0 10px" }}>{sellerLoc}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Link
                      href={`/suppliers/${product.seller?.id}`}
                      style={{ padding: "7px 16px", fontSize: 12, fontWeight: 700, borderRadius: 999, background: C.teal, color: "#f5f1ea", textDecoration: "none" }}
                    >
                      View profile
                    </Link>
                    <button
                      onClick={handleMessage}
                      disabled={isStartingConvo}
                      style={{ padding: "7px 16px", fontSize: 12, fontWeight: 700, borderRadius: 999, border: "1px solid #e8e4dc", color: "#1c2b23", background: "transparent", cursor: isStartingConvo ? "not-allowed" : "pointer", opacity: isStartingConvo ? 0.6 : 1, fontFamily: C.font }}
                    >
                      {isStartingConvo ? "Starting…" : "Message seller"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Harvest update */}
            {hasHarvestUpdate && (
              <div style={{ background: "#f5f1ea", borderRadius: 12, padding: "16px 20px", border: "1px solid #e8e4dc", marginBottom: 16 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: C.teal, margin: "0 0 10px" }}>Harvest Update</h3>
                {harvestUpdate.expected_harvest_window && (
                  <p style={{ fontSize: 12, color: "#6a7f73", margin: "0 0 4px" }}>
                    Expected: <span style={{ color: "#1c2b23", fontWeight: 600 }}>{harvestUpdate.expected_harvest_window}</span>
                  </p>
                )}
                {typeof harvestUpdate.quantity === "number" && (
                  <p style={{ fontSize: 12, color: "#6a7f73", margin: "0 0 4px" }}>
                    Quantity: <span style={{ color: "#1c2b23", fontWeight: 600 }}>{harvestUpdate.quantity} {harvestUpdate.unit || ""}</span>
                  </p>
                )}
                {harvestUpdate.content?.trim() && (
                  <p style={{ fontSize: 13, color: "#4a5f54", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>{harvestUpdate.content}</p>
                )}
                {harvestUpdate.notes?.trim() && (
                  <p style={{ fontSize: 13, color: "#4a5f54", lineHeight: 1.6, margin: "8px 0 0", whiteSpace: "pre-wrap" }}>{harvestUpdate.notes}</p>
                )}
              </div>
            )}

            {/* Product update */}
            {hasProductUpdate && (
              <div style={{ background: "#f5f1ea", borderRadius: 12, padding: "16px 20px", border: "1px solid #e8e4dc" }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: C.teal, margin: "0 0 10px" }}>Product Update</h3>
                {productUpdate.title?.trim() && (
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#1c2b23", margin: "0 0 4px" }}>{productUpdate.title}</p>
                )}
                {productUpdate.content?.trim() && (
                  <p style={{ fontSize: 13, color: "#4a5f54", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>{productUpdate.content}</p>
                )}
              </div>
            )}
          </div>

          {/* ── Col 3: Sticky buy box ── */}
          <div className="bpd-buybox">
            <div className="bpd-sticky" style={{ position: "sticky", top: 80 }}>

              {/* Main buy card */}
              <div style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: 16, padding: "22px 20px", marginBottom: 12 }}>

                {/* Price */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontSize: 28, fontWeight: 800, color: "#1c2b23", letterSpacing: "-.4px" }}>
                      ${product.current_price.toFixed(2)}
                    </span>
                    <span style={{ fontSize: 13, color: "#8a9e92" }}>/ {product.unit_of_measurement}</span>
                  </div>
                  {product.sale_price && product.sale_price < product.base_price && (
                    <p style={{ fontSize: 12, color: C.orange, fontWeight: 700, margin: "3px 0 0" }}>
                      Save {discountPct}% — was ${product.base_price.toFixed(2)}
                    </p>
                  )}
                </div>

                {/* Stock indicator */}
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid #f5f1ea" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: stockDotColor, display: "inline-block", flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: lowStock ? C.orange : stockColor }}>
                    {stock > 0
                      ? lowStock
                        ? `Low stock — ${stock} ${product.unit_of_measurement} left`
                        : `In stock — ${stock} ${product.unit_of_measurement} available`
                      : "Out of stock"}
                  </span>
                </div>

                {/* Sold by */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #f5f1ea" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 7, overflow: "hidden", flexShrink: 0, border: "1px solid #e8e4dc", background: `linear-gradient(155deg, #1e3528 0%, #2d5a42 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {product.seller?.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.seller.logo_url} alt={sellerName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{sellerInit}</span>
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: 10, color: "#8a9e92", margin: "0 0 2px" }}>Sold by</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.teal }}>{sellerName}</span>
                      {product.seller?.is_verified && (
                        <span style={{ fontSize: 9, fontWeight: 700, color: "#2d4a3e", background: "#eef4f1", border: "1px solid #c8ddd4", padding: "1px 6px", borderRadius: 999 }}>
                          ✓ Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity + order total */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1c2b23", marginBottom: 8 }}>
                    Quantity ({product.unit_of_measurement})
                  </div>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid #e8e4dc", borderRadius: 10, overflow: "hidden", height: 44, opacity: isOOS ? 0.5 : 1, pointerEvents: isOOS ? "none" : "auto" }}>
                    <button
                      onClick={() => setQuantity((q) => Math.max(minQty(), q - 1))}
                      style={{ width: 44, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#fafaf9", border: "none", cursor: "pointer", color: "#3e5549", flexShrink: 0 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14" /></svg>
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const v = parseInt(e.target.value);
                        if (!isNaN(v)) setQuantity(Math.max(minQty(), Math.min(v, product.stock_quantity || 9999)));
                      }}
                      style={{ flex: 1, border: "none", borderLeft: "1px solid #e8e4dc", borderRight: "1px solid #e8e4dc", outline: "none", textAlign: "center", fontFamily: C.font, fontSize: 15, fontWeight: 700, color: "#1c2b23", background: "#fff", height: "100%" }}
                    />
                    <button
                      onClick={() => setQuantity((q) => Math.min(q + 1, product.stock_quantity || 9999))}
                      style={{ width: 44, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#fafaf9", border: "none", cursor: "pointer", color: "#3e5549", flexShrink: 0 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                    </button>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                    <span style={{ fontSize: 12, color: "#8a9e92", fontWeight: 500 }}>Order total</span>
                    <span style={{ fontSize: 20, fontWeight: 800, color: "#1c2b23", letterSpacing: "-.2px" }}>
                      ${(product.current_price * quantity).toFixed(2)}
                    </span>
                  </div>

                  {!meetsMin && !isOOS && (
                    <p style={{ fontSize: 12, color: "#92400e", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "8px 12px", margin: "8px 0 0" }}>
                      Min. order ${MIN_ORDER.toFixed(2)} — add ${(MIN_ORDER - product.current_price * quantity).toFixed(2)} more
                    </p>
                  )}
                </div>

                {/* CTA buttons */}
                <button
                  onClick={handleAddToCart}
                  disabled={!canAdd}
                  style={{ width: "100%", padding: 14, background: canAdd ? C.orange : "#e8e4dc", color: canAdd ? "#fff" : "#8a9e92", fontSize: 14, fontWeight: 700, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, border: "none", cursor: canAdd ? "pointer" : "not-allowed", fontFamily: C.font, marginBottom: 8, boxSizing: "border-box" } as React.CSSProperties}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                  </svg>
                  Add to cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!canAdd}
                  style={{ width: "100%", padding: 13, background: "transparent", color: canAdd ? "#1c2b23" : "#8a9e92", fontSize: 14, fontWeight: 600, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e8e4dc", cursor: canAdd ? "pointer" : "not-allowed", fontFamily: C.font, boxSizing: "border-box" } as React.CSSProperties}
                >
                  Buy now
                </button>
              </div>

              {/* Fulfillment info card */}
              <div style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: 14, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  {
                    icon: <svg viewBox="0 0 24 24" fill="none" stroke="#2d4a3e" strokeWidth="2" strokeLinecap="round" width={14} height={14}><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>,
                    text: "Typically 1–2 days within Grenada",
                  },
                  {
                    icon: <svg viewBox="0 0 24 24" fill="none" stroke="#2d4a3e" strokeWidth="2" strokeLinecap="round" width={14} height={14}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
                    text: `${sellerName} is a verified Procur supplier`,
                  },
                  {
                    icon: <svg viewBox="0 0 24 24" fill="none" stroke="#2d4a3e" strokeWidth="2" strokeLinecap="round" width={14} height={14}><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
                    text: "Freshness assured or full refund",
                  },
                ].map((row, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "#eef4f1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {row.icon}
                    </div>
                    <p style={{ fontSize: 12, color: "#6a7f73", margin: 0, lineHeight: 1.5, paddingTop: 4 }}>{row.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Related products ── */}
        {related.length > 0 && (
          <div className="bpd-related" style={{ marginTop: 56, paddingBottom: 0 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1c2b23", letterSpacing: "-.3px", margin: 0 }}>
                More from {sellerName}
              </h2>
              <Link
                href={`/suppliers/${product.seller?.id}`}
                style={{ fontSize: 13, fontWeight: 600, color: C.teal, display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}
              >
                View all
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div style={{ display: "flex", gap: 12, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4 }}>
              {related.map((rp) => {
                const rpStock = rp.stock_quantity ?? 0;
                const rpImg = (Array.isArray(rp.images) && rp.images[0]) || rp.image_url || "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg";
                const rpPrice = rp.current_price || rp.price || 0;
                return (
                  <div
                    key={rp.id}
                    style={{ flex: "0 0 200px", background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #e8e4dc" }}
                  >
                    <Link href={`/product/${rp.id}`} style={{ textDecoration: "none", display: "block" }}>
                      <div style={{ width: "100%", aspectRatio: "4/3", overflow: "hidden" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={rpImg} alt={rp.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      </div>
                      <div style={{ padding: "12px 14px 14px" }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#1c2b23", marginBottom: 2 }}>{rp.name}</div>
                        <div style={{ fontSize: 11, color: "#8a9e92" }}>{sellerName}</div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                          <span style={{ fontSize: 15, fontWeight: 800, color: "#1c2b23" }}>
                            ${rpPrice.toFixed(2)}{" "}
                            <span style={{ fontWeight: 400, fontSize: 10, color: "#8a9e92" }}>/{rp.unit_of_measurement || "lb"}</span>
                          </span>
                          <button
                            onClick={(e) => { e.preventDefault(); if (rpStock > 0) handleAddRelated(rp.id); }}
                            style={{ padding: "6px 14px", background: rpStock > 0 ? C.orange : "#e8e4dc", color: rpStock > 0 ? "#fff" : "#8a9e92", fontSize: 11, fontWeight: 700, borderRadius: 999, border: "none", cursor: rpStock > 0 ? "pointer" : "default", fontFamily: C.font }}
                          >
                            {rpStock > 0 ? "Add" : "Sold out"}
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
