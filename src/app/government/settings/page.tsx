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

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[color:var(--secondary-black)]">
            Settings
          </h1>
          <p className="text-sm text-[color:var(--secondary-muted-edge)] mt-1">
            Manage your account preferences and notification settings
          </p>
        </div>

        <div className="space-y-6">
          {/* Notifications Section */}
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
            <div className="p-5 border-b border-[color:var(--secondary-soft-highlight)] bg-gray-50/50">
              <div className="flex items-center gap-2">
                <BellIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                <h2 className="text-lg font-semibold text-[color:var(--secondary-black)]">
                  Notifications
                </h2>
              </div>
              <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
                Choose how you want to be notified about updates
              </p>
            </div>
            <div className="p-5 space-y-4">
              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-[color:var(--secondary-soft-highlight)]">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <EnvelopeIcon className="h-4 w-4 text-[color:var(--secondary-muted-edge)]" />
                    <div className="text-sm font-medium text-[color:var(--secondary-black)]">
                      Email Notifications
                    </div>
                  </div>
                  <div className="text-xs text-[color:var(--secondary-muted-edge)]">
                    Receive email updates about important activities
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={() => handleToggle("emailNotifications")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--primary-base)]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-base)]"></div>
                </label>
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-[color:var(--secondary-soft-highlight)]">
                <div className="flex-1">
                  <div className="text-sm font-medium text-[color:var(--secondary-black)] mb-1">
                    Push Notifications
                  </div>
                  <div className="text-xs text-[color:var(--secondary-muted-edge)]">
                    Receive browser push notifications
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={() => handleToggle("pushNotifications")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--primary-base)]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-base)]"></div>
                </label>
              </div>

              <div className="pt-4 border-t border-[color:var(--secondary-soft-highlight)]">
                <div className="text-sm font-medium text-[color:var(--secondary-black)] mb-3">
                  Notify me about:
                </div>
                <div className="space-y-3">
                  {[
                    {
                      key: "vendorRegistrations" as const,
                      label: "Vendor Registrations",
                      desc: "New vendor sign-ups",
                    },
                    {
                      key: "complianceAlerts" as const,
                      label: "Compliance Alerts",
                      desc: "Important compliance notifications",
                    },
                    {
                      key: "productUploads" as const,
                      label: "Product Uploads",
                      desc: "New product listings",
                    },
                    {
                      key: "weeklyReports" as const,
                      label: "Weekly Reports",
                      desc: "Summary of weekly activities",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <div className="text-sm text-[color:var(--secondary-black)]">
                          {item.label}
                        </div>
                        <div className="text-xs text-[color:var(--secondary-muted-edge)]">
                          {item.desc}
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings[item.key]}
                          onChange={() => handleToggle(item.key)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--primary-base)]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-base)]"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
            <div className="p-5 border-b border-[color:var(--secondary-soft-highlight)] bg-gray-50/50">
              <div className="flex items-center gap-2">
                <GlobeAltIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                <h2 className="text-lg font-semibold text-[color:var(--secondary-black)]">
                  Preferences
                </h2>
              </div>
              <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
                Customize your experience
              </p>
            </div>
            <div className="p-5 space-y-4">
              {/* Dark Mode */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-[color:var(--secondary-soft-highlight)]">
                <div className="flex items-center gap-2">
                  <MoonIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                  <div>
                    <div className="text-sm font-medium text-[color:var(--secondary-black)]">
                      Dark Mode
                    </div>
                    <div className="text-xs text-[color:var(--secondary-muted-edge)]">
                      Use dark theme
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={() => handleToggle("darkMode")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--primary-base)]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-base)]"></div>
                </label>
              </div>

              {/* Language */}
              <div className="p-4 rounded-lg border border-[color:var(--secondary-soft-highlight)]">
                <label className="text-sm font-medium text-[color:var(--secondary-black)] mb-2 block">
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) =>
                    handleSelectChange("language", e.target.value)
                  }
                  className="w-full px-5 py-2.5 rounded-full border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm transition-all duration-200 shadow-sm focus:shadow-md"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>

              {/* Timezone */}
              <div className="p-4 rounded-lg border border-[color:var(--secondary-soft-highlight)]">
                <label className="text-sm font-medium text-[color:var(--secondary-black)] mb-2 block">
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) =>
                    handleSelectChange("timezone", e.target.value)
                  }
                  className="w-full px-5 py-2.5 rounded-full border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm transition-all duration-200 shadow-sm focus:shadow-md"
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
              <div className="p-4 rounded-lg border border-[color:var(--secondary-soft-highlight)]">
                <label className="text-sm font-medium text-[color:var(--secondary-black)] mb-2 block">
                  Date Format
                </label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) =>
                    handleSelectChange("dateFormat", e.target.value)
                  }
                  className="w-full px-5 py-2.5 rounded-full border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm transition-all duration-200 shadow-sm focus:shadow-md"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
            <div className="p-5 border-b border-[color:var(--secondary-soft-highlight)] bg-gray-50/50">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                <h2 className="text-lg font-semibold text-[color:var(--secondary-black)]">
                  Privacy & Data
                </h2>
              </div>
              <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
                Control your privacy settings
              </p>
            </div>
            <div className="p-5 space-y-4">
              {/* Profile Visibility */}
              <div className="p-4 rounded-lg border border-[color:var(--secondary-soft-highlight)]">
                <label className="text-sm font-medium text-[color:var(--secondary-black)] mb-2 block">
                  Profile Visibility
                </label>
                <select
                  value={settings.profileVisibility}
                  onChange={(e) =>
                    handleSelectChange("profileVisibility", e.target.value)
                  }
                  className="w-full px-5 py-2.5 rounded-full border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm transition-all duration-200 shadow-sm focus:shadow-md"
                >
                  <option value="public">Public</option>
                  <option value="organization">Organization Only</option>
                  <option value="private">Private</option>
                </select>
              </div>

              {/* Activity Tracking */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-[color:var(--secondary-soft-highlight)]">
                <div>
                  <div className="text-sm font-medium text-[color:var(--secondary-black)] mb-1">
                    Activity Tracking
                  </div>
                  <div className="text-xs text-[color:var(--secondary-muted-edge)]">
                    Allow system to track your activity for analytics
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.activityTracking}
                    onChange={() => handleToggle("activityTracking")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--primary-base)]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-base)]"></div>
                </label>
              </div>

              {/* Data Sharing */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-[color:var(--secondary-soft-highlight)]">
                <div>
                  <div className="text-sm font-medium text-[color:var(--secondary-black)] mb-1">
                    Data Sharing
                  </div>
                  <div className="text-xs text-[color:var(--secondary-muted-edge)]">
                    Share anonymized data for research purposes
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.dataSharing}
                    onChange={() => handleToggle("dataSharing")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--primary-base)]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-base)]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Data Export */}
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="flex items-start gap-3">
              <DocumentTextIcon className="h-6 w-6 text-[color:var(--secondary-muted-edge)] mt-1" />
              <div className="flex-1">
                <h3 className="text-base font-semibold text-[color:var(--secondary-black)] mb-1">
                  Export Your Data
                </h3>
                <p className="text-sm text-[color:var(--secondary-muted-edge)] mb-4">
                  Download a copy of your account data and activity history
                </p>
                <button className="px-5 py-2 rounded-full border border-[color:var(--secondary-soft-highlight)] text-sm font-medium text-[color:var(--secondary-black)] hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md">
                  Request Data Export
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="px-6 py-3 rounded-full bg-[var(--secondary-highlight2)] text-white text-sm font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200 shadow-lg hover:shadow-xl">
              Save All Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
