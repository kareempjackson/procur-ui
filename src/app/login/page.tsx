"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import { useAppDispatch } from "@/store";
import { signin, devSignin } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  function getDestination(
    accountType: string | undefined | null,
    emailVerified: boolean
  ): string {
    if (!emailVerified) return "/check-email";
    switch ((accountType || "").toLowerCase()) {
      case "seller":
        return "/seller";
      case "buyer":
        return "/buyer";
      case "government":
        return "/government";
      default:
        return "/";
    }
  }

  function getNextParam(): string | null {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    return params.get("next");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const auth = await dispatch(signin({ email, password })).unwrap();
      const next = getNextParam();
      if (next) {
        router.replace(next);
        return;
      }
      const dest = getDestination(
        auth.user.accountType,
        auth.user.emailVerified
      );
      router.replace(dest);
    } catch (err) {
      const message = typeof err === "string" ? err : "Failed to sign in";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDevSignin = async (type: "seller" | "buyer" | "government") => {
    setError(null);
    setIsLoading(true);
    try {
      const auth = await dispatch(devSignin({ accountType: type })).unwrap();
      const next = getNextParam();
      if (next) {
        router.replace(next);
        return;
      }
      const dest = getDestination(
        auth.user.accountType,
        auth.user.emailVerified
      );
      router.replace(dest);
    } catch (err) {
      const message = typeof err === "string" ? err : "Dev sign in failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Suspense fallback={null}>
      <div className="min-h-screen flex flex-col bg-[var(--primary-background)]">
        <TopNavigation />

        <div className="flex-1 flex">
          {/* Left Half - Login Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16">
            <div className="w-full max-w-md space-y-8 my-8">
              {/* Header */}
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Welcome back
                </h1>
                <p className="text-lg text-gray-600">
                  Sign in to your Procur account
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}
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

                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-full placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a
                      href="/forgot-password"
                      className="font-medium text-black hover:text-gray-700 transition-colors duration-200"
                    >
                      Forgot your password?
                    </a>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-secondary !rounded-full w-full flex justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
                      Signing in...
                    </div>
                  ) : (
                    "Continue with email"
                  )}
                </button>
              </form>

              {/* Dev Auth (only renders in non-production) */}
              {process.env.NEXT_PUBLIC_ENV !== "production" && (
                <div className="space-y-3">
                  <div className="text-xs text-gray-500">Dev quick sign-in</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleDevSignin("seller")}
                      className="btn btn-outline !rounded-full"
                    >
                      Seller
                    </button>
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleDevSignin("buyer")}
                      className="btn btn-outline !rounded-full"
                    >
                      Buyer
                    </button>
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleDevSignin("government")}
                      className="btn btn-outline !rounded-full"
                    >
                      Government
                    </button>
                  </div>
                </div>
              )}

              {/* Privacy Policy Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  By continuing, you acknowledge Procur's{" "}
                  <a
                    href="/privacy-policy"
                    className="font-medium text-black hover:text-gray-700 underline transition-colors duration-200"
                  >
                    Privacy Policy
                  </a>
                </p>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <a
                    href="/signup"
                    className="font-medium text-black hover:text-gray-700 transition-colors duration-200"
                  >
                    Sign up for free
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
                  Connect with Global Produce Markets
                </h2>
                <p className="text-xl text-white/90 max-w-md">
                  Join thousands of buyers and suppliers transforming the
                  produce industry
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

export default LoginPage;
