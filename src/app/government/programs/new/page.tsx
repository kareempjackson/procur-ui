"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftIcon,
  PlusIcon,
  MinusIcon,
  InformationCircleIcon,
  BanknotesIcon,
  CalendarIcon,
  CheckCircleIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch } from "@/store";
import { createProgram } from "@/store/slices/governmentProgramsSlice";
import {
  GOV,
  govCard,
  govPageTitle,
  govPageSubtitle,
  govPillButton,
  govPrimaryButton,
  govHoverBg,
} from "../../styles";

type ProgramStatus = "active" | "planning" | "completed" | "suspended";

/* ── Reusable inline style fragments ──────────────────────────────────────── */

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#1c2b23",
  marginBottom: 6,
  display: "block",
};

const inputStyle: React.CSSProperties = {
  border: "1px solid #ebe7df",
  borderRadius: 8,
  padding: "10px 14px",
  fontSize: 13,
  width: "100%",
  fontFamily: "inherit",
  outline: "none",
  background: "#fff",
  color: "#1c2b23",
  boxSizing: "border-box",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: "none",
  cursor: "pointer",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238a9e92'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  backgroundSize: "1.1em 1.1em",
  paddingRight: "2.5rem",
};

const sectionIconStyle = (bg: string): React.CSSProperties => ({
  width: 32,
  height: 32,
  borderRadius: 8,
  background: bg,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
});

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: "#1c2b23",
  margin: 0,
};

const requiredStar: React.CSSProperties = {
  color: GOV.accent,
  marginLeft: 2,
};

/* ── Component ────────────────────────────────────────────────────────────── */

