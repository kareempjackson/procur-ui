"use client";

import { useState } from "react";

interface GovernmentOnboardingData {
  agencyName: string;
  agencyType: string;
  jurisdiction: string;
  contactInfo: {
    primaryContact: string;
    email: string;
    phone: string;
  };
  complianceRequirements: string[];
  procurementTypes: string[];
  budgetRange: string;
  reportingNeeds: string[];
  vendorRequirements: string[];
  completedActions: string[];
}

interface GovernmentProfileSetupStepProps {
  data: GovernmentOnboardingData;
  onNext: (data: Partial<GovernmentOnboardingData>) => void;
  onBack: () => void;
}

const agencyTypes = [
  {
    id: "federal",
    label: "Federal Agency",
    icon: "🏛️",
    description: "National government department or agency",
  },
  {
    id: "state",
    label: "State Government",
    icon: "🏢",
    description: "State-level government organization",
  },
  {
    id: "local",
    label: "Local Government",
    icon: "🏘️",
    description: "City, county, or municipal government",
  },
  {
    id: "education",
    label: "Educational Institution",
    icon: "🎓",
    description: "Public schools, universities, or districts",
  },
  {
    id: "healthcare",
    label: "Public Healthcare",
    icon: "🏥",
    description: "Public hospitals or health departments",
  },
  {
    id: "utility",
    label: "Public Utility",
    icon: "⚡",
    description: "Water, power, or transportation authority",
  },
];

const complianceRequirements = [
  { id: "far", label: "Federal Acquisition Regulation (FAR)", icon: "📋" },
  { id: "buy_american", label: "Buy American Act", icon: "🇺🇸" },
  { id: "davis_bacon", label: "Davis-Bacon Act", icon: "👷" },
  { id: "section_508", label: "Section 508 Accessibility", icon: "♿" },
  {
    id: "minority_business",
    label: "Minority Business Enterprise",
    icon: "🤝",
  },
  { id: "environmental", label: "Environmental Compliance", icon: "🌱" },
  { id: "security", label: "Security Clearance Required", icon: "🔒" },
  { id: "prevailing_wage", label: "Prevailing Wage Requirements", icon: "💰" },
];

const budgetRanges = [
  {
    id: "under_100k",
    label: "Under $100K",
    description: "Small purchases and contracts",
  },
  {
    id: "100k_1m",
    label: "$100K - $1M",
    description: "Medium-scale procurement",
  },
  {
    id: "1m_10m",
    label: "$1M - $10M",
    description: "Large contracts and projects",
  },
  {
    id: "over_10m",
    label: "Over $10M",
    description: "Major procurement programs",
  },
];

