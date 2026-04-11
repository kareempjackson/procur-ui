"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchActiveCountries, selectCountry, selectCountries } from "@/store/slices/countrySlice";

const NAV_LINKS = [
  { label: "Browse", href: "/browse" },
  { label: "About", href: "/company/about" },
  { label: "Help", href: "/help" },
];

const FOOTER_COLS = [
  {
    title: "Platform",
    links: [
      { label: "Browse Produce", href: "/browse" },
      { label: "For Suppliers", href: "/signup?accountType=seller" },
      { label: "For Buyers", href: "/signup?accountType=buyer" },
      { label: "Log in", href: "/login" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Restaurants", href: "/solutions/restaurants" },
      { label: "Hotels", href: "/solutions/hotels" },
      { label: "Grocery", href: "/solutions/grocery" },
      { label: "Government", href: "/solutions/government" },
      { label: "Agriculture", href: "/solutions/agriculture" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Procur", href: "/company/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/company/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "FAQ", href: "/help/faq" },
      { label: "Blog", href: "/blog" },
      { label: "Supplier Guide", href: "/supplier-guide" },
      { label: "Buyer Guide", href: "/buyer-guide" },
    ],
  },
];

const SOCIAL_ICONS = [
  <svg key="x" viewBox="0 0 24 24" fill="currentColor" width={14} height={14}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.65l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
  <svg key="ig" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={14} height={14}><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4.5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>,
  <svg key="li" viewBox="0 0 24 24" fill="currentColor" width={14} height={14}><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>,
  <svg key="fb" viewBox="0 0 24 24" fill="currentColor" width={14} height={14}><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>,
];

const LEGAL_LINKS = [
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Terms", href: "/legal/terms" },
  { label: "Cookies", href: "/legal/cookies" },
  { label: "Accessibility", href: "/accessibility" },
];

export default function PublicPageShell({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { code: countryCode, name: countryName } = useAppSelector(selectCountry);
  const countries = useAppSelector(selectCountries);

  useEffect(() => { dispatch(fetchActiveCountries()); }, [dispatch]);

  // Resolve country from cookie if Redux doesn't have one yet
  const [cookieCode, setCookieCode] = useState<string | null>(null);
  useEffect(() => {
    if (!countryCode && typeof document !== "undefined") {
      const match = document.cookie.match(/(?:^|;\s*)country_code=([^;]*)/);
      if (match?.[1]) setCookieCode(match[1]);
    }
  }, [countryCode]);

  const activeCode = countryCode || cookieCode;
  const activeCountry = countries.find((c) => c.code === activeCode);
  const displayName = countryName || activeCountry?.name || "";
  const flagIso = activeCountry?.country_code?.toLowerCase() || "";
  const flagEmoji = flagIso ? String.fromCodePoint(...[...flagIso.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65)) : "";

  return (
    <div style={{ fontFamily: "'Urbanist', system-ui, sans-serif", background: "#faf8f4", color: "#1c2b23", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "#2d4a3e" }}>
        <div style={{ height: 58, display: "flex", alignItems: "center", padding: "0 24px", maxWidth: 1300, margin: "0 auto", width: "100%" }}>
          <Link href={activeCode ? `/${activeCode}` : "/"} style={{ flexShrink: 0, marginRight: 28, textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 3 }}>
            <Image src="/images/logos/procur-logo.svg" alt="Procur" width={88} height={23} style={{ filter: "brightness(0) invert(1)" }} priority />
            {displayName && (
              <span style={{ fontSize: 9.5, fontWeight: 600, color: "rgba(245,241,234,.72)", lineHeight: 1, letterSpacing: ".03em" }}>{flagEmoji} {displayName}</span>
            )}
          </Link>
          <nav style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}>
            {NAV_LINKS.map(l => (
              <Link key={l.label} href={l.href} style={{ padding: "6px 12px", fontSize: 13, fontWeight: 500, color: "rgba(245,241,234,.8)", textDecoration: "none", borderRadius: 6 }}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <Link href="/login" style={{ padding: "6px 14px", fontSize: 13, fontWeight: 600, color: "rgba(245,241,234,.8)", textDecoration: "none" }}>
              Sign in
            </Link>
            <Link href="/signup" style={{ padding: "8px 18px", fontSize: 13, fontWeight: 700, background: "#d4783c", color: "#fff", borderRadius: 999, textDecoration: "none" }}>
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main style={{ flex: 1 }}>
        {children}
      </main>

      {/* Footer — matches home page footer */}
      <footer style={{ background: "#0a0a0a", color: "#f5f1ea" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 20px" }}>

          {/* Top CTA block */}
          <div style={{ padding: "80px 0 64px" }}>
            <h2 style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.15, maxWidth: 520, marginBottom: 16, letterSpacing: "-.5px", color: "#f5f1ea" }}>
              Building stronger food systems across the Caribbean and beyond.
            </h2>
            <p style={{ fontSize: 14, color: "rgba(245,241,234,.65)", maxWidth: 440, lineHeight: 1.65, margin: "0 0 28px 0" }}>
              Procur connects buyers directly with verified farmers: transparent pricing, reliable supply, and produce that&apos;s never more than a day from harvest.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/signup?accountType=buyer" style={{ padding: "12px 28px", background: "#f5f1ea", color: "#1c2b23", fontSize: 13, fontWeight: 700, borderRadius: 999, textDecoration: "none" }}>
                Start buying
              </Link>
              <Link href="/signup?accountType=seller" style={{ padding: "12px 28px", background: "transparent", color: "#f5f1ea", fontSize: 13, fontWeight: 600, borderRadius: 999, border: "1px solid rgba(245,241,234,.2)", textDecoration: "none" }}>
                Become a supplier
              </Link>
            </div>
          </div>

          <div style={{ height: 1, background: "rgba(245,241,234,.08)" }} />

          {/* Logo + description + links */}
          <div style={{ display: "flex", gap: 60, padding: "48px 0 40px" }}>
            <div style={{ flexShrink: 0, width: 240 }}>
              <Image src="/images/logos/procur-logo.svg" alt="Procur" width={80} height={21} style={{ filter: "brightness(0) invert(1)", opacity: 0.75 }} />
              <p style={{ fontSize: 12, color: "rgba(245,241,234,.55)", lineHeight: 1.65, marginTop: 16, marginBottom: 0 }}>
                Procur is the Caribbean&apos;s agricultural marketplace, purpose-built to shorten supply chains and strengthen local food economies.
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                {SOCIAL_ICONS.map((icon, i) => (
                  <a key={i} href="#" style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid rgba(245,241,234,.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(245,241,234,.55)", textDecoration: "none" }}>
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
              {FOOTER_COLS.map(col => (
                <div key={col.title}>
                  <h5 style={{ fontSize: 10, fontWeight: 700, color: "rgba(245,241,234,.5)", marginBottom: 14, letterSpacing: ".08em", textTransform: "uppercase" }}>{col.title}</h5>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {col.links.map(link => (
                      <li key={link.label} style={{ marginBottom: 8 }}>
                        <Link href={link.href} style={{ fontSize: 12.5, color: "rgba(245,241,234,.55)", textDecoration: "none" }}>{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(245,241,234,.1)", padding: "18px 20px 28px" }}>
          <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: 11, color: "rgba(245,241,234,.35)", margin: 0 }}>&copy; 2026 Procur Ltd. All rights reserved.</p>
            <div style={{ display: "flex", gap: 16 }}>
              {LEGAL_LINKS.map(l => (
                <Link key={l.label} href={l.href} style={{ fontSize: 11, color: "rgba(245,241,234,.35)", textDecoration: "none" }}>{l.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
