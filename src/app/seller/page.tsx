"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  selectOrderTab,
  selectAnalyticsTab,
  setOrderTab as setOrderTabAction,
  setAnalyticsTab as setAnalyticsTabAction,
  type OrderTab,
  type AnalyticsTab,
} from "@/store/slices/sellerSlice";
import { fetchSellerHome } from "@/store/slices/sellerHomeSlice";
import { useRouter } from "next/navigation";
import {
  fetchHarvestFeed,
  addHarvestComment,
  createHarvestBuyerRequest,
  acknowledgeHarvestBuyerRequest,
} from "@/store/slices/harvestFeedSlice";
import type { SellerHomeProduct } from "@/store/slices/sellerHomeSlice";

// InventoryRow removed as inventory section has been replaced by timeline

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
  const router = useRouter();
  const orderTab = useAppSelector(selectOrderTab);
  const analyticsTab = useAppSelector(selectAnalyticsTab);
  const isBuyer = useAppSelector((s) => s.auth.user?.accountType === "buyer");

  const dispatch = useAppDispatch();
  const sellerHome = useAppSelector((s) => s.sellerHome);

  useEffect(() => {
    dispatch(fetchSellerHome({ period: "last_30_days" }));
    dispatch(fetchHarvestFeed());
  }, [dispatch]);

  const kpis = useMemo(() => {
    const homeData = sellerHome.data;
    if (!homeData)
      return [] as Array<{
        label: string;
        value: string;
        delta?: string;
        trend?: "up" | "down";
        hint?: string;
      }>;
    return [
      {
        label: "Revenue",
        value:
          homeData.metrics.total_revenue?.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          }) ?? "$0",
        delta: undefined,
        trend: undefined,
        hint: "last 30 days",
      },
      {
        label: "Orders",
        value: String(homeData.metrics.total_orders ?? 0),
        hint: "completed + active",
      },
      {
        label: "Active products",
        value: String(homeData.metrics.active_products ?? 0),
        hint: "in catalog",
      },
      {
        label: "Pending",
        value: String(homeData.metrics.pending_orders ?? 0),
        hint: "awaiting action",
      },
    ];
  }, [sellerHome]);

  type FeaturedProductPreview = {
    name: string;
    price: string;
    image?: string;
    status?: string;
  };

  const featuredProducts = useMemo<FeaturedProductPreview[]>(() => {
    const homeData = sellerHome.data;
    return (
      homeData?.featured_products?.map((p: SellerHomeProduct) => ({
        name: p.name,
        price:
          p.sale_price != null
            ? p.sale_price.toLocaleString("en-US", {
                style: "currency",
                currency: p.currency || "USD",
              })
            : p.base_price != null
            ? p.base_price.toLocaleString("en-US", {
                style: "currency",
                currency: p.currency || "USD",
              })
            : "",
        image:
          p.images?.find(
            (i: { image_url: string; is_primary?: boolean }) => i.is_primary
          )?.image_url || p.images?.[0]?.image_url,
        status: undefined as string | undefined,
      })) ?? []
    );
  }, [sellerHome]);

  // Inventory table replaced by social timeline; keep mapping available if needed elsewhere

  const orders: OrderRow[] = useMemo(() => {
    const apiOrders = sellerHome.data?.recent_orders ?? [];
    return apiOrders.map((o) => ({
      id: o.order_number || o.id,
      buyer: (o as any).buyer_name || "Buyer",
      items: o.items?.reduce((sum, i) => sum + (i.quantity ?? 0), 0) ?? 0,
      total: (o.total_amount ?? 0).toLocaleString("en-US", {
        style: "currency",
        currency: (o as any).currency || "USD",
      }),
      eta: o.created_at,
      status: (() => {
        const s = (o.status || "").toLowerCase();
        if (s === "pending") return "new";
        if (s === "processing" || s === "accepted") return "preparing";
        if (s === "shipped") return "in_transit";
        if (s === "delivered") return "delivered";
        return "issue";
      })(),
    }));
  }, [sellerHome]);

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

  const insights: Array<{
    title: string;
    sub?: string;
    cta?: string;
    action?: () => void;
    urgent?: boolean;
  }> = [];

  const buyerRequests = useMemo(() => {
    const homeData = sellerHome.data;
    return (
      homeData?.buyer_requests?.map((r) => ({
        id: r.request_number || r.id,
        buyer: r.buyer_name,
        product: r.product_name,
        quantity: r.quantity,
        unit: r.unit_of_measurement,
        location: "",
        needBy: r.date_needed ?? "",
        priceRange: r.budget_range_text,
        priority: r.priority ?? "normal",
      })) ?? []
    );
  }, [sellerHome]);

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      {/* Navigation is provided by seller layout */}

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
                  href="/seller/harvest-update"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--primary-accent2)] text-white px-5 py-2.5 text-sm font-medium hover:bg-[var(--primary-accent3)] transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2"
                >
                  Post Harvest Update
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
                {featuredProducts.length === 0 ? (
                  <div className="col-span-2 text-xs text-[color:var(--secondary-muted-edge)]">
                    No featured products yet.
                  </div>
                ) : (
                  featuredProducts.map((product, idx) => (
                    <div
                      key={idx}
                      className="overflow-hidden rounded-2xl bg-white border border-[color:var(--secondary-soft-highlight)] hover:shadow-sm transition-shadow"
                    >
                      <div className="aspect-[4/3] overflow-hidden relative">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 1024px) 50vw, 25vw"
                            className="object-cover hover:scale-[1.02] transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-[color:var(--secondary-muted-edge)] bg-[var(--primary-background)]">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <div className="text-xs font-medium text-[color:var(--secondary-black)] truncate">
                          {product.name}
                        </div>
                        {product.price && (
                          <div className="text-[10px] text-[color:var(--secondary-muted-edge)] mt-0.5">
                            {product.price}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* KPI Cards Row */}
        <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.length === 0 ? (
            <div className="col-span-4 text-xs text-[color:var(--secondary-muted-edge)]">
              No metrics yet.
            </div>
          ) : (
            kpis.map((kpi) => (
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
                {kpi.delta && (
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
                )}
                <div className="mt-1 text-xs text-[color:var(--secondary-muted-edge)]">
                  {kpi.hint}
                </div>
              </div>
            ))
          )}
        </section>

        {/* Main Split: Inventory/Orders + Insights */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Timeline & Orders */}
          <div className="lg:col-span-8 space-y-8">
            {/* Social Harvest Timeline */}
            <Timeline />

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
                <button
                  onClick={() => router.push("/seller/orders")}
                  className="inline-flex items-center justify-center rounded-full bg-[var(--primary-accent2)] text-white px-4 py-2 text-xs font-medium hover:bg-[var(--primary-accent3)] transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2"
                >
                  View all orders
                </button>
              </div>

              {/* Tabs */}
              <div className="px-5 py-3 flex flex-wrap gap-2 border-b border-[color:var(--secondary-soft-highlight)]/30">
                {(
                  [
                    "All",
                    "New",
                    "Preparing",
                    "In transit",
                    "Delivered",
                    "Issues",
                  ] as OrderTab[]
                ).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => dispatch(setOrderTabAction(tab))}
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
                        <Link
                          href={`/seller/orders/${order.id.replace("#", "")}`}
                          className="flex items-center gap-3 hover:opacity-75 transition-opacity"
                        >
                          {/* Avatar placeholder */}
                          <div className="h-8 w-8 rounded-full bg-[var(--primary-accent1)]/20 flex items-center justify-center text-xs font-medium text-[color:var(--primary-accent3)]">
                            {order.buyer.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm text-[color:var(--secondary-black)] font-medium">
                              <span className="hover:text-[var(--primary-accent2)]">
                                {order.id}
                              </span>
                              {" · "}
                              <span className="font-normal text-[color:var(--secondary-muted-edge)]">
                                {order.buyer}
                              </span>
                            </div>
                            <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                              {order.items} items · {order.total}
                            </div>
                          </div>
                        </Link>
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
            <div className="sticky top-24 space-y-4">
              {/* Insights & actions card */}
              <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-5 space-y-4">
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

              {/* Requests from buyers card */}
              <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-5">
                <h3 className="text-sm font-semibold text-[color:var(--secondary-black)] mb-2">
                  Requests from buyers
                </h3>
                <div className="space-y-3">
                  {buyerRequests.length === 0 ? (
                    <div className="text-xs text-[color:var(--secondary-muted-edge)]">
                      No requests yet.
                    </div>
                  ) : (
                    buyerRequests.map((req) => (
                      <div
                        key={req.id}
                        className="rounded-xl border border-[color:var(--secondary-soft-highlight)] p-4 bg-white"
                      >
                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <div className="h-8 w-8 rounded-full bg-[var(--primary-accent1)]/30 flex items-center justify-center text-[10px] font-semibold text-[color:var(--primary-accent3)]">
                            {req.buyer.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-[color:var(--secondary-black)] truncate">
                                {req.product} · {req.quantity} {req.unit}
                              </p>
                              <span
                                className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                  req.priority === "high"
                                    ? "bg-[var(--primary-accent2)]/10 text-[color:var(--primary-accent2)]"
                                    : "bg-[var(--primary-base)]/10 text-[color:var(--primary-base)]"
                                }`}
                              >
                                {req.priority === "high" ? "High" : "Normal"}
                              </span>
                            </div>
                            <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5 truncate">
                              {req.buyer} · {req.location}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-[color:var(--secondary-muted-edge)]">
                              {req.needBy && (
                                <span>
                                  Need by{" "}
                                  {new Date(req.needBy).toLocaleDateString(
                                    "en-US",
                                    { month: "short", day: "numeric" }
                                  )}
                                </span>
                              )}
                              <span className="h-1 w-1 rounded-full bg-[color:var(--secondary-soft-highlight)]"></span>
                              {req.priceRange && (
                                <span>Budget {req.priceRange}</span>
                              )}
                            </div>
                            <div className="mt-3 flex gap-2">
                              <button className="inline-flex items-center rounded-full bg-[var(--primary-accent2)] text-white px-3 py-1.5 text-[11px] font-medium hover:bg-[var(--primary-accent3)] transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2">
                                Respond
                              </button>
                              <button className="inline-flex items-center rounded-full border border-[color:var(--secondary-soft-highlight)] bg-transparent text-[color:var(--secondary-muted-edge)] px-3 py-1.5 text-[11px] font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2">
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Analytics Band */}
        <section className="mt-12 sm:mt-14">
          {/* Tab Navigation */}
          <div className="flex gap-4 border-b border-[color:var(--secondary-soft-highlight)]">
            {(
              [
                "Revenue & Orders",
                "Category performance",
                "Fulfillment health",
              ] as AnalyticsTab[]
            ).map((tab) => (
              <button
                key={tab}
                onClick={() => dispatch(setAnalyticsTabAction(tab))}
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

            {/* Chart Placeholder (empty state) */}
            <div className="h-64 rounded-xl bg-gradient-to-br from-[var(--primary-background)] to-white border border-[color:var(--secondary-soft-highlight)]/50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-sm text-[color:var(--secondary-muted-edge)]">
                  No analytics yet.
                </div>
                <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
                  {analyticsTab}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Timeline() {
  const dispatch = useAppDispatch();
  const feed = useAppSelector((s) => s.harvestFeed);
  const isBuyer = useAppSelector((s) => s.auth.user?.accountType === "buyer");
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({});
  const [requestDraft, setRequestDraft] = useState<
    Record<
      string,
      { quantity: string; unit: string; date?: string; notes?: string }
    >
  >({});

  useEffect(() => {
    if (feed.status === "idle") dispatch(fetchHarvestFeed());
  }, [dispatch, feed.status]);

  return (
    <section className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-[color:var(--secondary-soft-highlight)]">
        <div>
          <h2 className="text-base font-semibold text-[color:var(--secondary-black)]">
            Harvest timeline
          </h2>
          <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
            Updates, comments, and buyer requests
          </p>
        </div>
        <Link
          href="/seller/harvest-update"
          className="inline-flex items-center justify-center rounded-full bg-[var(--primary-accent2)] text-white px-4 py-2 text-xs font-medium hover:bg-[var(--primary-accent3)] transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2"
        >
          Post update
        </Link>
      </div>

      {feed.status === "loading" ? (
        <div className="p-5 text-sm text-[color:var(--secondary-muted-edge)]">
          Loading feed…
        </div>
      ) : feed.items.length === 0 ? (
        <div className="p-5 text-sm text-[color:var(--secondary-muted-edge)]">
          No harvest updates yet.
        </div>
      ) : (
        <div className="divide-y divide-[color:var(--secondary-soft-highlight)]/30">
          {feed.items.map((item) => (
            <div key={item.id} className="p-5">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-[var(--primary-accent1)]/20 flex items-center justify-center text-xs font-semibold text-[color:var(--primary-accent3)]">
                  {item.crop.slice(0, 1)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-[color:var(--secondary-black)] font-medium">
                      {item.crop}
                      {item.quantity != null && item.unit && (
                        <span className="ml-1 text-[color:var(--secondary-muted-edge)] font-normal">
                          · {item.quantity} {item.unit}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-[color:var(--secondary-muted-edge)]">
                      {new Date(item.created_at).toLocaleString()}
                    </div>
                  </div>
                  {item.expected_harvest_window && (
                    <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                      Window: {item.expected_harvest_window}
                    </div>
                  )}
                  {item.notes && (
                    <div className="text-sm text-[color:var(--secondary-black)] mt-2 whitespace-pre-wrap">
                      {item.notes}
                    </div>
                  )}

                  {/* Social actions */}
                  <div className="mt-3 flex gap-3 text-[11px] text-[color:var(--secondary-muted-edge)]">
                    <span>{item.comments_count} Comments</span>
                    <span className="h-1 w-1 rounded-full bg-[color:var(--secondary-soft-highlight)]"></span>
                    <span>{item.requests_count} Requests</span>
                  </div>

                  {/* Comments */}
                  <div className="mt-3 space-y-3">
                    {item.comments.map((c) => (
                      <div key={c.id} className="flex items-start gap-2">
                        <div className="h-6 w-6 rounded-full bg-[var(--primary-base)]/15 flex items-center justify-center text-[10px] text-[color:var(--primary-base)]">
                          B
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-[color:var(--secondary-black)]">
                            {c.content}
                          </div>
                          <div className="text-[10px] text-[color:var(--secondary-muted-edge)] mt-0.5">
                            {new Date(c.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <input
                        value={commentDraft[item.id] || ""}
                        onChange={(e) =>
                          setCommentDraft((s) => ({
                            ...s,
                            [item.id]: e.target.value,
                          }))
                        }
                        placeholder="Write a comment…"
                        className="flex-1 rounded-full border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)]"
                      />
                      <button
                        onClick={() => {
                          const content = (commentDraft[item.id] || "").trim();
                          if (!content) return;
                          dispatch(
                            addHarvestComment({ harvestId: item.id, content })
                          );
                          setCommentDraft((s) => ({ ...s, [item.id]: "" }));
                        }}
                        className="rounded-full bg-[var(--primary-base)] text-white px-3 py-2 text-xs font-medium hover:opacity-90"
                      >
                        Comment
                      </button>
                    </div>
                  </div>

                  {/* Buyer Requests */}
                  <div className="mt-4">
                    <div className="text-xs text-[color:var(--secondary-muted-edge)] mb-2">
                      Request from this harvest
                    </div>
                    {item.requests.map((r) => (
                      <div
                        key={r.id}
                        className="rounded-xl border border-[color:var(--secondary-soft-highlight)] p-3 mb-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-[color:var(--secondary-black)] font-medium">
                            {r.requested_quantity} {r.unit}
                          </div>
                          <span
                            className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                              r.status === "pending"
                                ? "bg-[var(--secondary-highlight1)]/25 text-[color:var(--secondary-muted-edge)]"
                                : r.status === "acknowledged_yes"
                                ? "bg-[var(--primary-base)]/15 text-[color:var(--primary-base)]"
                                : "bg-[var(--primary-accent2)]/10 text-[color:var(--primary-accent2)]"
                            }`}
                          >
                            {r.status === "pending"
                              ? "Pending"
                              : r.status === "acknowledged_yes"
                              ? "Can fulfill"
                              : "Cannot fulfill"}
                          </span>
                        </div>
                        {r.seller_message && (
                          <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
                            {r.seller_message}
                          </div>
                        )}
                        {r.status === "pending" && (
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() =>
                                dispatch(
                                  acknowledgeHarvestBuyerRequest({
                                    requestId: r.id,
                                    can_fulfill: true,
                                  })
                                )
                              }
                              className="inline-flex items-center rounded-full bg-[var(--primary-base)] text-white px-3 py-1.5 text-[11px] font-medium hover:opacity-90"
                            >
                              Acknowledge yes
                            </button>
                            <button
                              onClick={() =>
                                dispatch(
                                  acknowledgeHarvestBuyerRequest({
                                    requestId: r.id,
                                    can_fulfill: false,
                                  })
                                )
                              }
                              className="inline-flex items-center rounded-full border border-[color:var(--secondary-soft-highlight)] bg-transparent text-[color:var(--secondary-muted-edge)] px-3 py-1.5 text-[11px] font-medium hover:bg-gray-50"
                            >
                              Acknowledge no
                            </button>
                          </div>
                        )}
                      </div>
                    ))}

                    {isBuyer && (
                      <div className="rounded-xl border border-[color:var(--secondary-soft-highlight)] p-3">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            min={0}
                            placeholder="Quantity"
                            value={requestDraft[item.id]?.quantity || ""}
                            onChange={(e) =>
                              setRequestDraft((s) => ({
                                ...s,
                                [item.id]: {
                                  ...(s[item.id] || {
                                    quantity: "",
                                    unit: "kg",
                                  }),
                                  quantity: e.target.value,
                                },
                              }))
                            }
                            className="rounded-full border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)]"
                          />
                          <input
                            placeholder="Unit (e.g. kg)"
                            value={requestDraft[item.id]?.unit || ""}
                            onChange={(e) =>
                              setRequestDraft((s) => ({
                                ...s,
                                [item.id]: {
                                  ...(s[item.id] || { quantity: "", unit: "" }),
                                  unit: e.target.value,
                                },
                              }))
                            }
                            className="rounded-full border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)]"
                          />
                          <input
                            type="date"
                            value={requestDraft[item.id]?.date || ""}
                            onChange={(e) =>
                              setRequestDraft((s) => ({
                                ...s,
                                [item.id]: {
                                  ...(s[item.id] || { quantity: "", unit: "" }),
                                  date: e.target.value,
                                },
                              }))
                            }
                            className="rounded-full border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)]"
                          />
                          <input
                            placeholder="Notes (optional)"
                            value={requestDraft[item.id]?.notes || ""}
                            onChange={(e) =>
                              setRequestDraft((s) => ({
                                ...s,
                                [item.id]: {
                                  ...(s[item.id] || { quantity: "", unit: "" }),
                                  notes: e.target.value,
                                },
                              }))
                            }
                            className="rounded-full border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] col-span-2"
                          />
                        </div>
                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={() => {
                              const draft = requestDraft[item.id];
                              const quantity = Number(draft?.quantity || 0);
                              const unit = (draft?.unit || "").trim();
                              if (!quantity || !unit) return;
                              dispatch(
                                createHarvestBuyerRequest({
                                  harvestId: item.id,
                                  quantity,
                                  unit,
                                  requested_date: draft?.date,
                                  notes: draft?.notes,
                                })
                              );
                              setRequestDraft((s) => ({
                                ...s,
                                [item.id]: { quantity: "", unit: "" },
                              }));
                            }}
                            className="inline-flex items-center rounded-full bg-[var(--primary-accent2)] text-white px-3 py-1.5 text-[11px] font-medium hover:bg-[var(--primary-accent3)]"
                          >
                            Request
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
