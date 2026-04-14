"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getApiClient } from "@/lib/apiClient";

export type SignalType = "in_demand" | "scarce" | "trending" | "surplus";

export type PulseEntry = {
  id: string;
  source: "snapshot" | "override";
  signal_type: SignalType;
  rank: number;
  label: string;
  note?: string | null;
  product_id?: string | null;
  category?: string | null;
  is_pinned?: boolean;
  product_name?: string | null;
  product_image_url?: string | null;
  seller_name?: string | null;
  stock_quantity?: number | null;
  base_price?: number | null;
  currency?: string | null;
  unit?: string;
  trend?: number[];
  weekly_orders?: number;
  listings?: number;
  top_sellers?: string[];
};

// ─── Sparkline (inline SVG, no deps) ─────────────────────────────────────────
export function Sparkline({
  values,
  width = 56,
  height = 18,
  stroke = "#2d4a3e",
  dot = "#c26838",
}: {
  values: number[];
  width?: number;
  height?: number;
  stroke?: string;
  dot?: string;
}) {
  if (!values || values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = width / (values.length - 1);
  const points = values
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const lastX = (values.length - 1) * stepX;
  const lastY = height - ((values[values.length - 1] - min) / range) * height;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ flexShrink: 0, overflow: "visible" }}
      aria-hidden
    >
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r={2} fill={dot} />
    </svg>
  );
}

// Compact stat block used inside the expanded drawer
export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: 9.5,
          fontWeight: 700,
          color: "#8a9e92",
          textTransform: "uppercase",
          letterSpacing: ".08em",
          marginBottom: 3,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#2d4a3e",
          letterSpacing: "-.01em",
        }}
      >
        {value}
      </div>
    </div>
  );
}

type PulseResponse = {
  country_id: string;
  computed_at: string | null;
  signals: Record<SignalType, PulseEntry[]>;
};

type SignalMeta = { label: string; blurb: string };

export const SIGNAL_META: Record<SignalType, SignalMeta> = {
  in_demand: { label: "In demand", blurb: "Buyers asking now" },
  scarce: { label: "Scarce", blurb: "Running low island-wide" },
  trending: { label: "Trending", blurb: "Fast-moving this week" },
  surplus: { label: "Surplus", blurb: "Plenty available" },
};

export const SIGNAL_ORDER: SignalType[] = ["in_demand", "scarce", "trending", "surplus"];

const EMPTY_SIGNALS: Record<SignalType, PulseEntry[]> = {
  in_demand: [],
  scarce: [],
  trending: [],
  surplus: [],
};

export function formatPrice(p?: number | null, currency?: string | null) {
  if (p == null) return null;
  const code = currency || "XCD";
  const symbol = code === "USD" ? "$" : code === "XCD" ? "EC$" : `${code} `;
  return `${symbol}${p.toFixed(2)}`;
}

