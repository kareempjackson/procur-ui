"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store";
import {
  deleteSellerProduct,
  fetchSellerProducts,
  updateSellerProduct,
} from "@/store/slices/sellerProductsSlice";
import ProcurLoader from "@/components/ProcurLoader";
import { useToast } from "@/components/ui/Toast";

// ── Enums ──────────────────────────────────────────────────────────────────────

enum ProductStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  INACTIVE = "inactive",
  OUT_OF_STOCK = "out_of_stock",
  DISCONTINUED = "discontinued",
}

// ── Types ──────────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  sku?: string;
  category: string;
  base_price: number;
  sale_price?: number;
  currency: string;
  stock_quantity: number;
  min_stock_level?: number;
  unit_of_measurement: string;
  status: ProductStatus | string;
  is_featured: boolean;
  is_organic: boolean;
  is_local?: boolean;
  created_at: string;
  updated_at: string;
  images?: Array<{
    id: string;
    image_url: string;
    alt_text?: string;
    is_primary: boolean;
    display_order: number;
  }>;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const STATUS_META: Record<string, { label: string; bg: string; color: string }> = {
  active:       { label: "Active",       bg: "rgba(45,74,62,.12)",  color: "#1a4035" },
  draft:        { label: "Draft",        bg: "rgba(0,0,0,.06)",     color: "#6a7f73" },
  inactive:     { label: "Inactive",     bg: "rgba(212,120,60,.12)", color: "#c26838" },
  out_of_stock: { label: "Out of Stock", bg: "rgba(212,60,60,.10)", color: "#9b2020" },
  discontinued: { label: "Discontinued", bg: "rgba(0,0,0,.08)",     color: "#6a7f73" },
};

const DEBOUNCE_MS = 350;

// ── Helpers ────────────────────────────────────────────────────────────────────

function getPrimaryImage(product: Product): string | undefined {
  return (
    product.images?.find((i) => i.is_primary)?.image_url ||
    product.images?.[0]?.image_url
  );
}

function fmt(price: number): string {
  return price.toFixed(2);
}

// ── Shared styles ──────────────────────────────────────────────────────────────

const F = "'Urbanist', system-ui, sans-serif";

const inputSt: React.CSSProperties = {
  border: "1px solid #ebe7df",
  borderRadius: 8,
  padding: "7px 11px",
  fontSize: 13,
  outline: "none",
  background: "#fff",
  color: "#1c2b23",
  fontFamily: F,
  boxSizing: "border-box" as const,
  width: "100%",
};

const pill = (bg: string, color: string): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "2px 8px",
  borderRadius: 999,
  fontSize: 10.5,
  fontWeight: 700,
  background: bg,
  color,
  whiteSpace: "nowrap" as const,
  textTransform: "uppercase" as const,
  letterSpacing: ".03em",
});

// ── Component ──────────────────────────────────────────────────────────────────

