"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TopNavigation from "@/components/navigation/TopNavigation";
import BuyerTopNavigation from "@/components/navigation/BuyerTopNavigation";
import SellerTopNavigation from "@/components/navigation/SellerTopNavigation";
import Footer from "@/components/footer/Footer";
import { useAppSelector } from "@/store";
import { selectAuthUser } from "@/store/slices/authSlice";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import {
  CheckBadgeIcon,
  MapPinIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { getApiClient } from "@/lib/apiClient";
import ProcurLoader from "@/components/ProcurLoader";
import SupplierAvatar from "@/components/buyer/SupplierAvatar";

type HomeMarketplaceSeller = {
  id: string;
  name: string;
  logo_url?: string | null;
  location?: string | null;
  average_rating?: number | null;
  review_count?: number | null;
  completed_orders?: number | null;
  is_verified?: boolean | null;
};

type HomeMarketplaceProduct = {
  id: string;
  name: string;
  category: string;
  current_price: number;
  average_rating?: number | null;
  image_url?: string | null;
  tags?: string[];
  seller: HomeMarketplaceSeller;
};

function createCountrySlug(country?: string | null): string {
  if (!country) return "caribbean";
  return country.toLowerCase().replace(/\s+/g, "-");
}

function createProductSlug(name: string, id: string): string {
  return `${name.toLowerCase().replace(/\s+/g, "-")}-${id}`;
}

function hashStringToSeed(input: string): number {
  // Simple, deterministic hash -> uint32
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function Home() {
  const user = useAppSelector(selectAuthUser);

  const hero = {
    headline: "Buy fresh produce from trusted Grenada suppliers.",
    subcopy:
      "Browse live listings, discover reliable farms, and source with confidence.",
    supportingText:
      "Explore featured sellers and products, then sign up to order, message suppliers, and manage repeat purchasing.",
    image: "/images/backgrounds/jacopo-maiarelli--gOUx23DNks-unsplash (1).jpg",
  };

  const [marketplaceProducts, setMarketplaceProducts] = useState<
    HomeMarketplaceProduct[]
  >([]);
  const [marketplaceLoading, setMarketplaceLoading] = useState<boolean>(true);
  const [marketplaceProductTotal, setMarketplaceProductTotal] =
    useState<number>(0);
  const [marketplaceSellerTotal, setMarketplaceSellerTotal] =
    useState<number>(0);
  const [marketplaceVerifiedSellerTotal, setMarketplaceVerifiedSellerTotal] =
    useState<number>(0);

  // How-it-works stepper (animated journey)
  const howItWorksRef = useRef<HTMLElement | null>(null);
  const [howItWorksInView, setHowItWorksInView] = useState(false);
  const [activeHowStep, setActiveHowStep] = useState(0);
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  }, []);

  const howSteps = useMemo(
    () => [
      {
        title: "Discover",
        description:
          "Browse the marketplace, compare products, and find sellers that match your quality, pricing, and reliability needs.",
      },
      {
        title: "Connect",
        description:
          "Message suppliers, confirm availability, and align on volumes, delivery windows, and expectations.",
      },
      {
        title: "Buy & repeat",
        description:
          "Place orders, track fulfillment, and build reliable supply relationships over time.",
      },
    ],
    []
  );

  // Seed randomness daily so featured results feel fresh but not jittery.
  const featuredSeed = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const who = user?.accountType ? `:${user.accountType}` : "";
    return hashStringToSeed(`home-featured:${today}${who}`);
  }, [user?.accountType]);

  const featured = useMemo(() => {
    const rand = mulberry32(featuredSeed);

    const scoredProducts = marketplaceProducts.map((p) => {
      const volume = Number(p.seller.completed_orders ?? 0);
      const score = volume * 1000 + rand();
      return { p, score };
    });

    const featuredProducts = scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((x) => x.p);

    const sellersMap = new Map<string, HomeMarketplaceSeller>();
    for (const p of marketplaceProducts) {
      if (p.seller?.id) sellersMap.set(p.seller.id, p.seller);
    }

    const scoredSellers = Array.from(sellersMap.values()).map((s) => {
      const volume = Number(s.completed_orders ?? 0);
      const score = volume * 1000 + rand();
      return { s, score };
    });

    const featuredSellers = scoredSellers
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((x) => x.s);

    return { featuredProducts, featuredSellers };
  }, [featuredSeed, marketplaceProducts]);

  useEffect(() => {
    let cancelled = false;
    const api = getApiClient(() => null);

    const load = async () => {
      setMarketplaceLoading(true);
      try {
        const [productsRes, sellersRes, verifiedSellersRes] = await Promise.all([
          api.get("/marketplace/products", {
            params: {
              in_stock: true,
              limit: 100,
              sort_by: "created_at",
              sort_order: "desc",
              location: "Grenada",
            },
          }),
          api.get("/marketplace/sellers", {
            params: {
              limit: 1,
              page: 1,
              location: "Grenada",
            },
          }),
          api.get("/marketplace/sellers", {
            params: {
              limit: 1,
              page: 1,
              location: "Grenada",
              is_verified: true,
            },
          }),
        ]);

        const productsData = productsRes?.data;
        const sellersData = sellersRes?.data;
        const verifiedSellersData = verifiedSellersRes?.data;

        if (!cancelled) {
          setMarketplaceProductTotal(
            typeof productsData?.total === "number" ? productsData.total : 0
          );
          setMarketplaceSellerTotal(
            typeof sellersData?.total === "number" ? sellersData.total : 0
          );
          setMarketplaceVerifiedSellerTotal(
            typeof verifiedSellersData?.total === "number"
              ? verifiedSellersData.total
              : 0
          );
        }

        const productsFromApi = (productsData?.products ?? []) as any[];
        if (!cancelled && Array.isArray(productsFromApi)) {
          const mapped: HomeMarketplaceProduct[] = productsFromApi.map((p) => ({
            id: String(p.id),
            name: p.name,
            category: p.category,
            current_price:
              typeof p.current_price === "number" ? p.current_price : 0,
            average_rating:
              typeof p.average_rating === "number" ? p.average_rating : null,
            image_url: p.image_url ?? null,
            tags: Array.isArray(p.tags) ? p.tags : [],
            seller: {
              id: String(p.seller?.id ?? ""),
              name: p.seller?.name ?? "Seller",
              logo_url: p.seller?.logo_url ?? null,
              location: p.seller?.location ?? null,
              average_rating:
                typeof p.seller?.average_rating === "number"
                  ? p.seller.average_rating
                  : null,
              review_count:
                typeof p.seller?.review_count === "number"
                  ? p.seller.review_count
                  : null,
              completed_orders:
                typeof p.seller?.completed_orders === "number"
                  ? p.seller.completed_orders
                  : null,
              is_verified:
                typeof p.seller?.is_verified === "boolean"
                  ? p.seller.is_verified
                  : null,
            },
          }));
          setMarketplaceProducts(mapped);
        }
      } catch (e) {
        // Home should still render if marketplace API is down.
        if (!cancelled) {
          setMarketplaceProducts([]);
          setMarketplaceProductTotal(0);
          setMarketplaceSellerTotal(0);
          setMarketplaceVerifiedSellerTotal(0);
        }
      } finally {
        if (!cancelled) setMarketplaceLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const el = howItWorksRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setHowItWorksInView(entry.isIntersecting);
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!howItWorksInView) return;
    if (prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveHowStep((prev) => (prev + 1) % howSteps.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [howItWorksInView, howSteps.length, prefersReducedMotion]);

  const marketplaceCategoryCount = useMemo(() => {
    return new Set(marketplaceProducts.map((p) => p.category).filter(Boolean))
      .size;
  }, [marketplaceProducts]);

  const heroCtas = useMemo(() => {
    if (user?.accountType === "buyer") {
      return {
        primary: { label: "Buy Fresh Produce", href: "/buyer" },
        secondary: { label: "Explore Public Marketplace", href: "/marketplace" },
      };
    }
    if (user?.accountType === "seller") {
      return {
        primary: { label: "Manage My Store", href: "/seller" },
        secondary: { label: "View Marketplace", href: "/marketplace" },
      };
    }
    return {
      primary: {
        label: "Buy Fresh Produce",
        href: "/marketplace",
      },
      secondary: {
        label: "Become a Supplier",
        href: "/signup?accountType=seller&step=business",
      },
    };
  }, [user?.accountType]);

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      {/* Top Notice Bar */}
      <div className="bg-[var(--secondary-muted-edge)] text-white text-center py-2 text-sm">
        Procur Marketplace is live in Grenada — discover fresh produce and
        trusted suppliers.
      </div>

      {/* Keep existing navigation */}
      {user?.accountType === "buyer" ? (
        <BuyerTopNavigation />
      ) : user?.accountType === "seller" ? (
        <SellerTopNavigation />
      ) : (
        <TopNavigation />
      )}

      <main>
        {/* Hero: large image + calm early access story */}
        <section
          className="py-4 sm:py-6 px-4 sm:px-6 relative"
          aria-label="Hero"
        >
          <div className="relative min-h-[420px] sm:min-h-[480px] md:h-[70vh] rounded-2xl">
            {/* Background image + gradient, safely clipped to rounded container */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <Image
                src={hero.image}
                alt="Regional producers and buyers working together"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/10" />
            </div>

            {/* Foreground content (not clipped on small screens) */}
            <div className="relative z-10 flex h-full items-center">
              <div className="max-w-[1280px] mx-auto px-6 sm:px-12 w-full py-10 sm:py-14">
                <div className="text-white max-w-3xl space-y-3 sm:space-y-4">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-balance">
                    {hero.headline}
                  </h1>
                  <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-white/95 text-pretty font-medium">
                    {hero.subcopy}
                  </p>
                  <p className="mt-4 text-sm sm:text-base md:text-lg text-white/90 max-w-2xl">
                    {hero.supportingText}
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Link
                      href={heroCtas.primary.href}
                      className="inline-flex items-center justify-center rounded-full bg-[var(--primary-accent2)] text-white px-6 py-3 text-sm sm:text-base font-medium hover:bg-[var(--primary-accent3)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:ring-offset-2 focus:ring-offset-[var(--primary-background)] transition"
                    >
                      {heroCtas.primary.label}
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                      href={heroCtas.secondary.href}
                      className="inline-flex items-center justify-center rounded-full bg-white/5 text-white px-6 py-3 text-sm sm:text-base font-medium border border-white/20 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-[var(--primary-background)] transition"
                    >
                      {heroCtas.secondary.label}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust strip: calm, values-based */}
        <section className="bg-[var(--secondary-soft-highlight)]/15 py-6">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm sm:text-base text-[var(--secondary-muted-edge)] justify-start sm:justify-center">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--secondary-muted-edge)]" />
                Live listings • Grenada
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--secondary-muted-edge)]" />
                Region-first approach
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--secondary-muted-edge)]" />
                Verified suppliers & transparent sourcing
              </span>
            </div>
          </div>
        </section>

        {/* Featured sellers + featured products */}
        <section className="py-14 sm:py-16 bg-white border-t border-[var(--secondary-soft-highlight)]/40">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--secondary-black)] tracking-tight">
                  Featured sellers in Grenada
                </h2>
              </div>
              <Link
                href="/marketplace"
                className="text-sm font-medium text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)]"
              >
                Explore marketplace →
              </Link>
            </div>

            {marketplaceLoading && (
              <div className="py-8">
                <ProcurLoader size="sm" text="Loading featured sellers..." />
              </div>
            )}

            {!marketplaceLoading && featured.featuredSellers.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {featured.featuredSellers.slice(0, 8).map((s) => (
                  <Link
                    key={s.id}
                    href={`/sellers/${s.id}`}
                    className="group rounded-2xl border border-black/5 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] hover:shadow-[0_18px_44px_rgba(15,23,42,0.10)] hover:border-[var(--primary-accent2)]/40 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <SupplierAvatar
                        name={s.name}
                        imageUrl={s.logo_url}
                        size="md"
                        className="ring-1 ring-black/10"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-[var(--secondary-black)] leading-tight line-clamp-2 group-hover:text-[var(--primary-accent2)] transition-colors">
                            {s.name}
                          </h3>
                          {s.is_verified && (
                            <CheckBadgeIcon className="h-5 w-5 text-[var(--primary-accent2)] flex-shrink-0" />
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--secondary-muted-edge)]">
                          <span className="inline-flex items-center gap-1">
                            <MapPinIcon className="h-4 w-4" />
                            {s.location || "Grenada"}
                          </span>
                          {typeof s.average_rating === "number" &&
                            s.average_rating > 0 && (
                              <span className="inline-flex items-center gap-1">
                                <StarIconSolid className="h-4 w-4 text-yellow-400" />
                                <span className="font-medium text-[var(--secondary-black)]">
                                  {s.average_rating.toFixed(1)}
                                </span>
                                {typeof s.review_count === "number" &&
                                  s.review_count > 0 && (
                                    <span className="text-[var(--secondary-muted-edge)]">
                                      ({s.review_count})
                                    </span>
                                  )}
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!marketplaceLoading && featured.featuredSellers.length === 0 && (
              <div className="text-sm text-[var(--secondary-muted-edge)] py-8 rounded-2xl border border-dashed border-[var(--secondary-soft-highlight)]/60 px-4">
                No featured sellers yet — check back soon.
              </div>
            )}

            <div className="mt-14 sm:mt-16 flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--secondary-black)] tracking-tight">
                  Featured products
            </h2>
                <p className="mt-2 text-[var(--secondary-muted-edge)] text-sm sm:text-base">
                  Popular items from active sellers in Grenada.
                </p>
              </div>
              <Link
                href="/marketplace"
                className="text-sm font-medium text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)]"
              >
                Shop all →
              </Link>
            </div>

            {marketplaceLoading && (
              <div className="py-8">
                <ProcurLoader size="sm" text="Loading featured products..." />
              </div>
            )}

            {!marketplaceLoading && featured.featuredProducts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featured.featuredProducts.slice(0, 8).map((p) => {
                  const countrySlug = createCountrySlug(p.seller.location);
                  const productSlug = createProductSlug(p.name, p.id);
                  const productHref = `/products/${countrySlug}/${productSlug}`;
                  const image =
                    p.image_url ||
                    "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg";

                  return (
                    <Link
                      key={p.id}
                      href={productHref}
                      className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/60 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="relative h-44">
                        <Image
                          src={image}
                          alt={p.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-[var(--secondary-black)] mb-1 group-hover:text-[var(--primary-accent2)] transition-colors line-clamp-2">
                          {p.name}
                        </h3>

                        <div className="flex items-center gap-2 mb-2">
                          <SupplierAvatar
                            name={p.seller.name}
                            imageUrl={p.seller.logo_url}
                            size="xs"
                            className="ring-1 ring-black/5"
                          />
                          <span className="text-xs text-[var(--secondary-muted-edge)] line-clamp-1">
                            {p.seller.name}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3 mb-2">
                          <span className="text-lg font-bold text-[var(--secondary-black)]">
                            ${p.current_price.toFixed(2)}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-[var(--secondary-muted-edge)]">
                            <MapPinIcon className="h-4 w-4" />
                            {p.seller.location || "Grenada"}
                </span>
                        </div>

                        <div className="flex items-center gap-1 text-sm">
                          <StarIconSolid className="h-4 w-4 text-yellow-400" />
                          <span className="font-medium text-[var(--secondary-black)]">
                            {(p.average_rating ?? 0).toFixed(1)}
                </span>
                          <span className="text-xs text-[var(--secondary-muted-edge)]">
                            • {p.category}
                </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {!marketplaceLoading && featured.featuredProducts.length === 0 && (
              <div className="text-sm text-[var(--secondary-muted-edge)] py-8 rounded-2xl border border-dashed border-[var(--secondary-soft-highlight)]/60 px-4">
                No featured products yet — check back soon.
              </div>
            )}
          </div>
        </section>

        {/* Live stats */}
        <section className="py-14 sm:py-16 bg-white border-t border-[var(--secondary-soft-highlight)]/40">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--secondary-black)] tracking-tight">
                  Live marketplace stats (Grenada)
            </h2>
                <p className="mt-2 text-[var(--secondary-muted-edge)] text-sm sm:text-base">
                  A quick snapshot of what&apos;s available right now.
                </p>
              </div>
              <Link
                href="/marketplace"
                className="text-sm font-medium text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)]"
              >
                Browse listings →
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "Active products",
                  value:
                    marketplaceProductTotal > 0
                      ? marketplaceProductTotal.toLocaleString()
                      : marketplaceProducts.length.toLocaleString(),
                },
                {
                  label: "Active sellers",
                  value: marketplaceSellerTotal.toLocaleString(),
                },
                {
                  label: "Verified sellers",
                  value: marketplaceVerifiedSellerTotal.toLocaleString(),
                },
                {
                  label: "Categories",
                  value: marketplaceCategoryCount.toLocaleString(),
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)]"
                >
                  <div className="text-2xl sm:text-3xl font-semibold text-[var(--secondary-black)] tracking-tight">
                    {marketplaceLoading ? "—" : s.value}
                  </div>
                  <div className="mt-1 text-xs sm:text-sm text-[var(--secondary-muted-edge)]">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-14 sm:py-16 bg-[var(--primary-background)] border-t border-[var(--secondary-soft-highlight)]/40">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--secondary-black)] tracking-tight">
                  What farmers say about Procur
                </h2>
                <p className="mt-2 text-[var(--secondary-muted-edge)] text-sm sm:text-base">
                  Feedback from suppliers using Procur to showcase inventory and
                  win repeat buyers.
                </p>
              </div>
              <Link
                href="/signup?accountType=seller&step=business"
                className="text-sm font-medium text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)]"
              >
                Become a supplier →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote:
                    "Greeting unto all , I'm very pleased to be working with this procurement platform excellent venture , accessing , collecting and delivering far more convient for farmers , excelent service . Keep on procuring .. .",
                  name: "Jude Durham",
                  org: "Samaritan Farm",
                },
              ].map((t, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.06)]"
                >
                  <div className="text-sm sm:text-base text-[var(--secondary-black)]/90 leading-relaxed">
                    “{t.quote}”
                  </div>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--primary-accent2)]/10 flex items-center justify-center text-sm font-semibold text-[var(--primary-accent2)]">
                      {String(t.name || "F").trim().charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[var(--secondary-black)]">
                        {t.name}
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)]">
                        {t.org}
              </div>
              </div>
              </div>
              </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="py-16 sm:py-20 bg-white border-t border-[var(--secondary-soft-highlight)]/40"
          ref={(node) => {
            howItWorksRef.current = node;
          }}
        >
          <div className="max-w-[960px] mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-light text-[var(--secondary-black)] tracking-tight">
              How Procur works
            </h2>
            <p className="mt-4 text-[var(--secondary-muted-edge)] text-base sm:text-lg leading-relaxed">
              A clear, intentional workflow to help buyers and suppliers trade
              reliably — from discovery to repeat orders.
            </p>

            {/* One-line stepper + animated journey */}
            <div className="mt-10">
              <div className="relative">
                {/* Track */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-black/5 rounded-full" />
                {/* Progress */}
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[var(--primary-accent2)] rounded-full transition-all duration-700 ease-out"
                  style={{
                    width:
                      howSteps.length <= 1
                        ? "0%"
                        : `${(activeHowStep / (howSteps.length - 1)) * 100}%`,
                  }}
                />

                <div className="relative grid grid-cols-3 gap-2">
                  {howSteps.map((step, idx) => {
                    const isActive = idx === activeHowStep;
                    const isDone = idx < activeHowStep;
                    return (
                      <button
                        key={step.title}
                        type="button"
                        onClick={() => setActiveHowStep(idx)}
                        className="group flex flex-col items-center text-left"
                        aria-current={isActive ? "step" : undefined}
                      >
                        <div
                          className={[
                            "relative flex items-center justify-center rounded-full",
                            "w-10 h-10 sm:w-11 sm:h-11",
                            "border",
                            isActive || isDone
                              ? "border-[var(--primary-accent2)] bg-[var(--primary-accent2)] text-white"
                              : "border-black/10 bg-white text-[var(--secondary-muted-edge)]",
                            "shadow-[0_10px_24px_rgba(15,23,42,0.10)]",
                            "transition-all duration-300",
                            "group-hover:scale-[1.03]",
                          ].join(" ")}
                        >
                          <span className="text-sm font-semibold">
                            {idx + 1}
                          </span>
                          {isActive && !prefersReducedMotion && (
                            <span className="absolute inset-0 rounded-full ring-8 ring-[var(--primary-accent2)]/10 animate-pulse" />
                          )}
                        </div>

                        <div className="mt-3 text-sm sm:text-base font-semibold text-[var(--secondary-black)]">
                          {step.title}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step detail (animated) */}
              <div className="mt-7 rounded-2xl border border-black/5 bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.07)]">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-[0.18em] text-[var(--secondary-muted-edge)]">
                      Step {activeHowStep + 1} of {howSteps.length}
                    </div>
                    <div
                      className={[
                        "mt-2 text-lg sm:text-xl font-semibold text-[var(--secondary-black)]",
                        "transition-all duration-500",
                      ].join(" ")}
                      key={`title-${activeHowStep}`}
                    >
                      {howSteps[activeHowStep]?.title}
                </div>
                    <div
                      className="mt-2 text-sm sm:text-base text-[var(--secondary-muted-edge)] leading-relaxed transition-all duration-500"
                      key={`desc-${activeHowStep}`}
                    >
                      {howSteps[activeHowStep]?.description}
                    </div>
                  </div>

                  {/* subtle "journey" chevron */}
                  <div className="hidden sm:flex items-center gap-2 text-[var(--secondary-muted-edge)]">
                    <span className="inline-block w-10 h-[2px] bg-black/5 rounded-full" />
                    <span className="text-xs">Journey</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Buyer testimonials */}
        <section className="py-14 sm:py-16 bg-[var(--primary-background)] border-t border-[var(--secondary-soft-highlight)]/40">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex items-end justify-between gap-4 mb-6">
                <div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--secondary-black)] tracking-tight">
                  What buyers say about Procur
                </h2>
                <p className="mt-2 text-[var(--secondary-muted-edge)] text-sm sm:text-base">
                  Trusted discovery, fast supplier connection, and reliable repeat
                  orders.
                  </p>
                </div>
              <Link
                href="/signup?accountType=buyer&step=business"
                className="text-sm font-medium text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)]"
              >
                Create a buyer account →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote:
                    "We received several products and were very pleased with the overall experience. Everything arrived in a timely manner, and the customer service was responsive and professional throughout the process. Communication was clear, and the service met our expectations. We would definitely recommend and look forward to ordering again.",
                  name: "Brown Girl Cafe",
                  org: "Buyer",
                },
              ].map((t, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.06)]"
                >
                  <div className="text-sm sm:text-base text-[var(--secondary-black)]/90 leading-relaxed">
                    “{t.quote}”
                  </div>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--primary-accent2)]/10 flex items-center justify-center text-sm font-semibold text-[var(--primary-accent2)]">
                      {String(t.name || "B").trim().charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[var(--secondary-black)]">
                        {t.name}
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)]">
                        {t.org}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
                </div>
          </div>
        </section>

        {/* End-cap CTA */}
        <section className="py-14 sm:py-16 border-t border-[var(--secondary-soft-highlight)]/40 bg-white">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-gradient-to-r from-[var(--primary-accent2)] to-[var(--primary-accent3)] text-white px-7 sm:px-10 py-10 sm:py-12 shadow-[0_18px_44px_rgba(15,23,42,0.10)]">
              <div className="max-w-3xl">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
                  Ready to buy fresh produce in Grenada?
              </h2>
                <p className="mt-3 text-sm sm:text-base text-white/90 leading-relaxed">
                  Explore live listings, connect directly with suppliers, and
                  place repeat orders with confidence.
                </p>
              </div>

              <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:items-center">
                <Link
                  href={
                    user?.accountType === "buyer"
                      ? "/buyer"
                      : user?.accountType === "seller"
                        ? "/marketplace"
                        : "/marketplace"
                  }
                  className="inline-flex items-center justify-center rounded-full bg-white text-[var(--primary-accent2)] px-6 py-3 text-sm sm:text-base font-semibold hover:bg-white/95 transition"
                >
                  {user?.accountType === "buyer"
                    ? "Go to my dashboard"
                    : "Buy Fresh Produce"}
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>

                <Link
                  href={
                    user?.accountType === "seller"
                      ? "/seller"
                      : "/signup?accountType=seller&step=business"
                  }
                  className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/10 text-white px-6 py-3 text-sm sm:text-base font-semibold hover:bg-white/15 transition"
                >
                  {user?.accountType === "seller"
                    ? "Manage my store"
                    : "Become a Supplier"}
                </Link>
              </div>

              <div className="pointer-events-none absolute -right-16 -bottom-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            </div>
          </div>
        </section>
      </main>

      {/* Keep existing footer */}
      <Footer />
    </div>
  );
}
