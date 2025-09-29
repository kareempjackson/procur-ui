"use client";

import { useState } from "react";
import Image from "next/image";

interface SellerWelcomeStepProps {
  onNext: () => void;
}

export default function SellerWelcomeStep({ onNext }: SellerWelcomeStepProps) {
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
                <span className="text-[var(--primary-accent2)]">Procur</span>
              </h1>
              <p className="text-xl md:text-2xl text-[var(--secondary-muted-edge)] font-light leading-relaxed max-w-2xl">
                Start selling your fresh produce to buyers worldwide.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-4 max-w-xl">
              <p className="text-lg text-[var(--secondary-black)]/80 leading-relaxed">
                Join thousands of farmers and suppliers who trust Procur to
                connect them with quality buyers, manage their inventory, and
                grow their business.
              </p>
              <div className="flex items-center space-x-6 text-sm text-[var(--secondary-muted-edge)]">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[var(--primary-accent2)] rounded-full" />
                  <span>Global reach</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[var(--primary-accent2)] rounded-full" />
                  <span>Secure payments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[var(--primary-accent2)] rounded-full" />
                  <span>Easy management</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleGetStarted}
                disabled={isLoading}
                className={`
                  btn btn-primary text-lg px-8 py-4 min-w-[160px]
                  transition-all duration-300 ease-out
                  hover:shadow-lg hover:shadow-[var(--primary-accent2)]/20
                  focus:outline-none focus:ring-4 focus:ring-[var(--primary-accent2)]/20
                  disabled:opacity-70 disabled:cursor-not-allowed
                  ${isLoading ? "scale-95" : "hover:scale-105"}
                `}
                aria-label="Start the seller onboarding process"
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
                  transition-all duration-300 ease-out
                  hover:bg-[var(--primary-base)]/5
                  focus:outline-none focus:ring-4 focus:ring-[var(--primary-base)]/20
                "
                aria-label="Learn more about selling on Procur"
              >
                Learn More
              </button>
            </div>

            {/* Trust indicators */}
            <div className="pt-8 border-t border-[var(--secondary-soft-highlight)]/30">
              <p className="text-sm text-[var(--secondary-muted-edge)] mb-4">
                Trusted by farmers and suppliers worldwide
              </p>
              <div className="flex items-center space-x-8 opacity-60">
                <div className="text-xs font-semibold text-[var(--secondary-black)]">
                  500+ Sellers
                </div>
                <div className="w-px h-4 bg-[var(--secondary-soft-highlight)]" />
                <div className="text-xs font-semibold text-[var(--secondary-black)]">
                  50+ Countries
                </div>
                <div className="w-px h-4 bg-[var(--secondary-soft-highlight)]" />
                <div className="text-xs font-semibold text-[var(--secondary-black)]">
                  $2M+ Revenue
                </div>
              </div>
            </div>
          </div>

          {/* Image Column */}
          <div className="relative">
            <div className="relative aspect-[4/5] lg:aspect-[3/4] rounded-3xl overflow-hidden">
              <Image
                src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                alt="Farmer working in fields at sunrise - fresh produce and agricultural scenes"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                priority
              />

              {/* Overlay gradient for better text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

              {/* Floating seller stats card */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-[var(--secondary-black)]">
                        500+
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)]">
                        Active Sellers
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-[var(--secondary-black)]">
                        95%
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)]">
                        Satisfaction
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-[var(--secondary-black)]">
                        24h
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)]">
                        Avg Payout
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[var(--primary-accent1)]/10 rounded-full blur-xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[var(--secondary-soft-highlight)]/20 rounded-full blur-2xl" />
          </div>
        </div>

        {/* Additional seller benefits */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-[var(--primary-accent1)]/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">🌾</span>
            </div>
            <h3 className="font-semibold text-[var(--secondary-black)]">
              Showcase Your Farm
            </h3>
            <p className="text-sm text-[var(--secondary-muted-edge)] leading-relaxed">
              Create a beautiful profile that tells your farm's story and builds
              trust with buyers.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-[var(--primary-accent1)]/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="font-semibold text-[var(--secondary-black)]">
              Grow Your Business
            </h3>
            <p className="text-sm text-[var(--secondary-muted-edge)] leading-relaxed">
              Access analytics, manage inventory, and reach new markets to scale
              your operations.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-[var(--primary-accent1)]/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="font-semibold text-[var(--secondary-black)]">
              Get Paid Fast
            </h3>
            <p className="text-sm text-[var(--secondary-muted-edge)] leading-relaxed">
              Secure payments with flexible payout schedules that work for your
              cash flow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
