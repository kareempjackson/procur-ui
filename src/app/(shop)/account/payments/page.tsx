"use client";

import { useEffect, useState } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe";
import { buyerApi, type SavedPaymentMethod } from "@/lib/api/buyerApi";
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
  danger: "#c0392b",
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
  return (
    <Elements stripe={getStripe()}>
      <PaymentMethodsInner />
    </Elements>
  );
}

function PaymentMethodsInner() {
  const { show } = useToast();
  const [preferredMethod, setPreferredMethod] =
    useState<OfflinePaymentMethod | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Saved cards
  const [cards, setCards] = useState<SavedPaymentMethod[]>([]);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [showAddCard, setShowAddCard] = useState(false);
  const [working, setWorking] = useState<string | null>(null); // id of card we're mutating

  const refreshCards = async () => {
    try {
      const list = await buyerApi.listPaymentMethods();
      setCards(list);
    } catch (err) {
      console.error("Failed to load saved cards", err);
    } finally {
      setCardsLoading(false);
    }
  };

  useEffect(() => {
    refreshCards();
  }, []);

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

  async function handleSetDefault(id: string) {
    setWorking(id);
    try {
      await buyerApi.setDefaultPaymentMethod(id);
      await refreshCards();
      show("Default card updated");
    } catch (err) {
      console.error(err);
      show("Failed to update default card");
    } finally {
      setWorking(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this saved card?")) return;
    setWorking(id);
    try {
      await buyerApi.deletePaymentMethod(id);
      await refreshCards();
      show("Card removed");
    } catch (err) {
      console.error(err);
      show("Failed to remove card");
    } finally {
      setWorking(null);
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
            Manage saved cards or choose your preferred offline payment method.
          </p>
        </div>

        {/* Saved cards */}
        <div
          style={{
            background: T.cardBg,
            borderRadius: T.cardRadius,
            border: `1px solid ${T.cardBorder}`,
            padding: 20,
            maxWidth: 560,
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: T.dark, margin: 0 }}>
              Saved cards
            </h2>
            {!showAddCard && (
              <button
                type="button"
                onClick={() => setShowAddCard(true)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.orange,
                  cursor: "pointer",
                  fontFamily: T.font,
                }}
              >
                + Add card
              </button>
            )}
          </div>

          {cardsLoading ? (
            <p style={{ fontSize: 13, color: T.muted }}>Loading saved cards...</p>
          ) : cards.length === 0 && !showAddCard ? (
            <p style={{ fontSize: 13, color: T.muted }}>
              No cards saved yet. Add one to enable instant card checkout.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cards.map((c) => (
                <div
                  key={c.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 14,
                    background: "#fff",
                    border: `1px solid ${T.cardBorder}`,
                    borderRadius: 10,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.dark }}>
                      {(c.brand || "card").toUpperCase()} •••• {c.last4 || "????"}
                      {c.is_default && (
                        <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, color: T.teal, background: `${T.teal}1A`, padding: "1px 6px", borderRadius: 4 }}>
                          Default
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11.5, color: T.muted, marginTop: 2 }}>
                      Expires {String(c.exp_month).padStart(2, "0")}/{String(c.exp_year).slice(-2)}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {!c.is_default && (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(c.id)}
                        disabled={working === c.id}
                        style={{ background: "none", border: "none", color: T.teal, fontSize: 12, fontWeight: 600, cursor: working === c.id ? "wait" : "pointer", fontFamily: T.font }}
                      >
                        Make default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      disabled={working === c.id}
                      style={{ background: "none", border: "none", color: T.danger, fontSize: 12, fontWeight: 600, cursor: working === c.id ? "wait" : "pointer", fontFamily: T.font }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showAddCard && (
            <AddCardForm
              onCancel={() => setShowAddCard(false)}
              onAdded={async () => {
                setShowAddCard(false);
                await refreshCards();
                show("Card added");
              }}
              onError={(msg) => show(msg)}
            />
          )}
        </div>

        {/* Offline preferred method */}
        <div style={{ background: T.cardBg, borderRadius: T.cardRadius, border: `1px solid ${T.cardBorder}`, padding: 20, maxWidth: 560 }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: T.dark, marginBottom: 16, margin: "0 0 16px 0" }}>
            Preferred offline method
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

function AddCardForm({
  onCancel,
  onAdded,
  onError,
}: {
  onCancel: () => void;
  onAdded: () => Promise<void> | void;
  onError: (msg: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    if (!stripe || !elements) {
      setError("Stripe is not ready yet. Please try again.");
      return;
    }
    const cardEl = elements.getElement(CardElement);
    if (!cardEl) {
      setError("Card form is not ready.");
      return;
    }

    setSubmitting(true);
    try {
      const { client_secret } = await buyerApi.createSetupIntent();
      const { setupIntent, error: confirmErr } =
        await stripe.confirmCardSetup(client_secret, {
          payment_method: { card: cardEl },
        });
      if (confirmErr || !setupIntent || setupIntent.status !== "succeeded") {
        const msg =
          confirmErr?.message ||
          "We couldn't save that card. Please try again.";
        setError(msg);
        onError(msg);
        return;
      }
      const pmId =
        typeof setupIntent.payment_method === "string"
          ? setupIntent.payment_method
          : setupIntent.payment_method?.id;
      if (!pmId) throw new Error("Stripe did not return a payment method id");
      await buyerApi.confirmPaymentMethod(pmId);
      await onAdded();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to add card";
      setError(typeof msg === "string" ? msg : "Failed to add card");
      onError("Failed to add card");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: 14, padding: 14, background: "#fff", border: `1px solid ${T.cardBorder}`, borderRadius: 10 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: T.dark, marginBottom: 10 }}>
        Add a new card
      </div>
      <div style={{ padding: "12px 14px", borderRadius: 8, border: `1px solid ${T.cardBorder}`, background: "#fafaf9" }}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "13px",
                color: T.dark,
                fontFamily: T.font,
                "::placeholder": { color: T.muted },
              },
              invalid: { color: T.danger },
            },
            hidePostalCode: true,
          }}
          onChange={(e) => {
            setComplete(e.complete);
            setError(e.error?.message || null);
          }}
        />
      </div>
      {error && (
        <div style={{ marginTop: 8, fontSize: 12, color: T.danger }}>{error}</div>
      )}
      <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          style={{ padding: "8px 16px", borderRadius: T.btnRadius, background: "transparent", border: `1px solid ${T.cardBorder}`, color: T.dark, fontWeight: 600, fontSize: 13, cursor: submitting ? "wait" : "pointer", fontFamily: T.font }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || !complete}
          style={{ padding: "8px 18px", borderRadius: T.btnRadius, background: submitting || !complete ? "#d1d5db" : T.orange, color: "#fff", fontWeight: 600, fontSize: 13, border: "none", cursor: submitting || !complete ? "not-allowed" : "pointer", fontFamily: T.font }}
        >
          {submitting ? "Saving..." : "Save card"}
        </button>
      </div>
    </div>
  );
}
