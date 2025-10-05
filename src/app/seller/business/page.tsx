"use client";

import React, { useState } from "react";
import Link from "next/link";
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
import { useAppSelector } from "@/store";
import { selectAuthUser } from "@/store/slices/authSlice";

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
  const [activeTab, setActiveTab] = useState<"general" | "team" | "payments">(
    "general"
  );

  // General Settings State
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [taxId, setTaxId] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [farmerIdFile, setFarmerIdFile] = useState<File | null>(null);
  const [farmerIdPreview, setFarmerIdPreview] = useState<string | null>(null);

  // Team Management State
  const [teamMembers] = useState<TeamMember[]>([]);
  const [invitations] = useState<Invitation[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");

  // Payment Settings State
  const [bankConnected, setBankConnected] = useState(false);
  const [bankAccountName, setBankAccountName] = useState("");

  const handleFarmerIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setFarmerIdFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFarmerIdPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveGeneral = async () => {
    // TODO: Implement API call to update organization
    console.log("Saving general settings...");
  };

  const handleConnectBank = async () => {
    // TODO: Implement Stripe or Plaid integration
    console.log("Connecting bank account...");
    setBankConnected(true);
    setBankAccountName("Chase Bank •••• 1234");
  };

  const handleDisconnectBank = async () => {
    if (!confirm("Are you sure you want to disconnect your bank account?"))
      return;

    // TODO: Implement API call to disconnect bank
    console.log("Disconnecting bank account...");
    setBankConnected(false);
    setBankAccountName("");
  };

  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) return;

    // TODO: Implement API call to send invitation
    console.log("Inviting user:", inviteEmail, inviteRole);

    setShowInviteModal(false);
    setInviteEmail("");
    setInviteRole("member");
  };

  const handleRemoveUser = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this team member?")) return;

    // TODO: Implement API call to remove user
    console.log("Removing user:", userId);
  };

  const handleRevokeInvitation = async (invitationId: string) => {
    // TODO: Implement API call to revoke invitation
    console.log("Revoking invitation:", invitationId);
  };

  const inputClassName =
    "w-full px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]";

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
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
                    <option value="farm">Farm</option>
                    <option value="cooperative">Cooperative</option>
                    <option value="distributor">Distributor</option>
                    <option value="processor">Processor</option>
                    <option value="other">Other</option>
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

                <div>
                  <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                    Website
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.com"
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
                        <img
                          src={farmerIdPreview}
                          alt="Farmer ID"
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
                  className="px-5 py-2 text-sm bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] transition-colors font-medium"
                >
                  Save Changes
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

                {teamMembers.length === 0 && (
                  <div className="text-center py-12 text-[var(--secondary-muted-edge)]">
                    <UserGroupIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm font-medium">No team members yet</p>
                    <p className="text-xs mt-1">
                      Invite users to collaborate on your organization
                    </p>
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
            {/* Bank Account Connection */}
            <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20">
              <div className="flex items-center gap-2 mb-4">
                <CreditCardIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
                  Bank Account
                </h2>
              </div>

              {bankConnected ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[var(--secondary-black)]">
                          Bank Connected
                        </div>
                        <div className="text-sm text-[var(--secondary-muted-edge)]">
                          {bankAccountName}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleDisconnectBank}
                      className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-full transition-colors font-medium"
                    >
                      Disconnect
                    </button>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex gap-2">
                    <InformationCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div className="text-xs text-blue-800">
                      Your bank account is securely connected. Payments will be
                      deposited directly to this account.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCardIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-base font-semibold text-[var(--secondary-black)] mb-2">
                      Connect Your Bank Account
                    </h3>
                    <p className="text-sm text-[var(--secondary-muted-edge)] mb-6 max-w-md mx-auto">
                      Securely connect your bank account to receive payments
                      from orders. We use bank-level encryption to protect your
                      information.
                    </p>
                    <button
                      type="button"
                      onClick={handleConnectBank}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] transition-colors font-medium"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Connect Bank Account
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 bg-[var(--primary-accent2)] bg-opacity-10 rounded-full flex items-center justify-center mb-3">
                        <ShieldCheckIcon className="w-5 h-5 text-[var(--primary-accent2)]" />
                      </div>
                      <h4 className="text-sm font-semibold text-[var(--secondary-black)] mb-1">
                        Secure Connection
                      </h4>
                      <p className="text-xs text-[var(--secondary-muted-edge)]">
                        Bank-level encryption protects your data
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 bg-[var(--primary-accent2)] bg-opacity-10 rounded-full flex items-center justify-center mb-3">
                        <svg
                          className="w-5 h-5 text-[var(--primary-accent2)]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <h4 className="text-sm font-semibold text-[var(--secondary-black)] mb-1">
                        Fast Deposits
                      </h4>
                      <p className="text-xs text-[var(--secondary-muted-edge)]">
                        Receive payments within 1-2 business days
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 bg-[var(--primary-accent2)] bg-opacity-10 rounded-full flex items-center justify-center mb-3">
                        <svg
                          className="w-5 h-5 text-[var(--primary-accent2)]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h4 className="text-sm font-semibold text-[var(--secondary-black)] mb-1">
                        No Hidden Fees
                      </h4>
                      <p className="text-xs text-[var(--secondary-muted-edge)]">
                        Transparent pricing with no surprises
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
                  An invitation email will be sent to this address. They'll need
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
                  className="flex-1 px-4 py-2 text-sm bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] transition-colors font-medium"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
