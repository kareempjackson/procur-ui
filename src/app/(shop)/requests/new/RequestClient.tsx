"use client";

import React, { useState } from "react";
import { useAppDispatch } from "@/store";
import { createRequest } from "@/store/slices/buyerRequestsSlice";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

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

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 16px",
  border: `1px solid ${T.border}`,
  borderRadius: 999,
  fontSize: 14,
  background: "#fff",
  color: T.dark,
  outline: "none",
  fontFamily: T.font,
  boxSizing: "border-box",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: "none" as any,
  WebkitAppearance: "none" as any,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: T.dark,
  marginBottom: 6,
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 14,
  border: `1px solid ${T.border}`,
  padding: "20px 24px",
  marginBottom: 16,
};

export default function RequestClient() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { show } = useToast();
  const [formData, setFormData] = useState({
    produceName: "",
    category: "",
    quantity: "",
    unit: "lb",
    qualityGrade: "first-grade",
    deliveryLocation: "",
    deliveryDate: "",
    budgetMin: "",
    budgetMax: "",
    orderType: "one-off",
    recurringFrequency: "weekly",
    urgency: "normal",
    additionalNotes: "",
  });

  const categories = [
    "Vegetables", "Fruits", "Herbs", "Grains",
    "Legumes", "Root Crops", "Leafy Greens", "Meat & Poultry",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const quantityNumber = Number(formData.quantity);
    const payload: any = {
      product_name: formData.produceName,
      category: formData.category || undefined,
      quantity: isNaN(quantityNumber) ? 0 : quantityNumber,
      unit_of_measurement: formData.unit as any,
      date_needed: formData.deliveryDate || undefined,
      description: formData.additionalNotes || undefined,
      budget_range:
        formData.budgetMin || formData.budgetMax
          ? {
              min: Number(formData.budgetMin || 0),
              max: Number(formData.budgetMax || 0),
              currency: "USD",
            }
          : undefined,
    };

    try {
      const action = await dispatch(createRequest(payload) as any);
      if (action.meta.requestStatus === "fulfilled") {
        show("Request submitted! Suppliers will be notified.");
        router.push("/requests");
      } else {
        const err = action.payload || "Failed to submit request";
        show(String(err));
      }
    } catch (err) {
      show("Failed to submit request");
    }
  };

  const pillBtn = (active: boolean): React.CSSProperties => ({
    padding: "7px 16px",
    borderRadius: 999,
    border: active ? "none" : `1px solid ${T.border}`,
    background: active ? T.teal : T.cardBg,
    color: active ? "#fff" : T.dark,
    fontWeight: 500,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: T.font,
  });

  return (
    <div style={{ minHeight: "100vh", background: T.pageBg, fontFamily: T.font }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "28px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.dark, marginBottom: 4 }}>
            Make a Request
          </h1>
          <p style={{ fontSize: 14, color: T.muted }}>
            Can&apos;t find what you&apos;re looking for? Submit a request and let suppliers come to you.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Product Information */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: T.dark, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              🛒 Product Information
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>What are you looking for? *</label>
                <input
                  type="text"
                  name="produceName"
                  value={formData.produceName}
                  onChange={handleInputChange}
                  placeholder="e.g., Organic Cherry Tomatoes"
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  style={selectStyle}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Quantity Needed *</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="100"
                    style={{ ...inputStyle, flex: 1 }}
                    required
                  />
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    style={{ ...selectStyle, width: "auto", minWidth: 80 }}
                  >
                    <option value="lb">lb</option>
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="oz">oz</option>
                    <option value="piece">piece</option>
                    <option value="dozen">dozen</option>
                    <option value="liter">liter</option>
                    <option value="ml">ml</option>
                    <option value="gallon">gallon</option>
                  </select>
                </div>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Quality Grade</label>
                <div style={{ display: "flex", flexWrap: "wrap" as any, gap: 8 }}>
                  {["first-grade", "second-grade", "any"].map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, qualityGrade: grade }))}
                      style={pillBtn(formData.qualityGrade === grade)}
                    >
                      {grade === "first-grade" ? "First Grade" : grade === "second-grade" ? "Second Grade" : "Any Grade"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: T.dark, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              📍 Delivery Details
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Delivery Location *</label>
                <input
                  type="text"
                  name="deliveryLocation"
                  value={formData.deliveryLocation}
                  onChange={handleInputChange}
                  placeholder="City, Country"
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Needed By *</label>
                <input
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleInputChange}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Urgency</label>
                <div style={{ display: "flex", flexWrap: "wrap" as any, gap: 8 }}>
                  {[
                    { value: "low", label: "Low Priority" },
                    { value: "normal", label: "Normal" },
                    { value: "high", label: "High Priority" },
                    { value: "urgent", label: "Urgent" },
                  ].map((u) => (
                    <button
                      key={u.value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, urgency: u.value }))}
                      style={pillBtn(formData.urgency === u.value)}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Budget */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: T.dark, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              💰 Budget
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Minimum Price (per {formData.unit})</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: T.muted, fontSize: 14 }}>$</span>
                  <input
                    type="number"
                    name="budgetMin"
                    value={formData.budgetMin}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    style={{ ...inputStyle, paddingLeft: 28 }}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Maximum Price (per {formData.unit})</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: T.muted, fontSize: 14 }}>$</span>
                  <input
                    type="number"
                    name="budgetMax"
                    value={formData.budgetMax}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    style={{ ...inputStyle, paddingLeft: 28 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Type */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: T.dark, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              📅 Order Type
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap" as any, gap: 8 }}>
              {["one-off", "recurring"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, orderType: type }))}
                  style={pillBtn(formData.orderType === type)}
                >
                  {type === "one-off" ? "One-Off Order" : "Recurring Order"}
                </button>
              ))}
            </div>

            {formData.orderType === "recurring" && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
                <label style={labelStyle}>Delivery Frequency</label>
                <div style={{ display: "flex", flexWrap: "wrap" as any, gap: 8 }}>
                  {["weekly", "biweekly", "monthly"].map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, recurringFrequency: freq }))}
                      style={pillBtn(formData.recurringFrequency === freq)}
                    >
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: T.dark, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              📝 Additional Information
            </h2>
            <label style={labelStyle}>Special Requirements or Notes</label>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleInputChange}
              rows={4}
              placeholder="Include any specific requirements, packaging preferences, delivery instructions, or other details..."
              style={{
                width: "100%",
                padding: "12px 16px",
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                fontSize: 14,
                background: "#fff",
                color: T.dark,
                outline: "none",
                fontFamily: T.font,
                resize: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Info Banner */}
          <div
            style={{
              background: T.cardBg,
              border: `1px solid ${T.border}`,
              borderLeft: `4px solid ${T.teal}`,
              borderRadius: 12,
              padding: "14px 16px",
              marginBottom: 16,
              display: "flex",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>ℹ️</span>
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: T.teal, marginBottom: 4 }}>How it works</h3>
              <p style={{ fontSize: 12, color: T.dark, lineHeight: 1.5 }}>
                Your request will be sent to suppliers in our network that match your criteria.
                You&apos;ll receive quotes and proposals within 24–48 hours. You can then review and choose the best offer.
              </p>
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: "flex", gap: 12 }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: "14px 24px",
                background: T.orange,
                color: "#fff",
                border: "none",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: T.font,
              }}
            >
              Submit Request
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              style={{
                padding: "14px 24px",
                background: "#fff",
                color: T.dark,
                border: `1.5px solid ${T.border}`,
                borderRadius: 999,
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: T.font,
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
