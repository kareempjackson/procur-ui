"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchComplianceDashboard,
  fetchPriceBenchmark,
} from "@/store/slices/farmSlice";

const FF: React.CSSProperties = { fontFamily: "'Urbanist', system-ui, sans-serif" };

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const fill = circ * (score / 100);
  const color = score >= 80 ? "#2e7d4f" : score >= 55 ? "#c49a2a" : "#b43c3c";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f0ece6" strokeWidth={8} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={8}
        strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" />
      <text x={size/2} y={size/2 + 6} textAnchor="middle" fontSize={size * 0.22} fontWeight={800}
        fill={color} style={{ transform: `rotate(90deg) translate(-${size}px, 0)`, transformOrigin: "center", fontFamily: "'Urbanist', system-ui, sans-serif" }}>
        {score}
      </text>
    </svg>
  );
}

function MetricCard({
  label, value, sub, color, icon,
}: { label: string; value: string | number; sub?: string; color?: string; icon?: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #ebe7df", borderRadius: 10, padding: "16px 18px" }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#8a9e92", textTransform: "uppercase", letterSpacing: ".06em", margin: "0 0 8px", display: "flex", alignItems: "center", gap: 5 }}>
        {icon && <span>{icon}</span>}{label}
      </p>
      <p style={{ fontSize: 24, fontWeight: 800, color: color ?? "#1c2b23", margin: 0, letterSpacing: "-.4px" }}>
        {value}
      </p>
      {sub && <p style={{ fontSize: 11, color: "#8a9e92", margin: "4px 0 0" }}>{sub}</p>}
    </div>
  );
}

function PctBar({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: "#6a7f73" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23" }}>{value}%</span>
      </div>
      <div style={{ height: 6, background: "#f0ece6", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 3, transition: "width .6s ease" }} />
      </div>
    </div>
  );
}

function PricePill({ position }: { position: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    below: { label: "Below market", color: "#2e7d4f", bg: "#f0f7f4" },
    at:    { label: "At market",    color: "#c49a2a", bg: "#fffbeb" },
    above: { label: "Above market", color: "#b43c3c", bg: "#fdf2f2" },
    no_data: { label: "No data",    color: "#8a9e92", bg: "#f5f1ea" },
  };
  const p = map[position] ?? map.no_data;
  return (
    <span style={{ fontSize: 10, fontWeight: 700, color: p.color, background: p.bg, padding: "2px 8px", borderRadius: 999 }}>
      {p.label}
    </span>
  );
}

const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  Platinum: { bg: "#f0f4ff", color: "#3d5a99" },
  Gold:     { bg: "#fffbeb", color: "#c49a2a" },
  Silver:   { bg: "#f5f5f5", color: "#6a7f73" },
  Standard: { bg: "#f5f1ea", color: "#8a9e92" },
};

