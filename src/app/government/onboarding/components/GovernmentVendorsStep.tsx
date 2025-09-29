"use client";

import { useState } from "react";

interface GovernmentOnboardingData {
  agencyName: string;
  agencyType: string;
  jurisdiction: string;
  contactInfo: {
    primaryContact: string;
    email: string;
    phone: string;
  };
  complianceRequirements: string[];
  procurementTypes: string[];
  budgetRange: string;
  reportingNeeds: string[];
  vendorRequirements: string[];
  completedActions: string[];
}

interface GovernmentVendorsStepProps {
  data: GovernmentOnboardingData;
  onNext: (data: Partial<GovernmentOnboardingData>) => void;
  onBack: () => void;
}

const vendorRequirements = [
  {
    id: "business_license",
    title: "Business License Verification",
    description: "Verify active business licenses and registrations",
    icon: "📋",
    required: true,
  },
  {
    id: "insurance",
    title: "Insurance Requirements",
    description: "General liability and professional insurance coverage",
    icon: "🛡️",
    required: true,
  },
  {
    id: "financial_stability",
    title: "Financial Stability Check",
    description: "Credit checks and financial health assessment",
    icon: "💰",
    required: false,
  },
  {
    id: "security_clearance",
    title: "Security Clearance",
    description: "Background checks for sensitive projects",
    icon: "🔒",
    required: false,
  },
  {
    id: "minority_certification",
    title: "Minority Business Certification",
    description: "MBE, WBE, DBE, and other diversity certifications",
    icon: "🤝",
    required: false,
  },
  {
    id: "environmental_compliance",
    title: "Environmental Compliance",
    description: "Environmental certifications and green practices",
    icon: "🌱",
    required: false,
  },
];

const approvalSteps = [
  {
    step: 1,
    title: "Initial Application",
    description: "Vendor submits basic information and documentation",
    duration: "1-2 days",
  },
  {
    step: 2,
    title: "Document Review",
    description: "Verify licenses, insurance, and certifications",
    duration: "3-5 days",
  },
  {
    step: 3,
    title: "Background Check",
    description: "Financial and security background verification",
    duration: "5-10 days",
  },
  {
    step: 4,
    title: "Final Approval",
    description: "Agency review and vendor database entry",
    duration: "2-3 days",
  },
];

