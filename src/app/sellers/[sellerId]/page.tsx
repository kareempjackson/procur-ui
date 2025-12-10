import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import {
  MapPinIcon,
  CheckBadgeIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

interface SellerPageProps {
  params: {
    sellerId: string;
  };
}

type PublicSeller = {
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
};

type PublicProduct = {
  id: string;
  name: string;
  category: string;
  current_price: number;
  unit_of_measurement: string;
  image_url?: string;
  tags?: string[];
  average_rating?: number;
  stock_quantity: number;
  seller: {
    id: string;
    name: string;
    location?: string;
  };
};

function toTitle(str: string): string {
  return str
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export const metadata: Metadata = {
  title: "Seller Profile · Procur Marketplace",
  description:
    "Explore verified farms and suppliers on Procur's marketplace. View public seller profiles and their available products.",
};

async function fetchPublicSeller(
  sellerId: string
): Promise<PublicSeller | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

  try {
    const res = await fetch(`${baseUrl}/marketplace/sellers/${sellerId}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as PublicSeller;
  } catch {
    return null;
  }
}

async function fetchSellerProducts(sellerId: string): Promise<PublicProduct[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

  try {
    const res = await fetch(
      `${baseUrl}/marketplace/products?seller_id=${encodeURIComponent(
        sellerId
      )}&in_stock=true&limit=24&sort_by=created_at&sort_order=desc`,
      {
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.products as PublicProduct[]) || [];
  } catch {
    return [];
  }
}

function createCountrySlug(location?: string): string {
  if (!location) return "caribbean";
  return location.toLowerCase().replace(/\s+/g, "-");
}

function createProductSlug(name: string, id: string): string {
  return `${name.toLowerCase().replace(/\s+/g, "-")}-${id}`;
}

export default async function PublicSellerProfile({ params }: SellerPageProps) {
  const sellerId = params.sellerId;
  const seller = await fetchPublicSeller(sellerId);
  const products = seller ? await fetchSellerProducts(seller.id) : [];

  const displayName = seller?.name || "Marketplace Seller";
  const readableLocation = toTitle(seller?.location || "Caribbean Region");

  return (
    <div className="min-h-screen bg-white">
      <TopNavigation />
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <div className="mb-6">
          <p className="text-xs md:text-sm text-[var(--secondary-muted-edge)]">
            <Link
              href="/marketplace"
              className="hover:text-[var(--primary-accent2)]"
            >
              Marketplace
            </Link>{" "}
            / <span className="capitalize">{readableLocation}</span>
          </p>
        </div>

        {!seller && (
          <div className="max-w-2xl">
            <h1 className="text-2xl md:text-3xl font-semibold text-[var(--secondary-black)] mb-3">
              Seller not found
            </h1>
            <p className="text-[var(--secondary-muted-edge)] mb-6">
              We couldn&apos;t load this seller&apos;s profile. They may no
              longer be active on the marketplace. You can still explore other
              farms and suppliers.
            </p>
            <Link
              href="/marketplace"
              className="inline-flex items-center px-6 py-3 rounded-full bg-[var(--primary-accent2)] text-white font-semibold hover:bg-[var(--primary-accent3)] transition-colors"
            >
              Back to Marketplace
            </Link>
          </div>
        )}

        {seller && (
          <>
            {/* Seller hero */}
            <section className="mb-10">
              <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/30 px-5 py-6 md:px-7 md:py-7">
                <div className="flex flex-col md:flex-row gap-6 md:items-center">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-[var(--primary-background)] border border-[var(--secondary-soft-highlight)]/60 flex items-center justify-center">
                      {seller.logo_url ? (
                        <Image
                          src={seller.logo_url}
                          alt={displayName}
                          width={96}
                          height={96}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-[var(--primary-base)]">
                          {displayName.charAt(0)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h1 className="text-2xl md:text-3xl font-semibold md:font-bold text-[var(--secondary-black)] tracking-tight">
                            {displayName}
                          </h1>
                          {seller.is_verified && (
                            <CheckBadgeIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--secondary-muted-edge)] mb-3">
                          <span className="inline-flex items-center gap-1">
                            <MapPinIcon className="h-3.5 w-3.5" />
                            {readableLocation}
                          </span>
                          {seller.business_type && (
                            <span>{seller.business_type}</span>
                          )}
                          {typeof seller.average_rating === "number" && (
                            <span className="inline-flex items-center gap-1">
                              <StarIcon className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                              {seller.average_rating.toFixed(1)} (
                              {seller.review_count || 0} reviews)
                            </span>
                          )}
                          <span>{products.length} listed products</span>
                        </div>
                        {seller.specialties &&
                          seller.specialties.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {seller.specialties.map((s) => (
                                <span
                                  key={s}
                                  className="px-3 py-1 bg-[var(--primary-background)] text-[var(--secondary-black)] text-xs rounded-full"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        {seller.description && (
                          <p className="text-xs md:text-sm text-[var(--secondary-muted-edge)] max-w-2xl">
                            {seller.description}
                          </p>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="flex flex-col sm:flex-row gap-2 md:items-center">
                        <Link
                          href="/signup?type=buyer"
                          className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[var(--primary-accent2)] text-white text-xs font-semibold hover:bg-[var(--primary-accent3)] transition-colors"
                        >
                          Create account
                        </Link>
                        <Link
                          href="/login"
                          className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-[var(--secondary-soft-highlight)] text-xs font-semibold text-[var(--secondary-black)] hover:bg-[var(--primary-background)] transition-colors"
                        >
                          Login
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Products section */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-[var(--secondary-black)]">
                    Available Products
                  </h2>
                  <p className="text-xs md:text-sm text-[var(--secondary-muted-edge)]">
                    Products currently listed by this seller on the marketplace.
                  </p>
                </div>
                <span className="text-xs text-[var(--secondary-muted-edge)]">
                  {products.length} items
                </span>
              </div>

              {products.length === 0 && (
                <div className="text-sm text-[var(--secondary-muted-edge)] py-8">
                  This seller doesn&apos;t have any public listings yet. Check
                  back soon or create an account to discover other suppliers.
                </div>
              )}

              {products.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((p) => {
                    const countrySlug = createCountrySlug(p.seller.location);
                    const productSlug = createProductSlug(p.name, p.id);
                    const href = `/products/${countrySlug}/${productSlug}`;

                    const image =
                      p.image_url ||
                      "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg";

                    return (
                      <Link
                        key={p.id}
                        href={href}
                        className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/40 overflow-hidden hover:border-[var(--primary-accent2)]/70 transition-colors"
                      >
                        <div className="relative h-44">
                          <Image
                            src={image}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-[var(--secondary-black)] mb-1 line-clamp-2">
                            {p.name}
                          </h3>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-[var(--secondary-black)]">
                              ${p.current_price.toFixed(2)}
                              <span className="text-xs font-normal text-[var(--secondary-muted-edge)]">
                                {" "}
                                /{p.unit_of_measurement}
                              </span>
                            </span>
                            <span className="text-xs text-[var(--secondary-muted-edge)]">
                              {p.category}
                            </span>
                          </div>
                          {p.tags && p.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {p.tags.slice(0, 3).map((t) => (
                                <span
                                  key={t}
                                  className="px-2 py-0.5 rounded-full bg-[var(--primary-background)] text-[var(--secondary-black)] text-[10px]"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center justify-between text-[11px] text-[var(--secondary-muted-edge)]">
                            <span className="inline-flex items-center gap-1">
                              <MapPinIcon className="h-3 w-3" />
                              {p.seller.location || readableLocation}
                            </span>
                            <span>
                              Stock: {p.stock_quantity} {p.unit_of_measurement}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
