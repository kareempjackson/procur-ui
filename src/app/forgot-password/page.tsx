"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // UI only – pretend to submit
    setSubmitted(true);
  };

  return (
    <Suspense fallback={null}>
      <div className="min-h-screen flex flex-col bg-[var(--primary-background)]">
        <TopNavigation />

        <div className="flex-1 flex">
          {/* Left Half - Forgot Password Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16">
            <div className="w-full max-w-md space-y-8 my-8">
              {/* Header */}
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Forgot password?
                </h1>
                <p className="text-lg text-gray-600">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              {submitted && (
                <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                  If an account exists for {email}, we&apos;ve sent a reset
                  link.
                </div>
              )}

              {/* Forgot Password Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-full placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-secondary !rounded-full w-full flex justify-center"
                >
                  Send reset link
                </button>
              </form>

              {/* Back to Login */}
              <div className="text-center">
                <a
                  href="/login"
                  className="font-medium text-black hover:text-gray-700 transition-colors duration-200"
                >
                  Back to login
                </a>
              </div>
            </div>
          </div>

          {/* Right Half - Image */}
          <div
            className="hidden lg:flex lg:w-1/2 items-center justify-center relative mr-8 mt-4 mb-12 rounded-2xl overflow-hidden"
            style={{ minHeight: "90vh" }}
          >
            <Image
              src="/images/backgrounds/jacopo-maiarelli--gOUx23DNks-unsplash (1).jpg"
              alt="Countryside fields"
              fill
              className="object-cover"
              priority
            />

            {/* Optional overlay with text */}
            <div className="absolute inset-0 bg-black/20 flex items-end p-12">
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-4">Reset your access</h2>
                <p className="text-xl text-white/90 max-w-md">
                  We&apos;ll email you instructions to create a new password.
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

export default ForgotPasswordPage;
