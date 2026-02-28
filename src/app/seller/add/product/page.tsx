"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { getApiClient } from "@/lib/apiClient";
import { ADMIN_CATALOG_PRODUCT_CATEGORIES } from "@/lib/adminCatalogProductCategories";
import { useAppDispatch, useAppSelector } from "@/store";
import { createSellerProduct } from "@/store/slices/sellerProductsSlice";

// ── Enums ──────────────────────────────────────────────────────────────────────

enum ProductStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  INACTIVE = "inactive",
  OUT_OF_STOCK = "out_of_stock",
  DISCONTINUED = "discontinued",
}

enum ProductCondition {
  NEW = "new",
  USED = "used",
  REFURBISHED = "refurbished",
}

enum MeasurementUnit {
  KG = "kg",
  G = "g",
  LB = "lb",
  OZ = "oz",
  BAG = "bag",
  BUCKET = "bucket",
  PIECE = "piece",
  DOZEN = "dozen",
  LITER = "liter",
  ML = "ml",
  GALLON = "gallon",
}

// ── Types ──────────────────────────────────────────────────────────────────────

interface ProductImage {
  file: File;
  preview: string;
}

interface CreateProductData {
  name: string;
  description?: string;
  short_description?: string;
  sku?: string;
  category: string;
  base_price: number;
  stock_quantity?: number;
  unit_of_measurement: MeasurementUnit;
  condition?: ProductCondition;
  status?: ProductStatus;
  is_featured?: boolean;
  is_organic?: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function normalizeCategoryToAdminList(category?: string | null): string {
  const raw = typeof category === "string" ? category.trim() : "";
  if (!raw) return "";
  if (ADMIN_CATALOG_PRODUCT_CATEGORIES.includes(raw as any)) return raw;
  const legacyMap: Record<string, string> = {
    Herbs: "Herbs & Spices",
    Spices: "Herbs & Spices",
    Grains: "Grains & Cereals",
    Dairy: "Dairy & Eggs",
    Meat: "Meat & Poultry",
    "Root Crops": "Vegetables",
    Legumes: "Other",
    Beverages: "Beverages",
    Vegetables: "Vegetables",
    Fruits: "Fruits",
    Seafood: "Seafood",
    Other: "Other",
  };
  return legacyMap[raw] ?? "Other";
}

const DRAFT_KEY = "seller-product-draft";
const AUTOSAVE_MS = 30_000;

// ── Component ──────────────────────────────────────────────────────────────────

export default function AddProductPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  // ── Submit state ─────────────────────────────────────────────────────────────
  type SubmitStep = null | "creating" | "uploading" | "done";
  const [submitStep, setSubmitStep] = useState<SubmitStep>(null);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number }>({ done: 0, total: 0 });
  const [uploadWarnings, setUploadWarnings] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // ── Draft ────────────────────────────────────────────────────────────────────
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);

  // ── Form state ───────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState<CreateProductData>({
    name: "",
    category: "",
    base_price: 0,
    unit_of_measurement: MeasurementUnit.PIECE,
    stock_quantity: 0,
    condition: ProductCondition.NEW,
    status: ProductStatus.DRAFT,
    is_featured: false,
    is_organic: false,
  });

  const [images, setImages] = useState<(ProductImage | null)[]>(Array(5).fill(null));

  // ── Restore draft ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        parsed.category = normalizeCategoryToAdminList(parsed.category);
      }
      if (parsed.name || parsed.category || parsed.base_price > 0) {
        setFormData(parsed);
        setDraftRestored(true);
      }
    } catch { /* ignore */ }
  }, []);

  // ── Auto-save draft ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (submitStep !== null) return;
    if (!formData.name && !formData.category && formData.base_price === 0) return;
    const id = setInterval(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
        setLastSaved(new Date());
      } catch { /* ignore */ }
    }, AUTOSAVE_MS);
    return () => clearInterval(id);
  }, [formData, submitStep]);

  // ── Cleanup blob URLs ─────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      images.forEach((img) => { if (img?.preview) URL.revokeObjectURL(img.preview); });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setLastSaved(null);
    setDraftRestored(false);
  };

  const handleField = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((p) => ({ ...p, [name]: (e.target as HTMLInputElement).checked }));
    } else if (type === "number") {
      setFormData((p) => ({ ...p, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
      setImageError("Please upload JPG, PNG, or WebP only");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image must be under 5MB");
      return;
    }
    setImageError(null);
    setImages((prev) => {
      const next = [...prev];
      next[index] = { file, preview: URL.createObjectURL(file) };
      return next;
    });
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const next = [...prev];
      if (next[index]?.preview) URL.revokeObjectURL(next[index]!.preview);
      next[index] = null;
      return next;
    });
  };

  const uploadImageToStorage = async (productId: string, file: File, index: number): Promise<string> => {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Storage not configured");
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9_.-]/g, "_");
    const path = `products/${productId}/${Date.now()}_${index}_${safeName}`;
    const { data, error } = await supabase.storage.from("procur-img").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "application/octet-stream",
    });
    if (error) throw new Error(`Upload failed: ${error.message}`);
    const { data: pub } = supabase.storage.from("procur-img").getPublicUrl(data.path);
    return pub.publicUrl;
  };

  // ── Submit ────────────────────────────────────────────────────────────────────

  const handleSubmit = async (desiredStatus: ProductStatus) => {
    setError(null);
    setUploadWarnings([]);
    setSubmitStep("creating");

    try {
      // 1 — Create product record
      const result = await dispatch(createSellerProduct({ ...formData, status: desiredStatus }));

      if (!createSellerProduct.fulfilled.match(result)) {
        const msg = (result.payload as string) ||
          (result as any)?.error?.message ||
          "Failed to create product. Please try again.";
        throw new Error(msg);
      }

      const productId: string = result.payload.id;

      // 2 — Upload images (if any)
      const toUpload = images.filter((img): img is ProductImage => img !== null);
      if (toUpload.length > 0) {
        if (!accessToken) throw new Error("Session expired — please log in again before uploading images.");
        setSubmitStep("uploading");
        setUploadProgress({ done: 0, total: toUpload.length });

        const apiClient = getApiClient(() => accessToken);
        const warnings: string[] = [];

        await Promise.all(
          toUpload.map(async (img, i) => {
            try {
              const imageUrl = await uploadImageToStorage(productId, img.file, i);
              await apiClient.post(`/sellers/products/${productId}/images`, {
                image_url: imageUrl,
                alt_text: `${formData.name} - Image ${i + 1}`,
                display_order: i,
                is_primary: i === 0,
              });
            } catch (imgErr: any) {
              warnings.push(`Image ${i + 1} failed: ${imgErr?.message ?? "unknown error"}`);
            } finally {
              setUploadProgress((p) => ({ ...p, done: p.done + 1 }));
            }
          })
        );

        if (warnings.length > 0) setUploadWarnings(warnings);
      }

      setSubmitStep("done");
      clearDraft();

      // Brief pause so user sees "Done" before redirect
      await new Promise((r) => setTimeout(r, 600));
      router.push("/seller/products");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setSubmitStep(null);
    }
  };

  const isSubmitting = submitStep !== null && submitStep !== "done";

  // ── Shared styles ─────────────────────────────────────────────────────────────

  const card: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #ebe7df",
    borderRadius: 10,
    padding: "24px",
  };

  const labelSt: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    fontWeight: 700,
    color: "#6a7f73",
    textTransform: "uppercase",
    letterSpacing: ".05em",
    marginBottom: 7,
  };

  const inputSt: React.CSSProperties = {
    display: "block",
    width: "100%",
    padding: "10px 13px",
    border: "1px solid #ebe7df",
    borderRadius: 8,
    fontSize: 13.5,
    color: "#1c2b23",
    background: "#fff",
    fontFamily: "'Urbanist', system-ui, sans-serif",
    outline: "none",
    boxSizing: "border-box",
  };

  const submitLabel = (): string => {
    if (submitStep === "creating") return "Creating product…";
    if (submitStep === "uploading")
      return `Uploading images (${uploadProgress.done}/${uploadProgress.total})…`;
    if (submitStep === "done") return "Done!";
    return "";
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f4", fontFamily: "'Urbanist', system-ui, sans-serif", color: "#1c2b23" }}>
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 80px" }}>

        {/* Back + title */}
        <div style={{ marginBottom: 28 }}>
          <Link
            href="/seller/products"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#d4783c", textDecoration: "none", marginBottom: 16 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={14} height={14}>
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to Products
          </Link>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1c2b23", margin: 0, letterSpacing: "-.4px" }}>
                Add New Product
              </h1>
              <p style={{ fontSize: 13, color: "#8a9e92", marginTop: 5, marginBottom: 0 }}>
                Create a listing for your agricultural catalog
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {draftRestored && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 10px", background: "rgba(45,74,62,.08)", border: "1px solid rgba(45,74,62,.15)", borderRadius: 8, fontSize: 11.5, fontWeight: 700, color: "#2d4a3e" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={12} height={12}>
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Draft restored
                </span>
              )}
              {lastSaved && (
                <span style={{ fontSize: 11.5, color: "#b0c0b6" }}>
                  Saved {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div style={{ marginBottom: 20, padding: "14px 18px", background: "rgba(212,60,60,.07)", border: "1px solid rgba(212,60,60,.2)", borderRadius: 10, fontSize: 13.5, color: "#9b2020", display: "flex", alignItems: "flex-start", gap: 10 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={17} height={17} style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Upload warnings (images that partially failed) */}
        {uploadWarnings.length > 0 && (
          <div style={{ marginBottom: 20, padding: "14px 18px", background: "rgba(212,120,60,.07)", border: "1px solid rgba(212,120,60,.2)", borderRadius: 10, fontSize: 13, color: "#92400e" }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>
              Product created, but {uploadWarnings.length} image{uploadWarnings.length > 1 ? "s" : ""} failed to upload:
            </div>
            {uploadWarnings.map((w, i) => <div key={i} style={{ marginTop: 3 }}>• {w}</div>)}
            <div style={{ marginTop: 8, color: "#8a9e92", fontSize: 12 }}>
              You can add these images later from the product edit page.
            </div>
          </div>
        )}

        {/* Submitting overlay label */}
        {isSubmitting && (
          <div style={{ marginBottom: 20, padding: "14px 18px", background: "rgba(45,74,62,.06)", border: "1px solid rgba(45,74,62,.15)", borderRadius: 10, fontSize: 13.5, color: "#2d4a3e", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 16, height: 16, border: "2px solid rgba(45,74,62,.2)", borderTopColor: "#2d4a3e", borderRadius: "50%", animation: "spin .7s linear infinite", flexShrink: 0 }} />
            {submitLabel()}
          </div>
        )}

        {/* 2-col grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}>

          {/* ── LEFT: form ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Images */}
            <div style={card}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: "#1c2b23", margin: "0 0 4px" }}>Product Images</h2>
              <p style={{ fontSize: 12, color: "#8a9e92", margin: "0 0 18px" }}>
                First image is the primary. JPG, PNG, WebP · max 5MB each.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    {images[i] ? (
                      <div style={{ position: "relative" }}>
                        <img
                          src={images[i]!.preview}
                          alt={`Image ${i + 1}`}
                          style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 8, border: "1px solid #ebe7df", display: "block" }}
                        />
                        {i === 0 && (
                          <span style={{ position: "absolute", top: 5, left: 5, padding: "2px 7px", background: "#d4783c", color: "#fff", fontSize: 9.5, fontWeight: 700, borderRadius: 99, letterSpacing: ".03em" }}>
                            PRIMARY
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          style={{ position: "absolute", top: 5, right: 5, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,.55)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={10} height={10}>
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor={`img-${i}`}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", aspectRatio: "1", border: "1.5px dashed #d4c8b8", borderRadius: 8, cursor: "pointer", gap: 4, background: "#faf8f4" }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="#b0c0b6" strokeWidth="1.75" width={20} height={20}>
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                        <span style={{ fontSize: 10, color: "#b0c0b6", fontWeight: 600 }}>
                          {i === 0 ? "Primary" : `Image ${i + 1}`}
                        </span>
                        <input id={`img-${i}`} type="file" accept="image/*" onChange={(e) => handleImagePick(e, i)} style={{ display: "none" }} />
                      </label>
                    )}
                  </div>
                ))}
              </div>

              {imageError && (
                <div style={{ marginTop: 12, padding: "9px 12px", background: "rgba(212,60,60,.07)", border: "1px solid rgba(212,60,60,.18)", borderRadius: 7, fontSize: 12.5, color: "#9b2020" }}>
                  {imageError}
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div style={card}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: "#1c2b23", margin: "0 0 18px" }}>Basic Information</h2>

              <div style={{ marginBottom: 16 }}>
                <label style={labelSt}>Category *</label>
                <select name="category" required value={formData.category} onChange={handleField} style={inputSt}>
                  <option value="" disabled>Select a category</option>
                  {ADMIN_CATALOG_PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelSt}>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  maxLength={255}
                  value={formData.name}
                  onChange={handleField}
                  placeholder="e.g., Organic Roma Tomatoes"
                  style={inputSt}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelSt}>Short Description</label>
                <input
                  type="text"
                  name="short_description"
                  maxLength={500}
                  value={formData.short_description || ""}
                  onChange={handleField}
                  placeholder="Brief tagline for listings"
                  style={inputSt}
                />
              </div>

              <div>
                <label style={labelSt}>Full Description</label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description || ""}
                  onChange={handleField}
                  placeholder="Growing methods, certifications, harvest schedule, packaging details…"
                  style={{ ...inputSt, resize: "vertical" as const }}
                />
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div style={card}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: "#1c2b23", margin: "0 0 18px" }}>Pricing & Inventory</h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={labelSt}>Price per unit *</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 13.5, color: "#8a9e92", pointerEvents: "none" }}>$</span>
                    <input
                      type="number"
                      name="base_price"
                      required
                      min="0"
                      step="0.01"
                      value={formData.base_price}
                      onChange={handleField}
                      placeholder="0.00"
                      style={{ ...inputSt, paddingLeft: 26, textAlign: "right" as const }}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelSt}>Unit of Measurement *</label>
                  <select name="unit_of_measurement" required value={formData.unit_of_measurement} onChange={handleField} style={inputSt}>
                    <option value={MeasurementUnit.BAG}>Bag</option>
                    <option value={MeasurementUnit.BUCKET}>Bucket</option>
                    <option value={MeasurementUnit.PIECE}>Piece</option>
                    <option value={MeasurementUnit.DOZEN}>Dozen</option>
                    <option value={MeasurementUnit.KG}>Kilogram (kg)</option>
                    <option value={MeasurementUnit.G}>Gram (g)</option>
                    <option value={MeasurementUnit.LB}>Pound (lb)</option>
                    <option value={MeasurementUnit.OZ}>Ounce (oz)</option>
                    <option value={MeasurementUnit.LITER}>Liter</option>
                    <option value={MeasurementUnit.ML}>Milliliter (ml)</option>
                    <option value={MeasurementUnit.GALLON}>Gallon</option>
                  </select>
                </div>

                <div>
                  <label style={labelSt}>Stock Quantity</label>
                  <input
                    type="number"
                    name="stock_quantity"
                    min="0"
                    value={formData.stock_quantity}
                    onChange={handleField}
                    placeholder="0"
                    style={inputSt}
                  />
                </div>
              </div>

              <p style={{ fontSize: 11.5, color: "#b0c0b6", marginTop: 12, marginBottom: 0 }}>
                Price displayed to buyers is per selected unit of measurement.
              </p>
            </div>

            {/* Attributes */}
            <div style={card}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: "#1c2b23", margin: "0 0 16px" }}>Product Attributes</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { name: "is_featured", label: "Featured Product", desc: "Show this product in featured sections" },
                  { name: "is_organic", label: "Organic Product", desc: "Certified or naturally grown without synthetic inputs" },
                ].map(({ name, label, desc }) => (
                  <label key={name} style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                    <div style={{ position: "relative", flexShrink: 0, marginTop: 2 }}>
                      <input
                        type="checkbox"
                        name={name}
                        checked={(formData as any)[name]}
                        onChange={handleField}
                        style={{ width: 16, height: 16, accentColor: "#2d4a3e", cursor: "pointer" }}
                      />
                    </div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1c2b23" }}>{label}</div>
                      <div style={{ fontSize: 12, color: "#8a9e92", marginTop: 2 }}>{desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", paddingTop: 4 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                  style={{
                    padding: "9px 18px",
                    border: "1px solid #ebe7df",
                    borderRadius: 999,
                    background: "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#1c2b23",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    opacity: isSubmitting ? 0.5 : 1,
                  }}
                >
                  Cancel
                </button>

                {(formData.name || formData.category || formData.base_price > 0) && (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      if (!confirm("Clear this draft? This cannot be undone.")) return;
                      setFormData({
                        name: "", category: "", base_price: 0,
                        unit_of_measurement: MeasurementUnit.PIECE,
                        stock_quantity: 0, condition: ProductCondition.NEW,
                        status: ProductStatus.DRAFT, is_featured: false, is_organic: false,
                      });
                      setImages(Array(5).fill(null));
                      clearDraft();
                    }}
                    style={{
                      padding: "9px 18px",
                      border: "1px solid #ebe7df",
                      borderRadius: 999,
                      background: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#9b2020",
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      fontFamily: "inherit",
                      opacity: isSubmitting ? 0.5 : 1,
                    }}
                  >
                    Clear Draft
                  </button>
                )}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmit(ProductStatus.DRAFT)}
                  style={{
                    padding: "9px 18px",
                    border: "1px solid #ebe7df",
                    borderRadius: 999,
                    background: "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#1c2b23",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    opacity: isSubmitting ? 0.5 : 1,
                  }}
                >
                  Save as Draft
                </button>

                <button
                  type="button"
                  disabled={isSubmitting || !formData.name || !formData.category || formData.base_price <= 0}
                  onClick={() => handleSubmit(ProductStatus.ACTIVE)}
                  style={{
                    padding: "9px 22px",
                    border: "none",
                    borderRadius: 999,
                    background:
                      isSubmitting || !formData.name || !formData.category || formData.base_price <= 0
                        ? "#f0ece4"
                        : "#d4783c",
                    fontSize: 13,
                    fontWeight: 700,
                    color:
                      isSubmitting || !formData.name || !formData.category || formData.base_price <= 0
                        ? "#b0c0b6"
                        : "#fff",
                    cursor:
                      isSubmitting || !formData.name || !formData.category || formData.base_price <= 0
                        ? "not-allowed"
                        : "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {isSubmitting ? submitLabel() : "Publish Product"}
                </button>
              </div>
            </div>
          </div>

          {/* ── RIGHT: live preview ── */}
          <div style={{ position: "sticky", top: 72 }}>
            <div style={card}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: "#8a9e92", textTransform: "uppercase", letterSpacing: ".06em", margin: "0 0 16px" }}>
                Live Preview
              </h3>

              {/* Card preview */}
              <div style={{ border: "1px solid #ebe7df", borderRadius: 10, overflow: "hidden" }}>
                {/* Image */}
                <div style={{ aspectRatio: "1", background: "#f5f2ec", position: "relative" }}>
                  {images[0] ? (
                    <img src={images[0].preview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#d4c8b8" strokeWidth="1.5" width={36} height={36}>
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18M9 21V9" />
                      </svg>
                    </div>
                  )}

                  {images.filter(Boolean).length > 1 && (
                    <span style={{ position: "absolute", bottom: 8, right: 8, padding: "3px 8px", background: "rgba(0,0,0,.5)", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 99 }}>
                      +{images.filter(Boolean).length - 1}
                    </span>
                  )}

                  <div style={{ position: "absolute", top: 8, left: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                    {formData.is_featured && (
                      <span style={{ padding: "2px 7px", background: "#d4783c", color: "#fff", fontSize: 9.5, fontWeight: 700, borderRadius: 99 }}>FEATURED</span>
                    )}
                    {formData.is_organic && (
                      <span style={{ padding: "2px 7px", background: "#2d4a3e", color: "#f5f1ea", fontSize: 9.5, fontWeight: 700, borderRadius: 99 }}>ORGANIC</span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: "14px 14px 16px" }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1c2b23", marginBottom: 4 }}>
                    {formData.name || <span style={{ color: "#b0c0b6" }}>Product name</span>}
                  </div>
                  {formData.short_description && (
                    <div style={{ fontSize: 12, color: "#8a9e92", marginBottom: 8, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>
                      {formData.short_description}
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontSize: 16, fontWeight: 800, color: "#1c2b23" }}>
                        ${formData.base_price > 0 ? formData.base_price.toFixed(2) : "0.00"}
                      </span>
                      <span style={{ fontSize: 11, color: "#8a9e92", marginLeft: 4 }}>/ {formData.unit_of_measurement}</span>
                    </div>
                    <span style={{
                      padding: "2px 8px",
                      borderRadius: 99,
                      fontSize: 10.5,
                      fontWeight: 700,
                      background: (formData.stock_quantity ?? 0) > 0 ? "rgba(45,74,62,.10)" : "rgba(212,60,60,.10)",
                      color: (formData.stock_quantity ?? 0) > 0 ? "#2d4a3e" : "#9b2020",
                    }}>
                      {(formData.stock_quantity ?? 0) > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                  {formData.category && (
                    <div style={{ fontSize: 11, color: "#b0c0b6", marginTop: 8 }}>{formData.category}</div>
                  )}
                </div>
              </div>

              {/* Status note */}
              <div style={{ marginTop: 14, padding: "11px 14px", background: "#faf8f4", borderRadius: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "#8a9e92" }}>
                  <span>Status</span>
                  <span style={{ fontWeight: 700, color: "#1c2b23", textTransform: "capitalize" }}>{formData.status ?? "draft"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "#8a9e92", marginTop: 6 }}>
                  <span>Stock</span>
                  <span style={{ fontWeight: 700, color: "#1c2b23" }}>{formData.stock_quantity ?? 0} {formData.unit_of_measurement}</span>
                </div>
              </div>

              <p style={{ fontSize: 11, color: "#b0c0b6", textAlign: "center", marginTop: 12, marginBottom: 0 }}>
                This is how buyers will see your product
              </p>
            </div>
          </div>
        </div>
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
