import TopNavigation from "@/components/navigation/TopNavigation";
import type { Metadata } from "next";
import Image from "next/image";
import {
  ArchiveBoxIcon,
  PhotoIcon,
  TagIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ChartBarIcon,
  GlobeAltIcon,
  CheckBadgeIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Product Catalog Management - Procur",
  description:
    "Manage your produce catalog with Procur's powerful tools. Add products, update inventory, set pricing, and showcase your offerings to buyers worldwide.",
};

export default function SupplierCatalogPage() {
  const catalogFeatures = [
    {
      title: "Product Management",
      description:
        "Complete control over your product listings and information",
      icon: ArchiveBoxIcon,
      features: [
        "Easy product creation and editing",
        "Bulk upload and import tools",
        "Rich product descriptions and specifications",
        "Multiple product variants and options",
        "Category and classification management",
      ],
    },
    {
      title: "Visual Merchandising",
      description:
        "Showcase your products with professional imagery and presentation",
      icon: PhotoIcon,
      features: [
        "High-quality image upload and management",
        "Multiple product photos and galleries",
        "Image optimization and compression",
        "Visual product comparison tools",
        "Professional catalog layouts",
      ],
    },
    {
      title: "Inventory Tracking",
      description: "Real-time inventory management and availability updates",
      icon: ClipboardDocumentListIcon,
      features: [
        "Live inventory tracking and updates",
        "Automated low-stock alerts",
        "Seasonal availability management",
        "Harvest schedule integration",
        "Multi-location inventory support",
      ],
    },
    {
      title: "Pricing & Promotions",
      description: "Flexible pricing strategies and promotional campaigns",
      icon: TagIcon,
      features: [
        "Dynamic pricing and bulk discounts",
        "Seasonal pricing adjustments",
        "Promotional campaigns and offers",
        "Customer-specific pricing tiers",
        "Market-based pricing insights",
      ],
    },
  ];

  const catalogTools = [
    {
      tool: "Smart Search & Filters",
      description: "Help buyers find your products quickly",
      icon: MagnifyingGlassIcon,
      capabilities: [
        "Advanced search functionality",
        "Filter by category, season, origin",
        "Quality grade and certification filters",
        "Price range and quantity filters",
      ],
    },
    {
      tool: "Product Analytics",
      description: "Understand product performance and demand",
      icon: ChartBarIcon,
      capabilities: [
        "View and click tracking",
        "Conversion rate analysis",
        "Seasonal demand patterns",
        "Competitive positioning insights",
      ],
    },
    {
      tool: "Quality Certifications",
      description: "Showcase your quality standards and certifications",
      icon: CheckBadgeIcon,
      capabilities: [
        "Organic and GAP certifications",
        "Food safety documentation",
        "Sustainability credentials",
        "Third-party quality verifications",
      ],
    },
    {
      tool: "Global Reach",
      description: "Expand your market presence internationally",
      icon: GlobeAltIcon,
      capabilities: [
        "Multi-language product descriptions",
        "International shipping options",
        "Currency and pricing localization",
        "Regional compliance management",
      ],
    },
  ];

  const productTypes = [
    {
      category: "Fresh Fruits",
      examples: [
        "Citrus",
        "Berries",
        "Stone Fruits",
        "Tropical",
        "Apples & Pears",
      ],
      icon: "🍎",
    },
    {
      category: "Fresh Vegetables",
      examples: [
        "Leafy Greens",
        "Root Vegetables",
        "Peppers",
        "Tomatoes",
        "Onions",
      ],
      icon: "🥬",
    },
    {
      category: "Herbs & Aromatics",
      examples: [
        "Fresh Herbs",
        "Microgreens",
        "Edible Flowers",
        "Specialty Greens",
      ],
      icon: "🌿",
    },
    {
      category: "Organic Produce",
      examples: [
        "Certified Organic",
        "Biodynamic",
        "Natural",
        "Pesticide-Free",
      ],
      icon: "🌱",
    },
  ];

  const managementProcess = [
    {
      step: "1",
      title: "Add Products",
      description:
        "Create detailed product listings with photos, descriptions, and specifications",
      icon: ArchiveBoxIcon,
    },
    {
      step: "2",
      title: "Set Pricing",
      description:
        "Configure pricing strategies, bulk discounts, and promotional offers",
      icon: CurrencyDollarIcon,
    },
    {
      step: "3",
      title: "Manage Inventory",
      description:
        "Track availability, update stock levels, and set seasonal schedules",
      icon: ClipboardDocumentListIcon,
    },
    {
      step: "4",
      title: "Monitor Performance",
      description:
        "Analyze product performance, buyer interest, and market trends",
      icon: ChartBarIcon,
    },
  ];

  const benefits = [
    {
      title: "Professional Presentation",
      description:
        "Showcase your products with high-quality catalogs that impress buyers",
      stat: "3x more inquiries",
    },
    {
      title: "Efficient Management",
      description:
        "Save time with bulk editing tools and automated inventory updates",
      stat: "75% time savings",
    },
    {
      title: "Better Visibility",
      description:
        "Reach more buyers with optimized search and discovery features",
      stat: "5x more exposure",
    },
    {
      title: "Higher Conversions",
      description:
        "Convert more browsers into buyers with detailed product information",
      stat: "40% higher conversion",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--secondary-black)] text-balance">
            Showcase Your Products Like Never Before
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            Create stunning product catalogs that sell themselves. With Procur's
            advanced catalog management tools, you can present your produce
            professionally, manage inventory efficiently, and reach buyers
            worldwide.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="/signup?type=supplier"
              className="btn btn-primary px-8 py-3 text-base"
            >
              Start Building Your Catalog
            </a>
            <a href="#features" className="btn btn-ghost px-8 py-3 text-base">
              Explore Features
            </a>
          </div>
          <div className="mt-10">
            <div className="relative mx-auto rounded-3xl overflow-hidden shadow-xl border border-black/5 w-full max-w-6xl h-96 md:h-[520px]">
              <Image
                src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                alt="Professional product catalog management interface"
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
              Your products are the heart of your business, and they deserve to
              be presented beautifully. In today's competitive marketplace,
              buyers make decisions in seconds based on what they see. That's
              why we've built the most comprehensive product catalog management
              system in the industry.
            </p>
            <p className="mt-6 text-lg text-gray-700 leading-8">
              From small family farms to large commercial operations, our
              platform helps suppliers create catalogs that not only look
              professional but also drive real business results. Every feature
              is designed with one goal in mind: helping you sell more produce
              to more buyers.
            </p>
            <blockquote className="mt-8 md:mt-10 border-l-4 border-[var(--primary-accent2)] pl-5 italic text-xl text-gray-800">
              "A great product catalog doesn't just show what you sell — it
              tells the story of why buyers should choose you."
            </blockquote>
          </div>
        </section>

        {/* Core Features */}
        <section id="features" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Complete Catalog Management Suite
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to create, manage, and optimize your product
              catalog for maximum impact and sales conversion.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {catalogFeatures.map((feature, index) => (
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

        {/* Advanced Tools */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Advanced Catalog Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Powerful features that help your products stand out and reach the
              right buyers at the right time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {catalogTools.map((tool, index) => (
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

        {/* Product Categories */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Support for All Product Types
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Whether you specialize in one category or offer diverse produce,
              our platform adapts to showcase your products perfectly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productTypes.map((type, index) => (
              <div key={index} className="card text-center">
                <div className="text-4xl mb-4">{type.icon}</div>
                <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-3">
                  {type.category}
                </h3>
                <ul className="space-y-1">
                  {type.examples.map((example, exampleIndex) => (
                    <li key={exampleIndex} className="text-sm text-gray-600">
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Management Process */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Simple Catalog Management Process
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our intuitive workflow makes it easy to create and maintain a
              professional catalog that drives results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {managementProcess.map((step, index) => (
              <div key={index} className="card text-center">
                <div className="w-12 h-12 bg-[var(--primary-accent2)] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <div className="flex justify-center mb-4">
                  <step.icon className="h-6 w-6 text-[var(--primary-accent2)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits & Results */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Proven Results for Suppliers
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Suppliers using our catalog management tools see significant
              improvements in visibility, engagement, and sales.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="card text-center">
                <div className="text-2xl font-bold text-[var(--primary-accent2)] mb-2">
                  {benefit.stat}
                </div>
                <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-black to-black/90 text-white px-8 md:px-14 py-12 md:py-16">
            <div className="max-w-5xl">
              <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Ready to Build Your Professional Catalog?
              </h3>
              <p className="mt-4 md:mt-5 text-base md:text-lg text-white/80 max-w-2xl">
                Join thousands of suppliers who have transformed their product
                presentation and increased sales with Procur's catalog
                management tools. Start building your catalog today.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 md:gap-4">
                <a
                  href="/signup?type=supplier"
                  className="btn btn-primary px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  Start Your Catalog
                </a>
                <a
                  href="https://calendly.com/procur-catalog-demo"
                  className="btn btn-ghost text-white border-white px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  See Demo
                </a>
              </div>

              {/* Feature Highlights */}
              <div className="mt-12 grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Easy Setup</h4>
                  <p className="text-sm text-white/80">
                    Get your catalog online in minutes, not hours
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Professional Results</h4>
                  <p className="text-sm text-white/80">
                    Create catalogs that impress buyers and drive sales
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Ongoing Support</h4>
                  <p className="text-sm text-white/80">
                    Get help optimizing your catalog for maximum impact
                  </p>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
          </div>
        </section>
      </main>
    </div>
  );
}
