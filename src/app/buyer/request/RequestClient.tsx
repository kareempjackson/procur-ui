"use client";

import React, { useState, useMemo } from "react";
import { useAppDispatch } from "@/store";
import { createRequest } from "@/store/slices/buyerRequestsSlice";
import { useRouter } from "next/navigation";
import {
  ShoppingBagIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

export default function RequestClient() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({
    produceName: "",
    category: "",
    quantity: "",
    unit: "lb",
    qualityGrade: "first-grade",
    deliveryLocation: "",
    deliveryDate: "",
    budgetMin: "",
    budgetMax: "",
    orderType: "one-off",
    recurringFrequency: "weekly",
    urgency: "normal",
    additionalNotes: "",
  });

  const categories = [
    "Vegetables",
    "Fruits",
    "Herbs",
    "Grains",
    "Legumes",
    "Root Crops",
    "Leafy Greens",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const quantityNumber = Number(formData.quantity);

    const payload: any = {
      product_name: formData.produceName,
      category: formData.category || undefined,
      quantity: isNaN(quantityNumber) ? 0 : quantityNumber,
      unit_of_measurement: formData.unit as any,
      date_needed: formData.deliveryDate || undefined,
      description: formData.additionalNotes || undefined,
      budget_range:
        formData.budgetMin || formData.budgetMax
          ? {
              min: Number(formData.budgetMin || 0),
              max: Number(formData.budgetMax || 0),
              currency: "USD",
            }
          : undefined,
    };

    try {
      const action = await dispatch(createRequest(payload) as any);
      if (action.meta.requestStatus === "fulfilled") {
        alert("Request submitted successfully! Suppliers will be notified.");
        router.push("/buyer/requests");
      } else {
        const err = action.payload || "Failed to submit request";
        alert(String(err));
      }
    } catch (err) {
      alert("Failed to submit request");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--secondary-black)] mb-1">
            Make a Request
          </h1>
          <p className="text-sm text-[var(--secondary-muted-edge)]">
            Can&apos;t find what you&apos;re looking for? Submit a request and
            let suppliers come to you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Information */}
          <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBagIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
              <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
                Product Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Produce Name */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                  What are you looking for? *
                </label>
                <input
                  type="text"
                  name="produceName"
                  value={formData.produceName}
                  onChange={handleInputChange}
                  placeholder="e.g., Organic Cherry Tomatoes"
                  className="w-full px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                  Quantity Needed *
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="100"
                    className="flex-1 px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]"
                    required
                  />
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]"
                  >
                    <option value="lb">lb</option>
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="oz">oz</option>
                    <option value="piece">piece</option>
                    <option value="dozen">dozen</option>
                    <option value="liter">liter</option>
                    <option value="ml">ml</option>
                    <option value="gallon">gallon</option>
                  </select>
                </div>
              </div>

              {/* Quality Grade */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                  Quality Grade
                </label>
                <div className="flex flex-wrap gap-2">
                  {["first-grade", "second-grade", "any"].map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          qualityGrade: grade,
                        }))
                      }
                      className={`px-4 py-1.5 rounded-full font-medium text-xs transition-all duration-200 ${
                        formData.qualityGrade === grade
                          ? "bg-[var(--primary-accent2)] text-white"
                          : "bg-[var(--primary-background)] text-[var(--secondary-black)] border border-[var(--secondary-soft-highlight)]/30 hover:border-[var(--primary-accent2)]"
                      }`}
                    >
                      {grade === "first-grade"
                        ? "First Grade"
                        : grade === "second-grade"
                        ? "Second Grade"
                        : "Any Grade"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20">
            <div className="flex items-center gap-2 mb-4">
              <MapPinIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
              <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
                Delivery Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Delivery Location */}
              <div>
                <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                  Delivery Location *
                </label>
                <input
                  type="text"
                  name="deliveryLocation"
                  value={formData.deliveryLocation}
                  onChange={handleInputChange}
                  placeholder="City, Country"
                  className="w-full px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]"
                  required
                />
              </div>

              {/* Delivery Date */}
              <div>
                <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                  Needed By *
                </label>
                <input
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]"
                  required
                />
              </div>

              {/* Urgency */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                  Urgency
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "low", label: "Low Priority", color: "blue" },
                    { value: "normal", label: "Normal", color: "green" },
                    { value: "high", label: "High Priority", color: "orange" },
                    { value: "urgent", label: "Urgent", color: "red" },
                  ].map((urgency) => (
                    <button
                      key={urgency.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          urgency: urgency.value,
                        }))
                      }
                      className={`px-4 py-1.5 rounded-full font-medium text-xs transition-all duration-200 ${
                        formData.urgency === urgency.value
                          ? "bg-[var(--primary-accent2)] text-white"
                          : "bg-[var(--primary-background)] text-[var(--secondary-black)] border border-[var(--secondary-soft-highlight)]/30 hover:border-[var(--primary-accent2)]"
                      }`}
                    >
                      {urgency.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20">
            <div className="flex items-center gap-2 mb-4">
              <CurrencyDollarIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
              <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
                Budget
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                  Minimum Price (per {formData.unit})
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--secondary-muted-edge)] text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    name="budgetMin"
                    value={formData.budgetMin}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                  Maximum Price (per {formData.unit})
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--secondary-muted-edge)] text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    name="budgetMax"
                    value={formData.budgetMax}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Type */}
          <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20">
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
              <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
                Order Type
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, orderType: "one-off" }))
                }
                className={`px-4 py-1.5 rounded-full font-medium text-xs transition-all duration-200 ${
                  formData.orderType === "one-off"
                    ? "bg-[var(--primary-accent2)] text-white"
                    : "bg-[var(--primary-background)] text-[var(--secondary-black)] border border-[var(--secondary-soft-highlight)]/30 hover:border-[var(--primary-accent2)]"
                }`}
              >
                One-Off Order
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, orderType: "recurring" }))
                }
                className={`px-4 py-1.5 rounded-full font-medium text-xs transition-all duration-200 ${
                  formData.orderType === "recurring"
                    ? "bg-[var(--primary-accent2)] text-white"
                    : "bg-[var(--primary-background)] text-[var(--secondary-black)] border border-[var(--secondary-soft-highlight)]/30 hover:border-[var(--primary-accent2)]"
                }`}
              >
                Recurring Order
              </button>
            </div>

            {formData.orderType === "recurring" && (
              <div className="mt-4 pt-4 border-t border-[var(--secondary-soft-highlight)]/30">
                <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                  Delivery Frequency
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        recurringFrequency: "weekly",
                      }))
                    }
                    className={`px-4 py-1.5 rounded-full font-medium text-xs transition-all duration-200 ${
                      formData.recurringFrequency === "weekly"
                        ? "bg-[var(--primary-accent2)] text-white"
                        : "bg-[var(--primary-background)] text-[var(--secondary-black)] border border-[var(--secondary-soft-highlight)]/30 hover:border-[var(--primary-accent2)]"
                    }`}
                  >
                    Weekly
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        recurringFrequency: "biweekly",
                      }))
                    }
                    className={`px-4 py-1.5 rounded-full font-medium text-xs transition-all duration-200 ${
                      formData.recurringFrequency === "biweekly"
                        ? "bg-[var(--primary-accent2)] text-white"
                        : "bg-[var(--primary-background)] text-[var(--secondary-black)] border border-[var(--secondary-soft-highlight)]/30 hover:border-[var(--primary-accent2)]"
                    }`}
                  >
                    Biweekly
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        recurringFrequency: "monthly",
                      }))
                    }
                    className={`px-4 py-1.5 rounded-full font-medium text-xs transition-all duration-200 ${
                      formData.recurringFrequency === "monthly"
                        ? "bg-[var(--primary-accent2)] text-white"
                        : "bg-[var(--primary-background)] text-[var(--secondary-black)] border border-[var(--secondary-soft-highlight)]/30 hover:border-[var(--primary-accent2)]"
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardDocumentListIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
              <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
                Additional Information
              </h2>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                Special Requirements or Notes
              </label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                rows={4}
                placeholder="Include any specific requirements, packaging preferences, delivery instructions, or other details..."
                className="w-full px-4 py-2.5 text-sm rounded-2xl border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)] resize-none"
              />
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3">
            <div className="flex gap-2">
              <InformationCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 text-sm mb-0.5">
                  How it works
                </h3>
                <p className="text-xs text-blue-800">
                  Your request will be sent to suppliers in our network that
                  match your criteria. You&apos;ll receive quotes and proposals
                  within 24-48 hours. You can then review and choose the best
                  offer.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-[var(--primary-accent2)] text-white px-6 py-3 rounded-full font-semibold text-base hover:bg-[var(--primary-accent3)] transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Submit Request
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-3 rounded-full font-semibold text-base border-2 border-[var(--secondary-soft-highlight)] text-[var(--secondary-black)] hover:bg-[var(--primary-background)] transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
