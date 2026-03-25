"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppSelector } from "@/store";
import { getApiClient } from "@/lib/apiClient";

export default function FsmaExportPage() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  const thisYear = new Date().getFullYear();
  const [from, setFrom] = useState(`${thisYear}-01-01`);
  const [to, setTo] = useState(new Date().toISOString().slice(0, 10));
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastExport, setLastExport] = useState<string | null>(null);

  const handleExport = async () => {
    setError(null);
    setDownloading(true);
    try {
      const client = getApiClient(() => accessToken!);
      const res = await client.get("/sellers/farm/export", {
        params: { from, to },
        responseType: "blob",
      });
      const blob = res.data as Blob;
      const contentDisposition = res.headers?.["content-disposition"] as string | undefined;
      let filename = `procur-fsma204-${to}.csv`;
      if (contentDisposition) {
        const m = contentDisposition.match(/filename\*?\s*=\s*(?:UTF-8'')?["']?([^"';\r\n]+)/i);
        if (m?.[1]) filename = decodeURIComponent(m[1].replace(/(^"|"$)/g, ""));
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      setLastExport(new Date().toLocaleString());
    } catch {
      setError("Export failed. Make sure you have harvest logs in the selected date range.");
    } finally {
      setDownloading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    padding: "9px 12px",
    border: "1px solid #e8e4dc",
    borderRadius: 8,
    fontSize: 13,
    color: "#1c2b23",
    background: "#fff",
    outline: "none",
    fontFamily: "'Urbanist', system-ui, sans-serif",
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f4", fontFamily: "'Urbanist', system-ui, sans-serif", color: "#1c2b23", WebkitFontSmoothing: "antialiased" }}>
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "36px 24px 72px" }}>
        <Link href="/seller/farm" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: "#2d4a3e", textDecoration: "none", marginBottom: 28 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={13} height={13}><path d="M15 18l-6-6 6-6"/></svg>
          Farm Hub
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-.4px", margin: "0 0 6px" }}>
            FSMA 204 Export
          </h1>
          <p style={{ fontSize: 13, color: "#6a7f73", margin: 0, lineHeight: 1.6 }}>
            Download a FDA-compliant Electronic Sortable Spreadsheet (ESS) covering all Harvest and Packing Critical Tracking Events in the selected date range.
          </p>
        </div>

        {/* What's included */}
        <div style={{ background: "#f0f7f4", border: "1px solid #c8ddd4", borderRadius: 10, padding: "16px 20px", marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#2d4a3e", textTransform: "uppercase", letterSpacing: ".06em", margin: "0 0 10px" }}>What&apos;s Included</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {[
              { cte: "Harvesting CTE", kdes: "TLC, crop, harvest date, farm location, quantity, responsible party" },
              { cte: "Packing CTE",    kdes: "TLC, packing facility, date, quantity, transport mode, bill of lading" },
            ].map(({ cte, kdes }) => (
              <div key={cte} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2d4a3e", marginTop: 4, flexShrink: 0, display: "block" }} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#1c2b23", margin: 0 }}>{cte}</p>
                  <p style={{ fontSize: 11, color: "#6a7f73", margin: "1px 0 0" }}>{kdes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Date range */}
        <div style={{ background: "#fff", border: "1px solid #ebe7df", borderRadius: 10, padding: "24px 20px", marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23", margin: "0 0 18px" }}>Select Date Range</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#8a9e92", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5 }}>
                From
              </label>
              <input
                type="date"
                value={from}
                max={to}
                onChange={(e) => setFrom(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#8a9e92", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5 }}>
                To
              </label>
              <input
                type="date"
                value={to}
                min={from}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setTo(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {error && (
            <div style={{ marginTop: 16, padding: "10px 14px", background: "#fdf2f2", border: "1px solid #f5c6cb", borderRadius: 8, fontSize: 13, color: "#b43c3c" }}>
              {error}
            </div>
          )}

          {lastExport && !error && (
            <div style={{ marginTop: 16, padding: "10px 14px", background: "#f0f7f4", border: "1px solid #c8ddd4", borderRadius: 8, fontSize: 12, color: "#2d4a3e", fontWeight: 600 }}>
              ✓ Last exported at {lastExport}
            </div>
          )}

          <button
            onClick={handleExport}
            disabled={downloading || !from || !to}
            style={{
              marginTop: 20,
              width: "100%",
              padding: "13px 20px",
              background: downloading ? "#d8d2c8" : "#2d4a3e",
              border: "none",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
              cursor: downloading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontFamily: "inherit",
            }}
          >
            {downloading ? (
              <>
                <span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,.4)", borderTopColor: "#fff", animation: "spin 1s linear infinite", display: "block" }} />
                Generating CSV…
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={15} height={15}>
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download FSMA 204 CSV
              </>
            )}
          </button>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>

        {/* Help */}
        <div style={{ padding: "16px 20px", background: "#fff8f4", border: "1px solid #f0ddd0", borderRadius: 10 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#c26838", textTransform: "uppercase", letterSpacing: ".06em", margin: "0 0 8px" }}>FDA Submission Reminder</p>
          <p style={{ fontSize: 12, color: "#7a5540", margin: 0, lineHeight: 1.7 }}>
            Under FSMA 204, you must be able to provide traceability records to the FDA within <strong>24 hours</strong> of a request. Keep this CSV export accessible and update it before any shipment to the US.
          </p>
        </div>
      </main>
    </div>
  );
}
