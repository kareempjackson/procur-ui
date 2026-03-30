"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  GOV,
  govCard,
  govPageTitle,
  govPageSubtitle,
  govPillButton,
  govPrimaryButton,
  govHoverBg,
} from "../../styles";

/* ── Reusable inline-style fragments ────────────────────────────────────────── */

const inputStyle: React.CSSProperties = {
  border: "1px solid #ebe7df",
  borderRadius: 8,
  padding: "10px 14px",
  fontSize: 13,
  width: "100%",
  fontFamily: "inherit",
  outline: "none",
  color: "#1c2b23",
  background: "#fff",
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#1c2b23",
  marginBottom: 6,
  display: "block",
};

const sectionTitle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
  color: "#1c2b23",
  margin: 0,
};

const row2: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 20,
};

const row3: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: 20,
};

const vStack = (gap = 20): React.CSSProperties => ({
  display: "flex",
  flexDirection: "column",
  gap,
});

export default function NewVendorPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const totalSteps = 4;
  const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;

  /* ── Form state ────────────────────────────────────────────────────────────── */

  const [formData, setFormData] = useState({
    // Personal Details
    vendorName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    gpsLat: "",
    gpsLng: "",

    // Land Details
    totalAcreage: "",
    utilizedAcreage: "",

    // Farm Details
    crops: [] as string[],
    irrigation: false,
    rainwaterHarvesting: false,
    ponds: "",
    greenhouses: "",
    shadeHouses: "",
    transportation: "",

    // Programs
    programs: [] as string[],
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to API
    console.log("Form data:", formData);
    // Redirect to vendors list
    router.push("/government/vendors");
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  /* ── Step labels ───────────────────────────────────────────────────────────── */

  const steps = ["Personal", "Land", "Farm", "Programs"];

  /* ── Checkbox-row hover states ─────────────────────────────────────────────── */

  const [hoveredCheckbox, setHoveredCheckbox] = useState<string | null>(null);

  const checkboxRow = (
    name: string,
    label: string,
    checked: boolean,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  ) => (
    <label
      key={name}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        borderRadius: 8,
        border: "1px solid #ebe7df",
        cursor: "pointer",
        background: hoveredCheckbox === name ? govHoverBg : "#fff",
        transition: "background .15s",
      }}
      onMouseEnter={() => setHoveredCheckbox(name)}
      onMouseLeave={() => setHoveredCheckbox(null)}
    >
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        style={{ accentColor: GOV.brand, width: 16, height: 16 }}
      />
      <span style={{ fontSize: 13, color: "#1c2b23" }}>{label}</span>
    </label>
  );

  /* ── Render ────────────────────────────────────────────────────────────────── */

  return (
    <div style={{ minHeight: "100vh", background: GOV.bg, color: GOV.text }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* Back link */}
        <Link
          href="/government/vendors"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            color: GOV.muted,
            textDecoration: "none",
            marginBottom: 20,
          }}
        >
          <ArrowLeftIcon style={{ width: 14, height: 14 }} />
          Back to Vendors
        </Link>

        {/* Header card */}
        <div
          style={{
            ...govCard,
            padding: "28px 32px",
            marginBottom: 28,
          }}
        >
          <h1 style={govPageTitle}>Register New Vendor</h1>
          <p style={govPageSubtitle}>
            Complete the following steps to register a new agricultural vendor
          </p>

          {/* Progress bar */}
          <div style={{ marginTop: 22 }}>
            <div
              style={{
                position: "relative",
                height: 6,
                borderRadius: 99,
                background: "#ebe7df",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: `${progressPercent}%`,
                  background: GOV.brand,
                  borderRadius: 99,
                  transition: "width .3s ease",
                }}
              />
            </div>

            {/* Step labels */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                marginTop: 10,
              }}
            >
              {steps.map((s, i) => (
                <span
                  key={s}
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                    color: currentStep >= i + 1 ? GOV.brand : GOV.muted,
                    textAlign:
                      i === 0 ? "left" : i === steps.length - 1 ? "right" : "center",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ ...govCard, padding: 24 }}>
            {/* ── Step 1: Personal Details ─────────────────────────────────── */}
            {currentStep === 1 && (
              <div style={vStack(20)}>
                <h2 style={sectionTitle}>Personal &amp; Contact Details</h2>

                <div style={row2}>
                  <div>
                    <label htmlFor="vendorName" style={labelStyle}>
                      Vendor/Farm Name *
                    </label>
                    <input
                      type="text"
                      id="vendorName"
                      name="vendorName"
                      required
                      value={formData.vendorName}
                      onChange={handleInputChange}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label htmlFor="contactPerson" style={labelStyle}>
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      id="contactPerson"
                      name="contactPerson"
                      required
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" style={labelStyle}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" style={labelStyle}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" style={labelStyle}>
                    Farm Location/Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    required
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>

                <div style={row2}>
                  <div>
                    <label htmlFor="gpsLat" style={labelStyle}>
                      GPS Latitude *
                    </label>
                    <input
                      type="text"
                      id="gpsLat"
                      name="gpsLat"
                      required
                      placeholder="e.g., 18.0179"
                      value={formData.gpsLat}
                      onChange={handleInputChange}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label htmlFor="gpsLng" style={labelStyle}>
                      GPS Longitude *
                    </label>
                    <input
                      type="text"
                      id="gpsLng"
                      name="gpsLng"
                      required
                      placeholder="e.g., -76.8099"
                      value={formData.gpsLng}
                      onChange={handleInputChange}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 2: Land Details ─────────────────────────────────────── */}
            {currentStep === 2 && (
              <div style={vStack(20)}>
                <h2 style={sectionTitle}>Land Details</h2>

                <div style={row2}>
                  <div>
                    <label htmlFor="totalAcreage" style={labelStyle}>
                      Total Acreage *
                    </label>
                    <input
                      type="number"
                      id="totalAcreage"
                      name="totalAcreage"
                      required
                      min="0"
                      step="0.1"
                      value={formData.totalAcreage}
                      onChange={handleInputChange}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label htmlFor="utilizedAcreage" style={labelStyle}>
                      Currently Utilized Acreage *
                    </label>
                    <input
                      type="number"
                      id="utilizedAcreage"
                      name="utilizedAcreage"
                      required
                      min="0"
                      step="0.1"
                      value={formData.utilizedAcreage}
                      onChange={handleInputChange}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {formData.totalAcreage && formData.utilizedAcreage && (
                  <div
                    style={{
                      padding: "14px 18px",
                      borderRadius: 10,
                      background: GOV.brandLight,
                      border: "1px solid #ebe7df",
                    }}
                  >
                    <div style={{ fontSize: 13, color: "#1c2b23" }}>
                      Available acreage:{" "}
                      <span style={{ fontWeight: 700 }}>
                        {(
                          parseFloat(formData.totalAcreage) -
                          parseFloat(formData.utilizedAcreage)
                        ).toFixed(1)}{" "}
                        acres
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: GOV.muted,
                        marginTop: 4,
                      }}
                    >
                      {(
                        (parseFloat(formData.utilizedAcreage) /
                          parseFloat(formData.totalAcreage)) *
                        100
                      ).toFixed(1)}
                      % of land currently utilized
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Step 3: Farm Details ─────────────────────────────────────── */}
            {currentStep === 3 && (
              <div style={vStack(20)}>
                <h2 style={sectionTitle}>Farm Infrastructure &amp; Details</h2>

                <div>
                  <span style={labelStyle}>Infrastructure</span>
                  <div style={vStack(10)}>
                    {checkboxRow(
                      "irrigation",
                      "Irrigation System",
                      formData.irrigation,
                      handleInputChange
                    )}
                    {checkboxRow(
                      "rainwaterHarvesting",
                      "Rainwater Harvesting System",
                      formData.rainwaterHarvesting,
                      handleInputChange
                    )}
                  </div>
                </div>

                <div style={row3}>
                  <div>
                    <label htmlFor="ponds" style={labelStyle}>
                      Number of Ponds
                    </label>
                    <input
                      type="number"
                      id="ponds"
                      name="ponds"
                      min="0"
                      value={formData.ponds}
                      onChange={handleInputChange}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label htmlFor="greenhouses" style={labelStyle}>
                      Number of Greenhouses
                    </label>
                    <input
                      type="number"
                      id="greenhouses"
                      name="greenhouses"
                      min="0"
                      value={formData.greenhouses}
                      onChange={handleInputChange}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label htmlFor="shadeHouses" style={labelStyle}>
                      Number of Shade Houses
                    </label>
                    <input
                      type="number"
                      id="shadeHouses"
                      name="shadeHouses"
                      min="0"
                      value={formData.shadeHouses}
                      onChange={handleInputChange}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="transportation" style={labelStyle}>
                    Transportation Availability
                  </label>
                  <textarea
                    id="transportation"
                    name="transportation"
                    rows={2}
                    placeholder="e.g., 2 trucks, 1 van"
                    value={formData.transportation}
                    onChange={handleInputChange}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>
              </div>
            )}

            {/* ── Step 4: Programs ────────────────────────────────────────── */}
            {currentStep === 4 && (
              <div style={vStack(20)}>
                <div>
                  <h2 style={sectionTitle}>Government Programs (Optional)</h2>
                  <p
                    style={{
                      fontSize: 13,
                      color: GOV.muted,
                      marginTop: 6,
                    }}
                  >
                    Select which government incentive programs this vendor should
                    be enrolled in
                  </p>
                </div>

                <div style={vStack(10)}>
                  {[
                    "Irrigation Support Program",
                    "Organic Certification",
                    "Youth Farmer Initiative",
                    "Climate Smart Agriculture",
                    "Export Development Program",
                  ].map((program) => (
                    <label
                      key={program}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        padding: "14px 16px",
                        borderRadius: 8,
                        border: "1px solid #ebe7df",
                        cursor: "pointer",
                        background:
                          hoveredCheckbox === program ? govHoverBg : "#fff",
                        transition: "background .15s",
                      }}
                      onMouseEnter={() => setHoveredCheckbox(program)}
                      onMouseLeave={() => setHoveredCheckbox(null)}
                    >
                      <input
                        type="checkbox"
                        value={program}
                        checked={formData.programs.includes(program)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData((prev) => ({
                              ...prev,
                              programs: [...prev.programs, program],
                            }));
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              programs: prev.programs.filter(
                                (p) => p !== program
                              ),
                            }));
                          }
                        }}
                        style={{
                          accentColor: GOV.brand,
                          width: 16,
                          height: 16,
                          marginTop: 2,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#1c2b23",
                          }}
                        >
                          {program}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: GOV.muted,
                            marginTop: 4,
                          }}
                        >
                          Program description and benefits
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* ── Navigation Buttons ──────────────────────────────────────── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 28,
                paddingTop: 20,
                borderTop: "1px solid #ebe7df",
              }}
            >
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                onMouseEnter={() => setHoverPrev(true)}
                onMouseLeave={() => setHoverPrev(false)}
                style={{
                  ...govPillButton,
                  opacity: currentStep === 1 ? 0.45 : 1,
                  cursor: currentStep === 1 ? "not-allowed" : "pointer",
                  background:
                    hoverPrev && currentStep !== 1
                      ? govHoverBg
                      : govPillButton.background,
                }}
              >
                Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  onMouseEnter={() => setHoverNext(true)}
                  onMouseLeave={() => setHoverNext(false)}
                  style={{
                    ...govPrimaryButton,
                    background: hoverNext
                      ? GOV.accentHover
                      : govPrimaryButton.background,
                  }}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  onMouseEnter={() => setHoverNext(true)}
                  onMouseLeave={() => setHoverNext(false)}
                  style={{
                    ...govPrimaryButton,
                    background: hoverNext
                      ? GOV.accentHover
                      : govPrimaryButton.background,
                  }}
                >
                  Register Vendor
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