export default function GovernmentVendorsStep({
  data,
  onNext,
  onBack,
}: GovernmentVendorsStepProps) {
  const [formData, setFormData] = useState({
    vendorRequirements: data.vendorRequirements || [
      "business_license",
      "insurance",
    ], // Default required
    approvalProcess: "standard", // standard, expedited, or custom
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequirementToggle = (reqId: string) => {
    const requirement = vendorRequirements.find((r) => r.id === reqId);
    if (requirement?.required) return; // Can't toggle required items

    setFormData((prev) => ({
      ...prev,
      vendorRequirements: prev.vendorRequirements.includes(reqId)
        ? prev.vendorRequirements.filter((id) => id !== reqId)
        : [...prev.vendorRequirements, reqId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    onNext(formData);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Form Column */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--secondary-black)]">
                Configure vendor management
              </h1>
              <p className="text-lg text-[var(--secondary-muted-edge)] leading-relaxed">
                Set up vendor qualification requirements and approval processes
                to ensure compliance and quality standards.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Vendor Requirements */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--secondary-black)] mb-2">
                    Vendor Qualification Requirements
                  </label>
                  <p className="text-sm text-[var(--secondary-muted-edge)] mb-4">
                    Select the requirements vendors must meet to work with your
                    agency
                  </p>
                </div>
                <div className="space-y-3">
                  {vendorRequirements.map((requirement) => (
                    <div
                      key={requirement.id}
                      className={`
                        p-4 rounded-2xl border-2 transition-all duration-200
                        ${
                          formData.vendorRequirements.includes(requirement.id)
                            ? "border-[var(--secondary-muted-edge)] bg-[var(--secondary-muted-edge)]/5"
                            : "border-[var(--secondary-soft-highlight)]"
                        }
                        ${
                          requirement.required
                            ? "opacity-100"
                            : "cursor-pointer hover:border-[var(--secondary-muted-edge)]"
                        }
                      `}
                      onClick={() =>
                        !requirement.required &&
                        handleRequirementToggle(requirement.id)
                      }
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="text-2xl mt-1">
                            {requirement.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-[var(--secondary-black)]">
                                {requirement.title}
                              </h3>
                              {requirement.required && (
                                <span className="text-xs bg-[var(--secondary-muted-edge)] text-white px-2 py-1 rounded-full">
                                  Required
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-[var(--secondary-muted-edge)] leading-relaxed">
                              {requirement.description}
                            </p>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div
                            className={`
                              w-6 h-6 rounded border-2 flex items-center justify-center
                              ${
                                formData.vendorRequirements.includes(
                                  requirement.id
                                )
                                  ? "bg-[var(--secondary-muted-edge)] border-[var(--secondary-muted-edge)] text-white"
                                  : "border-[var(--secondary-soft-highlight)]"
                              }
                            `}
                          >
                            {formData.vendorRequirements.includes(
                              requirement.id
                            ) && (
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approval Process Timeline */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--secondary-black)] mb-2">
                    Approval Process Configuration
                  </label>
                  <p className="text-sm text-[var(--secondary-muted-edge)] mb-4">
                    Configure how vendors are reviewed and approved
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        approvalProcess: "standard",
                      }))
                    }
                    className={`
                      w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left
                      ${
                        formData.approvalProcess === "standard"
                          ? "border-[var(--secondary-muted-edge)] bg-[var(--secondary-muted-edge)]/5"
                          : "border-[var(--secondary-soft-highlight)] hover:border-[var(--secondary-muted-edge)]"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-[var(--secondary-black)] mb-1">
                          Standard Process (Recommended)
                        </h3>
                        <p className="text-sm text-[var(--secondary-muted-edge)]">
                          Complete 4-step verification process (10-20 business
                          days)
                        </p>
                      </div>
                      <div className="w-4 h-4 rounded-full border-2 border-[var(--secondary-muted-edge)] flex items-center justify-center">
                        {formData.approvalProcess === "standard" && (
                          <div className="w-2 h-2 bg-[var(--secondary-muted-edge)] rounded-full" />
                        )}
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        approvalProcess: "expedited",
                      }))
                    }
                    className={`
                      w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left
                      ${
                        formData.approvalProcess === "expedited"
                          ? "border-[var(--secondary-muted-edge)] bg-[var(--secondary-muted-edge)]/5"
                          : "border-[var(--secondary-soft-highlight)] hover:border-[var(--secondary-muted-edge)]"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-[var(--secondary-black)] mb-1">
                          Expedited Process
                        </h3>
                        <p className="text-sm text-[var(--secondary-muted-edge)]">
                          Streamlined process for urgent needs (5-10 business
                          days)
                        </p>
                      </div>
                      <div className="w-4 h-4 rounded-full border-2 border-[var(--secondary-muted-edge)] flex items-center justify-center">
                        {formData.approvalProcess === "expedited" && (
                          <div className="w-2 h-2 bg-[var(--secondary-muted-edge)] rounded-full" />
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <button
                  type="button"
                  onClick={onBack}
                  className="btn btn-ghost text-base px-6 py-3 order-2 sm:order-1"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    btn text-base px-8 py-3 min-w-[140px] order-1 sm:order-2
                    bg-[var(--secondary-muted-edge)] text-white
                    hover:bg-[var(--secondary-black)]
                    transition-all duration-300 ease-out
                    hover:shadow-lg hover:shadow-[var(--secondary-muted-edge)]/20
                    disabled:opacity-70 disabled:cursor-not-allowed
                    ${isSubmitting ? "scale-95" : "hover:scale-105"}
                  `}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Visual Column */}
          <div className="space-y-6">
            {/* Vendor Approval Process */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[var(--secondary-black)]">
                Vendor Approval Process
              </h3>
              <div className="vendor-approval-process">
                <div className="space-y-3">
                  {approvalSteps.map((step) => (
                    <div key={step.step} className="vendor-step">
                      <div className="vendor-step-number">{step.step}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-[var(--secondary-black)]">
                            {step.title}
                          </h4>
                          <span className="text-xs text-[var(--secondary-muted-edge)]">
                            {step.duration}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--secondary-muted-edge)]">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Vendor Dashboard Preview */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[var(--secondary-black)]">
                Vendor Management Dashboard
              </h3>
              <div className="government-card p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-[var(--secondary-black)]">
                      Vendor Status Overview
                    </h4>
                    <button className="text-sm text-[var(--secondary-muted-edge)] hover:text-[var(--secondary-black)] transition-colors">
                      View All →
                    </button>
                  </div>

                  <div className="government-stats-grid">
                    <div className="government-stat-card">
                      <div className="government-stat-number">156</div>
                      <div className="government-stat-label">
                        Active Vendors
                      </div>
                    </div>
                    <div className="government-stat-card">
                      <div className="government-stat-number">23</div>
                      <div className="government-stat-label">
                        Pending Review
                      </div>
                    </div>
                    <div className="government-stat-card">
                      <div className="government-stat-number">12</div>
                      <div className="government-stat-label">
                        New Applications
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">
                          ABC Construction Co.
                        </span>
                      </div>
                      <span className="text-xs text-green-600">Approved</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm font-medium">
                          XYZ Services LLC
                        </span>
                      </div>
                      <span className="text-xs text-yellow-600">
                        Under Review
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium">
                          Tech Solutions Inc.
                        </span>
                      </div>
                      <span className="text-xs text-blue-600">
                        New Application
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance Checklist */}
            <div className="bg-[var(--secondary-muted-edge)]/10 rounded-2xl p-6">
              <h3 className="font-semibold text-[var(--secondary-black)] mb-3">
                Vendor Compliance Checklist
              </h3>
              <div className="compliance-checklist">
                <div className="compliance-item">
                  <div className="compliance-checkbox checked">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-sm">Business license verification</span>
                </div>
                <div className="compliance-item">
                  <div className="compliance-checkbox checked">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-sm">Insurance documentation</span>
                </div>
                <div className="compliance-item">
                  <div className="compliance-checkbox"></div>
                  <span className="text-sm">
                    Financial stability assessment
                  </span>
                </div>
                <div className="compliance-item">
                  <div className="compliance-checkbox"></div>
                  <span className="text-sm">
                    Security clearance (if required)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
