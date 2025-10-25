"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import TopNavigation from "@/components/navigation/TopNavigation";
import BuyerTopNavigation from "@/components/navigation/BuyerTopNavigation";
import SellerTopNavigation from "@/components/navigation/SellerTopNavigation";
import Footer from "@/components/footer/Footer";
import { useAppSelector } from "@/store";
import { selectAuthUser } from "@/store/slices/authSlice";
import {
  FunnelIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  UserGroupIcon,
  CubeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

type HarvestStatus =
  | "planned"
  | "in_progress"
  | "harvested"
  | "quality_check"
  | "shipped"
  | "delivered"
  | "cancelled";

type Harvest = {
  id: string;
  seller: string;
  crop: string;
  quantity: number;
  unit: string;
  region: string;
  status: HarvestStatus;
  date: string; // ISO date string (YYYY-MM-DD)
  time?: string; // HH:mm
  notes?: string;
};

const MOCK_HARVESTS: Harvest[] = [
  {
    id: "H-1001",
    seller: "Green Valley Farms",
    crop: "Tomatoes",
    quantity: 1200,
    unit: "kg",
    region: "St. George",
    status: "harvested",
    date: "2025-10-10",
    time: "08:30",
    notes: "Batch A – good color and size",
  },
  {
    id: "H-1002",
    seller: "Caribbean Organics",
    crop: "Bananas",
    quantity: 1800,
    unit: "kg",
    region: "St. Andrew",
    status: "quality_check",
    date: "2025-10-10",
    time: "10:00",
    notes: "QA pending sugar levels",
  },
  {
    id: "H-1003",
    seller: "Island Fresh Co-Op",
    crop: "Cucumbers",
    quantity: 900,
    unit: "kg",
    region: "St. David",
    status: "in_progress",
    date: "2025-10-10",
    time: "11:15",
  },
  {
    id: "H-1004",
    seller: "Blue Bay Agriculture",
    crop: "Sweet Peppers",
    quantity: 650,
    unit: "kg",
    region: "St. John",
    status: "planned",
    date: "2025-10-11",
    time: "07:45",
    notes: "Early morning harvest planned",
  },
  {
    id: "H-1005",
    seller: "Green Valley Farms",
    crop: "Lettuce",
    quantity: 400,
    unit: "kg",
    region: "St. George",
    status: "shipped",
    date: "2025-10-11",
    time: "13:20",
  },
  {
    id: "H-1006",
    seller: "Caribbean Organics",
    crop: "Plantains",
    quantity: 1100,
    unit: "kg",
    region: "St. Andrew",
    status: "delivered",
    date: "2025-10-09",
    time: "16:05",
  },
  {
    id: "H-1007",
    seller: "Suncrest Farms",
    crop: "Pineapples",
    quantity: 350,
    unit: "kg",
    region: "St. Patrick",
    status: "cancelled",
    date: "2025-10-09",
    time: "09:10",
    notes: "Weather delay",
  },
  {
    id: "H-1008",
    seller: "Island Fresh Co-Op",
    crop: "Carrots",
    quantity: 780,
    unit: "kg",
    region: "St. David",
    status: "harvested",
    date: "2025-10-08",
    time: "12:30",
  },
];

const statusStyles: Record<HarvestStatus, string> = {
  planned: "bg-gray-50 text-gray-700 border border-gray-200",
  in_progress: "bg-blue-50 text-blue-700 border border-blue-200",
  harvested: "bg-green-50 text-green-700 border border-green-200",
  quality_check: "bg-amber-50 text-amber-700 border border-amber-200",
  shipped: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  delivered: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
};

// Accent utilities to add an editorial color system to the timeline
const statusAccentBorder: Record<HarvestStatus, string> = {
  planned: "border-l-gray-200",
  in_progress: "border-l-blue-300",
  harvested: "border-l-green-300",
  quality_check: "border-l-amber-300",
  shipped: "border-l-indigo-300",
  delivered: "border-l-emerald-300",
  cancelled: "border-l-red-300",
};

const statusAccentDot: Record<HarvestStatus, string> = {
  planned: "bg-gray-400 ring-gray-200",
  in_progress: "bg-blue-500 ring-blue-200",
  harvested: "bg-green-500 ring-green-200",
  quality_check: "bg-amber-500 ring-amber-200",
  shipped: "bg-indigo-500 ring-indigo-200",
  delivered: "bg-emerald-500 ring-emerald-200",
  cancelled: "bg-red-500 ring-red-200",
};

export default function HarvestsPage() {
  const user = useAppSelector(selectAuthUser);
  const [search, setSearch] = useState("");
  const [crop, setCrop] = useState("");
  const [status, setStatus] = useState<"" | HarvestStatus>("");
  const [region, setRegion] = useState("");
  const [seller, setSeller] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeHarvest, setActiveHarvest] = useState<Harvest | null>(null);

  const crops = useMemo(
    () => Array.from(new Set(MOCK_HARVESTS.map((h) => h.crop))).sort(),
    []
  );
  const regions = useMemo(
    () => Array.from(new Set(MOCK_HARVESTS.map((h) => h.region))).sort(),
    []
  );
  const sellers = useMemo(
    () => Array.from(new Set(MOCK_HARVESTS.map((h) => h.seller))).sort(),
    []
  );

  const filtered = useMemo(() => {
    return MOCK_HARVESTS.filter((h) => {
      const matchesSearch = search
        ? [h.seller, h.crop, h.region, h.id]
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase())
        : true;
      const matchesCrop = crop ? h.crop === crop : true;
      const matchesStatus = status ? h.status === status : true;
      const matchesRegion = region ? h.region === region : true;
      const matchesSeller = seller ? h.seller === seller : true;

      const afterStart = startDate ? h.date >= startDate : true;
      const beforeEnd = endDate ? h.date <= endDate : true;

      return (
        matchesSearch &&
        matchesCrop &&
        matchesStatus &&
        matchesRegion &&
        matchesSeller &&
        afterStart &&
        beforeEnd
      );
    }).sort((a, b) =>
      a.date === b.date
        ? (b.time || "").localeCompare(a.time || "")
        : b.date.localeCompare(a.date)
    );
  }, [search, crop, status, region, seller, startDate, endDate]);

  const groupedByDate = useMemo(() => {
    const map = new Map<string, Harvest[]>();
    for (const h of filtered) {
      const list = map.get(h.date) || [];
      list.push(h);
      map.set(h.date, list);
    }
    return Array.from(map.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, items]) => ({
        date,
        items: items.sort((x, y) => (y.time || "").localeCompare(x.time || "")),
      }));
  }, [filtered]);

  const resetFilters = () => {
    setSearch("");
    setCrop("");
    setStatus("");
    setRegion("");
    setSeller("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      {/* Top Notice Bar */}
      <div className="bg-[var(--secondary-muted-edge)] text-white text-center py-2 text-sm">
        Shipping updates and regional availability
      </div>

      {/* Navigation (same behavior as home) */}
      {user?.accountType === "buyer" ? (
        <BuyerTopNavigation />
      ) : user?.accountType === "seller" ? (
        <SellerTopNavigation />
      ) : (
        <TopNavigation />
      )}

      <main>
        {/* Editorial Hero */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
              alt="Harvests across the region"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
          </div>
          <div className="relative max-w-[1280px] mx-auto px-6 text-white">
            <h1 className="text-4xl md:text-6xl font-light mb-4 tracking-tight leading-[1.1]">
              Harvests Timeline
            </h1>
            <p className="text-lg md:text-2xl font-light opacity-90 max-w-3xl">
              View recent and upcoming harvests from sellers across the
              Caribbean.
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filters */}
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-4 sm:p-6 mb-8">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by seller, crop, region, or ID..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 text-[color:var(--secondary-muted-edge)]">
                      <FunnelIcon className="h-5 w-5" />
                      <span className="text-sm">Filters</span>
                    </div>

                    <select
                      value={crop}
                      onChange={(e) => setCrop(e.target.value)}
                      className="rounded-full border border-[color:var(--secondary-soft-highlight)] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)]"
                    >
                      <option value="">All Crops</option>
                      {crops.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>

                    <select
                      value={status}
                      onChange={(e) =>
                        setStatus(e.target.value as HarvestStatus | "")
                      }
                      className="rounded-full border border-[color:var(--secondary-soft-highlight)] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)]"
                    >
                      <option value="">All Status</option>
                      <option value="planned">Planned</option>
                      <option value="in_progress">In Progress</option>
                      <option value="harvested">Harvested</option>
                      <option value="quality_check">Quality Check</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="rounded-full border border-[color:var(--secondary-soft-highlight)] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)]"
                    >
                      <option value="">All Regions</option>
                      {regions.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>

                    <select
                      value={seller}
                      onChange={(e) => setSeller(e.target.value)}
                      className="rounded-full border border-[color:var(--secondary-soft-highlight)] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)]"
                    >
                      <option value="">All Sellers</option>
                      {sellers.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-xl border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full rounded-xl border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)]"
                    />
                  </div>
                  <div className="flex items-center justify-start sm:justify-end gap-2">
                    <button
                      onClick={resetFilters}
                      className="rounded-xl border border-[color:var(--secondary-soft-highlight)] px-4 py-2 text-sm text-[color:var(--secondary-black)] hover:bg-[color:var(--secondary-soft-highlight)]/20"
                    >
                      Reset
                    </button>
                    <div className="text-xs text-[color:var(--secondary-muted-edge)] self-center">
                      {filtered.length} result{filtered.length === 1 ? "" : "s"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            {groupedByDate.length === 0 ? (
              <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-10 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--secondary-soft-highlight)]/30">
                  <ClockIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                </div>
                <p className="text-[color:var(--secondary-black)] font-medium">
                  No harvests match your filters
                </p>
                <p className="text-sm text-[color:var(--secondary-muted-edge)] mt-1">
                  Try adjusting your filters to see more results.
                </p>
              </div>
            ) : (
              <div className="space-y-14">
                {groupedByDate.map((group) => (
                  <div key={group.date} className="relative">
                    <div className="mb-6 flex items-center gap-4">
                      <div className="px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm text-[color:var(--secondary-black)] text-xs md:text-sm font-medium tracking-widest uppercase border border-[color:var(--secondary-soft-highlight)]/60">
                        {new Date(group.date).toLocaleDateString(undefined, {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-[color:var(--secondary-soft-highlight)] to-transparent" />
                    </div>

                    <div className="relative pl-7">
                      <div className="absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-[color:var(--secondary-soft-highlight)] via-[color:var(--secondary-soft-highlight)]/60 to-transparent" />

                      <div className="space-y-8">
                        {group.items.map((h) => (
                          <div key={h.id} className="relative">
                            {/* Timeline dot */}
                            <div
                              className={`absolute -left-[8px] top-5 h-4 w-4 rounded-full border-2 border-white shadow ring-2 ${
                                statusAccentDot[h.status]
                              }`}
                            />

                            {/* Card */}
                            <div
                              className={`bg-white rounded-xl border border-[color:var(--secondary-soft-highlight)]/60 shadow-sm hover:shadow-md transition-shadow duration-300 ${
                                statusAccentBorder[h.status]
                              } pl-4 sm:pl-5`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 pr-4">
                                <div className="flex items-start sm:items-center gap-3">
                                  <div
                                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                      statusStyles[h.status]
                                    }`}
                                  >
                                    {h.status.replace("_", " ")}
                                  </div>
                                  <div>
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                      <span className="text-[color:var(--secondary-black)] font-light text-lg md:text-xl">
                                        {h.crop}
                                      </span>
                                      <span className="text-[color:var(--secondary-muted-edge)]">
                                        • {h.quantity.toLocaleString()} {h.unit}
                                      </span>
                                      <span className="text-[color:var(--secondary-muted-edge)]">
                                        • {h.id}
                                      </span>
                                    </div>
                                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs md:text-sm text-[color:var(--secondary-muted-edge)]">
                                      <span className="inline-flex items-center gap-1.5">
                                        <UserGroupIcon className="h-4 w-4" />
                                        {h.seller}
                                      </span>
                                      <span className="inline-flex items-center gap-1.5">
                                        <MapPinIcon className="h-4 w-4" />
                                        {h.region}
                                      </span>
                                      {h.time && (
                                        <span className="inline-flex items-center gap-1.5">
                                          <ClockIcon className="h-4 w-4" />
                                          {h.time}
                                        </span>
                                      )}
                                      <span className="inline-flex items-center gap-1.5">
                                        <CubeIcon className="h-4 w-4" />
                                        Harvest
                                      </span>
                                    </div>
                                    {h.notes && (
                                      <p className="mt-3 text-sm md:text-base text-[color:var(--secondary-black)]/80 leading-relaxed">
                                        {h.notes}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setActiveHarvest(h)}
                                    className="rounded-full border border-[color:var(--secondary-soft-highlight)] px-4 py-2 text-xs sm:text-sm text-[color:var(--secondary-black)] hover:bg-[color:var(--secondary-soft-highlight)]/20"
                                    aria-haspopup="dialog"
                                    aria-label={`View details for ${h.crop} ${h.id}`}
                                  >
                                    View details
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        {/* Modal: Harvest Details */}
        {activeHarvest && (
          <div
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="harvest-dialog-title"
            onClick={(e) => {
              if ((e.target as HTMLElement).id === "harvest-backdrop")
                setActiveHarvest(null);
            }}
          >
            <div
              id="harvest-backdrop"
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <div className="relative bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl border border-[color:var(--secondary-soft-highlight)] m-0 sm:m-4">
              <div className="px-6 py-5 border-b border-[color:var(--secondary-soft-highlight)]/60 flex items-start justify-between">
                <div>
                  <h2
                    id="harvest-dialog-title"
                    className="text-xl font-light text-[color:var(--secondary-black)] tracking-tight"
                  >
                    {activeHarvest.crop} •{" "}
                    {activeHarvest.quantity.toLocaleString()}{" "}
                    {activeHarvest.unit}
                  </h2>
                  <p className="text-sm text-[color:var(--secondary-muted-edge)] mt-1">
                    {new Date(activeHarvest.date).toLocaleDateString()}{" "}
                    {activeHarvest.time ? `• ${activeHarvest.time}` : ""}
                  </p>
                </div>
                <button
                  onClick={() => setActiveHarvest(null)}
                  className="rounded-full px-3 py-1 text-sm border border-[color:var(--secondary-soft-highlight)] hover:bg-[color:var(--secondary-soft-highlight)]/20"
                  aria-label="Close details"
                >
                  Close
                </button>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="flex flex-wrap gap-3 text-sm text-[color:var(--secondary-black)]">
                  <span
                    className={`px-2.5 py-1 rounded-full ${
                      statusStyles[activeHarvest.status]
                    } text-xs font-medium`}
                  >
                    {activeHarvest.status.replace("_", " ")}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[color:var(--secondary-muted-edge)]">
                    <UserGroupIcon className="h-4 w-4" /> {activeHarvest.seller}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[color:var(--secondary-muted-edge)]">
                    <MapPinIcon className="h-4 w-4" /> {activeHarvest.region}
                  </span>
                </div>
                {activeHarvest.notes && (
                  <p className="text-[color:var(--secondary-black)]/80 leading-relaxed">
                    {activeHarvest.notes}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-xl border border-[color:var(--secondary-soft-highlight)] p-4 bg-[var(--primary-background)]">
                    <div className="text-[color:var(--secondary-muted-edge)]">
                      Harvest ID
                    </div>
                    <div className="font-medium text-[color:var(--secondary-black)] mt-1">
                      {activeHarvest.id}
                    </div>
                  </div>
                  <div className="rounded-xl border border-[color:var(--secondary-soft-highlight)] p-4 bg-[var(--primary-background)]">
                    <div className="text-[color:var(--secondary-muted-edge)]">
                      Quantity
                    </div>
                    <div className="font-medium text-[color:var(--secondary-black)] mt-1">
                      {activeHarvest.quantity.toLocaleString()}{" "}
                      {activeHarvest.unit}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setActiveHarvest(null)}
                    className="rounded-full border border-[color:var(--secondary-soft-highlight)] px-4 py-2 text-sm text-[color:var(--secondary-black)] hover:bg-[color:var(--secondary-soft-highlight)]/20"
                  >
                    Close
                  </button>
                  <button className="rounded-full bg-[var(--primary-accent2)] text-white px-4 py-2 text-sm hover:bg-[var(--primary-accent3)]">
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
