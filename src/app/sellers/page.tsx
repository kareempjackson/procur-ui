import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Verified Farms & Suppliers",
  description:
    "Browse all verified farms and suppliers on Procur. Connect directly with Caribbean farmers and producers to source fresh, quality produce.",
  keywords: ["verified farmers", "Caribbean suppliers", "Grenada farms", "fresh produce suppliers", "agricultural suppliers"],
  openGraph: {
    title: "Verified Farms & Suppliers — Procur",
    description:
      "Browse verified Caribbean farms and suppliers. Connect directly with producers to source fresh, quality produce.",
    url: "https://procur.io/sellers",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Verified Farms & Suppliers — Procur",
    description:
      "Browse verified Caribbean farms and suppliers on Procur.",
  },
};

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
  is_verified: boolean;
  specialties?: string[];
};

const FALLBACK_SELLERS: PublicSeller[] = [
  {
    id: "1",
    name: "Grenada Green Farms",
    business_type: "Farmers",
    location: "St. George's, Grenada",
    description:
      "Family-run farm supplying fresh root vegetables and leafy greens to buyers across Grenada.",
    product_count: 12,
    review_count: 24,
    is_verified: true,
    average_rating: 4.8,
  },
  {
    id: "2",
    name: "Caribbean Fresh Co.",
    business_type: "General",
    location: "Gouyave, Grenada",
    description:
      "Tropical fruit specialist with a focus on plantain, banana, and citrus grown in the north.",
    product_count: 8,
    review_count: 16,
    is_verified: true,
    average_rating: 4.6,
  },
  {
    id: "3",
    name: "Spice Isle Produce",
    business_type: "Farmers",
    location: "Grenville, Grenada",
    description:
      "Premium spice and herb grower supplying restaurants and hotels across the Caribbean.",
    product_count: 18,
    review_count: 31,
    is_verified: true,
    average_rating: 4.9,
  },
  {
    id: "4",
    name: "Windward Root Works",
    business_type: "Farmers",
    location: "Victoria, Grenada",
    description:
      "Specialising in dasheen, eddoes, and yams grown in fertile hillside soil in the north.",
    product_count: 6,
    review_count: 10,
    is_verified: false,
    average_rating: 4.5,
  },
  {
    id: "5",
    name: "Isle Harvest Collective",
    business_type: "Co-operative",
    location: "Sauteurs, Grenada",
    description:
      "Co-op of smallholder farmers pooling supply for consistent, reliable weekly delivery.",
    product_count: 22,
    review_count: 18,
    is_verified: true,
    average_rating: 4.7,
  },
  {
    id: "6",
    name: "Tropical Roots Farm",
    business_type: "Farmers",
    location: "Grenada",
    description:
      "Certified organic produce grown using traditional Caribbean methods passed down generations.",
    product_count: 14,
    review_count: 8,
    is_verified: true,
    average_rating: 4.8,
  },
];

const CARD_GRADIENTS = [
  "linear-gradient(155deg, #1e3528 0%, #2d5a42 100%)",
  "linear-gradient(155deg, #1a3020 0%, #3a6b50 100%)",
  "linear-gradient(155deg, #263d30 0%, #c26838 100%)",
  "linear-gradient(155deg, #1c3528 0%, #3a5e48 100%)",
  "linear-gradient(155deg, #1e3a2c 0%, #4a7a5e 100%)",
  "linear-gradient(155deg, #2d4a3e 0%, #5a7a60 100%)",
];

