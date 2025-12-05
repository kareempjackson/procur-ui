"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import {
  ShoppingCartIcon,
  TagIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch } from "@/store";
import { signup as signupThunk } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import ProcurLoader from "@/components/ProcurLoader";

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullname: "",
    accountType: "",
    businessType: "",
    businessName: "",
    phoneNumber: "",
    country: "Grenada",
  });
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Prefill from query params (used by home page CTAs)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const accountTypeParam = params.get("accountType");
    const stepParam = params.get("step");

    if (accountTypeParam === "seller" || accountTypeParam === "buyer") {
      setFormData((prev) => ({
        ...prev,
        accountType: accountTypeParam,
      }));
    }

    if (stepParam === "business") {
      setStep(2);
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAccountTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      accountType: value,
      businessType: "",
    }));
  };

  const goToNextStep = () => {
    if (!formData.accountType) {
      setError("Please select an account type to continue.");
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      // Require business type for buyer/seller
      if (
        (formData.accountType === "buyer" ||
          formData.accountType === "seller") &&
        !formData.businessType
      ) {
        setIsLoading(false);
        setError("Please select your business type.");
        return;
      }
      // Require business name for buyer/seller
      if (
        (formData.accountType === "buyer" ||
          formData.accountType === "seller") &&
        !formData.businessName
      ) {
        setIsLoading(false);
        setError("Please enter your business name.");
        return;
      }
      await dispatch(
        signupThunk({
          email: formData.email,
          password: formData.password,
          fullname: formData.fullname,
          accountType: formData.accountType,
          businessType:
            formData.accountType === "buyer" ||
            formData.accountType === "seller"
              ? formData.businessType
              : undefined,
          businessName:
            formData.accountType === "buyer" ||
            formData.accountType === "seller"
              ? formData.businessName
              : undefined,
          phoneNumber: formData.phoneNumber || undefined,
          country: formData.country || undefined,
        })
      ).unwrap();
      router.push("/check-email");
    } catch (err) {
      const message =
        typeof err === "string" ? err : "Failed to create your account";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const countries = [
    "Grenada",
    "St. Vincent",
    "Trinidad & Tobago",
    "Barbados",
    "St. Lucia",
    "Panama",
    "Colombia",
  ];

  const accountTypeOptions = [
    {
      value: "buyer",
      label: "Buyer",
      description: "Discover suppliers and request quotes",
      icon: ShoppingCartIcon,
    },
    {
      value: "seller",
      label: "Seller",
      description: "List products and manage orders",
      icon: TagIcon,
    },
  ];

  const businessTypeOptions: Record<
    string,
    { value: string; label: string }[]
  > = {
    buyer: [
      { value: "general", label: "General" },
      { value: "hotels", label: "Hotels" },
      { value: "restaurants", label: "Restaurants" },
      { value: "supermarkets", label: "Supermarkets" },
      { value: "exporters", label: "Exporters" },
    ],
    seller: [
      { value: "general", label: "General" },
      { value: "farmers", label: "Farmers" },
      { value: "manufacturers", label: "Manufacturers" },
      { value: "fishermen", label: "Fishermen" },
    ],
  };

  return (
    <Suspense fallback={<ProcurLoader />}>
      <div className="min-h-screen flex flex-col bg-[var(--primary-background)]">
        <TopNavigation />

        <div className="flex-1 flex">
          {/* Left Half - Sign Up Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16">
            <div className="w-full max-w-md space-y-8 my-8">
              {/* Header */}
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Join Procur
                </h1>
                <p className="text-lg text-gray-600">
                  Create your account to start connecting with global produce
                  markets
                </p>
              </div>

              {/* Sign Up Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}
                {/* Stepper / Header */}
                <div className="flex items-center justify-center gap-5 text-sm text-gray-600">
                  <div
                    className={`flex items-center gap-2 ${step === 1 ? "font-semibold text-gray-900" : ""}`}
                  >
                    <span
                      className={`h-7 w-7 flex items-center justify-center rounded-full border transition-colors ${step >= 1 ? "bg-black text-white border-black" : "bg-white border-gray-300"}`}
                    >
                      1
                    </span>
                    <span>Account Type</span>
                  </div>
                  <span className="opacity-40">—</span>
                  <div
                    className={`flex items-center gap-2 ${step === 2 ? "font-semibold text-gray-900" : ""}`}
                  >
                    <span
                      className={`h-7 w-7 flex items-center justify-center rounded-full border transition-colors ${step >= 2 ? "bg-black text-white border-black" : "bg-white border-gray-300"}`}
                    >
                      2
                    </span>
                    <span>Business & Details</span>
                  </div>
                </div>

                {/* Step 1: Account Type */}
                {step === 1 && (
                  <div>
                    <label
                      htmlFor="accountType"
                      className="block text-sm font-medium text-gray-700 mb-3"
                    >
                      Account Type
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {accountTypeOptions.map((option) => {
                        const selected = formData.accountType === option.value;
                        const Icon = option.icon;
                        return (
                          <label
                            key={option.value}
                            className={`group relative cursor-pointer rounded-2xl border p-6 transition-all duration-200 ${
                              selected
                                ? "bg-white border-transparent ring-2 ring-black shadow-md"
                                : "bg-white/80 border-gray-200 hover:border-gray-300 hover:shadow-sm"
                            }`}
                          >
                            <input
                              type="radio"
                              name="accountType"
                              value={option.value}
                              checked={selected}
                              onChange={handleAccountTypeChange}
                              className="sr-only"
                            />
                            <div className="flex items-start gap-4">
                              <span
                                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${selected ? "bg-black text-white" : "bg-gray-100 text-gray-900"}`}
                                aria-hidden="true"
                              >
                                <Icon className="h-6 w-6" aria-hidden="true" />
                              </span>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-base font-semibold text-gray-900">
                                    {option.label}
                                  </span>
                                </div>
                                <span className="mt-1 block text-sm text-gray-600">
                                  {option.description}
                                </span>
                              </div>
                            </div>
                            {selected && (
                              <span className="absolute top-3 right-3 h-5 w-5 rounded-full bg-black text-white text-[10px] leading-5 text-center">
                                ✓
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={goToNextStep}
                      disabled={!formData.accountType || isLoading}
                      className={`btn btn-secondary !rounded-full w-full mt-4 ${!formData.accountType || isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      Continue
                    </button>
                  </div>
                )}

                {/* Step 2: Business type + rest of form */}
                {step === 2 && (
                  <>
                    {(formData.accountType === "buyer" ||
                      formData.accountType === "seller") && (
                      <div>
                        <label
                          htmlFor="businessType"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Business Type
                        </label>
                        <select
                          id="businessType"
                          name="businessType"
                          required
                          value={formData.businessType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-white"
                        >
                          <option value="">Select your business type</option>
                          {businessTypeOptions[formData.accountType]?.map(
                            (bt) => (
                              <option key={bt.value} value={bt.value}>
                                {bt.label}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    )}

                    {(formData.accountType === "buyer" ||
                      formData.accountType === "seller") && (
                      <div>
                        <label htmlFor="businessName" className="sr-only">
                          Business Name
                        </label>
                        <input
                          id="businessName"
                          name="businessName"
                          type="text"
                          required
                          value={formData.businessName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-full placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                          placeholder="Enter your business name"
                        />
                      </div>
                    )}

                    {/* Full Name */}
                    <div>
                      <label htmlFor="fullname" className="sr-only">
                        Full Name
                      </label>
                      <input
                        id="fullname"
                        name="fullname"
                        type="text"
                        required
                        value={formData.fullname}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-full placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                        placeholder="Enter your full name"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="sr-only">
                        Email address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-full placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                        placeholder="Enter your email"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label htmlFor="password" className="sr-only">
                        Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-full placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                        placeholder="Create a password"
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label htmlFor="country" className="sr-only">
                        Country
                      </label>
                      <select
                        id="country"
                        name="country"
                        required
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-white"
                      >
                        <option value="">Select your country</option>
                        {countries.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-secondary !rounded-full w-full flex justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Creating account..." : "Create Account"}
                    </button>
                  </>
                )}
              </form>

              {/* Privacy Policy Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  By creating an account, you agree to Procur&apos;s{" "}
                  <a
                    href="/legal/terms"
                    className="font-medium text-black hover:text-gray-700 underline transition-colors duration-200"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/legal/privacy"
                    className="font-medium text-black hover:text-gray-700 underline transition-colors duration-200"
                  >
                    Privacy Policy
                  </a>
                </p>
              </div>

              {/* Sign In Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="font-medium text-black hover:text-gray-700 transition-colors duration-200"
                  >
                    Sign in
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Right Half - Image */}
          <div
            className="hidden lg:flex lg:w-1/2 items-center justify-center relative mr-8 mt-4 mb-12 rounded-2xl overflow-hidden"
            style={{ minHeight: "90vh" }}
          >
            <Image
              src="/images/backgrounds/polina-kuzovkova-0OkidWKbO2Q-unsplash.jpg"
              alt="Fresh produce market"
              fill
              className="object-cover"
              priority
            />

            {/* Optional overlay with text */}
            <div className="absolute inset-0 bg-black/20 flex items-end p-12">
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-4">
                  Start Your Journey in Global Produce
                </h2>
                <p className="text-xl text-white/90 max-w-md">
                  Join our community of buyers, sellers, and government agencies
                  transforming the produce industry
                </p>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </Suspense>
  );
};

export default SignUpPage;
