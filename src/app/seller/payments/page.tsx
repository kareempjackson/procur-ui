"use client";

import React from "react";

export default function SellerPaymentsPage() {
  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[color:var(--secondary-black)]">
            Billing & Payments
          </h1>
          <p className="mt-2 text-sm text-[color:var(--secondary-muted-edge)]">
            Manage payout accounts, payment methods, and view invoices.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payout Account */}
          <section className="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-[var(--secondary-soft-highlight)] p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-[color:var(--secondary-black)] mb-4">
              Payout account
            </h2>
            <div className="rounded-2xl border border-[var(--secondary-soft-highlight)] bg-[var(--primary-background)] p-4 flex items-center justify-between">
              <div>
                <div className="text-sm text-[color:var(--secondary-muted-edge)]">
                  Connected account
                </div>
                <div className="font-medium text-[color:var(--secondary-black)]">
                  Not connected
                </div>
              </div>
              <button className="px-4 py-2.5 rounded-full bg-black text-white hover:bg-gray-800">
                Connect
              </button>
            </div>
          </section>

          {/* Payment Methods */}
          <section className="bg-white rounded-3xl shadow-lg border border-[var(--secondary-soft-highlight)] p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-[color:var(--secondary-black)] mb-4">
              Payment methods
            </h2>
            <div className="space-y-3">
              <div className="rounded-xl border border-[var(--secondary-soft-highlight)] bg-[var(--primary-background)] p-4 flex items-center justify-between">
                <div className="text-sm text-[color:var(--secondary-muted-edge)]">
                  No cards added
                </div>
                <button className="px-4 py-2.5 rounded-full border border-[var(--secondary-soft-highlight)] bg-white hover:bg-gray-50">
                  Add card
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Invoices */}
        <section className="mt-6 bg-white rounded-3xl shadow-lg border border-[var(--secondary-soft-highlight)] p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[color:var(--secondary-black)]">
              Invoices
            </h2>
            <button className="px-4 py-2.5 rounded-full border border-[var(--secondary-soft-highlight)] bg-white hover:bg-gray-50">
              Download CSV
            </button>
          </div>
          <div className="rounded-2xl border border-[var(--secondary-soft-highlight)] bg-[var(--primary-background)] p-6 text-sm text-[color:var(--secondary-muted-edge)]">
            No invoices yet.
          </div>
        </section>
      </main>
    </div>
  );
}
