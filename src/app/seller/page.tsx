"use client";

import SellerTopNavigation from "@/components/navigation/SellerTopNavigation";
import Footer from "@/components/footer/Footer";
import Link from "next/link";
import { useState, useMemo } from "react";

type InventoryRow = {
  item: string;
  sku: string;
  onHand: number;
  committed: number;
  available: number;
  sellThrough7d: number;
  image?: string;
};

type OrderRow = {
  id: string;
  buyer: string;
  buyerLogo?: string;
  items: number;
  total: string;
  eta: string;
  status: "new" | "preparing" | "in_transit" | "delivered" | "issue";
};

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function SellerDashboardPage() {
  type OrderTab =
    | "All"
    | "New"
    | "Preparing"
    | "In transit"
    | "Delivered"
    | "Issues";
  const [orderTab, setOrderTab] = useState<OrderTab>("All");
  type AnalyticsTab =
    | "Revenue & Orders"
    | "Category performance"
    | "Fulfillment health";
  const [analyticsTab, setAnalyticsTab] =
    useState<AnalyticsTab>("Revenue & Orders");

  // Mock data - wire to API
  const kpis = [
    {
      label: "Revenue",
      value: "$24,580",
      delta: "+12%",
      trend: "up",
      hint: "vs last week",
    },
    {
      label: "Orders",
      value: "214",
      delta: "+9%",
      trend: "up",
      hint: "completed + active",
    },
    {
      label: "In Stock",
      value: "1,482",
      delta: "-3%",
      trend: "down",
      hint: "sellable units",
    },
    {
      label: "OTIF",
      value: "96%",
      delta: "+2 pts",
      trend: "up",
      hint: "on-time delivery",
    },
  ];

  const featuredProducts = [
    {
      name: "Organic Tomatoes",
      price: "$4.99/lb",
      image:
        "https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400&h=300&fit=crop&auto=format&q=75",
      status: "In Stock",
    },
    {
      name: "Fresh Eggs",
      price: "$6.50/dozen",
      image:
        "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=300&fit=crop&auto=format&q=75",
      status: "Low Stock",
    },
    {
      name: "Green Cucumbers",
      price: "$2.99/lb",
      image:
        "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&h=300&fit=crop&auto=format&q=75",
      status: "In Stock",
    },
    {
      name: "Bell Peppers",
      price: "$3.49/lb",
      image:
        "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=300&fit=crop&auto=format&q=75",
      status: "In Stock",
    },
  ];

  const inventory: InventoryRow[] = [
    {
      item: "Tomatoes (Roma)",
      sku: "TOM-RM-1",
      onHand: 320,
      committed: 140,
      available: 180,
      sellThrough7d: 42,
      image:
        "https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=48&h=48&fit=crop&auto=format&q=75",
    },
    {
      item: "Cucumbers",
      sku: "CUC-GL-2",
      onHand: 860,
      committed: 90,
      available: 770,
      sellThrough7d: 18,
      image:
        "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=48&h=48&fit=crop&auto=format&q=75",
    },
    {
      item: "Eggs (Free-range, dozen)",
      sku: "EGG-FR-12",
      onHand: 40,
      committed: 60,
      available: -20,
      sellThrough7d: 55,
      image:
        "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=48&h=48&fit=crop&auto=format&q=75",
    },
    {
      item: "Bell Peppers (Mixed)",
      sku: "PEP-MX-3",
      onHand: 540,
      committed: 120,
      available: 420,
      sellThrough7d: 28,
      image:
        "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=48&h=48&fit=crop&auto=format&q=75",
    },
  ];

  const orders: OrderRow[] = useMemo(
    () => [
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
        eta: new Date(Date.now() + 2 * 36e5).toISOString(),
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
      {
        id: "#10231",
        buyer: "Farm Fresh Co-op",
        items: 5,
        total: "$645",
        eta: new Date(Date.now() + 12 * 36e5).toISOString(),
        status: "new",
      },
    ],
    []
  );

  const filteredOrders = useMemo(() => {
    if (orderTab === "All") return orders;
    const statusMap: Record<string, OrderRow["status"]> = {
      New: "new",
      Preparing: "preparing",
      "In transit": "in_transit",
      Delivered: "delivered",
      Issues: "issue",
    };
    return orders.filter((o) => o.status === statusMap[orderTab]);
  }, [orderTab, orders]);

  const insights = [
    {
      title: "Roma tomatoes projected to stock out in 5 days",
      sub: "Current velocity: 64 units/day",
      cta: "Reorder 300 units",
      action: () => console.log("Reorder action"),
      urgent: true,
    },
    {
      title: "High demand: organic leafy greens",
      sub: "120 searches last week; you have 0 listings",
      cta: "Create listing",
      action: () => console.log("Create listing"),
      urgent: false,
    },
    {
      title: "On-time delivery improved 2 pts vs last month",
      cta: "View fulfillment",
      action: () => console.log("View fulfillment"),
      urgent: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <SellerTopNavigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Hero Editorial Band */}
        <section className="rounded-3xl bg-[var(--primary-accent1)]/14 border border-[color:var(--secondary-soft-highlight)] px-6 sm:px-10 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:items-center">
            {/* Left: Content */}
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)] mb-3">
                Seller
              </div>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[color:var(--secondary-black)]">
                Your catalog at a glance
              </h1>
              <p className="mt-2 text-sm text-[color:var(--secondary-muted-edge)] max-w-prose">
                Track top performers, spot low stock, and keep orders moving.
              </p>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <Link
                  href="/seller/add/product"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--primary-accent2)] text-white px-5 py-2.5 text-sm font-medium hover:bg-[var(--primary-accent3)] transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2"
                >
                  Add product
                </Link>
                <Link
                  href="/seller/inventory?import=csv"
                  className="inline-flex items-center justify-center rounded-full border border-[color:var(--secondary-soft-highlight)] bg-transparent text-[color:var(--secondary-black)] px-5 py-2.5 text-sm font-medium hover:bg-white/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2"
                >
                  Bulk import CSV
                </Link>
              </div>
            </div>

            {/* Right: Featured products */}
            <div>
              <div className="text-xs text-[color:var(--secondary-muted-edge)] mb-3 font-medium">
                Featured products
              </div>
              <div className="grid grid-cols-2 gap-3">
                {featuredProducts.map((product, idx) => (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-2xl bg-white border border-[color:var(--secondary-soft-highlight)] hover:shadow-sm transition-shadow"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <div className="text-xs font-medium text-[color:var(--secondary-black)] truncate">
                        {product.name}
                      </div>
                      <div className="text-[10px] text-[color:var(--secondary-muted-edge)] mt-0.5">
                        {product.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* KPI Cards Row */}
        <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6 hover:shadow-sm transition-shadow"
            >
              <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)]">
                {kpi.label}
              </div>
              <div className="mt-1 text-2xl font-semibold text-[color:var(--secondary-black)]">
                {kpi.value}
              </div>
              <div
                className={classNames(
                  "mt-1 text-sm",
                  kpi.trend === "up"
                    ? "text-[color:var(--primary-base)]"
                    : "text-[color:var(--primary-accent2)]"
                )}
              >
                {kpi.delta}
              </div>
              <div className="mt-1 text-xs text-[color:var(--secondary-muted-edge)]">
                {kpi.hint}
              </div>
            </div>
          ))}
        </section>

        {/* Main Split: Inventory/Orders + Insights */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Inventory & Orders */}
          <div className="lg:col-span-8 space-y-8">
            {/* Inventory Module */}
            <section className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-[color:var(--secondary-soft-highlight)]">
                <div>
                  <h2 className="text-base font-semibold text-[color:var(--secondary-black)]">
                    Inventory status
                  </h2>
                  <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                    Track stock levels and velocity
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/seller/add/product"
                    className="inline-flex items-center justify-center rounded-full bg-[var(--primary-accent2)] text-white px-4 py-2 text-xs font-medium hover:bg-[var(--primary-accent3)] transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2"
                  >
                    Add product
                  </Link>
                  <button className="inline-flex items-center justify-center rounded-full border border-[color:var(--secondary-soft-highlight)] bg-transparent text-[color:var(--secondary-muted-edge)] px-4 py-2 text-xs font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2">
                    Bulk edit
                  </button>
                  <button className="inline-flex items-center justify-center rounded-full border border-[color:var(--secondary-soft-highlight)] bg-transparent text-[color:var(--secondary-muted-edge)] px-4 py-2 text-xs font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2">
                    Reorder
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="px-5 py-3 flex flex-wrap gap-2 border-b border-[color:var(--secondary-soft-highlight)]/30">
                {[
                  "All products",
                  "Low stock",
                  "Backorder",
                  "High velocity",
                ].map((filter) => (
                  <button
                    key={filter}
                    className="rounded-full border border-[color:var(--secondary-soft-highlight)] px-3 py-1 text-xs text-[color:var(--secondary-muted-edge)] hover:border-[color:var(--primary-base)] transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2"
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <caption className="sr-only">Inventory status table</caption>
                  <thead className="bg-[var(--primary-background)] text-[10px] uppercase tracking-wide text-[color:var(--secondary-muted-edge)]">
                    <tr>
                      <th
                        scope="col"
                        className="px-5 py-3 text-left font-medium"
                      >
                        Item
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-left font-medium"
                      >
                        SKU
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-right font-medium"
                      >
                        On hand
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-right font-medium"
                      >
                        Committed
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-right font-medium"
                      >
                        Available
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-right font-medium"
                      >
                        7d Velocity
                      </th>
                      <th
                        scope="col"
                        className="px-5 py-3 text-left font-medium"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((row) => {
                      const isBackorder = row.available < 0;
                      const isLow = row.available < 100 && row.available >= 0;
                      const statusLabel = isBackorder
                        ? "Backorder"
                        : isLow
                        ? "Low"
                        : "Healthy";
                      const statusColor = isBackorder
                        ? "bg-[var(--primary-accent2)]/10 text-[color:var(--primary-accent2)]"
                        : isLow
                        ? "bg-[var(--primary-accent1)]/15 text-[color:var(--primary-accent3)]"
                        : "bg-[var(--primary-base)]/10 text-[color:var(--primary-base)]";

                      return (
                        <tr
                          key={row.sku}
                          className="border-t border-[color:var(--secondary-soft-highlight)]/30 hover:bg-black/[0.02] transition-colors"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {row.image && (
                                <img
                                  src={row.image}
                                  alt={row.item}
                                  className="h-8 w-8 rounded object-cover"
                                />
                              )}
                              <span className="text-sm text-[color:var(--secondary-black)] font-medium">
                                {row.item}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-4 text-sm text-[color:var(--secondary-muted-edge)]">
                            {row.sku}
                          </td>
                          <td className="px-3 py-4 text-sm text-[color:var(--secondary-black)] text-right tabular-nums">
                            {row.onHand}
                          </td>
                          <td className="px-3 py-4 text-sm text-[color:var(--secondary-black)] text-right tabular-nums">
                            {row.committed}
                          </td>
                          <td className="px-3 py-4 text-sm text-[color:var(--secondary-black)] text-right tabular-nums font-medium">
                            {row.available}
                          </td>
                          <td className="px-3 py-4 text-sm text-[color:var(--secondary-muted-edge)] text-right tabular-nums">
                            {row.sellThrough7d}%
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={classNames(
                                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                                statusColor
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
            </section>

            {/* Orders Module */}
            <section className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 border-b border-[color:var(--secondary-soft-highlight)]">
                <div>
                  <h2 className="text-base font-semibold text-[color:var(--secondary-black)]">
                    Orders at a glance
                  </h2>
                  <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                    Track shipments and fulfillment
                  </p>
                </div>
                <button className="inline-flex items-center justify-center rounded-full bg-[var(--primary-accent2)] text-white px-4 py-2 text-xs font-medium hover:bg-[var(--primary-accent3)] transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2">
                  Create shipment
                </button>
              </div>

              {/* Tabs */}
              <div className="px-5 py-3 flex flex-wrap gap-2 border-b border-[color:var(--secondary-soft-highlight)]/30">
                {[
                  "All",
                  "New",
                  "Preparing",
                  "In transit",
                  "Delivered",
                  "Issues",
                ].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setOrderTab(tab as OrderTab)}
                    className={classNames(
                      "rounded-full border px-3 py-1 text-xs transition-all focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2",
                      orderTab === tab
                        ? "bg-[var(--primary-accent2)] text-white border-[var(--primary-accent2)]"
                        : "border-[color:var(--secondary-soft-highlight)] text-[color:var(--secondary-muted-edge)] hover:border-[color:var(--primary-base)]"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Order List */}
              <div>
                {filteredOrders.length === 0 ? (
                  <div className="px-5 py-12 text-center text-sm text-[color:var(--secondary-muted-edge)]">
                    No orders in this status
                  </div>
                ) : (
                  filteredOrders.map((order, idx) => {
                    const statusConfig: Record<
                      OrderRow["status"],
                      { label: string; color: string }
                    > = {
                      new: {
                        label: "New",
                        color:
                          "bg-[var(--secondary-highlight2)]/20 text-[color:var(--secondary-muted-edge)]",
                      },
                      preparing: {
                        label: "Preparing",
                        color:
                          "bg-[var(--primary-accent1)]/15 text-[color:var(--primary-accent3)]",
                      },
                      in_transit: {
                        label: "In transit",
                        color:
                          "bg-[var(--secondary-highlight1)]/25 text-[color:var(--secondary-muted-edge)]",
                      },
                      delivered: {
                        label: "Delivered",
                        color:
                          "bg-[var(--primary-base)]/15 text-[color:var(--primary-base)]",
                      },
                      issue: {
                        label: "Issue",
                        color:
                          "bg-[var(--primary-accent2)]/10 text-[color:var(--primary-accent2)]",
                      },
                    };

                    const status = statusConfig[order.status];

                    return (
                      <div
                        key={order.id}
                        className={classNames(
                          "px-5 py-4 flex items-center justify-between hover:bg-black/[0.02] transition-colors",
                          idx > 0 &&
                            "border-t border-[color:var(--secondary-soft-highlight)]/30"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {/* Avatar placeholder */}
                          <div className="h-8 w-8 rounded-full bg-[var(--primary-accent1)]/20 flex items-center justify-center text-xs font-medium text-[color:var(--primary-accent3)]">
                            {order.buyer.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm text-[color:var(--secondary-black)] font-medium">
                              <Link
                                href={`/seller/orders/${order.id.replace(
                                  "#",
                                  ""
                                )}`}
                                className="hover:underline"
                              >
                                {order.id}
                              </Link>
                              {" · "}
                              <span className="font-normal text-[color:var(--secondary-muted-edge)]">
                                {order.buyer}
                              </span>
                            </div>
                            <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                              {order.items} items · {order.total}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-xs text-[color:var(--secondary-muted-edge)] hidden sm:block">
                            {new Date(order.eta).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <span
                            className={classNames(
                              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                              status.color
                            )}
                          >
                            {status.label}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-5 flex flex-wrap gap-2 border-t border-[color:var(--secondary-soft-highlight)]/30">
                <button className="inline-flex items-center justify-center rounded-full border border-[color:var(--secondary-soft-highlight)] bg-transparent text-[color:var(--secondary-muted-edge)] px-4 py-2 text-xs font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2">
                  Refund item
                </button>
                <button className="inline-flex items-center justify-center rounded-full border border-[color:var(--secondary-soft-highlight)] bg-transparent text-[color:var(--secondary-muted-edge)] px-4 py-2 text-xs font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2">
                  Hold order
                </button>
                <button className="inline-flex items-center justify-center rounded-full border border-[color:var(--secondary-soft-highlight)] bg-transparent text-[color:var(--secondary-muted-edge)] px-4 py-2 text-xs font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2">
                  Print invoice
                </button>
              </div>
            </section>
          </div>

          {/* Right: Insights Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-5 space-y-4">
              <h2 className="text-base font-semibold text-[color:var(--secondary-black)]">
                Insights & actions
              </h2>

              <div className="space-y-3">
                {insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className={classNames(
                      "rounded-xl border border-[color:var(--secondary-soft-highlight)] p-4",
                      insight.urgent
                        ? "bg-[var(--primary-accent2)]/5"
                        : "bg-gray-50/50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="h-5 w-5 flex-shrink-0 mt-0.5">
                        <svg
                          className="w-full h-full text-[color:var(--secondary-muted-edge)]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          {insight.urgent ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          )}
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[color:var(--secondary-black)] font-medium">
                          {insight.title}
                        </p>
                        {insight.sub && (
                          <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
                            {insight.sub}
                          </p>
                        )}
                        {insight.cta && (
                          <button
                            onClick={insight.action}
                            className="mt-2 inline-flex items-center rounded-full bg-[var(--primary-accent2)] text-white px-4 py-1.5 text-xs font-medium hover:bg-[var(--primary-accent3)] transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2"
                          >
                            {insight.cta}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Analytics Band */}
        <section className="mt-12 sm:mt-14">
          {/* Tab Navigation */}
          <div className="flex gap-4 border-b border-[color:var(--secondary-soft-highlight)]">
            {[
              "Revenue & Orders",
              "Category performance",
              "Fulfillment health",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setAnalyticsTab(tab as AnalyticsTab)}
                className={classNames(
                  "px-2 pb-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2",
                  analyticsTab === tab
                    ? "text-[color:var(--secondary-black)] border-b-2 border-[color:var(--primary-base)]"
                    : "text-[color:var(--secondary-muted-edge)] hover:text-[color:var(--secondary-black)]"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Analytics Panel */}
          <div className="mt-6 rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-[color:var(--secondary-muted-edge)]">
                {analyticsTab === "Revenue & Orders" &&
                  "Track revenue trends and order volume over time"}
                {analyticsTab === "Category performance" &&
                  "Revenue and margin breakdown by product category"}
                {analyticsTab === "Fulfillment health" &&
                  "Lead time, on-time delivery, and cancellation rates"}
              </p>
              <div className="flex gap-2">
                <button className="inline-flex items-center justify-center rounded-full border border-[color:var(--secondary-soft-highlight)] bg-transparent text-[color:var(--secondary-muted-edge)] px-4 py-2 text-xs font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2">
                  Export CSV
                </button>
                <button className="inline-flex items-center justify-center rounded-full border border-[color:var(--secondary-soft-highlight)] bg-transparent text-[color:var(--secondary-muted-edge)] px-4 py-2 text-xs font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2">
                  Export PNG
                </button>
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className="h-64 rounded-xl bg-gradient-to-br from-[var(--primary-background)] to-white border border-[color:var(--secondary-soft-highlight)]/50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-sm text-[color:var(--secondary-muted-edge)]">
                  Chart visualization
                </div>
                <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
                  {analyticsTab}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
