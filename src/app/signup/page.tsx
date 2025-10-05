"use client";

import React, { useState } from "react";
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
    accountType: "buyer",
    phoneNumber: "",
    country: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

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
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(
        signupThunk({
          email: formData.email,
          password: formData.password,
          fullname: formData.fullname,
          accountType: formData.accountType,
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
    {
      value: "government",
      label: "Government",
      description: "Onboard vendors and run procurement",
      icon: BuildingLibraryIcon,
    },
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
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
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

              {/* Account Type */}
              <div>
                <label
                  htmlFor="accountType"
                  className="block text-sm font-medium text-gray-700 mb-3"
                >
                  Account Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {accountTypeOptions.map((option) => {
                    const selected = formData.accountType === option.value;
                    const Icon = option.icon;
                    return (
                      <label
                        key={option.value}
                        className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                          selected
                            ? "bg-white border-transparent ring-2 ring-black"
                            : "bg-white/80 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="accountType"
                          value={option.value}
                          checked={selected}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="flex flex-col">
                          <span
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-900"
                            aria-hidden="true"
                          >
                            <Icon className="h-6 w-6" aria-hidden="true" />
                          </span>
                          <span className="mt-3 text-base font-semibold text-gray-900">
                            {option.label}
                          </span>
                          <span className="mt-1 text-sm text-gray-600">
                            {option.description}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-secondary !rounded-full w-full flex justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            {/* Privacy Policy Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                By creating an account, you agree to Procur&apos;s{" "}
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
