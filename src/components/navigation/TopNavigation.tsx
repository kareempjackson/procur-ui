"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDownIcon,
  ShoppingCartIcon,
  LanguageIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

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
  const [selectedLanguage, setSelectedLanguage] = useState("EN");
  const [selectedCountry, setSelectedCountry] = useState({
    code: "GD",
    flag: "🇬🇩",
    name: "Grenada",
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Dropdown menu data
  const buyProduceMenu = {
    mostPopular: [
      {
        title: "Fruits and berries",
        href: "/produce/fruits",
      },
      {
        title: "Fresh vegetables",
        href: "/produce/vegetables",
      },
      {
        title: "Organic produce",
        href: "/produce/organic",
      },
      {
        title: "Herbs and spices",
        href: "/produce/herbs",
      },
      {
        title: "Seasonal produce",
        href: "/produce/seasonal",
      },
      {
        title: "Bulk orders",
        href: "/produce/bulk",
      },
      {
        title: "Local sourcing",
        href: "/produce/local",
      },
    ],
    moreCategories: [
      {
        title: "Premium suppliers",
        href: "/suppliers/premium",
      },
      {
        title: "Certified organic",
        href: "/suppliers/organic-certified",
      },
      {
        title: "Farm direct",
        href: "/suppliers/farm-direct",
      },
      {
        title: "Wholesale distributors",
        href: "/suppliers/wholesale",
      },
      {
        title: "International imports",
        href: "/suppliers/international",
      },
      {
        title: "Specialty producers",
        href: "/suppliers/specialty",
      },
      {
        title: "Browse all suppliers",
        href: "/suppliers/all",
      },
    ],
  };

  const forBuyersMenu: DropdownItem[] = [
    {
      title: "Marketplace",
      description: "Browse all suppliers",
      href: "/buyers/marketplace",
    },
    {
      title: "Request Quotes",
      description: "Get custom pricing",
      href: "/buyers/quotes",
    },
    {
      title: "Order Management",
      description: "Track your orders",
      href: "/buyers/orders",
    },
    {
      title: "Quality Assurance",
      description: "Product quality standards",
      href: "/buyers/quality",
    },
    {
      title: "Logistics Support",
      description: "Shipping and delivery",
      href: "/buyers/logistics",
    },
    {
      title: "Payment Solutions",
      description: "Secure payment options",
      href: "/buyers/payments",
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
      title: "Certification",
      description: "Quality certifications",
      href: "/suppliers/certification",
    },
    {
      title: "Marketing Tools",
      description: "Promote your products",
      href: "/suppliers/marketing",
    },
  ];

  const forGovernmentMenu: DropdownItem[] = [
    {
      title: "Procurement Platform",
      description: "Government purchasing",
      href: "/government/procurement",
    },
    {
      title: "Compliance Tools",
      description: "Regulatory compliance",
      href: "/government/compliance",
    },
    {
      title: "Reporting & Analytics",
      description: "Procurement insights",
      href: "/government/reporting",
    },
    {
      title: "Vendor Management",
      description: "Supplier relationships",
      href: "/government/vendors",
    },
    {
      title: "Budget Planning",
      description: "Cost optimization",
      href: "/government/budget",
    },
    {
      title: "Transparency Portal",
      description: "Public procurement data",
      href: "/government/transparency",
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

  const languages = ["EN", "ES", "FR", "DE", "PT", "ZH"];

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

  const handleDropdownToggle = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const handleMouseEnter = (dropdownName: string) => {
    setActiveDropdown(dropdownName);
  };

  const renderBuyProduceMegaMenu = () => (
    <div className="absolute top-full left-0 w-[1000px] bg-white border border-gray-200 rounded-lg shadow-xl z-50 mt-2 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
      <div className="flex">
        {/* Most Popular Categories - Left Column */}
        <div className="flex-1 px-8 py-6">
          <h3 className="font-bold text-gray-900 mb-4 text-sm tracking-wide">
            Most popular categories
          </h3>
          <div className="space-y-2">
            {buyProduceMenu.mostPopular.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="block px-0 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50/80 rounded-md transition-all duration-200"
                onClick={() => setActiveDropdown(null)}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>

        {/* More Categories - Middle Column */}
        <div className="flex-1 px-8 py-6 border-l border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4 text-sm tracking-wide">
            More categories
          </h3>
          <div className="space-y-2">
            {buyProduceMenu.moreCategories.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="block px-0 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50/80 rounded-md transition-all duration-200"
                onClick={() => setActiveDropdown(null)}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Promotional Banner - Right Column */}
        <div className="w-96 p-8 bg-gradient-to-br from-green-50 to-blue-50 border-l border-gray-200">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Fresh Produce
            </h3>
            <h4 className="text-base font-semibold text-gray-700 mb-3">
              & farm-to-table
            </h4>
            <p className="text-sm text-gray-600 mb-4">Check the offers</p>
            <Link
              href="/produce/browse"
              className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-blue-700 transition-colors duration-200"
              onClick={() => setActiveDropdown(null)}
            >
              Shop now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderMegaMenu = (sections: MegaMenuSection[]) => (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-[800px] bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl shadow-2xl z-50 mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="px-8 py-8">
        <div className="grid grid-cols-2 gap-10">
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-gray-900 mb-5 text-base tracking-tight">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <Link
                    key={itemIndex}
                    href={item.href}
                    className="flex items-center space-x-4 px-3 py-3 rounded-lg hover:bg-gray-50/80 transition-all duration-200 group"
                    onClick={() => setActiveDropdown(null)}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center group-hover:from-blue-50 group-hover:to-blue-100 transition-all duration-200">
                      <div className="w-5 h-5 bg-gradient-to-br from-gray-400 to-gray-500 rounded-sm group-hover:from-blue-400 group-hover:to-blue-500 transition-all duration-200"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm mb-1 group-hover:text-gray-800">
                        {item.title}
                      </div>
                      {item.description && (
                        <div className="text-xs text-gray-500 group-hover:text-gray-600">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDropdownMenu = (items: DropdownItem[]) => (
    <div className="absolute top-full left-0 w-80 bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl shadow-2xl z-50 mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="py-6 px-6">
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="flex items-center space-x-4 px-3 py-3 rounded-lg hover:bg-gray-50/80 transition-all duration-200 group"
            onClick={() => setActiveDropdown(null)}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center group-hover:from-blue-50 group-hover:to-blue-100 transition-all duration-200">
              <div className="w-5 h-5 bg-gradient-to-br from-gray-400 to-gray-500 rounded-sm group-hover:from-blue-400 group-hover:to-blue-500 transition-all duration-200"></div>
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900 text-sm mb-1 group-hover:text-gray-800">
                {item.title}
              </div>
              {item.description && (
                <div className="text-xs text-gray-500 group-hover:text-gray-600">
                  {item.description}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  const navBgClass = "bg-[var(--primary-background)]";

  return (
    <>
      <nav className={`${navBgClass} sticky top-0 z-40`} ref={navRef}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative flex items-center h-20 pr-56">
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
            <div className="hidden lg:flex items-center space-x-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {/* Buy Produce Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("buy-produce")}
              >
                <button
                  className="flex items-center space-x-1 text-gray-800 hover:text-black font-medium text-[15px] transition-all duration-200 relative group"
                  onClick={() => handleDropdownToggle("buy-produce")}
                >
                  <span className="relative">
                    Buy Produce
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
                  </span>
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform duration-200 ${
                      activeDropdown === "buy-produce" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeDropdown === "buy-produce" && renderBuyProduceMegaMenu()}
              </div>

              {/* For Buyers Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("for-buyers")}
              >
                <button
                  className="flex items-center space-x-1 text-gray-800 hover:text-black font-medium text-[15px] transition-all duration-200 relative group"
                  onClick={() => handleDropdownToggle("for-buyers")}
                >
                  <span className="relative">
                    For Buyers
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
                  </span>
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform duration-200 ${
                      activeDropdown === "for-buyers" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeDropdown === "for-buyers" &&
                  renderDropdownMenu(forBuyersMenu)}
              </div>

              {/* For Suppliers Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("for-suppliers")}
              >
                <button
                  className="flex items-center space-x-1 text-gray-800 hover:text-black font-medium text-[15px] transition-all duration-200 relative group"
                  onClick={() => handleDropdownToggle("for-suppliers")}
                >
                  <span className="relative">
                    For Suppliers
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
                  </span>
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform duration-200 ${
                      activeDropdown === "for-suppliers" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeDropdown === "for-suppliers" &&
                  renderDropdownMenu(forSuppliersMenu)}
              </div>

              {/* For Government Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("for-government")}
              >
                <button
                  className="flex items-center space-x-1 text-gray-800 hover:text-black font-medium text-[15px] transition-all duration-200 relative group"
                  onClick={() => handleDropdownToggle("for-government")}
                >
                  <span className="relative">
                    For Government
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
                  </span>
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform duration-200 ${
                      activeDropdown === "for-government" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeDropdown === "for-government" &&
                  renderDropdownMenu(forGovernmentMenu)}
              </div>

              {/* Blog Link */}
              <a
                href="/blog"
                className="text-gray-800 hover:text-black font-medium text-[15px] transition-all duration-200 relative group"
              >
                <span className="relative">
                  Blog
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
                </span>
              </a>
            </div>

            {/* Mobile menu button (kept in row) */}
            <button
              className="lg:hidden text-gray-800 hover:text-black transition-colors duration-200"
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
          {/* Language Toggle */}
          <div className="relative">
            <button
              className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors duration-200"
              onClick={() => handleDropdownToggle("language")}
            >
              <LanguageIcon className="h-5 w-5" />
              <span className="text-sm font-medium">{selectedLanguage}</span>
            </button>
            {activeDropdown === "language" && (
              <div className="absolute top-full right-0 w-24 bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl shadow-2xl z-50 mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="py-2">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 transition-all duration-200 font-medium"
                      onClick={() => {
                        setSelectedLanguage(lang);
                        setActiveDropdown(null);
                      }}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Country Selector */}
          <button
            className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors duration-200"
            onClick={() => setShowCountryModal(true)}
          >
            <span className="text-lg">{selectedCountry.flag}</span>
          </button>

          {/* Cart */}
          <Link
            href="/checkout"
            className="relative text-gray-700 hover:text-gray-900 transition-colors duration-200"
          >
            <ShoppingCartIcon className="h-6 w-6" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </Link>

          {/* Try Procur Button */}
          <Link
            href="/signup"
            className="bg-black text-white px-8 py-2.5 rounded-full font-medium text-[15px] hover:bg-gray-800 transition-colors duration-200"
          >
            Try Procur
          </Link>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100">
            <div className="px-6 py-4 space-y-4">
              <a
                href="/produce"
                className="block text-gray-800 font-medium py-2"
              >
                Buy Produce
              </a>
              <a
                href="/buyers"
                className="block text-gray-800 font-medium py-2"
              >
                For Buyers
              </a>
              <a
                href="/suppliers"
                className="block text-gray-800 font-medium py-2"
              >
                For Suppliers
              </a>
              <a
                href="/government"
                className="block text-gray-800 font-medium py-2"
              >
                For Government
              </a>
              <a href="/blog" className="block text-gray-800 font-medium py-2">
                Blog
              </a>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-gray-700">
                    <LanguageIcon className="h-5 w-5" />
                    <span className="text-sm">{selectedLanguage}</span>
                  </button>
                  <button className="text-lg">{selectedCountry.flag}</button>
                  <Link href="/checkout" className="relative text-gray-700">
                    <ShoppingCartIcon className="h-6 w-6" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      3
                    </span>
                  </Link>
                </div>
                <button className="bg-black text-white px-4 py-2 rounded-full font-medium text-sm">
                  Try Procur
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Country Selection Modal */}
      {showCountryModal && (
        <div className="fixed inset-0 backdrop-blur-xs bg-white/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Select Country</h3>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowCountryModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              {countries.map((country) => (
                <button
                  key={country.code}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => {
                    setSelectedCountry(country);
                    setShowCountryModal(false);
                  }}
                >
                  <span className="text-xl">{country.flag}</span>
                  <span className="font-medium">{country.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopNavigation;
