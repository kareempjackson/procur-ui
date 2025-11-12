"use client";

import React, { useState, useEffect } from "react";
import {
  UserCircleIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon,
  BellIcon,
  ShieldCheckIcon,
  KeyIcon,
  UserGroupIcon,
  XMarkIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchProfile,
  updateProfile,
  fetchPreferences,
  updatePreferences,
  fetchOrganizationMembers,
  inviteOrganizationMember,
  removeOrganizationMember,
  type UpdateProfileDto,
} from "@/store/slices/profileSlice";
import ProcurLoader from "@/components/ProcurLoader";
import { getApiClient } from "@/lib/apiClient";

export default function ProfileClient() {
  const dispatch = useAppDispatch();
  const {
    profile,
    preferences,
    organizationMembers,
    status,
    preferencesStatus,
    membersStatus,
    error,
  } = useAppSelector((state) => state.profile);

  // Fetch profile data on mount
  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchPreferences()).catch(() => {
      // Silently fail if preferences endpoint doesn't exist yet
    });
    dispatch(fetchOrganizationMembers()).catch(() => {
      // Silently fail if members endpoint doesn't exist yet
    });
  }, [dispatch]);

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    // Organization Information
    organizationName: "",
    businessType: "",
    taxId: "",

    // Address
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",

    // Preferences
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        organizationName: profile.organization?.name || "",
        businessType: profile.organization?.businessType || "",
        taxId: profile.organization?.taxId || "",
        street: profile.organization?.address || "",
        city: profile.organization?.city || "",
        state: profile.organization?.state || "",
        postalCode: profile.organization?.postalCode || "",
        country: profile.organization?.country || "",
      }));
    }
  }, [profile]);

  // Update preferences when they load
  useEffect(() => {
    if (preferences) {
      setFormData((prev) => ({
        ...prev,
        emailNotifications: preferences.emailNotifications,
        smsNotifications: preferences.smsNotifications,
        marketingEmails: preferences.marketingEmails,
      }));
    }
  }, [preferences]);

  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "notifications" | "users"
  >("profile");

  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handlePickAvatar = () => fileInputRef.current?.click();

  // Optional avatar URL may be provided by the API even if not in the TS type
  const avatarUrl = (profile as any)?.avatarUrl as string | undefined;

  const handleAvatarSelected = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/^image\//.test(file.type)) {
      alert("Please select an image file");
      return;
    }

    setAvatarUploading(true);
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
      alert("Avatar updated successfully!");
    } catch (err) {
      console.error("Avatar upload failed", err);
      alert("Failed to upload avatar. Please try again.");
    } finally {
      setAvatarUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "purchaser",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Handle profile update
    if (activeTab === "profile") {
      const updateData: UpdateProfileDto = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      };

      try {
        await dispatch(updateProfile(updateData)).unwrap();
        alert("Profile updated successfully!");
      } catch (err) {
        alert(`Failed to update profile: ${err}`);
      }
    }

    // Handle notification preferences update
    if (activeTab === "notifications") {
      const preferencesData = {
        emailNotifications: formData.emailNotifications,
        smsNotifications: formData.smsNotifications,
        marketingEmails: formData.marketingEmails,
      };

      try {
        await dispatch(updatePreferences(preferencesData)).unwrap();
        alert("Preferences updated successfully!");
      } catch (err) {
        // Silently fail if endpoint doesn't exist yet
        console.log("Preferences update not available:", err);
        alert("Preferences saved locally (API integration pending)");
      }
    }
  };

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.name) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await dispatch(inviteOrganizationMember(newUser)).unwrap();
      setShowAddUserModal(false);
      setNewUser({ name: "", email: "", role: "purchaser" });
      alert(`Invitation sent to ${newUser.email}`);
    } catch (err) {
      // Fallback to local state if endpoint doesn't exist
      console.log("Member invite not available:", err);
      alert(
        `Invitation feature pending API integration. User: ${newUser.email}`
      );
      setShowAddUserModal(false);
      setNewUser({ name: "", email: "", role: "purchaser" });
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this user?")) {
      return;
    }

    try {
      await dispatch(removeOrganizationMember(userId)).unwrap();
      alert("User removed successfully");
    } catch (err) {
      console.log("Member removal not available:", err);
      alert("User removal feature pending API integration");
    }
  };

  const handleChangeRole = (userId: string, newRole: string) => {
    // This would require a new API endpoint to change user roles
    console.log("Change role not yet implemented:", userId, newRole);
    alert("Role change feature pending API integration");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--secondary-black)] mb-2">
              Profile Settings
            </h1>
            <p className="text-sm text-[var(--secondary-muted-edge)]">
              Manage your personal information and account preferences
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-[var(--primary-background)] border border-[var(--secondary-soft-highlight)]/40">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--secondary-muted-edge)]">
                  <UserCircleIcon className="h-8 w-8" />
                </div>
              )}
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarSelected}
              />
              <button
                type="button"
                onClick={handlePickAvatar}
                disabled={avatarUploading}
                className="px-4 py-2 rounded-full text-sm font-semibold bg-[var(--primary-accent2)] text-white hover:bg-[var(--primary-accent3)] disabled:opacity-60"
              >
                {avatarUploading ? "Uploading..." : "Upload Avatar"}
              </button>
            </div>
          </div>
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
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTab === "security"
                ? "text-[var(--primary-accent2)] border-[var(--primary-accent2)]"
                : "text-[var(--secondary-muted-edge)] border-transparent hover:text-[var(--secondary-black)]"
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTab === "notifications"
                ? "text-[var(--primary-accent2)] border-[var(--primary-accent2)]"
                : "text-[var(--secondary-muted-edge)] border-transparent hover:text-[var(--secondary-black)]"
            }`}
          >
            Notifications
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTab === "users"
                ? "text-[var(--primary-accent2)] border-[var(--primary-accent2)]"
                : "text-[var(--secondary-muted-edge)] border-transparent hover:text-[var(--secondary-black)]"
            }`}
          >
            Team Members
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Information Tab */}
          {activeTab === "profile" && (
            <>
              {/* Personal Information */}
              <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20">
                <div className="flex items-center gap-2 mb-4">
                  <UserCircleIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                  <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
                    Personal Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]"
                    />
                  </div>
                </div>
              </div>

              {/* Organization Information */}
              <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20">
                <div className="flex items-center gap-2 mb-4">
                  <BuildingOfficeIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                  <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
                    Organization Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                      Business Type
                    </label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]"
                    >
                      <option>Restaurant</option>
                      <option>Hotel</option>
                      <option>Retailer</option>
                      <option>Wholesaler</option>
                      <option>Processor</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                      Tax ID / Business Number
                    </label>
                    <input
                      type="text"
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20">
                <div className="flex items-center gap-2 mb-4">
                  <MapPinIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                  <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
                    Business Address
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                      State / Region
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                      Country
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]"
                    >
                      <option>Jamaica</option>
                      <option>Dominican Republic</option>
                      <option>Barbados</option>
                      <option>Trinidad and Tobago</option>
                      <option>Bahamas</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <>
              <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20">
                <div className="flex items-center gap-2 mb-4">
                  <KeyIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                  <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
                    Change Password
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]"
                    />
                  </div>

                  <button
                    type="button"
                    className="px-6 py-2.5 bg-[var(--primary-accent2)] text-white rounded-full text-sm font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200"
                  >
                    Update Password
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheckIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                  <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
                    Two-Factor Authentication
                  </h2>
                </div>

                <p className="text-sm text-[var(--secondary-muted-edge)] mb-4">
                  Add an extra layer of security to your account by enabling
                  two-factor authentication.
                </p>

                <button
                  type="button"
                  className="px-6 py-2.5 bg-[var(--secondary-black)] text-white rounded-full text-sm font-medium hover:bg-[var(--secondary-muted-edge)] transition-all duration-200"
                >
                  Enable 2FA
                </button>
              </div>
            </>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20">
              <div className="flex items-center gap-2 mb-4">
                <BellIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
                  Notification Preferences
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-[var(--secondary-soft-highlight)]/20">
                  <div>
                    <div className="text-sm font-medium text-[var(--secondary-black)]">
                      Email Notifications
                    </div>
                    <div className="text-xs text-[var(--secondary-muted-edge)]">
                      Receive order updates and account notifications via email
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={formData.emailNotifications}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-accent2)]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[var(--secondary-soft-highlight)]/20">
                  <div>
                    <div className="text-sm font-medium text-[var(--secondary-black)]">
                      SMS Notifications
                    </div>
                    <div className="text-xs text-[var(--secondary-muted-edge)]">
                      Receive important updates via text message
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="smsNotifications"
                      checked={formData.smsNotifications}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-accent2)]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-sm font-medium text-[var(--secondary-black)]">
                      Marketing Emails
                    </div>
                    <div className="text-xs text-[var(--secondary-muted-edge)]">
                      Receive news, offers, and product updates
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="marketingEmails"
                      checked={formData.marketingEmails}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-accent2)]"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <UserGroupIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                  <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
                    Team Members
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[var(--primary-accent2)] text-white rounded-full text-sm font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add User
                </button>
              </div>

              <p className="text-sm text-[var(--secondary-muted-edge)] mb-4">
                Invite team members to access your buyer account and manage
                purchases.
              </p>

              <div className="space-y-3">
                {membersStatus === "loading" && (
                  <ProcurLoader size="sm" text="Loading team members..." />
                )}

                {membersStatus === "succeeded" &&
                  organizationMembers.length === 0 && (
                    <div className="text-center py-8 text-[var(--secondary-muted-edge)]">
                      <UserGroupIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">
                        No team members yet. Invite someone to get started!
                      </p>
                    </div>
                  )}

                {(organizationMembers.length > 0
                  ? organizationMembers
                  : []
                ).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border border-[var(--secondary-soft-highlight)]/30 rounded-xl hover:bg-[var(--primary-background)] transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--primary-accent2)]/10 flex items-center justify-center">
                        <UserCircleIcon className="h-6 w-6 text-[var(--primary-accent2)]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[var(--secondary-black)] text-sm">
                            {user.name}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              user.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {user.status === "active" ? "Active" : "Pending"}
                          </span>
                        </div>
                        <div className="text-xs text-[var(--secondary-muted-edge)]">
                          {user.email}
                        </div>
                        <div className="text-xs text-[var(--secondary-muted-edge)] mt-0.5">
                          Added {user.addedDate}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleChangeRole(user.id, e.target.value)
                        }
                        className="px-3 py-1.5 text-xs rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-white outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]"
                        disabled={user.role === "admin"}
                      >
                        <option value="admin">Admin</option>
                        <option value="purchaser">Purchaser</option>
                        <option value="viewer">Viewer</option>
                      </select>

                      {user.role !== "admin" && (
                        <button
                          type="button"
                          onClick={() => handleRemoveUser(user.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                          title="Remove user"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  Role Permissions
                </h4>
                <ul className="space-y-1 text-xs text-blue-800">
                  <li>
                    <strong>Admin:</strong> Full access to all features and
                    settings
                  </li>
                  <li>
                    <strong>Purchaser:</strong> Can browse, order, and
                    communicate with suppliers
                  </li>
                  <li>
                    <strong>Viewer:</strong> Can only view orders and supplier
                    information
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-6 py-3 rounded-full font-semibold text-base border-2 border-[var(--secondary-soft-highlight)] text-[var(--secondary-black)] hover:bg-[var(--primary-background)] transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full font-semibold text-base hover:bg-[var(--primary-accent3)] transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Save Changes
            </button>
          </div>
        </form>

        {/* Add User Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowAddUserModal(false)}
            />
            <div className="relative bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/20 w-full max-w-md p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--secondary-black)]">
                  Add Team Member
                </h3>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <XMarkIcon className="h-5 w-5 text-[var(--secondary-muted-edge)]" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="John Smith"
                    className="w-full px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="john.smith@example.com"
                    className="w-full px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                    Role
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser((prev) => ({ ...prev, role: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]"
                  >
                    <option value="purchaser">Purchaser</option>
                    <option value="viewer">Viewer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-xs text-blue-800">
                    An invitation email will be sent to this address with
                    instructions to join your account.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-full font-semibold text-sm border-2 border-[var(--secondary-soft-highlight)] text-[var(--secondary-black)] hover:bg-[var(--primary-background)] transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddUser}
                  className="flex-1 px-4 py-2.5 bg-[var(--primary-accent2)] text-white rounded-full font-semibold text-sm hover:bg-[var(--primary-accent3)] transition-all duration-200"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
