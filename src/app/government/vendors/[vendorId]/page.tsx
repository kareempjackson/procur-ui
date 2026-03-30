"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { use } from "react";
import {
  ArrowLeftIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  PlusIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchVendorProducts,
  selectVendors,
  selectVendorsStatus,
  selectCurrentVendor,
  selectCurrentVendorProducts,
  setCurrentVendor,
  clearCurrentVendor,
} from "@/store/slices/governmentVendorsSlice";
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
} from "../../styles";

/* ── Inline style helpers ─────────────────────────────────────────────────── */

const fieldLabel: React.CSSProperties = {
  fontSize: 10.5,
  fontWeight: 700,
  color: GOV.muted,
  textTransform: "uppercase",
  letterSpacing: ".06em",
};

const fieldValue: React.CSSProperties = {
  fontSize: 13,
  color: GOV.text,
  marginTop: 4,
  fontWeight: 500,
};

const sectionTitle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: GOV.text,
  margin: 0,
  marginBottom: 14,
};

const infoRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 12.5,
  color: GOV.textSecondary,
};

const listRow: React.CSSProperties = {
  ...govCard,
  padding: "14px 18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  transition: "background .15s",
};

const linkStyle: React.CSSProperties = {
  color: "#d4783c",
  fontWeight: 600,
  textDecoration: "none",
};

