"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchCropSeasons,
  upsertCropSeason,
  deleteCropSeason,
  type CreateCropSeasonPayload,
} from "@/store/slices/farmSlice";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

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

function CalendarBar({
  startMonth,
  endMonth,
  color,
}: {
  startMonth: number;
  endMonth: number;
  color: string;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(12,1fr)", gap: 2 }}>
      {MONTHS.map((_, i) => {
        const m = i + 1;
        // Handle wrap-around seasons (e.g. Nov–Feb)
        const active =
          startMonth <= endMonth
            ? m >= startMonth && m <= endMonth
            : m >= startMonth || m <= endMonth;
        return (
          <div
            key={m}
            title={MONTHS[i]}
            style={{
              height: 10,
              borderRadius: 3,
              background: active ? color : "#f0ece6",
            }}
          />
        );
      })}
    </div>
  );
}

export default function CropSeasonsPage() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const { cropSeasons, loading } = useAppSelector((s) => s.farm);

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState<CreateCropSeasonPayload>({
    crop: "",
    harvest_month_start: 1,
    harvest_month_end: 3,
  });

  useEffect(() => {
    if (!accessToken) return;
    dispatch(fetchCropSeasons(accessToken));
  }, [accessToken, dispatch]);

  const set = (k: keyof CreateCropSeasonPayload, v: string | number | undefined) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.crop.trim()) { setFormError("Crop name is required."); return; }
    setSaving(true);
    try {
      await dispatch(upsertCropSeason({ accessToken: accessToken!, payload: form })).unwrap();
      setShowForm(false);
      setForm({ crop: "", harvest_month_start: 1, harvest_month_end: 3 });
    } catch (err: any) {
      setFormError(typeof err === "string" ? err : "Failed to save season.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("Remove this crop season?")) return;
    dispatch(deleteCropSeason({ accessToken: accessToken!, seasonId: id }));
  };

  // Colour palette for crops
  const CROP_COLORS = ["#2d4a3e","#407178","#c26838","#3d5a99","#653011","#2e7d4f","#8b5cf6","#0369a1"];
  const colorFor = (idx: number) => CROP_COLORS[idx % CROP_COLORS.length];

  // Current month indicator
  const nowMonth = new Date().getMonth() + 1;

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
            <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.3px", margin: "0 0 4px" }}>Seasonal Calendar</h1>
            <p style={{ fontSize: 13, color: "#6a7f73", margin: 0 }}>Map your harvest windows across the year</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{ padding: "9px 18px", background: "#2d4a3e", border: "none", borderRadius: 999, fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", ...FF }}>
            + Add Crop
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <div style={{ background: "#fff", border: "1px solid #ebe7df", borderRadius: 10, padding: "20px", marginBottom: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23", margin: "0 0 16px" }}>New Crop Season</p>
            {formError && <div style={{ marginBottom: 14, padding: "10px 14px", background: "#fdf2f2", border: "1px solid #f5c6cb", borderRadius: 8, fontSize: 13, color: "#b43c3c" }}>{formError}</div>}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelSt}>Crop *</label>
                  <input value={form.crop} onChange={(e) => set("crop", e.target.value)} required placeholder="Plantain" style={inputSt} />
                </div>
                <div>
                  <label style={labelSt}>Variety</label>
                  <input value={form.variety ?? ""} onChange={(e) => set("variety", e.target.value || undefined)} placeholder="Dwarf Cavendish" style={inputSt} />
                </div>
              </div>

              <div>
                <p style={{ ...labelSt, marginBottom: 10 }}>Harvest Window *</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={labelSt}>From Month</label>
                    <select value={form.harvest_month_start} onChange={(e) => set("harvest_month_start", Number(e.target.value))} style={{ ...inputSt, cursor: "pointer" }}>
                      {MONTHS.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelSt}>To Month</label>
                    <select value={form.harvest_month_end} onChange={(e) => set("harvest_month_end", Number(e.target.value))} style={{ ...inputSt, cursor: "pointer" }}>
                      {MONTHS.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <p style={{ ...labelSt, marginBottom: 10 }}>Planting Window (optional)</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={labelSt}>From Month</label>
                    <select value={form.plant_month_start ?? ""} onChange={(e) => set("plant_month_start", e.target.value ? Number(e.target.value) : undefined)} style={{ ...inputSt, cursor: "pointer" }}>
                      <option value="">—</option>
                      {MONTHS.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelSt}>To Month</label>
                    <select value={form.plant_month_end ?? ""} onChange={(e) => set("plant_month_end", e.target.value ? Number(e.target.value) : undefined)} style={{ ...inputSt, cursor: "pointer" }}>
                      <option value="">—</option>
                      {MONTHS.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelSt}>Typical Yield (kg/acre)</label>
                  <input type="number" min={0} value={form.typical_yield_kg_per_acre ?? ""} onChange={(e) => set("typical_yield_kg_per_acre", e.target.value ? Number(e.target.value) : undefined)} placeholder="4000" style={inputSt} />
                </div>
                <div>
                  <label style={labelSt}>Notes</label>
                  <input value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value || undefined)} placeholder="Best in dry season" style={inputSt} />
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button type="submit" disabled={saving} style={{ flex: 1, padding: "11px 20px", background: saving ? "#d8d2c8" : "#2d4a3e", border: "none", borderRadius: 999, fontSize: 13, fontWeight: 700, color: "#fff", cursor: saving ? "not-allowed" : "pointer", ...FF }}>
                  {saving ? "Saving…" : "Save Season"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: "11px 20px", border: "1px solid #e8e4dc", background: "#f5f1ea", borderRadius: 999, fontSize: 13, fontWeight: 700, color: "#1c2b23", cursor: "pointer", ...FF }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Month header bar */}
        {cropSeasons.length > 0 && (
          <div style={{ background: "#fff", border: "1px solid #ebe7df", borderRadius: 10, padding: "20px", marginBottom: 12 }}>
            {/* Month labels */}
            <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 12, marginBottom: 4 }}>
              <div />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(12,1fr)", gap: 2 }}>
                {MONTHS.map((m, i) => (
                  <div key={m} style={{ textAlign: "center", fontSize: 9, fontWeight: 700, color: i + 1 === nowMonth ? "#c26838" : "#8a9e92", textTransform: "uppercase", letterSpacing: ".04em" }}>
                    {m}
                  </div>
                ))}
              </div>
            </div>

            {/* Current month indicator */}
            <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 12, marginBottom: 16 }}>
              <div />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(12,1fr)", gap: 2 }}>
                {MONTHS.map((_, i) => (
                  <div key={i} style={{ height: 3, borderRadius: 2, background: i + 1 === nowMonth ? "#c26838" : "transparent" }} />
                ))}
              </div>
            </div>

            {/* Crop rows */}
            {loading.seasons ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[1, 2, 3].map((i) => <div key={i} style={{ height: 36, background: "#f5f1ea", borderRadius: 8, animation: "pulse 1.5s infinite" }} />)}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {cropSeasons.map((season, idx) => (
                  <div key={season.id}>
                    {/* Harvest bar */}
                    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 12, alignItems: "center", marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minWidth: 0 }}>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 12, fontWeight: 700, color: "#1c2b23", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {season.crop}{season.variety ? ` (${season.variety})` : ""}
                          </p>
                          {season.typical_yield_kg_per_acre && (
                            <p style={{ fontSize: 10, color: "#8a9e92", margin: 0 }}>{season.typical_yield_kg_per_acre.toLocaleString()} kg/ac</p>
                          )}
                        </div>
                        <button onClick={() => handleDelete(season.id)} style={{ fontSize: 10, color: "#b43c3c", background: "none", border: "none", cursor: "pointer", padding: "2px 6px", ...FF, flexShrink: 0, marginLeft: 4 }}>✕</button>
                      </div>
                      <div>
                        <div style={{ fontSize: 9, color: "#8a9e92", marginBottom: 2 }}>HARVEST</div>
                        <CalendarBar
                          startMonth={season.harvest_month_start}
                          endMonth={season.harvest_month_end}
                          color={colorFor(idx)}
                        />
                      </div>
                    </div>

                    {/* Planting bar (if set) */}
                    {season.plant_month_start && season.plant_month_end && (
                      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 12, alignItems: "center" }}>
                        <div />
                        <div>
                          <div style={{ fontSize: 9, color: "#8a9e92", marginBottom: 2 }}>PLANTING</div>
                          <CalendarBar
                            startMonth={season.plant_month_start}
                            endMonth={season.plant_month_end}
                            color={`${colorFor(idx)}70`}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {cropSeasons.length === 0 && !loading.seasons && (
          <div style={{ textAlign: "center", padding: "48px 20px", background: "#fff", border: "1px solid #ebe7df", borderRadius: 10 }}>
            <p style={{ fontSize: 14, color: "#6a7f73", marginBottom: 12 }}>No crop seasons recorded yet.</p>
            <button onClick={() => setShowForm(true)} style={{ padding: "9px 18px", background: "#2d4a3e", border: "none", borderRadius: 999, fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", ...FF }}>
              Add Your First Crop
            </button>
          </div>
        )}

        {/* Legend */}
        {cropSeasons.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
            {cropSeasons.map((s, idx) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#6a7f73" }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: colorFor(idx), display: "block", flexShrink: 0 }} />
                {s.crop}{s.variety ? ` (${s.variety})` : ""}
              </div>
            ))}
          </div>
        )}
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
      </main>
    </div>
  );
}
