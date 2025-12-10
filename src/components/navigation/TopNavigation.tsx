"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useAppSelector } from "@/store";
import { selectAuthUser } from "@/store/slices/authSlice";

interface DropdownItem {
  title: string;
  description?: string;
  href: string;
  icon?: React.ReactNode;
}

interface MegaMenuSection {
  title: string;
  items: DropdownItem[];
}

const TopNavigation: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const { t } = useI18n();
  const [selectedCountry, setSelectedCountry] = useState({
    code: "GD",
    flag: "🇬🇩",
    name: "Grenada",
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const authUser = useAppSelector(selectAuthUser);
  const router = useRouter();

  // Compact search bar visibility on scroll (Airbnb-like)
  const [showCompactSearch, setShowCompactSearch] = useState(false);
  const [compactQuery, setCompactQuery] = useState("");

  // Dropdown menu data

  const forPurchasersMenu: DropdownItem[] = [
    {
      title: "Marketplace",
      description: "Browse all suppliers",
      href: "/purchasers/marketplace",
    },
    {
      title: "Request Quotes",
      description: "Get custom pricing",
      href: "/purchasers/quotes",
    },
    {
      title: "Order Management",
      description: "Track your orders",
      href: "/purchasers/orders",
    },
    {
      title: "Quality Assurance",
      description: "Product quality standards",
      href: "/purchasers/quality",
    },
    {
      title: "Logistics Support",
      description: "Shipping and delivery",
      href: "/purchasers/logistics",
    },
    {
      title: "Payment Solutions",
      description: "Secure payment options",
      href: "/purchasers/payments",
    },
    {
      title: "Buyer Portal",
      description: "Your purchasing hub",
      href: "/purchasers/portal",
    },
  ];

  const forSuppliersMenu: DropdownItem[] = [
    {
      title: "Supplier Portal",
      description: "Manage your listings",
      href: "/suppliers/portal",
    },
    {
      title: "Product Catalog",
      description: "List your products",
      href: "/suppliers/catalog",
    },
    {
      title: "Order Fulfillment",
      description: "Process orders",
      href: "/suppliers/orders",
    },
    {
      title: "Analytics Dashboard",
      description: "Track performance",
      href: "/suppliers/analytics",
    },
    {
      title: "Marketing Tools",
      description: "Promote your products",
      href: "/suppliers/marketing",
    },
  ];

  const forGovernmentMenu: DropdownItem[] = [
    {
      title: "Reporting & Analytics",
      description: "Procurement insights",
      href: "/gov/reporting",
    },
    {
      title: "Vendor Management",
      description: "Supplier relationships",
      href: "/gov/vendors",
    },
  ];

  const countries = [
    { code: "GD", flag: "🇬🇩", name: "Grenada" },
    { code: "VC", flag: "🇻🇨", name: "St. Vincent" },
    { code: "TT", flag: "🇹🇹", name: "Trinidad & Tobago" },
    { code: "BB", flag: "🇧🇧", name: "Barbados" },
    { code: "LC", flag: "🇱🇨", name: "St. Lucia" },
    { code: "PA", flag: "🇵🇦", name: "Panama" },
    { code: "CO", flag: "🇨🇴", name: "Colombia" },
  ];

  // Language and currency handling disabled for beta homepage

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Listen to hero search visibility to toggle compact search exactly after passing it
  useEffect(() => {
    const onHeroSearchInView = (e: Event) => {
      const custom = e as CustomEvent<boolean>;
      setShowCompactSearch(!custom.detail);
    };
    window.addEventListener(
      "procur:heroSearchInView",
      onHeroSearchInView as EventListener
    );
    return () =>
      window.removeEventListener(
        "procur:heroSearchInView",
        onHeroSearchInView as EventListener
      );
  }, []);

  const handleDropdownToggle = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const handleMouseEnter = (dropdownName: string) => {
    setActiveDropdown(dropdownName);
  };

  // Removed: Buy Produce mega menu in favor of a single Marketplace link

  const renderMegaMenu = (sections: MegaMenuSection[]) => (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-[1280px] bg-white/95 backdrop-blur-md border border-gray-200/60 rounded-2xl shadow-2xl z-50 mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="px-8 py-8">
        <div className="grid grid-cols-5 gap-4">
          {/* Left: three text columns side-by-side */}
          <div className="col-span-3 grid grid-cols-3 gap-4">
            {sections.map((section, index) => (
              <div key={index}>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 tracking-tight">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link
                        href={item.href}
                        className="block text-[15px] text-gray-800 hover:text-black px-1 py-1 rounded-md hover:bg-gray-50 transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Right: promo panel */}
          <div className="hidden md:block col-span-2">
            <div className="relative h-72 w-full rounded-xl overflow-hidden">
              <Image
                src="/images/backgrounds/markus-spiske-3nX7pythQyM-unsplash.jpg"
                alt="Discover solutions"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-white/10" />
              <div className="absolute inset-0 p-4 flex items-end">
                <Link
                  href="/marketplace"
                  className="bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black"
                  onClick={() => setActiveDropdown(null)}
                >
                  Explore Marketplace
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // simple dropdown renderer removed (unused)

  const navBgClass = "bg-[var(--primary-background)]";

  const solutionsSections: MegaMenuSection[] = [
    { title: "For Purchasers", items: forPurchasersMenu },
    { title: "For Suppliers", items: forSuppliersMenu },
    { title: "For Government", items: forGovernmentMenu },
  ];

  // Resources data
  const resourcesByIndustry: DropdownItem[] = [
    {
      title: "Supermarkets & Buyers",
      href: "/resources/industry/supermarkets-buyers",
    },
    {
      title: "Farmers & Producers",
      href: "/resources/industry/farmers-producers",
    },
    {
      title: "Exporters & Distributors",
      href: "/resources/industry/exporters-distributors",
    },
    {
      title: "Restaurants & Hotels",
      href: "/resources/industry/restaurants-hotels",
    },
    {
      title: "Governments & Agencies",
      href: "/resources/industry/governments-agencies",
    },
  ];

  const resourcesByType: DropdownItem[] = [
    { title: "Step-by-Step Guides", href: "/resources/type/guides" },
    { title: "Expert Talks & Workshops", href: "/resources/type/webinars" },
    { title: "Market Intelligence", href: "/resources/type/market-reports" },
    {
      title: "Regulatory Insights",
      href: "/resources/type/compliance-traceability",
    },
    { title: "Stories from the Field", href: "/resources/type/case-studies" },
  ];

  const featuredResources: DropdownItem[] = [
    {
      title: "Breaking Into U.S. Markets",
      href: "/resources/featured/export-to-us",
    },
    {
      title: "Traceability Made Simple",
      href: "/resources/featured/fda-traceability-toolkit",
    },
    {
      title: "Caribbean Price Index",
      href: "/resources/featured/caribbean-price-index",
    },
    {
      title: "How AI is Rewriting Food Waste",
      href: "/resources/featured/reducing-food-waste-with-ai",
    },
  ];

  const renderResourcesMenu = () => (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-[1280px] bg-white/95 backdrop-blur-md border border-gray-200/60 rounded-2xl shadow-2xl z-50 mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="px-8 py-8">
        {/* Editorial intro */}
        <div className="mb-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Resources
          </div>
          <div className="mt-1 text-[15px] text-gray-800">
            The Procur Journal — insights, data, and stories shaping global food
            security.
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {/* Left: two columns of lists */}
          <div className="col-span-3 grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-tight">
                Explore by Sector
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                From local farms to global agencies — discover insights built
                for your role.
              </p>
              <ul className="space-y-1">
                {resourcesByIndustry.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      className="block text-[15px] text-gray-800 hover:text-black px-1 py-1 rounded-md hover:bg-gray-50 transition-colors"
                      onClick={() => setActiveDropdown(null)}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-tight">
                Learn by Format
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                Practical tools, reports, and stories to help your business
                grow.
              </p>
              <ul className="space-y-1">
                {resourcesByType.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      className="block text-[15px] text-gray-800 hover:text-black px-1 py-1 rounded-md hover:bg-gray-50 transition-colors"
                      onClick={() => setActiveDropdown(null)}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: blog-style feature card */}
          <div className="hidden md:block col-span-2">
            <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white">
              <div className="relative h-40 md:h-48">
                <Image
                  src="/images/backgrounds/nao-takabayashi-TlzyJStoITg-unsplash.jpg"
                  alt="In Focus"
                  fill
                  className="object-cover"
                />
                <div className="absolute left-3 top-3 bg-white/95 text-gray-900 text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ring-black/10">
                  In Focus
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-sm font-semibold text-gray-500">
                  Editor’s pick
                </h4>
                <h3 className="mt-1 text-xl md:text-2xl font-semibold text-gray-900">
                  {featuredResources[0]?.title || "Breaking Into U.S. Markets"}
                </h3>
                <p className="mt-2 text-gray-700 text-sm leading-relaxed">
                  Export strategies that work — a practical guide to entering
                  U.S. markets with confidence.
                </p>
                <div className="mt-4">
                  <Link
                    href={
                      featuredResources[0]?.href ||
                      "/resources/featured/export-to-us"
                    }
                    className="inline-flex items-center text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] font-medium"
                    onClick={() => setActiveDropdown(null)}
                  >
                    Read now
                    <span className="ml-1">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <nav className={`${navBgClass} sticky top-0 z-40`} ref={navRef}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative flex items-center h-16 lg:h-20 justify-between pr-0 lg:pr-56">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/logos/procur-logo.svg"
                  alt="Procur"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            {/* Main Navigation - absolutely centered */}
            <div className="hidden lg:flex items-center space-x-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {!showCompactSearch && (
                <>
                  {/* Primary public navigation */}
                  <Link
                    href="/marketplace"
                    className="text-[15px] font-medium text-gray-800 hover:text-black transition-colors duration-200"
                  >
                    Marketplace
                  </Link>
                </>
              )}

              {showCompactSearch && (
                <form
                  className="group flex items-center bg-white/95 backdrop-blur border border-gray-200 rounded-full h-12 pl-3 pr-1 transition-all duration-200 w-[520px]"
                  role="search"
                  aria-label="Search marketplace compact"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const q = compactQuery.trim();
                    if (q)
                      router.push(
                        `/marketplace?search=${encodeURIComponent(q)}`
                      );
                  }}
                >
                  <input
                    type="text"
                    value={compactQuery}
                    onChange={(e) => setCompactQuery(e.target.value)}
                    placeholder="Search produce, farms, or insights"
                    className="flex-1 bg-transparent outline-none px-4 text-sm text-gray-800 placeholder:text-gray-500"
                    aria-label="Search query"
                  />
                  <button
                    type="submit"
                    className="h-10 w-10 rounded-full bg-[var(--primary-accent2)] text-white flex items-center justify-center hover:bg-[var(--primary-accent3)] transition-colors"
                    aria-label="Submit search"
                  >
                    <MagnifyingGlassIcon className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Mobile menu button (kept in row) */}
            <button
              className="lg:hidden ml-auto text-gray-800 hover:text-black transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Right Side Actions - anchored to nav right, independent of center */}
        <div className="hidden lg:flex items-center space-x-6 absolute right-8 top-1/2 -translate-y-1/2">
          {/* Country Selector (fixed to Grenada, modal disabled) */}
          <span className="flex items-center space-x-1 text-gray-700">
            <span className="text-lg">{selectedCountry.flag}</span>
          </span>

          {/* Login (only when logged out) */}
          {!authUser && (
            <Link
              href="/login"
              className="text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] font-semibold text-[15px] transition-colors duration-200"
            >
              Login
            </Link>
          )}

          {/* Cart hidden */}

          {/* Try Procur Button */}
          <Link
            href="/signup"
            className="bg-black text-white px-8 py-2.5 rounded-full font-medium text-[15px] hover:bg-gray-800 transition-colors duration-200"
          >
            {t("action.tryProcur")}
          </Link>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 max-h-[calc(100vh-64px)] overflow-y-auto">
            <div className="px-6 py-4 space-y-4">
              {/* Primary mobile links */}
              <div className="space-y-1">
                <Link
                  href="/marketplace"
                  className="block text-gray-900 hover:text-black font-medium px-2 py-1 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Marketplace
                </Link>
              </div>

              {/* Quick links for mobile */}
              <div className="pt-1">
                <div className="text-sm font-semibold text-gray-500 px-1 py-1">
                  Quick links
                </div>
                <div className="space-y-1">
                  <Link
                    href="/suppliers/join"
                    className="block text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] font-semibold px-2 py-1 rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Become a supplier
                  </Link>
                </div>
              </div>
              {/* Resources and Solutions temporarily hidden for beta homepage */}
              {/* Blog link removed from mobile header */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <span className="text-lg">{selectedCountry.flag}</span>
                  {/* Cart hidden on mobile */}
                </div>
                <div className="flex items-center gap-2">
                  {!authUser && (
                    <Link
                      href="/login"
                      className="text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] font-semibold text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  )}
                  <Link
                    href="/signup"
                    className="bg-black text-white px-4 py-2 rounded-full font-medium text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("action.tryProcur")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Country Selection Modal disabled for beta homepage */}
    </>
  );
};

export default TopNavigation;
