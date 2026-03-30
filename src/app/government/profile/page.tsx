"use client";

import { useState } from "react";
import { useAppSelector } from "@/store";
import { selectAuthUser } from "@/store/slices/authSlice";
import { useToast } from "@/components/ui/Toast";
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  PencilIcon,
  UserPlusIcon,
  TrashIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import {
  GOV,
  govCard,
  govPageTitle,
  govPageSubtitle,
  govPillButton,
  govPrimaryButton,
  govHoverBg,
} from "../styles";

/* ── Inline style helpers ─────────────────────────────────────────────────── */

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #ebe7df",
  borderRadius: 8,
  padding: "10px 14px",
  fontSize: 13,
  color: GOV.text,
  background: "#fff",
  outline: "none",
  fontFamily: "inherit",
};

const readOnlyFieldStyle: React.CSSProperties = {
  padding: "10px 14px",
  fontSize: 13,
  color: GOV.text,
  background: GOV.bg,
  borderRadius: 8,
  border: "1px solid transparent",
};

const labelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontSize: 12,
  fontWeight: 600,
  color: GOV.text,
  marginBottom: 6,
};

const labelPlainStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: GOV.text,
  marginBottom: 6,
};

const iconMutedStyle: React.CSSProperties = {
  width: 16,
  height: 16,
  color: "#8a9e92",
};

const statRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "6px 0",
};

const roleBadge = (role: string): React.CSSProperties => {
  const map: Record<string, { bg: string; color: string }> = {
    admin: { bg: "#f3e8ff", color: "#7c3aed" },
    officer: { bg: "#dbeafe", color: "#1d4ed8" },
    viewer: { bg: "#f5f1ea", color: "#8a9e92" },
  };
  const s = map[role] ?? map.viewer;
  return {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 4,
    fontSize: 10.5,
    fontWeight: 700,
    background: s.bg,
    color: s.color,
    textTransform: "capitalize",
  };
};

const statusBadge = (status: string): React.CSSProperties => {
  const map: Record<string, { bg: string; color: string }> = {
    active: { bg: "#d1fae5", color: "#065f46" },
    pending: { bg: "#fef3c7", color: "#92400e" },
  };
  const s = map[status] ?? { bg: "#f5f1ea", color: "#8a9e92" };
  return {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 4,
    fontSize: 10.5,
    fontWeight: 700,
    background: s.bg,
    color: s.color,
    textTransform: "capitalize",
  };
};

