"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BellIcon,
  HeartIcon,
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import {
  BellIcon as BellSolidIcon,
  ShoppingCartIcon as ShoppingCartSolidIcon,
} from "@heroicons/react/24/solid";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectAuthUser, signout } from "@/store/slices/authSlice";
import {
  fetchNotifications,
  markNotificationRead,
  selectNotifications,
} from "@/store/slices/notificationsSlice";
import { fetchCart } from "@/store/slices/buyerCartSlice";
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
  const { cart } = useAppSelector((state) => state.buyerCart);
  useNotificationsSocket();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchNotifications(undefined));
    }
  }, [status, dispatch]);

  // Fetch cart on mount to get item count
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Authenticated user data
  const authUser = useAppSelector(selectAuthUser);
  const profile = useAppSelector((state) => state.profile.profile);
  const displayName =
    (authUser?.fullname && authUser.fullname.trim()) ||
    (authUser?.email ? authUser.email.split("@")[0] : "User");
  const organizationName = authUser?.organizationName || "Buyer";
  const avatarUrl =
    profile?.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
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

  const navBgClass = "bg-white";

  const safeItems = Array.isArray(items)
    ? items
    : Array.isArray((items as unknown as { data?: unknown })?.data)
      ? ((items as unknown as { data: unknown[] }).data as any[])
      : [];
  const unreadCount = safeItems.filter((n: any) => !n.read_at).length;

  // Cart item count
  const cartItemCount = cart?.total_items || 0;

  return (
    <>
      <nav className={`${navBgClass} sticky top-0 z-40`} ref={navRef}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center h-20">
            {/* Logo - Left Section */}
            <div className="flex-[0.8] flex items-center">
              <Link href="/buyer" className="flex items-center relative group">
                <Image
                  src="/images/logos/procur-logo.svg"
                  alt="Procur"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
                <span
                  className={`absolute -bottom-2 right-0 text-[10px] leading-none transition-colors duration-200 ${
                    pathname === "/buyer"
                      ? "text-[var(--primary-accent2)] font-semibold"
                      : "text-[color:var(--secondary-muted-edge)]"
                  }`}
                >
                  buyer
                </span>
              </Link>
            </div>

            {/* Main Navigation - Center Section */}
            <div className="hidden lg:flex items-center justify-center space-x-8 flex-1">
              {/* Suppliers Link */}
              <Link
                href="/buyer/suppliers"
                className={`font-medium text-[15px] transition-all duration-200 pb-1 border-b-2 ${
                  pathname?.startsWith("/buyer/suppliers")
                    ? "text-[var(--primary-accent2)] border-[var(--primary-accent2)]"
                    : "text-gray-800 hover:text-black border-transparent"
                }`}
              >
                <span className="relative">Suppliers</span>
              </Link>

              {/* Requests Link */}
              {/* <Link
                href="/buyer/requests"
                className={`font-medium text-[15px] transition-all duration-200 pb-1 border-b-2 ${
                  pathname?.startsWith("/buyer/requests")
                    ? "text-[var(--primary-accent2)] border-[var(--primary-accent2)]"
                    : "text-gray-800 hover:text-black border-transparent"
                }`}
              >
                <span className="relative">Requests</span>
              </Link> */}

              {/* Orders Link */}
              <Link
                href="/buyer/orders"
                className={`font-medium text-[15px] transition-all duration-200 pb-1 border-b-2 ${
                  pathname?.startsWith("/buyer/orders")
                    ? "text-[var(--primary-accent2)] border-[var(--primary-accent2)]"
                    : "text-gray-800 hover:text-black border-transparent"
                }`}
              >
                <span className="relative">Orders</span>
              </Link>

              {/* Messages Link */}
              <Link
                href="/buyer/messages"
                className={`font-medium text-[15px] transition-all duration-200 pb-1 border-b-2 ${
                  pathname?.startsWith("/buyer/messages")
                    ? "text-[var(--primary-accent2)] border-[var(--primary-accent2)]"
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

            {/* Right Side Actions - Right Section */}
            <div className="hidden lg:flex items-center justify-end space-x-5 flex-[1.4]">
              {/* Analytics */}
              {/* <Link
                href="/buyer/analytics"
                className={`relative transition-colors duration-200 flex items-center ${
                  pathname?.startsWith("/buyer/analytics")
                    ? "text-[var(--primary-accent2)]"
                    : "text-gray-700 hover:text-gray-900"
                }`}
                title="Analytics"
              >
                {pathname?.startsWith("/buyer/analytics") ? (
                  <ChartBarSolidIcon className="h-6 w-6" />
                ) : (
                  <ChartBarIcon className="h-6 w-6 stroke-2" />
                )}
              </Link> */}

              {/* Saved Suppliers */}
              {/* <Link
                href="/buyer/saved-suppliers"
                className={`relative transition-colors duration-200 flex items-center ${
                  pathname?.startsWith("/buyer/saved-suppliers")
                    ? "text-[var(--primary-accent2)]"
                    : "text-gray-700 hover:text-gray-900"
                }`}
                title="Saved Suppliers"
              >
                {pathname?.startsWith("/buyer/saved-suppliers") ? (
                  <HeartSolidIcon className="h-6 w-6" />
                ) : (
                  <HeartIcon className="h-6 w-6 stroke-2" />
                )}
              </Link> */}

              {/* Notifications */}
              <div className="relative flex items-center">
                <button
                  className={`relative transition-colors duration-200 flex items-center ${
                    pathname?.startsWith("/buyer/notifications")
                      ? "text-[var(--primary-accent2)]"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                  onClick={() => handleDropdownToggle("notifications")}
                >
                  {pathname?.startsWith("/buyer/notifications") ? (
                    <BellSolidIcon className="h-6 w-6" />
                  ) : (
                    <BellIcon className="h-6 w-6 stroke-2" />
                  )}
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {activeDropdown === "notifications" && (
                  <div className="absolute top-full right-0 w-80 bg-white border border-gray-200 rounded-xl z-50 mt-3">
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

              {/* Cart Icon */}
              <Link
                href="/buyer/cart"
                className={`relative transition-colors duration-200 flex items-center ${
                  pathname?.startsWith("/buyer/cart") ||
                  pathname?.startsWith("/buyer/checkout")
                    ? "text-[var(--primary-accent2)]"
                    : "text-gray-700 hover:text-gray-900"
                }`}
                title="Shopping Cart"
              >
                {pathname?.startsWith("/buyer/cart") ||
                pathname?.startsWith("/buyer/checkout") ? (
                  <ShoppingCartSolidIcon className="h-6 w-6" />
                ) : (
                  <ShoppingCartIcon className="h-6 w-6 stroke-2" />
                )}
                {/* Cart item count badge */}
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[var(--primary-accent2)] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Make Request Button (temporarily disabled) */}
              {/* <Link
                href="/buyer/request"
                className={`px-6 py-2.5 rounded-full font-medium text-[15px] transition-all duration-200 flex items-center ${
                  pathname?.startsWith("/buyer/request")
                    ? "bg-[var(--primary-accent2)] text-white shadow-md"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                Make Request
              </Link> */}

              {/* User Profile Dropdown */}
              <div className="relative flex items-center">
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
                  <div className="absolute top-full right-0 w-64 bg-white border border-gray-200 rounded-xl z-50 mt-3">
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
              {/* Make Request Button (temporarily disabled - mobile) */}
              {/* <Link
                href="/buyer/request"
                className="block w-full bg-black text-white px-6 py-2.5 rounded-full font-medium text-center hover:bg-gray-800 transition-colors duration-200"
              >
                Make Request
              </Link> */}
              <Link
                href="/buyer/suppliers"
                className="block text-gray-800 font-medium py-2"
              >
                Suppliers
              </Link>
              <Link
                href="/buyer/requests"
                className="block text-gray-800 font-medium py-2"
              >
                Requests
              </Link>
              <Link
                href="/buyer/orders"
                className="block text-gray-800 font-medium py-2"
              >
                Orders
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
                    href="/buyer/analytics"
                    className="relative text-gray-700"
                    title="Analytics"
                  >
                    <ChartBarIcon className="h-6 w-6" />
                  </Link>
                  <Link
                    href="/buyer/saved-suppliers"
                    className="relative text-gray-700"
                    title="Saved Suppliers"
                  >
                    <HeartIcon className="h-6 w-6" />
                  </Link>
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
                    href="/buyer/cart"
                    className="relative text-gray-700"
                    title="Shopping Cart"
                  >
                    <ShoppingCartIcon className="h-6 w-6" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[var(--primary-accent2)] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold text-[10px]">
                        {cartItemCount}
                      </span>
                    )}
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
