"use client";

import { useState } from "react";
import {
  BellIcon,
  EnvelopeIcon,
  MoonIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
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

/* ── Toggle switch (pure inline, no Tailwind) ─────────────────────────────── */

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      style={{
        position: "relative",
        width: 44,
        height: 24,
        borderRadius: 999,
        border: "none",
        background: checked ? GOV.brand : "#ccc",
        cursor: "pointer",
        transition: "background .2s",
        flexShrink: 0,
        padding: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: checked ? 22 : 2,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "#fff",
          transition: "left .2s",
          boxShadow: "0 1px 3px rgba(0,0,0,.15)",
        }}
      />
    </button>
  );
}

/* ── Shared inline-style fragments ────────────────────────────────────────── */

const sectionHeaderWrap: React.CSSProperties = {
  padding: "18px 20px",
  borderBottom: `1px solid ${GOV.border}`,
  background: GOV.bg,
};

const sectionBody: React.CSSProperties = {
  padding: "20px 20px",
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const rowCard: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 16px",
  borderRadius: 8,
  border: `1px solid ${GOV.border}`,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: `1px solid #ebe7df`,
  borderRadius: 8,
  padding: "10px 14px",
  fontSize: 13,
  color: GOV.text,
  background: "#fff",
  fontFamily: "inherit",
  outline: "none",
  appearance: "none",
  WebkitAppearance: "none",
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: GOV.text,
  marginBottom: 8,
  display: "block",
};

const titleSm: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: GOV.text,
  margin: 0,
};

const descSm: React.CSSProperties = {
  fontSize: 12,
  color: GOV.muted,
  margin: 0,
  marginTop: 2,
};

const sectionTitle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: GOV.text,
  margin: 0,
};

const sectionDesc: React.CSSProperties = {
  fontSize: 12,
  color: GOV.muted,
  marginTop: 2,
};

const iconStyle: React.CSSProperties = {
  width: 18,
  height: 18,
  color: GOV.muted,
  flexShrink: 0,
};

