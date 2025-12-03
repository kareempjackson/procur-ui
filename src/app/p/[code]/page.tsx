"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  TruckIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { getApiClient } from "@/lib/apiClient";
import ProcurLoader from "@/components/ProcurLoader";

type OfflineMethod =
  | "bank_transfer"
  | "cash_on_delivery"
  | "cheque_on_delivery";

type PublicPaymentLinkPayload = {
  code: string;
  status: string;
  currency: string;
  amounts: {
    subtotal: number;
    delivery_fee: number;
    platform_fee: number;
    tax: number;
    discount: number;
    total: number;
  };
  fee_breakdown: {
    subtotal_amount: number;
    delivery_fee_amount: number;
    platform_fee_amount: number;
    tax_amount: number;
    discount_amount: number;
  };
  allowed_payment_methods: OfflineMethod[];
  expires_at?: string | null;
  order: {
    id: string;
    order_number: string;
    status: string;
    payment_status: string;
    items: any[];
    notes?: string | null;
    shipping_address?: any;
    estimated_delivery_date?: string | null;
  } | null;
  seller?: {
    id: string;
  } | null;
  buyer: {
    organization?: { id: string } | null;
    contact: {
      name: string | null;
      company: string | null;
      email: string | null;
      phone: string | null;
      tax_id: string | null;
    };
  };
  receipt: {
    url: string | null;
  };
};

