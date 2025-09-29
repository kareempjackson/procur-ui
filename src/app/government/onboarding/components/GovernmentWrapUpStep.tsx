"use client";

import { useState, useEffect } from "react";

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

interface GovernmentWrapUpStepProps {
  data: GovernmentOnboardingData;
  onNext: () => void;
}

const nextSteps = [
  {
    id: "dashboard_setup",
    title: "Set up your dashboard",
    description: "Configure your government procurement dashboard",
    icon: "📊",
    action: "Go to Dashboard",
  },
  {
    id: "vendor_invites",
    title: "Invite existing vendors",
    description: "Add your current vendor network to the platform",
    icon: "🤝",
    action: "Manage Vendors",
  },
  {
    id: "team_setup",
    title: "Add team members",
    description: "Invite colleagues to collaborate on procurement",
    icon: "👥",
    action: "Invite Team",
  },
  {
    id: "first_procurement",
    title: "Create your first procurement",
    description: "Start a new procurement process or RFP",
    icon: "📋",
    action: "New Procurement",
  },
];

const agencyTypeLabels: Record<string, string> = {
  federal: "Federal Agency",
  state: "State Government",
  local: "Local Government",
  education: "Educational Institution",
  healthcare: "Public Healthcare",
  utility: "Public Utility",
};

