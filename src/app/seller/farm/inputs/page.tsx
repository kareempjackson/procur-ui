"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchFarmInputs,
  createFarmInput,
  deleteFarmInput,
  fetchPlots,
  type CreateFarmInputPayload,
} from "@/store/slices/farmSlice";

const INPUT_TYPES = ["fertilizer", "pesticide", "herbicide", "seed", "irrigation", "other"] as const;
const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  fertilizer: { bg: "#f0f7f4", color: "#2e7d4f" },
  pesticide:  { bg: "#fdf2f2", color: "#b43c3c" },
  herbicide:  { bg: "#fff8f4", color: "#c26838" },
  seed:       { bg: "#eff4ff", color: "#3d5a99" },
  irrigation: { bg: "#eff6ff", color: "#2d6a9f" },
  other:      { bg: "#f5f1ea", color: "#6a7f73" },
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const FF: React.CSSProperties = { fontFamily: "'Urbanist', system-ui, sans-serif" };
const inputSt: React.CSSProperties = {
  ...FF, width: "100%", padding: "9px 12px", border: "1px solid #e8e4dc",
  borderRadius: 8, fontSize: 13, color: "#1c2b23", background: "#fff",
  outline: "none", boxSizing: "border-box",
};
const labelSt: React.CSSProperties = {
  display: "block", fontSize: 11, fontWeight: 700, color: "#8a9e92",
  textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5,
};

