"use client";

import { Fragment, useEffect } from "react";
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
import { useState } from "react";

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
  isOpen: boolean;
  onClose: () => void;
}

export default function GovernmentMobileSideNav({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

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
        { label: "All Vendors", href: "/government/vendors" },
        { label: "Register New", href: "/government/vendors/new" },
        { label: "Production", href: "/government/production" },
        { label: "Land", href: "/government/land" },
        { label: "Products", href: "/government/products" },
      ],
    },
    {
      id: "insights",
      label: "Market & Insights",
      icon: ChartBarIcon,
      section: "main",
      children: [
        { label: "Market Analysis", href: "/government/market" },
        { label: "Data Explorer", href: "/government/data" },
      ],
    },
    {
      id: "compliance",
      label: "Compliance & Reports",
      icon: ShieldCheckIcon,
      section: "main",
      children: [
        { label: "Compliance", href: "/government/compliance" },
        { label: "Reporting", href: "/government/reporting" },
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

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="fixed top-0 left-0 h-screen w-72 bg-[var(--primary-background)] z-50 lg:hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="h-20 flex items-center justify-between px-4">
            <div className="text-sm font-semibold text-[color:var(--secondary-black)]">
              Navigation
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl hover:bg-white transition-all duration-200 group"
              aria-label="Close navigation"
            >
              <XMarkIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)] group-hover:text-[var(--secondary-highlight2)] transition-colors" />
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
                        onClick={onClose}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                          isActive(item.href)
                            ? "bg-white text-[var(--secondary-highlight2)] shadow-sm"
                            : "text-gray-700 hover:bg-white/60"
                        }`}
                      >
                        {Icon && (
                          <Icon
                            className={`h-5 w-5 flex-shrink-0 ${
                              isActive(item.href)
                                ? "text-[var(--secondary-highlight2)]"
                                : "text-gray-600"
                            }`}
                          />
                        )}
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => hasChildren && toggleSection(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                          active
                            ? "bg-white/80 text-[var(--secondary-highlight2)]"
                            : "text-gray-700 hover:bg-white/60"
                        }`}
                      >
                        {Icon && (
                          <Icon
                            className={`h-5 w-5 flex-shrink-0 ${
                              active
                                ? "text-[var(--secondary-highlight2)]"
                                : "text-gray-600"
                            }`}
                          />
                        )}
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
                      </button>
                    )}

                    {/* Child Items */}
                    {hasChildren && isExpanded && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.children!.map((child, childIndex) => (
                          <Link
                            key={childIndex}
                            href={child.href}
                            onClick={onClose}
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
        </div>
      </aside>
    </>
  );
}
