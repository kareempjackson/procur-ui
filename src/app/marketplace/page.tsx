"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
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
  HeartIcon,
  EyeIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import {
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid,
} from "@heroicons/react/24/solid";

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [currentDealSlide, setCurrentDealSlide] = useState(0);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
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

  // Product categories
  const categories = [
    { name: "All Categories", count: "50,000+" },
    { name: "Fresh Fruits", count: "15,000+" },
    { name: "Vegetables", count: "18,000+" },
    { name: "Herbs & Spices", count: "5,000+" },
    { name: "Organic Produce", count: "8,000+" },
    { name: "Tropical Fruits", count: "4,000+" },
  ];

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

  // Mock all products dataset (subset for demo)
  const allProducts = [
    {
      id: 101,
      name: "Organic Tomatoes",
      category: "Vegetables",
      tags: ["Organic"],
      price: 3.5,
      location: "Jamaica",
      rating: 4.7,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
    },
    {
      id: 102,
      name: "Premium Avocados",
      category: "Fresh Fruits",
      tags: ["Tropical"],
      price: 4.25,
      location: "Dominican Republic",
      rating: 4.9,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
    },
    {
      id: 103,
      name: "Sweet Bell Peppers",
      category: "Vegetables",
      tags: ["Bulk"],
      price: 3.75,
      location: "Barbados",
      rating: 4.6,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
    },
    {
      id: 104,
      name: "Dragon Fruit",
      category: "Fresh Fruits",
      tags: ["Exotic"],
      price: 8.99,
      location: "Panama",
      rating: 4.7,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
    },
    {
      id: 105,
      name: "Coconuts",
      category: "Tropical Fruits",
      tags: ["Tropical"],
      price: 2.5,
      location: "Jamaica",
      rating: 4.8,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
    },
  ];

  const allLocations = Array.from(
    new Set(allProducts.map((p) => p.location))
  ).sort();
  const allTags = Array.from(
    new Set(allProducts.flatMap((p) => p.tags))
  ).sort();

  const filteredResults = allProducts
    .filter((p) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        q === "" ||
        `${p.name} ${p.category} ${p.location}`.toLowerCase().includes(q);
      const matchesCategory =
        selectedCategory === "All Categories" ||
        p.category === selectedCategory;
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

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

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
              className="flex items-center bg-white rounded-full shadow-lg border border-[var(--secondary-soft-highlight)]/30 overflow-hidden"
              onSubmit={(e) => {
                e.preventDefault();
                console.log(
                  "Search:",
                  searchQuery,
                  "Category:",
                  selectedCategory
                );
              }}
            >
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center px-6 py-4 text-base font-medium text-[var(--secondary-black)] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:ring-inset rounded-l-full transition-colors duration-200"
                  onClick={() => setShowSearchDropdown(!showSearchDropdown)}
                >
                  {selectedCategory}
                  <ChevronDownIcon className="ml-2 h-5 w-5 text-[var(--secondary-muted-edge)]" />
                </button>
                {showSearchDropdown && (
                  <div className="absolute top-full left-0 w-48 bg-white border border-gray-200 rounded-xl z-20 mt-2 shadow-lg">
                    <div className="py-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.name}
                          type="button"
                          className={`block w-full text-left px-4 py-3 text-sm font-medium transition-colors duration-200 hover:bg-gray-50 ${
                            selectedCategory === cat.name
                              ? "bg-[var(--primary-accent2)] text-white"
                              : "text-[var(--secondary-black)]"
                          }`}
                          onClick={() => {
                            setSelectedCategory(cat.name);
                            setShowSearchDropdown(false);
                          }}
                        >
                          <div>{cat.name}</div>
                          <div className="text-xs opacity-70">{cat.count}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <input
                type="text"
                placeholder="Search for fresh produce, sellers, or brands..."
                className="flex-1 px-6 py-4 text-base outline-none bg-transparent placeholder:text-[var(--secondary-muted-edge)] text-[var(--secondary-black)]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="p-4 m-1 bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent1)] focus:ring-offset-2 transition-all duration-200 group"
              >
                <MagnifyingGlassIcon className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
              </button>
            </form>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-[var(--primary-accent2)]">
                50,000+
              </div>
              <div className="text-sm text-[var(--secondary-muted-edge)]">
                Products Available
              </div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-[var(--primary-accent2)]">
                2,500+
              </div>
              <div className="text-sm text-[var(--secondary-muted-edge)]">
                Verified Sellers
              </div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-[var(--primary-accent2)]">
                98%
              </div>
              <div className="text-sm text-[var(--secondary-muted-edge)]">
                Satisfaction Rate
              </div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-[var(--primary-accent2)]">
                24/7
              </div>
              <div className="text-sm text-[var(--secondary-muted-edge)]">
                Customer Support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Deals Carousel */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--secondary-black)]">
              Today's Featured Deals
            </h2>
            <Link
              href="/marketplace/deals"
              className="text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] font-medium flex items-center group"
            >
              View all deals
              <ArrowRightIcon className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentDealSlide * 100}%)` }}
              >
                {featuredDeals.map((deal) => (
                  <div key={deal.id} className="w-full flex-shrink-0">
                    <div className="bg-gradient-to-r from-[var(--primary-accent2)] to-[var(--primary-accent3)] text-white p-8 md:p-12 rounded-2xl">
                      <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                              {deal.badge}
                            </span>
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                              {deal.discount}
                            </span>
                          </div>
                          <h3 className="text-3xl md:text-4xl font-bold mb-4">
                            {deal.title}
                          </h3>
                          <div className="flex items-center gap-4 mb-4">
                            <span className="text-2xl md:text-3xl font-bold">
                              {deal.salePrice}
                            </span>
                            <span className="text-lg line-through opacity-70">
                              {deal.originalPrice}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-1">
                              <StarIconSolid className="h-5 w-5 text-yellow-400" />
                              <span className="font-medium">{deal.rating}</span>
                              <span className="opacity-70">
                                ({deal.reviews} reviews)
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPinIcon className="h-4 w-4" />
                              <span className="opacity-70">
                                {deal.location}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mb-6">
                            <span className="text-sm opacity-70">
                              by {deal.seller}
                            </span>
                            <span className="text-sm bg-white/20 px-2 py-1 rounded">
                              ⏰ {deal.timeLeft}
                            </span>
                          </div>
                          <div className="flex gap-4">
                            <Link
                              href="/signup?type=buyer"
                              className="bg-white text-[var(--primary-accent2)] px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
                            >
                              Sign Up to Buy
                            </Link>
                            <button className="border border-white/30 text-white px-6 py-3 rounded-full font-medium hover:bg-white/10 transition-colors">
                              View Details
                            </button>
                          </div>
                        </div>
                        <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
                          <Image
                            src={deal.image}
                            alt={deal.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Controls */}
            <button
              onClick={prevDealSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[var(--secondary-black)] p-3 rounded-full shadow-lg transition-all duration-200"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <button
              onClick={nextDealSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[var(--secondary-black)] p-3 rounded-full shadow-lg transition-all duration-200"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>

            {/* Carousel Dots */}
            <div className="flex justify-center mt-6 gap-2">
              {featuredDeals.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentDealSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentDealSlide
                      ? "bg-[var(--primary-accent2)]"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
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
                {filteredResults.length} results
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--secondary-muted-edge)]">
                Sort by:
              </span>
              <select
                className="text-sm border border-[var(--secondary-soft-highlight)] rounded-lg px-3 py-2 bg-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
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
                {categories.map((c) => (
                  <label
                    key={c.name}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === c.name}
                      onChange={() => setSelectedCategory(c.name)}
                    />
                    <span>{c.name}</span>
                    <span className="ml-auto text-[var(--secondary-muted-edge)]">
                      {c.count}
                    </span>
                  </label>
                ))}
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
                {selectedCategory !== "All Categories" && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--primary-background)] text-[var(--primary-accent2)] border border-[var(--primary-accent2)]">
                    {selectedCategory}
                  </span>
                )}
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
                {(selectedTags.length > 0 ||
                  selectedLocations.length > 0 ||
                  selectedCategory !== "All Categories") && (
                  <button
                    className="text-xs underline ml-2 text-[var(--secondary-muted-edge)]"
                    onClick={() => {
                      setSelectedTags([]);
                      setSelectedLocations([]);
                      setSelectedCategory("All Categories");
                    }}
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="relative h-44">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={() => toggleFavorite(p.id)}
                        className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                      >
                        {favorites.has(p.id) ? (
                          <HeartIconSolid className="h-5 w-5 text-red-500" />
                        ) : (
                          <HeartIcon className="h-5 w-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-[var(--secondary-black)] mb-1 group-hover:text-[var(--primary-accent2)] transition-colors">
                        {p.name}
                      </h3>
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
                        <span className="text-sm font-medium">{p.rating}</span>
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
                      <button className="w-full bg-[var(--primary-accent2)] text-white py-2 px-4 rounded-lg font-medium hover:bg-[var(--primary-accent3)] transition-colors">
                        Add to cart
                      </button>
                    </div>
                  </div>
                ))}
                {filteredResults.length === 0 && (
                  <div className="col-span-full text-center text-[var(--secondary-muted-edge)] py-12">
                    No products match your filters.
                  </div>
                )}
              </div>
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
                      {categories.map((c) => (
                        <label
                          key={c.name}
                          className="flex items-center gap-2 text-sm"
                        >
                          <input
                            type="radio"
                            name="m-category"
                            checked={selectedCategory === c.name}
                            onChange={() => setSelectedCategory(c.name)}
                          />
                          <span>{c.name}</span>
                        </label>
                      ))}
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

      {/* Category Showcase */}
      <section className="py-12 bg-[var(--primary-background)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-[var(--secondary-muted-edge)]">
              Discover fresh produce across our most popular categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryShowcase.map((category, index) => (
              <Link
                key={index}
                href={category.href}
                className="group focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:ring-offset-2 rounded-xl"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                  <div className="relative h-48">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg font-bold mb-1">
                        {category.name}
                      </h3>
                      <p className="text-sm opacity-90">
                        {category.productCount}
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-[var(--secondary-muted-edge)] text-sm">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--secondary-black)]">
              Trending Products
            </h2>
            <Link
              href="/marketplace/trending"
              className="text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] font-medium flex items-center group"
            >
              View all trending
              <ArrowRightIcon className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                <div className="relative">
                  <div className="relative h-48">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                    >
                      {favorites.has(product.id) ? (
                        <HeartIconSolid className="h-5 w-5 text-red-500" />
                      ) : (
                        <HeartIcon className="h-5 w-5 text-gray-600" />
                      )}
                    </button>
                    <div className="absolute top-3 left-3">
                      <span className="bg-[var(--primary-accent2)] text-white px-2 py-1 rounded-full text-xs font-medium">
                        {product.badge}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[var(--secondary-black)] mb-2 group-hover:text-[var(--primary-accent2)] transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-[var(--secondary-black)]">
                      {product.price}
                      <span className="text-sm font-normal text-[var(--secondary-muted-edge)]">
                        {product.unit}
                      </span>
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm line-through text-gray-400">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <StarIconSolid className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {product.rating}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({product.reviews})
                    </span>
                  </div>
                  <div className="text-sm text-[var(--secondary-muted-edge)] mb-2">
                    by {product.seller}
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    <MapPinIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {product.location}
                    </span>
                  </div>
                  <div className="text-xs text-green-600 mb-3">
                    {product.shipping}
                  </div>
                  <Link
                    href="/signup?type=buyer"
                    className="w-full bg-[var(--primary-accent2)] text-white py-2 px-4 rounded-lg font-medium hover:bg-[var(--primary-accent3)] transition-colors text-center block"
                  >
                    Sign Up to Buy
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Sellers */}
      <section className="py-12 bg-[var(--primary-background)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--secondary-black)] mb-2">
                Featured Sellers
              </h2>
              <p className="text-lg text-[var(--secondary-muted-edge)]">
                Discover top-rated suppliers from across the region
              </p>
            </div>
            <Link
              href="/marketplace/sellers"
              className="text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] font-medium flex items-center group"
            >
              View all sellers
              <ArrowRightIcon className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredSellers.map((seller) => (
              <div
                key={seller.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                <div className="relative h-32 bg-gradient-to-br from-[var(--primary-accent2)] to-[var(--primary-accent3)]">
                  <div className="absolute top-3 right-3">
                    <span className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {seller.badge}
                    </span>
                  </div>
                  <div className="absolute -bottom-8 left-4">
                    <div className="relative w-16 h-16 rounded-full border-4 border-white overflow-hidden">
                      <Image
                        src={seller.image}
                        alt={seller.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-12 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-[var(--secondary-black)] group-hover:text-[var(--primary-accent2)] transition-colors">
                      {seller.name}
                    </h3>
                    {seller.verified && (
                      <CheckBadgeIcon className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <MapPinIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {seller.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    <StarIconSolid className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm font-medium">{seller.rating}</span>
                    <span className="text-sm text-gray-500">
                      ({seller.reviews} reviews)
                    </span>
                  </div>
                  <div className="text-sm text-[var(--secondary-muted-edge)] mb-3">
                    {seller.products} products available
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {seller.specialties.slice(0, 2).map((specialty, index) => (
                      <span
                        key={index}
                        className="text-xs bg-[var(--primary-background)] text-[var(--secondary-black)] px-2 py-1 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/seller/${seller.name
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    className="w-full border border-[var(--primary-accent2)] text-[var(--primary-accent2)] py-2 px-4 rounded-lg font-medium hover:bg-[var(--primary-accent2)] hover:text-white transition-colors text-center block"
                  >
                    Visit Store
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Benefits */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Why Choose Procur Marketplace?
            </h2>
            <p className="text-lg text-[var(--secondary-muted-edge)] max-w-3xl mx-auto">
              Join thousands of buyers who trust our platform for reliable
              sourcing, competitive prices, and exceptional service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--primary-accent2)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckBadgeIcon className="h-8 w-8 text-[var(--primary-accent2)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-2">
                Verified Sellers
              </h3>
              <p className="text-[var(--secondary-muted-edge)] text-sm">
                All suppliers undergo rigorous verification for quality and
                reliability
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--primary-accent2)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-[var(--primary-accent2)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-2">
                Secure Payments
              </h3>
              <p className="text-[var(--secondary-muted-edge)] text-sm">
                Protected transactions with escrow services and buyer protection
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--primary-accent2)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TruckIcon className="h-8 w-8 text-[var(--primary-accent2)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-2">
                Fast Delivery
              </h3>
              <p className="text-[var(--secondary-muted-edge)] text-sm">
                Reliable logistics network ensuring fresh produce arrives on
                time
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--primary-accent2)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="h-8 w-8 text-[var(--primary-accent2)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-2">
                24/7 Support
              </h3>
              <p className="text-[var(--secondary-muted-edge)] text-sm">
                Dedicated customer service team ready to help with any questions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-[var(--primary-accent2)] to-[var(--primary-accent3)] text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Sourcing Fresh Produce?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Join thousands of buyers who have discovered better suppliers,
            competitive prices, and reliable service through our marketplace.
            Create your buyer account today and start sourcing with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup?type=buyer"
              className="bg-white text-[var(--primary-accent2)] px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center group"
            >
              Create Buyer Account
              <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/demo"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-[var(--primary-accent2)] transition-colors inline-flex items-center justify-center"
            >
              Watch Demo
            </Link>
          </div>
          <div className="mt-8 text-sm opacity-80">
            Already have an account?{" "}
            <Link href="/login" className="underline hover:no-underline">
              Sign in here
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
