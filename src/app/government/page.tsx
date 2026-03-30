"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ArrowPathIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchVendors,
  selectVendors,
  selectVendorsStatus,
  selectVendorStats,
} from "@/store/slices/governmentVendorsSlice";
import {
  fetchPrograms,
  selectPrograms,
  selectProgramsStatus,
  selectProgramStats,
} from "@/store/slices/governmentProgramsSlice";
import { selectAuthUser } from "@/store/slices/authSlice";
import {
  GOV,
  govCard,
  govStatusPillStyle,
  govStatusLabel,
  govHoverBg,
} from "./styles";

/* ── tiny inline helpers ──────────────────────────────────────────────────── */

const lbl: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: GOV.muted, textTransform: "uppercase", letterSpacing: ".07em" };
const val: React.CSSProperties = { fontSize: 20, fontWeight: 800, color: GOV.text, letterSpacing: "-.3px", lineHeight: 1, marginTop: 6 };
const sub: React.CSSProperties = { fontSize: 10.5, color: GOV.lightMuted, marginTop: 4 };
const hdr: React.CSSProperties = { fontSize: 12, fontWeight: 800, color: GOV.text, margin: 0 };
const lnk: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: GOV.accent, textDecoration: "none" };
const kpiIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke={GOV.accent} strokeWidth="1.75" strokeLinecap="round" width={16} height={16}>
    <path d="M18 20V10M12 20V4M6 20v-6" />
  </svg>
);

