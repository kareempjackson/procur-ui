"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftIcon,
  StarIcon,
  PhotoIcon,
  XMarkIcon,
  CheckCircleIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  clearCurrentOrder,
  fetchOrderDetail,
  submitOrderReview,
} from "@/store/slices/buyerOrdersSlice";
import ProcurLoader from "@/components/ProcurLoader";
import { useToast } from "@/components/ui/Toast";

export default function OrderReviewPage({
  params,
}: {
  params: { orderId: string };
}) {
  const dispatch = useAppDispatch();
  const { show } = useToast();
  const {
    currentOrder: order,
    orders: orderList,
    orderDetailStatus,
    orderDetailError,
  } = useAppSelector((state) => state.buyerOrders);

  const [overallRating, setOverallRating] = useState(0);
  const [productQualityRating, setProductQualityRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const orderId = params.orderId;

  useEffect(() => {
    dispatch(fetchOrderDetail(orderId));
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, orderId]);

  const baseItems = useMemo(() => {
    const fallbackOrder =
      Array.isArray(orderList) && orderList.length > 0
        ? orderList.find((o: any) => o.id === orderId)
        : null;

    const raw =
      (order as any)?.items ??
      (order as any)?.order_items ??
      (order as any)?.line_items ??
      (fallbackOrder as any)?.items ??
      (fallbackOrder as any)?.order_items ??
      (fallbackOrder as any)?.line_items ??
      [];
    if (Array.isArray(raw)) return raw;
    if (Array.isArray((raw as any)?.data)) return (raw as any).data;
    return [];
  }, [order, orderId, orderList]);

  const sellerName =
    (order as any)?.seller_name ||
    (order as any)?.seller?.name ||
    (order as any)?.seller_name ||
    "";
  const orderNumber =
    (order as any)?.order_number || (order as any)?.orderNumber || orderId;
  const currencyCode =
    (order as any)?.currency || (order as any)?.currency_code || "USD";
  const formatMoney = (value: number) =>
    `${currencyCode} ${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setSubmitting(true);
    try {
      await dispatch(
        submitOrderReview({
          orderId,
          overall_rating: overallRating,
          product_quality_rating:
            productQualityRating > 0 ? productQualityRating : undefined,
          delivery_rating: deliveryRating > 0 ? deliveryRating : undefined,
          service_rating: serviceRating > 0 ? serviceRating : undefined,
          title: reviewTitle?.trim() ? reviewTitle.trim() : undefined,
          comment: reviewComment?.trim() ? reviewComment.trim() : undefined,
          is_public: true,
        })
      ).unwrap();
      // Refresh order detail so other pages / state reflect the new review.
      dispatch(fetchOrderDetail(orderId));
      setSubmitted(true);
      show("Review submitted. Thank you!");
    } catch (err) {
      console.error("Failed to submit review", err);
      show("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const RatingInput = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: number;
    onChange: (rating: number) => void;
  }) => (
    <div>
      <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
        {label}
      </label>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className="transition-transform hover:scale-110"
          >
            {rating <= value ? (
              <StarSolidIcon className="h-8 w-8 text-yellow-400" />
            ) : (
              <StarIcon className="h-8 w-8 text-gray-300" />
            )}
          </button>
        ))}
        {value > 0 && (
          <span className="ml-2 text-sm font-medium text-[var(--secondary-black)]">
            {value} / 5
          </span>
        )}
      </div>
    </div>
  );

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircleIcon className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--secondary-black)] mb-3">
            Thank You!
          </h1>
          <p className="text-lg text-[var(--secondary-muted-edge)] mb-8">
            Your review has been submitted successfully. It helps other buyers
            make informed decisions.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href={`/buyer/orders/${orderId}`}
              className="px-6 py-2.5 bg-[var(--primary-accent2)] text-white rounded-full font-medium hover:bg-[var(--primary-accent3)] transition-all shadow-sm"
            >
              View Order
            </Link>
            <Link
              href="/buyer/orders"
              className="px-6 py-2.5 border border-[var(--secondary-soft-highlight)]/30 text-[var(--secondary-black)] rounded-full font-medium hover:bg-white transition-all"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (orderDetailStatus === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <ProcurLoader size="lg" text="Loading order..." />
      </div>
    );
  }

  if (!order || orderDetailStatus === "failed") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-bold text-[var(--secondary-black)] mb-2">
            {orderDetailError || "Order not found"}
          </h2>
          <p className="text-[var(--secondary-muted-edge)] mb-6">
            We could not load this order to review.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/buyer/orders"
              className="px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full font-semibold hover:bg-[var(--primary-accent3)] transition-all duration-200"
            >
              Back to Orders
            </Link>
            <Link
              href={`/buyer/orders/${orderId}`}
              className="px-6 py-3 border border-[var(--secondary-soft-highlight)] text-[var(--secondary-black)] rounded-full font-semibold hover:bg-white transition-all duration-200"
            >
              View Order
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/buyer/orders/${orderId}`}
            className="flex items-center gap-2 text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="font-medium">Back to Order</span>
          </Link>
          <h1 className="text-3xl font-bold text-[var(--secondary-black)] mb-2">
            Write a Review
          </h1>
          <p className="text-[var(--secondary-muted-edge)]">
            Order {orderNumber} {sellerName && `from ${sellerName}`}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Items Preview */}
          <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6">
            <h3 className="font-semibold text-[var(--secondary-black)] mb-4">
              Items in this order
            </h3>
            <div className="space-y-3">
              {baseItems.length > 0 ? (
                baseItems.map((item: any) => {
                  const imageSrc =
                    item.image_url ||
                    item.product_image ||
                    item.image ||
                    item.thumbnail ||
                    (item as any)?.product_snapshot?.product_images?.find(
                      (img: any) => img?.is_primary
                    )?.image_url ||
                    (item as any)?.product_snapshot?.image_url ||
                    null;
                  const name =
                    item.product_name ||
                    item.name ||
                    (item as any)?.product_snapshot?.product_name ||
                    (item as any)?.product_snapshot?.name ||
                    (item.product_id
                      ? `Product ${String(item.product_id).slice(0, 8)}`
                      : "Product");
                  const qty = Number(item.quantity || 0);
                  const unitPrice = Number(
                    item.unit_price ?? item.price_per_unit ?? item.price ?? 0
                  );
                  const lineTotal = Number(
                    item.total_price ?? item.subtotal ?? item.line_total ?? 0
                  );
                  const computedLineTotal =
                    lineTotal > 0 ? lineTotal : qty * unitPrice;

                  return (
                    <div
                      key={item.id || `${item.product_id || "item"}-${name}`}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--secondary-soft-highlight)]/20 bg-white p-4"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        {typeof imageSrc === "string" && imageSrc ? (
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[var(--primary-background)]/40 border border-[var(--secondary-soft-highlight)]/20 shrink-0">
                            <Image
                              src={imageSrc}
                              alt={name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-[var(--primary-background)]/40 border border-[var(--secondary-soft-highlight)]/20 flex items-center justify-center shrink-0">
                            <ShoppingBagIcon className="h-6 w-6 text-[var(--secondary-muted-edge)]" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="font-semibold text-[var(--secondary-black)] truncate">
                            {name}
                          </p>
                          <p className="text-xs text-[var(--secondary-muted-edge)] mt-0.5">
                            Qty{" "}
                            <span className="text-[var(--secondary-black)] font-medium">
                              {Number.isFinite(qty)
                                ? qty.toLocaleString("en-US")
                                : "—"}
                            </span>
                            {Number.isFinite(unitPrice) && unitPrice > 0 && (
                              <>
                                {" "}
                                • Unit{" "}
                                <span className="text-[var(--secondary-black)] font-medium">
                                  {formatMoney(unitPrice)}
                                </span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>

                      {Number.isFinite(computedLineTotal) &&
                        computedLineTotal > 0 && (
                          <div className="text-right shrink-0">
                            <p className="text-[10px] text-[var(--secondary-muted-edge)]">
                              Line total
                            </p>
                            <p className="text-sm font-semibold text-[var(--secondary-black)]">
                              {formatMoney(computedLineTotal)}
                            </p>
                          </div>
                        )}
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-[var(--secondary-muted-edge)]">
                  No items found for this order.
                </p>
              )}
            </div>
          </div>

          {/* Overall Rating */}
          <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6">
            <h3 className="font-semibold text-[var(--secondary-black)] mb-4">
              Overall Experience
            </h3>
            <RatingInput
              label="How would you rate your overall experience?"
              value={overallRating}
              onChange={setOverallRating}
            />
          </div>

          {/* Detailed Ratings */}
          <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6">
            <h3 className="font-semibold text-[var(--secondary-black)] mb-6">
              Detailed Ratings
            </h3>
            <div className="space-y-6">
              <RatingInput
                label="Product Quality"
                value={productQualityRating}
                onChange={setProductQualityRating}
              />
              <RatingInput
                label="Delivery Experience"
                value={deliveryRating}
                onChange={setDeliveryRating}
              />
              <RatingInput
                label="Seller Service"
                value={serviceRating}
                onChange={setServiceRating}
              />
            </div>
          </div>

          {/* Written Review */}
          <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6">
            <h3 className="font-semibold text-[var(--secondary-black)] mb-4">
              Tell Us More
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                  Review Title
                </label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Summarize your experience in a few words"
                  className="w-full px-4 py-3 border border-[var(--secondary-soft-highlight)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                  Your Review
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details about your experience with the products and seller"
                  rows={5}
                  className="w-full px-4 py-3 border border-[var(--secondary-soft-highlight)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                />
                <p className="text-xs text-[var(--secondary-muted-edge)] mt-2">
                  Minimum 20 characters recommended
                </p>
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6">
            <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
              Add Photos (Optional)
            </h3>
            <p className="text-sm text-[var(--secondary-muted-edge)] mb-4">
              Help others by sharing photos of the products you received
            </p>

            <div className="grid grid-cols-4 gap-3 mb-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={photo}
                      alt={`Review photo ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {photos.length < 8 && (
                <label className="relative w-full aspect-square border-2 border-dashed border-[var(--secondary-soft-highlight)] rounded-lg cursor-pointer hover:border-[var(--primary-accent2)] hover:bg-[var(--primary-accent2)]/5 transition-all flex flex-col items-center justify-center">
                  <PhotoIcon className="h-8 w-8 text-[var(--secondary-muted-edge)] mb-1" />
                  <span className="text-xs text-[var(--secondary-muted-edge)]">
                    Add Photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <p className="text-xs text-[var(--secondary-muted-edge)]">
              You can upload up to 8 photos. Max 5MB per photo.
            </p>
          </div>

          {/* Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 text-sm mb-2">
              Review Guidelines
            </h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Focus on your experience with the products and seller</li>
              <li>Be honest and constructive in your feedback</li>
              <li>Avoid profanity or inappropriate content</li>
              <li>Don&apos;t include personal information</li>
            </ul>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3">
            <Link
              href={`/buyer/orders/${params.orderId}`}
              className="px-6 py-2.5 border border-[var(--secondary-soft-highlight)]/30 text-[var(--secondary-black)] rounded-full font-medium hover:bg-white transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={overallRating === 0 || submitting}
              className="flex-1 px-6 py-2.5 bg-[var(--primary-accent2)] text-white rounded-full font-medium hover:bg-[var(--primary-accent3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
