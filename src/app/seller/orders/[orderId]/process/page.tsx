"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftIcon,
  CheckIcon,
  CubeIcon,
  ClipboardDocumentCheckIcon,
  ScaleIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const demoOrder = {
  id: "ord_abc123",
  orderNumber: "#10245",
  buyer: {
    name: "John Smith",
    organizationName: "Miami Fresh Markets",
  },
  items: [
    {
      id: "item_1",
      productId: "prod_1",
      productName: "Organic Cherry Tomatoes",
      sku: "TOM-CHE-001",
      quantity: 10,
      unit: "lb",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      location: "Warehouse A - Shelf 12",
      packed: false,
    },
    {
      id: "item_2",
      productId: "prod_2",
      productName: "Fresh Basil",
      sku: "BAS-FRE-001",
      quantity: 5,
      unit: "bunch",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      location: "Cooler B - Section 3",
      packed: false,
    },
  ],
  shippingAddress: {
    name: "John Smith",
    street: "123 Main Street",
    apartment: "Apt 4B",
    city: "Miami",
    state: "FL",
    zipCode: "33101",
  },
};

export default function OrderProcessingPage({
  params,
}: {
  params: { orderId: string };
}) {
  const [items, setItems] = useState(demoOrder.items);
  const [packageWeight, setPackageWeight] = useState("");
  const [packageLength, setPackageLength] = useState("");
  const [packageWidth, setPackageWidth] = useState("");
  const [packageHeight, setPackageHeight] = useState("");
  const [specialHandling, setSpecialHandling] = useState("");

  const toggleItemPacked = (itemId: string) => {
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, packed: !item.packed } : item
      )
    );
  };

  const allItemsPacked = items.every((item) => item.packed);
  const packedCount = items.filter((item) => item.packed).length;

  const handleGenerateLabel = () => {
    console.log("Generating shipping label", {
      weight: packageWeight,
      dimensions: {
        length: packageLength,
        width: packageWidth,
        height: packageHeight,
      },
      specialHandling,
    });
  };

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href={`/seller/orders/${params.orderId}`}
              className="flex items-center gap-2 text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] mb-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span className="font-medium">Back to Order</span>
            </Link>
            <h1 className="text-3xl font-bold text-[var(--secondary-black)]">
              Process Order {demoOrder.orderNumber}
            </h1>
            <p className="text-[var(--secondary-muted-edge)] mt-1">
              For {demoOrder.buyer.organizationName}
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
              Packing Progress
            </h2>
            <span className="text-sm font-medium text-[var(--secondary-muted-edge)]">
              {packedCount} of {items.length} items packed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(packedCount / items.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Pick List */}
        <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <ClipboardDocumentCheckIcon className="h-6 w-6 text-[var(--primary-accent2)]" />
            <h2 className="text-xl font-semibold text-[var(--secondary-black)]">
              Pick List
            </h2>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`flex gap-4 p-4 rounded-xl border-2 transition-all ${
                  item.packed
                    ? "border-green-500 bg-green-50"
                    : "border-[var(--secondary-soft-highlight)]/30 hover:border-[var(--primary-accent2)]/50"
                }`}
              >
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                  {item.packed && (
                    <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center">
                      <CheckCircleIcon className="h-10 w-10 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--secondary-black)]">
                    {item.productName}
                  </h3>
                  <p className="text-sm text-[var(--secondary-muted-edge)] mt-1">
                    SKU: {item.sku}
                  </p>
                  <p className="text-sm font-medium text-[var(--secondary-black)] mt-1">
                    Quantity: {item.quantity} {item.unit}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-[var(--secondary-muted-edge)] mt-2">
                    <CubeIcon className="h-3.5 w-3.5" />
                    Location: {item.location}
                  </div>
                </div>

                <div className="flex items-center">
                  <button
                    onClick={() => toggleItemPacked(item.id)}
                    className={`px-5 py-2 rounded-full font-medium transition-all shadow-sm ${
                      item.packed
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-[var(--primary-accent2)] text-white hover:bg-[var(--primary-accent3)]"
                    }`}
                  >
                    {item.packed ? (
                      <div className="flex items-center gap-2">
                        <CheckIcon className="h-4 w-4" />
                        Packed
                      </div>
                    ) : (
                      "Mark Packed"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Package Details */}
        {allItemsPacked && (
          <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <ScaleIcon className="h-6 w-6 text-[var(--primary-accent2)]" />
              <h2 className="text-xl font-semibold text-[var(--secondary-black)]">
                Package Details
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                  Package Weight (lbs)
                </label>
                <input
                  type="number"
                  value={packageWeight}
                  onChange={(e) => setPackageWeight(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-4 py-3 border border-[var(--secondary-soft-highlight)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                  Package Dimensions (inches)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="number"
                    value={packageLength}
                    onChange={(e) => setPackageLength(e.target.value)}
                    placeholder="Length"
                    step="0.1"
                    className="px-4 py-3 border border-[var(--secondary-soft-highlight)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                  />
                  <input
                    type="number"
                    value={packageWidth}
                    onChange={(e) => setPackageWidth(e.target.value)}
                    placeholder="Width"
                    step="0.1"
                    className="px-4 py-3 border border-[var(--secondary-soft-highlight)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                  />
                  <input
                    type="number"
                    value={packageHeight}
                    onChange={(e) => setPackageHeight(e.target.value)}
                    placeholder="Height"
                    step="0.1"
                    className="px-4 py-3 border border-[var(--secondary-soft-highlight)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                  Special Handling Instructions (Optional)
                </label>
                <textarea
                  value={specialHandling}
                  onChange={(e) => setSpecialHandling(e.target.value)}
                  placeholder="e.g., Fragile, Keep refrigerated, etc."
                  rows={3}
                  className="w-full px-4 py-3 border border-[var(--secondary-soft-highlight)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Shipping Address Preview */}
        <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6 mb-6">
          <h2 className="text-lg font-semibold text-[var(--secondary-black)] mb-4">
            Shipping To
          </h2>
          <div className="bg-[var(--primary-background)] rounded-lg p-4">
            <p className="font-semibold text-[var(--secondary-black)]">
              {demoOrder.shippingAddress.name}
            </p>
            <p className="text-sm text-[var(--secondary-muted-edge)] mt-1">
              {demoOrder.shippingAddress.street}
            </p>
            {demoOrder.shippingAddress.apartment && (
              <p className="text-sm text-[var(--secondary-muted-edge)]">
                {demoOrder.shippingAddress.apartment}
              </p>
            )}
            <p className="text-sm text-[var(--secondary-muted-edge)]">
              {demoOrder.shippingAddress.city},{" "}
              {demoOrder.shippingAddress.state}{" "}
              {demoOrder.shippingAddress.zipCode}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link
            href={`/seller/orders/${params.orderId}`}
            className="px-6 py-2.5 border border-[var(--secondary-soft-highlight)]/30 text-[var(--secondary-black)] rounded-full hover:bg-white transition-all font-medium"
          >
            Save Progress
          </Link>
          <button
            onClick={handleGenerateLabel}
            disabled={!allItemsPacked || !packageWeight}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-sm"
          >
            <TruckIcon className="h-5 w-5" />
            Generate Shipping Label
          </button>
        </div>

        {!allItemsPacked && (
          <p className="text-sm text-[var(--secondary-muted-edge)] text-center mt-4">
            Please mark all items as packed before generating shipping label
          </p>
        )}
      </main>
    </div>
  );
}
