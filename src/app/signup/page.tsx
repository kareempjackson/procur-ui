"use client";

import React, { useState } from "react";
import Image from "next/image";
import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullname: "",
    accountType: "buyer",
    phoneNumber: "",
    country: "",
    businessType: "general",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log("Sign up attempt:", formData);
    }, 1000);
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

  const businessTypes = [
    { value: "general", label: "General Business" },
    { value: "restaurant", label: "Restaurant" },
    { value: "grocery", label: "Grocery Store" },
    { value: "distributor", label: "Distributor" },
    { value: "retailer", label: "Retailer" },
    { value: "wholesaler", label: "Wholesaler" },
    { value: "other", label: "Other" },
  ];

  return (
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

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="sr-only">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                  placeholder="Enter your phone number"
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

              {/* Account Type */}
              <div>
                <label
                  htmlFor="accountType"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Account Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="accountType"
                      value="buyer"
                      checked={formData.accountType === "buyer"}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-black focus:ring-black border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-900">Buyer</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="accountType"
                      value="seller"
                      checked={formData.accountType === "seller"}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-black focus:ring-black border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-900">Seller</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="accountType"
                      value="government"
                      checked={formData.accountType === "government"}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-black focus:ring-black border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-900">
                      Government
                    </span>
                  </label>
                </div>
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

              {/* Business Type */}
              <div>
                <label htmlFor="businessType" className="sr-only">
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
                  {businessTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-secondary w-full flex justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Privacy Policy Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                By creating an account, you agree to Procur's{" "}
                <a
                  href="/terms"
                  className="font-medium text-black hover:text-gray-700 underline transition-colors duration-200"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy-policy"
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
            src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
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
  );
};

export default SignUpPage;
