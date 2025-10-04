"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPinIcon,
  StarIcon,
  CheckBadgeIcon,
  ChatBubbleLeftIcon,
  ArrowLeftIcon,
  ClockIcon,
  TruckIcon,
  ShieldCheckIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

interface SupplierClientProps {
  supplierId: string;
}

export default function SupplierClient({ supplierId }: SupplierClientProps) {
  const [selectedTab, setSelectedTab] = useState<"products" | "about">(
    "products"
  );
  const [savedProducts, setSavedProducts] = useState<Set<number>>(new Set());

  // Mock supplier data - would come from API in real implementation
  const supplier = {
    id: supplierId,
    name: "Caribbean Farms Co.",
    description:
      "We are a family-owned farm specializing in organic produce for over 30 years. Our commitment to sustainable farming practices and quality control ensures that every product meets the highest standards. We serve restaurants, retailers, and distributors across the Caribbean and beyond.",
    location: "Kingston, Jamaica",
    country: "Jamaica",
    rating: 4.8,
    totalReviews: 234,
    verified: true,
    responseTime: "< 2 hours",
    totalProducts: 47,
    totalOrders: 1250,
    onTimeDelivery: 98,
    memberSince: "2019",
    certifications: ["USDA Organic", "Fair Trade", "GAP Certified", "Non-GMO"],
    coverImage:
      "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
  };

  const products = [
    {
      id: 1,
      name: "Organic Cherry Tomatoes",
      price: 3.5,
      unit: "lb",
      minOrder: "100 lbs",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      tags: ["Organic", "Pre-order"],
      discount: "15% off",
    },
    {
      id: 2,
      name: "Fresh Basil",
      price: 2.8,
      unit: "lb",
      minOrder: "50 lbs",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      tags: ["Organic", "Fresh"],
      discount: null,
    },
    {
      id: 3,
      name: "Bell Peppers",
      price: 4.2,
      unit: "lb",
      minOrder: "100 lbs",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      tags: ["Fresh", "Export Ready"],
      discount: null,
    },
    {
      id: 4,
      name: "Organic Lettuce",
      price: 3.0,
      unit: "lb",
      minOrder: "75 lbs",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      tags: ["Organic", "Fresh"],
      discount: "10% off",
    },
  ];

  const toggleSave = (productId: number) => {
    setSavedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Link
            href="/buyer"
            className="inline-flex items-center gap-2 text-sm text-[var(--secondary-muted-edge)] hover:text-[var(--primary-accent2)] transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Marketplace
          </Link>
        </div>

        {/* Cover Image & Profile */}
        <div className="bg-white rounded-2xl overflow-hidden border border-[var(--secondary-soft-highlight)]/20 mb-6">
          {/* Cover Image */}
          <div className="relative h-48 bg-gradient-to-br from-[var(--primary-accent2)] to-[var(--primary-accent3)]">
            <Image
              src={supplier.coverImage}
              alt={supplier.name}
              fill
              className="object-cover opacity-40"
            />
            {/* Logo positioned over cover */}
            <div className="absolute -bottom-10 left-6">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center">
                <span className="text-4xl font-bold text-[var(--primary-accent2)]">
                  {supplier.name.charAt(0)}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="p-6 pt-14">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-[var(--secondary-black)]">
                    {supplier.name}
                  </h1>
                  {supplier.verified && (
                    <CheckBadgeIcon className="h-6 w-6 text-[var(--primary-accent2)]" />
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-[var(--secondary-muted-edge)] mb-2">
                  <MapPinIcon className="h-4 w-4" />
                  {supplier.location}
                </div>
                <div className="flex items-center gap-4 text-sm flex-wrap">
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-[var(--secondary-black)]">
                      {supplier.rating}
                    </span>
                    <span className="text-[var(--secondary-muted-edge)]">
                      ({supplier.totalReviews} reviews)
                    </span>
                  </div>
                  <span className="text-[var(--secondary-muted-edge)]">
                    Member since {supplier.memberSince}
                  </span>
                </div>
              </div>

              <button className="flex items-center gap-2 px-5 py-2.5 bg-[var(--primary-accent2)] text-white rounded-full text-sm font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200 flex-shrink-0">
                <ChatBubbleLeftIcon className="h-4 w-4" />
                Contact Supplier
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-[var(--secondary-soft-highlight)]/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--primary-accent2)]">
                  {supplier.totalProducts}
                </div>
                <p className="text-sm text-[var(--secondary-muted-edge)]">
                  Products
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--primary-accent2)]">
                  {supplier.totalOrders}
                </div>
                <p className="text-sm text-[var(--secondary-muted-edge)]">
                  Total Orders
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--primary-accent2)]">
                  {supplier.onTimeDelivery}%
                </div>
                <p className="text-sm text-[var(--secondary-muted-edge)]">
                  On-Time Delivery
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--primary-accent2)]">
                  {supplier.responseTime}
                </div>
                <p className="text-sm text-[var(--secondary-muted-edge)]">
                  Response Time
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[var(--secondary-soft-highlight)]/30">
          <button
            onClick={() => setSelectedTab("products")}
            className={`px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 ${
              selectedTab === "products"
                ? "text-[var(--primary-accent2)] border-[var(--primary-accent2)]"
                : "text-[var(--secondary-muted-edge)] border-transparent hover:text-[var(--secondary-black)]"
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setSelectedTab("about")}
            className={`px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 ${
              selectedTab === "about"
                ? "text-[var(--primary-accent2)] border-[var(--primary-accent2)]"
                : "text-[var(--secondary-muted-edge)] border-transparent hover:text-[var(--secondary-black)]"
            }`}
          >
            About
          </button>
        </div>

        {/* Products Tab */}
        {selectedTab === "products" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/buyer/product/${product.id}`}
                className="bg-white rounded-lg overflow-hidden border border-[var(--secondary-soft-highlight)]/20 hover:shadow-md transition-all duration-200 group block"
              >
                <div className="relative h-32">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.discount && (
                    <div className="absolute top-1.5 left-1.5 bg-[var(--primary-accent2)] text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                      {product.discount}
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleSave(product.id);
                    }}
                    className="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-sm p-1 rounded-full hover:bg-white transition-all duration-200 z-10"
                  >
                    {savedProducts.has(product.id) ? (
                      <HeartSolidIcon className="h-3.5 w-3.5 text-[var(--primary-accent2)]" />
                    ) : (
                      <HeartIcon className="h-3.5 w-3.5 text-[var(--secondary-black)]" />
                    )}
                  </button>
                </div>

                <div className="p-3">
                  <h3 className="font-semibold text-sm text-[var(--secondary-black)] mb-2 group-hover:text-[var(--primary-accent2)] transition-colors line-clamp-1">
                    {product.name}
                  </h3>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 bg-[var(--primary-background)] rounded text-[10px] font-medium text-[var(--secondary-black)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[var(--secondary-soft-highlight)]/20">
                    <div>
                      <div className="text-lg font-bold text-[var(--secondary-black)] leading-none">
                        ${product.price.toFixed(2)}
                        <span className="text-[10px] font-normal text-[var(--secondary-muted-edge)]">
                          /{product.unit}
                        </span>
                      </div>
                      <div className="text-[10px] text-[var(--secondary-muted-edge)] mt-0.5">
                        Min: {product.minOrder}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("Add to cart:", product.id);
                      }}
                      className="px-3 py-1.5 bg-[var(--primary-accent2)] text-white rounded-full text-xs font-semibold hover:bg-[var(--primary-accent3)] transition-all duration-200"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* About Tab */}
        {selectedTab === "about" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20">
                <h2 className="text-lg font-semibold text-[var(--secondary-black)] mb-3">
                  About Us
                </h2>
                <p className="text-sm text-[var(--secondary-muted-edge)] leading-relaxed">
                  {supplier.description}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheckIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                  <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
                    Certifications
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {supplier.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-sm font-medium text-green-700"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20">
                <h3 className="text-base font-semibold text-[var(--secondary-black)] mb-3">
                  Supplier Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-[var(--primary-accent2)]" />
                    <div>
                      <p className="font-medium text-[var(--secondary-black)]">
                        Location
                      </p>
                      <p className="text-[var(--secondary-muted-edge)]">
                        {supplier.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-[var(--primary-accent2)]" />
                    <div>
                      <p className="font-medium text-[var(--secondary-black)]">
                        Response Time
                      </p>
                      <p className="text-[var(--secondary-muted-edge)]">
                        {supplier.responseTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TruckIcon className="h-4 w-4 text-[var(--primary-accent2)]" />
                    <div>
                      <p className="font-medium text-[var(--secondary-black)]">
                        On-Time Delivery
                      </p>
                      <p className="text-[var(--secondary-muted-edge)]">
                        {supplier.onTimeDelivery}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20">
                <h3 className="text-base font-semibold text-[var(--secondary-black)] mb-4">
                  Location Map
                </h3>
                <div className="aspect-video rounded-xl overflow-hidden border border-[var(--secondary-soft-highlight)]/20">
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d238158.88377814756!2d-76.93854395!3d17.98506155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8edb3fd5f8e54777%3A0x4ebe73bcf1c3e1d2!2sKingston%2C%20Jamaica!5e0!3m2!1sen!2sus!4v1234567890123`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Supplier Location Map"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
