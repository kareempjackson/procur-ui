"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  becomeBuyer,
  becomeSeller,
  fetchMyOrganizations,
  selectAuthUser,
  selectMyOrganizations,
  selectOrganizationsStatus,
  switchOrganization,
} from "@/store/slices/authSlice";
import { useOptionalToast } from "@/components/ui/Toast";

/**
 * Airbnb-style role toggle. Shows different copy depending on the user's existing
 * memberships:
 *   - Has both buyer + seller orgs → "Switch to selling" / "Switch to buying"
 *     (one click, no modal)
 *   - Has only one role → "Start selling" / "Start buying" (opens onboarding modal)
 *
 * Two ways to consume:
 *   - `<RoleSwitcher variant="..." />` — renders the standalone pill (legacy).
 *   - `useRoleSwitcher()` — headless hook for custom UI (e.g. a dropdown item).
 *     Render `state.modal` at a stable location in your tree so the modal
 *     survives a parent unmount (e.g. closing the dropdown that triggered it).
 */
type Variant = "buyer" | "seller" | "public";

export type RoleSwitcherState = {
  visible: boolean;
  label: string;
  targetRole: "buyer" | "seller";
  trigger: () => void;
  modal: React.ReactNode;
};

export function useRoleSwitcher(): RoleSwitcherState {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { show } = useOptionalToast();
  const user = useAppSelector(selectAuthUser);
  const organizations = useAppSelector(selectMyOrganizations);
  const status = useAppSelector(selectOrganizationsStatus);

  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && status === "idle") {
      void dispatch(fetchMyOrganizations());
    }
  }, [user, status, dispatch]);

  const hasBuyer = organizations.some((o) => o.accountType === "buyer");
  const hasSeller = organizations.some((o) => o.accountType === "seller");
  const activeType = user?.accountType;

  const targetRole: "buyer" | "seller" =
    activeType === "seller" ? "buyer" : "seller";
  const targetHasOrg = targetRole === "seller" ? hasSeller : hasBuyer;

  const targetOrg = useMemo(
    () => organizations.find((o) => o.accountType === targetRole),
    [organizations, targetRole]
  );

  const trigger = useCallback(async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (targetHasOrg && targetOrg) {
      try {
        await dispatch(switchOrganization(targetOrg.id)).unwrap();
        router.push(targetRole === "seller" ? "/seller" : "/");
      } catch (err) {
        show(typeof err === "string" ? err : "Couldn't switch role.");
      }
      return;
    }

    setModalOpen(true);
  }, [user, targetHasOrg, targetOrg, targetRole, dispatch, router, show]);

  const label = targetHasOrg
    ? targetRole === "seller"
      ? "Switch to selling"
      : "Switch to buying"
    : targetRole === "seller"
      ? "Start selling"
      : "Start buying";

  const modal = modalOpen ? (
    <BecomeRoleModal
      role={targetRole}
      submitting={submitting}
      onClose={() => setModalOpen(false)}
      onSubmit={async (form) => {
        setSubmitting(true);
        try {
          const action = targetRole === "seller" ? becomeSeller : becomeBuyer;
          await dispatch(action(form)).unwrap();
          setModalOpen(false);
          router.push(targetRole === "seller" ? "/seller" : "/");
        } catch (err) {
          show(
            typeof err === "string"
              ? err
              : `Couldn't ${targetRole === "seller" ? "start selling" : "start buying"}.`
          );
        } finally {
          setSubmitting(false);
        }
      }}
    />
  ) : null;

  return { visible: Boolean(user), label, targetRole, trigger, modal };
}

