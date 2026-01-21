"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import { getApiClient } from "@/lib/apiClient";
import ProcurLoader from "@/components/ProcurLoader";
import SupplierAvatar from "@/components/buyer/SupplierAvatar";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  StarIcon,
  MapPinIcon,
  CheckBadgeIcon,
  TruckIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClockIcon,
  TagIcon,
  EyeIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

type MarketplaceCardProduct = {
  id: string;
  name: string;
  category: string;
  tags: string[];
  price: number;
  location: string;
  rating: number;
  image: string;
  sellerId: string;
  sellerName: string;
  sellerImageUrl?: string | null;
};

export default function MarketplaceClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [currentDealSlide, setCurrentDealSlide] = useState(0);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([
    "Grenada",
  ]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<
    "relevance" | "price_asc" | "price_desc" | "rating_desc"
  >("relevance");

  // Featured deals carousel
  const featuredDeals = [
    {
      id: 1,
      title: "Fresh Organic Tomatoes",
      originalPrice: "$4.50",
      salePrice: "$2.99",
      discount: "33% OFF",
      seller: "Green Valley Farms",
      location: "Jamaica",
      rating: 4.8,
      reviews: 124,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      badge: "Best Seller",
      timeLeft: "2 days left",
    },
    {
      id: 2,
      title: "Premium Avocados",
      originalPrice: "$6.00",
      salePrice: "$4.25",
      discount: "29% OFF",
      seller: "Tropical Harvest Co.",
      location: "Dominican Republic",
      rating: 4.9,
      reviews: 89,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      badge: "Limited Time",
      timeLeft: "5 hours left",
    },
    {
      id: 3,
      title: "Sweet Bell Peppers",
      originalPrice: "$5.20",
      salePrice: "$3.75",
      discount: "28% OFF",
      seller: "Caribbean Fresh",
      location: "Barbados",
      rating: 4.7,
      reviews: 156,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      badge: "Hot Deal",
      timeLeft: "1 day left",
    },
  ];

  // TODO: Replace mock data with real countries, farms, and products from public API endpoints
  const createCountrySlug = (country: string) =>
    country.toLowerCase().replace(/\s+/g, "-");

  const createProductSlug = (name: string, id: string | number) =>
    `${name.toLowerCase().replace(/\s+/g, "-")}-${id}`;

  const primaryCategoryLabel =
    selectedCategories.length === 0
      ? "All Categories"
      : selectedCategories.length === 1
        ? selectedCategories[0]
        : `${selectedCategories[0]} +${selectedCategories.length - 1}`;

  const toggleCategory = (name: string) => {
    if (name === "All Categories") {
      setSelectedCategories([]);
      return;
    }
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  // Trending products
  const trendingProducts = [
    {
      id: 1,
      name: "Organic Mangoes",
      price: "$3.99",
      unit: "/lb",
      originalPrice: "$5.49",
      seller: "Island Fresh Farms",
      location: "Trinidad",
      rating: 4.8,
      reviews: 67,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      badge: "Trending",
      shipping: "Free shipping",
    },
    {
      id: 2,
      name: "Fresh Coconuts",
      price: "$2.50",
      unit: "/each",
      originalPrice: "$3.25",
      seller: "Coconut Grove Co.",
      location: "Jamaica",
      rating: 4.9,
      reviews: 143,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      badge: "Best Value",
      shipping: "Fast delivery",
    },
    {
      id: 3,
      name: "Sweet Plantains",
      price: "$1.99",
      unit: "/bunch",
      originalPrice: "$2.75",
      seller: "Plantation Direct",
      location: "Costa Rica",
      rating: 4.6,
      reviews: 89,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      badge: "Popular",
      shipping: "2-day shipping",
    },
    {
      id: 4,
      name: "Dragon Fruit",
      price: "$8.99",
      unit: "/lb",
      originalPrice: "$12.50",
      seller: "Exotic Fruits Ltd",
      location: "Panama",
      rating: 4.7,
      reviews: 34,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      badge: "Exotic",
      shipping: "Express delivery",
    },
  ];

  // Featured sellers
  const featuredSellers = [
    {
      id: 1,
      name: "Green Valley Farms",
      location: "Jamaica",
      rating: 4.9,
      reviews: 1247,
      products: 156,
      verified: true,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      specialties: ["Organic", "Tropical Fruits", "Vegetables"],
      badge: "Top Seller",
    },
    {
      id: 2,
      name: "Caribbean Fresh Co.",
      location: "Barbados",
      rating: 4.8,
      reviews: 892,
      products: 89,
      verified: true,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      specialties: ["Herbs", "Spices", "Premium"],
      badge: "Verified",
    },
    {
      id: 3,
      name: "Tropical Harvest",
      location: "Dominican Republic",
      rating: 4.7,
      reviews: 634,
      products: 124,
      verified: true,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      specialties: ["Export Quality", "Bulk Orders"],
      badge: "Reliable",
    },
    {
      id: 4,
      name: "Island Organics",
      location: "St. Lucia",
      rating: 4.9,
      reviews: 456,
      products: 78,
      verified: true,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      specialties: ["Certified Organic", "Sustainable"],
      badge: "Eco-Friendly",
    },
  ];

  // Category showcase
  const categoryShowcase = [
    {
      name: "Fresh Fruits",
      description: "Premium tropical and seasonal fruits",
      productCount: "15,000+ products",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      href: "/marketplace?category=fruits",
    },
    {
      name: "Vegetables",
      description: "Farm-fresh vegetables daily",
      productCount: "18,000+ products",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      href: "/marketplace?category=vegetables",
    },
    {
      name: "Organic Produce",
      description: "Certified organic selections",
      productCount: "8,000+ products",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      href: "/marketplace?category=organic",
    },
    {
      name: "Herbs & Spices",
      description: "Aromatic herbs and premium spices",
      productCount: "5,000+ products",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      href: "/marketplace?category=herbs",
    },
  ];

  // Products dataset: populated from the public API only (no demo seed data)
  const [allProducts, setAllProducts] = useState<MarketplaceCardProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Limit location filter options to Grenada only for initial launch
  const allLocations = ["Grenada"];
  const allTags = Array.from(
    new Set(allProducts.flatMap((p) => p.tags))
  ).sort();

  // Product categories with real counts, derived from the current products list
  const categories = useMemo(() => {
    if (allProducts.length === 0) {
      return [{ name: "All Categories", count: "—" }];
    }

    const counts = new Map<string, number>();
    for (const p of allProducts) {
      counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    }

    const total = allProducts.length;
    const items = Array.from(counts.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, count]) => ({
        name,
        count: count.toLocaleString(),
      }));

    return [
      { name: "All Categories", count: total.toLocaleString() },
      ...items,
    ];
  }, [allProducts]);

  const filteredResults = allProducts
    .filter((p) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        q === "" ||
        `${p.name} ${p.category} ${p.location} ${p.sellerName}`
          .toLowerCase()
          .includes(q);
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(p.category);
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((t) => p.tags.includes(t));
      const matchesLocation =
        selectedLocations.length === 0 ||
        selectedLocations.includes(p.location);
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchesRating = p.rating >= minRating;
      return (
        matchesQuery &&
        matchesCategory &&
        matchesTags &&
        matchesLocation &&
        matchesPrice &&
        matchesRating
      );
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "rating_desc") return b.rating - a.rating;
      return 0; // relevance default (no-op for demo)
    });

  // Load marketplace products from public API
  useEffect(() => {
    let cancelled = false;
    const api = getApiClient(() => null);

    const loadProducts = async () => {
      try {
        const { data } = await api.get("/marketplace/products", {
          params: {
            in_stock: true,
            limit: 24,
            sort_by: "created_at",
            sort_order: "desc",
            location: "Grenada",
          },
        });

        const productsFromApi = (data?.products ?? []) as any[];
        if (!cancelled && Array.isArray(productsFromApi)) {
          const mapped: MarketplaceCardProduct[] = productsFromApi.map((p) => ({
            id: String(p.id),
            name: p.name,
            category: p.category,
            tags: Array.isArray(p.tags) ? p.tags : [],
            price: typeof p.current_price === "number" ? p.current_price : 0,
            location: p.seller?.location || "Caribbean",
            rating: typeof p.average_rating === "number" ? p.average_rating : 0,
            image:
              p.image_url ||
              "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
            sellerId: String(p.seller?.id ?? ""),
            sellerName: p.seller?.name ?? "Seller",
            sellerImageUrl: p.seller?.logo_url ?? null,
          }));
          setAllProducts(mapped);
        }
      } catch (error) {
        console.error("Failed to load marketplace products", error);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-advance deals carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDealSlide((prev) => (prev + 1) % featuredDeals.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredDeals.length]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[role="search"]')) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const nextDealSlide = () => {
    setCurrentDealSlide((prev) => (prev + 1) % featuredDeals.length);
  };

  const prevDealSlide = () => {
    setCurrentDealSlide(
      (prev) => (prev - 1 + featuredDeals.length) % featuredDeals.length
    );
  };

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      {/* Hero Search Section */}
      <section className="bg-gradient-to-b from-[var(--primary-background)] to-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--secondary-black)] mb-4">
              Discover Fresh Produce from Trusted Sellers
            </h1>
            <p className="text-lg md:text-xl text-[var(--secondary-muted-edge)] max-w-3xl mx-auto">
              Shop from thousands of verified suppliers across the Caribbean and
              beyond. Quality guaranteed, competitive prices, reliable delivery.
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="max-w-4xl mx-auto mb-8">
            <form
              role="search"
              className="flex flex-col sm:flex-row sm:items-center gap-2 bg-white rounded-2xl sm:rounded-full shadow-lg border border-[var(--secondary-soft-highlight)]/30 px-3 py-3 sm:p-0"
              onSubmit={(e) => {
                // Prevent full page reload; filtering is driven by controlled inputs.
                e.preventDefault();
              }}
            >
              <div className="relative w-full sm:w-auto">
                <button
                  type="button"
                  className="flex w-full sm:w-auto items-center justify-between sm:justify-center px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium text-[var(--secondary-black)] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:ring-inset rounded-xl sm:rounded-l-full transition-colors duration-200"
                  onClick={() => setShowSearchDropdown(!showSearchDropdown)}
                >
                  {primaryCategoryLabel}
                  <ChevronDownIcon className="ml-2 h-5 w-5 text-[var(--secondary-muted-edge)]" />
                </button>
                {showSearchDropdown && (
                  <div className="absolute top-full left-0 w-full sm:w-56 bg-white border border-gray-200 rounded-xl z-20 mt-2 shadow-lg">
                    <div className="py-2">
                      {categories.map((cat) => {
                        const isAll = cat.name === "All Categories";
                        const isActive = isAll
                          ? selectedCategories.length === 0
                          : selectedCategories.includes(cat.name);
                        return (
                          <button
                            key={cat.name}
                            type="button"
                            className={`block w-full text-left px-4 py-3 text-sm font-medium transition-colors duration-200 hover:bg-gray-50 ${
                              isActive
                                ? "bg-[var(--primary-accent2)] text-white"
                                : "text-[var(--secondary-black)]"
                            }`}
                            onClick={() => {
                              toggleCategory(cat.name);
                              setShowSearchDropdown(false);
                            }}
                          >
                            <div>{cat.name}</div>
                            <div className="text-xs opacity-70">
                              {cat.count}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <div className="hidden sm:block w-px h-8 bg-gray-200" />
              <input
                type="text"
                placeholder="Search for fresh produce, sellers, or brands..."
                className="flex-1 w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base outline-none bg-transparent placeholder:text-[var(--secondary-muted-edge)] text-[var(--secondary-black)]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center mt-1 sm:mt-0 px-4 py-3 sm:p-4 bg-[var(--primary-accent2)] text-white rounded-xl sm:rounded-full hover:bg-[var(--primary-accent3)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent1)] focus:ring-offset-2 transition-all duration-200 group"
              >
                <MagnifyingGlassIcon className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Filters + Results */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header with sort + mobile filter toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden border border-[var(--secondary-soft-highlight)] px-3 py-2 rounded-lg text-sm"
                onClick={() => setFilterDrawerOpen(true)}
              >
                Filters
              </button>
              <div className="text-sm text-[var(--secondary-muted-edge)]">
                {isLoading
                  ? "Loading products..."
                  : allProducts.length > 0
                    ? `${filteredResults.length} results`
                    : "No products available yet"}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--secondary-muted-edge)]">
                Sort by:
              </span>
              <select
                className="text-sm border border-[var(--secondary-soft-highlight)] rounded-lg px-3 py-2 bg-white"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as
                      | "relevance"
                      | "price_asc"
                      | "price_desc"
                      | "rating_desc"
                  )
                }
              >
                <option value="relevance">Relevance</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Rating</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
            {/* Sidebar Filters */}
            <aside className="hidden lg:block border border-[var(--secondary-soft-highlight)] rounded-xl p-4 h-max sticky top-24">
              <h3 className="font-semibold mb-3 text-[var(--secondary-black)]">
                Categories
              </h3>
              <div className="space-y-2 mb-4">
                {categories.map((c) => {
                  const isAll = c.name === "All Categories";
                  const checked = isAll
                    ? selectedCategories.length === 0
                    : selectedCategories.includes(c.name);
                  return (
                    <label
                      key={c.name}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCategory(c.name)}
                      />
                      <span>{c.name}</span>
                      <span className="ml-auto text-[var(--secondary-muted-edge)]">
                        {c.count}
                      </span>
                    </label>
                  );
                })}
              </div>

              <h3 className="font-semibold mb-3 text-[var(--secondary-black)]">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {allTags.map((t) => {
                  const active = selectedTags.includes(t);
                  return (
                    <button
                      key={t}
                      className={`text-xs px-2.5 py-1 rounded-full border ${
                        active
                          ? "border-[var(--primary-accent2)] text-[var(--primary-accent2)] bg-[var(--primary-background)]"
                          : "border-[var(--secondary-soft-highlight)] text-[var(--secondary-black)]"
                      }`}
                      onClick={() =>
                        setSelectedTags((prev) =>
                          prev.includes(t)
                            ? prev.filter((x) => x !== t)
                            : [...prev, t]
                        )
                      }
                    >
                      {t}
                    </button>
                  );
                })}
              </div>

              <h3 className="font-semibold mb-3 text-[var(--secondary-black)]">
                Location
              </h3>
              <div className="space-y-2 mb-4">
                {allLocations.map((loc) => (
                  <label key={loc} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(loc)}
                      onChange={(e) =>
                        setSelectedLocations((prev) =>
                          e.target.checked
                            ? [...prev, loc]
                            : prev.filter((x) => x !== loc)
                        )
                      }
                    />
                    <span>{loc}</span>
                  </label>
                ))}
              </div>

              <h3 className="font-semibold mb-3 text-[var(--secondary-black)]">
                Price
              </h3>
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="number"
                  className="w-20 border border-[var(--secondary-soft-highlight)] rounded-lg px-2 py-1 text-sm"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([Number(e.target.value || 0), priceRange[1]])
                  }
                />
                <span className="text-[var(--secondary-muted-edge)]">to</span>
                <input
                  type="number"
                  className="w-20 border border-[var(--secondary-soft-highlight)] rounded-lg px-2 py-1 text-sm"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value || 0)])
                  }
                />
              </div>

              <h3 className="font-semibold mb-3 text-[var(--secondary-black)]">
                Rating
              </h3>
              <select
                className="w-full border border-[var(--secondary-soft-highlight)] rounded-lg px-2 py-2 text-sm"
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
              >
                <option value={0}>Any</option>
                <option value={4.0}>4.0 & up</option>
                <option value={4.5}>4.5 & up</option>
              </select>
            </aside>

            {/* Results */}
            <div>
              {/* Active filters chips */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {selectedCategories.map((cat) => (
                  <button
                    key={cat}
                    className="text-xs px-2.5 py-1 rounded-full bg-[var(--primary-background)] text-[var(--primary-accent2)] border border-[var(--primary-accent2)]"
                    onClick={() =>
                      setSelectedCategories((prev) =>
                        prev.filter((c) => c !== cat)
                      )
                    }
                  >
                    {cat} ×
                  </button>
                ))}
                {selectedTags.map((t) => (
                  <button
                    key={t}
                    className="text-xs px-2.5 py-1 rounded-full bg-[var(--primary-background)] text-[var(--primary-accent2)] border border-[var(--primary-accent2)]"
                    onClick={() =>
                      setSelectedTags((prev) => prev.filter((x) => x !== t))
                    }
                  >
                    {t} ×
                  </button>
                ))}
                {selectedLocations.map((loc) => (
                  <button
                    key={loc}
                    className="text-xs px-2.5 py-1 rounded-full bg-[var(--primary-background)] text-[var(--primary-accent2)] border border-[var(--primary-accent2)]"
                    onClick={() =>
                      setSelectedLocations((prev) =>
                        prev.filter((x) => x !== loc)
                      )
                    }
                  >
                    {loc} ×
                  </button>
                ))}
                {(selectedCategories.length > 0 ||
                  selectedTags.length > 0 ||
                  selectedLocations.length > 0) && (
                  <button
                    className="text-xs underline ml-2 text-[var(--secondary-muted-edge)]"
                    onClick={() => {
                      setSelectedCategories([]);
                      setSelectedTags([]);
                      setSelectedLocations([]);
                    }}
                  >
                    Clear all
                  </button>
                )}
              </div>

              {isLoading && (
                <div className="flex justify-center items-center py-16">
                  <ProcurLoader
                    size="md"
                    text="Loading marketplace products..."
                  />
                </div>
              )}

              {!isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResults.map((p) => {
                    const countrySlug = createCountrySlug(p.location);
                    const productSlug = createProductSlug(p.name, p.id);
                    const productHref = `/products/${countrySlug}/${productSlug}`;

                    return (
                      <Link
                        key={p.id}
                        href={productHref}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className="relative h-44">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-[var(--secondary-black)] mb-1 group-hover:text-[var(--primary-accent2)] transition-colors">
                            {p.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <SupplierAvatar
                              name={p.sellerName}
                              imageUrl={p.sellerImageUrl}
                              size="xs"
                              className="ring-1 ring-black/5"
                            />
                            <span className="text-xs text-[var(--secondary-muted-edge)]">
                              {p.sellerName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg font-bold text-[var(--secondary-black)]">
                              ${p.price.toFixed(2)}
                            </span>
                            <span className="flex items-center gap-1 text-sm text-gray-500">
                              <MapPinIcon className="h-4 w-4" />
                              {p.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mb-3">
                            <StarIconSolid className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm font-medium">
                              {p.rating}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {p.tags.map((t) => (
                              <span
                                key={t}
                                className="text-xs bg-[var(--primary-background)] text-[var(--secondary-black)] px-2 py-1 rounded-full"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                          <div className="w-full bg-[var(--primary-accent2)] text-white py-2 px-4 rounded-lg font-medium text-center group-hover:bg-[var(--primary-accent3)] transition-colors">
                            View details & sign up to buy
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                  {allProducts.length === 0 && (
                    <div className="col-span-full text-center text-[var(--secondary-muted-edge)] py-12">
                      No products available yet. Please check back soon.
                    </div>
                  )}
                  {allProducts.length > 0 && filteredResults.length === 0 && (
                    <div className="col-span-full text-center text-[var(--secondary-muted-edge)] py-12">
                      No products match your filters.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Drawer */}
          {filterDrawerOpen && (
            <div className="fixed inset-0 z-50">
              <div
                className="absolute inset-0 bg-black/30"
                onClick={() => setFilterDrawerOpen(false)}
              />
              <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl p-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[var(--secondary-black)]">
                    Filters
                  </h3>
                  <button
                    className="text-sm underline"
                    onClick={() => setFilterDrawerOpen(false)}
                  >
                    Close
                  </button>
                </div>
                {/* Reuse simple filter controls */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Categories</h4>
                    <div className="space-y-2">
                      {categories.map((c) => {
                        const isAll = c.name === "All Categories";
                        const checked = isAll
                          ? selectedCategories.length === 0
                          : selectedCategories.includes(c.name);
                        return (
                          <label
                            key={c.name}
                            className="flex items-center gap-2 text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleCategory(c.name)}
                            />
                            <span>{c.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((t) => {
                        const active = selectedTags.includes(t);
                        return (
                          <button
                            key={t}
                            className={`text-xs px-2.5 py-1 rounded-full border ${
                              active
                                ? "border-[var(--primary-accent2)] text-[var(--primary-accent2)] bg-[var(--primary-background)]"
                                : "border-[var(--secondary-soft-highlight)] text-[var(--secondary-black)]"
                            }`}
                            onClick={() =>
                              setSelectedTags((prev) =>
                                prev.includes(t)
                                  ? prev.filter((x) => x !== t)
                                  : [...prev, t]
                              )
                            }
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Location</h4>
                    <div className="space-y-2">
                      {allLocations.map((loc) => (
                        <label
                          key={loc}
                          className="flex items-center gap-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={selectedLocations.includes(loc)}
                            onChange={(e) =>
                              setSelectedLocations((prev) =>
                                e.target.checked
                                  ? [...prev, loc]
                                  : prev.filter((x) => x !== loc)
                              )
                            }
                          />
                          <span>{loc}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Marketplace Call to Action */}
      <section className="py-12 bg-gradient-to-r from-[var(--primary-accent2)] to-[var(--primary-accent3)] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Ready to trade on Procur?
              </h2>
              <p className="text-sm md:text-base opacity-90 max-w-xl">
                Buyers use Procur to discover reliable farms and secure supply.
                Sellers use it to showcase their harvests and win better orders.
                Create your free account to unlock pricing, messaging, and
                ordering tools.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Link
                href="/signup?type=buyer"
                className="flex-1 inline-flex items-center justify-center rounded-full bg-white text-[var(--primary-accent2)] px-6 py-3 text-sm md:text-base font-semibold hover:bg-gray-100 transition-colors"
              >
                I&apos;m a buyer – sign me up
              </Link>
              <Link
                href="/signup?type=seller"
                className="flex-1 inline-flex items-center justify-center rounded-full border border-white text-white px-6 py-3 text-sm md:text-base font-semibold hover:bg-white hover:text-[var(--primary-accent2)] transition-colors"
              >
                I&apos;m a seller – list my farm
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
