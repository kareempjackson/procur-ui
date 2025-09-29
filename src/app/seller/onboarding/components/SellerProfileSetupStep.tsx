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

interface SellerProfileSetupStepProps {
  data: SellerOnboardingData;
  onNext: (data: Partial<SellerOnboardingData>) => void;
  onBack: () => void;
}

const farmTypes = [
  {
    id: "family",
    label: "Family Farm",
    icon: "🏡",
    description: "Small to medium family-owned operation",
  },
  {
    id: "commercial",
    label: "Commercial Farm",
    icon: "🏭",
    description: "Large-scale commercial operation",
  },
  {
    id: "organic",
    label: "Organic Farm",
    icon: "🌱",
    description: "Certified organic farming practices",
  },
  {
    id: "cooperative",
    label: "Cooperative",
    icon: "🤝",
    description: "Farmer cooperative or collective",
  },
];

const farmSizes = [
  {
    id: "small",
    label: "Small",
    icon: "🌿",
    range: "< 10 acres",
    description: "Perfect for specialty crops",
  },
  {
    id: "medium",
    label: "Medium",
    icon: "🚜",
    range: "10-100 acres",
    description: "Diverse crop production",
  },
  {
    id: "large",
    label: "Large",
    icon: "🌾",
    range: "100-1000 acres",
    description: "Commercial scale farming",
  },
  {
    id: "enterprise",
    label: "Enterprise",
    icon: "🏭",
    range: "> 1000 acres",
    description: "Industrial agriculture",
  },
];

const certifications = [
  { id: "organic", label: "Organic Certified", icon: "🌱" },
  { id: "gap", label: "Good Agricultural Practices", icon: "✅" },
  { id: "fair_trade", label: "Fair Trade", icon: "🤝" },
  { id: "rainforest", label: "Rainforest Alliance", icon: "🌳" },
  { id: "non_gmo", label: "Non-GMO", icon: "🧬" },
  { id: "sustainable", label: "Sustainable Agriculture", icon: "♻️" },
];

const farmingMethods = [
  {
    id: "conventional",
    label: "Conventional",
    description: "Traditional farming methods",
  },
  {
    id: "organic",
    label: "Organic",
    description: "No synthetic pesticides or fertilizers",
  },
  {
    id: "biodynamic",
    label: "Biodynamic",
    description: "Holistic ecological approach",
  },
  {
    id: "permaculture",
    label: "Permaculture",
    description: "Sustainable design principles",
  },
  {
    id: "hydroponic",
    label: "Hydroponic",
    description: "Soilless growing systems",
  },
  {
    id: "greenhouse",
    label: "Greenhouse",
    description: "Controlled environment agriculture",
  },
];

