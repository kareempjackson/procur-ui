"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectAuthUser } from "@/store/slices/authSlice";
import { getApiClient } from "@/lib/apiClient";
import { fetchProfile, updateProfile } from "@/store/slices/profileSlice";
import { fetchActiveCountries, selectCountries } from "@/store/slices/countrySlice";
import { useToast } from "@/components/ui/Toast";
import ProcurLoader from "@/components/ProcurLoader";

// ── Design tokens ──────────────────────────────────────────────────────────────
const BG    = "#faf8f4";
const CARD  = "#fff";
const EDGE  = "#ebe7df";
const TEAL  = "#2d4a3e";
const ORANGE = "#d4783c";
const DARK  = "#1c2b23";
const MUTED = "#8a9e92";
const F     = "'Urbanist', system-ui, sans-serif";

const card: React.CSSProperties = {
  background: CARD, border: `1px solid ${EDGE}`,
  borderRadius: 10, padding: 20, fontFamily: F, marginBottom: 14,
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 14px", fontSize: 13.5, fontFamily: F,
  borderRadius: 8, border: `1px solid ${EDGE}`, background: CARD,
  color: DARK, outline: "none", boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 11.5, fontWeight: 600,
  color: DARK, marginBottom: 6, fontFamily: F,
};

const btnPrimary: React.CSSProperties = {
  padding: "8px 20px", borderRadius: 9999, border: "none",
  cursor: "pointer", background: ORANGE, color: "#fff",
  fontSize: 13, fontWeight: 600, fontFamily: F,
};

const btnGhost: React.CSSProperties = {
  padding: "8px 20px", borderRadius: 9999,
  border: `1px solid ${EDGE}`, cursor: "pointer",
  background: "transparent", color: DARK,
  fontSize: 13, fontWeight: 500, fontFamily: F,
};

// ── Types ─────────────────────────────────────────────────────────────────────
type TeamMember = {
  id: string; email: string; fullname: string;
  role: string; joinedAt: string; isActive: boolean;
};

type Invitation = {
  id: string; email: string; role: string;
  invitedBy: string; createdAt: string; expiresAt: string;
};

// ── SVG icons ─────────────────────────────────────────────────────────────────
const IcoBuilding = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" width={16} height={16}>
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const IcoInfo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" width={16} height={16}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="8.01" strokeWidth="2.5" />
    <line x1="12" y1="12" x2="12" y2="16" />
  </svg>
);
const IcoUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" width={16} height={16}>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);
const IcoEnvelope = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" width={16} height={16}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const IcoShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" width={15} height={15}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IcoCard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" width={16} height={16}>
    <rect x="1" y="4" width="22" height="16" rx="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);
const IcoPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={13} height={13}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IcoX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={13} height={13}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IcoImage = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" width={22} height={22}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

