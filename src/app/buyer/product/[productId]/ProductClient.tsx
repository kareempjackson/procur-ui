"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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

interface ProductClientProps {
  productId: string;
}

export default function ProductClient({ productId }: ProductClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  // Mock product data - would come from API in real implementation
  const product = {
    id: productId,
    name: "Organic Cherry Tomatoes",
    description:
      "Premium grade organic cherry tomatoes, vine-ripened for optimal sweetness and flavor. Perfect for salads, roasting, or fresh eating. Our tomatoes are grown using sustainable farming practices and are free from synthetic pesticides.",
    price: 3.5,
    unit: "lb",
    minOrder: 100,
    maxOrder: 5000,
    stock: 2500,
    availability: "Pre-order",
    availabilityDate: "Oct 15, 2025",
    category: "Vegetables",
    images: [
      "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
    ],
    tags: ["Organic", "Pre-order", "Export Ready"],
    certifications: ["USDA Organic", "Fair Trade", "Non-GMO"],
    farm: {
      name: "Caribbean Farms Co.",
      rating: 4.8,
      totalReviews: 234,
      location: "Kingston, Jamaica",
      country: "Jamaica",
      verified: true,
      responseTime: "< 2 hours",
      totalOrders: 1250,
      onTimeDelivery: 98,
    },
    specifications: {
      variety: "Sweet 100",
      size: "1-2 inches",
      color: "Deep Red",
      shelfLife: "7-10 days refrigerated",
      packaging: "10 lb boxes",
      harvest: "Hand-picked",
    },
  };

  const handleAddToCart = () => {
    console.log("Added to cart:", { productId, quantity });
    alert(
      `Added ${quantity} ${product.unit}${quantity > 1 ? "s" : ""} to cart!`
    );
  };

  const handleBuyNow = () => {
    console.log("Buy now:", { productId, quantity });
    // Navigate to checkout
    window.location.href = "/buyer/checkout";
  };

  const incrementQuantity = () => {
    if (quantity < product.maxOrder) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > product.minOrder) {
      setQuantity(quantity - 1);
    }
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Product Images */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-[var(--secondary-soft-highlight)]/20 bg-white">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.availability === "Pre-order" && (
                <div className="absolute top-4 left-4 bg-[var(--primary-accent2)] text-white px-3 py-1.5 rounded-full text-sm font-bold">
                  Pre-order Available
                </div>
              )}
              <button
                onClick={() => setIsSaved(!isSaved)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-full hover:bg-white transition-all duration-200"
              >
                {isSaved ? (
                  <HeartSolidIcon className="h-6 w-6 text-[var(--primary-accent2)]" />
                ) : (
                  <HeartIcon className="h-6 w-6 text-[var(--secondary-black)]" />
                )}
              </button>
            </div>

            {/* Image Thumbnails */}
            <div className="flex gap-3">
              {product.images.map((image, index) => (
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
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-[var(--primary-background)] rounded-full text-sm font-medium text-[var(--secondary-black)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-[var(--secondary-muted-edge)] leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price and Availability */}
            <div className="bg-white rounded-2xl p-4 border border-[var(--secondary-soft-highlight)]/20">
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-bold text-[var(--secondary-black)]">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-base text-[var(--secondary-muted-edge)]">
                  per {product.unit}
                </span>
              </div>

              <div className="space-y-2 text-sm mb-3">
                <div className="flex justify-between">
                  <span className="text-[var(--secondary-muted-edge)]">
                    Minimum Order:
                  </span>
                  <span className="font-medium text-[var(--secondary-black)]">
                    {product.minOrder} {product.unit}s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--secondary-muted-edge)]">
                    Available Stock:
                  </span>
                  <span className="font-medium text-[var(--secondary-black)]">
                    {product.stock} {product.unit}s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--secondary-muted-edge)]">
                    Availability:
                  </span>
                  <span className="font-medium text-[var(--primary-accent2)]">
                    {product.availabilityDate}
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                  Quantity ({product.unit}s)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= product.minOrder}
                    className="p-2 rounded-full border border-[var(--secondary-soft-highlight)]/30 hover:bg-[var(--primary-background)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <MinusIcon className="h-5 w-5 text-[var(--secondary-black)]" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (
                        !isNaN(val) &&
                        val >= product.minOrder &&
                        val <= product.maxOrder
                      ) {
                        setQuantity(val);
                      }
                    }}
                    min={product.minOrder}
                    max={product.maxOrder}
                    className="w-24 px-4 py-2 text-center rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-white outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)] font-medium"
                  />
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.maxOrder}
                    className="p-2 rounded-full border border-[var(--secondary-soft-highlight)]/30 hover:bg-[var(--primary-background)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <PlusIcon className="h-5 w-5 text-[var(--secondary-black)]" />
                  </button>
                  <div className="flex-1 text-right">
                    <span className="text-2xl font-bold text-[var(--secondary-black)]">
                      ${(product.price * quantity).toFixed(2)}
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
                    {product.farm.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <h3 className="text-base font-semibold text-[var(--secondary-black)] truncate">
                      {product.farm.name}
                    </h3>
                    {product.farm.verified && (
                      <CheckBadgeIcon className="h-4 w-4 text-[var(--primary-accent2)] flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[var(--secondary-muted-edge)] mb-2">
                    <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{product.farm.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs flex-wrap">
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-[var(--secondary-black)]">
                        {product.farm.rating}
                      </span>
                      <span className="text-[var(--secondary-muted-edge)]">
                        ({product.farm.totalReviews})
                      </span>
                    </div>
                    <span className="text-[var(--secondary-muted-edge)]">
                      {product.farm.responseTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <Link
                  href={`/buyer/suppliers/${product.farm.name}`}
                  className="px-3 py-1.5 bg-[var(--primary-background)] text-[var(--secondary-black)] rounded-full text-xs font-medium hover:bg-[var(--secondary-soft-highlight)]/20 transition-all duration-200"
                >
                  View
                </Link>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--primary-accent2)] text-white rounded-full text-xs font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200">
                  <ChatBubbleLeftIcon className="h-3.5 w-3.5" />
                  Message
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[var(--secondary-soft-highlight)]/20">
              <div className="text-center">
                <div className="text-lg font-bold text-[var(--primary-accent2)]">
                  {product.farm.totalOrders}
                </div>
                <p className="text-xs text-[var(--secondary-muted-edge)]">
                  Orders
                </p>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[var(--primary-accent2)]">
                  {product.farm.onTimeDelivery}%
                </div>
                <p className="text-xs text-[var(--secondary-muted-edge)]">
                  On-Time
                </p>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[var(--primary-accent2)]">
                  {product.farm.responseTime}
                </div>
                <p className="text-xs text-[var(--secondary-muted-edge)]">
                  Response
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
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d238158.88377814756!2d-76.93854395!3d17.98506155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8edb3fd5f8e54777%3A0x4ebe73bcf1c3e1d2!2sKingston%2C%20Jamaica!5e0!3m2!1sen!2sus!4v1234567890123`}
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
                  {product.farm.location}
                </p>
                <p>{product.farm.country}</p>
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
            {Object.entries(product.specifications).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between py-2 border-b border-[var(--secondary-soft-highlight)]/20 last:border-0"
              >
                <span className="text-xs text-[var(--secondary-muted-edge)] capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}:
                </span>
                <span className="text-xs font-medium text-[var(--secondary-black)]">
                  {value}
                </span>
              </div>
            ))}
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
                  {product.specifications.packaging} with temperature control
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
