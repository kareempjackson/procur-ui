"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ClipboardDocumentIcon, CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchPlots,
  createHarvestLog,
  clearCurrentLog,
} from "@/store/slices/farmSlice";

const UNITS = ["kg", "lb", "bunches", "cases", "bags", "lbs", "tonnes"];

export default function NewHarvestLogPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const { plots, loading, currentLog, error } = useAppSelector((s) => s.farm);

  // Required fields
  const [crop, setCrop] = useState("");
  const [harvestDate, setHarvestDate] = useState(
    () => new Date().toISOString().slice(0, 10)
  );
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");

  // Optional fields (collapsed)
  const [showOptional, setShowOptional] = useState(false);
  const [plotId, setPlotId] = useState("");
  const [variety, setVariety] = useState("");
  const [qualityNotes, setQualityNotes] = useState("");

  // Post-success state
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    dispatch(clearCurrentLog());
    if (accessToken) dispatch(fetchPlots(accessToken));
  }, [accessToken, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !crop.trim() || !harvestDate) return;

    await dispatch(
      createHarvestLog({
        accessToken,
        payload: {
          crop: crop.trim(),
          harvest_date: harvestDate,
          quantity_harvested: quantity ? parseFloat(quantity) : undefined,
          unit: unit || undefined,
          variety: variety.trim() || undefined,
          quality_notes: qualityNotes.trim() || undefined,
          plot_id: plotId || undefined,
        },
      })
    );
  };

  const copyLotCode = () => {
    if (!currentLog) return;
    navigator.clipboard.writeText(currentLog.lot_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Success screen
  if (currentLog) {
    return (
      <div className="min-h-screen bg-[color:var(--primary-background)] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl bg-white border border-[color:var(--secondary-soft-highlight)] p-8 text-center">
            <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
              <CheckIcon className="h-7 w-7 text-green-600" />
            </div>
            <h2 className="text-lg font-bold text-[color:var(--secondary-black)]">
              Harvest Logged
            </h2>
            <p className="text-sm text-[color:var(--secondary-muted-edge)] mt-1 capitalize">
              {currentLog.crop}
              {currentLog.variety ? ` — ${currentLog.variety}` : ""} ·{" "}
              {new Date(currentLog.harvest_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>

            {/* Lot Code — large + copyable */}
            <div className="mt-6 mb-2">
              <p className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wide mb-2">
                Traceability Lot Code
              </p>
              <button
                onClick={copyLotCode}
                className="w-full flex items-center justify-between gap-2 rounded-xl border-2 border-[color:var(--secondary-muted-edge)]/30 bg-[color:var(--secondary-muted-edge)]/5 px-4 py-3 font-mono text-base font-bold text-[color:var(--secondary-black)] hover:border-[color:var(--primary-accent2)] transition-colors"
              >
                <span className="truncate">{currentLog.lot_code}</span>
                {copied ? (
                  <CheckIcon className="h-4 w-4 text-green-500 shrink-0" />
                ) : (
                  <ClipboardDocumentIcon className="h-4 w-4 text-gray-400 shrink-0" />
                )}
              </button>
              <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-1.5">
                {copied ? "Copied!" : "Tap to copy"}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <Link
                href={`/seller/farm/harvest-logs/${currentLog.id}`}
                className="w-full py-2.5 rounded-full bg-[color:var(--primary-accent2)] text-white text-sm font-medium hover:bg-[color:var(--primary-accent3)] transition-colors text-center"
              >
                View Harvest Log
              </Link>
              <button
                onClick={() => dispatch(clearCurrentLog())}
                className="w-full py-2.5 rounded-full border border-[color:var(--secondary-soft-highlight)] text-sm text-[color:var(--secondary-muted-edge)] hover:bg-gray-50"
              >
                Log Another Harvest
              </button>
              <Link
                href="/seller/farm/harvest-logs"
                className="text-sm text-[color:var(--secondary-muted-edge)] hover:underline text-center"
              >
                View all logs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--primary-background)]">
      <main className="max-w-md mx-auto px-4 py-8">
        <Link
          href="/seller/farm/harvest-logs"
          className="inline-flex items-center text-sm text-[color:var(--secondary-muted-edge)] hover:underline mb-6"
        >
          ← Back
        </Link>

        <h1 className="text-xl font-bold text-[color:var(--secondary-black)] mb-6">
          Log a Harvest
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Required fields */}
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-5 space-y-4">
            {/* Crop */}
            <div>
              <label className="block text-sm font-medium text-[color:var(--secondary-black)] mb-1.5">
                Crop <span className="text-[color:var(--primary-accent2)]">*</span>
              </label>
              <input
                autoFocus
                required
                type="text"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                placeholder="e.g. Plantain"
                className="w-full rounded-xl border border-[color:var(--secondary-soft-highlight)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-accent2)]/30"
              />
            </div>

            {/* Harvest Date */}
            <div>
              <label className="block text-sm font-medium text-[color:var(--secondary-black)] mb-1.5">
                Harvest Date <span className="text-[color:var(--primary-accent2)]">*</span>
              </label>
              <input
                required
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                max={new Date().toISOString().slice(0, 10)}
                className="w-full rounded-xl border border-[color:var(--secondary-soft-highlight)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-accent2)]/30"
              />
            </div>

            {/* Quantity + Unit */}
            <div>
              <label className="block text-sm font-medium text-[color:var(--secondary-black)] mb-1.5">
                Quantity
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 250"
                  className="flex-1 rounded-xl border border-[color:var(--secondary-soft-highlight)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-accent2)]/30"
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="rounded-xl border border-[color:var(--secondary-soft-highlight)] px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-accent2)]/30"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Optional fields toggle */}
          <button
            type="button"
            onClick={() => setShowOptional((v) => !v)}
            className="flex items-center gap-1.5 text-sm text-[color:var(--secondary-muted-edge)] hover:text-[color:var(--secondary-black)] transition-colors"
          >
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform ${showOptional ? "rotate-180" : ""}`}
            />
            {showOptional ? "Hide details" : "+ Add details (plot, variety, notes)"}
          </button>

          {showOptional && (
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-5 space-y-4">
              {/* Plot */}
              {plots.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-[color:var(--secondary-black)] mb-1.5">
                    Plot / Field
                  </label>
                  <select
                    value={plotId}
                    onChange={(e) => setPlotId(e.target.value)}
                    className="w-full rounded-xl border border-[color:var(--secondary-soft-highlight)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-accent2)]/30"
                  >
                    <option value="">No specific plot</option>
                    {plots.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                        {p.area_acreage ? ` (${p.area_acreage} ac)` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Variety */}
              <div>
                <label className="block text-sm font-medium text-[color:var(--secondary-black)] mb-1.5">
                  Variety
                </label>
                <input
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  placeholder="e.g. Dwarf Cavendish"
                  className="w-full rounded-xl border border-[color:var(--secondary-soft-highlight)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-accent2)]/30"
                />
              </div>

              {/* Quality Notes */}
              <div>
                <label className="block text-sm font-medium text-[color:var(--secondary-black)] mb-1.5">
                  Quality Notes
                </label>
                <textarea
                  rows={3}
                  value={qualityNotes}
                  onChange={(e) => setQualityNotes(e.target.value)}
                  placeholder="e.g. Good quality, no visible disease"
                  className="w-full rounded-xl border border-[color:var(--secondary-soft-highlight)] px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-accent2)]/30"
                />
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading.creating || !crop.trim()}
            className="w-full py-4 rounded-full bg-[color:var(--primary-accent2)] text-white text-base font-semibold hover:bg-[color:var(--primary-accent3)] disabled:opacity-50 transition-colors"
          >
            {loading.creating ? "Logging harvest…" : "Log Harvest"}
          </button>

          <p className="text-xs text-center text-[color:var(--secondary-muted-edge)]">
            A Traceability Lot Code will be generated automatically
          </p>
        </form>
      </main>
    </div>
  );
}
