import TopNavigation from "@/components/navigation/TopNavigation";
import type { Metadata } from "next";
import Image from "next/image";
import {
  DocumentTextIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  TruckIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Request Quotes - Procur",
  description:
    "Get competitive quotes from verified suppliers instantly. Compare prices, negotiate terms, and secure the best deals for your produce sourcing needs with Procur's quote system.",
};

export default function BuyersQuotesPage() {
  const quoteFeatures = [
    {
      title: "Instant Quote Requests",
      description: "Get quotes from multiple suppliers with a single request",
      icon: DocumentTextIcon,
      features: [
        "One-click quote requests to multiple suppliers",
        "Detailed specification templates",
        "Bulk quote requests for multiple products",
        "Automated supplier matching",
        "Real-time quote status tracking",
      ],
    },
    {
      title: "Competitive Comparison",
      description: "Compare quotes side-by-side to make informed decisions",
      icon: ChartBarIcon,
      features: [
        "Side-by-side quote comparison",
        "Price breakdown analysis",
        "Total cost calculations",
        "Supplier performance metrics",
        "Quality and certification comparison",
      ],
    },
    {
      title: "Smart Negotiation",
      description: "Negotiate terms and pricing directly through the platform",
      icon: ChatBubbleLeftRightIcon,
      features: [
        "Direct messaging with suppliers",
        "Counter-offer management",
        "Terms and conditions negotiation",
        "Volume discount discussions",
        "Contract term negotiations",
      ],
    },
    {
      title: "Quote Management",
      description: "Organize and track all your quotes in one central location",
      icon: ArrowPathIcon,
      features: [
        "Centralized quote dashboard",
        "Quote history and archives",
        "Expiration date tracking",
        "Automated follow-up reminders",
        "Quote-to-order conversion",
      ],
    },
  ];

  const quoteProcess = [
    {
      step: "1",
      title: "Create Request",
      description:
        "Specify your requirements including product, quantity, quality standards, and delivery needs",
      icon: DocumentTextIcon,
      timeframe: "2 minutes",
    },
    {
      step: "2",
      title: "Supplier Matching",
      description:
        "Our system automatically identifies and notifies qualified suppliers",
      icon: UserGroupIcon,
      timeframe: "Instant",
    },
    {
      step: "3",
      title: "Receive Quotes",
      description:
        "Get competitive quotes from multiple suppliers within hours",
      icon: CurrencyDollarIcon,
      timeframe: "2-24 hours",
    },
    {
      step: "4",
      title: "Compare & Negotiate",
      description:
        "Compare offers, negotiate terms, and select the best option",
      icon: ChartBarIcon,
      timeframe: "1-3 days",
    },
  ];

  const quoteTypes = [
    {
      type: "Spot Quotes",
      description: "Immediate pricing for current market conditions",
      icon: ClockIcon,
      features: [
        "Real-time market pricing",
        "Quick turnaround times",
        "Immediate availability",
        "Flexible quantities",
      ],
    },
    {
      type: "Contract Quotes",
      description: "Long-term pricing agreements for regular supply",
      icon: DocumentTextIcon,
      features: [
        "Fixed pricing periods",
        "Volume commitments",
        "Delivery schedules",
        "Quality guarantees",
      ],
    },
    {
      type: "Seasonal Quotes",
      description: "Forward pricing for seasonal produce availability",
      icon: CalendarIcon,
      features: [
        "Advance booking options",
        "Seasonal price locks",
        "Harvest scheduling",
        "Quality specifications",
      ],
    },
    {
      type: "Custom Quotes",
      description: "Specialized pricing for unique requirements",
      icon: CheckCircleIcon,
      features: [
        "Custom specifications",
        "Special packaging",
        "Unique delivery terms",
        "Tailored quality standards",
      ],
    },
  ];

  const negotiationTools = [
    {
      tool: "Price Comparison",
      description: "Compare pricing across multiple suppliers instantly",
      icon: ChartBarIcon,
      benefits: [
        "Side-by-side price analysis",
        "Total cost breakdowns",
        "Hidden cost identification",
        "Value proposition comparison",
      ],
    },
    {
      tool: "Counter-Offer System",
      description: "Negotiate better terms with structured counter-offers",
      icon: ArrowPathIcon,
      benefits: [
        "Structured negotiation process",
        "Terms modification tracking",
        "Automated counter-offer alerts",
        "Negotiation history logs",
      ],
    },
    {
      tool: "Supplier Communication",
      description: "Direct messaging for clarifications and negotiations",
      icon: ChatBubbleLeftRightIcon,
      benefits: [
        "Real-time messaging",
        "File and document sharing",
        "Quote clarification requests",
        "Terms discussion threads",
      ],
    },
    {
      tool: "Performance Analytics",
      description: "Evaluate suppliers based on historical performance",
      icon: UserGroupIcon,
      benefits: [
        "Supplier reliability scores",
        "Quality performance history",
        "Delivery track records",
        "Customer satisfaction ratings",
      ],
    },
  ];

  const benefits = [
    {
      title: "Competitive Pricing",
      description:
        "Get the best prices through competitive bidding and comparison",
      metric: "15% average savings",
      icon: CurrencyDollarIcon,
    },
    {
      title: "Time Efficiency",
      description:
        "Reduce sourcing time with automated quote requests and management",
      metric: "80% faster sourcing",
      icon: ClockIcon,
    },
    {
      title: "Better Suppliers",
      description: "Access to verified suppliers with proven track records",
      metric: "95% supplier satisfaction",
      icon: UserGroupIcon,
    },
    {
      title: "Transparent Process",
      description:
        "Full visibility into pricing, terms, and supplier capabilities",
      metric: "100% transparency",
      icon: ShieldCheckIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--secondary-black)] text-balance">
            Get Competitive Quotes in Minutes
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            Transform your sourcing process with instant quote requests to
            multiple verified suppliers. Compare prices, negotiate terms, and
            secure the best deals for your business with our intelligent quote
            management system.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="/signup?type=buyer"
              className="btn btn-primary px-8 py-3 text-base"
            >
              Start Requesting Quotes
            </a>
            <a href="#features" className="btn btn-ghost px-8 py-3 text-base">
              See How It Works
            </a>
          </div>
          <div className="mt-10">
            <div className="relative mx-auto rounded-3xl overflow-hidden shadow-xl border border-black/5 w-full max-w-6xl h-96 md:h-[520px]">
              <Image
                src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                alt="Quote request and comparison interface"
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
              Time is money in the produce business, and traditional sourcing
              methods waste both. Calling suppliers one by one, waiting for
              responses, manually comparing quotes — it&apos;s inefficient and
              often leaves money on the table. Our quote system changes
              everything.
            </p>
            <p className="mt-6 text-lg text-gray-700 leading-8">
              With a single request, you can reach dozens of qualified
              suppliers, receive competitive quotes within hours, and make
              informed decisions based on comprehensive comparisons. It's
              sourcing at the speed of modern business.
            </p>
            <blockquote className="mt-8 md:mt-10 border-l-4 border-[var(--primary-accent2)] pl-5 italic text-xl text-gray-800">
              "The best deal isn't always the lowest price — it&apos;s the right
              combination of price, quality, and reliability."
            </blockquote>
          </div>
        </section>

        {/* Core Features */}
        <section id="features" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Intelligent Quote Management
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our quote system combines automation with intelligence to help you
              source better, faster, and more cost-effectively than ever before.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {quoteFeatures.map((feature, index) => (
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

        {/* Quote Process */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Simple Quote Process
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From request to decision, our streamlined process helps you get
              the quotes you need quickly and efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quoteProcess.map((step, index) => (
              <div key={index} className="card text-center">
                <div className="w-12 h-12 bg-[var(--primary-accent2)] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <div className="flex justify-center mb-4">
                  <step.icon className="h-6 w-6 text-[var(--primary-accent2)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  {step.description}
                </p>
                <div className="text-xs font-medium text-[var(--primary-accent2)]">
                  {step.timeframe}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quote Types */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Flexible Quote Options
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Whether you need immediate pricing or long-term contracts, our
              platform supports all types of quote requests to meet your
              business needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {quoteTypes.map((type, index) => (
              <div key={index} className="card">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <type.icon className="h-6 w-6 text-[var(--primary-accent2)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-2">
                      {type.type}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {type.description}
                    </p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {type.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)] flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Negotiation Tools */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Advanced Negotiation Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Go beyond basic quotes with powerful tools that help you negotiate
              better terms and make more informed sourcing decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {negotiationTools.map((tool, index) => (
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

        {/* Benefits & Results */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Proven Results for Buyers
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Buyers using our quote system consistently achieve better
              outcomes, faster sourcing, and significant cost savings.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="card text-center">
                <div className="flex justify-center mb-4">
                  <benefit.icon className="h-8 w-8 text-[var(--primary-accent2)]" />
                </div>
                <div className="text-2xl font-bold text-[var(--primary-accent2)] mb-2">
                  {benefit.metric}
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
                Ready to Source Smarter?
              </h3>
              <p className="mt-4 md:mt-5 text-base md:text-lg text-white/80 max-w-2xl">
                Stop wasting time on manual sourcing processes. Join thousands
                of buyers who have transformed their procurement with our
                intelligent quote system. Get competitive quotes, negotiate
                better terms, and secure the best deals for your business.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 md:gap-4">
                <a
                  href="/signup?type=buyer"
                  className="btn btn-primary px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  Start Getting Quotes
                </a>
                <a
                  href="https://calendly.com/procur-quotes-demo"
                  className="btn btn-ghost text-white border-white px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  See Demo
                </a>
              </div>

              {/* Feature Highlights */}
              <div className="mt-12 grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Instant Requests</h4>
                  <p className="text-sm text-white/80">
                    Send quote requests to multiple suppliers in seconds
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Smart Comparison</h4>
                  <p className="text-sm text-white/80">
                    Compare quotes side-by-side with detailed analysis
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Better Deals</h4>
                  <p className="text-sm text-white/80">
                    Negotiate terms and secure competitive pricing
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
