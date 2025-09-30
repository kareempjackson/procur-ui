"use client";

import { useState } from "react";

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

interface SellerPaymentsStepProps {
  data: SellerOnboardingData;
  onNext: (data: Partial<SellerOnboardingData>) => void;
  onBack: () => void;
}

const payoutSchedules = [
  {
    id: "daily",
    label: "Daily",
    description: "Get paid every day",
    fee: "0.5%",
    icon: "⚡",
    recommended: false,
  },
  {
    id: "weekly",
    label: "Weekly",
    description: "Get paid every Friday",
    fee: "0.3%",
    icon: "📅",
    recommended: true,
  },
  {
    id: "monthly",
    label: "Monthly",
    description: "Get paid on the 1st of each month",
    fee: "0.1%",
    icon: "📊",
    recommended: false,
  },
];

const paymentMethods = [
  {
    id: "bank_transfer",
    label: "Bank Transfer",
    description: "Direct deposit to your bank account",
    processingTime: "1-2 business days",
    supported: true,
  },
  {
    id: "check",
    label: "Paper Check",
    description: "Traditional check mailed to your address",
    processingTime: "5-7 business days",
    supported: true,
  },
];

export default function SellerPaymentsStep({
  data,
  onNext,
  onBack,
}: SellerPaymentsStepProps) {
  const [formData, setFormData] = useState({
    payoutSchedule: data.paymentInfo?.payoutSchedule || "weekly",
    paymentMethod: "bank_transfer",
    bankAccount: data.paymentInfo?.bankAccount || "",
    taxId: "",
    agreedToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.bankAccount.trim()) {
      newErrors.bankAccount = "Bank account information is required";
    }
    if (!formData.taxId.trim()) {
      newErrors.taxId = "Tax ID is required for payments";
    }
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onNext({
      paymentInfo: {
        bankAccount: formData.bankAccount,
        payoutSchedule: formData.payoutSchedule,
      },
    });
  };

  const handleSkip = () => {
    onNext({});
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Form Column */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--secondary-black)]">
                Set up payments
              </h1>
              <p className="text-lg text-[var(--secondary-muted-edge)] leading-relaxed">
                Configure how and when you want to receive payments for your
                sales. All information is encrypted and secure.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Payment Method */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--secondary-black)] mb-2">
                    Payment Method
                  </label>
                  <p className="text-sm text-[var(--secondary-muted-edge)] mb-4">
                    How would you like to receive your payments?
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() =>
                        handleInputChange("paymentMethod", method.id)
                      }
                      disabled={!method.supported}
                      className={`
                        payment-method-card w-full h-full
                        ${
                          formData.paymentMethod === method.id ? "selected" : ""
                        }
                        ${
                          !method.supported
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }
                      `}
                      aria-pressed={formData.paymentMethod === method.id}
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-[var(--secondary-black)]">
                            {method.label}
                          </h3>
                          {!method.supported && (
                            <span className="text-xs text-[var(--secondary-muted-edge)]">
                              Coming Soon
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[var(--secondary-muted-edge)] mb-2">
                          {method.description}
                        </p>
                        <div className="text-xs text-[var(--secondary-muted-edge)]">
                          Processing time: {method.processingTime}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bank Account Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[var(--secondary-black)]">
                  Account Details
                </h3>

                <div className="space-y-2">
                  <label
                    htmlFor="bankAccount"
                    className="block text-sm font-semibold text-[var(--secondary-black)]"
                  >
                    Bank Account Number *
                  </label>
                  <input
                    id="bankAccount"
                    type="text"
                    value={formData.bankAccount}
                    onChange={(e) =>
                      handleInputChange("bankAccount", e.target.value)
                    }
                    placeholder="Enter your bank account number"
                    className={`
                      input w-full text-base py-3 px-5 rounded-full
                      ${
                        errors.bankAccount
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : ""
                      }
                    `}
                    style={{ borderRadius: 9999 }}
                    aria-describedby={
                      errors.bankAccount ? "bankAccount-error" : undefined
                    }
                  />
                  {errors.bankAccount && (
                    <p
                      id="bankAccount-error"
                      className="text-sm text-red-600"
                      role="alert"
                    >
                      {errors.bankAccount}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="taxId"
                    className="block text-sm font-semibold text-[var(--secondary-black)]"
                  >
                    Tax ID (SSN/EIN) *
                  </label>
                  <input
                    id="taxId"
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => handleInputChange("taxId", e.target.value)}
                    placeholder="XXX-XX-XXXX or XX-XXXXXXX"
                    className={`
                      input w-full text-base py-3 px-5 rounded-full
                      ${
                        errors.taxId
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : ""
                      }
                    `}
                    style={{ borderRadius: 9999 }}
                    aria-describedby={errors.taxId ? "taxId-error" : undefined}
                  />
                  {errors.taxId && (
                    <p
                      id="taxId-error"
                      className="text-sm text-red-600"
                      role="alert"
                    >
                      {errors.taxId}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    id="agreedToTerms"
                    type="checkbox"
                    checked={formData.agreedToTerms}
                    onChange={(e) =>
                      handleInputChange("agreedToTerms", e.target.checked)
                    }
                    className="mt-1 w-4 h-4 text-[var(--primary-accent2)] border-[var(--secondary-soft-highlight)] rounded focus:ring-[var(--primary-accent2)]/20"
                  />
                  <label
                    htmlFor="agreedToTerms"
                    className="text-sm text-[var(--secondary-black)] leading-relaxed"
                  >
                    I agree to the{" "}
                    <a
                      href="/legal/terms"
                      target="_blank"
                      className="text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] underline"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/legal/privacy"
                      target="_blank"
                      className="text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] underline"
                    >
                      Privacy Policy
                    </a>
                    . I understand that Procur will collect and process payment
                    information securely.
                  </label>
                </div>
                {errors.agreedToTerms && (
                  <p className="text-sm text-red-600" role="alert">
                    {errors.agreedToTerms}
                  </p>
                )}
              </div>

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <button
                  type="button"
                  onClick={onBack}
                  className="btn btn-ghost text-base px-6 py-3 order-2 sm:order-1"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    btn btn-primary text-base px-8 py-3 min-w-[140px] order-1 sm:order-2
                    transition-all duration-300 ease-out
                    hover:shadow-lg hover:shadow-[var(--primary-accent2)]/20
                    disabled:opacity-70 disabled:cursor-not-allowed
                    ${isSubmitting ? "scale-95" : "hover:scale-105"}
                  `}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Setting up...</span>
                    </div>
                  ) : (
                    "Complete Setup"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleSkip}
                  className="btn btn-ghost text-base px-6 py-3 order-3"
                >
                  Skip for now
                </button>
              </div>
            </form>
          </div>

          {/* Visual Column */}
          <div className="space-y-6">
            {/* Security Info */}
            <div className="seller-card p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-3 h-3 bg-green-600 rounded-full" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                    Your information is secure
                  </h3>
                  <ul className="text-sm text-[var(--secondary-muted-edge)] space-y-1">
                    <li>• Bank-level encryption for all data</li>
                    <li>• PCI DSS compliant payment processing</li>
                    <li>• Never stored on our servers</li>
                    <li>• Verified by security audits</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Payout Preview removed per request */}

            {/* Support */}
            <div className="bg-[var(--primary-accent1)]/10 rounded-2xl p-6">
              <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                Need help?
              </h3>
              <p className="text-sm text-[var(--secondary-muted-edge)] mb-3">
                Our payment specialists are here to help you get set up quickly
                and securely.
              </p>
              <button className="text-sm font-medium text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] transition-colors">
                Contact Support →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
