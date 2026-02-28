"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import ProcurLoader from "@/components/ProcurLoader";
import {
  fetchSellerTransactions,
  fetchTransactionsSummary,
} from "@/store/slices/sellerTransactionsSlice";

enum TransactionType {
  SALE = "sale",
  REFUND = "refund",
  PAYOUT = "payout",
  FEE = "fee",
  ADJUSTMENT = "adjustment",
  CHARGEBACK = "chargeback",
}

enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
  PROCESSING = "processing",
}

enum PaymentMethod {
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  BANK_TRANSFER = "bank_transfer",
  DIGITAL_WALLET = "digital_wallet",
  CASH = "cash",
  CHECK = "check",
}

interface Transaction {
  id: string;
  transaction_number?: string;
  order_id?: string;
  seller_org_id?: string;
  buyer_org_id?: string;
  type: TransactionType | string;
  status: TransactionStatus | string;
  amount: number;
  currency: string;
  platform_fee?: number;
  payment_processing_fee?: number;
  net_amount?: number;
  payment_method?: PaymentMethod | string;
  payment_reference?: string;
  gateway_transaction_id?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  processed_at?: string;
  settled_at?: string;
  created_at: string;
  updated_at: string;
}

interface TransactionFilters {
  search: string;
  type: TransactionType | "";
  status: TransactionStatus | "";
  payment_method: PaymentMethod | "";
  date_range: "today" | "7d" | "30d" | "90d" | "custom" | "";
  amount_min: string;
  amount_max: string;
  sort_by: string;
  sort_order: "asc" | "desc";
}

const TYPE_META: Record<string, { bg: string; color: string; label: string }> = {
  sale:        { bg: "rgba(45,74,62,.10)",   color: "#2d4a3e",  label: "Sale" },
  refund:      { bg: "rgba(212,120,60,.12)", color: "#c26838",  label: "Refund" },
  payout:      { bg: "rgba(45,74,62,.08)",   color: "#1a4035",  label: "Payout" },
  fee:         { bg: "rgba(212,120,60,.10)", color: "#c26838",  label: "Fee" },
  adjustment:  { bg: "rgba(212,120,60,.10)", color: "#c26838",  label: "Adj" },
  chargeback:  { bg: "rgba(212,60,60,.12)",  color: "#9b2020",  label: "CB" },
};

const STATUS_META: Record<string, { bg: string; color: string; icon: string }> = {
  completed:  { bg: "rgba(45,74,62,.10)",   color: "#2d4a3e",  icon: "✓" },
  pending:    { bg: "rgba(212,120,60,.12)", color: "#c26838",  icon: "⏳" },
  processing: { bg: "rgba(45,74,62,.08)",   color: "#1a4035",  icon: "⚡" },
  failed:     { bg: "rgba(212,60,60,.12)",  color: "#9b2020",  icon: "✗" },
  cancelled:  { bg: "rgba(0,0,0,.06)",      color: "#6a7f73",  icon: "⊘" },
};

const fmt = (n: number, currency = "USD") => {
  const isNeg = n < 0;
  const f = new Intl.NumberFormat("en-US", { style: "currency", currency }).format(Math.abs(n));
  return isNeg ? `-${f}` : f;
};

const fmtMethod = (m: string) => ({
  credit_card: "Credit Card", debit_card: "Debit Card",
  bank_transfer: "Bank", digital_wallet: "Wallet", cash: "Cash", check: "Check",
}[m] ?? m);

const card: React.CSSProperties = { background: "#fff", border: "1px solid #ebe7df", borderRadius: 10 };
const inputStyle: React.CSSProperties = { border: "1px solid #ddd9d1", borderRadius: 8, padding: "6px 10px", fontSize: 13, outline: "none", background: "#fff", color: "#1c2b23", width: "100%", boxSizing: "border-box" as const };
const ghostBtn: React.CSSProperties = { background: "none", border: "1px solid #e8e4dc", borderRadius: 8, padding: "6px 12px", fontSize: 13, fontWeight: 500, color: "#1c2b23", cursor: "pointer" };
const pill = (bg: string, color: string): React.CSSProperties => ({ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: bg, color });

