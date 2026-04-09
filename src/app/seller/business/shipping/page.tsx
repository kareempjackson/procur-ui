"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchActiveCountries, selectCountry, selectCountries } from "@/store/slices/countrySlice";
import { getApiClient } from "@/lib/apiClient";
import { useToast } from "@/components/ui/Toast";

function CountryFlag({ code, size = 20 }: { code: string; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
      srcSet={`https://flagcdn.com/w80/${code.toLowerCase()}.png 2x`}
      alt={code}
      width={size}
      height={Math.round(size * 0.75)}
      style={{ borderRadius: 2, objectFit: "cover", display: "block" }}
    />
  );
}

function getClient() {
  return getApiClient(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("auth");
      if (!raw) return null;
      return (JSON.parse(raw) as { accessToken?: string }).accessToken ?? null;
    } catch { return null; }
  });
}

interface ShippingRoute {
  id: string;
  origin_country: string;
  dest_country: string;
  shipping_fee: number;
  currency: string;
  est_days_min: number;
  est_days_max: number;
  notes?: string;
  is_active: boolean;
}

export default function ShippingRoutesPage() {
  const dispatch = useAppDispatch();
  const { show } = useToast();
  const { code: myCountry } = useAppSelector(selectCountry);
  const countries = useAppSelector(selectCountries);

  const [routes, setRoutes] = useState<ShippingRoute[]>([]);
  const [loading, setLoading] = useState(true);

  // Add form
  const [showAdd, setShowAdd] = useState(false);
  const [destCountry, setDestCountry] = useState("");
  const [fee, setFee] = useState("");
  const [daysMin, setDaysMin] = useState("3");
  const [daysMax, setDaysMax] = useState("7");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // Documents
  interface ShippingDoc {
    id: string;
    name: string;
    doc_type: string;
    file_url: string;
    created_at: string;
  }
  const [docs, setDocs] = useState<ShippingDoc[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = { current: null as HTMLInputElement | null };

  useEffect(() => { dispatch(fetchActiveCountries()); }, [dispatch]);

  const fetchDocs = async () => {
    try {
      const client = getClient();
      const { data } = await client.get("/sellers/shipping-documents");
      setDocs(data.documents || []);
    } catch { /* ignore */ }
  };

  const uploadDoc = async (file: File) => {
    const client = getClient();
    // 1. Get signed upload URL
    const { data: urlData } = await client.post("/sellers/shipping-documents/upload-url", {
      filename: file.name,
    });
    // 2. Upload file to Supabase storage
    await fetch(urlData.signedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file,
    });
    // 3. Save document record
    const { data: doc } = await client.post("/sellers/shipping-documents", {
      name: file.name,
      doc_type: "shipping",
      file_url: urlData.publicUrl,
      file_path: urlData.path,
      file_size: file.size,
      mime_type: file.type,
    });
    return doc as ShippingDoc;
  };

  const handleDeleteDoc = async (docId: string) => {
    try {
      const client = getClient();
      await client.delete(`/sellers/shipping-documents/${docId}`);
      setDocs((prev) => prev.filter((d) => d.id !== docId));
      show({ variant: "success", title: "Deleted", message: "Document removed" });
    } catch {
      show({ variant: "error", title: "Error", message: "Failed to delete document" });
    }
  };

  const fetchRoutes = async () => {
    try {
      const client = getClient();
      const { data } = await client.get("/sellers/shipping-routes");
      setRoutes(data.routes || []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchRoutes(); fetchDocs(); }, []);

  const handleAdd = async () => {
    if (!destCountry || !fee) { show({ variant: "error", title: "Missing fields", message: "Select a destination and enter a fee" }); return; }
    setSaving(true);
    try {
      const client = getClient();
      await client.post("/sellers/shipping-routes", {
        dest_country: destCountry,
        shipping_fee: parseFloat(fee),
        est_days_min: parseInt(daysMin) || 3,
        est_days_max: parseInt(daysMax) || 7,
        notes: notes || undefined,
      });
      show({ variant: "success", title: "Route added", message: "Shipping route added" });
      setShowAdd(false);
      setDestCountry("");
      setFee("");
      setNotes("");
      fetchRoutes();
    } catch {
      show({ variant: "error", title: "Error", message: "Failed to add route" });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this shipping route?")) return;
    try {
      const client = getClient();
      await client.delete(`/sellers/shipping-routes/${id}`);
      show({ variant: "success", title: "Removed", message: "Shipping route removed" });
      setRoutes((r) => r.filter((x) => x.id !== id));
    } catch {
      show({ variant: "error", title: "Error", message: "Failed to remove route" });
    }
  };

  const otherCountries = countries.filter((c) => c.code !== myCountry && !routes.some((r) => r.dest_country === c.code));

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px 64px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Link href="/seller/business" style={{ fontSize: 12, color: "#8a9e92", textDecoration: "none" }}>
          &larr; Business Settings
        </Link>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1c2b23", margin: "8px 0 4px", letterSpacing: "-0.02em" }}>
          Cross-Country Shipping
        </h1>
        <p style={{ fontSize: 13.5, color: "#8a9e92", lineHeight: 1.5, margin: 0 }}>
          Set shipping rates for countries you deliver to. Products from your country can be listed in these markets.
        </p>
      </div>

      {/* Routes list */}
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "#8a9e92", fontSize: 13 }}>Loading...</div>
      ) : routes.length === 0 && !showAdd ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ width: 56, height: 56, borderRadius: 999, background: "rgba(45,74,62,.06)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#8a9e92" strokeWidth="1.5" width={26} height={26}>
              <path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1c2b23", margin: "0 0 6px" }}>No shipping routes yet</h3>
          <p style={{ fontSize: 13, color: "#8a9e92", margin: "0 0 20px", lineHeight: 1.5 }}>
            Add routes to ship your products to buyers in other countries.
          </p>
          <button
            onClick={() => setShowAdd(true)}
            style={{ padding: "10px 24px", borderRadius: 12, border: "none", background: "#2d4a3e", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            + Add Shipping Route
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {routes.map((route) => {
              const dest = countries.find((c) => c.code === route.dest_country);
              return (
                <div
                  key={route.id}
                  style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderRadius: 14, background: "#f5f1ea", border: "1px solid #ebe7df" }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(45,74,62,.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                    {dest ? <CountryFlag code={dest.country_code} size={28} /> : <span style={{ fontSize: 20 }}>🌎</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 650, color: "#1c2b23" }}>{dest?.name || route.dest_country}</div>
                    <div style={{ fontSize: 12, color: "#8a9e92", marginTop: 2 }}>
                      {route.est_days_min}–{route.est_days_max} days
                      {route.notes && <span> · {route.notes}</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#2d4a3e" }}>
                      ${route.shipping_fee.toFixed(2)}
                    </div>
                    <div style={{ fontSize: 10, color: "#8a9e92" }}>{route.currency}</div>
                  </div>
                  <button
                    onClick={() => handleDelete(route.id)}
                    style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "rgba(220,38,38,.06)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.5" width={16} height={16}>
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          {!showAdd && (
            <button
              onClick={() => setShowAdd(true)}
              style={{ marginTop: 16, padding: "10px 20px", borderRadius: 12, border: "1.5px dashed rgba(45,74,62,.2)", background: "transparent", color: "#2d4a3e", fontSize: 13, fontWeight: 600, cursor: "pointer", width: "100%" }}
            >
              + Add Another Route
            </button>
          )}
        </>
      )}

      {/* Add route form */}
      {showAdd && (
        <div style={{ marginTop: 20, padding: 24, borderRadius: 16, background: "#fff", border: "1px solid #ebe7df" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1c2b23", margin: "0 0 16px" }}>New Shipping Route</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#8a9e92", display: "block", marginBottom: 4 }}>Destination Country</label>
              <select
                value={destCountry}
                onChange={(e) => setDestCountry(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 10, border: "1px solid #e8e4dc", fontSize: 13, background: "#fff", outline: "none" }}
              >
                <option value="">Select country...</option>
                {otherCountries.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#8a9e92", display: "block", marginBottom: 4 }}>Shipping Fee</label>
              <input
                type="number"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                style={{ width: "100%", padding: "9px 12px", borderRadius: 10, border: "1px solid #e8e4dc", fontSize: 13, outline: "none" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#8a9e92", display: "block", marginBottom: 4 }}>Min Days</label>
              <input
                type="number"
                value={daysMin}
                onChange={(e) => setDaysMin(e.target.value)}
                min="1"
                style={{ width: "100%", padding: "9px 12px", borderRadius: 10, border: "1px solid #e8e4dc", fontSize: 13, outline: "none" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#8a9e92", display: "block", marginBottom: 4 }}>Max Days</label>
              <input
                type="number"
                value={daysMax}
                onChange={(e) => setDaysMax(e.target.value)}
                min="1"
                style={{ width: "100%", padding: "9px 12px", borderRadius: 10, border: "1px solid #e8e4dc", fontSize: 13, outline: "none" }}
              />
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#8a9e92", display: "block", marginBottom: 4 }}>Notes (optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Ships Tuesdays and Fridays"
              style={{ width: "100%", padding: "9px 12px", borderRadius: 10, border: "1px solid #e8e4dc", fontSize: 13, outline: "none" }}
            />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button
              onClick={handleAdd}
              disabled={saving}
              style={{ padding: "10px 24px", borderRadius: 12, border: "none", background: "#2d4a3e", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: saving ? 0.5 : 1 }}
            >
              {saving ? "Saving..." : "Add Route"}
            </button>
            <button
              onClick={() => setShowAdd(false)}
              style={{ padding: "10px 20px", borderRadius: 12, border: "1px solid #e8e4dc", background: "#fff", color: "#1c2b23", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Shipping Documentation ── */}
      <div style={{ marginTop: 48 }}>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1c2b23", margin: "0 0 4px", letterSpacing: "-0.01em" }}>
            Shipping Documentation
          </h2>
          <p style={{ fontSize: 13, color: "#8a9e92", lineHeight: 1.5, margin: 0 }}>
            Upload export permits, phytosanitary certificates, customs forms, and other documents required for cross-country trade.
          </p>
        </div>

        {/* Upload area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: "2px dashed rgba(45,74,62,.15)",
            borderRadius: 14,
            padding: "32px 20px",
            textAlign: "center",
            cursor: "pointer",
            transition: "all .2s",
            background: "transparent",
            marginBottom: 16,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#2d4a3e"; e.currentTarget.style.background = "rgba(45,74,62,.02)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(45,74,62,.15)"; e.currentTarget.style.background = "transparent"; }}
        >
          <input
            ref={(el) => { fileInputRef.current = el; }}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
            multiple
            style={{ display: "none" }}
            onChange={async (e) => {
              const files = e.target.files;
              if (!files || files.length === 0) return;
              setUploading(true);
              let uploaded = 0;
              for (const file of Array.from(files)) {
                try {
                  const doc = await uploadDoc(file);
                  setDocs((prev) => [doc, ...prev]);
                  uploaded++;
                } catch {
                  show({ variant: "error", title: "Upload failed", message: `Failed to upload ${file.name}` });
                }
              }
              setUploading(false);
              if (uploaded > 0) {
                show({ variant: "success", title: "Uploaded", message: `${uploaded} document${uploaded > 1 ? "s" : ""} added` });
              }
              e.target.value = "";
            }}
          />
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(45,74,62,.06)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#2d4a3e" strokeWidth="1.5" strokeLinecap="round" width={22} height={22}>
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1c2b23", marginBottom: 4 }}>
            {uploading ? "Uploading..." : "Click to upload documents"}
          </div>
          <div style={{ fontSize: 12, color: "#8a9e92" }}>
            PDF, PNG, JPG, DOC — up to 10MB each
          </div>
        </div>

        {/* Document types guide */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[
            { path: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01", title: "Phytosanitary Certificate", desc: "Required for plant & produce exports" },
            { path: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8", title: "Export Permit", desc: "Government authorization to export" },
            { path: "M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3", title: "Customs Declaration", desc: "Goods declaration for cross-border trade" },
            { path: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", title: "Quality Certificate", desc: "Product quality & safety compliance" },
          ].map((doc) => (
            <div
              key={doc.title}
              style={{ padding: "14px 16px", borderRadius: 12, background: "#f5f1ea", display: "flex", gap: 12, alignItems: "flex-start" }}
            >
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(45,74,62,.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#2d4a3e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
                  <path d={doc.path} />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 650, color: "#1c2b23", lineHeight: 1.2 }}>{doc.title}</div>
                <div style={{ fontSize: 11, color: "#8a9e92", marginTop: 3, lineHeight: 1.4 }}>{doc.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Uploaded documents list */}
        {docs.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {docs.map((doc) => (
              <div
                key={doc.id}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 12, background: "#fff", border: "1px solid #ebe7df" }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(45,74,62,.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#2d4a3e" strokeWidth="1.5" width={18} height={18}>
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1c2b23", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.name}</div>
                  <div style={{ fontSize: 11, color: "#8a9e92", marginTop: 2 }}>
                    Uploaded {new Date(doc.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteDoc(doc.id)}
                  style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: "rgba(220,38,38,.06)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.5" width={14} height={14}>
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
