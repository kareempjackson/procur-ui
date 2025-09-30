"use client";

import React from "react";
import { useAppSelector } from "@/store";
import { selectAuthUser } from "@/store/slices/authSlice";

export default function SellerBusinessSettingsPage() {
  const user = useAppSelector(selectAuthUser);

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[color:var(--secondary-black)]">
            Business Settings
          </h1>
          <p className="mt-2 text-sm text-[color:var(--secondary-muted-edge)]">
            Update your organization details and preferences.
          </p>
        </div>

        {/* Card */}
        <section className="bg-white rounded-3xl shadow-lg border border-[var(--secondary-soft-highlight)] p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[color:var(--secondary-muted-edge)] mb-1">
                Business name
              </label>
              <input
                type="text"
                defaultValue={user?.organizationName || ""}
                placeholder="Your business name"
                className="w-full rounded-xl border border-[var(--secondary-soft-highlight)] bg-[var(--primary-background)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary-base)]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[color:var(--secondary-muted-edge)] mb-1">
                Organization ID
              </label>
              <input
                type="text"
                disabled
                value={user?.organizationId || "Unassigned"}
                className="w-full rounded-xl border border-[var(--secondary-soft-highlight)] bg-gray-50 text-gray-600 px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[color:var(--secondary-muted-edge)] mb-1">
                Your role
              </label>
              <input
                type="text"
                disabled
                value={user?.organizationRole || "Member"}
                className="w-full rounded-xl border border-[var(--secondary-soft-highlight)] bg-gray-50 text-gray-600 px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[color:var(--secondary-muted-edge)] mb-1">
                Business website
              </label>
              <input
                type="url"
                placeholder="https://example.com"
                className="w-full rounded-xl border border-[var(--secondary-soft-highlight)] bg-[var(--primary-background)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary-base)]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-[color:var(--secondary-muted-edge)] mb-1">
                Business description
              </label>
              <textarea
                rows={4}
                placeholder="Describe your business, specialties, and values..."
                className="w-full rounded-xl border border-[var(--secondary-soft-highlight)] bg-[var(--primary-background)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary-base)]"
              />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3">
            <button className="px-5 py-2.5 rounded-full border border-[var(--secondary-soft-highlight)] bg-white hover:bg-gray-50 text-[color:var(--secondary-black)]">
              Cancel
            </button>
            <button className="px-5 py-2.5 rounded-full bg-black text-white hover:bg-gray-800">
              Save changes
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
