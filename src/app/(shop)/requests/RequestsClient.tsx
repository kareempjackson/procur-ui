"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchRequests } from "@/store/slices/buyerRequestsSlice";
import ProcurLoader from "@/components/ProcurLoader";
import { addDays, formatShortDate } from "@/lib/utils/date";

const T = {
  pageBg: "#faf8f4",
  cardBg: "#f5f1ea",
  border: "#e8e4dc",
  teal: "#2d4a3e",
  orange: "#d4783c",
  orangeHover: "#c26838",
  dark: "#1c2b23",
  muted: "#8a9e92",
  font: "'Urbanist', system-ui, sans-serif",
};

const statusStyle = (status: string) => {
  switch (status) {
    case "active":
      return { background: "#f0f7f4", color: T.teal };
    case "completed":
      return { background: "#f0f4ff", color: "#3b5bdb" };
    case "expired":
      return { background: "#f5f5f5", color: "#666" };
    default:
      return { background: "#f5f5f5", color: "#666" };
  }
};

export default function RequestsClient() {
  const dispatch = useAppDispatch();
  const { requests, status, error, pagination } = useAppSelector(
    (state) => state.buyerRequests
  );
  const now = new Date();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    dispatch(fetchRequests({ page: 1, limit: 20 }));
  }, [dispatch]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filters: any = { page: 1, limit: 20 };
      if (searchQuery) filters.search = searchQuery;
      if (selectedStatus !== "all") filters.status = selectedStatus;
      dispatch(fetchRequests(filters));
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedStatus, dispatch]);

  const filteredRequests = requests.map((request) => ({
    id: request.id,
    productName: request.product_name,
    quantity: `${request.quantity} ${request.unit_of_measurement}`,
    deliveryDate: request.date_needed
      ? new Date(request.date_needed).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Flexible",
    deliveryLocation: request.target_seller_name || "Open Market",
    status: request.status,
    createdDate: new Date(request.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    bidsCount: request.response_count || 0,
    budget:
      request.budget_range?.min && request.budget_range?.max
        ? `${request.budget_range.currency || "$"}${request.budget_range.min} - ${request.budget_range.currency || "$"}${request.budget_range.max}`
        : "Open",
    orderType: request.category || "one-off",
    urgency: request.product_type || "standard",
  }));

  const statusCounts = {
    all: pagination.totalItems,
    active: requests.filter((r) => r.status === "active").length,
    completed: requests.filter((r) => r.status === "completed").length,
    expired: requests.filter((r) => r.status === "expired").length,
  };

  if (status === "loading" && requests.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: T.pageBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ProcurLoader size="lg" text="Loading requests..." />
      </div>
    );
  }

  if (status === "failed" && error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: T.pageBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: T.font,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: T.dark, marginBottom: 8 }}>
            Failed to Load Requests
          </h2>
          <p style={{ color: T.muted, marginBottom: 16 }}>{error}</p>
          <button
            onClick={() => dispatch(fetchRequests({ page: 1, limit: 20 }))}
            style={{
              padding: "10px 24px",
              background: T.orange,
              color: "#fff",
              border: "none",
              borderRadius: 999,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: T.font,
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: T.pageBg, fontFamily: T.font }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: T.dark, marginBottom: 4 }}>
                My Requests
              </h1>
              <p style={{ fontSize: 13, color: T.muted }}>
                View and manage your produce requests and supplier bids
              </p>
            </div>
            <Link
              href="/requests/new"
              style={{
                padding: "10px 20px",
                background: T.orange,
                color: "#fff",
                borderRadius: 999,
                fontWeight: 600,
                fontSize: 13,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              + New Request
            </Link>
          </div>

          {/* Status Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {[
              { key: "all", label: "All" },
              { key: "active", label: "Active" },
              { key: "completed", label: "Completed" },
              { key: "expired", label: "Expired" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedStatus(tab.key)}
                style={{
                  padding: "7px 16px",
                  borderRadius: 999,
                  border: selectedStatus === tab.key ? "none" : `1px solid ${T.border}`,
                  background: selectedStatus === tab.key ? T.teal : T.cardBg,
                  color: selectedStatus === tab.key ? "#fff" : T.dark,
                  fontWeight: 500,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: T.font,
                }}
              >
                {tab.label}
                <span style={{ marginLeft: 6, opacity: 0.7 }}>
                  ({statusCounts[tab.key as keyof typeof statusCounts]})
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: "relative", maxWidth: 480 }}>
            <span
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: T.muted,
                fontSize: 14,
                pointerEvents: "none",
              }}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="Search requests by product name..."
              style={{
                width: "100%",
                padding: "10px 16px 10px 40px",
                border: `1px solid ${T.border}`,
                borderRadius: 999,
                fontSize: 14,
                background: T.cardBg,
                color: T.dark,
                outline: "none",
                fontFamily: T.font,
                boxSizing: "border-box",
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px" }}>
        {filteredRequests.length === 0 ? (
          <div
            style={{
              background: T.cardBg,
              borderRadius: 14,
              border: `1px solid ${T.border}`,
              padding: "48px 24px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: T.dark, marginBottom: 8 }}>
              No requests found
            </h3>
            <p style={{ color: T.muted, marginBottom: 24 }}>
              {selectedStatus === "all"
                ? "You haven't created any requests yet."
                : `You don't have any ${selectedStatus} requests.`}
            </p>
            <Link
              href="/requests/new"
              style={{
                padding: "12px 24px",
                background: T.orange,
                color: "#fff",
                borderRadius: 999,
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Create Your First Request
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filteredRequests.map((request) => (
              <Link
                key={request.id}
                href={`/requests/${request.id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 14,
                    border: `1px solid ${T.border}`,
                    padding: "20px 24px",
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = T.teal)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = T.border)
                  }
                >
                  {/* Request Header */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: T.dark }}>
                          {request.productName}
                        </h3>
                        <span
                          style={{
                            ...statusStyle(request.status),
                            padding: "3px 10px",
                            borderRadius: 999,
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                        >
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                        {request.orderType === "recurring" && (
                          <span
                            style={{
                              background: "#f0eaff",
                              color: "#6d3bb5",
                              padding: "3px 10px",
                              borderRadius: 999,
                              fontSize: 12,
                              fontWeight: 500,
                            }}
                          >
                            Recurring
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 13, color: T.muted }}>
                        Requested on {request.createdDate}
                      </p>
                    </div>
                  </div>

                  {/* Details Row */}
                  <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, color: T.muted, marginBottom: 2 }}>Quantity</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.dark }}>{request.quantity}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: T.muted, marginBottom: 2 }}>Delivery Date</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.dark }}>{request.deliveryDate}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: T.muted, marginBottom: 2 }}>Budget</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.dark }}>{request.budget}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: T.muted, marginBottom: 2 }}>Location</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.dark }}>{request.deliveryLocation}</div>
                    </div>
                  </div>

                  {/* Bids summary */}
                  {request.status === "active" && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: 12,
                        borderTop: `1px solid ${T.border}`,
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 500, color: T.dark }}>
                        💬 {request.bidsCount} Bid{request.bidsCount !== 1 ? "s" : ""} Received
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: T.orange }}>
                        View Bids →
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
