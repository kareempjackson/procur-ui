import AuthGuard from "@/components/AuthGuard";
import BuyerTopNavigation from "@/components/navigation/BuyerTopNavigation";
import { ToastProvider } from "@/components/ui/Toast";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Procur Marketplace",
  description:
    "Browse fresh produce, manage your orders, and connect with verified farmers on Procur.",
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <AuthGuard allowAccountTypes={["buyer"]}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#faf8f4", fontFamily: "'Urbanist', system-ui, sans-serif" }}>
          <BuyerTopNavigation />
          <main style={{ flex: 1, display: "block", margin: 0, padding: 0 }}>{children}</main>

          {/* ── Footer ── */}
          <footer style={{ background: "#0a0a0a", color: "#f5f1ea" }}>
            <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 20px" }}>
              <div className="v6-ft-top" style={{ padding: "80px 0 64px" }}>
                <h2
                  className="v6-ft-h2"
                  style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.15, maxWidth: 520, marginBottom: 16, letterSpacing: "-.5px", color: "#f5f1ea" }}
                >
                  Building stronger food systems across the Caribbean and beyond.
                </h2>
                <p style={{ fontSize: 14, color: "rgba(245,241,234,.65)", maxWidth: 440, lineHeight: 1.65, margin: "0 0 28px" }}>
                  Procur connects buyers directly with verified farmers: transparent pricing, reliable supply, and produce that&apos;s never more than a day from harvest.
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Link href="/" style={{ padding: "12px 28px", background: "#f5f1ea", color: "#1c2b23", fontSize: 13, fontWeight: 700, borderRadius: 999, textDecoration: "none" }}>
                    Browse marketplace
                  </Link>
                  <Link href="/signup?accountType=seller" style={{ padding: "12px 28px", background: "transparent", color: "#f5f1ea", fontSize: 13, fontWeight: 600, borderRadius: 999, border: "1px solid rgba(245,241,234,.2)", textDecoration: "none" }}>
                    Become a supplier
                  </Link>
                </div>
              </div>

              <div style={{ height: 1, background: "rgba(245,241,234,.08)" }} />

              <div className="v6-ft-row" style={{ display: "flex", gap: 60, padding: "48px 0 40px" }}>
                <div className="v6-ft-brand" style={{ flexShrink: 0, width: 240 }}>
                  <Image src="/images/logos/procur-logo.svg" alt="Procur" width={80} height={21} style={{ filter: "brightness(0) invert(1)", opacity: 0.75 }} />
                  <p style={{ fontSize: 12, color: "rgba(245,241,234,.55)", lineHeight: 1.65, marginTop: 16, marginBottom: 0 }}>
                    Procur is Grenada&apos;s agricultural marketplace, purpose-built to shorten supply chains and strengthen local food economies.
                  </p>
                  <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                    {[
                      <svg key="x" viewBox="0 0 24 24" fill="currentColor" width={14} height={14}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.65l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
                      <svg key="ig" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={14} height={14}><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4.5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>,
                      <svg key="li" viewBox="0 0 24 24" fill="currentColor" width={14} height={14}><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>,
                      <svg key="fb" viewBox="0 0 24 24" fill="currentColor" width={14} height={14}><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>,
                    ].map((icon, i) => (
                      <a key={i} href="#" style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid rgba(245,241,234,.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(245,241,234,.55)", textDecoration: "none" }}>
                        {icon}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="v6-ft-cols" style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
                  {[
                    { title: "Platform", links: [{ label: "Browse Produce", href: "/" }, { label: "For Suppliers", href: "/signup?accountType=seller" }, { label: "For Buyers", href: "/signup?accountType=buyer" }, { label: "Log in", href: "/login" }] },
                    { title: "Solutions", links: [{ label: "Restaurants", href: "/solutions/restaurants" }, { label: "Hotels", href: "/solutions/hotels" }, { label: "Grocery", href: "/solutions/grocery" }, { label: "Government", href: "/solutions/government" }] },
                    { title: "Company", links: [{ label: "About Procur", href: "/company/about" }, { label: "Blog", href: "/blog" }, { label: "Contact", href: "/company/contact" }] },
                    { title: "Resources", links: [{ label: "Help Center", href: "/help" }, { label: "FAQ", href: "/help/faq" }, { label: "Buyer Guide", href: "/buyer-guide" }] },
                  ].map((col) => (
                    <div key={col.title}>
                      <h5 style={{ fontSize: 10, fontWeight: 700, color: "rgba(245,241,234,.5)", marginBottom: 14, letterSpacing: ".08em", textTransform: "uppercase" }}>
                        {col.title}
                      </h5>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {col.links.map((link) => (
                          <li key={link.label} style={{ marginBottom: 8 }}>
                            <Link href={link.href} style={{ fontSize: 12.5, color: "rgba(245,241,234,.55)", textDecoration: "none" }}>
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="v6-ft-bar" style={{ paddingTop: 18, paddingBottom: 28, borderTop: "1px solid rgba(245,241,234,.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: 11, color: "rgba(245,241,234,.35)", margin: 0 }}>
                  &copy; 2026 Procur Grenada Ltd. All rights reserved.
                </p>
                <div className="v6-ft-links" style={{ display: "flex", gap: 16 }}>
                  {[{ label: "Privacy", href: "/legal/privacy" }, { label: "Terms", href: "/legal/terms" }, { label: "Cookies", href: "/legal/cookies" }, { label: "Accessibility", href: "/accessibility" }].map((l) => (
                    <Link key={l.label} href={l.href} style={{ fontSize: 11, color: "rgba(245,241,234,.35)", textDecoration: "none" }}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </footer>
        </div>
      </AuthGuard>
    </ToastProvider>
  );
}
