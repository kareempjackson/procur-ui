"use client";

import { useEffect, useState } from "react";
import { buyerApi } from "@/lib/api/buyerApi";
import { useToast } from "@/components/ui/use-toast";

// Design tokens
const T = {
  pageBg: "#faf8f4",
  cardBg: "#f5f1ea",
  cardBorder: "#e8e4dc",
  teal: "#2d4a3e",
  orange: "#d4783c",
  dark: "#1c2b23",
  muted: "#8a9e92",
  font: "'Urbanist', system-ui, sans-serif",
  cardRadius: 12,
  btnRadius: 999,
};

type OfflinePaymentMethod =
  | "bank_transfer"
  | "cash_on_delivery"
  | "cheque_on_delivery";

const paymentOptions: {
  value: OfflinePaymentMethod;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "bank_transfer",
    label: "Bank transfer",
    description: "Send funds directly from your bank and provide a reference.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    value: "cash_on_delivery",
    label: "Cash",
    description: "Pay cash on delivery or pickup.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="2" />
        <path d="M6 12h.01M18 12h.01" />
      </svg>
    ),
  },
  {
    value: "cheque_on_delivery",
    label: "Check",
    description: "Provide a bank check on delivery or pickup.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
];

export default function BuyerPaymentMethodsPage() {
  const { show } = useToast();
  const [preferredMethod, setPreferredMethod] =
    useState<OfflinePaymentMethod | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadPreferences() {
      try {
        const prefs = await buyerApi.getPreferences();
        const method =
          prefs?.preferences_data?.preferred_offline_payment_method ?? null;

        if (!isMounted) return;

        if (
          method === "bank_transfer" ||
          method === "cash_on_delivery" ||
          method === "cheque_on_delivery"
        ) {
          setPreferredMethod(method);
        } else {
          setPreferredMethod("bank_transfer");
        }
      } catch (err) {
        console.error("Failed to load buyer preferences", err);
        if (isMounted) {
          setPreferredMethod("bank_transfer");
          show("Unable to load saved payment preference. Using a default.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadPreferences();

    return () => {
      isMounted = false;
    };
  }, [show]);

  async function handleSave() {
    if (!preferredMethod) return;

    try {
      setSaving(true);
      await buyerApi.updatePreferences({
        preferences_data: {
          preferred_offline_payment_method: preferredMethod,
        },
      });
      show("Payment preference saved");
    } catch (err) {
      console.error("Failed to save payment preference", err);
      show("Failed to save payment preference. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: T.pageBg, fontFamily: T.font }}>
      <main style={{ maxWidth: 1152, margin: "0 auto", padding: "40px 24px" }}>
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: T.teal, margin: 0 }}>
            Payment Methods
          </h1>
          <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>
            Choose your preferred offline payment method for future orders.
          </p>
        </div>

        <div style={{ background: T.cardBg, borderRadius: T.cardRadius, border: `1px solid ${T.cardBorder}`, padding: 20, maxWidth: 560 }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: T.dark, marginBottom: 16, margin: "0 0 16px 0" }}>
            Default payment method
          </h2>

          {loading ? (
            <p style={{ fontSize: 13, color: T.muted }}>
              Loading your payment preferences...
            </p>
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {paymentOptions.map((option) => {
                  const isSelected = preferredMethod === option.value;
                  return (
                    <label
                      key={option.value}
                      style={{
                        display: "flex", alignItems: "flex-start", gap: 14,
                        padding: 16, borderRadius: T.cardRadius,
                        border: isSelected ? `1.5px solid ${T.teal}` : `1px solid ${T.cardBorder}`,
                        cursor: "pointer",
                        background: isSelected ? `${T.teal}08` : "#fff",
                        transition: "border-color 0.15s, background 0.15s",
                      }}
                    >
                      {/* Hidden native radio */}
                      <input
                        type="radio"
                        name="payment-method"
                        checked={isSelected}
                        onChange={() => setPreferredMethod(option.value)}
                        style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
                      />

                      {/* Custom radio indicator */}
                      <div
                        style={{
                          width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                          border: isSelected ? `5px solid ${T.teal}` : `2px solid ${T.cardBorder}`,
                          background: isSelected ? "#fff" : "#fff",
                          marginTop: 2,
                          transition: "border-color 0.15s",
                        }}
                      />

                      {/* Icon */}
                      <div style={{ color: isSelected ? T.teal : T.muted, flexShrink: 0, marginTop: 1 }}>
                        {option.icon}
                      </div>

                      {/* Text */}
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: T.dark, marginBottom: 2 }}>
                          {option.label}
                        </div>
                        <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>
                          {option.description}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || !preferredMethod}
                  style={{
                    padding: "10px 28px", borderRadius: T.btnRadius,
                    background: saving || !preferredMethod ? "#d1d5db" : T.orange,
                    color: saving || !preferredMethod ? "#9ca3af" : "#fff",
                    fontWeight: 600, fontSize: 14, border: "none",
                    cursor: saving || !preferredMethod ? "not-allowed" : "pointer",
                    fontFamily: T.font, transition: "background 0.15s",
                  }}
                >
                  {saving ? "Saving..." : "Save Preference"}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