export default function VendorDetailPage({
  params,
}: {
  params: Promise<{ vendorId: string }>;
}) {
  const { vendorId } = use(params);
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState<
    "personal" | "farm" | "production" | "programs" | "market" | "products"
  >("personal");

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Redux state
  const vendors = useAppSelector(selectVendors);
  const vendorsStatus = useAppSelector(selectVendorsStatus);
  const currentVendor = useAppSelector(selectCurrentVendor);
  const vendorProducts = useAppSelector(selectCurrentVendorProducts);

  // Find vendor from list or use currentVendor
  const vendor =
    currentVendor?.id === vendorId
      ? currentVendor
      : vendors.find((v) => v.id === vendorId);

  // Fetch vendor products on mount
  useEffect(() => {
    if (vendorId) {
      dispatch(fetchVendorProducts(vendorId));
    }
  }, [vendorId, dispatch]);

  // Set current vendor when found
  useEffect(() => {
    if (vendor && (!currentVendor || currentVendor.id !== vendorId)) {
      dispatch(setCurrentVendor(vendor));
    }
  }, [vendor, currentVendor, vendorId, dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(clearCurrentVendor());
    };
  }, [dispatch]);

  // Refresh handler
  const handleRefresh = () => {
    dispatch(fetchVendorProducts(vendorId));
  };

  // Loading state
  if (vendorsStatus === "loading" || !vendor) {
    return (
      <div style={{ minHeight: "100vh", background: GOV.bg, color: GOV.text }}>
        <div
          style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 80px" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 0",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <ArrowPathIcon
                style={{
                  width: 48,
                  height: 48,
                  color: GOV.muted,
                  margin: "0 auto 16px",
                  animation: "spin 1s linear infinite",
                }}
              />
              <p style={{ fontSize: 13, color: GOV.muted }}>
                Loading vendor details...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mock vendor data for fallback - matches API format
  const mockVendor = {
    id: vendorId,
    name: "Green Valley Farms",
    contact_person: "John Smith",
    email: "john@greenvalley.com",
    phone: "+1-473-555-0123",
    location: "St. George's, Grenada",
    gps_coordinates: { lat: 12.0561, lng: -61.7516 },
    total_acreage: 250,
    utilized_acreage: 180,
    available_acreage: 70,
    compliance_status: "compliant" as const,
    created_at: "2022-01-15",
    updated_at: "2024-10-01",
    last_update: "2024-10-01",
    programs_enrolled: 3,
    crops: [
      { name: "Tomatoes", variety: "Roma", acreage: 60 },
      { name: "Lettuce", variety: "Iceberg", acreage: 40 },
      { name: "Peppers", variety: "Bell Pepper", acreage: 80 },
    ],
    infrastructure: {
      irrigation: true,
      rainwaterHarvesting: true,
      ponds: 2,
      greenhouses: 3,
      shadeHouses: 1,
      transportation: "2 trucks, 1 van",
    },
    production: [
      {
        id: "1",
        crop: "Tomatoes",
        variety: "Roma",
        acreage: 60,
        datePlanted: "2024-08-15",
        expectedHarvest: "2024-11-15",
        expectedAmount: "15,000 kg",
        chemicals: [
          { name: "Fertilizer NPK", dose: "50kg/acre", date: "2024-08-20" },
          { name: "Pesticide", dose: "2L/acre", date: "2024-09-10" },
        ],
        storage: "Climate-controlled warehouse",
      },
      {
        id: "2",
        crop: "Lettuce",
        variety: "Iceberg",
        acreage: 40,
        datePlanted: "2024-09-01",
        expectedHarvest: "2024-10-30",
        expectedAmount: "8,000 kg",
        chemicals: [
          { name: "Organic Fertilizer", dose: "30kg/acre", date: "2024-09-05" },
        ],
        storage: "Cold storage",
      },
    ],
    programs: [
      {
        id: "1",
        name: "Irrigation Support Program",
        enrolledDate: "2023-06-01",
        status: "active",
        performance: "excellent",
      },
      {
        id: "2",
        name: "Organic Certification",
        enrolledDate: "2023-08-15",
        status: "active",
        performance: "good",
      },
      {
        id: "3",
        name: "Youth Farmer Initiative",
        enrolledDate: "2024-01-10",
        status: "active",
        performance: "good",
      },
    ],
    marketActivity: {
      requirements: [
        {
          crop: "Tomatoes",
          quantity: "1,000 kg",
          frequency: "Weekly",
          preferredVariety: "Roma, Cherry",
        },
      ],
      transactions: [
        {
          date: "2024-09-15",
          crop: "Lettuce",
          quantity: "500 kg",
          buyer: "Fresh Market Ltd",
          amount: "$1,250",
        },
        {
          date: "2024-09-10",
          crop: "Peppers",
          quantity: "300 kg",
          buyer: "Island Grocers",
          amount: "$900",
        },
      ],
    },
  };

  // Use real vendor data or fallback to mock
  const displayVendor = vendor || mockVendor;
  const displayProducts = vendorProducts.length > 0 ? vendorProducts : [];
  const vendorInfra = (displayVendor as any).infrastructure;
  const vendorProduction = ((displayVendor as any).production ?? []) as any[];
  const vendorPrograms = ((displayVendor as any).programs ?? []) as any[];
  const vendorMarket = (displayVendor as any).marketActivity ?? {};

  const tabs = [
    { id: "personal" as const, label: "Personal Details" },
    { id: "farm" as const, label: "Farm Details" },
    { id: "production" as const, label: "Production" },
    { id: "programs" as const, label: "Programs" },
    { id: "market" as const, label: "Market Activity" },
    { id: "products" as const, label: "Products" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: GOV.bg, color: GOV.text }}>
      <div
        style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 80px" }}
      >
        {/* Back Button */}
        <Link
          href="/government/vendors"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12.5,
            fontWeight: 600,
            color: GOV.muted,
            textDecoration: "none",
            marginBottom: 20,
          }}
        >
          <ArrowLeftIcon style={{ width: 14, height: 14 }} />
          Back to Vendors
        </Link>

        {/* Header Card */}
        <div
          style={{
            ...govCard,
            padding: "28px 32px",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <h1 style={govPageTitle}>{displayVendor.name}</h1>
                <span
                  style={govStatusPillStyle(
                    displayVendor.compliance_status === "compliant"
                      ? "compliant"
                      : "alert"
                  )}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <CheckCircleIcon style={{ width: 13, height: 13 }} />
                    {govStatusLabel(
                      displayVendor.compliance_status === "compliant"
                        ? "compliant"
                        : "alert"
                    )}
                  </span>
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 12,
                  marginTop: 14,
                }}
              >
                <div style={infoRow}>
                  <MapPinIcon style={{ width: 15, height: 15, flexShrink: 0 }} />
                  {displayVendor.location}
                </div>
                <div style={infoRow}>
                  <PhoneIcon style={{ width: 15, height: 15, flexShrink: 0 }} />
                  {displayVendor.phone}
                </div>
                <div style={infoRow}>
                  <EnvelopeIcon
                    style={{ width: 15, height: 15, flexShrink: 0 }}
                  />
                  {displayVendor.email}
                </div>
                <div style={{ ...infoRow }}>
                  Registered:{" "}
                  {new Date(displayVendor.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={handleRefresh} style={govPillButton}>
                <ArrowPathIcon style={{ width: 15, height: 15 }} />
                Refresh
              </button>
              <Link
                href={`/government/products/upload?vendorId=${vendorId}`}
                style={govPrimaryButton}
              >
                <PlusIcon style={{ width: 15, height: 15 }} />
                Upload Product
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats KPI Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div style={govCardPadded}>
            <div style={govKpiLabel}>Total Acreage</div>
            <div style={{ ...govKpiValue, marginTop: 6 }}>
              {displayVendor.total_acreage}
            </div>
            <div style={govKpiSub}>acres total</div>
          </div>
          <div style={govCardPadded}>
            <div style={govKpiLabel}>Utilized Acreage</div>
            <div style={{ ...govKpiValue, marginTop: 6, color: GOV.brand }}>
              {displayVendor.utilized_acreage}
            </div>
            <div style={govKpiSub}>
              {Math.round(
                (displayVendor.utilized_acreage / displayVendor.total_acreage) *
                  100
              )}
              % utilized
            </div>
          </div>
          <div style={govCardPadded}>
            <div style={govKpiLabel}>Available Acreage</div>
            <div style={{ ...govKpiValue, marginTop: 6 }}>
              {displayVendor.available_acreage}
            </div>
            <div style={govKpiSub}>acres not planted</div>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            borderBottom: `1px solid ${GOV.border}`,
            marginBottom: 20,
            display: "flex",
            flexWrap: "wrap",
            gap: 0,
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "12px 20px",
                fontSize: 12.5,
                fontWeight: 600,
                background: "none",
                border: "none",
                borderBottom:
                  activeTab === tab.id
                    ? `2px solid ${GOV.accent}`
                    : "2px solid transparent",
                color: activeTab === tab.id ? GOV.accent : GOV.muted,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "color .15s, border-color .15s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Card */}
        <div style={{ ...govCard, padding: "28px 28px" }}>
          {/* ── Personal Details Tab ──────────────────────────────────── */}
          {activeTab === "personal" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {/* Contact Information */}
              <div>
                <h2 style={sectionTitle}>Contact Information</h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 20,
                  }}
                >
                  <div>
                    <div style={fieldLabel}>Contact Person</div>
                    <div style={fieldValue}>
                      {displayVendor.contact_person}
                    </div>
                  </div>
                  <div>
                    <div style={fieldLabel}>Email</div>
                    <div style={fieldValue}>{displayVendor.email}</div>
                  </div>
                  <div>
                    <div style={fieldLabel}>Phone</div>
                    <div style={fieldValue}>{displayVendor.phone}</div>
                  </div>
                  <div>
                    <div style={fieldLabel}>Registered Date</div>
                    <div style={fieldValue}>
                      {new Date(displayVendor.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Farm Location */}
              <div>
                <h2 style={sectionTitle}>Farm Location</h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 20,
                  }}
                >
                  <div>
                    <div style={fieldLabel}>Address</div>
                    <div style={fieldValue}>{displayVendor.location}</div>
                  </div>
                  <div>
                    <div style={fieldLabel}>GPS Coordinates</div>
                    <div style={fieldValue}>
                      {displayVendor.gps_coordinates?.lat &&
                      displayVendor.gps_coordinates?.lng
                        ? `${displayVendor.gps_coordinates.lat}, ${displayVendor.gps_coordinates.lng}`
                        : "Not available"}
                    </div>
                  </div>
                </div>
                {/* Map Placeholder */}
                <div
                  style={{
                    marginTop: 16,
                    height: 240,
                    borderRadius: 10,
                    background: GOV.bg,
                    border: `1px solid ${GOV.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <MapPinIcon
                      style={{
                        width: 40,
                        height: 40,
                        margin: "0 auto 8px",
                        color: GOV.lightMuted,
                      }}
                    />
                    <div style={{ fontSize: 12, color: GOV.muted }}>
                      Map visualization
                    </div>
                  </div>
                </div>
              </div>

              {/* Land Overview */}
              <div>
                <h2 style={sectionTitle}>Land Overview</h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: 20,
                  }}
                >
                  <div>
                    <div style={fieldLabel}>Total Acreage</div>
                    <div
                      style={{
                        ...govKpiValue,
                        fontSize: 22,
                        marginTop: 4,
                      }}
                    >
                      {displayVendor.total_acreage}
                    </div>
                  </div>
                  <div>
                    <div style={fieldLabel}>Utilized</div>
                    <div
                      style={{
                        ...govKpiValue,
                        fontSize: 22,
                        marginTop: 4,
                        color: GOV.brand,
                      }}
                    >
                      {displayVendor.utilized_acreage}
                    </div>
                  </div>
                  <div>
                    <div style={fieldLabel}>Available</div>
                    <div
                      style={{
                        ...govKpiValue,
                        fontSize: 22,
                        marginTop: 4,
                      }}
                    >
                      {displayVendor.available_acreage}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Farm Details Tab ──────────────────────────────────────── */}
          {activeTab === "farm" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {/* Crop Types */}
              <div>
                <h2 style={sectionTitle}>Crop Types</h2>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {(displayVendor.crops ?? []).map((crop: any, idx: number) => {
                    const name =
                      typeof crop === "string"
                        ? crop
                        : (crop?.name ?? String(crop));
                    const variety =
                      typeof crop === "string" ? undefined : crop?.variety;
                    const acreage =
                      typeof crop === "string" ? undefined : crop?.acreage;
                    const key = `crop-${idx}`;
                    return (
                      <div
                        key={idx}
                        style={{
                          ...listRow,
                          background:
                            hoveredCard === key ? govHoverBg : GOV.cardBg,
                        }}
                        onMouseEnter={() => setHoveredCard(key)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: GOV.text,
                            }}
                          >
                            {name}
                          </div>
                          {variety && (
                            <div
                              style={{
                                fontSize: 11.5,
                                color: GOV.muted,
                                marginTop: 2,
                              }}
                            >
                              Variety: {variety}
                            </div>
                          )}
                        </div>
                        {acreage !== undefined && (
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: GOV.text,
                            }}
                          >
                            {acreage} acres
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Infrastructure */}
              <div>
                <h2 style={sectionTitle}>Infrastructure</h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: 8,
                  }}
                >
                  {[
                    {
                      label: "Irrigation System",
                      value: vendorInfra?.irrigation ? "Yes" : "No",
                      highlight: !!vendorInfra?.irrigation,
                    },
                    {
                      label: "Rainwater Harvesting",
                      value: vendorInfra?.rainwaterHarvesting ? "Yes" : "No",
                      highlight: !!vendorInfra?.rainwaterHarvesting,
                    },
                    {
                      label: "Ponds",
                      value: vendorInfra?.ponds ?? "N/A",
                      highlight: false,
                    },
                    {
                      label: "Greenhouses",
                      value: vendorInfra?.greenhouses ?? "N/A",
                      highlight: false,
                    },
                    {
                      label: "Shade Houses",
                      value: vendorInfra?.shadeHouses ?? "N/A",
                      highlight: false,
                    },
                    {
                      label: "Transportation",
                      value: vendorInfra?.transportation ?? "N/A",
                      highlight: false,
                    },
                  ].map((item, idx) => {
                    const key = `infra-${idx}`;
                    return (
                      <div
                        key={idx}
                        style={{
                          ...listRow,
                          background:
                            hoveredCard === key ? govHoverBg : GOV.cardBg,
                        }}
                        onMouseEnter={() => setHoveredCard(key)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            color: GOV.text,
                          }}
                        >
                          {item.label}
                        </span>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: item.highlight ? GOV.success : GOV.text,
                          }}
                        >
                          {item.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── Production Tab ────────────────────────────────────────── */}
          {activeTab === "production" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <h2 style={{ ...sectionTitle, marginBottom: 0 }}>
                Current Production Cycles
              </h2>
              {vendorProduction.map((prod) => {
                const key = `prod-${prod.id}`;
                return (
                  <div
                    key={prod.id}
                    style={{
                      ...govCard,
                      padding: "22px 24px",
                      background:
                        hoveredCard === key ? govHoverBg : GOV.cardBg,
                    }}
                    onMouseEnter={() => setHoveredCard(key)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* Production Header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginBottom: 16,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: GOV.text,
                          }}
                        >
                          {prod.crop} - {prod.variety}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: GOV.muted,
                            marginTop: 2,
                          }}
                        >
                          {prod.acreage} acres
                        </div>
                      </div>
                      <span style={govStatusPillStyle("in_progress")}>
                        {govStatusLabel("in_progress")}
                      </span>
                    </div>

                    {/* Production Details Grid */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: 16,
                        marginBottom: 16,
                      }}
                    >
                      <div>
                        <div style={fieldLabel}>Date Planted</div>
                        <div style={fieldValue}>
                          {new Date(prod.datePlanted).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div style={fieldLabel}>Expected Harvest</div>
                        <div style={fieldValue}>
                          {new Date(prod.expectedHarvest).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div style={fieldLabel}>Expected Amount</div>
                        <div style={fieldValue}>{prod.expectedAmount}</div>
                      </div>
                      <div>
                        <div style={fieldLabel}>Post-Harvest Storage</div>
                        <div style={fieldValue}>{prod.storage}</div>
                      </div>
                    </div>

                    {/* Chemical Usage */}
                    <div>
                      <div style={{ ...fieldLabel, marginBottom: 8 }}>
                        Chemical Usage
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                        }}
                      >
                        {(prod.chemicals ?? []).map(
                          (chem: any, idx: number) => (
                            <div
                              key={idx}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "10px 14px",
                                borderRadius: 8,
                                background: GOV.bg,
                              }}
                            >
                              <div>
                                <div
                                  style={{
                                    fontSize: 12.5,
                                    fontWeight: 600,
                                    color: GOV.text,
                                  }}
                                >
                                  {chem.name}
                                </div>
                                <div
                                  style={{
                                    fontSize: 11,
                                    color: GOV.muted,
                                    marginTop: 1,
                                  }}
                                >
                                  Dose: {chem.dose}
                                </div>
                              </div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: GOV.muted,
                                }}
                              >
                                {new Date(chem.date).toLocaleDateString()}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Programs Tab ──────────────────────────────────────────── */}
          {activeTab === "programs" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <h2 style={{ ...sectionTitle, marginBottom: 0 }}>
                Enrolled Programs
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {vendorPrograms.map((program: any) => {
                  const key = `prog-${program.id}`;
                  return (
                    <div
                      key={program.id}
                      style={{
                        ...listRow,
                        padding: "16px 20px",
                        background:
                          hoveredCard === key ? govHoverBg : GOV.cardBg,
                      }}
                      onMouseEnter={() => setHoveredCard(key)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: GOV.text,
                          }}
                        >
                          {program.name}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                            marginTop: 6,
                            fontSize: 11.5,
                            color: GOV.muted,
                          }}
                        >
                          <span>
                            Enrolled:{" "}
                            {new Date(
                              program.enrolledDate
                            ).toLocaleDateString()}
                          </span>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            Performance:{" "}
                            <span
                              style={{
                                fontWeight: 600,
                                color:
                                  program.performance === "excellent"
                                    ? GOV.success
                                    : GOV.accent,
                              }}
                            >
                              {program.performance}
                            </span>
                          </span>
                        </div>
                      </div>
                      <span style={govStatusPillStyle(program.status)}>
                        {govStatusLabel(program.status)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Market Activity Tab ───────────────────────────────────── */}
          {activeTab === "market" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {/* Purchase Requirements */}
              <div>
                <h2 style={sectionTitle}>Purchase Requirements</h2>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {(vendorMarket.requirements ?? []).map(
                    (req: any, idx: number) => {
                      const key = `req-${idx}`;
                      return (
                        <div
                          key={idx}
                          style={{
                            ...govCard,
                            padding: "16px 20px",
                            background:
                              hoveredCard === key ? govHoverBg : GOV.cardBg,
                          }}
                          onMouseEnter={() => setHoveredCard(key)}
                          onMouseLeave={() => setHoveredCard(null)}
                        >
                          <div
                            style={{
                              fontSize: 13.5,
                              fontWeight: 600,
                              color: GOV.text,
                            }}
                          >
                            {req.crop}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: GOV.muted,
                              marginTop: 4,
                            }}
                          >
                            Quantity: {req.quantity} · Frequency: {req.frequency}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: GOV.lightMuted,
                              marginTop: 3,
                            }}
                          >
                            Preferred: {req.preferredVariety}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Recent Transactions */}
              <div>
                <h2 style={sectionTitle}>Recent Transactions</h2>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {(vendorMarket.transactions ?? []).map(
                    (trans: any, idx: number) => {
                      const key = `trans-${idx}`;
                      return (
                        <div
                          key={idx}
                          style={{
                            ...listRow,
                            padding: "16px 20px",
                            background:
                              hoveredCard === key ? govHoverBg : GOV.cardBg,
                          }}
                          onMouseEnter={() => setHoveredCard(key)}
                          onMouseLeave={() => setHoveredCard(null)}
                        >
                          <div>
                            <div
                              style={{
                                fontSize: 13.5,
                                fontWeight: 600,
                                color: GOV.text,
                              }}
                            >
                              {trans.crop} - {trans.quantity}
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: GOV.muted,
                                marginTop: 3,
                              }}
                            >
                              {trans.buyer} ·{" "}
                              {new Date(trans.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: GOV.brand,
                            }}
                          >
                            {trans.amount}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Products Tab ──────────────────────────────────────────── */}
          {activeTab === "products" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h2 style={{ ...sectionTitle, marginBottom: 0 }}>
                  Listed Products
                </h2>
                <Link
                  href={`/government/products/upload?vendorId=${vendorId}`}
                  style={govPrimaryButton}
                >
                  <PlusIcon style={{ width: 14, height: 14 }} />
                  Upload Product
                </Link>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {displayProducts.map((product) => {
                  const isAvailable = product.harvest_date
                    ? new Date(product.harvest_date) <= new Date()
                    : true;
                  const statusLabel = isAvailable ? "active" : "pending";
                  const key = `prod-item-${product.id}`;
                  return (
                    <div
                      key={product.id}
                      style={{
                        ...listRow,
                        padding: "16px 20px",
                        background:
                          hoveredCard === key ? govHoverBg : GOV.cardBg,
                      }}
                      onMouseEnter={() => setHoveredCard(key)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13.5,
                              fontWeight: 600,
                              color: GOV.text,
                            }}
                          >
                            {product.name}
                          </span>
                          <span style={govStatusPillStyle(statusLabel)}>
                            {isAvailable ? "Available" : "Reserved"}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: GOV.muted,
                            marginTop: 4,
                          }}
                        >
                          {product.quantity_available}{" "}
                          {product.unit_of_measurement} · Harvest:{" "}
                          {product.harvest_date
                            ? new Date(
                                product.harvest_date
                              ).toLocaleDateString()
                            : "TBD"}
                        </div>
                        {product.price_per_unit !== undefined && (
                          <div
                            style={{
                              fontSize: 11.5,
                              color: GOV.text,
                              marginTop: 3,
                              fontWeight: 500,
                            }}
                          >
                            Price: ${product.price_per_unit?.toFixed(2)} per{" "}
                            {product.unit_of_measurement}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
