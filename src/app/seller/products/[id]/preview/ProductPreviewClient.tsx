"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getApiClient } from "@/lib/apiClient";
import { useAppSelector } from "@/store";
import { selectCountry } from "@/store/slices/countrySlice";
import type { SellerProduct } from "@/store/slices/sellerProductsSlice";

// ── Design tokens ──────────────────────────────────────────────────────────────
const BG    = "#faf8f4";
const CARD  = "#fff";
const EDGE  = "#ebe7df";
const TEAL  = "#2d4a3e";
const ORANGE = "#d4783c";
const DARK  = "#1c2b23";
const MUTED = "#8a9e92";
const F     = "'Urbanist', system-ui, sans-serif";

interface ProductPreviewClientProps { productId: string }

export default function ProductPreviewClient({ productId }: ProductPreviewClientProps) {
  const router = useRouter();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const { currency: accountCurrency } = useAppSelector(selectCountry);

  const [isLoading,           setIsLoading]          = useState(true);
  const [error,               setError]              = useState<string | null>(null);
  const [product,             setProduct]            = useState<SellerProduct | null>(null);
  const [selectedImageIndex,  setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (!productId || !accessToken) return;
    (async () => {
      try {
        const { data } = await getApiClient(() => accessToken).get(`/sellers/products/${productId}`);
        setProduct(data as SellerProduct);
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [productId, accessToken]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 14, color: MUTED, fontFamily: F }}>Loading preview…</div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !product) {
    return (
      <div style={{ minHeight: "100vh", background: BG, fontFamily: F }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{
            padding: "20px 24px",
            background: "rgba(212,120,60,.08)", border: `1px solid ${ORANGE}`,
            borderRadius: 10,
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 6 }}>
              Error loading product
            </div>
            <div style={{ fontSize: 13, color: MUTED, marginBottom: 14 }}>
              {error || "Product not found"}
            </div>
            <Link
              href="/seller/products"
              style={{
                display: "inline-block", padding: "7px 18px", borderRadius: 9999,
                background: ORANGE, color: "#fff", fontSize: 13, fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images     = product.images || [];
  const img        = images[selectedImageIndex]?.image_url;
  const hasDiscount = product.sale_price != null && product.sale_price < product.base_price;
  const discountPct = hasDiscount
    ? Math.round(((product.base_price - product.sale_price!) / product.base_price) * 100)
    : 0;

  const stockColor = product.stock_quantity === 0
    ? "#d04040"
    : product.stock_quantity <= 5
    ? "#d97706"
    : "#2a9e6c";

  // Attribute rows (only non-null)
  const attrs = [
    { label: "SKU",      value: product.sku      },
    { label: "Brand",    value: product.brand     },
    { label: "Model",    value: product.model     },
    { label: "Color",    value: product.color     },
    { label: "Size",     value: product.size      },
    { label: "Barcode",  value: product.barcode   },
    { label: "Condition",value: product.condition },
    { label: "Currency", value: accountCurrency },
  ].filter(a => a.value);

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: F }}>

      {/* Preview mode banner */}
      <div style={{
        background: TEAL, color: "#fff",
        textAlign: "center", padding: "8px 16px",
        fontSize: 12.5, fontWeight: 600, letterSpacing: ".02em",
      }}>
        Buyer Preview — this is exactly how buyers see your listing
      </div>

      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "24px 24px 60px" }}>

        {/* Top nav row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: MUTED }}>
            <Link href="/seller" style={{ color: MUTED, textDecoration: "none" }}>Dashboard</Link>
            <span>/</span>
            <Link href="/seller/products" style={{ color: MUTED, textDecoration: "none" }}>Products</Link>
            <span>/</span>
            <span style={{ color: DARK }}>Preview</span>
          </nav>
          <div style={{ display: "flex", gap: 8 }}>
            <Link
              href={`/seller/products/${productId}/edit`}
              style={{
                padding: "7px 18px", borderRadius: 9999,
                border: `1px solid ${EDGE}`, background: CARD,
                color: DARK, fontSize: 13, fontWeight: 600, textDecoration: "none",
              }}
            >
              Edit Product
            </Link>
            <Link
              href="/seller/products"
              style={{
                padding: "7px 18px", borderRadius: 9999,
                background: ORANGE, color: "#fff",
                fontSize: 13, fontWeight: 600, textDecoration: "none",
              }}
            >
              ← Products
            </Link>
          </div>
        </div>

        {/* Main two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>

          {/* Left: Image gallery */}
          <div style={{ position: "sticky", top: 80 }}>
            {/* Main image */}
            <div style={{
              aspectRatio: "1 / 1", borderRadius: 12,
              background: "#f0ece4", border: `1px solid ${EDGE}`,
              overflow: "hidden", position: "relative", marginBottom: 10,
            }}>
              {img ? (
                <img
                  src={img} alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={{
                  width: "100%", height: "100%",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", color: "#c8d8cf",
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" width={48} height={48}>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span style={{ marginTop: 8, fontSize: 12, color: MUTED }}>No image</span>
                </div>
              )}

              {/* Overlay badges */}
              <div style={{ position: "absolute", top: 12, left: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                {product.is_featured && (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "4px 10px", borderRadius: 9999,
                    background: "#f59e0b", color: "#fff",
                    fontSize: 11.5, fontWeight: 700,
                  }}>
                    ★ Featured
                  </span>
                )}
                {product.is_organic && (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "4px 10px", borderRadius: 9999,
                    background: "#22c55e", color: "#fff",
                    fontSize: 11.5, fontWeight: 700,
                  }}>
                    ✓ Organic
                  </span>
                )}
                {hasDiscount && (
                  <span style={{
                    padding: "4px 10px", borderRadius: 9999,
                    background: ORANGE, color: "#fff",
                    fontSize: 11.5, fontWeight: 700,
                  }}>
                    {discountPct}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                {images.map((image, idx) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(idx)}
                    style={{
                      aspectRatio: "1 / 1", borderRadius: 8, overflow: "hidden",
                      border: `2px solid ${idx === selectedImageIndex ? ORANGE : EDGE}`,
                      cursor: "pointer", padding: 0, background: "none",
                      transition: "border-color .15s",
                    }}
                  >
                    <img
                      src={image.image_url}
                      alt={image.alt_text || `Image ${idx + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product info */}
          <div>
            {/* Name + category */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11.5, color: MUTED, marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>
                {product.category}{product.subcategory ? ` · ${product.subcategory}` : ""}
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 700, color: DARK, lineHeight: 1.25, margin: 0 }}>
                {product.name}
              </h1>
              {product.short_description && (
                <p style={{ fontSize: 14.5, color: MUTED, marginTop: 8, lineHeight: 1.6 }}>
                  {product.short_description}
                </p>
              )}
            </div>

            <div style={{ borderTop: `1px solid ${EDGE}`, marginBottom: 18 }} />

            {/* Price block */}
            <div style={{
              background: BG, border: `1px solid ${EDGE}`,
              borderRadius: 10, padding: "16px 20px", marginBottom: 16,
            }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
                {hasDiscount ? (
                  <>
                    <span style={{ fontSize: 30, fontWeight: 800, color: ORANGE }}>
                      ${product.sale_price!.toFixed(2)}
                    </span>
                    <span style={{ fontSize: 18, color: "#c0bdb8", textDecoration: "line-through" }}>
                      ${product.base_price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span style={{ fontSize: 30, fontWeight: 800, color: DARK }}>
                    ${product.base_price.toFixed(2)}
                  </span>
                )}
                <span style={{ fontSize: 15, color: MUTED }}>
                  / {product.unit_of_measurement}
                </span>
              </div>
              <div style={{ fontSize: 11.5, color: MUTED }}>
                Currency: {accountCurrency}
              </div>
            </div>

            {/* Stock + condition pills */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              <span style={{
                padding: "5px 14px", borderRadius: 9999,
                background: `${stockColor}14`, color: stockColor,
                fontSize: 12.5, fontWeight: 700,
              }}>
                {product.stock_quantity > 0
                  ? `${product.stock_quantity} in stock`
                  : "Out of stock"}
              </span>
              {product.condition && (
                <span style={{
                  padding: "5px 14px", borderRadius: 9999,
                  background: "rgba(45,74,62,.08)", color: TEAL,
                  fontSize: 12.5, fontWeight: 600, textTransform: "capitalize",
                }}>
                  {product.condition}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div style={{
                background: CARD, border: `1px solid ${EDGE}`,
                borderRadius: 10, padding: "16px 20px", marginBottom: 14,
              }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: DARK, marginBottom: 8, textTransform: "uppercase", letterSpacing: ".04em" }}>
                  Description
                </div>
                <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0 }}>
                  {product.description}
                </p>
              </div>
            )}

            {/* Product details grid */}
            {attrs.length > 0 && (
              <div style={{
                background: CARD, border: `1px solid ${EDGE}`,
                borderRadius: 10, padding: "16px 20px", marginBottom: 14,
              }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: DARK, marginBottom: 12, textTransform: "uppercase", letterSpacing: ".04em" }}>
                  Product Details
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {attrs.map(a => (
                    <div key={a.label}>
                      <div style={{ fontSize: 11, color: MUTED, marginBottom: 2 }}>{a.label}</div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: DARK, textTransform: a.label === "Condition" ? "capitalize" : undefined }}>
                        {a.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: DARK, marginBottom: 8, textTransform: "uppercase", letterSpacing: ".04em" }}>
                  Tags
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {product.tags.map((tag, i) => (
                    <span
                      key={i}
                      style={{
                        padding: "4px 12px", borderRadius: 9999,
                        background: "rgba(45,74,62,.08)", color: TEAL,
                        fontSize: 12.5, fontWeight: 600,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ borderTop: `1px solid ${EDGE}`, marginBottom: 16 }} />

            {/* Disabled CTA row */}
            <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <button
                disabled
                style={{
                  flex: 1, padding: "13px 0", borderRadius: 9999,
                  background: ORANGE, color: "#fff",
                  fontSize: 15, fontWeight: 700, border: "none",
                  opacity: 0.45, cursor: "not-allowed", fontFamily: F,
                }}
              >
                Add to Cart
              </button>
              <button
                disabled
                style={{
                  width: 48, height: 48, borderRadius: 9999,
                  border: `1.5px solid ${EDGE}`, background: CARD,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "not-allowed", opacity: 0.45, color: DARK,
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" width={20} height={20}>
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </button>
            </div>
            <div style={{ fontSize: 11.5, color: MUTED, textAlign: "center" }}>
              Preview mode — buttons are disabled for sellers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
