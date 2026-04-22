"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buildSellerUrl } from "@/lib/sellerUrl";

type PublicSeller = {
  id: string;
  slug?: string;
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

const CARD_GRADIENTS = [
  "linear-gradient(155deg, #1e3528 0%, #2d5a42 100%)",
  "linear-gradient(155deg, #1a3020 0%, #3a6b50 100%)",
  "linear-gradient(155deg, #263d30 0%, #c26838 100%)",
  "linear-gradient(155deg, #1c3528 0%, #3a5e48 100%)",
  "linear-gradient(155deg, #1e3a2c 0%, #4a7a5e 100%)",
  "linear-gradient(155deg, #2d4a3e 0%, #5a7a60 100%)",
];

const PAGE_LIMIT = 40;

export default function SellersGridClient({
  initialSellers,
  initialTotal,
  countryCode,
}: {
  initialSellers: PublicSeller[];
  initialTotal: number;
  countryCode: string | null;
}) {
  const [sellers, setSellers] = useState<PublicSeller[]>(initialSellers);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(initialTotal);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Fetch additional pages when page > 1
  useEffect(() => {
    if (page === 1) return;
    let cancelled = false;
    setLoadingMore(true);
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";
    const params = new URLSearchParams({
      limit: String(PAGE_LIMIT),
      page: String(page),
    });
    if (countryCode) params.set("country_id", countryCode);
    const headers: Record<string, string> = {};
    if (countryCode) headers["X-Country-Code"] = countryCode;

    fetch(`${baseUrl}/marketplace/sellers?${params}`, { headers })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        if (cancelled) return;
        const batch = Array.isArray(data?.sellers)
          ? (data.sellers as PublicSeller[])
          : [];
        if (typeof data?.total === "number") setTotal(data.total);
        if (batch.length > 0) setSellers((prev) => [...prev, ...batch]);
      })
      .catch(() => {
        /* network error — leave the list as-is */
      })
      .finally(() => {
        if (!cancelled) setLoadingMore(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, countryCode]);

  // Request the next page once the sentinel enters view
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    if (sellers.length >= total) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0]?.isIntersecting &&
          !loadingMore &&
          sellers.length < total
        ) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadingMore, sellers.length, total]);

  return (
    <>
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
              href={buildSellerUrl(seller)}
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
                {/* Avatar overlapping the cover */}
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

      {sellers.length < total && (
        <div
          ref={sentinelRef}
          style={{
            padding: "40px 0 8px",
            textAlign: "center",
            fontSize: 12,
            color: "#8a9e92",
          }}
        >
          {loadingMore ? "Loading more…" : ""}
        </div>
      )}
    </>
  );
}
