"use client";

import React from "react";
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
  params: { orderId: string };
}) {
  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
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

        {/* Order Number & Actions */}
        <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-[var(--secondary-muted-edge)] mb-1">
                Order Number
              </p>
              <p className="text-2xl font-bold text-[var(--secondary-black)]">
                {demoOrder.orderNumber}
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
                href={`/buyer/orders/${params.orderId}`}
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
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
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
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
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
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
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
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
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

        {/* Order Details by Seller */}
        <div className="space-y-6 mb-6">
          {demoOrder.sellers.map((seller) => (
            <div
              key={seller.id}
              className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 overflow-hidden"
            >
              {/* Seller Header */}
              <div className="bg-[var(--primary-background)] px-6 py-4 border-b border-[var(--secondary-soft-highlight)]/30">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-[var(--secondary-black)]">
                        {seller.name}
                      </h3>
                      {seller.verified && (
                        <CheckBadgeIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-[var(--secondary-muted-edge)]">
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="h-4 w-4" />
                        {seller.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        Estimated delivery: {seller.estimatedDelivery}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[var(--secondary-muted-edge)] mb-1">
                      Subtotal
                    </p>
                    <p className="text-xl font-bold text-[var(--secondary-black)]">
                      ${seller.subtotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="p-6 space-y-4">
                {seller.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[var(--secondary-black)]">
                        {item.name}
                      </h4>
                      <p className="text-sm text-[var(--secondary-muted-edge)] mt-1">
                        Quantity: {item.quantity} {item.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[var(--secondary-black)]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-[var(--secondary-muted-edge)]">
                        ${item.price.toFixed(2)}/{item.unit}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Contact Seller */}
                <div className="pt-4 border-t border-[var(--secondary-soft-highlight)]/30">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-[var(--secondary-muted-edge)]">
                      <div className="flex items-center gap-2 mb-1">
                        <EnvelopeIcon className="h-4 w-4" />
                        {seller.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="h-4 w-4" />
                        {seller.phone}
                      </div>
                    </div>
                    <Link
                      href={`/buyer/messages?seller=${seller.id}`}
                      className="px-5 py-2 bg-[var(--primary-accent2)] text-white rounded-full text-sm font-medium hover:bg-[var(--primary-accent3)] transition-all shadow-sm"
                    >
                      Contact Seller
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
              <p className="font-medium">{demoOrder.shippingAddress.name}</p>
              <p className="text-[var(--secondary-muted-edge)] mt-1">
                {demoOrder.shippingAddress.street}
              </p>
              {demoOrder.shippingAddress.apartment && (
                <p className="text-[var(--secondary-muted-edge)]">
                  {demoOrder.shippingAddress.apartment}
                </p>
              )}
              <p className="text-[var(--secondary-muted-edge)]">
                {demoOrder.shippingAddress.city},{" "}
                {demoOrder.shippingAddress.state}{" "}
                {demoOrder.shippingAddress.zipCode}
              </p>
              <p className="text-[var(--secondary-muted-edge)]">
                {demoOrder.shippingAddress.country}
              </p>
              <p className="text-[var(--secondary-muted-edge)] mt-2">
                {demoOrder.shippingAddress.phone}
              </p>
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
                <p className="font-medium text-[var(--secondary-black)]">
                  {demoOrder.paymentMethod.brand} ••••{" "}
                  {demoOrder.paymentMethod.last4}
                </p>
                <p className="text-[var(--secondary-muted-edge)]">
                  Charged ${demoOrder.total.toFixed(2)}
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
                ${demoOrder.subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--secondary-muted-edge)]">
                Shipping
              </span>
              <span className="font-medium text-[var(--secondary-black)]">
                ${demoOrder.shipping.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--secondary-muted-edge)]">Tax</span>
              <span className="font-medium text-[var(--secondary-black)]">
                ${demoOrder.tax.toFixed(2)}
              </span>
            </div>
            <div className="border-t border-[var(--secondary-soft-highlight)]/30 pt-3">
              <div className="flex justify-between">
                <span className="font-semibold text-[var(--secondary-black)]">
                  Total
                </span>
                <span className="font-bold text-xl text-[var(--secondary-black)]">
                  ${demoOrder.total.toFixed(2)}
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