export default function SellerProductsPage() {
  const dispatch = useAppDispatch();
  const { show } = useToast();

  const {
    items: products,
    total,
    status: loadStatus,
    error,
    deletingIds,
  } = useSelector((state: RootState) => state.sellerProducts);

  const [currentPage, setCurrentPage] = useState(1);
  const LIMIT = 12;
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filters
  const [draftSearch, setDraftSearch] = useState(""); // debounce source
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [sortKey, setSortKey] = useState("created_at-desc");

  // Debounce search input
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearchChange = (val: string) => {
    setDraftSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(val);
      setCurrentPage(1);
    }, DEBOUNCE_MS);
  };
  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  // Derived sort params
  const [sortBy, sortOrder] = sortKey.split("-") as [string, "asc" | "desc"];
  const apiSortBy = sortBy === "base_price" ? "price" : sortBy;

  // Fetch whenever filter/page changes
  useEffect(() => {
    dispatch(
      fetchSellerProducts({
        page: currentPage,
        limit: LIMIT,
        search: search || undefined,
        category: category || undefined,
        status: status || undefined,
        sort_by: apiSortBy,
        sort_order: sortOrder,
      })
    );
  }, [dispatch, currentPage, search, category, status, apiSortBy, sortOrder]);

  const totalPages = Math.ceil((total || 0) / LIMIT);

  // ── Delete ──────────────────────────────────────────────────────────────────

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Delete "${productName}"? This cannot be undone.`)) return;
    const result = await dispatch(deleteSellerProduct(productId));
    if (deleteSellerProduct.rejected.match(result)) {
      const msg = (result.payload as string) || "Failed to delete product";
      const isFk =
        msg.includes("foreign key") ||
        msg.includes("order_items") ||
        msg.toLowerCase().includes("violates foreign key");
      if (isFk) {
        if (confirm(`"${productName}" has existing orders and can't be deleted. Mark as Discontinued instead?`)) {
          const upd = await dispatch(updateSellerProduct({ id: productId, update: { status: "discontinued" } }));
          if (updateSellerProduct.fulfilled.match(upd)) {
            show("Product marked as discontinued");
          } else {
            show((upd.payload as string) || "Failed to mark discontinued");
          }
        }
      } else {
        show(msg);
      }
    } else {
      show(`"${productName}" deleted`);
    }
  };

  // ── Status change (list view) ───────────────────────────────────────────────

  const handleStatusChange = async (productId: string, newStatus: string) => {
    const result = await dispatch(updateSellerProduct({ id: productId, update: { status: newStatus } }));
    if (updateSellerProduct.fulfilled.match(result)) {
      show("Status updated");
    } else {
      show((result.payload as string) || "Failed to update status");
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  const isLoading = loadStatus === "loading";
  const hasProducts = products.length > 0;

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f4", fontFamily: F, color: "#1c2b23" }}>
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 20px 80px" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1c2b23", margin: 0, letterSpacing: "-.3px" }}>Products</h1>
            <p style={{ fontSize: 13, color: "#8a9e92", marginTop: 4, marginBottom: 0 }}>
              {total != null ? `${total} product${total !== 1 ? "s" : ""} in your catalog` : "Manage your product catalog"}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* View toggle */}
            <div style={{ display: "flex", background: "#fff", border: "1px solid #ebe7df", borderRadius: 8, padding: 3, gap: 2 }}>
              {(["grid", "list"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} view`}
                  style={{ padding: "5px 8px", borderRadius: 6, border: "none", cursor: "pointer", background: viewMode === mode ? "#2d4a3e" : "none", color: viewMode === mode ? "#fff" : "#6a7f73", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  {mode === "grid"
                    ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={14} height={14}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
                    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={14} height={14}><path d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                  }
                </button>
              ))}
            </div>
            <Link
              href="/seller/add/product"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 18px", background: "#d4783c", color: "#fff", borderRadius: 999, textDecoration: "none", fontSize: 13, fontWeight: 700 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={12} height={12}><path d="M12 5v14M5 12h14" /></svg>
              Add Product
            </Link>
          </div>
        </div>

        {/* ── Filter bar ── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 200px", minWidth: 180 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#b0c0b6" strokeWidth="2" width={14} height={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={draftSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search products…"
              style={{ ...inputSt, paddingLeft: 32 }}
            />
          </div>

          {/* Category */}
          <select value={category} onChange={(e) => { setCategory(e.target.value); setCurrentPage(1); }} style={{ ...inputSt, width: "auto", flex: "0 0 auto" }}>
            <option value="">All Categories</option>
            {["Fruits", "Vegetables", "Herbs & Spices", "Grains & Cereals", "Dairy & Eggs", "Meat & Poultry", "Seafood", "Bakery", "Beverages", "Other"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Status */}
          <select value={status} onChange={(e) => { setStatus(e.target.value); setCurrentPage(1); }} style={{ ...inputSt, width: "auto", flex: "0 0 auto" }}>
            <option value="">All Status</option>
            {Object.values(ProductStatus).map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
            ))}
          </select>

          {/* Sort */}
          <select value={sortKey} onChange={(e) => { setSortKey(e.target.value); setCurrentPage(1); }} style={{ ...inputSt, width: "auto", flex: "0 0 auto" }}>
            <option value="created_at-desc">Newest</option>
            <option value="created_at-asc">Oldest</option>
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
            <option value="base_price-asc">Price ↑</option>
            <option value="base_price-desc">Price ↓</option>
            <option value="stock_quantity-desc">Stock ↓</option>
          </select>

          {/* Clear filters */}
          {(draftSearch || category || status || sortKey !== "created_at-desc") && (
            <button
              onClick={() => { setDraftSearch(""); setSearch(""); setCategory(""); setStatus(""); setSortKey("created_at-desc"); setCurrentPage(1); }}
              style={{ padding: "7px 13px", border: "1px solid #ebe7df", borderRadius: 8, background: "#fff", fontSize: 12, fontWeight: 600, color: "#8a9e92", cursor: "pointer", fontFamily: F, whiteSpace: "nowrap" }}
            >
              Clear
            </button>
          )}
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{ background: "rgba(212,60,60,.07)", border: "1px solid rgba(212,60,60,.2)", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#9b2020" }}>
            {error}
          </div>
        )}

        {/* ── Loading ── */}
        {isLoading && !hasProducts && <ProcurLoader size="lg" text="Loading products…" />}

        {/* ── Empty ── */}
        {!isLoading && !error && !hasProducts && (
          <div style={{ background: "#fff", border: "1px solid #ebe7df", borderRadius: 10, padding: "52px 24px", textAlign: "center" }}>
            <div style={{ width: 52, height: 52, background: "#f4f1eb", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#8a9e92" strokeWidth="1.5" width={26} height={26}>
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1c2b23", marginBottom: 6 }}>
              {search || category || status ? "No products match your filters" : "No products yet"}
            </div>
            <div style={{ fontSize: 13, color: "#8a9e92", marginBottom: 22 }}>
              {search || category || status ? "Try adjusting your search or filters" : "Add your first product to start selling"}
            </div>
            {!search && !category && !status && (
              <Link href="/seller/add/product" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 22px", background: "#d4783c", color: "#fff", borderRadius: 999, textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={12} height={12}><path d="M12 5v14M5 12h14" /></svg>
                Add First Product
              </Link>
            )}
          </div>
        )}

        {/* ── Grid view ── */}
        {!isLoading && !error && hasProducts && viewMode === "grid" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(196px, 1fr))", gap: 14 }}>
            {products.map((product) => {
              const img = getPrimaryImage(product);
              const sm = STATUS_META[product.status as string] ?? STATUS_META.draft;
              const hasDiscount = product.sale_price != null && product.sale_price < product.base_price;
              const stock = product.stock_quantity;
              const low = (product as any).min_stock_level ?? 5;
              const stockDot = stock === 0 ? "#d04040" : stock <= low ? "#d97706" : "#2d7a46";
              const isDeleting = !!deletingIds[product.id];

              return (
                <div
                  key={product.id}
                  style={{ background: "#fff", border: "1px solid #ebe7df", borderRadius: 10, overflow: "hidden", opacity: isDeleting ? 0.5 : 1, transition: "border-color .15s, opacity .15s" }}
                  onMouseEnter={(e) => { if (!isDeleting) e.currentTarget.style.borderColor = "#d4c8b8"; }}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#ebe7df")}
                >
                  {/* Image */}
                  <div style={{ position: "relative", aspectRatio: "1", background: "#f4f1eb", overflow: "hidden" }}>
                    {img
                      ? <img src={img} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="#c4bfb5" strokeWidth="1.5" width={36} height={36}><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                    }

                    {/* Status pill — top-left (only if not active) */}
                    {product.status !== ProductStatus.ACTIVE && (
                      <span style={{ position: "absolute", top: 7, left: 7, ...pill(sm.bg, sm.color), fontSize: 9.5 }}>
                        {sm.label}
                      </span>
                    )}

                    {/* Discount badge — top-right */}
                    {hasDiscount && (
                      <span style={{ position: "absolute", top: 7, right: 7, ...pill("rgba(212,120,60,.92)", "#fff"), fontSize: 9.5 }}>
                        {Math.round(((product.base_price - (product.sale_price ?? 0)) / product.base_price) * 100)}% OFF
                      </span>
                    )}

                    {/* Attribute dots — bottom-right */}
                    {(product.is_featured || product.is_organic) && (
                      <div style={{ position: "absolute", bottom: 7, right: 7, display: "flex", gap: 3 }}>
                        {product.is_featured && (
                          <span title="Featured" style={{ width: 18, height: 18, borderRadius: "50%", background: "#f0b32c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontWeight: 700 }}>★</span>
                        )}
                        {product.is_organic && (
                          <span title="Organic" style={{ width: 18, height: 18, borderRadius: "50%", background: "#2d7a46", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", fontWeight: 700 }}>ORG</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: "11px 12px 12px" }}>
                    <Link
                      href={`/seller/products/${product.id}/edit`}
                      style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23", textDecoration: "none", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 3 }}
                    >
                      {product.name}
                    </Link>

                    <div style={{ fontSize: 11, color: "#8a9e92", marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {product.category}{product.sku ? ` · ${product.sku}` : ""}
                    </div>

                    {/* Price + stock row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                        {hasDiscount ? (
                          <>
                            <span style={{ fontSize: 15, fontWeight: 800, color: "#d4783c" }}>${fmt(product.sale_price!)}</span>
                            <span style={{ fontSize: 11, color: "#b0b8b4", textDecoration: "line-through" }}>${fmt(product.base_price)}</span>
                          </>
                        ) : (
                          <span style={{ fontSize: 15, fontWeight: 800, color: "#1c2b23" }}>${fmt(product.base_price)}</span>
                        )}
                        <span style={{ fontSize: 11, color: "#8a9e92" }}>/{product.unit_of_measurement}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: stockDot, flexShrink: 0 }} />
                        <span style={{ fontSize: 11, color: "#6a7f73", fontWeight: 500 }}>{stock}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 36px", gap: 5 }}>
                      <Link
                        href={`/seller/products/${product.id}/edit`}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "6px 0", background: "#2d4a3e", color: "#fff", borderRadius: 7, textDecoration: "none", fontSize: 12, fontWeight: 700 }}
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/seller/products/${product.id}/preview`}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "6px 0", background: "#f4f1eb", color: "#1c2b23", borderRadius: 7, textDecoration: "none", fontSize: 12, fontWeight: 600 }}
                      >
                        Preview
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={isDeleting}
                        title="Delete product"
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#fff0f0", border: "1px solid #ffd0d0", borderRadius: 7, cursor: isDeleting ? "not-allowed" : "pointer" }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="#d04040" strokeWidth="2" width={13} height={13}><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── List view ── */}
        {!isLoading && !error && hasProducts && viewMode === "list" && (
          <div style={{ background: "#fff", border: "1px solid #ebe7df", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#faf8f4", borderBottom: "1px solid #ebe7df" }}>
                    {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "#8a9e92", textTransform: "uppercase", letterSpacing: ".05em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, i) => {
                    const img = getPrimaryImage(product);
                    const sm = STATUS_META[product.status as string] ?? STATUS_META.draft;
                    const hasDiscount = product.sale_price != null && product.sale_price < product.base_price;
                    const isDeleting = !!deletingIds[product.id];
                    return (
                      <tr key={product.id} style={{ borderBottom: i < products.length - 1 ? "1px solid #f5f2ec" : "none", opacity: isDeleting ? 0.5 : 1 }}>
                        {/* Product */}
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 42, height: 42, borderRadius: 8, background: "#f4f1eb", overflow: "hidden", flexShrink: 0 }}>
                              {img
                                ? <img src={img} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><svg viewBox="0 0 24 24" fill="none" stroke="#c4bfb5" strokeWidth="1.5" width={18} height={18}><rect x="3" y="3" width="18" height="18" rx="2" /></svg></div>
                              }
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <Link href={`/seller/products/${product.id}/edit`} style={{ fontWeight: 700, color: "#1c2b23", textDecoration: "none", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220 }}>
                                {product.name}
                              </Link>
                              {product.sku && <div style={{ fontSize: 11, color: "#8a9e92", marginTop: 2 }}>SKU: {product.sku}</div>}
                              {(product.is_featured || product.is_organic) && (
                                <div style={{ display: "flex", gap: 4, marginTop: 3 }}>
                                  {product.is_featured && <span style={{ ...pill("rgba(240,179,44,.15)", "#b48a00"), fontSize: 9.5 }}>Featured</span>}
                                  {product.is_organic && <span style={{ ...pill("rgba(45,122,70,.12)", "#1a5c35"), fontSize: 9.5 }}>Organic</span>}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        {/* Category */}
                        <td style={{ padding: "12px 16px", color: "#6a7f73", fontSize: 12.5, whiteSpace: "nowrap" }}>{product.category}</td>
                        {/* Price */}
                        <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                          {hasDiscount ? (
                            <>
                              <span style={{ fontWeight: 700, color: "#d4783c" }}>${fmt(product.sale_price!)}</span>
                              <span style={{ fontSize: 11, color: "#b0b8b4", textDecoration: "line-through", marginLeft: 5 }}>${fmt(product.base_price)}</span>
                            </>
                          ) : (
                            <span style={{ fontWeight: 700, color: "#1c2b23" }}>${fmt(product.base_price)}</span>
                          )}
                          <span style={{ fontSize: 11, color: "#8a9e92", marginLeft: 4 }}>/{product.unit_of_measurement}</span>
                        </td>
                        {/* Stock */}
                        <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                          <span style={pill(product.stock_quantity > 0 ? "rgba(45,74,62,.10)" : "rgba(212,60,60,.10)", product.stock_quantity > 0 ? "#1a4035" : "#9b2020")}>
                            {product.stock_quantity} {product.unit_of_measurement}
                          </span>
                        </td>
                        {/* Status — inline select for quick change */}
                        <td style={{ padding: "12px 16px" }}>
                          <select
                            value={product.status}
                            onChange={(e) => handleStatusChange(product.id, e.target.value)}
                            style={{ ...pill(sm.bg, sm.color), border: "none", cursor: "pointer", fontFamily: F, appearance: "none" as const, paddingRight: 6, background: sm.bg }}
                          >
                            {Object.values(ProductStatus).map((s) => (
                              <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                            ))}
                          </select>
                        </td>
                        {/* Actions */}
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                            <Link
                              href={`/seller/products/${product.id}/edit`}
                              style={{ padding: "5px 12px", border: "1px solid #ebe7df", borderRadius: 7, background: "#fff", fontSize: 12, fontWeight: 600, color: "#1c2b23", textDecoration: "none", whiteSpace: "nowrap" }}
                            >
                              Edit
                            </Link>
                            <Link
                              href={`/seller/products/${product.id}/preview`}
                              title="Preview as buyer"
                              style={{ padding: "5px 8px", border: "1px solid #ebe7df", borderRadius: 7, background: "#fff", display: "flex", alignItems: "center", textDecoration: "none", color: "#6a7f73" }}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={13} height={13}><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </Link>
                            <button
                              onClick={() => handleDelete(product.id, product.name)}
                              disabled={isDeleting}
                              title="Delete"
                              style={{ padding: "5px 8px", border: "1px solid #ffd0d0", borderRadius: 7, background: "#fff0f0", display: "flex", alignItems: "center", cursor: isDeleting ? "not-allowed" : "pointer" }}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="#d04040" strokeWidth="2" width={13} height={13}><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 5, marginTop: 28 }}>
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} style={{ padding: "6px 11px", border: "1px solid #ebe7df", borderRadius: 7, background: "#fff", fontSize: 12, fontWeight: 600, color: currentPage === 1 ? "#b0c0b6" : "#1c2b23", cursor: currentPage === 1 ? "default" : "pointer", fontFamily: F }}>
              ««
            </button>
            <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} style={{ padding: "6px 11px", border: "1px solid #ebe7df", borderRadius: 7, background: "#fff", fontSize: 12, fontWeight: 600, color: currentPage === 1 ? "#b0c0b6" : "#1c2b23", cursor: currentPage === 1 ? "default" : "pointer", fontFamily: F }}>
              ‹ Prev
            </button>

            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const n = Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i;
              if (n > totalPages) return null;
              return (
                <button
                  key={n}
                  onClick={() => setCurrentPage(n)}
                  style={{ padding: "6px 11px", border: "1px solid", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: F, borderColor: n === currentPage ? "#2d4a3e" : "#ebe7df", background: n === currentPage ? "#2d4a3e" : "#fff", color: n === currentPage ? "#fff" : "#1c2b23" }}
                >
                  {n}
                </button>
              );
            })}

            <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} style={{ padding: "6px 11px", border: "1px solid #ebe7df", borderRadius: 7, background: "#fff", fontSize: 12, fontWeight: 600, color: currentPage === totalPages ? "#b0c0b6" : "#1c2b23", cursor: currentPage === totalPages ? "default" : "pointer", fontFamily: F }}>
              Next ›
            </button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} style={{ padding: "6px 11px", border: "1px solid #ebe7df", borderRadius: 7, background: "#fff", fontSize: 12, fontWeight: 600, color: currentPage === totalPages ? "#b0c0b6" : "#1c2b23", cursor: currentPage === totalPages ? "default" : "pointer", fontFamily: F }}>
              »»
            </button>

            <span style={{ fontSize: 12, color: "#8a9e92", marginLeft: 4 }}>
              Page {currentPage} of {totalPages}
            </span>
          </div>
        )}

      </main>
    </div>
  );
}
