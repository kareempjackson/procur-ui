"use client";

import Link from "next/link";
import { ReactNode } from "react";

type Tab = "Revenue & Orders" | "Category performance" | "Fulfillment health";

type AnalyticsTabsProps = {
  active: Tab;
  onChange: (tab: Tab) => void;
  rightActions?: ReactNode;
};

export default function AnalyticsTabs({
  active,
  onChange,
  rightActions,
}: AnalyticsTabsProps) {
  const tabs: Tab[] = [
    "Revenue & Orders",
    "Category performance",
    "Fulfillment health",
  ];

  const hint =
    active === "Revenue & Orders"
      ? "Track revenue trends and order volume over time"
      : active === "Category performance"
        ? "Revenue and margin breakdown by product category"
        : "Lead time, on-time delivery, and cancellation rates";

  return (
    <section className="mt-12">
      <div className="flex gap-4 border-b border-[color:var(--secondary-soft-highlight)]">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={`px-2 pb-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2 ${
              active === t
                ? "text-[color:var(--secondary-black)] border-b-2 border-[color:var(--primary-base)]"
                : "text-[color:var(--secondary-muted-edge)] hover:text-[color:var(--secondary-black)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-[color:var(--secondary-muted-edge)]">
            {hint}
          </p>
          <div className="flex gap-2">
            {rightActions ?? (
              <>
                <button className="inline-flex items-center justify-center rounded-full border border-[color:var(--secondary-soft-highlight)] bg-transparent text-[color:var(--secondary-muted-edge)] px-4 py-2 text-xs font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2">
                  Export CSV
                </button>
                <button className="inline-flex items-center justify-center rounded-full border border-[color:var(--secondary-soft-highlight)] bg-transparent text-[color:var(--secondary-muted-edge)] px-4 py-2 text-xs font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2">
                  Export PNG
                </button>
              </>
            )}
          </div>
        </div>

        <div className="h-64 rounded-xl bg-gradient-to-br from-[var(--primary-background)] to-white border border-[color:var(--secondary-soft-highlight)]/50 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-sm text-[color:var(--secondary-black)] font-medium">
              No analytics yet
            </div>
            <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
              Add products and complete a few orders to see{" "}
              {active.toLowerCase()}.
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <Link
                href="/seller/add/product"
                className="inline-flex items-center rounded-full bg-[var(--primary-accent2)] text-white px-4 py-2 text-xs font-medium hover:bg-[var(--primary-accent3)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2"
              >
                Add a product
              </Link>
              <Link
                href="/seller/orders"
                className="inline-flex items-center rounded-full border border-[color:var(--secondary-soft-highlight)] bg-transparent text-[color:var(--secondary-black)] px-4 py-2 text-xs font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2"
              >
                View orders
              </Link>
            </div>
            <div className="mt-4">
              <div className="mx-auto h-24 w-full max-w-sm rounded-lg bg-white border border-[color:var(--secondary-soft-highlight)]/60 shadow-sm p-3">
                <div className="h-2 w-16 rounded bg-[var(--primary-base)]/20"></div>
                <div className="mt-3 grid grid-cols-12 gap-1">
                  <div className="col-span-1 h-12 rounded bg-[var(--primary-base)]/15"></div>
                  <div className="col-span-1 h-10 rounded bg-[var(--primary-base)]/25 self-end"></div>
                  <div className="col-span-1 h-8 rounded bg-[var(--primary-base)]/15 self-end"></div>
                  <div className="col-span-1 h-12 rounded bg-[var(--primary-base)]/25"></div>
                  <div className="col-span-1 h-6 rounded bg-[var(--primary-base)]/15 self-end"></div>
                  <div className="col-span-1 h-10 rounded bg-[var(--primary-base)]/25 self-end"></div>
                  <div className="col-span-1 h-7 rounded bg-[var(--primary-base)]/15 self-end"></div>
                  <div className="col-span-1 h-9 rounded bg-[var(--primary-base)]/25 self-end"></div>
                  <div className="col-span-1 h-8 rounded bg-[var(--primary-base)]/15 self-end"></div>
                  <div className="col-span-1 h-11 rounded bg-[var(--primary-base)]/25 self-end"></div>
                  <div className="col-span-1 h-7 rounded bg-[var(--primary-base)]/15 self-end"></div>
                  <div className="col-span-1 h-10 rounded bg-[var(--primary-base)]/25 self-end"></div>
                </div>
              </div>
              <div className="mt-2 text-[10px] text-[color:var(--secondary-muted-edge)]">
                Sample preview
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
