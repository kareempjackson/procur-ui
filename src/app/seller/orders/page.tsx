"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import { getApiClient } from "@/lib/apiClient";
import { fetchSellerOrders } from "@/store/slices/sellerOrdersSlice";
import ProcurLoader from "@/components/ProcurLoader";

// ── Enums ─────────────────────────────────────────────────────────────────────
enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PREPARING = "preparing",
  READY = "ready",
  IN_TRANSIT = "in_transit",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

enum OrderPriority {
  LOW = "low",
  NORMAL = "normal",
  HIGH = "high",
  URGENT = "urgent",
}

enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}

enum FulfillmentMethod {
  PICKUP = "pickup",
  DELIVERY = "delivery",
  SHIPPING = "shipping",
}

// ── Interfaces ─────────────────────────────────────────────────────────────────
interface ProductImage {
  image_url?: string;
  is_primary?: boolean;
}

interface ProductSnapshot {
  image_url?: string;
  product_images?: ProductImage[];
}

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  sku?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  unit_of_measurement: string;
  image_url?: string;
  product_image?: string;
  product_snapshot?: ProductSnapshot;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  status: OrderStatus;
  priority: OrderPriority;
  payment_status: PaymentStatus;
  fulfillment_method: FulfillmentMethod;
  subtotal: number;
  tax_amount: number;
  shipping_cost: number;
  total_amount: number;
  currency: string;
  items: OrderItem[];
  shipping_address?: { street: string; city: string; state: string; zip: string };
  notes?: string;
  estimated_delivery?: string;
  created_at: string;
  updated_at: string;
}

interface PaymentLinkSummary {
  id: string;
  code: string;
  status: string;
  total_amount: number;
  currency: string;
  created_at: string;
  expires_at: string | null;
  public_url: string;
}

interface OrderFilters {
  search: string;
  status: OrderStatus | "";
  priority: OrderPriority | "";
  payment_status: PaymentStatus | "";
  fulfillment_method: FulfillmentMethod | "";
  date_range: "today" | "7d" | "30d" | "90d" | "custom" | "";
  amount_min: string;
  amount_max: string;
  sort_by: string;
  sort_order: "asc" | "desc";
}

// ── Status meta ────────────────────────────────────────────────────────────────
const STATUS_META: Record<string, { label: string; bg: string; color: string }> = {
  pending:    { label: "Pending",    bg: "rgba(212,120,60,.12)", color: "#c26838" },
  confirmed:  { label: "Confirmed",  bg: "rgba(45,74,62,.10)",   color: "#2d4a3e" },
  preparing:  { label: "Preparing",  bg: "rgba(212,120,60,.12)", color: "#c26838" },
  ready:      { label: "Ready",      bg: "rgba(45,74,62,.10)",   color: "#2d4a3e" },
  in_transit: { label: "In Transit", bg: "rgba(45,74,62,.10)",   color: "#2d4a3e" },
  delivered:  { label: "Delivered",  bg: "rgba(45,74,62,.15)",   color: "#1a4035" },
  cancelled:  { label: "Cancelled",  bg: "rgba(0,0,0,.06)",      color: "#6a7f73" },
  refunded:   { label: "Refunded",   bg: "rgba(0,0,0,.06)",      color: "#6a7f73" },
};

const PRIORITY_META: Record<string, { label: string; bg: string; color: string }> = {
  low:    { label: "Low",    bg: "rgba(0,0,0,.06)",      color: "#6a7f73" },
  normal: { label: "Normal", bg: "rgba(45,74,62,.10)",   color: "#2d4a3e" },
  high:   { label: "High",   bg: "rgba(212,120,60,.14)", color: "#c26838" },
  urgent: { label: "Urgent", bg: "rgba(212,60,60,.14)",  color: "#9b2020" },
};

const PAYMENT_META: Record<string, { bg: string; color: string }> = {
  paid:     { bg: "rgba(45,74,62,.10)",   color: "#2d4a3e" },
  pending:  { bg: "rgba(212,120,60,.12)", color: "#c26838" },
  failed:   { bg: "rgba(212,60,60,.12)",  color: "#a32020" },
  refunded: { bg: "rgba(0,0,0,.06)",      color: "#6a7f73" },
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function getOrderItemImage(item: OrderItem): string | null {
  const fromSnapshotPrimary = item.product_snapshot?.product_images?.find((i) => i.is_primary)?.image_url || null;
  const fromSnapshotAny = item.product_snapshot?.product_images?.find((i) => i.image_url)?.image_url || null;
  return item.product_image || item.image_url || fromSnapshotPrimary || fromSnapshotAny || item.product_snapshot?.image_url || null;
}

const fmt = (n: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);

// ── Shared styles ──────────────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #ebe7df",
  borderRadius: 10,
};

