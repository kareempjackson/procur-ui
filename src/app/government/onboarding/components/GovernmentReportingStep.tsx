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

interface GovernmentReportingStepProps {
  data: GovernmentOnboardingData;
  onNext: (data: Partial<GovernmentOnboardingData>) => void;
  onBack: () => void;
}

const reportingFeatures = [
  {
    id: "procurement_analytics",
    title: "Procurement Analytics",
    description:
      "Track spending patterns, vendor performance, and cost savings",
    icon: "📊",
    benefit: "Data-driven procurement decisions",
  },
  {
    id: "compliance_monitoring",
    title: "Compliance Monitoring",
    description: "Monitor adherence to regulations and procurement policies",
    icon: "✅",
    benefit: "Automated compliance tracking",
  },
  {
    id: "audit_trails",
    title: "Audit Trail Reports",
    description: "Complete documentation of all procurement activities",
    icon: "📋",
    benefit: "Audit-ready documentation",
  },
  {
    id: "vendor_performance",
    title: "Vendor Performance Reports",
    description:
      "Track delivery times, quality metrics, and contract compliance",
    icon: "⭐",
    benefit: "Optimize vendor relationships",
  },
  {
    id: "budget_tracking",
    title: "Budget & Spend Analysis",
    description: "Monitor budget utilization and spending forecasts",
    icon: "💰",
    benefit: "Better budget management",
  },
  {
    id: "transparency_reports",
    title: "Public Transparency Reports",
    description: "Generate reports for public disclosure and transparency",
    icon: "🏛️",
    benefit: "Meet transparency requirements",
  },
];

const reportingSchedules = [
  {
    id: "real_time",
    label: "Real-time Dashboard",
    description: "Live updates and monitoring",
  },
  {
    id: "daily",
    label: "Daily Reports",
    description: "Automated daily summaries",
  },
  {
    id: "weekly",
    label: "Weekly Reports",
    description: "Comprehensive weekly analysis",
  },
  {
    id: "monthly",
    label: "Monthly Reports",
    description: "Detailed monthly procurement reports",
  },
  {
    id: "quarterly",
    label: "Quarterly Reports",
    description: "Strategic quarterly reviews",
  },
  {
    id: "annual",
    label: "Annual Reports",
    description: "Comprehensive annual summaries",
  },
];

