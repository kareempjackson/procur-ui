"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./onboarding.css";

// Step components
import WelcomeStep from "./components/WelcomeStep";
import ProfileSetupStep from "./components/ProfileSetupStep";
import MarketplaceTourStep from "./components/MarketplaceTourStep";
import FirstActionsStep from "./components/FirstActionsStep";
import WrapUpStep from "./components/WrapUpStep";

// Progress indicator component
import ProgressIndicator from "./components/ProgressIndicator";

// Types
interface OnboardingData {
  businessName: string;
  region: string;
  businessType: string;
  preferredProducts: string[];
  completedActions: string[];
}

const TOTAL_STEPS = 5;

export default function BuyerOnboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    businessName: "",
    region: "",
    businessType: "",
    preferredProducts: [],
    completedActions: [],
  });

  // Track telemetry events
  const trackEvent = (eventName: string, data: Record<string, any>) => {
    // In a real implementation, this would send to analytics
    console.log("Telemetry:", eventName, data);
  };

  // Handle step completion
  const handleStepComplete = (stepData?: Partial<OnboardingData>) => {
    const startTime = Date.now();

    if (stepData) {
      setOnboardingData((prev) => ({ ...prev, ...stepData }));
    }

    trackEvent("onboarding_step_complete", {
      step_id: currentStep,
      time_spent: Date.now() - startTime,
    });

    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Onboarding complete
      trackEvent("onboarding_complete", {
        total_time: Date.now() - startTime,
        data: onboardingData,
      });
      router.push("/buyer/dashboard");
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
        trackEvent("onboarding_abandoned", {
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
      // Allow Escape to go back (except on first step)
      if (event.key === "Escape" && currentStep > 0) {
        event.preventDefault();
        handleStepNavigation(currentStep - 1);
      }

      // Allow Enter to proceed (when appropriate)
      if (event.key === "Enter" && event.ctrlKey) {
        event.preventDefault();
        // This would trigger the current step's primary action
        // Implementation depends on current step
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentStep]);

  // Focus management
  useEffect(() => {
    // Focus the main content area when step changes
    const mainElement = document.querySelector('main[role="main"]');
    if (mainElement) {
      (mainElement as HTMLElement).focus();
    }
  }, [currentStep]);

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={handleStepComplete} />;
      case 1:
        return (
          <ProfileSetupStep
            data={onboardingData}
            onNext={handleStepComplete}
            onBack={() => handleStepNavigation(0)}
          />
        );
      case 2:
        return (
          <MarketplaceTourStep
            data={onboardingData}
            onNext={handleStepComplete}
            onBack={() => handleStepNavigation(1)}
          />
        );
      case 3:
        return (
          <FirstActionsStep
            data={onboardingData}
            onNext={handleStepComplete}
            onBack={() => handleStepNavigation(2)}
          />
        );
      case 4:
        return <WrapUpStep data={onboardingData} onNext={handleStepComplete} />;
      default:
        return <WelcomeStep onNext={handleStepComplete} />;
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
      <ProgressIndicator
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
        aria-label={`Onboarding step ${currentStep + 1} of ${TOTAL_STEPS}`}
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
