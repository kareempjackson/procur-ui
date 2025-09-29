"use client";

import { useState } from "react";

interface OnboardingData {
  businessName: string;
  region: string;
  businessType: string;
  preferredProducts: string[];
  completedActions: string[];
}

interface FirstActionsStepProps {
  data: OnboardingData;
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
}

const actions = [
  {
    id: "request_quote",
    title: "Request a Quote",
    description: "Get pricing from suppliers for specific products you need",
    icon: "💬",
    benefit: "Compare prices and terms from multiple suppliers",
    cta: "Request Quote",
    color: "from-blue-50 to-blue-100",
    borderColor: "border-blue-200",
    hoverColor: "hover:border-blue-300",
  },
  {
    id: "preorder_harvest",
    title: "Pre-order Harvest",
    description: "Reserve products from upcoming harvests at guaranteed prices",
    icon: "🌾",
    benefit: "Secure supply and lock in seasonal pricing",
    cta: "Browse Harvests",
    color: "from-green-50 to-green-100",
    borderColor: "border-green-200",
    hoverColor: "hover:border-green-300",
  },
  {
    id: "save_farms",
    title: "Save Favorite Farms",
    description: "Build your network of trusted suppliers for easy reordering",
    icon: "⭐",
    benefit: "Quick access to your preferred suppliers",
    cta: "Explore Farms",
    color: "from-yellow-50 to-yellow-100",
    borderColor: "border-yellow-200",
    hoverColor: "hover:border-yellow-300",
  },
];

export default function FirstActionsStep({
  data,
  onNext,
  onBack,
}: FirstActionsStepProps) {
  const [completedActions, setCompletedActions] = useState<string[]>(
    data.completedActions || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleActionComplete = (actionId: string) => {
    const newCompletedActions = completedActions.includes(actionId)
      ? completedActions.filter((id) => id !== actionId)
      : [...completedActions, actionId];

    setCompletedActions(newCompletedActions);

    // Track first action taken
    if (!completedActions.includes(actionId)) {
      console.log("Telemetry: first_action_taken", { action_type: actionId });
    }
  };

  const handleCompleteSetup = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onNext({ completedActions });
  };

  const canProceed = completedActions.length > 0;

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--secondary-black)] mb-4">
            Take your first steps
          </h1>
          <p className="text-lg text-[var(--secondary-muted-edge)] max-w-2xl mx-auto">
            Get value from day one with these quick actions. Choose what
            interests you most to get started.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-[var(--primary-accent1)]/10 rounded-full px-4 py-2">
            <span className="text-sm font-medium text-[var(--secondary-black)]">
              {completedActions.length} of {actions.length} actions selected
            </span>
            {completedActions.length > 0 && (
              <div className="w-2 h-2 bg-[var(--primary-accent2)] rounded-full animate-pulse" />
            )}
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {actions.map((action, index) => {
            const isCompleted = completedActions.includes(action.id);

            return (
              <div
                key={action.id}
                className={`
                  relative bg-white rounded-3xl p-6 border-2 transition-all duration-300 cursor-pointer
                  hover:scale-105 hover:shadow-xl group
                  ${
                    isCompleted
                      ? "border-[var(--primary-accent2)] bg-[var(--primary-accent2)]/5 shadow-lg"
                      : `${action.borderColor} ${action.hoverColor}`
                  }
                `}
                onClick={() => handleActionComplete(action.id)}
                role="button"
                tabIndex={0}
                aria-pressed={isCompleted}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleActionComplete(action.id);
                  }
                }}
              >
                {/* Completion Indicator */}
                {isCompleted && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-[var(--primary-accent2)] rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
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
                )}

                {/* Icon */}
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {action.icon}
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-[var(--secondary-black)]">
                    {action.title}
                  </h3>

                  <p className="text-[var(--secondary-muted-edge)] leading-relaxed">
                    {action.description}
                  </p>

                  {/* Benefit */}
                  <div className="bg-[var(--secondary-soft-highlight)]/20 rounded-xl p-3">
                    <div className="flex items-start space-x-2">
                      <div className="w-4 h-4 bg-[var(--primary-accent2)] rounded-full flex items-center justify-center mt-0.5">
                        <svg
                          className="w-2 h-2 text-white"
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
                      <p className="text-sm text-[var(--secondary-black)] font-medium">
                        {action.benefit}
                      </p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    className={`
                      w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200
                      focus:outline-none focus:ring-4 focus:ring-[var(--primary-accent2)]/20
                      ${
                        isCompleted
                          ? "bg-[var(--primary-accent2)] text-white"
                          : "bg-[var(--secondary-soft-highlight)]/30 text-[var(--secondary-black)] hover:bg-[var(--secondary-soft-highlight)]/50"
                      }
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleActionComplete(action.id);
                    }}
                  >
                    {isCompleted ? "Selected" : action.cta}
                  </button>
                </div>

                {/* Step number */}
                <div className="absolute top-4 left-4 w-8 h-8 bg-[var(--secondary-soft-highlight)]/30 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-[var(--secondary-black)]">
                    {index + 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guidance */}
        <div className="bg-[var(--primary-accent1)]/10 rounded-2xl p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-[var(--primary-accent2)]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-[var(--primary-accent2)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                Getting Started Tips
              </h3>
              <ul className="text-sm text-[var(--secondary-muted-edge)] space-y-1">
                <li>
                  • You can always come back to complete these actions later
                </li>
                <li>
                  • Each action helps you discover different aspects of the
                  marketplace
                </li>
                <li>
                  • Your selections will personalize your dashboard experience
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onBack}
            className="btn btn-ghost text-base px-6 py-3 order-2 sm:order-1"
          >
            Back
          </button>

          <button
            onClick={handleCompleteSetup}
            disabled={isSubmitting}
            className={`
              btn text-base px-8 py-3 min-w-[160px] order-1 sm:order-2
              transition-all duration-300 ease-out
              ${
                canProceed
                  ? "btn-primary hover:shadow-lg hover:shadow-[var(--primary-accent2)]/20 hover:scale-105"
                  : "btn-secondary opacity-70 cursor-not-allowed"
              }
              ${isSubmitting ? "scale-95" : ""}
            `}
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Completing...</span>
              </div>
            ) : (
              "Complete Setup"
            )}
          </button>
        </div>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <button
            onClick={() => onNext({ completedActions: [] })}
            className="text-sm text-[var(--secondary-muted-edge)] hover:text-[var(--secondary-black)] transition-colors"
          >
            Skip for now - I'll explore later
          </button>
        </div>
      </div>
    </div>
  );
}
