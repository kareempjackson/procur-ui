import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import type { Metadata } from "next";
import Image from "next/image";
import {
  MegaphoneIcon,
  StarIcon,
  TagIcon,
  PhotoIcon,
  ChartBarIcon,
  UserGroupIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  PresentationChartLineIcon,
  TrophyIcon,
  EyeIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Marketing Tools - Procur",
  description:
    "Promote your produce business with Procur's comprehensive marketing tools. Increase visibility, attract more buyers, and grow your sales with professional marketing features.",
};

export default function SupplierMarketingPage() {
  const marketingFeatures = [
    {
      title: "Brand Showcase",
      description: "Create a compelling brand presence that attracts buyers",
      icon: StarIcon,
      features: [
        "Professional supplier profile pages",
        "Brand story and company highlights",
        "Certification and award displays",
        "Photo galleries and virtual tours",
        "Customer testimonials and reviews",
      ],
    },
    {
      title: "Product Promotion",
      description: "Highlight your best products and seasonal offerings",
      icon: TagIcon,
      features: [
        "Featured product placements",
        "Seasonal promotion campaigns",
        "New product launch announcements",
        "Limited-time offers and discounts",
        "Product spotlight opportunities",
      ],
    },
    {
      title: "Content Marketing",
      description: "Share your expertise and build buyer relationships",
      icon: PresentationChartLineIcon,
      features: [
        "Educational content publishing",
        "Growing tips and best practices",
        "Harvest updates and farm stories",
        "Recipe suggestions and usage ideas",
        "Industry insights and trends",
      ],
    },
    {
      title: "Digital Advertising",
      description: "Reach more buyers with targeted advertising campaigns",
      icon: MegaphoneIcon,
      features: [
        "Sponsored product listings",
        "Category page advertisements",
        "Search result promotions",
        "Email newsletter inclusions",
        "Social media integrations",
      ],
    },
  ];

  const promotionTools = [
    {
      tool: "Featured Listings",
      description: "Get premium placement in search results and category pages",
      icon: StarIcon,
      benefits: [
        "5x more visibility than standard listings",
        "Higher click-through rates",
        "Increased buyer inquiries",
        "Better conversion rates",
      ],
    },
    {
      tool: "Promotional Campaigns",
      description: "Create time-limited offers to drive sales",
      icon: TagIcon,
      benefits: [
        "Seasonal discount campaigns",
        "Volume-based pricing tiers",
        "Early bird specials",
        "Loyalty program integration",
      ],
    },
    {
      tool: "Content Hub",
      description: "Share your story and expertise with buyers",
      icon: PhotoIcon,
      benefits: [
        "Professional photography support",
        "Video content creation tools",
        "Blog and article publishing",
        "Social media content sharing",
      ],
    },
    {
      tool: "Performance Tracking",
      description: "Monitor and optimize your marketing efforts",
      icon: ChartBarIcon,
      benefits: [
        "Campaign performance analytics",
        "ROI tracking and reporting",
        "Audience engagement metrics",
        "A/B testing capabilities",
      ],
    },
  ];

  const marketingChannels = [
    {
      channel: "Marketplace Promotion",
      description: "Increase visibility within the Procur marketplace",
      icon: GlobeAltIcon,
      tactics: [
        "Featured supplier badges",
        "Category page sponsorships",
        "Search result promotions",
        "Homepage feature spots",
      ],
    },
    {
      channel: "Email Marketing",
      description: "Reach buyers directly through targeted email campaigns",
      icon: EnvelopeIcon,
      tactics: [
        "Newsletter inclusions",
        "Product announcement emails",
        "Seasonal campaign messages",
        "Personalized buyer outreach",
      ],
    },
    {
      channel: "Content Marketing",
      description: "Build relationships through valuable content",
      icon: PresentationChartLineIcon,
      tactics: [
        "Educational blog posts",
        "Growing guides and tips",
        "Recipe and usage content",
        "Industry trend analysis",
      ],
    },
    {
      channel: "Social Proof",
      description: "Leverage reviews and testimonials for credibility",
      icon: TrophyIcon,
      tactics: [
        "Customer review highlights",
        "Success story features",
        "Award and certification displays",
        "Media mention showcases",
      ],
    },
  ];

  const campaignTypes = [
    {
      type: "Seasonal Campaigns",
      description: "Promote seasonal products and capitalize on demand peaks",
      examples: [
        "Summer Berry Specials",
        "Holiday Citrus Promotions",
        "Spring Greens Launch",
      ],
      icon: "🌱",
    },
    {
      type: "New Product Launches",
      description: "Generate excitement and awareness for new offerings",
      examples: [
        "Organic Line Introduction",
        "Exotic Fruit Debut",
        "Specialty Variety Launch",
      ],
      icon: "🚀",
    },
    {
      type: "Quality Certifications",
      description: "Highlight your certifications and quality standards",
      examples: [
        "Organic Certification",
        "GAP Compliance",
        "Sustainability Awards",
      ],
      icon: "🏆",
    },
    {
      type: "Volume Discounts",
      description: "Attract large buyers with bulk pricing promotions",
      examples: [
        "Restaurant Bulk Deals",
        "Wholesale Discounts",
        "Contract Pricing",
      ],
      icon: "📦",
    },
  ];

  const successMetrics = [
    {
      metric: "Increased Visibility",
      description: "Get more eyes on your products and brand",
      improvement: "300% more views",
      icon: EyeIcon,
    },
    {
      metric: "Higher Engagement",
      description: "More buyers interacting with your listings",
      improvement: "150% more inquiries",
      icon: HeartIcon,
    },
    {
      metric: "Better Conversion",
      description: "Turn more browsers into actual buyers",
      improvement: "75% higher conversion",
      icon: TrophyIcon,
    },
    {
      metric: "Brand Recognition",
      description: "Build a stronger, more recognizable brand",
      improvement: "5x brand recall",
      icon: StarIcon,
    },
  ];

  const benefits = [
    {
      title: "Professional Presence",
      description:
        "Create a polished, professional image that builds buyer confidence",
      icon: StarIcon,
    },
    {
      title: "Increased Reach",
      description:
        "Expand your market reach and connect with more potential buyers",
      icon: GlobeAltIcon,
    },
    {
      title: "Higher Sales",
      description: "Drive more sales through effective promotion and marketing",
      icon: ChartBarIcon,
    },
    {
      title: "Brand Building",
      description: "Develop a strong brand that buyers recognize and trust",
      icon: TrophyIcon,
    },
    {
      title: "Customer Loyalty",
      description:
        "Build lasting relationships with buyers through consistent marketing",
      icon: HeartIcon,
    },
    {
      title: "Competitive Edge",
      description: "Stand out from competitors with superior marketing tools",
      icon: MegaphoneIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--secondary-black)] text-balance">
            Market Your Business Like a Pro
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            Stand out in the crowded produce marketplace with Procur's
            comprehensive marketing tools. Build your brand, promote your
            products, and attract more buyers with professional marketing
            features designed for suppliers.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="/signup?type=supplier"
              className="btn btn-primary px-8 py-3 text-base"
            >
              Start Marketing Your Business
            </a>
            <a href="#features" className="btn btn-ghost px-8 py-3 text-base">
              Explore Marketing Tools
            </a>
          </div>
          <div className="mt-10">
            <div className="relative mx-auto rounded-3xl overflow-hidden shadow-xl border border-black/5 w-full max-w-6xl h-96 md:h-[520px]">
              <Image
                src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                alt="Marketing tools and brand promotion interface"
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
              Great produce sells itself, but great marketing sells it faster,
              better, and at higher prices. In today's competitive marketplace,
              having quality products is just the entry ticket. The suppliers
              who thrive are those who know how to tell their story, showcase
              their value, and build lasting relationships with buyers.
            </p>
            <p className="mt-6 text-lg text-gray-700 leading-8">
              Our marketing platform gives you the tools that big brands use,
              tailored specifically for produce suppliers. Whether you&apos;re a
              small family farm or a large commercial operation, you can create
              professional campaigns that drive real results.
            </p>
            <blockquote className="mt-8 md:mt-10 border-l-4 border-[var(--primary-accent2)] pl-5 italic text-xl text-gray-800">
              "The best marketing doesn't feel like marketing — it feels like
              sharing something valuable."
            </blockquote>
          </div>
        </section>

        {/* Core Features */}
        <section id="features" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Complete Marketing Suite
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to build your brand, promote your products,
              and attract more buyers in one comprehensive platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {marketingFeatures.map((feature, index) => (
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

        {/* Promotion Tools */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Powerful Promotion Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Boost your visibility and sales with our suite of promotion tools
              designed to help you stand out in the marketplace.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {promotionTools.map((tool, index) => (
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
                  {tool.benefits.map((benefit, benefitIndex) => (
                    <li
                      key={benefitIndex}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)] flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Marketing Channels */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Multi-Channel Marketing Approach
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Reach buyers through multiple channels and touchpoints to maximize
              your marketing impact and build stronger relationships.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {marketingChannels.map((channel, index) => (
              <div key={index} className="card">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <channel.icon className="h-6 w-6 text-[var(--primary-accent2)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-2">
                      {channel.channel}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {channel.description}
                    </p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {channel.tactics.map((tactic, tacticIndex) => (
                    <li
                      key={tacticIndex}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)] flex-shrink-0" />
                      {tactic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Campaign Types */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Campaign Ideas That Work
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get inspired with proven campaign types that help suppliers like
              you increase visibility, drive sales, and build brand recognition.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {campaignTypes.map((campaign, index) => (
              <div key={index} className="card text-center">
                <div className="text-4xl mb-4">{campaign.icon}</div>
                <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-3">
                  {campaign.type}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {campaign.description}
                </p>
                <div className="space-y-1">
                  {campaign.examples.map((example, exampleIndex) => (
                    <div
                      key={exampleIndex}
                      className="text-xs text-[var(--primary-accent2)] font-medium"
                    >
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Success Metrics */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Proven Marketing Results
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Suppliers using our marketing tools see significant improvements
              in visibility, engagement, and sales performance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {successMetrics.map((metric, index) => (
              <div key={index} className="card text-center">
                <div className="flex justify-center mb-4">
                  <metric.icon className="h-8 w-8 text-[var(--primary-accent2)]" />
                </div>
                <div className="text-2xl font-bold text-[var(--primary-accent2)] mb-2">
                  {metric.improvement}
                </div>
                <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-3">
                  {metric.metric}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Why Marketing Matters for Suppliers
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              In today's competitive marketplace, effective marketing is the
              difference between thriving and just surviving.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="card text-center hover:shadow-lg transition-all duration-200"
              >
                <div className="flex justify-center mb-4">
                  <benefit.icon className="h-8 w-8 text-[var(--primary-accent2)]" />
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
                Ready to Market Like the Big Brands?
              </h3>
              <p className="mt-4 md:mt-5 text-base md:text-lg text-white/80 max-w-2xl">
                Don't let your great products go unnoticed. With Procur's
                marketing tools, you can build a professional brand, reach more
                buyers, and grow your business faster than ever before. Start
                your marketing journey today.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 md:gap-4">
                <a
                  href="/signup?type=supplier"
                  className="btn btn-primary px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  Start Marketing Today
                </a>
                <a
                  href="https://calendly.com/procur-marketing-demo"
                  className="btn btn-ghost text-white border-white px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  See Marketing Demo
                </a>
              </div>

              {/* Marketing Highlights */}
              <div className="mt-12 grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Easy to Use</h4>
                  <p className="text-sm text-white/80">
                    Create professional campaigns without marketing experience
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Proven Results</h4>
                  <p className="text-sm text-white/80">
                    Join suppliers seeing 3x more inquiries and higher sales
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Full Support</h4>
                  <p className="text-sm text-white/80">
                    Get help creating campaigns that drive real results
                  </p>
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