export default function FarmInputsPage() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const { farmInputs, plots, loading } = useAppSelector((s) => s.farm);

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [form, setForm] = useState<CreateFarmInputPayload>({
    input_type: "fertilizer",
    product_name: "",
    application_date: new Date().toISOString().slice(0, 10),
    withdrawal_period_days: 0,
  });

  useEffect(() => {
    if (!accessToken) return;
    dispatch(fetchFarmInputs({ accessToken }));
    dispatch(fetchPlots(accessToken));
  }, [accessToken, dispatch]);

  const set = (k: keyof CreateFarmInputPayload, v: string | number | undefined) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.product_name.trim()) { setFormError("Product name is required."); return; }
    setSaving(true);
    try {
      await dispatch(createFarmInput({ accessToken: accessToken!, payload: form })).unwrap();
      setShowForm(false);
      setForm({ input_type: "fertilizer", product_name: "", application_date: new Date().toISOString().slice(0, 10), withdrawal_period_days: 0 });
    } catch (err: any) {
      setFormError(typeof err === "string" ? err : "Failed to save input.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this input record?")) return;
    dispatch(deleteFarmInput({ accessToken: accessToken!, inputId: id }));
  };

  const filtered = filterType === "all"
    ? farmInputs
    : farmInputs.filter((i) => i.input_type === filterType);

  const activeWarnings = farmInputs.filter((i) => i.is_within_withdrawal);

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f4", ...FF, color: "#1c2b23", WebkitFontSmoothing: "antialiased" }}>
      <main style={{ maxWidth: 860, margin: "0 auto", padding: "36px 24px 72px" }}>
        <Link href="/seller/farm" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: "#2d4a3e", textDecoration: "none", marginBottom: 24 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={13} height={13}><path d="M15 18l-6-6 6-6"/></svg>
          Farm Hub
        </Link>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.3px", margin: "0 0 4px" }}>Input Log</h1>
            <p style={{ fontSize: 13, color: "#6a7f73", margin: 0 }}>Track fertilizers, pesticides, herbicides and withdrawal periods</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ padding: "9px 18px", background: "#2d4a3e", border: "none", borderRadius: 999, fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", ...FF }}
          >
            + Log Input
          </button>
        </div>

        {/* Withdrawal warnings banner */}
        {activeWarnings.length > 0 && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 18px", background: "#fff8f4", border: "1px solid #f0ddd0", borderRadius: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#c26838", margin: "0 0 4px" }}>
                {activeWarnings.length} active withdrawal warning{activeWarnings.length > 1 ? "s" : ""}
              </p>
              <p style={{ fontSize: 12, color: "#7a5540", margin: 0 }}>
                {activeWarnings.map((w) => `${w.product_name} (safe after ${fmtDate(w.safe_to_harvest_after)})`).join(" · ")}
              </p>
            </div>
          </div>
        )}

        {/* Add form */}
        {showForm && (
          <div style={{ background: "#fff", border: "1px solid #ebe7df", borderRadius: 10, padding: "20px", marginBottom: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23", margin: "0 0 16px" }}>New Input Record</p>
            {formError && (
              <div style={{ marginBottom: 14, padding: "10px 14px", background: "#fdf2f2", border: "1px solid #f5c6cb", borderRadius: 8, fontSize: 13, color: "#b43c3c" }}>
                {formError}
              </div>
            )}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelSt}>Type *</label>
                  <select value={form.input_type} onChange={(e) => set("input_type", e.target.value)} style={{ ...inputSt, cursor: "pointer" }}>
                    {INPUT_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelSt}>Application Date *</label>
                  <input type="date" value={form.application_date} onChange={(e) => set("application_date", e.target.value)} required style={inputSt} />
                </div>
              </div>

              <div>
                <label style={labelSt}>Product Name *</label>
                <input value={form.product_name} onChange={(e) => set("product_name", e.target.value)} required placeholder="e.g. Roundup Ready" style={inputSt} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelSt}>Brand</label>
                  <input value={form.brand ?? ""} onChange={(e) => set("brand", e.target.value)} placeholder="Bayer CropScience" style={inputSt} />
                </div>
                <div>
                  <label style={labelSt}>Active Ingredient</label>
                  <input value={form.active_ingredient ?? ""} onChange={(e) => set("active_ingredient", e.target.value)} placeholder="Glyphosate 41%" style={inputSt} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelSt}>Quantity</label>
                  <input type="number" min={0} value={form.quantity ?? ""} onChange={(e) => set("quantity", e.target.value ? Number(e.target.value) : undefined)} placeholder="0" style={inputSt} />
                </div>
                <div>
                  <label style={labelSt}>Unit</label>
                  <input value={form.unit ?? ""} onChange={(e) => set("unit", e.target.value)} placeholder="liters" style={inputSt} />
                </div>
                <div>
                  <label style={labelSt}>Withdrawal Days</label>
                  <input type="number" min={0} value={form.withdrawal_period_days ?? 0} onChange={(e) => set("withdrawal_period_days", Number(e.target.value))} style={inputSt} />
                </div>
              </div>

              {plots.length > 0 && (
                <div>
                  <label style={labelSt}>Plot (optional)</label>
                  <select value={form.plot_id ?? ""} onChange={(e) => set("plot_id", e.target.value || undefined)} style={{ ...inputSt, cursor: "pointer" }}>
                    <option value="">All plots / farm-wide</option>
                    {plots.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label style={labelSt}>Notes</label>
                <textarea value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} rows={2} placeholder="Application rate, weather conditions…" style={{ ...inputSt, resize: "none" }} />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button type="submit" disabled={saving} style={{ flex: 1, padding: "11px 20px", background: saving ? "#d8d2c8" : "#2d4a3e", border: "none", borderRadius: 999, fontSize: 13, fontWeight: 700, color: "#fff", cursor: saving ? "not-allowed" : "pointer", ...FF }}>
                  {saving ? "Saving…" : "Save Input Record"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: "11px 20px", border: "1px solid #e8e4dc", background: "#f5f1ea", borderRadius: 999, fontSize: 13, fontWeight: 700, color: "#1c2b23", cursor: "pointer", ...FF }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter chips */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {["all", ...INPUT_TYPES].map((t) => (
            <button key={t} onClick={() => setFilterType(t)} style={{ padding: "5px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600, border: "1px solid", cursor: "pointer", ...FF, ...(filterType === t ? { background: "#2d4a3e", color: "#fff", borderColor: "#2d4a3e" } : { background: "#fff", color: "#6a7f73", borderColor: "#e8e4dc" }) }}>
              {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Input list */}
        {loading.inputs ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[1, 2, 3].map((i) => <div key={i} style={{ height: 72, background: "#fff", borderRadius: 10, border: "1px solid #ebe7df", animation: "pulse 1.5s infinite" }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 20px", background: "#fff", border: "1px solid #ebe7df", borderRadius: 10 }}>
            <p style={{ fontSize: 14, color: "#6a7f73", marginBottom: 12 }}>No inputs logged yet.</p>
            <button onClick={() => setShowForm(true)} style={{ padding: "9px 18px", background: "#2d4a3e", border: "none", borderRadius: 999, fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", ...FF }}>
              Log Your First Input
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map((inp) => {
              const tc = TYPE_COLORS[inp.input_type] ?? TYPE_COLORS.other;
              return (
                <div key={inp.id} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, padding: "14px 18px", background: "#fff", border: inp.is_within_withdrawal ? "1px solid #f0ddd0" : "1px solid #ebe7df", borderRadius: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 999, background: tc.bg, color: tc.color }}>
                        {inp.input_type}
                      </span>
                      {inp.is_within_withdrawal && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#c26838", background: "#fff8f4", border: "1px solid #f0ddd0", padding: "1px 7px", borderRadius: 999 }}>
                          ⚠ withdrawal active
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23", margin: "0 0 2px" }}>{inp.product_name}</p>
                    <p style={{ fontSize: 11, color: "#8a9e92", margin: 0 }}>
                      {fmtDate(inp.application_date)}
                      {inp.quantity ? ` · ${inp.quantity} ${inp.unit ?? ""}` : ""}
                      {inp.plot_name ? ` · ${inp.plot_name}` : ""}
                      {inp.withdrawal_period_days > 0 ? ` · Safe after ${fmtDate(inp.safe_to_harvest_after)}` : ""}
                    </p>
                  </div>
                  <button onClick={() => handleDelete(inp.id)} style={{ fontSize: 11, fontWeight: 600, color: "#b43c3c", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 6, ...FF, flexShrink: 0 }}>
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
      </main>
    </div>
  );
}
