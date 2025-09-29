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

interface SellerProductsStepProps {
  data: SellerOnboardingData;
  onNext: (data: Partial<SellerOnboardingData>) => void;
  onBack: () => void;
}

const productCategories = [
  {
    id: "fruits",
    label: "Fruits",
    icon: "🍎",
    examples: ["Apples", "Oranges", "Berries", "Stone Fruits"],
    description: "Fresh seasonal fruits and tree crops",
  },
  {
    id: "vegetables",
    label: "Vegetables",
    icon: "🥬",
    examples: ["Leafy Greens", "Root Vegetables", "Squash", "Peppers"],
    description: "Fresh vegetables and garden crops",
  },
  {
    id: "herbs",
    label: "Herbs & Spices",
    icon: "🌿",
    examples: ["Basil", "Cilantro", "Oregano", "Thyme"],
    description: "Culinary and medicinal herbs",
  },
  {
    id: "grains",
    label: "Grains & Legumes",
    icon: "🌾",
    examples: ["Wheat", "Corn", "Beans", "Lentils"],
    description: "Field crops and dried goods",
  },
  {
    id: "nuts",
    label: "Nuts & Seeds",
    icon: "🥜",
    examples: ["Almonds", "Walnuts", "Sunflower Seeds"],
    description: "Tree nuts and specialty seeds",
  },
  {
    id: "specialty",
    label: "Specialty Crops",
    icon: "🌸",
    examples: ["Flowers", "Mushrooms", "Microgreens"],
    description: "Unique and niche products",
  },
];

const seasons = [
  { id: "spring", label: "Spring", months: ["Mar", "Apr", "May"] },
  { id: "summer", label: "Summer", months: ["Jun", "Jul", "Aug"] },
  { id: "fall", label: "Fall", months: ["Sep", "Oct", "Nov"] },
  { id: "winter", label: "Winter", months: ["Dec", "Jan", "Feb"] },
];

