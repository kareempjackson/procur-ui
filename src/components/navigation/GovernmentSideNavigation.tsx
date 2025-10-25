"use client";

import { useState, Fragment, useEffect } from "react";
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
  ChevronRightIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface NavChild {
  label: string;
  href: string;
  description?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon?: any;
  href?: string;
  section?: string;
  children?: NavChild[];
  separator?: boolean;
}

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

export default function GovernmentSideNavigation({
  collapsed,
  onToggle,
}: Props) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "vendors-operations",
  ]);

  // Keyboard shortcut to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        onToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onToggle]);

  const navigationItems: NavItem[] = [
    {
      id: "overview",
      label: "Overview",
      icon: HomeIcon,
      href: "/government",
      section: "main",
    },
    {
      id: "vendors-operations",
      label: "Vendors & Operations",
      icon: BuildingOffice2Icon,
      section: "main",
      children: [
        {
          label: "All Vendors",
          href: "/government/vendors",
          description: "Browse and manage vendors",
        },
        {
          label: "Register New",
          href: "/government/vendors/new",
          description: "Add new vendor",
        },
        {
          label: "Production",
          href: "/government/production",
          description: "Monitor crop cycles",
        },
        {
          label: "Land",
          href: "/government/land",
          description: "Acreage utilization",
        },
        {
          label: "Products",
          href: "/government/products",
          description: "Browse all products",
        },
      ],
    },
    {
      id: "insights",
      label: "Market & Insights",
      icon: ChartBarIcon,
      section: "main",
      children: [
        {
          label: "Market Analysis",
          href: "/government/market",
          description: "Supply & demand",
        },
        {
          label: "Data Explorer",
          href: "/government/data",
          description: "Export & visualizations",
        },
      ],
    },
    {
      id: "compliance",
      label: "Compliance & Reports",
      icon: ShieldCheckIcon,
      section: "main",
      children: [
        {
          label: "Compliance",
          href: "/government/compliance",
          description: "Monitor status",
        },
        {
          label: "Reporting",
          href: "/government/reporting",
          description: "Generate reports",
        },
      ],
    },
    {
      id: "programs",
      label: "Programs",
      icon: AcademicCapIcon,
      href: "/government/programs",
      section: "main",
    },
    { separator: true } as NavItem,
    {
      id: "settings",
      label: "Settings",
      icon: Cog6ToothIcon,
      href: "/government/settings",
      section: "footer",
    },
    {
      id: "support",
      label: "Help & Support",
      icon: QuestionMarkCircleIcon,
      href: "/government/support",
      section: "footer",
    },
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isActive = (href: string) => {
    if (href === "/government") {
      return pathname === "/government";
    }
    return pathname?.startsWith(href);
  };

  const isSectionActive = (item: NavItem) => {
    if (item.href) return isActive(item.href);
    if (item.children) {
      return item.children.some((child) => child.href && isActive(child.href));
    }
    return false;
  };

  return (
    <aside
      className={`sticky top-0 h-screen bg-[var(--primary-background)] transition-all duration-300 flex-shrink-0 hidden lg:block ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <div className="h-20 flex items-center justify-between px-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="text-xs uppercase tracking-wider text-[color:var(--secondary-muted-edge)] font-medium">
                Quick Nav
              </div>
            </div>
          )}
          <button
            onClick={onToggle}
            className={`p-2.5 rounded-xl hover:bg-white transition-all duration-200 group ${
              collapsed ? "mx-auto" : ""
            }`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRightIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)] group-hover:text-[var(--secondary-highlight2)] transition-colors" />
            ) : (
              <ChevronRightIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)] group-hover:text-[var(--secondary-highlight2)] transition-colors rotate-180" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <div className="space-y-1">
            {navigationItems.map((item, index) => {
              if (item.separator) {
                return <div key={`separator-${index}`} className="my-3" />;
              }

              const Icon = item.icon;
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedSections.includes(item.id);
              const active = isSectionActive(item);

              return (
                <Fragment key={item.id}>
                  {/* Parent Item */}
                  {item.href && !hasChildren ? (
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                        isActive(item.href)
                          ? "bg-white text-[var(--secondary-highlight2)] shadow-sm"
                          : "text-gray-700 hover:bg-white/60"
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      {Icon && (
                        <Icon
                          className={`h-5 w-5 flex-shrink-0 ${
                            isActive(item.href)
                              ? "text-[var(--secondary-highlight2)]"
                              : "text-gray-600 group-hover:text-gray-900"
                          }`}
                        />
                      )}
                      {!collapsed && (
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      )}
                      {/* Tooltip for collapsed state */}
                      {collapsed && (
                        <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
                          {item.label}
                        </div>
                      )}
                    </Link>
                  ) : (
                    <button
                      onClick={() => hasChildren && toggleSection(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                        active
                          ? "bg-white/80 text-[var(--secondary-highlight2)]"
                          : "text-gray-700 hover:bg-white/60"
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      {Icon && (
                        <Icon
                          className={`h-5 w-5 flex-shrink-0 ${
                            active
                              ? "text-[var(--secondary-highlight2)]"
                              : "text-gray-600 group-hover:text-gray-900"
                          }`}
                        />
                      )}
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left text-sm font-medium">
                            {item.label}
                          </span>
                          {hasChildren && (
                            <ChevronDownIcon
                              className={`h-4 w-4 transition-transform duration-200 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          )}
                        </>
                      )}
                      {/* Tooltip for collapsed state */}
                      {collapsed && (
                        <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
                          {item.label}
                        </div>
                      )}
                    </button>
                  )}

                  {/* Child Items */}
                  {hasChildren && isExpanded && !collapsed && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children!.map((child, childIndex) => (
                        <Link
                          key={childIndex}
                          href={child.href}
                          className={`block px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                            isActive(child.href)
                              ? "bg-white text-[var(--secondary-highlight2)] font-medium shadow-sm"
                              : "text-gray-600 hover:bg-white/60 hover:text-gray-900"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>
        </nav>

        {/* Footer Info */}
        {!collapsed && (
          <div className="p-4">
            <div className="text-xs text-[color:var(--secondary-muted-edge)]">
              <div className="font-medium mb-1">Navigation Shortcuts</div>
              <div className="space-y-1">
                <div>
                  Press{" "}
                  <kbd className="px-1.5 py-0.5 rounded bg-white/60 text-[10px]">
                    Ctrl
                  </kbd>{" "}
                  +{" "}
                  <kbd className="px-1.5 py-0.5 rounded bg-white/60 text-[10px]">
                    /
                  </kbd>{" "}
                  to toggle
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
