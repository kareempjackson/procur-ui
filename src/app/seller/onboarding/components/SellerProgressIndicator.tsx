"use client";

interface SellerProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

const stepLabels = ["Welcome", "Profile", "Payments", "Complete"];

export default function SellerProgressIndicator({
  currentStep,
  totalSteps,
  onStepClick,
}: SellerProgressIndicatorProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[var(--primary-background)]/80 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-6 py-4">
        {/* Label */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[var(--secondary-black)]">
            Step {currentStep + 1}/{totalSteps}
          </span>
          <span className="hidden md:inline text-sm text-[var(--secondary-muted-edge)]">
            {stepLabels[currentStep]}
          </span>
        </div>

        {/* Sleek step circles with labels and thin connectors */}
        <div className="hidden md:flex items-center justify-center gap-6">
          {Array.from({ length: totalSteps }, (_, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isClickable = index <= currentStep + 1;

            return (
              <div key={index} className="flex items-center gap-6">
                <button
                  onClick={() => isClickable && onStepClick(index)}
                  disabled={!isClickable}
                  className={`flex items-center gap-3 transition-opacity ${
                    isClickable
                      ? "hover:opacity-90"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  aria-label={`${stepLabels[index]} step`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-semibold ring-4 transition-all ${
                      isCompleted
                        ? "bg-[var(--primary-accent3)] text-white ring-[rgba(101,48,17,0.18)]"
                        : isCurrent
                        ? "bg-[var(--primary-accent3)] text-white ring-[rgba(101,48,17,0.25)] shadow-[0_6px_16px_-6px_rgba(101,48,17,0.5)]"
                        : "bg-[var(--primary-accent1)]/40 text-[var(--secondary-muted-edge)] ring-[rgba(64,113,120,0.10)]"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`text-[13px] font-medium tracking-wide ${
                      isCurrent
                        ? "text-[var(--secondary-black)]"
                        : isCompleted
                        ? "text-[var(--primary-accent3)]"
                        : "text-[var(--secondary-muted-edge)]/80"
                    }`}
                  >
                    {stepLabels[index]}
                  </span>
                </button>

                {index < totalSteps - 1 && (
                  <div
                    className={`w-10 h-[2px] rounded-full ${
                      isCompleted
                        ? "bg-[var(--primary-accent3)]"
                        : "bg-[var(--primary-accent1)]/50"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile compact bar retains brand look */}
        <div className="md:hidden w-full bg-[var(--primary-accent1)]/50 rounded-full h-2 overflow-hidden">
          <div
            className="bg-[var(--primary-accent3)] h-2 rounded-full transition-all duration-500 ease-out"
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
    </div>
  );
}