export default function ComplianceDashboardPage() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const { complianceDashboard: dash, priceBenchmark, loading } = useAppSelector((s) => s.farm);

  useEffect(() => {
    if (!accessToken) return;
    dispatch(fetchComplianceDashboard(accessToken));
    dispatch(fetchPriceBenchmark(accessToken));
  }, [accessToken, dispatch]);

  if (loading.compliance && !dash) {
    return (
      <div style={{ minHeight: "100vh", background: "#faf8f4", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid #e8e4dc", borderTopColor: "#2d4a3e", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f4", ...FF, color: "#1c2b23", WebkitFontSmoothing: "antialiased" }}>
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "36px 24px 72px" }}>
        <Link href="/seller/farm" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: "#2d4a3e", textDecoration: "none", marginBottom: 24 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={13} height={13}><path d="M15 18l-6-6 6-6"/></svg>
          Farm Hub
        </Link>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-.4px", margin: "0 0 6px" }}>Compliance Dashboard</h1>
          <p style={{ fontSize: 13, color: "#6a7f73", margin: 0 }}>FSMA 204 coverage, reliability score, certifications, and price benchmark</p>
        </div>

        {dash && (
          <>
            {/* ── Overall score ── */}
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "center", background: "#fff", border: "1px solid #ebe7df", borderRadius: 12, padding: "24px", marginBottom: 20 }}>
              <div style={{ textAlign: "center" }}>
                <ScoreRing score={dash.compliance_score} size={100} />
                <p style={{ fontSize: 11, fontWeight: 700, color: "#8a9e92", textTransform: "uppercase", letterSpacing: ".06em", margin: "8px 0 0" }}>Compliance Score</p>
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#1c2b23", margin: "0 0 6px" }}>
                  {dash.compliance_score >= 80 ? "✅ Strong compliance standing" : dash.compliance_score >= 55 ? "⚠️ Some gaps to address" : "🔴 Action required"}
                </p>
                <p style={{ fontSize: 13, color: "#6a7f73", margin: "0 0 14px", lineHeight: 1.6 }}>
                  Your score is computed from FSMA 204 lot code coverage, receiving confirmation rate, certification status, and reliability.
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Link href="/seller/farm/export" style={{ fontSize: 12, fontWeight: 700, color: "#2d4a3e", background: "#f0f7f4", border: "1px solid #c8ddd4", borderRadius: 999, padding: "6px 14px", textDecoration: "none" }}>
                    Export FSMA CSV
                  </Link>
                  <Link href="/seller/farm/harvest-logs" style={{ fontSize: 12, fontWeight: 700, color: "#2d4a3e", background: "#f0f7f4", border: "1px solid #c8ddd4", borderRadius: 999, padding: "6px 14px", textDecoration: "none" }}>
                    View Harvest Logs
                  </Link>
                </div>
              </div>
            </div>

            {/* ── FSMA Coverage ── */}
            <div style={{ background: "#fff", border: "1px solid #ebe7df", borderRadius: 12, padding: "20px", marginBottom: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
                📋 FSMA 204 Coverage
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <PctBar value={dash.fsma.lot_code_coverage_pct} label="Lot code coverage (shipped orders)" color={dash.fsma.lot_code_coverage_pct >= 90 ? "#2e7d4f" : "#c49a2a"} />
                <PctBar value={dash.fsma.receiving_coverage_pct} label="Receiving confirmations (delivered orders)" color={dash.fsma.receiving_coverage_pct >= 90 ? "#2e7d4f" : "#c49a2a"} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px,1fr))", gap: 10, marginTop: 16, paddingTop: 16, borderTop: "1px solid #f0ece6" }}>
                {[
                  { label: "Harvest Logs", value: dash.fsma.total_harvest_logs },
                  { label: "With Packing Records", value: dash.fsma.harvest_logs_with_packing },
                  { label: "Shipped Orders", value: dash.fsma.shipped_orders },
                  { label: "With Lot Code", value: dash.fsma.shipped_with_lot_code },
                  { label: "Delivered Orders", value: dash.fsma.delivered_orders },
                  { label: "Receiving Confirmed", value: dash.fsma.receiving_confirmations },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#8a9e92", textTransform: "uppercase", letterSpacing: ".06em", margin: "0 0 2px" }}>{label}</p>
                    <p style={{ fontSize: 20, fontWeight: 800, color: "#1c2b23", margin: 0 }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Reliability ── */}
            <div style={{ background: "#fff", border: "1px solid #ebe7df", borderRadius: 12, padding: "20px", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                  ⭐ Seller Reliability
                </p>
                {(() => {
                  const bc = BADGE_COLORS[dash.reliability.badge] ?? BADGE_COLORS.Standard;
                  return (
                    <span style={{ fontSize: 12, fontWeight: 800, color: bc.color, background: bc.bg, border: `1px solid ${bc.color}30`, padding: "4px 12px", borderRadius: 999 }}>
                      {dash.reliability.badge}
                    </span>
                  );
                })()}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px,1fr))", gap: 12 }}>
                <MetricCard label="Reliability Score" value={`${dash.reliability.reliability_score}/100`} color={dash.reliability.reliability_score >= 80 ? "#2e7d4f" : "#c49a2a"} />
                <MetricCard label="Acceptance Rate" value={`${dash.reliability.acceptance_rate}%`} />
                <MetricCard label="Completion Rate" value={`${dash.reliability.completion_rate}%`} />
                <MetricCard label="On-Time Rate" value={`${dash.reliability.on_time_rate}%`} />
                {dash.reliability.avg_quality_score !== null && (
                  <MetricCard label="Avg Quality" value={`${dash.reliability.avg_quality_score}/5`} sub="From buyer receiving" />
                )}
                <MetricCard label="Total Orders" value={dash.reliability.total_orders} />
              </div>
            </div>

            {/* ── Certifications ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div style={{ background: "#fff", border: dash.certifications.expired > 0 ? "1px solid #f5c6cb" : "1px solid #ebe7df", borderRadius: 12, padding: "20px" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23", margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 }}>
                  🏅 Certifications
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: "#6a7f73" }}>Total</span>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{dash.certifications.total}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: "#c49a2a" }}>Expiring in 30 days</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#c49a2a" }}>{dash.certifications.expiring_soon}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: "#b43c3c" }}>Expired</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: dash.certifications.expired > 0 ? "#b43c3c" : "#1c2b23" }}>{dash.certifications.expired}</span>
                  </div>
                </div>
                {(dash.certifications.expired > 0 || dash.certifications.expiring_soon > 0) && (
                  <Link href="/seller/farm/profile" style={{ display: "block", marginTop: 12, fontSize: 12, fontWeight: 700, color: "#c26838", textDecoration: "none" }}>
                    Update certifications →
                  </Link>
                )}
              </div>

              <div style={{ background: "#fff", border: dash.inputs.active_withdrawal_warnings > 0 ? "1px solid #f0ddd0" : "1px solid #ebe7df", borderRadius: 12, padding: "20px" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23", margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 }}>
                  🧪 Input Tracking
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: "#6a7f73" }}>Total inputs logged</span>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{dash.inputs.total}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: "#c26838" }}>Active withdrawal warnings</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: dash.inputs.active_withdrawal_warnings > 0 ? "#c26838" : "#1c2b23" }}>
                      {dash.inputs.active_withdrawal_warnings}
                    </span>
                  </div>
                </div>
                <Link href="/seller/farm/inputs" style={{ display: "block", marginTop: 12, fontSize: 12, fontWeight: 700, color: "#2d4a3e", textDecoration: "none" }}>
                  View input log →
                </Link>
              </div>
            </div>

            {/* ── Price Benchmark ── */}
            {priceBenchmark.length > 0 && (
              <div style={{ background: "#fff", border: "1px solid #ebe7df", borderRadius: 12, padding: "20px" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
                  💰 Price Benchmark
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {priceBenchmark.map((b, idx) => (
                    <div key={b.crop} style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px 100px 120px", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: idx < priceBenchmark.length - 1 ? "1px solid #f0ece6" : "none" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23" }}>{b.crop}</span>
                      <div>
                        <p style={{ fontSize: 9, fontWeight: 700, color: "#8a9e92", textTransform: "uppercase", letterSpacing: ".06em", margin: "0 0 1px" }}>Your Avg</p>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23", margin: 0 }}>
                          {b.your_avg_price !== null ? `$${b.your_avg_price}` : "—"}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: 9, fontWeight: 700, color: "#8a9e92", textTransform: "uppercase", letterSpacing: ".06em", margin: "0 0 1px" }}>Market Avg</p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#6a7f73", margin: 0 }}>
                          {b.market_avg !== null ? `$${b.market_avg}` : "—"}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: 9, fontWeight: 700, color: "#8a9e92", textTransform: "uppercase", letterSpacing: ".06em", margin: "0 0 1px" }}>Range</p>
                        <p style={{ fontSize: 11, color: "#6a7f73", margin: 0 }}>
                          {b.market_min !== null ? `$${b.market_min}–$${b.market_max}` : "—"}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <PricePill position={b.position} />
                        {b.sample_size > 0 && (
                          <p style={{ fontSize: 9, color: "#b0c0b6", margin: "3px 0 0", textAlign: "right" }}>{b.sample_size} sellers</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </main>
    </div>
  );
}
