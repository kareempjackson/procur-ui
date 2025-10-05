"use client";

import React, { useState } from "react";
import Link from "next/link";

type FaqItem = {
  q: string;
  a: string;
};

const FAQS: FaqItem[] = [
  {
    q: "How do I add a new product?",
    a: "Go to Seller → Inventory and click the Add Product button in the top right. Fill in product details, pricing, and availability, then save.",
  },
  {
    q: "Where can I manage orders?",
    a: "Navigate to Seller → Orders to view new, processing, and completed orders. You can update status, download invoices, and message buyers from there.",
  },
  {
    q: "How do I set up payouts?",
    a: "Open Seller → Business Settings → Payment Settings and connect your bank account. Once verified, funds will be settled automatically per your payout schedule.",
  },
  {
    q: "Can I update my business profile?",
    a: "Yes. Visit Seller → Business Settings to update your business name, website, and description shown to buyers.",
  },
];

export default function SellerHelpPage() {
  const [query, setQuery] = useState("");
  const filteredFaqs = FAQS.filter(
    (f) =>
      f.q.toLowerCase().includes(query.toLowerCase()) ||
      f.a.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[color:var(--secondary-black)]">
            Help & Support
          </h1>
          <p className="mt-2 text-sm text-[color:var(--secondary-muted-edge)]">
            Find quick answers, explore FAQs, or contact our support team.
          </p>
        </div>

        {/* Search */}
        <section className="mb-8 bg-white rounded-3xl shadow-lg border border-[var(--secondary-soft-highlight)] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="search"
              placeholder="Search help articles, topics, or keywords"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 rounded-xl border border-[var(--secondary-soft-highlight)] bg-[var(--primary-background)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary-base)]"
            />
            <button className="px-5 py-3 rounded-xl bg-black text-white hover:bg-gray-800">
              Search
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <section className="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-[var(--secondary-soft-highlight)] p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-[color:var(--secondary-black)] mb-4">
              Quick actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/seller/messages"
                className="rounded-2xl border border-[var(--secondary-soft-highlight)] bg-[var(--primary-background)] p-5 hover:bg-white transition-colors"
              >
                <div className="font-medium text-[color:var(--secondary-black)]">
                  Message support
                </div>
                <div className="text-sm text-[color:var(--secondary-muted-edge)] mt-1">
                  Start a conversation with our team
                </div>
              </Link>
              <Link
                href="/seller/business"
                className="rounded-2xl border border-[var(--secondary-soft-highlight)] bg-[var(--primary-background)] p-5 hover:bg-white transition-colors"
              >
                <div className="font-medium text-[color:var(--secondary-black)]">
                  Business Settings
                </div>
                <div className="text-sm text-[color:var(--secondary-muted-edge)] mt-1">
                  Manage your organization & payments
                </div>
              </Link>
              <Link
                href="/seller/products"
                className="rounded-2xl border border-[var(--secondary-soft-highlight)] bg-[var(--primary-background)] p-5 hover:bg-white transition-colors"
              >
                <div className="font-medium text-[color:var(--secondary-black)]">
                  Add a product
                </div>
                <div className="text-sm text-[color:var(--secondary-muted-edge)] mt-1">
                  Create and list a new item
                </div>
              </Link>
            </div>
          </section>

          {/* Contact Support */}
          <aside className="bg-white rounded-3xl shadow-lg border border-[var(--secondary-soft-highlight)] p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-[color:var(--secondary-black)] mb-4">
              Contact support
            </h2>
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-[var(--secondary-soft-highlight)] bg-[var(--primary-background)] p-4">
                <div className="font-medium text-[color:var(--secondary-black)]">
                  Email
                </div>
                <div className="text-[color:var(--secondary-muted-edge)]">
                  support@procur.app
                </div>
              </div>
              <div className="rounded-xl border border-[var(--secondary-soft-highlight)] bg-[var(--primary-background)] p-4">
                <div className="font-medium text-[color:var(--secondary-black)]">
                  Hours
                </div>
                <div className="text-[color:var(--secondary-muted-edge)]">
                  Mon–Fri, 9:00–17:00 AST
                </div>
              </div>
              <Link
                href="/seller/messages"
                className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-full bg-black text-white hover:bg-gray-800"
              >
                Start a chat
              </Link>
            </div>
          </aside>
        </div>

        {/* FAQs */}
        <section className="mt-6 bg-white rounded-3xl shadow-lg border border-[var(--secondary-soft-highlight)] p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-[color:var(--secondary-black)] mb-4">
            Frequently asked questions
          </h2>
          <ul className="divide-y divide-[var(--secondary-soft-highlight)]">
            {filteredFaqs.length === 0 && (
              <li className="py-6 text-sm text-[color:var(--secondary-muted-edge)]">
                No results. Try a different search term.
              </li>
            )}
            {filteredFaqs.map((item, idx) => (
              <Faq key={idx} item={item} />
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

function Faq({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="py-4">
      <button
        className="w-full text-left flex items-center justify-between gap-4"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-medium text-[color:var(--secondary-black)]">
          {item.q}
        </span>
        <span className="text-sm text-[color:var(--secondary-muted-edge)]">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div className="mt-2 text-sm text-[color:var(--secondary-muted-edge)]">
          {item.a}
        </div>
      )}
    </li>
  );
}
