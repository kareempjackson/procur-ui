"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectAuthUser, signout } from "@/store/slices/authSlice";
import {
  fetchNotifications,
  markNotificationRead,
  selectNotifications,
} from "@/store/slices/notificationsSlice";
import { useNotificationsSocket } from "@/hooks/useNotificationsSocket";
import { fetchProfile } from "@/store/slices/profileSlice";
import { fetchActiveCountries, selectCountry, selectCountries } from "@/store/slices/countrySlice";

function CountryFlag({ code, size = 20 }: { code: string; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
      srcSet={`https://flagcdn.com/w80/${code.toLowerCase()}.png 2x`}
      alt={code}
      width={size}
      height={Math.round(size * 0.75)}
      style={{ borderRadius: 2, objectFit: "cover", display: "block" }}
    />
  );
}

const NAV_H = 56;

// Icon-only nav items for verified sellers
const ICON_NAV = [
  {
    href: "/seller/orders",
    label: "Orders",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" width={18} height={18}>
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    href: "/seller/products",
    label: "Inventory",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" width={18} height={18}>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      </svg>
    ),
  },
  {
    href: "/seller/messages",
    label: "Messages",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" width={18} height={18}>
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    href: "/seller/payouts",
    label: "Payouts",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" width={18} height={18}>
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <path d="M1 10h22" />
      </svg>
    ),
  },
  {
    href: "/seller/farm",
    label: "Farm",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" width={18} height={18}>
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
];

