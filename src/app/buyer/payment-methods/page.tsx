"use client";

import { useEffect, useState } from "react";
import { buyerApi } from "@/lib/api/buyerApi";
import { useToast } from "@/components/ui/use-toast";

type OfflinePaymentMethod =
  | "bank_transfer"
  | "cash_on_delivery"
  | "cheque_on_delivery";

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
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl leading-tight text-[var(--secondary-black)] font-medium">
              Payment Methods
            </h1>
            <p className="text-sm text-[var(--secondary-muted-edge)]">
              Choose your preferred offline payment method for future orders.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] p-5">
          <h2 className="text-sm font-semibold text-[var(--secondary-black)] mb-4">
            Default payment method
          </h2>

          {loading ? (
            <p className="text-sm text-[var(--secondary-muted-edge)]">
              Loading your payment preferences...
            </p>
          ) : (
            <>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-[var(--secondary-soft-highlight)] cursor-pointer hover:border-[var(--primary-accent2)] transition-colors">
                  <input
                    type="radio"
                    name="payment-method"
                    className="mt-0.5"
                    checked={preferredMethod === "bank_transfer"}
                    onChange={() => setPreferredMethod("bank_transfer")}
                  />
                  <div>
                    <div className="text-[var(--secondary-black)] font-medium">
                      Bank transfer
                    </div>
                    <div className="text-xs text-[var(--primary-base)]">
                      Send funds directly from your bank and provide a
                      reference.
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-[var(--secondary-soft-highlight)] cursor-pointer hover:border-[var(--primary-accent2)] transition-colors">
                  <input
                    type="radio"
                    name="payment-method"
                    className="mt-0.5"
                    checked={preferredMethod === "cash_on_delivery"}
                    onChange={() => setPreferredMethod("cash_on_delivery")}
                  />
                  <div>
                    <div className="text-[var(--secondary-black)] font-medium">
                      Cash
                    </div>
                    <div className="text-xs text-[var(--primary-base)]">
                      Pay cash on delivery or pickup.
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-[var(--secondary-soft-highlight)] cursor-pointer hover:border-[var(--primary-accent2)] transition-colors">
                  <input
                    type="radio"
                    name="payment-method"
                    className="mt-0.5"
                    checked={preferredMethod === "cheque_on_delivery"}
                    onChange={() => setPreferredMethod("cheque_on_delivery")}
                  />
                  <div>
                    <div className="text-[var(--secondary-black)] font-medium">
                      Check
                    </div>
                    <div className="text-xs text-[var(--primary-base)]">
                      Provide a bank check on delivery or pickup.
                    </div>
                  </div>
                </label>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  className="btn btn-primary h-9 px-5"
                  onClick={handleSave}
                  disabled={saving || !preferredMethod}
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
