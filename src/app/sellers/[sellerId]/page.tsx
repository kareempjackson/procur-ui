import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

interface SellerPageProps {
  params: Promise<{ sellerId: string }>;
}

type PublicSeller = {
  id: string;
  name: string;
  description?: string;
  business_type?: string;
  header_image_url?: string;
  logo_url?: string;
  location?: string;
  average_rating?: number;
  review_count: number;
  product_count: number;
  years_in_business?: number;
  is_verified: boolean;
  specialties?: string[];
};

type PublicProduct = {
  id: string;
  name: string;
  category: string;
  current_price: number;
  unit_of_measurement: string;
  image_url?: string;
  tags?: string[];
  average_rating?: number;
  stock_quantity: number;
  seller: { id: string; name: string; location?: string };
};

function toTitle(str: string): string {
  return str
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function createCountrySlug(location?: string): string {
  if (!location) return "caribbean";
  return location.toLowerCase().replace(/\s+/g, "-");
}

function createProductSlug(name: string, id: string): string {
  return `${name.toLowerCase().replace(/\s+/g, "-")}-${id}`;
}

export const metadata: Metadata = {
  title: "Supplier Profile · Procur Marketplace",
  description:
    "View a verified supplier's profile and available products on Procur.",
};

async function fetchPublicSeller(sellerId: string): Promise<PublicSeller | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";
  try {
    const res = await fetch(`${baseUrl}/marketplace/sellers/${sellerId}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as PublicSeller;
  } catch {
    return null;
  }
}

async function fetchSellerProducts(sellerId: string): Promise<PublicProduct[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";
  try {
    const res = await fetch(
      `${baseUrl}/marketplace/products?seller_id=${encodeURIComponent(sellerId)}&in_stock=true&limit=24&sort_by=created_at&sort_order=desc`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.products as PublicProduct[]) || [];
  } catch {
    return [];
  }
}

export default async function PublicSellerProfile({ params }: SellerPageProps) {
  const { sellerId } = await params;
  const seller = await fetchPublicSeller(sellerId);
  const products = seller ? await fetchSellerProducts(seller.id) : [];

  const displayName = seller?.name || "Marketplace Seller";
  const readableLocation = toTitle(seller?.location || "Caribbean Region");

  const demoReviews =
    seller && seller.review_count > 0
      ? [
          { id: "1", initials: "SM", name: "Verified buyer", rating: seller.average_rating ?? 4.8, date: "Recently", comment: "Consistently reliable quality and very responsive on delivery timelines." },
          { id: "2", initials: "JR", name: "Program partner", rating: (seller.average_rating ?? 4.8) - 0.2, date: "This season", comment: "Great communication and clear grading on produce. Easy to work with for repeat orders." },
          { id: "3", initials: "AL", name: "Hospitality buyer", rating: (seller.average_rating ?? 4.8) - 0.3, date: "Earlier this year", comment: "Fresh product and thoughtful packing. Would recommend to other buyers on Procur." },
        ]
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
      {/* ── Header ── */}
      <header
        style={{ position: "sticky", top: 0, zIndex: 100, background: "#2d4a3e" }}
      >
        <div
          style={{ height: 58, display: "flex", alignItems: "center", padding: "0 20px", maxWidth: 1300, margin: "0 auto" }}
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
              style={{ padding: "6px 14px", fontSize: 13, fontWeight: 600, color: "rgba(245,241,234,.7)", textDecoration: "none" }}
            >
              Browse
            </Link>
            <Link
              href="/sellers"
              style={{ padding: "6px 14px", fontSize: 13, fontWeight: 600, color: "rgba(245,241,234,.7)", textDecoration: "none" }}
            >
              Farms
            </Link>
          </nav>
          <div
            style={{ width: 1, height: 18, background: "rgba(245,241,234,.15)", margin: "0 10px" }}
          />
          <Link
            href="/login"
            style={{ padding: "6px 12px", fontSize: 12, fontWeight: 600, color: "rgba(245,241,234,.7)", textDecoration: "none" }}
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            style={{ marginLeft: 6, padding: "7px 16px", background: "#d4783c", color: "#fff", fontSize: 12, fontWeight: 700, borderRadius: 999, textDecoration: "none" }}
          >
            Get started
          </Link>
        </div>
      </header>

      {/* ── Not found ── */}
      {!seller && (
        <main
          style={{ maxWidth: 1300, margin: "0 auto", padding: "60px 20px" }}
        >
          <p
            style={{ fontSize: 12, color: "#8a9e92", marginBottom: 20 }}
          >
            <Link
              href="/sellers"
              style={{ color: "#2d4a3e", fontWeight: 700, textDecoration: "none" }}
            >
              ← All suppliers
            </Link>
          </p>
          <h1
            style={{ fontSize: 28, fontWeight: 700, color: "#1c2b23", marginBottom: 12, letterSpacing: "-.4px" }}
          >
            Supplier not found
          </h1>
          <p style={{ fontSize: 15, color: "#6a7f73", marginBottom: 28, lineHeight: 1.6, maxWidth: 480 }}>
            We couldn&apos;t load this supplier&apos;s profile. They may no
            longer be active on the marketplace.
          </p>
          <Link
            href="/sellers"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "12px 24px", background: "#2d4a3e", color: "#f5f1ea", fontSize: 13, fontWeight: 700, borderRadius: 999, textDecoration: "none" }}
          >
            Browse all suppliers
          </Link>
        </main>
      )}

      {seller && (
        <>
          {/* ── Seller hero ── */}
          <section style={{ position: "relative" }}>
            {/* Cover */}
            <div style={{ height: 240, position: "relative", overflow: "hidden" }}>
              {seller.header_image_url ? (
                <>
                  <Image
                    src={seller.header_image_url}
                    alt={`${displayName} cover`}
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                  />
                  <div
                    style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,16,12,.2) 0%, rgba(10,16,12,.55) 100%)" }}
                  />
                </>
              ) : (
                <div
                  style={{ position: "absolute", inset: 0, background: "linear-gradient(140deg, #2d4a3e 0%, #3e6b58 60%, #c26838 100%)" }}
                >
                  <div
                    style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 75% 50%, rgba(255,255,255,.06) 0%, transparent 65%)" }}
                  />
                </div>
              )}
            </div>

            {/* Seller identity card */}
            <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 20px" }}>
              <div
                style={{ background: "#fff", borderRadius: 20, border: "1px solid #e8e4dc", padding: "24px 28px", marginTop: -48, position: "relative", zIndex: 1 }}
              >
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }}
                >
                  {/* Avatar */}
                  <div style={{ marginTop: -56, flexShrink: 0, position: "relative", zIndex: 2 }}>
                    <div
                      style={{ width: 80, height: 80, borderRadius: 16, border: "3px solid #fff", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,0,0,.14)" }}
                    >
                      {seller.logo_url ? (
                        <Image
                          src={seller.logo_url}
                          alt={displayName}
                          width={80}
                          height={80}
                          style={{ objectFit: "cover", width: "100%", height: "100%" }}
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: "linear-gradient(155deg, #1e3528 0%, #2d5a42 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: "-.5px" }}>
                            {displayName.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}
                    >
                      <h1
                        style={{ fontSize: 26, fontWeight: 800, color: "#1c2b23", letterSpacing: "-.5px", margin: 0 }}
                      >
                        {displayName}
                      </h1>
                      {seller.is_verified && (
                        <span
                          style={{ fontSize: 11, fontWeight: 700, color: "#2d4a3e", background: "#eef4f1", border: "1px solid #c8ddd4", padding: "3px 10px", borderRadius: 999, letterSpacing: ".04em", flexShrink: 0 }}
                        >
                          ✓ Verified
                        </span>
                      )}
                    </div>

                    {seller.business_type && (
                      <p
                        style={{ fontSize: 11, fontWeight: 700, color: "#8a9e92", textTransform: "uppercase", letterSpacing: ".08em", margin: "0 0 10px" }}
                      >
                        {seller.business_type}
                      </p>
                    )}

                    {/* Pill stats */}
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}
                    >
                      <span
                        style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6a7f73", background: "#f5f1ea", padding: "5px 12px", borderRadius: 999 }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={11} height={11}>
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {readableLocation}
                      </span>
                      {products.length > 0 && (
                        <span
                          style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6a7f73", background: "#f5f1ea", padding: "5px 12px", borderRadius: 999 }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={11} height={11}>
                            <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                          </svg>
                          {products.length} products
                        </span>
                      )}
                      {typeof seller.average_rating === "number" && (
                        <span
                          style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6a7f73", background: "#f5f1ea", padding: "5px 12px", borderRadius: 999 }}
                        >
                          <svg viewBox="0 0 24 24" fill="#f59e0b" width={11} height={11}>
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span style={{ fontWeight: 700, color: "#1c2b23" }}>
                            {seller.average_rating.toFixed(1)}
                          </span>
                          <span>({seller.review_count} reviews)</span>
                        </span>
                      )}
                      {typeof seller.years_in_business === "number" &&
                        seller.years_in_business > 0 && (
                          <span
                            style={{ fontSize: 12, color: "#6a7f73", background: "#f5f1ea", padding: "5px 12px", borderRadius: 999 }}
                          >
                            {seller.years_in_business}+ yrs on market
                          </span>
                        )}
                    </div>

                    {/* Specialties */}
                    {seller.specialties && seller.specialties.length > 0 && (
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}
                      >
                        {seller.specialties.slice(0, 5).map((s) => (
                          <span
                            key={s}
                            style={{ fontSize: 11, color: "#2d4a3e", background: "#eef4f1", border: "1px solid #c8ddd4", padding: "3px 10px", borderRadius: 999 }}
                          >
                            {s}
                          </span>
                        ))}
                        {seller.specialties.length > 5 && (
                          <span
                            style={{ fontSize: 11, color: "#8a9e92", padding: "3px 0" }}
                          >
                            +{seller.specialties.length - 5} more
                          </span>
                        )}
                      </div>
                    )}

                    {seller.description && (
                      <p
                        style={{ fontSize: 14, color: "#6a7f73", lineHeight: 1.65, margin: 0, maxWidth: 600 }}
                      >
                        {seller.description}
                      </p>
                    )}
                  </div>

                  {/* CTAs */}
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}
                  >
                    <Link
                      href="/signup?accountType=buyer"
                      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "10px 20px", background: "#2d4a3e", color: "#f5f1ea", fontSize: 13, fontWeight: 700, borderRadius: 999, textDecoration: "none", whiteSpace: "nowrap" }}
                    >
                      Create buyer account
                    </Link>
                    <Link
                      href="/login"
                      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "10px 20px", background: "#fff", color: "#1c2b23", fontSize: 13, fontWeight: 600, borderRadius: 999, textDecoration: "none", border: "1px solid #e8e4dc", whiteSpace: "nowrap" }}
                    >
                      Login to message
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Products ── */}
          <main
            style={{ maxWidth: 1300, margin: "0 auto", padding: "40px 20px 80px" }}
          >
            {/* Breadcrumb */}
            <p style={{ fontSize: 12, color: "#8a9e92", marginBottom: 32 }}>
              <Link
                href="/sellers"
                style={{ color: "#2d4a3e", fontWeight: 700, textDecoration: "none" }}
              >
                ← All suppliers
              </Link>
            </p>

            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}
            >
              <div>
                <h2
                  style={{ fontSize: 20, fontWeight: 700, color: "#1c2b23", margin: "0 0 4px", letterSpacing: "-.3px" }}
                >
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

            {products.length === 0 && (
              <div
                style={{ padding: "40px 28px", borderRadius: 16, border: "1px dashed #d8d2c8", textAlign: "center" }}
              >
                <p style={{ fontSize: 14, color: "#8a9e92", margin: "0 0 14px" }}>
                  This supplier doesn&apos;t have any public listings yet.
                </p>
                <Link
                  href="/browse"
                  style={{ fontSize: 13, fontWeight: 700, color: "#2d4a3e", textDecoration: "none" }}
                >
                  Browse all produce →
                </Link>
              </div>
            )}

            {products.length > 0 && (
              <div
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}
              >
                {products.map((p) => {
                  const countrySlug = createCountrySlug(p.seller.location);
                  const productSlug = createProductSlug(p.name, p.id);
                  const href = `/products/${countrySlug}/${productSlug}`;
                  const image =
                    p.image_url ||
                    "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg";

                  return (
                    <Link
                      key={p.id}
                      href={href}
                      style={{ textDecoration: "none", display: "flex", flexDirection: "column", borderRadius: 18, border: "1px solid #e8e4dc", background: "#fff", overflow: "hidden" }}
                    >
                      <div
                        style={{ height: 180, position: "relative", overflow: "hidden", flexShrink: 0 }}
                      >
                        <Image
                          src={image}
                          alt={p.name}
                          fill
                          className="object-cover"
                          sizes="300px"
                        />
                        {p.stock_quantity === 0 && (
                          <div
                            style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,.7)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}
                          >
                            Out of stock
                          </div>
                        )}
                      </div>
                      <div style={{ padding: "14px 16px 16px" }}>
                        <h3
                          style={{ fontSize: 14, fontWeight: 700, color: "#1c2b23", margin: "0 0 6px", letterSpacing: "-.1px", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}
                        >
                          {p.name}
                        </h3>
                        <div
                          style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}
                        >
                          <span style={{ fontSize: 16, fontWeight: 800, color: "#1c2b23" }}>
                            ${p.current_price.toFixed(2)}
                            <span
                              style={{ fontSize: 11, fontWeight: 400, color: "#8a9e92" }}
                            >
                              {" "}
                              /{p.unit_of_measurement}
                            </span>
                          </span>
                          <span
                            style={{ fontSize: 11, color: "#8a9e92", background: "#f5f1ea", padding: "2px 8px", borderRadius: 999 }}
                          >
                            {p.category}
                          </span>
                        </div>
                        {p.tags && p.tags.length > 0 && (
                          <div
                            style={{ display: "flex", flexWrap: "wrap", gap: 5 }}
                          >
                            {p.tags.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                style={{ fontSize: 10, color: "#6a7f73", background: "#f5f1ea", padding: "2px 8px", borderRadius: 999 }}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* ── Reviews ── */}
            {(demoReviews.length > 0 || seller.review_count === 0) && (
              <section style={{ marginTop: 56 }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}
                >
                  <div>
                    <h2
                      style={{ fontSize: 20, fontWeight: 700, color: "#1c2b23", margin: "0 0 4px", letterSpacing: "-.3px" }}
                    >
                      Reviews
                    </h2>
                    <p style={{ fontSize: 13, color: "#8a9e92", margin: 0 }}>
                      {typeof seller.average_rating === "number"
                        ? `${seller.average_rating.toFixed(1)} avg · ${seller.review_count || 0} reviews`
                        : `${seller.review_count || 0} reviews from Procur buyers`}
                    </p>
                  </div>
                </div>

                {demoReviews.length === 0 && (
                  <div
                    style={{ padding: "32px 28px", borderRadius: 16, border: "1px dashed #d8d2c8", textAlign: "center" }}
                  >
                    <p style={{ fontSize: 14, color: "#8a9e92", margin: 0 }}>
                      Verified buyers will be able to leave reviews here once
                      orders are fulfilled.
                    </p>
                  </div>
                )}

                {demoReviews.length > 0 && (
                  <div
                    style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}
                  >
                    {demoReviews.map((review) => (
                      <div
                        key={review.id}
                        style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e4dc", padding: "18px 20px" }}
                      >
                        <div
                          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center", gap: 10 }}
                          >
                            <div
                              style={{ width: 36, height: 36, borderRadius: "50%", background: "#f5f1ea", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#2d4a3e", flexShrink: 0 }}
                            >
                              {review.initials}
                            </div>
                            <div>
                              <p
                                style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23", margin: "0 0 1px" }}
                              >
                                {review.name}
                              </p>
                              <p
                                style={{ fontSize: 11, color: "#8a9e92", margin: 0 }}
                              >
                                {review.date}
                              </p>
                            </div>
                          </div>
                          <span
                            style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 700, color: "#1c2b23", background: "#f5f1ea", padding: "4px 10px", borderRadius: 999 }}
                          >
                            <svg viewBox="0 0 24 24" fill="#f59e0b" width={11} height={11}>
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            {review.rating.toFixed(1)}
                          </span>
                        </div>
                        <p
                          style={{ fontSize: 13, color: "#6a7f73", lineHeight: 1.6, margin: 0 }}
                        >
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* ── Join CTA ── */}
            <div
              style={{ marginTop: 56, padding: "40px 36px", background: "#2d4a3e", borderRadius: 24, display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "space-between" }}
            >
              <div>
                <h3
                  style={{ fontSize: 22, fontWeight: 700, color: "#f5f1ea", margin: "0 0 6px", letterSpacing: "-.3px" }}
                >
                  Interested in ordering from {displayName}?
                </h3>
                <p
                  style={{ fontSize: 14, color: "rgba(245,241,234,.65)", margin: 0, maxWidth: 400, lineHeight: 1.6 }}
                >
                  Create a free buyer account to send messages, request quotes,
                  and place orders directly.
                </p>
              </div>
              <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                <Link
                  href="/signup?accountType=buyer"
                  style={{ padding: "11px 22px", background: "#f5f1ea", color: "#1c2b23", fontSize: 13, fontWeight: 700, borderRadius: 999, textDecoration: "none" }}
                >
                  Create account
                </Link>
                <Link
                  href="/login"
                  style={{ padding: "11px 22px", background: "transparent", color: "#f5f1ea", fontSize: 13, fontWeight: 600, borderRadius: 999, textDecoration: "none", border: "1px solid rgba(245,241,234,.2)" }}
                >
                  Sign in
                </Link>
              </div>
            </div>
          </main>
        </>
      )}

      {/* ── Footer ── */}
      <footer style={{ background: "#0a0a0a", color: "#f5f1ea" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ padding: "72px 0 56px" }}>
            <h2
              style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.15, maxWidth: 500, letterSpacing: "-.5px", color: "#f5f1ea", margin: "0 0 14px" }}
            >
              Building stronger food systems across the Caribbean.
            </h2>
            <p
              style={{ fontSize: 14, color: "rgba(245,241,234,.6)", maxWidth: 420, lineHeight: 1.65, margin: "0 0 26px" }}
            >
              Procur connects buyers directly with verified farmers: transparent
              pricing, reliable supply, and produce that&apos;s never more than
              a day from harvest.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link
                href="/signup?accountType=buyer"
                style={{ padding: "12px 28px", background: "#f5f1ea", color: "#1c2b23", fontSize: 13, fontWeight: 700, borderRadius: 999, textDecoration: "none" }}
              >
                Start buying
              </Link>
              <Link
                href="/signup?accountType=seller"
                style={{ padding: "12px 28px", background: "transparent", color: "#f5f1ea", fontSize: 13, fontWeight: 600, borderRadius: 999, border: "1px solid rgba(245,241,234,.2)", textDecoration: "none" }}
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
                style={{ fontSize: 12, color: "rgba(245,241,234,.5)", lineHeight: 1.65, marginTop: 14, marginBottom: 0, maxWidth: 220 }}
              >
                Grenada&apos;s agricultural marketplace, purpose-built to
                shorten supply chains and strengthen local food economies.
              </p>
            </div>
            <div
              style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}
            >
              {[
                { title: "Platform", links: [{ label: "Browse Produce", href: "/browse" }, { label: "For Suppliers", href: "/signup?accountType=seller" }, { label: "For Buyers", href: "/signup?accountType=buyer" }, { label: "Log in", href: "/login" }] },
                { title: "Solutions", links: [{ label: "Restaurants", href: "/solutions/restaurants" }, { label: "Hotels", href: "/solutions/hotels" }, { label: "Grocery", href: "/solutions/grocery" }, { label: "Government", href: "/solutions/government" }] },
                { title: "Company", links: [{ label: "About Procur", href: "/about" }, { label: "Contact", href: "/contact" }, { label: "Careers", href: "/careers" }] },
                { title: "Resources", links: [{ label: "Help Center", href: "/help" }, { label: "FAQ", href: "/faq" }, { label: "Blog", href: "/blog" }] },
              ].map(col => (
                <div key={col.title}>
                  <h5
                    style={{ fontSize: 10, fontWeight: 700, color: "rgba(245,241,234,.45)", marginBottom: 14, letterSpacing: ".08em", textTransform: "uppercase" }}
                  >
                    {col.title}
                  </h5>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {col.links.map(link => (
                      <li key={link.label} style={{ marginBottom: 8 }}>
                        <Link
                          href={link.href}
                          style={{ fontSize: 12.5, color: "rgba(245,241,234,.5)", textDecoration: "none" }}
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
            style={{ paddingTop: 16, paddingBottom: 26, borderTop: "1px solid rgba(245,241,234,.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}
          >
            <p style={{ fontSize: 11, color: "rgba(245,241,234,.3)", margin: 0 }}>
              &copy; 2025 Procur Grenada Ltd. All rights reserved.
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              {[{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }, { label: "Cookies", href: "/cookies" }].map(l => (
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
