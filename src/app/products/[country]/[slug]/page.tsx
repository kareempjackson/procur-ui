import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ImageGallery from "./ImageGallery";

interface ProductPageProps {
  params: Promise<{ country: string; slug: string }>;
}

type PublicSeller = {
  id: string;
  name: string;
  location?: string;
  description?: string;
  logo_url?: string;
  average_rating?: number;
  review_count: number;
  product_count: number;
  is_verified: boolean;
  specialties?: string[];
};

type FarmOrigin = {
  parish?: string;
  country?: string;
  is_organic?: boolean;
};

type PublicProduct = {
  id: string;
  name: string;
  description?: string;
  short_description?: string;
  category: string;
  subcategory?: string;
  current_price: number;
  base_price: number;
  sale_price?: number;
  currency: string;
  stock_quantity: number;
  unit_of_measurement: string;
  condition: string;
  image_url?: string;
  images?: string[];
  tags?: string[];
  is_organic: boolean;
  is_local: boolean;
  is_featured: boolean;
  average_rating?: number;
  review_count: number;
  seller: PublicSeller;
  farm_origin?: FarmOrigin;
};

function splitSlug(slug: string): { id: string | null; nameSlug: string } {
  const uuidMatch = slug.match(/^(.*)-([0-9a-fA-F-]{36})$/);
  if (uuidMatch) {
    const [, namePart, id] = uuidMatch;
    return { id, nameSlug: namePart || slug };
  }
  const parts = slug.split("-");
  if (parts.length < 2) return { id: null, nameSlug: slug };
  const id = parts[parts.length - 1];
  return { id, nameSlug: parts.slice(0, -1).join("-") };
}

function toTitle(str: string): string {
  return str
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 24 24" fill={i <= full ? "#f59e0b" : "#e0dbd2"} width={14} height={14}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug, country } = await params;
  const { nameSlug } = splitSlug(slug);
  const readableName = toTitle(nameSlug || slug);
  const readableCountry = toTitle(country);
  const title = `${readableName} from ${readableCountry} · Procur Marketplace`;
  return {
    title,
    description: `View details for ${readableName} from ${readableCountry} on Procur's fresh produce marketplace. Create a free buyer account to request quotes and place orders.`,
    openGraph: {
      title,
      description: `Discover ${readableName} from verified farms in ${readableCountry}. Sign up to buy on Procur.`,
    },
  };
}

