"use client";

import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import type { Metadata } from "next";
import Image from "next/image";
import { useState } from "react";

// Note: This would typically be handled server-side with proper metadata export
const metadata = {
  title: "Support Center - Procur",
  description:
    "Get help with Procur. Find answers, contact support, and access resources to make the most of our produce procurement platform.",
};

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const supportCategories = [
    {
      title: "Getting Started",
      description: "New to Procur? Learn the basics of our platform",
      icon: "🚀",
      articles: [
        "Creating your first account",
        "Setting up your profile",
        "Understanding user roles",
        "Platform overview and navigation",
        "First steps for buyers",
        "First steps for suppliers",
      ],
      href: "/help/getting-started",
    },
    {
      title: "Account & Billing",
      description: "Manage your account settings and billing information",
      icon: "💳",
      articles: [
        "Updating account information",
        "Managing payment methods",
        "Understanding billing cycles",
        "Subscription plans and pricing",
        "Invoice and receipt access",
        "Account security settings",
      ],
      href: "/help/account-billing",
    },
    {
      title: "Buying & Sourcing",
      description: "Everything about purchasing produce on our platform",
      icon: "🛒",
      articles: [
        "How to search for products",
        "Requesting quotes from suppliers",
        "Understanding product specifications",
        "Quality standards and certifications",
        "Placing and managing orders",
        "Tracking shipments",
      ],
      href: "/help/buying-sourcing",
    },
    {
      title: "Selling & Suppliers",
      description: "Resources for suppliers and growers on our platform",
      icon: "🌱",
      articles: [
        "Setting up your supplier profile",
        "Adding products to your catalog",
        "Managing inventory and availability",
        "Responding to buyer requests",
        "Order fulfillment process",
        "Performance metrics and analytics",
      ],
      href: "/help/selling-suppliers",
    },
    {
      title: "Logistics & Shipping",
      description: "Transportation, delivery, and cold chain management",
      icon: "🚛",
      articles: [
        "Understanding shipping options",
        "Cold chain requirements",
        "Packaging and handling standards",
        "Delivery scheduling",
        "Tracking and notifications",
        "Handling delivery issues",
      ],
      href: "/help/logistics-shipping",
    },
    {
      title: "Quality & Compliance",
      description: "Food safety, certifications, and quality standards",
      icon: "✅",
      articles: [
        "Food safety requirements",
        "Required certifications",
        "Quality inspection process",
        "Compliance documentation",
        "Handling quality disputes",
        "Regulatory guidelines",
      ],
      href: "/help/quality-compliance",
    },
    {
      title: "Payments & Finance",
      description: "Payment processing, invoicing, and financial tools",
      icon: "💰",
      articles: [
        "Payment methods and processing",
        "Understanding fees and pricing",
        "Invoice management",
        "Trade financing options",
        "Payment disputes and resolution",
        "Tax documentation",
      ],
      href: "/help/payments-finance",
    },
    {
      title: "API & Integrations",
      description: "Technical documentation and integration guides",
      icon: "⚙️",
      articles: [
        "API getting started guide",
        "Authentication and security",
        "Available endpoints",
        "Integration examples",
        "Webhook notifications",
        "Rate limits and best practices",
      ],
      href: "/help/api-integrations",
    },
  ];

  const quickActions = [
    {
      title: "Contact Support",
      description: "Get help from our support team",
      action: "Email Support",
      href: "mailto:support@procur.com",
      icon: "📧",
    },
    {
      title: "Schedule a Demo",
      description: "See Procur in action with a personalized demo",
      action: "Book Demo",
      href: "https://calendly.com/procur-demo",
      icon: "📅",
    },
    {
      title: "Check System Status",
      description: "View current system status and uptime",
      action: "View Status",
      href: "https://status.procur.com",
      icon: "🟢",
    },
    {
      title: "Join Community",
      description: "Connect with other users in our community forum",
      action: "Join Forum",
      href: "https://community.procur.com",
      icon: "👥",
    },
  ];

  const popularArticles = [
    {
      title: "How to create your first purchase order",
      category: "Buying & Sourcing",
      readTime: "5 min read",
      href: "/help/articles/first-purchase-order",
    },
    {
      title: "Setting up quality standards for your products",
      category: "Quality & Compliance",
      readTime: "8 min read",
      href: "/help/articles/quality-standards",
    },
    {
      title: "Understanding cold chain logistics",
      category: "Logistics & Shipping",
      readTime: "6 min read",
      href: "/help/articles/cold-chain-logistics",
    },
    {
      title: "Payment processing and fee structure",
      category: "Payments & Finance",
      readTime: "4 min read",
      href: "/help/articles/payment-processing",
    },
    {
      title: "API authentication and getting started",
      category: "API & Integrations",
      readTime: "10 min read",
      href: "/help/articles/api-authentication",
    },
    {
      title: "Supplier verification process",
      category: "Selling & Suppliers",
      readTime: "7 min read",
      href: "/help/articles/supplier-verification",
    },
  ];

  const filteredCategories = supportCategories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.articles.some((article) =>
        article.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--secondary-black)] text-balance">
            How can we help you today?
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            Find answers, get support, and learn how to make the most of Procur.
            Our comprehensive help center has everything you need to succeed in
            produce procurement.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help articles, guides, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input w-full pl-12 pr-4 py-4 text-base"
                style={{ borderRadius: "9999px", height: "auto" }}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <div className="relative mx-auto rounded-3xl overflow-hidden shadow-xl border border-black/5 w-full max-w-6xl h-96 md:h-[520px]">
              <Image
                src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                alt="Support and help resources"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Quick Actions */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-8 text-center">
            Need immediate help?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                className="card hover:shadow-lg transition-all duration-200 text-center group"
              >
                <div className="text-3xl mb-3">{action.icon}</div>
                <h3 className="font-semibold mb-2 text-[var(--secondary-black)] group-hover:text-[var(--primary-accent2)] transition-colors">
                  {action.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {action.description}
                </p>
                <span className="btn btn-ghost px-4 py-2 text-sm">
                  {action.action}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Support Categories */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Browse by category
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Find detailed guides and documentation organized by topic. Each
              category contains step-by-step instructions and best practices.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCategories.map((category, index) => (
              <a
                key={index}
                href={category.href}
                className="card hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{category.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 text-[var(--secondary-black)] group-hover:text-[var(--primary-accent2)] transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {category.description}
                    </p>
                    <ul className="space-y-1">
                      {category.articles
                        .slice(0, 3)
                        .map((article, articleIndex) => (
                          <li
                            key={articleIndex}
                            className="text-xs text-gray-500 flex items-center gap-2"
                          >
                            <span className="h-1 w-1 rounded-full bg-[var(--primary-accent2)]" />
                            {article}
                          </li>
                        ))}
                      {category.articles.length > 3 && (
                        <li className="text-xs text-gray-400 italic">
                          +{category.articles.length - 3} more articles
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {searchQuery && filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                No results found for "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="btn btn-ghost px-6 py-2"
              >
                Clear search
              </button>
            </div>
          )}
        </section>

        {/* Popular Articles */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Popular articles
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The most helpful articles based on user feedback and views. Start
              here for quick answers to common questions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularArticles.map((article, index) => (
              <a
                key={index}
                href={article.href}
                className="card hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs text-[var(--primary-accent2)] font-medium">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {article.readTime}
                  </span>
                </div>
                <h3 className="font-semibold text-[var(--secondary-black)] group-hover:text-[var(--primary-accent2)] transition-colors leading-tight">
                  {article.title}
                </h3>
              </a>
            ))}
          </div>
        </section>

        {/* Still Need Help */}
        <section>
          <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-black to-black/90 text-white px-8 md:px-14 py-12 md:py-16">
            <div className="max-w-5xl">
              <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Still need help?
              </h3>
              <p className="mt-4 md:mt-5 text-base md:text-lg text-white/80 max-w-2xl">
                Can't find what you&apos;re looking for? Our support team is here to
                help. Get in touch and we'll get back to you within 24 hours.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 md:gap-4">
                <a
                  href="mailto:support@procur.com"
                  className="btn btn-primary px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  Contact Support
                </a>
                <a
                  href="/help/faq"
                  className="btn btn-ghost text-white border-white px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  View FAQ
                </a>
              </div>

              {/* Support Stats */}
              <div className="mt-12 grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold mb-1">24hrs</div>
                  <div className="text-sm text-white/80">
                    Average response time
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold mb-1">98%</div>
                  <div className="text-sm text-white/80">
                    Customer satisfaction
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold mb-1">24/7</div>
                  <div className="text-sm text-white/80">
                    Help center access
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