export default function GovernmentPage() {
  const dispatch = useAppDispatch();
  const vendors = useAppSelector(selectVendors);
  const vendorsStatus = useAppSelector(selectVendorsStatus);
  const vendorStats = useAppSelector(selectVendorStats);
  const programs = useAppSelector(selectPrograms);
  const programsStatus = useAppSelector(selectProgramsStatus);
  const programStats = useAppSelector(selectProgramStats);
  const authUser = useAppSelector(selectAuthUser);

  const firstName = (
    authUser?.fullname?.trim() || authUser?.email?.split("@")[0] || "Admin"
  ).split(" ")[0];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

  useEffect(() => { if (vendorsStatus === "idle") dispatch(fetchVendors({ page: 1, limit: 100 })); }, [vendorsStatus, dispatch]);
  useEffect(() => { if (programsStatus === "idle") dispatch(fetchPrograms({ page: 1, limit: 20 })); }, [programsStatus, dispatch]);

  const activeCrops = useMemo(() => {
    const s = new Set<string>();
    vendors.forEach((v) => { if (Array.isArray(v.crops)) v.crops.forEach((c) => s.add(c)); });
    return s.size;
  }, [vendors]);

  const availableAcreage = useMemo(() => vendorStats ? vendorStats.totalAcreage - vendorStats.utilizedAcreage : 0, [vendorStats]);
  const loading = vendorsStatus === "loading" || programsStatus === "loading";
  const v = (n: string | number) => loading ? "…" : String(n);
  const alertCount = (vendorStats?.warning || 0) + (vendorStats?.alert || 0);

  const topPrograms = useMemo(() => {
    if (programs.length === 0) return [
      { name: "Irrigation Support", participants: 234, budget: "85%", status: "active" },
      { name: "Organic Certification", participants: 156, budget: "62%", status: "active" },
      { name: "Youth Farmer Initiative", participants: 89, budget: "45%", status: "active" },
    ];
    return programs.filter((p) => p.status === "active").sort((a, b) => b.participants - a.participants).slice(0, 3)
      .map((p) => ({ name: p.name, participants: p.participants, budget: `${p.budget_percentage}%`, status: p.status }));
  }, [programs]);

  const handleRefresh = () => { dispatch(fetchVendors({ page: 1, limit: 100 })); dispatch(fetchPrograms({ page: 1, limit: 20 })); };

  /* shared card with tighter radius */
  const card: React.CSSProperties = { ...govCard, borderRadius: 10 };

  return (
    <div style={{ background: GOV.bg, color: GOV.text }}>
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "20px 20px 48px" }}>

        {/* ── Header row ─────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <span style={{ fontSize: 11, color: GOV.muted }}>Good {greeting},</span>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: GOV.text, margin: "2px 0 0", letterSpacing: "-.2px" }}>
              {firstName}
            </h1>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            style={{
              display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 12px",
              background: GOV.cardBg, border: `1px solid ${GOV.border}`, borderRadius: 999,
              fontSize: 11, fontWeight: 600, color: GOV.text, cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1, fontFamily: "inherit",
            }}
          >
            <ArrowPathIcon style={{ width: 12, height: 12, animation: loading ? "_spin .8s linear infinite" : "none" }} />
            Refresh
          </button>
        </div>

        {/* ── 6-col KPI row ──────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, marginBottom: 12 }}>
          {[
            { l: "Vendors", v: v(vendorStats?.total || 0) },
            { l: "Acreage", v: v((vendorStats?.totalAcreage || 0).toLocaleString()) },
            { l: "Available", v: v(availableAcreage.toLocaleString()) },
            { l: "Crops", v: v(activeCrops) },
            { l: "Programs", v: v(programStats?.active || 0) },
            { l: "Alerts", v: v(alertCount), warn: alertCount > 0 },
          ].map((k) => (
            <div
              key={k.l}
              style={{
                ...card,
                padding: "12px 14px",
                background: k.warn ? "rgba(212,120,60,.04)" : GOV.cardBg,
                borderColor: k.warn ? "rgba(212,120,60,.25)" : GOV.border,
              }}
            >
              <div style={lbl}>{k.l}</div>
              <div style={{ ...val, color: k.warn ? GOV.accent : GOV.text }}>{k.v}</div>
            </div>
          ))}
        </div>

        {/* ── Body: 2 cols ───────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 10, alignItems: "start" }}>

          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

            {/* Recent Activity */}
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px 8px" }}>
                <h2 style={hdr}>Recent Activity</h2>
                <Link href="/government/notifications" style={lnk}>View all →</Link>
              </div>
              {recentActivity.map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 8,
                    padding: "8px 14px",
                    background: a.urgent ? "rgba(212,120,60,.03)" : "transparent",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => { if (!a.urgent) e.currentTarget.style.background = govHoverBg; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = a.urgent ? "rgba(212,120,60,.03)" : "transparent"; }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: 99, marginTop: 5, flexShrink: 0, background: a.urgent ? GOV.accent : GOV.brand }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: GOV.text, lineHeight: 1.4 }}>{a.message}</div>
                    <div style={{ fontSize: 10, color: GOV.lightMuted, marginTop: 1 }}>{a.time}</div>
                  </div>
                </div>
              ))}
              <div style={{ height: 4 }} />
            </div>

            {/* Chart */}
            <div style={{ ...card, padding: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                  <h2 style={hdr}>Supply vs Demand</h2>
                  <div style={{ fontSize: 10.5, color: GOV.muted, marginTop: 1 }}>kg per week</div>
                </div>
                <Link href="/government/market" style={lnk}>Details →</Link>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginBottom: 8 }}>
                {[{ c: GOV.brand, l: "Supply" }, { c: GOV.accent, l: "Demand" }].map((x) => (
                  <div key={x.l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: x.c }} />
                    <span style={{ fontSize: 10, color: GOV.muted }}>{x.l}</span>
                  </div>
                ))}
              </div>
              <div style={{ height: 180 }}>
                <svg viewBox="0 0 800 300" style={{ width: "100%", height: "100%" }}>
                  <line x1="60" y1="240" x2="780" y2="240" stroke="#ebe7df" strokeWidth="1" />
                  {[0, 60, 120, 180].map((y) => (
                    <line key={y} x1="60" y1={y} x2="780" y2={y} stroke="#f4f1ec" strokeWidth="1" strokeDasharray="3" />
                  ))}
                  {["0", "2.5k", "5k", "7.5k", "10k"].map((l, i) => (
                    <text key={i} x="52" y={245 - i * 60} textAnchor="end" fontSize="9" fill={GOV.muted}>{l}</text>
                  ))}
                  {[
                    { x: 90, s: 168, d: 144, l: "Tomatoes" },
                    { x: 210, s: 120, d: 96, l: "Lettuce" },
                    { x: 330, s: 96, d: 120, l: "Carrots" },
                    { x: 450, s: 72, d: 48, l: "Peppers" },
                    { x: 570, s: 144, d: 132, l: "Cucumbers" },
                    { x: 690, s: 60, d: 36, l: "Cabbage" },
                  ].map((g) => (
                    <g key={g.l}>
                      <rect x={g.x} y={240 - g.s} width="30" height={g.s} fill={GOV.brand} rx="3" />
                      <rect x={g.x + 34} y={240 - g.d} width="30" height={g.d} fill={GOV.accent} rx="3" />
                      <text x={g.x + 32} y="268" textAnchor="middle" fontSize="9.5" fill={GOV.muted}>{g.l}</text>
                    </g>
                  ))}
                </svg>
              </div>
              <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[
                  { l: "Top Supply", v: "Tomatoes 7k" },
                  { l: "Top Demand", v: "Tomatoes 6k" },
                  { l: "Gap", v: "+1k surplus", c: GOV.brand },
                ].map((s) => (
                  <div key={s.l}>
                    <div style={{ fontSize: 10, color: GOV.muted }}>{s.l}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: s.c || GOV.text, marginTop: 2 }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

            {/* Quick Actions */}
            <div style={card}>
              <div style={{ padding: "12px 14px 6px" }}>
                <h2 style={hdr}>Quick Actions</h2>
              </div>
              <div style={{ padding: "0 10px 10px" }}>
                {[
                  { label: "Register Vendor", href: "/government/vendors/new", primary: true },
                  { label: "Upload Product", href: "/government/products/upload" },
                  { label: "Generate Report", href: "/government/reporting" },
                  { label: "View Compliance", href: "/government/compliance" },
                ].map((a) => (
                  <Link
                    key={a.label}
                    href={a.href}
                    style={{
                      display: "flex", alignItems: "center", gap: 7, padding: "7px 6px",
                      borderRadius: 6, fontSize: 12, fontWeight: 600, color: GOV.text, textDecoration: "none",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = govHoverBg)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <span style={{
                      width: 24, height: 24, borderRadius: 6,
                      background: a.primary ? GOV.accent : "rgba(45,74,62,.05)",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke={a.primary ? "#fff" : GOV.accent} strokeWidth="2.5" width={11} height={11}>
                        <path d="M5 12h14M12 5v14" />
                      </svg>
                    </span>
                    {a.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Programs */}
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px 6px" }}>
                <h2 style={hdr}>Programs</h2>
                <Link href="/government/programs" style={lnk}>All →</Link>
              </div>
              <div style={{ padding: "0 10px 10px" }}>
                {topPrograms.map((p) => (
                  <div key={p.name} style={{ padding: "7px 4px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: GOV.text }}>{p.name}</span>
                      <span style={{ ...govStatusPillStyle(p.status), fontSize: 9, padding: "1px 6px" }}>{govStatusLabel(p.status)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: GOV.muted, marginTop: 3 }}>
                      <span>{p.participants} enrolled</span>
                      <span>{p.budget} used</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reports */}
            <div style={card}>
              <div style={{ padding: "12px 14px 6px" }}>
                <h2 style={hdr}>Reports</h2>
              </div>
              <div style={{ padding: "0 8px 8px" }}>
                {[
                  { l: "Market Requirements", h: "/government/reporting?type=market-requirements" },
                  { l: "Quarterly Sales", h: "/government/reporting?type=quarterly-sales" },
                  { l: "Available Acreage", h: "/government/reporting?type=available-acreage" },
                  { l: "Vendor Performance", h: "/government/reporting?type=vendor-performance" },
                ].map((r) => (
                  <Link
                    key={r.l}
                    href={r.h}
                    style={{
                      display: "flex", alignItems: "center", gap: 6, padding: "6px 6px",
                      borderRadius: 5, fontSize: 12, fontWeight: 500, color: GOV.text, textDecoration: "none",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = govHoverBg)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <DocumentTextIcon style={{ width: 13, height: 13, color: GOV.muted, flexShrink: 0 }} />
                    {r.l}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Static data ──────────────────────────────────────────────────────────── */

const recentActivity = [
  { message: "New vendor registered: Green Valley Farms", time: "2h ago", urgent: false },
  { message: "Harvest completed: 500kg Tomatoes – Sunrise Farm", time: "5h ago", urgent: false },
  { message: "Compliance alert: Chemical usage report overdue", time: "1d ago", urgent: true },
  { message: "15 vendors enrolled in Irrigation Support Program", time: "2d ago", urgent: false },
  { message: "Market demand spike: Organic Lettuce", time: "3d ago", urgent: false },
];
