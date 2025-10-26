"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ChecklistItem = {
  id: string;
  label: string;
  href: string;
  completed?: boolean;
};

type AccountSetupLoaderProps = {
  completedCount?: number;
  totalCount?: number;
  onOpen?: () => void;
};

export default function AccountSetupLoader({
  completedCount,
  totalCount,
  onOpen,
}: AccountSetupLoaderProps) {
  const [flags, setFlags] = useState({
    business: false,
    product: false,
    payout: false,
  });

  useEffect(() => {
    try {
      const business =
        typeof window !== "undefined" &&
        !!localStorage.getItem("onboarding:business_profile_completed");
      const payout =
        typeof window !== "undefined" &&
        !!localStorage.getItem("onboarding:payments_completed");
      const product =
        typeof window !== "undefined" &&
        !!localStorage.getItem("onboarding:product_added");
      setFlags({ business, product, payout });
    } catch (_) {
      // ignore
    }
  }, []);

  const allItems: ChecklistItem[] = useMemo(
    () => [
      {
        id: "business",
        label: "Complete business profile",
        href: "/seller/business",
        completed: flags.business,
      },
      {
        id: "product",
        label: "Add first product",
        href: "/seller/add/product",
        completed: flags.product,
      },
      {
        id: "payout",
        label: "Set up payout method",
        href: "/seller/business",
        completed: flags.payout,
      },
    ],
    [flags]
  );

  const visibleItems = allItems.filter((i) => !i.completed);

  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const total = totalCount ?? allItems.length;
  const done = completedCount ?? allItems.filter((i) => i.completed).length;
  const progress = Math.min(100, Math.round((done / Math.max(1, total)) * 100));

  return (
    <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-[color:var(--secondary-black)] font-medium">
            {done} of {total} steps completed — Finish setting up your seller
            profile
          </p>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-[var(--primary-accent2)] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="shrink-0">
          <button
            onClick={() => {
              setOpen(true);
              onOpen?.();
            }}
            className="inline-flex items-center justify-center rounded-full bg-[var(--primary-accent2)] text-white px-4 py-2 text-xs sm:text-sm font-medium hover:bg-[var(--primary-accent3)] transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2"
          >
            Complete Setup
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] w-full max-w-md p-6 mx-4 animate-in fade-in duration-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[color:var(--secondary-black)]">
                  Finish onboarding
                </h2>
                <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
                  Complete the steps below to finish setup
                </p>
              </div>
              <button
                className="text-[color:var(--secondary-muted-edge)] hover:text-[color:var(--secondary-black)]"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {visibleItems.length === 0 ? (
                <div className="text-sm text-[color:var(--secondary-muted-edge)]">
                  All set! You’ve completed the essential setup steps.
                </div>
              ) : (
                visibleItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex items-center justify-between p-3 rounded-xl border border-[color:var(--secondary-soft-highlight)] hover:bg-black/[0.02] transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <span className="text-sm text-[color:var(--secondary-black)]">
                      {item.label}
                    </span>
                    <span className="text-[11px] text-[color:var(--secondary-muted-edge)]">
                      Open →
                    </span>
                  </Link>
                ))
              )}
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div className="text-xs text-[color:var(--secondary-muted-edge)]">
                {done} of {total} completed
              </div>
              <button
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center rounded-full bg-[var(--primary-base)] text-white px-4 py-2 text-xs font-medium hover:opacity-90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