export default function SellerTransactionsPage() {
  const dispatch = useAppDispatch();
  const txState = useAppSelector((s) => s.sellerTransactions);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<TransactionFilters>({
    search: "", type: "", status: "", payment_method: "",
    date_range: "", amount_min: "", amount_max: "",
    sort_by: "created_at", sort_order: "desc",
  });

  const displayError = error && (
    error.includes("403") || error.toLowerCase().includes("forbidden") || error.toLowerCase().includes("unauthorized")
  ) ? "Transactions are not available for your account yet. Please complete your seller setup or contact support." : error;

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = { page: currentPage, limit: itemsPerPage, sort_by: filters.sort_by, sort_order: filters.sort_order };
    if (filters.type) params.type = filters.type;
    if (filters.status) params.status = filters.status;
    if (filters.payment_method) params.payment_method = filters.payment_method;
    if (filters.amount_min) params.min_amount = parseFloat(filters.amount_min);
    if (filters.amount_max) params.max_amount = parseFloat(filters.amount_max);
    if (filters.search) params.transaction_number = filters.search;
    if (filters.date_range) {
      const now = new Date();
      let from: Date | null = null;
      switch (filters.date_range) {
        case "today": from = new Date(now.getFullYear(), now.getMonth(), now.getDate()); break;
        case "7d":    from = new Date(now.getTime() - 7 * 86400000); break;
        case "30d":   from = new Date(now.getTime() - 30 * 86400000); break;
        case "90d":   from = new Date(now.getTime() - 90 * 86400000); break;
      }
      if (from) params.from_date = from.toISOString();
    }
    dispatch(fetchSellerTransactions(params));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, currentPage]);

  useEffect(() => {
    dispatch(fetchTransactionsSummary({ period: "last_30_days" }));
  }, [dispatch]);

  useEffect(() => {
    if (txState.status === "succeeded") {
      setTransactions(txState.items as unknown as Transaction[]);
      setTotalTransactions(txState.total);
      setError(null);
      setLoading(false);
    } else if (txState.status === "loading") {
      setLoading(true);
    } else if (txState.status === "failed") {
      setError(txState.error || "Failed to load transactions.");
      setTransactions([]);
      setTotalTransactions(0);
      setLoading(false);
    }
  }, [txState]);

  const handleSelectTransaction = (id: string) =>
    setSelectedTransactions((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const handleSelectAll = () =>
    setSelectedTransactions(selectedTransactions.length === transactions.length ? [] : transactions.map((t) => t.id));

  const totalPages = Math.ceil(totalTransactions / itemsPerPage);

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f4", fontFamily: "'Urbanist', system-ui, sans-serif" }}>
      <main style={{ maxWidth: 1300, margin: "0 auto", padding: "32px 20px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1c2b23", margin: 0 }}>Transaction History</h1>
            <p style={{ fontSize: 13, color: "#8a9e92", marginTop: 3 }}>View and manage all your payment transactions</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={ghostBtn} onClick={() => setShowFilters((v) => !v)}>
              {showFilters ? "Hide Filters" : "Filters"}
            </button>
            <a href="/seller/analytics" style={{ ...ghostBtn, textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
              Analytics
            </a>
          </div>
        </div>

        {/* KPI Strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Sales", value: fmt(txState.summary?.total_sales ?? 0) },
            { label: "Refunds", value: fmt(txState.summary?.total_refunds ?? 0) },
            { label: "Fees", value: fmt(txState.summary?.total_fees ?? 0) },
            { label: "Net Revenue", value: fmt(txState.summary?.net_earnings ?? 0) },
          ].map(({ label, value }) => (
            <div key={label} style={{ ...card, padding: "16px 18px" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#8a9e92", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#1c2b23", lineHeight: 1 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        {showFilters && (
          <div style={{ ...card, padding: "16px 18px", marginBottom: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              <input type="text" value={filters.search} onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))} placeholder="Search…" style={inputStyle} />
              <select value={filters.type} onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value as TransactionType | "" }))} style={inputStyle}>
                <option value="">All Types</option>
                {Object.values(TransactionType).map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={filters.status} onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value as TransactionStatus | "" }))} style={inputStyle}>
                <option value="">All Status</option>
                {Object.values(TransactionStatus).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={filters.date_range} onChange={(e) => setFilters((p) => ({ ...p, date_range: e.target.value as TransactionFilters["date_range"] }))} style={inputStyle}>
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
                <option value="90d">90 Days</option>
              </select>
              <select value={filters.payment_method} onChange={(e) => setFilters((p) => ({ ...p, payment_method: e.target.value as PaymentMethod | "" }))} style={inputStyle}>
                <option value="">All Methods</option>
                {Object.values(PaymentMethod).map((m) => <option key={m} value={m}>{fmtMethod(m)}</option>)}
              </select>
              <input type="number" value={filters.amount_min} onChange={(e) => setFilters((p) => ({ ...p, amount_min: e.target.value }))} placeholder="Min $" style={inputStyle} min="0" />
              <input type="number" value={filters.amount_max} onChange={(e) => setFilters((p) => ({ ...p, amount_max: e.target.value }))} placeholder="Max $" style={inputStyle} min="0" />
              <select value={`${filters.sort_by}-${filters.sort_order}`} onChange={(e) => { const [sort_by, sort_order] = e.target.value.split("-"); setFilters((p) => ({ ...p, sort_by, sort_order: sort_order as "asc" | "desc" })); }} style={inputStyle}>
                <option value="created_at-desc">Newest</option>
                <option value="created_at-asc">Oldest</option>
                <option value="amount-desc">$ High</option>
                <option value="amount-asc">$ Low</option>
              </select>
            </div>
          </div>
        )}

        {/* Bulk toolbar + count */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "#8a9e92" }}>
            <span>{totalTransactions} transactions</span>
            {selectedTransactions.length > 0 && (
              <span style={{ color: "#d4783c", fontWeight: 600 }}>{selectedTransactions.length} selected</span>
            )}
          </div>
          {totalPages > 1 && (
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} style={{ ...ghostBtn, opacity: currentPage === 1 ? 0.4 : 1, fontSize: 12 }}>← Prev</button>
              <span style={{ fontSize: 13, color: "#8a9e92", padding: "6px 4px" }}>{currentPage} / {totalPages}</span>
              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} style={{ ...ghostBtn, opacity: currentPage === totalPages ? 0.4 : 1, fontSize: 12 }}>Next →</button>
            </div>
          )}
        </div>

        {/* Error */}
        {displayError && (
          <div style={{ background: "rgba(212,60,60,.08)", border: "1px solid rgba(212,60,60,.2)", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#9b2020" }}>
            {displayError}
          </div>
        )}

        {/* Loading */}
        {loading && <ProcurLoader size="md" text="Loading transactions…" />}

        {/* Empty */}
        {!loading && transactions.length === 0 && (
          <div style={{ ...card, padding: "48px 24px", textAlign: "center" }}>
            <div style={{ width: 52, height: 52, background: "#f4f1eb", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#8a9e92" strokeWidth="1.5" width={24} height={24}><path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#1c2b23", marginBottom: 6 }}>No transactions found</div>
            <div style={{ fontSize: 13, color: "#8a9e92", marginBottom: 20 }}>
              {filters.search || filters.type || filters.status ? "Try adjusting your filters" : "Transactions appear once you start selling"}
            </div>
            <a href="/seller" style={{ display: "inline-flex", padding: "8px 20px", background: "#2d4a3e", color: "#fff", borderRadius: 999, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
              Go to Dashboard
            </a>
          </div>
        )}

        {/* Table */}
        {!loading && transactions.length > 0 && (
          <div style={{ ...card, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: "#faf8f4", borderBottom: "1px solid #ebe7df" }}>
                    <th style={{ padding: "10px 12px", width: 32 }}>
                      <input type="checkbox" checked={selectedTransactions.length === transactions.length && transactions.length > 0} onChange={handleSelectAll} />
                    </th>
                    {["ID / Order", "Type", "Buyer", "Amount", "Net", "Method", "Status", "Date", ""].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600, color: "#6a7f73", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => {
                    const tm = TYPE_META[tx.type as string] ?? { bg: "rgba(0,0,0,.06)", color: "#6a7f73", label: tx.type };
                    const sm = STATUS_META[tx.status as string] ?? STATUS_META.pending;
                    return (
                      <tr key={tx.id} style={{ borderBottom: "1px solid #f8f6f2" }}>
                        <td style={{ padding: "10px 12px" }}>
                          <input type="checkbox" checked={selectedTransactions.includes(tx.id)} onChange={() => handleSelectTransaction(tx.id)} />
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <div style={{ fontWeight: 600, color: "#d4783c", fontSize: 12 }}>
                            {tx.transaction_number || `${tx.id.slice(0, 12)}…`}
                          </div>
                          {tx.order_id && (
                            <Link href={`/seller/orders/${tx.order_id}`} style={{ fontSize: 11, color: "#8a9e92", textDecoration: "none" }}>
                              Order: {tx.order_id.slice(0, 8)}…
                            </Link>
                          )}
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={pill(tm.bg, tm.color)}>{tm.label}</span>
                        </td>
                        <td style={{ padding: "10px 12px", color: "#8a9e92", fontSize: 12 }}>
                          {tx.buyer_org_id ? `${tx.buyer_org_id.slice(0, 8)}…` : "—"}
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <div style={{ fontWeight: 700, color: "#1c2b23" }}>{fmt(tx.amount, tx.currency)}</div>
                          {tx.platform_fee && <div style={{ fontSize: 11, color: "#8a9e92" }}>-{fmt(Math.abs(tx.platform_fee), tx.currency)}</div>}
                        </td>
                        <td style={{ padding: "10px 12px", fontWeight: 700, color: (tx.net_amount ?? 0) >= 0 ? "#1a4035" : "#9b2020" }}>
                          {fmt(tx.net_amount ?? 0, tx.currency)}
                        </td>
                        <td style={{ padding: "10px 12px", color: "#8a9e92", fontSize: 12 }}>
                          {tx.payment_method ? fmtMethod(tx.payment_method as string) : "—"}
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={pill(sm.bg, sm.color)}>{sm.icon}</span>
                        </td>
                        <td style={{ padding: "10px 12px", color: "#8a9e92", whiteSpace: "nowrap", fontSize: 12 }}>
                          {new Date(tx.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          <div style={{ opacity: 0.7 }}>{new Date(tx.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <button style={{ background: "none", border: "none", cursor: "pointer", color: "#8a9e92", padding: 4 }} title="View">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" width={16} height={16}><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
