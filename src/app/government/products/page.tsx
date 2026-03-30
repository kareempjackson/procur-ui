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
import { VendorProduct } from "@/types";
import {
  GOV,
  govCard,
  govCardPadded,
  govSectionHeader,
  govViewAllLink,
  govKpiLabel,
  govKpiValue,
  govKpiSub,
  govPageTitle,
  govPageSubtitle,
  govPillButton,
  govPrimaryButton,
  govStatusPillStyle,
  govStatusLabel,
  govHoverBg,
} from "../styles";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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

  // Mock products data for fallback (aligned to VendorProduct type)
  const mockProducts: VendorProduct[] = [
    {
      id: "1",
      vendor_id: "1",
      name: "Organic Roma Tomatoes",
      category: "Vegetables",
      variety: "Roma",
      quantity_available: 500,
      unit_of_measurement: "kg",
      price_per_unit: 2.5,
      harvest_date: "2024-09-20",
      quality_grade: "Premium",
      organic_certified: true,
      created_at: "2024-09-21T00:00:00Z",
      updated_at: "2024-09-21T00:00:00Z",
    },
    {
      id: "2",
      vendor_id: "1",
      name: "Fresh Iceberg Lettuce",
      category: "Vegetables",
      variety: "Iceberg",
      quantity_available: 200,
      unit_of_measurement: "kg",
      price_per_unit: 3.2,
      harvest_date: "2024-09-22",
      quality_grade: "Grade A",
      organic_certified: false,
      created_at: "2024-09-22T00:00:00Z",
      updated_at: "2024-09-22T00:00:00Z",
    },
    {
      id: "3",
      vendor_id: "3",
      name: "Sweet Bell Peppers",
      category: "Vegetables",
      variety: "Bell",
      quantity_available: 300,
      unit_of_measurement: "kg",
      price_per_unit: 2.8,
      harvest_date: "2024-09-18",
      quality_grade: "Grade A",
      organic_certified: true,
      created_at: "2024-09-18T00:00:00Z",
      updated_at: "2024-09-18T00:00:00Z",
    },
    {
      id: "4",
      vendor_id: "4",
      name: "Orange Sweet Potatoes",
      category: "Root",
      variety: "Sweet",
      quantity_available: 1000,
      unit_of_measurement: "kg",
      price_per_unit: 1.8,
      harvest_date: "2024-09-15",
      quality_grade: "Grade B",
      organic_certified: false,
      created_at: "2024-09-15T00:00:00Z",
      updated_at: "2024-09-15T00:00:00Z",
    },
    {
      id: "5",
      vendor_id: "5",
      name: "Cavendish Bananas",
      category: "Fruit",
      variety: "Cavendish",
      quantity_available: 750,
      unit_of_measurement: "kg",
      price_per_unit: 1.5,
      harvest_date: "2024-09-25",
      quality_grade: "Premium",
      organic_certified: true,
      created_at: "2024-09-26T00:00:00Z",
      updated_at: "2024-09-26T00:00:00Z",
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
      const vendorName = vendorMap.get(product.vendor_id) || "Unknown Vendor";
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

      return matchesSearch && matchesStatus;
    });
  }, [displayProducts, searchQuery, filterStatus, vendorMap]);

  const getProductStatus = (product: VendorProduct) => {
    const isAvailable = product.harvest_date
      ? new Date(product.harvest_date) <= new Date()
      : true;
    return isAvailable ? "active" : "pending";
  };

  /* ── Input style ────────────────────────────────────────────────────────── */
  const inputPill: React.CSSProperties = {
    border: `1px solid ${GOV.border}`,
    borderRadius: 999,
    padding: "8px 14px",
    fontSize: 13,
    fontFamily: "inherit",
    color: GOV.text,
    background: GOV.cardBg,
    outline: "none",
  };

  /* ── Small stat cell inside product card ────────────────────────────────── */
  const miniStatBox: React.CSSProperties = {
    background: GOV.bg,
    borderRadius: 8,
    padding: "10px 12px",
  };

  /* ── Tag / badge base ───────────────────────────────────────────────────── */
  const tagBase: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    borderRadius: 6,
    padding: "3px 8px",
    fontSize: 11,
    fontWeight: 600,
  };

  return (
    <div style={{ minHeight: "100vh", background: GOV.bg, color: GOV.text }}>
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 28,
          }}
        >
          <div>
            <h1 style={govPageTitle}>Products Management</h1>
            <p style={govPageSubtitle}>
              Monitor and manage product listings across all vendors
              {productsStatus === "loading" && " \u00b7 Loading..."}
              {productsError && " \u00b7 Error loading data"}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={handleRefresh}
              disabled={productsStatus === "loading"}
              style={{
                ...govPillButton,
                opacity: productsStatus === "loading" ? 0.5 : 1,
                cursor:
                  productsStatus === "loading" ? "not-allowed" : "pointer",
              }}
            >
              <ArrowPathIcon
                style={{
                  width: 16,
                  height: 16,
                  animation:
                    productsStatus === "loading"
                      ? "spin 1s linear infinite"
                      : undefined,
                }}
              />
              Refresh
            </button>
            <Link
              href="/government/products/upload"
              style={govPrimaryButton}
            >
              <PlusIcon style={{ width: 16, height: 16 }} />
              Upload Product
            </Link>
          </div>
        </div>

        {/* ── Error ──────────────────────────────────────────────────────── */}
        {productsError && (
          <div
            style={{
              ...govCard,
              background: GOV.dangerBg,
              borderColor: "#fca5a5",
              padding: "14px 18px",
              marginBottom: 20,
            }}
          >
            <p style={{ fontSize: 13, color: GOV.danger, margin: 0 }}>
              Error loading products: {productsError}
            </p>
          </div>
        )}

        {/* ── Stats Overview ─────────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div style={govCardPadded}>
            <div style={govKpiLabel}>Total Products</div>
            <div style={{ ...govKpiValue, marginTop: 6 }}>
              {productsStatus === "loading" ? "..." : stats.total}
            </div>
            <div style={govKpiSub}>All listed items</div>
          </div>
          <div style={govCardPadded}>
            <div style={govKpiLabel}>Available</div>
            <div style={{ ...govKpiValue, marginTop: 6, color: GOV.success }}>
              {productsStatus === "loading" ? "..." : stats.available}
            </div>
            <div style={govKpiSub}>Ready for procurement</div>
          </div>
          <div style={govCardPadded}>
            <div style={govKpiLabel}>Total Quantity</div>
            <div style={{ ...govKpiValue, marginTop: 6 }}>
              {productsStatus === "loading"
                ? "..."
                : stats.totalQuantity.toLocaleString()}
            </div>
            <div style={govKpiSub}>Units across vendors</div>
          </div>
          <div style={govCardPadded}>
            <div style={govKpiLabel}>Total Value</div>
            <div style={{ ...govKpiValue, marginTop: 6 }}>
              $
              {productsStatus === "loading"
                ? "..."
                : stats.totalValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
            </div>
            <div style={govKpiSub}>Estimated market value</div>
          </div>
        </div>

        {/* ── Search & Filters ───────────────────────────────────────────── */}
        <div
          style={{
            ...govCardPadded,
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {/* Search */}
          <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
            <MagnifyingGlassIcon
              style={{
                width: 16,
                height: 16,
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: GOV.muted,
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="Search products by name or vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                ...inputPill,
                width: "100%",
                paddingLeft: 38,
              }}
            />
          </div>

          {/* Status filter */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FunnelIcon style={{ width: 16, height: 16, color: GOV.muted }} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={inputPill}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="reserved">Expected Soon</option>
            </select>
          </div>
        </div>

        {/* ── Products Grid ──────────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {filteredProducts.map((product) => {
            const status = getProductStatus(product);
            const vendorName =
              vendorMap.get(product.vendor_id) || "Unknown Vendor";
            const isHovered = hoveredCard === product.id;

            return (
              <div
                key={product.id}
                style={{
                  ...govCard,
                  overflow: "hidden",
                  transition: "box-shadow .15s, transform .15s",
                  background: isHovered ? govHoverBg : GOV.cardBg,
                  transform: isHovered ? "translateY(-2px)" : undefined,
                  boxShadow: isHovered
                    ? "0 4px 16px rgba(0,0,0,.06)"
                    : undefined,
                }}
                onMouseEnter={() => setHoveredCard(product.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Image placeholder area */}
                <div
                  style={{
                    height: 160,
                    background: `linear-gradient(135deg, ${GOV.bg} 0%, ${GOV.border} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 40, marginBottom: 6 }}>
                      {product.organic_certified ? "\ud83c\udf31" : "\ud83c\udf3e"}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: ".06em",
                        color: GOV.text,
                        background: "rgba(255,255,255,.85)",
                        padding: "3px 10px",
                        borderRadius: 999,
                        display: "inline-block",
                      }}
                    >
                      {product.category || "Product"}
                    </div>
                  </div>

                  {/* Status badge */}
                  <div style={{ position: "absolute", top: 10, right: 10 }}>
                    <span style={govStatusPillStyle(status)}>
                      {govStatusLabel(status)}
                    </span>
                  </div>
                </div>

                {/* Product details */}
                <div style={{ padding: "16px 18px 18px" }}>
                  <div style={{ marginBottom: 8 }}>
                    <h3
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: GOV.text,
                        margin: 0,
                        lineHeight: 1.3,
                      }}
                    >
                      {product.name}
                    </h3>
                    {product.variety && (
                      <span
                        style={{
                          fontSize: 11,
                          color: GOV.muted,
                          fontWeight: 500,
                          display: "block",
                          marginTop: 2,
                        }}
                      >
                        Variety: {product.variety}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/government/vendors/${product.vendor_id}`}
                    style={{
                      color: GOV.accent,
                      fontWeight: 600,
                      fontSize: 13,
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      marginBottom: 12,
                    }}
                  >
                    {vendorName}
                    <svg
                      width="10"
                      height="10"
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

                  {/* Stats mini-grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    <div style={miniStatBox}>
                      <div style={{ ...govKpiLabel, marginBottom: 2 }}>
                        Quantity
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: GOV.text,
                        }}
                      >
                        {product.quantity_available}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: GOV.lightMuted,
                          marginTop: 1,
                        }}
                      >
                        {product.unit_of_measurement || "units"}
                      </div>
                    </div>

                    {product.price_per_unit !== undefined &&
                      product.price_per_unit !== null && (
                        <div style={{ ...miniStatBox, background: GOV.successBg }}>
                          <div
                            style={{
                              ...govKpiLabel,
                              marginBottom: 2,
                              color: GOV.success,
                            }}
                          >
                            Price
                          </div>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: GOV.success,
                            }}
                          >
                            ${safeNumber(product.price_per_unit).toFixed(2)}
                          </div>
                          <div
                            style={{
                              fontSize: 10,
                              color: GOV.success,
                              opacity: 0.7,
                              marginTop: 1,
                            }}
                          >
                            per {product.unit_of_measurement || "unit"}
                          </div>
                        </div>
                      )}

                    {product.quality_grade && !product.price_per_unit && (
                      <div style={{ ...miniStatBox, background: GOV.infoBg }}>
                        <div
                          style={{
                            ...govKpiLabel,
                            marginBottom: 2,
                            color: GOV.info,
                          }}
                        >
                          Quality
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: GOV.info,
                          }}
                        >
                          {product.quality_grade}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer tags */}
                  <div
                    style={{
                      borderTop: `1px solid ${GOV.border}`,
                      paddingTop: 12,
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    {product.harvest_date && (
                      <div
                        style={{
                          ...tagBase,
                          background: GOV.bg,
                          color: GOV.muted,
                        }}
                      >
                        <CalendarIcon style={{ width: 12, height: 12 }} />
                        <span>
                          {new Date(product.harvest_date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    )}
                    {product.organic_certified && (
                      <span
                        style={{
                          ...tagBase,
                          background: GOV.successBg,
                          color: GOV.success,
                        }}
                      >
                        <svg
                          width="10"
                          height="10"
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
                      <span
                        style={{
                          ...tagBase,
                          background: GOV.infoBg,
                          color: GOV.info,
                        }}
                      >
                        {product.quality_grade}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Empty state ────────────────────────────────────────────────── */}
        {filteredProducts.length === 0 && (
          <div
            style={{
              ...govCardPadded,
              padding: "48px 24px",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: 13, color: GOV.muted, margin: 0 }}>
              No products found matching your criteria.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
