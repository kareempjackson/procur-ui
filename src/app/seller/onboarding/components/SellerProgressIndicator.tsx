"use client";

interface SellerProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

const stepLabels = [
  "Welcome",
  "Profile",
  "Products",
  "Inventory",
  "Payments",
  "Complete",
];

export default function SellerProgressIndicator({
  currentStep,
  totalSteps,
  onStepClick,
}: SellerProgressIndicatorProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[var(--primary-background)]/95 backdrop-blur-sm border-b border-[var(--secondary-soft-highlight)]/30">
      <div className="max-w-4xl mx-auto px-6 py-4">
        {/* Mobile progress bar */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--secondary-black)]">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-sm text-[var(--secondary-muted-edge)]">
              {stepLabels[currentStep]}
            </span>
          </div>
          <div className="w-full bg-[var(--secondary-soft-highlight)]/30 rounded-full h-2">
            <div
              className="bg-[var(--primary-accent2)] h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              role="progressbar"
              aria-valuenow={currentStep + 1}
              aria-valuemin={0}
              aria-valuemax={totalSteps}
              aria-label={`Progress: ${
                currentStep + 1
              } of ${totalSteps} steps completed`}
            />
          </div>
        </div>

        {/* Desktop step indicators */}
        <div className="hidden md:flex items-center justify-center space-x-6">
          {Array.from({ length: totalSteps }, (_, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isClickable = index <= currentStep;

            return (
              <button
                key={index}
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                className={`
                  flex items-center space-x-3 transition-all duration-300 ease-out
                  ${
                    isClickable
                      ? "cursor-pointer hover:scale-105"
                      : "cursor-not-allowed opacity-50"
                  }
                  ${isCurrent ? "scale-110" : ""}
                `}
                aria-label={`${stepLabels[index]} step ${
                  isCompleted ? "completed" : isCurrent ? "current" : "upcoming"
                }`}
              >
                {/* Step circle */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                    transition-all duration-300 ease-out
                    ${
                      isCompleted
                        ? "bg-[var(--primary-accent2)] text-white"
                        : isCurrent
                        ? "bg-[var(--primary-accent2)] text-white ring-4 ring-[var(--primary-accent2)]/20"
                        : "bg-[var(--secondary-soft-highlight)]/40 text-[var(--secondary-muted-edge)]"
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Step label */}
                <span
                  className={`
                    text-sm font-medium transition-colors duration-300
                    ${
                      isCurrent
                        ? "text-[var(--secondary-black)]"
                        : isCompleted
                        ? "text-[var(--primary-accent2)]"
                        : "text-[var(--secondary-muted-edge)]"
                    }
                  `}
                >
                  {stepLabels[index]}
                </span>

                {/* Connector line */}
                {index < totalSteps - 1 && (
                  <div
                    className={`
                      w-8 h-0.5 ml-3 transition-colors duration-500
                      ${
                        isCompleted
                          ? "bg-[var(--primary-accent2)]"
                          : "bg-[var(--secondary-soft-highlight)]/40"
                      }
                    `}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
