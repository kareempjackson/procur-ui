"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BellIcon,
  LanguageIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const SellerTopNavigation: React.FC = () => {
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

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: "New order received",
      message: "Order #10235 from GreenLeaf Market",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "Low stock alert",
      message: "Roma Tomatoes running low",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "Payment received",
      message: "$1,240 deposited to your account",
      time: "3 hours ago",
      unread: false,
    },
  ];

  // Mock user data
  const user = {
    name: "John Smith",
    business: "Smith's Farm",
    avatar:
      "https://ui-avatars.com/api/?name=John+Smith&background=407178&color=fff",
  };

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

  const navBgClass = "bg-[var(--primary-background)]";

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <>
      <nav className={`${navBgClass} sticky top-0 z-40`} ref={navRef}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative flex items-center h-20">
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
              {/* Transactions Link */}
              <Link
                href="/seller/transactions"
                className="text-gray-800 hover:text-black font-medium text-[15px] transition-all duration-200 relative group"
              >
                <span className="relative">
                  Transactions
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
                </span>
              </Link>

              {/* Orders Link */}
              <Link
                href="/seller/orders"
                className="text-gray-800 hover:text-black font-medium text-[15px] transition-all duration-200 relative group"
              >
                <span className="relative">
                  Orders
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
                </span>
              </Link>

              {/* Inventory Link */}
              <Link
                href="/seller/products"
                className="text-gray-800 hover:text-black font-medium text-[15px] transition-all duration-200 relative group"
              >
                <span className="relative">
                  Inventory
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
                </span>
              </Link>

              {/* Messages Link */}
              <Link
                href="/seller/messages"
                className="text-gray-800 hover:text-black font-medium text-[15px] transition-all duration-200 relative group"
              >
                <span className="relative">
                  Messages
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
                </span>
              </Link>
            </div>

            {/* Mobile menu button */}
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

            {/* Right Side Actions - anchored to nav right */}
            <div className="hidden lg:flex items-center space-x-6 ml-auto">
              {/* Notifications */}
              <div className="relative">
                <button
                  className="relative text-gray-700 hover:text-gray-900 transition-colors duration-200"
                  onClick={() => handleDropdownToggle("notifications")}
                >
                  <BellIcon className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {activeDropdown === "notifications" && (
                  <div className="absolute top-full right-0 w-80 bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl shadow-2xl z-50 mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-3">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">
                            Notifications
                          </h3>
                          <button
                            className="text-xs text-blue-600 hover:text-blue-700"
                            onClick={() => {
                              // Mark all as read logic here
                              setActiveDropdown(null);
                            }}
                          >
                            Mark all read
                          </button>
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <Link
                            key={notification.id}
                            href="/seller/notifications"
                            className={`block px-4 py-3 hover:bg-gray-50/80 transition-all duration-200 border-b border-gray-100 last:border-0 ${
                              notification.unread ? "bg-blue-50/30" : ""
                            }`}
                            onClick={() => setActiveDropdown(null)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <div className="font-medium text-gray-900 text-sm">
                                    {notification.title}
                                  </div>
                                  {notification.unread && (
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                  )}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                  {notification.message}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  {notification.time}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="px-4 py-2 border-t border-gray-200">
                        <Link
                          href="/seller/notifications"
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          onClick={() => setActiveDropdown(null)}
                        >
                          View all notifications →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Add Product Button */}
              <Link
                href="/seller/add/product"
                className="bg-black text-white px-6 py-2.5 rounded-full font-medium text-[15px] hover:bg-gray-800 transition-colors duration-200"
              >
                Add Product
              </Link>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
                  onClick={() => handleDropdownToggle("user")}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-11 w-11 rounded-full border-2 border-gray-200"
                  />
                </button>
                {activeDropdown === "user" && (
                  <div className="absolute top-full right-0 w-64 bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl shadow-2xl z-50 mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-3">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {user.business}
                        </div>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/seller/profile"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 transition-all duration-200"
                          onClick={() => setActiveDropdown(null)}
                        >
                          Profile Settings
                        </Link>
                        <Link
                          href="/seller/business"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 transition-all duration-200"
                          onClick={() => setActiveDropdown(null)}
                        >
                          Business Settings
                        </Link>
                        <Link
                          href="/seller/billing"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 transition-all duration-200"
                          onClick={() => setActiveDropdown(null)}
                        >
                          Billing & Payments
                        </Link>
                        <Link
                          href="/help"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 transition-all duration-200"
                          onClick={() => setActiveDropdown(null)}
                        >
                          Help & Support
                        </Link>
                      </div>
                      <div className="border-t border-gray-200 py-2">
                        {/* Language Selector */}
                        <div className="px-4 py-2">
                          <label className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">
                            Language
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {languages.map((lang) => (
                              <button
                                key={lang}
                                onClick={() => {
                                  setSelectedLanguage(lang);
                                }}
                                className={`px-3 py-1.5 text-sm rounded-md transition-all duration-200 ${
                                  selectedLanguage === lang
                                    ? "bg-[var(--primary-accent2)] text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                {lang}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Country Selector */}
                        <div className="px-4 py-2">
                          <label className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">
                            Country
                          </label>
                          <button
                            onClick={() => {
                              setShowCountryModal(true);
                              setActiveDropdown(null);
                            }}
                            className="flex items-center space-x-2 w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-all duration-200"
                          >
                            <span className="text-lg">
                              {selectedCountry.flag}
                            </span>
                            <span className="text-sm text-gray-700 font-medium">
                              {selectedCountry.name}
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 py-2">
                        <button
                          className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/80 hover:text-red-700 transition-all duration-200"
                          onClick={() => {
                            // Logout logic here
                            setActiveDropdown(null);
                          }}
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100">
            <div className="px-6 py-4 space-y-4">
              <Link
                href="/seller/add/product"
                className="block w-full bg-black text-white px-6 py-2.5 rounded-full font-medium text-center hover:bg-gray-800 transition-colors duration-200"
              >
                Add Product
              </Link>
              <Link
                href="/seller/transactions"
                className="block text-gray-800 font-medium py-2"
              >
                Transactions
              </Link>
              <Link
                href="/seller/orders"
                className="block text-gray-800 font-medium py-2"
              >
                Orders
              </Link>
              <Link
                href="/seller/products"
                className="block text-gray-800 font-medium py-2"
              >
                Inventory
              </Link>
              <Link
                href="/seller/messages"
                className="block text-gray-800 font-medium py-2"
              >
                Messages
              </Link>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <Link
                    href="/seller/notifications"
                    className="relative text-gray-700"
                  >
                    <BellIcon className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                </div>
                <Link href="/seller/profile">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-10 w-10 rounded-full border-2 border-gray-200"
                  />
                </Link>
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

export default SellerTopNavigation;