export default function ProfilePage() {
  const authUser = useAppSelector(selectAuthUser);
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "users">(
    "profile"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const { show } = useToast();

  /* hover states for interactive rows */
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  // Mock profile data - will be replaced with real data
  const [formData, setFormData] = useState({
    fullName: authUser?.fullname || "John Doe",
    email: authUser?.email || "john.doe@gov.gd",
    phone: "+1 473-440-2708",
    organization:
      authUser?.organizationName ||
      "Ministry of Agriculture, Lands and Forestry",
    department: "Agricultural Development Division",
    position: "Agricultural Officer",
    location: "St. George's, Grenada",
    bio: "Responsible for monitoring and supporting agricultural development initiatives across registered vendors.",
  });

  // New user form
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    role: "officer",
  });

  // Mock existing users
  const [governmentUsers, setGovernmentUsers] = useState([
    {
      id: "1",
      fullName: "Jane Smith",
      email: "jane.smith@gov.gd",
      department: "Agricultural Development Division",
      position: "Senior Agricultural Officer",
      role: "admin",
      status: "active",
    },
    {
      id: "2",
      fullName: "Michael Brown",
      email: "michael.brown@gov.gd",
      department: "Policy and Planning Unit",
      position: "Policy Analyst",
      role: "officer",
      status: "active",
    },
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // TODO: Save to API
    console.log("Saving profile:", formData);
    setIsEditing(false);
  };

  const handleNewUserChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send invitation to API
    console.log("Adding new user:", newUser);
    const newUserEntry = {
      id: String(governmentUsers.length + 1),
      ...newUser,
      status: "pending",
    };
    setGovernmentUsers((prev) => [...prev, newUserEntry]);
    setNewUser({
      fullName: "",
      email: "",
      phone: "",
      department: "",
      position: "",
      role: "officer",
    });
    setShowAddUserForm(false);
    show("Invitation sent successfully!");
  };

  const handleRemoveUser = (userId: string) => {
    if (confirm("Are you sure you want to remove this user?")) {
      setGovernmentUsers((prev) => prev.filter((user) => user.id !== userId));
    }
  };

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    formData.fullName
  )}&background=2d4a3e&color=fff&size=200`;

  const tabs = [
    { id: "profile" as const, name: "Profile", icon: UserCircleIcon },
    { id: "security" as const, name: "Security", icon: ShieldCheckIcon },
    { id: "users" as const, name: "Government Users", icon: UsersIcon },
  ];

  return (
    <div style={{ minHeight: "100vh", background: GOV.bg, color: GOV.text }}>
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={govPageTitle}>Profile Settings</h1>
          <p style={govPageSubtitle}>
            Manage your account information and preferences
          </p>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ borderBottom: `1px solid ${GOV.border}` }}>
            <nav style={{ display: "flex", gap: 28, marginBottom: -1 }}>
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    onMouseEnter={() => setHoveredBtn(`tab-${tab.id}`)}
                    onMouseLeave={() => setHoveredBtn(null)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "12px 2px",
                      background: "none",
                      border: "none",
                      borderBottom: isActive
                        ? `2px solid ${GOV.accent}`
                        : "2px solid transparent",
                      fontSize: 13,
                      fontWeight: 600,
                      color: isActive
                        ? GOV.accent
                        : hoveredBtn === `tab-${tab.id}`
                          ? GOV.text
                          : "#8a9e92",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "color .15s, border-color .15s",
                    }}
                  >
                    <tab.icon
                      style={{
                        width: 18,
                        height: 18,
                        color: isActive
                          ? GOV.accent
                          : hoveredBtn === `tab-${tab.id}`
                            ? GOV.text
                            : "#8a9e92",
                      }}
                    />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* ── Profile Tab ───────────────────────────────────────────────── */}
        {activeTab === "profile" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: 24,
            }}
          >
            {/* Left Column - Profile Picture + Stats */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ ...govCard, padding: "24px 20px", textAlign: "center" }}>
                <div style={{ position: "relative", display: "inline-block", marginBottom: 14 }}>
                  <img
                    src={avatarUrl}
                    alt={formData.fullName}
                    style={{
                      width: 110,
                      height: 110,
                      borderRadius: "50%",
                      border: "3px solid #ebe7df",
                      objectFit: "cover",
                    }}
                  />
                  <button
                    onMouseEnter={() => setHoveredBtn("avatar-edit")}
                    onMouseLeave={() => setHoveredBtn(null)}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: hoveredBtn === "avatar-edit" ? GOV.accentHover : GOV.accent,
                      color: "#fff",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "background .15s",
                    }}
                  >
                    <PencilIcon style={{ width: 16, height: 16 }} />
                  </button>
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: GOV.text, margin: 0 }}>
                  {formData.fullName}
                </h2>
                <p style={{ fontSize: 12, color: "#8a9e92", marginTop: 3 }}>
                  {formData.position}
                </p>
                <p style={{ fontSize: 11, color: "#8a9e92", marginTop: 1 }}>
                  {formData.organization}
                </p>
              </div>

              {/* Quick Stats */}
              <div style={{ ...govCard, padding: "18px 20px" }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: GOV.text, margin: "0 0 14px" }}>
                  Activity Summary
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={statRowStyle}>
                    <span style={{ fontSize: 12, color: "#8a9e92" }}>Vendors Registered</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: GOV.text }}>45</span>
                  </div>
                  <div style={statRowStyle}>
                    <span style={{ fontSize: 12, color: "#8a9e92" }}>Products Uploaded</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: GOV.text }}>12</span>
                  </div>
                  <div style={statRowStyle}>
                    <span style={{ fontSize: 12, color: "#8a9e92" }}>Reports Generated</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: GOV.text }}>28</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Profile Form */}
            <div>
              <div style={{ ...govCard, padding: "24px 24px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 24,
                  }}
                >
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: GOV.text, margin: 0 }}>
                    Personal Information
                  </h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      onMouseEnter={() => setHoveredBtn("edit")}
                      onMouseLeave={() => setHoveredBtn(null)}
                      style={{
                        ...govPillButton,
                        background: hoveredBtn === "edit" ? govHoverBg : GOV.cardBg,
                      }}
                    >
                      <PencilIcon style={{ width: 14, height: 14 }} />
                      Edit
                    </button>
                  ) : (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => setIsEditing(false)}
                        onMouseEnter={() => setHoveredBtn("cancel")}
                        onMouseLeave={() => setHoveredBtn(null)}
                        style={{
                          ...govPillButton,
                          background: hoveredBtn === "cancel" ? govHoverBg : GOV.cardBg,
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        onMouseEnter={() => setHoveredBtn("save")}
                        onMouseLeave={() => setHoveredBtn(null)}
                        style={{
                          ...govPrimaryButton,
                          background: hoveredBtn === "save" ? GOV.accentHover : GOV.accent,
                        }}
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {/* Full Name */}
                  <div>
                    <label style={labelStyle}>
                      <UserCircleIcon style={iconMutedStyle} />
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        style={inputStyle}
                      />
                    ) : (
                      <div style={readOnlyFieldStyle}>{formData.fullName}</div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label style={labelStyle}>
                      <EnvelopeIcon style={iconMutedStyle} />
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        style={inputStyle}
                      />
                    ) : (
                      <div style={readOnlyFieldStyle}>{formData.email}</div>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={labelStyle}>
                      <PhoneIcon style={iconMutedStyle} />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        style={inputStyle}
                      />
                    ) : (
                      <div style={readOnlyFieldStyle}>{formData.phone}</div>
                    )}
                  </div>

                  {/* Organization */}
                  <div>
                    <label style={labelStyle}>
                      <BuildingOfficeIcon style={iconMutedStyle} />
                      Organization
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="organization"
                        value={formData.organization}
                        onChange={handleInputChange}
                        style={inputStyle}
                      />
                    ) : (
                      <div style={readOnlyFieldStyle}>{formData.organization}</div>
                    )}
                  </div>

                  {/* Department */}
                  <div>
                    <label style={labelPlainStyle}>Department</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        style={inputStyle}
                      />
                    ) : (
                      <div style={readOnlyFieldStyle}>{formData.department}</div>
                    )}
                  </div>

                  {/* Position */}
                  <div>
                    <label style={labelPlainStyle}>Position/Title</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        style={inputStyle}
                      />
                    ) : (
                      <div style={readOnlyFieldStyle}>{formData.position}</div>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label style={labelStyle}>
                      <MapPinIcon style={iconMutedStyle} />
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        style={inputStyle}
                      />
                    ) : (
                      <div style={readOnlyFieldStyle}>{formData.location}</div>
                    )}
                  </div>

                  {/* Bio */}
                  <div>
                    <label style={labelPlainStyle}>Bio</label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        style={{
                          ...inputStyle,
                          borderRadius: 10,
                          resize: "vertical",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          ...readOnlyFieldStyle,
                          lineHeight: 1.6,
                        }}
                      >
                        {formData.bio}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Security Tab ──────────────────────────────────────────────── */}
        {activeTab === "security" && (
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div style={{ ...govCard, padding: "24px 24px" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: GOV.text, margin: "0 0 22px" }}>
                Security
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Password Row */}
                <div
                  onMouseEnter={() => setHoveredRow("sec-pw")}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 16px",
                    borderRadius: 8,
                    border: `1px solid ${GOV.border}`,
                    background: hoveredRow === "sec-pw" ? govHoverBg : "transparent",
                    transition: "background .15s",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: GOV.text }}>
                      Password
                    </div>
                    <div style={{ fontSize: 11, color: "#8a9e92", marginTop: 2 }}>
                      Last changed 3 months ago
                    </div>
                  </div>
                  <button
                    onMouseEnter={() => setHoveredBtn("chg-pw")}
                    onMouseLeave={() => setHoveredBtn(null)}
                    style={{
                      ...govPillButton,
                      background: hoveredBtn === "chg-pw" ? govHoverBg : GOV.cardBg,
                    }}
                  >
                    Change Password
                  </button>
                </div>

                {/* 2FA Row */}
                <div
                  onMouseEnter={() => setHoveredRow("sec-2fa")}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 16px",
                    borderRadius: 8,
                    border: `1px solid ${GOV.border}`,
                    background: hoveredRow === "sec-2fa" ? govHoverBg : "transparent",
                    transition: "background .15s",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: GOV.text }}>
                      Two-Factor Authentication
                    </div>
                    <div style={{ fontSize: 11, color: "#8a9e92", marginTop: 2 }}>
                      Add an extra layer of security
                    </div>
                  </div>
                  <button
                    onMouseEnter={() => setHoveredBtn("enable-2fa")}
                    onMouseLeave={() => setHoveredBtn(null)}
                    style={{
                      ...govPrimaryButton,
                      background: hoveredBtn === "enable-2fa" ? GOV.accentHover : GOV.accent,
                    }}
                  >
                    Enable
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Government Users Tab ──────────────────────────────────────── */}
        {activeTab === "users" && (
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <div style={{ ...govCard, padding: "24px 24px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 22,
                }}
              >
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: GOV.text, margin: 0 }}>
                    Government Users
                  </h2>
                  <p style={{ fontSize: 12, color: "#8a9e92", marginTop: 3 }}>
                    Manage access for government portal users
                  </p>
                </div>
                <button
                  onClick={() => setShowAddUserForm(!showAddUserForm)}
                  onMouseEnter={() => setHoveredBtn("add-user")}
                  onMouseLeave={() => setHoveredBtn(null)}
                  style={{
                    ...govPrimaryButton,
                    background: hoveredBtn === "add-user" ? GOV.accentHover : GOV.accent,
                  }}
                >
                  <UserPlusIcon style={{ width: 15, height: 15 }} />
                  Add User
                </button>
              </div>

              {/* Add User Form */}
              {showAddUserForm && (
                <form
                  onSubmit={handleAddUser}
                  style={{
                    marginBottom: 22,
                    padding: "18px 20px",
                    borderRadius: 10,
                    background: GOV.bg,
                    border: `1px solid ${GOV.border}`,
                  }}
                >
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: GOV.text, margin: "0 0 14px" }}>
                    Invite New Government User
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 14,
                    }}
                  >
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: GOV.text, display: "block", marginBottom: 4 }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={newUser.fullName}
                        onChange={handleNewUserChange}
                        required
                        placeholder="Enter full name"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: GOV.text, display: "block", marginBottom: 4 }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={newUser.email}
                        onChange={handleNewUserChange}
                        required
                        placeholder="user@gov.gd"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: GOV.text, display: "block", marginBottom: 4 }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={newUser.phone}
                        onChange={handleNewUserChange}
                        placeholder="+1 473-XXX-XXXX"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: GOV.text, display: "block", marginBottom: 4 }}>
                        Department *
                      </label>
                      <input
                        type="text"
                        name="department"
                        value={newUser.department}
                        onChange={handleNewUserChange}
                        required
                        placeholder="Enter department"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: GOV.text, display: "block", marginBottom: 4 }}>
                        Position/Title *
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={newUser.position}
                        onChange={handleNewUserChange}
                        required
                        placeholder="Enter position"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: GOV.text, display: "block", marginBottom: 4 }}>
                        Role *
                      </label>
                      <select
                        name="role"
                        value={newUser.role}
                        onChange={handleNewUserChange}
                        style={{
                          ...inputStyle,
                          appearance: "auto" as React.CSSProperties["appearance"],
                        }}
                      >
                        <option value="officer">Officer</option>
                        <option value="admin">Administrator</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                    <button
                      type="submit"
                      onMouseEnter={() => setHoveredBtn("send-inv")}
                      onMouseLeave={() => setHoveredBtn(null)}
                      style={{
                        ...govPrimaryButton,
                        background: hoveredBtn === "send-inv" ? GOV.accentHover : GOV.accent,
                      }}
                    >
                      Send Invitation
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddUserForm(false)}
                      onMouseEnter={() => setHoveredBtn("cancel-inv")}
                      onMouseLeave={() => setHoveredBtn(null)}
                      style={{
                        ...govPillButton,
                        background: hoveredBtn === "cancel-inv" ? govHoverBg : GOV.cardBg,
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Users List */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {governmentUsers.map((user) => (
                  <div
                    key={user.id}
                    onMouseEnter={() => setHoveredRow(user.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 14px",
                      borderRadius: 8,
                      border: `1px solid ${GOV.border}`,
                      background: hoveredRow === user.id ? govHoverBg : "transparent",
                      transition: "background .15s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.fullName
                        )}&background=2d4a3e&color=fff`}
                        alt={user.fullName}
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          border: "2px solid #ebe7df",
                          objectFit: "cover",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: GOV.text }}>
                            {user.fullName}
                          </span>
                          <span style={roleBadge(user.role)}>{user.role}</span>
                          <span style={statusBadge(user.status)}>{user.status}</span>
                        </div>
                        <div style={{ fontSize: 11, color: "#8a9e92", marginTop: 2 }}>
                          {user.email}
                        </div>
                        <div style={{ fontSize: 11, color: "#8a9e92" }}>
                          {user.department} &bull; {user.position}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveUser(user.id)}
                      onMouseEnter={() => setHoveredBtn(`del-${user.id}`)}
                      onMouseLeave={() => setHoveredBtn(null)}
                      title="Remove user"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        border: "none",
                        background: hoveredBtn === `del-${user.id}` ? GOV.dangerBg : "transparent",
                        color: GOV.danger,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "background .15s",
                      }}
                    >
                      <TrashIcon style={{ width: 15, height: 15 }} />
                    </button>
                  </div>
                ))}
              </div>

              {governmentUsers.length === 0 && (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <UserCircleIcon
                    style={{ width: 44, height: 44, color: "#8a9e92", margin: "0 auto 8px" }}
                  />
                  <p style={{ fontSize: 13, color: "#8a9e92" }}>
                    No government users yet. Add your first user to get started.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
