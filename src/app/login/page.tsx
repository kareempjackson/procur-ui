"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/store";
import {
  signin,
  devSignin,
  requestOtp,
  verifyOtp,
} from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

const INPUT: React.CSSProperties = {
  width: "100%",
  padding: "13px 16px",
  border: "1px solid #d8d2c8",
  borderRadius: 10,
  fontSize: 14,
  color: "#1c2b23",
  background: "#fff",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
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

function toAuthError(
  raw: unknown,
  context: "signin" | "otp-request" | "otp-verify",
): AuthError {
  const s = typeof raw === "string" ? raw.toLowerCase() : "";
  if (
    s.includes("network") ||
    s.includes("fetch") ||
    s.includes("econnrefused")
  )
    return {
      title: "Connection problem",
      hint: "Check your internet and try again.",
    };
  if (context === "signin") {
    if (
      s.includes("invalid") ||
      s.includes("incorrect") ||
      s.includes("unauthorized") ||
      s.includes("401") ||
      s.includes("credentials")
    )
      return {
        title: "Email or password is incorrect",
        hint: "Double-check your details, or use the forgot password link below.",
      };
    if (
      s.includes("not found") ||
      s.includes("no user") ||
      s.includes("no account")
    )
      return {
        title: "No account found",
        hint: "We couldn't find an account with that email. Try signing up instead.",
      };
    if (s.includes("verif") || s.includes("confirm"))
      return {
        title: "Email not verified yet",
        hint: "Check your inbox and click the verification link we sent you.",
      };
    if (
      s.includes("suspended") ||
      s.includes("banned") ||
      s.includes("disabled")
    )
      return {
        title: "Account suspended",
        hint: "Your account is restricted. Contact support for help.",
      };
    if (s.includes("rate") || s.includes("too many") || s.includes("429"))
      return {
        title: "Too many attempts",
        hint: "Wait a few minutes before trying again.",
      };
    return {
      title: "Couldn't sign you in",
      hint: "Check your details and try again. If the issue persists, reset your password.",
    };
  }
  if (context === "otp-request") {
    if (s.includes("rate") || s.includes("too many"))
      return {
        title: "Too many code requests",
        hint: "Wait a few minutes before requesting another code.",
      };
    if (s.includes("phone") || s.includes("number") || s.includes("invalid"))
      return {
        title: "Invalid phone number",
        hint: "Use full international format, e.g. +14735551234.",
      };
    if (s.includes("not found") || s.includes("no account"))
      return {
        title: "No account linked to this number",
        hint: "Check the number, or sign in with email instead.",
      };
    return {
      title: "Couldn't send verification code",
      hint: "Check the phone number and try again.",
    };
  }
  if (s.includes("expired"))
    return {
      title: "Code has expired",
      hint: "Request a new code and enter it here.",
    };
  if (s.includes("invalid") || s.includes("incorrect") || s.includes("wrong"))
    return {
      title: "Incorrect code",
      hint: "Check the code in your WhatsApp and try again.",
    };
  return {
    title: "Verification failed",
    hint: "The code may have expired — request a new one.",
  };
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [useOtp, setUseOtp] = useState(false);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  function getDestination(
    accountType: string | undefined | null,
    emailVerified: boolean,
  ): string {
    if (!emailVerified) return "/check-email";
    switch ((accountType || "").toLowerCase()) {
      case "seller":
        return "/seller";
      case "buyer":
        return "/buyer";
      case "government":
        return "/government";
      default:
        return "/";
    }
  }

  function getNextParam(): string | null {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("next");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const auth = await dispatch(signin({ email, password })).unwrap();
      const next = getNextParam();
      if (next) {
        router.replace(next);
        return;
      }
      router.replace(
        getDestination(auth.user.accountType, auth.user.emailVerified),
      );
    } catch (err) {
      setError(toAuthError(err, "signin"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(
        requestOtp({ phoneNumber: phone, channel: "whatsapp" }),
      ).unwrap();
      setOtpSent(true);
    } catch (err) {
      setError(toAuthError(err, "otp-request"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const auth = await dispatch(
        verifyOtp({ phoneNumber: phone, code }),
      ).unwrap();
      const next = getNextParam();
      if (next) {
        router.replace(next);
        return;
      }
      router.replace(
        getDestination(auth.user.accountType, auth.user.emailVerified),
      );
    } catch (err) {
      setError(toAuthError(err, "otp-verify"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDevSignin = async (type: "seller" | "buyer" | "government") => {
    setError(null);
    setIsLoading(true);
    try {
      const auth = await dispatch(devSignin({ accountType: type })).unwrap();
      const next = getNextParam();
      if (next) {
        router.replace(next);
        return;
      }
      router.replace(
        getDestination(auth.user.accountType, auth.user.emailVerified),
      );
    } catch (err) {
      setError(toAuthError(err, "signin"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Suspense fallback={null}>
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
            New to Procur?
          </span>
          <Link
            href="/signup"
            style={{
              padding: "7px 18px",
              background: "#2d4a3e",
              color: "#f5f1ea",
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 999,
              textDecoration: "none",
            }}
          >
            Create account
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
              justifyContent: "center",
              alignItems: "center",
              padding: "40px 32px",
              overflowY: "auto",
            }}
          >
            <div style={{ width: "100%", maxWidth: 400 }}>
              {/* Headline */}
              <div style={{ marginBottom: 18 }}>
                <h1
                  style={{
                    fontSize: 26,
                    fontWeight: 700,
                    color: "#1c2b23",
                    letterSpacing: "-.3px",
                    margin: "0 0 4px",
                  }}
                >
                  Welcome back
                </h1>
                <p style={{ fontSize: 13, color: "#6a7f73", margin: 0 }}>
                  Sign in to your Procur account
                </p>
              </div>

              {/* OTP toggle */}
              <div style={{ marginBottom: 16 }}>
                <button
                  type="button"
                  onClick={() => {
                    setUseOtp((v) => !v);
                    setError(null);
                    setOtpSent(false);
                    setCode("");
                  }}
                  style={{
                    fontSize: 12,
                    color: "#407178",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    padding: 0,
                    textDecoration: "underline",
                  }}
                >
                  {useOtp
                    ? "Use email & password instead"
                    : "Use phone OTP (WhatsApp) instead"}
                </button>
              </div>

              {/* Error */}
              {error && (
                <div
                  style={{
                    background: "#fff9f5",
                    border: "1px solid #fbd0b0",
                    borderRadius: 12,
                    padding: "12px 16px",
                    marginBottom: 18,
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

              {/* Email/password form */}
              {!useOtp ? (
                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    style={INPUT}
                  />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    style={INPUT}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: 12,
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        color: "#6a7f73",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        id="remember-me"
                        name="remember-me"
                        style={{ accentColor: "#2d4a3e" }}
                      />
                      Remember me
                    </label>
                    <a
                      href="/forgot-password"
                      style={{
                        color: "#407178",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      Forgot password?
                    </a>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={btn(isLoading)}
                  >
                    {isLoading ? "Signing in…" : "Continue with email"}
                  </button>
                </form>
              ) : (
                <form
                  onSubmit={otpSent ? handleVerifyOtp : handleRequestOtp}
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {!otpSent ? (
                    <>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone (E.164, e.g. +15551234567)"
                        style={INPUT}
                      />
                      <button
                        type="submit"
                        disabled={isLoading}
                        style={btn(isLoading)}
                      >
                        {isLoading ? "Sending…" : "Send code via WhatsApp"}
                      </button>
                    </>
                  ) : (
                    <>
                      <input
                        id="code"
                        name="code"
                        type="text"
                        required
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        style={INPUT}
                      />
                      <button
                        type="submit"
                        disabled={isLoading}
                        style={btn(isLoading)}
                      >
                        {isLoading ? "Verifying…" : "Verify & Sign in"}
                      </button>
                    </>
                  )}
                </form>
              )}

              {/* Dev quick sign-in */}
              {process.env.NEXT_PUBLIC_ENV !== "production" && (
                <div
                  style={{
                    marginTop: 24,
                    paddingTop: 20,
                    borderTop: "1px solid #ebe7df",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
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

              {/* Bottom links */}
              <div
                style={{
                  marginTop: 20,
                  fontSize: 12,
                  color: "#8a9e92",
                  textAlign: "center",
                  lineHeight: 1.9,
                }}
              >
                <p style={{ margin: "0 0 2px" }}>
                  By continuing, you acknowledge Procur's{" "}
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
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    style={{
                      color: "#2d4a3e",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    Sign up for free
                  </Link>
                </p>
              </div>
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
              src="/images/backgrounds/taylor-siebert-XuGmpWwt3xc-unsplash.jpg"
              alt="Fresh produce"
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
                Where fresh produce meets verified supply.
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
                Thousands of buyers and verified Grenadian farms transacting
                every week.
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
                      { label: "Newsroom", href: "/news" },
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

export default LoginPage;
