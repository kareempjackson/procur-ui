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

export default function ProgramsPage() {
  const dispatch = useAppDispatch();
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          label: "Active",
          color: "bg-[var(--primary-base)]/10 text-[color:var(--primary-base)]",
        };
      case "planning":
        return {
          label: "Planning",
          color: "bg-yellow-100 text-yellow-800",
        };
      case "completed":
        return {
          label: "Completed",
          color: "bg-gray-100 text-gray-800",
        };
      default:
        return {
          label: "Unknown",
          color: "bg-gray-100 text-gray-800",
        };
    }
  };

  const selectedProgramData = displayPrograms.find(
    (p) => p.id === selectedProgram
  );

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-[color:var(--secondary-black)]">
              Programs Management
            </h1>
            <p className="text-sm text-[color:var(--secondary-muted-edge)] mt-1">
              Manage government incentive programs and track participation
              {programsStatus === "loading" && " • Loading..."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={programsStatus === "loading"}
              className="inline-flex items-center gap-2 rounded-full bg-white border border-[color:var(--secondary-soft-highlight)] text-[color:var(--secondary-black)] px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowPathIcon
                className={`h-5 w-5 ${
                  programsStatus === "loading" ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>
            <Link
              href="/government/programs/new"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--primary-accent2)] text-white px-5 py-2.5 text-sm font-medium hover:bg-[var(--primary-accent3)] transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Create New Program
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="flex items-center gap-2 mb-2">
              <AcademicCapIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
              <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)]">
                Active Programs
              </div>
            </div>
            <div className="text-3xl font-semibold text-[color:var(--secondary-black)]">
              {programsStatus === "loading"
                ? "..."
                : enrollmentStats.active || 0}
            </div>
          </div>
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="flex items-center gap-2 mb-2">
              <UserGroupIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
              <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)]">
                Total Enrollments
              </div>
            </div>
            <div className="text-3xl font-semibold text-[color:var(--secondary-black)]">
              {programsStatus === "loading"
                ? "..."
                : enrollmentStats.totalEnrollments || 0}
            </div>
          </div>
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="flex items-center gap-2 mb-2">
              <BanknotesIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
              <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)]">
                Total Budget
              </div>
            </div>
            <div className="text-3xl font-semibold text-[color:var(--secondary-black)]">
              {programsStatus === "loading"
                ? "..."
                : `$${(enrollmentStats.totalBudget / 1000000).toFixed(1)}M`}
            </div>
          </div>
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="flex items-center gap-2 mb-2">
              <ChartBarIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
              <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)]">
                Budget Used
              </div>
            </div>
            <div className="text-3xl font-semibold text-[color:var(--primary-base)]">
              {programsStatus === "loading"
                ? "..."
                : `${Math.round(
                    (enrollmentStats.totalSpent / enrollmentStats.totalBudget) *
                      100
                  )}%`}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Programs List */}
          <div className="lg:col-span-2 space-y-4">
            {displayPrograms.map((program) => {
              const statusConfig = getStatusConfig(program.status);
              return (
                <div
                  key={program.id}
                  className={`rounded-2xl border bg-white p-6 transition-all cursor-pointer ${
                    selectedProgram === program.id
                      ? "border-[var(--primary-accent2)] shadow-md"
                      : "border-[color:var(--secondary-soft-highlight)] hover:border-[var(--primary-accent2)]/50 hover:shadow-sm"
                  }`}
                  onClick={() => setSelectedProgram(program.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-lg font-semibold text-[color:var(--secondary-black)]">
                          {program.name}
                        </h2>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusConfig.color}`}
                        >
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-sm text-[color:var(--secondary-muted-edge)]">
                        {program.description}
                      </p>
                      <div className="inline-flex items-center rounded-full bg-[var(--primary-accent1)]/15 text-[color:var(--primary-accent3)] px-3 py-1 text-xs mt-2">
                        {program.category}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                        Participants
                      </div>
                      <div className="text-lg font-semibold text-[color:var(--secondary-black)]">
                        {program.participants}
                      </div>
                      <div className="text-xs text-[color:var(--secondary-muted-edge)]">
                        / {program.target_participants} target
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                        Budget
                      </div>
                      <div className="text-lg font-semibold text-[color:var(--secondary-black)]">
                        ${(program.budget / 1000).toFixed(0)}K
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                        Used
                      </div>
                      <div className="text-lg font-semibold text-[color:var(--primary-base)]">
                        {program.budget_percentage}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                        Performance
                      </div>
                      <div
                        className={`text-sm font-medium capitalize ${
                          program.performance === "excellent"
                            ? "text-[color:var(--primary-base)]"
                            : program.performance === "good"
                              ? "text-[color:var(--primary-accent3)]"
                              : "text-[color:var(--secondary-muted-edge)]"
                        }`}
                      >
                        {program.performance}
                      </div>
                    </div>
                  </div>

                  {/* Budget Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[color:var(--secondary-muted-edge)]">
                        Budget Utilization
                      </span>
                      <span className="text-xs font-medium text-[color:var(--secondary-black)]">
                        ${(program.budget_used / 1000).toFixed(1)}K / $
                        {(program.budget / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          program.budget_percentage >= 90
                            ? "bg-[var(--primary-accent2)]"
                            : program.budget_percentage >= 70
                              ? "bg-yellow-500"
                              : "bg-[var(--primary-base)]"
                        }`}
                        style={{ width: `${program.budget_percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column - Program Details */}
          <div className="space-y-6">
            {selectedProgramData ? (
              <>
                {/* Program Details */}
                <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
                  <div className="p-5 border-b border-[color:var(--secondary-soft-highlight)]">
                    <h3 className="text-base font-semibold text-[color:var(--secondary-black)]">
                      Program Details
                    </h3>
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <div className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider mb-2">
                        Duration
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[color:var(--secondary-black)]">
                        <ClockIcon className="h-4 w-4" />
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
                      <div className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider mb-2">
                        Benefits
                      </div>
                      <ul className="space-y-2">
                        {selectedProgramData.benefits.map((benefit, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm text-[color:var(--secondary-black)]"
                          >
                            <CheckCircleIcon className="h-4 w-4 text-[color:var(--primary-base)] mt-0.5 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider mb-2">
                        Eligibility Criteria
                      </div>
                      <ul className="space-y-2">
                        {selectedProgramData.eligibility.map(
                          (criterion, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-sm text-[color:var(--secondary-black)]"
                            >
                              <CheckCircleIcon className="h-4 w-4 text-[color:var(--secondary-muted-edge)] mt-0.5 flex-shrink-0" />
                              {criterion}
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-[color:var(--secondary-soft-highlight)]">
                      <Link
                        href={`/government/programs/${selectedProgramData.id}/enroll`}
                        className="block w-full text-center px-4 py-2.5 rounded-lg bg-[var(--primary-accent2)] text-white text-sm font-medium hover:bg-[var(--primary-accent3)] transition-colors"
                      >
                        Enroll Vendors
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-12">
                <div className="text-center">
                  <AcademicCapIcon className="h-12 w-12 mx-auto text-[color:var(--secondary-muted-edge)] mb-3" />
                  <p className="text-sm text-[color:var(--secondary-muted-edge)]">
                    Select a program to view details
                  </p>
                </div>
              </div>
            )}

            {/* Top Performers */}
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
              <div className="p-5 border-b border-[color:var(--secondary-soft-highlight)]">
                <h3 className="text-base font-semibold text-[color:var(--secondary-black)]">
                  Top Performers
                </h3>
                <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                  Most active program participants
                </p>
              </div>
              <div className="p-4 space-y-3">
                {topPerformers.map((performer, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg border border-[color:var(--secondary-soft-highlight)]"
                  >
                    <div>
                      <div className="text-sm font-medium text-[color:var(--secondary-black)]">
                        {performer.vendor}
                      </div>
                      <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                        {performer.programs} programs
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        performer.performance === "excellent"
                          ? "bg-[var(--primary-base)]/10 text-[color:var(--primary-base)]"
                          : "bg-[var(--primary-accent1)]/15 text-[color:var(--primary-accent3)]"
                      }`}
                    >
                      {performer.performance}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
              <div className="p-5 border-b border-[color:var(--secondary-soft-highlight)]">
                <h3 className="text-base font-semibold text-[color:var(--secondary-black)]">
                  Quick Actions
                </h3>
              </div>
              <div className="p-4 space-y-2">
                <Link
                  href="/government/reporting?type=program-participation"
                  className="block px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm text-[color:var(--secondary-black)]"
                >
                  Generate Program Report
                </Link>
                <Link
                  href="/government/vendors"
                  className="block px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm text-[color:var(--secondary-black)]"
                >
                  View All Vendors
                </Link>
                <Link
                  href="/government/data"
                  className="block px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm text-[color:var(--secondary-black)]"
                >
                  Export Program Data
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
