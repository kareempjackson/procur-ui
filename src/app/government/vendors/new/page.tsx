"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function NewVendorPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Form state
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

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Back Button */}
        <Link
          href="/government/vendors"
          className="inline-flex items-center gap-2 text-sm text-[color:var(--secondary-muted-edge)] hover:text-[color:var(--secondary-black)] mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Vendors
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[color:var(--secondary-black)]">
            Register New Vendor
          </h1>
          <p className="text-sm text-[color:var(--secondary-muted-edge)] mt-1">
            Complete the following steps to register a new agricultural vendor
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    currentStep >= step
                      ? "border-[var(--primary-accent2)] bg-[var(--primary-accent2)] text-white"
                      : "border-[color:var(--secondary-soft-highlight)] text-[color:var(--secondary-muted-edge)]"
                  }`}
                >
                  {step}
                </div>
                {step < totalSteps && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-colors ${
                      currentStep > step
                        ? "bg-[var(--primary-accent2)]"
                        : "bg-[color:var(--secondary-soft-highlight)]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-[color:var(--secondary-muted-edge)]">
              Personal
            </span>
            <span className="text-xs text-[color:var(--secondary-muted-edge)]">
              Land
            </span>
            <span className="text-xs text-[color:var(--secondary-muted-edge)]">
              Farm
            </span>
            <span className="text-xs text-[color:var(--secondary-muted-edge)]">
              Programs
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-8">
            {/* Step 1: Personal Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[color:var(--secondary-black)]">
                  Personal & Contact Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="vendorName"
                      className="block text-sm font-medium text-[color:var(--secondary-black)] mb-2"
                    >
                      Vendor/Farm Name *
                    </label>
                    <input
                      type="text"
                      id="vendorName"
                      name="vendorName"
                      required
                      value={formData.vendorName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contactPerson"
                      className="block text-sm font-medium text-[color:var(--secondary-black)] mb-2"
                    >
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      id="contactPerson"
                      name="contactPerson"
                      required
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-[color:var(--secondary-black)] mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-[color:var(--secondary-black)] mb-2"
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-[color:var(--secondary-black)] mb-2"
                  >
                    Farm Location/Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    required
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="gpsLat"
                      className="block text-sm font-medium text-[color:var(--secondary-black)] mb-2"
                    >
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
                      className="w-full px-4 py-2.5 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="gpsLng"
                      className="block text-sm font-medium text-[color:var(--secondary-black)] mb-2"
                    >
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
                      className="w-full px-4 py-2.5 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Land Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[color:var(--secondary-black)]">
                  Land Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="totalAcreage"
                      className="block text-sm font-medium text-[color:var(--secondary-black)] mb-2"
                    >
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
                      className="w-full px-4 py-2.5 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="utilizedAcreage"
                      className="block text-sm font-medium text-[color:var(--secondary-black)] mb-2"
                    >
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
                      className="w-full px-4 py-2.5 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
                    />
                  </div>
                </div>

                {formData.totalAcreage && formData.utilizedAcreage && (
                  <div className="p-4 rounded-lg bg-[var(--primary-accent1)]/10 border border-[color:var(--secondary-soft-highlight)]">
                    <div className="text-sm text-[color:var(--secondary-black)]">
                      Available acreage:{" "}
                      <span className="font-semibold">
                        {(
                          parseFloat(formData.totalAcreage) -
                          parseFloat(formData.utilizedAcreage)
                        ).toFixed(1)}{" "}
                        acres
                      </span>
                    </div>
                    <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
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

            {/* Step 3: Farm Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[color:var(--secondary-black)]">
                  Farm Infrastructure & Details
                </h2>

                <div>
                  <label className="block text-sm font-medium text-[color:var(--secondary-black)] mb-2">
                    Infrastructure
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-[color:var(--secondary-soft-highlight)] hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        name="irrigation"
                        checked={formData.irrigation}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-[var(--primary-accent2)] focus:ring-[color:var(--primary-base)] rounded"
                      />
                      <span className="text-sm text-[color:var(--secondary-black)]">
                        Irrigation System
                      </span>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-lg border border-[color:var(--secondary-soft-highlight)] hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        name="rainwaterHarvesting"
                        checked={formData.rainwaterHarvesting}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-[var(--primary-accent2)] focus:ring-[color:var(--primary-base)] rounded"
                      />
                      <span className="text-sm text-[color:var(--secondary-black)]">
                        Rainwater Harvesting System
                      </span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label
                      htmlFor="ponds"
                      className="block text-sm font-medium text-[color:var(--secondary-black)] mb-2"
                    >
                      Number of Ponds
                    </label>
                    <input
                      type="number"
                      id="ponds"
                      name="ponds"
                      min="0"
                      value={formData.ponds}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="greenhouses"
                      className="block text-sm font-medium text-[color:var(--secondary-black)] mb-2"
                    >
                      Number of Greenhouses
                    </label>
                    <input
                      type="number"
                      id="greenhouses"
                      name="greenhouses"
                      min="0"
                      value={formData.greenhouses}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="shadeHouses"
                      className="block text-sm font-medium text-[color:var(--secondary-black)] mb-2"
                    >
                      Number of Shade Houses
                    </label>
                    <input
                      type="number"
                      id="shadeHouses"
                      name="shadeHouses"
                      min="0"
                      value={formData.shadeHouses}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="transportation"
                    className="block text-sm font-medium text-[color:var(--secondary-black)] mb-2"
                  >
                    Transportation Availability
                  </label>
                  <textarea
                    id="transportation"
                    name="transportation"
                    rows={2}
                    placeholder="e.g., 2 trucks, 1 van"
                    value={formData.transportation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Programs */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[color:var(--secondary-black)]">
                  Government Programs (Optional)
                </h2>
                <p className="text-sm text-[color:var(--secondary-muted-edge)]">
                  Select which government incentive programs this vendor should
                  be enrolled in
                </p>

                <div className="space-y-3">
                  {[
                    "Irrigation Support Program",
                    "Organic Certification",
                    "Youth Farmer Initiative",
                    "Climate Smart Agriculture",
                    "Export Development Program",
                  ].map((program) => (
                    <label
                      key={program}
                      className="flex items-start gap-3 p-4 rounded-lg border border-[color:var(--secondary-soft-highlight)] hover:bg-gray-50 cursor-pointer"
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
                        className="mt-0.5 h-4 w-4 text-[var(--primary-accent2)] focus:ring-[color:var(--primary-base)] rounded"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-[color:var(--secondary-black)]">
                          {program}
                        </div>
                        <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
                          Program description and benefits
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-[color:var(--secondary-soft-highlight)]">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[color:var(--secondary-soft-highlight)] text-[color:var(--secondary-black)] text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--primary-accent2)] text-white text-sm font-medium hover:bg-[var(--primary-accent3)] transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--primary-accent2)] text-white text-sm font-medium hover:bg-[var(--primary-accent3)] transition-colors"
                >
                  Register Vendor
                </button>
              )}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
