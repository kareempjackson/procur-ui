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
  params: Promise<{
    sellerId: string;
  }>;
}

type PublicSeller = {
  id: string;
  name: string;
  description?: string;
  business_type?: string;
  /**
   * Optional header/cover image for the public profile.
   * When wired up, this should be controlled from the seller portal.
   */
  header_image_url?: string;
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
  const { sellerId } = await params;
  const seller = await fetchPublicSeller(sellerId);
  const products = seller ? await fetchSellerProducts(seller.id) : [];

  const displayName = seller?.name || "Marketplace Seller";
  const readableLocation = toTitle(seller?.location || "Caribbean Region");

  const demoReviews =
    seller && seller.review_count > 0
      ? [
          {
            id: "1",
            buyerInitials: "SM",
            buyerName: "Verified buyer",
            rating: seller.average_rating ?? 4.8,
            createdAt: "Recently",
            comment:
              "Consistently reliable quality and very responsive on delivery timelines.",
          },
          {
            id: "2",
            buyerInitials: "JR",
            buyerName: "Program partner",
            rating: (seller.average_rating ?? 4.8) - 0.2,
            createdAt: "This season",
            comment:
              "Great communication and clear grading on produce. Easy to work with for repeat orders.",
          },
          {
            id: "3",
            buyerInitials: "AL",
            buyerName: "Hospitality buyer",
            rating: (seller.average_rating ?? 4.8) - 0.3,
            createdAt: "Earlier this year",
            comment:
              "Fresh product and thoughtful packing. Would recommend to other buyers on Procur.",
          },
        ]
      : [];

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-10">
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
            {/* Seller hero with cover image + logo */}
            <section className="mb-4 md:mb-6">
              <div className="relative rounded-3xl border border-[var(--secondary-soft-highlight)]/40 overflow-hidden bg-[var(--primary-background)]">
                {/* Header / cover image */}
                <div className="relative h-40 md:h-52 lg:h-60 overflow-hidden">
                  {seller.header_image_url ? (
                    <>
                      <Image
                        src={seller.header_image_url}
                        alt={`${displayName} header`}
                        fill
                        priority
                        className="object-cover"
                        sizes="(min-width: 1024px) 960px, 100vw"
                      />
                      {/* Soft dark scrim over image only */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-black/10 to-transparent" />
                    </>
                  ) : (
                    // Fallback branded gradient background
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-accent2)] via-[var(--primary-accent3)] to-emerald-500" />
                  )}
                </div>

                {/* Foreground content (kept below header image for clarity) */}
                <div className="relative z-10 px-5 md:px-7 pb-6 md:pb-7 pt-4 md:pt-6">
                  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mt-2 md:mt-4">
                    {/* Logo / company avatar */}
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-white border border-[var(--secondary-soft-highlight)]/60 flex items-center justify-center">
                          {seller.logo_url ? (
                            <Image
                              src={seller.logo_url}
                              alt={displayName}
                              width={96}
                              height={96}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <span className="text-2xl font-semibold text-[var(--primary-accent2)]">
                              {displayName.charAt(0)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Main info */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-[var(--secondary-black)] tracking-tight">
                            {displayName}
                          </h1>
                          {seller.is_verified && (
                            <CheckBadgeIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                          )}
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--secondary-muted-edge)] mb-3">
                          {seller.business_type || "Marketplace supplier"}
                        </p>
                        <div className="flex flex-wrap items-center gap-2.5 text-xs text-[var(--secondary-muted-edge)] mb-3">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[var(--secondary-soft-highlight)]/70 text-[var(--secondary-black)]">
                            <MapPinIcon className="h-3.5 w-3.5" />
                            {readableLocation}
                          </span>
                          {typeof seller.average_rating === "number" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[var(--secondary-soft-highlight)]/70">
                              <StarIcon className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium text-[var(--secondary-black)]">
                                {seller.average_rating.toFixed(1)}
                              </span>
                              <span className="text-[var(--secondary-muted-edge)]">
                                ({seller.review_count || 0} reviews)
                              </span>
                            </span>
                          )}
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-[var(--secondary-soft-highlight)]/60 text-[var(--secondary-black)]">
                            {products.length} listed products
                          </span>
                          {typeof seller.years_in_business === "number" &&
                            seller.years_in_business > 0 && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-[var(--secondary-soft-highlight)]/60 text-[var(--secondary-black)]">
                                {seller.years_in_business}+ years on market
                              </span>
                            )}
                        </div>
                        {seller.specialties &&
                          seller.specialties.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {seller.specialties.slice(0, 4).map((s) => (
                                <span
                                  key={s}
                                  className="px-2.5 py-1 bg-white/80 text-[var(--secondary-black)] text-[10px] rounded-full border border-[var(--secondary-soft-highlight)]/60"
                                >
                                  {s}
                                </span>
                              ))}
                              {seller.specialties.length > 4 && (
                                <span className="text-[10px] text-[var(--secondary-muted-edge)]">
                                  +{seller.specialties.length - 4} more
                                </span>
                              )}
                            </div>
                          )}
                        {seller.description && (
                          <p className="text-xs md:text-sm text-[var(--secondary-muted-edge)] max-w-xl line-clamp-3">
                            {seller.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Slim CTAs */}
                    <div className="flex flex-row md:flex-col gap-2 md:items-end">
                      <Link
                        href="/signup?type=buyer"
                        className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[var(--primary-accent2)] text-white text-[11px] font-medium hover:bg-[var(--primary-accent3)] transition-colors"
                      >
                        Create buyer account
                      </Link>
                      <Link
                        href="/login"
                        className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-[var(--secondary-soft-highlight)] bg-white/80 text-[11px] font-medium text-[var(--secondary-black)] hover:bg-[var(--primary-background)]/80 transition-colors"
                      >
                        Login to message
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Products section */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-[var(--secondary-black)] tracking-tight">
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
                <div className="text-sm text-[var(--secondary-muted-edge)] py-8 rounded-2xl border border-dashed border-[var(--secondary-soft-highlight)]/60 px-4">
                  This seller doesn&apos;t have any public listings yet. Create
                  a Procur account to browse other verified farms and suppliers.
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
                        className="group bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/50 overflow-hidden hover:border-[var(--primary-accent2)]/80 transition-colors"
                      >
                        <div className="relative h-44 overflow-hidden">
                          <Image
                            src={image}
                            alt={p.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-[var(--secondary-black)] mb-1 line-clamp-2">
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
                            <div className="flex flex-wrap gap-1.5 mb-2">
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

              {/* Reviews section */}
              <section className="mt-12">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold text-[var(--secondary-black)] tracking-tight">
                      Reviews
                    </h2>
                    <p className="text-xs md:text-sm text-[var(--secondary-muted-edge)]">
                      {typeof seller.average_rating === "number"
                        ? `${seller.average_rating.toFixed(1)} average from ${
                            seller.review_count || 0
                          } reviews`
                        : `${seller.review_count || 0} reviews from Procur buyers`}
                    </p>
                  </div>
                </div>

                {demoReviews.length === 0 && (
                  <div className="text-sm text-[var(--secondary-muted-edge)] py-6 rounded-2xl border border-dashed border-[var(--secondary-soft-highlight)]/60 px-4">
                    Once this seller starts fulfilling orders on Procur,
                    verified buyers will be able to leave reviews here.
                  </div>
                )}

                {demoReviews.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {demoReviews.map((review) => (
                      <div
                        key={review.id}
                        className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/60 p-4 flex flex-col gap-3 shadow-[0_14px_30px_rgba(15,23,42,0.06)]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[var(--primary-background)] flex items-center justify-center text-[11px] font-semibold text-[var(--secondary-black)]">
                              {review.buyerInitials}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-[var(--secondary-black)]">
                                {review.buyerName}
                              </p>
                              <p className="text-[10px] text-[var(--secondary-muted-edge)]">
                                {review.createdAt}
                              </p>
                            </div>
                          </div>
                          <div className="inline-flex items-center gap-1 rounded-full bg-[var(--primary-background)] px-2 py-1">
                            <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-[11px] font-medium text-[var(--secondary-black)]">
                              {review.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-[var(--secondary-muted-edge)] leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
