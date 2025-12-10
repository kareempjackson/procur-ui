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

interface ProductPageProps {
  params: {
    country: string;
    slug: string;
  };
}

type PublicSeller = {
  id: string;
  name: string;
  location?: string;
  description?: string;
  average_rating?: number;
  review_count: number;
  product_count: number;
  is_verified: boolean;
};

type PublicProduct = {
  id: string;
  name: string;
  description?: string;
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
  image_url?: string;
  images?: string[];
  tags?: string[];
  is_organic: boolean;
  is_local: boolean;
  is_featured: boolean;
  average_rating?: number;
  review_count: number;
  seller: PublicSeller;
};

function splitSlug(slug: string): { id: string | null; nameSlug: string } {
  // Prefer UUID-like ID at the end of the slug (supports IDs with internal dashes)
  const uuidMatch = slug.match(/^(.*)-([0-9a-fA-F-]{36})$/);
  if (uuidMatch) {
    const [, namePart, id] = uuidMatch;
    return { id, nameSlug: namePart || slug };
  }

  // Fallback: last segment as ID, everything before as name
  const parts = slug.split("-");
  if (parts.length < 2) {
    return { id: null, nameSlug: slug };
  }
  const id = parts[parts.length - 1];
  const nameSlug = parts.slice(0, -1).join("-");
  return { id, nameSlug };
}

