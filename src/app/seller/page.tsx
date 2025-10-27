"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useEffect, useState } from "react";
import AccountSetupLoader from "@/components/dashboard/AccountSetupLoader";
import MetricCard from "@/components/dashboard/MetricCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import OrderList, {
  type OrderListItem,
} from "@/components/dashboard/OrderList";
import AnalyticsTabs from "@/components/dashboard/AnalyticsTabs";
import {
  CurrencyDollarIcon,
  ShoppingBagIcon,
  CubeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
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
// Timeline replaced by ActivityFeed component
import type { SellerHomeProduct } from "@/store/slices/sellerHomeSlice";
import { useToast } from "@/components/ui/Toast";

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
  const { show } = useToast();
  const orderTab = useAppSelector(selectOrderTab);
  const analyticsTab = useAppSelector(selectAnalyticsTab);
  const isBuyer = useAppSelector((s) => s.auth.user?.accountType === "buyer");

  const dispatch = useAppDispatch();
  const sellerHome = useAppSelector((s) => s.sellerHome);

  useEffect(() => {
    dispatch(fetchSellerHome({ period: "last_30_days" }));
  }, [dispatch]);

  // One-time welcome toast for new sellers
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const shown = localStorage.getItem("onboarding:welcome_toast_shown");
      if (!shown) {
        localStorage.setItem("onboarding:welcome_toast_shown", "true");
        show("Welcome to Procur! 3 quick steps to go live.");
      }
    } catch (_) {
      // ignore storage errors
    }
  }, [show]);

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
    <div className="min-h-screen bg-white">
      {/* Navigation is provided by seller layout */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Account Setup Loader */}
        <div className="mb-8">
          <AccountSetupLoader />
        </div>

        {/* Hero Section */}
        <section className="rounded-xl bg-white border border-[color:var(--secondary-soft-highlight)] px-6 sm:px-10 py-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="min-w-0">
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[color:var(--secondary-black)]">
                Your catalog at a glance
              </h1>
              <p className="mt-2 text-sm text-[color:var(--secondary-muted-edge)] max-w-prose">
                Track top performers, spot low stock, and keep orders moving.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/seller/harvest-update"
                className="inline-flex items-center justify-center rounded-full bg-[var(--primary-accent2)] text-white px-5 py-2.5 text-sm font-medium hover:bg-[var(--primary-accent3)] transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2"
              >
                Post Harvest Update
              </Link>
              <Link
                href="/seller/inventory?import=csv"
                className="inline-flex items-center justify-center rounded-full border border-[color:var(--secondary-soft-highlight)] bg-transparent text-[color:var(--secondary-black)] px-5 py-2.5 text-sm font-medium hover:bg-black/[0.02] transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2"
              >
                Bulk import CSV
              </Link>
            </div>
          </div>
          <div className="mt-6">
            <div className="text-xs text-[color:var(--secondary-muted-edge)] mb-2 font-medium">
              Featured products
            </div>
            <div className="relative -mx-2 overflow-x-auto">
              <div className="flex gap-3 px-2 snap-x">
                {featuredProducts.length === 0 ? (
                  <div className="text-xs text-[color:var(--secondary-muted-edge)] px-2">
                    No featured products yet.
                  </div>
                ) : (
                  featuredProducts.map((product, idx) => (
                    <div
                      key={idx}
                      className="w-56 shrink-0 snap-start overflow-hidden rounded-xl bg-white border border-[color:var(--secondary-soft-highlight)]"
                    >
                      <div className="aspect-[4/3] overflow-hidden relative">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="224px"
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
            <>
              <MetricCard
                label="Revenue"
                value={kpis[0]?.value || "$0"}
                hint="last 30 days"
                icon={<CurrencyDollarIcon className="h-5 w-5" />}
              />
              <MetricCard
                label="Orders"
                value={kpis[1]?.value || 0}
                hint="completed + active"
                icon={<ShoppingBagIcon className="h-5 w-5" />}
              />
              <MetricCard
                label="Active products"
                value={kpis[2]?.value || 0}
                hint="in catalog"
                icon={<CubeIcon className="h-5 w-5" />}
              />
              <MetricCard
                label="Pending"
                value={kpis[3]?.value || 0}
                hint="awaiting action"
                icon={<ClockIcon className="h-5 w-5" />}
              />
            </>
          )}
        </section>

        {/* Main Split: Inventory/Orders + Insights */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Activity & Orders */}
          <div className="lg:col-span-8 space-y-8">
            <ActivityFeed />

            <OrderList
              items={filteredOrders.map<OrderListItem>((o) => ({
                id: o.id,
                buyer: o.buyer,
                date: o.eta,
                status: o.status,
              }))}
              actions={
                <button
                  onClick={() => router.push("/seller/orders")}
                  className="inline-flex items-center justify-center rounded-full bg-[var(--primary-accent2)] text-white px-4 py-2 text-xs font-medium hover:bg-[var(--primary-accent3)] transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2"
                >
                  View all orders
                </button>
              }
            />
          </div>

          {/* Right: Collapsible Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <details
                className="rounded-xl border border-[color:var(--secondary-soft-highlight)] bg-white p-4"
                open
              >
                <summary className="text-base font-semibold text-[color:var(--secondary-black)] cursor-pointer list-none">
                  <span>Insights & actions</span>
                </summary>
                <div className="mt-3 space-y-3">
                  {insights.length === 0 ? (
                    <div className="text-xs text-[color:var(--secondary-muted-edge)]">
                      No insights right now.
                    </div>
                  ) : (
                    insights.map((insight, idx) => (
                      <div
                        key={idx}
                        className={classNames(
                          "rounded-xl border border-[color:var(--secondary-soft-highlight)] p-4",
                          insight.urgent
                            ? "bg-[var(--primary-accent2)]/5"
                            : "bg-black/[0.02]"
                        )}
                      >
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
                    ))
                  )}
                </div>
              </details>

              <details className="rounded-xl border border-[color:var(--secondary-soft-highlight)] bg-white p-4">
                <summary className="text-base font-semibold text-[color:var(--secondary-black)] cursor-pointer list-none">
                  <span>Requests</span>
                </summary>
                <div className="mt-3 space-y-3">
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
                          <div className="h-8 w-8 rounded-full bg-[var(--primary-accent1)]/30 flex items-center justify-center text-[10px] font-semibold text-[color:var(--primary-accent3)]">
                            {req.buyer.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-[color:var(--secondary-black)] truncate">
                                {req.product} · {req.quantity} {req.unit}
                              </p>
                              <span
                                className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${req.priority === "high" ? "bg-[var(--primary-accent2)]/10 text-[color:var(--primary-accent2)]" : "bg-[var(--primary-base)]/10 text-[color:var(--primary-base)]"}`}
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
              </details>
            </div>
          </aside>
        </div>

        {/* Analytics Tabs */}
        <AnalyticsTabs
          active={analyticsTab}
          onChange={(tab) => dispatch(setAnalyticsTabAction(tab))}
        />
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
