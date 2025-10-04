"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
  CheckBadgeIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
  TrashIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

export default function SavedSuppliersClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [savedSuppliers, setSavedSuppliers] = useState<number[]>([
    1, 2, 3, 5, 9, 10,
  ]);

  // Mock saved suppliers data
  const allSuppliers = [
    {
      id: 1,
      name: "Caribbean Farms Co.",
      location: "Kingston, Jamaica",
      country: "Jamaica",
      rating: 4.8,
      totalReviews: 234,
      products: 47,
      responseTime: "< 2 hours",
      verified: true,
      certifications: ["Organic", "Fair Trade", "GAP"],
      specialties: ["Vegetables", "Fruits", "Herbs"],
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      description:
        "Leading organic produce supplier in Jamaica with over 15 years of experience.",
      totalOrders: 1250,
      onTimeDelivery: 98,
      lastOrder: "2 days ago",
      totalSpent: "$12,450",
    },
    {
      id: 2,
      name: "Tropical Harvest Ltd",
      location: "Santo Domingo, DR",
      country: "Dominican Republic",
      rating: 4.9,
      totalReviews: 189,
      products: 32,
      responseTime: "< 1 hour",
      verified: true,
      certifications: ["Export Ready", "GAP", "HACCP"],
      specialties: ["Fruits", "Root Crops"],
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      description:
        "Premium fruit exporter specializing in mangoes, papayas, and tropical varieties.",
      totalOrders: 980,
      onTimeDelivery: 99,
      lastOrder: "1 week ago",
      totalSpent: "$8,920",
    },
    {
      id: 3,
      name: "Island Fresh Produce",
      location: "Bridgetown, Barbados",
      country: "Barbados",
      rating: 4.7,
      totalReviews: 156,
      products: 28,
      responseTime: "< 3 hours",
      verified: true,
      certifications: ["Organic", "Local"],
      specialties: ["Root Crops", "Vegetables"],
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      description:
        "Family-owned farm providing fresh organic vegetables and root crops.",
      totalOrders: 745,
      onTimeDelivery: 96,
      lastOrder: "3 days ago",
      totalSpent: "$6,340",
    },
    {
      id: 5,
      name: "Spice Island Farms",
      location: "St. George's, Grenada",
      country: "Grenada",
      rating: 4.9,
      totalReviews: 167,
      products: 19,
      responseTime: "< 2 hours",
      verified: true,
      certifications: ["Organic", "Fair Trade"],
      specialties: ["Herbs", "Vegetables"],
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      description:
        "Specialized in spices, herbs, and hot peppers with premium quality.",
      totalOrders: 890,
      onTimeDelivery: 97,
      lastOrder: "5 days ago",
      totalSpent: "$4,780",
    },
    {
      id: 9,
      name: "Caribbean Harvest Co.",
      location: "Santo Domingo, DR",
      country: "Dominican Republic",
      rating: 4.8,
      totalReviews: 178,
      products: 35,
      responseTime: "< 1 hour",
      verified: true,
      certifications: ["Export Ready", "HACCP"],
      specialties: ["Fruits", "Root Crops"],
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      description: "Large-scale supplier with reliable export capabilities.",
      totalOrders: 1120,
      onTimeDelivery: 98,
      lastOrder: "1 day ago",
      totalSpent: "$15,670",
    },
    {
      id: 10,
      name: "Spice Valley",
      location: "Port of Spain, Trinidad",
      country: "Trinidad and Tobago",
      rating: 4.9,
      totalReviews: 203,
      products: 26,
      responseTime: "< 2 hours",
      verified: true,
      certifications: ["Organic", "Fair Trade"],
      specialties: ["Herbs", "Root Crops"],
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      description: "Premium spice and ginger supplier with global reach.",
      totalOrders: 1340,
      onTimeDelivery: 99,
      lastOrder: "4 days ago",
      totalSpent: "$9,230",
    },
  ];

  // Filter to only show saved suppliers
  const mySavedSuppliers = allSuppliers.filter((supplier) =>
    savedSuppliers.includes(supplier.id)
  );

  // Get unique categories
  const categories = Array.from(
    new Set(mySavedSuppliers.flatMap((s) => s.specialties))
  ).sort();

  // Filter logic
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const removeSupplier = (id: number) => {
    setSavedSuppliers(savedSuppliers.filter((supplierId) => supplierId !== id));
  };

  // Filter suppliers
  const filteredSuppliers = mySavedSuppliers.filter((supplier) => {
    // Search query
    if (
      searchQuery &&
      !supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !supplier.location.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Category filter
    if (selectedCategories.length > 0) {
      const hasMatchingCategory = selectedCategories.some((category) =>
        supplier.specialties.includes(category)
      );
      if (!hasMatchingCategory) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main>
        {/* Header */}
        <section className="bg-white border-b border-[var(--secondary-soft-highlight)]/30">
          <div className="max-w-[1400px] mx-auto px-6 py-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <HeartSolidIcon className="h-8 w-8 text-[var(--primary-accent2)]" />
                <h1 className="text-3xl font-semibold text-[var(--secondary-black)]">
                  Saved Suppliers
                </h1>
              </div>
              <p className="text-[var(--secondary-muted-edge)]">
                Quick access to your favorite suppliers and farms
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 items-center">
              <div className="flex-1 flex items-center bg-[var(--primary-background)] rounded-full overflow-hidden border border-[var(--secondary-soft-highlight)]/30">
                <input
                  type="text"
                  placeholder="Search your saved suppliers..."
                  className="flex-1 px-6 py-4 text-base outline-none bg-transparent placeholder:text-[var(--secondary-muted-edge)] text-[var(--secondary-black)]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="p-4 m-1 bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] transition-all duration-200">
                  <MagnifyingGlassIcon className="h-6 w-6" />
                </button>
              </div>
              {categories.length > 0 && (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="relative flex items-center gap-2 px-6 py-4 bg-[var(--primary-background)] border border-[var(--secondary-soft-highlight)]/30 rounded-full hover:bg-white transition-colors duration-200"
                >
                  <FunnelIcon className="h-5 w-5 text-[var(--secondary-black)]" />
                  <span className="font-medium text-[var(--secondary-black)]">
                    Categories
                  </span>
                  {selectedCategories.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[var(--primary-accent2)] text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold">
                      {selectedCategories.length}
                    </span>
                  )}
                </button>
              )}
            </div>

            {/* Category Filter */}
            {showFilters && categories.length > 0 && (
              <div className="mt-4 p-4 bg-[var(--primary-background)] rounded-xl">
                <h4 className="text-sm font-semibold text-[var(--secondary-black)] mb-3">
                  Filter by Category
                </h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedCategories.includes(category)
                          ? "bg-[var(--primary-accent2)] text-white"
                          : "bg-white text-[var(--secondary-black)] border border-[var(--secondary-soft-highlight)]/30 hover:bg-white/80"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Stats Bar */}
        {mySavedSuppliers.length > 0 && (
          <section className="bg-gradient-to-r from-[var(--primary-accent2)] to-[var(--primary-accent3)] py-4">
            <div className="max-w-[1400px] mx-auto px-6">
              <div className="grid grid-cols-3 gap-4 text-center text-white">
                <div>
                  <div className="text-2xl font-bold">
                    {mySavedSuppliers.length}
                  </div>
                  <div className="text-sm opacity-90">Saved Suppliers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {mySavedSuppliers.reduce((sum, s) => sum + s.products, 0)}
                  </div>
                  <div className="text-sm opacity-90">Total Products</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {(
                      mySavedSuppliers.reduce((sum, s) => sum + s.rating, 0) /
                      mySavedSuppliers.length
                    ).toFixed(1)}
                  </div>
                  <div className="text-sm opacity-90">Avg. Rating</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Suppliers List */}
        <section className="max-w-[1400px] mx-auto px-6 py-8">
          {mySavedSuppliers.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[var(--secondary-soft-highlight)]/20">
              <HeartIcon className="h-16 w-16 text-[var(--secondary-muted-edge)] mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-[var(--secondary-black)] mb-2">
                No saved suppliers yet
              </h3>
              <p className="text-[var(--secondary-muted-edge)] mb-6">
                Start saving your favorite suppliers for quick access
              </p>
              <Link
                href="/buyer/suppliers"
                className="inline-block px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200"
              >
                Browse All Suppliers
              </Link>
            </div>
          ) : filteredSuppliers.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[var(--secondary-soft-highlight)]/20">
              <BuildingStorefrontIcon className="h-16 w-16 text-[var(--secondary-muted-edge)] mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-[var(--secondary-black)] mb-2">
                No suppliers found
              </h3>
              <p className="text-[var(--secondary-muted-edge)] mb-6">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategories([]);
                }}
                className="px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-sm text-[var(--secondary-muted-edge)]">
                  Showing {filteredSuppliers.length} of{" "}
                  {mySavedSuppliers.length} saved suppliers
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSuppliers.map((supplier) => (
                  <div
                    key={supplier.id}
                    className="bg-white rounded-xl overflow-hidden border border-[var(--secondary-soft-highlight)]/20 hover:shadow-lg transition-all duration-200 group"
                  >
                    {/* Supplier Image */}
                    <div className="relative h-48">
                      <Image
                        src={supplier.image}
                        alt={supplier.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Remove Heart Button */}
                      <button
                        onClick={() => removeSupplier(supplier.id)}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-red-50 transition-all duration-200 group/heart"
                        title="Remove from saved"
                      >
                        <HeartSolidIcon className="h-5 w-5 text-[var(--primary-accent2)] group-hover/heart:text-red-600" />
                      </button>

                      {supplier.verified && (
                        <div className="absolute top-3 left-3 bg-[var(--primary-accent2)] text-white px-2 py-1 rounded-full flex items-center gap-1">
                          <CheckBadgeIcon className="h-4 w-4" />
                          <span className="text-xs font-semibold">
                            Verified
                          </span>
                        </div>
                      )}

                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white font-bold text-xl mb-1 group-hover:text-[var(--secondary-highlight1)] transition-colors">
                          {supplier.name}
                        </h3>
                        <div className="flex items-center gap-1 text-white/90 text-sm">
                          <MapPinIcon className="h-4 w-4" />
                          {supplier.location}
                        </div>
                      </div>
                    </div>

                    {/* Supplier Details */}
                    <div className="p-5">
                      {/* Rating & Response Time */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-[var(--secondary-highlight1)]/20 px-2 py-1 rounded-full">
                            <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-bold">
                              {supplier.rating}
                            </span>
                          </div>
                          <span className="text-xs text-[var(--secondary-muted-edge)]">
                            ({supplier.totalReviews})
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-[var(--secondary-muted-edge)]">
                          <ClockIcon className="h-3 w-3" />
                          {supplier.responseTime}
                        </div>
                      </div>

                      {/* Your Stats with this Supplier */}
                      <div className="mb-4 p-3 bg-[var(--primary-background)] rounded-lg">
                        <div className="text-xs font-semibold text-[var(--secondary-black)] mb-2">
                          Your History
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <div className="text-[var(--secondary-muted-edge)]">
                              Last Order
                            </div>
                            <div className="font-semibold text-[var(--secondary-black)]">
                              {supplier.lastOrder}
                            </div>
                          </div>
                          <div>
                            <div className="text-[var(--secondary-muted-edge)]">
                              Total Spent
                            </div>
                            <div className="font-semibold text-[var(--secondary-black)]">
                              {supplier.totalSpent}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-[var(--secondary-muted-edge)] mb-3 line-clamp-2">
                        {supplier.description}
                      </p>

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {supplier.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className="px-2 py-1 bg-[var(--primary-background)] rounded-full text-xs font-medium text-[var(--secondary-black)]"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={`/seller/${supplier.name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className="px-3 py-2 bg-[var(--primary-accent2)] text-white rounded-full text-sm font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200 flex items-center justify-center gap-1"
                        >
                          <BuildingStorefrontIcon className="h-4 w-4" />
                          View Shop
                        </Link>
                        <button className="px-3 py-2 border border-[var(--secondary-soft-highlight)] text-[var(--secondary-black)] rounded-full text-sm font-medium hover:bg-[var(--primary-background)] transition-all duration-200 flex items-center justify-center gap-1">
                          <ChatBubbleLeftIcon className="h-4 w-4" />
                          Message
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
