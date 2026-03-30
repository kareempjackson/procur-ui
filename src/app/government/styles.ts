import type React from "react";

/* ── Government dashboard design tokens (matches seller palette) ──────────── */

export const GOV = {
  bg: "#faf8f4",
  cardBg: "#fff",
  border: "#ebe7df",
  text: "#1c2b23",
  textSecondary: "#6a7f73",
  muted: "#8a9e92",
  lightMuted: "#b0c0b6",
  accent: "#d4783c",
  accentHover: "#b86230",
  brand: "#2d4a3e",
  brandLight: "#f5f1ea",
  danger: "#991b1b",
  dangerBg: "#fee2e2",
  warning: "#92400e",
  warningBg: "#fef3c7",
  success: "#065f46",
  successBg: "#d1fae5",
  info: "#1e40af",
  infoBg: "#dbeafe",
} as const;

/* ── Reusable style objects ───────────────────────────────────────────────── */

export const govCard: React.CSSProperties = {
  background: GOV.cardBg,
  border: `1px solid ${GOV.border}`,
  borderRadius: 10,
};

export const govCardPadded: React.CSSProperties = {
  ...govCard,
  padding: "18px 20px",
};

export const govSectionHeader: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 800,
  color: GOV.text,
  margin: 0,
};

export const govViewAllLink: React.CSSProperties = {
  fontSize: 11.5,
  fontWeight: 600,
  color: GOV.accent,
  textDecoration: "none",
};

export const govKpiLabel: React.CSSProperties = {
  fontSize: 10.5,
  fontWeight: 700,
  color: GOV.muted,
  textTransform: "uppercase",
  letterSpacing: ".06em",
};

export const govKpiValue: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 800,
  color: GOV.text,
  letterSpacing: "-.4px",
  lineHeight: 1,
};

export const govKpiSub: React.CSSProperties = {
  fontSize: 11,
  color: GOV.lightMuted,
  marginTop: 5,
  fontWeight: 500,
};

export const govPageTitle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 800,
  color: GOV.text,
  margin: 0,
  letterSpacing: "-.3px",
};

export const govPageSubtitle: React.CSSProperties = {
  fontSize: 13,
  color: GOV.textSecondary,
  fontWeight: 500,
  marginTop: 4,
};

export const govGreeting: React.CSSProperties = {
  fontSize: 12,
  color: GOV.muted,
  fontWeight: 500,
  marginBottom: 4,
};

export const govPillButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  padding: "7px 14px",
  background: GOV.cardBg,
  border: `1px solid ${GOV.border}`,
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
  color: GOV.text,
  textDecoration: "none",
  cursor: "pointer",
  fontFamily: "inherit",
};

export const govPrimaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  padding: "7px 14px",
  background: GOV.accent,
  border: "none",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
  color: "#fff",
  textDecoration: "none",
  cursor: "pointer",
  fontFamily: "inherit",
};

export const govBrandButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  padding: "7px 14px",
  background: GOV.brand,
  border: "none",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
  color: GOV.brandLight,
  textDecoration: "none",
  cursor: "pointer",
  fontFamily: "inherit",
};

/* ── Status pill ──────────────────────────────────────────────────────────── */

export const STATUS_META: Record<
  string,
  { label: string; bg: string; color: string }
> = {
  compliant: { label: "Compliant", bg: GOV.successBg, color: GOV.success },
  active: { label: "Active", bg: GOV.successBg, color: GOV.success },
  completed: { label: "Completed", bg: GOV.successBg, color: GOV.success },
  approved: { label: "Approved", bg: GOV.successBg, color: GOV.success },
  warning: { label: "Warning", bg: GOV.warningBg, color: GOV.warning },
  pending: { label: "Pending", bg: GOV.warningBg, color: GOV.warning },
  pending_review: {
    label: "Pending Review",
    bg: GOV.warningBg,
    color: GOV.warning,
  },
  expiring_soon: {
    label: "Expiring Soon",
    bg: GOV.warningBg,
    color: GOV.warning,
  },
  alert: { label: "Alert", bg: GOV.dangerBg, color: GOV.danger },
  non_compliant: {
    label: "Non-Compliant",
    bg: GOV.dangerBg,
    color: GOV.danger,
  },
  critical: { label: "Critical", bg: GOV.dangerBg, color: GOV.danger },
  overdue: { label: "Overdue", bg: GOV.dangerBg, color: GOV.danger },
  cancelled: { label: "Cancelled", bg: GOV.dangerBg, color: GOV.danger },
  in_progress: { label: "In Progress", bg: GOV.infoBg, color: GOV.info },
  scheduled: { label: "Scheduled", bg: GOV.infoBg, color: GOV.info },
  planning: { label: "Planning", bg: GOV.warningBg, color: GOV.warning },
  draft: { label: "Draft", bg: "#f5f1ea", color: GOV.muted },
  inactive: { label: "Inactive", bg: "#f5f1ea", color: GOV.muted },
};

export const govStatusPillStyle = (status: string): React.CSSProperties => {
  const s = STATUS_META[status?.toLowerCase()] ?? {
    label: status,
    bg: "#f5f1ea",
    color: GOV.muted,
  };
  return {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 99,
    fontSize: 10.5,
    fontWeight: 700,
    background: s.bg,
    color: s.color,
    whiteSpace: "nowrap",
    textTransform: "capitalize",
  };
};

export const govStatusLabel = (status: string): string => {
  return (
    STATUS_META[status?.toLowerCase()]?.label ??
    status?.replace(/_/g, " ") ??
    "Unknown"
  );
};

/* ── Hover helper (for onMouseEnter / onMouseLeave) ───────────────────────── */
export const govHoverBg = GOV.bg;
