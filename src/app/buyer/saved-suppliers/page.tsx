"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/footer/Footer";
import { getApiClient } from "@/lib/apiClient";

type FavoriteSeller = {
  seller_id: string;
  seller_name?: string;
  logo_url?: string;
  location?: string;
};

export default function BuyerSavedSuppliersPage() {
  const [items, setItems] = useState<FavoriteSeller[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const client = getApiClient(() => {
          if (typeof window === "undefined") return null;
          try {
            const raw = localStorage.getItem("auth");
            if (!raw) return null;
            return (
              (JSON.parse(raw) as { accessToken?: string }).accessToken ?? null
            );
          } catch {
            return null;
          }
        });
        // This endpoint may be a TODO on backend; handle errors gracefully
        const { data } = await client.get<FavoriteSeller[]>(
          "/buyers/favorites/sellers"
        );
        setItems(Array.isArray(data) ? data : []);
      } catch (e: unknown) {
        setError((e as any)?.response?.data?.message || null);
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl leading-tight text-[var(--secondary-black)] font-medium">
              Saved Suppliers
            </h1>
            <p className="text-sm text-[var(--secondary-muted-edge)]">
              Your favorite farms and vendors
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/buyer" className="btn btn-ghost h-8 px-3 text-sm">
              Discover Sellers
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-yellow-900">
            We couldn't load your saved suppliers yet. Please try again later.
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-40 rounded-2xl border border-[var(--secondary-soft-highlight)] bg-white animate-pulse"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[var(--secondary-black)] mb-2">
              No saved suppliers yet
            </h3>
            <p className="text-[var(--primary-base)] mb-6">
              Browse the marketplace and save your favorite farms
            </p>
            <Link href="/buyer#featured-farms" className="btn btn-primary">
              Explore Farms
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((s) => (
              <div
                key={s.seller_id}
                className="border border-[var(--secondary-soft-highlight)] rounded-2xl overflow-hidden bg-white hover:shadow-sm transition-shadow"
              >
                <div className="h-32 w-full bg-gray-100 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {s.logo_url ? (
                    <img
                      src={s.logo_url}
                      alt={s.seller_name || s.seller_id}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-[var(--primary-base)] text-2xl">
                      {(s.seller_name || "").slice(0, 1) || "S"}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-[var(--secondary-black)] font-medium truncate">
                    {s.seller_name || "Supplier"}
                  </div>
                  <div className="mt-0.5 text-sm text-[var(--primary-base)] truncate">
                    {s.location || "Location"}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <Link
                      href={`/seller/${s.seller_id}`}
                      className="btn btn-ghost h-8 px-3"
                    >
                      View
                    </Link>
                    <button className="btn btn-ghost h-8 px-3">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
