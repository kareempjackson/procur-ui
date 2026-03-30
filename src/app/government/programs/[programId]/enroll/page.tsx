"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircleIcon,
  XCircleIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowLeftIcon,
  DocumentCheckIcon,
  InformationCircleIcon,
  CalendarIcon,
  BanknotesIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolidIcon } from "@heroicons/react/24/solid";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchProgram,
  selectCurrentProgram,
  selectProgramDetailStatus,
} from "@/store/slices/governmentProgramsSlice";
import {
  fetchVendors,
  selectVendors,
  selectVendorsStatus,
} from "@/store/slices/governmentVendorsSlice";
import { Vendor } from "@/types";
import { useToast } from "@/components/ui/Toast";
import {
  GOV,
  govCard,
  govCardPadded,
  govPageTitle,
  govPageSubtitle,
  govPillButton,
  govPrimaryButton,
  govStatusPillStyle,
  govStatusLabel,
  govHoverBg,
} from "../../../styles";

type EnrollmentStep = "select" | "review" | "confirm";

interface SelectedVendor {
  id: string;
  name: string;
  location: string;
  total_acreage: number;
  status: string;
  eligibilityStatus: "eligible" | "ineligible" | "review";
  eligibilityReasons: string[];
}

/* ── Shared inline style fragments ────────────────────────────────────────── */

const inputStyle: React.CSSProperties = {
  border: "1px solid #ebe7df",
  borderRadius: 8,
  padding: "10px 14px",
  fontSize: 13,
  width: "100%",
  fontFamily: "inherit",
  outline: "none",
  color: GOV.text,
  background: GOV.cardBg,
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  width: "auto",
  padding: "8px 12px",
  cursor: "pointer",
};

const sectionLabel: React.CSSProperties = {
  fontSize: 10.5,
  fontWeight: 700,
  color: GOV.muted,
  textTransform: "uppercase",
  letterSpacing: ".06em",
  marginBottom: 4,
};

const summaryValue: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: GOV.text,
};

const eligibilityBg: Record<string, string> = {
  eligible: GOV.successBg,
  review: GOV.warningBg,
  ineligible: GOV.dangerBg,
};

const eligibilityColor: Record<string, string> = {
  eligible: GOV.success,
  review: GOV.warning,
  ineligible: GOV.danger,
};

const eligibilityLabel: Record<string, string> = {
  eligible: "Eligible",
  review: "Requires Review",
  ineligible: "Not Eligible",
};

