"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch } from "@/store";
import { verifyEmail } from "@/store/slices/authSlice";

export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifyFallback />}>
      <VerifyPageInner />
    </Suspense>
  );
}

function VerifyPageInner() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token"), [searchParams]);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle");

  useEffect(() => {
    if (!token) {
      setError("Missing verification token.");
      setStatus("error");
      return;
    }

    const run = async () => {
      setStatus("verifying");
      try {
        const auth = await dispatch(verifyEmail({ token })).unwrap();
        setStatus("success");
        const type = auth.user.accountType;
        if (type === "seller") {
          router.replace("/seller");
        } else if (type === "buyer") {
          router.replace("/buyer");
        } else if (type === "government") {
          router.replace("/government");
        } else {
          router.replace("/");
        }
      } catch (e) {
        setError(typeof e === "string" ? e : "Verification failed.");
        setStatus("error");
      }
    };

    run();
  }, [token, dispatch, router]);

  return (
    <div className="min-h-[100dvh] bg-[var(--primary-background)] text-[var(--foreground)] relative">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(0,0,0,0.04),transparent_60%)]" />
      <main className="relative z-10 mx-auto max-w-2xl px-6 py-24 md:py-32">
        <section className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-[0_4px_30px_rgba(0,0,0,0.04)] backdrop-blur-sm">
          <div className="mx-auto flex max-w-md flex-col items-center text-center">
            {status === "verifying" && (
              <>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary-base)]">
                  <svg
                    className="animate-spin h-6 w-6 text-white"
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
                </div>
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Verifying your email…
                </h1>
                <p className="mt-3 text-sm text-neutral-600">
                  Please wait while we activate your account.
                </p>
              </>
            )}

            {status === "error" && (
              <>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    className="h-6 w-6"
                  >
                    <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Verification failed
                </h1>
                <p className="mt-3 text-sm text-neutral-600">
                  {error ?? "Invalid or expired verification link."}
                </p>
                <div className="mt-6 flex gap-3">
                  <a href="/signup" className="btn btn-ghost !rounded-full">
                    Try again
                  </a>
                  <a href="/login" className="btn btn-primary !rounded-full">
                    Go to login
                  </a>
                </div>
              </>
            )}

            {status === "success" && (
              <>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-green-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    className="h-6 w-6"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Email verified
                </h1>
                <p className="mt-3 text-sm text-neutral-600">
                  Redirecting you to your dashboard…
                </p>
              </>
            )}
          </div>
        </section>
        <p className="mt-8 text-center text-xs text-neutral-500">
          If this wasn’t you, please secure your account.
        </p>
      </main>
    </div>
  );
}

function VerifyFallback() {
  return (
    <div className="min-h-[100dvh] bg-[var(--primary-background)] text-[var(--foreground)] relative">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(0,0,0,0.04),transparent_60%)]" />
      <main className="relative z-10 mx-auto max-w-2xl px-6 py-24 md:py-32">
        <section className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-[0_4px_30px_rgba(0,0,0,0.04)] backdrop-blur-sm">
          <div className="mx-auto flex max-w-md flex-col items-center text-center">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary-base)]">
              <svg
                className="animate-spin h-6 w-6 text-white"
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
            </div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Verifying your email…
            </h1>
            <p className="mt-3 text-sm text-neutral-600">
              Please wait while we activate your account.
            </p>
          </div>
        </section>
        <p className="mt-8 text-center text-xs text-neutral-500">
          If this wasn’t you, please secure your account.
        </p>
      </main>
    </div>
  );
}
