"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./seller-onboarding.css";

// Step components
import SellerWelcomeStep from "./components/SellerWelcomeStep";
import SellerProfileSetupStep from "./components/SellerProfileSetupStep";
import SellerPaymentsStep from "./components/SellerPaymentsStep";
import SellerWrapUpStep from "./components/SellerWrapUpStep";

// Progress indicator component
import SellerProgressIndicator from "./components/SellerProgressIndicator";

// Types
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

const TOTAL_STEPS = 4;

export default function SellerOnboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<SellerOnboardingData>({
    businessName: "",
    farmType: "",
    location: "",
    farmSize: "",
    certifications: [],
    primaryProducts: [],
    seasonalAvailability: [],
    farmingMethods: [],
    paymentInfo: {
      bankAccount: "",
      payoutSchedule: "weekly",
    },
    completedActions: [],
  });

  // Track telemetry events
  const trackEvent = (eventName: string, data: Record<string, any>) => {
    console.log("Seller Telemetry:", eventName, data);
  };

  // Handle step completion
  const handleStepComplete = (stepData?: Partial<SellerOnboardingData>) => {
    const startTime = Date.now();

    if (stepData) {
      setOnboardingData((prev) => ({ ...prev, ...stepData }));
    }

    trackEvent("seller_onboarding_step_complete", {
      step_id: currentStep,
      time_spent: Date.now() - startTime,
    });

    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      trackEvent("seller_onboarding_complete", {
        total_time: Date.now() - startTime,
        data: onboardingData,
      });
      router.push("/seller");
    }
  };

  // Handle step navigation
  const handleStepNavigation = (step: number) => {
    if (step >= 0 && step < TOTAL_STEPS && step <= currentStep + 1) {
      setCurrentStep(step);
    }
  };

  // Handle abandonment tracking
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentStep < TOTAL_STEPS - 1) {
        trackEvent("seller_onboarding_abandoned", {
          step_id: currentStep,
          reason: "page_unload",
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [currentStep]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && currentStep > 0) {
        event.preventDefault();
        handleStepNavigation(currentStep - 1);
      }

      if (event.key === "Enter" && event.ctrlKey) {
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentStep]);

  // Focus management
  useEffect(() => {
    const mainElement = document.querySelector('main[role="main"]');
    if (mainElement) {
      (mainElement as HTMLElement).focus();
    }
  }, [currentStep]);

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <SellerWelcomeStep onNext={handleStepComplete} />;
      case 1:
        return (
          <SellerProfileSetupStep
            data={onboardingData}
            onNext={handleStepComplete}
            onBack={() => handleStepNavigation(0)}
          />
        );
      case 2:
        return (
          <SellerPaymentsStep
            data={onboardingData}
            onNext={handleStepComplete}
            onBack={() => handleStepNavigation(1)}
          />
        );
      case 3:
        return (
          <SellerWrapUpStep data={onboardingData} onNext={handleStepComplete} />
        );
      default:
        return <SellerWelcomeStep onNext={handleStepComplete} />;
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="skip-link"
        onFocus={(e) => (e.currentTarget.style.top = "6px")}
        onBlur={(e) => (e.currentTarget.style.top = "-40px")}
      >
        Skip to main content
      </a>

      {/* Progress indicator */}
      <SellerProgressIndicator
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        onStepClick={handleStepNavigation}
      />

      {/* Main content */}
      <main
        id="main-content"
        className="relative z-10 focus:outline-none"
        role="main"
        tabIndex={-1}
        aria-label={`Seller onboarding step ${
          currentStep + 1
        } of ${TOTAL_STEPS}`}
      >
        <div
          className="transition-all duration-500 ease-in-out"
          style={{
            animationName: "step-enter",
            animationDuration: "500ms",
            animationFillMode: "both",
          }}
        >
          {renderCurrentStep()}
        </div>
      </main>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-[var(--secondary-soft-highlight)]/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-[var(--primary-accent1)]/5 to-transparent" />
      </div>
    </div>
  );
}
