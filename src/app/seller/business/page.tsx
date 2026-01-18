"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  CreditCardIcon,
  PlusIcon,
  XMarkIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectAuthUser } from "@/store/slices/authSlice";
import { getApiClient } from "@/lib/apiClient";
import { fetchProfile, updateProfile } from "@/store/slices/profileSlice";
import { useToast } from "@/components/ui/Toast";

type TeamMember = {
  id: string;
  email: string;
  fullname: string;
  role: string;
  joinedAt: string;
  isActive: boolean;
};

type Invitation = {
  id: string;
  email: string;
  role: string;
  invitedBy: string;
  createdAt: string;
  expiresAt: string;
};

export default function SellerBusinessSettingsPage() {
  const user = useAppSelector(selectAuthUser);
  const dispatch = useAppDispatch();
  const profile = useAppSelector((s) => s.profile.profile);
  const profileStatus = useAppSelector((s) => s.profile.status);
  const { show } = useToast();
  const [activeTab, setActiveTab] = useState<"general" | "team" | "payments">(
    "general"
  );

  // General Settings State
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [headerImageFile, setHeaderImageFile] = useState<File | null>(null);
  const [headerImagePreview, setHeaderImagePreview] = useState<string | null>(
    null
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [taxId, setTaxId] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  // const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [farmerIdFile, setFarmerIdFile] = useState<File | null>(null);
  const [farmerIdPreview, setFarmerIdPreview] = useState<string | null>(null);
  const [savingGeneral, setSavingGeneral] = useState(false);

  // Load live profile data
  useEffect(() => {
    if (profileStatus === "idle") {
      dispatch(fetchProfile());
    }
  }, [dispatch, profileStatus]);

  useEffect(() => {
    if (!profile) return;
    const org = profile.organization;
    setBusinessName(org?.businessName || org?.name || "");
    setBusinessType(org?.businessType || "");
    if (!headerImageFile) {
      setHeaderImagePreview(org?.headerImageUrl || null);
    }
    if (!logoFile) {
      setLogoPreview(org?.logoUrl || null);
    }
    setAddress(
      org?.address ||
        [org?.city, org?.state, org?.postalCode, org?.country]
          .filter(Boolean)
          .join(", ") ||
        ""
    );
    setPhone(profile.phone_number || "");
    setDescription(org?.description || "");
    // If we have an existing Farmer ID URL from profile and no new file selected, show it
    if (!farmerIdFile) {
      setFarmerIdPreview(org?.farmersIdUrl || null);
    }

    // Prefer server-saved payout method when available
    if (org?.payoutMethod === "cash" || org?.payoutMethod === "cheque") {
      setPayoutMethod(org.payoutMethod);
    }
  }, [profile, farmerIdFile, headerImageFile, logoFile]);

  // Payments tab: keep payout method in sync with profile (source of truth)
  useEffect(() => {
    if (activeTab !== "payments") return;
    const method = profile?.organization?.payoutMethod;
    if (method === "cash" || method === "cheque") {
      setPayoutMethod(method);
    }
  }, [activeTab, profile?.organization?.payoutMethod]);

  // Team Management State
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamError, setTeamError] = useState<string | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [inviteSubmitting, setInviteSubmitting] = useState(false);

  // Payment Settings State (offline payouts for now)
  const [payoutMethod, setPayoutMethod] = useState<"cash" | "cheque" | "">("");
  const [savingPayout, setSavingPayout] = useState(false);

  const handleFarmerIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      show("Please upload an image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      show("Image size must be less than 5MB");
      return;
    }

    setFarmerIdFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFarmerIdPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      show("Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      show("Image size must be less than 5MB");
      return;
    }

    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleHeaderImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      show("Please upload an image file");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      show("Image size must be less than 8MB");
      return;
    }

    setHeaderImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setHeaderImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveGeneral = async () => {
    setSavingGeneral(true);
    try {
      const client = getApiClient();
      let farmersIdPath: string | undefined = undefined;
      let logoPath: string | undefined = undefined;
      let headerImagePath: string | undefined = undefined;

      if (farmerIdFile && user?.organizationId) {
        // 1) Ask backend for signed upload URL (private storage)
        const { data: signed } = await client.patch(
          "/users/farmers-id/signed-upload",
          {
            organizationId: user.organizationId,
            filename: farmerIdFile.name,
          }
        );

        // 2) Upload the file directly to Supabase Storage using the signed URL
        const uploadRes = await fetch(signed.signedUrl as string, {
          method: "PUT",
          headers: {
            "Content-Type": farmerIdFile.type || "application/octet-stream",
            "x-upsert": "false",
          },
          body: farmerIdFile,
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload Farmer ID to storage");
        }

        farmersIdPath = signed.path as string;
      }

      if (logoFile && user?.organizationId) {
        const { data: signed } = await client.patch(
          "/users/logo/signed-upload",
          {
            organizationId: user.organizationId,
            filename: logoFile.name,
          }
        );

        const uploadRes = await fetch(signed.signedUrl as string, {
          method: "PUT",
          headers: {
            "Content-Type": logoFile.type || "application/octet-stream",
            "x-upsert": "false",
          },
          body: logoFile,
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload Logo to storage");
        }

        logoPath = signed.path as string;
      }

      if (headerImageFile && user?.organizationId) {
        const { data: signed } = await client.patch(
          "/users/header-image/signed-upload",
          {
            organizationId: user.organizationId,
            filename: headerImageFile.name,
          }
        );

        const uploadRes = await fetch(signed.signedUrl as string, {
          method: "PUT",
          headers: {
            "Content-Type":
              headerImageFile.type || "application/octet-stream",
            "x-upsert": "false",
          },
          body: headerImageFile,
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload Header Image to storage");
        }

        headerImagePath = signed.path as string;
      }

      // 3) Save profile fields (and farmersIdPath / logoPath if present) via profile slice
      await dispatch(
        updateProfile({
          businessName,
          businessType,
          address,
          phone,
          description,
          ...(taxId ? { taxId } : {}),
          ...(registrationNumber ? { registrationNumber } : {}),
          ...(farmersIdPath ? { farmersIdPath } : {}),
          ...(logoPath ? { logoPath } : {}),
          ...(headerImagePath ? { headerImagePath } : {}),
        })
      ).unwrap();

      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("onboarding:business_profile_completed", "true");
          if (businessName && (logoFile || logoPreview || description)) {
            localStorage.setItem("onboarding:brand_ready", "true");
          }
        }
      } catch {
        // ignore storage errors
      }

      // Clear local file state after successful save
      setFarmerIdFile(null);
      setLogoFile(null);
      setHeaderImageFile(null);
      // Keep preview; it will refresh from profile when fetched
      show("Business profile updated");
    } catch (e) {
      console.error(e);
      show("Failed to save changes. Please try again.");
    } finally {
      setSavingGeneral(false);
    }
  };

  const handleSavePayoutMethod = async () => {
    if (!payoutMethod) {
      show("Please select a payout method.");
      return;
    }
    try {
      setSavingPayout(true);
      await dispatch(updateProfile({ payoutMethod })).unwrap();
      if (typeof window !== "undefined") {
        localStorage.setItem("onboarding:payments_completed", "true");
      }
      show("Payout preference saved.");
    } catch {
      show("Couldn't save payout preference. Please try again.");
    } finally {
      setSavingPayout(false);
    }
  };

  const loadInvitations = async () => {
    if (!user?.organizationId) return;
    try {
      const client = getApiClient();
      const { data } = await client.get<
        {
          id: string;
          email: string;
          role_id: string;
          inviter_user_id: string;
          created_at: string;
          expires_at: string;
        }[]
      >("/users/org-invitations");

      const mapped: Invitation[] =
        (data || []).map((inv) => ({
          id: inv.id,
          email: inv.email,
          role: "Member", // Role name is not yet joined; can be enhanced later
          invitedBy: inv.inviter_user_id,
          createdAt: inv.created_at,
          expiresAt: inv.expires_at,
        })) ?? [];

      setInvitations(mapped);
    } catch (err) {
      // Non-fatal for now
      console.error("Failed to load invitations", err);
    }
  };

  const loadTeamMembers = async () => {
    setTeamLoading(true);
    setTeamError(null);
    try {
      const client = getApiClient();
      const { data } = await client.get<TeamMember[]>("/users/org-members");
      setTeamMembers(data ?? []);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load team members.";
      setTeamError(message);
    } finally {
      setTeamLoading(false);
    }
  };

  const handleInviteUser = async () => {
    const email = inviteEmail.trim();
    if (!email) return;

    setInviteSubmitting(true);
    try {
      const client = getApiClient();
      await client.post("/users/org-members/invite", {
        email,
        roleName: inviteRole || undefined,
      });
      show("Invitation sent");
      setShowInviteModal(false);
      setInviteEmail("");
      setInviteRole("member");
      void loadInvitations();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to add team member. Please try again.";
      show(message);
    } finally {
      setInviteSubmitting(false);
    }
  };

  const handleRemoveTeamMember = async (orgUserId: string) => {
    if (
      !confirm(
        "Are you sure you want to remove this team member from your organization?"
      )
    )
      return;

    try {
      const client = getApiClient();
      await client.delete(`/users/org-members/${orgUserId}`);
      setTeamMembers((prev) => prev.filter((m) => m.id !== orgUserId));
      show("Team member removed");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to remove team member.";
      show(message);
    }
  };

  const handleRevokeInvitation = async (invitationId: string) => {
    if (
      !confirm(
        "Are you sure you want to revoke this invitation? The link will stop working."
      )
    )
      return;

    try {
      const client = getApiClient();
      await client.delete(`/users/org-invitations/${invitationId}`);
      setInvitations((prev) => prev.filter((i) => i.id !== invitationId));
      show("Invitation revoked");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to revoke invitation.";
      show(message);
    }
  };

  // When switching to Team tab, load members + invitations
  useEffect(() => {
    if (activeTab === "team") {
      void loadTeamMembers();
      void loadInvitations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user?.organizationId]);

  const inputClassName =
    "w-full px-4 py-2.5 text-sm rounded-full border border-gray-200 bg-white outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]";

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-5xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--secondary-black)] mb-1">
            Business Settings
          </h1>
          <p className="text-sm text-[var(--secondary-muted-edge)]">
            Manage your organization details, team members, and payment settings
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[var(--secondary-soft-highlight)]/30">
          <button
            onClick={() => setActiveTab("general")}
            className={`px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTab === "general"
                ? "text-[var(--primary-accent2)] border-[var(--primary-accent2)]"
                : "text-[var(--secondary-muted-edge)] border-transparent hover:text-[var(--secondary-black)]"
            }`}
          >
            Company Information
          </button>
          <button
            onClick={() => setActiveTab("team")}
            className={`px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTab === "team"
                ? "text-[var(--primary-accent2)] border-[var(--primary-accent2)]"
                : "text-[var(--secondary-muted-edge)] border-transparent hover:text-[var(--secondary-black)]"
            }`}
          >
            Team Members
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTab === "payments"
                ? "text-[var(--primary-accent2)] border-[var(--primary-accent2)]"
                : "text-[var(--secondary-muted-edge)] border-transparent hover:text-[var(--secondary-black)]"
            }`}
          >
            Payment Settings
          </button>
        </div>

        {/* General Settings Tab */}
        {activeTab === "general" && (
          <div className="space-y-4">
            {/* Company Information */}
            <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20">
              <div className="flex items-center gap-2 mb-4">
                <BuildingOfficeIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
                  Company Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                    Header Image (Farm Cover)
                  </label>
                  <div className="flex items-start gap-4">
                    <div className="w-[220px]">
                      {headerImagePreview ? (
                        <div className="relative group rounded-xl overflow-hidden border border-[var(--secondary-soft-highlight)]/30">
                          <div className="relative w-full h-[90px]">
                            <Image
                              src={headerImagePreview}
                              alt="Header Image"
                              fill
                              className="object-cover"
                              sizes="220px"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setHeaderImageFile(null);
                              setHeaderImagePreview(null);
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-[90px] w-full border-2 border-dashed border-[var(--secondary-soft-highlight)]/30 rounded-xl hover:border-[var(--primary-accent2)] transition-colors cursor-pointer group">
                          <div className="flex flex-col items-center">
                            <svg
                              className="w-6 h-6 text-gray-400 group-hover:text-[var(--primary-accent2)] transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span className="mt-1 text-[10px] text-gray-500 group-hover:text-[var(--primary-accent2)]">
                              Upload
                            </span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleHeaderImageChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-[var(--secondary-muted-edge)]">
                        Optional cover image shown on your public supplier page.
                        JPG/PNG recommended (wide image), max 8MB.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                    Business Logo
                  </label>
                  <div className="flex items-start gap-4">
                    {logoPreview ? (
                      <div className="relative group">
                        <Image
                          src={logoPreview}
                          alt="Business Logo"
                          width={80}
                          height={80}
                          className="h-20 w-20 object-cover rounded-xl border border-[var(--secondary-soft-highlight)]/30"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setLogoFile(null);
                            setLogoPreview(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-20 w-20 border-2 border-dashed border-[var(--secondary-soft-highlight)]/30 rounded-xl hover:border-[var(--primary-accent2)] transition-colors cursor-pointer group">
                        <div className="flex flex-col items-center">
                          <svg
                            className="w-6 h-6 text-gray-400 group-hover:text-[var(--primary-accent2)] transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="mt-1 text-[10px] text-gray-500 group-hover:text-[var(--primary-accent2)]">
                            Upload
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                      </label>
                    )}
                    <div className="flex-1">
                      <p className="text-xs text-[var(--secondary-muted-edge)]">
                        Upload your logo. JPG or PNG, max 5MB. Preview updates
                        instantly.
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Your business name"
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                    Business Type
                  </label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className={inputClassName}
                  >
                    <option value="">Select type</option>
                    <option value="farmers">Farm</option>
                    <option value="general">General</option>
                    <option value="manufacturers">Manufacturers</option>
                    <option value="fishermen">Fishermen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                    Tax ID
                  </label>
                  <input
                    type="text"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder="Tax identification number"
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="Business registration number"
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className={inputClassName}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                    Business Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street address, city, state, postal code"
                    className={inputClassName}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                    Business Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your business, specialties, and values..."
                    className="w-full px-4 py-2.5 text-sm rounded-2xl border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)] resize-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                    Farmer ID Document
                  </label>
                  <div className="flex items-start gap-4">
                    {farmerIdPreview ? (
                      <div className="relative group">
                        <Image
                          src={farmerIdPreview}
                          alt="Farmer ID"
                          width={192}
                          height={128}
                          className="h-32 w-48 object-cover rounded-xl border border-[var(--secondary-soft-highlight)]/30"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFarmerIdFile(null);
                            setFarmerIdPreview(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-32 w-48 border-2 border-dashed border-[var(--secondary-soft-highlight)]/30 rounded-xl hover:border-[var(--primary-accent2)] transition-colors cursor-pointer group">
                        <div className="flex flex-col items-center">
                          <svg
                            className="w-8 h-8 text-gray-400 group-hover:text-[var(--primary-accent2)] transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="mt-2 text-xs text-gray-500 group-hover:text-[var(--primary-accent2)]">
                            Upload ID
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFarmerIdChange}
                          className="hidden"
                        />
                      </label>
                    )}
                    <div className="flex-1">
                      <p className="text-xs text-[var(--secondary-muted-edge)]">
                        Upload a clear photo or scan of your farmer ID card.
                        This helps verify your business registration.
                      </p>
                      <p className="text-xs text-[var(--secondary-muted-edge)] mt-1">
                        Accepted formats: JPG, PNG (Max 5MB)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  className="px-5 py-2 text-sm text-[var(--secondary-black)] hover:bg-gray-50 rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveGeneral}
                  disabled={savingGeneral}
                  className="px-5 py-2 text-sm bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] disabled:opacity-60 transition-colors font-medium"
                >
                  {savingGeneral ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            {/* Organization Info */}
            <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20">
              <div className="flex items-center gap-2 mb-4">
                <InformationCircleIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
                  Organization Details
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-[var(--secondary-muted-edge)] mb-1">
                    Organization ID
                  </div>
                  <div className="font-mono text-[var(--secondary-black)]">
                    {user?.organizationId || "Not assigned"}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-[var(--secondary-muted-edge)] mb-1">
                    Your Role
                  </div>
                  <div className="font-medium text-[var(--secondary-black)] capitalize">
                    {user?.organizationRole || "Member"}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-[var(--secondary-muted-edge)] mb-1">
                    Account Type
                  </div>
                  <div className="inline-flex items-center px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium uppercase">
                    {user?.accountType}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-[var(--secondary-muted-edge)] mb-1">
                    Status
                  </div>
                  <div className="inline-flex items-center px-2.5 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Active
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Team Management Tab */}
        {activeTab === "team" && (
          <div className="space-y-4">
            {/* Team Members */}
            <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <UserGroupIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                  <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
                    Team Members
                  </h2>
                </div>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] transition-colors font-medium"
                >
                  <PlusIcon className="h-4 w-4" />
                  Invite User
                </button>
              </div>

              {/* Current User */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border border-[var(--secondary-soft-highlight)]/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--primary-accent2)] flex items-center justify-center text-white font-semibold text-sm">
                      {user?.fullname?.charAt(0) ||
                        user?.email?.charAt(0) ||
                        "?"}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[var(--secondary-black)]">
                        {user?.fullname || "You"}
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)]">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                      {user?.organizationRole || "Admin"}
                    </div>
                    <div className="px-2.5 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      You
                    </div>
                  </div>
                </div>

                {teamLoading && (
                  <div className="text-center py-6 text-sm text-[var(--secondary-muted-edge)]">
                    Loading team members...
                  </div>
                )}
                {teamError && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    {teamError}
                  </div>
                )}

                {!teamLoading && !teamError && (
                  <div className="space-y-2 mt-2">
                    {teamMembers
                      .filter((m) => m.email !== user?.email)
                      .map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-3 border border-[var(--secondary-soft-highlight)]/30 rounded-xl bg-white"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[var(--primary-accent1)] flex items-center justify-center text-[var(--secondary-black)] font-semibold text-sm">
                              {member.fullname?.charAt(0) ||
                                member.email?.charAt(0) ||
                                "?"}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-[var(--secondary-black)]">
                                {member.fullname || member.email}
                              </div>
                              <div className="text-xs text-[var(--secondary-muted-edge)]">
                                {member.email}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="px-2.5 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs font-medium capitalize">
                              {member.role}
                            </div>
                            <button
                              onClick={() => handleRemoveTeamMember(member.id)}
                              className="text-xs text-red-600 hover:text-red-700 px-2 py-1 rounded-full hover:bg-red-50 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}

                    {teamMembers.filter((m) => m.email !== user?.email)
                      .length === 0 &&
                      !teamLoading && (
                        <div className="text-center py-8 text-[var(--secondary-muted-edge)]">
                          <UserGroupIcon className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                          <p className="text-sm font-medium">
                            No additional team members yet
                          </p>
                          <p className="text-xs mt-1">
                            Invite users to collaborate on your organization
                          </p>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>

            {/* Pending Invitations */}
            {invitations.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20">
                <div className="flex items-center gap-2 mb-4">
                  <EnvelopeIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                  <h3 className="text-lg font-semibold text-[var(--secondary-black)]">
                    Pending Invitations
                  </h3>
                </div>

                <div className="space-y-2">
                  {invitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="flex items-center justify-between p-3 border border-yellow-200 bg-yellow-50 rounded-xl"
                    >
                      <div>
                        <div className="text-sm font-medium text-[var(--secondary-black)]">
                          {invitation.email}
                        </div>
                        <div className="text-xs text-[var(--secondary-muted-edge)]">
                          Invited{" "}
                          {new Date(invitation.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="px-2.5 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium capitalize">
                          {invitation.role}
                        </div>
                        <button
                          onClick={() => handleRevokeInvitation(invitation.id)}
                          className="text-red-600 hover:text-red-700 text-xs font-medium px-2"
                        >
                          Revoke
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Roles Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheckIcon className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-blue-900">
                  Team Roles
                </h3>
              </div>
              <div className="space-y-1.5 text-xs text-blue-800">
                <div>
                  <strong>Admin:</strong> Full access to all features and
                  settings
                </div>
                <div>
                  <strong>Manager:</strong> Can manage products, orders, and
                  view analytics
                </div>
                <div>
                  <strong>Member:</strong> Can view and create orders, limited
                  access
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20">
              <div className="flex items-center gap-2 mb-4">
                <CreditCardIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
                  Payout details
                </h2>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex gap-2">
                  <InformationCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="text-xs text-blue-800">
                    Payouts are currently handled offline. Choose how you want
                    to receive payouts now. Bank connection is coming soon.
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-[var(--secondary-black)] mb-2">
                    Payout method
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPayoutMethod("cash")}
                      className={`rounded-xl border p-4 text-left transition-colors ${
                        payoutMethod === "cash"
                          ? "border-[var(--primary-accent2)] bg-[var(--primary-background)]"
                          : "border-[var(--secondary-soft-highlight)] hover:bg-black/[0.02]"
                      }`}
                    >
                      <div className="text-sm font-semibold text-[var(--secondary-black)]">
                        Cash
                      </div>
                      <div className="mt-1 text-xs text-[var(--secondary-muted-edge)]">
                        Receive payouts in cash (offline).
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPayoutMethod("cheque")}
                      className={`rounded-xl border p-4 text-left transition-colors ${
                        payoutMethod === "cheque"
                          ? "border-[var(--primary-accent2)] bg-[var(--primary-background)]"
                          : "border-[var(--secondary-soft-highlight)] hover:bg-black/[0.02]"
                      }`}
                    >
                      <div className="text-sm font-semibold text-[var(--secondary-black)]">
                        Cheque
                      </div>
                      <div className="mt-1 text-xs text-[var(--secondary-muted-edge)]">
                        Receive payouts by cheque (offline).
                      </div>
                    </button>

                    <button
                      type="button"
                      disabled
                      className="rounded-xl border border-[var(--secondary-soft-highlight)] p-4 text-left opacity-70 cursor-not-allowed bg-gray-50"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-semibold text-[var(--secondary-black)]">
                          Bank transfer
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-200 text-gray-700">
                          Coming soon
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-[var(--secondary-muted-edge)]">
                        Bank connection is coming soon.
                      </div>
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => void handleSavePayoutMethod()}
                      disabled={savingPayout}
                      className="inline-flex items-center justify-center rounded-full bg-[var(--primary-accent2)] text-white px-5 py-2.5 text-xs font-medium hover:bg-[var(--primary-accent3)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {savingPayout ? "Saving..." : "Save payout preference"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-[var(--secondary-muted-edge)]">
                For payout history and individual transactions, visit{" "}
                <Link
                  href="/seller/transactions"
                  className="text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] underline"
                >
                  Seller → Transactions
                </Link>
                .
              </div>
            </div>
          </div>
        )}

        {/* Invite User Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--secondary-black)]">
                  Invite Team Member
                </h3>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@example.com"
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                    Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className={inputClassName}
                  >
                    <option value="member">Member</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800">
                  An invitation email will be sent to this address. Theyll need
                  to create an account or sign in to accept the invitation.
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 text-sm text-[var(--secondary-black)] hover:bg-gray-50 rounded-full border border-[var(--secondary-soft-highlight)]/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInviteUser}
                  disabled={inviteSubmitting || !inviteEmail.trim()}
                  className="flex-1 px-4 py-2 text-sm bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {inviteSubmitting ? "Sending..." : "Send Invitation"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
