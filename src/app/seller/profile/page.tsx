"use client";

import React from "react";
import { useAppSelector } from "@/store";
import { selectAuthUser } from "@/store/slices/authSlice";

export default function SellerProfilePage() {
  const user = useAppSelector(selectAuthUser);
  const displayName =
    (user?.fullname && user.fullname.trim()) ||
    (user?.email ? user.email.split("@")[0] : "User");
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    displayName
  )}&background=407178&color=fff`;

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[color:var(--secondary-black)]">
            Profile Settings
          </h1>
          <p className="mt-2 text-sm text-[color:var(--secondary-muted-edge)]">
            Manage your personal information and account preferences.
          </p>
        </div>

        {/* Card */}
        <section className="bg-white rounded-3xl shadow-lg border border-[var(--secondary-soft-highlight)] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
            <div className="flex-shrink-0">
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border border-[var(--secondary-soft-highlight)] object-cover"
              />
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[color:var(--secondary-muted-edge)] mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  defaultValue={user?.fullname || ""}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-[var(--secondary-soft-highlight)] bg-[var(--primary-background)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary-base)]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[color:var(--secondary-muted-edge)] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={user?.email || ""}
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-[var(--secondary-soft-highlight)] bg-[var(--primary-background)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary-base)]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[color:var(--secondary-muted-edge)] mb-1">
                  Account type
                </label>
                <input
                  type="text"
                  disabled
                  value={(user?.accountType || "").toString()}
                  className="w-full rounded-xl border border-[var(--secondary-soft-highlight)] bg-gray-50 text-gray-600 px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[color:var(--secondary-muted-edge)] mb-1">
                  Organization
                </label>
                <input
                  type="text"
                  defaultValue={user?.organizationName || ""}
                  placeholder="Organization name"
                  className="w-full rounded-xl border border-[var(--secondary-soft-highlight)] bg-[var(--primary-background)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary-base)]"
                />
              </div>
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
