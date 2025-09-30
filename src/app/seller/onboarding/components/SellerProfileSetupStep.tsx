"use client";

import { useState } from "react";
import Image from "next/image";

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
    phone: "",
    address: data.location || "",
    farmerIdPreview: "",
    farmLogoPreview: "",
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

  const handleFileChange = (
    field: "farmerIdPreview" | "farmLogoPreview",
    file?: File | null
  ) => {
    if (!file) {
      setFormData((prev) => ({ ...prev, [field]: "" }));
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, [field]: previewUrl }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Business address is required";
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

    onNext({ businessName: formData.businessName, location: formData.address });
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
                Help buyers learn who you are and how to reach you.
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
                    input w-full text-base py-3 px-5 rounded-full
                    ${
                      errors.businessName
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : ""
                    }
                  `}
                  style={{ borderRadius: 9999 }}
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

              {/* Phone Number */}
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-[var(--secondary-black)]"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="(XXX) XXX-XXXX"
                  className="input w-full text-base py-3 px-5 rounded-full"
                  style={{ borderRadius: 9999 }}
                />
              </div>

              {/* Farm Address */}
              <div className="space-y-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-semibold text-[var(--secondary-black)]"
                >
                  Farm Address *
                </label>
                <input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Street, City, Country"
                  className={`input w-full text-base py-3 px-5 rounded-full ${
                    errors.address
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  }`}
                  style={{ borderRadius: 9999 }}
                  aria-describedby={
                    errors.address ? "address-error" : undefined
                  }
                />
                {errors.address && (
                  <p
                    id="address-error"
                    className="text-sm text-red-600"
                    role="alert"
                  >
                    {errors.address}
                  </p>
                )}
              </div>

              {/* Uploads */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="seller-card p-4">
                  <label className="block text-sm font-semibold text-[var(--secondary-black)] mb-2">
                    Farmer's ID (Image)
                  </label>
                  <div className="flex items-center justify-center h-40 bg-[var(--secondary-soft-highlight)]/10 rounded-2xl overflow-hidden">
                    {formData.farmerIdPreview ? (
                      <Image
                        src={formData.farmerIdPreview}
                        alt="ID Preview"
                        width={300}
                        height={160}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-sm text-[var(--secondary-muted-edge)]">
                        Upload an image
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-3"
                    onChange={(e) =>
                      handleFileChange("farmerIdPreview", e.target.files?.[0])
                    }
                  />
                </div>

                <div className="seller-card p-4">
                  <label className="block text-sm font-semibold text-[var(--secondary-black)] mb-2">
                    Farm Logo
                  </label>
                  <div className="flex items-center justify-center h-40 bg-[var(--secondary-soft-highlight)]/10 rounded-2xl overflow-hidden">
                    {formData.farmLogoPreview ? (
                      <Image
                        src={formData.farmLogoPreview}
                        alt="Logo Preview"
                        width={300}
                        height={160}
                        className="object-contain w-full h-full p-6"
                      />
                    ) : (
                      <span className="text-sm text-[var(--secondary-muted-edge)]">
                        Upload a logo
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-3"
                    onChange={(e) =>
                      handleFileChange("farmLogoPreview", e.target.files?.[0])
                    }
                  />
                </div>
              </div>

              {/* Removed Farm Type, Size, Certifications, and Methods for simplified UI */}

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
            <div className="bg-[var(--primary-accent1)]/10 rounded-2xl p-6">
              <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                Location Preview
              </h3>
              <div className="rounded-2xl overflow-hidden border border-[var(--secondary-soft-highlight)]/40">
                <iframe
                  title="Farm location map"
                  className="w-full h-64"
                  loading="lazy"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    formData.address || "Farm"
                  )}&output=embed`}
                />
              </div>
              <p className="text-xs text-[var(--secondary-muted-edge)] mt-2">
                Enter your address to update the map preview.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="seller-card p-4 text-center">
                <div className="text-sm font-semibold mb-2">ID Preview</div>
                <div className="h-32 rounded-xl bg-[var(--secondary-soft-highlight)]/10 overflow-hidden flex items-center justify-center">
                  {formData.farmerIdPreview ? (
                    <Image
                      src={formData.farmerIdPreview}
                      alt="ID"
                      width={220}
                      height={120}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-xs text-[var(--secondary-muted-edge)]">
                      No image
                    </span>
                  )}
                </div>
              </div>
              <div className="seller-card p-4 text-center">
                <div className="text-sm font-semibold mb-2">Logo Preview</div>
                <div className="h-32 rounded-xl bg-[var(--secondary-soft-highlight)]/10 overflow-hidden flex items-center justify-center">
                  {formData.farmLogoPreview ? (
                    <Image
                      src={formData.farmLogoPreview}
                      alt="Logo"
                      width={220}
                      height={120}
                      className="object-contain w-full h-full p-4"
                    />
                  ) : (
                    <span className="text-xs text-[var(--secondary-muted-edge)]">
                      No logo
                    </span>
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
