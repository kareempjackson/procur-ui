"use client";

import { useState, Fragment, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  BuildingOffice2Icon,
  ChartBarIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface NavChild { label: string; href: string; }
interface NavItem { id: string; label: string; icon?: any; href?: string; section?: string; children?: NavChild[]; separator?: boolean; }
interface Props { collapsed: boolean; onToggle: () => void; }

const C = {
  bg: "#fff",
  pageBg: "#faf8f4",
  text: "#1c2b23",
  muted: "#8a9e92",
  accent: "#d4783c",
  brand: "#2d4a3e",
  hoverBg: "rgba(45,74,62,.04)",
  activeBg: "rgba(212,120,60,.06)",
} as const;

const RAIL_W = 48;
const PANEL_W = 230;

export default function GovernmentSideNavigation({ collapsed, onToggle }: Props) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<string[]>(["vendors-operations"]);
  const prevPathname = useRef(pathname);
  const open = !collapsed;

  useEffect(() => {
    if (pathname !== prevPathname.current && open) onToggle();
    prevPathname.current = pathname;
  }, [pathname, open, onToggle]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "/") { e.preventDefault(); onToggle(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onToggle]);

  // Lock body scroll when panel is open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const navigationItems: NavItem[] = [
    { id: "overview", label: "Overview", icon: HomeIcon, href: "/government", section: "main" },
    {
      id: "vendors-operations", label: "Vendors & Ops", icon: BuildingOffice2Icon, section: "main",
      children: [
        { label: "All Vendors", href: "/government/vendors" },
        { label: "Register New", href: "/government/vendors/new" },
        { label: "Production", href: "/government/production" },
        { label: "Land", href: "/government/land" },
        { label: "Products", href: "/government/products" },
      ],
    },
    {
      id: "insights", label: "Market & Insights", icon: ChartBarIcon, section: "main",
      children: [
        { label: "Market Analysis", href: "/government/market" },
        { label: "Data Explorer", href: "/government/data" },
      ],
    },
    {
      id: "compliance", label: "Compliance", icon: ShieldCheckIcon, section: "main",
      children: [
        { label: "Compliance", href: "/government/compliance" },
        { label: "Reporting", href: "/government/reporting" },
      ],
    },
    { id: "programs", label: "Programs", icon: AcademicCapIcon, href: "/government/programs", section: "main" },
    { separator: true } as NavItem,
    { id: "settings", label: "Settings", icon: Cog6ToothIcon, href: "/government/settings", section: "footer" },
    { id: "support", label: "Support", icon: QuestionMarkCircleIcon, href: "/government/support", section: "footer" },
  ];

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const isActive = (href: string) => {
    if (href === "/government") return pathname === "/government";
    return pathname?.startsWith(href);
  };

  const isSectionActive = (item: NavItem) => {
    if (item.href) return isActive(item.href);
    if (item.children) return item.children.some((c) => c.href && isActive(c.href));
    return false;
  };

  const mainItems = navigationItems.filter((i) => !i.separator && i.section !== "footer");
  const footerItems = navigationItems.filter((i) => i.section === "footer");

  const iconBtn = (active: boolean): React.CSSProperties => ({
    width: 32,
    height: 32,
    borderRadius: 8,
    border: "none",
    background: active ? C.activeBg : "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: active ? C.accent : C.muted,
    transition: "all 0.15s ease",
  });

  return (
    <>
      {/* ── Icon rail (fixed, floats over page) ───────────────────── */}
      <div
        className="hidden lg:flex"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: RAIL_W,
          height: "100vh",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 14,
          paddingBottom: 14,
          zIndex: 45,
        }}
      >
        {/* Menu toggle */}
        <button
          onClick={onToggle}
          style={{
            ...iconBtn(false),
            marginBottom: 12,
            color: open ? C.accent : C.muted,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = C.hoverBg; e.currentTarget.style.color = C.text; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = open ? C.accent : C.muted; }}
          title={open ? "Close menu" : "Open menu"}
        >
          {open ? (
            <XMarkIcon style={{ width: 18, height: 18 }} />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={17} height={17}>
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          )}
        </button>

        {/* Main icons */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, flex: 1 }}>
          {mainItems.map((item) => {
            const Icon = item.icon;
            const active = isSectionActive(item);
            return (
              <button
                key={item.id}
                onClick={onToggle}
                style={iconBtn(active)}
                onMouseEnter={(e) => {
                  if (!active) { e.currentTarget.style.background = C.hoverBg; e.currentTarget.style.color = C.text; }
                }}
                onMouseLeave={(e) => {
                  if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.muted; }
                }}
                title={item.label}
              >
                {Icon && <Icon style={{ width: 17, height: 17 }} />}
              </button>
            );
          })}
        </div>

        {/* Footer icons */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          {footerItems.map((item) => {
            const Icon = item.icon;
            const active = item.href ? isActive(item.href) : false;
            return (
              <Link
                key={item.id}
                href={item.href || "#"}
                style={{ ...iconBtn(active), textDecoration: "none" }}
                onMouseEnter={(e) => {
                  if (!active) { e.currentTarget.style.background = C.hoverBg; e.currentTarget.style.color = C.text; }
                }}
                onMouseLeave={(e) => {
                  if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.muted; }
                }}
                title={item.label}
              >
                {Icon && <Icon style={{ width: 17, height: 17 }} />}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Backdrop ──────────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(28,43,35,.12)",
          zIndex: 46,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.25s ease",
        }}
        onClick={onToggle}
      />

      {/* ── Slide-out panel ───────────────────────────────────────── */}
      <div
        className="hidden lg:flex"
        style={{
          position: "fixed",
          top: 12,
          left: RAIL_W,
          bottom: 12,
          width: PANEL_W,
          background: C.bg,
          zIndex: 47,
          flexDirection: "column",
          borderRadius: 14,
          boxShadow: open
            ? "0 8px 40px rgba(0,0,0,.10), 0 0 0 1px rgba(0,0,0,.04)"
            : "none",
          transform: open ? "translateX(0)" : `translateX(-${PANEL_W + 20}px)`,
          opacity: open ? 1 : 0,
          transition: "transform 0.28s cubic-bezier(.4,0,.2,1), opacity 0.22s ease",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {/* Panel header */}
        <div style={{ padding: "18px 18px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: C.muted }}>
            Menu
          </span>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: "0 8px 8px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {navigationItems.map((item, index) => {
              if (item.separator) return <div key={`sep-${index}`} style={{ height: 8 }} />;

              const Icon = item.icon;
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedSections.includes(item.id);
              const active = isSectionActive(item);

              const base: React.CSSProperties = {
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "8px 10px",
                borderRadius: 8,
                border: "none",
                background: active ? C.activeBg : "transparent",
                color: active ? C.text : C.muted,
                cursor: "pointer",
                textDecoration: "none",
                fontSize: 13,
                fontWeight: active ? 700 : 500,
                width: "100%",
                fontFamily: "inherit",
                transition: "all 0.12s ease",
              };

              const hIn = (e: React.MouseEvent<HTMLElement>) => {
                if (!active) { e.currentTarget.style.background = C.hoverBg; e.currentTarget.style.color = C.text; }
              };
              const hOut = (e: React.MouseEvent<HTMLElement>) => {
                if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.muted; }
              };

              return (
                <Fragment key={item.id}>
                  {item.href && !hasChildren ? (
                    <Link href={item.href} style={base} onMouseEnter={hIn} onMouseLeave={hOut}>
                      {Icon && <Icon style={{ width: 16, height: 16, flexShrink: 0, color: active ? C.accent : "inherit" }} />}
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <button onClick={() => hasChildren && toggleSection(item.id)} style={base} onMouseEnter={hIn} onMouseLeave={hOut}>
                      {Icon && <Icon style={{ width: 16, height: 16, flexShrink: 0, color: active ? C.accent : "inherit" }} />}
                      <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>
                      {hasChildren && (
                        <ChevronDownIcon style={{ width: 11, height: 11, transform: isExpanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", opacity: 0.35 }} />
                      )}
                    </button>
                  )}

                  {hasChildren && isExpanded && (
                    <div style={{ marginLeft: 25, display: "flex", flexDirection: "column" }}>
                      {item.children!.map((child, ci) => {
                        const ca = isActive(child.href);
                        return (
                          <Link
                            key={ci}
                            href={child.href}
                            style={{
                              display: "block",
                              padding: "6px 10px",
                              borderRadius: 6,
                              fontSize: 12.5,
                              fontWeight: ca ? 700 : 500,
                              color: ca ? C.accent : C.muted,
                              textDecoration: "none",
                              background: ca ? C.activeBg : "transparent",
                              transition: "all 0.12s ease",
                            }}
                            onMouseEnter={(e) => { if (!ca) { e.currentTarget.style.background = C.hoverBg; e.currentTarget.style.color = C.text; } }}
                            onMouseLeave={(e) => { if (!ca) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.muted; } }}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>
        </nav>

        {/* Shortcut */}
        <div style={{ padding: "12px 18px" }}>
          <span style={{ fontSize: 10, color: C.muted, opacity: 0.6 }}>
            <kbd style={{ padding: "1px 4px", borderRadius: 3, background: "rgba(0,0,0,.03)", fontSize: 9 }}>⌘/</kbd> toggle
          </span>
        </div>
      </div>
    </>
  );
}
