"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/store";
import { signup as signupThunk, devSignin } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import ProcurLoader from "@/components/ProcurLoader";
import ReCAPTCHA from "react-google-recaptcha";

const INPUT: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1px solid #d8d2c8",
  borderRadius: 10,
  fontSize: 14,
  color: "#1c2b23",
  background: "#fff",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const INPUT_ERROR: React.CSSProperties = {
  ...INPUT,
  border: "1px solid #e05c2a",
  background: "#fff9f5",
};

const SELECT: React.CSSProperties = {
  ...INPUT,
  appearance: "none",
  WebkitAppearance: "none",
  cursor: "pointer",
};

const SELECT_ERROR: React.CSSProperties = {
  ...SELECT,
  border: "1px solid #e05c2a",
  background: "#fff9f5",
};

function btn(disabled?: boolean): React.CSSProperties {
  return {
    width: "100%",
    padding: "14px",
    background: disabled ? "#8a9e92" : "#2d4a3e",
    color: "#f5f1ea",
    fontSize: 14,
    fontWeight: 700,
    borderRadius: 999,
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "inherit",
    transition: "background .2s",
  };
}

type AuthError = { title: string; hint: string };
type FieldErrors = Partial<Record<string, string>>;

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p style={{ fontSize: 11, color: "#c2390a", margin: "3px 0 0 4px", display: "flex", alignItems: "center", gap: 4 }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={11} height={11} style={{ flexShrink: 0 }}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <circle cx="12" cy="16" r=".6" fill="currentColor" stroke="none" />
      </svg>
      {msg}
    </p>
  );
}

function extractMsg(raw: unknown): string {
  if (typeof raw === "string") return raw;
  if (raw && typeof raw === "object") {
    const r = raw as Record<string, unknown>;
    if (typeof r.message === "string") return r.message;
    if (typeof r.error === "string") return r.error;
    if (typeof r.msg === "string") return r.msg;
    // axios error shape
    const data = r.response && typeof r.response === "object"
      ? (r.response as Record<string, unknown>).data
      : null;
    if (data && typeof data === "object") {
      const d = data as Record<string, unknown>;
      if (typeof d.message === "string") return d.message;
      if (Array.isArray(d.message)) return (d.message as string[]).join(", ");
    }
  }
  return "";
}

function toSignupError(raw: unknown): { banner: AuthError | null; field?: string; fieldMsg?: string } {
  const s = extractMsg(raw).toLowerCase();

  if (s.includes("network") || s.includes("fetch") || s.includes("econnrefused"))
    return { banner: { title: "Connection problem", hint: "Check your internet and try again." } };

  if (s.includes("exists") || s.includes("duplicate") || s.includes("already") || s.includes("registered") || s.includes("taken"))
    return { banner: null, field: "email", fieldMsg: "An account with this email already exists. Try signing in instead." };

  if (s.includes("email") && (s.includes("invalid") || s.includes("format") || s.includes("valid")))
    return { banner: null, field: "email", fieldMsg: "Enter a valid email address." };

  if (s.includes("password"))
    return { banner: null, field: "password", fieldMsg: "Use at least 8 characters with a mix of letters and numbers." };

  if (s.includes("captcha") || s.includes("bot") || s.includes("recaptcha"))
    return { banner: { title: "Bot verification failed", hint: "Complete the CAPTCHA challenge and try again." } };

  if (s.includes("rate") || s.includes("too many") || s.includes("429"))
    return { banner: { title: "Too many attempts", hint: "Wait a few minutes before trying again." } };

  if (s.includes("phone") || s.includes("whatsapp"))
    return { banner: null, field: "phoneNumber", fieldMsg: "Enter a valid international phone number (e.g. +1 473 123 4567)." };

  // Show the raw API message if it's short and readable, otherwise generic
  const rawMsg = extractMsg(raw);
  const isGenericFallback = !rawMsg || rawMsg.toLowerCase().includes("failed to sign up");
  return {
    banner: {
      title: "Couldn't create your account",
      hint: isGenericFallback
        ? "Check your details and try again. Contact support if the issue persists."
        : rawMsg,
    },
  };
}

