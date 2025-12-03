"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getApiClient } from "@/lib/apiClient";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

function AcceptInvitationPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const { show } = useToast();

  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      show("Invalid or missing invitation token.");
    }
  }, [token, show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!fullname.trim()) {
      show("Please enter your full name.");
      return;
    }
    if (password.length < 8) {
      show("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      show("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      // This endpoint does not require an auth token, so we explicitly
      // disable token injection by providing a getter that returns null.
      const client = getApiClient(() => null);
      const { data } = await client.post("/auth/accept-invitation", {
        token,
        fullname: fullname.trim(),
        password,
      });

      if (data?.accessToken) {
        // Reuse the same storage key pattern as normal sign-in
        if (typeof window !== "undefined") {
          localStorage.setItem("authToken", data.accessToken);
        }
      }

      show("Invitation accepted. Welcome to Procur!");
      router.push("/seller");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to accept invitation. Please try again.";
      show(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">
            Join your team on Procur
          </h1>
          <p className="text-sm text-slate-600">
            Set up your account to start collaborating with your organization.
          </p>
        </div>

        {!token ? (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-4">
            This invitation link is invalid. Please request a new invitation
            from your team admin.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Full name
              </label>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white outline-none focus:border-[var(--primary-accent2)] focus:ring-1 focus:ring-[var(--primary-accent2)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white outline-none focus:border-[var(--primary-accent2)] focus:ring-1 focus:ring-[var(--primary-accent2)] transition-colors"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Must be at least 8 characters.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Confirm password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white outline-none focus:border-[var(--primary-accent2)] focus:ring-1 focus:ring-[var(--primary-accent2)] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !token}
              className="w-full mt-2 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-full bg-[var(--primary-accent2)] text-white hover:bg-[var(--primary-accent3)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "Creating your account..." : "Accept invitation"}
            </button>

            <p className="mt-3 text-[11px] text-slate-500 text-center">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-[var(--primary-accent2)] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
            <div className="text-center text-sm text-slate-500">
              Loading invitation...
            </div>
          </div>
        </div>
      }
    >
      <AcceptInvitationPageInner />
    </Suspense>
  );
}
