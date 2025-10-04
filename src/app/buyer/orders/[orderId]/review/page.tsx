"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftIcon,
  StarIcon,
  PhotoIcon,
  XMarkIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";

const demoOrder = {
  orderNumber: "#10245",
  seller: {
    name: "Caribbean Farms Co.",
    verified: true,
  },
  items: [
    {
      id: "item_1",
      name: "Organic Cherry Tomatoes",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
    },
    {
      id: "item_2",
      name: "Fresh Basil",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
    },
  ],
  deliveredAt: "2025-10-15T16:30:00Z",
};

export default function OrderReviewPage({
  params,
}: {
  params: { orderId: string };
}) {
  const [overallRating, setOverallRating] = useState(0);
  const [productQualityRating, setProductQualityRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In a real app, would upload to server
      const newPhotos = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Will handle review submission
    console.log({
      overallRating,
      productQualityRating,
      deliveryRating,
      serviceRating,
      reviewTitle,
      reviewComment,
      photos,
    });
    setSubmitted(true);
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
      <div className="min-h-screen bg-[var(--primary-background)] flex items-center justify-center">
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
              href={`/buyer/orders/${params.orderId}`}
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

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/buyer/orders/${params.orderId}`}
            className="flex items-center gap-2 text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="font-medium">Back to Order</span>
          </Link>
          <h1 className="text-3xl font-bold text-[var(--secondary-black)] mb-2">
            Write a Review
          </h1>
          <p className="text-[var(--secondary-muted-edge)]">
            Order {demoOrder.orderNumber} from {demoOrder.seller.name}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Items Preview */}
          <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6">
            <h3 className="font-semibold text-[var(--secondary-black)] mb-4">
              Items in this order
            </h3>
            <div className="flex gap-3">
              {demoOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
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
              <li>Don't include personal information</li>
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
              disabled={overallRating === 0}
              className="flex-1 px-6 py-2.5 bg-[var(--primary-accent2)] text-white rounded-full font-medium hover:bg-[var(--primary-accent3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Submit Review
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
