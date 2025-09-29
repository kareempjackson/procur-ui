import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import type { Metadata } from "next";
import Image from "next/image";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  MapPinIcon,
  StarIcon,
  CheckBadgeIcon,
  ClockIcon,
  TruckIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  UserGroupIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Produce Marketplace - Procur",
  description:
    "Discover premium produce from verified suppliers worldwide. Browse thousands of products, compare prices, and source quality ingredients for your business with Procur's marketplace.",
};

export default function BuyersMarketplacePage() {
  const marketplaceFeatures = [
    {
      title: "Advanced Search & Discovery",
      description:
        "Find exactly what you need with powerful search and filtering tools",
      icon: MagnifyingGlassIcon,
      features: [
        "Smart search with auto-suggestions",
        "Filter by location, season, and certifications",
        "Category browsing and product discovery",
        "Saved searches and alerts",
        "Trending and featured products",
      ],
    },
    {
      title: "Verified Supplier Network",
      description:
        "Connect with trusted suppliers who meet our quality standards",
      icon: CheckBadgeIcon,
      features: [
        "Comprehensive supplier verification",
        "Quality certifications and compliance",
        "Performance ratings and reviews",
        "Financial stability verification",
        "Insurance and bonding confirmation",
      ],
    },
    {
      title: "Real-Time Availability",
      description:
        "Access live inventory data and seasonal availability information",
      icon: ClockIcon,
      features: [
        "Live inventory tracking",
        "Seasonal availability calendars",
        "Harvest schedule integration",
        "Stock level notifications",
        "Pre-order and reservation options",
      ],
    },
    {
      title: "Transparent Pricing",
      description:
        "Compare prices across suppliers and access competitive market rates",
      icon: CurrencyDollarIcon,
      features: [
        "Real-time price comparisons",
        "Volume discount visibility",
        "Market price benchmarking",
        "Historical pricing data",
        "Contract pricing options",
      ],
    },
  ];

  const productCategories = [
    {
      category: "Fresh Fruits",
      description: "Premium fruits from trusted growers worldwide",
      icon: "🍎",
      subcategories: [
        "Citrus Fruits",
        "Berries & Small Fruits",
        "Stone Fruits",
        "Tropical & Exotic",
        "Apples & Pears",
      ],
      supplierCount: "1,200+ suppliers",
    },
    {
      category: "Fresh Vegetables",
      description: "Farm-fresh vegetables for every culinary need",
      icon: "🥬",
      subcategories: [
        "Leafy Greens",
        "Root Vegetables",
        "Peppers & Chilies",
        "Tomatoes & Nightshades",
        "Onions & Alliums",
      ],
      supplierCount: "950+ suppliers",
    },
    {
      category: "Herbs & Aromatics",
      description: "Fresh herbs and specialty greens for professional kitchens",
      icon: "🌿",
      subcategories: [
        "Fresh Culinary Herbs",
        "Microgreens",
        "Edible Flowers",
        "Specialty Greens",
        "Aromatic Vegetables",
      ],
      supplierCount: "400+ suppliers",
    },
    {
      category: "Organic & Specialty",
      description: "Certified organic and specialty produce options",
      icon: "🌱",
      subcategories: [
        "Certified Organic",
        "Biodynamic",
        "Heirloom Varieties",
        "Local & Artisanal",
        "Sustainable Grown",
      ],
      supplierCount: "600+ suppliers",
    },
  ];

  const searchTools = [
    {
      tool: "Smart Filters",
      description: "Narrow down results with intelligent filtering options",
      icon: AdjustmentsHorizontalIcon,
      capabilities: [
        "Location and distance filters",
        "Certification and quality filters",
        "Price range and quantity filters",
        "Seasonal availability filters",
      ],
    },
    {
      tool: "Geographic Search",
      description: "Find suppliers by location and shipping preferences",
      icon: MapPinIcon,
      capabilities: [
        "Local and regional sourcing",
        "Shipping distance optimization",
        "State and country filters",
        "Climate zone matching",
      ],
    },
    {
      tool: "Quality Assurance",
      description: "Ensure products meet your quality standards",
      icon: ShieldCheckIcon,
      capabilities: [
        "Certification verification",
        "Quality grade filtering",
        "Supplier rating system",
        "Compliance documentation",
      ],
    },
    {
      tool: "Market Intelligence",
      description: "Access market data and pricing insights",
      icon: ChartBarIcon,
      capabilities: [
        "Price trend analysis",
        "Seasonal demand patterns",
        "Market availability reports",
        "Competitive pricing data",
      ],
    },
  ];

  const supplierBenefits = [
    {
      benefit: "Verified Quality",
      description:
        "All suppliers undergo rigorous verification and quality checks",
      icon: CheckBadgeIcon,
    },
    {
      benefit: "Competitive Pricing",
      description: "Access wholesale prices and volume discounts",
      icon: CurrencyDollarIcon,
    },
    {
      benefit: "Reliable Delivery",
      description: "Dependable logistics and on-time delivery guarantees",
      icon: TruckIcon,
    },
    {
      benefit: "Global Reach",
      description: "Source from suppliers worldwide with local expertise",
      icon: GlobeAltIcon,
    },
    {
      benefit: "Performance Tracking",
      description: "Monitor supplier performance and service quality",
      icon: StarIcon,
    },
    {
      benefit: "Secure Transactions",
      description: "Protected payments and transaction security",
      icon: ShieldCheckIcon,
    },
  ];

  const marketplaceStats = [
    {
      stat: "5,000+",
      label: "Verified Suppliers",
      description: "Trusted producers worldwide",
    },
    {
      stat: "50,000+",
      label: "Product Listings",
      description: "Fresh produce options",
    },
    {
      stat: "98%",
      label: "On-Time Delivery",
      description: "Reliable fulfillment rate",
    },
    {
      stat: "24/7",
      label: "Market Access",
      description: "Always-on marketplace",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--secondary-black)] text-balance">
            The World's Largest Produce Marketplace
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            Discover premium produce from verified suppliers worldwide. Browse
            thousands of products, compare prices, and source quality
            ingredients for your business with confidence and ease.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="/signup?type=buyer"
              className="btn btn-primary px-8 py-3 text-base"
            >
              Start Sourcing Today
            </a>
            <a href="#features" className="btn btn-ghost px-8 py-3 text-base">
              Explore Marketplace
            </a>
          </div>
          <div className="mt-10">
            <div className="relative mx-auto rounded-3xl overflow-hidden shadow-xl border border-black/5 w-full max-w-6xl h-96 md:h-[520px]">
              <Image
                src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                alt="Global produce marketplace with diverse suppliers"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Introduction */}
        <section className="mb-20">
          <div className="md:columns-2 md:gap-10">
            <p className="text-lg text-gray-700 leading-8 first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:leading-[0.9]">
              Finding the right produce suppliers shouldn't be a gamble. Every
              ingredient that enters your kitchen, every product that reaches
              your customers, starts with a sourcing decision that can make or
              break your business. That's why we've built the most comprehensive
              and trusted produce marketplace in the world.
            </p>
            <p className="mt-6 text-lg text-gray-700 leading-8">
              From family farms to commercial operations, from local favorites
              to exotic specialties, our marketplace connects you with verified
              suppliers who share your commitment to quality. Every supplier is
              vetted, every product is tracked, and every transaction is
              protected.
            </p>
            <blockquote className="mt-8 md:mt-10 border-l-4 border-[var(--primary-accent2)] pl-5 italic text-xl text-gray-800">
              "Great sourcing isn't about finding the cheapest option — it&apos;s
              about finding the right partner for your success."
            </blockquote>
          </div>
        </section>

        {/* Core Features */}
        <section id="features" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Powerful Marketplace Features
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our marketplace combines advanced technology with industry
              expertise to help you find, evaluate, and source from the best
              suppliers worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {marketplaceFeatures.map((feature, index) => (
              <div
                key={index}
                className="card hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <feature.icon className="h-8 w-8 text-[var(--primary-accent2)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[var(--secondary-black)] mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    <ul className="space-y-2">
                      {feature.features.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)] flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Product Categories */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Comprehensive Product Categories
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Browse our extensive catalog of fresh produce, organized by
              category to help you find exactly what you need for your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {productCategories.map((category, index) => (
              <div key={index} className="card">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-3xl">{category.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[var(--secondary-black)] mb-2">
                      {category.category}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                      {category.description}
                    </p>
                    <div className="text-xs font-medium text-[var(--primary-accent2)] mb-4">
                      {category.supplierCount}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {category.subcategories.map((sub, subIndex) => (
                    <div
                      key={subIndex}
                      className="bg-[var(--primary-background)] rounded-lg p-2 text-center"
                    >
                      <div className="text-xs text-gray-600">{sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Search Tools */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Advanced Search & Discovery Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Find the perfect suppliers and products with our sophisticated
              search and filtering capabilities designed for professional
              buyers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {searchTools.map((tool, index) => (
              <div key={index} className="card">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <tool.icon className="h-6 w-6 text-[var(--primary-accent2)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-2">
                      {tool.tool}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {tool.capabilities.map((capability, capIndex) => (
                    <li
                      key={capIndex}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)] flex-shrink-0" />
                      {capability}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Supplier Benefits */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Why Buyers Choose Our Marketplace
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Every aspect of our marketplace is designed to give buyers
              confidence, convenience, and competitive advantages in their
              sourcing decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supplierBenefits.map((benefit, index) => (
              <div
                key={index}
                className="card text-center hover:shadow-lg transition-all duration-200"
              >
                <div className="flex justify-center mb-4">
                  <benefit.icon className="h-8 w-8 text-[var(--primary-accent2)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-3">
                  {benefit.benefit}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Marketplace Stats */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Marketplace by the Numbers
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join thousands of buyers who trust our marketplace for their
              produce sourcing needs. Our numbers speak to our commitment to
              quality and reliability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketplaceStats.map((item, index) => (
              <div key={index} className="card text-center">
                <div className="text-3xl font-bold text-[var(--primary-accent2)] mb-2">
                  {item.stat}
                </div>
                <div className="text-lg font-semibold text-[var(--secondary-black)] mb-2">
                  {item.label}
                </div>
                <div className="text-sm text-gray-600">{item.description}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-black to-black/90 text-white px-8 md:px-14 py-12 md:py-16">
            <div className="max-w-5xl">
              <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Ready to Transform Your Sourcing?
              </h3>
              <p className="mt-4 md:mt-5 text-base md:text-lg text-white/80 max-w-2xl">
                Join thousands of buyers who have discovered better suppliers,
                better prices, and better service through our marketplace. Start
                sourcing smarter today with access to the world's largest
                network of verified produce suppliers.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 md:gap-4">
                <a
                  href="/signup?type=buyer"
                  className="btn btn-primary px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  Start Sourcing Now
                </a>
                <a
                  href="https://calendly.com/procur-buyer-demo"
                  className="btn btn-ghost text-white border-white px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  Schedule Demo
                </a>
              </div>

              {/* Quick Access Links */}
              <div className="mt-12 grid md:grid-cols-4 gap-4">
                <a
                  href="/buyers/quotes"
                  className="bg-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  <h4 className="font-semibold mb-1">Request Quotes</h4>
                  <p className="text-sm text-white/80">Get custom pricing</p>
                </a>
                <a
                  href="/buyers/quality"
                  className="bg-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  <h4 className="font-semibold mb-1">Quality Assurance</h4>
                  <p className="text-sm text-white/80">
                    Ensure product quality
                  </p>
                </a>
                <a
                  href="/buyers/logistics"
                  className="bg-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  <h4 className="font-semibold mb-1">Logistics Support</h4>
                  <p className="text-sm text-white/80">Reliable delivery</p>
                </a>
                <a
                  href="/buyers/payments"
                  className="bg-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  <h4 className="font-semibold mb-1">Payment Solutions</h4>
                  <p className="text-sm text-white/80">Secure transactions</p>
                </a>
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
