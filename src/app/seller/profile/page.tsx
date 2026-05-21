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
import {
  fetchActiveCountries,
  selectCountries,
  selectCountry,
} from "@/store/slices/countrySlice";
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
  const availableCountries = useAppSelector(selectCountries);
  const { show } = useToast();

  useEffect(() => { dispatch(fetchActiveCountries()); }, [dispatch]);

  // Country from organization registration — not editable
  const orgCountryName = (() => {
    const org = profile?.organization;
    if (!org) return "";
    if (org.countryId && availableCountries.length > 0) {
      const match = availableCountries.find((c) => c.code === org.countryId);
      if (match) return match.name;
    }
    return org.country || "";
  })();

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
        const addr = org.address || [org.city, org.state, org.postalCode].filter(Boolean).join(", ");
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
    // Send the raw field values — empty strings are intentional clears.
    // The backend DTO trims and persists them, so deleting an input and
    // saving actually clears the column instead of silently keeping the
    // old value.
    const data: UpdateProfileDto = {
      fullname,
      phone,
      address,
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
                <div>
                  <span style={label}>Country</span>
                  <input type="text" disabled value={orgCountryName || "—"} style={{ ...inputStyle, background: "#f4f1eb", color: "#8a9e92", cursor: "not-allowed" }} />
                  <span style={{ fontSize: 10, color: "#8a9e92", marginTop: 3, display: "block" }}>Set during registration</span>
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

        {/* Pickup Location Section */}
        {activeTab === "profile" && (
          <PickupLocationSection
            card={card}
            inputStyle={inputStyle}
            label={label}
            primaryBtn={primaryBtn}
            ghostBtn={ghostBtn}
          />
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

interface PickupAddressState {
  enabled: boolean;
  street_address?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  contact_name?: string;
  contact_phone?: string;
  instructions?: string;
  hours?: string;
}

// Locale-aware placeholder presets for the pickup form. Keyed by country.code from the
// active country slice (e.g. 'gda' Grenada, 'col' Colombia). Default fallback covers
// everything else, including new countries we haven't tailored to yet.
const PICKUP_PLACEHOLDERS: Record<
  string,
  {
    streetLabel: string;
    streetPlaceholder: string;
    line2Label: string;
    line2Placeholder: string;
    cityLabel: string;
    cityPlaceholder: string;
    stateLabel: string;
    statePlaceholder: string;
    postalLabel: string;
    postalPlaceholder: string;
    countryLabel: string;
    contactNameLabel: string;
    contactNamePlaceholder: string;
    contactPhoneLabel: string;
    contactPhonePlaceholder: string;
    hoursLabel: string;
    hoursPlaceholder: string;
    instructionsLabel: string;
    instructionsHelper: string;
    instructionsPlaceholder: string;
  }
> = {
  col: {
    streetLabel: "Dirección *",
    streetPlaceholder: "Ej: Calle 100 #15-20",
    line2Label: "Información adicional (apto, piso, conjunto, barrio)",
    line2Placeholder: "Local 3, Barrio El Poblado",
    cityLabel: "Ciudad / Municipio *",
    cityPlaceholder: "Bogotá",
    stateLabel: "Departamento",
    statePlaceholder: "Cundinamarca",
    postalLabel: "Código postal",
    postalPlaceholder: "110111",
    countryLabel: "País *",
    contactNameLabel: "Persona de contacto",
    contactNamePlaceholder: "Maria González",
    contactPhoneLabel: "Teléfono",
    contactPhonePlaceholder: "+57 300 123 4567",
    hoursLabel: "Horario",
    hoursPlaceholder: "Lun-Sáb 9am-6pm",
    instructionsLabel: "Instrucciones de recogida",
    instructionsHelper: "(visibles para el comprador)",
    instructionsPlaceholder:
      "Timbrar en el local. Horario de recogida estrictamente cumplido.",
  },
  gda: {
    streetLabel: "Street address *",
    streetPlaceholder: "12 Main Street",
    line2Label: "Address line 2 / apt / unit",
    line2Placeholder: "Apt 2B",
    cityLabel: "Town / Village *",
    cityPlaceholder: "St. George's",
    stateLabel: "Parish",
    statePlaceholder: "St. George",
    postalLabel: "Postal code",
    postalPlaceholder: "",
    countryLabel: "Country *",
    contactNameLabel: "Contact name",
    contactNamePlaceholder: "Andre Joseph",
    contactPhoneLabel: "Contact phone",
    contactPhonePlaceholder: "+1 473 405 1234",
    hoursLabel: "Hours",
    hoursPlaceholder: "Mon-Sat 9am-6pm",
    instructionsLabel: "Pickup instructions",
    instructionsHelper: "(shown to buyer)",
    instructionsPlaceholder:
      "Ring the bell at the loading dock. Pickup hours strictly enforced.",
  },
  default: {
    streetLabel: "Street address *",
    streetPlaceholder: "12 Main Street",
    line2Label: "Address line 2 / apt / unit",
    line2Placeholder: "Apt 2B",
    cityLabel: "City / Town *",
    cityPlaceholder: "City",
    stateLabel: "State / Parish",
    statePlaceholder: "State or parish",
    postalLabel: "Postal code",
    postalPlaceholder: "",
    countryLabel: "Country *",
    contactNameLabel: "Contact name",
    contactNamePlaceholder: "Full name",
    contactPhoneLabel: "Contact phone",
    contactPhonePlaceholder: "+1 555 123 4567",
    hoursLabel: "Hours",
    hoursPlaceholder: "Mon-Sat 9am-6pm",
    instructionsLabel: "Pickup instructions",
    instructionsHelper: "(shown to buyer)",
    instructionsPlaceholder:
      "Ring the bell at the loading dock. Pickup hours strictly enforced.",
  },
};

function PickupLocationSection({
  card,
  inputStyle,
  label,
  primaryBtn,
  ghostBtn,
}: {
  card: React.CSSProperties;
  inputStyle: React.CSSProperties;
  label: React.CSSProperties;
  primaryBtn: React.CSSProperties;
  ghostBtn: React.CSSProperties;
}) {
  const { show } = useToast();
  const country = useAppSelector(selectCountry);
  const ph = PICKUP_PLACEHOLDERS[country?.code || ""] || PICKUP_PLACEHOLDERS.default;
  const [pickup, setPickup] = useState<PickupAddressState>({ enabled: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const client = getApiClient();
        const { data } = await client.get<PickupAddressState>("/sellers/pickup-address");
        if (!cancelled) {
          // Pre-fill country from the active country slice for first-time setup, so a
          // Grenadian seller doesn't have to type "Grenada".
          if (!data.country && country?.name) {
            setPickup({ ...data, country: country.name });
          } else {
            setPickup(data);
          }
        }
      } catch (err) {
        if (!cancelled) show("Failed to load pickup location");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [show, country?.name]);

  const set = (k: keyof PickupAddressState, v: string) =>
    setPickup((prev) => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    if (!pickup.street_address?.trim() || !pickup.city?.trim() || !pickup.country?.trim()) {
      show("Street, city, and country are required.");
      return;
    }
    setSaving(true);
    try {
      const client = getApiClient();
      await client.patch("/sellers/pickup-address", {
        street_address: pickup.street_address,
        address_line2: pickup.address_line2,
        city: pickup.city,
        state: pickup.state,
        postal_code: pickup.postal_code,
        country: pickup.country,
        contact_name: pickup.contact_name,
        contact_phone: pickup.contact_phone,
        instructions: pickup.instructions,
        hours: pickup.hours,
      });
      setPickup((prev) => ({ ...prev, enabled: true }));
      show("Pickup location saved");
    } catch (err: any) {
      show(err?.response?.data?.message || "Failed to save pickup location");
    } finally {
      setSaving(false);
    }
  };

  const handleDisable = async () => {
    if (!confirm("Disable pickup? Buyers will no longer see this option at checkout.")) return;
    setSaving(true);
    try {
      const client = getApiClient();
      await client.patch("/sellers/pickup-address", { disabled: true });
      setPickup({ enabled: false });
      show("Pickup disabled");
    } catch (err) {
      show("Failed to disable pickup");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ ...card, padding: "24px", marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#1c2b23" }}>Pickup location</div>
        {pickup.enabled && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 999,
              background: "#dcfce7",
              color: "#15803d",
            }}
          >
            Offering pickup
          </span>
        )}
      </div>
      <p style={{ fontSize: 12, color: "#8a9e92", marginBottom: 20, lineHeight: 1.55 }}>
        When set, buyers see "Pickup" as a checkout option for single-seller orders against your
        store. Pickup orders are paid by card upfront, then collected here.
      </p>

      {loading ? (
        <p style={{ fontSize: 13, color: "#8a9e92" }}>Loading…</p>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <span style={label}>{ph.streetLabel}</span>
              <input value={pickup.street_address || ""} onChange={(e) => set("street_address", e.target.value)} placeholder={ph.streetPlaceholder} style={inputStyle} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <span style={label}>{ph.line2Label}</span>
              <input value={pickup.address_line2 || ""} onChange={(e) => set("address_line2", e.target.value)} placeholder={ph.line2Placeholder} style={inputStyle} />
            </div>
            <div>
              <span style={label}>{ph.cityLabel}</span>
              <input value={pickup.city || ""} onChange={(e) => set("city", e.target.value)} placeholder={ph.cityPlaceholder} style={inputStyle} />
            </div>
            <div>
              <span style={label}>{ph.stateLabel}</span>
              <input value={pickup.state || ""} onChange={(e) => set("state", e.target.value)} placeholder={ph.statePlaceholder} style={inputStyle} />
            </div>
            <div>
              <span style={label}>{ph.postalLabel}</span>
              <input value={pickup.postal_code || ""} onChange={(e) => set("postal_code", e.target.value)} placeholder={ph.postalPlaceholder} style={inputStyle} />
            </div>
            <div>
              <span style={label}>{ph.countryLabel}</span>
              <input value={pickup.country || ""} onChange={(e) => set("country", e.target.value)} placeholder={country?.name || "Country"} style={inputStyle} />
            </div>
            <div>
              <span style={label}>{ph.contactNameLabel}</span>
              <input value={pickup.contact_name || ""} onChange={(e) => set("contact_name", e.target.value)} placeholder={ph.contactNamePlaceholder} style={inputStyle} />
            </div>
            <div>
              <span style={label}>{ph.contactPhoneLabel}</span>
              <input value={pickup.contact_phone || ""} onChange={(e) => set("contact_phone", e.target.value)} placeholder={ph.contactPhonePlaceholder} style={inputStyle} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <span style={label}>{ph.hoursLabel}</span>
              <input value={pickup.hours || ""} onChange={(e) => set("hours", e.target.value)} placeholder={ph.hoursPlaceholder} style={inputStyle} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <span style={label}>{ph.instructionsLabel} <span style={{ fontWeight: 400, color: "#8a9e92" }}>{ph.instructionsHelper}</span></span>
              <textarea
                value={pickup.instructions || ""}
                onChange={(e) => set("instructions", e.target.value)}
                placeholder={ph.instructionsPlaceholder}
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20, paddingTop: 16, borderTop: "1px solid #f0ece4" }}>
            {pickup.enabled && (
              <button onClick={handleDisable} disabled={saving} style={{ ...ghostBtn, borderColor: "#f0b0b0", color: "#c0392b" }}>
                Disable pickup
              </button>
            )}
            <button onClick={handleSave} disabled={saving} style={{ ...primaryBtn, opacity: saving ? 0.6 : 1 }}>
              {saving ? "Saving…" : pickup.enabled ? "Update pickup location" : "Enable pickup"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
