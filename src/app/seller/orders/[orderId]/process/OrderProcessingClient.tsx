"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  CheckIcon,
  CubeIcon,
  ClipboardDocumentCheckIcon,
  ScaleIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchOrderDetail,
  updateOrderStatus,
} from "@/store/slices/sellerOrdersSlice";
import ProcurLoader from "@/components/ProcurLoader";

type OrderProcessingClientProps = {
  orderId: string;
};

export default function OrderProcessingClient({
  orderId,
}: OrderProcessingClientProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { currentOrder: order, currentOrderStatus: status } = useAppSelector(
    (state) => state.sellerOrders
  );

  const [packedItems, setPackedItems] = useState<Set<string>>(new Set());
  const [packageWeight, setPackageWeight] = useState("");
  const [packageLength, setPackageLength] = useState("");
  const [packageWidth, setPackageWidth] = useState("");
  const [packageHeight, setPackageHeight] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shippingCarrier, setShippingCarrier] = useState("");
  const [specialHandling, setSpecialHandling] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    dispatch(fetchOrderDetail(orderId));
  }, [dispatch, orderId]);

  const toggleItemPacked = (itemId: string) => {
    const newPacked = new Set(packedItems);
    if (newPacked.has(itemId)) {
      newPacked.delete(itemId);
    } else {
      newPacked.add(itemId);
    }
    setPackedItems(newPacked);
  };

  const allItemsPacked = order?.items
    ? order.items.every((item) => packedItems.has(item.id))
    : false;
  const packedCount = packedItems.size;

  const handleMarkAsProcessing = async () => {
    if (!order) return;

    setIsProcessing(true);
    try {
      await dispatch(
        updateOrderStatus({
          orderId: order.id,
          statusData: {
            status: "processing",
            seller_notes: "Order is being prepared for shipment",
          },
        })
      ).unwrap();
      alert("Order marked as processing");
    } catch (error: any) {
      alert(`Failed to update order: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkAsShipped = async () => {
    if (!order || !allItemsPacked || !packageWeight || !trackingNumber) {
      alert("Please complete all required fields");
      return;
    }

    setIsProcessing(true);
    try {
      await dispatch(
        updateOrderStatus({
          orderId: order.id,
          statusData: {
            status: "shipped",
            tracking_number: trackingNumber,
            shipping_method: shippingCarrier,
            seller_notes: `Package shipped - Weight: ${packageWeight}lbs, Dimensions: ${packageLength}x${packageWidth}x${packageHeight} inches. ${
              specialHandling ? `Special handling: ${specialHandling}` : ""
            }`,
          },
        })
      ).unwrap();

      alert("Order marked as shipped! Buyer has been notified.");
      router.push(`/seller/orders/${orderId}`);
    } catch (error: any) {
      alert(`Failed to ship order: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <ProcurLoader />
      </div>
    );
  }

  if (status === "failed" || !order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[var(--secondary-black)] mb-2">
            Failed to Load Order
          </h2>
          <Link
            href="/seller/orders"
            className="text-[var(--primary-accent2)] hover:underline"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href={`/seller/orders/${orderId}`}
              className="flex items-center gap-2 text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] mb-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span className="font-medium">Back to Order</span>
            </Link>
            <h1 className="text-3xl font-bold text-[var(--secondary-black)]">
              Process Order {order.order_number}
            </h1>
            <p className="text-[var(--secondary-muted-edge)] mt-1">
              For {order.buyer_info?.organization_name || "Buyer"}
            </p>
          </div>
        </div>

        {/* Status Notice */}
        {order.status === "pending" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <svg
              className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-900">
                This order is pending acceptance
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Accept the order before processing it
              </p>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/20 p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
              Packing Progress
            </h2>
            <span className="text-sm font-medium text-[var(--secondary-muted-edge)]">
              {packedCount} of {order.items?.length || 0} items packed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{
                width: `${
                  order.items?.length
                    ? (packedCount / order.items.length) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>

        {/* Pick List */}
        <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/20 p-5 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <ClipboardDocumentCheckIcon className="h-6 w-6 text-[var(--primary-accent2)]" />
            <h2 className="text-xl font-semibold text-[var(--secondary-black)]">
              Pick List
            </h2>
          </div>

          <div className="space-y-3">
            {order.items?.map((item) => (
              <div
                key={item.id}
                className={`flex gap-4 p-4 rounded-xl border-2 transition-all ${
                  packedItems.has(item.id)
                    ? "border-green-500 bg-green-50"
                    : "border-[var(--secondary-soft-highlight)]/30 hover:border-[var(--primary-accent2)]/50"
                }`}
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {item.product_image ? (
                    <Image
                      src={item.product_image}
                      alt={item.product_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <CubeIcon className="h-8 w-8" />
                    </div>
                  )}
                  {packedItems.has(item.id) && (
                    <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center">
                      <CheckCircleIcon className="h-10 w-10 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--secondary-black)]">
                    {item.product_name}
                  </h3>
                  {item.product_sku && (
                    <p className="text-sm text-[var(--secondary-muted-edge)] mt-1">
                      SKU: {item.product_sku}
                    </p>
                  )}
                  <p className="text-sm font-medium text-[var(--secondary-black)] mt-1">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <div className="flex items-center">
                  <button
                    onClick={() => toggleItemPacked(item.id)}
                    className={`px-5 py-2 rounded-full font-medium transition-colors text-sm ${
                      packedItems.has(item.id)
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-[var(--primary-accent2)] text-white hover:bg-[var(--primary-accent3)]"
                    }`}
                  >
                    {packedItems.has(item.id) ? (
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
          <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/20 p-5 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <ScaleIcon className="h-6 w-6 text-[var(--primary-accent2)]" />
              <h2 className="text-xl font-semibold text-[var(--secondary-black)]">
                Shipping Details
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                    Shipping Carrier *
                  </label>
                  <select
                    value={shippingCarrier}
                    onChange={(e) => setShippingCarrier(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors"
                  >
                    <option value="">Select carrier</option>
                    <option value="UPS">UPS</option>
                    <option value="FedEx">FedEx</option>
                    <option value="USPS">USPS</option>
                    <option value="DHL">DHL</option>
                    <option value="Local Courier">Local Courier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                    Tracking Number *
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="1Z999AA10123456784"
                    className="w-full px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                  Package Weight (lbs) *
                </label>
                <input
                  type="number"
                  value={packageWeight}
                  onChange={(e) => setPackageWeight(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                  Package Dimensions (inches)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="number"
                    value={packageLength}
                    onChange={(e) => setPackageLength(e.target.value)}
                    placeholder="Length"
                    step="0.1"
                    className="px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors"
                  />
                  <input
                    type="number"
                    value={packageWidth}
                    onChange={(e) => setPackageWidth(e.target.value)}
                    placeholder="Width"
                    step="0.1"
                    className="px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors"
                  />
                  <input
                    type="number"
                    value={packageHeight}
                    onChange={(e) => setPackageHeight(e.target.value)}
                    placeholder="Height"
                    step="0.1"
                    className="px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                  Special Handling Instructions (Optional)
                </label>
                <textarea
                  value={specialHandling}
                  onChange={(e) => setSpecialHandling(e.target.value)}
                  placeholder="e.g., Fragile, Keep refrigerated, etc."
                  rows={3}
                  className="w-full px-4 py-2.5 text-sm rounded-2xl border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Shipping Address Preview */}
        <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/20 p-5 mb-6">
          <h2 className="text-lg font-semibold text-[var(--secondary-black)] mb-4">
            Shipping To
          </h2>
          <div className="bg-[var(--primary-background)] rounded-xl p-4">
            <p className="font-semibold text-[var(--secondary-black)]">
              {order.shipping_address?.name || "N/A"}
            </p>
            <p className="text-sm text-[var(--secondary-muted-edge)] mt-1">
              {order.shipping_address?.street}
            </p>
            {order.shipping_address?.apartment && (
              <p className="text-sm text-[var(--secondary-muted-edge)]">
                {order.shipping_address.apartment}
              </p>
            )}
            <p className="text-sm text-[var(--secondary-muted-edge)]">
              {order.shipping_address?.city}, {order.shipping_address?.state}{" "}
              {order.shipping_address?.postal_code}
            </p>
            {order.shipping_address?.country && (
              <p className="text-sm text-[var(--secondary-muted-edge)]">
                {order.shipping_address.country}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {order.status === "accepted" && !allItemsPacked && (
            <button
              onClick={handleMarkAsProcessing}
              disabled={isProcessing}
              className="flex-1 px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isProcessing ? "Processing..." : "Mark as Processing"}
            </button>
          )}

          {allItemsPacked && (
            <button
              onClick={handleMarkAsShipped}
              disabled={
                !packageWeight ||
                !trackingNumber ||
                !shippingCarrier ||
                isProcessing
              }
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <TruckIcon className="h-5 w-5" />
              {isProcessing ? "Shipping..." : "Mark as Shipped"}
            </button>
          )}
        </div>

        {!allItemsPacked && (
          <p className="text-sm text-[var(--secondary-muted-edge)] text-center mt-4">
            Please mark all items as packed before shipping
          </p>
        )}

        {allItemsPacked &&
          (!packageWeight || !trackingNumber || !shippingCarrier) && (
            <p className="text-sm text-[var(--secondary-muted-edge)] text-center mt-4">
              Please fill in all required shipping details (* fields)
            </p>
          )}
      </main>
    </div>
  );
}