const inputStyle: React.CSSProperties = {
  border: "1px solid #ddd9d1",
  borderRadius: 8,
  padding: "6px 10px",
  fontSize: 13,
  outline: "none",
  background: "#fff",
  color: "#1c2b23",
  width: "100%",
};

const pillStyle = (bg: string, color: string): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "2px 8px",
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 600,
  background: bg,
  color,
  whiteSpace: "nowrap",
});

const ghostBtn: React.CSSProperties = {
  background: "none",
  border: "1px solid #e8e4dc",
  borderRadius: 8,
  padding: "6px 12px",
  fontSize: 13,
  fontWeight: 500,
  color: "#1c2b23",
  cursor: "pointer",
};

// ── Component ──────────────────────────────────────────────────────────────────
export default function SellerOrdersPage() {
  const dispatch = useAppDispatch();
  const ordersState = useAppSelector((s) => s.sellerOrders);

  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<OrderFilters>({
    search: "",
    status: "",
    priority: "",
    payment_status: "",
    fulfillment_method: "",
    date_range: "",
    amount_min: "",
    amount_max: "",
    sort_by: "created_at",
    sort_order: "desc",
  });

  const [paymentLinks, setPaymentLinks] = useState<PaymentLinkSummary[]>([]);
  const [paymentLinksLoading, setPaymentLinksLoading] = useState(false);

  // ── Fetch orders ─────────────────────────────────────────────────────────────
  async function runFetch(page: number) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = {
      page,
      limit: itemsPerPage,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    };
    if (filters.status) params.status = filters.status;
    if (filters.payment_status) params.payment_status = filters.payment_status;
    if (filters.search) params.order_number = filters.search;
    if (filters.date_range) {
      const now = new Date();
      let from: Date | null = null;
      switch (filters.date_range) {
        case "today": from = new Date(now.getFullYear(), now.getMonth(), now.getDate()); break;
        case "7d":    from = new Date(now.getTime() - 7 * 86400000);  break;
        case "30d":   from = new Date(now.getTime() - 30 * 86400000); break;
        case "90d":   from = new Date(now.getTime() - 90 * 86400000); break;
      }
      if (from) params.from_date = from.toISOString();
    }
    await dispatch(fetchSellerOrders(params));
  }

  useEffect(() => {
    runFetch(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, currentPage]);

  useEffect(() => {
    if (ordersState.status === "succeeded") {
      setOrders(ordersState.items as unknown as Order[]);
      setTotalOrders(ordersState.total);
      setError(null);
      setLoading(false);
    } else if (ordersState.status === "loading") {
      setLoading(true);
    } else if (ordersState.status === "failed") {
      setError(ordersState.error || "Failed to load orders.");
      setOrders([]);
      setTotalOrders(0);
      setLoading(false);
    }
  }, [ordersState]);

  useEffect(() => {
    (async () => {
      try {
        setPaymentLinksLoading(true);
        const api = getApiClient();
        const { data } = await api.get<PaymentLinkSummary[]>("/payment-links");
        setPaymentLinks(data || []);
      } catch {
        // non-blocking
      } finally {
        setPaymentLinksLoading(false);
      }
    })();
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilterChange = (key: keyof OrderFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSelectOrder = (id: string) =>
    setSelectedOrders((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const handleSelectAll = () =>
    setSelectedOrders(selectedOrders.length === orders.length ? [] : orders.map((o) => o.id));

  const handleBulkExport = () => {
    const selected = orders.filter((o) => selectedOrders.includes(o.id));
    if (!selected.length) return;
    const headers = ["Order Number", "Customer", "Email", "Status", "Payment Status", "Total Amount", "Currency", "Created At"];
    const rows = selected.map((o) => [o.order_number, o.customer_name, o.customer_email, o.status, o.payment_status, o.total_amount?.toString() ?? "", o.currency ?? "USD", o.created_at]);
    const csv = [headers, ...rows].map((row) => row.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBulkPrint = () => {
    const selected = orders.filter((o) => selectedOrders.includes(o.id));
    if (!selected.length) return;
    const content = selected.map((o) => `
      <div style="padding:12px;border-bottom:1px solid #eee;font-family:sans-serif;">
        <h2>Order ${o.order_number}</h2>
        <p><strong>Customer:</strong> ${o.customer_name}</p>
        <p><strong>Email:</strong> ${o.customer_email}</p>
        ${o.shipping_address ? `<p><strong>Destination:</strong> ${[o.shipping_address.street, o.shipping_address.city, o.shipping_address.state, o.shipping_address.zip].filter(Boolean).join(", ")}</p>` : ""}
      </div>
    `).join("");
    const win = window.open("", "_blank", "width=800,height=600");
    if (!win) return;
    win.document.write(`<html><head><title>Shipping Labels</title></head><body>${content}</body></html>`);
    win.document.close();
    win.focus();
    win.print();
  };

  // ── Derived stats ──────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    revenue:    orders.filter((o) => o.payment_status === PaymentStatus.PAID).reduce((s, o) => s + o.total_amount, 0),
    pending:    orders.filter((o) => o.status === OrderStatus.PENDING).length,
    active:     orders.filter((o) => [OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.IN_TRANSIT].includes(o.status)).length,
    delivered:  orders.filter((o) => o.status === OrderStatus.DELIVERED).length,
  }), [orders]);

  const totalPages = Math.ceil(totalOrders / itemsPerPage);

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#faf8f4", fontFamily: "'Urbanist', system-ui, sans-serif" }}>
      <main style={{ maxWidth: 1300, margin: "0 auto", padding: "32px 20px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1c2b23", margin: 0 }}>Orders</h1>
            <p style={{ fontSize: 13, color: "#8a9e92", marginTop: 3 }}>Track and manage all your customer orders</p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button style={ghostBtn} onClick={() => setShowFilters((v) => !v)}>
              {showFilters ? "Hide Filters" : "Filters"}
            </button>
            <Link
              href="/seller/analytics"
              style={{ ...ghostBtn, textDecoration: "none", display: "inline-flex", alignItems: "center" }}
            >
              Analytics
            </Link>
          </div>
        </div>

        {/* KPI Strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Revenue", value: fmt(stats.revenue), sub: "from paid orders" },
            { label: "Pending", value: String(stats.pending), sub: "awaiting action", alert: stats.pending > 0 },
            { label: "Active", value: String(stats.active), sub: "being processed" },
            { label: "Delivered", value: String(stats.delivered), sub: "completed" },
          ].map(({ label, value, sub, alert }) => (
            <div key={label} style={{ ...card, padding: "16px 18px", borderColor: alert ? "rgba(212,120,60,.4)" : "#ebe7df" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#8a9e92", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: alert ? "#d4783c" : "#1c2b23", lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 11, color: "#8a9e92", marginTop: 4 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div style={{ ...card, padding: "16px 18px", marginBottom: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                placeholder="Search order #..."
                style={inputStyle}
              />
              <select value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)} style={inputStyle}>
                <option value="">All Status</option>
                {Object.values(OrderStatus).map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
              </select>
              <select value={filters.payment_status} onChange={(e) => handleFilterChange("payment_status", e.target.value)} style={inputStyle}>
                <option value="">All Payment</option>
                {Object.values(PaymentStatus).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={filters.date_range} onChange={(e) => handleFilterChange("date_range", e.target.value)} style={inputStyle}>
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <select value={filters.fulfillment_method} onChange={(e) => handleFilterChange("fulfillment_method", e.target.value)} style={inputStyle}>
                <option value="">All Methods</option>
                {Object.values(FulfillmentMethod).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={filters.priority} onChange={(e) => handleFilterChange("priority", e.target.value)} style={inputStyle}>
                <option value="">All Priority</option>
                {Object.values(OrderPriority).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <input
                type="number"
                value={filters.amount_min}
                onChange={(e) => handleFilterChange("amount_min", e.target.value)}
                placeholder="Min $"
                style={inputStyle}
                min="0"
              />
              <select
                value={`${filters.sort_by}-${filters.sort_order}`}
                onChange={(e) => {
                  const [sort_by, sort_order] = e.target.value.split("-");
                  handleFilterChange("sort_by", sort_by);
                  handleFilterChange("sort_order", sort_order as "asc" | "desc");
                }}
                style={inputStyle}
              >
                <option value="created_at-desc">Newest</option>
                <option value="created_at-asc">Oldest</option>
                <option value="total_amount-desc">$ High</option>
                <option value="total_amount-asc">$ Low</option>
                <option value="customer_name-asc">A–Z</option>
                <option value="priority-desc">Priority</option>
              </select>
            </div>
          </div>
        )}

        {/* Payment Links */}
        <div style={{ ...card, padding: "16px 18px", marginBottom: 20 }}>
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23" }}>Payment Links</span>
            <span style={{ fontSize: 12, color: "#8a9e92", marginLeft: 8 }}>All payment links from this account</span>
          </div>
          {paymentLinksLoading ? (
            <div style={{ fontSize: 12, color: "#8a9e92", padding: "8px 0" }}>Loading…</div>
          ) : paymentLinks.length === 0 ? (
            <div style={{ fontSize: 12, color: "#8a9e92", padding: "8px 0" }}>No payment links created yet.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #f0ece4" }}>
                    {["Code", "Status", "Amount", "Created", "Expires", ""].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "6px 8px", fontWeight: 600, color: "#8a9e92", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paymentLinks.map((pl) => (
                    <tr key={pl.id} style={{ borderBottom: "1px solid #faf8f4" }}>
                      <td style={{ padding: "8px", fontFamily: "monospace", fontSize: 11 }}>{pl.code}</td>
                      <td style={{ padding: "8px" }}>
                        <span style={pillStyle("rgba(45,74,62,.08)", "#2d4a3e")}>{pl.status.replace(/_/g, " ")}</span>
                      </td>
                      <td style={{ padding: "8px", fontWeight: 600, color: "#1c2b23" }}>{pl.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {pl.currency}</td>
                      <td style={{ padding: "8px", color: "#8a9e92" }}>{new Date(pl.created_at).toLocaleString()}</td>
                      <td style={{ padding: "8px", color: "#8a9e92" }}>{pl.expires_at ? new Date(pl.expires_at).toLocaleDateString() : "—"}</td>
                      <td style={{ padding: "8px", textAlign: "right" }}>
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText(pl.public_url)}
                          style={{ ...ghostBtn, fontSize: 11, padding: "4px 10px" }}
                        >
                          Copy link
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Bulk toolbar + count */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "#8a9e92" }}>
            <span>{totalOrders} orders</span>
            {selectedOrders.length > 0 && (
              <>
                <span style={{ color: "#d4783c", fontWeight: 600 }}>{selectedOrders.length} selected</span>
                <button onClick={handleBulkExport} style={{ ...ghostBtn, padding: "4px 10px", fontSize: 12 }}>Export CSV</button>
                <button onClick={handleBulkPrint}  style={{ ...ghostBtn, padding: "4px 10px", fontSize: 12 }}>Print Labels</button>
              </>
            )}
          </div>
          {totalPages > 1 && (
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} style={{ ...ghostBtn, opacity: currentPage === 1 ? 0.4 : 1 }}>← Prev</button>
              <span style={{ fontSize: 13, color: "#8a9e92", padding: "6px 4px" }}>{currentPage} / {totalPages}</span>
              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} style={{ ...ghostBtn, opacity: currentPage === totalPages ? 0.4 : 1 }}>Next →</button>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "rgba(212,60,60,.08)", border: "1px solid rgba(212,60,60,.2)", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#9b2020" }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && <ProcurLoader size="md" text="Loading orders…" />}

        {/* Empty */}
        {!loading && !error && orders.length === 0 && (
          <div style={{ ...card, padding: "48px 24px", textAlign: "center" }}>
            <div style={{ width: 52, height: 52, background: "#f4f1eb", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#8a9e92" strokeWidth="1.5" width={24} height={24}><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#1c2b23", marginBottom: 6 }}>No orders found</div>
            <div style={{ fontSize: 13, color: "#8a9e92", marginBottom: 20 }}>
              {filters.search || filters.status ? "Try adjusting your filters" : "Orders will appear here once customers purchase"}
            </div>
            <Link href="/seller" style={{ display: "inline-flex", padding: "8px 20px", background: "#2d4a3e", color: "#fff", borderRadius: 999, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
              Go to Dashboard
            </Link>
          </div>
        )}

        {/* Orders Table */}
        {!loading && !error && orders.length > 0 && (
          <div style={{ ...card, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: "#faf8f4", borderBottom: "1px solid #ebe7df" }}>
                    <th style={{ padding: "10px 12px", width: 32 }}>
                      <input type="checkbox" checked={selectedOrders.length === orders.length && orders.length > 0} onChange={handleSelectAll} />
                    </th>
                    {["Order", "Customer", "Items", "Total", "Priority", "Status", "Payment", "Date", ""].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600, color: "#6a7f73", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const sm = STATUS_META[order.status] ?? STATUS_META.pending;
                    const pm = PRIORITY_META[order.priority] ?? PRIORITY_META.normal;
                    const pay = PAYMENT_META[order.payment_status] ?? PAYMENT_META.pending;
                    return (
                      <tr key={order.id} style={{ borderBottom: "1px solid #f8f6f2" }}>
                        <td style={{ padding: "10px 12px" }}>
                          <input type="checkbox" checked={selectedOrders.includes(order.id)} onChange={() => handleSelectOrder(order.id)} />
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <Link href={`/seller/orders/${order.id}`} style={{ textDecoration: "none" }}>
                            <div style={{ fontWeight: 700, color: "#1c2b23" }}>{order.order_number}</div>
                            <div style={{ color: "#8a9e92", marginTop: 2 }}>
                              {order.fulfillment_method === FulfillmentMethod.PICKUP ? "Pickup" : order.fulfillment_method === FulfillmentMethod.DELIVERY ? "Delivery" : "Shipping"}
                            </div>
                          </Link>
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <div style={{ fontWeight: 600, color: "#1c2b23", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.customer_name}</div>
                          <div style={{ color: "#8a9e92", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.customer_email}</div>
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ display: "flex" }}>
                              {order.items.slice(0, 3).map((item, idx) => {
                                const img = getOrderItemImage(item);
                                return (
                                  <div
                                    key={item.id}
                                    style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid #fff", background: "#f4f1eb", overflow: "hidden", marginLeft: idx > 0 ? -8 : 0, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                                    title={item.product_name}
                                  >
                                    {img
                                      ? <img src={img} alt={item.product_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                      : <svg viewBox="0 0 24 24" fill="none" stroke="#8a9e92" strokeWidth="1.5" width={14} height={14}><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                    }
                                  </div>
                                );
                              })}
                              {order.items.length > 3 && (
                                <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid #fff", background: "#f0ece4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#6a7f73", marginLeft: -8 }}>
                                  +{order.items.length - 3}
                                </div>
                              )}
                            </div>
                            <div style={{ color: "#6a7f73" }}>
                              <div style={{ fontWeight: 600, color: "#1c2b23" }}>
                                {order.items[0]?.product_name}{order.items.length > 1 ? ` +${order.items.length - 1}` : ""}
                              </div>
                              <div>{order.items.length} item{order.items.length !== 1 ? "s" : ""}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "10px 12px", fontWeight: 700, color: "#1c2b23", whiteSpace: "nowrap" }}>
                          {fmt(order.total_amount, order.currency)}
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={pillStyle(pm.bg, pm.color)}>{pm.label}</span>
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={pillStyle(sm.bg, sm.color)}>{sm.label}</span>
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={pillStyle(pay.bg, pay.color)}>{order.payment_status}</span>
                        </td>
                        <td style={{ padding: "10px 12px", color: "#8a9e92", whiteSpace: "nowrap" }}>
                          {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          <div style={{ opacity: 0.7 }}>{new Date(order.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <Link
                            href={`/seller/orders/${order.id}`}
                            style={{ display: "inline-flex", padding: "5px 12px", background: "#f4f1eb", borderRadius: 999, textDecoration: "none", fontSize: 12, fontWeight: 600, color: "#2d4a3e" }}
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bottom pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 20 }}>
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} style={{ ...ghostBtn, opacity: currentPage === 1 ? 0.4 : 1, fontSize: 12 }}>First</button>
            <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} style={{ ...ghostBtn, opacity: currentPage === 1 ? 0.4 : 1, fontSize: 12 }}>Prev</button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const n = Math.max(1, currentPage - 2) + i;
              if (n > totalPages) return null;
              return (
                <button
                  key={n}
                  onClick={() => setCurrentPage(n)}
                  style={{ ...ghostBtn, fontSize: 12, background: n === currentPage ? "#2d4a3e" : "none", color: n === currentPage ? "#fff" : "#1c2b23", border: n === currentPage ? "1px solid #2d4a3e" : "1px solid #e8e4dc" }}
                >
                  {n}
                </button>
              );
            })}
            <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} style={{ ...ghostBtn, opacity: currentPage === totalPages ? 0.4 : 1, fontSize: 12 }}>Next</button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} style={{ ...ghostBtn, opacity: currentPage === totalPages ? 0.4 : 1, fontSize: 12 }}>Last</button>
          </div>
        )}
      </main>
    </div>
  );
}