export default function GovernmentProfileSetupStep({
  data,
  onNext,
  onBack,
}: GovernmentProfileSetupStepProps) {
  const [formData, setFormData] = useState({
    agencyName: data.agencyName || "",
    agencyType: data.agencyType || "",
    jurisdiction: data.jurisdiction || "",
    contactInfo: {
      primaryContact: data.contactInfo?.primaryContact || "",
      email: data.contactInfo?.email || "",
      phone: data.contactInfo?.phone || "",
    },
    complianceRequirements: data.complianceRequirements || [],
    budgetRange: data.budgetRange || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }

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

    if (!formData.agencyName.trim()) {
      newErrors.agencyName = "Agency name is required";
    }
    if (!formData.agencyType) {
      newErrors.agencyType = "Please select your agency type";
    }
    if (!formData.jurisdiction.trim()) {
      newErrors.jurisdiction = "Jurisdiction is required";
    }
    if (!formData.contactInfo.primaryContact.trim()) {
      newErrors.primaryContact = "Primary contact name is required";
    }
    if (!formData.contactInfo.email.trim()) {
      newErrors.email = "Email address is required";
    }
    if (!formData.budgetRange) {
      newErrors.budgetRange = "Please select your typical budget range";
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
                Tell us about your agency
              </h1>
              <p className="text-lg text-[var(--secondary-muted-edge)] leading-relaxed">
                Help us configure the right procurement tools and compliance
                features for your organization.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Agency Name */}
              <div className="space-y-2">
                <label
                  htmlFor="agencyName"
                  className="block text-sm font-semibold text-[var(--secondary-black)]"
                >
                  Agency/Organization Name *
                </label>
                <input
                  id="agencyName"
                  type="text"
                  value={formData.agencyName}
                  onChange={(e) =>
                    handleInputChange("agencyName", e.target.value)
                  }
                  placeholder="Enter your agency or organization name"
                  className={`
                    input w-full text-base py-3 px-4
                    ${
                      errors.agencyName
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : ""
                    }
                  `}
                  aria-describedby={
                    errors.agencyName ? "agencyName-error" : undefined
                  }
                />
                {errors.agencyName && (
                  <p
                    id="agencyName-error"
                    className="text-sm text-red-600"
                    role="alert"
                  >
                    {errors.agencyName}
                  </p>
                )}
              </div>

              {/* Jurisdiction */}
              <div className="space-y-2">
                <label
                  htmlFor="jurisdiction"
                  className="block text-sm font-semibold text-[var(--secondary-black)]"
                >
                  Jurisdiction *
                </label>
                <input
                  id="jurisdiction"
                  type="text"
                  value={formData.jurisdiction}
                  onChange={(e) =>
                    handleInputChange("jurisdiction", e.target.value)
                  }
                  placeholder="City, State, Country or Federal"
                  className={`
                    input w-full text-base py-3 px-4
                    ${
                      errors.jurisdiction
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : ""
                    }
                  `}
                  aria-describedby={
                    errors.jurisdiction ? "jurisdiction-error" : undefined
                  }
                />
                {errors.jurisdiction && (
                  <p
                    id="jurisdiction-error"
                    className="text-sm text-red-600"
                    role="alert"
                  >
                    {errors.jurisdiction}
                  </p>
                )}
              </div>

              {/* Agency Type */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--secondary-black)] mb-2">
                    Agency Type *
                  </label>
                  {errors.agencyType && (
                    <p className="text-sm text-red-600 mb-3" role="alert">
                      {errors.agencyType}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {agencyTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleInputChange("agencyType", type.id)}
                      className={`
                        agency-type-card
                        ${formData.agencyType === type.id ? "selected" : ""}
                      `}
                      aria-pressed={formData.agencyType === type.id}
                    >
                      <div className="agency-type-icon">{type.icon}</div>
                      <div className="font-semibold text-[var(--secondary-black)] mb-2">
                        {type.label}
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)] leading-relaxed">
                        {type.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[var(--secondary-black)]">
                  Primary Contact Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="primaryContact"
                      className="block text-sm font-semibold text-[var(--secondary-black)]"
                    >
                      Contact Name *
                    </label>
                    <input
                      id="primaryContact"
                      type="text"
                      value={formData.contactInfo.primaryContact}
                      onChange={(e) =>
                        handleInputChange(
                          "contactInfo.primaryContact",
                          e.target.value
                        )
                      }
                      placeholder="Full name"
                      className={`
                        input w-full text-base py-3 px-4
                        ${
                          errors.primaryContact
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                            : ""
                        }
                      `}
                    />
                    {errors.primaryContact && (
                      <p className="text-sm text-red-600" role="alert">
                        {errors.primaryContact}
                      </p>
                    )}
                  </div>

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
                      value={formData.contactInfo.phone}
                      onChange={(e) =>
                        handleInputChange("contactInfo.phone", e.target.value)
                      }
                      placeholder="(555) 123-4567"
                      className="input w-full text-base py-3 px-4"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-[var(--secondary-black)]"
                  >
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) =>
                      handleInputChange("contactInfo.email", e.target.value)
                    }
                    placeholder="contact@agency.gov"
                    className={`
                      input w-full text-base py-3 px-4
                      ${
                        errors.email
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : ""
                      }
                    `}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Budget Range */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--secondary-black)] mb-2">
                    Typical Annual Procurement Budget *
                  </label>
                  {errors.budgetRange && (
                    <p className="text-sm text-red-600 mb-3" role="alert">
                      {errors.budgetRange}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {budgetRanges.map((range) => (
                    <button
                      key={range.id}
                      type="button"
                      onClick={() => handleInputChange("budgetRange", range.id)}
                      className={`
                        p-4 rounded-2xl border-2 transition-all duration-200 text-left
                        hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[var(--secondary-muted-edge)]/20
                        ${
                          formData.budgetRange === range.id
                            ? "border-[var(--secondary-muted-edge)] bg-[var(--secondary-muted-edge)]/5"
                            : "border-[var(--secondary-soft-highlight)] hover:border-[var(--secondary-muted-edge)]"
                        }
                      `}
                      aria-pressed={formData.budgetRange === range.id}
                    >
                      <div className="font-semibold text-[var(--secondary-black)] mb-1">
                        {range.label}
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)] leading-relaxed">
                        {range.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Compliance Requirements */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--secondary-black)] mb-2">
                    Compliance Requirements (Optional)
                  </label>
                  <p className="text-sm text-[var(--secondary-muted-edge)] mb-4">
                    Select any compliance requirements that apply to your
                    procurement
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {complianceRequirements.map((req) => (
                    <button
                      key={req.id}
                      type="button"
                      onClick={() =>
                        handleArrayToggle("complianceRequirements", req.id)
                      }
                      className={`
                        compliance-badge
                        ${
                          formData.complianceRequirements.includes(req.id)
                            ? "selected"
                            : ""
                        }
                      `}
                      aria-pressed={formData.complianceRequirements.includes(
                        req.id
                      )}
                    >
                      <span className="mr-2">{req.icon}</span>
                      {req.label}
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
                    btn text-base px-8 py-3 min-w-[140px] order-1 sm:order-2
                    bg-[var(--secondary-muted-edge)] text-white
                    hover:bg-[var(--secondary-black)]
                    transition-all duration-300 ease-out
                    hover:shadow-lg hover:shadow-[var(--secondary-muted-edge)]/20
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
            <div className="bg-[var(--secondary-muted-edge)]/10 rounded-2xl p-6">
              <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                Why we ask this
              </h3>
              <p className="text-sm text-[var(--secondary-muted-edge)] leading-relaxed">
                This information helps us configure the right compliance tools,
                reporting features, and procurement workflows for your specific
                government requirements.
              </p>
            </div>

            {/* Agency Profile Preview */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[var(--secondary-black)]">
                Your Agency Profile Preview
              </h3>
              <div className="government-card p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[var(--secondary-muted-edge)]/20 to-[var(--secondary-soft-highlight)]/30 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🏛️</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[var(--secondary-black)]">
                        {formData.agencyName || "Your Agency Name"}
                      </h4>
                      <p className="text-sm text-[var(--secondary-muted-edge)]">
                        {formData.jurisdiction || "Your Jurisdiction"}
                      </p>
                    </div>
                  </div>

                  {formData.agencyType && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-[var(--secondary-muted-edge)]">
                        Type:
                      </span>
                      <span className="text-sm font-medium text-[var(--secondary-black)]">
                        {
                          agencyTypes.find((t) => t.id === formData.agencyType)
                            ?.label
                        }
                      </span>
                    </div>
                  )}

                  {formData.complianceRequirements.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.complianceRequirements.map((reqId) => {
                        const req = complianceRequirements.find(
                          (r) => r.id === reqId
                        );
                        return req ? (
                          <span
                            key={reqId}
                            className="text-xs bg-[var(--secondary-muted-edge)]/10 text-[var(--secondary-black)] px-2 py-1 rounded-full"
                          >
                            {req.icon} {req.label}
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
