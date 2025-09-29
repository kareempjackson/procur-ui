import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import type { Metadata } from "next";
import Image from "next/image";
import {
  HomeIcon,
  ChartBarIcon,
  ShoppingCartIcon,
  CogIcon,
  BellIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  TruckIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Buyer Portal - Procur",
  description:
    "Your comprehensive buyer dashboard on Procur. Manage orders, track spending, monitor suppliers, and optimize your procurement operations with powerful buyer tools.",
};

export default function BuyersPortalPage() {
  const portalFeatures = [
    {
      title: "Unified Dashboard",
      description:
        "Complete overview of your procurement activities and performance",
      icon: HomeIcon,
      features: [
        "Real-time spending and budget tracking",
        "Order status and delivery pipeline",
        "Supplier performance metrics",
        "Market trends and price alerts",
        "Procurement KPIs and analytics",
      ],
    },
    {
      title: "Order Management",
      description:
        "Streamlined order processing and tracking from request to delivery",
      icon: ShoppingCartIcon,
      features: [
        "Centralized order creation and tracking",
        "Automated approval workflows",
        "Delivery scheduling and coordination",
        "Quality verification and acceptance",
        "Invoice matching and payment processing",
      ],
    },
    {
      title: "Supplier Management",
      description:
        "Comprehensive supplier relationship and performance management",
      icon: UserGroupIcon,
      features: [
        "Supplier directory and profiles",
        "Performance scorecards and ratings",
        "Contract management and renewals",
        "Risk assessment and monitoring",
        "Communication and collaboration tools",
      ],
    },
    {
      title: "Procurement Analytics",
      description: "Data-driven insights to optimize your procurement strategy",
      icon: ChartBarIcon,
      features: [
        "Spending analysis and cost optimization",
        "Market price benchmarking",
        "Supplier performance analytics",
        "Demand forecasting and planning",
        "ROI and savings tracking",
      ],
    },
  ];

  const dashboardModules = [
    {
      module: "Spending Overview",
      description: "Track procurement spending and budget performance",
      icon: CurrencyDollarIcon,
      metrics: [
        "Monthly Spend",
        "Budget Utilization",
        "Cost Savings",
        "Spend by Category",
      ],
    },
    {
      module: "Order Pipeline",
      description: "Monitor orders from request to delivery",
      icon: ClockIcon,
      metrics: [
        "Active Orders",
        "Pending Approvals",
        "In Transit",
        "Delivered Today",
      ],
    },
    {
      module: "Supplier Performance",
      description: "Track supplier reliability and quality metrics",
      icon: ArrowTrendingUpIcon,
      metrics: [
        "Supplier Rating",
        "On-Time Delivery",
        "Quality Score",
        "Response Time",
      ],
    },
    {
      module: "Market Intelligence",
      description: "Stay informed about market trends and opportunities",
      icon: BellIcon,
      metrics: [
        "Price Alerts",
        "Market Trends",
        "New Suppliers",
        "Seasonal Updates",
      ],
    },
  ];

  const workflowSteps = [
    {
      step: "1",
      title: "Browse & Source",
      description:
        "Discover products and suppliers through our comprehensive marketplace",
      icon: BellIcon,
    },
    {
      step: "2",
      title: "Request & Compare",
      description:
        "Get quotes from multiple suppliers and compare pricing and terms",
      icon: DocumentTextIcon,
    },
    {
      step: "3",
      title: "Order & Track",
      description: "Place orders and monitor progress with real-time tracking",
      icon: ShoppingCartIcon,
    },
    {
      step: "4",
      title: "Receive & Pay",
      description:
        "Accept deliveries, verify quality, and process payments securely",
      icon: CheckCircleIcon,
    },
  ];

  const procurementTools = [
    {
      tool: "Smart Sourcing",
      description: "AI-powered supplier matching and recommendation engine",
      icon: UserGroupIcon,
      capabilities: [
        "Automated supplier discovery",
        "Performance-based recommendations",
        "Risk assessment integration",
        "Cost optimization suggestions",
      ],
    },
    {
      tool: "Budget Management",
      description: "Comprehensive budget planning and tracking tools",
      icon: CurrencyDollarIcon,
      capabilities: [
        "Budget allocation and monitoring",
        "Spend category management",
        "Approval workflow automation",
        "Cost center reporting",
      ],
    },
    {
      tool: "Quality Assurance",
      description: "Integrated quality management and verification systems",
      icon: CheckCircleIcon,
      capabilities: [
        "Quality standard enforcement",
        "Inspection scheduling",
        "Non-conformance tracking",
        "Supplier quality scorecards",
      ],
    },
    {
      tool: "Risk Management",
      description: "Proactive risk identification and mitigation tools",
      icon: TruckIcon,
      capabilities: [
        "Supplier risk assessment",
        "Supply chain monitoring",
        "Contingency planning",
        "Insurance and protection",
      ],
    },
  ];

  const benefits = [
    {
      title: "Streamlined Operations",
      description:
        "Centralize all procurement activities in one powerful platform",
      icon: CogIcon,
    },
    {
      title: "Cost Optimization",
      description:
        "Reduce procurement costs through better sourcing and negotiation",
      icon: CurrencyDollarIcon,
    },
    {
      title: "Supplier Excellence",
      description:
        "Work with top-performing suppliers who meet your quality standards",
      icon: UserGroupIcon,
    },
    {
      title: "Data-Driven Decisions",
      description:
        "Make informed procurement decisions based on comprehensive analytics",
      icon: ChartBarIcon,
    },
    {
      title: "Risk Mitigation",
      description:
        "Identify and mitigate supply chain risks before they impact your business",
      icon: TruckIcon,
    },
    {
      title: "Operational Efficiency",
      description:
        "Automate routine tasks and focus on strategic procurement activities",
      icon: ArrowTrendingUpIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--secondary-black)] text-balance">
            Your Complete Procurement Command Center
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            Everything you need to manage your produce procurement in one
            powerful platform. From sourcing to payment, track performance,
            optimize costs, and ensure quality with Procur's comprehensive buyer
            portal.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="/signup?type=buyer"
              className="btn btn-primary px-8 py-3 text-base"
            >
              Start Your Portal
            </a>
            <a href="#features" className="btn btn-ghost px-8 py-3 text-base">
              Explore Features
            </a>
          </div>
          <div className="mt-10">
            <div className="relative mx-auto rounded-3xl overflow-hidden shadow-xl border border-black/5 w-full max-w-6xl h-96 md:h-[520px]">
              <Image
                src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                alt="Comprehensive buyer portal dashboard and procurement tools"
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
              Successful procurement isn't about buying products — it&apos;s about
              building systems that consistently deliver quality, value, and
              reliability. Every decision you make, from supplier selection to
              payment terms, impacts your bottom line and your customers'
              satisfaction. That's why we've built the most comprehensive buyer
              portal in the industry.
            </p>
            <p className="mt-6 text-lg text-gray-700 leading-8">
              From the moment you start sourcing to the final payment
              processing, our platform gives you complete control and visibility
              over every aspect of your procurement operations. Make smarter
              decisions, build stronger supplier relationships, and optimize
              your costs with data-driven insights.
            </p>
            <blockquote className="mt-8 md:mt-10 border-l-4 border-[var(--primary-accent2)] pl-5 italic text-xl text-gray-800">
              "Great procurement isn't about finding the cheapest option — it&apos;s
              about finding the right balance of quality, cost, and
              reliability."
            </blockquote>
          </div>
        </section>

        {/* Core Features */}
        <section id="features" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our buyer portal brings together all the tools, insights, and
              capabilities you need to run and optimize your produce procurement
              operations effectively.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {portalFeatures.map((feature, index) => (
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

        {/* Dashboard Modules */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Your Dashboard at a Glance
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get instant visibility into the metrics that matter most to your
              procurement operations with our comprehensive dashboard modules.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {dashboardModules.map((module, index) => (
              <div key={index} className="card">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <module.icon className="h-6 w-6 text-[var(--primary-accent2)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-2">
                      {module.module}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {module.description}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {module.metrics.map((metric, metricIndex) => (
                    <div
                      key={metricIndex}
                      className="bg-[var(--primary-background)] rounded-lg p-3 text-center"
                    >
                      <div className="text-xs text-gray-600">{metric}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Procurement Workflow */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Streamlined Procurement Workflow
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform guides you through every step of the procurement
              process with clarity, efficiency, and complete control.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step, index) => (
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

        {/* Procurement Tools */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Advanced Procurement Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Powerful features that help you optimize your procurement
              operations and make better sourcing decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {procurementTools.map((tool, index) => (
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

        {/* Benefits */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Why Buyers Choose Our Portal
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join thousands of buyers who have transformed their procurement
              operations with our comprehensive platform and dedicated support.
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

        {/* Success Stories */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Real Results from Real Buyers
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how buyers like you are optimizing their procurement
              operations and achieving better results with Procur.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-3xl font-bold text-[var(--primary-accent2)] mb-2">
                25%
              </div>
              <div className="text-sm font-medium text-gray-800 mb-2">
                Cost Reduction
              </div>
              <div className="text-xs text-gray-600">
                Average procurement savings
              </div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-[var(--primary-accent2)] mb-2">
                60%
              </div>
              <div className="text-sm font-medium text-gray-800 mb-2">
                Time Savings
              </div>
              <div className="text-xs text-gray-600">
                Reduction in procurement cycle time
              </div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-[var(--primary-accent2)] mb-2">
                98%
              </div>
              <div className="text-sm font-medium text-gray-800 mb-2">
                Buyer Satisfaction
              </div>
              <div className="text-xs text-gray-600">
                Platform satisfaction rating
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-black to-black/90 text-white px-8 md:px-14 py-12 md:py-16">
            <div className="max-w-5xl">
              <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Ready to Transform Your Procurement?
              </h3>
              <p className="mt-4 md:mt-5 text-base md:text-lg text-white/80 max-w-2xl">
                Join thousands of buyers who have already discovered the power
                of comprehensive procurement management. Start optimizing your
                operations, reducing costs, and building stronger supplier
                relationships today.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 md:gap-4">
                <a
                  href="/signup?type=buyer"
                  className="btn btn-primary px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  Start Your Portal
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
                  href="/buyers/marketplace"
                  className="bg-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  <h4 className="font-semibold mb-1">Marketplace</h4>
                  <p className="text-sm text-white/80">Discover suppliers</p>
                </a>
                <a
                  href="/buyers/quotes"
                  className="bg-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  <h4 className="font-semibold mb-1">Request Quotes</h4>
                  <p className="text-sm text-white/80">
                    Get competitive pricing
                  </p>
                </a>
                <a
                  href="/buyers/orders"
                  className="bg-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  <h4 className="font-semibold mb-1">Track Orders</h4>
                  <p className="text-sm text-white/80">Monitor deliveries</p>
                </a>
                <a
                  href="/buyers/quality"
                  className="bg-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  <h4 className="font-semibold mb-1">Quality Assurance</h4>
                  <p className="text-sm text-white/80">Ensure standards</p>
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
