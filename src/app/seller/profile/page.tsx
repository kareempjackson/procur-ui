"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectAuthUser } from "@/store/slices/authSlice";
import { useToast } from "@/components/ui/Toast";
import {
  fetchProfile,
  updateProfile,
  type UpdateProfileDto,
} from "@/store/slices/profileSlice";
import { getApiClient } from "@/lib/apiClient";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #ebe7df", borderRadius: 10 };
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 14px",
  fontSize: 13,
  border: "1px solid #ddd9d1",
  borderRadius: 8,
  outline: "none",
  background: "#fff",
  color: "#1c2b23",
  boxSizing: "border-box" as const,
};
const label: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: "#6a7f73", display: "block", marginBottom: 5 };
const primaryBtn: React.CSSProperties = { padding: "9px 20px", background: "#d4783c", color: "#fff", border: "none", borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: "pointer" };
const ghostBtn: React.CSSProperties = { padding: "9px 20px", background: "none", border: "1px solid #e8e4dc", borderRadius: 999, fontSize: 13, fontWeight: 500, color: "#1c2b23", cursor: "pointer" };

export default function SellerProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const profileState = useAppSelector((s) => s.profile);
  const profile = profileState.profile;
  const { show } = useToast();

  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const [fullname, setFullname] = useState(user?.fullname || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (profileState.status === "idle") dispatch(fetchProfile());
  }, [dispatch, profileState.status]);

  useEffect(() => {
    if (profile) {
      setFullname((profile.fullname?.trim()) || user?.fullname || "");
      setEmail(user?.email || profile.email || "");
      setPhone(profile.phone_number || "");
      const org = profile.organization;
      if (org) {
        const addr = org.address || [org.city, org.state, org.postalCode, org.country].filter(Boolean).join(", ");
        if (addr) setAddress(addr);
      }
    }
  }, [profile, user]);

  const displayName = fullname?.trim() || (email ? email.split("@")[0] : "User");
  const avatarUrl = avatarPreview || profile?.avatarUrl || user?.profileImg ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2d4a3e&color=fff&size=200`;

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { show("Please upload an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { show("Image must be less than 5MB"); return; }
    try {
      const client = getApiClient();
      const { data: signed } = await client.patch("/users/profile/avatar/signed-upload", { filename: file.name });
      await fetch(signed.signedUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
      await client.patch("/users/profile", { avatarPath: signed.path });
      await dispatch(fetchProfile());
      setAvatarPreview(null);
      show("Avatar updated!");
    } catch {
      show("Failed to upload avatar. Please try again.");
    }
  };

  const handleSaveProfile = async () => {
    const data: UpdateProfileDto = {
      fullname: fullname || undefined,
      phone: phone || undefined,
      address: address || undefined,
    };
    try {
      await dispatch(updateProfile(data)).unwrap();
      show("Profile saved.");
    } catch {
      show("Failed to save profile.");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) { show("Passwords do not match"); return; }
    if (newPassword.length < 8) { show("Password must be at least 8 characters"); return; }
    try {
      const client = getApiClient();
      await client.post("/auth/change-password", { currentPassword, newPassword });
      show("Password updated.");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch {
      show("Failed to update password. Check your current password.");
    }
  };

  const pwStrength = newPassword.length < 1 ? 0 : newPassword.length < 8 ? 1 : newPassword.length < 12 ? 2 : 3;

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f4", fontFamily: "'Urbanist', system-ui, sans-serif" }}>
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px" }}>

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1c2b23", margin: 0 }}>Profile Settings</h1>
          <p style={{ fontSize: 13, color: "#8a9e92", marginTop: 3 }}>Manage your personal information and security</p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #ebe7df", marginBottom: 24 }}>
          {(["profile", "password"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 20px",
                background: "none",
                border: "none",
                borderBottom: activeTab === tab ? "2px solid #d4783c" : "2px solid transparent",
                fontSize: 13,
                fontWeight: 600,
                color: activeTab === tab ? "#d4783c" : "#8a9e92",
                cursor: "pointer",
                marginBottom: -1,
              }}
            >
              {tab === "profile" ? "Profile Information" : "Security"}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div style={{ ...card, padding: "24px" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1c2b23", marginBottom: 20 }}>Personal Information</div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {/* Avatar */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ position: "relative" }}>
                  <img src={avatarUrl} alt={displayName} style={{ width: 88, height: 88, borderRadius: "50%", objectFit: "cover", border: "2px solid #e8e4dc" }} />
                  <label style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.45)", borderRadius: "50%", cursor: "pointer", opacity: 0 }} onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")} onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" width={20} height={20}><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>
                    <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
                  </label>
                </div>
                <div style={{ fontSize: 11, color: "#8a9e92", textAlign: "center" }}>Click to upload<br />Max 5MB</div>
              </div>

              {/* Form */}
              <div style={{ flex: 1, minWidth: 280, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <span style={label}>Full Name *</span>
                  <input type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} placeholder="Your full name" style={inputStyle} />
                </div>
                <div>
                  <span style={label}>Email Address *</span>
                  <input type="email" value={email} disabled readOnly style={{ ...inputStyle, background: "#f4f1eb", color: "#8a9e92", cursor: "not-allowed" }} />
                  <span style={{ fontSize: 10, color: "#8a9e92", marginTop: 3, display: "block" }}>Contact support to change email</span>
                </div>
                <div>
                  <span style={label}>Phone Number</span>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" style={inputStyle} />
                </div>
                <div>
                  <span style={label}>Account Type</span>
                  <input type="text" disabled value={(user?.accountType || "").toString().toUpperCase()} style={{ ...inputStyle, background: "#f4f1eb", color: "#8a9e92", cursor: "not-allowed" }} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <span style={label}>Address</span>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, city, state, postal code" style={inputStyle} />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20, paddingTop: 16, borderTop: "1px solid #f0ece4" }}>
              <button style={ghostBtn}>Cancel</button>
              <button onClick={handleSaveProfile} style={primaryBtn}>Save Changes</button>
            </div>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <div style={{ ...card, padding: "24px" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1c2b23", marginBottom: 20 }}>Change Password</div>
            <div style={{ maxWidth: 480, display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <span style={label}>Current Password</span>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" style={inputStyle} />
              </div>
              <div>
                <span style={label}>New Password</span>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 8 characters" style={inputStyle} />
                {newPassword && (
                  <div style={{ marginTop: 8, padding: "10px 12px", background: "#f4f1eb", borderRadius: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#1c2b23", marginBottom: 6 }}>Password Strength</div>
                    <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                      {[1, 2, 3].map((n) => (
                        <div key={n} style={{ height: 4, flex: 1, borderRadius: 999, background: n <= pwStrength ? (pwStrength === 1 ? "#d04040" : pwStrength === 2 ? "#e09020" : "#2d7a46") : "#e8e4dc" }} />
                      ))}
                    </div>
                    <div style={{ fontSize: 11, color: pwStrength === 1 ? "#d04040" : pwStrength === 2 ? "#c26838" : "#1a4035" }}>
                      {pwStrength === 1 ? "Weak" : pwStrength === 2 ? "Moderate" : "Strong"}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <span style={label}>Confirm New Password</span>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat new password" style={inputStyle} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20, paddingTop: 16, borderTop: "1px solid #f0ece4" }}>
              <button onClick={() => { setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }} style={ghostBtn}>Cancel</button>
              <button onClick={handleChangePassword} style={primaryBtn}>Change Password</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
