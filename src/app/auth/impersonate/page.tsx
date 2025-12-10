"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getApiClient } from "@/lib/apiClient";
import type { AuthUser } from "@/store/slices/authSlice";
import { setAuthState } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store";

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

function ImpersonateInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState(
    "Starting impersonated session. Please wait…"
  );

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setMessage("Missing impersonation token.");
      return;
    }

    const run = async () => {
      try {
        const api = getApiClient(() => token);
        const { data: profile } = await api.get("/users/profile");

        let expiresIn: number | null = null;
        try {
          const parts = token.split(".");
          if (parts.length === 3) {
            const payload = JSON.parse(
              atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
            );
            if (typeof payload.exp === "number") {
              const now = Math.floor(Date.now() / 1000);
              expiresIn = Math.max(payload.exp - now, 0);
            }
          }
        } catch {
          // ignore decode errors
        }

        const org = profile.organization ?? null;

        const user: AuthUser = {
          id: profile.id,
          email: profile.email,
          fullname: profile.fullname ?? "",
          role: profile.role,
          accountType: profile.accountType ?? org?.accountType ?? "",
          emailVerified: profile.emailVerified,
          organizationId: profile.organizationId ?? org?.id ?? null,
          organizationName: org?.name ?? null,
          organizationRole: profile.organizationRole ?? null,
        };

        dispatch(
          setAuthState({
            accessToken: token,
            tokenType: "Bearer",
            expiresIn,
            user,
          })
        );

        const dest = getDestination(user.accountType, user.emailVerified);
        router.replace(dest);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Impersonation failed", err);
        setMessage("Failed to start impersonated session.");
      }
    };

    void run();
  }, [dispatch, router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <p className="text-sm text-black/70">{message}</p>
    </div>
  );
}

export default function ImpersonatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <p className="text-sm text-black/70">
            Starting impersonated session. Please wait…
          </p>
        </div>
      }
    >
      <ImpersonateInner />
    </Suspense>
  );
}
