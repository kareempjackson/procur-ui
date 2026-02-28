"use client";

import React, { useState } from "react";
import Link from "next/link";
import SupplierAvatar from "@/components/buyer/SupplierAvatar";
import { addDays, formatShortDate } from "@/lib/utils/date";

const T = {
  pageBg: "#faf8f4",
  cardBg: "#f5f1ea",
  border: "#e8e4dc",
  teal: "#2d4a3e",
  orange: "#d4783c",
  dark: "#1c2b23",
  muted: "#8a9e92",
  font: "'Urbanist', system-ui, sans-serif",
};

type RequestDetailClientProps = {
  requestId: string;
};

export default function RequestDetailClient({ requestId }: RequestDetailClientProps) {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedBidId, setSelectedBidId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const now = new Date();

  const request = {
    id: parseInt(requestId),
    productName: "Organic Cherry Tomatoes",
    quantity: "500 kg",
    deliveryDate: formatShortDate(addDays(now, 14)),
    deliveryLocation: "Kingston, Jamaica",
    status: "active",
    createdDate: formatShortDate(addDays(now, -7)),
    budget: "$2,500 - $3,000",
    orderType: "one-off",
    urgency: "standard",
    qualityGrade: "Grade A",
    additionalNotes:
      "Need fresh, premium quality cherry tomatoes for restaurant supply. Must be organic certified and delivered in refrigerated transport.",
    bids: [
      {
        id: 1,
        supplierName: "Caribbean Farms Co.",
        supplierRating: 4.8,
        supplierReviews: 234,
        price: 2750,
        pricePerUnit: "$5.50/kg",
        deliveryDate: formatShortDate(addDays(now, 14)),
        message:
          "We can provide premium organic cherry tomatoes, GAP certified. Our produce is freshly harvested and we have refrigerated transport available.",
        responseTime: "2 hours ago",
        verified: true,
        status: "pending",
        certifications: ["Organic", "GAP"],
        estimatedDeliveryTime: "Same day",
      },
      {
        id: 2,
        supplierName: "Island Fresh Produce",
        supplierRating: 4.7,
        supplierReviews: 156,
        price: 2650,
        pricePerUnit: "$5.30/kg",
        deliveryDate: formatShortDate(addDays(now, 15)),
        message:
          "High quality tomatoes available. Can deliver on your schedule. We pride ourselves on consistent quality and reliability.",
        responseTime: "5 hours ago",
        verified: true,
        status: "pending",
        certifications: ["Organic", "Local"],
        estimatedDeliveryTime: "Next day",
      },
      {
        id: 3,
        supplierName: "Green Valley Farms",
        supplierRating: 4.6,
        supplierReviews: 98,
        price: 2950,
        pricePerUnit: "$5.90/kg",
        deliveryDate: formatShortDate(addDays(now, 13)),
        message:
          "Premium grade, early delivery available. We can guarantee the highest quality organic tomatoes.",
        responseTime: "1 day ago",
        verified: false,
        status: "pending",
        certifications: ["Hydroponic"],
        estimatedDeliveryTime: "1 day early",
      },
      {
        id: 4,
        supplierName: "Tropical Harvest Ltd",
        supplierRating: 4.9,
        supplierReviews: 189,
        price: 2800,
        pricePerUnit: "$5.60/kg",
        deliveryDate: formatShortDate(addDays(now, 14)),
        message:
          "We specialize in organic produce for commercial clients. Can provide documentation and quality certificates upon request.",
        responseTime: "3 hours ago",
        verified: true,
        status: "pending",
        certifications: ["Organic", "Export Ready", "HACCP"],
        estimatedDeliveryTime: "On time",
      },
      {
        id: 5,
        supplierName: "Spice Island Farms",
        supplierRating: 4.9,
        supplierReviews: 167,
        price: 2700,
        pricePerUnit: "$5.40/kg",
        deliveryDate: formatShortDate(addDays(now, 15)),
        message:
          "Best value for premium quality. We have a proven track record with restaurant chains.",
        responseTime: "6 hours ago",
        verified: true,
        status: "pending",
        certifications: ["Organic", "Fair Trade"],
        estimatedDeliveryTime: "Next day",
      },
    ],
  };

  const handleAccept = (bidId: number) => {
    setSelectedBidId(bidId);
    setShowAcceptModal(true);
  };

  const handleReject = (bidId: number) => {
    setSelectedBidId(bidId);
    setShowRejectModal(true);
  };

  const confirmAccept = () => {
    console.log("Accepting bid:", selectedBidId);
    setShowAcceptModal(false);
  };

  const confirmReject = () => {
    console.log("Rejecting bid:", selectedBidId, "Reason:", rejectReason);
    setShowRejectModal(false);
    setRejectReason("");
  };

  const selectedBid = request.bids.find((bid) => bid.id === selectedBidId);

  return (
    <div style={{ minHeight: "100vh", background: T.pageBg, fontFamily: T.font }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "20px 24px" }}>
          <Link
            href="/requests"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: T.orange,
              textDecoration: "none",
              marginBottom: 16,
            }}
          >
            ← Back to Requests
          </Link>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: T.dark, marginBottom: 4 }}>
                {request.productName}
              </h1>
              <p style={{ fontSize: 13, color: T.muted }}>
                Request #{request.id} • Created on {request.createdDate}
              </p>
            </div>
            <span
              style={{
                background: "#f0f7f4",
                color: T.teal,
                padding: "5px 14px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              ● Active
            </span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>

          {/* Main — Bids */}
          <div>
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                border: `1px solid ${T.border}`,
                padding: "20px 24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: T.dark }}>
                  Bids Received ({request.bids.length})
                </h2>
                <div style={{ fontSize: 13, color: T.muted, display: "flex", alignItems: "center", gap: 8 }}>
                  Sort by:
                  <select
                    style={{
                      marginLeft: 4,
                      padding: "4px 10px",
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      fontSize: 13,
                      fontFamily: T.font,
                      color: T.dark,
                      background: "#fff",
                    }}
                  >
                    <option>Lowest Price</option>
                    <option>Highest Rating</option>
                    <option>Newest</option>
                  </select>
                </div>
              </div>

              {request.bids.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 24px" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: T.dark, marginBottom: 8 }}>No bids yet</h3>
                  <p style={{ fontSize: 13, color: T.muted }}>Suppliers will start sending bids soon. Check back later.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {request.bids.map((bid) => (
                    <div
                      key={bid.id}
                      style={{
                        border: `1px solid ${T.border}`,
                        borderRadius: 12,
                        padding: "16px",
                      }}
                    >
                      {/* Bid Header */}
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                          <SupplierAvatar
                            name={bid.supplierName}
                            imageUrl={(bid as any)?.supplierLogoUrl || (bid as any)?.supplier_logo_url}
                            size="md"
                          />
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                              <span style={{ fontWeight: 600, fontSize: 15, color: T.dark }}>{bid.supplierName}</span>
                              {bid.verified && (
                                <span style={{ color: T.teal, fontWeight: 700, fontSize: 13 }}>✓</span>
                              )}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: T.muted }}>
                              <span style={{ color: "#f59e0b" }}>★</span>
                              <span style={{ fontWeight: 600, color: T.dark }}>{bid.supplierRating}</span>
                              <span>({bid.supplierReviews} reviews)</span>
                              <span>•</span>
                              <span>{bid.responseTime}</span>
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 22, fontWeight: 800, color: T.orange }}>
                            ${bid.price.toLocaleString()}
                          </div>
                          <div style={{ fontSize: 12, color: T.muted }}>{bid.pricePerUnit}</div>
                        </div>
                      </div>

                      {/* Bid Detail Row */}
                      <div style={{ display: "flex", gap: 24, marginBottom: 12 }}>
                        <div>
                          <div style={{ fontSize: 11, color: T.muted, marginBottom: 2 }}>Delivery</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: T.dark }}>{bid.deliveryDate}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: T.muted, marginBottom: 2 }}>Timeline</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: T.dark }}>{bid.estimatedDeliveryTime}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: T.muted, marginBottom: 2 }}>Certifications</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: T.dark }}>{bid.certifications.length}</div>
                        </div>
                      </div>

                      {/* Certifications */}
                      <div style={{ display: "flex", flexWrap: "wrap" as any, gap: 6, marginBottom: 12 }}>
                        {bid.certifications.map((cert) => (
                          <span
                            key={cert}
                            style={{
                              background: T.cardBg,
                              border: `1px solid ${T.border}`,
                              borderRadius: 6,
                              padding: "3px 10px",
                              fontSize: 12,
                              fontWeight: 500,
                              color: T.dark,
                            }}
                          >
                            {cert}
                          </span>
                        ))}
                      </div>

                      {/* Message */}
                      <p
                        style={{
                          fontSize: 13,
                          color: T.dark,
                          background: T.cardBg,
                          borderRadius: 10,
                          padding: "12px 14px",
                          lineHeight: 1.5,
                          marginBottom: 14,
                        }}
                      >
                        {bid.message}
                      </p>

                      {/* Actions */}
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => handleAccept(bid.id)}
                          style={{
                            flex: 1,
                            padding: "10px 16px",
                            background: T.orange,
                            color: "#fff",
                            border: "none",
                            borderRadius: 999,
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: T.font,
                          }}
                        >
                          ✓ Accept Bid
                        </button>
                        <button
                          onClick={() => handleReject(bid.id)}
                          style={{
                            flex: 1,
                            padding: "10px 16px",
                            background: "#fff",
                            color: T.dark,
                            border: `1px solid ${T.border}`,
                            borderRadius: 999,
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: T.font,
                          }}
                        >
                          ✕ Decline
                        </button>
                        <Link
                          href={`/inbox?supplier=${bid.supplierName}`}
                          style={{
                            padding: "10px 16px",
                            background: "#fff",
                            color: T.teal,
                            border: `1.5px solid ${T.teal}`,
                            borderRadius: 999,
                            fontSize: 13,
                            fontWeight: 600,
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          💬 Message
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Request Info */}
            <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${T.border}`, padding: "20px" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: T.dark, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
                ℹ️ Request Details
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { label: "Quantity Needed", value: request.quantity },
                  { label: "Delivery Date", value: request.deliveryDate },
                  { label: "Delivery Location", value: request.deliveryLocation },
                  { label: "Budget Range", value: request.budget },
                  { label: "Quality Grade", value: request.qualityGrade },
                  { label: "Order Type", value: request.orderType.replace("-", " ") },
                  { label: "Urgency", value: request.urgency },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, color: T.muted, marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.dark, textTransform: "capitalize" }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Notes */}
            <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${T.border}`, padding: "20px" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: T.dark, marginBottom: 10 }}>Additional Notes</h3>
              <p style={{ fontSize: 13, color: T.dark, lineHeight: 1.6 }}>{request.additionalNotes}</p>
            </div>

            {/* Quick Actions */}
            <div style={{ background: T.cardBg, borderRadius: 14, border: `1px solid ${T.border}`, padding: "20px" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: T.dark, marginBottom: 12 }}>Quick Actions</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Link
                  href={`/requests/new?edit=${request.id}`}
                  style={{
                    display: "block",
                    padding: "10px 16px",
                    background: "#fff",
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 500,
                    color: T.dark,
                    textDecoration: "none",
                    textAlign: "center",
                  }}
                >
                  Edit Request
                </Link>
                <button
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px 16px",
                    background: "#fff",
                    border: "1px solid #f5c6c6",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#c0392b",
                    cursor: "pointer",
                    fontFamily: T.font,
                  }}
                >
                  Cancel Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accept Bid Modal */}
      {showAcceptModal && selectedBid && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              maxWidth: 420,
              width: "100%",
              padding: "28px 24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "#f0f7f4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  color: T.teal,
                }}
              >
                ✓
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: T.dark }}>Accept Bid</h3>
                <p style={{ fontSize: 13, color: T.muted }}>{selectedBid.supplierName}</p>
              </div>
            </div>

            <div
              style={{
                background: T.cardBg,
                borderRadius: 12,
                padding: "16px",
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: T.muted }}>Total Amount</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: T.orange }}>${selectedBid.price.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: T.muted }}>Delivery</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.dark }}>{selectedBid.deliveryDate}</span>
              </div>
            </div>

            <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.5, marginBottom: 20 }}>
              By accepting this bid, you agree to proceed with this supplier. They will be notified immediately and can start preparing your order.
            </p>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowAcceptModal(false)}
                style={{
                  flex: 1,
                  padding: "11px 16px",
                  background: "#fff",
                  color: T.dark,
                  border: `1px solid ${T.border}`,
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: T.font,
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmAccept}
                style={{
                  flex: 1,
                  padding: "11px 16px",
                  background: T.orange,
                  color: "#fff",
                  border: "none",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: T.font,
                }}
              >
                Confirm Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Bid Modal */}
      {showRejectModal && selectedBid && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              maxWidth: 420,
              width: "100%",
              padding: "28px 24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "#fff0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  color: "#c0392b",
                }}
              >
                ✕
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: T.dark }}>Decline Bid</h3>
                <p style={{ fontSize: 13, color: T.muted }}>{selectedBid.supplierName}</p>
              </div>
            </div>

            <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.5, marginBottom: 16 }}>
              Please provide a reason for declining this bid (optional). This helps suppliers improve their offerings.
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for declining..."
              style={{
                width: "100%",
                padding: "12px 16px",
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                fontSize: 14,
                fontFamily: T.font,
                outline: "none",
                resize: "none",
                marginBottom: 20,
                boxSizing: "border-box",
              }}
              rows={4}
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => { setShowRejectModal(false); setRejectReason(""); }}
                style={{
                  flex: 1,
                  padding: "11px 16px",
                  background: "#fff",
                  color: T.dark,
                  border: `1px solid ${T.border}`,
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: T.font,
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                style={{
                  flex: 1,
                  padding: "11px 16px",
                  background: "#c0392b",
                  color: "#fff",
                  border: "none",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: T.font,
                }}
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
