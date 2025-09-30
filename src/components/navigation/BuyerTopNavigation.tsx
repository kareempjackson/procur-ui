"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BellIcon,
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectAuthUser, signout } from "@/store/slices/authSlice";
import {
  fetchNotifications,
  markNotificationRead,
  selectNotifications,
} from "@/store/slices/notificationsSlice";
import { useNotificationsSocket } from "@/hooks/useNotificationsSocket";

const BuyerTopNavigation: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Notifications state
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector(selectNotifications);
  useNotificationsSocket();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchNotifications(undefined));
    }
  }, [status, dispatch]);

  // Authenticated user data
  const authUser = useAppSelector(selectAuthUser);
  const displayName =
    (authUser?.fullname && authUser.fullname.trim()) ||
    (authUser?.email ? authUser.email.split("@")[0] : "User");
  const organizationName = authUser?.organizationName || "Buyer";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    displayName
  )}&background=407178&color=fff`;

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

  const safeItems = Array.isArray(items)
    ? items
    : Array.isArray((items as unknown as { data?: unknown })?.data)
    ? ((items as unknown as { data: unknown[] }).data as any[])
    : [];
  const unreadCount = safeItems.filter((n: any) => !n.read_at).length;

  return (
    <>
      <nav className={`${navBgClass} sticky top-0 z-40`} ref={navRef}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative flex items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 relative">
              <Link href="/buyer" className="flex items-center relative">
                <Image
                  src="/images/logos/procur-logo.svg"
                  alt="Procur"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
                <span className="absolute -bottom-2 right-0 text-[10px] leading-none text-[color:var(--secondary-muted-edge)]">
                  buyer
                </span>
              </Link>
            </div>

            {/* Main Navigation - absolutely centered */}
            <div className="hidden lg:flex items-center space-x-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {/* Transactions Link */}
              <Link
                href="/buyer/transactions"
                className={`pb-3 font-medium text-[15px] transition-all duration-200 border-b-2 ${
                  pathname?.startsWith("/buyer/transactions")
                    ? "text-black border-[color:var(--primary-base)]"
                    : "text-gray-800 hover:text-black border-transparent"
                }`}
              >
                <span className="relative">Transactions</span>
              </Link>

              {/* Orders Link */}
              <Link
                href="/buyer/orders"
                className={`pb-3 font-medium text-[15px] transition-all duration-200 border-b-2 ${
                  pathname?.startsWith("/buyer/orders")
                    ? "text-black border-[color:var(--primary-base)]"
                    : "text-gray-800 hover:text-black border-transparent"
                }`}
              >
                <span className="relative">Orders</span>
              </Link>

              {/* Saved Suppliers Link */}
              <Link
                href="/buyer/saved-suppliers"
                className={`pb-3 font-medium text-[15px] transition-all duration-200 border-b-2 ${
                  pathname?.startsWith("/buyer/saved-suppliers")
                    ? "text-black border-[color:var(--primary-base)]"
                    : "text-gray-800 hover:text-black border-transparent"
                }`}
              >
                <span className="relative">Saved Suppliers</span>
              </Link>

              {/* Messages Link */}
              <Link
                href="/buyer/messages"
                className={`pb-3 font-medium text-[15px] transition-all duration-200 border-b-2 ${
                  pathname?.startsWith("/buyer/messages")
                    ? "text-black border-[color:var(--primary-base)]"
                    : "text-gray-800 hover:text-black border-transparent"
                }`}
              >
                <span className="relative">Messages</span>
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
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {safeItems.length === 0 && (
                          <div className="px-4 py-3 text-sm text-gray-500">
                            You have no notifications yet.
                          </div>
                        )}
                        {safeItems.slice(0, 10).map((n: any) => (
                          <Link
                            key={n.id}
                            href="/buyer/notifications"
                            className={`block px-4 py-3 hover:bg-gray-50/80 transition-all duration-200 border-b border-gray-100 last:border-0 ${
                              !n.read_at ? "bg-blue-50/30" : ""
                            }`}
                            onClick={() => {
                              if (!n.read_at)
                                dispatch(markNotificationRead({ id: n.id }));
                              setActiveDropdown(null);
                            }}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <div className="font-medium text-gray-900 text-sm">
                                    {n.title}
                                  </div>
                                  {!n.read_at && (
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                  )}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                  {n.body}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  {new Date(n.created_at).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="px-4 py-2 border-t border-gray-200">
                        <Link
                          href="/buyer/notifications"
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

              {/* Checkout Icon */}
              <Link
                href="/checkout"
                className="relative text-gray-700 hover:text-gray-900 transition-colors duration-200"
                title="Checkout"
              >
                <ShoppingCartIcon className="h-6 w-6" />
              </Link>

              {/* Make Request Button */}
              <Link
                href="/buyer/request"
                className="bg-black text-white px-6 py-2.5 rounded-full font-medium text-[15px] hover:bg-gray-800 transition-colors duration-200"
              >
                Make Request
              </Link>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
                  onClick={() => handleDropdownToggle("user")}
                >
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="h-11 w-11 rounded-full border-2 border-gray-200"
                  />
                </button>
                {activeDropdown === "user" && (
                  <div className="absolute top-full right-0 w-64 bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl shadow-2xl z-50 mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-3">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <div className="font-medium text-gray-900">
                          {displayName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {organizationName}
                        </div>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/buyer/profile"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 transition-all duration-200"
                          onClick={() => setActiveDropdown(null)}
                        >
                          Profile Settings
                        </Link>
                        <Link
                          href="/buyer/orders"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 transition-all duration-200"
                          onClick={() => setActiveDropdown(null)}
                        >
                          Orders
                        </Link>
                        <Link
                          href="/buyer/payment-methods"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 transition-all duration-200"
                          onClick={() => setActiveDropdown(null)}
                        >
                          Payment Methods
                        </Link>
                        <Link
                          href="/buyer/help"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 transition-all duration-200"
                          onClick={() => setActiveDropdown(null)}
                        >
                          Help & Support
                        </Link>
                      </div>
                      <div className="border-t border-gray-200 py-2">
                        <button
                          className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/80 hover:text-red-700 transition-all duration-200"
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
                href="/buyer/request"
                className="block w-full bg-black text-white px-6 py-2.5 rounded-full font-medium text-center hover:bg-gray-800 transition-colors duration-200"
              >
                Make Request
              </Link>
              <Link
                href="/buyer/transactions"
                className="block text-gray-800 font-medium py-2"
              >
                Transactions
              </Link>
              <Link
                href="/buyer/orders"
                className="block text-gray-800 font-medium py-2"
              >
                Orders
              </Link>
              <Link
                href="/buyer/saved-suppliers"
                className="block text-gray-800 font-medium py-2"
              >
                Saved Suppliers
              </Link>
              <Link
                href="/buyer/messages"
                className="block text-gray-800 font-medium py-2"
              >
                Messages
              </Link>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <Link
                    href="/buyer/notifications"
                    className="relative text-gray-700"
                  >
                    <BellIcon className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/checkout"
                    className="relative text-gray-700"
                    title="Checkout"
                  >
                    <ShoppingCartIcon className="h-6 w-6" />
                  </Link>
                </div>
                <Link href="/buyer/profile">
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="h-10 w-10 rounded-full border-2 border-gray-200"
                  />
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default BuyerTopNavigation;
