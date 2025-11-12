"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircleIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  EnvelopeIcon,
  MapPinIcon,
  TruckIcon,
  CalendarIcon,
  PhoneIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchOrderDetail } from "@/store/slices/buyerOrdersSlice";
import ProcurLoader from "@/components/ProcurLoader";

// Demo order data
const demoOrder = {
  id: "ord_abc123",
  orderNumber: "#10245",
  status: "pending",
  createdAt: "2025-10-05T14:30:00Z",
  estimatedDelivery: "2025-10-15",
  total: 245.83,
  currency: "USD",
  sellers: [
    {
      id: "seller_1",
      name: "Caribbean Farms Co.",
      email: "orders@caribbeanfarms.com",
      phone: "(876) 555-0123",
      location: "Kingston, Jamaica",
      verified: true,
      items: [
        {
          id: "item_1",
          name: "Organic Cherry Tomatoes",
          quantity: 10,
          unit: "lb",
          price: 3.5,
          image:
            "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
        },
        {
          id: "item_2",
          name: "Fresh Basil",
          quantity: 5,
          unit: "bunch",
          price: 8.5,
          image:
            "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
        },
      ],
      subtotal: 77.5,
      shipping: 25.0,
      estimatedDelivery: "Oct 15, 2025",
    },
    {
      id: "seller_2",
      name: "Tropical Harvest Ltd",
      email: "sales@tropicalharvest.com",
      phone: "(809) 555-0456",
      location: "Santo Domingo, DR",
      verified: true,
      items: [
        {
          id: "item_3",
          name: "Alphonso Mangoes",
          quantity: 15,
          unit: "lb",
          price: 4.2,
          image:
            "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
        },
      ],
      subtotal: 63.0,
      shipping: 30.0,
      estimatedDelivery: "Oct 12, 2025",
    },
  ],
  shippingAddress: {
    name: "John Smith",
    street: "123 Main Street",
    apartment: "Apt 4B",
    city: "Miami",
    state: "FL",
    zipCode: "33101",
    country: "United States",
    phone: "(305) 555-0123",
  },
  paymentMethod: {
    type: "card",
    brand: "Visa",
    last4: "4242",
  },
  subtotal: 140.5,
  shipping: 55.0,
  tax: 11.24,
};

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }> | { orderId: string };
}) {
  // Next.js 15: params may be a Promise; unwrap with React.use()
  // Backward compatible: if it's already an object, use as-is
  const unwrappedParams =
    typeof (params as any)?.then === "function"
      ? (React as any).use(params as Promise<{ orderId: string }>)
      : (params as { orderId: string });
  const orderId = unwrappedParams.orderId;

  const dispatch = useAppDispatch();
  const { currentOrder, orderDetailStatus } = useAppSelector(
    (s) => s.buyerOrders
  );

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderDetail(orderId));
    }
  }, [orderId, dispatch]);

  const loading = orderDetailStatus === "loading";
  const order = currentOrder as any | null;

  const shipping = order?.shipping_address || {};
  const addrLine1 =
    shipping.address_line1 || shipping.street || shipping.street_address || "";
  const addrLine2 = shipping.address_line2 || shipping.apartment || "";
  const addrCity = shipping.city || "";
  const addrState = shipping.state || "";
  const addrPostal =
    shipping.postal_code || shipping.zip || shipping.zipCode || "";
  const addrCountry = shipping.country || "";
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircleIcon className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--secondary-black)] mb-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-[var(--secondary-muted-edge)]">
            Thank you for your order. We've sent a confirmation email to your
            inbox.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-10 mb-6 flex justify-center">
            <ProcurLoader size="md" text="Loading your order..." />
          </div>
        )}

        {/* Order Number & Actions */}
        <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-[var(--secondary-muted-edge)] mb-1">
                Order Number
              </p>
              <p className="text-2xl font-bold text-[var(--secondary-black)]">
                {order?.order_number || "--"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-5 py-2 border border-[var(--secondary-soft-highlight)]/30 text-[var(--secondary-black)] rounded-full hover:bg-[var(--primary-background)] transition-all">
                <PrinterIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Print</span>
              </button>
              <button className="flex items-center gap-2 px-5 py-2 border border-[var(--secondary-soft-highlight)]/30 text-[var(--secondary-black)] rounded-full hover:bg-[var(--primary-background)] transition-all">
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Download Invoice</span>
              </button>
              <Link
                href={`/buyer/orders/${orderId}`}
                className="flex items-center gap-2 px-5 py-2 bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] transition-all shadow-sm"
              >
                <TruckIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Track Order</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6 mb-6">
          <h2 className="text-lg font-semibold text-[var(--secondary-black)] mb-4">
            What's Next?
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircleIcon className="h-6 w-6 text-white" />
                </div>
                <div className="w-0.5 h-full bg-gray-200 mt-2" />
              </div>
              <div className="flex-1 pb-6">
                <h3 className="font-semibold text-[var(--secondary-black)]">
                  Order Placed
                </h3>
                <p className="text-sm text-[var(--secondary-muted-edge)] mt-1">
                  {new Date(demoOrder.createdAt).toLocaleString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircleIcon className="h-6 w-6 text-gray-500" />
                </div>
                <div className="w-0.5 h-full bg-gray-200 mt-2" />
              </div>
              <div className="flex-1 pb-6">
                <h3 className="font-semibold text-[var(--secondary-black)]">
                  Seller Accepts Order
                </h3>
                <p className="text-sm text-[var(--secondary-muted-edge)] mt-1">
                  Usually within 24 hours
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                  <TruckIcon className="h-6 w-6 text-gray-500" />
                </div>
                <div className="w-0.5 h-full bg-gray-200 mt-2" />
              </div>
              <div className="flex-1 pb-6">
                <h3 className="font-semibold text-[var(--secondary-black)]">
                  Order Shipped
                </h3>
                <p className="text-sm text-[var(--secondary-muted-edge)] mt-1">
                  You'll receive tracking information
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                  <MapPinIcon className="h-6 w-6 text-gray-500" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--secondary-black)]">
                  Delivered
                </h3>
                <p className="text-sm text-[var(--secondary-muted-edge)] mt-1">
                  Estimated by {demoOrder.estimatedDelivery}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-6 mb-6">
          {order && (
            <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 overflow-hidden">
              {/* Seller Header */}
              <div className="bg-[var(--primary-background)] px-6 py-4 border-b border-[var(--secondary-soft-highlight)]/30">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-[var(--secondary-black)]">
                        {order.seller_name || "Seller"}
                      </h3>
                    </div>
                    <div className="space-y-1 text-sm text-[var(--secondary-muted-edge)]">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        Estimated delivery:{" "}
                        {order.estimated_delivery_date || "TBD"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[var(--secondary-muted-edge)] mb-1">
                      Subtotal
                    </p>
                    <p className="text-xl font-bold text-[var(--secondary-black)]">
                      ${Number(order.subtotal || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="p-6 space-y-4">
                {(order.items || []).map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={
                          item.product_snapshot?.image_url ||
                          "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                        }
                        alt={item.product_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[var(--secondary-black)]">
                        {item.product_name}
                      </h4>
                      <p className="text-sm text-[var(--secondary-muted-edge)] mt-1">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[var(--secondary-black)]">
                        $
                        {Number(
                          item.total_price ||
                            item.unit_price * item.quantity ||
                            0
                        ).toFixed(2)}
                      </p>
                      <p className="text-sm text-[var(--secondary-muted-edge)]">
                        ${Number(item.unit_price || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Contact Seller */}
                <div className="pt-4 border-t border-[var(--secondary-soft-highlight)]/30">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-[var(--secondary-muted-edge)]">
                      Order ID: {order.id}
                    </div>
                    <Link
                      href={`/buyer/messages`}
                      className="px-5 py-2 bg-[var(--primary-accent2)] text-white rounded-full text-sm font-medium hover:bg-[var(--primary-accent3)] transition-all shadow-sm"
                    >
                      Contact Seller
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Shipping & Payment Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6">
            <h3 className="font-semibold text-[var(--secondary-black)] mb-4 flex items-center gap-2">
              <MapPinIcon className="h-5 w-5" />
              Shipping Address
            </h3>
            <div className="text-sm text-[var(--secondary-black)]">
              {(shipping.name || shipping.contact_name) && (
                <p className="font-medium">
                  {shipping.name || shipping.contact_name}
                </p>
              )}
              {addrLine1 && (
                <p className="text-[var(--secondary-muted-edge)] mt-1">
                  {addrLine1}
                </p>
              )}
              {addrLine2 && (
                <p className="text-[var(--secondary-muted-edge)]">
                  {addrLine2}
                </p>
              )}
              {(addrCity || addrState || addrPostal) && (
                <p className="text-[var(--secondary-muted-edge)]">
                  {[addrCity, addrState, addrPostal].filter(Boolean).join(" ")}
                </p>
              )}
              {addrCountry && (
                <p className="text-[var(--secondary-muted-edge)]">
                  {addrCountry}
                </p>
              )}
              {(shipping.phone || shipping.contact_phone) && (
                <p className="text-[var(--secondary-muted-edge)] mt-2">
                  {shipping.phone || shipping.contact_phone}
                </p>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6">
            <h3 className="font-semibold text-[var(--secondary-black)] mb-4">
              Payment Method
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-600">
                  {demoOrder.paymentMethod.brand}
                </span>
              </div>
              <div className="text-sm">
                <p className="font-medium text-[var(--secondary-black)] capitalize">
                  {order?.payment_status || "pending"}
                </p>
                <p className="text-[var(--secondary-muted-edge)]">
                  Total ${Number(order?.total_amount || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6 mb-6">
          <h3 className="font-semibold text-[var(--secondary-black)] mb-4">
            Order Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--secondary-muted-edge)]">
                Subtotal
              </span>
              <span className="font-medium text-[var(--secondary-black)]">
                ${Number(order?.subtotal || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--secondary-muted-edge)]">
                Shipping
              </span>
              <span className="font-medium text-[var(--secondary-black)]">
                ${Number(order?.shipping_amount || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--secondary-muted-edge)]">Tax</span>
              <span className="font-medium text-[var(--secondary-black)]">
                ${Number(order?.tax_amount || 0).toFixed(2)}
              </span>
            </div>
            <div className="border-t border-[var(--secondary-soft-highlight)]/30 pt-3">
              <div className="flex justify-between">
                <span className="font-semibold text-[var(--secondary-black)]">
                  Total
                </span>
                <span className="font-bold text-xl text-[var(--secondary-black)]">
                  ${Number(order?.total_amount || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="text-center">
          <Link
            href="/buyer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full font-medium hover:bg-[var(--primary-accent3)] transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    </div>
  );
}
