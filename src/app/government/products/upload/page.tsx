"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeftIcon,
  PhotoIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import { governmentApi } from "@/lib/api/governmentApi";
import {
  fetchVendors,
  selectVendors,
  selectVendorsStatus,
} from "@/store/slices/governmentVendorsSlice";
import {
  GOV,
  govCard,
  govPageTitle,
  govPageSubtitle,
  govPillButton,
  govPrimaryButton,
  govHoverBg,
} from "../../styles";

/* ── Shared inline-style constants ──────────────────────────────────────────── */

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 700,
  color: "#1c2b23",
  marginBottom: 6,
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
  boxSizing: "border-box" as const,
};

const sectionHeading: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 800,
  color: "#1c2b23",
  margin: "0 0 16px",
};

/* ── Page ────────────────────────────────────────────────────────────────────── */

export default function ProductUploadPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedVendorId = searchParams.get("vendorId");

  const dispatch = useAppDispatch();
  const vendorsFromStore = useAppSelector(selectVendors);
  const vendorsStatus = useAppSelector(selectVendorsStatus);

  const [formData, setFormData] = useState({
    vendorId: preselectedVendorId || "",
    cropType: "",
    variety: "",
    quantity: "",
    unit: "kg",
    qualityGrade: "",
    harvestDate: "",
    storageLocation: "",
    pricing: "",
    certifications: [] as string[],
    reason: "",
    notes: "",
    images: [] as File[],
  });

  const [hoveredCert, setHoveredCert] = useState<string | null>(null);
  const [hoveredCancel, setHoveredCancel] = useState(false);
  const [hoveredSubmit, setHoveredSubmit] = useState(false);
  const [hoveredUploadZone, setHoveredUploadZone] = useState(false);
  const [hoveredImageIdx, setHoveredImageIdx] = useState<number | null>(null);

  // Fetch vendors on mount if not already loaded
  useEffect(() => {
    if (vendorsStatus === "idle") {
      dispatch(fetchVendors({ page: 1, limit: 100 }));
    }
  }, [vendorsStatus, dispatch]);

  // Fallback mock list only when store is empty and still loading/failed
  const fallbackVendors = useMemo(
    () => [
      { id: "1", name: "Green Valley Farms" },
      { id: "2", name: "Sunrise Agricultural Co." },
      { id: "3", name: "Highland Produce Ltd." },
      { id: "4", name: "Coastal Farms Group" },
      { id: "5", name: "Mountain Fresh Produce" },
    ],
    []
  );

  const vendors =
    vendorsFromStore.length > 0 ? vendorsFromStore : fallbackVendors;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.vendorId) return;

      // Map form fields to backend payload
      const payload = {
        name: formData.cropType || undefined,
        description: formData.notes || undefined,
        category: "Agriculture",
        base_price:
          formData.pricing && !isNaN(Number(formData.pricing))
            ? Number(formData.pricing)
            : undefined,
        stock_quantity:
          formData.quantity && !isNaN(Number(formData.quantity))
            ? Number(formData.quantity)
            : undefined,
        unit_of_measurement: formData.unit,
        certifications: formData.certifications,
      } as any;

      await governmentApi.createFarmerProduct(formData.vendorId, payload);

      router.push(`/government/vendors/${formData.vendorId}?tab=products`);
    } catch (err) {
      console.error("Failed to upload product:", err);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: GOV.bg, color: GOV.text }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* Back Button */}
        <Link
          href={
            preselectedVendorId
              ? `/government/vendors/${preselectedVendorId}`
              : "/government/vendors"
          }
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            color: GOV.muted,
            textDecoration: "none",
            marginBottom: 24,
          }}
        >
          <ArrowLeftIcon style={{ width: 16, height: 16 }} />
          Back
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={govPageTitle}>Upload Product for Vendor</h1>
          <p style={govPageSubtitle}>
            List a product on behalf of a vendor who lacks internet access or
            requires assistance
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Vendor Selection */}
            <div style={{ ...govCard, padding: 24 }}>
              <h2 style={sectionHeading}>Select Vendor</h2>
              <div>
                <label htmlFor="vendorId" style={labelStyle}>
                  Vendor *
                </label>
                <select
                  id="vendorId"
                  name="vendorId"
                  required
                  value={formData.vendorId}
                  onChange={handleInputChange}
                  style={inputStyle}
                >
                  <option value="">Select a vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product Details */}
            <div style={{ ...govCard, padding: 24 }}>
              <h2 style={sectionHeading}>Product Details</h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 20,
                }}
              >
                {/* Crop Type */}
                <div>
                  <label htmlFor="cropType" style={labelStyle}>
                    Crop Type *
                  </label>
                  <select
                    id="cropType"
                    name="cropType"
                    required
                    value={formData.cropType}
                    onChange={handleInputChange}
                    style={inputStyle}
                  >
                    <option value="">Select crop type</option>
                    <option value="tomatoes">Tomatoes</option>
                    <option value="lettuce">Lettuce</option>
                    <option value="peppers">Peppers</option>
                    <option value="carrots">Carrots</option>
                    <option value="cabbage">Cabbage</option>
                    <option value="bananas">Bananas</option>
                    <option value="plantains">Plantains</option>
                    <option value="yams">Yams</option>
                  </select>
                </div>

                {/* Variety */}
                <div>
                  <label htmlFor="variety" style={labelStyle}>
                    Variety *
                  </label>
                  <input
                    type="text"
                    id="variety"
                    name="variety"
                    required
                    placeholder="e.g., Roma, Cherry, Iceberg"
                    value={formData.variety}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label htmlFor="quantity" style={labelStyle}>
                    Quantity Available *
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    required
                    min="0"
                    step="0.1"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </div>

                {/* Unit */}
                <div>
                  <label htmlFor="unit" style={labelStyle}>
                    Unit *
                  </label>
                  <select
                    id="unit"
                    name="unit"
                    required
                    value={formData.unit}
                    onChange={handleInputChange}
                    style={inputStyle}
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="lbs">Pounds (lbs)</option>
                    <option value="tons">Tons</option>
                    <option value="units">Units</option>
                    <option value="boxes">Boxes</option>
                  </select>
                </div>

                {/* Quality Grade */}
                <div>
                  <label htmlFor="qualityGrade" style={labelStyle}>
                    Quality Grade *
                  </label>
                  <select
                    id="qualityGrade"
                    name="qualityGrade"
                    required
                    value={formData.qualityGrade}
                    onChange={handleInputChange}
                    style={inputStyle}
                  >
                    <option value="">Select grade</option>
                    <option value="premium">Premium</option>
                    <option value="grade-a">Grade A</option>
                    <option value="grade-b">Grade B</option>
                    <option value="organic">Organic Certified</option>
                  </select>
                </div>

                {/* Harvest Date */}
                <div>
                  <label htmlFor="harvestDate" style={labelStyle}>
                    Harvest Date *
                  </label>
                  <input
                    type="date"
                    id="harvestDate"
                    name="harvestDate"
                    required
                    value={formData.harvestDate}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </div>

                {/* Storage Location */}
                <div>
                  <label htmlFor="storageLocation" style={labelStyle}>
                    Storage Location *
                  </label>
                  <input
                    type="text"
                    id="storageLocation"
                    name="storageLocation"
                    required
                    placeholder="e.g., Cold storage, Warehouse A"
                    value={formData.storageLocation}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </div>

                {/* Pricing */}
                <div>
                  <label htmlFor="pricing" style={labelStyle}>
                    Pricing (per unit)
                  </label>
                  <input
                    type="text"
                    id="pricing"
                    name="pricing"
                    placeholder="e.g., $2.50/kg"
                    value={formData.pricing}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Certifications */}
              <div style={{ marginTop: 24 }}>
                <label style={labelStyle}>
                  Certifications (if applicable)
                </label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: 10,
                  }}
                >
                  {[
                    "Organic Certified",
                    "GlobalGAP",
                    "Fair Trade",
                    "Rainforest Alliance",
                  ].map((cert) => (
                    <label
                      key={cert}
                      onMouseEnter={() => setHoveredCert(cert)}
                      onMouseLeave={() => setHoveredCert(null)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 14px",
                        borderRadius: 8,
                        border: `1px solid ${GOV.border}`,
                        cursor: "pointer",
                        background:
                          hoveredCert === cert ? govHoverBg : GOV.cardBg,
                        transition: "background .15s",
                      }}
                    >
                      <input
                        type="checkbox"
                        value={cert}
                        checked={formData.certifications.includes(cert)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData((prev) => ({
                              ...prev,
                              certifications: [...prev.certifications, cert],
                            }));
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              certifications: prev.certifications.filter(
                                (c) => c !== cert
                              ),
                            }));
                          }
                        }}
                        style={{ width: 16, height: 16, accentColor: GOV.accent }}
                      />
                      <span style={{ fontSize: 13, color: "#1c2b23" }}>
                        {cert}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Images */}
            <div style={{ ...govCard, padding: 24 }}>
              <h2 style={sectionHeading}>Product Images</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Upload Zone */}
                <label
                  onMouseEnter={() => setHoveredUploadZone(true)}
                  onMouseLeave={() => setHoveredUploadZone(false)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    border: "2px dashed #ebe7df",
                    borderRadius: 10,
                    padding: 32,
                    textAlign: "center" as const,
                    cursor: "pointer",
                    background: hoveredUploadZone ? govHoverBg : "transparent",
                    transition: "background .15s",
                  }}
                >
                  <PhotoIcon
                    style={{
                      width: 40,
                      height: 40,
                      color: "#8a9e92",
                      marginBottom: 8,
                    }}
                  />
                  <p style={{ fontSize: 13, color: "#8a9e92", margin: 0 }}>
                    Click to upload images
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: "#8a9e92",
                      marginTop: 4,
                      margin: "4px 0 0",
                    }}
                  >
                    PNG, JPG up to 10MB
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                </label>

                {/* Image Preview */}
                {formData.images.length > 0 && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 16,
                    }}
                  >
                    {formData.images.map((image, index) => (
                      <div
                        key={index}
                        style={{ position: "relative" }}
                        onMouseEnter={() => setHoveredImageIdx(index)}
                        onMouseLeave={() => setHoveredImageIdx(null)}
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: "100%",
                            height: 128,
                            objectFit: "cover",
                            borderRadius: 10,
                            border: `1px solid ${GOV.border}`,
                            display: "block",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            width: 24,
                            height: 24,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                            background: "#991b1b",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                            opacity: hoveredImageIdx === index ? 1 : 0,
                            transition: "opacity .15s",
                            padding: 0,
                          }}
                        >
                          <XMarkIcon style={{ width: 14, height: 14 }} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Reason & Notes */}
            <div style={{ ...govCard, padding: 24 }}>
              <h2 style={sectionHeading}>Additional Information</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label htmlFor="reason" style={labelStyle}>
                    Reason for Government Upload *
                  </label>
                  <select
                    id="reason"
                    name="reason"
                    required
                    value={formData.reason}
                    onChange={handleInputChange}
                    style={inputStyle}
                  >
                    <option value="">Select reason</option>
                    <option value="no-internet">
                      Vendor lacks internet access
                    </option>
                    <option value="technical-assistance">
                      Technical assistance required
                    </option>
                    <option value="emergency">Emergency listing</option>
                    <option value="program-support">
                      Program support initiative
                    </option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="notes" style={labelStyle}>
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    placeholder="Any additional information about this product..."
                    value={formData.notes}
                    onChange={handleInputChange}
                    style={{
                      ...inputStyle,
                      resize: "vertical" as const,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <Link
                href={
                  preselectedVendorId
                    ? `/government/vendors/${preselectedVendorId}`
                    : "/government/vendors"
                }
                onMouseEnter={() => setHoveredCancel(true)}
                onMouseLeave={() => setHoveredCancel(false)}
                style={{
                  ...govPillButton,
                  background: hoveredCancel ? govHoverBg : GOV.cardBg,
                  transition: "background .15s",
                }}
              >
                Cancel
              </Link>

              <button
                type="submit"
                onMouseEnter={() => setHoveredSubmit(true)}
                onMouseLeave={() => setHoveredSubmit(false)}
                style={{
                  ...govPrimaryButton,
                  background: hoveredSubmit ? GOV.accentHover : GOV.accent,
                  transition: "background .15s",
                }}
              >
                <PlusIcon style={{ width: 18, height: 18 }} />
                Upload Product
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
