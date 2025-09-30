"use client";

import Footer from "@/components/footer/Footer";
import { useMemo, useState } from "react";

type PaymentMethod = {
  id: string;
  type: "card" | "cash" | "certified_check";
  brand?: string;
  last4?: string;
  exp_month?: number;
  exp_year?: number;
  is_default?: boolean;
};

export default function BuyerPaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([
    // UI-only demo data
    {
      id: "pm_card_1",
      type: "card",
      brand: "Visa",
      last4: "4242",
      exp_month: 12,
      exp_year: 2027,
      is_default: true,
    },
    { id: "pm_cash_1", type: "cash" },
    { id: "pm_check_1", type: "certified_check" },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] =
    useState<PaymentMethod["type"]>("card");
  const [draftCard, setDraftCard] = useState<{
    brand: string;
    last4: string;
    exp_month: string;
    exp_year: string;
  }>({ brand: "Visa", last4: "", exp_month: "", exp_year: "" });

  const hasDefault = useMemo(
    () => methods.some((m) => m.is_default),
    [methods]
  );

  function addMethod() {
    if (selectedType === "card") {
      const last4 = (draftCard.last4 || "").trim().slice(-4);
      const exp_month = Number(draftCard.exp_month || 0);
      const exp_year = Number(draftCard.exp_year || 0);
      if (!last4 || !exp_month || !exp_year) return;
      setMethods((s) => [
        ...s,
        {
          id: `pm_card_${Date.now()}`,
          type: "card",
          brand: draftCard.brand || "Card",
          last4,
          exp_month,
          exp_year,
          is_default: !hasDefault,
        },
      ]);
    } else if (selectedType === "cash") {
      setMethods((s) => [
        ...s,
        { id: `pm_cash_${Date.now()}`, type: "cash", is_default: !hasDefault },
      ]);
    } else {
      setMethods((s) => [
        ...s,
        {
          id: `pm_check_${Date.now()}`,
          type: "certified_check",
          is_default: !hasDefault,
        },
      ]);
    }
    setShowAddModal(false);
    setSelectedType("card");
    setDraftCard({ brand: "Visa", last4: "", exp_month: "", exp_year: "" });
  }

  function setDefault(id: string) {
    setMethods((s) => s.map((m) => ({ ...m, is_default: m.id === id })));
  }

  function removeMethod(id: string) {
    setMethods((s) => s.filter((m) => m.id !== id));
  }

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl leading-tight text-[var(--secondary-black)] font-medium">
              Payment Methods
            </h1>
            <p className="text-sm text-[var(--secondary-muted-edge)]">
              Manage cards for faster checkout
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="btn btn-primary h-9 px-4"
              onClick={() => setShowAddModal(true)}
            >
              Add Payment Method
            </button>
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {methods.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2 7h20M2 11h20M2 15h20M2 19h20"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[var(--secondary-black)] mb-2">
                No payment methods
              </h3>
              <p className="text-[var(--primary-base)] mb-6">
                Add a method to speed up checkout
              </p>
              <button
                className="btn btn-primary"
                onClick={() => setShowAddModal(true)}
              >
                Add Payment Method
              </button>
            </div>
          ) : (
            methods.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 grid place-items-center text-sm text-[var(--secondary-black)]">
                    {m.type === "card"
                      ? (m.brand || "C").slice(0, 1)
                      : m.type === "cash"
                      ? "$"
                      : "C"}
                  </div>
                  <div>
                    <div className="text-[var(--secondary-black)] font-medium">
                      {m.type === "card" && `${m.brand} •••• ${m.last4}`}
                      {m.type === "cash" && `Cash`}
                      {m.type === "certified_check" && `Certified Check`}
                    </div>
                    <div className="text-sm text-[var(--primary-base)]">
                      {m.type === "card" &&
                      m.exp_month != null &&
                      m.exp_year != null
                        ? `Expires ${String(m.exp_month).padStart(
                            2,
                            "0"
                          )}/${String(m.exp_year).slice(-2)}`
                        : "Offline payment"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {m.is_default ? (
                    <span className="px-2 py-1 rounded-full text-xs bg-[var(--primary-base)]/10 text-[var(--primary-base)]">
                      Default
                    </span>
                  ) : (
                    <button
                      className="btn btn-ghost h-8 px-3 text-sm"
                      onClick={() => setDefault(m.id)}
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    className="btn btn-ghost h-8 px-3 text-sm"
                    onClick={() => removeMethod(m.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setShowAddModal(false)}
            />
            <div className="relative bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] w-full max-w-md p-5">
              <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
                Add Payment Method
              </h2>
              <p className="text-sm text-[var(--primary-base)] mt-1">
                Choose a method to add
              </p>
              <div className="mt-4 space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-[var(--secondary-soft-highlight)] cursor-pointer">
                  <input
                    type="radio"
                    name="pm-type"
                    checked={selectedType === "card"}
                    onChange={() => setSelectedType("card")}
                  />
                  <div>
                    <div className="text-[var(--secondary-black)] font-medium">
                      Card
                    </div>
                    <div className="text-xs text-[var(--primary-base)]">
                      Visa, Mastercard, etc.
                    </div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-[var(--secondary-soft-highlight)] cursor-pointer">
                  <input
                    type="radio"
                    name="pm-type"
                    checked={selectedType === "cash"}
                    onChange={() => setSelectedType("cash")}
                  />
                  <div>
                    <div className="text-[var(--secondary-black)] font-medium">
                      Cash
                    </div>
                    <div className="text-xs text-[var(--primary-base)]">
                      Pay cash on delivery/pickup
                    </div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-[var(--secondary-soft-highlight)] cursor-pointer">
                  <input
                    type="radio"
                    name="pm-type"
                    checked={selectedType === "certified_check"}
                    onChange={() => setSelectedType("certified_check")}
                  />
                  <div>
                    <div className="text-[var(--secondary-black)] font-medium">
                      Certified Check
                    </div>
                    <div className="text-xs text-[var(--primary-base)]">
                      Bank check on delivery/pickup
                    </div>
                  </div>
                </label>
                {selectedType === "card" && (
                  <div className="mt-1 grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="text-xs text-[var(--primary-base)]">
                        Brand
                      </label>
                      <select
                        className="input h-9 w-full mt-1"
                        value={draftCard.brand}
                        onChange={(e) =>
                          setDraftCard((d) => ({ ...d, brand: e.target.value }))
                        }
                      >
                        <option>Visa</option>
                        <option>Mastercard</option>
                        <option>Amex</option>
                        <option>Discover</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-[var(--primary-base)]">
                        Last 4
                      </label>
                      <input
                        className="input h-9 w-full mt-1"
                        placeholder="1234"
                        inputMode="numeric"
                        value={draftCard.last4}
                        onChange={(e) =>
                          setDraftCard((d) => ({ ...d, last4: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[var(--primary-base)]">
                        Exp. Month
                      </label>
                      <input
                        className="input h-9 w-full mt-1"
                        placeholder="MM"
                        inputMode="numeric"
                        value={draftCard.exp_month}
                        onChange={(e) =>
                          setDraftCard((d) => ({
                            ...d,
                            exp_month: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[var(--primary-base)]">
                        Exp. Year
                      </label>
                      <input
                        className="input h-9 w-full mt-1"
                        placeholder="YYYY"
                        inputMode="numeric"
                        value={draftCard.exp_year}
                        onChange={(e) =>
                          setDraftCard((d) => ({
                            ...d,
                            exp_year: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  className="btn btn-ghost h-9 px-4"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary h-9 px-4"
                  onClick={addMethod}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
