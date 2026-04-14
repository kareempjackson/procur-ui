"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/store";
import { selectCountry, selectCountries } from "@/store/slices/countrySlice";
import { getApiClient } from "@/lib/apiClient";
import ProcurFooter from "@/components/footer/ProcurFooter";
import {
  formatPrice,
  SIGNAL_META,
  SIGNAL_ORDER,
  type PulseEntry,
  type SignalType,
} from "@/components/landing/CountryPulseSection";

type PulseResponse = {
  country_id: string;
  computed_at: string | null;
  signals: Record<SignalType, PulseEntry[]>;
};

function PulsePageInner() {
  const searchParams = useSearchParams();
  const paramCountry = searchParams?.get("country") || null;
  const initialSignal = (searchParams?.get("signal") as SignalType) || "in_demand";

  const reduxCountry = useAppSelector(selectCountry);
  const countries = useAppSelector(selectCountries);

  const countryCode = paramCountry || reduxCountry?.code || "gda";
  const currentCountry =
    countries.find((c) => c.code === countryCode) || null;
  const countryName = currentCountry?.name || reduxCountry?.name || "Grenada";

  const [data, setData] = useState<PulseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSignal, setActiveSignal] = useState<SignalType>(initialSignal);
  const [openId, setOpenId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

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
        // empty state renders
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [countryCode]);

  const EMPTY_SIGNALS: Record<SignalType, PulseEntry[]> = {
    in_demand: [],
    scarce: [],
    trending: [],
    surplus: [],
  };

  const signals: Record<SignalType, PulseEntry[]> =
    (data?.signals as Record<SignalType, PulseEntry[]>) || EMPTY_SIGNALS;

  const counts = useMemo(
    () =>
      SIGNAL_ORDER.reduce(
        (acc, s) => ({ ...acc, [s]: (signals[s] || []).length }),
        {} as Record<SignalType, number>,
      ),
    [signals],
  );

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const s of SIGNAL_ORDER) {
      for (const e of signals[s] || []) {
        if (e.category) set.add(e.category);
      }
    }
    return ["all", ...Array.from(set)];
  }, [signals]);

  const activeEntries = (signals[activeSignal] || []).filter((e) =>
    categoryFilter === "all" ? true : e.category === categoryFilter,
  );

  return (
    <div style={{ background: "#fafaf9", minHeight: "100vh" }}>
      {/* ── Teal header strip ─────────────────────────────────────────────── */}
      <div
        style={{
          background: "#2d4a3e",
          color: "#fafaf9",
          padding: "14px 0",
        }}
      >
        <div className="v6-cw" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              color: "#fafaf9",
            }}
          >
            <span style={{ fontSize: 12, opacity: 0.7 }}>←</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: ".05em",
                textTransform: "uppercase",
              }}
            >
              Back to Procur
            </span>
          </Link>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: ".04em",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: "#f0a070",
                display: "inline-block",
                animation: "l-pulse-dot 2s ease-in-out infinite",
              }}
            />
            Live in {countryName}
          </div>
        </div>
      </div>

      <div className="v6-cw" style={{ padding: "56px 0 80px" }}>
        {/* ── Page header ────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 48 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#c26838",
              letterSpacing: ".08em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Country Pulse
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 44,
              fontWeight: 700,
              color: "#1c2b23",
              letterSpacing: "-.8px",
              lineHeight: 1.05,
            }}
          >
            All signals in {countryName}
          </h1>
          <p
            style={{
              margin: "14px 0 0",
              fontSize: 15,
              color: "#5a6560",
              maxWidth: 640,
              lineHeight: 1.55,
            }}
          >
            Every crop currently moving on the market. Demand, scarcity,
            momentum, and surplus — updated as farms list and buyers request.
            Click any row to see its 7-day trend, top sellers, and request a
            quote.
          </p>
        </div>

        {/* ── Signal tabs ────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 20,
            borderBottom: "1px solid #e8e4dc",
            paddingBottom: 14,
          }}
        >
          {SIGNAL_ORDER.map((s) => {
            const meta = SIGNAL_META[s];
            const isActive = s === activeSignal;
            return (
              <button
                key={s}
                onClick={() => {
                  setActiveSignal(s);
                  setOpenId(null);
                  setCategoryFilter("all");
                }}
                style={{
                  background: isActive ? "#2d4a3e" : "transparent",
                  color: isActive ? "#fafaf9" : "#3e5549",
                  border: "1px solid",
                  borderColor: isActive ? "#2d4a3e" : "#d8d2c4",
                  padding: "10px 18px",
                  borderRadius: 999,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 12.5,
                  fontWeight: 600,
                  letterSpacing: "-.005em",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "all .2s ease",
                }}
              >
                {meta.label}
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    opacity: 0.7,
                  }}
                >
                  {counts[s]}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Category filter ────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 32,
          }}
        >
          {categories.map((c) => {
            const isActive = c === categoryFilter;
            return (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                style={{
                  background: isActive ? "#f5f1ea" : "transparent",
                  color: isActive ? "#2d4a3e" : "#8a9e92",
                  border: "1px solid",
                  borderColor: isActive ? "#d8d2c4" : "transparent",
                  padding: "5px 12px",
                  borderRadius: 999,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "-.005em",
                  textTransform: "capitalize",
                }}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* ── Signal description ─────────────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 13,
              color: "#8a9e92",
              letterSpacing: "-.005em",
            }}
          >
            <span style={{ color: "#2d4a3e", fontWeight: 700 }}>
              {SIGNAL_META[activeSignal].label}
            </span>
            {" · "}
            {SIGNAL_META[activeSignal].blurb}
            {" · "}
            {activeEntries.length} result
            {activeEntries.length === 1 ? "" : "s"}
          </div>
        </div>

        {/* ── Results list ───────────────────────────────────────────────── */}
        <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {loading && (
            <>
              {[0, 1, 2, 3].map((i) => (
                <li
                  key={`skel-${i}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    padding: "20px 4px",
                    borderTop: i === 0 ? "none" : "1px solid #e8e4dc",
                  }}
                >
                  <div
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: 12,
                      background: "#efeadc",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        width: "40%",
                        height: 16,
                        borderRadius: 6,
                        background: "#efeadc",
                        marginBottom: 8,
                      }}
                    />
                    <div
                      style={{
                        width: "60%",
                        height: 12,
                        borderRadius: 6,
                        background: "#efeadc",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      width: 70,
                      height: 14,
                      borderRadius: 6,
                      background: "#efeadc",
                    }}
                  />
                </li>
              ))}
            </>
          )}
          {!loading && activeEntries.length === 0 && (
            <li
              style={{
                padding: "48px 20px",
                textAlign: "center",
                fontSize: 13,
                color: "#8a9e92",
                background: "#f5f1ea",
                borderRadius: 12,
              }}
            >
              No signals match these filters yet.
            </li>
          )}
          {activeEntries.map((entry, idx) => {
            const rowKey = `${entry.source}-${entry.id}`;
            const isOpen = openId === rowKey;
            const href = entry.product_id
              ? `/browse?productId=${entry.product_id}`
              : `/browse?search=${encodeURIComponent(entry.label)}`;
            const price = formatPrice(entry.base_price, entry.currency);
            return (
              <li
                key={rowKey}
                style={{ borderTop: idx === 0 ? "none" : "1px solid #e8e4dc" }}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : rowKey)}
                  aria-expanded={isOpen}
                  style={{
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "40px 68px 1fr auto auto",
                    alignItems: "center",
                    gap: 20,
                    padding: "20px 4px",
                    background: "transparent",
                    border: "none",
                    textAlign: "left",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    color: "inherit",
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#b8bcb6",
                      letterSpacing: "-.01em",
                    }}
                  >
                    {(idx + 1).toString().padStart(2, "0")}
                  </span>
                  <div
                    style={{
                      width: 68,
                      height: 68,
                      position: "relative",
                      background: "#efeadc",
                      borderRadius: 12,
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    {entry.product_image_url && (
                      <Image
                        src={entry.product_image_url}
                        alt={entry.label}
                        fill
                        sizes="68px"
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
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
                          fontSize: 16,
                          fontWeight: 700,
                          color: "#1c2b23",
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
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            color: "#c26838",
                            textTransform: "uppercase",
                            letterSpacing: ".08em",
                            border: "1px solid #c26838",
                            padding: "2px 6px",
                            borderRadius: 4,
                          }}
                        >
                          Pinned
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#8a9e92",
                        letterSpacing: "-.005em",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
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
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#2d4a3e",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {price}
                      {entry.unit && (
                        <span style={{ fontSize: 11, color: "#8a9e92", fontWeight: 500 }}>
                          {" "}/{entry.unit}
                        </span>
                      )}
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: 14,
                      color: "#8a9e92",
                      transform: isOpen ? "rotate(90deg)" : "none",
                      transition: "transform .2s ease",
                      display: "inline-block",
                    }}
                  >
                    ›
                  </span>
                </button>

                {/* Expanded drawer */}
                <div
                  style={{
                    maxHeight: isOpen ? 400 : 0,
                    opacity: isOpen ? 1 : 0,
                    overflow: "hidden",
                    transition:
                      "max-height .35s ease, opacity .25s ease, margin .25s ease",
                    marginBottom: isOpen ? 16 : 0,
                  }}
                  aria-hidden={!isOpen}
                >
                  <div
                    style={{
                      background: "#f5f1ea",
                      borderRadius: 14,
                      padding: 22,
                      margin: "0 0 0 128px",
                    }}
                    className="l-pulse-drawer-lg"
                  >
                    {entry.note && (
                      <div
                        style={{
                          fontSize: 13,
                          color: "#3e5549",
                          letterSpacing: "-.005em",
                          marginBottom: 14,
                          lineHeight: 1.5,
                        }}
                      >
                        {entry.note}
                      </div>
                    )}

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 16,
                        marginBottom: 18,
                      }}
                    >
                      {entry.seller_name && (
                        <div>
                          <div
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: "#8a9e92",
                              textTransform: "uppercase",
                              letterSpacing: ".1em",
                              marginBottom: 4,
                            }}
                          >
                            Seller
                          </div>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: "#2d4a3e",
                            }}
                          >
                            {entry.seller_name}
                          </div>
                        </div>
                      )}
                      {typeof entry.stock_quantity === "number" && (
                        <div>
                          <div
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: "#8a9e92",
                              textTransform: "uppercase",
                              letterSpacing: ".1em",
                              marginBottom: 4,
                            }}
                          >
                            Available
                          </div>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: "#2d4a3e",
                            }}
                          >
                            {entry.stock_quantity}
                            {entry.unit ? ` ${entry.unit}` : ""}
                          </div>
                        </div>
                      )}
                      {entry.category && (
                        <div>
                          <div
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: "#8a9e92",
                              textTransform: "uppercase",
                              letterSpacing: ".1em",
                              marginBottom: 4,
                            }}
                          >
                            Category
                          </div>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: "#2d4a3e",
                            }}
                          >
                            {entry.category}
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <Link
                        href={`/browse?search=${encodeURIComponent(entry.label)}&signal=${entry.signal_type}`}
                        style={{
                          textAlign: "center",
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#fafaf9",
                          background: "#c26838",
                          padding: "12px 22px",
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
                          textAlign: "center",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#2d4a3e",
                          background: "transparent",
                          border: "1px solid #d8d2c4",
                          padding: "11px 22px",
                          borderRadius: 999,
                          textDecoration: "none",
                        }}
                      >
                        View product page
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <ProcurFooter />

      <style jsx global>{`
        @media (max-width: 720px) {
          .l-pulse-drawer-lg {
            grid-template-columns: 1fr !important;
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function PulsePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#fafaf9" }} />}>
      <PulsePageInner />
    </Suspense>
  );
}
