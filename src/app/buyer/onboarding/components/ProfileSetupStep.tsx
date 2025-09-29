"use client";

import { useState } from "react";
import Image from "next/image";

interface OnboardingData {
  businessName: string;
  region: string;
  businessType: string;
  preferredProducts: string[];
  completedActions: string[];
}

interface ProfileSetupStepProps {
  data: OnboardingData;
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
}

const businessTypes = [
  { id: "restaurant", label: "Restaurant", icon: "🍽️" },
  { id: "hotel", label: "Hotel", icon: "🏨" },
  { id: "distributor", label: "Distributor", icon: "🚛" },
  { id: "retailer", label: "Retailer", icon: "🏪" },
];

const productCategories = [
  {
    id: "fruits",
    label: "Fruits",
    icon: "🍎",
    image: "/images/categories/fruits.jpg",
    description: "Fresh seasonal fruits from local and international farms",
  },
  {
    id: "vegetables",
    label: "Vegetables",
    icon: "🥬",
    image: "/images/categories/vegetables.jpg",
    description: "Farm-fresh vegetables, leafy greens, and root vegetables",
  },
  {
    id: "herbs",
    label: "Herbs & Spices",
    icon: "🌿",
    image: "/images/categories/herbs.jpg",
    description: "Aromatic herbs and premium spices for culinary excellence",
  },
  {
    id: "grains",
    label: "Grains & Legumes",
    icon: "🌾",
    image: "/images/categories/grains.jpg",
    description: "Organic grains, pulses, and specialty legumes",
  },
];

const regions = [
  "North America",
  "South America",
  "Europe",
  "Asia Pacific",
  "Middle East & Africa",
  "Global",
];

export default function ProfileSetupStep({
  data,
  onNext,
  onBack,
}: ProfileSetupStepProps) {
  const [formData, setFormData] = useState({
    businessName: data.businessName || "",
    region: data.region || "",
    businessType: data.businessType || "",
    preferredProducts: data.preferredProducts || [],
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

  const handleProductToggle = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredProducts: prev.preferredProducts.includes(productId)
        ? prev.preferredProducts.filter((id) => id !== productId)
        : [...prev.preferredProducts, productId],
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }
    if (!formData.region) {
      newErrors.region = "Please select your region";
    }
    if (!formData.businessType) {
      newErrors.businessType = "Please select your business type";
    }
    if (formData.preferredProducts.length === 0) {
      newErrors.preferredProducts =
        "Please select at least one product category";
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
                Tell us about your business
              </h1>
              <p className="text-lg text-[var(--secondary-muted-edge)] leading-relaxed">
                Help us personalize your sourcing experience and connect you
                with the right suppliers.
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
                  Business Name *
                </label>
                <input
                  id="businessName"
                  type="text"
                  value={formData.businessName}
                  onChange={(e) =>
                    handleInputChange("businessName", e.target.value)
                  }
                  placeholder="Enter your business name"
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

              {/* Region */}
              <div className="space-y-2">
                <label
                  htmlFor="region"
                  className="block text-sm font-semibold text-[var(--secondary-black)]"
                >
                  Primary Region *
                </label>
                <select
                  id="region"
                  value={formData.region}
                  onChange={(e) => handleInputChange("region", e.target.value)}
                  className={`
                    input w-full text-base py-3 px-4 appearance-none bg-white
                    ${
                      errors.region
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : ""
                    }
                  `}
                  aria-describedby={errors.region ? "region-error" : undefined}
                >
                  <option value="">Select your primary region</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                {errors.region && (
                  <p
                    id="region-error"
                    className="text-sm text-red-600"
                    role="alert"
                  >
                    {errors.region}
                  </p>
                )}
              </div>

              {/* Business Type */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--secondary-black)] mb-2">
                    Business Type *
                  </label>
                  {errors.businessType && (
                    <p className="text-sm text-red-600 mb-3" role="alert">
                      {errors.businessType}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {businessTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleInputChange("businessType", type.id)}
                      className={`
                        p-4 rounded-2xl border-2 transition-all duration-200
                        flex items-center space-x-3 text-left
                        hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[var(--primary-accent2)]/20
                        ${
                          formData.businessType === type.id
                            ? "border-[var(--primary-accent2)] bg-[var(--primary-accent2)]/5"
                            : "border-[var(--secondary-soft-highlight)] hover:border-[var(--primary-base)]"
                        }
                      `}
                      aria-pressed={formData.businessType === type.id}
                    >
                      <span className="text-2xl">{type.icon}</span>
                      <span className="font-medium text-[var(--secondary-black)]">
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Products */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--secondary-black)] mb-2">
                    Preferred Product Categories *
                  </label>
                  <p className="text-sm text-[var(--secondary-muted-edge)] mb-4">
                    Select all categories that interest you
                  </p>
                  {errors.preferredProducts && (
                    <p className="text-sm text-red-600 mb-3" role="alert">
                      {errors.preferredProducts}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {productCategories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleProductToggle(category.id)}
                      className={`
                        p-4 rounded-2xl border-2 transition-all duration-200 text-left
                        hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[var(--primary-accent2)]/20
                        ${
                          formData.preferredProducts.includes(category.id)
                            ? "border-[var(--primary-accent2)] bg-[var(--primary-accent2)]/5"
                            : "border-[var(--secondary-soft-highlight)] hover:border-[var(--primary-base)]"
                        }
                      `}
                      aria-pressed={formData.preferredProducts.includes(
                        category.id
                      )}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl mt-1">{category.icon}</span>
                        <div>
                          <div className="font-semibold text-[var(--secondary-black)] mb-1">
                            {category.label}
                          </div>
                          <div className="text-xs text-[var(--secondary-muted-edge)] leading-relaxed">
                            {category.description}
                          </div>
                        </div>
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
                This information helps us match you with the right farms and
                suppliers, show relevant products, and customize your
                marketplace experience.
              </p>
            </div>

            {/* Product Category Preview */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[var(--secondary-black)]">
                Popular Categories
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {productCategories.slice(0, 4).map((category) => (
                  <div
                    key={category.id}
                    className="relative aspect-square rounded-xl overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                    <div className="absolute bottom-3 left-3 z-20">
                      <div className="text-white font-semibold text-sm">
                        {category.label}
                      </div>
                    </div>
                    {/* Placeholder for category image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-accent1)]/20 to-[var(--secondary-soft-highlight)]/30" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
