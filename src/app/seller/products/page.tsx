"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store";
import {
  deleteSellerProduct,
  fetchSellerProducts,
  updateSellerProduct,
} from "@/store/slices/sellerProductsSlice";
import ProcurLoader from "@/components/ProcurLoader";

// Enums matching the API
enum ProductStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  INACTIVE = "inactive",
  OUT_OF_STOCK = "out_of_stock",
  DISCONTINUED = "discontinued",
}

enum ProductCondition {
  NEW = "new",
  USED = "used",
  REFURBISHED = "refurbished",
}

interface Product {
  id: string;
  name: string;
  description?: string;
  short_description?: string;
  sku?: string;
  category: string;
  subcategory?: string;
  tags?: string[];
  base_price: number;
  sale_price?: number;
  currency: string;
  stock_quantity: number;
  min_stock_level?: number;
  unit_of_measurement: string;
  weight?: number;
  condition: ProductCondition | string;
  brand?: string;
  status: ProductStatus | string;
  is_featured: boolean;
  is_organic: boolean;
  is_local?: boolean;
  created_at: string;
  updated_at: string;
  images?: Array<{
    id: string;
    image_url: string;
    alt_text?: string;
    is_primary: boolean;
    display_order: number;
  }>;
}

interface ProductFilters {
  search: string;
  category: string;
  status: ProductStatus | "";
  is_featured: boolean | null;
  is_organic: boolean | null;
  is_local: boolean | null;
  sort_by: string;
  sort_order: "asc" | "desc";
}

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function SellerProductsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const {
    items: products,
    total,
    status: loadStatus,
    error,
  } = useSelector((state: RootState) => state.sellerProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Filter states
  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    category: "",
    status: "",
    is_featured: null,
    is_organic: null,
    is_local: null,
    sort_by: "created_at",
    sort_order: "desc",
  });

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Map sort key to API expected values
  const apiSortBy = useMemo(() => {
    switch (filters.sort_by) {
      case "base_price":
        return "price";
      default:
        return filters.sort_by;
    }
  }, [filters.sort_by]);

  // Fetch from API when filters/pagination change
  useEffect(() => {
    dispatch(
      fetchSellerProducts({
        page: currentPage,
        limit: itemsPerPage,
        search: filters.search || undefined,
        category: filters.category || undefined,
        status: (filters.status as string) || undefined,
        is_featured:
          filters.is_featured === null ? undefined : filters.is_featured,
        is_organic:
          filters.is_organic === null ? undefined : filters.is_organic,
        sort_by: apiSortBy,
        sort_order: filters.sort_order,
      })
    );
  }, [
    dispatch,
    currentPage,
    itemsPerPage,
    filters.search,
    filters.category,
    filters.status,
    filters.is_featured,
    filters.is_organic,
    apiSortBy,
    filters.sort_order,
  ]);

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const result = await dispatch(deleteSellerProduct(productId));

    if (deleteSellerProduct.rejected.match(result)) {
      const msg = (result.payload as string) || "Failed to delete product";

      const isFkError =
        msg.includes("foreign key") ||
        msg.includes("order_items") ||
        msg.toLowerCase().includes("violates foreign key");

      if (isFkError) {
        const archive = confirm(
          "This product has existing orders and cannot be deleted. Would you like to mark it as Discontinued instead?"
        );
        if (archive) {
          await dispatch(
            updateSellerProduct({
              id: productId,
              update: { status: "discontinued" },
            })
          );
        }
      } else {
        alert(msg);
      }
    }
  };

  const handleStatusChange = (productId: string, newStatus: ProductStatus) => {
    dispatch(
      updateSellerProduct({
        id: productId,
        update: { status: newStatus as unknown as string },
      })
    );
  };

  const getStatusColor = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.ACTIVE:
        return "bg-green-100 text-green-800";
      case ProductStatus.DRAFT:
        return "bg-gray-100 text-gray-800";
      case ProductStatus.INACTIVE:
        return "bg-yellow-100 text-yellow-800";
      case ProductStatus.OUT_OF_STOCK:
        return "bg-red-100 text-red-800";
      case ProductStatus.DISCONTINUED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPrimaryImage = (product: Product) => {
    const primaryImage = product.images?.find((img) => img.is_primary);
    return primaryImage?.image_url || product.images?.[0]?.image_url;
  };

  // Optional client-side filter for is_local (API doesn't currently filter by this)
  const visibleProducts = useMemo(() => {
    if (filters.is_local === null) return products;
    return products.filter((p) => p.is_local === filters.is_local);
  }, [products, filters.is_local]);

  const totalProducts = visibleProducts.length;
  const totalPages = Math.ceil((total || 0) / itemsPerPage);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation is provided by seller layout */}

      <main className="max-w-[1400px] mx-auto px-6 py-10">
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
              <span className="px-2 py-1 rounded-full bg-white text-[var(--secondary-black)]">
                Products
              </span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[32px] leading-tight text-[var(--secondary-black)] font-medium">
              My Products
            </h1>
            <p className="mt-2 text-[var(--secondary-muted-edge)]">
              Manage your product catalog and inventory
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/seller/add/product" className="btn btn-primary">
              Add Product
            </Link>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-ghost"
            >
              Filters
            </button>

            <div className="flex items-center gap-1 bg-white rounded-lg border border-[var(--secondary-soft-highlight)] p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={classNames(
                  "p-2 rounded",
                  viewMode === "grid"
                    ? "bg-[var(--primary-accent2)] text-white"
                    : "text-[var(--primary-base)] hover:bg-gray-50"
                )}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={classNames(
                  "p-2 rounded",
                  viewMode === "list"
                    ? "bg-[var(--primary-accent2)] text-white"
                    : "text-[var(--primary-base)] hover:bg-gray-50"
                )}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  placeholder="Search products..."
                  className="input w-full"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="input w-full"
                >
                  <option value="">All Categories</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Dairy & Eggs">Dairy & Eggs</option>
                  <option value="Meat">Meat</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Pantry">Pantry</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="input w-full"
                >
                  <option value="">All Status</option>
                  <option value={ProductStatus.ACTIVE}>Active</option>
                  <option value={ProductStatus.DRAFT}>Draft</option>
                  <option value={ProductStatus.INACTIVE}>Inactive</option>
                  <option value={ProductStatus.OUT_OF_STOCK}>
                    Out of Stock
                  </option>
                  <option value={ProductStatus.DISCONTINUED}>
                    Discontinued
                  </option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                  Sort By
                </label>
                <select
                  value={`${filters.sort_by}-${filters.sort_order}`}
                  onChange={(e) => {
                    const [sort_by, sort_order] = e.target.value.split("-");
                    handleFilterChange("sort_by", sort_by);
                    handleFilterChange("sort_order", sort_order);
                  }}
                  className="input w-full"
                >
                  <option value="created_at-desc">Newest First</option>
                  <option value="created_at-asc">Oldest First</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="base_price-asc">Price Low-High</option>
                  <option value="base_price-desc">Price High-Low</option>
                  <option value="stock_quantity-desc">Stock High-Low</option>
                </select>
              </div>
            </div>

            {/* Filter Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.is_featured === true}
                  onChange={(e) =>
                    handleFilterChange(
                      "is_featured",
                      e.target.checked ? true : null
                    )
                  }
                  className="mr-2"
                />
                <span className="text-sm">Featured</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.is_organic === true}
                  onChange={(e) =>
                    handleFilterChange(
                      "is_organic",
                      e.target.checked ? true : null
                    )
                  }
                  className="mr-2"
                />
                <span className="text-sm">Organic</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.is_local === true}
                  onChange={(e) =>
                    handleFilterChange(
                      "is_local",
                      e.target.checked ? true : null
                    )
                  }
                  className="mr-2"
                />
                <span className="text-sm">Local</span>
              </label>
            </div>
          </div>
        )}

        {/* Products Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[var(--primary-base)]">
            {total ?? 0} products found
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn btn-ghost h-9 px-3 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-[var(--primary-base)]">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="btn btn-ghost h-9 px-3 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loadStatus === "loading" && (
          <ProcurLoader size="lg" text="Loading products..." />
        )}

        {/* Products Grid/List */}
        {loadStatus !== "loading" && visibleProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[var(--secondary-black)] mb-2">
              No products found
            </h3>
            <p className="text-[var(--primary-base)] mb-6">
              {filters.search || filters.category || filters.status
                ? "Try adjusting your filters or search terms"
                : "Get started by adding your first product"}
            </p>
            <Link href="/seller/add/product" className="btn btn-primary">
              Add Your First Product
            </Link>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {visibleProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden group transition-colors"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  {getPrimaryImage(product) ? (
                    <img
                      src={getPrimaryImage(product)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-300"
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
                    </div>
                  )}

                  {/* Status Badge */}
                  {product.status !== ProductStatus.ACTIVE && (
                    <div className="absolute top-2 left-2">
                      <span
                        className={classNames(
                          "px-2 py-0.5 text-[10px] font-bold rounded text-white",
                          product.status === ProductStatus.DRAFT
                            ? "bg-gray-600"
                            : product.status === ProductStatus.INACTIVE
                              ? "bg-yellow-600"
                              : product.status === ProductStatus.OUT_OF_STOCK
                                ? "bg-red-600"
                                : "bg-red-700"
                        )}
                      >
                        {product.status === ProductStatus.OUT_OF_STOCK
                          ? "Out of Stock"
                          : String(product.status).toUpperCase()}
                      </span>
                    </div>
                  )}

                  {/* Sale Badge */}
                  {product.sale_price &&
                    product.sale_price < product.base_price && (
                      <div className="absolute top-2 left-2 bg-[var(--primary-accent2)] text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                        {Math.round(
                          ((product.base_price - product.sale_price) /
                            product.base_price) *
                            100
                        )}
                        % OFF
                      </div>
                    )}

                  {/* Feature Badges - Top Right */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {product.is_featured && (
                      <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    )}
                    {product.is_organic && (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
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
                      </div>
                    )}
                    {product.is_local && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <Link
                      href={`/seller/products/${product.id}/edit`}
                      className="text-sm font-semibold text-[var(--secondary-black)] line-clamp-1 flex-1 hover:text-[var(--primary-accent2)] transition-colors"
                    >
                      {product.name}
                    </Link>
                    <select
                      value={product.status}
                      onChange={(e) =>
                        handleStatusChange(
                          product.id,
                          e.target.value as ProductStatus
                        )
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="text-[10px] border border-[var(--secondary-soft-highlight)] rounded px-1.5 py-0.5 font-medium focus:ring-1 focus:ring-[var(--primary-accent2)] focus:border-[var(--primary-accent2)] transition-colors"
                    >
                      <option value={ProductStatus.DRAFT}>Draft</option>
                      <option value={ProductStatus.ACTIVE}>Active</option>
                      <option value={ProductStatus.INACTIVE}>Inactive</option>
                      <option value={ProductStatus.OUT_OF_STOCK}>
                        Out of Stock
                      </option>
                      <option value={ProductStatus.DISCONTINUED}>
                        Discontinued
                      </option>
                    </select>
                  </div>

                  <div className="text-[11px] text-[var(--primary-base)] mb-2">
                    {product.category}
                    {product.sku && (
                      <span className="ml-1 text-[var(--secondary-muted-edge)]">
                        · SKU: {product.sku}
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 mb-2">
                    {product.sale_price &&
                    product.sale_price < product.base_price ? (
                      <>
                        <span className="text-lg font-bold text-[var(--primary-accent2)]">
                          ${product.sale_price.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          ${product.base_price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-[var(--secondary-black)]">
                        ${product.base_price.toFixed(2)}
                      </span>
                    )}
                    <span className="text-[11px] text-[var(--primary-base)]">
                      / {product.unit_of_measurement}
                    </span>
                  </div>

                  {/* Stock Info */}
                  <div className="flex items-center justify-between text-[11px] mb-3">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={classNames(
                          "w-1.5 h-1.5 rounded-full",
                          product.stock_quantity > 10
                            ? "bg-green-500"
                            : product.stock_quantity > 0
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        )}
                      ></div>
                      <span className="font-medium text-[var(--secondary-black)]">
                        {product.stock_quantity} in stock
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons - Sleek Design */}
                  <div className="grid grid-cols-2 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Link
                      href={`/seller/products/${product.id}/edit`}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[var(--primary-accent2)] text-white rounded-full text-xs font-medium hover:bg-[var(--primary-accent3)] transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </Link>
                    <Link
                      href={`/seller/products/${product.id}/preview`}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-[var(--secondary-black)] rounded-full text-xs font-medium hover:bg-gray-50 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-[var(--secondary-soft-highlight)]">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-[var(--secondary-black)]">
                      Product
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-[var(--secondary-black)]">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-[var(--secondary-black)]">
                      Price
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-[var(--secondary-black)]">
                      Stock
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-[var(--secondary-black)]">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-[var(--secondary-black)]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-[var(--secondary-soft-highlight)] last:border-0 hover:bg-gray-25"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                            {getPrimaryImage(product) ? (
                              <img
                                src={getPrimaryImage(product)}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-gray-300"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div>
                            <Link
                              href={`/seller/products/${product.id}/edit`}
                              className="font-medium text-[var(--secondary-black)] hover:text-[var(--primary-accent2)] transition-colors"
                            >
                              {product.name}
                            </Link>
                            {product.sku && (
                              <div className="text-sm text-[var(--primary-base)]">
                                SKU: {product.sku}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[var(--primary-base)]">
                        {product.category}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {product.sale_price &&
                          product.sale_price < product.base_price ? (
                            <>
                              <span className="font-semibold text-[var(--primary-accent2)]">
                                ${product.sale_price.toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                ${product.base_price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="font-semibold text-[var(--secondary-black)]">
                              ${product.base_price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={classNames(
                            "px-2 py-1 text-xs rounded-full",
                            product.stock_quantity > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          )}
                        >
                          {product.stock_quantity} {product.unit_of_measurement}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={classNames(
                            "px-2 py-1 text-xs rounded-full font-medium",
                            getStatusColor(product.status as ProductStatus)
                          )}
                        >
                          {String(product.status)
                            .replace("_", " ")
                            .toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/seller/products/${product.id}/edit`}
                            className="btn btn-ghost h-8 px-3 text-sm hover:bg-[var(--primary-accent2)]/10 hover:text-[var(--primary-accent2)]"
                          >
                            Edit
                          </Link>
                          <Link
                            href={`/seller/products/${product.id}/preview`}
                            className="btn btn-ghost h-8 px-3 text-sm hover:bg-blue-50 hover:text-blue-600"
                            title="View as Buyer"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="btn btn-ghost h-8 px-2 text-red-600 hover:bg-red-50"
                            title="Delete Product"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="btn btn-ghost h-9 px-3 disabled:opacity-50"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn btn-ghost h-9 px-3 disabled:opacity-50"
            >
              Previous
            </button>

            {/* Page Numbers */}
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pageNum = Math.max(1, currentPage - 2) + i;
              if (pageNum > totalPages) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={classNames(
                    "h-9 px-3 rounded text-sm",
                    pageNum === currentPage
                      ? "bg-[var(--primary-accent2)] text-white"
                      : "text-[var(--primary-base)] hover:bg-gray-50"
                  )}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="btn btn-ghost h-9 px-3 disabled:opacity-50"
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="btn btn-ghost h-9 px-3 disabled:opacity-50"
            >
              Last
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