export default function RoleSwitcher({ variant }: { variant: Variant }) {
  const { visible, label, trigger, modal } = useRoleSwitcher();

  if (!visible) return null;

  const onDark = variant === "public";

  return (
    <>
      <button
        type="button"
        onClick={trigger}
        style={{
          padding: "6px 14px",
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 700,
          fontFamily: "inherit",
          cursor: "pointer",
          whiteSpace: "nowrap",
          border: onDark
            ? "1px solid rgba(255,255,255,.25)"
            : "1px solid #e8e4dc",
          background: onDark ? "rgba(255,255,255,.08)" : "#fff",
          color: onDark ? "#fff" : "#1c2b23",
          transition: "background .12s, border-color .12s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = onDark
            ? "rgba(255,255,255,.18)"
            : "#f5f1ea";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = onDark
            ? "rgba(255,255,255,.08)"
            : "#fff";
        }}
      >
        {label}
      </button>
      {modal}
    </>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// Modal — minimal field set, mirrors the relevant step of /signup. We intentionally
// don't collect KYC/payout details here; the user completes those in the seller area
// after switching, matching the Airbnb "host onboarding can finish later" pattern.
// ───────────────────────────────────────────────────────────────────────────────

type BecomeRoleForm = {
  businessName: string;
  businessType: string;
  countryId?: string;
};

function BecomeRoleModal({
  role,
  submitting,
  onClose,
  onSubmit,
}: {
  role: "buyer" | "seller";
  submitting: boolean;
  onClose: () => void;
  onSubmit: (form: BecomeRoleForm) => void;
}) {
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState(
    role === "seller" ? "farmers" : "general"
  );

  const title =
    role === "seller" ? "Start selling on Procur" : "Start buying on Procur";
  const subtitle =
    role === "seller"
      ? "Tell us about your farm or business. You can add payout details and listings after."
      : "Tell us about the business you're buying for. You can finish the rest later.";

  const businessTypeOptions =
    role === "seller"
      ? [
          { value: "farmers", label: "Farm" },
          { value: "manufacturers", label: "Manufacturer / packer" },
          { value: "fishermen", label: "Fisher" },
          { value: "general", label: "Other" },
        ]
      : [
          { value: "general", label: "General buyer" },
          { value: "hotel", label: "Hotel / hospitality" },
          { value: "restaurant", label: "Restaurant" },
          { value: "retailer", label: "Retailer / grocer" },
        ];

  const canSubmit = businessName.trim().length >= 2 && !submitting;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(28,43,35,.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 16,
          maxWidth: 460,
          width: "100%",
          padding: "28px 28px 24px",
          fontFamily: "'Urbanist', system-ui, sans-serif",
          boxShadow: "0 24px 60px rgba(0,0,0,.18)",
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1c2b23", margin: "0 0 6px" }}>
          {title}
        </h2>
        <p style={{ fontSize: 13.5, color: "#6a7f73", margin: "0 0 22px", lineHeight: 1.5 }}>
          {subtitle}
        </p>

        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#1c2b23", marginBottom: 6 }}>
          Business name
        </label>
        <input
          autoFocus
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder={role === "seller" ? "e.g. Maria's Farm" : "e.g. La Plaza Bistro"}
          style={{
            width: "100%",
            padding: "11px 13px",
            border: "1px solid #e8e4dc",
            borderRadius: 10,
            fontSize: 14,
            outline: "none",
            fontFamily: "inherit",
            marginBottom: 16,
          }}
        />

        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#1c2b23", marginBottom: 6 }}>
          Business type
        </label>
        <select
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          style={{
            width: "100%",
            padding: "11px 13px",
            border: "1px solid #e8e4dc",
            borderRadius: 10,
            fontSize: 14,
            outline: "none",
            fontFamily: "inherit",
            background: "#fff",
            marginBottom: 22,
          }}
        >
          {businessTypeOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            style={{
              padding: "10px 18px",
              border: "1px solid #e8e4dc",
              background: "#fff",
              color: "#1c2b23",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 700,
              cursor: submitting ? "not-allowed" : "pointer",
              fontFamily: "inherit",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() =>
              canSubmit &&
              onSubmit({ businessName: businessName.trim(), businessType })
            }
            disabled={!canSubmit}
            style={{
              padding: "10px 22px",
              border: "none",
              background: canSubmit ? "#d4783c" : "#e0d8d0",
              color: canSubmit ? "#fff" : "#b0a898",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 700,
              cursor: canSubmit ? "pointer" : "not-allowed",
              fontFamily: "inherit",
            }}
          >
            {submitting ? "Creating…" : role === "seller" ? "Start selling" : "Start buying"}
          </button>
        </div>
      </div>
    </div>
  );
}