export default function NewProgramPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    status: "planning" as ProgramStatus,
    budget: "",
    target_participants: "",
    start_date: "",
    end_date: "",
  });

  const [benefits, setBenefits] = useState<string[]>([""]);
  const [eligibility, setEligibility] = useState<string[]>([""]);

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle benefits changes
  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    setBenefits(newBenefits);
  };

  const addBenefit = () => {
    setBenefits([...benefits, ""]);
  };

  const removeBenefit = (index: number) => {
    if (benefits.length > 1) {
      setBenefits(benefits.filter((_, i) => i !== index));
    }
  };

  // Handle eligibility changes
  const handleEligibilityChange = (index: number, value: string) => {
    const newEligibility = [...eligibility];
    newEligibility[index] = value;
    setEligibility(newEligibility);
  };

  const addEligibility = () => {
    setEligibility([...eligibility, ""]);
  };

  const removeEligibility = (index: number) => {
    if (eligibility.length > 1) {
      setEligibility(eligibility.filter((_, i) => i !== index));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Filter out empty benefits and eligibility
      const filteredBenefits = benefits.filter((b) => b.trim() !== "");
      const filteredEligibility = eligibility.filter((e) => e.trim() !== "");

      // Validate required fields
      if (!formData.name || !formData.description || !formData.category) {
        throw new Error("Please fill in all required fields");
      }

      if (!formData.start_date || !formData.end_date) {
        throw new Error("Please specify program start and end dates");
      }

      const programData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        status: formData.status,
        budget: parseFloat(formData.budget) || 0,
        budget_used: 0,
        budget_percentage: 0,
        target_participants: parseInt(formData.target_participants) || 0,
        participants: 0,
        start_date: formData.start_date,
        end_date: formData.end_date,
        benefits: filteredBenefits,
        eligibility: filteredEligibility,
        performance: "pending" as const,
      };

      await dispatch(createProgram(programData)).unwrap();

      // Navigate back to programs list
      router.push("/government/programs?created=success");
    } catch (err: any) {
      console.error("Failed to create program:", err);
      setError(err.message || "Failed to create program. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: GOV.bg, color: GOV.text }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <Link
            href="/government/programs"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              fontWeight: 600,
              color: GOV.accent,
              textDecoration: "none",
              marginBottom: 20,
            }}
          >
            <ArrowLeftIcon style={{ width: 14, height: 14 }} />
            Back to Programs
          </Link>

          <h1 style={govPageTitle}>Create New Program</h1>
          <p style={govPageSubtitle}>
            Set up a new government assistance program for farmers
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              ...govCard,
              padding: 16,
              marginBottom: 24,
              border: `1px solid ${GOV.dangerBg}`,
              background: GOV.dangerBg,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div
                style={{
                  ...sectionIconStyle(GOV.danger),
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                }}
              >
                <InformationCircleIcon style={{ width: 16, height: 16, color: "#fff" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: GOV.danger,
                    margin: "0 0 2px",
                  }}
                >
                  Error Creating Program
                </p>
                <p style={{ fontSize: 12, color: GOV.danger, margin: 0, opacity: 0.85 }}>
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* ── Basic Information ───────────────────────────────────────── */}
            <div style={{ ...govCard, padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={sectionIconStyle(GOV.brand)}>
                  <InformationCircleIcon style={{ width: 16, height: 16, color: "#fff" }} />
                </div>
                <h2 style={sectionTitleStyle}>Basic Information</h2>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Program Name */}
                <div>
                  <label htmlFor="name" style={labelStyle}>
                    Program Name <span style={requiredStar}>*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Irrigation Support Program"
                    style={inputStyle}
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" style={labelStyle}>
                    Description <span style={requiredStar}>*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Brief description of the program's purpose and goals"
                    style={{ ...inputStyle, resize: "none" }}
                  />
                </div>

                {/* Category and Status */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  <div>
                    <label htmlFor="category" style={labelStyle}>
                      Category <span style={requiredStar}>*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      style={selectStyle}
                    >
                      <option value="">Select a category</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Certification">Certification</option>
                      <option value="Financial Aid">Financial Aid</option>
                      <option value="Training & Education">Training &amp; Education</option>
                      <option value="Equipment">Equipment</option>
                      <option value="Market Access">Market Access</option>
                      <option value="Technology">Technology</option>
                      <option value="Environmental">Environmental</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="status" style={labelStyle}>
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      style={selectStyle}
                    >
                      <option value="planning">Planning</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Budget & Targets ───────────────────────────────────────── */}
            <div style={{ ...govCard, padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={sectionIconStyle(GOV.success)}>
                  <BanknotesIcon style={{ width: 16, height: 16, color: "#fff" }} />
                </div>
                <h2 style={sectionTitleStyle}>Budget &amp; Targets</h2>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                {/* Budget */}
                <div>
                  <label htmlFor="budget" style={labelStyle}>
                    Total Budget ($)
                  </label>
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    min="0"
                    step="1000"
                    placeholder="e.g., 500000"
                    style={inputStyle}
                  />
                </div>

                {/* Target Participants */}
                <div>
                  <label htmlFor="target_participants" style={labelStyle}>
                    Target Participants
                  </label>
                  <input
                    type="number"
                    id="target_participants"
                    name="target_participants"
                    value={formData.target_participants}
                    onChange={handleChange}
                    min="0"
                    placeholder="e.g., 300"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* ── Program Timeline ───────────────────────────────────────── */}
            <div style={{ ...govCard, padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={sectionIconStyle(GOV.info)}>
                  <CalendarIcon style={{ width: 16, height: 16, color: "#fff" }} />
                </div>
                <h2 style={sectionTitleStyle}>Program Timeline</h2>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                {/* Start Date */}
                <div>
                  <label htmlFor="start_date" style={labelStyle}>
                    Start Date <span style={requiredStar}>*</span>
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                </div>

                {/* End Date */}
                <div>
                  <label htmlFor="end_date" style={labelStyle}>
                    End Date <span style={requiredStar}>*</span>
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    required
                    min={formData.start_date}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* ── Program Benefits ───────────────────────────────────────── */}
            <div style={{ ...govCard, padding: 24 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={sectionIconStyle(GOV.accent)}>
                    <CheckCircleIcon style={{ width: 16, height: 16, color: "#fff" }} />
                  </div>
                  <h2 style={sectionTitleStyle}>Program Benefits</h2>
                </div>
                <button
                  type="button"
                  onClick={addBenefit}
                  style={govPillButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = govHoverBg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = GOV.cardBg;
                  }}
                >
                  <PlusIcon style={{ width: 14, height: 14 }} />
                  Add Benefit
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => handleBenefitChange(index, e.target.value)}
                      placeholder="e.g., Up to $5,000 per farm"
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    {benefits.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBenefit(index)}
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 8,
                          border: `1px solid ${GOV.dangerBg}`,
                          background: GOV.dangerBg,
                          color: GOV.danger,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          flexShrink: 0,
                        }}
                      >
                        <MinusIcon style={{ width: 16, height: 16 }} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Eligibility Requirements ───────────────────────────────── */}
            <div style={{ ...govCard, padding: 24 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={sectionIconStyle(GOV.warning)}>
                    <DocumentCheckIcon style={{ width: 16, height: 16, color: "#fff" }} />
                  </div>
                  <h2 style={sectionTitleStyle}>Eligibility Requirements</h2>
                </div>
                <button
                  type="button"
                  onClick={addEligibility}
                  style={govPillButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = govHoverBg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = GOV.cardBg;
                  }}
                >
                  <PlusIcon style={{ width: 14, height: 14 }} />
                  Add Requirement
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {eligibility.map((requirement, index) => (
                  <div
                    key={index}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <input
                      type="text"
                      value={requirement}
                      onChange={(e) =>
                        handleEligibilityChange(index, e.target.value)
                      }
                      placeholder="e.g., Minimum 10 acres of cultivated land"
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    {eligibility.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEligibility(index)}
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 8,
                          border: `1px solid ${GOV.dangerBg}`,
                          background: GOV.dangerBg,
                          color: GOV.danger,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          flexShrink: 0,
                        }}
                      >
                        <MinusIcon style={{ width: 16, height: 16 }} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Form Actions ───────────────────────────────────────────── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 12,
                paddingTop: 12,
              }}
            >
              <Link
                href="/government/programs"
                style={govPillButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = govHoverBg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = GOV.cardBg;
                }}
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  ...govPrimaryButton,
                  opacity: isSubmitting ? 0.55 : 1,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) e.currentTarget.style.background = GOV.accentHover;
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) e.currentTarget.style.background = GOV.accent;
                }}
              >
                {isSubmitting && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 14,
                      height: 14,
                      border: "2px solid rgba(255,255,255,.3)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "spin 0.6s linear infinite",
                    }}
                  />
                )}
                {isSubmitting ? "Creating Program..." : "Create Program"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
