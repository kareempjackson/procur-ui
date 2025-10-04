"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import TopNavigation from "@/components/navigation/TopNavigation";
import BuyerTopNavigation from "@/components/navigation/BuyerTopNavigation";
import SellerTopNavigation from "@/components/navigation/SellerTopNavigation";
import Footer from "@/components/footer/Footer";
import { useAppSelector } from "@/store";
import { selectAuthUser } from "@/store/slices/authSlice";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  // Category icons
  CubeIcon,
  GlobeAltIcon,
  SparklesIcon,
  // Service icons
  TruckIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
  // Additional icons
  BuildingStorefrontIcon,
  MapPinIcon,
  StarIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  const user = useAppSelector(selectAuthUser);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showStickySearch, setShowStickySearch] = useState(false);

  // Hero carousel data
  const heroSlides = [
    {
      headline: "Source Fresh Produce Directly from Trusted Farms",
      subcopy: "Verified suppliers. Transparent logistics. Regional reach.",
      cta: { label: "Explore Marketplace", href: "/marketplace" },
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
    },
    {
      headline: "Real-time Insights for Buyers & Governments",
      subcopy:
        "Supply, demand, and food security analytics at your fingertips.",
      cta: { label: "View Insights", href: "/insights" },
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
    },
    {
      headline: "Secure Payments & Escrow Solutions",
      subcopy: "Safe, fast transactions with milestone protection.",
      cta: { label: "Learn More", href: "/payments" },
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
    },
  ];

  // Categories data
  const categories = [
    {
      name: "Vegetables",
      icon: CubeIcon,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      href: "/marketplace?cat=vegetables",
    },
    {
      name: "Fruits",
      icon: SparklesIcon,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      href: "/marketplace?cat=fruits",
    },
    {
      name: "Herbs",
      icon: CubeIcon,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      href: "/marketplace?cat=herbs",
    },
    {
      name: "Organic",
      icon: CheckBadgeIcon,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      href: "/marketplace?tag=organic",
    },
    {
      name: "Export Ready",
      icon: GlobeAltIcon,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      href: "/marketplace?tag=export",
    },
  ];

  // Featured farms data
  const featuredFarms = [
    {
      name: "Caribbean Farms Co.",
      region: "Jamaica",
      certifications: ["Organic", "Fair Trade"],
      listings: 47,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      href: "/seller/caribbean-farms",
    },
    {
      name: "Tropical Harvest",
      region: "Dominican Republic",
      certifications: ["Export Ready", "GAP Certified"],
      listings: 32,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      href: "/seller/tropical-harvest",
    },
    {
      name: "Island Fresh",
      region: "Barbados",
      certifications: ["Organic", "Local"],
      listings: 28,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      href: "/seller/island-fresh",
    },
    {
      name: "Mountain View Farm",
      region: "Trinidad",
      certifications: ["Sustainable", "Export Ready"],
      listings: 41,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      href: "/seller/mountain-view",
    },
  ];

  // Featured products data
  const featuredProducts = [
    {
      id: 1,
      name: "Organic Tomatoes",
      price: "$3.50",
      unit: "/lb",
      discount: "15% off",
      farm: "Green Valley Farm",
      rating: 4.8,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      href: "/product/organic-tomatoes",
    },
    {
      id: 2,
      name: "Fresh Lettuce",
      price: "$2.25",
      unit: "/head",
      discount: "20% off",
      farm: "Leafy Greens Co.",
      rating: 4.9,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      href: "/product/fresh-lettuce",
    },
    {
      id: 3,
      name: "Sweet Peppers",
      price: "$4.80",
      unit: "/lb",
      discount: "10% off",
      farm: "Pepper Paradise",
      rating: 4.7,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      href: "/product/sweet-peppers",
    },
    {
      id: 4,
      name: "Organic Carrots",
      price: "$1.95",
      unit: "/bunch",
      discount: "25% off",
      farm: "Root & Branch",
      rating: 4.6,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      href: "/product/organic-carrots",
    },
  ];

  // Editorial service blocks
  const serviceBlocks = [
    {
      icon: TruckIcon,
      title: "Logistics & Fulfillment",
      description: "Delivery scheduling and tracking tools.",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      href: "/logistics",
    },
    {
      icon: ChartBarIcon,
      title: "Government Insights",
      description: "Real-time dashboards for supply & demand.",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      href: "/insights",
    },
    {
      icon: ShieldCheckIcon,
      title: "Payments & Escrow",
      description: "Secure milestone-based payments.",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      href: "/payments",
    },
    {
      icon: CalendarDaysIcon,
      title: "Upcoming Harvests",
      description: "Pre-order supply before it's harvested.",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      href: "/harvests",
    },
  ];

  const searchCategories = ["All", "Produce", "Farms", "Logistics", "Insights"];
  const searchSuggestions = [
    "organic tomatoes",
    "leafy greens",
    "Caribbean farms",
    "export ready produce",
    "supply chain insights",
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Keyboard navigation for carousel
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        prevSlide();
      } else if (event.key === "ArrowRight") {
        nextSlide();
      } else if (event.key === "Escape") {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  // Scroll detection for sticky search bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const searchBarHeight = 200; // Approximate height where original search bar disappears
      setShowStickySearch(scrollY > searchBarHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  };

  // Reusable search bar component
  const renderSearchBar = (isSticky = false) => (
    <form
      role="search"
      aria-label="Search marketplace"
      onSubmit={(e) => {
        e.preventDefault();
        console.log("Search:", searchQuery, "Category:", selectedCategory);
      }}
    >
      <div
        className={`flex items-center bg-white rounded-full overflow-hidden transition-all duration-300 ${
          isSticky
            ? "border border-[var(--secondary-soft-highlight)]/30"
            : "border border-[var(--secondary-soft-highlight)]/20"
        }`}
      >
        <div className="relative">
          <button
            type="button"
            className="flex items-center px-6 py-4 text-base font-medium text-[var(--secondary-black)] hover:bg-[var(--primary-background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:ring-inset rounded-l-full transition-colors duration-200"
            onClick={() => setShowSearchDropdown(!showSearchDropdown)}
            aria-expanded={showSearchDropdown}
            aria-haspopup="listbox"
            aria-label={`Category: ${selectedCategory}`}
          >
            {selectedCategory}
            <ChevronDownIcon className="ml-3 h-5 w-5 text-[var(--secondary-muted-edge)]" />
          </button>
          {showSearchDropdown && (
            <div
              className="absolute top-full left-0 w-40 bg-white border border-[var(--secondary-soft-highlight)]/30 rounded-xl z-20 mt-2 backdrop-blur-sm"
              role="listbox"
              aria-label="Search categories"
            >
              <div className="py-2">
                {searchCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    role="option"
                    aria-selected={selectedCategory === cat}
                    className={`block w-full text-left px-4 py-3 text-sm font-medium transition-colors duration-200 focus:outline-none ${
                      selectedCategory === cat
                        ? "bg-[var(--primary-accent2)] text-white"
                        : "text-[var(--secondary-black)] hover:bg-[var(--primary-background)] hover:text-[var(--primary-accent2)]"
                    }`}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowSearchDropdown(false);
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="w-px h-8 bg-[var(--secondary-soft-highlight)]/30"></div>
        <input
          type="text"
          placeholder="Search produce, farms, or insights…"
          className="flex-1 px-6 py-4 text-base outline-none bg-transparent placeholder:text-[var(--secondary-muted-edge)] text-[var(--secondary-black)] focus:ring-0"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search query"
        />
        <button
          type="submit"
          className="p-4 m-1 bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent1)] focus:ring-offset-2 transition-all duration-200 group"
          aria-label="Submit search"
        >
          <MagnifyingGlassIcon className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
        </button>
      </div>
      {searchQuery && (
        <div
          className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border border-[var(--secondary-soft-highlight)]/30 rounded-xl z-20 mt-3"
          role="listbox"
          aria-label="Search suggestions"
        >
          <div className="p-6">
            <p className="text-sm font-medium text-[var(--secondary-muted-edge)] mb-4">
              Suggestions:
            </p>
            <div className="space-y-1">
              {searchSuggestions
                .filter((s) =>
                  s.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    role="option"
                    className="block w-full text-left px-4 py-3 text-base text-[var(--secondary-black)] hover:bg-[var(--primary-background)] hover:text-[var(--primary-accent2)] rounded-lg focus:outline-none focus:bg-[var(--primary-background)] transition-colors duration-200 font-medium"
                    onClick={() => setSearchQuery(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </form>
  );

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      {/* Top Notice Bar */}
      <div className="bg-[var(--secondary-muted-edge)] text-white text-center py-2 text-sm">
        Shipping updates and regional availability
      </div>

      {/* Render navigation based on user account type */}
      {user?.accountType === "buyer" ? (
        <BuyerTopNavigation />
      ) : user?.accountType === "seller" ? (
        <SellerTopNavigation />
      ) : (
        <TopNavigation />
      )}

      {/* Sticky Search Bar */}
      <div
        className={`fixed top-0 left-0 right-0 bg-white z-50 transition-transform duration-300 ${
          showStickySearch ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 py-4">
          <div className="relative max-w-2xl mx-auto">
            {renderSearchBar(true)}
          </div>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="bg-[var(--primary-background)] py-2">
        <div className="max-w-[1280px] mx-auto px-6 py-6">
          <div className="relative max-w-4xl mx-auto">
            {renderSearchBar(false)}
          </div>
        </div>
      </div>

      <main>
        {/* Hero Carousel */}
        <section
          className="py-6 px-6 relative"
          role="region"
          aria-label="Featured content carousel"
          aria-live="polite"
        >
          <div className="relative h-[60vh] overflow-hidden rounded-2xl">
            {heroSlides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden={index !== currentSlide}
              >
                <div className="relative h-full">
                  <Image
                    src={slide.image}
                    alt=""
                    fill
                    className="object-cover rounded-2xl"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent rounded-2xl" />
                  <div className="absolute inset-0 flex items-center">
                    <div className="max-w-[1280px] mx-auto px-12 w-full">
                      <div className="max-w-3xl text-white">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light mb-6 leading-[1.1] tracking-tight">
                          {slide.headline}
                        </h1>
                        <p className="text-xl md:text-2xl mb-10 opacity-90 font-light leading-relaxed max-w-2xl">
                          {slide.subcopy}
                        </p>
                        <Link
                          href={slide.cta.href}
                          className="inline-flex items-center bg-[var(--primary-accent2)] text-white px-8 py-4 rounded-full font-medium hover:bg-[var(--primary-accent3)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent1)] focus:ring-offset-2 focus:ring-offset-black/50 group"
                        >
                          {slide.cta.label}
                          <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Brand-styled Carousel Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-[var(--primary-accent2)]/90 hover:bg-[var(--primary-accent2)] text-white p-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent1)] focus:ring-offset-2 focus:ring-offset-black/50 backdrop-blur-sm"
              aria-label="Previous slide"
            >
              <ChevronLeftIcon className="h-6 w-6 stroke-2" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-[var(--primary-accent2)]/90 hover:bg-[var(--primary-accent2)] text-white p-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent1)] focus:ring-offset-2 focus:ring-offset-black/50 backdrop-blur-sm"
              aria-label="Next slide"
            >
              <ChevronRightIcon className="h-6 w-6 stroke-2" />
            </button>

            {/* Brand-styled Carousel Dots */}
            <div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3"
              role="tablist"
              aria-label="Carousel navigation"
            >
              {heroSlides.map((slide, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-8 h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent1)] focus:ring-offset-2 focus:ring-offset-black/50 ${
                    index === currentSlide
                      ? "bg-[var(--primary-accent2)]"
                      : "bg-[var(--primary-accent2)]/40 hover:bg-[var(--primary-accent2)]/60"
                  }`}
                  role="tab"
                  aria-selected={index === currentSlide}
                  aria-label={`Go to slide ${index + 1}: ${slide.headline}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Trust Strip */}
        <section className="bg-[var(--secondary-soft-highlight)]/20 py-6">
          <div className="max-w-[1280px] mx-auto px-6 text-center">
            <p className="text-[var(--secondary-black)] font-medium">
              Reliable sourcing, secure escrow, tracked deliveries.
              <Link
                href="/marketplace"
                className="ml-4 text-[var(--primary-accent2)] hover:underline"
              >
                Start now →
              </Link>
            </p>
          </div>
        </section>

        {/* Browse by Categories */}
        <section className="py-20" aria-labelledby="categories-heading">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="text-center mb-16">
              <h2
                id="categories-heading"
                className="text-3xl md:text-4xl font-light text-[var(--secondary-black)] mb-4 tracking-tight"
              >
                Browse by Categories
              </h2>
              <p className="text-lg text-[var(--secondary-muted-edge)] font-light">
                Discover fresh produce across the region
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="group focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:ring-offset-2 rounded-lg"
                    aria-label={`Browse ${category.name}`}
                  >
                    <div className="relative h-48 rounded-lg overflow-hidden">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <IconComponent className="h-8 w-8 mb-3 stroke-1" />
                        <h3 className="text-lg font-medium tracking-wide">
                          {category.name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Farms */}
        <section className="py-20 bg-white">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-light text-[var(--secondary-black)] mb-4 tracking-tight">
                Featured Farms & Cooperatives
              </h2>
              <p className="text-lg text-[var(--secondary-muted-edge)] font-light">
                Meet trusted suppliers across the region
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredFarms.map((farm) => (
                <Link
                  key={farm.name}
                  href={farm.href}
                  className="group focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:ring-offset-2 rounded-lg"
                >
                  <div className="relative h-64 rounded-lg overflow-hidden">
                    <Image
                      src={farm.image}
                      alt={farm.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center mb-2">
                        <BuildingStorefrontIcon className="h-5 w-5 mr-2 stroke-1" />
                        <h3 className="text-xl font-medium">{farm.name}</h3>
                      </div>
                      <div className="flex items-center mb-3">
                        <MapPinIcon className="h-4 w-4 mr-2 stroke-1" />
                        <p className="text-sm opacity-90">{farm.region}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {farm.certifications.slice(0, 2).map((cert) => (
                            <span
                              key={cert}
                              className="text-xs px-2 py-1 bg-white/20 rounded-full"
                            >
                              {cert}
                            </span>
                          ))}
                        </div>
                        <span className="text-sm font-medium">
                          {farm.listings} listings
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Statistics */}
        <section className="py-20 bg-[var(--primary-background)]">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Statistics Content */}
              <div>
                <h2 className="text-3xl md:text-4xl font-light text-[var(--secondary-black)] mb-6 tracking-tight">
                  Transforming Caribbean Agriculture
                </h2>
                <p className="text-lg text-[var(--secondary-muted-edge)] font-light mb-12 leading-relaxed">
                  Building connections across the region to strengthen food
                  security and economic growth.
                </p>

                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-light text-[var(--primary-accent2)] mb-2">
                      2,847
                    </div>
                    <p className="text-sm md:text-base font-medium text-[var(--secondary-black)] mb-1">
                      Active Farmers
                    </p>
                    <p className="text-xs md:text-sm text-[var(--secondary-muted-edge)]">
                      Across the Caribbean
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-light text-[var(--primary-accent2)] mb-2">
                      1,293
                    </div>
                    <p className="text-sm md:text-base font-medium text-[var(--secondary-black)] mb-1">
                      Partner Businesses
                    </p>
                    <p className="text-xs md:text-sm text-[var(--secondary-muted-edge)]">
                      Buyers & Suppliers
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-light text-[var(--primary-accent2)] mb-2">
                      $12.4M
                    </div>
                    <p className="text-sm md:text-base font-medium text-[var(--secondary-black)] mb-1">
                      Total Transactions
                    </p>
                    <p className="text-xs md:text-sm text-[var(--secondary-muted-edge)]">
                      This year
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-light text-[var(--primary-accent2)] mb-2">
                      15
                    </div>
                    <p className="text-sm md:text-base font-medium text-[var(--secondary-black)] mb-1">
                      Countries Served
                    </p>
                    <p className="text-xs md:text-sm text-[var(--secondary-muted-edge)]">
                      Regional coverage
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistics Image */}
              <div className="relative">
                <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
                  <Image
                    src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                    alt="Caribbean agriculture and farming"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-accent2)]/20 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* This Week's Highlights */}
        <section className="py-20" aria-labelledby="products-heading">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="text-center mb-16">
              <h2
                id="products-heading"
                className="text-3xl md:text-4xl font-light text-[var(--secondary-black)] mb-4 tracking-tight"
              >
                This Week's Highlights
              </h2>
              <p className="text-lg text-[var(--secondary-muted-edge)] font-light">
                Fresh inventory and seasonal deals
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={product.href}
                  className="group focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:ring-offset-2 rounded-lg"
                >
                  <div className="relative h-64 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.discount && (
                      <div className="absolute top-3 left-3 bg-[var(--primary-accent2)] text-white px-2 py-1 rounded-full text-xs font-medium">
                        {product.discount}
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center">
                      <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-xs font-medium">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium text-[var(--secondary-black)] group-hover:text-[var(--primary-accent2)] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-[var(--secondary-muted-edge)]">
                      {product.farm}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-[var(--secondary-black)]">
                        {product.price}
                        <span className="text-sm font-normal text-[var(--secondary-muted-edge)]">
                          {product.unit}
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Beyond the Marketplace - Editorial Service Blocks */}
        <section className="py-24 bg-white">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-light text-[var(--secondary-black)] mb-6 tracking-tight">
                Beyond the Marketplace
              </h2>
              <p className="text-xl text-[var(--secondary-muted-edge)] font-light max-w-3xl mx-auto">
                Infrastructure for a resilient regional food system
              </p>
            </div>

            <div className="space-y-24">
              {serviceBlocks.map((block, index) => {
                const IconComponent = block.icon;
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={block.title}
                    className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 ${
                      isEven ? "" : "lg:flex-row-reverse"
                    }`}
                  >
                    <div className="flex-1 space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-[var(--primary-accent2)] rounded-full flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-white stroke-1" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-light text-[var(--secondary-black)] tracking-tight">
                          {block.title}
                        </h3>
                      </div>
                      <p className="text-lg text-[var(--secondary-muted-edge)] font-light leading-relaxed">
                        {block.description}
                      </p>
                      <Link
                        href={block.href}
                        className="inline-flex items-center text-[var(--primary-accent2)] font-medium hover:text-[var(--primary-accent3)] transition-colors group"
                      >
                        Learn more
                        <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                    <div className="flex-1">
                      <div className="relative h-80 rounded-lg overflow-hidden">
                        <Image
                          src={block.image}
                          alt={block.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Full-width Editorial CTA */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
              alt=""
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
          </div>
          <div className="relative max-w-[1280px] mx-auto px-6 text-center text-white">
            <h2 className="text-4xl md:text-6xl font-light mb-8 tracking-tight leading-tight">
              Build a Resilient Regional Food System
            </h2>
            <p className="text-xl md:text-2xl font-light mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed">
              Connecting farms, buyers, and governments to strengthen the
              Caribbean food supply chain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="btn btn-primary inline-flex items-center text-white px-8 py-4 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:ring-offset-2 group"
              >
                Join Procur Today
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/mission"
                className="btn btn-secondary inline-flex items-center text-white px-8 py-4 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--secondary-muted-edge)] focus:ring-offset-2 group"
              >
                Learn About Our Mission
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section
          className="py-20 bg-gray-50"
          aria-labelledby="newsletter-heading"
        >
          <div className="max-w-[1280px] mx-auto px-6 text-center">
            <h2
              id="newsletter-heading"
              className="text-3xl md:text-4xl font-light text-[var(--secondary-black)] mb-4 tracking-tight"
            >
              Stay Informed
            </h2>
            <p className="text-lg text-[var(--secondary-muted-edge)] font-light mb-12 max-w-2xl mx-auto">
              Marketplace growth, logistics innovations, and insights.
            </p>
            <div className="max-w-lg mx-auto">
              <form
                className="flex gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  // Handle newsletter subscription
                }}
              >
                <input
                  type="email"
                  placeholder="Email address"
                  required
                  className="flex-[2] px-8 py-4 text-lg min-w-0 border border-[var(--secondary-soft-highlight)] rounded-full bg-white transition-all duration-200 focus:border-[var(--primary-base)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-base)]/20"
                  aria-label="Email address for newsletter"
                />
                <button
                  type="submit"
                  className="px-8 py-4 font-medium flex-shrink-0 bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)]/20"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-sm text-[var(--secondary-muted-edge)] mt-4 font-light">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