/* ── Page ──────────────────────────────────────────────────────────────────── */

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    vendorRegistrations: true,
    complianceAlerts: true,
    productUploads: false,
    weeklyReports: true,

    // Preferences
    darkMode: false,
    language: "en",
    timezone: "America/Grenada",
    dateFormat: "DD/MM/YYYY",

    // Privacy
    profileVisibility: "organization",
    activityTracking: true,
    dataSharing: false,
  });

  const [hovered, setHovered] = useState<string | null>(null);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSelectChange = (key: keyof typeof settings, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const notifyItems: {
    key: "vendorRegistrations" | "complianceAlerts" | "productUploads" | "weeklyReports";
    label: string;
    desc: string;
  }[] = [
    {
      key: "vendorRegistrations",
      label: "Vendor Registrations",
      desc: "New vendor sign-ups",
    },
    {
      key: "complianceAlerts",
      label: "Compliance Alerts",
      desc: "Important compliance notifications",
    },
    {
      key: "productUploads",
      label: "Product Uploads",
      desc: "New product listings",
    },
    {
      key: "weeklyReports",
      label: "Weekly Reports",
      desc: "Summary of weekly activities",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: GOV.bg, color: GOV.text }}>
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={govPageTitle}>Settings</h1>
          <p style={govPageSubtitle}>
            Manage your account preferences and notification settings
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* ── Notifications Section ─────────────────────────────────────── */}
          <div style={{ ...govCard, overflow: "hidden" }}>
            <div style={sectionHeaderWrap}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <BellIcon style={iconStyle} />
                <h2 style={sectionTitle}>Notifications</h2>
              </div>
              <p style={sectionDesc}>
                Choose how you want to be notified about updates
              </p>
            </div>

            <div style={sectionBody}>
              {/* Email Notifications */}
              <div style={rowCard}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <EnvelopeIcon style={{ width: 15, height: 15, color: GOV.muted }} />
                    <p style={titleSm}>Email Notifications</p>
                  </div>
                  <p style={descSm}>
                    Receive email updates about important activities
                  </p>
                </div>
                <Toggle
                  checked={settings.emailNotifications as boolean}
                  onChange={() => handleToggle("emailNotifications")}
                />
              </div>

              {/* Push Notifications */}
              <div style={rowCard}>
                <div style={{ flex: 1 }}>
                  <p style={{ ...titleSm, marginBottom: 2 }}>Push Notifications</p>
                  <p style={descSm}>Receive browser push notifications</p>
                </div>
                <Toggle
                  checked={settings.pushNotifications as boolean}
                  onChange={() => handleToggle("pushNotifications")}
                />
              </div>

              {/* Divider + "Notify me about:" */}
              <div
                style={{
                  paddingTop: 14,
                  borderTop: `1px solid ${GOV.border}`,
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: GOV.text,
                    marginBottom: 10,
                  }}
                >
                  Notify me about:
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {notifyItems.map((item) => (
                    <div
                      key={item.key}
                      onMouseEnter={() => setHovered(item.key)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 14px",
                        borderRadius: 8,
                        background:
                          hovered === item.key ? govHoverBg : "transparent",
                        transition: "background .15s",
                      }}
                    >
                      <div>
                        <p style={{ fontSize: 13, color: GOV.text, margin: 0 }}>
                          {item.label}
                        </p>
                        <p style={{ fontSize: 12, color: GOV.muted, margin: 0, marginTop: 1 }}>
                          {item.desc}
                        </p>
                      </div>
                      <Toggle
                        checked={settings[item.key] as boolean}
                        onChange={() => handleToggle(item.key)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Preferences Section ───────────────────────────────────────── */}
          <div style={{ ...govCard, overflow: "hidden" }}>
            <div style={sectionHeaderWrap}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <GlobeAltIcon style={iconStyle} />
                <h2 style={sectionTitle}>Preferences</h2>
              </div>
              <p style={sectionDesc}>Customize your experience</p>
            </div>

            <div style={sectionBody}>
              {/* Dark Mode */}
              <div style={rowCard}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <MoonIcon style={{ width: 18, height: 18, color: GOV.muted }} />
                  <div>
                    <p style={titleSm}>Dark Mode</p>
                    <p style={descSm}>Use dark theme</p>
                  </div>
                </div>
                <Toggle
                  checked={settings.darkMode as boolean}
                  onChange={() => handleToggle("darkMode")}
                />
              </div>

              {/* Language */}
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: 8,
                  border: `1px solid ${GOV.border}`,
                }}
              >
                <label style={labelStyle}>Language</label>
                <select
                  value={settings.language}
                  onChange={(e) =>
                    handleSelectChange("language", e.target.value)
                  }
                  style={inputStyle}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>

              {/* Timezone */}
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: 8,
                  border: `1px solid ${GOV.border}`,
                }}
              >
                <label style={labelStyle}>Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) =>
                    handleSelectChange("timezone", e.target.value)
                  }
                  style={inputStyle}
                >
                  <option value="America/Grenada">
                    Atlantic Standard Time (Grenada)
                  </option>
                  <option value="America/Barbados">
                    Atlantic Standard Time (Barbados)
                  </option>
                  <option value="America/Port_of_Spain">
                    Atlantic Standard Time (Trinidad)
                  </option>
                  <option value="Europe/London">London</option>
                </select>
              </div>

              {/* Date Format */}
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: 8,
                  border: `1px solid ${GOV.border}`,
                }}
              >
                <label style={labelStyle}>Date Format</label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) =>
                    handleSelectChange("dateFormat", e.target.value)
                  }
                  style={inputStyle}
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Privacy & Data Section ────────────────────────────────────── */}
          <div style={{ ...govCard, overflow: "hidden" }}>
            <div style={sectionHeaderWrap}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ShieldCheckIcon style={iconStyle} />
                <h2 style={sectionTitle}>Privacy & Data</h2>
              </div>
              <p style={sectionDesc}>Control your privacy settings</p>
            </div>

            <div style={sectionBody}>
              {/* Profile Visibility */}
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: 8,
                  border: `1px solid ${GOV.border}`,
                }}
              >
                <label style={labelStyle}>Profile Visibility</label>
                <select
                  value={settings.profileVisibility}
                  onChange={(e) =>
                    handleSelectChange("profileVisibility", e.target.value)
                  }
                  style={inputStyle}
                >
                  <option value="public">Public</option>
                  <option value="organization">Organization Only</option>
                  <option value="private">Private</option>
                </select>
              </div>

              {/* Activity Tracking */}
              <div style={rowCard}>
                <div>
                  <p style={{ ...titleSm, marginBottom: 2 }}>Activity Tracking</p>
                  <p style={descSm}>
                    Allow system to track your activity for analytics
                  </p>
                </div>
                <Toggle
                  checked={settings.activityTracking as boolean}
                  onChange={() => handleToggle("activityTracking")}
                />
              </div>

              {/* Data Sharing */}
              <div style={rowCard}>
                <div>
                  <p style={{ ...titleSm, marginBottom: 2 }}>Data Sharing</p>
                  <p style={descSm}>
                    Share anonymized data for research purposes
                  </p>
                </div>
                <Toggle
                  checked={settings.dataSharing as boolean}
                  onChange={() => handleToggle("dataSharing")}
                />
              </div>
            </div>
          </div>

          {/* ── Data Export Card ───────────────────────────────────────────── */}
          <div style={{ ...govCard, padding: "22px 24px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <DocumentTextIcon
                style={{ width: 22, height: 22, color: GOV.muted, marginTop: 2, flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: GOV.text,
                    margin: 0,
                    marginBottom: 4,
                  }}
                >
                  Export Your Data
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: GOV.muted,
                    margin: 0,
                    marginBottom: 14,
                  }}
                >
                  Download a copy of your account data and activity history
                </p>
                <button
                  onMouseEnter={() => setHovered("export")}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    ...govPillButton,
                    background: hovered === "export" ? govHoverBg : GOV.cardBg,
                    transition: "background .15s",
                  }}
                >
                  Request Data Export
                </button>
              </div>
            </div>
          </div>

          {/* ── Save Button ───────────────────────────────────────────────── */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onMouseEnter={() => setHovered("save")}
              onMouseLeave={() => setHovered(null)}
              style={{
                ...govPrimaryButton,
                padding: "11px 28px",
                fontSize: 14,
                background: hovered === "save" ? GOV.accentHover : GOV.accent,
                transition: "background .15s",
              }}
            >
              Save All Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
