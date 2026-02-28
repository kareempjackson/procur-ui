"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchProductRequests,
  setFilters,
} from "@/store/slices/sellerProductRequestsSlice";
import ProcurLoader from "@/components/ProcurLoader";

// Status meta
const getStatusMeta = (request: any) => {
  if (request.my_quote?.status === "accepted") return { text: "Accepted",          bg: "rgba(45,74,62,.12)",   color: "#1a4035" };
  if (request.my_quote?.status === "rejected") return { text: "Declined",          bg: "rgba(212,60,60,.12)",  color: "#9b2020" };
  if (request.my_quote)                        return { text: "Awaiting Response", bg: "rgba(212,120,60,.12)", color: "#c26838" };
  return                                              { text: "New Request",        bg: "rgba(45,74,62,.08)",   color: "#2d4a3e" };
};

const fmtCurrency = (n: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);

const fmtDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "Not specified";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #ebe7df", borderRadius: 10 };
const pill = (bg: string, color: string): React.CSSProperties => ({ display: "inline-flex", alignItems: "center", padding: "3px 9px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: bg, color, whiteSpace: "nowrap" as const });

export default function PurchaseRequestsClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { requests, status, error, pagination, filters } = useAppSelector(
    (state) => state.sellerProductRequests
  );

  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const statusFilter = activeTab === "all" ? undefined : activeTab === "new" ? "open" : activeTab;
    dispatch(fetchProductRequests({ ...filters, status: statusFilter, search: searchQuery || undefined }));
  }, [dispatch, activeTab, searchQuery]);

  if (status === "loading" && requests.length === 0) {
    return <ProcurLoader size="lg" text="Loading purchase requests…" />;
  }

  const tabCounts = {
    all:       pagination.total,
    new:       requests.filter((r: any) => !r.my_quote && r.status === "open").length,
    responded: requests.filter((r: any) => r.my_quote).length,
    accepted:  requests.filter((r: any) => r.my_quote?.status === "accepted").length,
    declined:  requests.filter((r: any) => r.my_quote?.status === "rejected").length,
  };

  const TABS = [
    { key: "all", label: "All" },
    { key: "new", label: "New" },
    { key: "responded", label: "Responded" },
    { key: "accepted", label: "Accepted" },
    { key: "declined", label: "Declined" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f4", fontFamily: "'Urbanist', system-ui, sans-serif" }}>
      <main style={{ maxWidth: 1300, margin: "0 auto", padding: "32px 20px" }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1c2b23", margin: 0 }}>Purchase Requests</h1>
          <p style={{ fontSize: 13, color: "#8a9e92", marginTop: 3 }}>View buyer requests and submit your bids</p>
        </div>

        {/* Tabs + Search */}
        <div style={{ ...card, padding: "16px 18px", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            {/* Tabs */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 999,
                    border: "none",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    background: activeTab === tab.key ? "#2d4a3e" : "#f4f1eb",
                    color: activeTab === tab.key ? "#fff" : "#6a7f73",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tab.label} ({tabCounts[tab.key as keyof typeof tabCounts] || 0})
                </button>
              ))}
            </div>
            {/* Search */}
            <div style={{ position: "relative", minWidth: 220 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#8a9e92" strokeWidth="2" width={14} height={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search requests…"
                style={{ border: "1px solid #ddd9d1", borderRadius: 999, padding: "7px 12px 7px 30px", fontSize: 13, outline: "none", background: "#faf8f4", color: "#1c2b23", width: "100%", boxSizing: "border-box" }}
              />
            </div>
          </div>
          {searchQuery && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f0ece4", fontSize: 13, color: "#8a9e92" }}>
              Showing results for "<span style={{ fontWeight: 600, color: "#1c2b23" }}>{searchQuery}</span>" in <span style={{ fontWeight: 600, color: "#1c2b23" }}>{activeTab === "all" ? "All" : activeTab} Requests</span>
            </div>
          )}
        </div>

        {/* Error */}
        {status === "failed" && (
          <div style={{ background: "rgba(212,60,60,.08)", border: "1px solid rgba(212,60,60,.2)", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#9b2020" }}>
            {error}
          </div>
        )}

        {/* Empty */}
        {requests.length === 0 && (
          <div style={{ ...card, padding: "48px 24px", textAlign: "center" }}>
            <div style={{ width: 52, height: 52, background: "#f4f1eb", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#8a9e92" strokeWidth="1.5" width={26} height={26}><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#1c2b23", marginBottom: 6 }}>
              No {activeTab === "all" ? "" : activeTab} requests found
            </div>
            <div style={{ fontSize: 13, color: "#8a9e92" }}>
              {activeTab === "all" ? "There are no buyer requests at the moment." : "Try adjusting your filters or search query."}
            </div>
          </div>
        )}

        {/* Cards Grid */}
        {requests.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {requests.map((request: any) => {
              const sm = getStatusMeta(request);
              const hasQuote = !!request.my_quote;
              const isAccepted = request.my_quote?.status === "accepted";
              const isRejected = request.my_quote?.status === "rejected";

              return (
                <div
                  key={request.id}
                  style={{ ...card, cursor: "pointer", transition: "border-color .15s" }}
                  role="button"
                  tabIndex={0}
                  onClick={() => router.push(`/seller/purchase-requests/${request.id}`)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); router.push(`/seller/purchase-requests/${request.id}`); } }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#d4783c")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#ebe7df")}
                >
                  <div style={{ padding: "16px" }}>
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {request.request_number && (
                          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".06em", color: "#8a9e92", marginBottom: 3 }}>
                            RFQ {request.request_number}
                          </div>
                        )}
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#1c2b23", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {request.product_name}
                        </div>
                        <div style={{ fontSize: 12, color: "#8a9e92", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {request.buyer_name}
                        </div>
                      </div>
                      <span style={pill(sm.bg, sm.color)}>{sm.text}</span>
                    </div>

                    {/* Category */}
                    {request.category && (
                      <div style={{ fontSize: 12, color: "#8a9e92", marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" width={13} height={13}><path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                        {request.category}
                      </div>
                    )}

                    {/* Details grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px", fontSize: 12, marginBottom: 12 }}>
                      <div style={{ color: "#8a9e92" }}>
                        <span style={{ fontWeight: 600, color: "#1c2b23" }}>Qty: </span>
                        {request.quantity} {request.unit_of_measurement}
                      </div>
                      {request.budget_range && (
                        <div style={{ color: "#8a9e92" }}>
                          <span style={{ fontWeight: 600, color: "#1c2b23" }}>Budget: </span>
                          {fmtCurrency(request.budget_range.max_price || 0, request.budget_range.currency)}
                        </div>
                      )}
                      <div style={{ color: "#8a9e92", gridColumn: "1 / -1" }}>
                        <span style={{ fontWeight: 600, color: "#1c2b23" }}>Delivery: </span>
                        {fmtDate(request.date_needed)}
                      </div>
                      {request.delivery_location && (
                        <div style={{ color: "#8a9e92", gridColumn: "1 / -1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          📍 {request.delivery_location}
                        </div>
                      )}
                    </div>

                    {/* My Quote */}
                    {hasQuote && request.my_quote?.unit_price && (
                      <div style={{ background: "#faf8f4", borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#1c2b23", marginBottom: 4 }}>Your Quote:</div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                          <span style={{ color: "#8a9e92" }}>Price:</span>
                          <span style={{ fontWeight: 700, color: "#d4783c" }}>
                            {fmtCurrency(request.my_quote.unit_price, request.my_quote.currency || "USD")}/{request.unit_of_measurement}
                          </span>
                        </div>
                        {request.my_quote.notes && (
                          <div style={{ fontSize: 11, color: "#8a9e92", marginTop: 4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
                            {request.my_quote.notes}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ paddingTop: 12, borderTop: "1px solid #f0ece4" }}>
                      {!hasQuote && request.status === "open" && (
                        <Link
                          href={`/seller/purchase-requests/${request.id}`}
                          onClick={(e) => e.stopPropagation()}
                          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 0", background: "#d4783c", color: "#fff", borderRadius: 999, textDecoration: "none", fontSize: 13, fontWeight: 700 }}
                        >
                          Submit Bid →
                        </Link>
                      )}
                      {hasQuote && !isAccepted && !isRejected && (
                        <div style={{ display: "flex", gap: 8 }}>
                          <Link
                            href={`/seller/purchase-requests/${request.id}`}
                            onClick={(e) => e.stopPropagation()}
                            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "7px 0", background: "#f4f1eb", color: "#1c2b23", borderRadius: 999, textDecoration: "none", fontSize: 13, fontWeight: 600 }}
                          >
                            View Details
                          </Link>
                        </div>
                      )}
                      {isAccepted && (
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#1a4035", marginBottom: 8 }}>Your bid was accepted!</div>
                          <Link href="/seller/orders" onClick={(e) => e.stopPropagation()} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "7px 0", background: "#2d4a3e", color: "#fff", borderRadius: 999, textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
                            View Order →
                          </Link>
                        </div>
                      )}
                      {isRejected && (
                        <div style={{ textAlign: "center", fontSize: 12, color: "#9b2020", fontWeight: 600 }}>
                          Your bid was not selected this time.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
