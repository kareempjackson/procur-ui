"use client";

import { Fragment, useEffect, useState } from "react";
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
interface Props { isOpen: boolean; onClose: () => void; }

const C = {
  bg: "#faf8f4",
  border: "#ebe7df",
  text: "#1c2b23",
  muted: "#8a9e92",
  accent: "#d4783c",
  brand: "#2d4a3e",
  hoverBg: "rgba(45,74,62,.04)",
  activeBg: "rgba(45,74,62,.07)",
} as const;

export default function GovernmentMobileSideNav({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

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

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) {
      document.addEventListener("keydown", h);
      document.body.style.overflow = "hidden";
    }
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 40 }}
        className="lg:hidden"
        onClick={onClose}
      />
      <aside
        style={{ position: "fixed", top: 0, left: 0, height: "100vh", width: 260, background: C.bg, boxShadow: "4px 0 20px rgba(0,0,0,.06)", zIndex: 50 }}
        className="lg:hidden"
      >
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>Menu</span>
            <button onClick={onClose} style={{ padding: 6, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", color: C.muted }} aria-label="Close">
              <XMarkIcon style={{ width: 16, height: 16 }} />
            </button>
          </div>
          <nav style={{ flex: 1, overflowY: "auto", padding: "6px 6px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {navigationItems.map((item, index) => {
                if (item.separator) return <div key={`sep-${index}`} style={{ height: 8 }} />;
                const Icon = item.icon;
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = expandedSections.includes(item.id);
                const active = isSectionActive(item);
                const base: React.CSSProperties = {
                  display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 6, border: "none",
                  background: active ? C.activeBg : "transparent", color: active ? C.text : C.muted,
                  cursor: "pointer", textDecoration: "none", fontSize: 12.5, fontWeight: active ? 700 : 500,
                  width: "100%", fontFamily: "inherit", transition: "background 0.12s",
                };
                return (
                  <Fragment key={item.id}>
                    {item.href && !hasChildren ? (
                      <Link href={item.href} style={base} onClick={onClose}>
                        {Icon && <Icon style={{ width: 16, height: 16, flexShrink: 0, color: active ? C.accent : "inherit" }} />}
                        <span>{item.label}</span>
                      </Link>
                    ) : (
                      <button onClick={() => hasChildren && toggleSection(item.id)} style={base}>
                        {Icon && <Icon style={{ width: 16, height: 16, flexShrink: 0, color: active ? C.accent : "inherit" }} />}
                        <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>
                        {hasChildren && <ChevronDownIcon style={{ width: 12, height: 12, transform: isExpanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", opacity: 0.5 }} />}
                      </button>
                    )}
                    {hasChildren && isExpanded && (
                      <div style={{ marginLeft: 24, display: "flex", flexDirection: "column", gap: 0 }}>
                        {item.children!.map((child, ci) => {
                          const ca = isActive(child.href);
                          return (
                            <Link key={ci} href={child.href} onClick={onClose} style={{ display: "block", padding: "5px 10px", borderRadius: 5, fontSize: 12, fontWeight: ca ? 700 : 500, color: ca ? C.accent : C.muted, textDecoration: "none", background: ca ? C.activeBg : "transparent" }}>
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
        </div>
      </aside>
    </>
  );
}
