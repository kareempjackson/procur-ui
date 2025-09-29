"use client";

import { useState } from "react";
import Image from "next/image";

interface OnboardingData {
  businessName: string;
  region: string;
  businessType: string;
  preferredProducts: string[];
  completedActions: string[];
}

interface MarketplaceTourStepProps {
  data: OnboardingData;
  onNext: () => void;
  onBack: () => void;
}

const categories = [
  { id: "fruits", label: "Fruits", count: 245 },
  { id: "vegetables", label: "Vegetables", count: 189 },
  { id: "organic", label: "Organic", count: 156 },
  { id: "export-ready", label: "Export Ready", count: 98 },
];

const mockFarms = [
  {
    id: 1,
    name: "Sunrise Valley Farm",
    location: "California, USA",
    rating: 4.9,
    specialties: ["Organic Fruits", "Citrus"],
    image: "/images/farms/farm1.jpg",
    distance: "2.5 km",
    verified: true,
  },
  {
    id: 2,
    name: "Green Meadows Co-op",
    location: "Oregon, USA",
    rating: 4.8,
    specialties: ["Leafy Greens", "Herbs"],
    image: "/images/farms/farm2.jpg",
    distance: "5.2 km",
    verified: true,
  },
  {
    id: 3,
    name: "Heritage Harvest",
    location: "Washington, USA",
    rating: 4.7,
    specialties: ["Apples", "Stone Fruits"],
    image: "/images/farms/farm3.jpg",
    distance: "8.1 km",
    verified: false,
  },
];

const mockProducts = [
  {
    id: 1,
    name: "Organic Hass Avocados",
    farm: "Sunrise Valley Farm",
    price: "$2.50/lb",
    harvest: "Available Now",
    image: "/images/products/avocados.jpg",
  },
  {
    id: 2,
    name: "Baby Spinach",
    farm: "Green Meadows Co-op",
    price: "$3.20/lb",
    harvest: "Next Week",
    image: "/images/products/spinach.jpg",
  },
  {
    id: 3,
    name: "Honeycrisp Apples",
    farm: "Heritage Harvest",
    price: "$1.80/lb",
    harvest: "Oct 15-30",
    image: "/images/products/apples.jpg",
  },
];

