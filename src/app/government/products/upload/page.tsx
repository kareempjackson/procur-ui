"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeftIcon,
  PhotoIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function ProductUploadPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedVendorId = searchParams.get("vendorId");

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

  // Mock vendor data
  const vendors = [
    { id: "1", name: "Green Valley Farms" },
    { id: "2", name: "Sunrise Agricultural Co." },
    { id: "3", name: "Highland Produce Ltd." },
    { id: "4", name: "Coastal Farms Group" },
    { id: "5", name: "Mountain Fresh Produce" },
  ];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to API
    console.log("Upload data:", formData);
    // Redirect back to vendor detail or products page
    if (formData.vendorId) {
      router.push(`/government/vendors/${formData.vendorId}?tab=products`);
    } else {
      router.push("/government/products");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Back Button */}
        <Link
          href={
            preselectedVendorId
              ? `/government/vendors/${preselectedVendorId}`
              : "/government/vendors"
          }
          className="inline-flex items-center gap-2 text-sm text-[color:var(--secondary-muted-edge)] hover:text-[color:var(--secondary-black)] mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[color:var(--secondary-black)]">
            Upload Product for Vendor
          </h1>
          <p className="text-sm text-[color:var(--secondary-muted-edge)] mt-1">
            List a product on behalf of a vendor who lacks internet access or
            requires assistance
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Vendor Selection */}
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
              <h2 className="text-lg font-semibold text-[color:var(--secondary-black)] mb-4">
                Select Vendor
              </h2>
              <div>
                <label
                  htmlFor="vendorId"
                  className="block text-sm font-medium text-[color:var(--secondary-black)] mb-2"
                >
                  Vendor *
                </label>
                <select
                  id="vendorId"
                  name="vendorId"
                  required
                  value={formData.vendorId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
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
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6 space-y-6">
              <h2 className="text-lg font-semibold text-[color:var(--secondary-black)]">
                Product Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="cropType"
                    className="block text-sm font-medium text-[color:var(--secondary-black)] mb-2"
                  >
                    Crop Type *
                  </label>
                  <select
                    id="cropType"
                    name="cropType"
                    required
                    value={formData.cropType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
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

                <div>
                  <label
                    htmlFor="variety"
                    className="block text-sm font-medium text-[color:var(--secondary-black)] mb-2"
                  >
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
                    className="w-full px-4 py-2.5 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-[color:var(--secondary-black)] mb-2"
                  >
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
                    className="w-full px-4 py-2.5 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="unit"
                    className="block text-sm font-medium text-[color:var(--secondary-black)] mb-2"
                  >
                    Unit *
                  </label>
                  <select
                    id="unit"
                    name="unit"
                    required
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="lbs">Pounds (lbs)</option>
                    <option value="tons">Tons</option>
                    <option value="units">Units</option>
                    <option value="boxes">Boxes</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="qualityGrade"
                    className="block text-sm font-medium text-[color:var(--secondary-black)] mb-2"
                  >
                    Quality Grade *
                  </label>
                  <select
                    id="qualityGrade"
                    name="qualityGrade"
                    required
                    value={formData.qualityGrade}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
                  >
                    <option value="">Select grade</option>
                    <option value="premium">Premium</option>
                    <option value="grade-a">Grade A</option>
                    <option value="grade-b">Grade B</option>
                    <option value="organic">Organic Certified</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="harvestDate"
                    className="block text-sm font-medium text-[color:var(--secondary-black)] mb-2"
                  >
                    Harvest Date *
                  </label>
                  <input
                    type="date"
                    id="harvestDate"
                    name="harvestDate"
                    required
                    value={formData.harvestDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="storageLocation"
                    className="block text-sm font-medium text-[color:var(--secondary-black)] mb-2"
                  >
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
                    className="w-full px-4 py-2.5 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="pricing"
                    className="block text-sm font-medium text-[color:var(--secondary-black)] mb-2"
                  >
                    Pricing (per unit)
                  </label>
                  <input
                    type="text"
                    id="pricing"
                    name="pricing"
                    placeholder="e.g., $2.50/kg"
                    value={formData.pricing}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[color:var(--secondary-black)] mb-2">
                  Certifications (if applicable)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Organic Certified",
                    "GlobalGAP",
                    "Fair Trade",
                    "Rainforest Alliance",
                  ].map((cert) => (
                    <label
                      key={cert}
                      className="flex items-center gap-2 p-3 rounded-lg border border-[color:var(--secondary-soft-highlight)] hover:bg-gray-50 cursor-pointer"
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
                        className="h-4 w-4 text-[var(--primary-accent2)] focus:ring-[color:var(--primary-base)] rounded"
                      />
                      <span className="text-sm text-[color:var(--secondary-black)]">
                        {cert}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
              <h2 className="text-lg font-semibold text-[color:var(--secondary-black)] mb-4">
                Product Images
              </h2>

              <div className="space-y-4">
                {/* Upload Button */}
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[color:var(--secondary-soft-highlight)] rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <PhotoIcon className="h-10 w-10 text-[color:var(--secondary-muted-edge)] mb-2" />
                    <p className="text-sm text-[color:var(--secondary-muted-edge)]">
                      Click to upload images
                    </p>
                    <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>

                {/* Image Preview */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-[color:var(--secondary-soft-highlight)]"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Reason & Notes */}
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6 space-y-6">
              <h2 className="text-lg font-semibold text-[color:var(--secondary-black)]">
                Additional Information
              </h2>

              <div>
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-[color:var(--secondary-black)] mb-2"
                >
                  Reason for Government Upload *
                </label>
                <select
                  id="reason"
                  name="reason"
                  required
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
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
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-[color:var(--secondary-black)] mb-2"
                >
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  placeholder="Any additional information about this product..."
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-between gap-4">
              <Link
                href={
                  preselectedVendorId
                    ? `/government/vendors/${preselectedVendorId}`
                    : "/government/vendors"
                }
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[color:var(--secondary-soft-highlight)] text-[color:var(--secondary-black)] text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--primary-accent2)] text-white text-sm font-medium hover:bg-[var(--primary-accent3)] transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                Upload Product
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
