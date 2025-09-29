"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  verifyEmail,
  resendVerification,
  selectAuthStatus,
  selectAuthError,
} from "@/store/slices/authSlice";

function VerifyPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);

  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [email, setEmail] = useState("");
  const [localToken, setLocalToken] = useState(token);

  useEffect(() => {
    if (!token) return;
    dispatch(verifyEmail({ token }))
      .unwrap()
      .then(() => router.replace("/"))
      .catch(() => void 0);
  }, [dispatch, router, token]);

  const onManualVerify = async () => {
    if (!localToken) return;
    try {
      await dispatch(verifyEmail({ token: localToken })).unwrap();
      router.replace("/");
    } catch {
      // handled by slice error state
    }
  };

  const onResend = async () => {
    if (!email) return;
    try {
      await dispatch(resendVerification(email)).unwrap();
      alert("Verification email sent. Please check your inbox.");
    } catch {
      // handled by slice error state
    }
  };

  return (
    <div className="min-h-[100dvh] bg-white text-black relative">
      {/* Subtle Anthropic-like background vibe */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(0,0,0,0.06),transparent_60%)]" />

      <main className="relative z-10 mx-auto max-w-3xl px-6 py-20 md:py-28">
        <header className="mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600">
            Account
            <span className="h-1 w-1 rounded-full bg-neutral-400" />
            Email verification
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight md:text-4xl">
            Verify your email to continue
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
            We sent a verification link to your email. For security, your
            account becomes active once you confirm ownership of that address.
          </p>
        </header>

        {/* Card */}
        <section className="rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-[0_4px_30px_rgba(0,0,0,0.04)] backdrop-blur-sm md:p-8">
          {/* Loading state */}
          {status === "loading" && (
            <div className="flex items-center gap-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
              <div>
                <p className="text-sm font-medium">Verifying your email…</p>
                <p className="text-xs text-neutral-600">
                  This only takes a moment.
                </p>
              </div>
            </div>
          )}

          {/* Success soft-state (we redirect instantly on success) */}
          {status === "succeeded" && (
            <div className="flex items-center gap-4">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  className="h-4 w-4"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Email verified</p>
                <p className="text-xs text-neutral-600">Redirecting…</p>
              </div>
            </div>
          )}

          {/* Error / No token provided */}
          {(status === "failed" || !token) && (
            <div className="space-y-6">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {error}
                </div>
              )}

              {!token && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Paste verification token
                  </label>
                  <input
                    value={localToken}
                    onChange={(e) => setLocalToken(e.target.value)}
                    placeholder="eyJhbGciOi..."
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900"
                  />
                  <div>
                    <button
                      onClick={onManualVerify}
                      disabled={!localToken}
                      className="inline-flex items-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Resend verification email
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900"
                  />
                  <button
                    onClick={onResend}
                    disabled={!email}
                    className="inline-flex items-center rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:border-neutral-900 disabled:opacity-40"
                  >
                    Resend
                  </button>
                </div>
                <p className="text-xs text-neutral-600">
                  Well send a new link to the address above.
                </p>
              </div>
            </div>
          )}
        </section>

        <footer className="mt-10 text-xs text-neutral-500">
          Inspired by the clean, minimalist design approach seen on Anthropics
          site.
        </footer>
      </main>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <VerifyPageContent />
    </Suspense>
  );
}