export default function CountryPulseSection({
  countryCode,
  countryName,
}: {
  countryCode: string;
  countryName: string;
}) {
  const [data, setData] = useState<PulseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const client = getApiClient(() => null);
        const { data: res } = await client.get("/country-pulse", {
          params: { countryCode },
        });
        if (!cancelled) setData(res as PulseResponse);
      } catch {
        // fall through — empty state will render
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [countryCode]);

  const signals: Record<SignalType, PulseEntry[]> =
    (data?.signals as Record<SignalType, PulseEntry[]>) || EMPTY_SIGNALS;

  const totalEntries = SIGNAL_ORDER.reduce(
    (sum, s) => sum + (signals[s] || []).length,
    0,
  );

  // While loading, or once loaded with no entries, hide the whole section.
  // Rationale: the section only earns its space on the landing page when it
  // has something to say.
  if (loading) return null;
  if (totalEntries === 0) return null;

  return (
    <div style={{ margin: "48px 0 32px" }}>
      {/* ── Section header (matches existing SecH pattern) ── */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            margin: "28px 0 12px",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: "#c26838",
                  display: "inline-block",
                  animation: "l-pulse-dot 2s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#c26838",
                  letterSpacing: ".04em",
                  textTransform: "uppercase",
                }}
              >
                Live in {countryName}
              </span>
            </div>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "-.2px",
                color: "#1c2b23",
                margin: 0,
              }}
            >
              What&apos;s moving on the market
            </h2>
          </div>
          <Link
            href={`/pulse?country=${countryCode}`}
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#2d4a3e",
              textDecoration: "none",
            }}
          >
            See all signals →
          </Link>
        </div>

        {/* ── Unified cream card with 4 columns, no dividers ── */}
        <div
          style={{
            background: "#f5f1ea",
            border: "1px solid #e8e4dc",
            borderRadius: 18,
            padding: 28,
          }}
          className="l-pulse-card"
        >
          <div className="l-pulse-grid">
            {SIGNAL_ORDER.map((signal) => {
              const meta = SIGNAL_META[signal];
              const entries = (signals[signal] || []).slice(0, 4);
              return (
                <div key={signal} className="l-pulse-col">
                  <div className="l-pulse-col-head">
                    <h3
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#2d4a3e",
                        margin: 0,
                        letterSpacing: "-.01em",
                      }}
                    >
                      {meta.label}
                    </h3>
                    <p
                      style={{
                        fontSize: 11,
                        color: "#8a9e92",
                        margin: "2px 0 0",
                        letterSpacing: "-.005em",
                      }}
                    >
                      {meta.blurb}
                    </p>
                  </div>

                  <ul
                    style={{
                      listStyle: "none",
                      margin: "14px 0 0",
                      padding: 0,
                    }}
                  >
                    {entries.map((entry) => {
                      const rowKey = `${entry.source}-${entry.id}`;
                      const isOpen = openId === rowKey;
                      const href = entry.product_id
                        ? `/browse?productId=${entry.product_id}`
                        : `/browse?search=${encodeURIComponent(entry.label)}`;
                      const price = formatPrice(entry.base_price, entry.currency);
                      return (
                        <li key={rowKey}>
                          <button
                            type="button"
                            onClick={() => setOpenId(isOpen ? null : rowKey)}
                            className="l-pulse-item"
                            aria-expanded={isOpen}
                            style={{
                              background: "transparent",
                              border: "none",
                              width: "100%",
                              textAlign: "left",
                              cursor: "pointer",
                              fontFamily: "inherit",
                            }}
                          >
                            <div className="l-pulse-item-img">
                              {entry.product_image_url && (
                                <Image
                                  src={entry.product_image_url}
                                  alt={entry.label}
                                  fill
                                  sizes="48px"
                                  style={{ objectFit: "cover" }}
                                />
                              )}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                  marginBottom: 2,
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: 12.5,
                                    fontWeight: 600,
                                    color: "#3e5549",
                                    letterSpacing: "-.01em",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {entry.product_name || entry.label}
                                </span>
                                {entry.is_pinned && (
                                  <span
                                    aria-label="Pinned"
                                    title="Pinned by Procur"
                                    style={{
                                      width: 5,
                                      height: 5,
                                      borderRadius: 999,
                                      background: "#c26838",
                                      flexShrink: 0,
                                    }}
                                  />
                                )}
                              </div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "#8a9e92",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  letterSpacing: "-.005em",
                                }}
                              >
                                {entry.note ||
                                  entry.seller_name ||
                                  entry.category ||
                                  ""}
                              </div>
                            </div>
                            {price && (
                              <span
                                style={{
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: "#2d4a3e",
                                  flexShrink: 0,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {price}
                              </span>
                            )}
                          </button>

                          {/* Expandable drawer */}
                          <div
                            className="l-pulse-drawer"
                            style={{
                              maxHeight: isOpen ? 220 : 0,
                              opacity: isOpen ? 1 : 0,
                              overflow: "hidden",
                              transition:
                                "max-height .35s ease, opacity .25s ease, margin .25s ease",
                              marginTop: isOpen ? 8 : 0,
                              marginBottom: isOpen ? 6 : 0,
                            }}
                            aria-hidden={!isOpen}
                          >
                            <div
                              style={{
                                background: "#efeadc",
                                borderRadius: 12,
                                padding: 14,
                              }}
                            >
                              {/* Note or seller context */}
                              {(entry.note || entry.seller_name) && (
                                <div
                                  style={{
                                    fontSize: 11.5,
                                    color: "#3e5549",
                                    letterSpacing: "-.005em",
                                    marginBottom: 12,
                                    lineHeight: 1.45,
                                  }}
                                >
                                  {entry.note || `Listed by ${entry.seller_name}`}
                                </div>
                              )}

                              {/* Stock context for scarce/surplus */}
                              {typeof entry.stock_quantity === "number" && (
                                <div
                                  style={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: "#8a9e92",
                                    textTransform: "uppercase",
                                    letterSpacing: ".08em",
                                    marginBottom: 12,
                                  }}
                                >
                                  {entry.stock_quantity} {entry.unit || "units"}
                                  {" available"}
                                </div>
                              )}

                              {/* CTAs */}
                              <div style={{ display: "flex", gap: 8 }}>
                                <Link
                                  href={`/browse?search=${encodeURIComponent(entry.label)}&signal=${entry.signal_type}`}
                                  style={{
                                    flex: 1,
                                    textAlign: "center",
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: "#fafaf9",
                                    background: "#c26838",
                                    padding: "9px 12px",
                                    borderRadius: 999,
                                    textDecoration: "none",
                                    letterSpacing: ".02em",
                                  }}
                                >
                                  Request a quote
                                </Link>
                                <Link
                                  href={href}
                                  style={{
                                    flex: 1,
                                    textAlign: "center",
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: "#2d4a3e",
                                    background: "transparent",
                                    border: "1px solid #d8d2c4",
                                    padding: "8px 12px",
                                    borderRadius: 999,
                                    textDecoration: "none",
                                  }}
                                >
                                  View product
                                </Link>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

      <style jsx global>{`
        @keyframes l-pulse-dot {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.45;
            transform: scale(1.45);
          }
        }
        .l-pulse-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .l-pulse-col {
          min-width: 0;
        }
        .l-pulse-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          text-decoration: none;
          color: inherit;
          transition: transform 0.25s ease;
        }
        .l-pulse-item:hover {
          transform: translateX(3px);
        }
        .l-pulse-item-img {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          overflow: hidden;
          position: relative;
          background: #ebe7df;
          flex-shrink: 0;
        }
        .l-pulse-item:hover .l-pulse-item-img {
          filter: brightness(1.02);
        }
        @media (max-width: 1024px) {
          .l-pulse-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 28px 24px !important;
          }
        }
        @media (max-width: 560px) {
          .l-pulse-card {
            padding: 20px !important;
          }
          .l-pulse-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </div>
  );
}