function toTitle(str: string): string {
  return str
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Metadata based on slug for now
export function generateMetadata({ params }: ProductPageProps): Metadata {
  const { nameSlug } = splitSlug(params.slug);
  const readableName = toTitle(nameSlug || params.slug);
  const readableCountry = toTitle(params.country);

  const title = `${readableName} from ${readableCountry} · Procur Marketplace`;

  return {
    title,
    description: `View details for ${readableName} from ${readableCountry} on Procur's fresh produce marketplace. Create a free buyer account to request quotes and place orders.`,
    openGraph: {
      title,
      description: `Discover ${readableName} from verified farms in ${readableCountry}. Sign up to buy on Procur.`,
    },
  };
}

async function fetchPublicProduct(
  productId: string
): Promise<PublicProduct | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

  try {
    const res = await fetch(`${baseUrl}/marketplace/products/${productId}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as PublicProduct;
  } catch {
    return null;
  }
}

export default async function PublicProductPage({ params }: ProductPageProps) {
  const { id: productId, nameSlug } = splitSlug(params.slug);
  const readableName = toTitle(nameSlug || params.slug);
  const readableCountry = toTitle(params.country);

  const product = productId ? await fetchPublicProduct(productId) : null;

  const images: string[] =
    (product?.images && product.images.length > 0
      ? product.images
      : product?.image_url
        ? [product.image_url]
        : []) || [];

  const primaryImage =
    images[0] ||
    "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg";

  const displayName = product?.name || readableName;

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
            / <span className="capitalize">{readableCountry}</span>
          </p>
        </div>

        {!product && (
          <div className="max-w-2xl">
            <h1 className="text-2xl md:text-3xl font-semibold text-[var(--secondary-black)] mb-3">
              {displayName}
            </h1>
            <p className="text-[var(--secondary-muted-edge)] mb-6">
              We couldn&apos;t load full details for this product. It may be
              unavailable or no longer listed. You can still explore similar
              items on the marketplace.
            </p>
            <Link
              href="/marketplace"
              className="inline-flex items-center px-6 py-3 rounded-full bg-[var(--primary-accent2)] text-white font-semibold hover:bg-[var(--primary-accent3)] transition-colors"
            >
              Back to Marketplace
            </Link>
          </div>
        )}

        {product && (
          <>
            {/* Main layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
              {/* Product Images */}
              <div className="space-y-3">
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-[var(--secondary-soft-highlight)]/20 bg-white">
                  <Image
                    src={primaryImage}
                    alt={displayName}
                    fill
                    className="object-cover"
                  />
                  {product.stock_quantity === 0 && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold">
                      Out of Stock
                    </div>
                  )}
                  {product.sale_price &&
                    product.sale_price < product.base_price && (
                      <div className="absolute top-4 left-4 bg-[var(--primary-accent2)] text-white px-3 py-1.5 rounded-full text-sm font-bold">
                        {Math.round(
                          ((product.base_price - product.sale_price) /
                            product.base_price) *
                            100
                        )}
                        % Off
                      </div>
                    )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-3">
                    {images.slice(0, 4).map((image, index) => (
                      <div
                        key={image + index}
                        className="relative w-20 h-20 rounded-xl overflow-hidden border border-[var(--secondary-soft-highlight)]/40"
                      >
                        <Image
                          src={image}
                          alt={`${displayName} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-5">
                <div>
                  <h1 className="text-2xl md:text-3xl font-semibold md:font-bold text-[var(--secondary-black)] mb-3 tracking-tight">
                    {displayName}
                  </h1>
                  <p className="text-sm text-[var(--secondary-muted-edge)] mb-3">
                    From{" "}
                    <span className="font-medium">
                      {product.seller.name || "Verified Supplier"}
                    </span>{" "}
                    in{" "}
                    <span className="font-medium">
                      {product.seller.location || readableCountry}
                    </span>
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {(product.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-[var(--primary-background)] rounded-full text-xs font-medium text-[var(--secondary-black)]"
                      >
                        {tag}
                      </span>
                    ))}
                    {product.is_organic && (
                      <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
                        Organic
                      </span>
                    )}
                    {product.is_local && (
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                        Local
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-[var(--secondary-muted-edge)] leading-relaxed text-sm md:text-[15px]">
                    {product.description ||
                      product.short_description ||
                      "This product is listed on Procur's marketplace by a verified supplier. Create a free account to see full details, availability, and request orders."}
                  </p>
                </div>

                {/* Price & summary */}
                <div className="bg-white rounded-3xl p-5 border border-[var(--secondary-soft-highlight)]/30">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-3xl font-bold text-[var(--secondary-black)]">
                      ${product.current_price.toFixed(2)}
                    </span>
                    <span className="text-base text-[var(--secondary-muted-edge)]">
                      per {product.unit_of_measurement}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-[var(--secondary-muted-edge)]">
                        Category:
                      </span>
                      <span className="font-medium text-[var(--secondary-black)]">
                        {product.category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--secondary-muted-edge)]">
                        Available Stock:
                      </span>
                      <span className="font-medium text-[var(--secondary-black)]">
                        {product.stock_quantity} {product.unit_of_measurement}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--secondary-muted-edge)]">
                        Status:
                      </span>
                      <span
                        className={`font-medium ${
                          product.stock_quantity > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {product.stock_quantity > 0
                          ? "In Stock"
                          : "Out of Stock"}
                      </span>
                    </div>
                    {typeof product.average_rating === "number" && (
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--secondary-muted-edge)]">
                          Rating:
                        </span>
                        <span className="flex items-center gap-1 font-medium text-[var(--secondary-black)]">
                          <StarIcon className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          {product.average_rating.toFixed(1)}{" "}
                          <span className="text-xs text-[var(--secondary-muted-edge)]">
                            ({product.review_count} reviews)
                          </span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Public CTAs */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/signup?type=buyer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-[var(--primary-accent2)] text-white text-sm font-semibold hover:bg-[var(--primary-accent3)] transition-all duration-200"
                    >
                      Create account
                    </Link>
                    <Link
                      href="/login"
                      className="flex-1 inline-flex items-center justify-center px-5 py-2 rounded-full border border-[var(--secondary-soft-highlight)] text-sm text-[var(--secondary-black)] font-semibold hover:bg-[var(--primary-background)] transition-colors"
                    >
                      Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller summary */}
            <div className="max-w-xl mb-12">
              <div className="bg-white rounded-3xl p-5 border border-[var(--secondary-soft-highlight)]/30">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-[var(--primary-accent2)]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-[var(--primary-accent2)]">
                        {product.seller.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <h3 className="text-base font-semibold text-[var(--secondary-black)] truncate">
                          {product.seller.name}
                        </h3>
                        {product.seller.is_verified && (
                          <CheckBadgeIcon className="h-4 w-4 text-[var(--primary-accent2)] flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[var(--secondary-muted-edge)] mb-2">
                        <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">
                          {product.seller.location || "Caribbean Region"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs flex-wrap">
                        {typeof product.seller.average_rating === "number" && (
                          <div className="flex items-center gap-1">
                            <StarIcon className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium text-[var(--secondary-black)]">
                              {product.seller.average_rating.toFixed(1)}
                            </span>
                            <span className="text-[var(--secondary-muted-edge)]">
                              ({product.seller.review_count || 0})
                            </span>
                          </div>
                        )}
                        {product.seller.product_count > 0 && (
                          <span className="text-[var(--secondary-muted-edge)]">
                            {product.seller.product_count} listed products
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {product.seller.description && (
                  <p className="text-xs text-[var(--secondary-muted-edge)] mb-4 leading-relaxed">
                    {product.seller.description}
                  </p>
                )}

                <div className="mt-4">
                  <Link
                    href={`/sellers/${product.seller.id}`}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[var(--secondary-black)] text-white text-xs font-semibold hover:bg-[var(--secondary-muted-edge)] transition-colors"
                  >
                    View supplier
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
