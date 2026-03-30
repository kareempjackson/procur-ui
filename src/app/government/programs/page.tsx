"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AcademicCapIcon,
  BanknotesIcon,
  UserGroupIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchPrograms,
  selectPrograms,
  selectProgramsStatus,
  selectProgramStats,
} from "@/store/slices/governmentProgramsSlice";
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

export default function ProgramsPage() {
  const dispatch = useAppDispatch();
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  // Redux state
  const programs = useAppSelector(selectPrograms);
  const programsStatus = useAppSelector(selectProgramsStatus);
  const programStats = useAppSelector(selectProgramStats);

  // Fetch programs on mount
  useEffect(() => {
    if (programsStatus === "idle") {
      dispatch(fetchPrograms({ page: 1, limit: 50 }));
    }
  }, [programsStatus, dispatch]);

  // Refresh handler
  const handleRefresh = () => {
    dispatch(fetchPrograms({ page: 1, limit: 50 }));
  };

  // Mock program data for fallback
  const mockPrograms = [
    {
      id: "1",
      name: "Irrigation Support Program",
      description:
        "Financial assistance for installing and maintaining irrigation systems",
      status: "active" as const,
      category: "Infrastructure",
      budget: 500000,
      budget_used: 425000,
      budget_percentage: 85,
      participants: 234,
      target_participants: 300,
      start_date: "2023-01-15",
      end_date: "2024-12-31",
      created_at: "2023-01-15",
      updated_at: "2024-10-01",
      benefits: [
        "Up to $5,000 per farm",
        "Technical consultation included",
        "Priority processing for eligible farmers",
      ],
      eligibility: [
        "Minimum 10 acres of cultivated land",
        "Active farm registration",
        "No outstanding compliance issues",
      ],
      performance: "excellent",
    },
    {
      id: "2",
      name: "Organic Certification",
      description:
        "Support program for obtaining organic farming certification",
      status: "active" as const,
      category: "Certification",
      budget: 200000,
      budget_used: 124000,
      budget_percentage: 62,
      participants: 156,
      target_participants: 200,
      start_date: "2023-03-01",
      end_date: "2025-02-28",
      created_at: "2023-03-01",
      updated_at: "2024-10-01",
      benefits: [
        "Certification fee coverage up to 75%",
        "Organic farming training",
        "Market access support",
      ],
      eligibility: [
        "2+ years of farm operation",
        "Commitment to organic practices",
        "Regular reporting",
      ],
      performance: "good",
    },
    {
      id: "3",
      name: "Youth Farmer Initiative",
      description:
        "Mentorship and financial support for farmers under 35 years old",
      status: "active" as const,
      category: "Development",
      budget: 150000,
      budget_used: 67500,
      budget_percentage: 45,
      participants: 89,
      target_participants: 150,
      start_date: "2024-01-10",
      end_date: "2025-12-31",
      created_at: "2024-01-10",
      updated_at: "2024-10-01",
      benefits: [
        "Startup grants up to $3,000",
        "Mentorship from experienced farmers",
        "Reduced certification fees",
      ],
      eligibility: [
        "Age 18-35",
        "New or early-stage farming operation",
        "Completed agriculture training",
      ],
      performance: "good",
    },
    {
      id: "4",
      name: "Climate Smart Agriculture",
      description:
        "Incentives for adopting climate-resilient farming practices",
      status: "planning" as const,
      category: "Sustainability",
      budget: 300000,
      budget_used: 0,
      budget_percentage: 0,
      participants: 0,
      target_participants: 250,
      start_date: "2025-01-01",
      end_date: "2026-12-31",
      created_at: "2024-09-01",
      updated_at: "2024-10-01",
      benefits: [
        "Grants for climate-smart technology",
        "Carbon credit registration support",
        "Weather monitoring systems",
      ],
      eligibility: [
        "Minimum 15 acres",
        "Willingness to adopt new practices",
        "Regular data reporting",
      ],
      performance: "pending",
    },
  ];

  // Use real programs or fallback to mock
  const displayPrograms = programs.length > 0 ? programs : mockPrograms;

  // Calculate enrollment stats
  const enrollmentStats = programStats || {
    totalEnrollments: displayPrograms.reduce(
      (sum, p) => sum + p.participants,
      0
    ),
    active: displayPrograms.filter((p) => p.status === "active").length,
    totalBudget: displayPrograms.reduce((sum, p) => sum + p.budget, 0),
    totalSpent: displayPrograms.reduce((sum, p) => sum + p.budget_used, 0),
    total: displayPrograms.length,
  };

  const topPerformers = [
    { vendor: "Green Valley Farms", programs: 3, performance: "excellent" },
    { vendor: "Sunrise Agricultural Co.", programs: 2, performance: "good" },
    { vendor: "Coastal Farms Group", programs: 4, performance: "excellent" },
  ];

  const selectedProgramData = displayPrograms.find(
    (p) => p.id === selectedProgram
  );

  const getPerformanceColor = (perf: string) => {
    switch (perf) {
      case "excellent":
        return GOV.success;
      case "good":
        return GOV.accent;
      default:
        return GOV.muted;
    }
  };

  const getProgressColor = (pct: number) => {
    if (pct >= 90) return GOV.accent;
    if (pct >= 70) return GOV.warning;
    return GOV.brand;
  };

  return (
    <div style={{ minHeight: "100vh", background: GOV.bg, color: GOV.text }}>
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <h1 style={govPageTitle}>Programs Management</h1>
            <p style={govPageSubtitle}>
              Manage government incentive programs and track participation
              {programsStatus === "loading" && " \u2022 Loading..."}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={handleRefresh}
              disabled={programsStatus === "loading"}
              style={{
                ...govPillButton,
                opacity: programsStatus === "loading" ? 0.5 : 1,
                cursor: programsStatus === "loading" ? "not-allowed" : "pointer",
              }}
            >
              <ArrowPathIcon
                style={{
                  width: 16,
                  height: 16,
                  animation: programsStatus === "loading" ? "spin 1s linear infinite" : "none",
                }}
              />
              Refresh
            </button>
            <Link
              href="/government/programs/new"
              style={govPrimaryButton}
            >
              <PlusIcon style={{ width: 16, height: 16 }} />
              Create New Program
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
          <div style={govCardPadded}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <AcademicCapIcon style={{ width: 15, height: 15, color: GOV.muted }} />
              <div style={govKpiLabel}>Active Programs</div>
            </div>
            <div style={govKpiValue}>
              {programsStatus === "loading"
                ? "..."
                : enrollmentStats.active || 0}
            </div>
            <div style={govKpiSub}>of {enrollmentStats.total || 0} total</div>
          </div>

          <div style={govCardPadded}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <UserGroupIcon style={{ width: 15, height: 15, color: GOV.muted }} />
              <div style={govKpiLabel}>Total Enrollments</div>
            </div>
            <div style={govKpiValue}>
              {programsStatus === "loading"
                ? "..."
                : enrollmentStats.totalEnrollments || 0}
            </div>
            <div style={govKpiSub}>across all programs</div>
          </div>

          <div style={govCardPadded}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <BanknotesIcon style={{ width: 15, height: 15, color: GOV.muted }} />
              <div style={govKpiLabel}>Total Budget</div>
            </div>
            <div style={govKpiValue}>
              {programsStatus === "loading"
                ? "..."
                : `$${(enrollmentStats.totalBudget / 1000000).toFixed(1)}M`}
            </div>
            <div style={govKpiSub}>allocated funds</div>
          </div>

          <div style={govCardPadded}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <ChartBarIcon style={{ width: 15, height: 15, color: GOV.muted }} />
              <div style={govKpiLabel}>Budget Used</div>
            </div>
            <div style={{ ...govKpiValue, color: GOV.brand }}>
              {programsStatus === "loading"
                ? "..."
                : `${Math.round(
                    (enrollmentStats.totalSpent / enrollmentStats.totalBudget) *
                      100
                  )}%`}
            </div>
            <div style={govKpiSub}>utilization rate</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
          {/* Left Column - Programs List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {displayPrograms.map((program) => {
              const isSelected = selectedProgram === program.id;
              const isHovered = hoveredCard === program.id;
              return (
                <div
                  key={program.id}
                  style={{
                    ...govCard,
                    padding: "20px 22px",
                    cursor: "pointer",
                    borderColor: isSelected
                      ? GOV.accent
                      : isHovered
                        ? GOV.accent
                        : GOV.border,
                    background: isHovered && !isSelected ? GOV.bg : GOV.cardBg,
                    transition: "border-color .15s, background .15s",
                  }}
                  onClick={() => setSelectedProgram(program.id)}
                  onMouseEnter={() => setHoveredCard(program.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <h2 style={{ fontSize: 16, fontWeight: 700, color: GOV.text, margin: 0 }}>
                          {program.name}
                        </h2>
                        <span style={govStatusPillStyle(program.status)}>
                          {govStatusLabel(program.status)}
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: GOV.textSecondary, margin: 0, lineHeight: 1.45 }}>
                        {program.description}
                      </p>
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: 8,
                          padding: "2px 10px",
                          borderRadius: 99,
                          fontSize: 11,
                          fontWeight: 600,
                          background: GOV.brandLight,
                          color: GOV.brand,
                        }}
                      >
                        {program.category}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 10.5, color: GOV.muted, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: ".04em", marginBottom: 3 }}>
                        Participants
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: GOV.text }}>
                        {program.participants}
                      </div>
                      <div style={{ fontSize: 11, color: GOV.lightMuted, fontWeight: 500 }}>
                        / {program.target_participants} target
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10.5, color: GOV.muted, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: ".04em", marginBottom: 3 }}>
                        Budget
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: GOV.text }}>
                        ${(program.budget / 1000).toFixed(0)}K
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10.5, color: GOV.muted, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: ".04em", marginBottom: 3 }}>
                        Used
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: GOV.brand }}>
                        {program.budget_percentage}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10.5, color: GOV.muted, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: ".04em", marginBottom: 3 }}>
                        Performance
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          textTransform: "capitalize" as const,
                          color: getPerformanceColor(program.performance),
                        }}
                      >
                        {program.performance}
                      </div>
                    </div>
                  </div>

                  {/* Budget Progress Bar */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 10.5, color: GOV.muted, fontWeight: 600 }}>
                        Budget Utilization
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: GOV.text }}>
                        ${(program.budget_used / 1000).toFixed(1)}K / $
                        {(program.budget / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div
                      style={{
                        height: 5,
                        background: GOV.border,
                        borderRadius: 99,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          borderRadius: 99,
                          width: `${program.budget_percentage}%`,
                          background: getProgressColor(program.budget_percentage),
                          transition: "width .3s ease",
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column - Program Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {selectedProgramData ? (
              <>
                {/* Program Details */}
                <div style={{ ...govCard, overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px", borderBottom: `1px solid ${GOV.border}` }}>
                    <h3 style={govSectionHeader}>Program Details</h3>
                  </div>
                  <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <div style={{ ...govKpiLabel, marginBottom: 6 }}>
                        Duration
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: GOV.text, fontWeight: 500 }}>
                        <ClockIcon style={{ width: 14, height: 14, color: GOV.muted }} />
                        {new Date(
                          (selectedProgramData as any).start_date ??
                            (selectedProgramData as any).startDate
                        ).toLocaleDateString()}{" "}
                        -{" "}
                        {new Date(
                          (selectedProgramData as any).end_date ??
                            (selectedProgramData as any).endDate
                        ).toLocaleDateString()}
                      </div>
                    </div>

                    <div>
                      <div style={{ ...govKpiLabel, marginBottom: 8 }}>
                        Benefits
                      </div>
                      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                        {selectedProgramData.benefits.map((benefit, idx) => (
                          <li
                            key={idx}
                            style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 13, color: GOV.text }}
                          >
                            <CheckCircleIcon style={{ width: 14, height: 14, color: GOV.brand, marginTop: 2, flexShrink: 0 }} />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div style={{ ...govKpiLabel, marginBottom: 8 }}>
                        Eligibility Criteria
                      </div>
                      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                        {selectedProgramData.eligibility.map(
                          (criterion, idx) => (
                            <li
                              key={idx}
                              style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 13, color: GOV.text }}
                            >
                              <CheckCircleIcon style={{ width: 14, height: 14, color: GOV.muted, marginTop: 2, flexShrink: 0 }} />
                              {criterion}
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    <div style={{ paddingTop: 12, borderTop: `1px solid ${GOV.border}` }}>
                      <Link
                        href={`/government/programs/${selectedProgramData.id}/enroll`}
                        style={{
                          ...govPrimaryButton,
                          display: "flex",
                          justifyContent: "center",
                          width: "100%",
                          padding: "10px 18px",
                        }}
                      >
                        Enroll Vendors
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ ...govCard, padding: "48px 20px" }}>
                <div style={{ textAlign: "center" as const }}>
                  <AcademicCapIcon style={{ width: 40, height: 40, margin: "0 auto 10px", color: GOV.lightMuted }} />
                  <p style={{ fontSize: 13, color: GOV.muted, margin: 0, fontWeight: 500 }}>
                    Select a program to view details
                  </p>
                </div>
              </div>
            )}

            {/* Top Performers */}
            <div style={{ ...govCard, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: `1px solid ${GOV.border}` }}>
                <h3 style={govSectionHeader}>Top Performers</h3>
                <p style={{ fontSize: 11, color: GOV.muted, margin: "3px 0 0", fontWeight: 500 }}>
                  Most active program participants
                </p>
              </div>
              <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                {topPerformers.map((performer, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: `1px solid ${GOV.border}`,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: GOV.text }}>
                        {performer.vendor}
                      </div>
                      <div style={{ fontSize: 11, color: GOV.muted, marginTop: 2, fontWeight: 500 }}>
                        {performer.programs} programs
                      </div>
                    </div>
                    <span
                      style={govStatusPillStyle(
                        performer.performance === "excellent" ? "compliant" : "pending"
                      )}
                    >
                      {performer.performance}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ ...govCard, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: `1px solid ${GOV.border}` }}>
                <h3 style={govSectionHeader}>Quick Actions</h3>
              </div>
              <div style={{ padding: "8px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  { href: "/government/reporting?type=program-participation", label: "Generate Program Report", id: "report" },
                  { href: "/government/vendors", label: "View All Vendors", id: "vendors" },
                  { href: "/government/data", label: "Export Program Data", id: "export" },
                ].map((action) => (
                  <Link
                    key={action.id}
                    href={action.href}
                    style={{
                      display: "block",
                      padding: "10px 14px",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      color: hoveredAction === action.id ? GOV.accent : GOV.text,
                      textDecoration: "none",
                      background: hoveredAction === action.id ? govHoverBg : "transparent",
                      transition: "background .15s, color .15s",
                    }}
                    onMouseEnter={() => setHoveredAction(action.id)}
                    onMouseLeave={() => setHoveredAction(null)}
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
