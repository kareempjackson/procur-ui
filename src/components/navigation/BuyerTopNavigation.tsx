"use client";

import React, { useEffect, useRef, useState } from "react";
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
import { fetchCart } from "@/store/slices/buyerCartSlice";
import { fetchBuyerCreditBalance } from "@/store/slices/buyerCreditsSlice";
import { useNotificationsSocket } from "@/hooks/useNotificationsSocket";

const NAV_H = 56; // px — used as CSS variable for sticky offset

const BuyerTopNavigation: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { items, status } = useAppSelector(selectNotifications);
  const { cart, optimisticCount } = useAppSelector((state) => state.buyerCart);
  useNotificationsSocket();

  useEffect(() => {
    if (status === "idle") dispatch(fetchNotifications(undefined));
  }, [status, dispatch]);

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchBuyerCreditBalance());
  }, [dispatch]);

  const credits = useAppSelector((state) => state.buyerCredits);
  const creditAmount = credits?.creditAmount ?? 0;
  const authUser = useAppSelector(selectAuthUser);
  const profile = useAppSelector((state) => state.profile.profile);

  const displayName =
    (authUser?.fullname?.trim()) ||
    (authUser?.email ? authUser.email.split("@")[0] : "User");
  const firstName = displayName.split(" ")[0];
  const orgName = authUser?.organizationName || "";
  const avatarUrl =
    profile?.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2d4a3e&color=fff`;

  const hour = new Date().getHours();
  const timeLabel = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

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
  const cartCount = (cart?.unique_products ?? 0) + optimisticCount;

  // ── shared micro-styles ──────────────────────────────────────────────────
  const iconBtn: React.CSSProperties = {
    background: "none",
    border: "none",
    cursor: "pointer",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: 8,
    color: "rgba(245,241,234,.8)",
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
    width: 15,
    height: 15,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  const dropdown: React.CSSProperties = {
    position: "absolute",
    top: "calc(100% + 6px)",
    right: 0,
    minWidth: 220,
    background: "#fff",
    border: "1px solid #e8e4dc",
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(0,0,0,.10)",
    zIndex: 400,
    overflow: "hidden",
  };

  return (
    <nav
      ref={navRef}
      style={{
        background: "#2d4a3e",
        position: "sticky",
        top: 0,
        zIndex: 200,
        fontFamily: "'Urbanist', system-ui, sans-serif",
      }}
    >
      {/* ── Single row: 3-col grid for true centering ── */}
      <div
        style={{
          maxWidth: 1300,
          margin: "0 auto",
          padding: "0 20px",
          height: NAV_H,
          display: "grid",
          gridTemplateColumns: "220px 1fr 280px",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* ── Left: logo + greeting ── */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: 1 }}>
          <Image
            src="/images/logos/procur-logo.svg"
            alt="Procur"
            width={88}
            height={22}
            style={{ filter: "brightness(0) invert(1)", opacity: 0.92 }}
          />
          <span style={{ fontSize: 10.5, color: "rgba(245,241,234,.5)", fontWeight: 500, lineHeight: 1 }}>
            Good {timeLabel},{" "}
            <strong style={{ color: "rgba(245,241,234,.85)", fontWeight: 700 }}>{firstName}</strong>
          </span>
        </Link>

        {/* ── Center: search ── */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255,255,255,.1)",
              border: "1px solid rgba(255,255,255,.13)",
              borderRadius: 999,
              height: 36,
              width: "100%",
              maxWidth: 520,
              overflow: "hidden",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="rgba(245,241,234,.4)" strokeWidth="2" strokeLinecap="round" width={14} height={14} style={{ marginLeft: 13, flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search produce, farms…"
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13, color: "#f5f1ea", padding: "0 10px", fontFamily: "inherit" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const q = (e.target as HTMLInputElement).value.trim();
                  if (q) router.push(`/?q=${encodeURIComponent(q)}`);
                }
              }}
            />
            <button
              style={{ background: "#d4783c", border: "none", borderRadius: "0 999px 999px 0", width: 42, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" width={13} height={13}>
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Right: icons ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
          {/* Credits */}
          {creditAmount > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 9px", borderRadius: 999, background: "rgba(52,211,153,.1)", border: "1px solid rgba(52,211,153,.22)", fontSize: 11, fontWeight: 600, color: "#6ee7b7", whiteSpace: "nowrap", marginRight: 4 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={11} height={11}><circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" /></svg>
              ${creditAmount.toFixed(2)}
            </div>
          )}

          {/* Orders */}
          <Link href="/orders" style={{ ...iconBtn, textDecoration: "none" }} title="My Orders">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" width={20} height={20}>
              <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </Link>

          {/* Messages */}
          <Link href="/inbox" style={{ ...iconBtn, textDecoration: "none" }} title="Messages">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" width={20} height={20}>
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </Link>

          {/* Notifications */}
          <div style={{ position: "relative" }}>
            <button
              style={iconBtn}
              onClick={() => setActiveDropdown(activeDropdown === "notif" ? null : "notif")}
              title="Notifications"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" width={20} height={20}>
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              {unreadCount > 0 && <span style={badge}>{unreadCount}</span>}
            </button>
            {activeDropdown === "notif" && (
              <div style={dropdown}>
                <div style={{ padding: "11px 14px 9px", borderBottom: "1px solid #f0ece4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23" }}>Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => { safeItems.filter((n: any) => !n.read_at).slice(0, 20).forEach((n: any) => dispatch(markNotificationRead({ id: n.id }))); setActiveDropdown(null); }}
                      style={{ fontSize: 11, color: "#d4783c", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
                    >Mark all read</button>
                  )}
                </div>
                <div style={{ maxHeight: 300, overflowY: "auto" }}>
                  {safeItems.length === 0
                    ? <div style={{ padding: "18px 14px", fontSize: 12, color: "#8a9e92", textAlign: "center" }}>No notifications yet.</div>
                    : safeItems.slice(0, 8).map((n: any) => (
                        <Link key={n.id} href="/notifications" style={{ display: "block", padding: "9px 14px", borderBottom: "1px solid #f8f6f2", textDecoration: "none", background: n.read_at ? "transparent" : "rgba(212,120,60,.04)" }}
                          onClick={() => { if (!n.read_at) dispatch(markNotificationRead({ id: n.id })); setActiveDropdown(null); }}>
                          <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1c2b23", marginBottom: 2 }}>{n.title}</div>
                          <div style={{ fontSize: 11.5, color: "#6a7f73" }}>{n.body}</div>
                        </Link>
                      ))
                  }
                </div>
                <Link href="/notifications" onClick={() => setActiveDropdown(null)} style={{ display: "block", padding: "9px 14px", fontSize: 12, fontWeight: 600, color: "#d4783c", textDecoration: "none", borderTop: "1px solid #f0ece4" }}>View all →</Link>
              </div>
            )}
          </div>

          {/* Cart */}
          <Link href="/cart" style={{ ...iconBtn, textDecoration: "none" }} title="Cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" width={20} height={20}>
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && <span style={badge}>{cartCount}</span>}
          </Link>

          {/* Divider */}
          <div style={{ width: 1, height: 22, background: "rgba(245,241,234,.15)", margin: "0 4px" }} />

          {/* Avatar dropdown */}
          <div style={{ position: "relative" }}>
            <button style={{ ...iconBtn, width: "auto", height: "auto", padding: 0 }} onClick={() => setActiveDropdown(activeDropdown === "user" ? null : "user")}>
              <img src={avatarUrl} alt={displayName} style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid rgba(245,241,234,.25)", objectFit: "cover" }} />
            </button>
            {activeDropdown === "user" && (
              <div style={dropdown}>
                <div style={{ padding: "11px 14px 9px", borderBottom: "1px solid #f0ece4" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23" }}>{displayName}</div>
                  {orgName && <div style={{ fontSize: 11, color: "#8a9e92", marginTop: 2 }}>{orgName}</div>}
                </div>
                {[
                  { label: "My Orders", href: "/orders" },
                  { label: "Suppliers", href: "/suppliers" },
                  { label: "Messages", href: "/inbox" },
                  { label: "Profile Settings", href: "/account/profile" },
                  { label: "Payment Methods", href: "/account/payments" },
                  { label: "Help & Support", href: "/help" },
                ].map((item) => (
                  <Link key={item.href} href={item.href} style={{ display: "block", padding: "9px 14px", fontSize: 13, color: "#1c2b23", textDecoration: "none", fontWeight: 500 }} onClick={() => setActiveDropdown(null)}>
                    {item.label}
                  </Link>
                ))}
                <div style={{ borderTop: "1px solid #f0ece4", padding: "6px 0" }}>
                  <button style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 14px", fontSize: 13, color: "#c0392b", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}
                    onClick={() => { dispatch(signout()); setActiveDropdown(null); router.replace("/login"); }}>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="btn-mobile-menu" style={{ ...iconBtn, display: "none" }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={20} height={20}>
              {mobileMenuOpen
                ? <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileMenuOpen && (
        <div style={{ background: "#1e3a2f", borderTop: "1px solid rgba(245,241,234,.08)" }}>
          <div style={{ padding: "8px 20px 14px" }}>
            {[
              { label: "My Orders", href: "/orders" },
              { label: "Suppliers", href: "/suppliers" },
              { label: "Messages", href: "/inbox" },
              { label: "Notifications", href: "/notifications" },
              { label: "Profile", href: "/account/profile" },
            ].map((item) => (
              <Link key={item.href} href={item.href} style={{ display: "block", padding: "10px 0", fontSize: 14, fontWeight: 600, color: "rgba(245,241,234,.8)", textDecoration: "none", borderBottom: "1px solid rgba(245,241,234,.06)" }} onClick={() => setMobileMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default BuyerTopNavigation;