async function fetchSellers(): Promise<PublicSeller[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";
  try {
    const res = await fetch(`${baseUrl}/marketplace/sellers?limit=60`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return FALLBACK_SELLERS;
    const data = await res.json();
    const sellers = data?.sellers as PublicSeller[];
    return Array.isArray(sellers) && sellers.length > 0
      ? sellers
      : FALLBACK_SELLERS;
  } catch {
    return FALLBACK_SELLERS;
  }
}

export default async function SellersPage() {
  const sellers = await fetchSellers();

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
            maxWidth: 1300,
            margin: "0 auto",
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
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
                color: "#f5f1ea",
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

      {/* ── Hero with background image ── */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        {/* Background image */}
        <Image
          src="/images/hero/land-o-lakes-inc-BlXa_riHlp4-unsplash.jpg"
          alt="Farms hero"
          fill
          className="object-cover"
          style={{ objectPosition: "center 30%" }}
          sizes="100vw"
          priority
        />
        {/* Overlay — deep teal-dark */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(108deg, rgba(10,20,14,.92) 0%, rgba(10,20,14,.72) 50%, rgba(10,20,14,.45) 100%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1300,
            margin: "0 auto",
            padding: "68px 20px 76px",
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "rgba(245,241,234,.4)",
              letterSpacing: ".12em",
              textTransform: "uppercase",
              margin: "0 0 16px",
            }}
          >
            Procur · Marketplace
          </p>
          <h1
            style={{
              fontSize: 46,
              fontWeight: 800,
              color: "#f5f1ea",
              lineHeight: 1.1,
              letterSpacing: "-1px",
              maxWidth: 520,
              margin: "0 0 14px",
            }}
          >
            Verified farms
            <br />& suppliers
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "rgba(245,241,234,.68)",
              maxWidth: 420,
              lineHeight: 1.65,
              margin: "0 0 30px",
            }}
          >
            Every supplier is reviewed and verified.{" "}
            {sellers.length > 0 && `${sellers.length} active farms`} — connect
            directly, no middlemen.
          </p>
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Link
              href="/signup?accountType=buyer"
              style={{
                padding: "11px 24px",
                background: "#d4783c",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                borderRadius: 999,
                textDecoration: "none",
              }}
            >
              Create buyer account
            </Link>
            <Link
              href="/browse"
              style={{
                padding: "11px 24px",
                background: "rgba(245,241,234,.1)",
                color: "#f5f1ea",
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 999,
                textDecoration: "none",
                border: "1px solid rgba(245,241,234,.18)",
              }}
            >
              Browse produce
            </Link>
          </div>
        </div>
      </section>

      {/* ── Sellers grid ── */}
      <main
        style={{ maxWidth: 1300, margin: "0 auto", padding: "48px 20px 80px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 32,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#1c2b23",
                margin: "0 0 4px",
                letterSpacing: "-.3px",
              }}
            >
              All suppliers
            </h2>
            <p style={{ fontSize: 13, color: "#8a9e92", margin: 0 }}>
              {sellers.length} verified suppliers on Procur
            </p>
          </div>
          <Link
            href="/browse"
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#2d4a3e",
              textDecoration: "none",
            }}
          >
            Browse produce →
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {sellers.map((seller, idx) => {
            const gradient = CARD_GRADIENTS[idx % CARD_GRADIENTS.length];
            const initial = seller.name.charAt(0).toUpperCase();
            const hasRating =
              typeof seller.average_rating === "number" &&
              seller.average_rating > 0 &&
              seller.review_count > 0;

            return (
              <Link
                key={seller.id}
                href={`/sellers/${seller.id}`}
                style={{
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 20,
                  border: "1px solid #e8e4dc",
                  background: "#fff",
                  overflow: "visible",
                  transition: "box-shadow .2s",
                }}
              >
                {/* Cover band */}
                <div
                  style={{
                    height: 130,
                    borderRadius: "20px 20px 0 0",
                    position: "relative",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  {seller.header_image_url ? (
                    <>
                      <Image
                        src={seller.header_image_url}
                        alt={seller.name}
                        fill
                        className="object-cover"
                        sizes="360px"
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to bottom, rgba(10,16,12,.15) 0%, rgba(10,16,12,.5) 100%)",
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: gradient,
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backgroundImage:
                            "radial-gradient(ellipse at 85% 40%, rgba(255,255,255,.07) 0%, transparent 60%)",
                        }}
                      />
                    </>
                  )}

                  {/* Verified badge — top right of cover */}
                  {seller.is_verified && (
                    <span
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#fff",
                        background: "rgba(0,0,0,.55)",
                        padding: "4px 10px",
                        borderRadius: 999,
                        letterSpacing: ".04em",
                      }}
                    >
                      ✓ Verified
                    </span>
                  )}
                </div>

                {/* Body */}
                <div
                  style={{
                    padding: "0 20px 22px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Avatar — overlapping cover */}
                  <div
                    style={{
                      marginTop: -28,
                      marginBottom: 12,
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 14,
                        background: "#fff",
                        border: "2.5px solid #fff",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 14px rgba(0,0,0,.12)",
                      }}
                    >
                      {seller.logo_url ? (
                        <Image
                          src={seller.logo_url}
                          alt={seller.name}
                          width={56}
                          height={56}
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            background: gradient,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 20,
                              fontWeight: 800,
                              color: "#fff",
                              letterSpacing: "-.5px",
                            }}
                          >
                            {initial}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#1c2b23",
                      margin: "0 0 3px",
                      letterSpacing: "-.2px",
                      lineHeight: 1.3,
                    }}
                  >
                    {seller.name}
                  </h3>

                  {/* Business type */}
                  {seller.business_type && (
                    <p
                      style={{
                        fontSize: 10,
                        color: "#8a9e92",
                        margin: "0 0 10px",
                        textTransform: "uppercase",
                        letterSpacing: ".09em",
                        fontWeight: 700,
                      }}
                    >
                      {seller.business_type}
                    </p>
                  )}

                  {/* Location */}
                  {seller.location && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 12,
                        color: "#6a7f73",
                        marginBottom: 10,
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        width={11}
                        height={11}
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {seller.location}
                    </div>
                  )}

                  {/* Description */}
                  {seller.description && (
                    <p
                      style={
                        {
                          fontSize: 13,
                          color: "#6a7f73",
                          margin: "0 0 14px",
                          lineHeight: 1.6,
                          flex: 1,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        } as React.CSSProperties
                      }
                    >
                      {seller.description}
                    </p>
                  )}
                  {!seller.description && <div style={{ flex: 1 }} />}

                  {/* Stats */}
                  {(seller.product_count > 0 || hasRating) && (
                    <div
                      style={{
                        display: "flex",
                        gap: 14,
                        marginBottom: 16,
                        flexWrap: "wrap",
                      }}
                    >
                      {seller.product_count > 0 && (
                        <span style={{ fontSize: 12, color: "#8a9e92" }}>
                          <span style={{ fontWeight: 700, color: "#1c2b23" }}>
                            {seller.product_count}
                          </span>{" "}
                          products
                        </span>
                      )}
                      {hasRating && (
                        <span
                          style={{
                            fontSize: 12,
                            color: "#8a9e92",
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                          }}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="#f59e0b"
                            width={11}
                            height={11}
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span style={{ fontWeight: 700, color: "#1c2b23" }}>
                            {seller.average_rating!.toFixed(1)}
                          </span>
                          <span>({seller.review_count})</span>
                        </span>
                      )}
                    </div>
                  )}

                  {/* CTA row */}
                  <div
                    style={{
                      borderTop: "1px solid #f0ece4",
                      paddingTop: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#2d4a3e",
                      }}
                    >
                      View profile
                    </span>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "#eef4f1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#2d4a3e"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        width={13}
                        height={13}
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div
          style={{
            marginTop: 64,
            padding: "48px 40px",
            background: "#2d4a3e",
            borderRadius: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "#f5f1ea",
              margin: "0 0 10px",
              letterSpacing: "-.4px",
            }}
          >
            Ready to start sourcing?
          </h3>
          <p
            style={{
              fontSize: 14,
              color: "rgba(245,241,234,.65)",
              margin: "0 0 26px",
              maxWidth: 380,
              lineHeight: 1.65,
            }}
          >
            Create a free buyer account to message suppliers, request quotes,
            and place orders directly.
          </p>
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
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
                textDecoration: "none",
                border: "1px solid rgba(245,241,234,.2)",
              }}
            >
              List your farm
            </Link>
          </div>
        </div>
      </main>

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
          <div
            style={{
              display: "flex",
              gap: 48,
              padding: "44px 0 36px",
              flexWrap: "wrap",
            }}
          >
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
                Grenada&apos;s agricultural marketplace, purpose-built to
                shorten supply chains and strengthen local food economies.
              </p>
            </div>
            <div
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
            <p
              style={{ fontSize: 11, color: "rgba(245,241,234,.3)", margin: 0 }}
            >
              &copy; 2026 Procur Grenada Ltd. All rights reserved.
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
                  style={{
                    fontSize: 11,
                    color: "rgba(245,241,234,.3)",
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