export default function SellerProfileSetupStep({
  data,
  onNext,
  onBack,
}: SellerProfileSetupStepProps) {
  const [formData, setFormData] = useState({
    businessName: data.businessName || "",
    farmType: data.farmType || "",
    location: data.location || "",
    farmSize: data.farmSize || "",
    certifications: data.certifications || [],
    farmingMethods: data.farmingMethods || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleArrayToggle = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).includes(value)
        ? (prev[field as keyof typeof prev] as string[]).filter(
            (item) => item !== value
          )
        : [...(prev[field as keyof typeof prev] as string[]), value],
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Farm/Business name is required";
    }
    if (!formData.farmType) {
      newErrors.farmType = "Please select your farm type";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    if (!formData.farmSize) {
      newErrors.farmSize = "Please select your farm size";
    }
    if (formData.farmingMethods.length === 0) {
      newErrors.farmingMethods = "Please select at least one farming method";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    onNext(formData);
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
                Tell us about your farm
              </h1>
              <p className="text-lg text-[var(--secondary-muted-edge)] leading-relaxed">
                Help buyers understand your operation and connect with the right
                customers for your products.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Business Name */}
              <div className="space-y-2">
                <label
                  htmlFor="businessName"
                  className="block text-sm font-semibold text-[var(--secondary-black)]"
                >
                  Farm/Business Name *
                </label>
                <input
                  id="businessName"
                  type="text"
                  value={formData.businessName}
                  onChange={(e) =>
                    handleInputChange("businessName", e.target.value)
                  }
                  placeholder="Enter your farm or business name"
                  className={`
                    input w-full text-base py-3 px-4
                    ${
                      errors.businessName
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : ""
                    }
                  `}
                  aria-describedby={
                    errors.businessName ? "businessName-error" : undefined
                  }
                />
                {errors.businessName && (
                  <p
                    id="businessName-error"
                    className="text-sm text-red-600"
                    role="alert"
                  >
                    {errors.businessName}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label
                  htmlFor="location"
                  className="block text-sm font-semibold text-[var(--secondary-black)]"
                >
                  Location *
                </label>
                <input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  placeholder="City, State/Province, Country"
                  className={`
                    input w-full text-base py-3 px-4
                    ${
                      errors.location
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : ""
                    }
                  `}
                  aria-describedby={
                    errors.location ? "location-error" : undefined
                  }
                />
                {errors.location && (
                  <p
                    id="location-error"
                    className="text-sm text-red-600"
                    role="alert"
                  >
                    {errors.location}
                  </p>
                )}
              </div>

              {/* Farm Type */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--secondary-black)] mb-2">
                    Farm Type *
                  </label>
                  {errors.farmType && (
                    <p className="text-sm text-red-600 mb-3" role="alert">
                      {errors.farmType}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {farmTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleInputChange("farmType", type.id)}
                      className={`
                        p-4 rounded-2xl border-2 transition-all duration-200 text-left
                        hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[var(--primary-accent2)]/20
                        ${
                          formData.farmType === type.id
                            ? "border-[var(--primary-accent2)] bg-[var(--primary-accent2)]/5"
                            : "border-[var(--secondary-soft-highlight)] hover:border-[var(--primary-base)]"
                        }
                      `}
                      aria-pressed={formData.farmType === type.id}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl mt-1">{type.icon}</span>
                        <div>
                          <div className="font-semibold text-[var(--secondary-black)] mb-1">
                            {type.label}
                          </div>
                          <div className="text-xs text-[var(--secondary-muted-edge)] leading-relaxed">
                            {type.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Farm Size */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--secondary-black)] mb-2">
                    Farm Size *
                  </label>
                  {errors.farmSize && (
                    <p className="text-sm text-red-600 mb-3" role="alert">
                      {errors.farmSize}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {farmSizes.map((size) => (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => handleInputChange("farmSize", size.id)}
                      className={`
                        farm-size-option
                        ${formData.farmSize === size.id ? "selected" : ""}
                      `}
                      aria-pressed={formData.farmSize === size.id}
                    >
                      <div className="farm-size-icon">{size.icon}</div>
                      <div className="font-semibold text-[var(--secondary-black)] text-sm">
                        {size.label}
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)]">
                        {size.range}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--secondary-black)] mb-2">
                    Certifications (Optional)
                  </label>
                  <p className="text-sm text-[var(--secondary-muted-edge)] mb-4">
                    Select any certifications your farm holds
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {certifications.map((cert) => (
                    <button
                      key={cert.id}
                      type="button"
                      onClick={() =>
                        handleArrayToggle("certifications", cert.id)
                      }
                      className={`
                        certification-badge
                        ${
                          formData.certifications.includes(cert.id)
                            ? "selected"
                            : ""
                        }
                      `}
                      aria-pressed={formData.certifications.includes(cert.id)}
                    >
                      <span className="mr-2">{cert.icon}</span>
                      {cert.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Farming Methods */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--secondary-black)] mb-2">
                    Farming Methods *
                  </label>
                  <p className="text-sm text-[var(--secondary-muted-edge)] mb-4">
                    Select all methods that apply to your operation
                  </p>
                  {errors.farmingMethods && (
                    <p className="text-sm text-red-600 mb-3" role="alert">
                      {errors.farmingMethods}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {farmingMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() =>
                        handleArrayToggle("farmingMethods", method.id)
                      }
                      className={`
                        p-4 rounded-2xl border-2 transition-all duration-200 text-left
                        hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[var(--primary-accent2)]/20
                        ${
                          formData.farmingMethods.includes(method.id)
                            ? "border-[var(--primary-accent2)] bg-[var(--primary-accent2)]/5"
                            : "border-[var(--secondary-soft-highlight)] hover:border-[var(--primary-base)]"
                        }
                      `}
                      aria-pressed={formData.farmingMethods.includes(method.id)}
                    >
                      <div className="font-semibold text-[var(--secondary-black)] mb-1">
                        {method.label}
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)] leading-relaxed">
                        {method.description}
                      </div>
                    </button>
                  ))}
                </div>
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
                      <span>Saving...</span>
                    </div>
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Visual Column */}
          <div className="space-y-6">
            {/* Guidance Text */}
            <div className="bg-[var(--primary-accent1)]/10 rounded-2xl p-6">
              <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                Why we ask this
              </h3>
              <p className="text-sm text-[var(--secondary-muted-edge)] leading-relaxed">
                This information helps buyers understand your farming practices,
                find products that match their needs, and build trust in your
                operation.
              </p>
            </div>

            {/* Farm Stats Preview */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[var(--secondary-black)]">
                Your Farm Profile Preview
              </h3>
              <div className="seller-card p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary-accent1)]/20 to-[var(--secondary-soft-highlight)]/30 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🚜</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[var(--secondary-black)]">
                        {formData.businessName || "Your Farm Name"}
                      </h4>
                      <p className="text-sm text-[var(--secondary-muted-edge)]">
                        {formData.location || "Your Location"}
                      </p>
                    </div>
                  </div>

                  {formData.farmType && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-[var(--secondary-muted-edge)]">
                        Type:
                      </span>
                      <span className="text-sm font-medium text-[var(--secondary-black)]">
                        {
                          farmTypes.find((t) => t.id === formData.farmType)
                            ?.label
                        }
                      </span>
                    </div>
                  )}

                  {formData.certifications.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.certifications.map((certId) => {
                        const cert = certifications.find(
                          (c) => c.id === certId
                        );
                        return cert ? (
                          <span
                            key={certId}
                            className="text-xs bg-[var(--primary-accent1)]/10 text-[var(--primary-accent3)] px-2 py-1 rounded-full"
                          >
                            {cert.icon} {cert.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
