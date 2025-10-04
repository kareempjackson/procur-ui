"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  HeartIcon,
  MapPinIcon,
  StarIcon,
  ClockIcon,
  CheckBadgeIcon,
  ChatBubbleLeftIcon,
  UserGroupIcon,
  CalendarIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

export default function BuyerClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [savedItems, setSavedItems] = useState<Set<number>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [showHarvestFeed, setShowHarvestFeed] = useState(true);
  const [hasOverflow, setHasOverflow] = useState(false);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // Filter states
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(
    []
  );
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<
    string[]
  >([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);

  // Categories for horizontal scroll (eBay-style)
  const categories = [
    { name: "All Categories", icon: "🌾" },
    { name: "Vegetables", icon: "🥬" },
    { name: "Fruits", icon: "🍎" },
    { name: "Herbs", icon: "🌿" },
    { name: "Grains", icon: "🌾" },
    { name: "Legumes", icon: "🫘" },
    { name: "Root Crops", icon: "🥔" },
    { name: "Leafy Greens", icon: "🥗" },
    { name: "Organic", icon: "✨" },
    { name: "Export Ready", icon: "🌍" },
  ];

  // Social Media Timeline - Harvest Updates
  const harvestUpdates = [
    {
      id: 1,
      farmName: "Caribbean Farms Co.",
      farmAvatar:
        "https://ui-avatars.com/api/?name=Caribbean+Farms&background=CB5927&color=fff",
      location: "Kingston, Jamaica",
      timeAgo: "2 hours ago",
      content:
        "🌱 Exciting news! Our organic tomato harvest is starting next week. Pre-orders now available for 500kg batches. First-grade quality guaranteed!",
      images: [
        "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      ],
      likes: 42,
      comments: 8,
      harvestDate: "Oct 15, 2025",
      verified: true,
    },
    {
      id: 2,
      farmName: "Tropical Harvest Ltd",
      farmAvatar:
        "https://ui-avatars.com/api/?name=Tropical+Harvest&background=407178&color=fff",
      location: "Santo Domingo, DR",
      timeAgo: "5 hours ago",
      content:
        "Just completed our mango harvest! 🥭 Premium Alphonso variety, perfect for export. Available in 20kg crates. Limited stock!",
      images: [
        "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      ],
      likes: 67,
      comments: 15,
      harvestDate: "Available Now",
      verified: true,
    },
    {
      id: 3,
      farmName: "Island Fresh Produce",
      farmAvatar:
        "https://ui-avatars.com/api/?name=Island+Fresh&background=6C715D&color=fff",
      location: "Bridgetown, Barbados",
      timeAgo: "1 day ago",
      content:
        "Our sweet potato harvest exceeded expectations! 🍠 2 tons available for immediate delivery. Organic certified and ready for local or export markets.",
      images: [
        "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      ],
      likes: 89,
      comments: 12,
      harvestDate: "Available Now",
      verified: true,
    },
  ];

  // Available Harvests - Expanded with more variety
  const allHarvests = [
    {
      id: 1,
      name: "Organic Cherry Tomatoes",
      farm: "Caribbean Farms Co.",
      farmRating: 4.8,
      location: "Kingston, Jamaica",
      country: "Jamaica",
      price: 3.5,
      unit: "lb",
      minOrder: "100 lbs",
      availability: "Pre-order",
      availabilityDate: "Oct 15, 2025",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      discount: "15% off pre-order",
      tags: ["Organic", "Pre-order"],
      verified: true,
      category: "Vegetables",
    },
    {
      id: 2,
      name: "Alphonso Mangoes",
      farm: "Tropical Harvest Ltd",
      farmRating: 4.9,
      location: "Santo Domingo, DR",
      country: "Dominican Republic",
      price: 4.2,
      unit: "lb",
      minOrder: "50 lbs",
      availability: "Available Now",
      availabilityDate: "Available Now",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      discount: null,
      tags: ["Export Ready", "Premium"],
      verified: true,
      category: "Fruits",
    },
    {
      id: 3,
      name: "Sweet Potatoes",
      farm: "Island Fresh Produce",
      farmRating: 4.7,
      location: "Bridgetown, Barbados",
      country: "Barbados",
      price: 1.8,
      unit: "lb",
      minOrder: "200 lbs",
      availability: "Available Now",
      availabilityDate: "Available Now",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      discount: "20% off bulk",
      tags: ["Organic", "Bulk"],
      verified: true,
      category: "Root Crops",
    },
    {
      id: 4,
      name: "Fresh Lettuce",
      farm: "Green Valley Cooperative",
      farmRating: 4.6,
      location: "Port of Spain, Trinidad",
      country: "Trinidad and Tobago",
      price: 2.25,
      unit: "head",
      minOrder: "50 heads",
      availability: "Pre-order",
      availabilityDate: "Oct 12, 2025",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      discount: null,
      tags: ["Hydroponic", "Local"],
      verified: false,
      category: "Leafy Greens",
    },
    {
      id: 5,
      name: "Scotch Bonnet Peppers",
      farm: "Spice Island Farms",
      farmRating: 4.9,
      location: "St. George's, Grenada",
      country: "Grenada",
      price: 5.8,
      unit: "lb",
      minOrder: "25 lbs",
      availability: "Available Now",
      availabilityDate: "Available Now",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      discount: null,
      tags: ["Hot", "Export Ready"],
      verified: true,
      category: "Vegetables",
    },
    {
      id: 6,
      name: "Organic Basil",
      farm: "Herb Haven",
      farmRating: 4.5,
      location: "Castries, St. Lucia",
      country: "St. Lucia",
      price: 8.5,
      unit: "bunch",
      minOrder: "20 bunches",
      availability: "Pre-order",
      availabilityDate: "Oct 10, 2025",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      discount: "10% off",
      tags: ["Organic", "Fresh"],
      verified: true,
      category: "Herbs",
    },
    {
      id: 7,
      name: "Fresh Coconuts",
      farm: "Palm Paradise",
      farmRating: 4.7,
      location: "Nassau, Bahamas",
      country: "Bahamas",
      price: 2.0,
      unit: "each",
      minOrder: "100 units",
      availability: "Available Now",
      availabilityDate: "Available Now",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      discount: null,
      tags: ["Fresh", "Export Ready"],
      verified: true,
      category: "Fruits",
    },
    {
      id: 8,
      name: "Organic Spinach",
      farm: "Green Leaf Farms",
      farmRating: 4.6,
      location: "Kingston, Jamaica",
      country: "Jamaica",
      price: 3.0,
      unit: "lb",
      minOrder: "75 lbs",
      availability: "Available Now",
      availabilityDate: "Available Now",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      discount: "5% off",
      tags: ["Organic", "Local"],
      verified: true,
      category: "Leafy Greens",
    },
    {
      id: 9,
      name: "Plantains",
      farm: "Caribbean Harvest Co.",
      farmRating: 4.8,
      location: "Santo Domingo, DR",
      country: "Dominican Republic",
      price: 1.5,
      unit: "lb",
      minOrder: "200 lbs",
      availability: "Pre-order",
      availabilityDate: "Oct 20, 2025",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      discount: null,
      tags: ["Bulk", "Export Ready"],
      verified: true,
      category: "Fruits",
    },
    {
      id: 10,
      name: "Organic Ginger",
      farm: "Spice Valley",
      farmRating: 4.9,
      location: "Port of Spain, Trinidad",
      country: "Trinidad and Tobago",
      price: 12.0,
      unit: "lb",
      minOrder: "25 lbs",
      availability: "Available Now",
      availabilityDate: "Available Now",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      discount: "10% off bulk",
      tags: ["Organic", "Premium"],
      verified: true,
      category: "Herbs",
    },
    {
      id: 11,
      name: "Bell Peppers",
      farm: "Veggie Garden Ltd",
      farmRating: 4.4,
      location: "Bridgetown, Barbados",
      country: "Barbados",
      price: 4.0,
      unit: "lb",
      minOrder: "50 lbs",
      availability: "Pre-order",
      availabilityDate: "Oct 18, 2025",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      discount: null,
      tags: ["Fresh", "Local"],
      verified: false,
      category: "Vegetables",
    },
    {
      id: 12,
      name: "Papaya",
      farm: "Tropical Fruits Inc",
      farmRating: 4.7,
      location: "Nassau, Bahamas",
      country: "Bahamas",
      price: 3.8,
      unit: "lb",
      minOrder: "100 lbs",
      availability: "Available Now",
      availabilityDate: "Available Now",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      discount: "15% off",
      tags: ["Fresh", "Export Ready"],
      verified: true,
      category: "Fruits",
    },
  ];

  // Featured Suppliers
  const featuredSuppliers = [
    {
      id: 1,
      name: "Caribbean Farms Co.",
      location: "Kingston, Jamaica",
      rating: 4.8,
      totalReviews: 234,
      products: 47,
      responseTime: "< 2 hours",
      verified: true,
      certifications: ["Organic", "Fair Trade"],
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
    },
    {
      id: 2,
      name: "Tropical Harvest Ltd",
      location: "Santo Domingo, DR",
      rating: 4.9,
      totalReviews: 189,
      products: 32,
      responseTime: "< 1 hour",
      verified: true,
      certifications: ["Export Ready", "GAP"],
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
    },
    {
      id: 3,
      name: "Island Fresh Produce",
      location: "Bridgetown, Barbados",
      rating: 4.7,
      totalReviews: 156,
      products: 28,
      responseTime: "< 3 hours",
      verified: true,
      certifications: ["Organic", "Local"],
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
    },
    {
      id: 4,
      name: "Green Valley Cooperative",
      location: "Port of Spain, Trinidad",
      rating: 4.6,
      totalReviews: 98,
      products: 24,
      responseTime: "< 4 hours",
      verified: false,
      certifications: ["Hydroponic"],
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
    },
  ];

  const toggleSave = (id: number) => {
    setSavedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Check if categories overflow (need scroll arrows)
  useEffect(() => {
    const checkOverflow = () => {
      if (categoryScrollRef.current) {
        const { scrollWidth, clientWidth } = categoryScrollRef.current;
        setHasOverflow(scrollWidth > clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  const scrollCategories = (direction: "left" | "right") => {
    if (categoryScrollRef.current) {
      const scrollAmount = 300;
      categoryScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Filter functions
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
    setSelectedAvailability([]);
    setSelectedCountries([]);
    setSelectedCertifications([]);
    setPriceRange([0, 100]);
  };

  // Get unique countries from harvests
  const countries = Array.from(
    new Set(allHarvests.map((h) => h.country))
  ).sort();

  // Get unique certifications from harvests
  const certifications = Array.from(
    new Set(allHarvests.flatMap((h) => h.tags))
  ).sort();

  // Filter harvests based on selected filters
  const filteredHarvests = allHarvests.filter((harvest) => {
    // Search query filter
    if (
      searchQuery &&
      !harvest.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !harvest.farm.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Category filter
    if (
      selectedCategory !== "All Categories" &&
      harvest.category !== selectedCategory
    ) {
      return false;
    }

    // Availability filter
    if (
      selectedAvailability.length > 0 &&
      !selectedAvailability.includes(harvest.availability)
    ) {
      return false;
    }

    // Country filter
    if (
      selectedCountries.length > 0 &&
      !selectedCountries.includes(harvest.country)
    ) {
      return false;
    }

    // Certification filter
    if (selectedCertifications.length > 0) {
      const hasAnyCertification = selectedCertifications.some((cert) =>
        harvest.tags.includes(cert)
      );
      if (!hasAnyCertification) {
        return false;
      }
    }

    // Price range filter
    if (harvest.price < priceRange[0] || harvest.price > priceRange[1]) {
      return false;
    }

    return true;
  });

  const activeFiltersCount =
    selectedAvailability.length +
    selectedCountries.length +
    selectedCertifications.length +
    (priceRange[0] !== 0 || priceRange[1] !== 100 ? 1 : 0);

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main>
        {/* Search Section */}
        <section className="bg-white border-b border-[var(--secondary-soft-highlight)]/30">
          <div className="max-w-[1400px] mx-auto px-6 py-3">
            <div className="flex gap-2 items-center">
              <div className="flex-1 flex items-center bg-[var(--primary-background)] rounded-full overflow-hidden border border-[var(--secondary-soft-highlight)]/30">
                <input
                  type="text"
                  placeholder="Search for produce, farms, or categories..."
                  className="flex-1 px-3 py-2 text-xs outline-none bg-transparent placeholder:text-[var(--secondary-muted-edge)] text-[var(--secondary-black)]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="p-2 m-0.5 bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] transition-all duration-200">
                  <MagnifyingGlassIcon className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="relative flex items-center gap-1.5 px-3 py-2 bg-[var(--primary-background)] border border-[var(--secondary-soft-highlight)]/30 rounded-full hover:bg-white transition-colors duration-200"
              >
                <FunnelIcon className="h-3.5 w-3.5 text-[var(--secondary-black)]" />
                <span className="font-medium text-xs text-[var(--secondary-black)]">
                  Filters
                </span>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[var(--primary-accent2)] text-white text-[9px] rounded-full h-4 w-4 flex items-center justify-center font-semibold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {/* Category Scroll - eBay Style */}
            <div className="relative mt-2">
              {hasOverflow && (
                <>
                  <button
                    onClick={() => scrollCategories("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-1 hover:bg-gray-50 transition-all duration-200"
                  >
                    <ChevronLeftIcon className="h-3 w-3 text-[var(--secondary-black)]" />
                  </button>
                  <button
                    onClick={() => scrollCategories("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-1 hover:bg-gray-50 transition-all duration-200"
                  >
                    <ChevronRightIcon className="h-3 w-3 text-[var(--secondary-black)]" />
                  </button>
                </>
              )}
              <div
                ref={categoryScrollRef}
                className={`flex gap-1.5 overflow-x-auto scrollbar-hide scroll-smooth ${
                  hasOverflow ? "px-6" : "px-0"
                }`}
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full font-medium text-xs transition-all duration-200 whitespace-nowrap ${
                      selectedCategory === category.name
                        ? "bg-[var(--primary-accent2)] text-white shadow-md"
                        : "bg-white text-[var(--secondary-black)] hover:bg-[var(--primary-background)] border border-[var(--secondary-soft-highlight)]/30"
                    }`}
                  >
                    <span className="text-sm">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white border-b border-[var(--secondary-soft-highlight)]/30">
            <div className="max-w-[1400px] mx-auto px-6 py-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[var(--secondary-black)]">
                  Filter Products
                </h3>
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[var(--primary-accent2)] hover:underline font-medium"
                >
                  Clear All
                </button>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                {/* Availability Filter */}
                <div>
                  <h4 className="text-xs font-semibold text-[var(--secondary-black)] mb-2">
                    Availability
                  </h4>
                  <div className="space-y-1.5">
                    {["Available Now", "Pre-order"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-1.5 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedAvailability.includes(option)}
                          onChange={() =>
                            toggleFilter(
                              selectedAvailability,
                              setSelectedAvailability,
                              option
                            )
                          }
                          className="w-3.5 h-3.5 rounded border-[var(--secondary-soft-highlight)] text-[var(--primary-accent2)] focus:ring-[var(--primary-accent2)]"
                        />
                        <span className="text-xs text-[var(--secondary-black)]">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Country Filter */}
                <div>
                  <h4 className="text-xs font-semibold text-[var(--secondary-black)] mb-2">
                    Country
                  </h4>
                  <div className="space-y-1.5 max-h-28 overflow-y-auto">
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

                {/* Certifications/Tags Filter */}
                <div>
                  <h4 className="text-xs font-semibold text-[var(--secondary-black)] mb-2">
                    Certifications
                  </h4>
                  <div className="space-y-1.5 max-h-28 overflow-y-auto">
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

                {/* Price Range Filter */}
                <div>
                  <h4 className="text-xs font-semibold text-[var(--secondary-black)] mb-2">
                    Price Range (per unit)
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) =>
                          setPriceRange([Number(e.target.value), priceRange[1]])
                        }
                        className="w-16 px-2 py-1 text-xs border border-[var(--secondary-soft-highlight)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)]"
                        placeholder="Min"
                      />
                      <span className="text-xs text-[var(--secondary-muted-edge)]">
                        to
                      </span>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([priceRange[0], Number(e.target.value)])
                        }
                        className="w-16 px-2 py-1 text-xs border border-[var(--secondary-soft-highlight)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)]"
                        placeholder="Max"
                      />
                    </div>
                    <div className="text-[10px] text-[var(--secondary-muted-edge)]">
                      ${priceRange[0]} - ${priceRange[1]}
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Filters Display */}
              {activeFiltersCount > 0 && (
                <div className="mt-4 pt-3 border-t border-[var(--secondary-soft-highlight)]/30">
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAvailability.map((filter) => (
                      <span
                        key={filter}
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[var(--primary-accent2)]/10 text-[var(--primary-accent2)] rounded-full text-xs"
                      >
                        {filter}
                        <button
                          onClick={() =>
                            toggleFilter(
                              selectedAvailability,
                              setSelectedAvailability,
                              filter
                            )
                          }
                          className="hover:text-[var(--primary-accent3)]"
                        >
                          ×
                        </button>
                      </span>
                    ))}
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

        <div className="max-w-[1400px] mx-auto px-6 py-5">
          <div className="grid gap-5 lg:grid-cols-3">
            {/* Main Content - Products */}
            <div className="space-y-5 lg:col-span-2">
              {/* Available Harvests Grid */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-medium text-[var(--secondary-black)]">
                      Available Harvests
                    </h2>
                    <p className="text-xs text-[var(--secondary-muted-edge)] mt-0.5">
                      Showing {filteredHarvests.length} of {allHarvests.length}{" "}
                      products
                    </p>
                  </div>
                  <select className="px-3 py-1.5 bg-white border border-[var(--secondary-soft-highlight)]/30 rounded-full text-xs font-medium text-[var(--secondary-black)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)]">
                    <option>Sort: Newest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Most Popular</option>
                  </select>
                </div>

                {filteredHarvests.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center border border-[var(--secondary-soft-highlight)]/20">
                    <FunnelIcon className="h-12 w-12 text-[var(--secondary-muted-edge)] mx-auto mb-3 opacity-50" />
                    <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-1.5">
                      No products found
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
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {filteredHarvests.map((harvest) => (
                      <Link
                        key={harvest.id}
                        href={`/buyer/product/${harvest.id}`}
                        className="bg-white rounded-lg overflow-hidden border border-[var(--secondary-soft-highlight)]/20 hover:shadow-md transition-all duration-200 group block"
                      >
                        <div className="relative h-32">
                          <Image
                            src={harvest.image}
                            alt={harvest.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {harvest.discount && (
                            <div className="absolute top-1.5 left-1.5 bg-[var(--primary-accent2)] text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                              {harvest.discount}
                            </div>
                          )}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleSave(harvest.id);
                            }}
                            className="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-sm p-1 rounded-full hover:bg-white transition-all duration-200 z-10"
                          >
                            {savedItems.has(harvest.id) ? (
                              <HeartSolidIcon className="h-3.5 w-3.5 text-[var(--primary-accent2)]" />
                            ) : (
                              <HeartIcon className="h-3.5 w-3.5 text-[var(--secondary-black)]" />
                            )}
                          </button>
                          <div className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                            <StarIcon className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-[10px] font-bold">
                              {harvest.farmRating}
                            </span>
                          </div>
                        </div>

                        <div className="p-3">
                          <h3 className="font-semibold text-sm text-[var(--secondary-black)] mb-2 group-hover:text-[var(--primary-accent2)] transition-colors line-clamp-1">
                            {harvest.name}
                          </h3>

                          <div
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.location.href = `/buyer/supplier/${harvest.id}`;
                            }}
                            className="flex items-center gap-1.5 mb-2 group/supplier cursor-pointer"
                          >
                            <div className="w-5 h-5 rounded-full bg-[var(--primary-accent2)]/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-[8px] font-bold text-[var(--primary-accent2)]">
                                {harvest.farm.charAt(0)}
                              </span>
                            </div>
                            <span className="text-[11px] text-[var(--secondary-muted-edge)] truncate group-hover/supplier:text-[var(--primary-accent2)] transition-colors">
                              {harvest.farm}
                            </span>
                            {harvest.verified && (
                              <CheckBadgeIcon className="h-2.5 w-2.5 text-[var(--primary-accent2)] flex-shrink-0" />
                            )}
                          </div>

                          <div className="flex items-center gap-1 text-[11px] text-[var(--secondary-muted-edge)] mb-2">
                            <MapPinIcon className="h-2.5 w-2.5 flex-shrink-0" />
                            <span className="truncate">{harvest.location}</span>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-2">
                            {harvest.tags.slice(0, 2).map((tag) => (
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
                                ${harvest.price.toFixed(2)}
                                <span className="text-[10px] font-normal text-[var(--secondary-muted-edge)]">
                                  /{harvest.unit}
                                </span>
                              </div>
                              <div className="text-[10px] text-[var(--secondary-muted-edge)] mt-0.5">
                                Min: {harvest.minOrder}
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log("Add to cart:", harvest.id);
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

                {filteredHarvests.length > 0 &&
                  filteredHarvests.length < allHarvests.length && (
                    <div className="text-center mt-5">
                      <button className="px-5 py-2 bg-white border-2 border-[var(--primary-accent2)] text-[var(--primary-accent2)] rounded-full text-sm font-medium hover:bg-[var(--primary-accent2)] hover:text-white transition-all duration-200">
                        Load More Harvests
                      </button>
                    </div>
                  )}
              </section>
            </div>

            {/* Sidebar - Right Side */}
            <div className="space-y-4">
              {/* Harvest Social Feed - Toggleable */}
              <section className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/20 overflow-hidden">
                <button
                  onClick={() => setShowHarvestFeed(!showHarvestFeed)}
                  className="w-full p-3 flex items-center justify-between hover:bg-[var(--primary-background)] transition-colors duration-200"
                >
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="h-4 w-4 text-[var(--primary-accent2)]" />
                    <h3 className="text-sm font-semibold text-[var(--secondary-black)]">
                      Harvest Updates
                    </h3>
                  </div>
                  <ChevronRightIcon
                    className={`h-4 w-4 text-[var(--secondary-muted-edge)] transition-transform duration-200 ${
                      showHarvestFeed ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {showHarvestFeed && (
                  <div className="max-h-[500px] overflow-y-auto border-t border-[var(--secondary-soft-highlight)]/20">
                    <div className="p-3 space-y-3">
                      {harvestUpdates.map((update) => (
                        <div
                          key={update.id}
                          className="pb-3 border-b border-[var(--secondary-soft-highlight)]/20 last:border-0 last:pb-0"
                        >
                          {/* Compact Post Header */}
                          <div className="flex items-start gap-1.5 mb-2">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                              <Image
                                src={update.farmAvatar}
                                alt={update.farmName}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1">
                                <h4 className="font-semibold text-xs text-[var(--secondary-black)] truncate">
                                  {update.farmName}
                                </h4>
                                {update.verified && (
                                  <CheckBadgeIcon className="h-3 w-3 text-[var(--primary-accent2)] flex-shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center gap-0.5 text-[10px] text-[var(--secondary-muted-edge)]">
                                <ClockIcon className="h-2.5 w-2.5" />
                                {update.timeAgo}
                              </div>
                            </div>
                            <div className="px-1.5 py-0.5 bg-[var(--secondary-highlight1)]/20 rounded-full text-[10px] font-medium text-[var(--secondary-black)] whitespace-nowrap">
                              {update.harvestDate}
                            </div>
                          </div>

                          <p className="text-xs text-[var(--secondary-black)] mb-2 leading-relaxed">
                            {update.content}
                          </p>

                          {/* Compact Post Image */}
                          <div className="relative h-32 rounded-lg overflow-hidden mb-2">
                            <Image
                              src={update.images[0]}
                              alt="Harvest update"
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Compact Post Actions */}
                          <div className="flex items-center justify-between text-[10px]">
                            <button className="flex items-center gap-0.5 text-[var(--secondary-muted-edge)] hover:text-[var(--primary-accent2)] transition-colors">
                              <HeartIcon className="h-3 w-3" />
                              <span>{update.likes}</span>
                            </button>
                            <button className="flex items-center gap-0.5 text-[var(--secondary-muted-edge)] hover:text-[var(--primary-accent2)] transition-colors">
                              <ChatBubbleLeftIcon className="h-3 w-3" />
                              <span>{update.comments}</span>
                            </button>
                            <Link
                              href={`/buyer/harvest/${update.id}`}
                              className="flex items-center gap-0.5 text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] transition-colors font-medium"
                            >
                              View
                              <ArrowRightIcon className="h-2.5 w-2.5" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Featured Suppliers */}
              <section className="bg-white rounded-2xl p-4 border border-[var(--secondary-soft-highlight)]/20">
                <h3 className="text-sm font-semibold text-[var(--secondary-black)] mb-3 flex items-center gap-1.5">
                  <UserGroupIcon className="h-4 w-4 text-[var(--primary-accent2)]" />
                  Featured Suppliers
                </h3>
                <div className="space-y-3">
                  {featuredSuppliers.map((supplier) => (
                    <Link
                      key={supplier.id}
                      href={`/seller/${supplier.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="block group"
                    >
                      <div className="flex gap-2">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={supplier.image}
                            alt={supplier.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 mb-0.5">
                            <h4 className="font-semibold text-xs text-[var(--secondary-black)] truncate group-hover:text-[var(--primary-accent2)] transition-colors">
                              {supplier.name}
                            </h4>
                            {supplier.verified && (
                              <CheckBadgeIcon className="h-3 w-3 text-[var(--primary-accent2)] flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-0.5 text-[10px] text-[var(--secondary-muted-edge)] mb-1">
                            <MapPinIcon className="h-2.5 w-2.5" />
                            <span className="truncate">
                              {supplier.location}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <div className="flex items-center gap-0.5">
                              <StarIcon className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">
                                {supplier.rating}
                              </span>
                              <span className="text-[var(--secondary-muted-edge)]">
                                ({supplier.totalReviews})
                              </span>
                            </div>
                            <span className="text-[var(--secondary-muted-edge)]">
                              {supplier.products} products
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/buyer/suppliers"
                  className="block w-full mt-3 py-2 text-xs font-medium text-[var(--primary-accent2)] hover:bg-[var(--primary-background)] rounded-lg transition-colors duration-200 text-center"
                >
                  View All Suppliers →
                </Link>
              </section>

              {/* Quick Stats */}
              <section className="bg-gradient-to-br from-[var(--primary-accent2)] to-[var(--primary-accent3)] rounded-2xl p-4 text-white">
                <h3 className="text-sm font-semibold mb-3">
                  Marketplace Stats
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs opacity-90">Active Harvests</span>
                    <span className="text-base font-bold">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs opacity-90">
                      Verified Suppliers
                    </span>
                    <span className="text-base font-bold">342</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs opacity-90">
                      This Week&apos;s Orders
                    </span>
                    <span className="text-base font-bold">8,923</span>
                  </div>
                </div>
              </section>

              {/* Help & Support */}
              <section className="bg-[var(--secondary-highlight1)]/10 rounded-2xl p-4 border border-[var(--secondary-highlight1)]/30">
                <h3 className="text-sm font-semibold text-[var(--secondary-black)] mb-2">
                  Need Help?
                </h3>
                <p className="text-xs text-[var(--secondary-muted-edge)] mb-3">
                  Our team is here to assist you with orders, suppliers, and
                  more.
                </p>
                <button className="w-full py-2 bg-[var(--secondary-black)] text-white rounded-full text-xs font-medium hover:bg-[var(--secondary-muted-edge)] transition-colors duration-200">
                  Contact Support
                </button>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
