"use client";

import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getApiClient } from "@/lib/apiClient";
import Link from "next/link";

type Seller = {
  id: string;
  name: string;
  description?: string;
  business_type?: string;
  logo_url?: string;
  location?: string;
  average_rating?: number;
  review_count: number;
  product_count: number;
  years_in_business?: number;
  is_verified: boolean;
  specialties?: string[];
  distance?: number;
};

type Product = {
  id: string;
  name: string;
  short_description?: string;
  category: string;
  subcategory?: string;
  current_price: number;
  base_price: number;
  sale_price?: number;
  currency: string;
  stock_quantity: number;
  unit_of_measurement: string;
  condition: string;
  brand?: string;
  image_url?: string;
  images?: string[];
  tags?: string[];
  is_organic: boolean;
  is_local: boolean;
  is_featured: boolean;
  average_rating?: number;
  review_count: number;
  seller: Seller;
  distance?: number;
  estimated_delivery_days?: number;
  is_favorited?: boolean;
};

type Paged<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

function getClient() {
  return getApiClient(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("auth");
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { accessToken?: string };
      return parsed.accessToken ?? null;
    } catch {
      return null;
    }
  });
}

function useDebounced<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function BuyerClient() {
  const [heroLoaded, setHeroLoaded] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [region, setRegion] = useState("");
  const [productType, setProductType] = useState("");
  const [organic, setOrganic] = useState<"any" | "organic" | "conventional">(
    "any"
  );
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [harvestDate, setHarvestDate] = useState<string>("");
  const [sort, setSort] = useState<
    "Newest" | "Price low→high" | "Price high→low" | "Availability"
  >("Newest");

  const debouncedKeyword = useDebounced(keyword, 250);

  const [products, setProducts] = useState<Paged<Product>>({
    items: [],
    total: 0,
    page: 1,
    limit: 24,
  });
  const [sellers, setSellers] = useState<Paged<Seller>>({
    items: [],
    total: 0,
    page: 1,
    limit: 6,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingSellers, setLoadingSellers] = useState(false);
  const [errorSellers, setErrorSellers] = useState<string | null>(null);

  const liveRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (liveRef.current) {
      liveRef.current.textContent = `${products.total} results`;
    }
  }, [products.total]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const client = getClient();
      const params: Record<string, unknown> = {
        page: products.page,
        limit: products.limit,
        search: debouncedKeyword || undefined,
        category: productType || undefined,
        min_price: priceMin ? Number(priceMin) : undefined,
        max_price: priceMax ? Number(priceMax) : undefined,
        is_organic:
          organic === "organic"
            ? true
            : organic === "conventional"
            ? false
            : undefined,
        sort_by:
          sort === "Newest"
            ? "created_at"
            : sort === "Price low→high" || sort === "Price high→low"
            ? "price"
            : "popularity",
        sort_order: sort === "Price low→high" ? "asc" : "desc",
        location: region || undefined,
        in_stock: true,
      };
      const { data } = await client.get("/buyers/marketplace/products", {
        params,
      });
      const mapped: Paged<Product> = {
        items: data.products ?? [],
        total: data.total ?? 0,
        page: data.page ?? 1,
        limit: data.limit ?? 24,
      };
      setProducts(mapped);
    } catch (e: unknown) {
      setError(
        (e as any)?.response?.data?.message || "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  }, [
    debouncedKeyword,
    productType,
    priceMin,
    priceMax,
    organic,
    sort,
    region,
    products.page,
    products.limit,
  ]);

  const fetchSellers = useCallback(async () => {
    setLoadingSellers(true);
    setErrorSellers(null);
    try {
      const client = getClient();
      const params: Record<string, unknown> = {
        page: 1,
        limit: 6,
        search: debouncedKeyword || undefined,
        location: region || undefined,
        is_verified: true,
        sort_by: "product_count",
        sort_order: "desc",
      };
      const { data } = await client.get("/buyers/marketplace/sellers", {
        params,
      });
      const mapped: Paged<Seller> = {
        items: data.sellers ?? [],
        total: data.total ?? 0,
        page: data.page ?? 1,
        limit: data.limit ?? 6,
      };
      setSellers(mapped);
    } catch (e: unknown) {
      setErrorSellers(
        (e as any)?.response?.data?.message || "Failed to load farms"
      );
    } finally {
      setLoadingSellers(false);
    }
  }, [debouncedKeyword, region]);

  useEffect(() => {
    fetchProducts();
    fetchSellers();
  }, [fetchProducts, fetchSellers]);

  const upcomingByDate = useMemo(() => {
    const map = new Map<string, Product[]>();
    products.items.forEach((p) => {
      const tag = p.tags?.find((t) => /^harvest:\d{4}-\d{2}-\d{2}$/.test(t));
      if (tag) {
        const date = tag.split(":")[1];
        if (!map.has(date)) map.set(date, []);
        map.get(date)!.push(p);
      }
    });
    if (harvestDate) {
      const filtered = new Map<string, Product[]>();
      if (map.has(harvestDate))
        filtered.set(harvestDate, map.get(harvestDate)!);
      return filtered;
    }
    return map;
  }, [products.items, harvestDate]);

  const log = (name: string, data?: Record<string, unknown>) => {
    // eslint-disable-next-line no-console
    console.log(name, data);
  };

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      <main
        className="max-w-[1280px] mx-auto px-6 md:px-8 py-8 md:py-10"
        role="main"
      >
        {/* Hero */}
        <section aria-labelledby="hero-title" className="mb-8 md:mb-10">
          <div className="relative overflow-hidden rounded-3xl border border-[var(--secondary-soft-highlight)] min-h-[420px] md:min-h-[560px]">
            <div className="absolute inset-0">
              <Image
                src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                alt=""
                fill
                priority
                onLoad={() => setHeroLoaded(true)}
                className={classNames(
                  "object-cover object-center transition-opacity",
                  heroLoaded ? "opacity-100" : "opacity-0"
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/35 to-transparent" />
            </div>
            <div className="relative p-8 md:p-12">
              <h1
                id="hero-title"
                className="text-white text-[28px] md:text-[40px] leading-tight font-medium max-w-2xl text-balance drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
              >
                Discover Fresh Produce, Direct from Farms
              </h1>
              <p className="mt-2 text-white/90 text-sm md:text-base max-w-2xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                Browse trusted farms, explore current inventory, and pre-order
                upcoming harvests.
              </p>

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <a
                  href="#in-stock"
                  className="btn btn-primary h-10 px-5"
                  onClick={() =>
                    log("buyer_cta_click", { cta: "browse_produce" })
                  }
                >
                  Browse Produce
                </a>
                <a
                  href="#featured-farms"
                  className="btn btn-ghost h-10 px-5 text-white hover:bg-white/15 border border-white/30"
                  onClick={() => log("buyer_cta_click", { cta: "view_farms" })}
                >
                  View Farms
                </a>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 max-w-md text-white/90 text-sm">
                {[
                  "250+ farms listed",
                  "1,200+ products available",
                  "Serving 15+ regions",
                ].map((s, i) => (
                  <div
                    key={s}
                    className={classNames(
                      "px-3 py-2 rounded-xl bg-black/30 backdrop-blur-sm",
                      i !== 0 && ""
                    )}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Filters + Search */}
        <section aria-labelledby="filters-title" className="mb-6">
          <h2 id="filters-title" className="sr-only">
            Search and Filters
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div
                role="search"
                aria-label="Search"
                className="flex items-center gap-2 w-full md:w-[420px]"
              >
                <input
                  className="input w-full"
                  placeholder="Search farms or products"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onBlur={() =>
                    log("buyer_search_filter_change", {
                      filter_name: "keyword",
                      value: keyword,
                    })
                  }
                  aria-controls="in-stock-list"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  aria-label="Region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="input h-9"
                >
                  <option value="">All regions</option>
                  <option value="US-CA">California</option>
                  <option value="US-NY">New York</option>
                  <option value="US-TX">Texas</option>
                </select>

                <select
                  aria-label="Product type"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="input h-9"
                >
                  <option value="">All products</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Herbs">Herbs</option>
                  <option value="Grains">Grains</option>
                  <option value="Specialty">Specialty</option>
                </select>

                <select
                  aria-label="Organic or Conventional"
                  value={organic}
                  onChange={(e) => setOrganic(e.target.value as any)}
                  className="input h-9"
                >
                  <option value="any">Organic/Conventional</option>
                  <option value="organic">Organic</option>
                  <option value="conventional">Conventional</option>
                </select>

                <div className="flex items-center gap-1">
                  <input
                    aria-label="Min price"
                    className="input h-9 w-24"
                    placeholder="Min"
                    inputMode="numeric"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                  />
                  <span className="text-[var(--primary-base)]">–</span>
                  <input
                    aria-label="Max price"
                    className="input h-9 w-24"
                    placeholder="Max"
                    inputMode="numeric"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                  />
                </div>

                <input
                  type="date"
                  aria-label="Harvest date"
                  className="input h-9"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {[
                "Newest",
                "Price low→high",
                "Price high→low",
                "Availability",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => setSort(s as any)}
                  className={classNames(
                    "px-3 py-1.5 text-sm rounded-full",
                    sort === s
                      ? "bg-[var(--primary-accent2)] text-white"
                      : "text-[var(--primary-base)] hover:bg-white"
                  )}
                  aria-pressed={sort === s}
                >
                  {s}
                </button>
              ))}
              <div
                ref={liveRef}
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
              />
            </div>
          </div>
        </section>

        {/* Featured Farms */}
        <section
          id="featured-farms"
          aria-labelledby="featured-farms-title"
          className="mb-8"
        >
          <div className="flex items-end justify-between gap-3 mb-3">
            <div>
              <h2
                id="featured-farms-title"
                className="text-[22px] md:text-[24px] font-medium text-[var(--secondary-black)]"
              >
                Featured Farms
              </h2>
              <p className="text-sm text-[var(--secondary-muted-edge)]">
                Meet the growers behind your food.
              </p>
            </div>
            <Link
              href="/seller"
              className="text-sm text-[var(--primary-base)] hover:text-[var(--primary-accent2)]"
            >
              View all →
            </Link>
          </div>

          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loadingSellers &&
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-44 rounded-2xl border border-[var(--secondary-soft-highlight)] bg-white animate-pulse"
                />
              ))}
            {!loadingSellers &&
              sellers.items.map((farm) => (
                <article
                  key={farm.id}
                  className="border border-[var(--secondary-soft-highlight)] rounded-2xl overflow-hidden bg-white hover:shadow-sm focus-within:shadow-sm transition-shadow"
                >
                  <div className="h-32 w-full bg-gray-100 relative">
                    {farm.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={farm.logo_url}
                        alt={farm.name}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-[var(--primary-base)]">
                        {farm.name.slice(0, 1)}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-[var(--secondary-black)] font-medium truncate">
                      {farm.name}
                    </div>
                    <div className="mt-0.5 text-sm text-[var(--primary-base)] truncate">
                      {farm.location || "Location unavailable"}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-[var(--primary-base)]">
                        {farm.product_count} listings
                      </span>
                      <Link
                        href={`/farms/${farm.id}`}
                        className="btn btn-ghost h-8 px-3"
                        onClick={() =>
                          log("buyer_farm_card_view", {
                            farm_id: farm.id,
                            position: "featured",
                          })
                        }
                      >
                        View Farm
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            {!loadingSellers && !errorSellers && sellers.items.length === 0 && (
              <div className="col-span-3 text-sm text-[var(--primary-base)]">
                No featured farms right now.
              </div>
            )}
            {errorSellers && (
              <div className="col-span-3 text-sm text-[var(--primary-accent2)]">
                {errorSellers}
              </div>
            )}
          </div>

          {/* Mobile horizontal scroll */}
          <div
            className="md:hidden overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none]"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="flex gap-3 pr-2">
              {loadingSellers &&
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="min-w-[260px] h-44 rounded-2xl border border-[var(--secondary-soft-highlight)] bg-white animate-pulse"
                  />
                ))}
              {!loadingSellers &&
                sellers.items.map((farm) => (
                  <article
                    key={farm.id}
                    className="min-w-[260px] border border-[var(--secondary-soft-highlight)] rounded-2xl overflow-hidden bg-white hover:shadow-sm focus-within:shadow-sm transition-shadow"
                  >
                    <div className="h-28 w-full bg-gray-100 relative">
                      {farm.logo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={farm.logo_url}
                          alt={farm.name}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center text-[var(--primary-base)]">
                          {farm.name.slice(0, 1)}
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="text-[var(--secondary-black)] font-medium truncate">
                        {farm.name}
                      </div>
                      <div className="mt-0.5 text-sm text-[var(--primary-base)] truncate">
                        {farm.location || "Location"}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span className="text-[var(--primary-base)]">
                          {farm.product_count} listings
                        </span>
                        <Link
                          href={`/farms/${farm.id}`}
                          className="text-[var(--primary-base)] hover:text-[var(--primary-accent2)]"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          </div>
        </section>

        {/* In Stock Today */}
        <section
          id="in-stock"
          aria-labelledby="in-stock-title"
          className="mb-8"
        >
          <div className="flex items-end justify-between gap-3 mb-3">
            <div>
              <h2
                id="in-stock-title"
                className="text-[22px] md:text-[24px] font-medium text-[var(--secondary-black)]"
              >
                In Stock Today
              </h2>
              <p className="text-sm text-[var(--secondary-muted-edge)]">
                Ready to ship within 24h
              </p>
            </div>
          </div>

          {/* Loading & errors */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-64 rounded-2xl border border-[var(--secondary-soft-highlight)] bg-white animate-pulse"
                />
              ))}
            </div>
          )}
          {error && !loading && (
            <div className="text-sm text-[var(--primary-accent2)]">{error}</div>
          )}

          <div
            id="in-stock-list"
            role="list"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {!loading &&
              !error &&
              products.items.map((p, idx) => {
                const low =
                  p.stock_quantity <= 0 ? false : p.stock_quantity < 10;
                return (
                  <article
                    key={p.id}
                    role="listitem"
                    className="border border-[var(--secondary-soft-highlight)] rounded-2xl overflow-hidden bg-white hover:shadow-sm focus-within:shadow-sm transition-shadow"
                  >
                    <div className="h-40 w-full bg-gray-100 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          p.image_url ||
                          "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                        }
                        alt={p.name}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute top-2 left-2 flex gap-1">
                        {p.is_organic && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/90 text-[var(--secondary-black)]">
                            Organic
                          </span>
                        )}
                        {low && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-[color:rgb(203_89_39_/_.10)] text-[var(--primary-accent2)]">
                            Low stock
                          </span>
                        )}
                        {p.is_local && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/90 text-[var(--secondary-black)]">
                            Local
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <div
                        className="text-[var(--secondary-black)] font-medium truncate"
                        title={p.name}
                      >
                        {p.name}
                      </div>
                      <div className="mt-0.5 text-sm text-[var(--primary-base)] truncate">
                        {p.seller?.name}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-[var(--secondary-black)]">
                          {new Intl.NumberFormat(undefined, {
                            style: "currency",
                            currency: p.currency || "USD",
                          }).format(p.current_price)}
                          <span className="text-sm text-[var(--primary-base)]">
                            {" "}
                            / {p.unit_of_measurement}
                          </span>
                        </div>
                        <div className="text-sm text-[var(--primary-base)]">
                          {p.stock_quantity} available
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          className="btn btn-primary h-9 px-4"
                          onClick={() =>
                            log("buyer_product_click", {
                              product_id: p.id,
                              farm_id: p.seller?.id,
                              position: idx,
                              section: "in_stock",
                            })
                          }
                        >
                          Add to Cart
                        </button>
                        <Link
                          href={`/products/${p.id}`}
                          className="btn btn-ghost h-9 px-4"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            {!loading && !error && products.items.length === 0 && (
              <div className="col-span-full text-sm text-[var(--primary-base)]">
                No matches. Try adjusting filters.
              </div>
            )}
          </div>
        </section>

        {/* Upcoming Harvests */}
        <section aria-labelledby="upcoming-title" className="mb-8">
          <div className="flex items-end justify-between gap-3 mb-3">
            <div>
              <h2
                id="upcoming-title"
                className="text-[22px] md:text-[24px] font-medium text-[var(--secondary-black)]"
              >
                Upcoming Harvests
              </h2>
              <p className="text-sm text-[var(--secondary-muted-edge)]">
                Pre-order fresh produce before it sells out
              </p>
            </div>
          </div>

          {upcomingByDate.size === 0 ? (
            <div className="text-sm text-[var(--primary-base)]">
              No upcoming harvests found. Check back soon.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex items-start gap-4">
                {Array.from(upcomingByDate.entries()).map(([date, items]) => (
                  <div key={date} className="min-w-[260px]">
                    <div className="sticky top-0 bg-[var(--primary-background)]/80 backdrop-blur px-1 py-1.5 rounded-md text-sm text-[var(--secondary-black)]">
                      {new Date(date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="mt-2 space-y-3">
                      {items.map((p) => (
                        <article
                          key={p.id}
                          className="border border-[var(--secondary-soft-highlight)] rounded-2xl overflow-hidden bg-white"
                        >
                          <div className="h-28 w-full bg-gray-100 relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={
                                p.image_url ||
                                "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                              }
                              alt={p.name}
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                          </div>
                          <div className="p-3">
                            <div className="text-[var(--secondary-black)] font-medium truncate">
                              {p.name}
                            </div>
                            <div className="mt-0.5 text-sm text-[var(--primary-base)] truncate">
                              {p.seller?.name}
                            </div>
                            <div className="mt-2 flex items-center justify-between text-sm">
                              <span className="text-[var(--secondary-black)]">
                                {new Intl.NumberFormat(undefined, {
                                  style: "currency",
                                  currency: p.currency || "USD",
                                }).format(p.current_price)}
                              </span>
                              <span className="text-[var(--primary-base)]">
                                Pre-order price
                              </span>
                            </div>
                            <button
                              className="mt-3 btn btn-primary h-9 px-4"
                              onClick={() =>
                                log("buyer_preorder_action", {
                                  product_id: p.id,
                                  expected_harvest_date: date,
                                  quantity_requested: 1,
                                })
                              }
                            >
                              Reserve Now
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Marketplace Highlights */}
        <section aria-labelledby="highlights-title" className="mb-8">
          <h2
            id="highlights-title"
            className="text-[22px] md:text-[24px] font-medium text-[var(--secondary-black)] mb-3"
          >
            Marketplace Highlights
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Top Categories */}
            <div className="border border-[var(--secondary-soft-highlight)] rounded-2xl p-4 bg-white">
              <div className="text-[var(--secondary-black)] font-medium">
                Top Categories
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Vegetables", "Fruits", "Herbs", "Grains", "Specialty"].map(
                  (c) => (
                    <button
                      key={c}
                      className="px-3 py-1.5 rounded-full text-sm bg-gray-50 text-[var(--secondary-black)] hover:bg-gray-100"
                      onClick={() => setProductType(c)}
                    >
                      {c}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Trending (re-use first few products) */}
            <div className="border border-[var(--secondary-soft-highlight)] rounded-2xl p-4 bg-white">
              <div className="text-[var(--secondary-black)] font-medium">
                Trending Products
              </div>
              <div className="mt-3 overflow-x-auto">
                <div className="flex gap-3 pr-2">
                  {products.items.slice(0, 6).map((p) => (
                    <button
                      key={p.id}
                      className="min-w-[160px] border border-[var(--secondary-soft-highlight)] rounded-xl p-3 text-left hover:bg-gray-50"
                      onClick={() =>
                        log("buyer_product_click", {
                          product_id: p.id,
                          farm_id: p.seller?.id,
                          section: "trending",
                        })
                      }
                    >
                      <div className="h-20 w-full bg-gray-100 rounded-lg mb-2 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            p.image_url ||
                            "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                          }
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div
                        className="text-[var(--secondary-black)] text-sm truncate"
                        title={p.name}
                      >
                        {p.name}
                      </div>
                      <div className="text-[var(--primary-base)] text-xs truncate">
                        {p.seller?.name}
                      </div>
                    </button>
                  ))}
                  {products.items.length === 0 && (
                    <div className="text-sm text-[var(--primary-base)]">
                      No trending items yet.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Buyer Favorites (placeholder links) */}
            <div className="border border-[var(--secondary-soft-highlight)] rounded-2xl p-4 bg-white">
              <div className="text-[var(--secondary-black)] font-medium">
                Buyer Favorites
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                {["High-rated farms", "Best sellers", "Fastest delivery"].map(
                  (t) => (
                    <li key={t}>
                      <button
                        className="text-[var(--primary-base)] hover:text-[var(--primary-accent2)]"
                        onClick={() =>
                          log("buyer_highlight_click", { title: t })
                        }
                      >
                        {t} →
                      </button>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </section>

        {/* Insights footer */}
        <section aria-labelledby="insights-title" className="mb-4">
          <h2 id="insights-title" className="sr-only">
            Insights and Links
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3 border border-[var(--secondary-soft-highlight)] rounded-2xl p-4 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  "Average delivery time: 2.3 days",
                  "Repeat purchase rate: 42%",
                  "Farms with certifications: 68%",
                ].map((s) => (
                  <div
                    key={s}
                    className="px-3 py-3 rounded-xl bg-gray-50 text-sm text-[var(--secondary-black)]"
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
            <div className="border border-[var(--secondary-soft-highlight)] rounded-2xl p-4 bg-white">
              <ul className="space-y-2 text-sm">
                {[
                  "How Procur Works",
                  "Sustainability Commitment",
                  "Buyer Help Center",
                ].map((l) => (
                  <li key={l}>
                    <Link
                      href="#"
                      className="text-[var(--primary-base)] hover:text-[var(--primary-accent2)]"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
