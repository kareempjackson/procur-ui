"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  postHarvestUpdate,
  resetHarvestState,
} from "@/store/slices/harvestSlice";
import { fetchSellerProducts } from "@/store/slices/sellerProductsSlice";
import { useRouter } from "next/navigation";

type HarvestForm = {
  productId: string;
  expectedHarvestWindow: string;
  quantity: string;
  unit: string;
  notes: string;
  nextPlantingCrop: string;
  nextPlantingDate: string;
  nextPlantingArea: string;
};

export default function SellerHarvestUpdatePage() {
  const [form, setForm] = useState<HarvestForm>({
    productId: "",
    expectedHarvestWindow: "",
    quantity: "",
    unit: "lbs",
    notes: "",
    nextPlantingCrop: "",
    nextPlantingDate: "",
    nextPlantingArea: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const harvest = useAppSelector((s) => s.harvest);
  const sellerProducts = useAppSelector((s) => s.sellerProducts);

  useEffect(() => {
    if (sellerProducts.status === "idle") {
      dispatch(fetchSellerProducts({ page: 1, limit: 100, status: "active" }));
    }
  }, [dispatch, sellerProducts.status]);

  const selectedProduct = useMemo(
    () => sellerProducts.items.find((p) => p.id === form.productId) || null,
    [sellerProducts.items, form.productId]
  );

  const update = (key: keyof HarvestForm, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);
    try {
      if (!form.productId) {
        setError("Please select a product to link this harvest update to.");
        setSubmitting(false);
        return;
      }

      const cropName =
        selectedProduct?.name || "Harvest update"; // API may override with product name

      const payload = {
        product_id: form.productId,
        crop: cropName,
        expected_harvest_window: form.expectedHarvestWindow || undefined,
        quantity:
          form.quantity.trim() === "" ? undefined : Number(form.quantity),
        unit: form.unit || undefined,
        notes: form.notes || undefined,
        next_planting_crop: form.nextPlantingCrop || undefined,
        next_planting_date: form.nextPlantingDate || undefined,
        next_planting_area: form.nextPlantingArea || undefined,
      };
      const result = await dispatch(postHarvestUpdate(payload));
      if (postHarvestUpdate.fulfilled.match(result)) {
        setMessage("Harvest update posted.");
        setTimeout(() => {
          dispatch(resetHarvestState());
          router.push("/seller");
        }, 800);
      } else if (postHarvestUpdate.rejected.match(result)) {
        const msg =
          (result.payload as string) || "Failed to post harvest update.";
        setError(msg);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to post harvest update."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Hero */}
        <section className="rounded-3xl bg-[var(--primary-accent1)]/14 border border-[color:var(--secondary-soft-highlight)] px-6 sm:px-10 py-10 sm:py-12">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)] mb-2">
                Seller
              </div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[color:var(--secondary-black)]">
                Post harvest update
              </h1>
              <p className="mt-2 text-sm text-[color:var(--secondary-muted-edge)] max-w-prose">
                Share when your next harvest is expected and what you’re
                planting next.
              </p>
            </div>
            <div className="hidden sm:flex gap-2">
              <Link
                href="/seller"
                className="inline-flex items-center justify-center rounded-full border border-[color:var(--secondary-soft-highlight)] bg-transparent text-[color:var(--secondary-black)] px-4 py-2 text-xs font-medium hover:bg-white/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2"
              >
                Back to dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* Alerts */}
        {(message || error) && (
          <div className="mt-6">
            {message && (
              <div className="rounded-xl border border-[color:var(--secondary-soft-highlight)] bg-white p-4 text-sm text-[color:var(--secondary-black)]">
                {message}
              </div>
            )}
            {error && (
              <div className="rounded-xl border border-[color:var(--secondary-soft-highlight)] bg-white p-4 text-sm text-[color:var(--primary-accent2)] mt-2">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-8">
              {/* Expected harvest */}
              <div>
                <h2 className="text-base font-semibold text-[color:var(--secondary-black)]">
                  Expected harvest
                </h2>
                <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
                  Let buyers know what’s coming soon.
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                      Product (required)
                    </label>
                    <select
                      className="input w-full h-[34px]"
                      value={form.productId}
                      onChange={(e) => update("productId", e.target.value)}
                      required
                    >
                      <option value="">Select a product…</option>
                      {sellerProducts.items.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    {sellerProducts.status === "succeeded" &&
                      sellerProducts.items.length === 0 && (
                        <div className="mt-2 text-xs text-[color:var(--secondary-muted-edge)]">
                          You don’t have any active products yet.{" "}
                          <Link
                            className="underline"
                            href="/seller/add/product"
                          >
                            Add a product
                          </Link>{" "}
                          first, then post a harvest update.
                        </div>
                      )}
                  </div>

                  <div>
                    <label className="block text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                      Harvest window
                    </label>
                    <input
                      className="input w-full"
                      placeholder="e.g., Oct 15 – Oct 30"
                      value={form.expectedHarvestWindow}
                      onChange={(e) =>
                        update("expectedHarvestWindow", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                      Quantity
                    </label>
                    <input
                      className="input w-full"
                      placeholder="e.g., 500"
                      inputMode="numeric"
                      value={form.quantity}
                      onChange={(e) => update("quantity", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                      Unit
                    </label>
                    <select
                      className="input w-full h-[34px]"
                      value={form.unit}
                      onChange={(e) => update("unit", e.target.value)}
                    >
                      <option value="lbs">lbs</option>
                      <option value="kg">kg</option>
                      <option value="bunches">bunches</option>
                      <option value="cases">cases</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    className="input w-full resize-y"
                    placeholder="Quality grades, varieties, pickup windows, etc."
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                  />
                </div>
              </div>

              {/* Planting next */}
              <div>
                <h2 className="text-base font-semibold text-[color:var(--secondary-black)]">
                  Planting next
                </h2>
                <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
                  What’s being planted and when it should be ready.
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                      Crop
                    </label>
                    <input
                      className="input w-full"
                      placeholder="e.g., Baby Spinach"
                      value={form.nextPlantingCrop}
                      onChange={(e) =>
                        update("nextPlantingCrop", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                      Planting date
                    </label>
                    <input
                      type="date"
                      className="input w-full"
                      value={form.nextPlantingDate}
                      onChange={(e) =>
                        update("nextPlantingDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                      Area / Bed (optional)
                    </label>
                    <input
                      className="input w-full"
                      placeholder="e.g., North field, beds A–C"
                      value={form.nextPlantingArea}
                      onChange={(e) =>
                        update("nextPlantingArea", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-full bg-[var(--primary-accent2)] text-white px-5 py-2.5 text-sm font-medium hover:bg-[var(--primary-accent3)] transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Saving..." : "Save update"}
              </button>
              <Link
                href="/seller"
                className="inline-flex items-center justify-center rounded-full border border-[color:var(--secondary-soft-highlight)] bg-transparent text-[color:var(--secondary-black)] px-5 py-2.5 text-sm font-medium hover:bg-white/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2"
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
