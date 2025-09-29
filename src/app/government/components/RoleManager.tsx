"use client";

import { useState } from "react";
import {
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  UserIcon,
  KeyIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

interface Role {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  permissions: string[];
  userCount: number;
  isDefault: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface Permission {
  name: string;
  displayName: string;
  description: string;
  category: string;
}

interface PermissionChangeLog {
  id: string;
  roleId: string;
  roleName: string;
  permissionName: string;
  action: "granted" | "revoked";
  grantedBy: string;
  grantedByName: string;
  reason?: string;
  grantedAt: string;
}

export default function RoleManager() {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "1",
      name: "admin",
      displayName: "Administrator",
      description: "Full system access with all permissions",
      permissions: [
        "view_government_data",
        "manage_government_tables",
        "create_government_charts",
        "manage_government_reports",
        "manage_role_permissions",
        "export_government_data",
        "edit_seller_data",
      ],
      userCount: 2,
      isDefault: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "2",
      name: "inspector",
      displayName: "Inspector",
      description: "Can view and edit seller data within jurisdiction",
      permissions: ["view_government_data", "edit_seller_data", "view_reports"],
      userCount: 8,
      isDefault: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "3",
      name: "analyst",
      displayName: "Data Analyst",
      description: "Can create charts and reports but cannot edit data",
      permissions: [
        "view_government_data",
        "create_government_charts",
        "manage_government_reports",
        "export_government_data",
      ],
      userCount: 5,
      isDefault: false,
      createdBy: "John Admin",
      createdAt: "2024-02-01T14:20:00Z",
      updatedAt: "2024-02-15T09:45:00Z",
    },
  ]);

  const [availablePermissions] = useState<Permission[]>([
    {
      name: "view_government_data",
      displayName: "View Government Data",
      description: "View all government data tables, charts, and reports",
      category: "data_access",
    },
    {
      name: "manage_government_tables",
      displayName: "Manage Government Tables",
      description: "Create, edit, and delete government data tables",
      category: "data_management",
    },
    {
      name: "create_government_charts",
      displayName: "Create Government Charts",
      description: "Create and manage charts and visualizations",
      category: "analytics",
    },
    {
      name: "manage_government_reports",
      displayName: "Manage Government Reports",
      description: "Create, edit, and generate government reports",
      category: "reporting",
    },
    {
      name: "edit_seller_data",
      displayName: "Edit Seller Data",
      description: "Edit seller and farmer data within jurisdiction",
      category: "regulatory",
    },
    {
      name: "manage_government_analytics",
      displayName: "Manage Government Analytics",
      description: "Access advanced analytics and data insights",
      category: "analytics",
    },
    {
      name: "export_government_data",
      displayName: "Export Government Data",
      description: "Export data in various formats",
      category: "data_access",
    },
    {
      name: "manage_role_permissions",
      displayName: "Manage Role Permissions",
      description: "Assign and revoke permissions for other roles",
      category: "administration",
    },
  ]);

  const [changeLog] = useState<PermissionChangeLog[]>([
    {
      id: "1",
      roleId: "3",
      roleName: "analyst",
      permissionName: "export_government_data",
      action: "granted",
      grantedBy: "1",
      grantedByName: "John Admin",
      reason: "Analyst needs to export data for external reporting",
      grantedAt: "2024-02-15T09:45:00Z",
    },
    {
      id: "2",
      roleId: "2",
      roleName: "inspector",
      permissionName: "manage_government_tables",
      action: "revoked",
      grantedBy: "1",
      grantedByName: "John Admin",
      reason: "Inspectors should not modify table structures",
      grantedAt: "2024-02-10T16:20:00Z",
    },
  ]);

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showChangeLog, setShowChangeLog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"roles" | "permissions" | "logs">(
    "roles"
  );

  const filteredRoles = roles.filter(
    (role) =>
      role.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedPermissions = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const handleCreateRole = () => {
    setSelectedRole(null);
    setShowCreateModal(true);
  };

  const handleEditRole = (roleId: string) => {
    setSelectedRole(roleId);
    setShowCreateModal(true);
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    if (!role) return;

    if (role.isDefault) {
      alert("Cannot delete default roles");
      return;
    }

    if (role.userCount > 0) {
      alert("Cannot delete role that has assigned users");
      return;
    }

    if (
      confirm(
        `Are you sure you want to delete the role "${role.displayName}"? This action cannot be undone.`
      )
    ) {
      setRoles((prev) => prev.filter((r) => r.id !== roleId));
    }
  };

  const handleManagePermissions = (roleId: string) => {
    setSelectedRole(roleId);
    setShowPermissionModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "data_access":
        return "👁️";
      case "data_management":
        return "🗂️";
      case "analytics":
        return "📊";
      case "reporting":
        return "📋";
      case "regulatory":
        return "⚖️";
      case "administration":
        return "⚙️";
      default:
        return "🔧";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--secondary-black)]">
            Role Management
          </h2>
          <p className="text-gray-600 mt-1">
            Manage user roles and permissions for your organization
          </p>
        </div>
        <button onClick={handleCreateRole} className="btn btn-primary">
          <PlusIcon className="h-4 w-4" />
          Create Role
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: "roles", label: "Roles", icon: UserGroupIcon },
            { id: "permissions", label: "Permissions", icon: ShieldCheckIcon },
            { id: "logs", label: "Change Log", icon: ClockIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-[var(--primary-accent2)] text-[var(--primary-accent2)]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "roles" && (
        <div className="space-y-6">
          {/* Search */}
          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
            />
          </div>

          {/* Roles Grid */}
          {filteredRoles.length === 0 ? (
            <div className="card text-center py-12">
              <UserGroupIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No roles found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoles.map((role) => (
                <div
                  key={role.id}
                  className="card hover:shadow-lg transition-all duration-200"
                >
                  {/* Role Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <UserGroupIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--secondary-black)]">
                          {role.displayName}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{role.userCount} users</span>
                          {role.isDefault && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <ShieldCheckIcon className="h-3 w-3" />
                                Default
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {role.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {role.description}
                    </p>
                  )}

                  {/* Permissions Preview */}
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-2">
                      Permissions ({role.permissions.length})
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((permission) => {
                        const perm = availablePermissions.find(
                          (p) => p.name === permission
                        );
                        return (
                          <span
                            key={permission}
                            className="px-2 py-1 bg-green-50 text-xs text-green-700 rounded-full"
                          >
                            {perm?.displayName || permission}
                          </span>
                        );
                      })}
                      {role.permissions.length > 3 && (
                        <span className="px-2 py-1 bg-gray-50 text-xs text-gray-500 rounded-full">
                          +{role.permissions.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      Updated {formatDate(role.updatedAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleManagePermissions(role.id)}
                        className="p-2 text-gray-400 hover:text-[var(--primary-accent2)] transition-colors"
                        title="Manage permissions"
                      >
                        <KeyIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditRole(role.id)}
                        className="p-2 text-gray-400 hover:text-[var(--primary-accent2)] transition-colors"
                        title="Edit role"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      {!role.isDefault && (
                        <button
                          onClick={() => handleDeleteRole(role.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete role"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "permissions" && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-4">
              Available Permissions
            </h3>
            <p className="text-gray-600 mb-6">
              These are all the permissions that can be assigned to roles in
              your organization.
            </p>

            <div className="space-y-6">
              {Object.entries(groupedPermissions).map(
                ([category, permissions]) => (
                  <div key={category}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">
                        {getCategoryIcon(category)}
                      </span>
                      <h4 className="font-medium text-[var(--secondary-black)] capitalize">
                        {category.replace("_", " ")}
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {permissions.map((permission) => (
                        <div
                          key={permission.name}
                          className="p-4 border border-gray-200 rounded-lg"
                        >
                          <h5 className="font-medium text-[var(--secondary-black)] mb-1">
                            {permission.displayName}
                          </h5>
                          <p className="text-sm text-gray-600">
                            {permission.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "logs" && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-4">
              Permission Change Log
            </h3>
            <p className="text-gray-600 mb-6">
              Track all permission changes made to roles in your organization.
            </p>

            <div className="space-y-4">
              {changeLog.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      log.action === "granted" ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    {log.action === "granted" ? (
                      <CheckIcon className="h-4 w-4 text-green-600" />
                    ) : (
                      <XMarkIcon className="h-4 w-4 text-red-600" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-[var(--secondary-black)]">
                        {log.grantedByName}
                      </span>
                      <span className="text-sm text-gray-600">
                        {log.action === "granted" ? "granted" : "revoked"}
                      </span>
                      <span className="font-medium text-[var(--secondary-black)]">
                        {availablePermissions.find(
                          (p) => p.name === log.permissionName
                        )?.displayName || log.permissionName}
                      </span>
                      <span className="text-sm text-gray-600">
                        {log.action === "granted" ? "to" : "from"}
                      </span>
                      <span className="font-medium text-[var(--secondary-black)]">
                        {log.roleName}
                      </span>
                    </div>

                    {log.reason && (
                      <p className="text-sm text-gray-600 mb-2">
                        Reason: {log.reason}
                      </p>
                    )}

                    <div className="text-xs text-gray-500">
                      {formatDate(log.grantedAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Role Modal */}
      {showCreateModal && (
        <CreateRoleModal
          role={
            selectedRole ? roles.find((r) => r.id === selectedRole) : undefined
          }
          availablePermissions={availablePermissions}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedRole(null);
          }}
          onSave={(roleData) => {
            if (selectedRole) {
              setRoles((prev) =>
                prev.map((r) =>
                  r.id === selectedRole ? { ...r, ...roleData } : r
                )
              );
            } else {
              setRoles((prev) => [
                ...prev,
                {
                  ...roleData,
                  id: Date.now().toString(),
                  name: roleData.name || "untitled_role",
                  displayName: roleData.displayName || "Untitled Role",
                  permissions: roleData.permissions || [],
                  userCount: 0,
                  isDefault: false,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              ]);
            }
            setShowCreateModal(false);
            setSelectedRole(null);
          }}
        />
      )}

      {/* Manage Permissions Modal */}
      {showPermissionModal && selectedRole && (
        <ManagePermissionsModal
          role={roles.find((r) => r.id === selectedRole)!}
          availablePermissions={availablePermissions}
          onClose={() => {
            setShowPermissionModal(false);
            setSelectedRole(null);
          }}
          onSave={(permissions) => {
            setRoles((prev) =>
              prev.map((r) =>
                r.id === selectedRole
                  ? { ...r, permissions, updatedAt: new Date().toISOString() }
                  : r
              )
            );
            setShowPermissionModal(false);
            setSelectedRole(null);
          }}
        />
      )}
    </div>
  );
}

// Create/Edit Role Modal
function CreateRoleModal({
  role,
  availablePermissions,
  onClose,
  onSave,
}: {
  role?: Role;
  availablePermissions: Permission[];
  onClose: () => void;
  onSave: (role: Partial<Role>) => void;
}) {
  const [name, setName] = useState(role?.name || "");
  const [displayName, setDisplayName] = useState(role?.displayName || "");
  const [description, setDescription] = useState(role?.description || "");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    role?.permissions || []
  );

  const handleSave = () => {
    if (!name || !displayName) {
      alert("Please fill in all required fields");
      return;
    }

    onSave({
      name: name.toLowerCase().replace(/\s+/g, "_"),
      displayName,
      description,
      permissions: selectedPermissions,
    });
  };

  const togglePermission = (permissionName: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionName)
        ? prev.filter((p) => p !== permissionName)
        : [...prev, permissionName]
    );
  };

  const groupedPermissions = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[var(--secondary-black)]">
                {role ? "Edit Role" : "Create New Role"}
              </h2>
              <p className="text-gray-600 mt-1">
                {role
                  ? "Update role information and permissions"
                  : "Define a new role with specific permissions"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                placeholder="e.g., data_analyst"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Name *
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                placeholder="e.g., Data Analyst"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
              placeholder="Describe the role and its responsibilities"
            />
          </div>

          {/* Permissions */}
          <div>
            <h3 className="text-lg font-medium text-[var(--secondary-black)] mb-4">
              Permissions ({selectedPermissions.length} selected)
            </h3>

            <div className="space-y-6">
              {Object.entries(groupedPermissions).map(
                ([category, permissions]) => (
                  <div key={category}>
                    <h4 className="font-medium text-[var(--secondary-black)] mb-3 capitalize">
                      {category.replace("_", " ")}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {permissions.map((permission) => (
                        <label
                          key={permission.name}
                          className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:border-[var(--primary-accent2)] hover:bg-[var(--primary-accent2)]/5 transition-all cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(
                              permission.name
                            )}
                            onChange={() => togglePermission(permission.name)}
                            className="mt-1 rounded border-gray-300 text-[var(--primary-accent2)] focus:ring-[var(--primary-accent2)]"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-[var(--secondary-black)] mb-1">
                              {permission.displayName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {permission.description}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
          <button onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            <CheckIcon className="h-4 w-4" />
            {role ? "Update Role" : "Create Role"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Manage Permissions Modal
function ManagePermissionsModal({
  role,
  availablePermissions,
  onClose,
  onSave,
}: {
  role: Role;
  availablePermissions: Permission[];
  onClose: () => void;
  onSave: (permissions: string[]) => void;
}) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    role.permissions
  );
  const [reason, setReason] = useState("");

  const togglePermission = (permissionName: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionName)
        ? prev.filter((p) => p !== permissionName)
        : [...prev, permissionName]
    );
  };

  const handleSave = () => {
    onSave(selectedPermissions);
  };

  const groupedPermissions = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const addedPermissions = selectedPermissions.filter(
    (p) => !role.permissions.includes(p)
  );
  const removedPermissions = role.permissions.filter(
    (p) => !selectedPermissions.includes(p)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[var(--secondary-black)]">
                Manage Permissions: {role.displayName}
              </h2>
              <p className="text-gray-600 mt-1">
                Add or remove permissions for this role
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Changes Summary */}
          {(addedPermissions.length > 0 || removedPermissions.length > 0) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                <h3 className="font-medium text-yellow-800">Pending Changes</h3>
              </div>

              {addedPermissions.length > 0 && (
                <div className="mb-2">
                  <span className="text-sm font-medium text-green-800">
                    Adding:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {addedPermissions.map((p) => {
                      const perm = availablePermissions.find(
                        (ap) => ap.name === p
                      );
                      return (
                        <span
                          key={p}
                          className="px-2 py-1 bg-green-100 text-xs text-green-800 rounded-full"
                        >
                          {perm?.displayName || p}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {removedPermissions.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-red-800">
                    Removing:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {removedPermissions.map((p) => {
                      const perm = availablePermissions.find(
                        (ap) => ap.name === p
                      );
                      return (
                        <span
                          key={p}
                          className="px-2 py-1 bg-red-100 text-xs text-red-800 rounded-full"
                        >
                          {perm?.displayName || p}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Permissions */}
          <div>
            <h3 className="text-lg font-medium text-[var(--secondary-black)] mb-4">
              Permissions ({selectedPermissions.length} selected)
            </h3>

            <div className="space-y-6">
              {Object.entries(groupedPermissions).map(
                ([category, permissions]) => (
                  <div key={category}>
                    <h4 className="font-medium text-[var(--secondary-black)] mb-3 capitalize">
                      {category.replace("_", " ")}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {permissions.map((permission) => (
                        <label
                          key={permission.name}
                          className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:border-[var(--primary-accent2)] hover:bg-[var(--primary-accent2)]/5 transition-all cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(
                              permission.name
                            )}
                            onChange={() => togglePermission(permission.name)}
                            className="mt-1 rounded border-gray-300 text-[var(--primary-accent2)] focus:ring-[var(--primary-accent2)]"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-[var(--secondary-black)] mb-1">
                              {permission.displayName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {permission.description}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Reason */}
          {(addedPermissions.length > 0 || removedPermissions.length > 0) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Changes (Optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                placeholder="Explain why these permission changes are being made"
              />
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
          <button onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            <CheckIcon className="h-4 w-4" />
            Update Permissions
          </button>
        </div>
      </div>
    </div>
  );
}
