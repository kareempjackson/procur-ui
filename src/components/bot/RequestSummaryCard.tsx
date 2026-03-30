"use client";

import type { RequestDraft } from "@/hooks/useBotConversation";

interface RequestSummaryCardProps {
  draft: RequestDraft;
}

export default function RequestSummaryCard({ draft }: RequestSummaryCardProps) {
  const rows: { label: string; value: string }[] = [];

  if (draft.guest_name) rows.push({ label: "Name", value: draft.guest_name });
  if (draft.guest_email) rows.push({ label: "Email", value: draft.guest_email });
  rows.push({ label: "Product", value: draft.product_name });
  rows.push({ label: "Quantity", value: `${draft.quantity} ${draft.unit_of_measurement}` });
  if (draft.date_needed) rows.push({ label: "Needed by", value: draft.date_needed });
  if (draft.budget_min != null && draft.budget_max != null) {
    rows.push({
      label: "Budget",
      value:
        draft.budget_min === draft.budget_max
          ? `$${draft.budget_min}`
          : `$${draft.budget_min} – $${draft.budget_max}`,
    });
  }
  if (draft.description) rows.push({ label: "Details", value: draft.description });

  return (
    <div
      style={{
        background: "#faf8f4",
        border: "1px solid #e5e2da",
        borderRadius: 14,
        padding: "14px 16px",
        fontSize: 13,
        fontFamily: "'Urbanist', system-ui, sans-serif",
        lineHeight: 1.5,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 12,
          color: "#407178",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 10,
        }}
      >
        Request Summary
      </div>
      {rows.map((row) => (
        <div
          key={row.label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "4px 0",
            borderBottom: "1px solid #f0eee9",
          }}
        >
          <span style={{ color: "#6b7280", fontWeight: 500 }}>{row.label}</span>
          <span style={{ color: "#1f2937", fontWeight: 600, textAlign: "right", maxWidth: "60%" }}>
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}
