"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import { getApiClient } from "@/lib/apiClient";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

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
  min_stock_level: number;
  unit_of_measurement: string;
  weight?: number;
  condition: ProductCondition;
  brand?: string;
  status: ProductStatus;
  is_featured: boolean;
  is_organic: boolean;
  is_local: boolean;
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
  const { token } = useSelector((state: RootState) => state.auth);

  // Demo products data
  const demoProducts: Product[] = [
    {
      id: "1",
      name: "Organic Roma Tomatoes",
      description:
        "Fresh, vine-ripened organic Roma tomatoes perfect for sauces and cooking. Grown using sustainable farming practices.",
      short_description:
        "Fresh, vine-ripened organic Roma tomatoes perfect for sauces and cooking.",
      sku: "TOM-ROM-001",
      category: "Vegetables",
      subcategory: "Fresh Vegetables",
      tags: ["organic", "fresh", "local", "vine-ripened"],
      base_price: 4.99,
      sale_price: 3.99,
      currency: "USD",
      stock_quantity: 150,
      min_stock_level: 20,
      unit_of_measurement: "lb",
      weight: 1.0,
      condition: ProductCondition.NEW,
      brand: "FreshFarm Co.",
      status: ProductStatus.ACTIVE,
      is_featured: true,
      is_organic: true,
      is_local: true,
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-20T14:45:00Z",
      images: [
        {
          id: "img1",
          image_url:
            "https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400&h=400&fit=crop&crop=center",
          alt_text: "Fresh organic Roma tomatoes",
          is_primary: true,
          display_order: 0,
        },
      ],
    },
    {
      id: "2",
      name: "Free-Range Chicken Eggs",
      description:
        "Farm-fresh eggs from free-range chickens. Rich in protein and perfect for any meal.",
      short_description: "Farm-fresh eggs from free-range chickens.",
      sku: "EGG-FR-12",
      category: "Dairy & Eggs",
      subcategory: "Eggs",
      tags: ["free-range", "fresh", "protein"],
      base_price: 6.5,
      currency: "USD",
      stock_quantity: 45,
      min_stock_level: 10,
      unit_of_measurement: "dozen",
      condition: ProductCondition.NEW,
      brand: "Happy Hens Farm",
      status: ProductStatus.ACTIVE,
      is_featured: false,
      is_organic: false,
      is_local: true,
      created_at: "2024-01-10T08:15:00Z",
      updated_at: "2024-01-18T16:20:00Z",
      images: [
        {
          id: "img2",
          image_url:
            "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop&crop=center",
          alt_text: "Free-range chicken eggs",
          is_primary: true,
          display_order: 0,
        },
      ],
    },
    {
      id: "3",
      name: "Organic Baby Spinach",
      description:
        "Tender, nutrient-rich organic baby spinach leaves. Perfect for salads, smoothies, and cooking.",
      short_description: "Tender, nutrient-rich organic baby spinach leaves.",
      sku: "SPN-BAB-001",
      category: "Vegetables",
      subcategory: "Leafy Greens",
      tags: ["organic", "baby spinach", "leafy greens", "superfood"],
      base_price: 3.49,
      currency: "USD",
      stock_quantity: 8,
      min_stock_level: 15,
      unit_of_measurement: "lb",
      condition: ProductCondition.NEW,
      status: ProductStatus.OUT_OF_STOCK,
      is_featured: false,
      is_organic: true,
      is_local: false,
      created_at: "2024-01-12T12:00:00Z",
      updated_at: "2024-01-22T09:30:00Z",
      images: [
        {
          id: "img3",
          image_url:
            "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop&crop=center",
          alt_text: "Fresh organic baby spinach",
          is_primary: true,
          display_order: 0,
        },
      ],
    },
    {
      id: "4",
      name: "Artisan Sourdough Bread",
      description:
        "Handcrafted sourdough bread made with traditional methods and organic flour.",
      short_description:
        "Handcrafted sourdough bread made with traditional methods.",
      sku: "BRD-SOU-001",
      category: "Bakery",
      subcategory: "Bread",
      tags: ["artisan", "sourdough", "handcrafted", "organic flour"],
      base_price: 8.99,
      currency: "USD",
      stock_quantity: 25,
      min_stock_level: 5,
      unit_of_measurement: "piece",
      condition: ProductCondition.NEW,
      brand: "Artisan Bakery",
      status: ProductStatus.ACTIVE,
      is_featured: true,
      is_organic: false,
      is_local: true,
      created_at: "2024-01-08T06:45:00Z",
      updated_at: "2024-01-19T11:15:00Z",
      images: [
        {
          id: "img4",
          image_url:
            "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=400&fit=crop&crop=center",
          alt_text: "Artisan sourdough bread",
          is_primary: true,
          display_order: 0,
        },
      ],
    },
    {
      id: "5",
      name: "Grass-Fed Ground Beef",
      description:
        "Premium grass-fed ground beef from local pasture-raised cattle. No hormones or antibiotics.",
      short_description:
        "Premium grass-fed ground beef from local pasture-raised cattle.",
      sku: "BEF-GRD-001",
      category: "Meat",
      subcategory: "Beef",
      tags: ["grass-fed", "local", "no hormones", "pasture-raised"],
      base_price: 12.99,
      sale_price: 10.99,
      currency: "USD",
      stock_quantity: 32,
      min_stock_level: 8,
      unit_of_measurement: "lb",
      condition: ProductCondition.NEW,
      brand: "Green Pastures Ranch",
      status: ProductStatus.ACTIVE,
      is_featured: false,
      is_organic: false,
      is_local: true,
      created_at: "2024-01-05T14:20:00Z",
      updated_at: "2024-01-21T10:45:00Z",
      images: [
        {
          id: "img5",
          image_url:
            "https://images.unsplash.com/photo-1588347818121-69f25c4c6c0d?w=400&h=400&fit=crop&crop=center",
          alt_text: "Grass-fed ground beef",
          is_primary: true,
          display_order: 0,
        },
      ],
    },
    {
      id: "6",
      name: "Organic Honey",
      description:
        "Pure, raw organic honey harvested from local beehives. Unfiltered and unpasteurized.",
      short_description:
        "Pure, raw organic honey harvested from local beehives.",
      sku: "HON-ORG-001",
      category: "Pantry",
      subcategory: "Sweeteners",
      tags: ["organic", "raw", "unfiltered", "local honey"],
      base_price: 15.99,
      currency: "USD",
      stock_quantity: 18,
      min_stock_level: 5,
      unit_of_measurement: "piece",
      condition: ProductCondition.NEW,
      brand: "Golden Hive Apiary",
      status: ProductStatus.DRAFT,
      is_featured: false,
      is_organic: true,
      is_local: true,
      created_at: "2024-01-20T16:30:00Z",
      updated_at: "2024-01-22T13:15:00Z",
    },
    {
      id: "7",
      name: "Heirloom Carrots",
      description:
        "Colorful heirloom carrots in purple, orange, and yellow varieties. Sweet and crunchy.",
      short_description:
        "Colorful heirloom carrots in purple, orange, and yellow varieties.",
      sku: "CAR-HEI-001",
      category: "Vegetables",
      subcategory: "Root Vegetables",
      tags: ["heirloom", "colorful", "sweet", "crunchy"],
      base_price: 4.49,
      currency: "USD",
      stock_quantity: 67,
      min_stock_level: 20,
      unit_of_measurement: "lb",
      condition: ProductCondition.NEW,
      status: ProductStatus.ACTIVE,
      is_featured: false,
      is_organic: false,
      is_local: false,
      created_at: "2024-01-14T11:45:00Z",
      updated_at: "2024-01-20T15:30:00Z",
      images: [
        {
          id: "img7",
          image_url:
            "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400&h=400&fit=crop&crop=center",
          alt_text: "Colorful heirloom carrots",
          is_primary: true,
          display_order: 0,
        },
      ],
    },
    {
      id: "8",
      name: "Organic Blueberries",
      description:
        "Sweet, juicy organic blueberries packed with antioxidants. Perfect for snacking or baking.",
      short_description:
        "Sweet, juicy organic blueberries packed with antioxidants.",
      sku: "BLU-ORG-001",
      category: "Fruits",
      subcategory: "Berries",
      tags: ["organic", "antioxidants", "sweet", "berries"],
      base_price: 7.99,
      currency: "USD",
      stock_quantity: 0,
      min_stock_level: 12,
      unit_of_measurement: "lb",
      condition: ProductCondition.NEW,
      brand: "Berry Fresh Farms",
      status: ProductStatus.OUT_OF_STOCK,
      is_featured: true,
      is_organic: true,
      is_local: false,
      created_at: "2024-01-16T09:20:00Z",
      updated_at: "2024-01-23T08:45:00Z",
      images: [
        {
          id: "img8",
          image_url:
            "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=400&fit=crop&crop=center",
          alt_text: "Fresh organic blueberries",
          is_primary: true,
          display_order: 0,
        },
      ],
    },
  ];

  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(demoProducts.length);
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

  // Filter demo products
  const filterProducts = () => {
    let filtered = [...demoProducts];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.short_description?.toLowerCase().includes(searchLower) ||
          product.sku?.toLowerCase().includes(searchLower) ||
          product.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(
        (product) => product.category === filters.category
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(
        (product) => product.status === filters.status
      );
    }

    // Feature filters
    if (filters.is_featured !== null) {
      filtered = filtered.filter(
        (product) => product.is_featured === filters.is_featured
      );
    }
    if (filters.is_organic !== null) {
      filtered = filtered.filter(
        (product) => product.is_organic === filters.is_organic
      );
    }
    if (filters.is_local !== null) {
      filtered = filtered.filter(
        (product) => product.is_local === filters.is_local
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (filters.sort_by) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "base_price":
          aValue = a.base_price;
          bValue = b.base_price;
          break;
        case "stock_quantity":
          aValue = a.stock_quantity;
          bValue = b.stock_quantity;
          break;
        case "created_at":
        default:
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
      }

      if (filters.sort_order === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setProducts(filtered);
    setTotalProducts(filtered.length);
  };

  useEffect(() => {
    filterProducts();
  }, [filters]);

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleDeleteProduct = (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    // Remove from demo data
    const updatedProducts = demoProducts.filter((p) => p.id !== productId);
    demoProducts.length = 0;
    demoProducts.push(...updatedProducts);

    // Refresh filtered products
    filterProducts();
  };

  const handleStatusChange = (productId: string, newStatus: ProductStatus) => {
    // Update status in demo data
    const productIndex = demoProducts.findIndex((p) => p.id === productId);
    if (productIndex !== -1) {
      demoProducts[productIndex].status = newStatus;
      demoProducts[productIndex].updated_at = new Date().toISOString();
    }

    // Refresh filtered products
    filterProducts();
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

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

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
            {totalProducts} products found
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

        {/* Products Grid/List */}
        {products.length === 0 ? (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-3xl border border-[var(--secondary-soft-highlight)] overflow-hidden hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 ease-out"
              >
                {/* Product Image */}
                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                  {getPrimaryImage(product) ? (
                    <img
                      src={getPrimaryImage(product)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                        <svg
                          className="w-8 h-8 text-gray-400"
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
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={classNames(
                        "px-3 py-1.5 text-xs font-semibold rounded-full backdrop-blur-md shadow-lg border border-white/20",
                        product.status === ProductStatus.ACTIVE
                          ? "bg-emerald-500/90 text-white"
                          : product.status === ProductStatus.DRAFT
                          ? "bg-slate-500/90 text-white"
                          : product.status === ProductStatus.INACTIVE
                          ? "bg-amber-500/90 text-white"
                          : product.status === ProductStatus.OUT_OF_STOCK
                          ? "bg-red-500/90 text-white"
                          : "bg-red-600/90 text-white"
                      )}
                    >
                      {product.status === ProductStatus.OUT_OF_STOCK
                        ? "Out of Stock"
                        : product.status.charAt(0).toUpperCase() +
                          product.status.slice(1)}
                    </span>
                  </div>

                  {/* Feature Badges */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {product.is_featured && (
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    )}
                    {product.is_organic && (
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                    {product.is_local && (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg
                          className="w-4 h-4 text-white"
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

                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <Link
                        href={`/seller/products/${product.id}/edit`}
                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                      >
                        <svg
                          className="w-4 h-4 text-gray-700"
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
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors group/delete"
                      >
                        <svg
                          className="w-4 h-4 text-gray-700 group-hover/delete:text-red-600"
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
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[var(--secondary-black)] text-lg mb-1 truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-[var(--primary-base)] font-medium">
                        {product.category}
                      </p>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      <select
                        value={product.status}
                        onChange={(e) =>
                          handleStatusChange(
                            product.id,
                            e.target.value as ProductStatus
                          )
                        }
                        className="text-xs border-0 bg-gray-50 rounded-lg px-2 py-1 font-medium focus:ring-2 focus:ring-[var(--primary-accent2)] focus:bg-white transition-colors"
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
                  </div>

                  {product.short_description && (
                    <p className="text-sm text-[var(--primary-base)] mb-4 line-clamp-2 leading-relaxed">
                      {product.short_description}
                    </p>
                  )}

                  {/* Price Section */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2 mb-1">
                      {product.sale_price &&
                      product.sale_price < product.base_price ? (
                        <>
                          <span className="text-2xl font-bold text-[var(--primary-accent2)]">
                            ${product.sale_price.toFixed(2)}
                          </span>
                          <span className="text-lg text-gray-400 line-through font-medium">
                            ${product.base_price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-[var(--secondary-black)]">
                          ${product.base_price.toFixed(2)}
                        </span>
                      )}
                      <span className="text-sm text-[var(--primary-base)] font-medium">
                        / {product.unit_of_measurement}
                      </span>
                    </div>
                    {product.sale_price &&
                      product.sale_price < product.base_price && (
                        <div className="inline-flex items-center px-2 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full">
                          Save $
                          {(product.base_price - product.sale_price).toFixed(2)}
                        </div>
                      )}
                  </div>

                  {/* Stock Info */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div
                        className={classNames(
                          "w-2 h-2 rounded-full",
                          product.stock_quantity > 10
                            ? "bg-green-500"
                            : product.stock_quantity > 0
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        )}
                      ></div>
                      <span className="text-sm font-medium text-[var(--secondary-black)]">
                        {product.stock_quantity} in stock
                      </span>
                    </div>
                    {product.sku && (
                      <span className="text-xs text-[var(--primary-base)] font-mono bg-white px-2 py-1 rounded">
                        {product.sku}
                      </span>
                    )}
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
                  {products.map((product) => (
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
                            <div className="font-medium text-[var(--secondary-black)]">
                              {product.name}
                            </div>
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
                            getStatusColor(product.status)
                          )}
                        >
                          {product.status.replace("_", " ").toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/seller/products/${product.id}/edit`}
                            className="btn btn-ghost h-8 px-3 text-sm"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="btn btn-ghost h-8 px-2 text-red-600 hover:bg-red-50"
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

      <Footer />
    </div>
  );
}
