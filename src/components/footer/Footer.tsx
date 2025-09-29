"use client";

import React from "react";
import Image from "next/image";

const Footer: React.FC = () => {
  const footerSections = {
    "For Buyers": [
      { title: "Marketplace", href: "/buyers/marketplace" },
      { title: "Request Quotes", href: "/buyers/quotes" },
      { title: "Order Management", href: "/buyers/orders" },
      { title: "Quality Assurance", href: "/buyers/quality" },
      { title: "Logistics Support", href: "/buyers/logistics" },
      { title: "Payment Solutions", href: "/buyers/payments" },
      { title: "Buyer Portal", href: "/buyers/portal" },
    ],
    "For Suppliers": [
      { title: "Supplier Portal", href: "/suppliers/portal" },
      { title: "Product Catalog", href: "/suppliers/catalog" },
      { title: "Order Fulfillment", href: "/suppliers/orders" },
      { title: "Analytics Dashboard", href: "/suppliers/analytics" },
      { title: "Marketing Tools", href: "/suppliers/marketing" },
    ],
    "For Government": [
      { title: "Reporting & Analytics", href: "/government/reporting" },
      { title: "Vendor Management", href: "/government/vendors" },
    ],
    Resources: [
      { title: "Documentation", href: "/resources/docs" },
      { title: "API Reference", href: "/resources/api" },
      { title: "Case Studies", href: "/resources/case-studies" },
      { title: "Webinars", href: "/resources/webinars" },
      { title: "White Papers", href: "/resources/white-papers" },
    ],
    Company: [
      { title: "About Procur", href: "/company/about" },
      { title: "Careers", href: "/company/careers" },
      { title: "Contact Us", href: "/company/contact" },
    ],
    Help: [
      { title: "Support Center", href: "/help/support" },
      { title: "FAQ", href: "/help/faq" },
    ],
    "Terms & Policies": [
      { title: "Privacy Policy", href: "/legal/privacy" },
      { title: "Terms of Service", href: "/legal/terms" },
      { title: "Cookie Policy", href: "/legal/cookies" },
      { title: "Usage Policy", href: "/legal/usage" },
    ],
  };

  const renderSection = (
    sectionTitle: string,
    links: { title: string; href: string }[]
  ) => (
    <div key={sectionTitle} className="space-y-6">
      <h3 className="text-white font-medium text-base">{sectionTitle}</h3>
      <ul className="space-y-4">
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              className="text-gray-400 hover:text-white transition-colors duration-200 text-sm leading-relaxed"
            >
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Logo Section */}
          <div className="lg:col-span-2">
            <div className="mb-6 -ml-4">
              <Image
                src="/images/logos/procur-logo.svg"
                alt="Procur"
                width={160}
                height={42}
                className="h-12 w-auto filter invert"
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md -ml-4">
              Procur is the global marketplace for fresh produce procurement,
              connecting buyers and suppliers with trusted logistics, quality,
              and secure payments.
            </p>
            <div className="flex space-x-4 mt-6 -ml-4">
              <a
                href="https://linkedin.com/company/procur"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
                </svg>
              </a>
              <a
                href="https://twitter.com/procur"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Twitter"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://youtube.com/procur"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="YouTube"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Footer Links - two rows: 4 on top, 3 on bottom, right-aligned */}
          <div className="lg:col-span-10 flex flex-col w-full items-end text-right">
            {/* Top row (4 sections) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 w-full lg:w-[88%]">
              {[
                "For Buyers",
                "For Suppliers",
                "For Government",
                "Resources",
              ].map((key) => renderSection(key, (footerSections as any)[key]))}
            </div>

            {/* Bottom row (3 sections) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-8 lg:gap-12 mt-8 w-full lg:w-[70%]">
              {["Company", "Help", "Terms & Policies"].map((key) =>
                renderSection(key, (footerSections as any)[key])
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div className="text-gray-400 text-sm">
              2025 Procur. All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
