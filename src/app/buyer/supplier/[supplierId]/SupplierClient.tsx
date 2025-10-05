"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPinIcon,
  StarIcon,
  CheckBadgeIcon,
  ChatBubbleLeftIcon,
  ArrowLeftIcon,
  ClockIcon,
  TruckIcon,
  ShieldCheckIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchSellerProducts,
  toggleProductFavoriteAsync,
} from "@/store/slices/buyerMarketplaceSlice";
import { addToCartAsync } from "@/store/slices/buyerCartSlice";
import ProcurLoader from "@/components/ProcurLoader";
import { getApiClient } from "@/lib/apiClient";
import { useSelector } from "react-redux";
import { selectAuthToken } from "@/store/slices/authSlice";

interface SupplierClientProps {
  supplierId: string;
}

export default function SupplierClient({ supplierId }: SupplierClientProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    sellerProducts,
    currentSeller,
    sellerProductsStatus,
    sellerProductsError,
  } = useAppSelector((state) => state.buyerMarketplace);
  const authToken = useSelector(selectAuthToken);

  const [selectedTab, setSelectedTab] = useState<"products" | "about">(
    "products"
  );
  const [savedProducts, setSavedProducts] = useState<Set<string>>(new Set());

  // Fetch seller products on mount
  useEffect(() => {
    dispatch(fetchSellerProducts(supplierId));
  }, [dispatch, supplierId]);

  // Use seller data from Redux
  const supplier = currentSeller || {
    id: supplierId,
    name: "Caribbean Farms Co.",
    description:
      "We are a family-owned farm specializing in organic produce for over 30 years. Our commitment to sustainable farming practices and quality control ensures that every product meets the highest standards. We serve restaurants, retailers, and distributors across the Caribbean and beyond.",
    location: "Kingston, Jamaica",
    country: "Jamaica",
    average_rating: 4.8,
    total_reviews: 234,
    is_verified: true,
    product_count: 47,
    review_count: 234,
    created_at: "2019-01-01",
    specialties: ["Organic Produce", "Sustainable Farming", "Export Quality"],
  };

  // Transform products from Redux to match UI structure
  const products = sellerProducts.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.sale_price || product.base_price || 0,
    unit: product.unit_of_measurement,
    minOrder: `1 ${product.unit_of_measurement}`,
    image:
      product.images?.[0] ||
      "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
    tags: product.tags || [],
    discount:
      product.sale_price &&
      product.base_price &&
      product.sale_price < product.base_price
        ? `${Math.round(
            ((product.base_price - product.sale_price) / product.base_price) *
              100
          )}% off`
        : null,
    is_favorite: product.is_favorited || false,
    in_stock: product.stock_quantity > 0,
  }));

  const toggleSave = async (productId: string) => {
    try {
      const product = sellerProducts.find((p) => p.id === productId);
      if (product) {
        await dispatch(
          toggleProductFavoriteAsync({
            productId,
            isFavorited: !product.is_favorited,
          })
        ).unwrap();
        // Refresh seller products to get updated favorite status
        dispatch(fetchSellerProducts(supplierId));
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await dispatch(
        addToCartAsync({ productId: productId, quantity: 1 })
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
      <div className="min-h-screen bg-[var(--primary-background)] flex items-center justify-center">
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
    <div className="min-h-screen bg-[var(--primary-background)]">
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
        <div className="bg-white rounded-2xl overflow-hidden border border-[var(--secondary-soft-highlight)]/20 mb-6">
          {/* Cover Image */}
          <div className="relative h-48 bg-gradient-to-br from-[var(--primary-accent2)] to-[var(--primary-accent3)]">
            {/* Logo positioned over cover */}
            <div className="absolute -bottom-10 left-6">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center">
                <span className="text-4xl font-bold text-[var(--primary-accent2)]">
                  {supplier.name.charAt(0)}
                </span>
              </div>
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
                  {supplier.location}
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
                  {supplier.product_count}
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
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleSave(product.id);
                    }}
                    className="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-sm p-1 rounded-full hover:bg-white transition-all duration-200 z-10"
                  >
                    {product.is_favorite ? (
                      <HeartSolidIcon className="h-3.5 w-3.5 text-[var(--primary-accent2)]" />
                    ) : (
                      <HeartIcon className="h-3.5 w-3.5 text-[var(--secondary-black)]" />
                    )}
                  </button>
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
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("Add to cart:", product.id);
                      }}
                      className="px-3 py-1.5 bg-[var(--primary-accent2)] text-white rounded-full text-xs font-semibold hover:bg-[var(--primary-accent3)] transition-all duration-200"
                    >
                      Add
                    </button>
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
