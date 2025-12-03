"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";

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
  farmVerified?: boolean;
};

export default function AccountSetupLoader({
  completedCount,
  totalCount,
  onOpen,
  farmVerified,
}: AccountSetupLoaderProps) {
  const [flags, setFlags] = useState({
    business: false,
    farmVisit: false,
    payout: false,
  });

  useEffect(() => {
    try {
      const hasWindow = typeof window !== "undefined";
      const business =
        hasWindow &&
        !!localStorage.getItem("onboarding:business_profile_completed");
      const payout =
        hasWindow && !!localStorage.getItem("onboarding:payments_completed");
      let farmVisit =
        hasWindow && !!localStorage.getItem("onboarding:farm_visit_booked");

      // If the farm is verified by an admin, treat the "Book Farm Visit"
      // onboarding step as completed, even if it wasn't explicitly marked
      // in localStorage before.
      if (farmVerified) {
        farmVisit = true;
        if (hasWindow) {
          try {
            localStorage.setItem("onboarding:farm_visit_booked", "true");
          } catch {
            // ignore storage write errors
          }
        }
      }

      setFlags({ business, farmVisit, payout });
    } catch (_) {
      // ignore
    }
  }, [farmVerified]);

  const steps = useMemo(
    () => [
      {
        id: "business",
        label: "Company & Compliance",
        sub: "Business details and Farmer ID",
        href: "/seller/business",
        completed: flags.business,
      },
      {
        id: "farmVisit",
        label: "Book Farm Visit",
        sub: "Request an on-site visit to verify your farm",
        href: "/seller",
        completed: flags.farmVisit,
      },
      {
        id: "payout",
        label: "Payouts",
        sub: "Connect your bank account",
        href: "/seller/business",
        completed: flags.payout,
      },
    ],
    [flags]
  );

  const allItems: ChecklistItem[] = useMemo(
    () =>
      steps.map((s) => ({
        id: s.id,
        label: s.label,
        href: s.href,
        completed: s.completed,
      })),
    [steps]
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
            Continue Setup
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute right-0 top-0 h-full w-full sm:w-[28rem] bg-white border-l border-[color:var(--secondary-soft-highlight)] shadow-xl animate-in slide-in-from-right duration-200">
            <div className="flex items-start justify-between p-5 border-b border-[color:var(--secondary-soft-highlight)]/40">
              <div>
                <h2 className="text-lg font-semibold text-[color:var(--secondary-black)]">
                  Getting your farm ready
                </h2>
                <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
                  Complete these steps to go live. Physical goods only.
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

            <div className="p-5">
              <div className="mb-4">
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-[var(--primary-accent2)] transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-[color:var(--secondary-muted-edge)]">
                  <span>
                    {done}/{total} completed
                  </span>
                </div>
              </div>

              <ol className="space-y-3">
                {steps.map((step, idx) => (
                  <li
                    key={step.id}
                    className={`p-3 rounded-xl border transition-colors ${
                      step.completed
                        ? "border-green-200 bg-green-50/40"
                        : "border-[color:var(--secondary-soft-highlight)] hover:bg-black/[0.02]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[color:var(--secondary-black)]">
                            {idx + 1}. {step.label}
                          </span>
                          {step.completed ? (
                            <CheckCircleIcon className="h-4 w-4 text-green-600" />
                          ) : (
                            <ExclamationCircleIcon className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                          {step.sub}
                        </div>
                      </div>
                      <div className="shrink-0 self-center">
                        <Link
                          href={step.href}
                          onClick={() => setOpen(false)}
                          className={`inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                            step.completed
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "bg-[var(--primary-accent2)] text-white hover:bg-[var(--primary-accent3)]"
                          }`}
                        >
                          {step.completed ? "Review" : "Start"}
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-5 text-[11px] text-[color:var(--secondary-muted-edge)]">
                Tip: You can update these anytime. Finish within 72 hours for a
                bonus.
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
