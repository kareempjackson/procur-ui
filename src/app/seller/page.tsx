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
  const profile = useAppSelector((s) => s.profile.profile);
  const orderTab = useAppSelector(selectOrderTab);
  const analyticsTab = useAppSelector(selectAnalyticsTab);
  // const isBuyer = useAppSelector((s) => s.auth.user?.accountType === "buyer");

  const dispatch = useAppDispatch();
  const sellerHome = useAppSelector((s) => s.sellerHome);
  const sellerInsights = useAppSelector((s) => s.sellerInsights);
  const latestFarmVisit = sellerHome.data?.latest_farm_visit_request;
  const isFarmVerified = Boolean(profile?.organization?.farmVerified);

  const [showPaymentLinkModal, setShowPaymentLinkModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // Buyer details
  const [buyerNameForLink, setBuyerNameForLink] = useState("");
  const [buyerCompanyForLink, setBuyerCompanyForLink] = useState("");
  const [buyerEmailForLink, setBuyerEmailForLink] = useState("");
  const [buyerPhoneForLink, setBuyerPhoneForLink] = useState("");
  const [buyerBusinessTypeForLink, setBuyerBusinessTypeForLink] =
    useState("general");

  // Shipping address (simple one-block address for now)
  const [buyerAddressLine1, setBuyerAddressLine1] = useState("");
  const [buyerAddressCity, setBuyerAddressCity] = useState("");

  // Product / line item
  type DraftLineItem = {
    id: string;
    name: string;
    unit: string;
    quantity: string;
    unitPrice: string;
  };
  const [lineItemsForLink, setLineItemsForLink] = useState<DraftLineItem[]>([
    {
      id: "item-1",
      name: "",
      unit: "kg",
      quantity: "",
      unitPrice: "",
    },
  ]);

  const sellerCountry = (profile?.organization as any)?.country || "Grenada";

  const [allowedMethods, setAllowedMethods] = useState<{
    bank_transfer: boolean;
    cash_on_delivery: boolean;
    cheque_on_delivery: boolean;
  }>({
    bank_transfer: true,
    cash_on_delivery: false,
    cheque_on_delivery: false,
  });
  const [expiresAt, setExpiresAt] = useState("");
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [createdLinkUrl, setCreatedLinkUrl] = useState<string | null>(null);
  const [showLinkResultModal, setShowLinkResultModal] = useState(false);
  const [linkResultUrl, setLinkResultUrl] = useState<string | null>(null);

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

  const requireSellerVerified = (action?: () => void) => {
    if (!isFarmVerified) {
      setShowVerificationModal(true);
      return;
    }
    action?.();
  };

  const handleCreatePaymentLink = async () => {
    if (!buyerNameForLink.trim()) {
      show("Enter the buyer name for this order.");
      return;
    }
    if (!buyerAddressLine1.trim()) {
      show("Enter at least the first line of the buyer address.");
      return;
    }
    const validItems = lineItemsForLink
      .map((li) => ({
        ...li,
        quantityNum: Number(li.quantity),
        unitPriceNum: Number(li.unitPrice),
      }))
      .filter(
        (li) =>
          li.name.trim() && li.unit && li.quantityNum > 0 && li.unitPriceNum > 0
      );

    if (validItems.length === 0) {
      show(
        "Add at least one product with name, unit, quantity and cost per unit."
      );
      return;
    }

    const methods = Object.entries(allowedMethods)
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (methods.length === 0) {
      show("Select at least one payment method.");
      return;
    }
    try {
      setIsCreatingLink(true);
      setCreatedLinkUrl(null);
      const { getApiClient } = await import("@/lib/apiClient");
      const api = getApiClient();
      const { data } = await api.post("/payment-links/offline-order", {
        buyer_name: buyerNameForLink.trim(),
        buyer_company: buyerCompanyForLink.trim() || undefined,
        buyer_email: buyerEmailForLink.trim() || undefined,
        buyer_phone: buyerPhoneForLink.trim() || undefined,
        buyer_business_type: buyerBusinessTypeForLink,
        shipping_address: {
          line1: buyerAddressLine1.trim(),
          city: buyerAddressCity.trim() || undefined,
          country: sellerCountry,
        },
        line_items: validItems.map((li) => ({
          product_name: li.name.trim(),
          unit: li.unit,
          quantity: li.quantityNum,
          unit_price: li.unitPriceNum,
        })),
        allowed_payment_methods: methods,
        expires_at: expiresAt || undefined,
      });
      const url = data?.payment_link?.public_url || null;
      setCreatedLinkUrl(url);
      if (url) {
        setShowPaymentLinkModal(false);
        setLinkResultUrl(url);
        setShowLinkResultModal(true);
      }
      show("Offline order and payment link created successfully.");
    } catch (e: any) {
      console.error("Failed to create payment link", e);
      const msg =
        e?.response?.data?.message ||
        "We couldn't create the payment link. Check the details and try again.";
      show(msg);
    } finally {
      setIsCreatingLink(false);
    }
  };

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
          <AccountSetupLoader farmVerified={isFarmVerified} />
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
              {isFarmVerified ? (
                <Link
                  href="/seller/harvest-update"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--primary-accent2)] text-white px-5 py-2.5 text-sm font-medium hover:bg-[var(--primary-accent3)] transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2"
                >
                  Post Harvest Update
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowVerificationModal(true)}
                  className="inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-500 px-5 py-2.5 text-sm font-medium cursor-not-allowed"
                >
                  Post Harvest Update
                </button>
              )}
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
        {!isFarmVerified && (
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
                  Request an on-site farm visit so our team can verify your
                  fields and activate full selling permissions on Procur.
                </p>
                {latestFarmVisit ? (
                  <p className="mt-2 text-xs text-[color:var(--secondary-muted-edge)]">
                    Latest request:{" "}
                    <span className="font-medium">
                      {new Date(
                        latestFarmVisit.created_at
                      ).toLocaleDateString()}
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
                  {latestFarmVisit
                    ? "Request another visit"
                    : "Book farm visit"}
                </button>
                <p className="text-[10px] text-[color:var(--secondary-muted-edge)] max-w-xs">
                  We&apos;ll contact you by email or phone to confirm the visit
                  time and any additional details needed.
                </p>
              </div>
            </div>
          </section>
        )}
        {/* KPI Cards Row + quick actions */}
        <section className="mt-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-sm font-semibold text-[color:var(--secondary-black)]">
              Sales overview
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  requireSellerVerified(() =>
                    router.push("/seller/add/product")
                  )
                }
                className="inline-flex items-center justify-center rounded-full border border-[color:var(--secondary-soft-highlight)] bg-white px-4 py-2 text-xs font-medium text-[color:var(--secondary-black)] hover:bg-gray-50 transition-colors"
              >
                Add product
              </button>
              <button
                type="button"
                onClick={() =>
                  requireSellerVerified(() => router.push("/seller/orders"))
                }
                className="inline-flex items-center justify-center rounded-full border border-[color:var(--secondary-soft-highlight)] bg-white px-4 py-2 text-xs font-medium text-[color:var(--secondary-black)] hover:bg-gray-50 transition-colors"
              >
                View orders
              </button>
              <button
                type="button"
                onClick={() =>
                  requireSellerVerified(() => setShowPaymentLinkModal(true))
                }
                className={classNames(
                  "inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2 transition-colors",
                  isFarmVerified
                    ? "bg-[var(--primary-accent2)] text-white hover:bg-[var(--primary-accent3)]"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                )}
              >
                Create payment link
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
          </div>
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
                  type="button"
                  onClick={() =>
                    requireSellerVerified(() => router.push("/seller/orders"))
                  }
                  className={classNames(
                    "inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2 transition-colors",
                    isFarmVerified
                      ? "bg-[var(--primary-accent2)] text-white hover:bg-[var(--primary-accent3)]"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  )}
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

      {/* Create Payment Link Modal */}
      {showPaymentLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-6xl max-h-[80vh] rounded-2xl bg-white shadow-2xl border border-[color:var(--secondary-soft-highlight)] flex flex-col">
            <div className="px-6 py-4 border-b border-[color:var(--secondary-soft-highlight)]/60 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-[color:var(--secondary-black)]">
                  Create payment link
                </h2>
                <p className="mt-1 text-xs text-[color:var(--secondary-muted-edge)]">
                  Enter buyer details and products to generate a payment link
                  for this offline order.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPaymentLinkModal(false);
                  setCreatedLinkUrl(null);
                  setIsCreatingLink(false);
                }}
                className="text-[color:var(--secondary-muted-edge)] hover:text-[color:var(--secondary-black)] text-xs"
              >
                Close
              </button>
            </div>

            <div className="px-6 py-4 space-y-5 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left column: Buyer details */}
                <div className="rounded-xl border border-[color:var(--secondary-soft-highlight)] bg-white shadow-sm px-6 py-5 space-y-4">
                  <h3 className="text-xs font-semibold text-[color:var(--secondary-black)] tracking-wide uppercase">
                    Buyer details
                  </h3>
                  {/* Buyer info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[color:var(--secondary-black)] mb-1.5">
                        Buyer name
                      </label>
                      <input
                        type="text"
                        value={buyerNameForLink}
                        onChange={(e) => setBuyerNameForLink(e.target.value)}
                        placeholder="e.g. Spice Bay Hotel"
                        className="w-full rounded-lg border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[color:var(--secondary-black)] mb-1.5">
                        Company (optional)
                      </label>
                      <input
                        type="text"
                        value={buyerCompanyForLink}
                        onChange={(e) => setBuyerCompanyForLink(e.target.value)}
                        placeholder="Legal company name"
                        className="w-full rounded-lg border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[color:var(--secondary-black)] mb-1.5">
                        Buyer business type
                      </label>
                      <select
                        value={buyerBusinessTypeForLink}
                        onChange={(e) =>
                          setBuyerBusinessTypeForLink(e.target.value)
                        }
                        className="w-full rounded-lg border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:border-transparent"
                      >
                        <option value="general">General</option>
                        <option value="hotels">Hotels</option>
                        <option value="restaurants">Restaurants</option>
                        <option value="supermarkets">Supermarkets</option>
                        <option value="exporters">Exporters</option>
                      </select>
                      <p className="mt-1 text-[10px] text-[color:var(--secondary-muted-edge)]">
                        Helps Procur categorize this buyer (used for reporting
                        and programs).
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[color:var(--secondary-black)] mb-1.5">
                        Buyer email (optional)
                      </label>
                      <input
                        type="email"
                        value={buyerEmailForLink}
                        onChange={(e) => setBuyerEmailForLink(e.target.value)}
                        placeholder="for receipts/updates"
                        className="w-full rounded-lg border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[color:var(--secondary-black)] mb-1.5">
                        Buyer phone / WhatsApp (optional)
                      </label>
                      <input
                        type="tel"
                        value={buyerPhoneForLink}
                        onChange={(e) => setBuyerPhoneForLink(e.target.value)}
                        placeholder="+1 473 ..."
                        className="w-full rounded-lg border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[color:var(--secondary-soft-highlight)]/60">
                    <div>
                      <label className="block text-xs font-medium text-[color:var(--secondary-black)] mb-1.5">
                        Buyer address line 1
                      </label>
                      <input
                        type="text"
                        value={buyerAddressLine1}
                        onChange={(e) => setBuyerAddressLine1(e.target.value)}
                        placeholder="Street / building"
                        className="w-full rounded-lg border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[color:var(--secondary-black)] mb-1.5">
                        City (optional)
                      </label>
                      <input
                        type="text"
                        value={buyerAddressCity}
                        onChange={(e) => setBuyerAddressCity(e.target.value)}
                        placeholder="City / parish"
                        className="w-full rounded-lg border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[color:var(--secondary-black)] mb-1.5">
                        Country
                      </label>
                      <div className="w-full rounded-lg border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm bg-gray-50 text-[color:var(--secondary-black)]">
                        {sellerCountry}
                      </div>
                      <p className="mt-1 text-[10px] text-[color:var(--secondary-muted-edge)]">
                        Uses your business country by default.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right column: Order & payment */}
                <div className="rounded-xl border border-[color:var(--secondary-soft-highlight)] bg-white shadow-sm px-6 py-5 space-y-4">
                  <h3 className="text-xs font-semibold text-[color:var(--secondary-black)] tracking-wide uppercase">
                    Order &amp; payment
                  </h3>
                  {/* Products / line items */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-medium text-[color:var(--secondary-black)]">
                        Products
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setLineItemsForLink((prev) => [
                            ...prev,
                            {
                              id: `item-${prev.length + 1}`,
                              name: "",
                              unit: "kg",
                              quantity: "",
                              unitPrice: "",
                            },
                          ])
                        }
                        className="inline-flex items-center rounded-full border border-[color:var(--secondary-soft-highlight)] bg-white px-3 py-1.5 text-[11px] font-medium text-[color:var(--secondary-black)] hover:bg-gray-50 transition-colors"
                      >
                        + Add product
                      </button>
                    </div>
                    <div className="space-y-2">
                      {lineItemsForLink.map((item) => (
                        <div
                          key={item.id}
                          className="border border-[color:var(--secondary-soft-highlight)] rounded-xl p-3 bg-white space-y-3"
                        >
                          {/* First line: product name */}
                          <div>
                            <label className="block text-xs font-medium text-[color:var(--secondary-black)] mb-1.5">
                              Product name
                            </label>
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) =>
                                setLineItemsForLink((prev) =>
                                  prev.map((li) =>
                                    li.id === item.id
                                      ? { ...li, name: e.target.value }
                                      : li
                                  )
                                )
                              }
                              placeholder="e.g. Tomatoes (Grade A)"
                              className="w-full rounded-lg border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:border-transparent"
                            />
                          </div>

                          {/* Second line: qty, unit, cost/unit */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-[color:var(--secondary-black)] mb-1.5">
                                Qty
                              </label>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.quantity}
                                onChange={(e) =>
                                  setLineItemsForLink((prev) =>
                                    prev.map((li) =>
                                      li.id === item.id
                                        ? { ...li, quantity: e.target.value }
                                        : li
                                    )
                                  )
                                }
                                placeholder="Qty"
                                className="w-full rounded-lg border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-[color:var(--secondary-black)] mb-1.5">
                                Unit
                              </label>
                              <select
                                value={item.unit}
                                onChange={(e) =>
                                  setLineItemsForLink((prev) =>
                                    prev.map((li) =>
                                      li.id === item.id
                                        ? { ...li, unit: e.target.value }
                                        : li
                                    )
                                  )
                                }
                                className="w-full sm:w-24 md:w-28 max-w-[7rem] rounded-lg border border-[color:var(--secondary-soft-highlight)] px-2 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:border-transparent"
                              >
                                <option value="kg">kg</option>
                                <option value="lb">lb</option>
                                <option value="piece">piece</option>
                                <option value="dozen">dozen</option>
                                <option value="box">box</option>
                                <option value="bag">bag</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-[color:var(--secondary-black)] mb-1.5">
                                Cost / unit
                              </label>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.unitPrice}
                                onChange={(e) =>
                                  setLineItemsForLink((prev) =>
                                    prev.map((li) =>
                                      li.id === item.id
                                        ? { ...li, unitPrice: e.target.value }
                                        : li
                                    )
                                  )
                                }
                                placeholder="$/unit"
                                className="w-full rounded-lg border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:border-transparent"
                              />
                            </div>
                          </div>

                          {lineItemsForLink.length > 1 && (
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() =>
                                  setLineItemsForLink((prev) =>
                                    prev.filter((li) => li.id !== item.id)
                                  )
                                }
                                className="mt-1 text-[10px] text-[color:var(--secondary-muted-edge)] hover:text-[color:var(--dark-error)]"
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[color:var(--secondary-soft-highlight)]/60">
                    {/* Payment link options */}
                    <div>
                      <p className="block text-xs font-medium text-[color:var(--secondary-black)] mb-1.5">
                        Allowed payment methods
                      </p>
                      <div className="flex flex-col gap-1.5 text-xs">
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="h-3.5 w-3.5 rounded border-[color:var(--secondary-soft-highlight)]"
                            checked={allowedMethods.bank_transfer}
                            onChange={(e) =>
                              setAllowedMethods((prev) => ({
                                ...prev,
                                bank_transfer: e.target.checked,
                              }))
                            }
                          />
                          <span className="text-[color:var(--secondary-black)]">
                            Bank transfer
                          </span>
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="h-3.5 w-3.5 rounded border-[color:var(--secondary-soft-highlight)]"
                            checked={allowedMethods.cash_on_delivery}
                            onChange={(e) =>
                              setAllowedMethods((prev) => ({
                                ...prev,
                                cash_on_delivery: e.target.checked,
                              }))
                            }
                          />
                          <span className="text-[color:var(--secondary-black)]">
                            Cash on delivery
                          </span>
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="h-3.5 w-3.5 rounded border-[color:var(--secondary-soft-highlight)]"
                            checked={allowedMethods.cheque_on_delivery}
                            onChange={(e) =>
                              setAllowedMethods((prev) => ({
                                ...prev,
                                cheque_on_delivery: e.target.checked,
                              }))
                            }
                          />
                          <span className="text-[color:var(--secondary-black)]">
                            Cheque on delivery
                          </span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[color:var(--secondary-black)] mb-1.5">
                        Expiry date (optional)
                      </label>
                      <input
                        type="date"
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                        className="w-full rounded-lg border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[color:var(--secondary-soft-highlight)]/60 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowPaymentLinkModal(false);
                  setCreatedLinkUrl(null);
                  setIsCreatingLink(false);
                }}
                className="inline-flex items-center justify-center rounded-full border border-[color:var(--secondary-soft-highlight)] bg-white px-4 py-2 text-xs font-medium text-[color:var(--secondary-black)] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreatePaymentLink}
                disabled={isCreatingLink}
                className="inline-flex items-center justify-center rounded-full bg-[var(--primary-accent2)] text-white px-4 py-2 text-xs font-medium hover:bg-[var(--primary-accent3)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isCreatingLink ? "Creating..." : "Create link"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Link Result Modal */}
      {showLinkResultModal && linkResultUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-[color:var(--secondary-soft-highlight)]">
            <div className="px-6 py-4 border-b border-[color:var(--secondary-soft-highlight)]/60 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-[color:var(--secondary-black)]">
                  Payment link created
                </h2>
                <p className="mt-1 text-xs text-[color:var(--secondary-muted-edge)]">
                  Copy this link and send it to your buyer by WhatsApp, email,
                  or SMS.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowLinkResultModal(false);
                  setLinkResultUrl(null);
                }}
                className="text-[color:var(--secondary-muted-edge)] hover:text-[color:var(--secondary-black)] text-xs"
              >
                Close
              </button>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div className="text-[11px] text-[color:var(--secondary-muted-edge)]">
                Payment link URL
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    readOnly
                    value={linkResultUrl}
                    className="w-full rounded-lg border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-xs bg-[var(--primary-background)] text-[color:var(--secondary-black)]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(linkResultUrl)}
                  className="inline-flex items-center rounded-full bg-[var(--primary-accent2)] text-white px-3 py-1.5 text-[11px] font-medium hover:bg-[var(--primary-accent3)] transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="px-6 py-3 border-t border-[color:var(--secondary-soft-highlight)]/60 flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowLinkResultModal(false);
                  setLinkResultUrl(null);
                }}
                className="inline-flex items-center rounded-full border border-[color:var(--secondary-soft-highlight)] bg-white px-4 py-2 text-xs font-medium text-[color:var(--secondary-black)] hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Required Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-[color:var(--secondary-soft-highlight)]">
            <div className="px-6 py-4 border-b border-[color:var(--secondary-soft-highlight)]/60 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-[color:var(--secondary-black)]">
                  Verification required
                </h2>
                <p className="mt-1 text-xs text-[color:var(--secondary-muted-edge)]">
                  Your seller account must be verified by an admin before you
                  can use features like adding products, creating payment links,
                  or managing orders from this dashboard.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowVerificationModal(false)}
                className="text-[color:var(--secondary-muted-edge)] hover:text-[color:var(--secondary-black)] text-xs"
              >
                Close
              </button>
            </div>
            <div className="px-6 py-4 space-y-3">
              <p className="text-[11px] text-[color:var(--secondary-muted-edge)]">
                To get verified, complete your{" "}
                <span className="font-medium">Business Settings</span> and, if
                you are a farmer, request a farm visit so an admin can review
                and activate your account.
              </p>
            </div>
            <div className="px-6 py-3 border-t border-[color:var(--secondary-soft-highlight)]/60 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowVerificationModal(false)}
                className="inline-flex items-center rounded-full border border-[color:var(--secondary-soft-highlight)] bg-white px-4 py-2 text-xs font-medium text-[color:var(--secondary-black)] hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowVerificationModal(false);
                  router.push("/seller/business");
                }}
                className="inline-flex items-center rounded-full bg-[var(--primary-accent2)] text-white px-4 py-2 text-xs font-medium hover:bg-[var(--primary-accent3)] transition-colors"
              >
                Go to Business Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
