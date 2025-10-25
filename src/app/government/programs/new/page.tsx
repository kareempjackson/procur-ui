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

type ProgramStatus = "active" | "planning" | "completed" | "suspended";

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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/government/programs"
          className="inline-flex items-center gap-2 text-sm text-[color:var(--primary-accent2)] hover:text-[var(--primary-accent3)] mb-6 transition-all hover:gap-3 font-medium"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Programs
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[color:var(--secondary-black)] mb-2">
              Create New Program
            </h1>
            <p className="text-sm text-[color:var(--secondary-muted-edge)]">
              Set up a new government assistance program for farmers
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100/50 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <InformationCircleIcon className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-red-900 mb-1">
                Error Creating Program
              </h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gradient-to-br from-white to-gray-50/30 rounded-2xl border border-[color:var(--secondary-soft-highlight)] p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary-accent1)] to-[var(--primary-accent2)] flex items-center justify-center">
              <InformationCircleIcon className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-[color:var(--secondary-black)]">
              Basic Information
            </h2>
          </div>

          <div className="space-y-5">
            {/* Program Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-[color:var(--secondary-black)] mb-2"
              >
                Program Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Irrigation Support Program"
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-[var(--primary-accent2)] transition-all hover:border-gray-300"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-[color:var(--secondary-black)] mb-2"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Brief description of the program's purpose and goals"
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-[var(--primary-accent2)] transition-all hover:border-gray-300 resize-none"
              />
            </div>

            {/* Category and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-semibold text-[color:var(--secondary-black)] mb-2"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-[var(--primary-accent2)] transition-all hover:border-gray-300 appearance-none bg-white cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "3rem",
                  }}
                >
                  <option value="">Select a category</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Certification">Certification</option>
                  <option value="Financial Aid">Financial Aid</option>
                  <option value="Training & Education">
                    Training & Education
                  </option>
                  <option value="Equipment">Equipment</option>
                  <option value="Market Access">Market Access</option>
                  <option value="Technology">Technology</option>
                  <option value="Environmental">Environmental</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-semibold text-[color:var(--secondary-black)] mb-2"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-[var(--primary-accent2)] transition-all hover:border-gray-300 appearance-none bg-white cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "3rem",
                  }}
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

        {/* Budget and Targets */}
        <div className="bg-gradient-to-br from-white to-gray-50/30 rounded-2xl border border-[color:var(--secondary-soft-highlight)] p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
              <BanknotesIcon className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-[color:var(--secondary-black)]">
              Budget & Targets
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Budget */}
            <div>
              <label
                htmlFor="budget"
                className="block text-sm font-semibold text-[color:var(--secondary-black)] mb-2"
              >
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
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-[var(--primary-accent2)] transition-all hover:border-gray-300"
              />
            </div>

            {/* Target Participants */}
            <div>
              <label
                htmlFor="target_participants"
                className="block text-sm font-semibold text-[color:var(--secondary-black)] mb-2"
              >
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
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-[var(--primary-accent2)] transition-all hover:border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-gradient-to-br from-white to-gray-50/30 rounded-2xl border border-[color:var(--secondary-soft-highlight)] p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
              <CalendarIcon className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-[color:var(--secondary-black)]">
              Program Timeline
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Start Date */}
            <div>
              <label
                htmlFor="start_date"
                className="block text-sm font-semibold text-[color:var(--secondary-black)] mb-2"
              >
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-[var(--primary-accent2)] transition-all hover:border-gray-300"
              />
            </div>

            {/* End Date */}
            <div>
              <label
                htmlFor="end_date"
                className="block text-sm font-semibold text-[color:var(--secondary-black)] mb-2"
              >
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
                min={formData.start_date}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-[var(--primary-accent2)] transition-all hover:border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-br from-white to-gray-50/30 rounded-2xl border border-[color:var(--secondary-soft-highlight)] p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                <CheckCircleIcon className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-[color:var(--secondary-black)]">
                Program Benefits
              </h2>
            </div>
            <button
              type="button"
              onClick={addBenefit}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-[color:var(--primary-accent2)] hover:text-white hover:bg-[var(--primary-accent2)] border-2 border-[var(--primary-accent2)] transition-all"
            >
              <PlusIcon className="h-4 w-4" />
              Add Benefit
            </button>
          </div>

          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => handleBenefitChange(index, e.target.value)}
                  placeholder="e.g., Up to $5,000 per farm"
                  className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-[var(--primary-accent2)] transition-all hover:border-gray-300"
                />
                {benefits.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBenefit(index)}
                    className="flex-shrink-0 w-10 h-10 rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 border-2 border-red-200 hover:border-red-300 transition-all flex items-center justify-center"
                  >
                    <MinusIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Eligibility Requirements */}
        <div className="bg-gradient-to-br from-white to-gray-50/30 rounded-2xl border border-[color:var(--secondary-soft-highlight)] p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                <DocumentCheckIcon className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-[color:var(--secondary-black)]">
                Eligibility Requirements
              </h2>
            </div>
            <button
              type="button"
              onClick={addEligibility}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-[color:var(--primary-accent2)] hover:text-white hover:bg-[var(--primary-accent2)] border-2 border-[var(--primary-accent2)] transition-all"
            >
              <PlusIcon className="h-4 w-4" />
              Add Requirement
            </button>
          </div>

          <div className="space-y-3">
            {eligibility.map((requirement, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) =>
                    handleEligibilityChange(index, e.target.value)
                  }
                  placeholder="e.g., Minimum 10 acres of cultivated land"
                  className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-[var(--primary-accent2)] transition-all hover:border-gray-300"
                />
                {eligibility.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEligibility(index)}
                    className="flex-shrink-0 w-10 h-10 rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 border-2 border-red-200 hover:border-red-300 transition-all flex items-center justify-center"
                  >
                    <MinusIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-6">
          <Link
            href="/government/programs"
            className="px-8 py-3 border-2 border-gray-300 rounded-full text-sm font-semibold text-[color:var(--secondary-black)] hover:bg-gray-50 hover:border-gray-400 transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-[var(--primary-accent2)] to-[var(--primary-accent3)] text-white rounded-full text-sm font-semibold hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all flex items-center gap-2"
          >
            {isSubmitting && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {isSubmitting ? "Creating Program..." : "Create Program"}
          </button>
        </div>
      </form>
    </div>
  );
}
