"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchChainOfCustody,
  createPackingRecord,
  type CreatePackingPayload,
} from "@/store/slices/farmSlice";

// ── CTE node colours ──────────────────────────────────────────────────────────
const NODE: Record<string, { dot: string; label: string; icon: string }> = {
  harvest:   { dot: "#2d4a3e", label: "Harvest",   icon: "🌱" },
  packing:   { dot: "#c26838", label: "Packing",   icon: "📦" },
  shipping:  { dot: "#407178", label: "Shipping",  icon: "🚢" },
  receiving: { dot: "#653011", label: "Receiving", icon: "✅" },
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function CteBadge({ type }: { type: string }) {
  const n = NODE[type] ?? { dot: "#8a9e92", label: type, icon: "•" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "2px 10px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        color: n.dot,
        background: `${n.dot}14`,
        border: `1px solid ${n.dot}30`,
        fontFamily: "'Urbanist', system-ui, sans-serif",
      }}
    >
      {n.icon} {n.label} CTE
    </span>
  );
}

function InfoGrid({ items }: { items: Array<{ label: string; value: string | null | undefined }> }) {
  const visible = items.filter((i) => i.value);
  if (!visible.length) return null;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))", gap: 12, marginTop: 12 }}>
      {visible.map(({ label, value }) => (
        <div key={label}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#8a9e92", textTransform: "uppercase", letterSpacing: ".06em", margin: "0 0 2px" }}>{label}</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#1c2b23", margin: 0 }}>{value}</p>
        </div>
      ))}
    </div>
  );
}

