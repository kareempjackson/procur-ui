"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  MapPinIcon,
  BeakerIcon,
  ClipboardDocumentListIcon,
  PlusIcon,
  ChevronRightIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  ArrowDownTrayIcon,
  ShieldCheckIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchFarmProfile,
  fetchPlots,
  fetchHarvestLogs,
  fetchComplianceDashboard,
} from "@/store/slices/farmSlice";

const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  Platinum: { bg: "#f5f0ff", color: "#6d28d9" },
  Gold:     { bg: "#fffbeb", color: "#b45309" },
  Silver:   { bg: "#f1f5f9", color: "#475569" },
  Standard: { bg: "#f5f1ea", color: "#6a7f73" },
};

function ScoreRing({ score, size = 72 }: { score: number; size?: number }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const fill = circ * (score / 100);
  const color = score >= 80 ? "#2e7d4f" : score >= 55 ? "#c49a2a" : "#b43c3c";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f0ece6" strokeWidth={7} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={7}
        strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" />
      <text x={size/2} y={size/2 + 5} textAnchor="middle" fontSize={size * 0.22} fontWeight={800}
        fill={color} style={{ transform: `rotate(90deg) translate(-${size}px, 0)`, transformOrigin: "center", fontFamily: "'Urbanist', system-ui, sans-serif" }}>
        {score}
      </text>
    </svg>
  );
}

