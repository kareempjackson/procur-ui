"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useEffect } from "react";
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
  setAnalyticsTab as setAnalyticsTabAction,
} from "@/store/slices/sellerSlice";
import { fetchSellerHome } from "@/store/slices/sellerHomeSlice";
import {
  fetchSellerInsights,
  executeSellerInsight,
} from "@/store/slices/sellerInsightsSlice";
import { useRouter } from "next/navigation";
// Timeline replaced by ActivityFeed component
import type {
  SellerHomeProduct,
  SellerHomeOrder,
} from "@/store/slices/sellerHomeSlice";
import { useToast } from "@/components/ui/Toast";
import { selectAuthUser } from "@/store/slices/authSlice";

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
  const authUser = useAppSelector(selectAuthUser);
  const orderTab = useAppSelector(selectOrderTab);
  const analyticsTab = useAppSelector(selectAnalyticsTab);
  // const isBuyer = useAppSelector((s) => s.auth.user?.accountType === "buyer");

  const dispatch = useAppDispatch();
  const sellerHome = useAppSelector((s) => s.sellerHome);
  const sellerInsights = useAppSelector((s) => s.sellerInsights);
  const latestFarmVisit = sellerHome.data?.latest_farm_visit_request;

  useEffect(() => {
    dispatch(fetchSellerHome({ period: "last_30_days" }));
  }, [dispatch]);

  useEffect(() => {
    if (sellerInsights.status === "idle") {
      dispatch(fetchSellerInsights());
    }
  }, [dispatch, sellerInsights.status]);

  // One-time welcome toast for new sellers
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const shown = localStorage.getItem("onboarding:welcome_toast_shown");
      if (!shown) {
        localStorage.setItem("onboarding:welcome_toast_shown", "true");
        show("Welcome to Procur! 3 quick steps to go live.");
      }
    } catch {
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

  const handleBookFarmVisit = async () => {
    try {
      const { getApiClient } = await import("@/lib/apiClient");
      const api = getApiClient();
      await api.post("/sellers/farm-visit-requests", {});
      show(
        "Your farm visit request has been submitted. An admin will follow up to confirm a date."
      );
      // Refresh home data to reflect latest request
      dispatch(fetchSellerHome({ period: "last_30_days" }));
    } catch {
      show(
        "We couldn't submit your farm visit request. Please try again or contact support."
      );
    }
  };

  // Inventory table replaced by social timeline; keep mapping available if needed elsewhere

  const orders: OrderRow[] = useMemo(() => {
    const apiOrders =
      (sellerHome.data?.recent_orders as SellerHomeOrder[]) ?? [];
    return apiOrders.map((o) => {
      const extra = o as unknown as { buyer_name?: string; currency?: string };
      return {
        id: o.order_number || o.id,
        buyer: extra.buyer_name || "Buyer",
        items: o.items?.reduce((sum, i) => sum + (i.quantity ?? 0), 0) ?? 0,
        total: (o.total_amount ?? 0).toLocaleString("en-US", {
          style: "currency",
          currency: extra.currency || "USD",
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
      };
    });
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
    id: string;
    title: string;
    sub?: string;
    cta?: string;
    action?: () => void;
    urgent?: boolean;
  }> = (sellerInsights.items || []).map((i) => ({
    id: i.id,
    title: i.title,
    sub: i.sub || undefined,
    cta: i.cta || (i.actionId ? "Run" : undefined),
    urgent: i.urgent,
    action: i.actionId
      ? () => dispatch(executeSellerInsight({ id: i.id }))
      : undefined,
  }));

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
        {sellerHome.status === "failed" && (
          <section className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <h2 className="font-semibold">
              Your seller account is not fully verified yet.
            </h2>
            <p className="mt-1 text-xs text-amber-800">
              An admin needs to review and approve your business before you can
              list products, accept orders, or receive payments.
            </p>
            <p className="mt-1 text-xs text-amber-800">
              {authUser?.accountType === "seller"
                ? "If you are a farmer, make sure you've uploaded your Farmer ID and farm details so an admin can verify your account."
                : null}{" "}
              You can update your business details in{" "}
              <Link
                href="/seller/business"
                className="underline font-medium text-amber-900"
              >
                Business Settings
              </Link>
              .
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-amber-900 font-medium">
                Need an on-site visit?
              </span>
              <button
                type="button"
                onClick={() => void handleBookFarmVisit()}
                className="inline-flex items-center rounded-full bg-amber-900 text-amber-50 px-3 py-1 font-medium hover:bg-amber-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2"
              >
                Book farm visit
              </button>
            </div>
          </section>
        )}
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
        {/* Farm visit booking / status */}
        <section
          id="farm-visit"
          className="mt-6 rounded-xl border border-[color:var(--secondary-soft-highlight)] bg-[var(--primary-background)] px-6 sm:px-8 py-5"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-[color:var(--secondary-black)]">
                Farm verification visit
              </h2>
              <p className="mt-1 text-xs text-[color:var(--secondary-muted-edge)] max-w-prose">
                Request an on-site farm visit so our team can verify your fields
                and activate full selling permissions on Procur.
              </p>
              {latestFarmVisit ? (
                <p className="mt-2 text-xs text-[color:var(--secondary-muted-edge)]">
                  Latest request:{" "}
                  <span className="font-medium">
                    {new Date(latestFarmVisit.created_at).toLocaleDateString()}
                  </span>{" "}
                  · Status:{" "}
                  <span className="font-medium capitalize">
                    {latestFarmVisit.status.replace(/_/g, " ")}
                  </span>
                  {latestFarmVisit.preferred_date && (
                    <>
                      {" "}
                      · Preferred date:{" "}
                      <span className="font-medium">
                        {new Date(
                          latestFarmVisit.preferred_date
                        ).toLocaleDateString()}
                      </span>
                    </>
                  )}
                </p>
              ) : (
                <p className="mt-2 text-xs text-[color:var(--secondary-muted-edge)]">
                  No farm visit requested yet.
                </p>
              )}
            </div>
            <div className="flex flex-col items-start gap-2">
              <button
                type="button"
                onClick={() => void handleBookFarmVisit()}
                className="inline-flex items-center justify-center rounded-full bg-[var(--primary-accent2)] text-white px-5 py-2 text-xs font-medium hover:bg-[var(--primary-accent3)] transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2"
              >
                {latestFarmVisit ? "Request another visit" : "Book farm visit"}
              </button>
              <p className="text-[10px] text-[color:var(--secondary-muted-edge)] max-w-xs">
                We&apos;ll contact you by email or phone to confirm the visit
                time and any additional details needed.
              </p>
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
        {/* Analytics Tabs */}
        <AnalyticsTabs
          active={analyticsTab}
          onChange={(tab) => dispatch(setAnalyticsTabAction(tab))}
        />
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
      </main>
    </div>
  );
}
