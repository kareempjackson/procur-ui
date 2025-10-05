"use client";

import { useState } from "react";
import { useAppSelector } from "@/store";
import { selectAuthUser } from "@/store/slices/authSlice";
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

export default function ProfilePage() {
  const authUser = useAppSelector(selectAuthUser);
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "users">(
    "profile"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);

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
    alert("Invitation sent successfully!");
  };

  const handleRemoveUser = (userId: string) => {
    if (confirm("Are you sure you want to remove this user?")) {
      setGovernmentUsers((prev) => prev.filter((user) => user.id !== userId));
    }
  };

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    formData.fullName
  )}&background=1e3a8a&color=fff&size=200`;

  const tabs = [
    { id: "profile" as const, name: "Profile", icon: UserCircleIcon },
    { id: "security" as const, name: "Security", icon: ShieldCheckIcon },
    { id: "users" as const, name: "Government Users", icon: UsersIcon },
  ];

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[color:var(--secondary-black)]">
            Profile Settings
          </h1>
          <p className="text-sm text-[color:var(--secondary-muted-edge)] mt-1">
            Manage your account information and preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-[color:var(--secondary-soft-highlight)]">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? "border-[var(--secondary-highlight2)] text-[var(--secondary-highlight2)]"
                      : "border-transparent text-[color:var(--secondary-muted-edge)] hover:text-[color:var(--secondary-black)] hover:border-gray-300"
                  }`}
                >
                  <tab.icon
                    className={`h-5 w-5 ${
                      activeTab === tab.id
                        ? "text-[var(--secondary-highlight2)]"
                        : "text-[color:var(--secondary-muted-edge)] group-hover:text-[color:var(--secondary-black)]"
                    }`}
                  />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Profile Tab Content */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Picture */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <img
                      src={avatarUrl}
                      alt={formData.fullName}
                      className="h-32 w-32 rounded-full border-4 border-gray-200"
                    />
                    <button className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-[var(--secondary-highlight2)] text-white flex items-center justify-center hover:bg-[var(--secondary-muted-edge)] transition-all duration-200 shadow-lg hover:shadow-xl">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <h2 className="text-xl font-semibold text-[color:var(--secondary-black)]">
                    {formData.fullName}
                  </h2>
                  <p className="text-sm text-[color:var(--secondary-muted-edge)] mt-1">
                    {formData.position}
                  </p>
                  <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                    {formData.organization}
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
                <h3 className="text-sm font-semibold text-[color:var(--secondary-black)] mb-4">
                  Activity Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[color:var(--secondary-muted-edge)]">
                      Vendors Registered
                    </span>
                    <span className="text-sm font-medium text-[color:var(--secondary-black)]">
                      45
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[color:var(--secondary-muted-edge)]">
                      Products Uploaded
                    </span>
                    <span className="text-sm font-medium text-[color:var(--secondary-black)]">
                      12
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[color:var(--secondary-muted-edge)]">
                      Reports Generated
                    </span>
                    <span className="text-sm font-medium text-[color:var(--secondary-black)]">
                      28
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Profile Form */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-[color:var(--secondary-black)]">
                    Personal Information
                  </h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[color:var(--secondary-soft-highlight)] text-sm font-medium text-[color:var(--secondary-black)] hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <PencilIcon className="h-4 w-4" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-5 py-2 rounded-full border border-[color:var(--secondary-soft-highlight)] text-sm font-medium text-[color:var(--secondary-black)] hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-5 py-2 rounded-full bg-[var(--secondary-highlight2)] text-white text-sm font-medium hover:bg-[var(--secondary-muted-edge)] transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[color:var(--secondary-black)] mb-2">
                      <UserCircleIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-5 py-2.5 rounded-full border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm transition-all duration-200 shadow-sm focus:shadow-md"
                      />
                    ) : (
                      <div className="px-5 py-2.5 text-sm text-[color:var(--secondary-black)] bg-gray-50/50 rounded-full border border-transparent">
                        {formData.fullName}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[color:var(--secondary-black)] mb-2">
                      <EnvelopeIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-5 py-2.5 rounded-full border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm transition-all duration-200 shadow-sm focus:shadow-md"
                      />
                    ) : (
                      <div className="px-5 py-2.5 text-sm text-[color:var(--secondary-black)] bg-gray-50/50 rounded-full border border-transparent">
                        {formData.email}
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[color:var(--secondary-black)] mb-2">
                      <PhoneIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-5 py-2.5 rounded-full border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm transition-all duration-200 shadow-sm focus:shadow-md"
                      />
                    ) : (
                      <div className="px-5 py-2.5 text-sm text-[color:var(--secondary-black)] bg-gray-50/50 rounded-full border border-transparent">
                        {formData.phone}
                      </div>
                    )}
                  </div>

                  {/* Organization */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[color:var(--secondary-black)] mb-2">
                      <BuildingOfficeIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                      Organization
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="organization"
                        value={formData.organization}
                        onChange={handleInputChange}
                        className="w-full px-5 py-2.5 rounded-full border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm transition-all duration-200 shadow-sm focus:shadow-md"
                      />
                    ) : (
                      <div className="px-5 py-2.5 text-sm text-[color:var(--secondary-black)] bg-gray-50/50 rounded-full border border-transparent">
                        {formData.organization}
                      </div>
                    )}
                  </div>

                  {/* Department */}
                  <div>
                    <label className="text-sm font-medium text-[color:var(--secondary-black)] mb-2 block">
                      Department
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full px-5 py-2.5 rounded-full border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm transition-all duration-200 shadow-sm focus:shadow-md"
                      />
                    ) : (
                      <div className="px-5 py-2.5 text-sm text-[color:var(--secondary-black)] bg-gray-50/50 rounded-full border border-transparent">
                        {formData.department}
                      </div>
                    )}
                  </div>

                  {/* Position */}
                  <div>
                    <label className="text-sm font-medium text-[color:var(--secondary-black)] mb-2 block">
                      Position/Title
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        className="w-full px-5 py-2.5 rounded-full border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm transition-all duration-200 shadow-sm focus:shadow-md"
                      />
                    ) : (
                      <div className="px-5 py-2.5 text-sm text-[color:var(--secondary-black)] bg-gray-50/50 rounded-full border border-transparent">
                        {formData.position}
                      </div>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[color:var(--secondary-black)] mb-2">
                      <MapPinIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-5 py-2.5 rounded-full border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm transition-all duration-200 shadow-sm focus:shadow-md"
                      />
                    ) : (
                      <div className="px-5 py-2.5 text-sm text-[color:var(--secondary-black)] bg-gray-50/50 rounded-full border border-transparent">
                        {formData.location}
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="text-sm font-medium text-[color:var(--secondary-black)] mb-2 block">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-5 py-2.5 rounded-full border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm transition-all duration-200 shadow-sm focus:shadow-md"
                      />
                    ) : (
                      <div className="px-5 py-2.5 text-sm text-[color:var(--secondary-black)] bg-gray-50/50 rounded-full border border-transparent">
                        {formData.bio}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab Content */}
        {activeTab === "security" && (
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
              <h2 className="text-lg font-semibold text-[color:var(--secondary-black)] mb-6">
                Security
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-[color:var(--secondary-soft-highlight)]">
                  <div>
                    <div className="text-sm font-medium text-[color:var(--secondary-black)]">
                      Password
                    </div>
                    <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                      Last changed 3 months ago
                    </div>
                  </div>
                  <button className="px-5 py-2 rounded-full border border-[color:var(--secondary-soft-highlight)] text-sm font-medium text-[color:var(--secondary-black)] hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md">
                    Change Password
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-[color:var(--secondary-soft-highlight)]">
                  <div>
                    <div className="text-sm font-medium text-[color:var(--secondary-black)]">
                      Two-Factor Authentication
                    </div>
                    <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                      Add an extra layer of security
                    </div>
                  </div>
                  <button className="px-5 py-2 rounded-full bg-[var(--secondary-highlight2)] text-white text-sm font-medium hover:bg-[var(--secondary-muted-edge)] transition-all duration-200 shadow-lg hover:shadow-xl">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Government Users Tab Content */}
        {activeTab === "users" && (
          <div className="max-w-5xl mx-auto">
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-[color:var(--secondary-black)]">
                    Government Users
                  </h2>
                  <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
                    Manage access for government portal users
                  </p>
                </div>
                <button
                  onClick={() => setShowAddUserForm(!showAddUserForm)}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--secondary-highlight2)] text-white text-sm font-medium hover:bg-[var(--secondary-muted-edge)] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <UserPlusIcon className="h-4 w-4" />
                  Add User
                </button>
              </div>

              {/* Add User Form */}
              {showAddUserForm && (
                <form
                  onSubmit={handleAddUser}
                  className="mb-6 p-5 rounded-xl bg-blue-50/50 border border-blue-100"
                >
                  <h3 className="text-sm font-semibold text-[color:var(--secondary-black)] mb-4">
                    Invite New Government User
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-[color:var(--secondary-black)] mb-1 block">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={newUser.fullName}
                        onChange={handleNewUserChange}
                        required
                        className="w-full px-4 py-2 rounded-full border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm transition-all duration-200 shadow-sm focus:shadow-md"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[color:var(--secondary-black)] mb-1 block">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={newUser.email}
                        onChange={handleNewUserChange}
                        required
                        className="w-full px-4 py-2 rounded-full border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm transition-all duration-200 shadow-sm focus:shadow-md"
                        placeholder="user@gov.gd"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[color:var(--secondary-black)] mb-1 block">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={newUser.phone}
                        onChange={handleNewUserChange}
                        className="w-full px-4 py-2 rounded-full border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm transition-all duration-200 shadow-sm focus:shadow-md"
                        placeholder="+1 473-XXX-XXXX"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[color:var(--secondary-black)] mb-1 block">
                        Department *
                      </label>
                      <input
                        type="text"
                        name="department"
                        value={newUser.department}
                        onChange={handleNewUserChange}
                        required
                        className="w-full px-4 py-2 rounded-full border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm transition-all duration-200 shadow-sm focus:shadow-md"
                        placeholder="Enter department"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[color:var(--secondary-black)] mb-1 block">
                        Position/Title *
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={newUser.position}
                        onChange={handleNewUserChange}
                        required
                        className="w-full px-4 py-2 rounded-full border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm transition-all duration-200 shadow-sm focus:shadow-md"
                        placeholder="Enter position"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[color:var(--secondary-black)] mb-1 block">
                        Role *
                      </label>
                      <select
                        name="role"
                        value={newUser.role}
                        onChange={handleNewUserChange}
                        className="w-full px-4 py-2 rounded-full border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm transition-all duration-200 shadow-sm focus:shadow-md"
                      >
                        <option value="officer">Officer</option>
                        <option value="admin">Administrator</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-full bg-[var(--secondary-highlight2)] text-white text-sm font-medium hover:bg-[var(--secondary-muted-edge)] transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Send Invitation
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddUserForm(false)}
                      className="px-5 py-2 rounded-full border border-[color:var(--secondary-soft-highlight)] text-sm font-medium text-[color:var(--secondary-black)] hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Users List */}
              <div className="space-y-3">
                {governmentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-[color:var(--secondary-soft-highlight)] hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.fullName
                        )}&background=1e3a8a&color=fff`}
                        alt={user.fullName}
                        className="h-10 w-10 rounded-full border-2 border-gray-200"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[color:var(--secondary-black)]">
                            {user.fullName}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-700"
                                : user.role === "officer"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {user.role}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              user.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {user.status}
                          </span>
                        </div>
                        <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                          {user.email}
                        </div>
                        <div className="text-xs text-[color:var(--secondary-muted-edge)]">
                          {user.department} • {user.position}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveUser(user.id)}
                      className="p-2 rounded-full text-red-600 hover:bg-red-50 transition-all duration-200 shadow-sm hover:shadow-md"
                      title="Remove user"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {governmentUsers.length === 0 && (
                <div className="text-center py-8">
                  <UserCircleIcon className="h-12 w-12 text-[color:var(--secondary-muted-edge)] mx-auto mb-2" />
                  <p className="text-sm text-[color:var(--secondary-muted-edge)]">
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
