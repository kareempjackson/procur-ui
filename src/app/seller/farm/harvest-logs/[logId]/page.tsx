"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ClipboardDocumentIcon,
  CheckIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchHarvestLogDetail } from "@/store/slices/farmSlice";

export default function HarvestLogDetailPage() {
  const { logId } = useParams<{ logId: string }>();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const { currentLog, loading } = useAppSelector((s) => s.farm);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    if (!accessToken || !logId) return;
    dispatch(fetchHarvestLogDetail({ accessToken, logId }));
  }, [accessToken, logId, dispatch]);

  const copyLotCode = () => {
    if (!currentLog) return;
    navigator.clipboard.writeText(currentLog.lot_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading.currentLog) {
    return (
      <div className="min-h-screen bg-[color:var(--primary-background)]">
        <main className="max-w-2xl mx-auto px-4 py-8 space-y-4">
          <div className="h-8 w-40 rounded-lg bg-white animate-pulse" />
          <div className="h-48 rounded-2xl bg-white animate-pulse" />
        </main>
      </div>
    );
  }

  if (!currentLog) {
    return (
      <div className="min-h-screen bg-[color:var(--primary-background)]">
        <main className="max-w-2xl mx-auto px-4 py-8">
          <p className="text-sm text-[color:var(--secondary-muted-edge)]">
            Harvest log not found.
          </p>
          <Link
            href="/seller/farm/harvest-logs"
            className="mt-4 inline-block text-sm text-[color:var(--primary-accent2)] hover:underline"
          >
            ← Back to Harvest Logs
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--primary-background)]">
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        <Link
          href="/seller/farm/harvest-logs"
          className="inline-flex items-center text-sm text-[color:var(--secondary-muted-edge)] hover:underline"
        >
          ← Harvest Logs
        </Link>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--secondary-black)] capitalize">
            {currentLog.crop}
            {currentLog.variety ? (
              <span className="text-[color:var(--secondary-muted-edge)] font-normal">
                {" "}
                — {currentLog.variety}
              </span>
            ) : null}
          </h1>
          <p className="text-sm text-[color:var(--secondary-muted-edge)] mt-0.5">
            Harvest Log ·{" "}
            {new Date(currentLog.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Lot Code — prominent */}
        <div className="rounded-2xl border border-[color:var(--secondary-muted-edge)]/30 bg-white p-6">
          <p className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wide mb-3">
            Traceability Lot Code
          </p>
          <button
            onClick={copyLotCode}
            className="w-full flex items-center justify-between gap-3 rounded-xl border-2 border-[color:var(--secondary-muted-edge)]/20 bg-[color:var(--secondary-muted-edge)]/5 px-5 py-4 font-mono text-xl font-bold text-[color:var(--secondary-black)] hover:border-[color:var(--primary-accent2)] transition-colors"
          >
            <span className="truncate">{currentLog.lot_code}</span>
            {copied ? (
              <span className="flex items-center gap-1 text-green-600 text-sm font-sans font-medium shrink-0">
                <CheckIcon className="h-4 w-4" /> Copied
              </span>
            ) : (
              <span className="flex items-center gap-1 text-gray-400 text-sm font-sans shrink-0">
                <ClipboardDocumentIcon className="h-4 w-4" /> Copy
              </span>
            )}
          </button>
          <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-2">
            This code is your FSMA 204 Traceability Lot Code. Assign it to orders when shipping this batch.
          </p>
        </div>

        {/* QR Code for Packaging */}
        <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wide">
              QR Code for Packaging
            </p>
            <button
              onClick={() => setShowQr((v) => !v)}
              className="text-sm font-semibold text-[color:var(--primary-accent2)] hover:underline"
            >
              {showQr ? "Hide QR" : "Generate QR Code"}
            </button>
          </div>
          {showQr && (() => {
            const verifyUrl = `https://procur.co/verify/${currentLog.lot_code}`;
            const qrSrc = `https://chart.googleapis.com/chart?cht=qr&chs=256x256&chl=${encodeURIComponent(verifyUrl)}&choe=UTF-8`;
            const handleDownload = async () => {
              const res = await fetch(qrSrc);
              const blob = await res.blob();
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `qr-${currentLog.lot_code}.png`;
              a.click();
              URL.revokeObjectURL(url);
            };
            return (
              <div className="mt-5 flex flex-col items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrSrc}
                  alt={`QR code for lot ${currentLog.lot_code}`}
                  width={180}
                  height={180}
                  className="rounded-lg border border-[color:var(--secondary-soft-highlight)]"
                />
                <p className="font-mono text-xs text-[color:var(--secondary-muted-edge)] text-center">
                  {currentLog.lot_code}
                </p>
                <p className="text-xs text-[color:var(--secondary-muted-edge)] text-center">
                  Scan to verify at{" "}
                  <span className="font-medium">procur.co/verify/{currentLog.lot_code}</span>
                </p>
                <button
                  onClick={handleDownload}
                  className="text-xs font-semibold text-[color:var(--primary-accent2)] hover:underline"
                >
                  Download QR Image
                </button>
              </div>
            );
          })()}
          {!showQr && (
            <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-2">
              Print this QR code on product labels and packing boxes. Buyers scan it to verify the origin and traceability of this batch.
            </p>
          )}
        </div>

        {/* Harvest Details */}
        <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
          <h2 className="text-sm font-semibold text-[color:var(--secondary-black)] mb-4">
            Harvest Details
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-start gap-2">
              <CalendarDaysIcon className="h-4 w-4 text-[color:var(--secondary-muted-edge)] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-[color:var(--secondary-muted-edge)]">
                  Harvest Date
                </p>
                <p className="text-sm font-medium text-[color:var(--secondary-black)] mt-0.5">
                  {new Date(currentLog.harvest_date).toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "short", day: "numeric" }
                  )}
                </p>
              </div>
            </div>

            {currentLog.quantity_harvested && (
              <div className="flex items-start gap-2">
                <ScaleIcon className="h-4 w-4 text-[color:var(--secondary-muted-edge)] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-[color:var(--secondary-muted-edge)]">
                    Quantity
                  </p>
                  <p className="text-sm font-medium text-[color:var(--secondary-black)] mt-0.5">
                    {currentLog.quantity_harvested} {currentLog.unit ?? ""}
                  </p>
                </div>
              </div>
            )}

            {currentLog.plot && (
              <div className="flex items-start gap-2">
                <MapPinIcon className="h-4 w-4 text-[color:var(--secondary-muted-edge)] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-[color:var(--secondary-muted-edge)]">
                    Plot
                  </p>
                  <p className="text-sm font-medium text-[color:var(--secondary-black)] mt-0.5">
                    {currentLog.plot.name}
                  </p>
                </div>
              </div>
            )}
          </div>

          {currentLog.quality_notes && (
            <div className="mt-4 pt-4 border-t border-[color:var(--secondary-soft-highlight)]">
              <p className="text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                Quality Notes
              </p>
              <p className="text-sm text-[color:var(--secondary-black)]">
                {currentLog.quality_notes}
              </p>
            </div>
          )}
        </div>

        {/* Phase 2 Actions */}
        <div className="flex flex-col gap-2">
          <Link
            href={`/seller/farm/harvest-logs/${logId}/chain`}
            className="w-full py-3 rounded-full bg-[color:var(--secondary-muted-edge)] text-sm font-semibold text-center text-white hover:opacity-90 transition-opacity"
          >
            View Chain of Custody
          </Link>
          <Link
            href={`/seller/farm/harvest-logs/${logId}/chain#packing`}
            className="w-full py-3 rounded-full border border-[color:var(--primary-accent2)] text-sm font-medium text-center text-[color:var(--primary-accent2)] hover:bg-orange-50 transition-colors"
          >
            + Log Packing Event
          </Link>
          <Link
            href={`/seller/farm/harvest-logs/new`}
            className="w-full py-3 rounded-full border border-[color:var(--secondary-soft-highlight)] text-sm text-center text-[color:var(--secondary-muted-edge)] hover:bg-white transition-colors"
          >
            Log Another Harvest
          </Link>
        </div>
      </main>
    </div>
  );
}
