import TopNavigation from "@/components/navigation/TopNavigation";
import type { Metadata } from "next";
import Image from "next/image";
import {
  HomeIcon,
  ChartBarIcon,
  ShoppingBagIcon,
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
  title: "Supplier Portal - Procur",
  description:
    "Your comprehensive supplier dashboard on Procur. Manage orders, track performance, update inventory, and grow your business with powerful supplier tools.",
};

export default function SupplierPortalPage() {
  const portalFeatures = [
    {
      title: "Unified Dashboard",
      description:
        "Complete overview of your business performance and activities",
      icon: HomeIcon,
      features: [
        "Real-time sales and revenue tracking",
        "Order status and fulfillment pipeline",
        "Performance metrics and KPIs",
        "Upcoming deliveries and deadlines",
        "Customer feedback and ratings",
      ],
    },
    {
      title: "Order Management",
      description: "Streamlined order processing from inquiry to delivery",
      icon: ShoppingBagIcon,
      features: [
        "Centralized order inbox and processing",
        "Automated quote generation and pricing",
        "Inventory allocation and availability",
        "Shipping and logistics coordination",
        "Payment tracking and invoicing",
      ],
    },
    {
      title: "Business Analytics",
      description: "Data-driven insights to optimize your operations",
      icon: ChartBarIcon,
      features: [
        "Sales performance and trend analysis",
        "Customer behavior and preferences",
        "Product performance metrics",
        "Seasonal demand forecasting",
        "Competitive market insights",
      ],
    },
    {
      title: "Account Management",
      description: "Complete control over your supplier profile and settings",
      icon: CogIcon,
      features: [
        "Business profile and certification management",
        "Product catalog and pricing updates",
        "Payment and banking information",
        "Notification and communication preferences",
        "Team member access and permissions",
      ],
    },
  ];

  const dashboardModules = [
    {
      module: "Sales Overview",
      description: "Track revenue, orders, and growth metrics",
      icon: CurrencyDollarIcon,
      metrics: [
        "Monthly Revenue",
        "Order Volume",
        "Average Order Value",
        "Growth Rate",
      ],
    },
    {
      module: "Order Pipeline",
      description: "Monitor orders from quote to delivery",
      icon: ClockIcon,
      metrics: [
        "Pending Quotes",
        "Active Orders",
        "Ready to Ship",
        "Delivered",
      ],
    },
    {
      module: "Performance Metrics",
      description: "Key performance indicators and ratings",
      icon: ArrowTrendingUpIcon,
      metrics: [
        "Customer Rating",
        "On-Time Delivery",
        "Quality Score",
        "Response Time",
      ],
    },
    {
      module: "Notifications",
      description: "Important updates and action items",
      icon: BellIcon,
      metrics: ["New Orders", "Payment Updates", "System Alerts", "Messages"],
    },
  ];

  const workflowSteps = [
    {
      step: "1",
      title: "Receive Orders",
      description:
        "Get notified instantly when buyers place orders or request quotes",
      icon: BellIcon,
    },
    {
      step: "2",
      title: "Process & Confirm",
      description:
        "Review order details, check inventory, and confirm availability",
      icon: CheckCircleIcon,
    },
    {
      step: "3",
      title: "Fulfill & Ship",
      description: "Prepare orders, coordinate logistics, and track shipments",
      icon: TruckIcon,
    },
    {
      step: "4",
      title: "Get Paid",
      description:
        "Receive payments automatically and track financial performance",
      icon: CurrencyDollarIcon,
    },
  ];

  const benefits = [
    {
      title: "Streamlined Operations",
      description:
        "Centralize all supplier activities in one powerful platform",
      icon: CogIcon,
    },
    {
      title: "Increased Visibility",
      description: "Reach more buyers and expand your market presence",
      icon: UserGroupIcon,
    },
    {
      title: "Better Analytics",
      description: "Make data-driven decisions with comprehensive insights",
      icon: ChartBarIcon,
    },
    {
      title: "Faster Payments",
      description: "Secure, automated payment processing and tracking",
      icon: CurrencyDollarIcon,
    },
    {
      title: "Quality Assurance",
      description: "Maintain high standards with built-in quality controls",
      icon: CheckCircleIcon,
    },
    {
      title: "Professional Growth",
      description: "Scale your business with enterprise-grade tools",
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
            Your Complete Supplier Command Center
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            Everything you need to manage your produce business in one powerful
            platform. From order processing to performance analytics, Procur's
            supplier portal puts you in complete control.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="/signup?type=supplier"
              className="btn btn-primary px-8 py-3 text-base"
            >
              Start Your Account
            </a>
            <a href="#features" className="btn btn-ghost px-8 py-3 text-base">
              Explore Features
            </a>
          </div>
          <div className="mt-10">
            <div className="relative mx-auto rounded-3xl overflow-hidden shadow-xl border border-black/5 w-full max-w-6xl h-96 md:h-[520px]">
              <Image
                src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                alt="Supplier portal dashboard and management tools"
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
              Running a successful produce business requires more than just
              great products. You need systems that work as hard as you do,
              insights that drive smart decisions, and tools that help you scale
              efficiently. That's exactly what Procur's supplier portal
              delivers.
            </p>
            <p className="mt-6 text-lg text-gray-700 leading-8">
              From the moment you wake up to check overnight orders to the
              satisfaction of seeing your monthly growth metrics, our platform
              is designed to make every aspect of your business run smoother,
              smarter, and more profitably.
            </p>
            <blockquote className="mt-8 md:mt-10 border-l-4 border-[var(--primary-accent2)] pl-5 italic text-xl text-gray-800">
              "Great suppliers don&apos;t just grow produce — they grow
              businesses. Procur gives you the tools to do both."
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
              Our supplier portal brings together all the tools, insights, and
              capabilities you need to run and grow your produce business
              effectively.
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
              business. Our dashboard modules give you real-time insights and
              actionable data.
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

        {/* Workflow Process */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Streamlined Order Workflow
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From order receipt to payment, our platform guides you through
              every step of the fulfillment process with clarity and efficiency.
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

        {/* Benefits */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Why Suppliers Choose Procur
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join thousands of suppliers who have transformed their businesses
              with our comprehensive platform and dedicated support.
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
              Real Results from Real Suppliers
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how suppliers like you are growing their businesses and
              improving their operations with Procur.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-3xl font-bold text-[var(--primary-accent2)] mb-2">
                150%
              </div>
              <div className="text-sm font-medium text-gray-800 mb-2">
                Revenue Growth
              </div>
              <div className="text-xs text-gray-600">
                Average increase in first year
              </div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-[var(--primary-accent2)] mb-2">
                40hrs
              </div>
              <div className="text-sm font-medium text-gray-800 mb-2">
                Time Saved
              </div>
              <div className="text-xs text-gray-600">
                Per week on administrative tasks
              </div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-[var(--primary-accent2)] mb-2">
                95%
              </div>
              <div className="text-sm font-medium text-gray-800 mb-2">
                Customer Satisfaction
              </div>
              <div className="text-xs text-gray-600">
                Average supplier rating
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-black to-black/90 text-white px-8 md:px-14 py-12 md:py-16">
            <div className="max-w-5xl">
              <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Ready to Transform Your Supplier Business?
              </h3>
              <p className="mt-4 md:mt-5 text-base md:text-lg text-white/80 max-w-2xl">
                Join the thousands of suppliers who have already discovered the
                power of Procur's platform. Start your free account today and
                see the difference professional tools can make.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 md:gap-4">
                <a
                  href="/signup?type=supplier"
                  className="btn btn-primary px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  Start Free Account
                </a>
                <a
                  href="https://calendly.com/procur-supplier-demo"
                  className="btn btn-ghost text-white border-white px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  Schedule Demo
                </a>
              </div>

              {/* Quick Access Links */}
              <div className="mt-12 grid md:grid-cols-4 gap-4">
                <a
                  href="/suppliers/catalog"
                  className="bg-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  <h4 className="font-semibold mb-1">Product Catalog</h4>
                  <p className="text-sm text-white/80">Manage your inventory</p>
                </a>
                <a
                  href="/suppliers/orders"
                  className="bg-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  <h4 className="font-semibold mb-1">Order Management</h4>
                  <p className="text-sm text-white/80">
                    Process orders efficiently
                  </p>
                </a>
                <a
                  href="/suppliers/analytics"
                  className="bg-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  <h4 className="font-semibold mb-1">Business Analytics</h4>
                  <p className="text-sm text-white/80">
                    Track your performance
                  </p>
                </a>
                <a
                  href="/suppliers/marketing"
                  className="bg-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  <h4 className="font-semibold mb-1">Marketing Tools</h4>
                  <p className="text-sm text-white/80">Promote your products</p>
                </a>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
          </div>
        </section>
      </main>
    </div>
  );
}
