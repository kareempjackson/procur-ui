"use client";

import React from "react";

type RatingValue = 1 | 2 | 3 | 4 | 5;

const EMAIL_LOGO_URL =
  "https://dbuxyviftwahgrgiftrw.supabase.co/storage/v1/object/public/public/main-logo/procur-logo.svg";
const CURRENT_YEAR = new Date().getFullYear();

const ratingLabels: Record<RatingValue, string> = {
  1: "Very poor",
  2: "Needs work",
  3: "Okay",
  4: "Good",
  5: "Excellent",
};

const quickTags = [
  "On-time delivery",
  "Quality produce",
  "Clear communication",
  "Flexible on quantities",
  "Helpful logistics",
  "Great pricing",
];

const BrandHeader: React.FC = () => (
  <div className="border border-gray-200 rounded-2xl bg-white px-6 py-4 flex items-center justify-center mb-4">
    <img src={EMAIL_LOGO_URL} alt="Procur logo" className="h-8 w-auto" />
  </div>
);

const BrandFooter: React.FC = () => (
  <div className="border border-gray-200 rounded-2xl bg-[#fafafa] px-6 py-3 text-[0.68rem] text-[var(--primary-base)] text-center mt-4">
    <p>© {CURRENT_YEAR} Procur Grenada Ltd. All rights reserved.</p>
    <p>
      Procur Grenada Ltd. Annandale, St. Georges, Grenada W.I., 473-538-4365
    </p>
  </div>
);

const ReviewStarRow: React.FC<{
  name: string;
  label: string;
  helper?: string;
}> = ({ name, label, helper }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-[var(--secondary-black)]">
          {label}
        </p>
        {helper && (
          <p className="text-xs text-[var(--primary-base)]">{helper}</p>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        {(Object.keys(ratingLabels) as unknown as RatingValue[]).map(
          (value) => (
            <label
              key={`${name}-${value}`}
              className="relative inline-flex cursor-pointer"
            >
              <input
                type="radio"
                name={name}
                value={value}
                className="sr-only"
                defaultChecked={value === 4}
              />
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:border-[var(--primary-accent2)] text-xs font-medium text-[var(--primary-base)]">
                {value}
              </span>
            </label>
          )
        )}
      </div>
    </div>
  </div>
);

const TestReviewsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Page header */}
        <header className="mb-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--primary-base)] mb-2">
                Test · Reviews
              </p>
              <h1 className="text-3xl sm:text-4xl font-semibold text-[var(--secondary-black)] mb-3">
                Review form gallery
              </h1>
              <p className="text-sm sm:text-base text-[var(--primary-base)] max-w-2xl">
                A simple Procur review form with branded header and footer.
                Buyers can quickly rate suppliers after an order is fulfilled.
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-2 text-right">
              <span className="text-xs uppercase tracking-[0.16em] text-[var(--primary-base)]">
                Internal
              </span>
              <span className="text-sm text-[var(--primary-base)]">
                Route:{" "}
                <code className="px-2 py-1 rounded-full bg-white border border-gray-200 text-xs">
                  /test/reviews
                </code>
              </span>
            </div>
          </div>
        </header>

        <main className="space-y-10">
          <section>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex flex-col gap-2">
                <span className="uppercase tracking-[0.16em] text-xs text-[var(--primary-base)]">
                  Review concept
                </span>
                <h2 className="text-xl font-semibold text-[var(--secondary-black)]">
                  Quick order review
                </h2>
                <p className="text-sm text-[var(--primary-base)] max-w-xl">
                  A lightweight, one-screen review that buyers can complete in
                  under 30 seconds after an order is fulfilled.
                </p>
              </div>
            </div>

            <div className="max-w-3xl">
              <BrandHeader />
              <div className="bg-white rounded-3xl border border-gray-200 shadow-[0_18px_40px_rgba(15,23,42,0.06)] p-6 sm:p-8">
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--primary-base)] mb-1">
                    Order review
                  </p>
                  <p className="text-lg font-semibold text-[var(--secondary-black)] mb-1">
                    How was your experience with this supplier?
                  </p>
                  <p className="text-xs text-[var(--primary-base)]">
                    Order{" "}
                    <code className="px-1 py-0.5 rounded bg-gray-50 border border-gray-100 text-[0.68rem]">
                      {"{order_number}"}
                    </code>{" "}
                    ·{" "}
                    <code className="px-1 py-0.5 rounded bg-gray-50 border border-gray-100 text-[0.68rem]">
                      {"{product_name}"}
                    </code>{" "}
                    ·{" "}
                    <code className="px-1 py-0.5 rounded bg-gray-50 border border-gray-100 text-[0.68rem]">
                      {"{quantity}"}
                    </code>{" "}
                    <code className="px-1 py-0.5 rounded bg-gray-50 border border-gray-100 text-[0.68rem]">
                      {"{unit}"}
                    </code>
                  </p>
                </div>

                <form className="space-y-6">
                  <ReviewStarRow
                    name="overall_rating"
                    label="Overall experience"
                    helper="Think about quality, delivery and communication."
                  />

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-[var(--secondary-black)]">
                      What went well?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {quickTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs text-[var(--primary-base)] hover:border-[var(--primary-accent2)] hover:text-[var(--primary-accent2)]"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="short-feedback"
                      className="text-sm font-medium text-[var(--secondary-black)]"
                    >
                      One thing you’d highlight to other buyers
                    </label>
                    <textarea
                      id="short-feedback"
                      rows={3}
                      className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-[var(--secondary-black)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                      placeholder="Share a short comment about this supplier or delivery."
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-gray-100 mt-2">
                    <p className="text-xs text-[var(--primary-base)] max-w-sm">
                      Your review helps us keep standards high across Procur.
                      Only buyers and admins will see the full details.
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="btn btn-ghost rounded-full px-4 py-2 text-xs"
                      >
                        Skip
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary rounded-full px-5 py-2 text-xs"
                      >
                        Submit review
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <BrandFooter />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default TestReviewsPage;