export default function FarmHubPage() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const { profile, plots, harvestLogs, harvestLogTotal, loading, complianceDashboard } =
    useAppSelector((s) => s.farm);

  useEffect(() => {
    if (!accessToken) return;
    dispatch(fetchFarmProfile(accessToken));
    dispatch(fetchPlots(accessToken));
    dispatch(fetchHarvestLogs({ accessToken, query: { limit: 5 } }));
    dispatch(fetchComplianceDashboard(accessToken));
  }, [accessToken, dispatch]);

  const recentLogs = harvestLogs.slice(0, 3);

  // Check certifications expiring within 30 days
  const today = new Date();
  const expiringCerts = (profile?.certifications ?? []).filter((c) => {
    if (!c.expires) return false;
    const diff =
      (new Date(c.expires).getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 30;
  });

  return (
    <div className="min-h-screen bg-[color:var(--primary-background)]">
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[color:var(--secondary-black)]">
              Farm
            </h1>
            <p className="text-sm text-[color:var(--secondary-muted-edge)] mt-0.5">
              FSMA 204 traceability &amp; farm management
            </p>
          </div>
          <Link
            href="/seller/farm/harvest-logs/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[color:var(--primary-accent2)] text-white text-sm font-medium hover:bg-[color:var(--primary-accent3)] transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            Log Harvest
          </Link>
        </div>

        {/* Cert expiry warning */}
        {expiringCerts.length > 0 && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <ExclamationTriangleIcon className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                {expiringCerts.length} certification
                {expiringCerts.length > 1 ? "s" : ""} expiring within 30 days
              </p>
              <Link
                href="/seller/farm/profile"
                className="text-xs text-amber-700 underline"
              >
                Update certifications →
              </Link>
            </div>
          </div>
        )}

        {/* Farm Profile Card */}
        <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
          <div className="flex items-start justify-between">
            <h2 className="text-base font-semibold text-[color:var(--secondary-black)]">
              Farm Profile
            </h2>
            <Link
              href="/seller/farm/profile"
              className="text-sm text-[color:var(--secondary-muted-edge)] hover:underline"
            >
              Edit
            </Link>
          </div>

          {loading.profile ? (
            <div className="mt-4 h-16 animate-pulse rounded-lg bg-gray-100" />
          ) : profile ? (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-xs text-[color:var(--secondary-muted-edge)]">
                  Location
                </p>
                <p className="mt-1 text-sm font-medium text-[color:var(--secondary-black)]">
                  {[profile.parish, profile.country].filter(Boolean).join(", ") ||
                    "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[color:var(--secondary-muted-edge)]">
                  Acreage
                </p>
                <p className="mt-1 text-sm font-medium text-[color:var(--secondary-black)]">
                  {profile.total_acreage ? `${profile.total_acreage} ac` : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[color:var(--secondary-muted-edge)]">
                  Primary Crops
                </p>
                <p className="mt-1 text-sm font-medium text-[color:var(--secondary-black)] capitalize">
                  {profile.primary_crops?.join(", ") || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[color:var(--secondary-muted-edge)]">
                  Certifications
                </p>
                <p className="mt-1 text-sm font-medium text-[color:var(--secondary-black)]">
                  {profile.certifications.length > 0
                    ? `${profile.certifications.length} active`
                    : "None"}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-sm text-[color:var(--secondary-muted-edge)]">
                No farm profile yet.{" "}
                <Link
                  href="/seller/farm/profile"
                  className="text-[color:var(--primary-accent2)] font-medium hover:underline"
                >
                  Set up your farm profile
                </Link>{" "}
                to start generating traceability records.
              </p>
            </div>
          )}
        </div>

        {/* Compliance Score Card */}
        {complianceDashboard && (
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-[color:var(--secondary-black)]">
                FSMA 204 Compliance
              </h2>
              <Link
                href="/seller/farm/compliance"
                className="text-sm text-[color:var(--secondary-muted-edge)] hover:underline"
              >
                Full report →
              </Link>
            </div>
            <div className="flex items-center gap-6">
              <ScoreRing score={complianceDashboard.compliance_score} />
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {complianceDashboard.reliability && (() => {
                    const badge = complianceDashboard.reliability.badge;
                    const bc = BADGE_COLORS[badge] ?? BADGE_COLORS.Standard;
                    return (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 999, background: bc.bg, color: bc.color }}>
                        {badge}
                      </span>
                    );
                  })()}
                  <span className="text-xs text-[color:var(--secondary-muted-edge)]">
                    {complianceDashboard.compliance_score >= 80
                      ? "On track for FSMA 204 compliance"
                      : complianceDashboard.compliance_score >= 55
                      ? "Progress needed — see full report"
                      : "Action required — critical gaps found"}
                  </span>
                </div>
                {/* Lot code coverage bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[color:var(--secondary-muted-edge)]">Lot Code Coverage</span>
                    <span className="font-medium text-[color:var(--secondary-black)]">{complianceDashboard.fsma.lot_code_coverage_pct}%</span>
                  </div>
                  <div style={{ height: 5, background: "#f0ece6", borderRadius: 4 }}>
                    <div style={{ height: "100%", borderRadius: 4, background: complianceDashboard.fsma.lot_code_coverage_pct >= 80 ? "#2e7d4f" : complianceDashboard.fsma.lot_code_coverage_pct >= 50 ? "#c49a2a" : "#b43c3c", width: `${complianceDashboard.fsma.lot_code_coverage_pct}%`, transition: "width .4s" }} />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Link href="/seller/farm/export" className="text-xs font-medium text-[color:var(--primary-accent2)] hover:underline">
                    Export FSMA CSV →
                  </Link>
                  <Link href="/seller/farm/harvest-logs" className="text-xs font-medium text-[color:var(--secondary-muted-edge)] hover:underline">
                    View harvest logs →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link
            href="/seller/farm/profile"
            className="flex items-center gap-3 rounded-xl border border-[color:var(--secondary-soft-highlight)] bg-white p-4 hover:border-[color:var(--primary-accent2)] transition-colors group"
          >
            <div className="h-10 w-10 rounded-full bg-[color:var(--secondary-muted-edge)]/10 flex items-center justify-center">
              <MapPinIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[color:var(--secondary-black)]">
                Farm Profile
              </p>
              <p className="text-xs text-[color:var(--secondary-muted-edge)] truncate">
                Location, crops, certifications
              </p>
            </div>
            <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-[color:var(--primary-accent2)]" />
          </Link>

          <Link
            href="/seller/farm/plots"
            className="flex items-center gap-3 rounded-xl border border-[color:var(--secondary-soft-highlight)] bg-white p-4 hover:border-[color:var(--primary-accent2)] transition-colors group"
          >
            <div className="h-10 w-10 rounded-full bg-[color:var(--secondary-muted-edge)]/10 flex items-center justify-center">
              <BeakerIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[color:var(--secondary-black)]">
                Plots
              </p>
              <p className="text-xs text-[color:var(--secondary-muted-edge)] truncate">
                {plots.length} field{plots.length !== 1 ? "s" : ""} defined
              </p>
            </div>
            <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-[color:var(--primary-accent2)]" />
          </Link>

          <Link
            href="/seller/farm/harvest-logs"
            className="flex items-center gap-3 rounded-xl border border-[color:var(--secondary-soft-highlight)] bg-white p-4 hover:border-[color:var(--primary-accent2)] transition-colors group"
          >
            <div className="h-10 w-10 rounded-full bg-[color:var(--secondary-muted-edge)]/10 flex items-center justify-center">
              <ClipboardDocumentListIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[color:var(--secondary-black)]">
                Harvest Logs
              </p>
              <p className="text-xs text-[color:var(--secondary-muted-edge)] truncate">
                {harvestLogTotal} log{harvestLogTotal !== 1 ? "s" : ""} total
              </p>
            </div>
            <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-[color:var(--primary-accent2)]" />
          </Link>

          <Link
            href="/seller/farm/inputs"
            className="flex items-center gap-3 rounded-xl border border-[color:var(--secondary-soft-highlight)] bg-white p-4 hover:border-[color:var(--primary-accent2)] transition-colors group"
          >
            <div className="h-10 w-10 rounded-full bg-[color:var(--secondary-muted-edge)]/10 flex items-center justify-center">
              <ArchiveBoxIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[color:var(--secondary-black)]">
                Input Log
              </p>
              <p className="text-xs text-[color:var(--secondary-muted-edge)] truncate">
                Fertilizers, pesticides &amp; withdrawals
              </p>
            </div>
            <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-[color:var(--primary-accent2)]" />
          </Link>

          <Link
            href="/seller/farm/seasons"
            className="flex items-center gap-3 rounded-xl border border-[color:var(--secondary-soft-highlight)] bg-white p-4 hover:border-[color:var(--primary-accent2)] transition-colors group"
          >
            <div className="h-10 w-10 rounded-full bg-[color:var(--secondary-muted-edge)]/10 flex items-center justify-center">
              <CalendarDaysIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[color:var(--secondary-black)]">
                Seasonal Calendar
              </p>
              <p className="text-xs text-[color:var(--secondary-muted-edge)] truncate">
                Harvest &amp; planting windows
              </p>
            </div>
            <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-[color:var(--primary-accent2)]" />
          </Link>

          <Link
            href="/seller/farm/compliance"
            className="flex items-center gap-3 rounded-xl border border-[color:var(--secondary-soft-highlight)] bg-white p-4 hover:border-[color:var(--primary-accent2)] transition-colors group"
          >
            <div className="h-10 w-10 rounded-full bg-[color:var(--secondary-muted-edge)]/10 flex items-center justify-center">
              <ShieldCheckIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[color:var(--secondary-black)]">
                Compliance
              </p>
              <p className="text-xs text-[color:var(--secondary-muted-edge)] truncate">
                FSMA 204 readiness dashboard
              </p>
            </div>
            <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-[color:var(--primary-accent2)]" />
          </Link>

          <Link
            href="/seller/farm/export"
            className="flex items-center gap-3 rounded-xl border border-[color:var(--secondary-soft-highlight)] bg-white p-4 hover:border-[color:var(--primary-accent2)] transition-colors group"
          >
            <div className="h-10 w-10 rounded-full bg-[color:var(--secondary-muted-edge)]/10 flex items-center justify-center">
              <ArrowDownTrayIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[color:var(--secondary-black)]">
                Export
              </p>
              <p className="text-xs text-[color:var(--secondary-muted-edge)] truncate">
                FDA FSMA 204 CSV &amp; reports
              </p>
            </div>
            <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-[color:var(--primary-accent2)]" />
          </Link>
        </div>

        {/* Recent Lot Codes */}
        {recentLogs.length > 0 && (
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-[color:var(--secondary-black)]">
                Recent Lot Codes
              </h2>
              <Link
                href="/seller/farm/harvest-logs"
                className="text-sm text-[color:var(--secondary-muted-edge)] hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <Link
                  key={log.id}
                  href={`/seller/farm/harvest-logs/${log.id}`}
                  className="flex items-center justify-between rounded-lg border border-[color:var(--secondary-soft-highlight)] p-3 hover:border-[color:var(--primary-accent2)] transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-[color:var(--secondary-black)] capitalize">
                      {log.crop}
                      {log.variety ? ` — ${log.variety}` : ""}
                    </p>
                    <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                      {new Date(log.harvest_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                      {log.plot ? ` · ${log.plot.name}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block font-mono text-xs bg-[color:var(--secondary-muted-edge)]/10 text-[color:var(--secondary-muted-edge)] px-2 py-1 rounded">
                      {log.lot_code}
                    </span>
                    <CheckBadgeIcon className="h-4 w-4 text-green-500" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
