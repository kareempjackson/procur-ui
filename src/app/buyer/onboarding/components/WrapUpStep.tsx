"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface OnboardingData {
  businessName: string;
  region: string;
  businessType: string;
  preferredProducts: string[];
  completedActions: string[];
}

interface WrapUpStepProps {
  data: OnboardingData;
  onNext: () => void;
}

const callouts = [
  {
    id: "dashboard",
    title: "Access your personalized dashboard",
    description:
      "View recommended suppliers, track orders, and manage your sourcing pipeline",
    icon: "📊",
    action: "Go to Dashboard",
  },
  {
    id: "team",
    title: "Invite teammates to collaborate",
    description:
      "Add team members to share suppliers, coordinate orders, and streamline procurement",
    icon: "👥",
    action: "Invite Team",
  },
  {
    id: "tracking",
    title: "Track your orders in real time",
    description:
      "Monitor deliveries, receive updates, and maintain quality control throughout the supply chain",
    icon: "📦",
    action: "View Orders",
  },
];

const businessTypeLabels: Record<string, string> = {
  restaurant: "Restaurant",
  hotel: "Hotel",
  distributor: "Distributor",
  retailer: "Retailer",
};

const productLabels: Record<string, string> = {
  fruits: "Fruits",
  vegetables: "Vegetables",
  herbs: "Herbs & Spices",
  grains: "Grains & Legumes",
};

export default function WrapUpStep({ data, onNext }: WrapUpStepProps) {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti animation on mount
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleGoToDashboard = async () => {
    setIsRedirecting(true);

    // Track completion
    console.log("Telemetry: onboarding_complete", {
      business_name: data.businessName,
      business_type: data.businessType,
      region: data.region,
      preferred_products: data.preferredProducts,
      completed_actions: data.completedActions,
    });

    // Simulate brief loading
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Navigate to dashboard
    router.push("/buyer/dashboard");
  };

  const handleInviteTeam = () => {
    // In a real implementation, this would open an invite modal
    console.log("Opening team invite modal");
  };

  const handleViewOrders = () => {
    // In a real implementation, this would navigate to orders page
    router.push("/buyer/orders");
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-20">
          {Array.from({ length: 50 }, (_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ["#CB5927", "#E0A374", "#C0D1C7", "#D3E458"][
                    Math.floor(Math.random() * 4)
                  ],
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content Column */}
          <div className="text-center lg:text-left space-y-8">
            {/* Success Icon */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-20 h-20 bg-gradient-to-br from-[var(--primary-accent2)] to-[var(--primary-accent3)] rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
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
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--secondary-black)] leading-tight">
                You're all set!
              </h1>
              <p className="text-xl md:text-2xl text-[var(--secondary-muted-edge)] font-light leading-relaxed">
                Start sourcing fresh produce today.
              </p>
            </div>

            {/* Personalized Summary */}
            <div className="bg-[var(--primary-accent1)]/10 rounded-2xl p-6 text-left">
              <h3 className="font-semibold text-[var(--secondary-black)] mb-4">
                Your Profile Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[var(--primary-accent2)] rounded-full" />
                  <span className="text-[var(--secondary-black)]">
                    <strong>{data.businessName}</strong> -{" "}
                    {businessTypeLabels[data.businessType] || data.businessType}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[var(--primary-accent2)] rounded-full" />
                  <span className="text-[var(--secondary-black)]">
                    Operating in <strong>{data.region}</strong>
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[var(--primary-accent2)] rounded-full" />
                  <span className="text-[var(--secondary-black)]">
                    Interested in{" "}
                    <strong>
                      {data.preferredProducts
                        .map((p) => productLabels[p] || p)
                        .join(", ")}
                    </strong>
                  </span>
                </div>
                {data.completedActions.length > 0 && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[var(--primary-accent2)] rounded-full" />
                    <span className="text-[var(--secondary-black)]">
                      <strong>{data.completedActions.length}</strong> initial
                      actions selected
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Primary CTA */}
            <div className="pt-4">
              <button
                onClick={handleGoToDashboard}
                disabled={isRedirecting}
                className={`
                  btn btn-primary text-lg px-8 py-4 min-w-[200px]
                  transition-all duration-300 ease-out
                  hover:shadow-xl hover:shadow-[var(--primary-accent2)]/30
                  focus:outline-none focus:ring-4 focus:ring-[var(--primary-accent2)]/20
                  disabled:opacity-70 disabled:cursor-not-allowed
                  ${isRedirecting ? "scale-95" : "hover:scale-105"}
                `}
                aria-label="Go to your personalized dashboard"
              >
                {isRedirecting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Loading Dashboard...</span>
                  </div>
                ) : (
                  "Go to Dashboard"
                )}
              </button>
            </div>

            {/* Trust & Support */}
            <div className="pt-8 border-t border-[var(--secondary-soft-highlight)]/30">
              <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-[var(--secondary-muted-edge)]">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-2.5 h-2.5 text-white"
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
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-2.5 h-2.5 text-white"
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
                  <span>Quality Guaranteed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-2.5 h-2.5 text-white"
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
                  <span>Secure Payments</span>
                </div>
              </div>
            </div>
          </div>

          {/* Callouts Column */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--secondary-black)] text-center lg:text-left">
              What's next?
            </h2>

            <div className="space-y-4">
              {callouts.map((callout, index) => (
                <div
                  key={callout.id}
                  className="bg-white rounded-2xl p-6 border border-[var(--secondary-soft-highlight)]/30 hover:border-[var(--primary-base)] transition-all duration-200 hover:shadow-lg group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                      {callout.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                        {callout.title}
                      </h3>
                      <p className="text-sm text-[var(--secondary-muted-edge)] leading-relaxed mb-4">
                        {callout.description}
                      </p>
                      <button
                        onClick={() => {
                          if (callout.id === "dashboard") handleGoToDashboard();
                          else if (callout.id === "team") handleInviteTeam();
                          else if (callout.id === "tracking")
                            handleViewOrders();
                        }}
                        className="text-sm font-medium text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] transition-colors"
                      >
                        {callout.action} →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Help Section */}
            <div className="bg-gradient-to-br from-[var(--secondary-soft-highlight)]/20 to-[var(--primary-accent1)]/10 rounded-2xl p-6">
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
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                    Need help getting started?
                  </h3>
                  <p className="text-sm text-[var(--secondary-muted-edge)] mb-3">
                    Our team is here to help you make the most of Procur. Get
                    personalized guidance and support.
                  </p>
                  <button className="text-sm font-medium text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] transition-colors">
                    Contact Support →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-[var(--primary-accent1)]/5 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-[var(--secondary-soft-highlight)]/10 to-transparent" />
      </div>
    </div>
  );
}
