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

interface GovernmentProcurementStepProps {
  data: GovernmentOnboardingData;
  onNext: (data: Partial<GovernmentOnboardingData>) => void;
  onBack: () => void;
}

const procurementTypes = [
  {
    id: "goods",
    title: "Goods & Supplies",
    description: "Office supplies, equipment, vehicles, and materials",
    icon: "📦",
    examples: [
      "Office Equipment",
      "Vehicles",
      "IT Hardware",
      "Medical Supplies",
    ],
  },
  {
    id: "services",
    title: "Professional Services",
    description: "Consulting, maintenance, and professional expertise",
    icon: "💼",
    examples: ["IT Services", "Consulting", "Legal Services", "Maintenance"],
  },
  {
    id: "construction",
    title: "Construction & Infrastructure",
    description: "Building projects, roads, and infrastructure development",
    icon: "🏗️",
    examples: [
      "Building Construction",
      "Road Work",
      "Utilities",
      "Renovations",
    ],
  },
  {
    id: "food_services",
    title: "Food & Catering Services",
    description: "Cafeteria services, catering, and food supplies",
    icon: "🍽️",
    examples: [
      "School Meals",
      "Cafeteria Services",
      "Event Catering",
      "Food Supplies",
    ],
  },
  {
    id: "technology",
    title: "Technology Solutions",
    description: "Software, systems, and digital infrastructure",
    icon: "💻",
    examples: [
      "Software Licenses",
      "Cloud Services",
      "Cybersecurity",
      "Digital Systems",
    ],
  },
  {
    id: "transportation",
    title: "Transportation Services",
    description: "Fleet management, public transit, and logistics",
    icon: "🚌",
    examples: [
      "Public Transit",
      "Fleet Services",
      "Logistics",
      "Transportation Planning",
    ],
  },
];

const procurementProcesses = [
  {
    id: "competitive_bidding",
    title: "Competitive Bidding",
    description: "Open competitive process with multiple vendors",
    required: true,
  },
  {
    id: "rfp_process",
    title: "Request for Proposals (RFP)",
    description: "Detailed proposal evaluation process",
    required: true,
  },
  {
    id: "emergency_procurement",
    title: "Emergency Procurement",
    description: "Expedited process for urgent needs",
    required: false,
  },
  {
    id: "cooperative_purchasing",
    title: "Cooperative Purchasing",
    description: "Joint procurement with other agencies",
    required: false,
  },
];

