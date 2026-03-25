import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

async function getLotData(lotCode: string) {
  try {
    const res = await fetch(
      `${API_BASE}/sellers/farm/lot-code/${encodeURIComponent(lotCode)}`,
      { next: { revalidate: 3600 } }
    );
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("fetch failed");
    return res.json();
  } catch {
    return null;
  }
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function VerifyLotPage({
  params,
}: {
  params: Promise<{ lotCode: string }>;
}) {
  const { lotCode } = await params;
  const data = await getLotData(lotCode);
  if (!data) notFound();

  const farm = data.farm_profile;
  const certifications: any[] = farm?.certifications ?? [];
  const today = new Date();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#faf8f4",
        fontFamily: "'Urbanist', system-ui, sans-serif",
        color: "#1c2b23",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* Verified header bar */}
      <div
        style={{
          background: "#2d4a3e",
          color: "#fff",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          width={20}
          height={20}
        >
          <path d="M9 12l2 2 4-4" />
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
        </svg>
        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".02em" }}>
          Verified by Procur
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 11,
            opacity: 0.7,
            fontWeight: 600,
          }}
        >
          FSMA 204 Traceable
        </span>
      </div>

      <main
        style={{ maxWidth: 520, margin: "0 auto", padding: "28px 20px 64px" }}
      >
        {/* Crop + Lot Code */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #ebe7df",
            borderRadius: 14,
            padding: "22px 20px",
            marginBottom: 14,
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#8a9e92",
              textTransform: "uppercase",
              letterSpacing: ".07em",
              margin: "0 0 6px",
            }}
          >
            Product
          </p>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "-.3px",
              margin: "0 0 10px",
              textTransform: "capitalize",
            }}
          >
            {data.crop}
            {data.variety ? (
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#6a7f73",
                  marginLeft: 8,
                }}
              >
                {data.variety}
              </span>
            ) : null}
          </h1>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#8a9e92",
              textTransform: "uppercase",
              letterSpacing: ".07em",
              margin: "0 0 6px",
            }}
          >
            Traceability Lot Code
          </p>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 13,
              fontWeight: 700,
              background: "#f0f7f4",
              color: "#2d4a3e",
              padding: "6px 12px",
              borderRadius: 8,
              display: "inline-block",
              letterSpacing: ".06em",
            }}
          >
            {data.lot_code}
          </span>
          {data.quantity_harvested && (
            <p
              style={{
                fontSize: 12,
                color: "#8a9e92",
                margin: "10px 0 0",
              }}
            >
              Quantity: {data.quantity_harvested.toLocaleString()}{" "}
              {data.unit ?? ""}
            </p>
          )}
        </div>

        {/* Farm Origin */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #ebe7df",
            borderRadius: 14,
            padding: "22px 20px",
            marginBottom: 14,
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#8a9e92",
              textTransform: "uppercase",
              letterSpacing: ".07em",
              margin: "0 0 14px",
            }}
          >
            Farm Origin
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {farm?.parish && (
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{ fontSize: 12, color: "#8a9e92", width: 90, flexShrink: 0 }}>
                  Parish
                </span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{farm.parish}</span>
              </div>
            )}
            {farm?.country && (
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{ fontSize: 12, color: "#8a9e92", width: 90, flexShrink: 0 }}>
                  Country
                </span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{farm.country}</span>
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <span style={{ fontSize: 12, color: "#8a9e92", width: 90, flexShrink: 0 }}>
                Harvested
              </span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>
                {fmtDate(data.harvest_date)}
              </span>
            </div>
            {data.plot_name && (
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{ fontSize: 12, color: "#8a9e92", width: 90, flexShrink: 0 }}>
                  Plot
                </span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{data.plot_name}</span>
              </div>
            )}
            {data.seller_name && (
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{ fontSize: 12, color: "#8a9e92", width: 90, flexShrink: 0 }}>
                  Grower
                </span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{data.seller_name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Certifications */}
        {certifications.length > 0 && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #ebe7df",
              borderRadius: 14,
              padding: "22px 20px",
              marginBottom: 14,
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#8a9e92",
                textTransform: "uppercase",
                letterSpacing: ".07em",
                margin: "0 0 12px",
              }}
            >
              Certifications
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {certifications.map((cert: any, i: number) => {
                const expired = cert.expires && new Date(cert.expires) < today;
                const expiringSoon =
                  !expired &&
                  cert.expires &&
                  (new Date(cert.expires).getTime() - today.getTime()) /
                    (1000 * 60 * 60 * 24) <=
                    30;
                return (
                  <span
                    key={i}
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      padding: "4px 12px",
                      borderRadius: 999,
                      background: expired
                        ? "#fdf2f2"
                        : expiringSoon
                        ? "#fffbeb"
                        : "#f0f7f4",
                      color: expired
                        ? "#b43c3c"
                        : expiringSoon
                        ? "#b45309"
                        : "#2e7d4f",
                      border: `1px solid ${
                        expired
                          ? "#f5c6cb"
                          : expiringSoon
                          ? "#fde68a"
                          : "#c6e8d4"
                      }`,
                    }}
                  >
                    {cert.type ?? cert.name ?? "Certified"}
                    {cert.certifier ? ` · ${cert.certifier}` : ""}
                    {expired ? " (expired)" : ""}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", paddingTop: 24 }}>
          <p style={{ fontSize: 11, color: "#8a9e92", margin: 0 }}>
            Traceability powered by{" "}
            <Link
              href="/"
              style={{ color: "#2d4a3e", fontWeight: 700, textDecoration: "none" }}
            >
              Procur
            </Link>
          </p>
          <p style={{ fontSize: 10, color: "#b0bab4", margin: "4px 0 0" }}>
            FSMA 204 Compliant · Caribbean Agriculture
          </p>
        </div>
      </main>
    </div>
  );
}
