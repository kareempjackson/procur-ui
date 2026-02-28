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

  return (
    <div style={{ background: C.creamL, fontFamily: C.font, minHeight: "100vh" }}>
      <style>{`
        @media (max-width: 1024px) {
          .pdp-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .buy-box { position: static !important; }
        }
        @media (max-width: 768px) {
          .pdp-wrap { padding: 16px 16px 32px !important; }
          .pdp-main { grid-template-columns: 1fr !important; }
          .img-thumbs { flex-direction: row !important; order: 2; }
          .img-thumb-btn { width: 56px !important; height: 56px !important; }
          .pdp-title { font-size: 24px !important; }
          .related-wrap { padding: 0 16px 32px !important; }
          .rel-card { flex: 0 0 170px !important; }
          .pdp-bread { padding: 12px 16px 0 !important; }
        }
      `}</style>

      {/* Breadcrumb */}
      <nav
        className="pdp-bread"
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "16px 28px 0",
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12.5,
          color: C.t4,
          fontWeight: 500,
        }}
      >
        <Link href="/" style={{ color: C.t4, textDecoration: "none" }}>
          Marketplace
        </Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: 0.4 }}>
          <path d="M9 18l6-6-6-6" />
        </svg>
        <Link
          href={`/?category=${encodeURIComponent(product.category || "")}`}
          style={{ color: C.t4, textDecoration: "none" }}
        >
          {product.category || "Category"}
        </Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: 0.4 }}>
          <path d="M9 18l6-6-6-6" />
        </svg>
        <span style={{ color: "#3e5549", fontWeight: 600 }}>{product.name}</span>
      </nav>

      {/* PDP grid */}
      <div
        className="pdp-wrap"
        style={{ maxWidth: 1320, margin: "0 auto", padding: "20px 28px 40px" }}
      >
        <div
          className="pdp-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 400px",
            gap: 28,
            alignItems: "start",
          }}
        >
          {/* ── LEFT COLUMN ── */}
          <div>
            <div
              className="pdp-main"
              style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: 14 }}
            >
              {/* Thumbnail strip */}
              <div
                className="img-thumbs"
                style={{ display: "flex", flexDirection: "column", gap: 8 }}
              >
                {images.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    className="img-thumb-btn"
                    onClick={() => setActiveImg(i)}
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 8,
                      overflow: "hidden",
                      cursor: "pointer",
                      border: `2px solid ${activeImg === i ? C.teal : "transparent"}`,
                      opacity: activeImg === i ? 1 : 0.5,
                      transition: "all .15s",
                      background: "none",
                      padding: 0,
                      flexShrink: 0,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`${product.name} ${i + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </button>
                ))}
              </div>

              {/* Main image */}
              <div
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  background: C.cream,
                  position: "relative",
                  aspectRatio: "1/1",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[activeImg] || images[0]}
                  alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    padding: "4px 10px",
                    background: stock > 0 ? C.green : "#dc2626",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 700,
                    borderRadius: 5,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
                <button
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: C.white,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    border: "none",
                    color: C.t4,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                </button>
              </div>

              {/* Product info — full width below gallery */}
              <div style={{ gridColumn: "1/-1", marginTop: 8 }}>
                {/* Category */}
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.orange,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: 6,
                  }}
                >
                  {product.category}
                </div>

                {/* Title */}
                <h1
                  className="pdp-title"
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: C.dark,
                    letterSpacing: "-0.4px",
                    lineHeight: 1.1,
                    margin: 0,
                  }}
                >
                  {product.name}
                </h1>

                {/* Description */}
                <p
                  style={{
                    fontSize: 14,
                    color: C.t3,
                    marginTop: 8,
                    lineHeight: 1.6,
                    maxWidth: 560,
                    margin: "8px 0 0",
                  }}
                >
                  {product.description ||
                    product.short_description ||
                    "Fresh produce sourced directly from verified Grenadian farms."}
                </p>

                {/* Rating row — hidden if no ratings */}
                {hasRating && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginTop: 12,
                      paddingTop: 12,
                      borderTop: `1px solid ${C.warm}`,
                    }}
                  >
                    <div style={{ display: "flex", gap: 1 }}>
                      {[1, 2, 3, 4, 5].map((s) => {
                        const filled = s <= Math.round(product.seller.average_rating ?? 0);
                        return (
                          <svg
                            key={s}
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            style={{ fill: filled ? C.orange : C.warm, color: filled ? C.orange : C.warm }}
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
                          </svg>
                        );
                      })}
                    </div>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: C.t3 }}>
                      <b style={{ color: C.teal }}>{(product.seller.average_rating ?? 0).toFixed(1)}</b>{" "}
                      ({product.seller.review_count || 0} reviews)
                    </span>
                    <span style={{ width: 1, height: 14, background: C.warm, display: "inline-block" }} />
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: C.t3 }}>
                      {product.seller.product_count || 0} products
                    </span>
                  </div>
                )}

                {/* Details grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    marginTop: 16,
                    border: `1px solid ${C.warm}`,
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  {[
                    { label: "Category", val: product.category, green: false },
                    { label: "Available Stock", val: `${stock} ${product.unit_of_measurement}`, green: false },
                    { label: "Status", val: stock > 0 ? "In Stock" : "Sold Out", green: stock > 0 },
                    { label: "Unit", val: `Per ${product.unit_of_measurement}`, green: false },
                    { label: "Origin", val: "Grenada", green: false },
                    { label: "Harvest", val: "This week", green: false },
                  ].map((item, i) => (
                    <div
                      key={item.label}
                      style={{
                        padding: "12px 16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: i < 4 ? `1px solid ${C.warm}` : "none",
                        borderRight: i % 2 === 0 ? `1px solid ${C.warm}` : "none",
                        background: C.white,
                      }}
                    >
                      <span style={{ fontSize: 12, fontWeight: 500, color: C.t4 }}>{item.label}</span>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: item.green ? C.green : C.dark }}>
                        {item.val}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Seller card */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginTop: 16,
                    padding: "14px 16px",
                    background: "transparent",
                    border: `1px solid ${C.warm}`,
                    borderRadius: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: C.teal,
                      color: C.cream,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {sellerInit}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: C.dark,
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      {sellerName}
                      {product.seller?.is_verified && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2" strokeLinecap="round">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: C.t4, fontWeight: 500 }}>{sellerLoc}</div>
                  </div>
                  <div style={{ display: "flex", gap: 16, flexShrink: 0 }}>
                    <div style={{ textAlign: "center" }}>
                      <strong style={{ fontSize: 14, fontWeight: 800, color: C.dark, display: "block", lineHeight: 1 }}>
                        {product.seller?.product_count || 0}
                      </strong>
                      <span style={{ fontSize: 9.5, fontWeight: 500, color: C.t4, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        Products
                      </span>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <strong style={{ fontSize: 14, fontWeight: 800, color: C.dark, display: "block", lineHeight: 1 }}>
                        {typeof product.seller?.average_rating === "number"
                          ? product.seller.average_rating.toFixed(1)
                          : "—"}
                      </strong>
                      <span style={{ fontSize: 9.5, fontWeight: 500, color: C.t4, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        Rating
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <Link
                      href={`/suppliers/${product.seller?.id}`}
                      style={{
                        padding: "7px 14px",
                        fontSize: 11.5,
                        fontWeight: 700,
                        borderRadius: 6,
                        background: C.teal,
                        color: C.cream,
                        textDecoration: "none",
                      }}
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={handleMessage}
                      disabled={isStartingConvo}
                      style={{
                        padding: "7px 14px",
                        fontSize: 11.5,
                        fontWeight: 700,
                        borderRadius: 6,
                        border: `1px solid ${C.warm}`,
                        color: "#3e5549",
                        background: "transparent",
                        cursor: isStartingConvo ? "not-allowed" : "pointer",
                        opacity: isStartingConvo ? 0.6 : 1,
                        fontFamily: C.font,
                      }}
                    >
                      {isStartingConvo ? "…" : "Message"}
                    </button>
                  </div>
                </div>

                {/* Harvest update */}
                {hasHarvestUpdate && (
                  <div
                    style={{
                      marginTop: 16,
                      background: C.cream,
                      borderRadius: 10,
                      padding: 16,
                      border: `1px solid ${C.warm}`,
                    }}
                  >
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: C.teal, margin: "0 0 8px" }}>
                      Harvest Update
                    </h3>
                    {harvestUpdate.expected_harvest_window && (
                      <p style={{ fontSize: 12, color: C.t4, margin: "0 0 4px" }}>
                        Expected:{" "}
                        <span style={{ color: C.dark, fontWeight: 600 }}>
                          {harvestUpdate.expected_harvest_window}
                        </span>
                      </p>
                    )}
                    {typeof harvestUpdate.quantity === "number" && (
                      <p style={{ fontSize: 12, color: C.t4, margin: "0 0 4px" }}>
                        Quantity:{" "}
                        <span style={{ color: C.dark, fontWeight: 600 }}>
                          {harvestUpdate.quantity} {harvestUpdate.unit || ""}
                        </span>
                      </p>
                    )}
                    {harvestUpdate.content?.trim() && (
                      <p style={{ fontSize: 13, color: C.t3, lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>
                        {harvestUpdate.content}
                      </p>
                    )}
                    {harvestUpdate.notes?.trim() && (
                      <p style={{ fontSize: 13, color: C.t3, lineHeight: 1.6, margin: "8px 0 0", whiteSpace: "pre-wrap" }}>
                        {harvestUpdate.notes}
                      </p>
                    )}
                  </div>
                )}

                {/* Product update */}
                {hasProductUpdate && (
                  <div
                    style={{
                      marginTop: 16,
                      background: C.cream,
                      borderRadius: 10,
                      padding: 16,
                      border: `1px solid ${C.warm}`,
                    }}
                  >
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: C.teal, margin: "0 0 8px" }}>
                      Product Update
                    </h3>
                    {productUpdate.title?.trim() && (
                      <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, margin: "0 0 4px" }}>
                        {productUpdate.title}
                      </p>
                    )}
                    {productUpdate.content?.trim() && (
                      <p style={{ fontSize: 13, color: C.t3, lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>
                        {productUpdate.content}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Sticky buy box ── */}
          <div
            className="buy-box"
            style={{
              position: "sticky",
              top: 80,
              background: C.white,
              border: `1px solid ${C.warm}`,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {/* Price section */}
            <div style={{ padding: "22px 22px 14px", borderBottom: `1px solid ${C.warm}` }}>
              <div>
                <span
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    color: C.dark,
                    letterSpacing: "-0.4px",
                    lineHeight: 1,
                  }}
                >
                  ${product.current_price.toFixed(2)}
                </span>
                <span style={{ fontSize: 13, fontWeight: 500, color: C.t4, marginLeft: 3 }}>
                  per {product.unit_of_measurement}
                </span>
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  marginTop: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  color: lowStock ? C.orange : stockColor,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: stockDotColor,
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                {stock > 0
                  ? lowStock
                    ? `Low Stock — ${stock} ${product.unit_of_measurement} left`
                    : `In Stock — ${stock} ${product.unit_of_measurement} available`
                  : "Out of Stock"}
              </div>
            </div>

            {/* Info rows */}
            <div style={{ padding: "16px 22px" }}>
              {[
                { label: "Seller", val: sellerName },
                { label: "Location", val: sellerLoc },
                { label: "Min. Order", val: `$${MIN_ORDER.toFixed(2)}` },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    fontSize: 13,
                    borderBottom: i < arr.length - 1 ? `1px solid rgba(235,231,223,.5)` : "none",
                  }}
                >
                  <span style={{ color: C.t4, fontWeight: 500 }}>{row.label}</span>
                  <span style={{ fontWeight: 700, color: C.dark }}>{row.val}</span>
                </div>
              ))}

              {/* Quantity selector */}
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.dark, marginBottom: 8 }}>
                  Quantity ({product.unit_of_measurement})
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: `1px solid ${C.warm}`,
                    borderRadius: 8,
                    overflow: "hidden",
                    height: 42,
                    opacity: isOOS ? 0.5 : 1,
                    pointerEvents: isOOS ? "none" : "auto",
                  }}
                >
                  <button
                    onClick={() => setQuantity((q) => Math.max(minQty(), q - 1))}
                    style={{
                      width: 42,
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: C.creamL,
                      border: "none",
                      cursor: "pointer",
                      color: "#3e5549",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const v = parseInt(e.target.value);
                      if (!isNaN(v))
                        setQuantity(Math.max(minQty(), Math.min(v, product.stock_quantity || 9999)));
                    }}
                    style={{
                      flex: 1,
                      border: "none",
                      borderLeft: `1px solid ${C.warm}`,
                      borderRight: `1px solid ${C.warm}`,
                      outline: "none",
                      textAlign: "center",
                      fontFamily: C.font,
                      fontSize: 15,
                      fontWeight: 700,
                      color: C.dark,
                      background: C.white,
                      height: "100%",
                    }}
                  />
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(q + 1, product.stock_quantity || 9999))
                    }
                    style={{
                      width: 42,
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: C.creamL,
                      border: "none",
                      cursor: "pointer",
                      color: "#3e5549",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <span style={{ fontSize: 12, color: C.t4, fontWeight: 500 }}>Order total</span>
                  <span
                    style={{ fontSize: 20, fontWeight: 800, color: C.dark, letterSpacing: "-0.2px" }}
                  >
                    ${(product.current_price * quantity).toFixed(2)}
                  </span>
                </div>

                {!meetsMin && !isOOS && (
                  <p
                    style={{
                      fontSize: 12,
                      color: "#92400e",
                      background: "#fffbeb",
                      border: "1px solid #fde68a",
                      borderRadius: 8,
                      padding: "8px 12px",
                      margin: "8px 0 0",
                    }}
                  >
                    Min. order ${MIN_ORDER.toFixed(2)} — add $
                    {(MIN_ORDER - product.current_price * quantity).toFixed(2)} more
                  </p>
                )}
              </div>
            </div>

            {/* CTA buttons */}
            <div style={{ padding: "0 22px 22px" }}>
              <button
                onClick={handleAddToCart}
                disabled={!canAdd}
                style={{
                  width: "100%",
                  padding: 14,
                  background: canAdd ? C.orange : C.warm,
                  color: canAdd ? "#fff" : C.t4,
                  fontSize: 14,
                  fontWeight: 700,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  border: "none",
                  cursor: canAdd ? "pointer" : "not-allowed",
                  fontFamily: C.font,
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                </svg>
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!canAdd}
                style={{
                  width: "100%",
                  padding: 12,
                  background: "transparent",
                  color: canAdd ? C.teal : C.t4,
                  fontSize: 13,
                  fontWeight: 700,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `1px solid ${C.warm}`,
                  cursor: canAdd ? "pointer" : "not-allowed",
                  marginTop: 8,
                  fontFamily: C.font,
                }}
              >
                Buy Now
              </button>
            </div>

            {/* Delivery info */}
            <div style={{ padding: "0 22px 18px" }}>
              {[
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                  ),
                  title: "Delivery available",
                  sub: "Typically 1–2 days within Grenada",
                },
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  ),
                  title: "Verified seller",
                  sub: `${sellerName} is a verified Procur supplier`,
                },
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M23 6l-13.5 13.5L3 13" />
                    </svg>
                  ),
                  title: "Quality guaranteed",
                  sub: "Freshness assured or full refund",
                },
              ].map((item, i, arr) => (
                <div
                  key={item.title}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "8px 0",
                    fontSize: 12,
                    color: C.t3,
                    borderBottom: i < arr.length - 1 ? `1px solid rgba(235,231,223,.4)` : "none",
                  }}
                >
                  <span style={{ color: C.t4, marginTop: 1, flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <b style={{ color: C.dark, fontWeight: 700 }}>{item.title}</b>
                    <br />
                    {item.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Related products ── */}
      {related.length > 0 && (
        <div
          className="related-wrap"
          style={{ maxWidth: 1320, margin: "0 auto", padding: "0 28px 48px" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 700, color: C.dark, letterSpacing: "-0.2px" }}>
              More from {sellerName}
            </h2>
            <Link
              href={`/suppliers/${product.seller?.id}`}
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: C.teal,
                display: "flex",
                alignItems: "center",
                gap: 4,
                textDecoration: "none",
              }}
            >
              View all{" "}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              overflowX: "auto",
              scrollbarWidth: "none",
              paddingBottom: 4,
            }}
          >
            {related.map((rp) => {
              const rpStock = rp.stock_quantity ?? 0;
              const rpImg =
                (Array.isArray(rp.images) && rp.images[0]) ||
                rp.image_url ||
                "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg";
              const rpPrice = rp.current_price || rp.price || 0;

              return (
                <div
                  key={rp.id}
                  className="rel-card"
                  style={{
                    flex: "0 0 200px",
                    background: C.white,
                    borderRadius: 12,
                    overflow: "hidden",
                    border: `1px solid ${C.warm}`,
                  }}
                >
                  <Link href={`/product/${rp.id}`} style={{ textDecoration: "none", display: "block" }}>
                    <div style={{ width: "100%", aspectRatio: "4/3", overflow: "hidden" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={rpImg}
                        alt={rp.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    </div>
                    <div style={{ padding: "12px 14px 14px" }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.dark, marginBottom: 2 }}>
                        {rp.name}
                      </div>
                      <div style={{ fontSize: 11, color: C.t4 }}>{sellerName}</div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: 8,
                        }}
                      >
                        <span style={{ fontSize: 16, fontWeight: 800, color: C.dark }}>
                          ${rpPrice.toFixed(2)}{" "}
                          <i style={{ fontWeight: 400, fontSize: 10, color: C.t4, fontStyle: "normal" }}>
                            /{rp.unit_of_measurement || "lb"}
                          </i>
                        </span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (rpStock > 0) handleAddRelated(rp.id);
                          }}
                          style={{
                            padding: "6px 14px",
                            background: rpStock > 0 ? C.orange : C.warm,
                            color: rpStock > 0 ? "#fff" : C.t4,
                            fontSize: 11,
                            fontWeight: 700,
                            borderRadius: 6,
                            border: "none",
                            cursor: rpStock > 0 ? "pointer" : "default",
                            fontFamily: C.font,
                          }}
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
  );
}
