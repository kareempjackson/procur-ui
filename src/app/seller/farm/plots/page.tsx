"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchPlots,
  createPlot,
  updatePlot,
  deletePlot,
  FarmPlot,
} from "@/store/slices/farmSlice";

type PlotFormState = {
  name: string;
  description: string;
  area_acreage: string;
};

const emptyForm: PlotFormState = { name: "", description: "", area_acreage: "" };

export default function FarmPlotsPage() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const { plots, loading } = useAppSelector((s) => s.farm);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PlotFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accessToken) return;
    dispatch(fetchPlots(accessToken));
  }, [accessToken, dispatch]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (plot: FarmPlot) => {
    setEditingId(plot.id);
    setForm({
      name: plot.name,
      description: plot.description ?? "",
      area_acreage: plot.area_acreage?.toString() ?? "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !form.name.trim()) return;
    setError("");
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      area_acreage: form.area_acreage ? parseFloat(form.area_acreage) : undefined,
    };

    const result = editingId
      ? await dispatch(updatePlot({ accessToken, plotId: editingId, payload }))
      : await dispatch(createPlot({ accessToken, payload }));

    setSaving(false);

    if (
      createPlot.fulfilled.match(result) ||
      updatePlot.fulfilled.match(result)
    ) {
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
    } else {
      setError((result.payload as string) ?? "Failed to save");
    }
  };

  const handleDelete = async (plotId: string) => {
    if (!accessToken) return;
    if (!confirm("Delete this plot? Harvest logs linked to it will remain.")) return;
    await dispatch(deletePlot({ accessToken, plotId }));
  };

  return (
    <div className="min-h-screen bg-[color:var(--primary-background)]">
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Link
          href="/seller/farm"
          className="inline-flex items-center text-sm text-[color:var(--secondary-muted-edge)] hover:underline mb-6"
        >
          ← Back to Farm
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-[color:var(--secondary-black)]">
            Plots &amp; Fields
          </h1>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[color:var(--primary-accent2)] text-white text-sm font-medium hover:bg-[color:var(--primary-accent3)] transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            Add Plot
          </button>
        </div>

        {/* Inline Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border-2 border-[color:var(--primary-accent2)] bg-white p-5 mb-5 space-y-3"
          >
            <h2 className="text-sm font-semibold text-[color:var(--secondary-black)]">
              {editingId ? "Edit Plot" : "New Plot"}
            </h2>
            <div>
              <label className="block text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                Plot Name *
              </label>
              <input
                autoFocus
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. North Field"
                className="w-full rounded-lg border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-accent2)]/30"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                  Acreage
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.area_acreage}
                  onChange={(e) =>
                    setForm({ ...form, area_acreage: e.target.value })
                  }
                  placeholder="e.g. 2.5"
                  className="w-full rounded-lg border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-accent2)]/30"
                />
              </div>
              <div>
                <label className="block text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Optional note"
                  className="w-full rounded-lg border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-accent2)]/30"
                />
              </div>
            </div>
            {error && (
              <p className="text-xs text-red-600">{error}</p>
            )}
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2 rounded-full bg-[color:var(--primary-accent2)] text-white text-sm font-medium hover:bg-[color:var(--primary-accent3)] disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving…" : editingId ? "Update" : "Create Plot"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-full border border-[color:var(--secondary-soft-highlight)] text-sm text-[color:var(--secondary-muted-edge)] hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Plot List */}
        {loading.plots ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-16 rounded-xl bg-white border border-[color:var(--secondary-soft-highlight)] animate-pulse"
              />
            ))}
          </div>
        ) : plots.length === 0 ? (
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-8 text-center">
            <p className="text-sm text-[color:var(--secondary-muted-edge)]">
              No plots yet. Add your first field or growing area.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {plots.map((plot) => (
              <div
                key={plot.id}
                className="flex items-center justify-between rounded-xl border border-[color:var(--secondary-soft-highlight)] bg-white px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-[color:var(--secondary-black)]">
                    {plot.name}
                  </p>
                  <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                    {[
                      plot.area_acreage ? `${plot.area_acreage} ac` : null,
                      plot.description,
                    ]
                      .filter(Boolean)
                      .join(" · ") || "No details"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(plot)}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-[color:var(--secondary-muted-edge)]"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(plot.id)}
                    className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
