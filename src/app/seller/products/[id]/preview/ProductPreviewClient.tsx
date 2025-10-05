"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getApiClient } from "@/lib/apiClient";
import { useAppSelector } from "@/store";
import type { SellerProduct } from "@/store/slices/sellerProductsSlice";
import ProcurLoader from "@/components/ProcurLoader";

interface ProductPreviewClientProps {
  productId: string;
}

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductPreviewClient({
  productId,
}: ProductPreviewClientProps) {
  const router = useRouter();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<SellerProduct | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const apiClient = getApiClient(() => accessToken);
        const { data } = await apiClient.get(`/sellers/products/${productId}`);
        setProduct(data as SellerProduct);
      } catch (err: any) {
        setError(err.message || "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };

    if (productId && accessToken) {
      fetchProduct();
    }
  }, [productId, accessToken]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--primary-background)] flex items-center justify-center">
        <ProcurLoader />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[var(--primary-background)]">
        <main className="max-w-7xl mx-auto px-6 py-10">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <h2 className="text-red-800 font-medium mb-2">
              Error Loading Product
            </h2>
            <p className="text-red-600">{error || "Product not found"}</p>
            <Link
              href="/seller/products"
              className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
            >
              Back to Products
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const images = product.images || [];
  const currentImage = images[selectedImageIndex]?.image_url;

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Breadcrumbs */}
        <nav
          className="mb-6 text-sm text-[var(--primary-base)]"
          aria-label="Breadcrumb"
        >
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="px-2 py-1 rounded-full hover:bg-white">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                href="/seller"
                className="px-2 py-1 rounded-full hover:bg-white"
              >
                Seller
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                href="/seller/products"
                className="px-2 py-1 rounded-full hover:bg-white"
              >
                Products
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <span className="px-2 py-1 rounded-full bg-white text-[var(--secondary-black)]">
                Preview
              </span>
            </li>
          </ol>
        </nav>

        {/* Header with Actions */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-[32px] leading-tight text-[var(--secondary-black)] font-medium">
                Buyer Preview
              </h1>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-lg border border-blue-200">
                Buyer's View
              </span>
            </div>
            <p className="text-[var(--secondary-muted-edge)]">
              This is how your product appears to potential buyers
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/seller/products/${productId}/edit`}
              className="px-6 py-3 bg-white border border-[var(--primary-border)] text-[var(--secondary-black)] rounded-full hover:bg-gray-50 transition-colors font-medium"
            >
              Edit Product
            </Link>
            <Link
              href="/seller/products"
              className="px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] transition-colors font-medium"
            >
              Back to Products
            </Link>
          </div>
        </div>

        {/* Product Detail Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-[var(--secondary-soft-highlight)]">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <svg
                    className="w-16 h-16 text-gray-300 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm text-gray-400">No image available</p>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.is_featured && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 text-white text-sm rounded-lg font-medium shadow-lg">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Featured
                  </div>
                )}
                {product.is_organic && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg font-medium shadow-lg">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Organic
                  </div>
                )}
                {product.sale_price &&
                  product.sale_price < product.base_price && (
                    <div className="px-3 py-1.5 bg-[var(--primary-accent2)] text-white text-sm rounded-lg font-bold shadow-lg">
                      {Math.round(
                        ((product.base_price - product.sale_price) /
                          product.base_price) *
                          100
                      )}
                      % OFF
                    </div>
                  )}
              </div>
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={classNames(
                      "aspect-square rounded-lg overflow-hidden border-2 transition-all",
                      selectedImageIndex === index
                        ? "border-[var(--primary-accent2)] ring-2 ring-[var(--primary-accent2)]/20"
                        : "border-[var(--secondary-soft-highlight)] hover:border-[var(--primary-accent2)]/50"
                    )}
                  >
                    <img
                      src={image.image_url}
                      alt={image.alt_text || `Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Product Name & Category */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-3xl font-semibold text-[var(--secondary-black)]">
                  {product.name}
                </h2>
              </div>
              <p className="text-[var(--primary-base)] text-lg">
                {product.category}
                {product.subcategory && ` · ${product.subcategory}`}
              </p>
            </div>

            {/* Short Description */}
            {product.short_description && (
              <p className="text-[var(--secondary-black)] text-lg leading-relaxed">
                {product.short_description}
              </p>
            )}

            {/* Price */}
            <div className="p-6 bg-gray-50 rounded-xl border border-[var(--secondary-soft-highlight)]">
              <div className="flex items-baseline gap-3 mb-2">
                {product.sale_price &&
                product.sale_price < product.base_price ? (
                  <>
                    <span className="text-4xl font-bold text-[var(--primary-accent2)]">
                      ${product.sale_price.toFixed(2)}
                    </span>
                    <span className="text-2xl text-gray-400 line-through">
                      ${product.base_price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-4xl font-bold text-[var(--secondary-black)]">
                    ${product.base_price.toFixed(2)}
                  </span>
                )}
                <span className="text-xl text-[var(--primary-base)]">
                  / {product.unit_of_measurement}
                </span>
              </div>
              <p className="text-sm text-[var(--secondary-muted-edge)]">
                Currency: {product.currency || "XCD"}
              </p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-3">
              <div
                className={classNames(
                  "px-4 py-2 rounded-lg font-medium",
                  product.stock_quantity > 10
                    ? "bg-green-100 text-green-800"
                    : product.stock_quantity > 0
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                )}
              >
                {product.stock_quantity > 0
                  ? `${product.stock_quantity} in stock`
                  : "Out of stock"}
              </div>
              <div className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium capitalize">
                {product.condition}
              </div>
            </div>

            {/* Product Details */}
            {product.description && (
              <div className="bg-white rounded-xl border border-[var(--secondary-soft-highlight)] p-6">
                <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-3">
                  Product Description
                </h3>
                <p className="text-[var(--primary-base)] leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {/* Additional Info */}
            <div className="bg-white rounded-xl border border-[var(--secondary-soft-highlight)] p-6">
              <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-4">
                Product Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {product.sku && (
                  <div>
                    <div className="text-[var(--secondary-muted-edge)] mb-1">
                      SKU
                    </div>
                    <div className="text-[var(--secondary-black)] font-medium">
                      {product.sku}
                    </div>
                  </div>
                )}
                {product.brand && (
                  <div>
                    <div className="text-[var(--secondary-muted-edge)] mb-1">
                      Brand
                    </div>
                    <div className="text-[var(--secondary-black)] font-medium">
                      {product.brand}
                    </div>
                  </div>
                )}
                {product.model && (
                  <div>
                    <div className="text-[var(--secondary-muted-edge)] mb-1">
                      Model
                    </div>
                    <div className="text-[var(--secondary-black)] font-medium">
                      {product.model}
                    </div>
                  </div>
                )}
                {product.color && (
                  <div>
                    <div className="text-[var(--secondary-muted-edge)] mb-1">
                      Color
                    </div>
                    <div className="text-[var(--secondary-black)] font-medium">
                      {product.color}
                    </div>
                  </div>
                )}
                {product.size && (
                  <div>
                    <div className="text-[var(--secondary-muted-edge)] mb-1">
                      Size
                    </div>
                    <div className="text-[var(--secondary-black)] font-medium">
                      {product.size}
                    </div>
                  </div>
                )}
                {product.barcode && (
                  <div>
                    <div className="text-[var(--secondary-muted-edge)] mb-1">
                      Barcode
                    </div>
                    <div className="text-[var(--secondary-black)] font-medium">
                      {product.barcode}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-[var(--secondary-black)] mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-[var(--primary-accent1)] text-[var(--secondary-black)] rounded-lg text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Buttons (as buyers would see) */}
            <div className="pt-4 flex gap-3">
              <button
                disabled
                className="flex-1 px-8 py-4 bg-[var(--primary-accent2)] text-white rounded-full font-medium text-lg opacity-50 cursor-not-allowed"
              >
                Add to Cart
              </button>
              <button
                disabled
                className="px-6 py-4 border-2 border-[var(--primary-border)] text-[var(--secondary-black)] rounded-full hover:bg-gray-50 transition-colors opacity-50 cursor-not-allowed"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
            <p className="text-xs text-[var(--secondary-muted-edge)] text-center">
              Preview mode - Buttons are disabled
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
