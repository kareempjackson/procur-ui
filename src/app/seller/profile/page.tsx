"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  UserCircleIcon,
  KeyIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectAuthUser } from "@/store/slices/authSlice";
import { useToast } from "@/components/ui/Toast";
import {
  fetchProfile,
  updateProfile,
  type UpdateProfileDto,
} from "@/store/slices/profileSlice";
import { getApiClient } from "@/lib/apiClient";

export default function SellerProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const profileState = useAppSelector((state) => state.profile);
  const profile = profileState.profile;
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  // Profile State
  const [fullname, setFullname] = useState(user?.fullname || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { show } = useToast();

  // Load profile data on mount
  useEffect(() => {
    if (profileState.status === "idle") {
      dispatch(fetchProfile());
    }
  }, [dispatch, profileState.status]);

  // Sync local form state when profile loads
  useEffect(() => {
    if (profile) {
      setFullname(
        (profile.fullname && profile.fullname.trim()) || user?.fullname || ""
      );
      setEmail(user?.email || profile.email || "");
      setPhone(profile.phone_number || "");

      const org = profile.organization;
      if (org) {
        const combinedAddress =
          org.address ||
          [org.city, org.state, org.postalCode, org.country]
            .filter(Boolean)
            .join(", ");
        if (combinedAddress) {
          setAddress(combinedAddress);
        }
      }
    }
  }, [profile, user]);

  const displayName =
    (fullname && fullname.trim()) || (email ? email.split("@")[0] : "User");
  const defaultAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    displayName
  )}&background=407178&color=fff&size=200`;
  const avatarUrl =
    avatarPreview || profile?.avatarUrl || user?.profileImg || defaultAvatarUrl;

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setAvatarFile(file);

    try {
      const client = getApiClient();

      // 1) Get signed upload URL
      const { data: signed } = await client.patch(
        "/users/profile/avatar/signed-upload",
        { filename: file.name }
      );

      // 2) Upload directly to Supabase Storage
      await fetch(signed.signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      // 3) Persist avatar path on profile
      await client.patch("/users/profile", { avatarPath: signed.path });

      // 4) Refresh profile to get signed download URL
      await dispatch(fetchProfile());
      setAvatarPreview(null);
      show("Avatar updated successfully!");
    } catch (err) {
      console.error("Avatar upload failed", err);
      show("Failed to upload avatar. Please try again.");
    }
  };

  const handleSaveProfile = async () => {
    const updateData: UpdateProfileDto = {
      fullname: fullname || undefined,
      phone: phone || undefined,
      address: address || undefined,
    };

    try {
      await dispatch(updateProfile(updateData)).unwrap();
      show("Profile updated successfully.");
    } catch (err) {
      console.error("Failed to update profile:", err);
      show("Failed to update profile. Please try again.");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      show("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      show("Password must be at least 8 characters");
      return;
    }

    try {
      const client = getApiClient();
      await client.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      show("Password updated successfully.");
    } catch (err: unknown) {
      console.error("Change password failed:", err);
      show("Failed to update password. Please check your current password.");
      return;
    }

    // Clear form
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const inputClassName =
    "w-full px-4 py-2.5 text-sm rounded-full border border-gray-200 bg-white outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]";

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-5xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--secondary-black)] mb-1">
            Profile Settings
          </h1>
          <p className="text-sm text-[var(--secondary-muted-edge)]">
            Manage your personal information and account preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[var(--secondary-soft-highlight)]/30">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTab === "profile"
                ? "text-[var(--primary-accent2)] border-[var(--primary-accent2)]"
                : "text-[var(--secondary-muted-edge)] border-transparent hover:text-[var(--secondary-black)]"
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTab === "password"
                ? "text-[var(--primary-accent2)] border-[var(--primary-accent2)]"
                : "text-[var(--secondary-muted-edge)] border-transparent hover:text-[var(--secondary-black)]"
            }`}
          >
            Security
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20">
            <div className="flex items-center gap-2 mb-4">
              <UserCircleIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
              <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
                Personal Information
              </h2>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative group">
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-24 h-24 rounded-full object-cover border-2 border-[var(--secondary-soft-highlight)]/30"
                  />
                  <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <CameraIcon className="w-6 h-6 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="text-center">
                  <div className="text-xs text-[var(--secondary-muted-edge)]">
                    Click to upload
                  </div>
                  <div className="text-xs text-[var(--secondary-muted-edge)] mt-0.5">
                    Max size: 5MB
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    placeholder="Your full name"
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    readOnly
                    placeholder="you@example.com"
                    className={`${inputClassName} bg-gray-50 text-gray-500 cursor-not-allowed`}
                  />
                  <p className="mt-1 text-[11px] text-[var(--secondary-muted-edge)]">
                    Contact support if you need to change your login email.
                  </p>
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

                <div>
                  <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                    Account Type
                  </label>
                  <input
                    type="text"
                    disabled
                    value={(user?.accountType || "").toString().toUpperCase()}
                    className="w-full px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-gray-50 text-gray-600 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                    Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street address, city, state, postal code"
                    className={inputClassName}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-3 pt-4 border-t border-[var(--secondary-soft-highlight)]/30">
              <button
                type="button"
                className="px-5 py-2 text-sm text-[var(--secondary-black)] hover:bg-gray-50 rounded-full transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-5 py-2 text-sm bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20">
            <div className="flex items-center gap-2 mb-4">
              <KeyIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
              <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
                Change Password
              </h2>
            </div>

            <div className="max-w-xl">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className={inputClassName}
                  />
                  <p className="mt-1.5 text-xs text-[var(--secondary-muted-edge)]">
                    Password must be at least 8 characters long
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className={inputClassName}
                  />
                </div>

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                    <div className="text-xs font-semibold text-blue-900 mb-2">
                      Password Strength
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded-full ${
                            newPassword.length >= level * 2
                              ? newPassword.length < 8
                                ? "bg-red-500"
                                : newPassword.length < 12
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-blue-800">
                      {newPassword.length < 8
                        ? "Weak password"
                        : newPassword.length < 12
                          ? "Moderate password"
                          : "Strong password"}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-[var(--secondary-soft-highlight)]/30">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="px-5 py-2 text-sm text-[var(--secondary-black)] hover:bg-gray-50 rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleChangePassword}
                  className="px-5 py-2 text-sm bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] transition-colors font-medium"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
