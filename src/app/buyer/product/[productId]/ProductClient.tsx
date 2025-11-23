"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HeartIcon,
  MapPinIcon,
  StarIcon,
  CheckBadgeIcon,
  TruckIcon,
  ShieldCheckIcon,
  ChatBubbleLeftIcon,
  ArrowLeftIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchProductDetail,
  toggleProductFavoriteAsync,
} from "@/store/slices/buyerMarketplaceSlice";
import { addToCartAsync } from "@/store/slices/buyerCartSlice";
import { getApiClient } from "@/lib/apiClient";
import ProcurLoader from "@/components/ProcurLoader";
import { useToast } from "@/components/ui/Toast";

interface ProductClientProps {
  productId: string;
}

export default function ProductClient({ productId }: ProductClientProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { show } = useToast();
  const {
    currentProduct: product,
    productDetailStatus,
    productDetailError,
  } = useAppSelector((state) => state.buyerMarketplace);
  const authToken = useAppSelector((state) => state.auth.accessToken);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isStartingConversation, setIsStartingConversation] = useState(false);

  // Fetch product details on mount
  useEffect(() => {
    dispatch(fetchProductDetail(productId));
  }, [dispatch, productId]);

  const handleAddToCart = () => {
    dispatch(addToCartAsync({ productId, quantity }));
    show(
      `Added ${quantity} ${product?.unit_of_measurement || "items"} to cart!`
    );
  };

  const handleBuyNow = () => {
    dispatch(addToCartAsync({ productId, quantity }));
    // Navigate to checkout
    window.location.href = "/buyer/checkout";
  };

  const handleToggleFavorite = () => {
    if (product) {
      dispatch(
        toggleProductFavoriteAsync({
          productId: product.id,
          isFavorited: product.is_favorited || false,
        })
      );
    }
  };

  const handleMessageSeller = async () => {
    if (!product || !authToken) return;

    setIsStartingConversation(true);
    try {
      const client = getApiClient(() => authToken);
      const { data } = await client.post("/conversations/start", {
        contextType: "product",
        contextId: product.id,
        withUserId: product.seller.id,
        title: `Re: ${product.name}`,
      });
      router.push(`/buyer/messages?conversationId=${data.id}`);
    } catch (error) {
      console.error("Failed to start conversation:", error);
      show("Failed to start conversation. Please try again.");
    } finally {
      setIsStartingConversation(false);
    }
  };

  const incrementQuantity = () => {
    const maxOrder = product?.stock_quantity || 5000;
    if (quantity < maxOrder) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    const minOrder = 1; // Default min order
    if (quantity > minOrder) {
      setQuantity(quantity - 1);
    }
  };

  // Loading state
  if (productDetailStatus === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <ProcurLoader size="lg" text="Loading product..." />
      </div>
    );
  }

  // Error state
  if (productDetailStatus === "failed" || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-[var(--secondary-black)] mb-2">
            Product Not Found
          </h2>
          <p className="text-[var(--secondary-muted-edge)] mb-4">
            {productDetailError ||
              "The product you're looking for doesn't exist."}
          </p>
          <Link
            href="/buyer"
            className="px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full font-semibold hover:bg-[var(--primary-accent3)] transition-all duration-200"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  // Get product images
  const images =
    (Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.image_url
        ? [product.image_url]
        : []) || [];
  const fallbackImage =
    "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg";
  const sellerLocation =
    (product.seller.location && product.seller.location.trim()) || "";
  const mapSrc = sellerLocation
    ? `https://www.google.com/maps?q=${encodeURIComponent(
        sellerLocation
      )}&output=embed`
    : `https://www.google.com/maps?q=Caribbean&output=embed`;

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Product Images */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-[var(--secondary-soft-highlight)]/20 bg-white">
              <Image
                src={images[selectedImage]}
                alt={product.name}
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
              <button
                onClick={handleToggleFavorite}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-full hover:bg-white transition-all duration-200"
              >
                {product.is_favorited ? (
                  <HeartSolidIcon className="h-6 w-6 text-[var(--primary-accent2)]" />
                ) : (
                  <HeartIcon className="h-6 w-6 text-[var(--secondary-black)]" />
                )}
              </button>
            </div>

            {/* Image Thumbnails */}
            <div className="flex gap-3">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-24 h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === index
                      ? "border-[var(--primary-accent2)]"
                      : "border-[var(--secondary-soft-highlight)]/20 hover:border-[var(--secondary-soft-highlight)]"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl font-bold text-[var(--secondary-black)]">
                  {product.name}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-3">
                {(product.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-[var(--primary-background)] rounded-full text-sm font-medium text-[var(--secondary-black)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-[var(--secondary-muted-edge)] leading-relaxed">
                {product.description ||
                  product.short_description ||
                  "No description available."}
              </p>
            </div>

            {/* Price and Availability */}
            <div className="bg-white rounded-2xl p-4 border border-[var(--secondary-soft-highlight)]/20">
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-bold text-[var(--secondary-black)]">
                  ${product.current_price.toFixed(2)}
                </span>
                <span className="text-base text-[var(--secondary-muted-edge)]">
                  per {product.unit_of_measurement}
                </span>
              </div>

              <div className="space-y-2 text-sm mb-3">
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
                    {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                  Quantity ({product.unit_of_measurement})
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="p-2 rounded-full border border-[var(--secondary-soft-highlight)]/30 hover:bg-[var(--primary-background)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <MinusIcon className="h-5 w-5 text-[var(--secondary-black)]" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      const minOrder = 1;
                      const maxOrder = product.stock_quantity || 5000;
                      if (!isNaN(val) && val >= minOrder && val <= maxOrder) {
                        setQuantity(val);
                      }
                    }}
                    min={1}
                    max={product.stock_quantity || 5000}
                    className="w-24 px-4 py-2 text-center rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-white outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)] font-medium"
                  />
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= (product.stock_quantity || 5000)}
                    className="p-2 rounded-full border border-[var(--secondary-soft-highlight)]/30 hover:bg-[var(--primary-background)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <PlusIcon className="h-5 w-5 text-[var(--secondary-black)]" />
                  </button>
                  <div className="flex-1 text-right">
                    <span className="text-2xl font-bold text-[var(--secondary-black)]">
                      ${(product.current_price * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[var(--secondary-black)] text-white rounded-full font-semibold hover:bg-[var(--secondary-muted-edge)] transition-all duration-200"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full font-semibold hover:bg-[var(--primary-accent3)] transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Supplier Information & Location */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Supplier Information */}
          <div className="bg-white rounded-2xl p-4 border border-[var(--secondary-soft-highlight)]/20">
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
                  </div>
                </div>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <Link
                  href={`/buyer/supplier/${product.seller.id}`}
                  className="px-3 py-1.5 bg-[var(--primary-background)] text-[var(--secondary-black)] rounded-full text-xs font-medium hover:bg-[var(--secondary-soft-highlight)]/20 transition-all duration-200"
                >
                  View Profile
                </Link>
                <button
                  onClick={handleMessageSeller}
                  disabled={isStartingConversation}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--primary-accent2)] text-white rounded-full text-xs font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChatBubbleLeftIcon className="h-3.5 w-3.5" />
                  {isStartingConversation ? "..." : "Message"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[var(--secondary-soft-highlight)]/20">
              <div className="text-center">
                <div className="text-lg font-bold text-[var(--primary-accent2)]">
                  {product.seller.product_count || 0}
                </div>
                <p className="text-xs text-[var(--secondary-muted-edge)]">
                  Products
                </p>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[var(--primary-accent2)]">
                  {typeof product.seller.average_rating === "number"
                    ? product.seller.average_rating.toFixed(1)
                    : "—"}
                </div>
                <p className="text-xs text-[var(--secondary-muted-edge)]">
                  Rating
                </p>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[var(--primary-accent2)]">
                  {product.seller.review_count || 0}
                </div>
                <p className="text-xs text-[var(--secondary-muted-edge)]">
                  Reviews
                </p>
              </div>
            </div>
          </div>

          {/* Location Map */}
          <div className="bg-white rounded-2xl p-4 border border-[var(--secondary-soft-highlight)]/20">
            <h2 className="text-base font-semibold text-[var(--secondary-black)] mb-3">
              Product Location
            </h2>
            <div className="aspect-video rounded-xl overflow-hidden border border-[var(--secondary-soft-highlight)]/20">
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Product Location Map"
              />
            </div>
            <div className="mt-3 flex items-start gap-2 text-sm text-[var(--secondary-muted-edge)]">
              <MapPinIcon className="h-4 w-4 flex-shrink-0 mt-0.5 text-[var(--primary-accent2)]" />
              <div>
                <p className="font-medium text-[var(--secondary-black)]">
                  {product.seller.location || "Caribbean Region"}
                </p>
                <p className="text-xs">Supplier</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <div className="bg-white rounded-2xl p-4 border border-[var(--secondary-soft-highlight)]/20 mb-6">
          <h2 className="text-base font-semibold text-[var(--secondary-black)] mb-3">
            Product Specifications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex justify-between py-2 border-b border-[var(--secondary-soft-highlight)]/20">
              <span className="text-xs text-[var(--secondary-muted-edge)]">
                Category:
              </span>
              <span className="text-xs font-medium text-[var(--secondary-black)]">
                {product.category}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--secondary-soft-highlight)]/20">
              <span className="text-xs text-[var(--secondary-muted-edge)]">
                Unit:
              </span>
              <span className="text-xs font-medium text-[var(--secondary-black)]">
                {product.unit_of_measurement}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--secondary-soft-highlight)]/20">
              <span className="text-xs text-[var(--secondary-muted-edge)]">
                Stock:
              </span>
              <span className="text-xs font-medium text-[var(--secondary-black)]">
                {product.stock_quantity} available
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--secondary-soft-highlight)]/20">
              <span className="text-xs text-[var(--secondary-muted-edge)]">
                Status:
              </span>
              <span className="text-xs font-medium text-[var(--secondary-black)]">
                {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            {product.tags && product.tags.length > 0 && (
              <div className="col-span-full flex flex-wrap gap-2 pt-2">
                <span className="text-xs text-[var(--secondary-muted-edge)] w-full mb-1">
                  Tags:
                </span>
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Shipping & Delivery */}
        <div className="bg-white rounded-2xl p-4 border border-[var(--secondary-soft-highlight)]/20">
          <div className="flex items-center gap-2 mb-3">
            <TruckIcon className="h-4 w-4 text-[var(--primary-accent2)]" />
            <h2 className="text-base font-semibold text-[var(--secondary-black)]">
              Shipping & Delivery
            </h2>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary-accent2)] mt-1.5 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-[var(--secondary-black)]">
                  Delivery Timeline
                </p>
                <p className="text-[var(--secondary-muted-edge)]">
                  3-5 business days after harvest date
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary-accent2)] mt-1.5 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-[var(--secondary-black)]">
                  Shipping Options
                </p>
                <p className="text-[var(--secondary-muted-edge)]">
                  Standard, Express, or Local pickup
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary-accent2)] mt-1.5 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-[var(--secondary-black)]">
                  Packaging
                </p>
                <p className="text-[var(--secondary-muted-edge)]">
                  Professional packaging with temperature control
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
