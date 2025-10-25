"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchAllProducts,
  selectAllProducts,
  selectAllProductsStatus,
  selectAllProductsError,
  selectVendors,
} from "@/store/slices/governmentVendorsSlice";
import { safeNumber } from "@/lib/utils/dataHelpers";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterUploadedBy, setFilterUploadedBy] = useState<string>("all");

  // Redux state
  const products = useAppSelector(selectAllProducts);
  const productsStatus = useAppSelector(selectAllProductsStatus);
  const productsError = useAppSelector(selectAllProductsError);
  const vendors = useAppSelector(selectVendors);

  // Fetch products on mount
  useEffect(() => {
    if (productsStatus === "idle") {
      dispatch(fetchAllProducts({ page: 1, limit: 100 }));
    }
  }, [productsStatus, dispatch]);

  // Refresh handler
  const handleRefresh = () => {
    dispatch(fetchAllProducts({ page: 1, limit: 100 }));
  };

  // Mock products data for fallback
  const mockProducts = [
    {
      id: "1",
      name: "Organic Roma Tomatoes",
      vendor: "Green Valley Farms",
      vendorId: "1",
      quantity: "500 kg",
      pricePerUnit: "$2.50/kg",
      harvestDate: "2024-09-20",
      uploadDate: "2024-09-21",
      status: "available",
      uploadedBy: "vendor",
      qualityGrade: "Premium",
      location: "Kingston",
    },
    {
      id: "2",
      name: "Fresh Iceberg Lettuce",
      vendor: "Green Valley Farms",
      vendorId: "1",
      quantity: "200 kg",
      pricePerUnit: "$3.20/kg",
      harvestDate: "2024-09-22",
      uploadDate: "2024-09-22",
      status: "sold",
      uploadedBy: "government",
      qualityGrade: "Grade A",
      location: "Kingston",
    },
    {
      id: "3",
      name: "Sweet Bell Peppers",
      vendor: "Highland Produce Ltd.",
      vendorId: "3",
      quantity: "300 kg",
      pricePerUnit: "$2.80/kg",
      harvestDate: "2024-09-18",
      uploadDate: "2024-09-18",
      status: "available",
      uploadedBy: "vendor",
      qualityGrade: "Grade A",
      location: "Christiana",
    },
    {
      id: "4",
      name: "Orange Sweet Potatoes",
      vendor: "Coastal Farms Group",
      vendorId: "4",
      quantity: "1,000 kg",
      pricePerUnit: "$1.80/kg",
      harvestDate: "2024-09-15",
      uploadDate: "2024-09-15",
      status: "available",
      uploadedBy: "government",
      qualityGrade: "Grade B",
      location: "St. Elizabeth",
    },
    {
      id: "5",
      name: "Cavendish Bananas",
      vendor: "Mountain Fresh Produce",
      vendorId: "5",
      quantity: "750 kg",
      pricePerUnit: "$1.50/kg",
      harvestDate: "2024-09-25",
      uploadDate: "2024-09-26",
      status: "reserved",
      uploadedBy: "vendor",
      qualityGrade: "Premium",
      location: "Portland",
    },
  ];

  // Use API data or fallback to mock
  const displayProducts = products.length > 0 ? products : mockProducts;

  // Create a map of vendor names for quick lookup
  const vendorMap = useMemo(() => {
    const map = new Map();
    vendors.forEach((v) => map.set(v.id, v.name));
    return map;
  }, [vendors]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: displayProducts.length,
      available: displayProducts.filter(
        (p) => !p.harvest_date || new Date(p.harvest_date) <= new Date()
      ).length,
      totalQuantity: displayProducts.reduce(
        (sum, p) => sum + safeNumber(p.quantity_available),
        0
      ),
      totalValue: displayProducts.reduce((sum, p) => {
        const qty = safeNumber(p.quantity_available);
        const price = safeNumber(p.price_per_unit);
        return sum + qty * price;
      }, 0),
    };
  }, [displayProducts]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return displayProducts.filter((product) => {
      const vendorName =
        vendorMap.get(product.vendor_id) || product.vendor || "";
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.category &&
          product.category.toLowerCase().includes(searchQuery.toLowerCase()));

      // For status filter: check if product is available (has harvest date that's passed)
      const isAvailable = product.harvest_date
        ? new Date(product.harvest_date) <= new Date()
        : true;
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "available" && isAvailable) ||
        (filterStatus === "reserved" && !isAvailable);

      // Note: API doesn't have uploadedBy field, so we'll skip that filter for now
      // const matchesUploadedBy =
      //   filterUploadedBy === "all" || product.uploadedBy === filterUploadedBy;

      return matchesSearch && matchesStatus;
    });
  }, [displayProducts, searchQuery, filterStatus, vendorMap]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "available":
        return {
          label: "Available",
          color: "bg-[var(--primary-base)]/10 text-[color:var(--primary-base)]",
        };
      case "reserved":
        return {
          label: "Reserved",
          color: "bg-yellow-100 text-yellow-800",
        };
      case "sold":
        return {
          label: "Sold",
          color: "bg-gray-100 text-gray-800",
        };
      default:
        return {
          label: "Unknown",
          color: "bg-gray-100 text-gray-800",
        };
    }
  };

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-[color:var(--secondary-black)]">
              Products Management
            </h1>
            <p className="text-sm text-[color:var(--secondary-muted-edge)] mt-1">
              Monitor and manage product listings across all vendors
              {productsStatus === "loading" && " • Loading..."}
              {productsError && " • Error loading data"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={productsStatus === "loading"}
              className="inline-flex items-center gap-2 rounded-full bg-white border border-[color:var(--secondary-soft-highlight)] text-[color:var(--secondary-black)] px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowPathIcon
                className={`h-5 w-5 ${
                  productsStatus === "loading" ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>
            <Link
              href="/government/products/upload"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--primary-accent2)] text-white px-5 py-2.5 text-sm font-medium hover:bg-[var(--primary-accent3)] transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2"
            >
              <PlusIcon className="h-5 w-5" />
              Upload Product
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {productsError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 mb-6">
            <p className="text-sm text-red-800">
              Error loading products: {productsError}
            </p>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)] mb-2">
              Total Products
            </div>
            <div className="text-3xl font-semibold text-[color:var(--secondary-black)]">
              {productsStatus === "loading" ? "..." : stats.total}
            </div>
          </div>
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)] mb-2">
              Available
            </div>
            <div className="text-3xl font-semibold text-[color:var(--primary-base)]">
              {productsStatus === "loading" ? "..." : stats.available}
            </div>
          </div>
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)] mb-2">
              Total Quantity
            </div>
            <div className="text-3xl font-semibold text-[color:var(--secondary-black)]">
              {productsStatus === "loading"
                ? "..."
                : stats.totalQuantity.toLocaleString()}
            </div>
          </div>
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)] mb-2">
              Total Value
            </div>
            <div className="text-3xl font-semibold text-[color:var(--secondary-black)]">
              $
              {productsStatus === "loading"
                ? "..."
                : stats.totalValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                <input
                  type="text"
                  placeholder="Search products by name or vendor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <FunnelIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="rounded-full border border-[color:var(--secondary-soft-highlight)] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)]"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="reserved">Expected Soon</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            // Compute status from harvest date
            const isAvailable = product.harvest_date
              ? new Date(product.harvest_date) <= new Date()
              : true;
            const productStatus = isAvailable ? "available" : "reserved";
            const statusConfig = getStatusConfig(productStatus);

            // Get vendor name
            const vendorName =
              vendorMap.get(product.vendor_id) ||
              product.vendor ||
              "Unknown Vendor";

            return (
              <div
                key={product.id}
                className="group rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1"
              >
                {/* Product Image Placeholder - Sleeker */}
                <div className="relative h-48 bg-gradient-to-br from-[var(--primary-accent1)]/30 via-[var(--primary-accent2)]/20 to-[var(--primary-background)] overflow-hidden">
                  {/* Decorative pattern overlay */}
                  <div className="absolute inset-0 opacity-5">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
                        backgroundSize: "20px 20px",
                      }}
                    ></div>
                  </div>

                  <div className="relative h-full flex items-center justify-center">
                    <div className="text-center transform transition-transform duration-300 group-hover:scale-110">
                      <div className="text-5xl mb-3 filter drop-shadow-lg">
                        {product.organic_certified ? "🌱" : "🌾"}
                      </div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--secondary-black)] bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
                        {product.category || "Product"}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge - Absolute positioned */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-semibold backdrop-blur-md ${statusConfig.color} shadow-lg`}
                    >
                      {statusConfig.label}
                    </span>
                  </div>
                </div>

                {/* Product Details - Sleeker */}
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-[color:var(--secondary-black)] mb-1 line-clamp-2 leading-tight">
                      {product.name}
                      {product.variety && (
                        <span className="block text-xs font-normal text-[color:var(--secondary-muted-edge)] mt-1">
                          Variety: {product.variety}
                        </span>
                      )}
                    </h3>
                  </div>

                  <Link
                    href={`/government/vendors/${
                      product.vendor_id || product.vendorId
                    }`}
                    className="inline-flex items-center gap-1.5 text-sm text-[color:var(--primary-accent2)] hover:text-[var(--primary-accent3)] font-medium mb-4 group/link transition-colors"
                  >
                    <span className="group-hover/link:underline">
                      {vendorName}
                    </span>
                    <svg
                      className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>

                  {/* Stats Grid - Sleeker */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-3 border border-gray-100">
                      <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)] mb-1 font-semibold">
                        Quantity
                      </div>
                      <div className="text-sm font-bold text-[color:var(--secondary-black)]">
                        {product.quantity_available || product.quantity}
                      </div>
                      <div className="text-[10px] text-[color:var(--secondary-muted-edge)]">
                        {product.unit_of_measurement || "units"}
                      </div>
                    </div>

                    {product.price_per_unit !== undefined &&
                      product.price_per_unit !== null && (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-100/50 rounded-xl p-3 border border-green-100">
                          <div className="text-[10px] uppercase tracking-wider text-green-700 mb-1 font-semibold">
                            Price
                          </div>
                          <div className="text-sm font-bold text-green-900">
                            ${safeNumber(product.price_per_unit).toFixed(2)}
                          </div>
                          <div className="text-[10px] text-green-600">
                            per {product.unit_of_measurement || "unit"}
                          </div>
                        </div>
                      )}

                    {product.quality_grade && !product.price_per_unit && (
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-100/50 rounded-xl p-3 border border-blue-100">
                        <div className="text-[10px] uppercase tracking-wider text-blue-700 mb-1 font-semibold">
                          Quality
                        </div>
                        <div className="text-sm font-bold text-blue-900">
                          {product.quality_grade || product.qualityGrade}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Section - Sleeker */}
                  <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
                    {product.harvest_date && (
                      <div className="inline-flex items-center gap-1.5 text-xs text-[color:var(--secondary-muted-edge)] bg-gray-50 px-2.5 py-1.5 rounded-lg">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        <span>
                          {new Date(
                            product.harvest_date || product.harvestDate
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                    {product.organic_certified && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-2.5 py-1.5 text-xs font-semibold border border-green-200 shadow-sm">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Organic
                      </span>
                    )}
                    {product.quality_grade && product.price_per_unit && (
                      <span className="inline-flex items-center rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-2.5 py-1.5 text-xs font-semibold border border-purple-100">
                        {product.quality_grade}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-12">
            <div className="text-center">
              <p className="text-sm text-[color:var(--secondary-muted-edge)]">
                No products found matching your criteria.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
