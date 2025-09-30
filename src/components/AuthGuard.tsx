"use client";

import React, { PropsWithChildren, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/store";
import { selectAuthToken, selectAuthUser } from "@/store/slices/authSlice";

type Allowed =
  | "buyer"
  | "buyers"
  | "seller"
  | "suppliers"
  | "government"
  | "driver"
  | "qa"
  | "any";

type AuthGuardProps = PropsWithChildren<{
  allowAccountTypes?: Allowed[];
  // When user has the wrong account type, where should we send them?
  // If omitted, we try to infer from their type.
}>;

function getDefaultHomeForAccountType(
  accountType: string | null | undefined
): string {
  switch (accountType) {
    case "buyer":
      return "/buyer";
    case "seller":
      return "/seller";
    case "government":
      return "/government";
    case "driver":
      return "/buyers"; // adjust if/when driver section exists
    case "qa":
      return "/buyers"; // adjust as needed
    default:
      return "/";
  }
}

export default function AuthGuard({
  children,
  allowAccountTypes = ["any"],
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAppSelector(selectAuthToken);
  const user = useAppSelector(selectAuthUser);
  const hasSavedAuth = (() => {
    if (typeof window === "undefined") return false;
    try {
      const raw = localStorage.getItem("auth");
      if (!raw) return false;
      const parsed = JSON.parse(raw) as { accessToken?: string };
      return Boolean(parsed?.accessToken);
    } catch {
      return false;
    }
  })();

  useEffect(() => {
    // Not logged in → redirect to login with return path
    if ((!token || !user) && !hasSavedAuth) {
      const redirect = encodeURIComponent(pathname || "/");
      router.replace(`/login?next=${redirect}`);
      return;
    }

    // Account type enforcement
    if (user && !allowAccountTypes.includes("any")) {
      const normalizedUserType = (user.accountType || "").toLowerCase();
      const normalizedAllowed = allowAccountTypes.map((t) => t.toLowerCase());
      if (!normalizedAllowed.includes(normalizedUserType)) {
        router.replace(getDefaultHomeForAccountType(normalizedUserType));
      }
    }
  }, [token, user, pathname, router, allowAccountTypes, hasSavedAuth]);

  // Optimistic render: optionally show nothing until checks pass on client
  if (!token || !user) return null;
  if (!allowAccountTypes.includes("any")) {
    const normalizedUserType = (user.accountType || "").toLowerCase();
    const normalizedAllowed = allowAccountTypes.map((t) => t.toLowerCase());
    if (!normalizedAllowed.includes(normalizedUserType)) return null;
  }

  return <>{children}</>;
}