export default function SellerProductsStep({
  data,
  onNext,
  onBack,
}: SellerProductsStepProps) {
  const [formData, setFormData] = useState({
    primaryProducts: data.primaryProducts || [],
    seasonalAvailability: data.seasonalAvailability || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProductToggle = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      primaryProducts: prev.primaryProducts.includes(productId)
        ? prev.primaryProducts.filter((id) => id !== productId)
        : [...prev.primaryProducts, productId],
    }));

    // Clear error when user selects products
    if (errors.primaryProducts) {
      setErrors((prev) => ({ ...prev, primaryProducts: "" }));
    }
  };

  const handleSeasonToggle = (seasonId: string) => {
    setFormData((prev) => ({
      ...prev,
      seasonalAvailability: prev.seasonalAvailability.includes(seasonId)
        ? prev.seasonalAvailability.filter((id) => id !== seasonId)
        : [...prev.seasonalAvailability, seasonId],
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.primaryProducts.length === 0) {
      newErrors.primaryProducts = "Please select at least one product category";
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
                What do you grow?
              </h1>
              <p className="text-lg text-[var(--secondary-muted-edge)] leading-relaxed">
                Tell buyers about your products and when they're available
                throughout the year.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Product Categories */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--secondary-black)] mb-2">
                    Primary Product Categories *
                  </label>
                  <p className="text-sm text-[var(--secondary-muted-edge)] mb-4">
                    Select all categories that represent your main products
                  </p>
                  {errors.primaryProducts && (
                    <p className="text-sm text-red-600 mb-3" role="alert">
                      {errors.primaryProducts}
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
                        product-category-card p-4 rounded-2xl border-2 transition-all duration-200 text-left
                        hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[var(--primary-accent2)]/20
                        ${
                          formData.primaryProducts.includes(category.id)
                            ? "selected border-[var(--primary-accent2)] bg-[var(--primary-accent2)]/5"
                            : "border-[var(--secondary-soft-highlight)] hover:border-[var(--primary-base)]"
                        }
                      `}
                      aria-pressed={formData.primaryProducts.includes(
                        category.id
                      )}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-3xl mt-1">{category.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-[var(--secondary-black)] mb-1">
                            {category.label}
                          </div>
                          <div className="text-xs text-[var(--secondary-muted-edge)] leading-relaxed mb-2">
                            {category.description}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {category.examples.slice(0, 3).map((example) => (
                              <span
                                key={example}
                                className="text-xs bg-[var(--secondary-soft-highlight)]/20 text-[var(--secondary-muted-edge)] px-2 py-1 rounded-full"
                              >
                                {example}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Seasonal Availability */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--secondary-black)] mb-2">
                    Seasonal Availability (Optional)
                  </label>
                  <p className="text-sm text-[var(--secondary-muted-edge)] mb-4">
                    When are your products typically available?
                  </p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {seasons.map((season) => (
                    <button
                      key={season.id}
                      type="button"
                      onClick={() => handleSeasonToggle(season.id)}
                      className={`
                        p-4 rounded-2xl border-2 transition-all duration-200 text-center
                        hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[var(--primary-accent2)]/20
                        ${
                          formData.seasonalAvailability.includes(season.id)
                            ? "border-[var(--primary-accent2)] bg-[var(--primary-accent2)]/5"
                            : "border-[var(--secondary-soft-highlight)] hover:border-[var(--primary-base)]"
                        }
                      `}
                      aria-pressed={formData.seasonalAvailability.includes(
                        season.id
                      )}
                    >
                      <div className="font-semibold text-[var(--secondary-black)] mb-2">
                        {season.label}
                      </div>
                      <div className="space-y-1">
                        {season.months.map((month) => (
                          <div
                            key={month}
                            className="text-xs text-[var(--secondary-muted-edge)]"
                          >
                            {month}
                          </div>
                        ))}
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
            {/* Product Preview */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[var(--secondary-black)]">
                Your Product Categories
              </h3>
              {formData.primaryProducts.length > 0 ? (
                <div className="space-y-3">
                  {formData.primaryProducts.map((productId) => {
                    const category = productCategories.find(
                      (c) => c.id === productId
                    );
                    return category ? (
                      <div key={productId} className="seller-card p-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{category.icon}</span>
                          <div>
                            <h4 className="font-semibold text-[var(--secondary-black)]">
                              {category.label}
                            </h4>
                            <p className="text-sm text-[var(--secondary-muted-edge)]">
                              {category.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              ) : (
                <div className="seller-card p-6 text-center">
                  <div className="w-16 h-16 bg-[var(--secondary-soft-highlight)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🌱</span>
                  </div>
                  <p className="text-sm text-[var(--secondary-muted-edge)]">
                    Select your product categories to see them here
                  </p>
                </div>
              )}
            </div>

            {/* Seasonal Calendar Preview */}
            {formData.seasonalAvailability.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-[var(--secondary-black)]">
                  Seasonal Availability
                </h3>
                <div className="seller-card p-4">
                  <div className="grid grid-cols-4 gap-2">
                    {seasons.map((season) => (
                      <div
                        key={season.id}
                        className={`
                          text-center p-2 rounded-lg
                          ${
                            formData.seasonalAvailability.includes(season.id)
                              ? "bg-[var(--primary-accent2)]/10 text-[var(--primary-accent2)]"
                              : "bg-[var(--secondary-soft-highlight)]/10 text-[var(--secondary-muted-edge)]"
                          }
                        `}
                      >
                        <div className="text-xs font-semibold">
                          {season.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-[var(--primary-accent1)]/10 rounded-2xl p-6">
              <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                Pro Tips
              </h3>
              <ul className="text-sm text-[var(--secondary-muted-edge)] space-y-2">
                <li>
                  • Select all categories that represent 20%+ of your production
                </li>
                <li>• Seasonal info helps buyers plan their purchasing</li>
                <li>• You can add specific products and varieties later</li>
                <li>• Consider specialty or value-added products</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
