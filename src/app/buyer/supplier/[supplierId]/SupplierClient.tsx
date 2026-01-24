"use client";

import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import {
  MapPinIcon,
  StarIcon,
  CheckBadgeIcon,
  ChatBubbleLeftIcon,
  ArrowLeftIcon,
  ClockIcon,
  TruckIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchSellerProducts,
} from "@/store/slices/buyerMarketplaceSlice";
import { addToCartAsync } from "@/store/slices/buyerCartSlice";
import ProcurLoader from "@/components/ProcurLoader";
import { getApiClient } from "@/lib/apiClient";
import { useSelector } from "react-redux";
import { selectAuthToken } from "@/store/slices/authSlice";
import SupplierAvatar from "@/components/buyer/SupplierAvatar";

interface SupplierClientProps {
  supplierId: string;
}

export default function SupplierClient({ supplierId }: SupplierClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const {
    sellerProducts,
    currentSeller,
    sellers,
    sellerProductsStatus,
    sellerProductsError,
  } = useAppSelector((state) => state.buyerMarketplace);
  const authToken = useSelector(selectAuthToken);

  const [selectedTab, setSelectedTab] = useState<"products" | "about">(
    "products"
  );
  const [cardQuantities, setCardQuantities] = useState<Record<string, number>>(
    {}
  );

  // Keep consistent with /buyer marketplace: derive a minimum order quantity from price
  // (a $30 minimum order amount per product line).
  const MIN_ORDER_AMOUNT = 30;
  const getMinOrderQuantityForPrice = (price?: number) => {
    if (!price || price <= 0) return 1;
    return Math.max(1, Math.ceil(MIN_ORDER_AMOUNT / price));
  };

  // Fetch seller products on mount
  useEffect(() => {
    dispatch(fetchSellerProducts(supplierId));
  }, [dispatch, supplierId]);

  const fallbackFromQuery = {
    id: supplierId,
    name: searchParams.get("name") || "Supplier",
    description: "", // optional until a seller profile API exists
    location: searchParams.get("location") || "",
    country: (searchParams.get("location") || "").split(",").pop()?.trim(),
    average_rating: 0,
    total_reviews: 0,
    is_verified: searchParams.get("verified") === "1",
    product_count: Number(searchParams.get("products") || 0),
    review_count: 0,
    created_at: "",
    specialties: [] as string[],
    // Optional branding passed via query params from listing pages (best-effort fallback)
    logo_url:
      searchParams.get("logo_url") ||
      searchParams.get("logo") ||
      undefined,
    header_image_url:
      searchParams.get("header_image_url") ||
      searchParams.get("header") ||
      undefined,
  };
  const sellerFromList = useMemo(
    () => sellers.find((s) => String(s.id) === String(supplierId)) || null,
    [sellers, supplierId]
  );

  const supplier = currentSeller || sellerFromList || fallbackFromQuery;

  // Transform products from Redux to match UI structure
  const products = useMemo(
    () =>
      sellerProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.sale_price || product.base_price || 0,
        unit: product.unit_of_measurement,
        minOrder: `${getMinOrderQuantityForPrice(
          product.sale_price || product.base_price || 0
        )} ${product.unit_of_measurement}`,
        minOrderQuantity: getMinOrderQuantityForPrice(
          product.sale_price || product.base_price || 0
        ),
        image:
          product.images?.[0] ||
          "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
        tags: product.tags || [],
        discount:
          product.sale_price &&
          product.base_price &&
          product.sale_price < product.base_price
            ? `${Math.round(
                ((product.base_price - product.sale_price) /
                  product.base_price) *
                  100
              )}% off`
            : null,
        is_favorite: product.is_favorited || false,
        in_stock: product.stock_quantity > 0,
        stock_quantity: product.stock_quantity,
      })),
    [sellerProducts]
  );

  useEffect(() => {
    // Initialize quantities per product (respect minimum order) without overriding existing user input
    setCardQuantities((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const p of products) {
        const id = String(p.id);
        if (next[id] == null) {
          next[id] = p.minOrderQuantity;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [products]);

  const handleAddToCart = async (productId: string) => {
    try {
      const id = String(productId);
      const p = products.find((x) => String(x.id) === id);
      
      if (!p) {
        console.error("Product not found");
        return;
      }
      
      if (!p.in_stock || (p.stock_quantity ?? 0) <= 0) {
        // Product is out of stock - don't add to cart
        return;
      }
      
      const max = p.stock_quantity || 5000;
      const min = p.minOrderQuantity ?? 1;
      const desired = cardQuantities[id] ?? 1;
      const quantity = Math.max(min, Math.min(max, desired));
      await dispatch(
        addToCartAsync({ productId: id, quantity })
      ).unwrap();
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const handleMessageSupplier = async () => {
    if (!authToken) {
      router.push("/login");
      return;
    }

    try {
      const client = getApiClient(() => authToken);
      const { data } = await client.post("/conversations/start", {
        contextType: "supplier",
        contextId: supplierId,
        title: `Chat with ${supplier.name}`,
      });

      if (data?.id) {
        router.push(`/buyer/messages?conversationId=${data.id}`);
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  // Loading state
  if (sellerProductsStatus === "loading") {
    return <ProcurLoader size="lg" text="Loading supplier..." />;
  }

  // Error state
  if (sellerProductsStatus === "failed" && sellerProductsError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <MapPinIcon className="h-16 w-16 text-[var(--secondary-muted-edge)] mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-[var(--secondary-black)] mb-2">
            Failed to Load Supplier
          </h2>
          <p className="text-[var(--secondary-muted-edge)] mb-4">
            {sellerProductsError}
          </p>
          <Link
            href="/buyer/suppliers"
            className="inline-block px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full font-semibold hover:bg-[var(--primary-accent3)] transition-all duration-200"
          >
            Browse All Suppliers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Link
            href="/buyer"
            className="inline-flex items-center gap-2 text-sm text-[var(--secondary-muted-edge)] hover:text-[var(--primary-accent2)] transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Marketplace
          </Link>
        </div>

        {/* Cover Image & Profile */}
        <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/20 mb-6">
          {/* Cover + Avatar */}
          <div className="relative">
            {/* Cover Image (clipped to rounded top only) */}
            <div className="relative h-48 overflow-hidden rounded-t-2xl">
            {supplier.header_image_url ? (
              <>
                <Image
                  src={supplier.header_image_url}
                  alt={`${supplier.name} header`}
                  fill
                  priority
                  className="object-cover"
                  sizes="(min-width: 1024px) 1024px, 100vw"
                />
                {/* Soft scrim over image only */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-black/10 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-accent2)] to-[var(--primary-accent3)]" />
            )}
            </div>

            {/* Avatar positioned over cover (NOT clipped) */}
            <div className="absolute -bottom-10 left-6">
              <SupplierAvatar
                name={supplier.name}
                imageUrl={supplier.logo_url}
                size="xl"
                priority
                className="bg-white ring-4 ring-white shadow-xl"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="p-6 pt-14">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-[var(--secondary-black)]">
                    {supplier.name}
                  </h1>
                  {supplier.is_verified && (
                    <CheckBadgeIcon className="h-6 w-6 text-[var(--primary-accent2)]" />
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-[var(--secondary-muted-edge)] mb-2">
                  <MapPinIcon className="h-4 w-4" />
                  {supplier.location || "—"}
                </div>
                <div className="flex items-center gap-4 text-sm flex-wrap">
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-[var(--secondary-black)]">
                      {supplier.average_rating}
                    </span>
                    <span className="text-[var(--secondary-muted-edge)]">
                      ({supplier.total_reviews} reviews)
                    </span>
                  </div>
                  {supplier.created_at && (
                    <span className="text-[var(--secondary-muted-edge)]">
                      Member since {new Date(supplier.created_at).getFullYear()}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleMessageSupplier}
                className="flex items-center gap-2 px-5 py-2.5 bg-[var(--primary-accent2)] text-white rounded-full text-sm font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200 flex-shrink-0"
              >
                <ChatBubbleLeftIcon className="h-4 w-4" />
                Contact Supplier
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-[var(--secondary-soft-highlight)]/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--primary-accent2)]">
                  {products.length}
                </div>
                <p className="text-sm text-[var(--secondary-muted-edge)]">
                  Products
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--primary-accent2)]">
                  {supplier.review_count}
                </div>
                <p className="text-sm text-[var(--secondary-muted-edge)]">
                  Reviews
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[var(--secondary-soft-highlight)]/30">
          <button
            onClick={() => setSelectedTab("products")}
            className={`px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 ${
              selectedTab === "products"
                ? "text-[var(--primary-accent2)] border-[var(--primary-accent2)]"
                : "text-[var(--secondary-muted-edge)] border-transparent hover:text-[var(--secondary-black)]"
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setSelectedTab("about")}
            className={`px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 ${
              selectedTab === "about"
                ? "text-[var(--primary-accent2)] border-[var(--primary-accent2)]"
                : "text-[var(--secondary-muted-edge)] border-transparent hover:text-[var(--secondary-black)]"
            }`}
          >
            About
          </button>
        </div>

        {/* Products Tab */}
        {selectedTab === "products" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/buyer/product/${product.id}`}
                className="bg-white rounded-lg overflow-hidden border border-[var(--secondary-soft-highlight)]/20 hover:shadow-md transition-all duration-200 group block"
              >
                <div className="relative h-32">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.discount && (
                    <div className="absolute top-1.5 left-1.5 bg-[var(--primary-accent2)] text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                      {product.discount}
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <h3 className="font-semibold text-sm text-[var(--secondary-black)] mb-2 group-hover:text-[var(--primary-accent2)] transition-colors line-clamp-1">
                    {product.name}
                  </h3>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {product.tags.map((tag) => (
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
                        ${product.price.toFixed(2)}
                        <span className="text-[10px] font-normal text-[var(--secondary-muted-edge)]">
                          /{product.unit}
                        </span>
                      </div>
                      <div className="text-[10px] text-[var(--secondary-muted-edge)] mt-0.5">
                        Min: {product.minOrder}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {product.in_stock && (
                        <div className="flex items-center gap-1 border border-[var(--secondary-soft-highlight)]/30 rounded-full px-1.5 py-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCardQuantities((prev) => {
                                const id = String(product.id);
                                const current = prev[id] ?? 1;
                                return {
                                  ...prev,
                                  [id]: Math.max(product.minOrderQuantity, current - 1),
                                };
                              });
                            }}
                            className="w-6 h-6 rounded-full hover:bg-[var(--primary-background)] transition-colors text-[var(--secondary-black)] text-xs font-bold"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            inputMode="numeric"
                            value={cardQuantities[String(product.id)] ?? 1}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onChange={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const raw = Number(e.target.value);
                              if (!Number.isFinite(raw)) return;
                              const max = product.stock_quantity || 5000;
                              const next = Math.max(
                                product.minOrderQuantity,
                                Math.min(max, Math.floor(raw))
                              );
                              setCardQuantities((prev) => ({
                                ...prev,
                                [String(product.id)]: next,
                              }));
                            }}
                            min={product.minOrderQuantity}
                            max={product.stock_quantity || 5000}
                            className="w-10 text-center text-xs bg-transparent outline-none text-[var(--secondary-black)]"
                            aria-label="Quantity"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCardQuantities((prev) => {
                                const id = String(product.id);
                                const current = prev[id] ?? 1;
                                const max = product.stock_quantity || 5000;
                                return { ...prev, [id]: Math.min(max, current + 1) };
                              });
                            }}
                            className="w-6 h-6 rounded-full hover:bg-[var(--primary-background)] transition-colors text-[var(--secondary-black)] text-xs font-bold"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      )}
                      {product.in_stock ? (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(product.id);
                          }}
                          className="px-3 py-1.5 bg-[var(--primary-accent2)] text-white rounded-full text-xs font-semibold hover:bg-[var(--primary-accent3)] transition-all duration-200"
                        >
                          Add
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 bg-gray-200 text-gray-600 rounded-full text-xs font-semibold">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* About Tab */}
        {selectedTab === "about" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20">
                <h2 className="text-lg font-semibold text-[var(--secondary-black)] mb-3">
                  About Us
                </h2>
                <p className="text-sm text-[var(--secondary-muted-edge)] leading-relaxed">
                  {supplier.description}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheckIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                  <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
                    Specialties
                  </h2>
                </div>
                {supplier.specialties && supplier.specialties.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {supplier.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-sm font-medium text-green-700"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--secondary-muted-edge)]">
                    No specialties listed
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20">
                <h3 className="text-base font-semibold text-[var(--secondary-black)] mb-3">
                  Supplier Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-[var(--primary-accent2)]" />
                    <div>
                      <p className="font-medium text-[var(--secondary-black)]">
                        Location
                      </p>
                      <p className="text-[var(--secondary-muted-edge)]">
                        {supplier.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20">
                <h3 className="text-base font-semibold text-[var(--secondary-black)] mb-4">
                  Location Map
                </h3>
                <div className="aspect-video rounded-xl overflow-hidden border border-[var(--secondary-soft-highlight)]/20">
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d238158.88377814756!2d-76.93854395!3d17.98506155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8edb3fd5f8e54777%3A0x4ebe73bcf1c3e1d2!2sKingston%2C%20Jamaica!5e0!3m2!1sen!2sus!4v1234567890123`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Supplier Location Map"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