export default function GovernmentWrapUpStep({
  data,
  onNext,
}: GovernmentWrapUpStepProps) {
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti animation on mount
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleActionComplete = (actionId: string) => {
    if (!completedActions.includes(actionId)) {
      setCompletedActions((prev) => [...prev, actionId]);
    }
  };

  const handleFinish = () => {
    // Track completion
    console.log("Government onboarding completed:", {
      ...data,
      completedActions,
    });
    onNext();
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Content Column */}
          <div className="space-y-8">
            {/* Success Header */}
            <div
              className={`
                space-y-6 text-center lg:text-left
                ${showConfetti ? "government-success-animation" : ""}
              `}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mx-auto lg:mx-0">
                <span className="text-4xl">🎉</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--secondary-black)]">
                  Welcome to Procur!
                </h1>
                <p className="text-lg text-[var(--secondary-muted-edge)] leading-relaxed">
                  Your government procurement platform is ready. Start
                  streamlining your procurement processes with transparency and
                  efficiency.
                </p>
              </div>

              {/* Success Stats */}
              <div className="government-stats-grid">
                <div className="government-stat-card">
                  <div className="government-stat-number">✓</div>
                  <div className="government-stat-label">Profile Complete</div>
                </div>
                <div className="government-stat-card">
                  <div className="government-stat-number">
                    {data.procurementTypes?.length || 0}
                  </div>
                  <div className="government-stat-label">Procurement Types</div>
                </div>
                <div className="government-stat-card">
                  <div className="government-stat-number">
                    {data.reportingNeeds?.length || 0}
                  </div>
                  <div className="government-stat-label">
                    Reporting Features
                  </div>
                </div>
                <div className="government-stat-card">
                  <div className="government-stat-number">Ready</div>
                  <div className="government-stat-label">Platform Status</div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[var(--secondary-black)]">
                Recommended next steps
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {nextSteps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => handleActionComplete(step.id)}
                    className={`
                      government-card p-4 text-left transition-all duration-300
                      hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[var(--secondary-muted-edge)]/20
                      ${
                        completedActions.includes(step.id)
                          ? "bg-green-50 border-green-200"
                          : ""
                      }
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl mt-1">{step.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[var(--secondary-black)] mb-1">
                          {step.title}
                        </h3>
                        <p className="text-sm text-[var(--secondary-muted-edge)] leading-relaxed mb-3">
                          {step.description}
                        </p>
                        <div className="flex items-center space-x-2">
                          {completedActions.includes(step.id) ? (
                            <span className="text-sm font-medium text-green-600">
                              ✓ Completed
                            </span>
                          ) : (
                            <span className="text-sm font-medium text-[var(--secondary-muted-edge)]">
                              {step.action} →
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-8">
              <button
                onClick={handleFinish}
                className="
                  btn text-lg px-8 py-4 w-full sm:w-auto
                  bg-[var(--secondary-muted-edge)] text-white
                  hover:bg-[var(--secondary-black)]
                  transition-all duration-300 ease-out
                  hover:shadow-lg hover:shadow-[var(--secondary-muted-edge)]/20
                  hover:scale-105
                "
              >
                Go to Government Dashboard
              </button>
            </div>
          </div>

          {/* Summary Column */}
          <div className="space-y-6">
            {/* Agency Profile Summary */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[var(--secondary-black)]">
                Your Agency Profile
              </h3>
              <div className="government-card p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[var(--secondary-muted-edge)]/20 to-[var(--secondary-soft-highlight)]/30 rounded-xl flex items-center justify-center">
                      <span className="text-3xl">🏛️</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-[var(--secondary-black)]">
                        {data.agencyName || "Your Agency"}
                      </h4>
                      <p className="text-sm text-[var(--secondary-muted-edge)]">
                        {data.jurisdiction || "Your Jurisdiction"}
                      </p>
                      <p className="text-sm text-[var(--secondary-muted-edge)]">
                        {agencyTypeLabels[data.agencyType] ||
                          "Government Agency"}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[var(--secondary-soft-highlight)]/30 pt-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-[var(--secondary-black)]">
                          {data.procurementTypes?.length || 0}
                        </div>
                        <div className="text-xs text-[var(--secondary-muted-edge)]">
                          Procurement Categories
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-[var(--secondary-black)]">
                          {data.complianceRequirements?.length || 0}
                        </div>
                        <div className="text-xs text-[var(--secondary-muted-edge)]">
                          Compliance Requirements
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Features */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[var(--secondary-black)]">
                Your Platform Features
              </h3>
              <div className="government-card p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm text-green-600">✓</span>
                    </div>
                    <div>
                      <div className="font-medium text-[var(--secondary-black)] text-sm">
                        Procurement Management
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)]">
                        End-to-end procurement process management
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm text-green-600">✓</span>
                    </div>
                    <div>
                      <div className="font-medium text-[var(--secondary-black)] text-sm">
                        Vendor Management
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)]">
                        Vendor qualification and performance tracking
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm text-green-600">✓</span>
                    </div>
                    <div>
                      <div className="font-medium text-[var(--secondary-black)] text-sm">
                        Compliance Monitoring
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)]">
                        Automated compliance tracking and reporting
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm text-green-600">✓</span>
                    </div>
                    <div>
                      <div className="font-medium text-[var(--secondary-black)] text-sm">
                        Analytics & Reporting
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)]">
                        Comprehensive procurement analytics
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-[var(--secondary-muted-edge)]/10 rounded-2xl p-6">
              <h3 className="font-semibold text-[var(--secondary-black)] mb-3">
                Need help getting started?
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-white rounded-xl border border-[var(--secondary-soft-highlight)]/30 hover:border-[var(--secondary-muted-edge)] transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">📚</span>
                    <div>
                      <div className="font-medium text-[var(--secondary-black)] text-sm">
                        Government User Guide
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)]">
                        Complete guide for government procurement
                      </div>
                    </div>
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-white rounded-xl border border-[var(--secondary-soft-highlight)]/30 hover:border-[var(--secondary-muted-edge)] transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">💬</span>
                    <div>
                      <div className="font-medium text-[var(--secondary-black)] text-sm">
                        Contact Support
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)]">
                        Get help from our government specialists
                      </div>
                    </div>
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-white rounded-xl border border-[var(--secondary-soft-highlight)]/30 hover:border-[var(--secondary-muted-edge)] transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">🎓</span>
                    <div>
                      <div className="font-medium text-[var(--secondary-black)] text-sm">
                        Training Resources
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)]">
                        Video tutorials and best practices
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
