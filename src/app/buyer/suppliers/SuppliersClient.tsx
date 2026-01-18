"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  StarIcon,
  CheckBadgeIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchSellers } from "@/store/slices/buyerMarketplaceSlice";
import ProcurLoader from "@/components/ProcurLoader";
import { getApiClient } from "@/lib/apiClient";
import { useSelector } from "react-redux";
import { selectAuthToken } from "@/store/slices/authSlice";
import SupplierAvatar from "@/components/buyer/SupplierAvatar";

export default function SuppliersClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sellers, status, error } = useAppSelector(
    (state) => state.buyerMarketplace
  );
  const authToken = useSelector(selectAuthToken);

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedProduce, setSelectedProduce] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<
    string[]
  >([]);
  const [minRating, setMinRating] = useState(0);

  // Fetch sellers on mount
  useEffect(() => {
    dispatch(fetchSellers({ page: 1, limit: 50 }));
  }, [dispatch]);

  // Fetch sellers when search changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(
        fetchSellers({
          page: 1,
          limit: 50,
          search: searchQuery || undefined,
        })
      );
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, dispatch]);

  // Handle message supplier
  const handleMessageSupplier = async (
    e: React.MouseEvent,
    supplierId: string,
    supplierName: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!authToken) {
      router.push("/login");
      return;
    }

    try {
      const client = getApiClient(() => authToken);
      const { data } = await client.post("/conversations/start", {
        contextType: "supplier",
        contextId: supplierId,
        title: `Chat with ${supplierName}`,
      });

      if (data?.id) {
        router.push(`/buyer/messages?conversationId=${data.id}`);
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  // Use sellers from Redux instead of mock data
  const allSuppliers = sellers.map((seller) => ({
    id: seller.id,
    name: seller.name,
    location: seller.location || "Caribbean",
    country: seller.location?.split(",").pop()?.trim() || "Caribbean",
    rating: seller.average_rating ?? 0,
    totalReviews: seller.review_count || 0,
    products: seller.product_count || 0,
    responseTime: "< 2 hours",
    verified: seller.is_verified,
    is_favorited: seller.is_favorited || false,
    certifications: seller.specialties || [],
    specialties: seller.specialties || [],
    // Card cover image (brand header if available), not the profile avatar.
    coverImage:
      seller.header_image_url ||
      "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
    // Supplier profile avatar (uploaded org logo/profile image).
    avatarUrl: seller.logo_url,
    description: seller.description || "Quality produce supplier",
    completedOrders: seller.completed_orders ?? 0,
  }));

  // Keep original mock data as fallback
  const mockSuppliers = [
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
    },
    {
      id: 4,
      name: "Green Valley Cooperative",
      location: "Port of Spain, Trinidad",
      country: "Trinidad and Tobago",
      rating: 4.6,
      totalReviews: 98,
      products: 24,
      responseTime: "< 4 hours",
      verified: false,
      certifications: ["Hydroponic"],
      specialties: ["Leafy Greens", "Herbs"],
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      description:
        "Modern hydroponic facility producing year-round leafy greens.",
      totalOrders: 520,
      onTimeDelivery: 94,
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
    },
    {
      id: 6,
      name: "Palm Paradise",
      location: "Nassau, Bahamas",
      country: "Bahamas",
      rating: 4.7,
      totalReviews: 145,
      products: 15,
      responseTime: "< 3 hours",
      verified: true,
      certifications: ["Export Ready"],
      specialties: ["Fruits"],
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      description:
        "Tropical fruit specialists with focus on coconuts and citrus.",
      totalOrders: 680,
      onTimeDelivery: 95,
    },
    {
      id: 7,
      name: "Green Leaf Farms",
      location: "Kingston, Jamaica",
      country: "Jamaica",
      rating: 4.6,
      totalReviews: 112,
      products: 22,
      responseTime: "< 2 hours",
      verified: true,
      certifications: ["Organic", "Local"],
      specialties: ["Leafy Greens", "Vegetables"],
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      description: "Sustainable farming practices for premium leafy greens.",
      totalOrders: 560,
      onTimeDelivery: 93,
    },
    {
      id: 8,
      name: "Herb Haven",
      location: "Castries, St. Lucia",
      country: "St. Lucia",
      rating: 4.5,
      totalReviews: 89,
      products: 18,
      responseTime: "< 4 hours",
      verified: true,
      certifications: ["Organic"],
      specialties: ["Herbs"],
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      description:
        "Artisan herb growers with traditional and exotic varieties.",
      totalOrders: 430,
      onTimeDelivery: 92,
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
    },
  ];

  // Get unique values for filters
  const countries = Array.from(
    new Set(allSuppliers.map((s) => s.country))
  ).sort();
  const produceTypes = Array.from(
    new Set(allSuppliers.flatMap((s) => s.specialties))
  ).sort();
  const certifications = Array.from(
    new Set(allSuppliers.flatMap((s) => s.certifications))
  ).sort();

  // Filter logic
  const toggleFilter = (
    filterArray: string[],
    setFilter: (arr: string[]) => void,
    value: string
  ) => {
    if (filterArray.includes(value)) {
      setFilter(filterArray.filter((item) => item !== value));
    } else {
      setFilter([...filterArray, value]);
    }
  };

  const clearAllFilters = () => {
    setSelectedCountries([]);
    setSelectedProduce([]);
    setSelectedCertifications([]);
    setMinRating(0);
  };

  // Filter suppliers
  const filteredSuppliers = allSuppliers.filter((supplier) => {
    // Search query
    if (
      searchQuery &&
      !supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !supplier.location.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Country filter
    if (
      selectedCountries.length > 0 &&
      !selectedCountries.includes(supplier.country)
    ) {
      return false;
    }

    // Produce filter
    if (selectedProduce.length > 0) {
      const hasMatchingProduce = selectedProduce.some((produce) =>
        supplier.specialties.includes(produce)
      );
      if (!hasMatchingProduce) return false;
    }

    // Certifications filter
    if (selectedCertifications.length > 0) {
      const hasMatchingCert = selectedCertifications.some((cert) =>
        supplier.certifications.includes(cert)
      );
      if (!hasMatchingCert) return false;
    }

    // Rating filter
    if (supplier.rating < minRating) {
      return false;
    }

    return true;
  });

  const activeFiltersCount =
    selectedCountries.length +
    selectedProduce.length +
    selectedCertifications.length +
    (minRating > 0 ? 1 : 0);

  // Loading state
  if (status === "loading" && sellers.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <ProcurLoader size="lg" text="Loading suppliers..." />
      </div>
    );
  }

  // Error state
  if (status === "failed" && error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <BuildingStorefrontIcon className="h-16 w-16 text-[var(--secondary-muted-edge)] mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-[var(--secondary-black)] mb-2">
            Failed to Load Suppliers
          </h2>
          <p className="text-[var(--secondary-muted-edge)] mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchSellers({ page: 1, limit: 50 }))}
            className="px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full font-semibold hover:bg-[var(--primary-accent3)] transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Header */}
        <section className="bg-white border-b border-[var(--secondary-soft-highlight)]/30">
          <div className="max-w-[1400px] mx-auto px-6 py-5">
            <div className="mb-4">
              <h1 className="text-2xl font-semibold text-[var(--secondary-black)] mb-1">
                Browse Suppliers
              </h1>
              <p className="text-sm text-[var(--secondary-muted-edge)]">
                Discover verified farms and suppliers across the Caribbean
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-3 items-center">
              <div className="flex-1 flex items-center bg-[var(--primary-background)] rounded-full overflow-hidden border border-[var(--secondary-soft-highlight)]/30">
                <input
                  type="text"
                  placeholder="Search suppliers by name or location..."
                  className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent placeholder:text-[var(--secondary-muted-edge)] text-[var(--secondary-black)]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="p-2.5 m-1 bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] transition-all duration-200">
                  <MagnifyingGlassIcon className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="relative flex items-center gap-1.5 px-4 py-2.5 bg-[var(--primary-background)] border border-[var(--secondary-soft-highlight)]/30 rounded-full hover:bg-white transition-colors duration-200"
              >
                <FunnelIcon className="h-4 w-4 text-[var(--secondary-black)]" />
                <span className="font-medium text-sm text-[var(--secondary-black)]">
                  Filters
                </span>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[var(--primary-accent2)] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white border-b border-[var(--secondary-soft-highlight)]/30">
            <div className="max-w-[1400px] mx-auto px-6 py-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[var(--secondary-black)]">
                  Filter Suppliers
                </h3>
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[var(--primary-accent2)] hover:underline font-medium"
                >
                  Clear All
                </button>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                {/* Country Filter */}
                <div>
                  <h4 className="text-xs font-semibold text-[var(--secondary-black)] mb-2">
                    Country
                  </h4>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {countries.map((country) => (
                      <label
                        key={country}
                        className="flex items-center gap-1.5 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCountries.includes(country)}
                          onChange={() =>
                            toggleFilter(
                              selectedCountries,
                              setSelectedCountries,
                              country
                            )
                          }
                          className="w-3.5 h-3.5 rounded border-[var(--secondary-soft-highlight)] text-[var(--primary-accent2)] focus:ring-[var(--primary-accent2)]"
                        />
                        <span className="text-xs text-[var(--secondary-black)]">
                          {country}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Produce Type Filter */}
                <div>
                  <h4 className="text-xs font-semibold text-[var(--secondary-black)] mb-2">
                    Produce Types
                  </h4>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {produceTypes.map((produce) => (
                      <label
                        key={produce}
                        className="flex items-center gap-1.5 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedProduce.includes(produce)}
                          onChange={() =>
                            toggleFilter(
                              selectedProduce,
                              setSelectedProduce,
                              produce
                            )
                          }
                          className="w-3.5 h-3.5 rounded border-[var(--secondary-soft-highlight)] text-[var(--primary-accent2)] focus:ring-[var(--primary-accent2)]"
                        />
                        <span className="text-xs text-[var(--secondary-black)]">
                          {produce}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Certifications Filter */}
                <div>
                  <h4 className="text-xs font-semibold text-[var(--secondary-black)] mb-2">
                    Certifications
                  </h4>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {certifications.map((cert) => (
                      <label
                        key={cert}
                        className="flex items-center gap-1.5 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCertifications.includes(cert)}
                          onChange={() =>
                            toggleFilter(
                              selectedCertifications,
                              setSelectedCertifications,
                              cert
                            )
                          }
                          className="w-3.5 h-3.5 rounded border-[var(--secondary-soft-highlight)] text-[var(--primary-accent2)] focus:ring-[var(--primary-accent2)]"
                        />
                        <span className="text-xs text-[var(--secondary-black)]">
                          {cert}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <h4 className="text-xs font-semibold text-[var(--secondary-black)] mb-2">
                    Minimum Rating
                  </h4>
                  <div className="space-y-1.5">
                    {[4.5, 4.0, 3.5, 0].map((rating) => (
                      <label
                        key={rating}
                        className="flex items-center gap-1.5 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="rating"
                          checked={minRating === rating}
                          onChange={() => setMinRating(rating)}
                          className="w-3.5 h-3.5 text-[var(--primary-accent2)] focus:ring-[var(--primary-accent2)]"
                        />
                        <div className="flex items-center gap-1">
                          <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-[var(--secondary-black)]">
                            {rating > 0 ? `${rating}+` : "Any rating"}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="mt-4 pt-3 border-t border-[var(--secondary-soft-highlight)]/30">
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCountries.map((filter) => (
                      <span
                        key={filter}
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[var(--primary-accent2)]/10 text-[var(--primary-accent2)] rounded-full text-xs"
                      >
                        {filter}
                        <button
                          onClick={() =>
                            toggleFilter(
                              selectedCountries,
                              setSelectedCountries,
                              filter
                            )
                          }
                          className="hover:text-[var(--primary-accent3)]"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {selectedProduce.map((filter) => (
                      <span
                        key={filter}
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[var(--primary-accent2)]/10 text-[var(--primary-accent2)] rounded-full text-xs"
                      >
                        {filter}
                        <button
                          onClick={() =>
                            toggleFilter(
                              selectedProduce,
                              setSelectedProduce,
                              filter
                            )
                          }
                          className="hover:text-[var(--primary-accent3)]"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {selectedCertifications.map((filter) => (
                      <span
                        key={filter}
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[var(--primary-accent2)]/10 text-[var(--primary-accent2)] rounded-full text-xs"
                      >
                        {filter}
                        <button
                          onClick={() =>
                            toggleFilter(
                              selectedCertifications,
                              setSelectedCertifications,
                              filter
                            )
                          }
                          className="hover:text-[var(--primary-accent3)]"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Suppliers List */}
        <section className="max-w-[1400px] mx-auto px-6 py-5">
          <div className="mb-4">
            <p className="text-xs text-[var(--secondary-muted-edge)]">
              Showing {filteredSuppliers.length} of {allSuppliers.length}{" "}
              suppliers
            </p>
          </div>

          {filteredSuppliers.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-[var(--secondary-soft-highlight)]/20">
              <BuildingStorefrontIcon className="h-12 w-12 text-[var(--secondary-muted-edge)] mx-auto mb-3 opacity-50" />
              <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-1.5">
                No suppliers found
              </h3>
              <p className="text-sm text-[var(--secondary-muted-edge)] mb-4">
                Try adjusting your filters to see more results
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-[var(--primary-accent2)] text-white rounded-full text-sm font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSuppliers.map((supplier) => (
                <Link
                  key={supplier.id}
                  href={{
                    pathname: `/buyer/supplier/${supplier.id}`,
                    query: {
                      name: supplier.name,
                      location: supplier.location,
                      verified: supplier.verified ? "1" : "0",
                      products: String(supplier.products || 0),
                    },
                  }}
                  className="block group"
                >
                  <div className="bg-white rounded-xl overflow-hidden border border-[var(--secondary-soft-highlight)]/20 hover:shadow-lg transition-all duration-200">
                    {/* Supplier Image */}
                    <div className="relative h-36">
                      <Image
                        src={supplier.coverImage}
                        alt={supplier.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {supplier.verified && (
                        <div className="absolute top-2 right-2 bg-[var(--primary-accent2)] text-white px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <CheckBadgeIcon className="h-3 w-3" />
                          <span className="text-[10px] font-semibold">
                            Verified
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="flex items-center gap-2">
                          <SupplierAvatar
                            name={supplier.name}
                            imageUrl={supplier.avatarUrl}
                            size="sm"
                            className="ring-2 ring-white/80"
                          />
                          <h3 className="text-white font-bold text-base group-hover:text-[var(--secondary-highlight1)] transition-colors line-clamp-1">
                            {supplier.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-0.5 text-white/90 text-xs">
                          <MapPinIcon className="h-3 w-3" />
                          <span className="truncate">{supplier.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Supplier Details */}
                    <div className="p-3">
                      {/* Rating */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center gap-0.5 bg-[var(--secondary-highlight1)]/20 px-1.5 py-0.5 rounded-full">
                            <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-bold">
                              {supplier.rating}
                            </span>
                          </div>
                          <span className="text-[10px] text-[var(--secondary-muted-edge)]">
                            ({supplier.totalReviews})
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 text-[10px] text-[var(--secondary-muted-edge)]">
                          <ClockIcon className="h-2.5 w-2.5" />
                          {supplier.responseTime}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[var(--secondary-muted-edge)] mb-2 line-clamp-2">
                        {supplier.description}
                      </p>

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {supplier.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className="px-1.5 py-0.5 bg-[var(--primary-background)] rounded-full text-[10px] font-medium text-[var(--secondary-black)]"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>

                      {/* Certifications */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {supplier.certifications.map((cert) => (
                          <span
                            key={cert}
                            className="px-1.5 py-0.5 border border-[var(--primary-accent2)]/30 text-[var(--primary-accent2)] rounded text-[10px] font-medium"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--secondary-soft-highlight)]/20">
                        <div className="text-center">
                          <div className="text-base font-bold text-[var(--secondary-black)]">
                            {supplier.products}
                          </div>
                          <div className="text-[10px] text-[var(--secondary-muted-edge)]">
                            Products
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-base font-bold text-[var(--secondary-black)]">
                            {supplier.completedOrders}
                          </div>
                          <div className="text-[10px] text-[var(--secondary-muted-edge)]">
                            Completed Orders
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-1.5 mt-3">
                        <button className="px-2.5 py-1.5 bg-[var(--primary-accent2)] text-white rounded-full text-xs font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200 flex items-center justify-center gap-1">
                          <BuildingStorefrontIcon className="h-3 w-3" />
                          View
                        </button>
                        <button
                          onClick={(e) =>
                            handleMessageSupplier(e, supplier.id, supplier.name)
                          }
                          className="px-2.5 py-1.5 border border-[var(--secondary-soft-highlight)] text-[var(--secondary-black)] rounded-full text-xs font-medium hover:bg-[var(--primary-background)] transition-all duration-200 flex items-center justify-center gap-1"
                        >
                          <ChatBubbleLeftIcon className="h-3 w-3" />
                          Message
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