// ── Upload zone sub-component ─────────────────────────────────────────────────
function UploadZone({
  preview, accept, onChange, onClear,
  width, height, hint,
}: {
  preview: string | null;
  accept?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  width: number;
  height: number;
  hint?: string;
}) {
  const inputId = React.useId();
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
      <div style={{ flexShrink: 0, width, height, position: "relative" }}>
        {preview ? (
          <>
            <div style={{ width, height, borderRadius: 8, overflow: "hidden", border: `1px solid ${EDGE}` }}>
              <Image
                src={preview} alt="Preview" fill
                style={{ objectFit: "cover" }} sizes={`${width}px`}
              />
            </div>
            <button
              type="button"
              onClick={onClear}
              style={{
                position: "absolute", top: -8, right: -8,
                width: 22, height: 22, borderRadius: "50%",
                background: "#d4373c", border: "2px solid #fff",
                color: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <IcoX />
            </button>
          </>
        ) : (
          <label
            htmlFor={inputId}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", width, height, borderRadius: 8,
              border: `1.5px dashed ${EDGE}`, cursor: "pointer",
              color: MUTED, gap: 4,
            }}
          >
            <IcoImage />
            <span style={{ fontSize: 11, fontFamily: F }}>Upload</span>
            <input id={inputId} type="file" accept={accept || "image/*"} onChange={onChange} style={{ display: "none" }} />
          </label>
        )}
      </div>
      {hint && (
        <p style={{ fontSize: 12, color: MUTED, fontFamily: F, marginTop: 4, lineHeight: 1.5 }}>
          {hint}
        </p>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function SellerBusinessSettingsPage() {
  const user          = useAppSelector(selectAuthUser);
  const dispatch      = useAppDispatch();
  const profile       = useAppSelector((s) => s.profile.profile);
  const profileStatus = useAppSelector((s) => s.profile.status);
  const availableCountries = useAppSelector(selectCountries);
  const { show }      = useToast();

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

  type Tab = "general" | "team" | "payments";
  const [activeTab, setActiveTab] = useState<Tab>("general");

  // ── General settings state ───────────────────────────────────────────────
  const [businessName,       setBusinessName]       = useState("");
  const [businessType,       setBusinessType]       = useState("");
  const [taxId,              setTaxId]              = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [address,            setAddress]            = useState("");
  const [phone,              setPhone]              = useState("");
  const [description,        setDescription]        = useState("");
  const [savingGeneral,      setSavingGeneral]      = useState(false);

  const [headerImageFile,    setHeaderImageFile]    = useState<File | null>(null);
  const [headerImagePreview, setHeaderImagePreview] = useState<string | null>(null);
  const [logoFile,           setLogoFile]           = useState<File | null>(null);
  const [logoPreview,        setLogoPreview]        = useState<string | null>(null);
  const [farmerIdFile,       setFarmerIdFile]       = useState<File | null>(null);
  const [farmerIdPreview,    setFarmerIdPreview]    = useState<string | null>(null);

  // ── Team state ───────────────────────────────────────────────────────────
  const [teamMembers,    setTeamMembers]    = useState<TeamMember[]>([]);
  const [teamLoading,    setTeamLoading]    = useState(false);
  const [teamError,      setTeamError]      = useState<string | null>(null);
  const [invitations,    setInvitations]    = useState<Invitation[]>([]);
  const [showInvite,     setShowInvite]     = useState(false);
  const [inviteEmail,    setInviteEmail]    = useState("");
  const [inviteRole,     setInviteRole]     = useState("member");
  const [inviteSending,  setInviteSending]  = useState(false);

  // ── Payments state ───────────────────────────────────────────────────────
  const [payoutMethod,  setPayoutMethod]   = useState<"cash" | "cheque" | "">("");
  const [savingPayout,  setSavingPayout]   = useState(false);

  // ── Load profile ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (profileStatus === "idle") dispatch(fetchProfile());
  }, [dispatch, profileStatus]);

  useEffect(() => {
    if (!profile) return;
    const org = profile.organization;
    setBusinessName(org?.businessName || org?.name || "");
    setBusinessType(org?.businessType || "");
    setTaxId(org?.taxId || "");
    setRegistrationNumber(org?.registrationNumber || "");
    setAddress(
      org?.address ||
      [org?.city, org?.state, org?.postalCode].filter(Boolean).join(", ") || ""
    );
    setPhone(profile.phone_number || "");
    setDescription(org?.description || "");
    if (!headerImageFile) setHeaderImagePreview(org?.headerImageUrl || null);
    if (!logoFile)        setLogoPreview(org?.logoUrl || null);
    if (!farmerIdFile)    setFarmerIdPreview(org?.farmersIdUrl || null);
    if (org?.payoutMethod === "cash" || org?.payoutMethod === "cheque") {
      setPayoutMethod(org.payoutMethod);
    }
  }, [profile, farmerIdFile, headerImageFile, logoFile]);

  useEffect(() => {
    if (activeTab !== "payments") return;
    const m = profile?.organization?.payoutMethod;
    if (m === "cash" || m === "cheque") setPayoutMethod(m);
  }, [activeTab, profile?.organization?.payoutMethod]);

  // ── File change helpers ───────────────────────────────────────────────────
  const makeFileHandler = (
    maxMb: number,
    setFile: (f: File) => void,
    setPreview: (s: string) => void,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { show("Please upload an image file"); return; }
    if (file.size > maxMb * 1024 * 1024) { show(`Image must be under ${maxMb}MB`); return; }
    setFile(file);
    const r = new FileReader();
    r.onloadend = () => setPreview(r.result as string);
    r.readAsDataURL(file);
  };

  const handleHeaderImageChange = makeFileHandler(8, setHeaderImageFile, setHeaderImagePreview);
  const handleLogoChange         = makeFileHandler(5, setLogoFile,        setLogoPreview);
  const handleFarmerIdChange     = makeFileHandler(5, setFarmerIdFile,    setFarmerIdPreview);

  // ── Reset form to profile values ──────────────────────────────────────────
  const handleCancelGeneral = () => {
    if (!profile) return;
    const org = profile.organization;
    setBusinessName(org?.businessName || org?.name || "");
    setBusinessType(org?.businessType || "");
    setTaxId(org?.taxId || "");
    setRegistrationNumber(org?.registrationNumber || "");
    setAddress(
      org?.address ||
      [org?.city, org?.state, org?.postalCode].filter(Boolean).join(", ") || ""
    );
    setPhone(profile.phone_number || "");
    setDescription(org?.description || "");
    setHeaderImageFile(null);  setHeaderImagePreview(org?.headerImageUrl || null);
    setLogoFile(null);         setLogoPreview(org?.logoUrl || null);
    setFarmerIdFile(null);     setFarmerIdPreview(org?.farmersIdUrl || null);
  };

  // ── Upload helper ─────────────────────────────────────────────────────────
  const uploadSigned = async (
    endpoint: string,
    file: File,
    label: string,
  ): Promise<string> => {
    const client = getApiClient();
    const { data: signed } = await client.patch(endpoint, {
      organizationId: user?.organizationId,
      filename: file.name,
    });
    const res = await fetch(signed.signedUrl as string, {
      method: "PUT",
      headers: { "Content-Type": file.type || "application/octet-stream", "x-upsert": "false" },
      body: file,
    });
    if (!res.ok) throw new Error(`Failed to upload ${label}`);
    return signed.path as string;
  };

  // ── Save general ─────────────────────────────────────────────────────────
  const handleSaveGeneral = async () => {
    setSavingGeneral(true);
    try {
      let farmersIdPath:   string | undefined;
      let logoPath:        string | undefined;
      let headerImagePath: string | undefined;

      if (farmerIdFile    && user?.organizationId)
        farmersIdPath   = await uploadSigned("/users/farmers-id/signed-upload",   farmerIdFile,    "Farmer ID");
      if (logoFile        && user?.organizationId)
        logoPath        = await uploadSigned("/users/logo/signed-upload",          logoFile,        "Business Logo");
      if (headerImageFile && user?.organizationId)
        headerImagePath = await uploadSigned("/users/header-image/signed-upload",  headerImageFile, "Header Image");

      await dispatch(updateProfile({
        businessName, businessType, address, phone, description,
        taxId,
        registrationNumber,
        ...(farmersIdPath      ? { farmersIdPath }      : {}),
        ...(logoPath           ? { logoPath }           : {}),
        ...(headerImagePath    ? { headerImagePath }    : {}),
      })).unwrap();

      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("onboarding:business_profile_completed", "true");
          if (businessName && (logoFile || logoPreview || description))
            localStorage.setItem("onboarding:brand_ready", "true");
        }
      } catch { /* ignore */ }

      setFarmerIdFile(null);
      setLogoFile(null);
      setHeaderImageFile(null);
      show("Business profile updated");
    } catch (e: any) {
      const msg = e?.message || "Failed to save changes. Please try again.";
      show(msg);
    } finally {
      setSavingGeneral(false);
    }
  };

  // ── Save payout ───────────────────────────────────────────────────────────
  const handleSavePayoutMethod = async () => {
    if (!payoutMethod) { show("Please select a payout method."); return; }
    setSavingPayout(true);
    try {
      await dispatch(updateProfile({ payoutMethod })).unwrap();
      if (typeof window !== "undefined")
        localStorage.setItem("onboarding:payments_completed", "true");
      show("Payout preference saved.");
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Couldn't save payout preference.";
      show(msg);
    } finally {
      setSavingPayout(false);
    }
  };

  // ── Team API calls ────────────────────────────────────────────────────────
  const loadTeamMembers = async () => {
    setTeamLoading(true);
    setTeamError(null);
    try {
      const client = getApiClient();
      const { data } = await client.get<TeamMember[]>("/users/org-members");
      setTeamMembers(data ?? []);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to load team members.";
      setTeamError(msg);
    } finally {
      setTeamLoading(false);
    }
  };

  const loadInvitations = async () => {
    if (!user?.organizationId) return;
    try {
      const client = getApiClient();
      const { data } = await client.get<{
        id: string; email: string; role_id: string;
        created_at: string; expires_at: string;
      }[]>("/users/org-invitations");

      setInvitations((data || []).map(inv => ({
        id: inv.id, email: inv.email, role: "Member",
        invitedBy: "",
        createdAt: inv.created_at, expiresAt: inv.expires_at,
      })));
    } catch {
      // Non-fatal — invitations list stays empty if unavailable
      setInvitations([]);
    }
  };

  const handleInviteUser = async () => {
    const email = inviteEmail.trim();
    if (!email) return;
    setInviteSending(true);
    try {
      const client = getApiClient();
      await client.post("/users/org-members/invite", { email, roleName: inviteRole || undefined });
      show("Invitation sent");
      setShowInvite(false);
      setInviteEmail("");
      setInviteRole("member");
      void loadInvitations();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to send invitation.";
      show(msg);
    } finally {
      setInviteSending(false);
    }
  };

  const handleRemoveTeamMember = async (id: string) => {
    if (!confirm("Remove this team member from your organization?")) return;
    try {
      const client = getApiClient();
      await client.delete(`/users/org-members/${id}`);
      setTeamMembers(prev => prev.filter(m => m.id !== id));
      show("Team member removed");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to remove team member.";
      show(msg);
    }
  };

  const handleRevokeInvitation = async (id: string) => {
    if (!confirm("Revoke this invitation? The link will stop working.")) return;
    try {
      const client = getApiClient();
      await client.delete(`/users/org-invitations/${id}`);
      setInvitations(prev => prev.filter(i => i.id !== id));
      show("Invitation revoked");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to revoke invitation.";
      show(msg);
    }
  };

  useEffect(() => {
    if (activeTab === "team") {
      void loadTeamMembers();
      void loadInvitations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user?.organizationId]);

  // ── Tab bar ───────────────────────────────────────────────────────────────
  const tabs: { key: Tab; label: string }[] = [
    { key: "general",  label: "Company Information" },
    { key: "team",     label: "Team Members"        },
    { key: "payments", label: "Payment Settings"    },
  ];

  const tabBtn = (key: Tab): React.CSSProperties => ({
    padding: "8px 16px", background: "none", border: "none",
    cursor: "pointer", fontFamily: F, fontSize: 13.5, fontWeight: 600,
    color: activeTab === key ? ORANGE : MUTED,
    borderBottom: activeTab === key ? `2px solid ${ORANGE}` : "2px solid transparent",
    marginBottom: -1,
  });

  // ── Render ─────────────────────────────────────────────────────────────────
  if (profileStatus === "loading" || (profileStatus === "idle" && !profile)) {
    return <ProcurLoader />;
  }

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: F }}>
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "28px 24px 60px" }}>

        {/* Page header */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: DARK }}>Business Settings</div>
          <div style={{ fontSize: 13, color: MUTED, marginTop: 3 }}>
            Manage your organization details, team members, and payment settings
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", borderBottom: `1px solid ${EDGE}`, marginBottom: 22, gap: 4 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={tabBtn(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── General tab ──────────────────────────────────────────────── */}
        {activeTab === "general" && (
          <>
            {/* Shipping routes link */}
            <Link href="/seller/business/shipping" style={{ textDecoration: "none", display: "block", marginBottom: 14 }}>
              <div style={{ ...card, marginBottom: 0, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", transition: "border-color .15s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = TEAL; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = EDGE; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(45,74,62,.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="1.5" width={18} height={18}>
                      <circle cx="12" cy="12" r="10" />
                      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 650, color: DARK }}>Cross-Country Shipping</div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>Manage shipping routes to other countries</div>
                  </div>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2" strokeLinecap="round" width={16} height={16}>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </Link>

            {/* Company form card */}
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, color: ORANGE }}>
                <IcoBuilding />
                <span style={{ fontSize: 15, fontWeight: 700, color: DARK }}>Company Information</span>
              </div>

              {/* Header image */}
              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>Header Image (Farm Cover)</label>
                <UploadZone
                  preview={headerImagePreview}
                  onChange={handleHeaderImageChange}
                  onClear={() => { setHeaderImageFile(null); setHeaderImagePreview(null); }}
                  width={220} height={90}
                  hint="Optional cover shown on your public supplier page. JPG/PNG, wide image, max 8MB."
                />
              </div>

              {/* Logo */}
              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>Business Logo</label>
                <UploadZone
                  preview={logoPreview}
                  onChange={handleLogoChange}
                  onClear={() => { setLogoFile(null); setLogoPreview(null); }}
                  width={80} height={80}
                  hint="Upload your logo. JPG or PNG, max 5MB."
                />
              </div>

              {/* Fields grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={labelStyle}>Business Name *</label>
                  <input
                    type="text" value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    placeholder="Your business name" style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Business Type</label>
                  <select
                    value={businessType}
                    onChange={e => setBusinessType(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">Select type</option>
                    <option value="farmers">Farm</option>
                    <option value="general">General</option>
                    <option value="manufacturers">Manufacturers</option>
                    <option value="fishermen">Fishermen</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Tax ID</label>
                  <input
                    type="text" value={taxId}
                    onChange={e => setTaxId(e.target.value)}
                    placeholder="Tax identification number" style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Registration Number</label>
                  <input
                    type="text" value={registrationNumber}
                    onChange={e => setRegistrationNumber(e.target.value)}
                    placeholder="Business registration number" style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input
                    type="tel" value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567" style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Country</label>
                  <input
                    type="text" disabled value={orgCountryName || "—"}
                    style={{ ...inputStyle, background: "#f4f1eb", color: MUTED, cursor: "not-allowed" }}
                  />
                  <span style={{ fontSize: 10, color: MUTED, marginTop: 3, display: "block" }}>Set during registration</span>
                </div>
                <div>
                  <label style={labelStyle}>Business Address</label>
                  <input
                    type="text" value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Street, city, state, postal code" style={inputStyle}
                  />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Business Description</label>
                  <textarea
                    rows={3} value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe your business, specialties, and values…"
                    style={{ ...inputStyle, borderRadius: 8, resize: "none", lineHeight: 1.55 }}
                  />
                </div>

                {/* Farmer ID */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Farmer ID Document</label>
                  <UploadZone
                    preview={farmerIdPreview}
                    onChange={handleFarmerIdChange}
                    onClear={() => { setFarmerIdFile(null); setFarmerIdPreview(null); }}
                    width={192} height={128}
                    hint={"Upload a clear photo of your farmer ID card. This helps verify your registration.\nAccepted: JPG, PNG – max 5MB."}
                  />
                </div>
              </div>

              {/* Save / Cancel */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
                <button
                  type="button" onClick={handleCancelGeneral}
                  style={btnGhost}
                >
                  Cancel
                </button>
                <button
                  type="button" onClick={handleSaveGeneral}
                  disabled={savingGeneral}
                  style={{ ...btnPrimary, opacity: savingGeneral ? 0.6 : 1, cursor: savingGeneral ? "not-allowed" : "pointer" }}
                >
                  {savingGeneral ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>

            {/* Org info card */}
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, color: ORANGE }}>
                <IcoInfo />
                <span style={{ fontSize: 15, fontWeight: 700, color: DARK }}>Organization Details</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { label: "Organization ID", value: user?.organizationId || "Not assigned", mono: true },
                  { label: "Your Role",        value: user?.organizationRole || "Member" },
                ].map(r => (
                  <div key={r.label}>
                    <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>{r.label}</div>
                    <div style={{
                      fontSize: 13.5, color: DARK, fontFamily: r.mono ? "monospace, monospace" : F,
                      fontWeight: r.mono ? 400 : 600,
                    }}>
                      {r.value}
                    </div>
                  </div>
                ))}
                <div>
                  <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Account Type</div>
                  <div style={{
                    display: "inline-block", padding: "2px 10px",
                    background: "rgba(45,74,62,.1)", color: TEAL,
                    borderRadius: 20, fontSize: 11.5, fontWeight: 700, fontFamily: F,
                    textTransform: "uppercase", letterSpacing: ".04em",
                  }}>
                    {user?.accountType}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Status</div>
                  <div style={{
                    display: "inline-block", padding: "2px 10px",
                    background: "rgba(34,160,100,.1)", color: "#1a8a5e",
                    borderRadius: 20, fontSize: 11.5, fontWeight: 700, fontFamily: F,
                  }}>
                    Active
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Team tab ─────────────────────────────────────────────────── */}
        {activeTab === "team" && (
          <>
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: ORANGE }}>
                  <IcoUsers />
                  <span style={{ fontSize: 15, fontWeight: 700, color: DARK }}>Team Members</span>
                </div>
                <button
                  onClick={() => setShowInvite(true)}
                  style={{ ...btnPrimary, display: "flex", alignItems: "center", gap: 6, padding: "7px 14px" }}
                >
                  <IcoPlus />
                  Invite User
                </button>
              </div>

              {/* Current user row */}
              <MemberRow
                initial={(user?.fullname || user?.email || "?").charAt(0)}
                name={user?.fullname || "You"}
                email={user?.email || ""}
                role={user?.organizationRole || "Admin"}
                you
              />

              {/* Error */}
              {teamError && (
                <div style={{
                  marginTop: 10, padding: "10px 14px",
                  background: "rgba(212,120,60,.08)", border: `1px solid ${ORANGE}`,
                  borderRadius: 8, fontSize: 13, color: DARK,
                }}>
                  {teamError}
                  <button
                    onClick={loadTeamMembers}
                    style={{ marginLeft: 12, fontSize: 12, color: ORANGE, background: "none", border: "none", cursor: "pointer", fontFamily: F }}
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Loading */}
              {teamLoading && (
                <div style={{ padding: "20px 0", textAlign: "center", fontSize: 13, color: MUTED }}>
                  Loading team members…
                </div>
              )}

              {/* Other members */}
              {!teamLoading && !teamError && teamMembers.filter(m => m.email !== user?.email).map(m => (
                <MemberRow
                  key={m.id}
                  initial={(m.fullname || m.email || "?").charAt(0)}
                  name={m.fullname || m.email}
                  email={m.email}
                  role={m.role}
                  onRemove={() => handleRemoveTeamMember(m.id)}
                />
              ))}

              {/* Empty */}
              {!teamLoading && !teamError && teamMembers.filter(m => m.email !== user?.email).length === 0 && (
                <div style={{ paddingTop: 24, paddingBottom: 8, textAlign: "center" }}>
                  <div style={{ color: "#c8d8cf", marginBottom: 8 }}>
                    <IcoUsers />
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: DARK, marginBottom: 4 }}>
                    No additional team members yet
                  </div>
                  <div style={{ fontSize: 12, color: MUTED }}>
                    Invite users to collaborate on your organization
                  </div>
                </div>
              )}
            </div>

            {/* Pending invitations */}
            {invitations.length > 0 && (
              <div style={card}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, color: ORANGE }}>
                  <IcoEnvelope />
                  <span style={{ fontSize: 15, fontWeight: 700, color: DARK }}>Pending Invitations</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {invitations.map(inv => (
                    <div key={inv.id} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "10px 14px",
                      background: "rgba(212,120,60,.04)", border: `1px solid rgba(212,120,60,.3)`,
                      borderRadius: 8,
                    }}>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: DARK }}>{inv.email}</div>
                        <div style={{ fontSize: 11.5, color: MUTED, marginTop: 2 }}>
                          Invited {new Date(inv.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{
                          padding: "2px 9px", background: "rgba(212,120,60,.1)", color: ORANGE,
                          borderRadius: 20, fontSize: 11, fontWeight: 700, fontFamily: F,
                        }}>
                          {inv.role}
                        </span>
                        <button
                          onClick={() => handleRevokeInvitation(inv.id)}
                          style={{
                            fontSize: 11.5, color: "#d4373c",
                            background: "rgba(212,55,60,.06)",
                            border: "1px solid rgba(212,55,60,.2)",
                            cursor: "pointer", fontFamily: F, fontWeight: 600,
                            padding: "3px 10px", borderRadius: 9999,
                          }}
                        >
                          Revoke
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Roles info */}
            <div style={{
              padding: "14px 16px", background: "rgba(45,74,62,.06)",
              border: `1px solid rgba(45,74,62,.2)`, borderRadius: 10,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10, color: TEAL }}>
                <IcoShield />
                <span style={{ fontSize: 13, fontWeight: 700, color: TEAL }}>Team Roles</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { role: "Admin",   desc: "Full access to all features and settings" },
                  { role: "Manager", desc: "Manage products, orders, and view analytics" },
                  { role: "Member",  desc: "View and create orders, limited access" },
                ].map(r => (
                  <div key={r.role} style={{ fontSize: 12.5, color: TEAL }}>
                    <strong>{r.role}:</strong> {r.desc}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Payments tab ─────────────────────────────────────────────── */}
        {activeTab === "payments" && (
          <div style={card}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, color: ORANGE }}>
              <IcoCard />
              <span style={{ fontSize: 15, fontWeight: 700, color: DARK }}>Payout Details</span>
            </div>

            {/* Info banner */}
            <div style={{
              display: "flex", gap: 10, padding: "10px 14px",
              background: "rgba(45,74,62,.06)", border: `1px solid rgba(45,74,62,.2)`,
              borderRadius: 8, marginBottom: 18,
            }}>
              <IcoInfo />
              <span style={{ fontSize: 12.5, color: TEAL, lineHeight: 1.5 }}>
                Payouts are currently handled offline. Choose how you want to receive payouts. Bank connection is coming soon.
              </span>
            </div>

            <div style={{ fontSize: 12, fontWeight: 700, color: DARK, marginBottom: 10 }}>
              Payout method
            </div>

            {/* Method cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[
                { key: "cash",   label: "Cash",   desc: "Receive payouts in cash (offline)." },
                { key: "cheque", label: "Cheque", desc: "Receive payouts by cheque (offline)." },
              ].map(m => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setPayoutMethod(m.key as "cash" | "cheque")}
                  style={{
                    padding: "14px 16px", borderRadius: 8, textAlign: "left",
                    cursor: "pointer", fontFamily: F, transition: "all .15s",
                    border: payoutMethod === m.key
                      ? `2px solid ${ORANGE}` : `1.5px solid ${EDGE}`,
                    background: payoutMethod === m.key
                      ? "rgba(212,120,60,.05)" : CARD,
                  }}
                >
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: DARK, marginBottom: 4 }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: 12, color: MUTED }}>{m.desc}</div>
                </button>
              ))}

              {/* Coming soon */}
              <div style={{
                padding: "14px 16px", borderRadius: 8, border: `1.5px solid ${EDGE}`,
                background: "#f5f5f5", opacity: 0.65, cursor: "not-allowed",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: DARK }}>Bank Transfer</span>
                  <span style={{
                    padding: "1px 7px", background: EDGE, color: MUTED,
                    borderRadius: 20, fontSize: 10, fontWeight: 700, fontFamily: F,
                  }}>Soon</span>
                </div>
                <div style={{ fontSize: 12, color: MUTED }}>Bank connection coming soon.</div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={handleSavePayoutMethod}
                disabled={savingPayout || !payoutMethod}
                style={{
                  ...btnPrimary,
                  opacity: savingPayout || !payoutMethod ? 0.55 : 1,
                  cursor: savingPayout || !payoutMethod ? "not-allowed" : "pointer",
                }}
              >
                {savingPayout ? "Saving…" : "Save payout preference"}
              </button>
            </div>

            <div style={{ marginTop: 16, fontSize: 12, color: MUTED }}>
              For payout history and transactions, visit{" "}
              <Link href="/seller/transactions" style={{ color: ORANGE, textDecoration: "underline" }}>
                Seller → Transactions
              </Link>
              .
            </div>
          </div>
        )}
      </div>

      {/* ── Invite modal ────────────────────────────────────────────────── */}
      {showInvite && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed", inset: 0, zIndex: 600,
            background: "rgba(0,0,0,.45)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
          }}
          onClick={e => { if (e.target === e.currentTarget) setShowInvite(false); }}
        >
          <div style={{
            background: CARD, borderRadius: 12, padding: 24,
            maxWidth: 420, width: "100%", fontFamily: F,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: DARK }}>Invite Team Member</span>
              <button
                onClick={() => setShowInvite(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}
              >
                <IcoX />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email" value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  style={inputStyle}
                  onKeyDown={e => { if (e.key === "Enter") void handleInviteUser(); }}
                />
              </div>
              <div>
                <label style={labelStyle}>Role</label>
                <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} style={inputStyle}>
                  <option value="member">Member</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{
                padding: "10px 12px",
                background: "rgba(45,74,62,.06)", border: `1px solid rgba(45,74,62,.2)`,
                borderRadius: 8, fontSize: 12, color: TEAL, lineHeight: 1.5,
              }}>
                An invitation email will be sent to this address. They&apos;ll need to create an account or sign in to accept.
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <button onClick={() => setShowInvite(false)} style={{ ...btnGhost, flex: 1 }}>
                Cancel
              </button>
              <button
                onClick={handleInviteUser}
                disabled={inviteSending || !inviteEmail.trim()}
                style={{
                  ...btnPrimary, flex: 1,
                  opacity: inviteSending || !inviteEmail.trim() ? 0.55 : 1,
                  cursor: inviteSending || !inviteEmail.trim() ? "not-allowed" : "pointer",
                }}
              >
                {inviteSending ? "Sending…" : "Send Invitation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MemberRow sub-component ───────────────────────────────────────────────────
function MemberRow({
  initial, name, email, role, you, onRemove,
}: {
  initial: string; name: string; email: string; role: string;
  you?: boolean; onRemove?: () => void;
}) {
  const TEAL  = "#2d4a3e";
  const ORANGE = "#d4783c";
  const DARK  = "#1c2b23";
  const MUTED = "#8a9e92";
  const EDGE  = "#ebe7df";
  const F     = "'Urbanist', system-ui, sans-serif";

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 14px", border: `1px solid ${EDGE}`, borderRadius: 8,
      marginTop: 8, background: "#fff",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
          background: you ? ORANGE : "rgba(45,74,62,.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 700, color: you ? "#fff" : TEAL, fontFamily: F,
        }}>
          {initial.toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: DARK }}>{name}</div>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 1 }}>{email}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{
          padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700,
          fontFamily: F, background: "rgba(45,74,62,.08)", color: TEAL,
          textTransform: "capitalize",
        }}>
          {role}
        </span>
        {you && (
          <span style={{
            padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700,
            fontFamily: F, background: "rgba(212,120,60,.1)", color: ORANGE,
          }}>
            You
          </span>
        )}
        {onRemove && (
          <button
            onClick={onRemove}
            style={{
              fontSize: 11.5, color: "#d4373c", background: "rgba(212,55,60,.06)",
              border: "1px solid rgba(212,55,60,.2)", cursor: "pointer", fontFamily: F, fontWeight: 600,
              padding: "3px 10px", borderRadius: 9999,
            }}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
