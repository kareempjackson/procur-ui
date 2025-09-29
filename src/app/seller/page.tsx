"use client";

import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type DateRange = "Today" | "7d" | "30d" | "Quarter" | "YTD" | "Custom";

type InventoryRow = {
  item: string;
  sku: string;
  onHand: number;
  committed: number;
  available: number;
  sellThrough7d: number; // percentage 0-100
};

type OrderRow = {
  id: string;
  buyer: string;
  items: number;
  total: string;
  eta: string; // ISO date string
  status: "new" | "preparing" | "in_transit" | "delivered" | "issue";
};

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function SellerOverviewPage() {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange>("Today");
  const [org, setOrg] = useState("Main Farm");
  const [search, setSearch] = useState("");
  const [searchMode, setSearchMode] = useState<
    "All" | "Products" | "Orders" | "Buyers"
  >("All");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [orderTab, setOrderTab] = useState<
    "All" | "New" | "Preparing" | "In transit" | "Delivered" | "Issues"
  >("All");

  const dateRanges: DateRange[] = [
    "Today",
    "7d",
    "30d",
    "Quarter",
    "YTD",
    "Custom",
  ];

  // Telemetry stubs
  const log = (name: string, data?: Record<string, unknown>) => {
    // Replace with real analytics later
    // eslint-disable-next-line no-console
    console.log(name, data);
  };

  // Mocked KPI data (wire to API later)
  const kpis = [
    {
      label: "Revenue",
      value: "$24,580",
      delta: "+12% WoW",
      hint: "Gross sales, tax excl.",
      href: "/seller/analytics?tab=revenue",
    },
    {
      label: "Orders",
      value: "214",
      delta: "+9% WoW",
      hint: "Completed + in-progress",
      href: "/seller/orders",
    },
    {
      label: "In Stock",
      value: "1,482",
      delta: "-3% vs 7d",
      hint: "Sellable units now",
      href: "/seller/inventory",
    },
    {
      label: "OTIF",
      value: "96%",
      delta: "+2 pts",
      hint: "On-time, in-full",
      href: "/seller/analytics?tab=fulfillment",
    },
  ];

  // Mocked data tables
  const inventory: InventoryRow[] = [
    {
      item: "Tomatoes (Roma)",
      sku: "TOM-RM-1",
      onHand: 320,
      committed: 140,
      available: 180,
      sellThrough7d: 42,
    },
    {
      item: "Cucumbers",
      sku: "CUC-GL-2",
      onHand: 860,
      committed: 90,
      available: 770,
      sellThrough7d: 18,
    },
    {
      item: "Eggs (Free-range, dozen)",
      sku: "EGG-FR-12",
      onHand: 40,
      committed: 60,
      available: -20,
      sellThrough7d: 55,
    },
  ];

  const filteredInventory = useMemo(() => {
    if (!search) return inventory;
    const q = search.toLowerCase();
    return inventory.filter(
      (r) => r.item.toLowerCase().includes(q) || r.sku.toLowerCase().includes(q)
    );
  }, [inventory, search]);

  const orders: OrderRow[] = [
    {
      id: "#10234",
      buyer: "GreenLeaf Market",
      items: 8,
      total: "$1,240",
      eta: new Date(Date.now() + 36e5).toISOString(),
      status: "preparing",
    },
    {
      id: "#10233",
      buyer: "FreshCo Foods",
      items: 3,
      total: "$380",
      eta: new Date(Date.now() - 2 * 36e5).toISOString(),
      status: "in_transit",
    },
    {
      id: "#10232",
      buyer: "Urban Grocer",
      items: 12,
      total: "$2,115",
      eta: new Date(Date.now() - 24 * 36e5).toISOString(),
      status: "delivered",
    },
  ];

  const tabbedOrders = useMemo(() => {
    if (orderTab === "All") return orders;
    const map: Record<string, OrderRow["status"]> = {
      New: "new",
      Preparing: "preparing",
      "In transit": "in_transit",
      Delivered: "delivered",
      Issues: "issue",
    };
    const key = map[orderTab];
    return orders.filter((o) => o.status === key);
  }, [orders, orderTab]);

  const isLate = (o: OrderRow) =>
    new Date(o.eta).getTime() < Date.now() && o.status !== "delivered";

  // Dynamic search dock helpers
  const suggestionSeeds = [
    "tomatoes (SKU TOM-RM-1)",
    "order #10234",
    "GreenLeaf Market",
    "backorder items",
    "low stock this week",
  ];

  const [debouncedQ, setDebouncedQ] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(search), 160);
    return () => clearTimeout(t);
  }, [search]);

  const filteredSuggestions = useMemo(() => {
    if (!debouncedQ) return suggestionSeeds;
    const q = debouncedQ.toLowerCase();
    return suggestionSeeds.filter((s) => s.toLowerCase().includes(q));
  }, [debouncedQ]);

  const submitRoutes: Record<string, string> = {
    All: "/seller/search?q=",
    Products: "/seller/inventory?q=",
    Orders: "/seller/orders?q=",
    Buyers: "/seller/buyers?q=",
  };

  const onSearchSubmit = (q: string) => {
    const path = submitRoutes[searchMode] + encodeURIComponent(q);
    log("seller_search_submit", { query: q, mode: searchMode });
    router.push(path);
    setSuggestionsOpen(false);
  };

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestionsOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestion((i) => (i + 1) % filteredSuggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestion(
        (i) => (i - 1 + filteredSuggestions.length) % filteredSuggestions.length
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const choice = filteredSuggestions[activeSuggestion] || search;
      onSearchSubmit(choice);
    } else if (e.key === "Escape") {
      setSuggestionsOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      <main className="max-w-7xl mx-auto px-6 py-10" role="main">
        {/* Breadcrumbs at top */}
        <nav
          className="mb-6 text-sm text-[var(--primary-base)]"
          aria-label="Breadcrumb"
        >
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="px-2 py-1 rounded-full hover:bg-white">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <span className="px-2 py-1 rounded-full bg-white text-[var(--secondary-black)]">
                Seller
              </span>
            </li>
          </ol>
        </nav>

        {/* Hero: sleek catalog showcase with embedded search */}
        <section className="mb-16">
          <div className="relative overflow-hidden rounded-3xl bg-[var(--primary-accent1)] border border-[var(--secondary-soft-highlight)]">
            <div className="relative p-6 md:p-8">
              {/* Header content */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div className="flex-1 lg:py-8">
                  <div className="text-xs text-[var(--primary-accent3)] mb-2 font-medium">
                    {new Date().toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    • {org}
                  </div>
                  <h2 className="text-[28px] md:text-[36px] leading-tight font-medium text-[var(--secondary-black)]">
                    Your catalog at a glance
                  </h2>
                  <p className="mt-2 text-sm text-[var(--primary-accent3)] max-w-2xl text-pretty">
                    Track top performers, spot low stock, and keep your orders
                    moving.
                  </p>

                  {/* Action buttons */}
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <Link
                      href="/seller/add/product"
                      className="btn btn-primary px-6 h-11"
                    >
                      Add product
                    </Link>
                    <Link
                      href="/seller/inventory"
                      className="text-sm text-[var(--primary-accent3)] hover:text-[var(--secondary-black)] font-medium"
                    >
                      View catalog →
                    </Link>
                    <Link
                      href="/seller/inventory?import=csv"
                      className="text-sm text-[var(--primary-accent3)]/80 hover:text-[var(--primary-accent3)] font-medium"
                    >
                      Bulk import (CSV)
                    </Link>
                  </div>
                </div>

                {/* Featured products showcase */}
                <div className="lg:w-96">
                  <div className="text-xs text-[var(--primary-accent3)] mb-3 font-medium">
                    Featured Products
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        name: "Organic Tomatoes",
                        price: "$4.99/lb",
                        image:
                          "https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=200&h=200&fit=crop&crop=center",
                        status: "In Stock",
                      },
                      {
                        name: "Fresh Eggs",
                        price: "$6.50/dozen",
                        image:
                          "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&h=200&fit=crop&crop=center",
                        status: "Low Stock",
                      },
                      {
                        name: "Green Cucumbers",
                        price: "$2.99/lb",
                        image:
                          "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=200&h=200&fit=crop&crop=center",
                        status: "In Stock",
                      },
                      {
                        name: "Bell Peppers",
                        price: "$3.49/lb",
                        image:
                          "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=200&h=200&fit=crop&crop=center",
                        status: "In Stock",
                      },
                    ].map((product, idx) => (
                      <div
                        key={idx}
                        className="bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-white/50 hover:bg-white/95 transition-all duration-200"
                      >
                        <div className="w-full h-16 mb-2 rounded-lg overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-xs font-medium text-[var(--secondary-black)] truncate">
                          {product.name}
                        </div>
                        <div className="text-xs text-[var(--primary-accent2)] font-semibold">
                          {product.price}
                        </div>
                        <div className="text-[10px] text-[var(--primary-base)] mt-1">
                          {product.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Embedded search section */}
              <div className="mt-8 bg-white/95 backdrop-blur-sm rounded-2xl p-4 border border-white/50">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Search mode tabs */}
                  <div className="flex items-center gap-1 bg-white/80 rounded-full p-1">
                    {["All", "Products", "Orders", "Buyers"].map((m) => (
                      <button
                        key={m}
                        onClick={() => setSearchMode(m as any)}
                        className={classNames(
                          "px-3 py-2 text-sm rounded-full transition-all duration-200",
                          searchMode === m
                            ? "bg-[var(--primary-accent2)] text-white shadow-sm"
                            : "text-[var(--primary-base)] hover:bg-white/80"
                        )}
                        aria-pressed={searchMode === m}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  {/* Search input */}
                  <div className="relative flex-1">
                    <input
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setSuggestionsOpen(true);
                      }}
                      onKeyDown={onSearchKeyDown}
                      onFocus={() => setSuggestionsOpen(true)}
                      aria-label="Search"
                      placeholder={
                        searchMode === "All"
                          ? "Search products, orders, or buyers…"
                          : searchMode === "Products"
                          ? "Search name, SKU, or category…"
                          : searchMode === "Orders"
                          ? "Search order #, buyer, or status…"
                          : "Search buyer name or organization…"
                      }
                      className="input w-full h-11 bg-white/90 border-white/60 focus:bg-white focus:border-[var(--primary-accent2)]"
                    />
                    {suggestionsOpen && filteredSuggestions.length > 0 && (
                      <ul className="absolute left-0 right-0 mt-2 bg-white border border-[var(--secondary-soft-highlight)] rounded-xl overflow-hidden z-10 shadow-lg">
                        {filteredSuggestions.map((s, idx) => (
                          <li key={s}>
                            <button
                              className={classNames(
                                "w-full text-left px-4 py-3 text-sm transition-colors",
                                idx === activeSuggestion
                                  ? "bg-gray-50"
                                  : "hover:bg-gray-25"
                              )}
                              onMouseEnter={() => setActiveSuggestion(idx)}
                              onClick={() => onSearchSubmit(s)}
                            >
                              {s}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Search button */}
                  <button
                    className="btn btn-primary h-11 px-6 shadow-sm"
                    onClick={() =>
                      onSearchSubmit(search || filteredSuggestions[0] || "")
                    }
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Page header */}
        <section aria-labelledby="page-title" className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1
                id="page-title"
                className="text-[28px] md:text-[32px] leading-tight text-[var(--secondary-black)] font-medium text-balance"
              >
                Seller Overview
              </h1>
              <p className="mt-1 text-sm text-[var(--secondary-muted-edge)]">
                Today’s snapshot of your catalog, orders, and growth.
              </p>
            </div>

            {/* Global controls */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <div
                role="group"
                aria-label="Date range"
                className="flex items-center gap-1 bg-white rounded-full border border-[var(--secondary-soft-highlight)] p-1"
              >
                {dateRanges.map((dr) => (
                  <button
                    key={dr}
                    onClick={() => setDateRange(dr)}
                    className={classNames(
                      "px-3 py-1.5 text-sm rounded-full",
                      dateRange === dr
                        ? "bg-[var(--primary-accent2)] text-white"
                        : "text-[var(--primary-base)] hover:bg-gray-50"
                    )}
                    aria-pressed={dateRange === dr}
                  >
                    {dr}
                  </button>
                ))}
              </div>

              <select
                aria-label="Organization switcher"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                className="input h-9"
              >
                <option>Main Farm</option>
                <option>North Warehouse</option>
              </select>

              <div className="relative">
                <button className="btn btn-ghost h-9 px-4">Export</button>
                {/* Implement menu later */}
              </div>

              <Link
                href="/help/seller-overview"
                className="text-sm text-[var(--primary-base)] hover:text-[var(--primary-accent2)] px-2 py-1"
              >
                Help
              </Link>
            </div>
          </div>
        </section>

        {/* KPIs inline */}
        <section className="mt-2" aria-label="Key performance indicators">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-b border-[var(--secondary-soft-highlight)] py-3">
            {kpis.map((kpi, idx) => (
              <Link
                key={kpi.label}
                href={kpi.href}
                onClick={() =>
                  log("kpi_click", { label: kpi.label, range: dateRange })
                }
                className="group flex-1 min-w-[180px]"
              >
                <div className="text-xs text-[var(--primary-base)] group-hover:underline">
                  {kpi.label}
                </div>
                <div className="mt-0.5 text-2xl text-[var(--secondary-black)]">
                  {kpi.value}
                </div>
                <div className="text-xs text-[var(--primary-base)]">
                  {kpi.delta}
                </div>
                {idx < kpis.length - 1 && (
                  <span
                    className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-6 bg-[var(--secondary-soft-highlight)]"
                    aria-hidden="true"
                  ></span>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* Overview grid */}
        <section className="mt-8 grid grid-cols-12 gap-6" aria-label="Overview">
          {/* Left column */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Inventory block (flat) */}
            <div className="border-t border-[var(--secondary-soft-highlight)] pt-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-medium text-[var(--secondary-black)]">
                    Inventory status
                  </h2>
                  <p className="text-sm text-[var(--primary-base)]">
                    Low stock, backorders, and velocity
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/seller/add/product"
                    className="btn btn-ghost h-9 px-4"
                    onClick={() =>
                      log("inventory_action", { action: "add_product" })
                    }
                  >
                    Add product
                  </Link>
                  <button
                    className="btn btn-ghost h-9 px-4"
                    onClick={() =>
                      log("inventory_action", { action: "bulk_edit" })
                    }
                  >
                    Bulk edit
                  </button>
                  <button
                    className="btn btn-primary h-9 px-4"
                    onClick={() =>
                      log("inventory_action", { action: "reorder" })
                    }
                  >
                    Reorder
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <select className="input h-9" aria-label="Filter by status">
                  <option>All statuses</option>
                  <option>Low</option>
                  <option>Backorder</option>
                  <option>Healthy</option>
                </select>
                <select className="input h-9" aria-label="Filter by category">
                  <option>All categories</option>
                </select>
                <select className="input h-9" aria-label="Filter by warehouse">
                  <option>All warehouses</option>
                </select>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table
                  className="w-full text-sm"
                  aria-describedby="inventory-caption"
                >
                  <caption id="inventory-caption" className="sr-only">
                    Inventory table: low stock, backorders, velocity
                  </caption>
                  <thead className="text-left text-[var(--primary-base)] border-b border-[var(--secondary-soft-highlight)]">
                    <tr>
                      <th className="py-2 pr-4">Item</th>
                      <th className="py-2 pr-4">SKU</th>
                      <th className="py-2 pr-4">On hand</th>
                      <th className="py-2 pr-4">Committed</th>
                      <th className="py-2 pr-4">Available</th>
                      <th className="py-2 pr-4">7-day sell-through</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-8 text-center text-[var(--primary-base)]"
                        >
                          No products yet — add your first listing.
                        </td>
                      </tr>
                    )}
                    {filteredInventory.map((row) => {
                      const low = row.available < 100; // placeholder; wire to reorder_point per SKU
                      const backorder = row.available < 0;
                      const statusLabel = backorder
                        ? "Backorder"
                        : low
                        ? "Low"
                        : "Healthy";
                      const tint = backorder
                        ? "bg-[color:rgb(203_89_39_/_.08)] text-[var(--primary-accent2)]"
                        : low
                        ? "bg-[color:rgb(64_113_120_/_.10)] text-[var(--secondary-muted-edge)]"
                        : "bg-gray-50 text-gray-700";
                      return (
                        <tr
                          key={row.sku}
                          className="border-b border-[var(--secondary-soft-highlight)] last:border-0"
                        >
                          <td className="py-2 pr-4 whitespace-nowrap text-[var(--secondary-black)]">
                            {row.item}
                          </td>
                          <td className="py-2 pr-4 text-[var(--primary-base)]">
                            {row.sku}
                          </td>
                          <td className="py-2 pr-4">{row.onHand}</td>
                          <td className="py-2 pr-4">{row.committed}</td>
                          <td className="py-2 pr-4">{row.available}</td>
                          <td className="py-2 pr-4">{row.sellThrough7d}%</td>
                          <td className="py-2">
                            <span
                              className={classNames(
                                "px-2 py-1 rounded-full text-xs",
                                tint
                              )}
                            >
                              {statusLabel}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Orders block (flat) */}
            <div className="border-t border-[var(--secondary-soft-highlight)] pt-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-medium text-[var(--secondary-black)]">
                    Orders at a glance
                  </h2>
                  <p className="text-sm text-[var(--primary-base)]">
                    New, preparing, in transit, delivered
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="btn btn-primary h-9 px-4">
                    Create shipment
                  </button>
                  <button className="btn btn-ghost h-9 px-4">
                    Refund item
                  </button>
                  <button className="btn btn-ghost h-9 px-4">Hold order</button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1">
                {[
                  "All",
                  "New",
                  "Preparing",
                  "In transit",
                  "Delivered",
                  "Issues",
                ].map((t) => (
                  <button
                    key={t}
                    onClick={() => setOrderTab(t as any)}
                    className={classNames(
                      "px-3 py-1.5 text-sm rounded-full",
                      orderTab === t
                        ? "bg-[var(--primary-accent2)] text-white"
                        : "text-[var(--primary-base)] hover:bg-gray-50"
                    )}
                    aria-pressed={orderTab === t}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="mt-4 overflow-x-auto">
                <table
                  className="w-full text-sm"
                  aria-describedby="orders-caption"
                >
                  <caption id="orders-caption" className="sr-only">
                    Orders table with SLAs
                  </caption>
                  <thead className="text-left text-[var(--primary-base)] border-b border-[var(--secondary-soft-highlight)]">
                    <tr>
                      <th className="py-2 pr-4">Order #</th>
                      <th className="py-2 pr-4">Buyer</th>
                      <th className="py-2 pr-4">Items</th>
                      <th className="py-2 pr-4">Total</th>
                      <th className="py-2 pr-4">ETA</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabbedOrders.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 text-center text-[var(--primary-base)]"
                        >
                          No orders in range — try changing filters.
                        </td>
                      </tr>
                    )}
                    {tabbedOrders.map((o) => (
                      <tr
                        key={o.id}
                        className="border-b border-[var(--secondary-soft-highlight)] last:border-0"
                      >
                        <td className="py-2 pr-4 text-[var(--secondary-black)]">
                          <Link
                            href={`/seller/orders/${o.id}`}
                            className="hover:underline"
                          >
                            {o.id}
                          </Link>
                        </td>
                        <td className="py-2 pr-4 text-[var(--primary-base)]">
                          {o.buyer}
                        </td>
                        <td className="py-2 pr-4">{o.items}</td>
                        <td className="py-2 pr-4">{o.total}</td>
                        <td className="py-2 pr-4 whitespace-nowrap">
                          {new Date(o.eta).toLocaleString()}
                        </td>
                        <td className="py-2">
                          <div className="flex items-center gap-2">
                            {isLate(o) && (
                              <span className="px-2 py-0.5 rounded-full text-xs bg-[color:rgb(203_89_39_/_.10)] text-[var(--primary-accent2)]">
                                Late
                              </span>
                            )}
                            <span className="text-[var(--primary-base)] capitalize">
                              {o.status.replace("_", " ")}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  className="btn btn-ghost h-9 px-4"
                  onClick={() =>
                    log("order_row_action", { action: "print_invoice" })
                  }
                >
                  Print invoice
                </button>
                <button
                  className="btn btn-ghost h-9 px-4"
                  onClick={() =>
                    log("order_row_action", { action: "contact_buyer" })
                  }
                >
                  Contact buyer
                </button>
                <button
                  className="btn btn-primary h-9 px-4"
                  onClick={() =>
                    log("order_row_action", { action: "mark_shipped" })
                  }
                >
                  Mark shipped
                </button>
              </div>
            </div>
          </div>

          {/* Right column */}
          <aside
            className="col-span-12 lg:col-span-4 space-y-6"
            aria-label="Sidebar"
          >
            {/* Analytics mini (flat) */}
            <div className="border-t border-[var(--secondary-soft-highlight)] pt-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-[var(--secondary-black)]">
                  Performance
                </h2>
                <Link
                  href="/seller/analytics"
                  className="text-sm text-[var(--primary-base)] hover:text-[var(--primary-accent2)]"
                >
                  Open analytics
                </Link>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { label: "Revenue", callout: "$24.6k", delta: "+12%" },
                  { label: "AOV", callout: "$115", delta: "+4%" },
                  { label: "Repeat rate", callout: "27%", delta: "+3 pts" },
                  { label: "Fill rate", callout: "98%", delta: "+1 pt" },
                ].map((c) => (
                  <div
                    key={c.label}
                    className="border border-[var(--secondary-soft-highlight)] rounded-xl p-3"
                  >
                    <div className="text-xs text-[var(--primary-base)]">
                      {c.label}
                    </div>
                    <div className="mt-1 text-xl text-[var(--secondary-black)]">
                      {c.callout}
                    </div>
                    <div className="mt-1 h-8 bg-gray-50 rounded-md"></div>
                    <div className="mt-1 text-xs text-[var(--primary-base)]">
                      {c.delta}
                    </div>
                    <button className="sr-only">View data table</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights & tasks (flat) */}
            <div className="border-t border-[var(--secondary-soft-highlight)] pt-5">
              <h2 className="text-lg font-medium text-[var(--secondary-black)]">
                Insights & tasks
              </h2>
              <ul className="mt-3 space-y-3">
                <li className="border border-[var(--secondary-soft-highlight)] rounded-xl p-3 bg-[color:rgb(203_89_39_/_.06)]">
                  <div className="text-sm text-[var(--secondary-black)]">
                    Roma tomatoes projected to stock-out in 5 days. Reorder 300
                    units.
                  </div>
                  <div className="mt-2">
                    <button
                      className="btn btn-primary h-8 px-3"
                      onClick={() =>
                        log("inventory_alert_action", {
                          sku: "TOM-RM-1",
                          action: "reorder",
                          quantity: 300,
                        })
                      }
                    >
                      Reorder
                    </button>
                  </div>
                </li>
                <li className="border border-[var(--secondary-soft-highlight)] rounded-xl p-3 bg-gray-50">
                  <div className="text-sm text-[var(--secondary-black)]">
                    Buyers searched for 'organic leafy greens' 120× last week;
                    you have 0 listings.
                  </div>
                  <div className="mt-2">
                    <button
                      className="btn btn-ghost h-8 px-3"
                      onClick={() =>
                        log("insight_action", {
                          action: "create_listing",
                          topic: "organic leafy greens",
                        })
                      }
                    >
                      Create listing
                    </button>
                  </div>
                </li>
                <li className="border border-[var(--secondary-soft-highlight)] rounded-xl p-3 bg-gray-50">
                  <div className="text-sm text-[var(--secondary-black)]">
                    On-time delivery improved 2 pts vs last month.
                  </div>
                </li>
              </ul>
            </div>
          </aside>
        </section>

        {/* Analytics tabs */}
        <section className="mt-8" aria-label="Analytics">
          <AnalyticsTabs />
        </section>
      </main>

      <Footer />
    </div>
  );
}

function AnalyticsTabs() {
  const [active, setActive] = useState<
    "Revenue & Orders" | "Category performance" | "Fulfillment health"
  >("Revenue & Orders");
  const tabs: Array<{ id: typeof active; desc: string }> = [
    { id: "Revenue & Orders", desc: "Overlay or dual-axis; 30/90d toggle." },
    { id: "Category performance", desc: "Revenue and margin by category." },
    { id: "Fulfillment health", desc: "Lead time, OTIF, cancellations." },
  ];
  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-[var(--secondary-soft-highlight)] pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={
              active === t.id
                ? "px-4 py-2 text-sm rounded-full bg-[var(--primary-accent2)] text-white"
                : "px-4 py-2 text-sm rounded-full text-[var(--primary-base)] hover:bg-gray-50"
            }
            aria-pressed={active === t.id}
          >
            {t.id}
          </button>
        ))}
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <button className="btn btn-ghost h-9 px-4">Export CSV</button>
          <button className="btn btn-ghost h-9 px-4">Export PNG</button>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-[var(--primary-base)]">
          {tabs.find((t) => t.id === active)?.desc}
        </p>
        <div
          className="mt-3 h-64 bg-white border border-[var(--secondary-soft-highlight)] rounded-2xl"
          aria-hidden="true"
        />
        <button className="sr-only">View data table</button>
      </div>
    </div>
  );
}