export default function GovernmentProcurementStep({
  data,
  onNext,
  onBack,
}: GovernmentProcurementStepProps) {
  const [formData, setFormData] = useState({
    procurementTypes: data.procurementTypes || [],
    procurementProcesses: ["competitive_bidding", "rfp_process"], // Default required processes
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProcurementToggle = (typeId: string) => {
    setFormData((prev) => ({
      ...prev,
      procurementTypes: prev.procurementTypes.includes(typeId)
        ? prev.procurementTypes.filter((id) => id !== typeId)
        : [...prev.procurementTypes, typeId],
    }));

    // Clear error when user selects types
    if (errors.procurementTypes) {
      setErrors((prev) => ({ ...prev, procurementTypes: "" }));
    }
  };

  const handleProcessToggle = (processId: string) => {
    const process = procurementProcesses.find((p) => p.id === processId);
    if (process?.required) return; // Can't toggle required processes

    setFormData((prev) => ({
      ...prev,
      procurementProcesses: prev.procurementProcesses.includes(processId)
        ? prev.procurementProcesses.filter((id) => id !== processId)
        : [...prev.procurementProcesses, processId],
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.procurementTypes.length === 0) {
      newErrors.procurementTypes =
        "Please select at least one procurement type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

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
                Configure procurement processes
              </h1>
              <p className="text-lg text-[var(--secondary-muted-edge)] leading-relaxed">
                Set up the procurement categories and processes that match your
                agency's needs and compliance requirements.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Procurement Types */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--secondary-black)] mb-2">
                    Procurement Categories *
                  </label>
                  <p className="text-sm text-[var(--secondary-muted-edge)] mb-4">
                    Select all categories your agency typically procures
                  </p>
                  {errors.procurementTypes && (
                    <p className="text-sm text-red-600 mb-3" role="alert">
                      {errors.procurementTypes}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {procurementTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleProcurementToggle(type.id)}
                      className={`
                        procurement-requirement text-left
                        ${
                          formData.procurementTypes.includes(type.id)
                            ? "selected"
                            : ""
                        }
                      `}
                      aria-pressed={formData.procurementTypes.includes(type.id)}
                    >
                      <div className="procurement-icon">{type.icon}</div>
                      <div>
                        <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                          {type.title}
                        </h3>
                        <p className="text-sm text-[var(--secondary-muted-edge)] leading-relaxed mb-3">
                          {type.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {type.examples.slice(0, 3).map((example) => (
                            <span
                              key={example}
                              className="text-xs bg-[var(--secondary-soft-highlight)]/20 text-[var(--secondary-muted-edge)] px-2 py-1 rounded-full"
                            >
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Procurement Processes */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--secondary-black)] mb-2">
                    Procurement Processes
                  </label>
                  <p className="text-sm text-[var(--secondary-muted-edge)] mb-4">
                    Configure the procurement processes your agency uses
                  </p>
                </div>
                <div className="space-y-3">
                  {procurementProcesses.map((process) => (
                    <div
                      key={process.id}
                      className={`
                        p-4 rounded-2xl border-2 transition-all duration-200
                        ${
                          formData.procurementProcesses.includes(process.id)
                            ? "border-[var(--secondary-muted-edge)] bg-[var(--secondary-muted-edge)]/5"
                            : "border-[var(--secondary-soft-highlight)]"
                        }
                        ${
                          process.required
                            ? "opacity-100"
                            : "cursor-pointer hover:border-[var(--secondary-muted-edge)]"
                        }
                      `}
                      onClick={() =>
                        !process.required && handleProcessToggle(process.id)
                      }
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-[var(--secondary-black)]">
                              {process.title}
                            </h3>
                            {process.required && (
                              <span className="text-xs bg-[var(--secondary-muted-edge)] text-white px-2 py-1 rounded-full">
                                Required
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[var(--secondary-muted-edge)] leading-relaxed">
                            {process.description}
                          </p>
                        </div>
                        <div className="ml-4">
                          <div
                            className={`
                              w-6 h-6 rounded border-2 flex items-center justify-center
                              ${
                                formData.procurementProcesses.includes(
                                  process.id
                                )
                                  ? "bg-[var(--secondary-muted-edge)] border-[var(--secondary-muted-edge)] text-white"
                                  : "border-[var(--secondary-soft-highlight)]"
                              }
                            `}
                          >
                            {formData.procurementProcesses.includes(
                              process.id
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
            {/* Selected Categories Preview */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[var(--secondary-black)]">
                Your Procurement Categories
              </h3>
              {formData.procurementTypes.length > 0 ? (
                <div className="space-y-3">
                  {formData.procurementTypes.map((typeId) => {
                    const type = procurementTypes.find((t) => t.id === typeId);
                    return type ? (
                      <div key={typeId} className="government-card p-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{type.icon}</span>
                          <div>
                            <h4 className="font-semibold text-[var(--secondary-black)]">
                              {type.title}
                            </h4>
                            <p className="text-sm text-[var(--secondary-muted-edge)]">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              ) : (
                <div className="government-card p-6 text-center">
                  <div className="w-16 h-16 bg-[var(--secondary-soft-highlight)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📋</span>
                  </div>
                  <p className="text-sm text-[var(--secondary-muted-edge)]">
                    Select procurement categories to see them here
                  </p>
                </div>
              )}
            </div>

            {/* Process Overview */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[var(--secondary-black)]">
                Procurement Process Flow
              </h3>
              <div className="government-card p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[var(--secondary-muted-edge)] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <div className="font-medium text-[var(--secondary-black)]">
                        Requirements Definition
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)]">
                        Define procurement needs and specifications
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[var(--secondary-muted-edge)] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <div className="font-medium text-[var(--secondary-black)]">
                        Vendor Solicitation
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)]">
                        Issue RFPs and collect vendor proposals
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[var(--secondary-muted-edge)] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <div className="font-medium text-[var(--secondary-black)]">
                        Evaluation & Award
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)]">
                        Evaluate proposals and award contracts
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-[var(--secondary-muted-edge)]/10 rounded-2xl p-6">
              <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                Procurement Best Practices
              </h3>
              <ul className="text-sm text-[var(--secondary-muted-edge)] space-y-2">
                <li>
                  • Maintain detailed documentation for all procurement
                  activities
                </li>
                <li>• Ensure competitive bidding processes for transparency</li>
                <li>• Regular vendor performance evaluations</li>
                <li>
                  • Compliance with all applicable regulations and policies
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
