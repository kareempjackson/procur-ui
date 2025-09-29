"use client";

import { useState } from "react";
import Image from "next/image";

interface GovernmentWelcomeStepProps {
  onNext: () => void;
}

export default function GovernmentWelcomeStep({
  onNext,
}: GovernmentWelcomeStepProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = async () => {
    setIsLoading(true);
    // Simulate brief loading for smooth transition
    await new Promise((resolve) => setTimeout(resolve, 300));
    onNext();
  };

  const handleLearnMore = () => {
    // In a real implementation, this might open a modal or navigate to info page
    window.open("/company/about", "_blank");
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content Column */}
          <div className="text-center lg:text-left space-y-8">
            {/* Logo */}
            <div className="flex justify-center lg:justify-start">
              <Image
                src="/images/logos/procur-logo.svg"
                alt="Procur"
                width={120}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--secondary-black)] leading-tight">
                Welcome to{" "}
                <span className="text-[var(--secondary-muted-edge)]">
                  Procur
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-[var(--secondary-muted-edge)] font-light leading-relaxed max-w-2xl">
                Streamline government procurement with transparency and
                efficiency.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-4 max-w-xl">
              <p className="text-lg text-[var(--secondary-black)]/80 leading-relaxed">
                Join government agencies worldwide who trust Procur to manage
                vendor relationships, ensure compliance, and maintain
                transparent procurement processes.
              </p>
              <div className="flex items-center space-x-6 text-sm text-[var(--secondary-muted-edge)]">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[var(--secondary-muted-edge)] rounded-full" />
                  <span>Compliance ready</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[var(--secondary-muted-edge)] rounded-full" />
                  <span>Transparent process</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[var(--secondary-muted-edge)] rounded-full" />
                  <span>Audit trails</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleGetStarted}
                disabled={isLoading}
                className={`
                  btn text-lg px-8 py-4 min-w-[160px]
                  bg-[var(--secondary-muted-edge)] text-white
                  hover:bg-[var(--secondary-black)]
                  transition-all duration-300 ease-out
                  hover:shadow-lg hover:shadow-[var(--secondary-muted-edge)]/20
                  focus:outline-none focus:ring-4 focus:ring-[var(--secondary-muted-edge)]/20
                  disabled:opacity-70 disabled:cursor-not-allowed
                  ${isLoading ? "scale-95" : "hover:scale-105"}
                `}
                aria-label="Start the government onboarding process"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Starting...</span>
                  </div>
                ) : (
                  "Get Started"
                )}
              </button>

              <button
                onClick={handleLearnMore}
                className="
                  btn btn-ghost text-lg px-8 py-4
                  border-[var(--secondary-muted-edge)] text-[var(--secondary-muted-edge)]
                  hover:bg-[var(--secondary-muted-edge)]/5
                  transition-all duration-300 ease-out
                  focus:outline-none focus:ring-4 focus:ring-[var(--secondary-muted-edge)]/20
                "
                aria-label="Learn more about Procur for government"
              >
                Learn More
              </button>
            </div>

            {/* Trust indicators */}
            <div className="pt-8 border-t border-[var(--secondary-soft-highlight)]/30">
              <p className="text-sm text-[var(--secondary-muted-edge)] mb-4">
                Trusted by government agencies and public institutions
              </p>
              <div className="flex items-center space-x-8 opacity-60">
                <div className="text-xs font-semibold text-[var(--secondary-black)]">
                  200+ Agencies
                </div>
                <div className="w-px h-4 bg-[var(--secondary-soft-highlight)]" />
                <div className="text-xs font-semibold text-[var(--secondary-black)]">
                  25+ Countries
                </div>
                <div className="w-px h-4 bg-[var(--secondary-soft-highlight)]" />
                <div className="text-xs font-semibold text-[var(--secondary-black)]">
                  SOC 2 Compliant
                </div>
              </div>
            </div>
          </div>

          {/* Image Column */}
          <div className="relative">
            <div className="relative aspect-[4/5] lg:aspect-[3/4] rounded-3xl overflow-hidden">
              <Image
                src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                alt="Government building and public service imagery - professional and institutional"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                priority
              />

              {/* Overlay gradient for better text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

              {/* Floating government stats card */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-[var(--secondary-black)]">
                        200+
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)]">
                        Gov Agencies
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-[var(--secondary-black)]">
                        99.9%
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)]">
                        Compliance Rate
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-[var(--secondary-black)]">
                        $50M+
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)]">
                        Managed
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[var(--secondary-soft-highlight)]/20 rounded-full blur-xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[var(--secondary-muted-edge)]/10 rounded-full blur-2xl" />
          </div>
        </div>

        {/* Additional government benefits */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-[var(--secondary-muted-edge)]/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">🏛️</span>
            </div>
            <h3 className="font-semibold text-[var(--secondary-black)]">
              Compliance First
            </h3>
            <p className="text-sm text-[var(--secondary-muted-edge)] leading-relaxed">
              Built-in compliance tools ensure all procurement follows
              regulations and audit requirements.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-[var(--secondary-muted-edge)]/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="font-semibold text-[var(--secondary-black)]">
              Transparent Reporting
            </h3>
            <p className="text-sm text-[var(--secondary-muted-edge)] leading-relaxed">
              Generate detailed reports for stakeholders, auditors, and public
              transparency requirements.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-[var(--secondary-muted-edge)]/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="font-semibold text-[var(--secondary-black)]">
              Vendor Management
            </h3>
            <p className="text-sm text-[var(--secondary-muted-edge)] leading-relaxed">
              Streamlined vendor onboarding, qualification, and performance
              tracking systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