const SellerTopNavigation: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Notifications
  const { items, status } = useAppSelector(selectNotifications);
  useNotificationsSocket();
  useEffect(() => {
    if (status === "idle") dispatch(fetchNotifications(undefined));
  }, [status, dispatch]);

  // Country
  const { code: activeCountryCode, name: activeCountryName } = useAppSelector(selectCountry);
  const availableCountries = useAppSelector(selectCountries);
  useEffect(() => { dispatch(fetchActiveCountries()); }, [dispatch]);
  const sellerCountryIso = availableCountries.find((c) => c.code === activeCountryCode)?.country_code || "GD";

  // Profile
  const authUser = useAppSelector(selectAuthUser);
  const profile = useAppSelector((s) => s.profile.profile);
  const profileStatus = useAppSelector((s) => s.profile.status);
  useEffect(() => {
    if (!profile && profileStatus === "idle") dispatch(fetchProfile());
  }, [dispatch, profile, profileStatus]);

  const displayName =
    profile?.fullname?.trim() ||
    authUser?.fullname?.trim() ||
    (authUser?.email ? authUser.email.split("@")[0] : "User");
  const businessName =
    profile?.organization?.businessName ||
    profile?.organization?.name ||
    authUser?.organizationName ||
    "Seller";
  const isFarmVerified = Boolean(profile?.organization?.farmVerified);
  const avatarUrl =
    profile?.avatarUrl ||
    authUser?.profileImg ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2d4a3e&color=fff`;

  // Click outside to close
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node))
        setActiveDropdown(null);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const safeItems = Array.isArray(items)
    ? items
    : Array.isArray((items as any)?.data)
      ? (items as any).data
      : [];
  const unreadCount = safeItems.filter((n: any) => !n.read_at).length;

  // ── Shared micro-styles ─────────────────────────────────────────────────────

  const iconBtn: React.CSSProperties = {
    background: "none",
    border: "none",
    cursor: "pointer",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 34,
    height: 34,
    borderRadius: 8,
    color: "#6a7f73",
    flexShrink: 0,
  };

  const badge: React.CSSProperties = {
    position: "absolute",
    top: 2,
    right: 2,
    background: "#d4783c",
    color: "#fff",
    fontSize: 9,
    fontWeight: 700,
    width: 14,
    height: 14,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  };

  const dropdownStyle: React.CSSProperties = {
    position: "absolute",
    top: "calc(100% + 6px)",
    right: 0,
    minWidth: 220,
    background: "#fff",
    border: "1px solid #ebe7df",
    borderRadius: 12,
    boxShadow: "0 6px 20px rgba(0,0,0,.08)",
    zIndex: 400,
    overflow: "hidden",
  };

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname?.startsWith(href);

  const textLinkStyle = (href: string, exact = false): React.CSSProperties => {
    const active = isActive(href, exact);
    return {
      fontSize: 13.5,
      fontWeight: 600,
      color: active ? "#2d4a3e" : "#6a7f73",
      textDecoration: "none",
      padding: "4px 0",
      borderBottom: active ? "2px solid #d4783c" : "2px solid transparent",
      whiteSpace: "nowrap" as const,
    };
  };

  const iconNavBtn = (href: string): React.CSSProperties => {
    const active = isActive(href);
    return {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 34,
      height: 34,
      borderRadius: 8,
      color: active ? "#2d4a3e" : "#8a9e92",
      background: active ? "rgba(45,74,62,.08)" : "none",
      textDecoration: "none",
      flexShrink: 0,
    };
  };

  return (
    <nav
      ref={navRef}
      style={{
        background: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 200,
        fontFamily: "'Urbanist', system-ui, sans-serif",
      }}
    >
      <div
        className="sn-inner"
        style={{
          maxWidth: 1300,
          margin: "0 auto",
          padding: "0 20px",
          height: NAV_H,
          display: "grid",
          gridTemplateColumns: "200px 1fr auto",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* ── Left: logo + "seller" label ── */}
        <Link
          href="/seller"
          style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: 2, width: "fit-content" }}
        >
          <Image
            src="/images/logos/procur-logo.svg"
            alt="Procur"
            width={88}
            height={22}
            priority
          />
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#d4783c",
              lineHeight: 1,
              letterSpacing: ".04em",
              textTransform: "lowercase",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            seller
            <span style={{ display: "flex", alignItems: "center", gap: 4, color: "rgba(0,0,0,.35)", fontWeight: 600, textTransform: "none", letterSpacing: 0 }}>
              · <CountryFlag code={sellerCountryIso} size={13} /> {activeCountryName || "Grenada"}
            </span>
          </span>
        </Link>

        {/* ── Center: text links + icon links ── */}
        <div
          className="sn-center"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          {/* Text links */}
          <Link href="/" style={textLinkStyle("/", true)}>Browse</Link>
          <Link href="/seller" style={textLinkStyle("/seller", true)}>Dashboard</Link>

          {/* Icon-only links (verified only) */}
          {isFarmVerified && (
            <>
              <div style={{ width: 1, height: 16, background: "#ebe7df" }} />
              {ICON_NAV.map(({ href, label, icon }) => (
                <Link key={href} href={href} title={label} style={iconNavBtn(href)}>
                  {icon}
                </Link>
              ))}
            </>
          )}
        </div>

        {/* ── Right: actions ── */}
        <div
          className="sn-right"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Notifications */}
          <div style={{ position: "relative" }}>
            <button
              style={iconBtn}
              onClick={() => setActiveDropdown(activeDropdown === "notif" ? null : "notif")}
              title="Notifications"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" width={19} height={19}>
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              {unreadCount > 0 && <span style={badge}>{unreadCount}</span>}
            </button>

            {activeDropdown === "notif" && (
              <div style={{ ...dropdownStyle, minWidth: 300 }}>
                <div style={{ padding: "11px 14px 9px", borderBottom: "1px solid #f0ece4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23" }}>Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => {
                        safeItems.filter((n: any) => !n.read_at).slice(0, 20)
                          .forEach((n: any) => dispatch(markNotificationRead({ id: n.id })));
                        setActiveDropdown(null);
                      }}
                      style={{ fontSize: 11, color: "#d4783c", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div style={{ maxHeight: 300, overflowY: "auto" }}>
                  {safeItems.length === 0 ? (
                    <div style={{ padding: "18px 14px", fontSize: 12, color: "#8a9e92", textAlign: "center" }}>
                      No notifications yet.
                    </div>
                  ) : (
                    safeItems.slice(0, 8).map((n: any) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => {
                          const rawUrl = (n.data?.cta_url as string) || (n.data?.link as string);
                          let url = rawUrl;
                          if (rawUrl) {
                            try { url = new URL(rawUrl).pathname + new URL(rawUrl).search + new URL(rawUrl).hash; } catch { /* relative, use as-is */ }
                          }
                          router.push(url || "/seller/notifications");
                          if (!n.read_at) dispatch(markNotificationRead({ id: n.id }));
                          setActiveDropdown(null);
                        }}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: "9px 14px",
                          background: n.read_at ? "transparent" : "rgba(212,120,60,.04)",
                          border: "none",
                          borderBottom: "1px solid #f8f6f2",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1c2b23", marginBottom: 2 }}>{n.title}</div>
                        <div style={{ fontSize: 11.5, color: "#6a7f73" }}>{n.body}</div>
                      </button>
                    ))
                  )}
                </div>
                <Link
                  href="/seller/notifications"
                  onClick={() => setActiveDropdown(null)}
                  style={{ display: "block", padding: "9px 14px", fontSize: 12, fontWeight: 600, color: "#d4783c", textDecoration: "none", borderTop: "1px solid #f0ece4" }}
                >
                  View all →
                </Link>
              </div>
            )}
          </div>

          {/* Add Product — icon-only button */}
          {isFarmVerified ? (
            <Link
              href="/seller/add/product"
              title="Add Product"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "#d4783c",
                color: "#fff",
                textDecoration: "none",
                flexShrink: 0,
                marginLeft: 2,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={12} height={12}>
                <path d="M12 5v14M5 12h14" />
              </svg>
            </Link>
          ) : (
            <span
              title="Complete verification to add products"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "#f0ece4",
                color: "#b0c0b6",
                flexShrink: 0,
                marginLeft: 2,
                cursor: "not-allowed",
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={12} height={12}>
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
          )}

          {/* Divider */}
          <div style={{ width: 1, height: 20, background: "#ebe7df", margin: "0 6px" }} />

          {/* Avatar + dropdown */}
          <div style={{ position: "relative" }}>
            <button
              style={{ ...iconBtn, width: "auto", height: "auto", padding: 0 }}
              onClick={() => setActiveDropdown(activeDropdown === "user" ? null : "user")}
            >
              <img
                src={avatarUrl}
                alt={displayName}
                style={{ width: 30, height: 30, borderRadius: "50%", border: "2px solid #ebe7df", objectFit: "cover" }}
              />
            </button>

            {activeDropdown === "user" && (
              <div style={dropdownStyle}>
                <div style={{ padding: "12px 14px 10px", borderBottom: "1px solid #f0ece4" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23" }}>{displayName}</div>
                  <div style={{ fontSize: 11.5, color: "#8a9e92", marginTop: 2 }}>{businessName}</div>
                </div>
                <div style={{ padding: "4px 0" }}>
                  {[
                    { href: "/seller", label: "Dashboard" },
                    { href: "/seller/profile", label: "Profile Settings" },
                    { href: "/seller/business", label: "Business Settings" },
                    { href: "/seller/analytics", label: "Analytics" },
                  ].map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setActiveDropdown(null)}
                      style={{ display: "block", padding: "8px 14px", fontSize: 13, fontWeight: 500, color: "#1c2b23", textDecoration: "none" }}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
                <div style={{ borderTop: "1px solid #f0ece4", padding: "4px 0" }}>
                  <button
                    onClick={() => { dispatch(signout()); setActiveDropdown(null); router.replace("/login"); }}
                    style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 14px", fontSize: 13, fontWeight: 500, color: "#d4783c", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger — hidden on desktop, shown ≤768px via .sn-hamburger CSS class */}
          <button
            className="sn-hamburger"
            style={{ ...iconBtn, display: "none", color: "#2d4a3e" }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={20} height={20}>
              {mobileMenuOpen
                ? <path d="M18 6L6 18M6 6l12 12" />
                : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* ── Seller mobile menu ── */}
      {mobileMenuOpen && (
        <div style={{ background: "#faf8f4", borderTop: "1px solid #ebe7df" }}>
          <div style={{ padding: "8px 16px 14px" }}>
            {[
              { label: "Dashboard", href: "/seller" },
              { label: "Browse Marketplace", href: "/" },
              { label: "Orders", href: "/seller/orders" },
              { label: "Inventory", href: "/seller/products" },
              { label: "Messages", href: "/seller/messages" },
              { label: "Payouts", href: "/seller/payouts" },
              { label: "Farm", href: "/seller/farm" },
              { label: "Business Settings", href: "/seller/business" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{ display: "block", padding: "10px 0", fontSize: 14, fontWeight: 600, color: "#2d4a3e", textDecoration: "none", borderBottom: "1px solid #ebe7df" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => { dispatch(signout()); setMobileMenuOpen(false); router.replace("/login"); }}
              style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 0", fontSize: 14, fontWeight: 600, color: "#d4783c", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default SellerTopNavigation;