export default function ProgramEnrollmentPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const programId = params.programId as string;

  // Redux state
  const program = useAppSelector(selectCurrentProgram);
  const programStatus = useAppSelector(selectProgramDetailStatus);
  const vendors = useAppSelector(selectVendors);
  const vendorsStatus = useAppSelector(selectVendorsStatus);

  // Local state
  const [step, setStep] = useState<EnrollmentStep>("select");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendors, setSelectedVendors] = useState<SelectedVendor[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showEligibleOnly, setShowEligibleOnly] = useState(false);
  const [enrollmentNotes, setEnrollmentNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredVendor, setHoveredVendor] = useState<string | null>(null);
  const { show } = useToast();

  // Fetch program and vendors
  useEffect(() => {
    if (programId && programStatus === "idle") {
      dispatch(fetchProgram(programId));
    }
  }, [programId, programStatus, dispatch]);

  useEffect(() => {
    if (vendorsStatus === "idle") {
      dispatch(fetchVendors({ page: 1, limit: 100 }));
    }
  }, [vendorsStatus, dispatch]);

  // Check vendor eligibility
  const checkEligibility = (
    vendor: Vendor
  ): {
    status: "eligible" | "ineligible" | "review";
    reasons: string[];
  } => {
    const reasons: string[] = [];
    let status: "eligible" | "ineligible" | "review" = "eligible";

    if (!program) {
      return { status: "review", reasons: ["Program data not available"] };
    }

    if (vendor.compliance_status === "alert") {
      reasons.push("Has outstanding compliance issues");
      status = "ineligible";
    }

    if (
      program.eligibility?.some((e) => e.toLowerCase().includes("10 acres"))
    ) {
      if (vendor.total_acreage < 10) {
        reasons.push("Does not meet minimum acreage requirement (10 acres)");
        status = "ineligible";
      }
    }

    if (status === "eligible") {
      reasons.push("Meets all eligibility requirements");
    }

    return { status, reasons };
  };

  // Filter and search vendors
  const filteredVendors = useMemo(() => {
    let filtered = [...vendors];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(query) ||
          v.location.toLowerCase().includes(query)
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((v) => v.compliance_status === filterStatus);
    }

    const withEligibility = filtered.map((vendor) => {
      const eligibility = checkEligibility(vendor);
      return {
        id: vendor.id,
        name: vendor.name,
        location: vendor.location,
        total_acreage: vendor.total_acreage || 0,
        status: vendor.compliance_status,
        eligibilityStatus: eligibility.status,
        eligibilityReasons: eligibility.reasons,
      };
    });

    if (showEligibleOnly) {
      return withEligibility.filter((v) => v.eligibilityStatus === "eligible");
    }

    return withEligibility;
  }, [vendors, searchQuery, filterStatus, showEligibleOnly, program]);

  // Handle vendor selection
  const toggleVendorSelection = (vendor: SelectedVendor) => {
    if (vendor.eligibilityStatus === "ineligible") return;

    setSelectedVendors((prev) => {
      const isSelected = prev.some((v) => v.id === vendor.id);
      if (isSelected) {
        return prev.filter((v) => v.id !== vendor.id);
      } else {
        return [...prev, vendor];
      }
    });
  };

  // Handle enrollment submission
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      router.push(
        `/government/programs?enrolled=success&count=${selectedVendors.length}`
      );
    } catch (error) {
      console.error("Enrollment failed:", error);
      show("Failed to enroll vendors. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stats for selected vendors
  const selectedStats = useMemo(() => {
    const eligible = selectedVendors.filter(
      (v) => v.eligibilityStatus === "eligible"
    ).length;
    const review = selectedVendors.filter(
      (v) => v.eligibilityStatus === "review"
    ).length;
    const totalAcreage = selectedVendors.reduce(
      (sum, v) => sum + v.total_acreage,
      0
    );

    return { eligible, review, totalAcreage };
  }, [selectedVendors]);

  /* ── Loading state ──────────────────────────────────────────────────────── */

  if (programStatus === "loading" || !program) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: GOV.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            border: `3px solid ${GOV.border}`,
            borderTopColor: GOV.accent,
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
      </div>
    );
  }

  /* ── Step indicator helper ──────────────────────────────────────────────── */

  const stepChip = (
    label: string,
    stepKey: EnrollmentStep,
    num: number
  ): React.ReactNode => {
    const isActive = step === stepKey;
    const steps: EnrollmentStep[] = ["select", "review", "confirm"];
    const currentIdx = steps.indexOf(step);
    const thisIdx = steps.indexOf(stepKey);
    const isPast = thisIdx < currentIdx;

    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 16px",
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 700,
          background: isActive ? GOV.accent : isPast ? GOV.successBg : GOV.cardBg,
          color: isActive ? "#fff" : isPast ? GOV.success : GOV.muted,
          border: `1px solid ${isActive ? GOV.accent : isPast ? GOV.success : GOV.border}`,
          transition: "all .2s",
        }}
      >
        {isPast ? (
          <CheckCircleIcon style={{ width: 14, height: 14 }} />
        ) : (
          <span>{num}.</span>
        )}
        {label}
      </div>
    );
  };

  /* ── Main render ────────────────────────────────────────────────────────── */

  return (
    <div style={{ minHeight: "100vh", background: GOV.bg, color: GOV.text }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <Link
            href="/government/programs"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 12,
              fontWeight: 600,
              color: GOV.accent,
              textDecoration: "none",
              marginBottom: 16,
            }}
          >
            <ArrowLeftIcon style={{ width: 14, height: 14 }} />
            Back to Programs
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <h1 style={govPageTitle}>Enroll Vendors</h1>
              <p style={govPageSubtitle}>{program.name}</p>
            </div>

            {/* Progress Steps */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {stepChip("Select Vendors", "select", 1)}
              <div
                style={{
                  width: 24,
                  height: 1,
                  background: GOV.border,
                }}
              />
              {stepChip("Review", "review", 2)}
              <div
                style={{
                  width: 24,
                  height: 1,
                  background: GOV.border,
                }}
              />
              {stepChip("Confirm", "confirm", 3)}
            </div>
          </div>
        </div>

        {/* ── 2-col grid ──────────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* ── Main column ────────────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* ── STEP: SELECT ────────────────────────────────────────── */}
            {step === "select" && (
              <>
                {/* Search & Filters */}
                <div style={govCardPadded}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {/* Search input */}
                    <div style={{ position: "relative" }}>
                      <MagnifyingGlassIcon
                        style={{
                          position: "absolute",
                          left: 12,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 16,
                          height: 16,
                          color: GOV.muted,
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Search vendors by name or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          ...inputStyle,
                          paddingLeft: 36,
                        }}
                      />
                    </div>

                    {/* Filter row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <FunnelIcon
                          style={{ width: 14, height: 14, color: GOV.muted }}
                        />
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: GOV.text,
                          }}
                        >
                          Filters:
                        </span>
                      </div>

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

                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 500,
                          color: GOV.text,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={showEligibleOnly}
                          onChange={(e) => setShowEligibleOnly(e.target.checked)}
                          style={{ accentColor: GOV.accent }}
                        />
                        Show eligible only
                      </label>
                    </div>

                    <div
                      style={{
                        fontSize: 11,
                        color: GOV.muted,
                        fontWeight: 500,
                      }}
                    >
                      Found {filteredVendors.length} vendor
                      {filteredVendors.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>

                {/* Vendor list */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {vendorsStatus === "loading" ? (
                    <div
                      style={{
                        ...govCardPadded,
                        padding: 48,
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          border: `3px solid ${GOV.border}`,
                          borderTopColor: GOV.accent,
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                          margin: "0 auto 12px",
                        }}
                      />
                      <p style={{ fontSize: 12, color: GOV.muted }}>
                        Loading vendors...
                      </p>
                    </div>
                  ) : filteredVendors.length === 0 ? (
                    <div
                      style={{
                        ...govCardPadded,
                        padding: 48,
                        textAlign: "center",
                      }}
                    >
                      <UserGroupIcon
                        style={{
                          width: 40,
                          height: 40,
                          color: GOV.lightMuted,
                          margin: "0 auto 12px",
                        }}
                      />
                      <p style={{ fontSize: 12, color: GOV.muted }}>
                        No vendors found matching your criteria
                      </p>
                    </div>
                  ) : (
                    filteredVendors.map((vendor) => {
                      const isSelected = selectedVendors.some(
                        (v) => v.id === vendor.id
                      );
                      const isIneligible =
                        vendor.eligibilityStatus === "ineligible";
                      const isHovered = hoveredVendor === vendor.id;

                      return (
                        <div
                          key={vendor.id}
                          onClick={() => toggleVendorSelection(vendor)}
                          onMouseEnter={() => setHoveredVendor(vendor.id)}
                          onMouseLeave={() => setHoveredVendor(null)}
                          style={{
                            ...govCard,
                            border: isSelected
                              ? `2px solid ${GOV.accent}`
                              : `2px solid ${isHovered && !isIneligible ? GOV.lightMuted : GOV.border}`,
                            padding: "16px 18px",
                            cursor: isIneligible ? "not-allowed" : "pointer",
                            opacity: isIneligible ? 0.5 : 1,
                            transition: "border-color .15s, box-shadow .15s",
                            boxShadow: isSelected
                              ? `0 0 0 1px ${GOV.accent}20`
                              : "none",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 14,
                            }}
                          >
                            {/* Checkbox circle */}
                            <div style={{ paddingTop: 2, flexShrink: 0 }}>
                              {isSelected ? (
                                <CheckCircleSolidIcon
                                  style={{
                                    width: 22,
                                    height: 22,
                                    color: GOV.accent,
                                  }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: 22,
                                    height: 22,
                                    borderRadius: "50%",
                                    border: `2px solid ${GOV.border}`,
                                  }}
                                />
                              )}
                            </div>

                            {/* Vendor info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  justifyContent: "space-between",
                                  marginBottom: 6,
                                  gap: 8,
                                }}
                              >
                                <div>
                                  <h3
                                    style={{
                                      fontSize: 15,
                                      fontWeight: 700,
                                      color: GOV.text,
                                      margin: 0,
                                    }}
                                  >
                                    {vendor.name}
                                  </h3>
                                  <p
                                    style={{
                                      fontSize: 12,
                                      color: GOV.muted,
                                      margin: "2px 0 0",
                                    }}
                                  >
                                    {vendor.location}
                                  </p>
                                </div>

                                {/* Status badge */}
                                <span style={govStatusPillStyle(vendor.status)}>
                                  {govStatusLabel(vendor.status)}
                                </span>
                              </div>

                              {/* Acreage */}
                              <div
                                style={{
                                  fontSize: 12,
                                  color: GOV.muted,
                                  marginBottom: 10,
                                }}
                              >
                                <span
                                  style={{
                                    fontWeight: 700,
                                    color: GOV.text,
                                  }}
                                >
                                  {vendor.total_acreage.toLocaleString()}
                                </span>{" "}
                                acres
                              </div>

                              {/* Eligibility box */}
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 8,
                                  padding: "10px 12px",
                                  borderRadius: 8,
                                  background:
                                    eligibilityBg[vendor.eligibilityStatus],
                                }}
                              >
                                {vendor.eligibilityStatus === "eligible" ? (
                                  <CheckCircleIcon
                                    style={{
                                      width: 16,
                                      height: 16,
                                      color: GOV.success,
                                      flexShrink: 0,
                                      marginTop: 1,
                                    }}
                                  />
                                ) : vendor.eligibilityStatus === "review" ? (
                                  <InformationCircleIcon
                                    style={{
                                      width: 16,
                                      height: 16,
                                      color: GOV.warning,
                                      flexShrink: 0,
                                      marginTop: 1,
                                    }}
                                  />
                                ) : (
                                  <XCircleIcon
                                    style={{
                                      width: 16,
                                      height: 16,
                                      color: GOV.danger,
                                      flexShrink: 0,
                                      marginTop: 1,
                                    }}
                                  />
                                )}
                                <div style={{ flex: 1 }}>
                                  <p
                                    style={{
                                      fontSize: 11,
                                      fontWeight: 700,
                                      color:
                                        eligibilityColor[
                                          vendor.eligibilityStatus
                                        ],
                                      margin: "0 0 3px",
                                    }}
                                  >
                                    {eligibilityLabel[vendor.eligibilityStatus]}
                                  </p>
                                  <ul
                                    style={{
                                      margin: 0,
                                      padding: 0,
                                      listStyle: "none",
                                    }}
                                  >
                                    {vendor.eligibilityReasons.map(
                                      (reason, idx) => (
                                        <li
                                          key={idx}
                                          style={{
                                            fontSize: 11,
                                            color: GOV.textSecondary,
                                            lineHeight: 1.5,
                                          }}
                                        >
                                          &bull; {reason}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}

            {/* ── STEP: REVIEW ────────────────────────────────────────── */}
            {step === "review" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={govCardPadded}>
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: GOV.text,
                      margin: "0 0 14px",
                    }}
                  >
                    Selected Vendors ({selectedVendors.length})
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {selectedVendors.map((vendor) => (
                      <div
                        key={vendor.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "12px 14px",
                          background: GOV.bg,
                          borderRadius: 8,
                        }}
                      >
                        <div>
                          <p
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: GOV.text,
                              margin: 0,
                            }}
                          >
                            {vendor.name}
                          </p>
                          <p
                            style={{
                              fontSize: 11,
                              color: GOV.muted,
                              margin: "2px 0 0",
                            }}
                          >
                            {vendor.location} &bull;{" "}
                            {vendor.total_acreage.toLocaleString()} acres
                          </p>
                        </div>
                        <button
                          onClick={() => toggleVendorSelection(vendor)}
                          style={{
                            background: "none",
                            border: "none",
                            fontSize: 12,
                            fontWeight: 600,
                            color: GOV.danger,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            padding: "4px 8px",
                            borderRadius: 6,
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  {selectedStats.review > 0 && (
                    <div
                      style={{
                        marginTop: 14,
                        padding: "12px 14px",
                        background: GOV.warningBg,
                        border: `1px solid #f6dfa8`,
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                      }}
                    >
                      <ExclamationTriangleIcon
                        style={{
                          width: 18,
                          height: 18,
                          color: GOV.warning,
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      />
                      <div>
                        <p
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: GOV.warning,
                            margin: "0 0 3px",
                          }}
                        >
                          {selectedStats.review} vendor
                          {selectedStats.review > 1 ? "s" : ""} require manual
                          review
                        </p>
                        <p
                          style={{
                            fontSize: 11,
                            color: GOV.warning,
                            margin: 0,
                            opacity: 0.85,
                          }}
                        >
                          These vendors will be flagged for additional
                          verification before final enrollment.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enrollment Notes */}
                <div style={govCardPadded}>
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: GOV.text,
                      margin: "0 0 12px",
                    }}
                  >
                    Enrollment Notes (Optional)
                  </h3>
                  <textarea
                    value={enrollmentNotes}
                    onChange={(e) => setEnrollmentNotes(e.target.value)}
                    rows={4}
                    placeholder="Add any notes or special instructions for this enrollment..."
                    style={{
                      ...inputStyle,
                      resize: "none",
                    }}
                  />
                </div>
              </div>
            )}

            {/* ── STEP: CONFIRM ───────────────────────────────────────── */}
            {step === "confirm" && (
              <div style={{ ...govCardPadded, padding: "32px 28px" }}>
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: 24,
                  }}
                >
                  <DocumentCheckIcon
                    style={{
                      width: 52,
                      height: 52,
                      color: GOV.accent,
                      margin: "0 auto 12px",
                    }}
                  />
                  <h3
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: GOV.text,
                      margin: "0 0 6px",
                    }}
                  >
                    Confirm Enrollment
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: GOV.muted,
                      margin: 0,
                    }}
                  >
                    Please review the enrollment summary before submitting
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  {/* Summary grid */}
                  <div
                    style={{
                      padding: 16,
                      background: GOV.bg,
                      borderRadius: 8,
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 16,
                      }}
                    >
                      <div>
                        <p style={sectionLabel}>Program</p>
                        <p style={summaryValue}>{program.name}</p>
                      </div>
                      <div>
                        <p style={sectionLabel}>Vendors to Enroll</p>
                        <p style={summaryValue}>{selectedVendors.length}</p>
                      </div>
                      <div>
                        <p style={sectionLabel}>Total Acreage</p>
                        <p style={summaryValue}>
                          {selectedStats.totalAcreage.toLocaleString()} acres
                        </p>
                      </div>
                      <div>
                        <p style={sectionLabel}>Require Review</p>
                        <p style={summaryValue}>{selectedStats.review}</p>
                      </div>
                    </div>
                  </div>

                  {enrollmentNotes && (
                    <div
                      style={{
                        padding: 16,
                        background: GOV.bg,
                        borderRadius: 8,
                      }}
                    >
                      <p style={{ ...sectionLabel, marginBottom: 6 }}>Notes</p>
                      <p
                        style={{
                          fontSize: 13,
                          color: GOV.text,
                          margin: 0,
                          lineHeight: 1.5,
                        }}
                      >
                        {enrollmentNotes}
                      </p>
                    </div>
                  )}

                  {/* Info banner */}
                  <div
                    style={{
                      padding: "12px 14px",
                      background: GOV.infoBg,
                      border: `1px solid #bfdbfe`,
                      borderRadius: 8,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 12,
                        color: GOV.info,
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      <strong>Note:</strong> By submitting this enrollment, you
                      confirm that all selected vendors meet the program
                      requirements. Vendors requiring review will be processed
                      separately.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── Navigation buttons ──────────────────────────────────── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <button
                onClick={() => {
                  if (step === "review") setStep("select");
                  else if (step === "confirm") setStep("review");
                  else router.back();
                }}
                style={govPillButton}
              >
                {step === "select" ? "Cancel" : "Back"}
              </button>

              <button
                onClick={() => {
                  if (step === "select" && selectedVendors.length > 0)
                    setStep("review");
                  else if (step === "review") setStep("confirm");
                  else if (step === "confirm") handleSubmit();
                }}
                disabled={
                  (step === "select" && selectedVendors.length === 0) ||
                  isSubmitting
                }
                style={{
                  ...govPrimaryButton,
                  opacity:
                    (step === "select" && selectedVendors.length === 0) ||
                    isSubmitting
                      ? 0.5
                      : 1,
                  cursor:
                    (step === "select" && selectedVendors.length === 0) ||
                    isSubmitting
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {isSubmitting ? (
                  <>
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        border: "2px solid rgba(255,255,255,.3)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                    Submitting...
                  </>
                ) : step === "confirm" ? (
                  "Submit Enrollment"
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          </div>

          {/* ── Sidebar ────────────────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Program Info */}
            <div
              style={{
                ...govCardPadded,
                position: "sticky",
                top: 24,
              }}
            >
              <h3
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: GOV.text,
                  margin: "0 0 14px",
                }}
              >
                Program Information
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <div>
                  <p style={sectionLabel}>Category</p>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: GOV.text,
                      margin: 0,
                    }}
                  >
                    {program.category}
                  </p>
                </div>

                <div>
                  <p style={sectionLabel}>Description</p>
                  <p
                    style={{
                      fontSize: 12,
                      color: GOV.text,
                      margin: 0,
                      lineHeight: 1.55,
                    }}
                  >
                    {program.description}
                  </p>
                </div>

                <div
                  style={{
                    paddingTop: 14,
                    borderTop: `1px solid ${GOV.border}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 4,
                    }}
                  >
                    <CalendarIcon
                      style={{ width: 14, height: 14, color: GOV.muted }}
                    />
                    <p style={{ ...sectionLabel, marginBottom: 0 }}>Duration</p>
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: GOV.text,
                      margin: 0,
                    }}
                  >
                    {new Date(program.start_date).toLocaleDateString()} -{" "}
                    {new Date(program.end_date).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 4,
                    }}
                  >
                    <BanknotesIcon
                      style={{ width: 14, height: 14, color: GOV.muted }}
                    />
                    <p style={{ ...sectionLabel, marginBottom: 0 }}>
                      Budget Available
                    </p>
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: GOV.text,
                      margin: 0,
                    }}
                  >
                    ${((program.budget - program.budget_used) / 1000).toFixed(0)}K
                  </p>
                  {/* Budget bar */}
                  <div
                    style={{
                      marginTop: 6,
                      height: 5,
                      background: GOV.border,
                      borderRadius: 99,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${program.budget_percentage}%`,
                        background: GOV.accent,
                        borderRadius: 99,
                        transition: "width .4s",
                      }}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: 10.5,
                      color: GOV.muted,
                      marginTop: 4,
                    }}
                  >
                    {program.budget_percentage}% utilized
                  </p>
                </div>

                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 4,
                    }}
                  >
                    <ChartBarIcon
                      style={{ width: 14, height: 14, color: GOV.muted }}
                    />
                    <p style={{ ...sectionLabel, marginBottom: 0 }}>
                      Current Enrollment
                    </p>
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: GOV.text,
                      margin: 0,
                    }}
                  >
                    {program.participants} / {program.target_participants} vendors
                  </p>
                </div>

                {program.benefits && program.benefits.length > 0 && (
                  <div
                    style={{
                      paddingTop: 14,
                      borderTop: `1px solid ${GOV.border}`,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: GOV.text,
                        margin: "0 0 8px",
                      }}
                    >
                      Benefits
                    </p>
                    <ul
                      style={{
                        margin: 0,
                        padding: 0,
                        listStyle: "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      {program.benefits.map((benefit, idx) => (
                        <li
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 6,
                          }}
                        >
                          <CheckCircleIcon
                            style={{
                              width: 14,
                              height: 14,
                              color: GOV.success,
                              flexShrink: 0,
                              marginTop: 1,
                            }}
                          />
                          <span style={{ fontSize: 11, color: GOV.text }}>
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {program.eligibility && program.eligibility.length > 0 && (
                  <div
                    style={{
                      paddingTop: 14,
                      borderTop: `1px solid ${GOV.border}`,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: GOV.text,
                        margin: "0 0 8px",
                      }}
                    >
                      Eligibility Requirements
                    </p>
                    <ul
                      style={{
                        margin: 0,
                        padding: 0,
                        listStyle: "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      {program.eligibility.map((req, idx) => (
                        <li
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 6,
                          }}
                        >
                          <DocumentCheckIcon
                            style={{
                              width: 14,
                              height: 14,
                              color: GOV.muted,
                              flexShrink: 0,
                              marginTop: 1,
                            }}
                          />
                          <span style={{ fontSize: 11, color: GOV.text }}>
                            {req}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Selection summary (shown on select step) */}
            {step === "select" && selectedVendors.length > 0 && (
              <div
                style={{
                  background: GOV.brand,
                  borderRadius: 10,
                  padding: "18px 20px",
                  color: "#fff",
                }}
              >
                <h3
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    margin: "0 0 14px",
                    color: "#fff",
                  }}
                >
                  Selection Summary
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: 10.5,
                        opacity: 0.7,
                        margin: "0 0 2px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: ".06em",
                      }}
                    >
                      Vendors Selected
                    </p>
                    <p
                      style={{
                        fontSize: 26,
                        fontWeight: 800,
                        margin: 0,
                        lineHeight: 1,
                      }}
                    >
                      {selectedVendors.length}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 10.5,
                        opacity: 0.7,
                        margin: "0 0 2px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: ".06em",
                      }}
                    >
                      Eligible
                    </p>
                    <p
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        margin: 0,
                        lineHeight: 1,
                      }}
                    >
                      {selectedStats.eligible}
                    </p>
                  </div>
                  {selectedStats.review > 0 && (
                    <div>
                      <p
                        style={{
                          fontSize: 10.5,
                          opacity: 0.7,
                          margin: "0 0 2px",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: ".06em",
                        }}
                      >
                        Require Review
                      </p>
                      <p
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          margin: 0,
                          lineHeight: 1,
                        }}
                      >
                        {selectedStats.review}
                      </p>
                    </div>
                  )}
                  <div>
                    <p
                      style={{
                        fontSize: 10.5,
                        opacity: 0.7,
                        margin: "0 0 2px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: ".06em",
                      }}
                    >
                      Total Acreage
                    </p>
                    <p
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        margin: 0,
                        lineHeight: 1,
                      }}
                    >
                      {selectedStats.totalAcreage.toLocaleString()} acres
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spin animation keyframes */}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