// ── Packing record form ───────────────────────────────────────────────────────
function PackingForm({
  logId,
  onSaved,
}: {
  logId: string;
  onSaved: () => void;
}) {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const saving = useAppSelector((s) => s.farm.loading.packing);

  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState<CreatePackingPayload>({
    packing_date: today,
    packing_facility_name: "",
    packing_facility_country: "GD",
  });
  const [showOptional, setShowOptional] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof CreatePackingPayload, v: string | number | undefined) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.packing_facility_name.trim()) {
      setError("Packing facility name is required.");
      return;
    }
    try {
      await dispatch(createPackingRecord({ accessToken: accessToken!, logId, payload: form })).unwrap();
      onSaved();
    } catch (err: any) {
      setError(typeof err === "string" ? err : "Failed to save packing record.");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "9px 12px",
    border: "1px solid #e8e4dc",
    borderRadius: 8,
    fontSize: 13,
    color: "#1c2b23",
    background: "#fff",
    outline: "none",
    fontFamily: "'Urbanist', system-ui, sans-serif",
    boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    color: "#8a9e92",
    textTransform: "uppercase",
    letterSpacing: ".06em",
    marginBottom: 5,
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {error && (
        <div style={{ padding: "10px 14px", background: "#fdf2f2", border: "1px solid #f5c6cb", borderRadius: 8, fontSize: 13, color: "#b43c3c" }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>Packing Date *</label>
          <input type="date" value={form.packing_date} onChange={(e) => set("packing_date", e.target.value)} required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Country</label>
          <input value={form.packing_facility_country ?? "GD"} onChange={(e) => set("packing_facility_country", e.target.value)} maxLength={2} placeholder="GD" style={inputStyle} />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Packing Facility Name *</label>
        <input value={form.packing_facility_name} onChange={(e) => set("packing_facility_name", e.target.value)} required placeholder="e.g. Grenada Agricultural Processing Centre" style={inputStyle} />
      </div>

      <div>
        <label style={labelStyle}>Facility Address</label>
        <input value={form.packing_facility_address ?? ""} onChange={(e) => set("packing_facility_address", e.target.value)} placeholder="Street, Parish" style={inputStyle} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>Quantity Packed</label>
          <input type="number" min={0} value={form.quantity_packed ?? ""} onChange={(e) => set("quantity_packed", e.target.value ? Number(e.target.value) : undefined)} placeholder="0" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Unit</label>
          <input value={form.unit ?? ""} onChange={(e) => set("unit", e.target.value)} placeholder="kg" style={inputStyle} />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowOptional(!showOptional)}
        style={{ textAlign: "left", fontSize: 12, color: "#407178", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}
      >
        {showOptional ? "▲ Hide" : "▼ Show"} export & shipping details
      </button>

      {showOptional && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 4 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Ship To Country</label>
              <input value={form.ship_to_country ?? ""} onChange={(e) => set("ship_to_country", e.target.value)} placeholder="US" maxLength={2} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Transport Mode</label>
              <select value={form.transport_mode ?? ""} onChange={(e) => set("transport_mode", e.target.value || undefined)} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="">Select…</option>
                <option value="air">Air</option>
                <option value="sea">Sea</option>
                <option value="road">Road</option>
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Carrier Name</label>
            <input value={form.carrier_name ?? ""} onChange={(e) => set("carrier_name", e.target.value)} placeholder="Caribbean Airlines Cargo" style={inputStyle} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Bill of Lading</label>
              <input value={form.bill_of_lading ?? ""} onChange={(e) => set("bill_of_lading", e.target.value)} placeholder="BL-2026-001" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Expected Ship Date</label>
              <input type="date" value={form.expected_ship_date ?? ""} onChange={(e) => set("expected_ship_date", e.target.value)} style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Notes</label>
            <textarea value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} rows={2} placeholder="Packed in 20kg cartons, pre-cooled…" style={{ ...inputStyle, resize: "none" }} />
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        style={{ padding: "12px 24px", background: "#c26838", border: "none", borderRadius: 999, fontSize: 13, fontWeight: 700, color: "#fff", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1, fontFamily: "inherit" }}
      >
        {saving ? "Saving…" : "Save Packing Record"}
      </button>
    </form>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ChainOfCustodyPage() {
  const { logId } = useParams<{ logId: string }>();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const { chain, loading } = useAppSelector((s) => s.farm);
  const [showPackingForm, setShowPackingForm] = useState(false);

  useEffect(() => {
    if (!accessToken || !logId) return;
    dispatch(fetchChainOfCustody({ accessToken, logId }));
  }, [accessToken, logId, dispatch]);

  // Check URL hash to auto-open packing form
  useEffect(() => {
    if (window.location.hash === "#packing") setShowPackingForm(true);
  }, []);

  if (loading.chain) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--primary-background)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid #e8e4dc", borderTopColor: "#2d4a3e", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  if (!chain) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--primary-background)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, fontFamily: "'Urbanist', system-ui, sans-serif" }}>
        <p style={{ fontSize: 15, color: "#6a7f73" }}>Chain not found</p>
        <Link href={`/seller/farm/harvest-logs/${logId}`} style={{ fontSize: 13, color: "#2d4a3e", fontWeight: 700 }}>← Back to Harvest Log</Link>
      </div>
    );
  }

  const harvest = chain.harvest as any;
  const hasReceiving = !!chain.receiving;

  const steps: Array<{ type: string; done: boolean }> = [
    { type: "harvest",   done: true },
    { type: "packing",   done: chain.packing.length > 0 },
    { type: "shipping",  done: chain.shipping.length > 0 },
    { type: "receiving", done: hasReceiving },
  ];
  const lastDone = steps.map((s) => s.done).lastIndexOf(true);

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f4", fontFamily: "'Urbanist', system-ui, sans-serif", color: "#1c2b23", WebkitFontSmoothing: "antialiased" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "36px 24px 72px" }}>

        {/* Back */}
        <Link href={`/seller/farm/harvest-logs/${logId}`} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: "#2d4a3e", textDecoration: "none", marginBottom: 24 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={13} height={13}><path d="M15 18l-6-6 6-6"/></svg>
          Harvest Log
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.3px", margin: 0 }}>Chain of Custody</h1>
            <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "#407178", background: "rgba(64,113,120,.08)", border: "1px solid rgba(64,113,120,.2)", borderRadius: 6, padding: "3px 10px" }}>
              {chain.lot_code}
            </span>
          </div>
          <p style={{ fontSize: 13, color: "#8a9e92", margin: 0 }}>
            FSMA 204 Critical Tracking Events for <strong style={{ color: "#1c2b23" }}>{harvest.crop}{harvest.variety ? ` — ${harvest.variety}` : ""}</strong>
          </p>
        </div>

        {/* Progress stepper */}
        <div style={{ background: "#fff", border: "1px solid #ebe7df", borderRadius: 10, padding: "20px 28px", marginBottom: 28 }}>
          <div style={{ position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={{ position: "absolute", top: 11, left: 0, right: 0, height: 2, background: "#ebe7df", zIndex: 0 }} />
            <div style={{ position: "absolute", top: 11, left: 0, height: 2, background: "#2d4a3e", zIndex: 1, width: `${(lastDone / (steps.length - 1)) * 100}%`, transition: "width .4s" }} />
            {steps.map((step, i) => {
              const n = NODE[step.type];
              return (
                <div key={step.type} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, position: "relative", zIndex: 2 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: step.done ? n.dot : "#fff", border: `2px solid ${step.done ? n.dot : "#d8d2c8"}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}>
                    {step.done ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" width={11} height={11}><polyline points="20 6 9 17 4 12"/></svg>
                    ) : (
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#d8d2c8", display: "block" }} />
                    )}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: step.done ? "#1c2b23" : "#b0c0b6", marginTop: 8 }}>{n.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTE Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* ── Harvest CTE ── */}
          <div style={{ background: "#fff", border: "1px solid #ebe7df", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid #f0ece6", background: "#f9f7f4" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>🌱</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Harvest</p>
                  <p style={{ fontSize: 11, color: "#8a9e92", margin: 0 }}>{harvest.harvest_date ? fmtDate(harvest.harvest_date) : "—"}</p>
                </div>
              </div>
              <CteBadge type="harvest" />
            </div>
            <div style={{ padding: "16px 20px" }}>
              <InfoGrid items={[
                { label: "Crop",      value: harvest.crop },
                { label: "Variety",   value: harvest.variety },
                { label: "Quantity",  value: harvest.quantity_harvested ? `${harvest.quantity_harvested} ${harvest.unit ?? ""}` : null },
                { label: "Plot",      value: harvest.plot_name },
                { label: "Date",      value: harvest.harvest_date ? fmtDate(harvest.harvest_date) : null },
              ]} />
              {harvest.quality_notes && (
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #f0ece6" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#8a9e92", textTransform: "uppercase", letterSpacing: ".06em", margin: "0 0 4px" }}>Quality Notes</p>
                  <p style={{ fontSize: 13, color: "#1c2b23", margin: 0 }}>{harvest.quality_notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Packing CTEs ── */}
          <div style={{ background: "#fff", border: "1px solid #ebe7df", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: chain.packing.length > 0 ? "1px solid #f0ece6" : "none", background: "#f9f7f4" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>📦</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Packing</p>
                  <p style={{ fontSize: 11, color: "#8a9e92", margin: 0 }}>{chain.packing.length} record{chain.packing.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CteBadge type="packing" />
                <button
                  onClick={() => setShowPackingForm(!showPackingForm)}
                  style={{ padding: "5px 12px", background: "#c26838", border: "none", borderRadius: 999, fontSize: 11, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}
                >
                  + Add
                </button>
              </div>
            </div>

            {chain.packing.map((pr, i) => (
              <div key={pr.id} style={{ padding: "16px 20px", borderBottom: i < chain.packing.length - 1 ? "1px solid rgba(235,231,223,.4)" : "none" }}>
                <InfoGrid items={[
                  { label: "Date",     value: fmtDate(pr.packing_date) },
                  { label: "Facility", value: pr.packing_facility_name },
                  { label: "Address",  value: pr.packing_facility_address },
                  { label: "Country",  value: pr.packing_facility_country },
                  { label: "Quantity", value: pr.quantity_packed ? `${pr.quantity_packed} ${pr.unit ?? ""}` : null },
                  { label: "Ship To",  value: pr.ship_to_country },
                  { label: "Mode",     value: pr.transport_mode },
                  { label: "Carrier",  value: pr.carrier_name },
                  { label: "B/L",      value: pr.bill_of_lading },
                  { label: "Ship Date",value: pr.expected_ship_date ? fmtDate(pr.expected_ship_date) : null },
                ]} />
                {pr.notes && <p style={{ fontSize: 12, color: "#6a7f73", margin: "10px 0 0" }}>{pr.notes}</p>}
              </div>
            ))}

            {showPackingForm && (
              <div id="packing" style={{ padding: "20px", borderTop: "1px solid #f0ece6" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#8a9e92", textTransform: "uppercase", letterSpacing: ".06em", margin: "0 0 16px" }}>New Packing Record</p>
                <PackingForm logId={logId} onSaved={() => {
                  setShowPackingForm(false);
                  dispatch(fetchChainOfCustody({ accessToken: accessToken!, logId }));
                }} />
              </div>
            )}

            {chain.packing.length === 0 && !showPackingForm && (
              <div style={{ padding: "20px", textAlign: "center" }}>
                <p style={{ fontSize: 13, color: "#8a9e92", margin: "0 0 12px" }}>No packing records yet.</p>
                <button onClick={() => setShowPackingForm(true)} style={{ padding: "8px 18px", background: "#c26838", border: "none", borderRadius: 999, fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
                  Log First Packing Event
                </button>
              </div>
            )}
          </div>

          {/* ── Shipping CTEs ── */}
          <div style={{ background: "#fff", border: "1px solid #ebe7df", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: chain.shipping.length > 0 ? "1px solid #f0ece6" : "none", background: "#f9f7f4" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>🚢</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Shipping</p>
                  <p style={{ fontSize: 11, color: "#8a9e92", margin: 0 }}>{chain.shipping.length} order{chain.shipping.length !== 1 ? "s" : ""} linked</p>
                </div>
              </div>
              <CteBadge type="shipping" />
            </div>
            {chain.shipping.length === 0 ? (
              <p style={{ padding: "20px", fontSize: 13, color: "#8a9e92", margin: 0, textAlign: "center" }}>
                No orders assigned this lot code yet. Assign the lot code when accepting an order.
              </p>
            ) : (
              chain.shipping.map((s, i) => (
                <div key={s.order_item_id} style={{ padding: "16px 20px", borderBottom: i < chain.shipping.length - 1 ? "1px solid rgba(235,231,223,.4)" : "none" }}>
                  <InfoGrid items={[
                    { label: "Order",    value: s.order_number },
                    { label: "Status",   value: s.status },
                    { label: "Shipped",  value: s.shipped_at ? fmtDate(s.shipped_at) : null },
                    { label: "Tracking", value: s.tracking_number },
                    { label: "Method",   value: s.shipping_method },
                    { label: "Buyer",    value: s.buyer_name },
                    { label: "Quantity", value: String(s.quantity) },
                  ]} />
                </div>
              ))
            )}
          </div>

          {/* ── Receiving CTE ── */}
          <div style={{ background: "#fff", border: "1px solid #ebe7df", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: hasReceiving ? "1px solid #f0ece6" : "none", background: "#f9f7f4" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>✅</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Receiving</p>
                  <p style={{ fontSize: 11, color: "#8a9e92", margin: 0 }}>
                    {hasReceiving ? "Confirmed by buyer" : "Awaiting buyer confirmation"}
                  </p>
                </div>
              </div>
              <CteBadge type="receiving" />
            </div>
            {hasReceiving ? (
              <div style={{ padding: "16px 20px" }}>
                {(() => {
                  const r = chain.receiving as any;
                  return (
                    <InfoGrid items={[
                      { label: "Received Date",    value: r.received_date ? fmtDate(r.received_date) : null },
                      { label: "Facility",          value: r.receiving_facility },
                      { label: "Country",           value: r.receiving_country },
                      { label: "Overall Condition", value: r.overall_condition ? `${r.overall_condition}/5` : null },
                      { label: "Temperature",       value: r.temperature_on_arrival != null ? `${r.temperature_on_arrival}°C` : null },
                      { label: "Temp Compliant",    value: r.temperature_compliant != null ? (r.temperature_compliant ? "Yes" : "No") : null },
                      { label: "Rejection",         value: r.has_rejection ? `Yes — ${r.rejection_reason ?? ""}` : null },
                    ]} />
                  );
                })()}
              </div>
            ) : (
              <p style={{ padding: "20px", fontSize: 13, color: "#8a9e92", margin: 0, textAlign: "center" }}>
                The buyer will confirm receipt when the delivery arrives.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
