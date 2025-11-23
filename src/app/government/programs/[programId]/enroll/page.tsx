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

    // Check compliance status
    if (vendor.compliance_status === "alert") {
      reasons.push("Has outstanding compliance issues");
      status = "ineligible";
    }

    // Check minimum acreage (example: minimum 10 acres)
    if (
      program.eligibility?.some((e) => e.toLowerCase().includes("10 acres"))
    ) {
      if (vendor.total_acreage < 10) {
        reasons.push("Does not meet minimum acreage requirement (10 acres)");
        status = "ineligible";
      }
    }

    // Check if already enrolled (mock check)
    // In real implementation, check against enrollment records
    // Skipping already enrolled check (not available on vendor model)

    // Check certification requirements for organic programs
    // Skipping certification requirement check (not available on vendor model)

    if (status === "eligible") {
      reasons.push("Meets all eligibility requirements");
    }

    return { status, reasons };
  };

  // Filter and search vendors
  const filteredVendors = useMemo(() => {
    let filtered = [...vendors];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(query) ||
          v.location.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((v) => v.compliance_status === filterStatus);
    }

    // Add eligibility status
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

    // Eligibility filter
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
      // In a real implementation, call the enrollment API
      // await governmentApi.enrollVendors(programId, {
      //   vendor_ids: selectedVendors.map(v => v.id),
      //   notes: enrollmentNotes
      // });

      // Mock delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate to success page or program details
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

  if (programStatus === "loading" || !program) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-accent2)]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/government/programs"
          className="inline-flex items-center text-sm text-[color:var(--primary-accent2)] hover:text-[var(--primary-accent3)] mb-4 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Programs
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[color:var(--secondary-black)]">
              Enroll Vendors
            </h1>
            <p className="mt-1 text-sm text-[color:var(--secondary-muted-edge)]">
              {program.name}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                step === "select"
                  ? "bg-[var(--primary-accent2)] text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <span className="text-sm font-medium">1. Select Vendors</span>
            </div>
            <div className="h-px w-8 bg-gray-300" />
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                step === "review"
                  ? "bg-[var(--primary-accent2)] text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <span className="text-sm font-medium">2. Review</span>
            </div>
            <div className="h-px w-8 bg-gray-300" />
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                step === "confirm"
                  ? "bg-[var(--primary-accent2)] text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <span className="text-sm font-medium">3. Confirm</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step: Select Vendors */}
          {step === "select" && (
            <>
              {/* Search and Filters */}
              <div className="bg-white rounded-xl border border-[color:var(--secondary-soft-highlight)] p-6">
                <div className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                    <input
                      type="text"
                      placeholder="Search vendors by name or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                    />
                  </div>

                  {/* Filters */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <FunnelIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                      <span className="text-sm font-medium text-[color:var(--secondary-black)]">
                        Filters:
                      </span>
                    </div>

                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="compliant">Compliant</option>
                      <option value="warning">Warning</option>
                      <option value="alert">Alert</option>
                    </select>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showEligibleOnly}
                        onChange={(e) => setShowEligibleOnly(e.target.checked)}
                        className="rounded border-gray-300 text-[var(--primary-accent2)] focus:ring-[var(--primary-accent2)]"
                      />
                      <span className="text-sm text-[color:var(--secondary-black)]">
                        Show eligible only
                      </span>
                    </label>
                  </div>

                  <div className="text-sm text-[color:var(--secondary-muted-edge)]">
                    Found {filteredVendors.length} vendor
                    {filteredVendors.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              {/* Vendor List */}
              <div className="space-y-3">
                {vendorsStatus === "loading" ? (
                  <div className="bg-white rounded-xl border border-[color:var(--secondary-soft-highlight)] p-12 text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--primary-accent2)] mx-auto mb-4"></div>
                    <p className="text-sm text-[color:var(--secondary-muted-edge)]">
                      Loading vendors...
                    </p>
                  </div>
                ) : filteredVendors.length === 0 ? (
                  <div className="bg-white rounded-xl border border-[color:var(--secondary-soft-highlight)] p-12 text-center">
                    <UserGroupIcon className="h-12 w-12 mx-auto text-[color:var(--secondary-muted-edge)] mb-4" />
                    <p className="text-sm text-[color:var(--secondary-muted-edge)]">
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

                    return (
                      <div
                        key={vendor.id}
                        onClick={() => toggleVendorSelection(vendor)}
                        className={`bg-white rounded-xl border-2 p-5 transition-all cursor-pointer ${
                          isIneligible
                            ? "border-gray-200 opacity-50 cursor-not-allowed"
                            : isSelected
                              ? "border-[var(--primary-accent2)] shadow-md"
                              : "border-[color:var(--secondary-soft-highlight)] hover:border-[var(--primary-accent2)]/50 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Checkbox */}
                          <div className="pt-1">
                            {isSelected ? (
                              <CheckCircleSolidIcon className="h-6 w-6 text-[var(--primary-accent2)]" />
                            ) : (
                              <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
                            )}
                          </div>

                          {/* Vendor Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-semibold text-[color:var(--secondary-black)]">
                                  {vendor.name}
                                </h3>
                                <p className="text-sm text-[color:var(--secondary-muted-edge)]">
                                  {vendor.location}
                                </p>
                              </div>

                              {/* Status Badge */}
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  vendor.status === "compliant"
                                    ? "bg-green-100 text-green-800"
                                    : vendor.status === "warning"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {vendor.status}
                              </span>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-4 mb-3">
                              <div className="text-sm text-[color:var(--secondary-muted-edge)]">
                                <span className="font-medium text-[color:var(--secondary-black)]">
                                  {vendor.total_acreage.toLocaleString()}
                                </span>{" "}
                                acres
                              </div>
                            </div>

                            {/* Eligibility Status */}
                            <div
                              className={`flex items-start gap-2 p-3 rounded-lg ${
                                vendor.eligibilityStatus === "eligible"
                                  ? "bg-green-50"
                                  : vendor.eligibilityStatus === "review"
                                    ? "bg-yellow-50"
                                    : "bg-red-50"
                              }`}
                            >
                              {vendor.eligibilityStatus === "eligible" ? (
                                <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                              ) : vendor.eligibilityStatus === "review" ? (
                                <InformationCircleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                              ) : (
                                <XCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                              )}
                              <div className="flex-1">
                                <p
                                  className={`text-xs font-semibold mb-1 ${
                                    vendor.eligibilityStatus === "eligible"
                                      ? "text-green-800"
                                      : vendor.eligibilityStatus === "review"
                                        ? "text-yellow-800"
                                        : "text-red-800"
                                  }`}
                                >
                                  {vendor.eligibilityStatus === "eligible"
                                    ? "Eligible"
                                    : vendor.eligibilityStatus === "review"
                                      ? "Requires Review"
                                      : "Not Eligible"}
                                </p>
                                <ul className="text-xs text-gray-600 space-y-1">
                                  {vendor.eligibilityReasons.map(
                                    (reason, idx) => (
                                      <li key={idx}>• {reason}</li>
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

          {/* Step: Review */}
          {step === "review" && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-[color:var(--secondary-soft-highlight)] p-6">
                <h3 className="text-lg font-semibold text-[color:var(--secondary-black)] mb-4">
                  Selected Vendors ({selectedVendors.length})
                </h3>

                <div className="space-y-3">
                  {selectedVendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-[color:var(--secondary-black)]">
                          {vendor.name}
                        </p>
                        <p className="text-sm text-[color:var(--secondary-muted-edge)]">
                          {vendor.location} •{" "}
                          {vendor.total_acreage.toLocaleString()} acres
                        </p>
                      </div>
                      <button
                        onClick={() => toggleVendorSelection(vendor)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {selectedStats.review > 0 && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-800 mb-1">
                        {selectedStats.review} vendor
                        {selectedStats.review > 1 ? "s" : ""} require manual
                        review
                      </p>
                      <p className="text-xs text-yellow-700">
                        These vendors will be flagged for additional
                        verification before final enrollment.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Enrollment Notes */}
              <div className="bg-white rounded-xl border border-[color:var(--secondary-soft-highlight)] p-6">
                <h3 className="text-lg font-semibold text-[color:var(--secondary-black)] mb-4">
                  Enrollment Notes (Optional)
                </h3>
                <textarea
                  value={enrollmentNotes}
                  onChange={(e) => setEnrollmentNotes(e.target.value)}
                  rows={4}
                  placeholder="Add any notes or special instructions for this enrollment..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent resize-none"
                />
              </div>
            </div>
          )}

          {/* Step: Confirm */}
          {step === "confirm" && (
            <div className="bg-white rounded-xl border border-[color:var(--secondary-soft-highlight)] p-8">
              <div className="text-center mb-6">
                <DocumentCheckIcon className="h-16 w-16 mx-auto text-[var(--primary-accent2)] mb-4" />
                <h3 className="text-xl font-bold text-[color:var(--secondary-black)] mb-2">
                  Confirm Enrollment
                </h3>
                <p className="text-sm text-[color:var(--secondary-muted-edge)]">
                  Please review the enrollment summary before submitting
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                        Program
                      </p>
                      <p className="font-semibold text-[color:var(--secondary-black)]">
                        {program.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                        Vendors to Enroll
                      </p>
                      <p className="font-semibold text-[color:var(--secondary-black)]">
                        {selectedVendors.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                        Total Acreage
                      </p>
                      <p className="font-semibold text-[color:var(--secondary-black)]">
                        {selectedStats.totalAcreage.toLocaleString()} acres
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                        Require Review
                      </p>
                      <p className="font-semibold text-[color:var(--secondary-black)]">
                        {selectedStats.review}
                      </p>
                    </div>
                  </div>
                </div>

                {enrollmentNotes && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-[color:var(--secondary-muted-edge)] mb-2">
                      Notes
                    </p>
                    <p className="text-sm text-[color:var(--secondary-black)]">
                      {enrollmentNotes}
                    </p>
                  </div>
                )}

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> By submitting this enrollment, you
                    confirm that all selected vendors meet the program
                    requirements. Vendors requiring review will be processed
                    separately.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                if (step === "review") setStep("select");
                else if (step === "confirm") setStep("review");
                else router.back();
              }}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-[color:var(--secondary-black)] hover:bg-gray-50 transition-colors"
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
              className="px-6 py-2.5 bg-[var(--primary-accent2)] text-white rounded-lg text-sm font-medium hover:bg-[var(--primary-accent3)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Program Info */}
          <div className="bg-white rounded-xl border border-[color:var(--secondary-soft-highlight)] p-6 sticky top-6">
            <h3 className="text-sm font-semibold text-[color:var(--secondary-black)] mb-4">
              Program Information
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                  Category
                </p>
                <p className="text-sm font-medium text-[color:var(--secondary-black)]">
                  {program.category}
                </p>
              </div>

              <div>
                <p className="text-xs text-[color:var(--secondary-muted-edge)] mb-1">
                  Description
                </p>
                <p className="text-sm text-[color:var(--secondary-black)]">
                  {program.description}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarIcon className="h-4 w-4 text-[color:var(--secondary-muted-edge)]" />
                  <p className="text-xs text-[color:var(--secondary-muted-edge)]">
                    Duration
                  </p>
                </div>
                <p className="text-sm font-medium text-[color:var(--secondary-black)]">
                  {new Date(program.start_date).toLocaleDateString()} -{" "}
                  {new Date(program.end_date).toLocaleDateString()}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BanknotesIcon className="h-4 w-4 text-[color:var(--secondary-muted-edge)]" />
                  <p className="text-xs text-[color:var(--secondary-muted-edge)]">
                    Budget Available
                  </p>
                </div>
                <p className="text-sm font-medium text-[color:var(--secondary-black)]">
                  ${((program.budget - program.budget_used) / 1000).toFixed(0)}K
                </p>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--primary-accent2)] to-[var(--primary-accent3)]"
                    style={{ width: `${program.budget_percentage}%` }}
                  />
                </div>
                <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
                  {program.budget_percentage}% utilized
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ChartBarIcon className="h-4 w-4 text-[color:var(--secondary-muted-edge)]" />
                  <p className="text-xs text-[color:var(--secondary-muted-edge)]">
                    Current Enrollment
                  </p>
                </div>
                <p className="text-sm font-medium text-[color:var(--secondary-black)]">
                  {program.participants} / {program.target_participants} vendors
                </p>
              </div>

              {program.benefits && program.benefits.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs font-semibold text-[color:var(--secondary-black)] mb-2">
                    Benefits
                  </p>
                  <ul className="space-y-2">
                    {program.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircleIcon className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-[color:var(--secondary-black)]">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {program.eligibility && program.eligibility.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs font-semibold text-[color:var(--secondary-black)] mb-2">
                    Eligibility Requirements
                  </p>
                  <ul className="space-y-2">
                    {program.eligibility.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <DocumentCheckIcon className="h-4 w-4 text-[color:var(--secondary-muted-edge)] flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-[color:var(--secondary-black)]">
                          {req}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Selection Summary (shown on select step) */}
          {step === "select" && selectedVendors.length > 0 && (
            <div className="bg-gradient-to-br from-[var(--primary-accent1)] to-[var(--primary-accent2)] rounded-xl p-6 text-white">
              <h3 className="text-sm font-semibold mb-4">Selection Summary</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs opacity-90 mb-1">Vendors Selected</p>
                  <p className="text-2xl font-bold">{selectedVendors.length}</p>
                </div>
                <div>
                  <p className="text-xs opacity-90 mb-1">Eligible</p>
                  <p className="text-lg font-semibold">
                    {selectedStats.eligible}
                  </p>
                </div>
                {selectedStats.review > 0 && (
                  <div>
                    <p className="text-xs opacity-90 mb-1">Require Review</p>
                    <p className="text-lg font-semibold">
                      {selectedStats.review}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs opacity-90 mb-1">Total Acreage</p>
                  <p className="text-lg font-semibold">
                    {selectedStats.totalAcreage.toLocaleString()} acres
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