export default function MarketplaceTourStep({
  data,
  onNext,
  onBack,
}: MarketplaceTourStepProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // In a real implementation, this would trigger API calls
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? "" : categoryId);
  };

  const handleStartBrowsing = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onNext();
  };

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.farm.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory ||
      (selectedCategory === "organic" && product.name.includes("Organic")) ||
      (selectedCategory === "fruits" &&
        ["Avocados", "Apples"].some((fruit) => product.name.includes(fruit))) ||
      (selectedCategory === "vegetables" && product.name.includes("Spinach"));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--secondary-black)] mb-4">
            Explore the Marketplace
          </h1>
          <p className="text-lg text-[var(--secondary-muted-edge)] max-w-2xl mx-auto">
            See available farms, upcoming harvests, and products in stock. Your
            personalized marketplace based on your preferences.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Interactive Search Column */}
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-[var(--secondary-muted-edge)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search farms, products, or regions..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="input w-full pl-12 pr-4 py-4 text-base"
                aria-label="Search marketplace"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("list")}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      viewMode === "list"
                        ? "bg-[var(--primary-accent2)] text-white"
                        : "bg-[var(--secondary-soft-highlight)]/30 text-[var(--secondary-black)] hover:bg-[var(--secondary-soft-highlight)]/50"
                    }
                  `}
                  aria-pressed={viewMode === "list"}
                >
                  List View
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      viewMode === "map"
                        ? "bg-[var(--primary-accent2)] text-white"
                        : "bg-[var(--secondary-soft-highlight)]/30 text-[var(--secondary-black)] hover:bg-[var(--secondary-soft-highlight)]/50"
                    }
                  `}
                  aria-pressed={viewMode === "map"}
                >
                  Map View
                </button>
              </div>
              <div className="text-sm text-[var(--secondary-muted-edge)]">
                {filteredProducts.length} products found
              </div>
            </div>

            {/* Category Filters */}
            <div className="space-y-3">
              <h3 className="font-semibold text-[var(--secondary-black)]">
                Filter by Category
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                      hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[var(--primary-accent2)]/20
                      ${
                        selectedCategory === category.id
                          ? "bg-[var(--primary-accent2)] text-white"
                          : "bg-[var(--secondary-soft-highlight)]/30 text-[var(--secondary-black)] hover:bg-[var(--secondary-soft-highlight)]/50"
                      }
                    `}
                    aria-pressed={selectedCategory === category.id}
                  >
                    {category.label} ({category.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              {viewMode === "list" ? (
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl p-4 border border-[var(--secondary-soft-highlight)]/30 hover:border-[var(--primary-base)] transition-all duration-200 hover:shadow-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary-accent1)]/20 to-[var(--secondary-soft-highlight)]/30 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">🥑</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-[var(--secondary-black)]">
                            {product.name}
                          </h4>
                          <p className="text-sm text-[var(--secondary-muted-edge)]">
                            {product.farm}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm font-medium text-[var(--primary-accent2)]">
                              {product.price}
                            </span>
                            <span className="text-xs text-[var(--secondary-muted-edge)]">
                              {product.harvest}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[var(--secondary-soft-highlight)]/20 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-[var(--primary-accent2)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-[var(--primary-accent2)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                    Interactive Map View
                  </h3>
                  <p className="text-sm text-[var(--secondary-muted-edge)]">
                    See farm locations, delivery zones, and regional
                    availability on an interactive map.
                  </p>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="pt-6">
              <button
                onClick={handleStartBrowsing}
                disabled={isLoading}
                className={`
                  btn btn-primary w-full text-base py-4
                  transition-all duration-300 ease-out
                  hover:shadow-lg hover:shadow-[var(--primary-accent2)]/20
                  disabled:opacity-70 disabled:cursor-not-allowed
                  ${isLoading ? "scale-95" : "hover:scale-105"}
                `}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  "Start Browsing"
                )}
              </button>
            </div>
          </div>

          {/* Editorial Imagery Column */}
          <div className="space-y-6">
            {/* Featured Farms */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[var(--secondary-black)]">
                Featured Farms Near You
              </h3>
              <div className="space-y-3">
                {mockFarms.map((farm) => (
                  <div
                    key={farm.id}
                    className="bg-white rounded-2xl p-4 border border-[var(--secondary-soft-highlight)]/30"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary-accent1)]/20 to-[var(--secondary-soft-highlight)]/30 rounded-xl flex items-center justify-center">
                        <span className="text-lg">🚜</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-[var(--secondary-black)]">
                            {farm.name}
                          </h4>
                          {farm.verified && (
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-2.5 h-2.5 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-[var(--secondary-muted-edge)] mb-2">
                          {farm.location}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <span className="text-yellow-400">★</span>
                              <span className="text-sm font-medium">
                                {farm.rating}
                              </span>
                            </div>
                            <span className="text-xs text-[var(--secondary-muted-edge)]">
                              •
                            </span>
                            <span className="text-xs text-[var(--secondary-muted-edge)]">
                              {farm.distance}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {farm.specialties.map((specialty) => (
                            <span
                              key={specialty}
                              className="text-xs bg-[var(--primary-accent1)]/10 text-[var(--primary-accent3)] px-2 py-1 rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Marketplace Stats */}
            <div className="bg-gradient-to-br from-[var(--primary-accent1)]/10 to-[var(--secondary-soft-highlight)]/20 rounded-2xl p-6">
              <h3 className="font-semibold text-[var(--secondary-black)] mb-4">
                Marketplace Overview
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--primary-accent2)]">
                    500+
                  </div>
                  <div className="text-xs text-[var(--secondary-muted-edge)]">
                    Active Farms
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--primary-accent2)]">
                    2.5k+
                  </div>
                  <div className="text-xs text-[var(--secondary-muted-edge)]">
                    Products
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--primary-accent2)]">
                    50+
                  </div>
                  <div className="text-xs text-[var(--secondary-muted-edge)]">
                    Countries
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--primary-accent2)]">
                    24/7
                  </div>
                  <div className="text-xs text-[var(--secondary-muted-edge)]">
                    Support
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <button
            onClick={onBack}
            className="btn btn-ghost text-base px-6 py-3 order-2 sm:order-1"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
