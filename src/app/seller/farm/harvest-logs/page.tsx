"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchHarvestLogs } from "@/store/slices/farmSlice";

export default function HarvestLogsPage() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const { harvestLogs, harvestLogTotal, loading } = useAppSelector(
    (s) => s.farm
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    if (!accessToken) return;
    dispatch(
      fetchHarvestLogs({
        accessToken,
        query: { page, limit, crop: search || undefined },
      })
    );
  }, [accessToken, dispatch, page, search]);

  const totalPages = Math.ceil(harvestLogTotal / limit);

  return (
    <div className="min-h-screen bg-[color:var(--primary-background)]">
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Link
          href="/seller/farm"
          className="inline-flex items-center text-sm text-[color:var(--secondary-muted-edge)] hover:underline mb-6"
        >
          ← Back to Farm
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-[color:var(--secondary-black)]">
              Harvest Logs
            </h1>
            <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
              {harvestLogTotal} log{harvestLogTotal !== 1 ? "s" : ""} total
            </p>
          </div>
          <Link
            href="/seller/farm/harvest-logs/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[color:var(--primary-accent2)] text-white text-sm font-medium hover:bg-[color:var(--primary-accent3)] transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            Log Harvest
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by crop…"
            className="w-full rounded-full border border-[color:var(--secondary-soft-highlight)] bg-white pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-accent2)]/30"
          />
        </div>

        {/* Log List */}
        {loading.harvestLogs ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 rounded-xl bg-white border border-[color:var(--secondary-soft-highlight)] animate-pulse"
              />
            ))}
          </div>
        ) : harvestLogs.length === 0 ? (
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-10 text-center">
            <p className="text-sm text-[color:var(--secondary-muted-edge)]">
              No harvest logs yet.
            </p>
            <Link
              href="/seller/farm/harvest-logs/new"
              className="mt-3 inline-flex items-center gap-1 text-sm text-[color:var(--primary-accent2)] font-medium hover:underline"
            >
              <PlusIcon className="h-4 w-4" />
              Log your first harvest
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {harvestLogs.map((log) => (
              <Link
                key={log.id}
                href={`/seller/farm/harvest-logs/${log.id}`}
                className="flex items-center justify-between rounded-xl border border-[color:var(--secondary-soft-highlight)] bg-white px-4 py-3 hover:border-[color:var(--primary-accent2)] transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-[color:var(--secondary-black)] capitalize">
                    {log.crop}
                    {log.variety ? (
                      <span className="font-normal text-[color:var(--secondary-muted-edge)]">
                        {" "}
                        — {log.variety}
                      </span>
                    ) : null}
                  </p>
                  <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                    {new Date(log.harvest_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                    {log.quantity_harvested
                      ? ` · ${log.quantity_harvested} ${log.unit ?? ""}`
                      : ""}
                    {log.plot ? ` · ${log.plot.name}` : ""}
                  </p>
                </div>
                <span className="font-mono text-xs bg-[color:var(--secondary-muted-edge)]/10 text-[color:var(--secondary-muted-edge)] px-2 py-1 rounded shrink-0 ml-4">
                  {log.lot_code}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-full border border-[color:var(--secondary-soft-highlight)] text-sm disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-[color:var(--secondary-muted-edge)]">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-full border border-[color:var(--secondary-soft-highlight)] text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