export default function GovernmentReportingStep({
  data,
  onNext,
  onBack,
}: GovernmentReportingStepProps) {
  const [formData, setFormData] = useState({
    reportingNeeds: data.reportingNeeds || [],
    reportingSchedules: ["real_time", "monthly"], // Default selections
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReportingToggle = (featureId: string) => {
    setFormData((prev) => ({
      ...prev,
      reportingNeeds: prev.reportingNeeds.includes(featureId)
        ? prev.reportingNeeds.filter((id) => id !== featureId)
        : [...prev.reportingNeeds, featureId],
    }));
  };

  const handleScheduleToggle = (scheduleId: string) => {
    setFormData((prev) => ({
      ...prev,
      reportingSchedules: prev.reportingSchedules.includes(scheduleId)
        ? prev.reportingSchedules.filter((id) => id !== scheduleId)
        : [...prev.reportingSchedules, scheduleId],
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
                Configure reporting & analytics
              </h1>
              <p className="text-lg text-[var(--secondary-muted-edge)] leading-relaxed">
                Set up reporting tools to track performance, ensure compliance,
                and maintain transparency in your procurement processes.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Reporting Features */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--secondary-black)] mb-2">
                    Reporting & Analytics Features
                  </label>
                  <p className="text-sm text-[var(--secondary-muted-edge)] mb-4">
                    Select the reporting capabilities you need for your agency
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {reportingFeatures.map((feature, index) => (
                    <button
                      key={feature.id}
                      type="button"
                      onClick={() => handleReportingToggle(feature.id)}
                      className={`
                        p-4 rounded-2xl border-2 transition-all duration-200 text-left
                        hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[var(--secondary-muted-edge)]/20
                        ${
                          formData.reportingNeeds.includes(feature.id)
                            ? "border-[var(--secondary-muted-edge)] bg-[var(--secondary-muted-edge)]/5"
                            : "border-[var(--secondary-soft-highlight)] hover:border-[var(--secondary-muted-edge)]"
                        }
                      `}
                      aria-pressed={formData.reportingNeeds.includes(
                        feature.id
                      )}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl mt-1">{feature.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-[var(--secondary-muted-edge)] leading-relaxed mb-3">
                            {feature.description}
                          </p>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-[var(--secondary-muted-edge)] rounded-full" />
                            <span className="text-sm font-medium text-[var(--secondary-muted-edge)]">
                              {feature.benefit}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div
                            className={`
                              w-6 h-6 rounded border-2 flex items-center justify-center
                              ${
                                formData.reportingNeeds.includes(feature.id)
                                  ? "bg-[var(--secondary-muted-edge)] border-[var(--secondary-muted-edge)] text-white"
                                  : "border-[var(--secondary-soft-highlight)]"
                              }
                            `}
                          >
                            {formData.reportingNeeds.includes(feature.id) && (
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
                    </button>
                  ))}
                </div>
              </div>

              {/* Reporting Schedule */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--secondary-black)] mb-2">
                    Reporting Schedule
                  </label>
                  <p className="text-sm text-[var(--secondary-muted-edge)] mb-4">
                    Choose how often you want to receive reports and updates
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {reportingSchedules.map((schedule) => (
                    <button
                      key={schedule.id}
                      type="button"
                      onClick={() => handleScheduleToggle(schedule.id)}
                      className={`
                        p-4 rounded-2xl border-2 transition-all duration-200 text-left
                        hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[var(--secondary-muted-edge)]/20
                        ${
                          formData.reportingSchedules.includes(schedule.id)
                            ? "border-[var(--secondary-muted-edge)] bg-[var(--secondary-muted-edge)]/5"
                            : "border-[var(--secondary-soft-highlight)] hover:border-[var(--secondary-muted-edge)]"
                        }
                      `}
                      aria-pressed={formData.reportingSchedules.includes(
                        schedule.id
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-[var(--secondary-black)] mb-1">
                            {schedule.label}
                          </h3>
                          <p className="text-sm text-[var(--secondary-muted-edge)]">
                            {schedule.description}
                          </p>
                        </div>
                        <div
                          className={`
                            w-6 h-6 rounded border-2 flex items-center justify-center
                            ${
                              formData.reportingSchedules.includes(schedule.id)
                                ? "bg-[var(--secondary-muted-edge)] border-[var(--secondary-muted-edge)] text-white"
                                : "border-[var(--secondary-soft-highlight)]"
                            }
                          `}
                        >
                          {formData.reportingSchedules.includes(
                            schedule.id
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
                    </button>
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
                    "Complete Setup"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Visual Column */}
          <div className="space-y-6">
            {/* Reporting Dashboard Preview */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[var(--secondary-black)]">
                Your Reporting Dashboard
              </h3>
              <div className="reporting-preview">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-[var(--secondary-black)]">
                    Procurement Analytics
                  </h4>
                  <button className="text-sm text-[var(--secondary-muted-edge)] hover:text-[var(--secondary-black)] transition-colors">
                    View Full Report →
                  </button>
                </div>

                <div className="government-stats-grid mb-6">
                  <div className="government-stat-card">
                    <div className="government-stat-number">$2.4M</div>
                    <div className="government-stat-label">Total Spend</div>
                  </div>
                  <div className="government-stat-card">
                    <div className="government-stat-number">89</div>
                    <div className="government-stat-label">
                      Active Contracts
                    </div>
                  </div>
                  <div className="government-stat-card">
                    <div className="government-stat-number">15%</div>
                    <div className="government-stat-label">Cost Savings</div>
                  </div>
                  <div className="government-stat-card">
                    <div className="government-stat-number">98%</div>
                    <div className="government-stat-label">Compliance Rate</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="reporting-metric">
                    <div className="reporting-metric-icon">📊</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-semibold text-[var(--secondary-black)] text-sm">
                          Monthly Procurement Volume
                        </h5>
                        <span className="text-sm font-medium text-green-600">
                          +12%
                        </span>
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)]">
                        Compared to last month
                      </div>
                    </div>
                  </div>

                  <div className="reporting-metric">
                    <div className="reporting-metric-icon">⭐</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-semibold text-[var(--secondary-black)] text-sm">
                          Average Vendor Rating
                        </h5>
                        <span className="text-sm font-medium text-[var(--secondary-muted-edge)]">
                          4.7/5
                        </span>
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)]">
                        Based on 156 vendor evaluations
                      </div>
                    </div>
                  </div>

                  <div className="reporting-metric">
                    <div className="reporting-metric-icon">✅</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-semibold text-[var(--secondary-black)] text-sm">
                          Compliance Score
                        </h5>
                        <span className="text-sm font-medium text-green-600">
                          98%
                        </span>
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)]">
                        All regulatory requirements met
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transparency Features */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[var(--secondary-black)]">
                Public Transparency Tools
              </h3>
              <div className="government-card p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[var(--secondary-muted-edge)]/10 rounded-full flex items-center justify-center">
                      <span className="text-sm">🏛️</span>
                    </div>
                    <div>
                      <div className="font-medium text-[var(--secondary-black)] text-sm">
                        Public Procurement Portal
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)]">
                        Automatically publish contract awards and spending data
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[var(--secondary-muted-edge)]/10 rounded-full flex items-center justify-center">
                      <span className="text-sm">📋</span>
                    </div>
                    <div>
                      <div className="font-medium text-[var(--secondary-black)] text-sm">
                        FOIA Request Management
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)]">
                        Streamlined response to freedom of information requests
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[var(--secondary-muted-edge)]/10 rounded-full flex items-center justify-center">
                      <span className="text-sm">📊</span>
                    </div>
                    <div>
                      <div className="font-medium text-[var(--secondary-black)] text-sm">
                        Annual Transparency Report
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)]">
                        Comprehensive yearly procurement summary
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-[var(--secondary-muted-edge)]/10 rounded-2xl p-6">
              <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                Reporting Benefits
              </h3>
              <ul className="text-sm text-[var(--secondary-muted-edge)] space-y-2">
                <li>• Real-time visibility into procurement activities</li>
                <li>• Automated compliance monitoring and alerts</li>
                <li>• Data-driven insights for better decision making</li>
                <li>• Streamlined audit preparation and documentation</li>
                <li>• Enhanced public transparency and accountability</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
