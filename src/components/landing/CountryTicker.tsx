"use client";

import { useEffect, useMemo, useState } from "react";
import { getApiClient } from "@/lib/apiClient";

type TickerEntry = {
  country_code: string;
  country_name: string;
  country_iso: string;
  crop: string;
  price: number | null;
  currency: string | null;
  hot: boolean;
};

// ISO alpha-2 → regional indicator flag emoji
function isoToFlag(iso: string | null | undefined): string {
  if (!iso || iso.length !== 2) return "🌐";
  const OFFSET = 0x1f1e6 - "A".charCodeAt(0);
  return String.fromCodePoint(
    ...iso
      .toUpperCase()
      .split("")
      .map((c) => c.charCodeAt(0) + OFFSET),
  );
}

function formatPrice(price: number | null, currency: string | null): string {
  if (price == null) return "";
  const code = currency || "XCD";
  const symbol =
    code === "USD"
      ? "$"
      : code === "XCD"
        ? "EC$"
        : code === "TTD"
          ? "TT$"
          : code === "JMD"
            ? "J$"
            : code === "BBD"
              ? "BB$"
              : `${code} `;
  return `${symbol}${price.toFixed(2)}`;
}

export default function CountryTicker() {
  const [entries, setEntries] = useState<TickerEntry[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "empty" | "error">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const client = getApiClient(() => null);
        const { data } = await client.get("/country-pulse/ticker");
        if (cancelled) return;
        const list = Array.isArray(data?.entries)
          ? (data.entries as TickerEntry[])
          : [];
        setEntries(list);
        setStatus(list.length > 0 ? "ready" : "empty");
      } catch (err) {
        if (!cancelled) {
          // Log so it's visible in the browser console when debugging
          // eslint-disable-next-line no-console
          console.warn("CountryTicker: /country-pulse/ticker failed", err);
          setStatus("error");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Duplicate entries so the CSS marquee loops seamlessly. When empty,
  // fall back to a label-only strip so the hero always has its ticker.
  const loop = useMemo(() => [...entries, ...entries], [entries]);

  return (
    <div
      aria-label="Caribbean market prices"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 4,
        padding: "44px 0 18px",
        background:
          "linear-gradient(180deg, rgba(12,20,16,0) 0%, rgba(12,20,16,0.55) 45%, rgba(12,20,16,0.85) 100%)",
        pointerEvents: "auto",
      }}
    >
      <div
        className="v6-cw"
        style={{ display: "flex", alignItems: "center", gap: 18 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
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
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: "#fafaf9",
              letterSpacing: ".1em",
              textTransform: "uppercase",
              textShadow: "0 1px 2px rgba(0,0,0,0.4)",
            }}
          >
            Caribbean Market
          </span>
        </div>

        <div
          className="l-ticker-viewport"
          style={{
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            maskImage:
              "linear-gradient(90deg, transparent 0, #000 48px, #000 calc(100% - 48px), transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent 0, #000 48px, #000 calc(100% - 48px), transparent 100%)",
          }}
        >
          {status !== "ready" && (
            <span
              style={{
                display: "inline-block",
                padding: "0 24px",
                fontSize: 12,
                fontWeight: 500,
                color: "rgba(250,250,249,0.72)",
                letterSpacing: "-.005em",
                whiteSpace: "nowrap",
                textShadow: "0 1px 3px rgba(0,0,0,0.5)",
              }}
            >
              {status === "loading"
                ? "Loading live market prices…"
                : status === "error"
                  ? "Live market prices unavailable"
                  : "Live market prices update as farms list new crops"}
            </span>
          )}
          <div
            className="l-ticker-track"
            style={{ display: status === "ready" ? "inline-flex" : "none" }}
          >
            {loop.map((t, i) => (
              <span
                key={`${t.country_code}-${t.crop}-${i}`}
                style={{
                  display: "inline-flex",
                  alignItems: "baseline",
                  gap: 10,
                  padding: "0 28px",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                }}
              >
                <span style={{ fontSize: 14, lineHeight: 1 }}>
                  {isoToFlag(t.country_iso)}
                </span>
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 500,
                    color: "rgba(250,250,249,0.8)",
                    letterSpacing: "-.005em",
                  }}
                >
                  {t.country_name}
                </span>
                <span
                  style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "#ffffff",
                    letterSpacing: "-.01em",
                  }}
                >
                  {t.crop}
                </span>
                {t.price != null && (
                  <span
                    style={{
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: "#ffffff",
                    }}
                  >
                    {formatPrice(t.price, t.currency)}
                  </span>
                )}
                {t.hot && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#ffb380",
                      textTransform: "uppercase",
                      letterSpacing: ".1em",
                    }}
                  >
                    Hot
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes l-ticker-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .l-ticker-track {
          display: inline-flex;
          align-items: center;
          animation: l-ticker-scroll 70s linear infinite;
          will-change: transform;
        }
        .l-ticker-viewport:hover .l-ticker-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .l-ticker-track {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