async function fetchPublicProduct(productId: string): Promise<PublicProduct | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";
  try {
    const res = await fetch(`${baseUrl}/marketplace/products/${productId}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as PublicProduct;
  } catch {
    return null;
  }
}

const CSS = `
.pd-wrap { max-width: 1300px; margin: 0 auto; padding: 0 20px 96px; }
.pd-layout {
  display: grid;
  grid-template-columns: 500px 1fr 296px;
  gap: 40px;
  align-items: start;
}
.pd-detail-grid { display: grid; grid-template-columns: 1fr 1fr; }
@media (max-width: 1100px) {
  .pd-layout {
    grid-template-columns: 1fr 280px;
    gap: 28px;
  }
  .pd-gallery { grid-column: 1 / 3; max-width: 600px; }
  .pd-info { grid-column: 1 / 2; }
  .pd-buybox { grid-column: 2 / 3; grid-row: 2; }
}
@media (max-width: 720px) {
  .pd-layout { grid-template-columns: 1fr; gap: 20px; }
  .pd-gallery,
  .pd-info,
  .pd-buybox { grid-column: auto !important; grid-row: auto !important; }
  .pd-sticky { position: static !important; top: auto !important; }
  .pd-detail-grid { grid-template-columns: 1fr; }
}
`;

export default async function PublicProductPage({ params }: ProductPageProps) {
  const { slug, country } = await params;
  const { id: productId, nameSlug } = splitSlug(slug);
  const readableName = toTitle(nameSlug || slug);
  const readableCountry = toTitle(country);

  const product = productId ? await fetchPublicProduct(productId) : null;

  const images: string[] =
    (product?.images && product.images.length > 0
      ? product.images
      : product?.image_url
        ? [product.image_url]
        : []) || [];

  const displayName = product?.name || readableName;

  const discountPct =
    product?.sale_price && product.sale_price < product.base_price
      ? Math.round(((product.base_price - product.sale_price) / product.base_price) * 100)
      : 0;

  const bullets = product
    ? [
        product.is_organic && { text: "Certified Organic" },
        product.is_featured && { text: "Featured by Procur" },
        product.farm_origin?.parish && {
          text: `From ${product.farm_origin.parish}${product.farm_origin.country ? `, ${product.farm_origin.country}` : ""}`,
        },
        { text: `${product.stock_quantity} ${product.unit_of_measurement} available` },
        { text: `Sold by ${product.seller.name}${product.seller.is_verified ? " · Verified Supplier" : ""}` },
      ].filter(Boolean)
    : [];

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
      <style>{CSS}</style>

      {/* ── Header ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "#2d4a3e" }}>
        <div
          style={{
            height: 58,
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            maxWidth: 1300,
            margin: "0 auto",
          }}
        >
          <Link
            href="/"
            style={{ textDecoration: "none", flexShrink: 0, display: "flex", alignItems: "center" }}
          >
            <Image
              src="/images/logos/procur-logo.svg"
              alt="Procur"
              width={88}
              height={23}
              style={{ filter: "brightness(0) invert(1)" }}
              priority
            />
          </Link>
          <div style={{ flex: 1 }} />
          <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Link
              href="/browse"
              style={{
                padding: "6px 14px",
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(245,241,234,.7)",
                textDecoration: "none",
              }}
            >
              Browse
            </Link>
            <Link
              href="/sellers"
              style={{
                padding: "6px 14px",
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(245,241,234,.7)",
                textDecoration: "none",
              }}
            >
              Farms
            </Link>
          </nav>
          <div
            style={{
              width: 1,
              height: 18,
              background: "rgba(245,241,234,.15)",
              margin: "0 10px",
            }}
          />
          <Link
            href="/login"
            style={{
              padding: "6px 12px",
              fontSize: 12,
              fontWeight: 600,
              color: "rgba(245,241,234,.7)",
              textDecoration: "none",
            }}
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            style={{
              marginLeft: 6,
              padding: "7px 16px",
              background: "#d4783c",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 999,
              textDecoration: "none",
            }}
          >
            Get started
          </Link>
        </div>
      </header>

      {/* ── Not found ── */}
      {!product && (
        <main style={{ maxWidth: 1300, margin: "0 auto", padding: "60px 20px" }}>
          <p style={{ fontSize: 12, color: "#8a9e92", marginBottom: 20 }}>
            <Link href="/browse" style={{ color: "#2d4a3e", fontWeight: 700, textDecoration: "none" }}>
              ← Marketplace
            </Link>
          </p>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#1c2b23",
              marginBottom: 12,
              letterSpacing: "-.4px",
            }}
          >
            {displayName}
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "#6a7f73",
              marginBottom: 28,
              lineHeight: 1.6,
              maxWidth: 480,
            }}
          >
            We couldn&apos;t load full details for this product. It may be unavailable or no longer listed.
          </p>
          <Link
            href="/browse"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "12px 24px",
              background: "#2d4a3e",
              color: "#f5f1ea",
              fontSize: 13,
              fontWeight: 700,
              borderRadius: 999,
              textDecoration: "none",
            }}
          >
            Browse the marketplace
          </Link>
        </main>
      )}

      {/* ── Product page ── */}
      {product && (
        <main className="pd-wrap">
          {/* Breadcrumb */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "18px 0 28px",
              fontSize: 12,
              color: "#8a9e92",
              flexWrap: "wrap",
            }}
          >
            <Link href="/" style={{ color: "#2d4a3e", fontWeight: 600, textDecoration: "none" }}>
              Home
            </Link>
            <span>/</span>
            <Link href="/browse" style={{ color: "#2d4a3e", fontWeight: 600, textDecoration: "none" }}>
              Marketplace
            </Link>
            <span>/</span>
            <span style={{ color: "#8a9e92" }}>{product.category}</span>
            <span>/</span>
            <span style={{ color: "#1c2b23", fontWeight: 600 }}>{displayName}</span>
          </nav>

          {/* ── 3-column layout ── */}
          <div className="pd-layout">

            {/* ── Col 1: Image gallery ── */}
            <div className="pd-gallery">
              <ImageGallery
                images={images}
                productName={displayName}
                discountPct={discountPct}
                stockQty={product.stock_quantity}
              />
            </div>

            {/* ── Col 2: Product info ── */}
            <div className="pd-info">
              {/* Category label */}
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#8a9e92",
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                  margin: "0 0 8px",
                }}
              >
                {product.category}{product.subcategory ? ` › ${product.subcategory}` : ""}
              </p>

              {/* Title */}
              <h1
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#1c2b23",
                  letterSpacing: "-.5px",
                  lineHeight: 1.2,
                  margin: "0 0 10px",
                }}
              >
                {displayName}
              </h1>

              {/* Badges row */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                {product.is_organic && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#2d4a3e",
                      background: "#eef4f1",
                      border: "1px solid #c8ddd4",
                      padding: "3px 10px",
                      borderRadius: 999,
                    }}
                  >
                    Organic
                  </span>
                )}
                {product.is_featured && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#92610a",
                      background: "#fef9ec",
                      border: "1px solid #f0d48a",
                      padding: "3px 10px",
                      borderRadius: 999,
                    }}
                  >
                    Featured
                  </span>
                )}
                {discountPct > 0 && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#d4783c",
                      background: "#fdf0e8",
                      border: "1px solid #f0c4a0",
                      padding: "3px 10px",
                      borderRadius: 999,
                    }}
                  >
                    {discountPct}% Off
                  </span>
                )}
              </div>

              {/* Rating */}
              {typeof product.average_rating === "number" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 16,
                    paddingBottom: 16,
                    borderBottom: "1px solid #f0ece6",
                  }}
                >
                  <Stars rating={product.average_rating} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#2d4a3e" }}>
                    {product.average_rating.toFixed(1)}
                  </span>
                  <span style={{ fontSize: 13, color: "#8a9e92" }}>
                    ({product.review_count} {product.review_count === 1 ? "review" : "reviews"})
                  </span>
                </div>
              )}

              {/* Price */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: 32,
                      fontWeight: 800,
                      color: "#1c2b23",
                      letterSpacing: "-.5px",
                    }}
                  >
                    ${product.current_price.toFixed(2)}
                  </span>
                  <span style={{ fontSize: 15, color: "#8a9e92", fontWeight: 500 }}>
                    per {product.unit_of_measurement}
                  </span>
                </div>
                {product.sale_price && product.sale_price < product.base_price && (
                  <p style={{ fontSize: 13, color: "#8a9e92", margin: "4px 0 0" }}>
                    Was{" "}
                    <span style={{ textDecoration: "line-through" }}>
                      ${product.base_price.toFixed(2)}
                    </span>{" "}
                    <span style={{ color: "#d4783c", fontWeight: 700 }}>{discountPct}% off</span>
                  </p>
                )}
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "#f0ece6", marginBottom: 20 }} />

              {/* Key feature bullets */}
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {(bullets as { text: string }[]).map((b, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      fontSize: 14,
                      color: "#3a4f44",
                      lineHeight: 1.45,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#2d4a3e",
                        flexShrink: 0,
                        marginTop: 6,
                        display: "inline-block",
                      }}
                    />
                    <span>{b.text}</span>
                  </li>
                ))}
                {product.tags && product.tags.length > 0 && (
                  <li style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "#3a4f44" }}>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#2d4a3e",
                        flexShrink: 0,
                        marginTop: 6,
                        display: "inline-block",
                      }}
                    />
                    <span>{product.tags.slice(0, 5).join(" · ")}</span>
                  </li>
                )}
              </ul>

              {/* Divider */}
              <div style={{ height: 1, background: "#f0ece6", marginBottom: 24 }} />

              {/* About this product */}
              <div style={{ marginBottom: 28 }}>
                <h2
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#1c2b23",
                    margin: "0 0 10px",
                    letterSpacing: "-.2px",
                  }}
                >
                  About this product
                </h2>
                <p
                  style={{
                    fontSize: 14,
                    color: "#4a5f54",
                    lineHeight: 1.75,
                    margin: 0,
                  }}
                >
                  {product.description ||
                    product.short_description ||
                    `${displayName} is listed on Procur's marketplace by a verified supplier from ${product.seller.location || readableCountry}. Create a free buyer account to see full availability and place orders.`}
                </p>
              </div>

              {/* Product details table */}
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e8e4dc",
                  borderRadius: 14,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "14px 20px",
                    borderBottom: "1px solid #f0ece6",
                    background: "#fafaf8",
                  }}
                >
                  <h3
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#1c2b23",
                      margin: 0,
                      letterSpacing: ".02em",
                      textTransform: "uppercase",
                    }}
                  >
                    Product details
                  </h3>
                </div>
                <div className="pd-detail-grid">
                  {[
                    { label: "Category", value: product.category },
                    product.subcategory ? { label: "Type", value: product.subcategory } : null,
                    { label: "Unit", value: product.unit_of_measurement },
                    { label: "Condition", value: product.condition },
                    { label: "Origin", value: product.seller.location || readableCountry },
                    product.farm_origin?.parish
                      ? { label: "Parish", value: product.farm_origin.parish }
                      : null,
                    { label: "Organic", value: product.is_organic ? "Yes" : "No" },
                  ]
                    .filter(Boolean)
                    .map((item) => (
                      <div
                        key={item!.label}
                        style={{
                          padding: "12px 20px",
                          borderBottom: "1px solid #f5f1ea",
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#8a9e92",
                            textTransform: "uppercase",
                            letterSpacing: ".06em",
                          }}
                        >
                          {item!.label}
                        </span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "#1c2b23" }}>
                          {item!.value}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* ── Col 3: Buy box (sticky) ── */}
            <div className="pd-buybox">
              <div className="pd-sticky" style={{ position: "sticky", top: 78 }}>
                {/* Main buy card */}
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #e8e4dc",
                    borderRadius: 16,
                    padding: "22px 20px",
                    marginBottom: 12,
                  }}
                >
                  {/* Price */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                      <span
                        style={{
                          fontSize: 28,
                          fontWeight: 800,
                          color: "#1c2b23",
                          letterSpacing: "-.4px",
                        }}
                      >
                        ${product.current_price.toFixed(2)}
                      </span>
                      <span style={{ fontSize: 13, color: "#8a9e92" }}>
                        / {product.unit_of_measurement}
                      </span>
                    </div>
                    {product.sale_price && product.sale_price < product.base_price && (
                      <p style={{ fontSize: 12, color: "#d4783c", fontWeight: 700, margin: "3px 0 0" }}>
                        Save {discountPct}% — was ${product.base_price.toFixed(2)}
                      </p>
                    )}
                  </div>

                  {/* Sold by */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "12px 0",
                      borderTop: "1px solid #f5f1ea",
                      borderBottom: "1px solid #f5f1ea",
                      marginBottom: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        overflow: "hidden",
                        flexShrink: 0,
                        border: "1px solid #e8e4dc",
                        background: "linear-gradient(155deg, #1e3528 0%, #2d5a42 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {product.seller.logo_url ? (
                        <Image
                          src={product.seller.logo_url}
                          alt={product.seller.name}
                          width={36}
                          height={36}
                          style={{ objectFit: "cover", width: "100%", height: "100%" }}
                        />
                      ) : (
                        <span style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>
                          {product.seller.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p style={{ fontSize: 10, color: "#8a9e92", margin: "0 0 2px" }}>Sold by</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Link
                          href={`/sellers/${product.seller.id}`}
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#2d4a3e",
                            textDecoration: "none",
                          }}
                        >
                          {product.seller.name}
                        </Link>
                        {product.seller.is_verified && (
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 700,
                              color: "#2d4a3e",
                              background: "#eef4f1",
                              border: "1px solid #c8ddd4",
                              padding: "1px 6px",
                              borderRadius: 999,
                            }}
                          >
                            ✓ Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stock */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: product.stock_quantity > 0 ? "#2d7a3e" : "#c44",
                        flexShrink: 0,
                        display: "inline-block",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: product.stock_quantity > 0 ? "#2d7a3e" : "#c44",
                      }}
                    >
                      {product.stock_quantity > 0
                        ? `In stock · ${product.stock_quantity} ${product.unit_of_measurement} available`
                        : "Out of stock"}
                    </span>
                  </div>

                  {/* CTA buttons */}
                  <Link
                    href="/signup?accountType=buyer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      padding: "14px 20px",
                      background: "#d4783c",
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: 700,
                      borderRadius: 999,
                      textDecoration: "none",
                      textAlign: "center",
                      marginBottom: 8,
                      boxSizing: "border-box",
                    } as React.CSSProperties}
                  >
                    Create account to order
                  </Link>
                  <Link
                    href="/login"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      padding: "13px 20px",
                      background: "transparent",
                      color: "#1c2b23",
                      fontSize: 14,
                      fontWeight: 600,
                      borderRadius: 999,
                      textDecoration: "none",
                      textAlign: "center",
                      border: "1px solid #e8e4dc",
                      boxSizing: "border-box",
                    } as React.CSSProperties}
                  >
                    Sign in to order
                  </Link>
                </div>

                {/* Fulfillment info */}
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #e8e4dc",
                    borderRadius: 14,
                    padding: "16px 18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  {[
                    {
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="#2d4a3e" strokeWidth="2" strokeLinecap="round" width={14} height={14}>
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      ),
                      text: "Orders before 2pm ship same day",
                    },
                    {
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="#2d4a3e" strokeWidth="2" strokeLinecap="round" width={14} height={14}>
                          <rect x="1" y="3" width="15" height="13" />
                          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                          <circle cx="5.5" cy="18.5" r="2.5" />
                          <circle cx="18.5" cy="18.5" r="2.5" />
                        </svg>
                      ),
                      text: "Direct from farm to your door",
                    },
                    {
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="#2d4a3e" strokeWidth="2" strokeLinecap="round" width={14} height={14}>
                          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      ),
                      text: "Verified supplier · quality guaranteed",
                    },
                  ].map((row, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          background: "#eef4f1",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {row.icon}
                      </div>
                      <p style={{ fontSize: 12, color: "#6a7f73", margin: 0, lineHeight: 1.5, paddingTop: 4 }}>
                        {row.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── About the supplier ── */}
          <section style={{ marginTop: 56 }}>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#1c2b23",
                margin: "0 0 20px",
                letterSpacing: "-.3px",
              }}
            >
              About the supplier
            </h2>
            <div
              style={{
                background: "#fff",
                borderRadius: 20,
                border: "1px solid #e8e4dc",
                padding: "24px 28px",
                maxWidth: 680,
              }}
            >
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    overflow: "hidden",
                    flexShrink: 0,
                    border: "2px solid #e8e4dc",
                    background: "linear-gradient(155deg, #1e3528 0%, #2d5a42 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {product.seller.logo_url ? (
                    <Image
                      src={product.seller.logo_url}
                      alt={product.seller.name}
                      width={56}
                      height={56}
                      style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    />
                  ) : (
                    <span style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>
                      {product.seller.name.charAt(0)}
                    </span>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1c2b23", margin: 0 }}>
                      {product.seller.name}
                    </h3>
                    {product.seller.is_verified && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#2d4a3e",
                          background: "#eef4f1",
                          border: "1px solid #c8ddd4",
                          padding: "2px 8px",
                          borderRadius: 999,
                        }}
                      >
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                    {product.seller.location && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6a7f73" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={11} height={11}>
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {product.seller.location}
                      </span>
                    )}
                    {typeof product.seller.average_rating === "number" && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6a7f73" }}>
                        <svg viewBox="0 0 24 24" fill="#f59e0b" width={11} height={11}>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span style={{ fontWeight: 700, color: "#1c2b23" }}>
                          {product.seller.average_rating.toFixed(1)}
                        </span>
                        <span>({product.seller.review_count} reviews)</span>
                      </span>
                    )}
                    {product.seller.product_count > 0 && (
                      <span style={{ fontSize: 12, color: "#8a9e92" }}>
                        {product.seller.product_count} listed products
                      </span>
                    )}
                  </div>

                  {product.seller.description && (
                    <p style={{ fontSize: 13, color: "#6a7f73", lineHeight: 1.65, margin: "0 0 12px" }}>
                      {product.seller.description}
                    </p>
                  )}

                  {product.seller.specialties && product.seller.specialties.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                      {product.seller.specialties.slice(0, 5).map((s) => (
                        <span
                          key={s}
                          style={{
                            fontSize: 11,
                            color: "#2d4a3e",
                            background: "#eef4f1",
                            border: "1px solid #c8ddd4",
                            padding: "3px 10px",
                            borderRadius: 999,
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link
                    href={`/sellers/${product.seller.id}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "9px 18px",
                      background: "#2d4a3e",
                      color: "#f5f1ea",
                      fontSize: 12,
                      fontWeight: 700,
                      borderRadius: 999,
                      textDecoration: "none",
                    }}
                  >
                    View supplier profile →
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ── Join CTA ── */}
          <div
            style={{
              marginTop: 56,
              padding: "44px 40px",
              background: "#1c2b23",
              borderRadius: 24,
              display: "flex",
              flexWrap: "wrap",
              gap: 28,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#f5f1ea",
                  margin: "0 0 8px",
                  letterSpacing: "-.4px",
                }}
              >
                Ready to order {displayName}?
              </h3>
              <p style={{ fontSize: 14, color: "rgba(245,241,234,.6)", margin: 0, maxWidth: 400, lineHeight: 1.65 }}>
                Create a free buyer account to send messages, request quotes, and place orders directly with verified suppliers.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexShrink: 0, flexWrap: "wrap" }}>
              <Link
                href="/signup?accountType=buyer"
                style={{
                  padding: "12px 24px",
                  background: "#d4783c",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  borderRadius: 999,
                  textDecoration: "none",
                }}
              >
                Create account
              </Link>
              <Link
                href="/login"
                style={{
                  padding: "12px 24px",
                  background: "transparent",
                  color: "#f5f1ea",
                  fontSize: 13,
                  fontWeight: 600,
                  borderRadius: 999,
                  textDecoration: "none",
                  border: "1px solid rgba(245,241,234,.2)",
                }}
              >
                Sign in
              </Link>
            </div>
          </div>
        </main>
      )}

      {/* ── Footer ── */}
      <footer style={{ background: "#0a0a0a", color: "#f5f1ea" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ padding: "72px 0 56px" }}>
            <h2
              style={{
                fontSize: 36,
                fontWeight: 700,
                lineHeight: 1.15,
                maxWidth: 500,
                letterSpacing: "-.5px",
                color: "#f5f1ea",
                margin: "0 0 14px",
              }}
            >
              Building stronger food systems across the Caribbean.
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "rgba(245,241,234,.6)",
                maxWidth: 420,
                lineHeight: 1.65,
                margin: "0 0 26px",
              }}
            >
              Procur connects buyers directly with verified farmers: transparent pricing, reliable supply, and produce that&apos;s never more than a day from harvest.
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
          <div style={{ display: "flex", gap: 48, padding: "44px 0 36px", flexWrap: "wrap" }}>
            <div style={{ minWidth: 200 }}>
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
                  color: "rgba(245,241,234,.5)",
                  lineHeight: 1.65,
                  marginTop: 14,
                  marginBottom: 0,
                  maxWidth: 220,
                }}
              >
                Grenada&apos;s agricultural marketplace, purpose-built to shorten supply chains and strengthen local food economies.
              </p>
            </div>
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
              {[
                {
                  title: "Platform",
                  links: [
                    { label: "Browse Produce", href: "/browse" },
                    { label: "For Suppliers", href: "/signup?accountType=seller" },
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
                  ],
                },
                {
                  title: "Company",
                  links: [
                    { label: "About Procur", href: "/about" },
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
                  ],
                },
              ].map((col) => (
                <div key={col.title}>
                  <h5
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "rgba(245,241,234,.45)",
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
                            color: "rgba(245,241,234,.5)",
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
              paddingTop: 16,
              paddingBottom: 26,
              borderTop: "1px solid rgba(245,241,234,.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <p style={{ fontSize: 11, color: "rgba(245,241,234,.3)", margin: 0 }}>
              &copy; 2025 Procur Grenada Ltd. All rights reserved.
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              {[
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
                { label: "Cookies", href: "/cookies" },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  style={{ fontSize: 11, color: "rgba(245,241,234,.3)", textDecoration: "none" }}
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
