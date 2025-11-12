"use client";

import React, { useState, useEffect, useRef } from "react";
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
  ArrowRightIcon,
  // Category icons
  CubeIcon,
  GlobeAltIcon,
  SparklesIcon,
  // Service icons
  TruckIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
  // Additional icons
  MapPinIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  const user = useAppSelector(selectAuthUser);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchBar, setActiveSearchBar] = useState<
    "sticky" | "global" | null
  >(null);
  const heroSearchRef = useRef<HTMLDivElement | null>(null);

  // Single hero (Alibaba-inspired)
  const hero = {
    headline: "Procure regional produce with local confidence",
    subcopy:
      "Bringing global supply to local demand—one‑stop procurement from sourcing to delivery.",
    image: "/images/backgrounds/markus-winkler-ye2SrYuqtWM-unsplash.jpg",
    cta: { label: "Explore Marketplace", href: "/marketplace" },
  };

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
    {
      name: "Coffee",
      icon: SparklesIcon,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      href: "/marketplace?cat=coffee",
    },
    {
      name: "Grains",
      icon: CubeIcon,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      href: "/marketplace?cat=grains",
    },
    {
      name: "Wheat",
      icon: CubeIcon,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      href: "/marketplace?cat=wheat",
    },
    {
      name: "Ground Provisions",
      icon: CubeIcon,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      href: "/marketplace?cat=ground-provisions",
    },
    {
      name: "Meat",
      icon: CheckBadgeIcon,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      href: "/marketplace?cat=meat",
    },
    {
      name: "Fish",
      icon: GlobeAltIcon,
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      href: "/marketplace?cat=fish",
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

  // (featured products removed in simplified homepage)

  // (blog data removed in simplified homepage)

  // (service blocks removed in simplified homepage)

  const searchSuggestions = [
    "organic tomatoes",
    "leafy greens",
    "Caribbean farms",
    "export ready produce",
    "supply chain insights",
  ];

  // How It Works: interactive steps and preview
  const howItWorksSteps = [
    {
      icon: MagnifyingGlassIcon,
      title: "Search for matches",
      badge: "Procur Search",
      overlayTitle: "Find products",
      overlayCta: "Search",
      image: "/images/backgrounds/markus-winkler-ye2SrYuqtWM-unsplash.jpg",
    },
    {
      icon: CheckBadgeIcon,
      title: "Identify the right one",
      badge: "Verified Suppliers",
      overlayTitle: "Compare suppliers",
      overlayCta: "Compare",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
    },
    {
      icon: ShieldCheckIcon,
      title: "Pay with confidence",
      badge: "Secure Escrow",
      overlayTitle: "Create escrow",
      overlayCta: "Continue",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
    },
    {
      icon: TruckIcon,
      title: "Fulfill with transparency",
      highlight: true,
      description:
        "Real‑time tracking and tailored logistics with trusted partners.",
      badge: "Procur Logistics",
      overlayTitle: "Book shipping rate",
      overlayCta: "Search",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
    },
    {
      icon: CalendarDaysIcon,
      title: "Manage with ease",
      badge: "Order Tracking",
      overlayTitle: "View timeline",
      overlayCta: "Open",
      image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
    },
  ];

  const [activeHowItWorksIdx, setActiveHowItWorksIdx] = useState(0);
  const activeHowItWorks = howItWorksSteps[activeHowItWorksIdx];

  // (carousel auto-advance removed)

  // Keyboard shortcuts not needed; keep escape behavior for dropdown via click-outside

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[role="search"]')) {
        setActiveSearchBar(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Observe the hero search bar to inform nav when it leaves viewport
  useEffect(() => {
    if (!heroSearchRef.current) return;
    const el = heroSearchRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const inView = entry.isIntersecting;
        window.dispatchEvent(
          new CustomEvent<boolean>("procur:heroSearchInView", {
            detail: inView,
          })
        );
      },
      {
        root: null,
        // Treat as out of view slightly before fully gone; accounts for nav height
        rootMargin: "-100px 0px 0px 0px",
        threshold: 0,
      }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // (sticky search behavior removed)

  // (carousel controls removed)

  // Reusable search bar component
  const renderSearchBar = (isSticky = false) => {
    const instance: "sticky" | "global" = isSticky ? "sticky" : "global";

    return (
      <form
        role="search"
        aria-label="Search marketplace"
        onSubmit={(e) => {
          e.preventDefault();
          console.log("Search:", searchQuery);
        }}
      >
        <div
          className={`flex items-center bg-white rounded-full transition-all duration-300 ${
            isSticky
              ? "border border-[var(--secondary-soft-highlight)]/30"
              : "border border-[var(--secondary-soft-highlight)]/20"
          }`}
        >
          <input
            type="text"
            placeholder="Search produce, farms, or insights…"
            className="flex-1 px-6 py-4 text-base outline-none bg-transparent placeholder:text-[var(--secondary-muted-edge)] text-[var(--secondary-black)] focus:ring-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setActiveSearchBar(instance)}
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
        {activeSearchBar === instance && searchQuery && (
          <div
            className="absolute top-full left-0 right-0 bg-white border border-[var(--secondary-soft-highlight)]/30 rounded-xl shadow-lg z-20 mt-3"
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
                      aria-selected={false}
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
  };

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

      {/* (sticky and global search bars removed; search moved into hero) */}

      <main>
        {/* Hero (Alibaba-inspired, single panel) */}
        <section className="py-6 px-4 sm:px-6 relative" aria-label="Hero">
          <div className="relative h-[60vh] md:h-[70vh] overflow-hidden rounded-2xl">
            <Image
              src={hero.image}
              alt=""
              fill
              className="object-cover rounded-2xl"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent rounded-2xl" />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-[1280px] mx-auto px-6 sm:px-12 w-full">
                <div className="text-white max-w-3xl">
                  <div className="flex items-center text-white/85 mb-3 gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[var(--primary-accent2)]"></span>
                    <span className="text-sm">Learn about Procur</span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight text-balance">
                    {hero.headline}
                  </h1>
                  <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-white/90 text-pretty">
                    {hero.subcopy}
                  </p>
                  <div className="mt-5 sm:mt-6 max-w-3xl" ref={heroSearchRef}>
                    {renderSearchBar(false)}
                  </div>
                  <div className="mt-4 sm:mt-6">
                    <Link
                      href={hero.cta.href}
                      className="inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-[var(--primary-accent2)] text-white px-5 py-3 text-sm sm:text-base font-medium hover:bg-[var(--primary-accent3)]"
                    >
                      {hero.cta.label}
                    </Link>
                  </div>
                  <div className="mt-3 hidden sm:flex flex-wrap gap-2 items-center">
                    <span className="text-white/70 text-sm mr-1">
                      Frequently searched:
                    </span>
                    {searchSuggestions.slice(0, 5).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSearchQuery(s)}
                        className="px-3 py-1.5 rounded-full text-sm bg-white text-[var(--secondary-black)] ring-1 ring-black/10 hover:bg-[var(--primary-background)] transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
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
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-6 justify-items-center">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="group focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:ring-offset-2 rounded-full"
                    aria-label={`Browse ${category.name}`}
                  >
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full ring-1 ring-[var(--secondary-soft-highlight)]/50 bg-white flex flex-col items-center justify-center text-center px-3 transition-colors duration-200 group-hover:bg-[var(--primary-background)] group-hover:ring-[var(--primary-accent2)]/40">
                      <IconComponent className="h-7 w-7 sm:h-8 sm:w-8 text-[var(--secondary-black)] group-hover:text-[var(--primary-accent2)]" />
                      <span className="mt-2 text-xs sm:text-sm font-medium text-[var(--secondary-black)] leading-snug">
                        {category.name}
                      </span>
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
                Trusted suppliers in your region
              </h2>
              <p className="text-lg text-[var(--secondary-muted-edge)] font-light">
                Bringing a trusted network of regional suppliers to your loading
                dock — all in one app
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Large feature on the left */}
              {featuredFarms[0] && (
                <Link
                  href={featuredFarms[0].href}
                  className="group relative lg:col-span-7 lg:row-span-2 rounded-2xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:ring-offset-2"
                  aria-label={`View profile: ${featuredFarms[0].name}`}
                >
                  <Image
                    src={featuredFarms[0].image}
                    alt={featuredFarms[0].name}
                    fill
                    sizes="(min-width: 1280px) 60vw, (min-width: 1024px) 58vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-end">
                    <div className="p-6 md:p-8 text-white">
                      <div className="text-xs font-semibold uppercase tracking-wider text-white/90">
                        Featured supplier
                      </div>
                      <h3 className="mt-2 text-2xl md:text-4xl font-semibold leading-tight">
                        {featuredFarms[0].name}
                      </h3>
                      <div className="mt-3 flex items-center text-sm text-white/90">
                        <MapPinIcon className="h-4 w-4 mr-1 stroke-1" />
                        {featuredFarms[0].region}
                        <span className="ml-3 inline-block text-white/90">
                          {featuredFarms[0].listings} listings
                        </span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {featuredFarms[0].certifications.map((cert) => (
                          <span
                            key={cert}
                            className="text-xs px-2.5 py-1 rounded-full bg-white text-[var(--secondary-black)] border border-white/20"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Right column stacked */}
              <div className="lg:col-span-5 grid gap-6">
                {featuredFarms[1] && (
                  <Link
                    href={featuredFarms[1].href}
                    className="group rounded-2xl border border-gray-200 bg-[var(--primary-background)] p-6 md:p-8 flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:ring-offset-2"
                    aria-label={`View profile: ${featuredFarms[1].name}`}
                  >
                    <div className="text-[var(--secondary-muted-edge)] text-xs font-semibold uppercase tracking-wider">
                      Featured cooperative
                    </div>
                    <h3 className="mt-2 text-2xl md:text-3xl font-semibold text-[var(--secondary-black)] group-hover:underline">
                      {featuredFarms[1].name}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--secondary-muted-edge)]">
                      <span className="inline-flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1 stroke-1" />
                        {featuredFarms[1].region}
                      </span>
                      <span className="ml-3 text-[var(--secondary-black)]/80 font-medium">
                        {featuredFarms[1].listings} listings
                      </span>
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {featuredFarms[1].certifications.map((cert) => (
                        <span
                          key={cert}
                          className="text-xs px-2.5 py-1 rounded-full border border-gray-200 text-[var(--secondary-black)]/80"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </Link>
                )}

                {featuredFarms[2] && (
                  <Link
                    href={featuredFarms[2].href}
                    className="group relative rounded-2xl overflow-hidden h-64 md:h-80 focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:ring-offset-2"
                    aria-label={`View profile: ${featuredFarms[2].name}`}
                  >
                    <Image
                      src={featuredFarms[2].image}
                      alt={featuredFarms[2].name}
                      fill
                      sizes="(min-width: 1280px) 38vw, (min-width: 1024px) 40vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute inset-0 flex items-end">
                      <div className="p-6 md:p-8 text-white">
                        <div className="text-xs font-semibold uppercase tracking-wider text-white/90">
                          Featured farm
                        </div>
                        <h3 className="mt-2 text-2xl font-semibold leading-tight">
                          {featuredFarms[2].name}
                        </h3>
                        <div className="mt-2 text-sm text-white/90 inline-flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1 stroke-1" />
                          {featuredFarms[2].region}
                        </div>
                      </div>
                    </div>
                  </Link>
                )}
              </div>

              {/* Remaining items */}
              {featuredFarms.slice(3).length > 0 && (
                <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredFarms.slice(3).map((farm) => (
                    <Link
                      key={farm.name}
                      href={farm.href}
                      className="group rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:ring-offset-2"
                      aria-label={`View profile: ${farm.name}`}
                    >
                      <div className="relative w-full aspect-[16/10] bg-gray-100">
                        <Image
                          src={farm.image}
                          alt={farm.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-[var(--secondary-black)] group-hover:underline">
                          {farm.name}
                        </h3>
                        <div className="mt-2 flex items-center justify-between text-sm text-[var(--secondary-muted-edge)]">
                          <span className="inline-flex items-center">
                            <MapPinIcon className="h-4 w-4 mr-1 stroke-1" />
                            {farm.region}
                          </span>
                          <span className="font-medium text-[var(--secondary-black)]/80">
                            {farm.listings} listings
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Procure with Confidence */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/backgrounds/nao-takabayashi-TlzyJStoITg-unsplash.jpg"
              alt=""
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
          </div>
          <div className="relative max-w-[1280px] mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight max-w-4xl">
              Procure with confidence — from production quality to purchase
              protection
            </h2>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {/* Verified Supplier card */}
              <div className="rounded-2xl bg-white border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <CheckBadgeIcon className="h-8 w-8 text-[var(--primary-accent2)]" />
                  <p className="text-2xl md:text-3xl font-semibold text-[var(--secondary-black)]">
                    Verified Supplier
                  </p>
                </div>
                <p className="mt-4 text-[var(--secondary-black)]/80 leading-relaxed">
                  Connect with suppliers validated by third‑party checks for
                  credentials and capabilities. Look for the
                  &quot;Verified&quot; badge to start sourcing with confidence.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/learn/verified-supplier"
                    className="inline-flex items-center rounded-full px-4 py-2 bg-white text-[var(--secondary-black)] ring-1 ring-black/10 hover:bg-[var(--primary-background)]"
                  >
                    Watch video
                  </Link>
                  <Link
                    href="/learn/verified-supplier"
                    className="inline-flex items-center rounded-full px-4 py-2 bg-transparent text-white ring-1 ring-white/40 hover:bg-white hover:text-[var(--secondary-black)]"
                  >
                    Learn more
                  </Link>
                </div>
              </div>

              {/* Purchase Assurance card */}
              <div className="rounded-2xl bg-white border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="h-8 w-8 text-[var(--primary-accent2)]" />
                  <p className="text-2xl md:text-3xl font-semibold text-[var(--secondary-black)]">
                    Purchase Assurance
                  </p>
                </div>
                <p className="mt-4 text-[var(--secondary-black)]/80 leading-relaxed">
                  Source confidently with secure payment options, shipment
                  protection, and support for any purchase‑related issues when
                  you order through Procur.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/learn/trade-assurance"
                    className="inline-flex items-center rounded-full px-4 py-2 bg-white text-[var(--secondary-black)] ring-1 ring-black/10 hover:bg-[var(--primary-background)]"
                  >
                    Watch video
                  </Link>
                  <Link
                    href="/learn/trade-assurance"
                    className="inline-flex items-center rounded-full px-4 py-2 bg-transparent text-white ring-1 ring-white/40 hover:bg-white hover:text-[var(--secondary-black)]"
                  >
                    Learn more
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Alibaba-inspired explainer */}
        <section className="py-20 bg-white">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left - Steps */}
              <div>
                <h2 className="text-3xl md:text-4xl font-light text-[var(--secondary-black)] mb-8 tracking-tight">
                  Streamline ordering from search to fulfillment, all in one
                  place
                </h2>

                <ol className="relative">
                  {howItWorksSteps.map((step, index, arr) => {
                    const IconComp = step.icon;
                    const isLast = index === arr.length - 1;
                    const isActive = activeHowItWorksIdx === index;
                    return (
                      <li
                        key={step.title}
                        className="relative pl-16 pb-8 last:pb-0 cursor-pointer select-none"
                        onMouseEnter={() => setActiveHowItWorksIdx(index)}
                        onFocus={() => setActiveHowItWorksIdx(index)}
                        onClick={() => setActiveHowItWorksIdx(index)}
                        role="button"
                        aria-pressed={isActive}
                      >
                        {!isLast && (
                          <span
                            className="absolute left-6 top-10 h-full w-px bg-gray-200"
                            aria-hidden
                          ></span>
                        )}
                        <span
                          className={`absolute left-0 top-1 flex h-12 w-12 items-center justify-center rounded-full ring-1 ${
                            step.highlight || isActive
                              ? "bg-[var(--primary-accent2)]/10 ring-[var(--primary-accent2)]/30"
                              : "bg-gray-50 ring-gray-200"
                          }`}
                        >
                          <IconComp
                            className={`h-6 w-6 ${
                              step.highlight || isActive
                                ? "text-[var(--primary-accent2)]"
                                : "text-gray-500"
                            }`}
                          />
                        </span>
                        <div>
                          <p
                            className={`text-xl md:text-2xl font-medium ${
                              step.highlight || isActive
                                ? "text-[var(--primary-accent2)]"
                                : "text-[var(--secondary-black)]"
                            }`}
                          >
                            {step.title}
                          </p>
                          {step.description && isActive && (
                            <p className="mt-3 text-[var(--secondary-muted-edge)]">
                              {step.description}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* Right - Visual card */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-sm">
                  <div className="relative h-80 md:h-[420px]">
                    <Image
                      src={activeHowItWorks.image}
                      alt={activeHowItWorks.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Floating badge */}
                  <div className="absolute left-4 top-4 bg-black/70 text-white px-4 py-2 rounded-xl text-sm shadow">
                    {activeHowItWorks.badge}
                  </div>
                  {/* Overlay card */}
                  <div className="absolute right-4 bottom-4 bg-white rounded-xl border border-gray-200 w-[260px] p-4 shadow">
                    <div className="text-sm font-semibold text-gray-800 mb-2">
                      {activeHowItWorks.overlayTitle}
                    </div>
                    <div className="space-y-2">
                      <div className="h-8 rounded-md border border-gray-200/70 bg-gray-50" />
                      <div className="h-8 rounded-md border border-gray-200/70 bg-gray-50" />
                      <div className="h-8 rounded-md border border-gray-200/70 bg-gray-50" />
                      <button className="w-full h-9 rounded-md bg-[var(--primary-accent2)] text-white text-sm font-medium">
                        {activeHowItWorks.overlayCta}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Full-width Editorial CTA */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/backgrounds/nao-takabayashi-TlzyJStoITg-unsplash.jpg"
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
            <p className="text-xl md:text-2xl font-light opacity-90 max-w-4xl mx-auto leading-relaxed">
              Empowering buyers with a trusted network that brings global supply
              to local demand — transparent procurement, stronger food security,
              and less waste.
            </p>
            <p className="text-lg md:text-xl font-light mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed mt-6">
              Suppliers: join a trusted cross‑border network to reach buyers who
              want a local touch — your market‑channel access partner for the
              last mile.
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
                href="/signup"
                className="btn btn-secondary inline-flex items-center text-white px-8 py-4 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--secondary-muted-edge)] focus:ring-offset-2 group"
              >
                Become a Supplier
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* (newsletter removed for a cleaner homepage) */}
      </main>

      <Footer />
    </div>
  );
}