const ACCOUNT_TYPES = [
  {
    value: "buyer",
    label: "Buyer",
    description: "Discover suppliers and request quotes",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        width={22}
        height={22}
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
      </svg>
    ),
  },
  {
    value: "seller",
    label: "Seller",
    description: "List products and manage orders",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        width={22}
        height={22}
      >
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
];

const BUSINESS_TYPES: Record<string, { value: string; label: string }[]> = {
  buyer: [
    { value: "general", label: "General" },
    { value: "hotels", label: "Hotels" },
    { value: "restaurants", label: "Restaurants" },
    { value: "supermarkets", label: "Supermarkets" },
    { value: "exporters", label: "Exporters" },
  ],
  seller: [
    { value: "general", label: "General" },
    { value: "farmers", label: "Farmers" },
    { value: "manufacturers", label: "Manufacturers" },
    { value: "fishermen", label: "Fishermen" },
  ],
};

const COUNTRIES = [
  "Grenada",
  "St. Vincent",
  "Trinidad & Tobago",
  "Barbados",
  "St. Lucia",
  "Panama",
  "Colombia",
];

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullname: "",
    accountType: "",
    businessType: "",
    businessName: "",
    phoneNumber: "",
    country: "Grenada",
    website: "",
  });
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const accountTypeParam = params.get("accountType");
    const stepParam = params.get("step");
    if (accountTypeParam === "seller" || accountTypeParam === "buyer") {
      setFormData((prev) => ({ ...prev, accountType: accountTypeParam }));
    }
    if (stepParam === "business") setStep(2);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => { const next = { ...prev }; delete next[name]; return next; });
    }
  };

  const handleAccountTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      accountType: e.target.value,
      businessType: "",
    }));
  };

  const goToStep2 = () => {
    if (!formData.accountType) {
      setError({
        title: "Account type required",
        hint: "Select whether you're a buyer or supplier to continue.",
      });
      return;
    }
    setError(null);
    setFieldErrors({});
    setStep(2);
  };

  const goToStep3 = () => {
    const errs: FieldErrors = {};
    if (!formData.businessType) errs.businessType = "Select your business type to continue.";
    if (!formData.businessName.trim()) errs.businessName = "Enter your business or organisation name.";
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    setError(null);
    setFieldErrors({});
    setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Field-level validation
    const errs: FieldErrors = {};
    if (!formData.fullname.trim()) errs.fullname = "Enter your full name.";
    if (!formData.email.trim()) errs.email = "Enter your email address.";
    if (!formData.password) errs.password = "Create a password.";
    else if (formData.password.length < 8) errs.password = "Password must be at least 8 characters.";
    if (!formData.phoneNumber.trim()) {
      errs.phoneNumber = "Enter your WhatsApp number so we can send order updates.";
    } else if (!formData.phoneNumber.trim().startsWith("+")) {
      errs.phoneNumber = "Include your country code — start with + (e.g. +1 473 123 4567).";
    } else if (!/^\+[1-9]\d{7,14}$/.test(formData.phoneNumber.trim().replace(/\s/g, ""))) {
      errs.phoneNumber = "Enter a valid number with country code (e.g. +1 473 123 4567).";
    }
    if (!captchaToken) {
      setError({ title: "Bot verification needed", hint: "Complete the CAPTCHA challenge before creating your account." });
    }
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    if (!captchaToken) return;

    setIsLoading(true);
    try {
      await dispatch(
        signupThunk({
          email: formData.email,
          password: formData.password,
          fullname: formData.fullname,
          accountType: formData.accountType,
          businessType:
            formData.accountType === "buyer" ||
            formData.accountType === "seller"
              ? formData.businessType
              : undefined,
          businessName:
            formData.accountType === "buyer" ||
            formData.accountType === "seller"
              ? formData.businessName
              : undefined,
          phoneNumber: formData.phoneNumber || undefined,
          country: formData.country || undefined,
          website: formData.website || undefined,
          captchaToken,
        }),
      ).unwrap();
      router.push("/check-email");
    } catch (err) {
      const result = toSignupError(err);
      if (result.field && result.fieldMsg) {
        setFieldErrors({ [result.field]: result.fieldMsg });
        setError(null);
      } else {
        setError(result.banner);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDevSignin = async (type: "seller" | "buyer" | "government") => {
    setError(null);
    setIsLoading(true);
    try {
      const auth = await dispatch(devSignin({ accountType: type })).unwrap();
      const accountType = (auth.user.accountType || "").toLowerCase();
      const dest = !auth.user.emailVerified
        ? "/check-email"
        : accountType === "seller"
          ? "/seller"
          : accountType === "buyer"
            ? "/buyer"
            : accountType === "government"
              ? "/government"
              : "/";
      router.push(dest);
    } catch (err) {
      const result = toSignupError(err);
      setError(result.banner);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Suspense fallback={<ProcurLoader />}>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "#fafaf9",
          fontFamily: "'Urbanist', system-ui, sans-serif",
          WebkitFontSmoothing: "antialiased",
          color: "#1c2b23",
        }}
      >
        {/* ── Header ── */}
        <header
          style={{
            background: "#fafaf9",
            height: 56,
            display: "flex",
            alignItems: "center",
            padding: "0 28px",
            flexShrink: 0,
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Image
              src="/images/logos/procur-logo.svg"
              alt="Procur"
              width={88}
              height={23}
              priority
            />
          </Link>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: "#8a9e92", marginRight: 14 }}>
            Already have an account?
          </span>
          <Link
            href="/login"
            style={{
              padding: "7px 18px",
              background: "#fff",
              color: "#2d4a3e",
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 999,
              textDecoration: "none",
              border: "1px solid #d8d2c8",
            }}
          >
            Sign in
          </Link>
        </header>

        {/* ── Body (full screen height) ── */}
        <div
          style={{
            height: "calc(100vh - 56px)",
            display: "flex",
            overflow: "hidden",
          }}
        >
          {/* Left — form */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "32px 32px",
              overflowY: "auto",
            }}
          >
            <div style={{ width: "100%", maxWidth: 420, margin: "auto 0" }}>
              {/* Headline */}
              <div style={{ marginBottom: 14 }}>
                <h1
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#1c2b23",
                    letterSpacing: "-.3px",
                    margin: "0 0 3px",
                  }}
                >
                  Join Procur
                </h1>
                <p style={{ fontSize: 13, color: "#6a7f73", margin: 0 }}>
                  Create your account to start connecting with verified farms
                </p>
              </div>

              {/* Step indicator */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                {(
                  [
                    { num: 1, label: "Account" },
                    { num: 2, label: "Business" },
                    { num: 3, label: "Details" },
                  ] as { num: 1 | 2 | 3; label: string }[]
                ).map((s, i) => (
                  <React.Fragment key={s.num}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          background: step >= s.num ? "#2d4a3e" : "#ebe7df",
                          color: step >= s.num ? "#f5f1ea" : "#8a9e92",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {step > s.num ? "✓" : s.num}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: step === s.num ? 700 : 400,
                          color: step === s.num ? "#1c2b23" : "#8a9e92",
                        }}
                      >
                        {s.label}
                      </span>
                    </div>
                    {i < 2 && (
                      <div
                        style={{
                          flex: 1,
                          height: 1,
                          background: step > s.num ? "#2d4a3e" : "#d8d2c8",
                          maxWidth: 28,
                        }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Error */}
              {error && (
                <div
                  style={{
                    background: "#fff9f5",
                    border: "1px solid #fbd0b0",
                    borderRadius: 12,
                    padding: "10px 14px",
                    marginBottom: 12,
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#c2540a"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    width={17}
                    height={17}
                    style={{ flexShrink: 0, marginTop: 1 }}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <circle
                      cx="12"
                      cy="16"
                      r=".6"
                      fill="#c2540a"
                      stroke="none"
                    />
                  </svg>
                  <div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#7c2d12",
                        margin: "0 0 2px",
                      }}
                    >
                      {error.title}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "#9a3412",
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {error.hint}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* ── Step 1: Account type ── */}
                {step === 1 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {ACCOUNT_TYPES.map((opt) => {
                        const selected = formData.accountType === opt.value;
                        return (
                          <label
                            key={opt.value}
                            style={{
                              position: "relative",
                              cursor: "pointer",
                              borderRadius: 14,
                              border: selected ? "2px solid #2d4a3e" : "1px solid #d8d2c8",
                              padding: selected ? "15px 13px" : "16px 14px",
                              background: selected ? "#f0f4f2" : "#fff",
                              display: "flex",
                              flexDirection: "column",
                              gap: 8,
                              transition: "all .15s",
                            }}
                          >
                            <input
                              type="radio"
                              name="accountType"
                              value={opt.value}
                              checked={selected}
                              onChange={handleAccountTypeChange}
                              style={{ display: "none" }}
                            />
                            <div
                              style={{
                                width: 38,
                                height: 38,
                                borderRadius: 9,
                                background: selected ? "#d4783c" : "#f5f1ea",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: selected ? "#fff" : "#6a7f73",
                                transition: "all .15s",
                              }}
                            >
                              {opt.icon}
                            </div>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: selected ? "#2d4a3e" : "#1c2b23", marginBottom: 2 }}>
                                {opt.label}
                              </div>
                              <div style={{ fontSize: 11, color: "#6a7f73", lineHeight: 1.4 }}>
                                {opt.description}
                              </div>
                            </div>
                            {selected && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: 9,
                                  right: 9,
                                  width: 18,
                                  height: 18,
                                  borderRadius: "50%",
                                  background: "#2d4a3e",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="#f5f1ea" strokeWidth="3" strokeLinecap="round" width={9} height={9}>
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                              </div>
                            )}
                          </label>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={goToStep2}
                      disabled={!formData.accountType || isLoading}
                      style={btn(!formData.accountType || isLoading)}
                    >
                      Continue
                    </button>
                  </div>
                )}

                {/* ── Step 2: Business details ── */}
                {step === 2 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div>
                      <div style={{ position: "relative" }}>
                        <select
                          id="businessType"
                          name="businessType"
                          value={formData.businessType}
                          onChange={handleInputChange}
                          style={fieldErrors.businessType ? SELECT_ERROR : SELECT}
                        >
                          <option value="">Select business type</option>
                          {BUSINESS_TYPES[formData.accountType]?.map((bt) => (
                            <option key={bt.value} value={bt.value}>
                              {bt.label}
                            </option>
                          ))}
                        </select>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#8a9e92" strokeWidth="2" width={14} height={14}
                          style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </div>
                      <FieldError msg={fieldErrors.businessType} />
                    </div>
                    <div>
                      <input
                        id="businessName"
                        name="businessName"
                        type="text"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        placeholder="Business or organisation name"
                        style={fieldErrors.businessName ? INPUT_ERROR : INPUT}
                      />
                      <FieldError msg={fieldErrors.businessName} />
                    </div>
                    <button type="button" onClick={goToStep3} style={btn(false)}>
                      Continue
                    </button>
                    <button
                      type="button"
                      onClick={() => { setStep(1); setError(null); setFieldErrors({}); }}
                      style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, color: "#407178", textDecoration: "underline", padding: "4px 0" }}
                    >
                      ← Back
                    </button>
                  </div>
                )}

                {/* ── Step 3: Personal details ── */}
                {step === 3 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {/* Name + Country row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div>
                        <input
                          id="fullname"
                          name="fullname"
                          type="text"
                          required
                          value={formData.fullname}
                          onChange={handleInputChange}
                          placeholder="Full name"
                          style={fieldErrors.fullname ? INPUT_ERROR : INPUT}
                        />
                        <FieldError msg={fieldErrors.fullname} />
                      </div>
                      <div style={{ position: "relative" }}>
                        <select
                          id="country"
                          name="country"
                          required
                          value={formData.country}
                          onChange={handleInputChange}
                          style={SELECT}
                        >
                          {COUNTRIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#8a9e92" strokeWidth="2" width={14} height={14}
                          style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email address"
                        style={fieldErrors.email ? INPUT_ERROR : INPUT}
                      />
                      <FieldError msg={fieldErrors.email} />
                    </div>
                    <div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Create a password"
                        style={fieldErrors.password ? INPUT_ERROR : INPUT}
                      />
                      <FieldError msg={fieldErrors.password} />
                    </div>
                    <div>
                      <div style={{ position: "relative" }}>
                        <input
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          autoComplete="tel"
                          required
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          onBlur={() => {
                            const val = formData.phoneNumber.trim().replace(/\s/g, "");
                            if (!val) {
                              setFieldErrors((prev) => ({ ...prev, phoneNumber: "Enter your WhatsApp number so we can send order updates." }));
                            } else if (!val.startsWith("+")) {
                              setFieldErrors((prev) => ({ ...prev, phoneNumber: "Include your country code — start with + (e.g. +1 473 123 4567)." }));
                            } else if (!/^\+[1-9]\d{7,14}$/.test(val)) {
                              setFieldErrors((prev) => ({ ...prev, phoneNumber: "Enter a valid number with country code (e.g. +1 473 123 4567)." }));
                            } else {
                              setFieldErrors((prev) => { const next = { ...prev }; delete next.phoneNumber; return next; });
                            }
                          }}
                          placeholder="WhatsApp number (e.g. +1 473 123 4567)"
                          style={{
                            ...(fieldErrors.phoneNumber ? INPUT_ERROR : INPUT),
                            paddingRight: 36,
                          }}
                        />
                        {/* Valid checkmark */}
                        {formData.phoneNumber.trim() && !fieldErrors.phoneNumber &&
                          /^\+1[2-9]\d{9}$/.test(formData.phoneNumber.trim().replace(/\s/g, "")) && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="#2d8a4e" strokeWidth="2.5" strokeLinecap="round" width={15} height={15}
                            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                      </div>
                      {fieldErrors.phoneNumber
                        ? <FieldError msg={fieldErrors.phoneNumber} />
                        : <p style={{ fontSize: 11, color: "#6a7f73", margin: "3px 0 0 4px" }}>Include country code (e.g. +1 473 123 4567)</p>
                      }
                    </div>
                    {/* Honeypot */}
                    <div style={{ display: "none" }} aria-hidden="true">
                      <input id="website" name="website" type="text" autoComplete="off" value={formData.website} onChange={handleInputChange} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <ReCAPTCHA
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
                        onChange={(token) => setCaptchaToken(token || null)}
                      />
                    </div>
                    <button type="submit" disabled={isLoading || !captchaToken} style={btn(isLoading || !captchaToken)}>
                      {isLoading ? "Creating account…" : "Create Account"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setStep(2); setError(null); setFieldErrors({}); }}
                      style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, color: "#407178", textDecoration: "underline", padding: "4px 0" }}
                    >
                      ← Back
                    </button>
                  </div>
                )}
              </form>

              {/* Bottom links */}
              <div
                style={{
                  marginTop: 12,
                  fontSize: 11,
                  color: "#8a9e92",
                  textAlign: "center",
                  lineHeight: 1.7,
                }}
              >
                <p style={{ margin: "0 0 2px" }}>
                  By creating an account, you agree to Procur&apos;s{" "}
                  <a
                    href="/legal/terms"
                    style={{
                      color: "#407178",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    Terms
                  </a>{" "}
                  and{" "}
                  <a
                    href="/legal/privacy"
                    style={{
                      color: "#407178",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    Privacy Policy
                  </a>
                </p>
                <p style={{ margin: 0 }}>
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    style={{
                      color: "#2d4a3e",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              {/* Dev quick sign-in (non-production only) */}
              {process.env.NEXT_PUBLIC_ENV !== "production" && (
                <div
                  style={{
                    marginTop: 16,
                    padding: "14px 16px",
                    background: "#f5f3ee",
                    borderRadius: 12,
                    border: "1px dashed #d8d2c8",
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: "#8a9e92",
                      marginBottom: 10,
                      fontWeight: 600,
                      letterSpacing: ".05em",
                      textTransform: "uppercase",
                    }}
                  >
                    Dev quick sign-in
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 8,
                    }}
                  >
                    {(["seller", "buyer", "government"] as const).map(
                      (type) => (
                        <button
                          key={type}
                          type="button"
                          disabled={isLoading}
                          onClick={() => handleDevSignin(type)}
                          style={{
                            padding: "9px 4px",
                            background: "#fff",
                            border: "1px solid #d8d2c8",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#407178",
                            cursor: "pointer",
                            fontFamily: "inherit",
                          }}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* end maxWidth wrapper */}
          </div>

          {/* Right — image panel */}
          <div
            className="hidden lg:block"
            style={{
              flex: 1,
              position: "relative",
              margin: "8px 8px 8px 0",
              borderRadius: 20,
              overflow: "hidden",
            }}
          >
            <Image
              src="/images/backgrounds/polina-kuzovkova-0OkidWKbO2Q-unsplash.jpg"
              alt="Fresh produce market"
              fill
              className="object-cover"
              priority
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,.6) 0%, rgba(0,0,0,.1) 55%, transparent 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: 44,
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "rgba(245,241,234,.6)",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  margin: "0 0 10px",
                }}
              >
                Procur · Grenada
              </p>
              <h2
                style={{
                  fontSize: 30,
                  fontWeight: 700,
                  color: "#f5f1ea",
                  lineHeight: 1.2,
                  margin: "0 0 10px",
                  maxWidth: 380,
                  letterSpacing: "-.3px",
                }}
              >
                Join Grenada&apos;s agricultural marketplace.
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(245,241,234,.75)",
                  margin: 0,
                  maxWidth: 340,
                  lineHeight: 1.6,
                }}
              >
                Source directly from verified farms at transparent, fair prices.
              </p>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer style={{ background: "#0a0a0a", color: "#f5f1ea" }}>
          <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 20px" }}>
            <div style={{ padding: "80px 0 64px" }}>
              <h2
                style={{
                  fontSize: 40,
                  fontWeight: 700,
                  lineHeight: 1.15,
                  maxWidth: 520,
                  letterSpacing: "-.5px",
                  color: "#f5f1ea",
                  margin: "0 0 16px",
                }}
              >
                Building stronger food systems across the Caribbean and beyond.
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(245,241,234,.65)",
                  maxWidth: 440,
                  lineHeight: 1.65,
                  margin: "0 0 28px",
                }}
              >
                Procur connects buyers directly with verified farmers:
                transparent pricing, reliable supply, and produce that&apos;s
                never more than a day from harvest.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link
                  href="/signup?accountType=buyer"
                  style={{
                    padding: "12px 28px",
                    background: "#f5f1ea",
                    color: "#1c2b23",
                    fontSize: 13,
                    fontWeight: 700,
                    borderRadius: 999,
                    textDecoration: "none",
                  }}
                >
                  Start buying
                </Link>
                <Link
                  href="/signup?accountType=seller"
                  style={{
                    padding: "12px 28px",
                    background: "transparent",
                    color: "#f5f1ea",
                    fontSize: 13,
                    fontWeight: 600,
                    borderRadius: 999,
                    border: "1px solid rgba(245,241,234,.2)",
                    textDecoration: "none",
                  }}
                >
                  Become a supplier
                </Link>
              </div>
            </div>
            <div style={{ height: 1, background: "rgba(245,241,234,.08)" }} />
            <div style={{ display: "flex", gap: 60, padding: "48px 0 40px" }}>
              <div style={{ flexShrink: 0, width: 240 }}>
                <Image
                  src="/images/logos/procur-logo.svg"
                  alt="Procur"
                  width={80}
                  height={21}
                  style={{ filter: "brightness(0) invert(1)", opacity: 0.75 }}
                />
                <p
                  style={{
                    fontSize: 12,
                    color: "rgba(245,241,234,.55)",
                    lineHeight: 1.65,
                    marginTop: 16,
                    marginBottom: 0,
                  }}
                >
                  Procur is Grenada&apos;s agricultural marketplace,
                  purpose-built to shorten supply chains and strengthen local
                  food economies.
                </p>
                <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                  {[
                    <svg
                      key="x"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      width={14}
                      height={14}
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.65l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>,
                    <svg
                      key="ig"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      width={14}
                      height={14}
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <circle cx="12" cy="12" r="4.5" />
                      <circle
                        cx="17.5"
                        cy="6.5"
                        r="1"
                        fill="currentColor"
                        stroke="none"
                      />
                    </svg>,
                    <svg
                      key="li"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      width={14}
                      height={14}
                    >
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>,
                    <svg
                      key="fb"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      width={14}
                      height={14}
                    >
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                    </svg>,
                  ].map((icon, i) => (
                    <a
                      key={i}
                      href="#"
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        border: "1px solid rgba(245,241,234,.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "rgba(245,241,234,.55)",
                        textDecoration: "none",
                      }}
                    >
                      {icon}
                    </a>
                  ))}
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 20,
                }}
              >
                {[
                  {
                    title: "Platform",
                    links: [
                      { label: "Browse Produce", href: "/browse" },
                      {
                        label: "For Suppliers",
                        href: "/signup?accountType=seller",
                      },
                      {
                        label: "For Buyers",
                        href: "/signup?accountType=buyer",
                      },
                      { label: "Pricing", href: "/pricing" },
                      { label: "Log in", href: "/login" },
                    ],
                  },
                  {
                    title: "Solutions",
                    links: [
                      { label: "Restaurants", href: "/solutions/restaurants" },
                      { label: "Hotels", href: "/solutions/hotels" },
                      { label: "Grocery", href: "/solutions/grocery" },
                      { label: "Government", href: "/solutions/government" },
                      { label: "Agriculture", href: "/solutions/agriculture" },
                    ],
                  },
                  {
                    title: "Company",
                    links: [
                      { label: "About Procur", href: "/about" },
                      { label: "Blog", href: "/blog" },
                      { label: "Contact", href: "/contact" },
                      { label: "Careers", href: "/careers" },
                    ],
                  },
                  {
                    title: "Resources",
                    links: [
                      { label: "Help Center", href: "/help" },
                      { label: "FAQ", href: "/faq" },
                      { label: "Blog", href: "/blog" },
                      { label: "Supplier Guide", href: "/supplier-guide" },
                      { label: "Buyer Guide", href: "/buyer-guide" },
                    ],
                  },
                ].map((col) => (
                  <div key={col.title}>
                    <h5
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "rgba(245,241,234,.5)",
                        marginBottom: 14,
                        letterSpacing: ".08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {col.title}
                    </h5>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {col.links.map((link) => (
                        <li key={link.label} style={{ marginBottom: 8 }}>
                          <Link
                            href={link.href}
                            style={{
                              fontSize: 12.5,
                              color: "rgba(245,241,234,.55)",
                              textDecoration: "none",
                            }}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                paddingTop: 18,
                paddingBottom: 28,
                borderTop: "1px solid rgba(245,241,234,.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  color: "rgba(245,241,234,.35)",
                  margin: 0,
                }}
              >
                &copy; 2026 Procur Grenada Ltd. All rights reserved.
              </p>
              <div style={{ display: "flex", gap: 16 }}>
                {[
                  { label: "Privacy", href: "/privacy" },
                  { label: "Terms", href: "/terms" },
                  { label: "Cookies", href: "/cookies" },
                  { label: "Accessibility", href: "/accessibility" },
                ].map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    style={{
                      fontSize: 11,
                      color: "rgba(245,241,234,.35)",
                      textDecoration: "none",
                    }}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Suspense>
  );
};

export default SignUpPage;
