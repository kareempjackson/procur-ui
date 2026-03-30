"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
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
import {
  GOV,
  govCard,
  govCardPadded,
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

  // Row hover state
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

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

  /* ── shared inline pieces ───────────────────────────────────────── */

  const selectStyle: React.CSSProperties = {
    border: `1px solid ${GOV.border}`,
    borderRadius: 999,
    padding: "8px 14px",
    fontSize: 13,
    fontWeight: 500,
    color: GOV.text,
    background: GOV.cardBg,
    outline: "none",
    fontFamily: "inherit",
    cursor: "pointer",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    paddingLeft: 36,
    paddingRight: 14,
    paddingTop: 8,
    paddingBottom: 8,
    border: `1px solid ${GOV.border}`,
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 500,
    color: GOV.text,
    background: GOV.cardBg,
    outline: "none",
    fontFamily: "inherit",
  };

  const thStyle: React.CSSProperties = {
    padding: "12px 20px",
    textAlign: "left" as const,
    fontSize: 10.5,
    fontWeight: 700,
    color: GOV.muted,
    textTransform: "uppercase" as const,
    letterSpacing: ".06em",
    whiteSpace: "nowrap" as const,
  };

  const tdStyle: React.CSSProperties = {
    padding: "14px 20px",
    verticalAlign: "middle" as const,
  };

  const cropChipStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 99,
    fontSize: 11,
    fontWeight: 600,
    background: GOV.brandLight,
    color: GOV.brand,
    marginRight: 4,
    marginBottom: 2,
  };

  const vendorLinkStyle: React.CSSProperties = {
    color: GOV.accent,
    fontWeight: 600,
    textDecoration: "none",
    fontSize: 13,
  };

  return (
    <div style={{ minHeight: "100vh", background: GOV.bg, color: GOV.text }}>
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 28,
          }}
        >
          <div>
            <h1 style={govPageTitle}>Vendor Management</h1>
            <p style={govPageSubtitle}>
              Monitor and manage registered agricultural vendors
              {status === "loading" && " \u00b7 Loading..."}
              {error && " \u00b7 Error loading data"}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={handleRefresh}
              disabled={status === "loading"}
              style={{
                ...govPillButton,
                opacity: status === "loading" ? 0.5 : 1,
                cursor: status === "loading" ? "not-allowed" : "pointer",
              }}
            >
              <ArrowPathIcon
                width={16}
                height={16}
                style={{
                  animation:
                    status === "loading" ? "spin 1s linear infinite" : "none",
                }}
              />
              Refresh
            </button>
            <Link href="/government/vendors/new" style={govPrimaryButton}>
              <PlusIcon width={16} height={16} />
              Register New Vendor
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
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
              Error loading vendors: {error}
            </p>
          </div>
        )}

        {/* Stats Overview */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div style={govCardPadded}>
            <div style={govKpiLabel}>Total Vendors</div>
            <div style={{ ...govKpiValue, marginTop: 8 }}>
              {status === "loading" ? "..." : displayStats.total}
            </div>
            <div style={govKpiSub}>Registered vendors</div>
          </div>
          <div style={govCardPadded}>
            <div style={govKpiLabel}>Compliant</div>
            <div style={{ ...govKpiValue, marginTop: 8, color: GOV.success }}>
              {status === "loading" ? "..." : displayStats.compliant}
            </div>
            <div style={govKpiSub}>Meeting all requirements</div>
          </div>
          <div style={govCardPadded}>
            <div style={govKpiLabel}>Total Acreage</div>
            <div style={{ ...govKpiValue, marginTop: 8 }}>
              {status === "loading"
                ? "..."
                : displayStats.totalAcreage.toLocaleString()}
            </div>
            <div style={govKpiSub}>Across all vendors</div>
          </div>
          <div style={govCardPadded}>
            <div style={govKpiLabel}>Utilized Acreage</div>
            <div style={{ ...govKpiValue, marginTop: 8 }}>
              {status === "loading"
                ? "..."
                : displayStats.utilizedAcreage.toLocaleString()}
            </div>
            <div style={govKpiSub}>Currently in production</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div
          style={{
            ...govCard,
            padding: "16px 20px",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap" as const,
            }}
          >
            {/* Search */}
            <div style={{ flex: 1, minWidth: 220, position: "relative" as const }}>
              <MagnifyingGlassIcon
                width={16}
                height={16}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: GOV.muted,
                }}
              />
              <input
                type="text"
                placeholder="Search vendors by name, contact, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Filters */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FunnelIcon width={16} height={16} style={{ color: GOV.muted }} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={selectStyle}
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
              style={selectStyle}
            >
              <option value="all">All Locations</option>
              <option value="St. George's">St. George&apos;s</option>
              <option value="Grenville">Grenville</option>
              <option value="Gouyave">Gouyave</option>
              <option value="Sauteurs">Sauteurs</option>
              <option value="Victoria">Victoria</option>
            </select>
          </div>
        </div>

        {/* Vendors Table */}
        <div style={{ ...govCard, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" as const }}>
            <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
              <thead>
                <tr
                  style={{
                    borderBottom: `1px solid ${GOV.border}`,
                    background: GOV.bg,
                  }}
                >
                  <th style={thStyle}>Vendor</th>
                  <th style={thStyle}>Location</th>
                  <th style={thStyle}>Acreage</th>
                  <th style={thStyle}>Crops</th>
                  <th style={thStyle}>Programs</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Last Update</th>
                  <th style={thStyle}></th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.map((vendor) => {
                  const utilizedAcreage = vendor.utilized_acreage;
                  const totalAcreage = vendor.total_acreage;
                  const utilizationPercent =
                    totalAcreage > 0
                      ? Math.round((utilizedAcreage / totalAcreage) * 100)
                      : 0;
                  const isHovered = hoveredRow === vendor.id;

                  return (
                    <tr
                      key={vendor.id}
                      onMouseEnter={() => setHoveredRow(vendor.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{
                        borderBottom: `1px solid ${GOV.border}`,
                        background: isHovered ? govHoverBg : GOV.cardBg,
                        transition: "background .15s",
                      }}
                    >
                      <td style={tdStyle}>
                        <Link
                          href={`/government/vendors/${vendor.id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: GOV.text,
                            }}
                          >
                            {vendor.name}
                          </div>
                          <div
                            style={{
                              fontSize: 11.5,
                              color: GOV.muted,
                              marginTop: 2,
                            }}
                          >
                            {vendor.contact_person}
                          </div>
                        </Link>
                      </td>
                      <td style={tdStyle}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            fontSize: 13,
                            color: GOV.text,
                          }}
                        >
                          <MapPinIcon
                            width={14}
                            height={14}
                            style={{ color: GOV.muted, flexShrink: 0 }}
                          />
                          {vendor.location}
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: GOV.text }}>
                          {utilizedAcreage} / {totalAcreage}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: GOV.lightMuted,
                            marginTop: 2,
                          }}
                        >
                          {utilizationPercent}% utilized
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 3 }}>
                          {vendor.crops?.slice(0, 2).map((crop, idx) => (
                            <span key={`${crop}-${idx}`} style={cropChipStyle}>
                              {crop}
                            </span>
                          ))}
                          {vendor.crops && vendor.crops.length > 2 && (
                            <span
                              style={{
                                fontSize: 11,
                                color: GOV.muted,
                                fontWeight: 500,
                                alignSelf: "center",
                              }}
                            >
                              +{vendor.crops.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ fontSize: 13, color: GOV.text }}>
                          {vendor.programs_enrolled} active
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <span style={govStatusPillStyle(vendor.compliance_status)}>
                          {govStatusLabel(vendor.compliance_status)}
                        </span>
                      </td>
                      <td
                        style={{
                          ...tdStyle,
                          fontSize: 12,
                          color: GOV.muted,
                          whiteSpace: "nowrap" as const,
                        }}
                      >
                        {new Date(vendor.last_update).toLocaleDateString()}
                      </td>
                      <td style={tdStyle}>
                        <Link
                          href={`/government/vendors/${vendor.id}`}
                          style={vendorLinkStyle}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredVendors.length === 0 && (
            <div
              style={{
                padding: "48px 24px",
                textAlign: "center" as const,
              }}
            >
              <p style={{ fontSize: 13, color: GOV.muted, margin: 0 }}>
                No vendors found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
