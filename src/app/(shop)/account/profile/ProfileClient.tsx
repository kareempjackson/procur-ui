"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchProfile,
  updateProfile,
  inviteOrganizationMember,
  removeOrganizationMember,
  type UpdateProfileDto,
} from "@/store/slices/profileSlice";
import ProcurLoader from "@/components/ProcurLoader";
import { getApiClient } from "@/lib/apiClient";
import { useToast } from "@/components/ui/Toast";
import { fetchActiveCountries, selectCountries } from "@/store/slices/countrySlice";

// Design tokens
const T = {
  pageBg: "#faf8f4",
  cardBg: "#f5f1ea",
  cardBorder: "#e8e4dc",
  teal: "#2d4a3e",
  orange: "#d4783c",
  orangeHover: "#c26838",
  dark: "#1c2b23",
  muted: "#8a9e92",
  tealText: "#3e5549",
  font: "'Urbanist', system-ui, sans-serif",
  radius: "12px",
  btnRadius: "999px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 16px",
  fontSize: 13,
  border: `1px solid ${T.cardBorder}`,
  borderRadius: 8,
  background: "#fff",
  color: T.dark,
  outline: "none",
  fontFamily: T.font,
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: T.dark,
  marginBottom: 6,
};

export default function ProfileClient() {
  const dispatch = useAppDispatch();
  const { profile, preferences, organizationMembers, membersStatus } =
    useAppSelector((state) => state.profile);
  const availableCountries = useAppSelector(selectCountries);

  useEffect(() => {
    dispatch(fetchActiveCountries());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    organizationName: "",
    businessType: "",
    taxId: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
  });
  const { show } = useToast();

  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        fullname: profile.fullname || "",
        email: profile.email || "",
        phone: profile.phone_number || "",
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
    "profile" | "security" | "notifications"
  >("profile");

  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handlePickAvatar = () => fileInputRef.current?.click();

  const avatarUrl = profile?.avatarUrl ?? undefined;

  const handleAvatarSelected = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/^image\//.test(file.type)) {
      show("Please select an image file");
      return;
    }

    setAvatarUploading(true);
    try {
      const client = getApiClient();
      const { data: signed } = await client.patch(
        "/users/profile/avatar/signed-upload",
        { filename: file.name }
      );

      await fetch(signed.signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      await client.patch("/users/profile", { avatarPath: signed.path });
      await dispatch(fetchProfile());
      show("Avatar updated successfully!");
    } catch (err) {
      console.error("Avatar upload failed", err);
      show("Failed to upload avatar. Please try again.");
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

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordUpdating, setPasswordUpdating] = useState(false);

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

    if (activeTab === "profile") {
      // Send raw values — empty string means the user explicitly cleared
      // the field, and the backend DTO now persists that as an actual clear.
      const updateData: UpdateProfileDto = {
        fullname: formData.fullname,
        phone: formData.phone,
        businessName: formData.organizationName,
        businessType: formData.businessType,
        address: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
      };

      try {
        await dispatch(updateProfile(updateData)).unwrap();
        show("Profile updated successfully!");
      } catch (err) {
        show(`Failed to update profile: ${err}`);
      }
    }

    if (activeTab === "notifications") {
      show("Preferences saved locally (API integration pending)");
    }
  };

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.name) {
      show("Please fill in all required fields");
      return;
    }

    try {
      await dispatch(inviteOrganizationMember(newUser)).unwrap();
      setShowAddUserModal(false);
      setNewUser({ name: "", email: "", role: "purchaser" });
      show(`Invitation sent to ${newUser.email}`);
    } catch (err) {
      console.log("Member invite not available:", err);
      show(
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
      show("User removed successfully");
    } catch (err) {
      console.log("Member removal not available:", err);
      show("User removal feature pending API integration");
    }
  };

  const handleChangeRole = (userId: string, newRole: string) => {
    console.log("Change role not yet implemented:", userId, newRole);
    show("Role change feature pending API integration");
  };

  const tabs: { key: "profile" | "security" | "notifications"; label: string }[] = [
    { key: "profile", label: "Profile Information" },
    { key: "security", label: "Security" },
    { key: "notifications", label: "Notifications" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.pageBg, fontFamily: T.font }}>
      <div style={{ maxWidth: 896, margin: "0 auto", padding: "40px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: T.dark, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
              Profile Settings
            </h1>
            <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>
              Manage your personal information and account preferences
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Avatar with upload overlay */}
            <div
              style={{ position: "relative", width: 56, height: 56, borderRadius: "50%", cursor: "pointer" }}
              onClick={handlePickAvatar}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: `2px solid ${T.cardBorder}`,
                  background: T.cardBg,
                }}
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: T.muted,
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                )}
              </div>
              {/* Upload overlay */}
              {avatarUploading && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.45)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
                    <polyline points="23 4 23 10 17 10"/>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                  </svg>
                </div>
              )}
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAvatarSelected}
              />
              <button
                type="button"
                onClick={handlePickAvatar}
                disabled={avatarUploading}
                style={{
                  padding: "8px 18px",
                  borderRadius: T.btnRadius,
                  fontSize: 13,
                  fontWeight: 600,
                  background: T.orange,
                  color: "#fff",
                  border: "none",
                  cursor: avatarUploading ? "not-allowed" : "pointer",
                  opacity: avatarUploading ? 0.6 : 1,
                  fontFamily: T.font,
                }}
              >
                {avatarUploading ? "Uploading..." : "Upload Avatar"}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 0,
            borderBottom: `1px solid ${T.cardBorder}`,
            marginBottom: 24,
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: "10px 18px",
                  fontSize: 13,
                  fontWeight: 600,
                  background: "none",
                  border: "none",
                  borderBottom: isActive ? `2px solid ${T.teal}` : "2px solid transparent",
                  color: isActive ? T.teal : T.muted,
                  cursor: "pointer",
                  marginBottom: -1,
                  fontFamily: T.font,
                  transition: "color 0.15s, border-color 0.15s",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Profile Information Tab */}
          {activeTab === "profile" && (
            <>
              {/* Personal Information */}
              <div
                style={{
                  background: "#fff",
                  border: `1px solid ${T.cardBorder}`,
                  borderRadius: T.radius,
                  padding: "20px 24px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.orange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: T.dark, margin: 0 }}>Personal Information</h2>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input type="text" name="fullname" value={formData.fullname} onChange={handleInputChange} style={inputStyle} required />
                  </div>
                  <div>
                    <label style={labelStyle}>Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} style={inputStyle} required />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} style={inputStyle} />
                  </div>
                </div>
              </div>

              {/* Organization Information */}
              <div
                style={{
                  background: "#fff",
                  border: `1px solid ${T.cardBorder}`,
                  borderRadius: T.radius,
                  padding: "20px 24px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.orange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: T.dark, margin: 0 }}>Organization Information</h2>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Organization Name *</label>
                    <input type="text" name="organizationName" value={formData.organizationName} onChange={handleInputChange} style={inputStyle} required />
                  </div>
                  <div>
                    <label style={labelStyle}>Business Type</label>
                    <select name="businessType" value={formData.businessType} onChange={handleInputChange} style={inputStyle}>
                      {formData.businessType &&
                        !["Restaurant", "Hotel", "Retailer", "Wholesaler", "Processor", "Other", "supermarkets", "Supermarkets"].includes(formData.businessType) && (
                          <option value={formData.businessType}>{formData.businessType}</option>
                        )}
                      <option value="supermarkets">Supermarkets</option>
                      <option>Restaurant</option>
                      <option>Hotel</option>
                      <option>Retailer</option>
                      <option>Wholesaler</option>
                      <option>Processor</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Tax ID / Business Number</label>
                    <input type="text" name="taxId" value={formData.taxId} onChange={handleInputChange} style={inputStyle} />
                  </div>
                </div>
              </div>

              {/* Business Address */}
              <div
                style={{
                  background: "#fff",
                  border: `1px solid ${T.cardBorder}`,
                  borderRadius: T.radius,
                  padding: "20px 24px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.orange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: T.dark, margin: 0 }}>Business Address</h2>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Street Address</label>
                    <input type="text" name="street" value={formData.street} onChange={handleInputChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>State / Region</label>
                    <input type="text" name="state" value={formData.state} onChange={handleInputChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Postal Code</label>
                    <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Country</label>
                    <select name="country" value={formData.country} onChange={handleInputChange} style={inputStyle}>
                      <option value="">Select country</option>
                      {availableCountries.map((c) => (
                        <option key={c.code} value={c.name}>{c.name}</option>
                      ))}
                      {formData.country && !availableCountries.some((c) => c.name === formData.country) && (
                        <option value={formData.country}>{formData.country}</option>
                      )}
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div
              style={{
                background: "#fff",
                border: `1px solid ${T.cardBorder}`,
                borderRadius: T.radius,
                padding: "20px 24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.orange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: T.dark, margin: 0 }}>Change Password</h2>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 440 }}>
                <div>
                  <label style={labelStyle}>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    value={passwordForm.confirmNewPassword}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmNewPassword: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
                <button
                  type="button"
                  disabled={passwordUpdating}
                  onClick={async () => {
                    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
                      show("Please enter your current and new password.");
                      return;
                    }
                    if (passwordForm.newPassword.length < 8) {
                      show("New password must be at least 8 characters.");
                      return;
                    }
                    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
                      show("New passwords do not match.");
                      return;
                    }
                    setPasswordUpdating(true);
                    try {
                      const client = getApiClient();
                      await client.post("/auth/change-password", {
                        currentPassword: passwordForm.currentPassword,
                        newPassword: passwordForm.newPassword,
                      });
                      setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
                      show("Password updated successfully.");
                    } catch (err: unknown) {
                      console.error("Change password failed:", err);
                      const message =
                        (err as { message?: string })?.message ||
                        "Failed to update password. Please try again.";
                      show(message);
                    } finally {
                      setPasswordUpdating(false);
                    }
                  }}
                  style={{
                    padding: "10px 22px",
                    background: T.orange,
                    border: "none",
                    borderRadius: T.btnRadius,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#fff",
                    cursor: passwordUpdating ? "not-allowed" : "pointer",
                    opacity: passwordUpdating ? 0.6 : 1,
                    alignSelf: "flex-start",
                    fontFamily: T.font,
                  }}
                >
                  {passwordUpdating ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div
              style={{
                background: "#fff",
                border: `1px solid ${T.cardBorder}`,
                borderRadius: T.radius,
                padding: "20px 24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.orange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: T.dark, margin: 0 }}>Notification Preferences</h2>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                {[
                  { name: "emailNotifications", label: "Email Notifications", desc: "Receive order updates and account notifications via email", checked: formData.emailNotifications },
                  { name: "smsNotifications", label: "SMS Notifications", desc: "Receive important updates via text message", checked: formData.smsNotifications },
                  { name: "marketingEmails", label: "Marketing Emails", desc: "Receive news, offers, and product updates", checked: formData.marketingEmails },
                ].map((pref, idx, arr) => (
                  <div
                    key={pref.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 0",
                      borderBottom: idx < arr.length - 1 ? `1px solid ${T.cardBorder}` : "none",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.dark }}>{pref.label}</div>
                      <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{pref.desc}</div>
                    </div>
                    <label style={{ position: "relative", display: "inline-flex", alignItems: "center", cursor: "pointer", flexShrink: 0, marginLeft: 16 }}>
                      <input
                        type="checkbox"
                        name={pref.name}
                        checked={pref.checked}
                        onChange={handleInputChange}
                        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
                      />
                      <div
                        style={{
                          width: 44,
                          height: 24,
                          borderRadius: T.btnRadius,
                          background: pref.checked ? T.teal : T.cardBorder,
                          position: "relative",
                          transition: "background 0.2s",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: 2,
                            left: pref.checked ? 22 : 2,
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: "#fff",
                            transition: "left 0.2s",
                          }}
                        />
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save / Cancel buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
            <button
              type="button"
              style={{
                padding: "11px 24px",
                borderRadius: T.btnRadius,
                fontWeight: 700,
                fontSize: 14,
                border: `1px solid ${T.cardBorder}`,
                background: T.cardBg,
                color: T.dark,
                cursor: "pointer",
                fontFamily: T.font,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "11px 24px",
                background: T.orange,
                border: "none",
                borderRadius: T.btnRadius,
                fontWeight: 700,
                fontSize: 14,
                color: "#fff",
                cursor: "pointer",
                fontFamily: T.font,
              }}
            >
              Save Changes
            </button>
          </div>
        </form>

        {/* Add User Modal */}
        {showAddUserModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
          >
            <div
              style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }}
              onClick={() => setShowAddUserModal(false)}
            />
            <div
              style={{
                position: "relative",
                background: "#fff",
                borderRadius: T.radius,
                border: `1px solid ${T.cardBorder}`,
                width: "100%",
                maxWidth: 448,
                padding: "24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: T.dark, margin: 0 }}>Add Team Member</h3>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 4 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="John Smith"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="john.smith@example.com"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value }))}
                    style={inputStyle}
                  >
                    <option value="purchaser">Purchaser</option>
                    <option value="viewer">Viewer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div
                  style={{
                    background: "#f0f7f4",
                    border: `1px solid ${T.teal}30`,
                    borderRadius: 8,
                    padding: "10px 14px",
                  }}
                >
                  <p style={{ fontSize: 12, color: T.tealText, margin: 0 }}>
                    An invitation email will be sent to this address with instructions to join your account.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    border: `1px solid ${T.cardBorder}`,
                    background: T.cardBg,
                    borderRadius: T.btnRadius,
                    fontSize: 13,
                    fontWeight: 700,
                    color: T.dark,
                    cursor: "pointer",
                    fontFamily: T.font,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddUser}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    background: T.orange,
                    border: "none",
                    borderRadius: T.btnRadius,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#fff",
                    cursor: "pointer",
                    fontFamily: T.font,
                  }}
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
