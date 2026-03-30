"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BellIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { BellIcon as BellSolidIcon } from "@heroicons/react/24/solid";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectAuthUser, signout } from "@/store/slices/authSlice";
import {
  fetchNotifications,
  markNotificationRead,
  selectNotifications,
} from "@/store/slices/notificationsSlice";
import { useNotificationsSocket } from "@/hooks/useNotificationsSocket";

interface GovernmentTopNavigationProps {
  onMobileMenuToggle?: () => void;
}

const C = {
  bg: "#fff",
  border: "#ebe7df",
  text: "#1c2b23",
  muted: "#8a9e92",
  accent: "#d4783c",
  brand: "#2d4a3e",
  brandLight: "#f5f1ea",
  hoverBg: "#faf8f4",
} as const;

const GovernmentTopNavigation: React.FC<GovernmentTopNavigationProps> = ({
  onMobileMenuToggle,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector(selectNotifications);
  useNotificationsSocket();

  useEffect(() => {
    if (status === "idle") dispatch(fetchNotifications(undefined));
  }, [status, dispatch]);

  const authUser = useAppSelector(selectAuthUser);
  const displayName =
    (authUser?.fullname && authUser.fullname.trim()) ||
    (authUser?.email ? authUser.email.split("@")[0] : "User");
  const organizationName = authUser?.organizationName || "Government";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    displayName
  )}&background=2d4a3e&color=f5f1ea`;

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
    : Array.isArray((items as unknown as { data?: unknown })?.data)
    ? ((items as unknown as { data: unknown[] }).data as any[])
    : [];
  const unreadCount = safeItems.filter((n: any) => !n.read_at).length;

  const dropdown: React.CSSProperties = {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: C.bg,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(0,0,0,.10)",
    zIndex: 50,
  };

  return (
    <nav
      ref={navRef}
      style={{
        background: C.bg,
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      <div className="gov-nav-inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 56,
          }}
        >
          {/* Logo */}
          <Link
            href="/government"
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              textDecoration: "none",
            }}
          >
            <Image
              src="/images/logos/procur-logo.svg"
              alt="Procur"
              width={88}
              height={22}
              style={{ height: 22, width: "auto" }}
            />
            <span
              style={{
                position: "absolute",
                bottom: -6,
                right: 0,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: ".04em",
                color:
                  pathname === "/government" ? C.accent : C.muted,
              }}
            >
              government
            </span>
          </Link>

          {/* Mobile menu button */}
          <button
            style={{
              display: "none",
              padding: 6,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: C.text,
            }}
            className="!flex lg:!hidden"
            onClick={onMobileMenuToggle}
          >
            <Bars3Icon style={{ width: 22, height: 22 }} />
          </button>

          {/* Right actions */}
          <div
            className="hidden lg:flex"
            style={{ alignItems: "center", gap: 16 }}
          >
            {/* Notifications */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() =>
                  setActiveDropdown(
                    activeDropdown === "notifications" ? null : "notifications"
                  )
                }
                style={{
                  position: "relative",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  color: pathname?.startsWith("/government/notifications")
                    ? C.accent
                    : C.text,
                }}
              >
                {pathname?.startsWith("/government/notifications") ? (
                  <BellSolidIcon style={{ width: 20, height: 20 }} />
                ) : (
                  <BellIcon style={{ width: 20, height: 20, strokeWidth: 2 }} />
                )}
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      background: C.accent,
                      color: "#fff",
                      fontSize: 9,
                      fontWeight: 700,
                      borderRadius: 99,
                      width: 16,
                      height: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {activeDropdown === "notifications" && (
                <div style={{ ...dropdown, width: 320 }}>
                  <div
                    style={{
                      padding: "12px 16px",
                                            display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: C.text,
                      }}
                    >
                      Notifications
                    </span>
                    <button
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: C.accent,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                      onClick={() => {
                        safeItems
                          .filter((n: any) => !n.read_at)
                          .slice(0, 20)
                          .forEach((n: any) =>
                            dispatch(markNotificationRead({ id: n.id }))
                          );
                        setActiveDropdown(null);
                      }}
                    >
                      Mark all read
                    </button>
                  </div>
                  <div style={{ maxHeight: 340, overflowY: "auto" }}>
                    {safeItems.length === 0 && (
                      <div
                        style={{
                          padding: "16px",
                          fontSize: 13,
                          color: C.muted,
                        }}
                      >
                        No notifications yet.
                      </div>
                    )}
                    {safeItems.slice(0, 8).map((n: any) => (
                      <Link
                        key={n.id}
                        href="/government/notifications"
                        style={{
                          display: "block",
                          padding: "10px 16px",
                          textDecoration: "none",
                                                    background: !n.read_at
                            ? "rgba(212,120,60,.04)"
                            : "transparent",
                        }}
                        onClick={() => {
                          if (!n.read_at)
                            dispatch(markNotificationRead({ id: n.id }));
                          setActiveDropdown(null);
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: C.text,
                            }}
                          >
                            {n.title}
                          </span>
                          {!n.read_at && (
                            <span
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: 99,
                                background: C.accent,
                                flexShrink: 0,
                              }}
                            />
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#6a7f73",
                            marginTop: 2,
                          }}
                        >
                          {n.body}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#b0c0b6",
                            marginTop: 3,
                          }}
                        >
                          {new Date(n.created_at).toLocaleString()}
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div
                    style={{
                      padding: "10px 16px",
                                          }}
                  >
                    <Link
                      href="/government/notifications"
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: C.accent,
                        textDecoration: "none",
                      }}
                      onClick={() => setActiveDropdown(null)}
                    >
                      View all notifications →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User profile */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() =>
                  setActiveDropdown(
                    activeDropdown === "user" ? null : "user"
                  )
                }
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <img
                  src={avatarUrl}
                  alt={displayName}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 99,
                  }}
                />
              </button>

              {activeDropdown === "user" && (
                <div style={{ ...dropdown, width: 240 }}>
                  <div
                    style={{
                      padding: "14px 16px",
                                          }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: C.text,
                      }}
                    >
                      {displayName}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: C.muted,
                        marginTop: 2,
                      }}
                    >
                      {organizationName}
                    </div>
                  </div>
                  <div style={{ padding: "6px 0" }}>
                    {[
                      { label: "Profile", href: "/government/profile" },
                      { label: "Reports", href: "/government/reporting" },
                      { label: "Settings", href: "/government/settings" },
                      { label: "Help & Support", href: "/government/support" },
                    ].map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        style={{
                          display: "block",
                          padding: "9px 16px",
                          fontSize: 13,
                          fontWeight: 500,
                          color: C.text,
                          textDecoration: "none",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = C.hoverBg)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                        onClick={() => setActiveDropdown(null)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  <div
                    style={{
                                            padding: "6px 0",
                    }}
                  >
                    <button
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "9px 16px",
                        fontSize: 13,
                        fontWeight: 600,
                        color: C.accent,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = C.hoverBg)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                      onClick={() => {
                        dispatch(signout());
                        setActiveDropdown(null);
                        router.replace("/login");
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default GovernmentTopNavigation;
