"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SellerOnboardingData {
  businessName: string;
  farmType: string;
  location: string;
  farmSize: string;
  certifications: string[];
  primaryProducts: string[];
  seasonalAvailability: string[];
  farmingMethods: string[];
  paymentInfo: {
    bankAccount: string;
    payoutSchedule: string;
  };
  completedActions: string[];
}

interface SellerWrapUpStepProps {
  data: SellerOnboardingData;
  onNext: () => void;
}

const nextSteps = [
  {
    id: "add_products",
    title: "Add your first products",
    description:
      "Create product listings with photos, descriptions, and pricing",
    icon: "📦",
    action: "Add Products",
    href: "/seller/add/product",
  },
  {
    id: "setup_inventory",
    title: "Set up inventory tracking",
    description: "Configure stock levels and enable low-stock notifications",
    icon: "📊",
    action: "Manage Inventory",
    href: "/seller/products",
  },
  {
    id: "view_analytics",
    title: "Monitor your performance",
    description:
      "Track sales, views, and optimize your listings for better results",
    icon: "📈",
    action: "View Analytics",
    href: "/seller/analytics",
  },
];

const farmTypeLabels: Record<string, string> = {
  family: "Family Farm",
  commercial: "Commercial Farm",
  organic: "Organic Farm",
  cooperative: "Cooperative",
};

const farmSizeLabels: Record<string, string> = {
  small: "Small (< 10 acres)",
  medium: "Medium (10-100 acres)",
  large: "Large (100-1000 acres)",
  enterprise: "Enterprise (> 1000 acres)",
};

const productLabels: Record<string, string> = {
  fruits: "Fruits",
  vegetables: "Vegetables",
  herbs: "Herbs & Spices",
  grains: "Grains & Legumes",
  nuts: "Nuts & Seeds",
  specialty: "Specialty Crops",
};

export default function SellerWrapUpStep({
  data,
  onNext,
}: SellerWrapUpStepProps) {
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
    console.log("Seller Telemetry: seller_onboarding_complete", {
      business_name: data.businessName,
      farm_type: data.farmType,
      location: data.location,
      farm_size: data.farmSize,
      certifications: data.certifications,
      primary_products: data.primaryProducts,
      seasonal_availability: data.seasonalAvailability,
      farming_methods: data.farmingMethods,
      payout_schedule: data.paymentInfo?.payoutSchedule,
    });

    // Simulate brief loading
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Navigate to seller dashboard
    router.push("/seller");
  };

  const handleNextStepAction = (href: string) => {
    router.push(href);
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
              <div className="w-20 h-20 bg-gradient-to-br from-[var(--primary-accent2)] to-[var(--primary-accent3)] rounded-full flex items-center justify-center shadow-lg seller-success-animation">
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
                Welcome to Procur!
              </h1>
              <p className="text-xl md:text-2xl text-[var(--secondary-muted-edge)] font-light leading-relaxed">
                Your farm is now ready to start selling.
              </p>
            </div>

            {/* Farm Summary */}
            <div className="bg-[var(--primary-accent1)]/10 rounded-2xl p-6 text-left">
              <h3 className="font-semibold text-[var(--secondary-black)] mb-4">
                Your Farm Profile
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[var(--primary-accent2)] rounded-full" />
                  <span className="text-[var(--secondary-black)]">
                    <strong>{data.businessName}</strong> -{" "}
                    {farmTypeLabels[data.farmType] || data.farmType}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[var(--primary-accent2)] rounded-full" />
                  <span className="text-[var(--secondary-black)]">
                    Located in <strong>{data.location}</strong>
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[var(--primary-accent2)] rounded-full" />
                  <span className="text-[var(--secondary-black)]">
                    <strong>
                      {farmSizeLabels[data.farmSize] || data.farmSize}
                    </strong>{" "}
                    operation
                  </span>
                </div>
                {data.primaryProducts.length > 0 && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[var(--primary-accent2)] rounded-full" />
                    <span className="text-[var(--secondary-black)]">
                      Growing{" "}
                      <strong>
                        {data.primaryProducts
                          .map((p) => productLabels[p] || p)
                          .join(", ")}
                      </strong>
                    </span>
                  </div>
                )}
                {data.certifications.length > 0 && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[var(--primary-accent2)] rounded-full" />
                    <span className="text-[var(--secondary-black)]">
                      <strong>{data.certifications.length}</strong>{" "}
                      certifications
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
                aria-label="Go to your seller dashboard"
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
                  <span>Secure Payments</span>
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
                  <span>Global Reach</span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps Column */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--secondary-black)] text-center lg:text-left">
              Recommended next steps
            </h2>

            <div className="space-y-4">
              {nextSteps.map((step, index) => (
                <div
                  key={step.id}
                  className="seller-card p-6 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-[var(--secondary-muted-edge)] leading-relaxed mb-4">
                        {step.description}
                      </p>
                      <button
                        onClick={() => handleNextStepAction(step.href)}
                        className="text-sm font-medium text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] transition-colors"
                      >
                        {step.action} →
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
                    Our seller success team is here to help you maximize your
                    sales and grow your business on Procur.
                  </p>
                  <button className="text-sm font-medium text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] transition-colors">
                    Contact Seller Support →
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