export default function PublicPaymentLinkPage({
  params,
}: {
  params: Promise<{ code: string }> | { code: string };
}) {
  const router = useRouter();
  const unwrappedParams =
    typeof (params as any)?.then === "function"
      ? (React as any).use(params as Promise<{ code: string }>)
      : (params as { code: string });
  const code = unwrappedParams.code;

  const [data, setData] = useState<PublicPaymentLinkPayload | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "loaded" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<OfflineMethod | null>(
    null
  );
  const [paymentReference, setPaymentReference] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setStatus("loading");
      setError(null);
      try {
        const client = getApiClient(() => null);
        const { data } = await client.get<PublicPaymentLinkPayload>(
          `/public/payment-links/${code}`
        );
        setData(data);
        setStatus("loaded");
      } catch (e: any) {
        console.error("Failed to load payment link:", e);
        setError(
          e?.response?.data?.message ||
            "This payment link is invalid or no longer available."
        );
        setStatus("error");
      }
    };

    if (code) {
      fetchData();
    }
  }, [code]);

  const handleSubmitPayment = async () => {
    if (!data || !selectedMethod) return;

    setIsSubmitting(true);
    setError(null);
    setSubmitSuccess(false);
    try {
      const client = getApiClient(() => null);
      await client.post(`/public/payment-links/${code}/pay`, {
        payment_method: selectedMethod,
        payment_reference: paymentReference || undefined,
        proof_url: proofUrl || undefined,
      });

      setSubmitSuccess(true);

      // Optimistically update status locally
      setData((prev) =>
        prev
          ? {
              ...prev,
              status: "awaiting_payment_confirmation",
            }
          : prev
      );
    } catch (e: any) {
      console.error("Failed to submit offline payment intent:", e);
      setError(
        e?.response?.data?.message ||
          "We could not record your payment choice. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusLabel = (st: string) => {
    switch (st) {
      case "draft":
        return "Draft";
      case "active":
        return "Awaiting your confirmation";
      case "awaiting_payment_confirmation":
        return "Awaiting payment confirmation";
      case "paid":
        return "Paid";
      case "expired":
        return "Expired";
      case "cancelled":
        return "Cancelled";
      default:
        return st;
    }
  };

  const formatOrderStatus = (st?: string | null) => {
    if (!st) return "Not yet available";
    return st
      .split("_")
      .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ""))
      .join(" ");
  };

  const ORDER_STATUS_STEPS = [
    {
      value: "pending",
      label: "Pending",
      description: "Order created, waiting for seller review.",
    },
    {
      value: "accepted",
      label: "Accepted",
      description: "Seller has accepted your order.",
    },
    {
      value: "processing",
      label: "Processing",
      description: "Seller is preparing your order.",
    },
    {
      value: "shipped",
      label: "Shipped",
      description: "Order handed over for delivery.",
    },
    {
      value: "delivered",
      label: "Delivered",
      description: "Order delivered to your location.",
    },
    {
      value: "rejected",
      label: "Rejected",
      description: "Order was rejected by the seller.",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      description: "Order was cancelled.",
    },
    {
      value: "disputed",
      label: "In dispute",
      description: "This order is currently under review.",
    },
  ] as const;

  const isFinal =
    data?.status === "paid" ||
    data?.status === "expired" ||
    data?.status === "cancelled";

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <ProcurLoader size="lg" text="Loading payment link..." />
      </div>
    );
  }

  if (status === "error" || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Payment link not found
          </h1>
          <p className="text-gray-600 mb-6">
            {error ||
              "This payment link is invalid, expired, or has been cancelled. Please contact the seller for a new link."}
          </p>
        </div>
      </div>
    );
  }

  const { order, amounts, fee_breakdown, allowed_payment_methods } = data;
  const deliveryAmount = amounts.delivery_fee;
  const platformFeeAmount = amounts.platform_fee;
  const subtotalAmount = amounts.subtotal;
  const computedPlatformFromSubtotal = subtotalAmount * 0.05;
  const totalFromParts = subtotalAmount + deliveryAmount + platformFeeAmount;
  const shipping = order?.shipping_address || {};

  const currentOrderStatus = order?.status || null;
  const currentStatusIndex = ORDER_STATUS_STEPS.findIndex(
    (step) => step.value === currentOrderStatus
  );

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--primary-accent2)] text-white font-semibold text-xs">
                P
              </div>
              <span className="text-xs uppercase tracking-wide text-gray-500">
                Powered by Procur
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Order payment link
            </h1>
            {order?.order_number && (
              <p className="text-sm text-gray-500 mt-1">
                Order <span className="font-mono">{order.order_number}</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800">
              <ClockIcon className="h-4 w-4" />
              {statusLabel(data.status)}
            </span>
            {isFinal && data.receipt?.url && (
              <a
                href={data.receipt.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary-accent2)] text-white text-xs font-medium hover:bg-[var(--primary-accent3)] transition-colors"
              >
                <CheckCircleIcon className="h-4 w-4" />
                View receipt
              </a>
            )}
          </div>
        </header>

        {/* Alert if expired / cancelled / paid */}
        {isFinal && (
          <div className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 flex items-start gap-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-gray-500 mt-0.5" />
            <div className="text-sm text-gray-700">
              <p className="font-medium mb-1">
                This payment link is marked as {statusLabel(data.status)}.
              </p>
              {data.status === "paid" && (
                <p>
                  Your payment has been recorded. The seller or Procur team will
                  handle delivery and keep you updated.
                </p>
              )}
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {/* Left column: order + fees */}
          <div className="md:col-span-2 space-y-6">
            {/* Buyer details (read-only) */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <UserCircleIcon className="h-5 w-5 text-gray-500" />
                <h2 className="text-sm font-semibold text-gray-900">
                  Buyer details
                </h2>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                These details were provided when the payment link was created
                and cannot be changed here.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="block text-xs font-medium text-gray-700">
                    Name
                  </span>
                  <span className="block text-gray-900">
                    {data.buyer.contact.name || "—"}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-gray-700">
                    Company
                  </span>
                  <span className="block text-gray-900">
                    {data.buyer.contact.company || "—"}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-gray-700">
                    Email
                  </span>
                  <span className="block text-gray-900">
                    {data.buyer.contact.email || "—"}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-gray-700">
                    Phone / WhatsApp
                  </span>
                  <span className="block text-gray-900">
                    {data.buyer.contact.phone || "—"}
                  </span>
                </div>
              </div>
            </section>

            {/* Order summary */}
            {order && (
              <section className="rounded-2xl border border-gray-200 bg-white">
                <div className="border-b border-gray-100 px-5 py-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">
                      Order summary
                    </h2>
                    {order.estimated_delivery_date && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                        <TruckIcon className="h-3.5 w-3.5" />
                        Estimated delivery: {order.estimated_delivery_date}
                      </p>
                    )}
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {(order.items || []).map((item: any) => (
                    <div
                      key={item.id}
                      className="px-5 py-4 flex items-center justify-between gap-3"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {item.product_name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Qty {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {item.quantity}
                          {item.unit ? ` ${item.unit}` : ""}
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {item.total_price?.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="px-5 py-4 bg-gray-50">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Items subtotal</span>
                        <span className="font-medium text-gray-900">
                          {amounts.subtotal.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          {data.currency}
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Delivery fee</span>
                          <span className="font-medium text-gray-900">
                            {deliveryAmount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            {data.currency}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500">
                          Flat delivery fee of{" "}
                          {deliveryAmount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          {data.currency}
                        </p>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Procur fee</span>
                          <span className="font-medium text-gray-900">
                            {platformFeeAmount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            {data.currency}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500">
                          5% of items subtotal:{" "}
                          {computedPlatformFromSubtotal.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}{" "}
                          {data.currency}
                        </p>
                      </div>
                      {fee_breakdown.discount_amount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Discount</span>
                          <span className="font-medium text-green-600">
                            -
                            {fee_breakdown.discount_amount.toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}{" "}
                            {data.currency}
                          </span>
                        </div>
                      )}
                      <div className="border-t border-gray-200 pt-3 mt-2 flex flex-col gap-1 text-base font-semibold">
                        <div className="flex justify-between">
                          <span className="text-gray-900">Total due</span>
                          <span className="text-[var(--primary-accent2)]">
                            {amounts.total.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            {data.currency}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Delivery & notes */}
            {shipping && Object.keys(shipping).length > 0 && (
              <section className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <MapPinIcon className="h-5 w-5 text-gray-500" />
                  <h2 className="text-sm font-semibold text-gray-900">
                    Delivery details
                  </h2>
                </div>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    {[
                      // Line 1 / street
                      shipping.address_line1 ||
                        shipping.line1 ||
                        shipping.street,
                      // Line 2 / apartment / building
                      shipping.address_line2 || shipping.line2,
                      // City, state, postal code
                      [shipping.city, shipping.state, shipping.postal_code]
                        .filter(Boolean)
                        .join(", "),
                      // Country
                      shipping.country,
                    ]
                      .filter(
                        (part) =>
                          typeof part === "string" && part.trim().length > 0
                      )
                      .join(", ")}
                  </p>
                  {(shipping.contact_name || shipping.phone) && (
                    <p className="text-xs text-gray-500">
                      {shipping.contact_name && (
                        <span>
                          Contact:{" "}
                          <span className="font-medium">
                            {shipping.contact_name}
                          </span>
                        </span>
                      )}
                      {shipping.contact_name && shipping.phone && (
                        <span> · </span>
                      )}
                      {shipping.phone && <span>Phone: {shipping.phone}</span>}
                    </p>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Right column: tracking + payment methods */}
          <aside className="space-y-4">
            {/* Tracking / status */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <ClockIcon className="h-5 w-5 text-gray-500" />
                <h2 className="text-sm font-semibold text-gray-900">
                  Track this order
                </h2>
              </div>
              <div className="space-y-2 text-xs text-gray-700">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Order number
                  </span>
                  <span className="font-mono text-gray-900">
                    {order?.order_number || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">
                    Payment status
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium bg-gray-100 text-gray-800">
                    <ClockIcon className="h-3.5 w-3.5" />
                    {statusLabel(data.status)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Order status
                  </span>
                  <span className="text-gray-900">
                    {order
                      ? formatOrderStatus(order.status)
                      : "Waiting for payment"}
                  </span>
                </div>
                {order?.estimated_delivery_date && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Estimated delivery
                    </span>
                    <span className="text-gray-900">
                      {order.estimated_delivery_date}
                    </span>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-[11px] font-medium text-gray-600 mb-2">
                    Order journey
                  </p>
                  <ol className="space-y-1.5">
                    {ORDER_STATUS_STEPS.map((step, idx) => {
                      const isReached =
                        currentStatusIndex >= 0 && idx <= currentStatusIndex;
                      const isCurrent = idx === currentStatusIndex;
                      const isFuture =
                        currentStatusIndex >= 0 && idx > currentStatusIndex;
                      const isUnknownStatus = currentStatusIndex === -1;

                      const dotClasses = isReached
                        ? "bg-[var(--primary-accent2)]"
                        : "bg-gray-300";

                      const textClasses = isCurrent
                        ? "text-gray-900 font-semibold"
                        : isReached
                          ? "text-gray-800"
                          : "text-gray-400";

                      // If status from admin is something custom / unknown,
                      // show all steps as muted so we don't mislead the buyer.
                      const effectiveTextClasses = isUnknownStatus
                        ? "text-gray-400"
                        : textClasses;

                      return (
                        <li
                          key={step.value}
                          className="flex items-start gap-2 text-[11px]"
                        >
                          <span
                            className={`mt-1 inline-flex h-2.5 w-2.5 rounded-full ${isUnknownStatus ? "bg-gray-300" : dotClasses}`}
                          />
                          <div>
                            <p className={effectiveTextClasses}>
                              {step.label}
                              {isCurrent && !isUnknownStatus && (
                                <span className="ml-1 text-[10px] text-[var(--primary-accent2)]">
                                  (current)
                                </span>
                              )}
                              {isFuture && !isUnknownStatus && (
                                <span className="ml-1 text-[10px] text-gray-400">
                                  (up next)
                                </span>
                              )}
                            </p>
                            <p className="text-[10px] text-gray-500">
                              {step.description}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-500" />
                <h2 className="text-sm font-semibold text-gray-900">
                  Choose payment method
                </h2>
              </div>
              {allowed_payment_methods.length === 0 && (
                <p className="text-xs text-gray-500">
                  No payment methods are available for this link. Please contact
                  the seller.
                </p>
              )}

              <div className="space-y-2 mt-2">
                {allowed_payment_methods.includes("bank_transfer") && (
                  <button
                    type="button"
                    onClick={() => setSelectedMethod("bank_transfer")}
                    className={`w-full flex items-center justify-between rounded-xl border px-3 py-2 text-left text-xs ${
                      selectedMethod === "bank_transfer"
                        ? "border-[var(--primary-accent2)] bg-[var(--primary-background)]"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BanknotesIcon className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Bank transfer
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Send funds directly from your bank and upload a
                          reference.
                        </p>
                      </div>
                    </div>
                  </button>
                )}

                {allowed_payment_methods.includes("cash_on_delivery") && (
                  <button
                    type="button"
                    onClick={() => setSelectedMethod("cash_on_delivery")}
                    className={`w-full flex items-center justify-between rounded-xl border px-3 py-2 text-left text-xs ${
                      selectedMethod === "cash_on_delivery"
                        ? "border-[var(--primary-accent2)] bg-[var(--primary-background)]"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CurrencyDollarIcon className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Cash on delivery
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Pay the driver in cash when your produce arrives.
                        </p>
                      </div>
                    </div>
                  </button>
                )}

                {allowed_payment_methods.includes("cheque_on_delivery") && (
                  <button
                    type="button"
                    onClick={() => setSelectedMethod("cheque_on_delivery")}
                    className={`w-full flex items-center justify-between rounded-xl border px-3 py-2 text-left text-xs ${
                      selectedMethod === "cheque_on_delivery"
                        ? "border-[var(--primary-accent2)] bg-[var(--primary-background)]"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BanknotesIcon className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Cheque on delivery
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Provide a cheque to the driver at delivery.
                        </p>
                      </div>
                    </div>
                  </button>
                )}
              </div>

              {selectedMethod === "bank_transfer" && (
                <div className="mt-4 space-y-2 text-xs text-gray-700">
                  <p className="font-medium text-gray-900">
                    Bank transfer instructions
                  </p>
                  <p>
                    Send the total amount to the bank account shared by Procur
                    or your supplier. Use the order number as the payment
                    reference where possible.
                  </p>
                  <label className="block mt-3">
                    <span className="block text-[11px] font-medium text-gray-700 mb-1">
                      Bank reference (optional)
                    </span>
                    <input
                      type="text"
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                      placeholder="e.g. transfer reference or note"
                    />
                  </label>
                  <label className="block">
                    <span className="block text-[11px] font-medium text-gray-700 mb-1">
                      Proof URL (optional)
                    </span>
                    <input
                      type="url"
                      value={proofUrl}
                      onChange={(e) => setProofUrl(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                      placeholder="Link to a screenshot or PDF receipt"
                    />
                  </label>
                </div>
              )}

              {selectedMethod && (
                <button
                  type="button"
                  onClick={handleSubmitPayment}
                  disabled={isSubmitting || isFinal}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[var(--primary-accent2)] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[var(--primary-accent3)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : "Confirm payment choice"}
                </button>
              )}

              {submitSuccess && !isFinal && (
                <p className="mt-3 text-[11px] text-green-700 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                  Your payment choice has been recorded. Procur or the seller
                  will review and confirm your payment.
                </p>
              )}

              {error && (
                <p className="mt-3 text-[11px] text-red-700 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                  {error}
                </p>
              )}
            </section>

            {/* Optional login/create-account nudge */}
            <section className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4 text-xs text-gray-700 space-y-2">
              <p className="font-medium text-gray-900">
                Want to track all your Procur orders in one place?
              </p>
              <p>
                You can{" "}
                <Link
                  href="/login"
                  className="text-[var(--primary-accent2)] hover:underline"
                >
                  log in
                </Link>{" "}
                or{" "}
                <Link
                  href="/signup"
                  className="text-[var(--primary-accent2)] hover:underline"
                >
                  create an account
                </Link>{" "}
                later using the same email to see your history. This payment
                link will still work even if you don&apos;t have an account yet.
              </p>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
