"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CalendarDaysIcon,
  PlusIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useAppSelector } from "@/store";

type DiaryEntryType =
  | "planting"
  | "fertilizer"
  | "irrigation"
  | "harvest"
  | "note";

type DiaryEntry = {
  id: string;
  date: string; // ISO date
  type: DiaryEntryType;
  crop: string;
  plot?: string;
  quantity?: string; // human-friendly (e.g., "20 kg", "2 hrs")
  notes?: string;
  runId?: string;
};

type CropRun = {
  id: string;
  crop: string;
  variety?: string;
  plot?: string;
  area?: string; // e.g. "1.2 ac"
  plantingDate: string; // ISO date
  expectedHarvest?: string; // ISO date
};

type TabKey = "dashboard" | "calendar" | "entries" | "runs";

export default function SellerDiaryPage() {
  const businessType = useAppSelector(
    (s) => s.profile.profile?.organization?.businessType
  );

  // Gate: farmers only
  if (businessType && businessType !== "farmers") {
    return (
      <div className="min-h-screen bg-white">
        <main className="max-w-4xl mx-auto px-6 py-10">
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <h1 className="text-xl font-semibold text-[color:var(--secondary-black)]">
              Diary not available for this business type
            </h1>
            <p className="text-sm text-[color:var(--secondary-muted-edge)] mt-2">
              The Farmer Diary is available for farmer accounts only.
            </p>
            <div className="mt-4">
              <Link
                href="/seller"
                className="inline-flex items-center px-4 py-2 rounded-full border border-[color:var(--secondary-soft-highlight)] text-sm hover:bg-gray-50"
              >
                Back to dashboard
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Mock state until API integration
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const [runs, setRuns] = useState<CropRun[]>(() => [
    {
      id: "run-1",
      crop: "Tomato",
      variety: "Roma",
      plot: "Plot A",
      area: "0.8 ac",
      plantingDate: new Date().toISOString().slice(0, 10),
      expectedHarvest: new Date(Date.now() + 60 * 24 * 3600 * 1000)
        .toISOString()
        .slice(0, 10),
    },
  ]);
  const [entries, setEntries] = useState<DiaryEntry[]>(() => [
    {
      id: "e1",
      date: new Date().toISOString().slice(0, 10),
      type: "planting",
      crop: "Tomato",
      plot: "Plot A",
      notes: "Transplanted 1,200 seedlings",
      runId: "run-1",
    },
    {
      id: "e2",
      date: new Date(Date.now() + 1 * 24 * 3600 * 1000)
        .toISOString()
        .slice(0, 10),
      type: "irrigation",
      crop: "Tomato",
      plot: "Plot A",
      quantity: "2 hrs drip",
      runId: "run-1",
    },
  ]);

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showRunModal, setShowRunModal] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState<null | DiaryEntryType>(
    null
  );

  const kpis = useMemo(() => {
    const activeRuns = runs.length;
    const upcoming = entries.filter((e) => e.date > todayIso()).length;
    const harvestDue = runs.filter(
      (r) => (r.expectedHarvest || "") <= addDaysIso(14)
    ).length;
    const area =
      runs
        .map((r) => r.area)
        .filter(Boolean)
        .join(" · ") || "—";
    return [
      { label: "Active runs", value: String(activeRuns), icon: CubeIcon },
      { label: "Upcoming (14d)", value: String(upcoming), icon: ClockIcon },
      {
        label: "Harvest due (14d)",
        value: String(harvestDue),
        icon: ClipboardDocumentListIcon,
      },
      { label: "Planted area", value: area, icon: CubeIcon },
    ];
  }, [runs, entries]);

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[color:var(--secondary-black)]">
              Farmer Diary
            </h1>
            <p className="text-sm text-[color:var(--secondary-muted-edge)] mt-1">
              Plan and log operations from planting to harvest.
            </p>
          </div>
          <div className="relative flex items-center gap-2">
            <button
              onClick={() => setShowRunModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-[var(--primary-accent2)] text-white hover:bg-[var(--primary-accent3)]"
            >
              <PlusIcon className="h-4 w-4" /> New Run
            </button>
            <div className="relative">
              <button
                onClick={() => setShowAddMenu((v) => !v)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-[color:var(--secondary-soft-highlight)] hover:bg-[var(--primary-background)]"
              >
                <CalendarDaysIcon className="h-4 w-4" /> Add Entry
              </button>
              {showAddMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[color:var(--secondary-soft-highlight)] bg-white shadow-sm z-10">
                  {(
                    [
                      "planting",
                      "fertilizer",
                      "irrigation",
                      "harvest",
                      "note",
                    ] as DiaryEntryType[]
                  ).map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setShowAddMenu(false);
                        setShowEntryModal(t);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--primary-background)] capitalize"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[color:var(--secondary-soft-highlight)]/40">
          {(
            [
              { key: "dashboard", label: "Dashboard" },
              { key: "calendar", label: "Calendar" },
              { key: "entries", label: "Entries" },
              { key: "runs", label: "Runs" },
            ] as { key: TabKey; label: string }[]
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === t.key
                  ? "text-[var(--primary-accent2)] border-[var(--primary-accent2)]"
                  : "text-[color:var(--secondary-muted-edge)] border-transparent hover:text-[var(--secondary-black)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map((k, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-[color:var(--secondary-muted-edge)]">
                        {k.label}
                      </div>
                      <div className="mt-1 text-lg font-semibold text-[color:var(--secondary-black)]">
                        {k.value}
                      </div>
                    </div>
                    <k.icon className="h-6 w-6 text-[var(--primary-accent2)]" />
                  </div>
                </div>
              ))}
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-[color:var(--secondary-black)]">
                    Upcoming (next 7 days)
                  </div>
                </div>
                <div className="space-y-3">
                  {entries
                    .filter(
                      (e) => e.date >= todayIso() && e.date <= addDaysIso(7)
                    )
                    .slice(0, 5)
                    .map((e) => (
                      <div
                        key={e.id}
                        className="flex items-center justify-between rounded-xl border border-[color:var(--secondary-soft-highlight)] p-3"
                      >
                        <div>
                          <div className="text-sm font-medium text-[color:var(--secondary-black)] capitalize">
                            {e.type} · {e.crop}
                          </div>
                          <div className="text-xs text-[color:var(--secondary-muted-edge)]">
                            {new Date(e.date).toLocaleDateString()}{" "}
                            {e.plot ? `· ${e.plot}` : ""}
                          </div>
                        </div>
                        {e.quantity && (
                          <div className="text-xs text-[color:var(--secondary-muted-edge)]">
                            {e.quantity}
                          </div>
                        )}
                      </div>
                    ))}
                  {entries.filter(
                    (e) => e.date >= todayIso() && e.date <= addDaysIso(7)
                  ).length === 0 && (
                    <div className="text-xs text-[color:var(--secondary-muted-edge)]">
                      Nothing scheduled in the next week.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-[color:var(--secondary-black)]">
                    Active Runs
                  </div>
                </div>
                <div className="space-y-3">
                  {runs.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-xl border border-[color:var(--secondary-soft-highlight)] p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-[color:var(--secondary-black)]">
                          {r.crop} {r.variety ? `· ${r.variety}` : ""}
                        </div>
                        <div className="text-[10px] text-[color:var(--secondary-muted-edge)]">
                          Planted{" "}
                          {new Date(r.plantingDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                        {r.plot || "Unassigned"} {r.area ? `· ${r.area}` : ""}
                      </div>
                      {r.expectedHarvest && (
                        <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
                          Expected harvest{" "}
                          {new Date(r.expectedHarvest).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "calendar" && <CalendarView entries={entries} />}

        {activeTab === "entries" && <EntriesTable entries={entries} />}

        {activeTab === "runs" && <RunsList runs={runs} />}
      </main>

      {/* New Run Modal (basic) */}
      {showRunModal && (
        <RunModal
          onClose={() => setShowRunModal(false)}
          onCreate={(run) => setRuns((s) => [run, ...s])}
        />
      )}

      {/* Add Entry Modal (basic) */}
      {showEntryModal && (
        <EntryModal
          type={showEntryModal}
          runs={runs}
          onClose={() => setShowEntryModal(null)}
          onCreate={(entry) => setEntries((s) => [entry, ...s])}
        />
      )}
    </div>
  );
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}
function addDaysIso(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function CalendarView({ entries }: { entries: DiaryEntry[] }) {
  const [cursor, setCursor] = useState(new Date());
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  const days: Date[] = [];
  for (let i = 1; i <= end.getDate(); i++) days.push(new Date(year, month, i));
  const startOffset = start.getDay();
  const cells: (Date | null)[] = [...Array(startOffset).fill(null), ...days];

  const byDate = useMemo(() => {
    const map: Record<string, DiaryEntry[]> = {};
    for (const e of entries) {
      (map[e.date] ||= []).push(e);
    }
    return map;
  }, [entries]);

  return (
    <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold text-[color:var(--secondary-black)]">
          {cursor.toLocaleString(undefined, { month: "long", year: "numeric" })}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1.5 text-xs rounded-full border border-[color:var(--secondary-soft-highlight)] hover:bg-[var(--primary-background)]"
            onClick={() =>
              setCursor(
                new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)
              )
            }
          >
            Prev
          </button>
          <button
            className="px-3 py-1.5 text-xs rounded-full border border-[color:var(--secondary-soft-highlight)] hover:bg-[var(--primary-background)]"
            onClick={() => setCursor(new Date())}
          >
            Today
          </button>
          <button
            className="px-3 py-1.5 text-xs rounded-full border border-[color:var(--secondary-soft-highlight)] hover:bg-[var(--primary-background)]"
            onClick={() =>
              setCursor(
                new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
              )
            }
          >
            Next
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-[10px] text-[color:var(--secondary-muted-edge)] mb-1">
        {"Sun Mon Tue Wed Thu Fri Sat".split(" ").map((d) => (
          <div key={d} className="px-2 py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, idx) => {
          const iso = d ? d.toISOString().slice(0, 10) : "";
          const items = d ? byDate[iso] || [] : [];
          const isToday = d && iso === todayIso();
          return (
            <div
              key={idx}
              className={`min-h-[92px] rounded-xl border border-[color:var(--secondary-soft-highlight)] p-2 ${isToday ? "bg-[var(--primary-background)]" : "bg-white"}`}
            >
              <div className="text-[11px] font-medium text-[color:var(--secondary-black)]">
                {d ? d.getDate() : ""}
              </div>
              <div className="mt-1 space-y-1">
                {items.slice(0, 3).map((e) => (
                  <div
                    key={e.id}
                    className="truncate text-[10px] px-2 py-0.5 rounded-full bg-[var(--primary-accent2)]/10 text-[color:var(--primary-accent2)] capitalize"
                  >
                    {e.type}: {e.crop}
                  </div>
                ))}
                {items.length > 3 && (
                  <div className="text-[10px] text-[color:var(--secondary-muted-edge)]">
                    +{items.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EntriesTable({ entries }: { entries: DiaryEntry[] }) {
  return (
    <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-[color:var(--secondary-soft-highlight)] text-sm font-semibold text-[color:var(--secondary-black)]">
        All Entries
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[color:var(--secondary-soft-highlight)]/40 text-sm">
          <thead className="bg-[var(--primary-background)]">
            <tr>
              {["Date", "Type", "Crop", "Plot", "Quantity", "Notes"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-2 text-left text-[11px] font-medium text-[color:var(--secondary-muted-edge)] uppercase tracking-wide"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--secondary-soft-highlight)]/40 bg-white">
            {entries.map((e) => (
              <tr key={e.id}>
                <td className="px-4 py-2 text-[color:var(--secondary-black)]">
                  {new Date(e.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 capitalize">{e.type}</td>
                <td className="px-4 py-2">{e.crop}</td>
                <td className="px-4 py-2">{e.plot || "—"}</td>
                <td className="px-4 py-2">{e.quantity || "—"}</td>
                <td className="px-4 py-2 text-[color:var(--secondary-muted-edge)]">
                  {e.notes || ""}
                </td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-xs text-[color:var(--secondary-muted-edge)]"
                >
                  No entries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RunsList({ runs }: { runs: CropRun[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {runs.map((r) => (
        <div
          key={r.id}
          className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-4"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-[color:var(--secondary-black)]">
              {r.crop} {r.variety ? `· ${r.variety}` : ""}
            </div>
            <div className="text-[10px] text-[color:var(--secondary-muted-edge)]">
              Planted {new Date(r.plantingDate).toLocaleDateString()}
            </div>
          </div>
          <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
            {r.plot || "Unassigned"} {r.area ? `· ${r.area}` : ""}
          </div>
          {r.expectedHarvest && (
            <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
              Expected harvest{" "}
              {new Date(r.expectedHarvest).toLocaleDateString()}
            </div>
          )}
        </div>
      ))}
      {runs.length === 0 && (
        <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6 text-xs text-[color:var(--secondary-muted-edge)]">
          No runs yet. Create your first run to get started.
        </div>
      )}
    </div>
  );
}

function RunModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (run: CropRun) => void;
}) {
  const [form, setForm] = useState({
    crop: "",
    variety: "",
    plot: "",
    area: "",
    plantingDate: todayIso(),
    expectedHarvest: "",
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-5">
        <div className="text-base font-semibold text-[color:var(--secondary-black)] mb-3">
          New Crop Run
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[color:var(--secondary-muted-edge)]">
              Crop
            </label>
            <input
              value={form.crop}
              onChange={(e) => setForm({ ...form, crop: e.target.value })}
              className="w-full px-3 py-2 rounded-full border border-[color:var(--secondary-soft-highlight)] text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-[color:var(--secondary-muted-edge)]">
              Variety
            </label>
            <input
              value={form.variety}
              onChange={(e) => setForm({ ...form, variety: e.target.value })}
              className="w-full px-3 py-2 rounded-full border border-[color:var(--secondary-soft-highlight)] text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-[color:var(--secondary-muted-edge)]">
              Plot
            </label>
            <input
              value={form.plot}
              onChange={(e) => setForm({ ...form, plot: e.target.value })}
              className="w-full px-3 py-2 rounded-full border border-[color:var(--secondary-soft-highlight)] text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-[color:var(--secondary-muted-edge)]">
              Area
            </label>
            <input
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
              placeholder="e.g. 1.0 ac"
              className="w-full px-3 py-2 rounded-full border border-[color:var(--secondary-soft-highlight)] text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-[color:var(--secondary-muted-edge)]">
              Planting date
            </label>
            <input
              type="date"
              value={form.plantingDate}
              onChange={(e) =>
                setForm({ ...form, plantingDate: e.target.value })
              }
              className="w-full px-3 py-2 rounded-full border border-[color:var(--secondary-soft-highlight)] text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-[color:var(--secondary-muted-edge)]">
              Expected harvest
            </label>
            <input
              type="date"
              value={form.expectedHarvest}
              onChange={(e) =>
                setForm({ ...form, expectedHarvest: e.target.value })
              }
              className="w-full px-3 py-2 rounded-full border border-[color:var(--secondary-soft-highlight)] text-sm"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-full border border-[color:var(--secondary-soft-highlight)]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!form.crop || !form.plantingDate) return;
              onCreate({
                id: `run-${Math.random().toString(36).slice(2, 8)}`,
                crop: form.crop,
                variety: form.variety || undefined,
                plot: form.plot || undefined,
                area: form.area || undefined,
                plantingDate: form.plantingDate,
                expectedHarvest: form.expectedHarvest || undefined,
              });
              onClose();
            }}
            className="px-4 py-2 text-sm rounded-full bg-[var(--primary-accent2)] text-white hover:bg-[var(--primary-accent3)]"
          >
            Create Run
          </button>
        </div>
      </div>
    </div>
  );
}

function EntryModal({
  type,
  runs,
  onClose,
  onCreate,
}: {
  type: DiaryEntryType;
  runs: CropRun[];
  onClose: () => void;
  onCreate: (entry: DiaryEntry) => void;
}) {
  const [form, setForm] = useState<{
    date: string;
    crop: string;
    plot: string;
    runId: string;
    quantity: string;
    notes: string;
  }>({
    date: todayIso(),
    crop: runs[0]?.crop || "",
    plot: runs[0]?.plot || "",
    runId: runs[0]?.id || "",
    quantity: "",
    notes: "",
  });

  const handleRunChange = (runId: string) => {
    const r = runs.find((x) => x.id === runId);
    setForm((f) => ({
      ...f,
      runId,
      crop: r?.crop || f.crop,
      plot: r?.plot || "",
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-5">
        <div className="text-base font-semibold text-[color:var(--secondary-black)] mb-3 capitalize">
          Add {type} entry
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <label className="text-xs text-[color:var(--secondary-muted-edge)]">
              Run
            </label>
            <select
              value={form.runId}
              onChange={(e) => handleRunChange(e.target.value)}
              className="w-full px-3 py-2 rounded-full border border-[color:var(--secondary-soft-highlight)] text-sm"
            >
              {runs.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.crop} {r.variety ? `· ${r.variety}` : ""}{" "}
                  {r.plot ? `· ${r.plot}` : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[color:var(--secondary-muted-edge)]">
              Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-3 py-2 rounded-full border border-[color:var(--secondary-soft-highlight)] text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-[color:var(--secondary-muted-edge)]">
              Quantity / details
            </label>
            <input
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              placeholder={
                type === "fertilizer"
                  ? "e.g. 25 kg NPK 15-15-15"
                  : type === "irrigation"
                    ? "e.g. 2 hrs drip"
                    : type === "harvest"
                      ? "e.g. 120 kg"
                      : "Optional"
              }
              className="w-full px-3 py-2 rounded-full border border-[color:var(--secondary-soft-highlight)] text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-[color:var(--secondary-muted-edge)]">
              Notes
            </label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-2xl border border-[color:var(--secondary-soft-highlight)] text-sm"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-full border border-[color:var(--secondary-soft-highlight)]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!form.date || !form.runId) return;
              onCreate({
                id: `e-${Math.random().toString(36).slice(2, 8)}`,
                date: form.date,
                type,
                crop: form.crop,
                plot: form.plot || undefined,
                quantity: form.quantity || undefined,
                notes: form.notes || undefined,
                runId: form.runId,
              });
              onClose();
            }}
            className="px-4 py-2 text-sm rounded-full bg-[var(--primary-accent2)] text-white hover:bg-[var(--primary-accent3)]"
          >
            Add Entry
          </button>
        </div>
      </div>
    </div>
  );
}
