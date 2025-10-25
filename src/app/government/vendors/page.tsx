"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PlusIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchVendors,
  selectVendors,
  selectVendorsStatus,
  selectVendorsError,
  selectVendorStats,
} from "@/store/slices/governmentVendorsSlice";

export default function VendorsPage() {
  const dispatch = useAppDispatch();

  // Redux state
  const vendors = useAppSelector(selectVendors);
  const status = useAppSelector(selectVendorsStatus);
  const error = useAppSelector(selectVendorsError);
  const stats = useAppSelector(selectVendorStats);

  // Local filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");
  const [filterCropType, setFilterCropType] = useState<string>("all");

  // Fetch vendors on mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchVendors({ page: 1, limit: 100 }));
    }
  }, [status, dispatch]);

  // Mock vendor data for fallback - matches API format (snake_case)
  const mockVendors = [
    {
      id: "1",
      name: "Green Valley Farms",
      contact_person: "John Smith",
      email: "john@greenvalley.gd",
      phone: "+1-473-555-0101",
      location: "St. George's, Grenada",
      gps_coordinates: { lat: 12.0561, lng: -61.7516 },
      total_acreage: 250,
      utilized_acreage: 180,
      available_acreage: 70,
      crops: ["Tomatoes", "Lettuce", "Peppers"],
      compliance_status: "compliant" as const,
      programs_enrolled: 3,
      last_update: "2024-10-01",
      created_at: "2023-01-15",
      updated_at: "2024-10-01",
    },
    {
      id: "2",
      name: "Sunrise Agricultural Co.",
      contact_person: "Mary Johnson",
      email: "mary@sunrise.gd",
      phone: "+1-473-555-0102",
      location: "Grenville, Grenada",
      gps_coordinates: { lat: 12.1167, lng: -61.6167 },
      total_acreage: 420,
      utilized_acreage: 350,
      available_acreage: 70,
      crops: ["Coffee", "Plantains", "Yams"],
      compliance_status: "compliant" as const,
      programs_enrolled: 2,
      last_update: "2024-09-28",
      created_at: "2022-11-20",
      updated_at: "2024-09-28",
    },
    {
      id: "3",
      name: "Highland Produce Ltd.",
      contact_person: "David Brown",
      email: "david@highland.gd",
      phone: "+1-473-555-0103",
      location: "Gouyave, Grenada",
      gps_coordinates: { lat: 12.1667, lng: -61.7333 },
      total_acreage: 180,
      utilized_acreage: 180,
      available_acreage: 0,
      crops: ["Carrots", "Cabbage", "Scallions"],
      compliance_status: "warning" as const,
      programs_enrolled: 1,
      last_update: "2024-10-03",
      created_at: "2023-03-10",
      updated_at: "2024-10-03",
    },
    {
      id: "4",
      name: "Coastal Farms Group",
      contact_person: "Sarah Williams",
      email: "sarah@coastal.gd",
      phone: "+1-473-555-0104",
      location: "Sauteurs, Grenada",
      gps_coordinates: { lat: 12.2167, lng: -61.6333 },
      total_acreage: 520,
      utilized_acreage: 380,
      available_acreage: 140,
      crops: ["Sweet Potato", "Pumpkin", "Watermelon"],
      compliance_status: "compliant" as const,
      programs_enrolled: 4,
      last_update: "2024-10-02",
      created_at: "2022-08-05",
      updated_at: "2024-10-02",
    },
    {
      id: "5",
      name: "Mountain Fresh Produce",
      contact_person: "Robert Davis",
      email: "robert@mountainfresh.gd",
      phone: "+1-473-555-0105",
      location: "Victoria, Grenada",
      gps_coordinates: { lat: 12.1833, lng: -61.7 },
      total_acreage: 95,
      utilized_acreage: 70,
      available_acreage: 25,
      crops: ["Bananas", "Breadfruit", "Nutmeg"],
      compliance_status: "alert" as const,
      programs_enrolled: 1,
      last_update: "2024-09-25",
      created_at: "2023-06-18",
      updated_at: "2024-09-25",
    },
  ];

  // Use API data if available, otherwise use mock data
  const displayVendors = vendors.length > 0 ? vendors : mockVendors;

  // Filter vendors based on search and filters
  const filteredVendors = useMemo(() => {
    return displayVendors.filter((vendor) => {
      const matchesSearch =
        searchQuery === "" ||
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.contact_person
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        vendor.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || vendor.compliance_status === filterStatus;

      const matchesLocation =
        filterLocation === "all" || vendor.location.includes(filterLocation);

      const matchesCropType =
        filterCropType === "all" ||
        vendor.crops.some((crop) =>
          crop.toLowerCase().includes(filterCropType.toLowerCase())
        );

      return (
        matchesSearch && matchesStatus && matchesLocation && matchesCropType
      );
    });
  }, [
    displayVendors,
    searchQuery,
    filterStatus,
    filterLocation,
    filterCropType,
  ]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "compliant":
        return {
          label: "Compliant",
          color: "bg-[var(--primary-base)]/10 text-[color:var(--primary-base)]",
          icon: CheckCircleIcon,
        };
      case "warning":
        return {
          label: "Warning",
          color: "bg-yellow-100 text-yellow-800",
          icon: ExclamationCircleIcon,
        };
      case "alert":
        return {
          label: "Alert",
          color:
            "bg-[var(--secondary-highlight2)]/10 text-[color:var(--secondary-highlight2)]",
          icon: ExclamationCircleIcon,
        };
      default:
        return {
          label: "Unknown",
          color: "bg-gray-100 text-gray-800",
          icon: ExclamationCircleIcon,
        };
    }
  };

  // Use Redux stats if available, otherwise calculate from display data
  const displayStats = stats || {
    total: displayVendors.length,
    compliant: displayVendors.filter((v) => v.compliance_status === "compliant")
      .length,
    warning: displayVendors.filter((v) => v.compliance_status === "warning")
      .length,
    alert: displayVendors.filter((v) => v.compliance_status === "alert").length,
    totalAcreage: displayVendors.reduce((sum, v) => sum + v.total_acreage, 0),
    utilizedAcreage: displayVendors.reduce(
      (sum, v) => sum + v.utilized_acreage,
      0
    ),
  };

  // Refresh handler
  const handleRefresh = () => {
    dispatch(fetchVendors({ page: 1, limit: 100 }));
  };

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-[color:var(--secondary-black)]">
              Vendor Management
            </h1>
            <p className="text-sm text-[color:var(--secondary-muted-edge)] mt-1">
              Monitor and manage registered agricultural vendors
              {status === "loading" && " • Loading..."}
              {error && " • Error loading data"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={status === "loading"}
              className="inline-flex items-center gap-2 rounded-full bg-white border border-[color:var(--secondary-soft-highlight)] text-[color:var(--secondary-black)] px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowPathIcon
                className={`h-5 w-5 ${
                  status === "loading" ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>
            <Link
              href="/government/vendors/new"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--secondary-highlight2)] text-white px-5 py-2.5 text-sm font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2"
            >
              <PlusIcon className="h-5 w-5" />
              Register New Vendor
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 mb-6">
            <p className="text-sm text-red-800">
              Error loading vendors: {error}
            </p>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-5">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)]">
              Total Vendors
            </div>
            <div className="mt-2 text-2xl font-semibold text-[color:var(--secondary-black)]">
              {status === "loading" ? "..." : displayStats.total}
            </div>
          </div>
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-5">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)]">
              Compliant
            </div>
            <div className="mt-2 text-2xl font-semibold text-[color:var(--primary-base)]">
              {status === "loading" ? "..." : displayStats.compliant}
            </div>
          </div>
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-5">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)]">
              Total Acreage
            </div>
            <div className="mt-2 text-2xl font-semibold text-[color:var(--secondary-black)]">
              {status === "loading"
                ? "..."
                : displayStats.totalAcreage.toLocaleString()}
            </div>
          </div>
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-5">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)]">
              Utilized Acreage
            </div>
            <div className="mt-2 text-2xl font-semibold text-[color:var(--secondary-black)]">
              {status === "loading"
                ? "..."
                : displayStats.utilizedAcreage.toLocaleString()}
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
                  placeholder="Search vendors by name, contact, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm transition-all duration-200 shadow-sm focus:shadow-md"
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
                  className="rounded-full border border-[color:var(--secondary-soft-highlight)] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] transition-all duration-200 shadow-sm focus:shadow-md bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="compliant">Compliant</option>
                  <option value="warning">Warning</option>
                  <option value="alert">Alert</option>
                </select>
              </div>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="rounded-full border border-[color:var(--secondary-soft-highlight)] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)]"
              >
                <option value="all">All Locations</option>
                <option value="St. George's">St. George's</option>
                <option value="Grenville">Grenville</option>
                <option value="Gouyave">Gouyave</option>
                <option value="Sauteurs">Sauteurs</option>
                <option value="Victoria">Victoria</option>
              </select>
            </div>
          </div>
        </div>

        {/* Vendors Table */}
        <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-[color:var(--secondary-soft-highlight)]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                    Acreage
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                    Crops
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                    Programs
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                    Last Update
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--secondary-soft-highlight)]/30">
                {filteredVendors.map((vendor) => {
                  const statusConfig = getStatusConfig(
                    vendor.compliance_status
                  );
                  const StatusIcon = statusConfig.icon;
                  const utilizedAcreage = vendor.utilized_acreage;
                  const totalAcreage = vendor.total_acreage;
                  const utilizationPercent =
                    totalAcreage > 0
                      ? Math.round((utilizedAcreage / totalAcreage) * 100)
                      : 0;

                  return (
                    <tr
                      key={vendor.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/government/vendors/${vendor.id}`}
                          className="block"
                        >
                          <div className="font-medium text-sm text-[color:var(--secondary-black)] hover:text-[var(--secondary-highlight2)]">
                            {vendor.name}
                          </div>
                          <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                            {vendor.contact_person}
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-[color:var(--secondary-black)]">
                          <MapPinIcon className="h-4 w-4 text-[color:var(--secondary-muted-edge)]" />
                          {vendor.location}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[color:var(--secondary-black)]">
                          {utilizedAcreage} / {totalAcreage}
                        </div>
                        <div className="text-xs text-[color:var(--secondary-muted-edge)]">
                          {utilizationPercent}% utilized
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {vendor.crops?.slice(0, 2).map((crop, idx) => (
                            <span
                              key={`${crop}-${idx}`}
                              className="inline-flex items-center rounded-full bg-[var(--primary-accent1)]/15 text-[color:var(--primary-accent3)] px-2 py-0.5 text-xs"
                            >
                              {crop}
                            </span>
                          ))}
                          {vendor.crops && vendor.crops.length > 2 && (
                            <span className="inline-flex items-center text-xs text-[color:var(--secondary-muted-edge)]">
                              +{vendor.crops.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[color:var(--secondary-black)]">
                          {vendor.programs_enrolled} active
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig.color}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[color:var(--secondary-muted-edge)]">
                        {new Date(vendor.last_update).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredVendors.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-sm text-[color:var(--secondary-muted-edge)]">
                No vendors found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
