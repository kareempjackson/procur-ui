"use client";

import React from "react";

type RatingValue = 1 | 2 | 3 | 4 | 5;

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

const ReviewStarRow: React.FC<{
  name: string;
  label: string;
  helper?: string;
}> = ({ name, label, helper }) => {
  return (
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
};

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
                On-brand review flows that we can use when buyers rate
                suppliers, orders and request outcomes on Procur.
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
          {/* Variant 1 – Quick star review */}
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
                  under 30 seconds after an order or request is fulfilled.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 shadow-[0_18px_40px_rgba(15,23,42,0.06)] p-6 sm:p-8 max-w-3xl">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--primary-base)] mb-1">
                    Order review
                  </p>
                  <p className="text-lg font-semibold text-[var(--secondary-black)]">
                    How was your experience with this supplier?
                  </p>
                  <p className="text-xs text-[var(--primary-base)] mt-1">
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
                    Your review helps us keep standards high across Procur. Only
                    buyers and admins will see the full details.
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
          </section>

          {/* Variant 2 – Detailed supplier review */}
          <section>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex flex-col gap-2">
                <span className="uppercase tracking-[0.16em] text-xs text-[var(--primary-base)]">
                  Review concept
                </span>
                <h2 className="text-xl font-semibold text-[var(--secondary-black)]">
                  Detailed supplier review
                </h2>
                <p className="text-sm text-[var(--primary-base)] max-w-xl">
                  A richer form used after multiple orders or long-running
                  programs to capture structured feedback on reliability and
                  quality.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 shadow-[0_18px_40px_rgba(15,23,42,0.06)] p-6 sm:p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--secondary-black)]">
                      Supplier
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-[var(--secondary-black)]"
                      defaultValue="{{supplier_name}}"
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--secondary-black)]">
                      Program / request
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-[var(--secondary-black)]"
                      defaultValue="{{request_code}}"
                      readOnly
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ReviewStarRow
                    name="quality_rating"
                    label="Product quality"
                    helper="Freshness, grading and consistency."
                  />
                  <ReviewStarRow
                    name="reliability_rating"
                    label="Reliability"
                    helper="On-time delivery and availability."
                  />
                  <ReviewStarRow
                    name="communication_rating"
                    label="Communication"
                    helper="Responsiveness and clarity."
                  />
                  <ReviewStarRow
                    name="value_rating"
                    label="Value for money"
                    helper="Pricing vs. quality delivered."
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="improvements"
                    className="text-sm font-medium text-[var(--secondary-black)]"
                  >
                    Anything they could improve next time?
                  </label>
                  <textarea
                    id="improvements"
                    rows={3}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-[var(--secondary-black)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                    placeholder="Optional – share constructive feedback to help this supplier improve."
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="internal-notes"
                    className="text-sm font-medium text-[var(--secondary-black)]"
                  >
                    Internal notes (only your organisation sees this)
                  </label>
                  <textarea
                    id="internal-notes"
                    rows={3}
                    className="w-full rounded-2xl border border-dashed border-gray-200 bg-[var(--primary-background)] px-4 py-3 text-sm text-[var(--secondary-black)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                    placeholder="Optional – capture any context for your procurement or QA team."
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-gray-100 mt-2">
                  <div className="flex items-center gap-2 text-xs text-[var(--primary-base)]">
                    <input
                      type="checkbox"
                      id="share-with-supplier"
                      className="w-4 h-4 rounded border-gray-300 text-[var(--primary-accent2)] focus:ring-[var(--primary-accent2)]"
                    />
                    <label htmlFor="share-with-supplier">
                      Share an anonymised summary with the supplier
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-ghost rounded-full px-4 py-2 text-xs"
                    >
                      Save draft
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
          </section>

          {/* Variant 3 – Request outcome review */}
          <section>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex flex-col gap-2">
                <span className="uppercase tracking-[0.16em] text-xs text-[var(--primary-base)]">
                  Review concept
                </span>
                <h2 className="text-xl font-semibold text-[var(--secondary-black)]">
                  Request outcome feedback
                </h2>
                <p className="text-sm text-[var(--primary-base)] max-w-xl">
                  Short form to understand whether a sourcing request was
                  successfully filled, partially filled or cancelled – useful
                  for program reporting.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 shadow-[0_18px_40px_rgba(15,23,42,0.06)] p-6 sm:p-8 max-w-3xl">
              <form className="space-y-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-[var(--secondary-black)]">
                    How did this request end?
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {[
                      "Fully supplied via Procur",
                      "Partially supplied via Procur",
                      "Supplied outside Procur",
                      "Cancelled – no longer needed",
                    ].map((option) => (
                      <label
                        key={option}
                        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 cursor-pointer hover:border-[var(--primary-accent2)]"
                      >
                        <input
                          type="radio"
                          name="request_outcome"
                          className="w-3.5 h-3.5 text-[var(--primary-accent2)] focus:ring-[var(--primary-accent2)]"
                        />
                        <span className="text-[var(--primary-base)]">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="impact"
                    className="text-sm font-medium text-[var(--secondary-black)]"
                  >
                    Impact on your operations
                  </label>
                  <textarea
                    id="impact"
                    rows={3}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-[var(--secondary-black)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                    placeholder="Optional – did this request help you avoid shortages, secure better pricing, or improve planning?"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="platform-feedback"
                    className="text-sm font-medium text-[var(--secondary-black)]"
                  >
                    Feedback on the Procur request flow
                  </label>
                  <textarea
                    id="platform-feedback"
                    rows={3}
                    className="w-full rounded-2xl border border-gray-200 bg-[var(--primary-background)] px-4 py-3 text-sm text-[var(--secondary-black)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                    placeholder="Share anything that would make it easier to create and manage future requests."
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-gray-100 mt-2">
                  <p className="text-xs text-[var(--primary-base)] max-w-sm">
                    These answers can feed into government / program reporting
                    dashboards and help improve how Procur supports large
                    buyers.
                  </p>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-full px-5 py-2 text-xs"
                  >
                    Submit outcome
                  </button>
                </div>
              </form>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default TestReviewsPage;
