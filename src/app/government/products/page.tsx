"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterUploadedBy, setFilterUploadedBy] = useState<string>("all");

  // Mock products data
  const products = [
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

  const stats = {
    total: products.length,
    available: products.filter((p) => p.status === "available").length,
    governmentUploaded: products.filter((p) => p.uploadedBy === "government")
      .length,
    totalValue: products.reduce((sum, p) => {
      const qty = parseFloat(p.quantity.replace(/[^\d.]/g, ""));
      const price = parseFloat(p.pricePerUnit.replace(/[^\d.]/g, ""));
      return sum + qty * price;
    }, 0),
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.vendor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || product.status === filterStatus;

    const matchesUploadedBy =
      filterUploadedBy === "all" || product.uploadedBy === filterUploadedBy;

    return matchesSearch && matchesStatus && matchesUploadedBy;
  });

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
            </p>
          </div>
          <Link
            href="/government/products/upload"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--primary-accent2)] text-white px-5 py-2.5 text-sm font-medium hover:bg-[var(--primary-accent3)] transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2"
          >
            <PlusIcon className="h-5 w-5" />
            Upload Product
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)] mb-2">
              Total Products
            </div>
            <div className="text-3xl font-semibold text-[color:var(--secondary-black)]">
              {stats.total}
            </div>
          </div>
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)] mb-2">
              Available
            </div>
            <div className="text-3xl font-semibold text-[color:var(--primary-base)]">
              {stats.available}
            </div>
          </div>
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)] mb-2">
              Gov. Uploaded
            </div>
            <div className="text-3xl font-semibold text-[color:var(--secondary-black)]">
              {stats.governmentUploaded}
            </div>
          </div>
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)] mb-2">
              Total Value
            </div>
            <div className="text-3xl font-semibold text-[color:var(--secondary-black)]">
              ${stats.totalValue.toLocaleString()}
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
                  <option value="reserved">Reserved</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
              <select
                value={filterUploadedBy}
                onChange={(e) => setFilterUploadedBy(e.target.value)}
                className="rounded-full border border-[color:var(--secondary-soft-highlight)] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)]"
              >
                <option value="all">All Sources</option>
                <option value="vendor">Vendor Uploaded</option>
                <option value="government">Government Uploaded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const statusConfig = getStatusConfig(product.status);
            return (
              <div
                key={product.id}
                className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Product Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-[var(--primary-accent1)]/20 to-[var(--primary-background)] flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🌾</div>
                    <div className="text-xs text-[color:var(--secondary-muted-edge)]">
                      Product Image
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-semibold text-[color:var(--secondary-black)]">
                      {product.name}
                    </h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig.color}`}
                    >
                      {statusConfig.label}
                    </span>
                  </div>

                  <Link
                    href={`/government/vendors/${product.vendorId}`}
                    className="text-sm text-[color:var(--secondary-muted-edge)] hover:text-[var(--primary-accent2)] mb-3 block"
                  >
                    {product.vendor} · {product.location}
                  </Link>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[color:var(--secondary-muted-edge)]">
                        Quantity
                      </span>
                      <span className="font-medium text-[color:var(--secondary-black)]">
                        {product.quantity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[color:var(--secondary-muted-edge)]">
                        Price
                      </span>
                      <span className="font-medium text-[color:var(--secondary-black)]">
                        {product.pricePerUnit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[color:var(--secondary-muted-edge)]">
                        Quality
                      </span>
                      <span className="font-medium text-[color:var(--secondary-black)]">
                        {product.qualityGrade}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[color:var(--secondary-soft-highlight)] space-y-2">
                    <div className="flex items-center gap-2 text-xs text-[color:var(--secondary-muted-edge)]">
                      <CalendarIcon className="h-4 w-4" />
                      Harvested:{" "}
                      {new Date(product.harvestDate).toLocaleDateString()}
                    </div>
                    {product.uploadedBy === "government" && (
                      <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-2.5 py-1 text-xs font-medium">
                        Government Upload
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
