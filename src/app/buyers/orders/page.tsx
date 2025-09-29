import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import type { Metadata } from "next";
import Image from "next/image";
import {
  ClipboardDocumentListIcon,
  TruckIcon,
  EyeIcon,
  BellIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Order Management - Procur",
  description:
    "Track and manage your produce orders with complete visibility. Monitor deliveries, communicate with suppliers, and ensure on-time fulfillment with Procur's order management system.",
};

export default function BuyersOrdersPage() {
  const orderFeatures = [
    {
      title: "Complete Order Tracking",
      description:
        "Full visibility into every order from placement to delivery",
      icon: EyeIcon,
      features: [
        "Real-time order status updates",
        "Delivery tracking and notifications",
        "Supplier communication logs",
        "Quality inspection reports",
        "Payment and invoice tracking",
      ],
    },
    {
      title: "Smart Notifications",
      description: "Stay informed with intelligent alerts and updates",
      icon: BellIcon,
      features: [
        "Order confirmation alerts",
        "Shipping and delivery notifications",
        "Quality issue warnings",
        "Payment status updates",
        "Customizable notification preferences",
      ],
    },
    {
      title: "Supplier Communication",
      description: "Direct communication channel with your suppliers",
      icon: ChatBubbleLeftRightIcon,
      features: [
        "Real-time messaging with suppliers",
        "Order modification requests",
        "Delivery instruction updates",
        "Quality concern reporting",
        "File and document sharing",
      ],
    },
    {
      title: "Order Analytics",
      description:
        "Insights to optimize your ordering and procurement processes",
      icon: DocumentTextIcon,
      features: [
        "Order performance analytics",
        "Supplier reliability metrics",
        "Cost analysis and trends",
        "Delivery performance tracking",
        "Quality score monitoring",
      ],
    },
  ];

  const orderStages = [
    {
      stage: "Order Placed",
      description: "Order confirmed and sent to supplier",
      icon: ClipboardDocumentListIcon,
      actions: ["View Order Details", "Contact Supplier", "Modify Order"],
      color: "blue",
    },
    {
      stage: "Processing",
      description: "Supplier preparing your order",
      icon: ClockIcon,
      actions: ["Track Progress", "Update Instructions", "Communicate"],
      color: "yellow",
    },
    {
      stage: "In Transit",
      description: "Order shipped and on the way",
      icon: TruckIcon,
      actions: ["Track Shipment", "Monitor Temperature", "Prepare Receipt"],
      color: "purple",
    },
    {
      stage: "Delivered",
      description: "Order received and completed",
      icon: CheckCircleIcon,
      actions: ["Confirm Receipt", "Rate Quality", "Process Payment"],
      color: "green",
    },
  ];

  const trackingFeatures = [
    {
      feature: "Real-Time Location",
      description: "GPS tracking for shipments in transit",
      icon: MapPinIcon,
      capabilities: [
        "Live GPS tracking",
        "Estimated delivery times",
        "Route optimization",
        "Delivery window updates",
      ],
    },
    {
      feature: "Temperature Monitoring",
      description: "Cold chain monitoring for quality assurance",
      icon: ExclamationTriangleIcon,
      capabilities: [
        "Continuous temperature logging",
        "Alert notifications for deviations",
        "Quality preservation tracking",
        "Compliance documentation",
      ],
    },
    {
      feature: "Delivery Confirmation",
      description: "Proof of delivery and quality verification",
      icon: CheckCircleIcon,
      capabilities: [
        "Photo confirmation of delivery",
        "Quality inspection reports",
        "Recipient signature capture",
        "Damage or issue reporting",
      ],
    },
    {
      feature: "Issue Resolution",
      description: "Quick resolution of delivery and quality issues",
      icon: ArrowPathIcon,
      capabilities: [
        "Automated issue reporting",
        "Supplier notification system",
        "Resolution tracking",
        "Refund and replacement processing",
      ],
    },
  ];

  const orderTypes = [
    {
      type: "Standard Orders",
      description: "Regular orders for immediate fulfillment",
      icon: ClipboardDocumentListIcon,
      features: [
        "Immediate processing",
        "Standard delivery times",
        "Flexible quantities",
        "Market pricing",
      ],
    },
    {
      type: "Scheduled Orders",
      description: "Recurring orders for regular supply needs",
      icon: ClockIcon,
      features: [
        "Automated scheduling",
        "Recurring delivery dates",
        "Quantity adjustments",
        "Contract pricing",
      ],
    },
    {
      type: "Emergency Orders",
      description: "Rush orders for urgent requirements",
      icon: ExclamationTriangleIcon,
      features: [
        "Priority processing",
        "Expedited shipping",
        "24/7 support",
        "Premium pricing",
      ],
    },
    {
      type: "Contract Orders",
      description: "Orders under long-term supply agreements",
      icon: DocumentTextIcon,
      features: [
        "Pre-negotiated terms",
        "Fixed pricing",
        "Guaranteed supply",
        "Quality specifications",
      ],
    },
  ];

  const benefits = [
    {
      title: "Complete Visibility",
      description:
        "Know exactly where your orders are at every stage of fulfillment",
      metric: "100% transparency",
      icon: EyeIcon,
    },
    {
      title: "On-Time Delivery",
      description: "Reliable delivery performance with real-time tracking",
      metric: "98% on-time rate",
      icon: TruckIcon,
    },
    {
      title: "Quality Assurance",
      description:
        "Continuous monitoring ensures product quality throughout delivery",
      metric: "95% quality score",
      icon: CheckCircleIcon,
    },
    {
      title: "Issue Resolution",
      description: "Quick resolution of any delivery or quality issues",
      metric: "2hr response time",
      icon: ArrowPathIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--secondary-black)] text-balance">
            Track Every Order with Confidence
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            Never wonder about your orders again. Get complete visibility into
            every stage of fulfillment, from placement to delivery, with
            real-time tracking, quality monitoring, and direct supplier
            communication.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="/signup?type=buyer"
              className="btn btn-primary px-8 py-3 text-base"
            >
              Start Tracking Orders
            </a>
            <a href="#features" className="btn btn-ghost px-8 py-3 text-base">
              See Tracking Features
            </a>
          </div>
          <div className="mt-10">
            <div className="relative mx-auto rounded-3xl overflow-hidden shadow-xl border border-black/5 w-full max-w-6xl h-96 md:h-[520px]">
              <Image
                src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                alt="Order tracking and management dashboard"
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
              In the produce business, uncertainty kills profitability. When you
              don&apos;t know where your orders are, when they'll arrive, or what
              condition they'll be in, you can&apos;t plan effectively, serve
              customers reliably, or manage inventory efficiently. That's why
              we've built the most comprehensive order tracking system in the
              industry.
            </p>
            <p className="mt-6 text-lg text-gray-700 leading-8">
              From the moment you place an order to the second it arrives at
              your door, you'll have complete visibility into every aspect of
              the fulfillment process. Real-time updates, quality monitoring,
              and direct communication with suppliers ensure you&apos;re never left
              wondering about your critical orders.
            </p>
            <blockquote className="mt-8 md:mt-10 border-l-4 border-[var(--primary-accent2)] pl-5 italic text-xl text-gray-800">
              "Visibility isn't just about knowing where your order is — it&apos;s
              about having the confidence to run your business better."
            </blockquote>
          </div>
        </section>

        {/* Core Features */}
        <section id="features" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Complete Order Management
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our order management system gives you unprecedented visibility and
              control over every aspect of your produce orders.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {orderFeatures.map((feature, index) => (
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

        {/* Order Stages */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Order Lifecycle Tracking
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Follow your orders through every stage of fulfillment with clear
              status updates and actionable insights at each step.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {orderStages.map((stage, index) => (
              <div key={index} className="card text-center">
                <div className="flex justify-center mb-4">
                  <stage.icon className="h-8 w-8 text-[var(--primary-accent2)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-3">
                  {stage.stage}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {stage.description}
                </p>
                <div className="space-y-1">
                  {stage.actions.map((action, actionIndex) => (
                    <div
                      key={actionIndex}
                      className="text-xs text-[var(--primary-accent2)] font-medium"
                    >
                      {action}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tracking Features */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Advanced Tracking Capabilities
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Go beyond basic tracking with advanced features that ensure
              quality, compliance, and successful delivery of your orders.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {trackingFeatures.map((feature, index) => (
              <div key={index} className="card">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-[var(--primary-accent2)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-2">
                      {feature.feature}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {feature.capabilities.map((capability, capIndex) => (
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

        {/* Order Types */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Flexible Order Management
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Whether you need standard orders, scheduled deliveries, or
              emergency fulfillment, our system adapts to your business needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {orderTypes.map((type, index) => (
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

        {/* Benefits & Results */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Proven Order Management Results
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Buyers using our order management system experience better
              visibility, reliability, and overall satisfaction with their
              procurement process.
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
                Ready for Complete Order Visibility?
              </h3>
              <p className="mt-4 md:mt-5 text-base md:text-lg text-white/80 max-w-2xl">
                Stop wondering about your orders and start knowing. With
                complete visibility, real-time tracking, and quality monitoring,
                you'll have the confidence to run your business better and serve
                your customers more reliably.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 md:gap-4">
                <a
                  href="/signup?type=buyer"
                  className="btn btn-primary px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  Start Tracking Orders
                </a>
                <a
                  href="https://calendly.com/procur-orders-demo"
                  className="btn btn-ghost text-white border-white px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  See Demo
                </a>
              </div>

              {/* Feature Highlights */}
              <div className="mt-12 grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Real-Time Tracking</h4>
                  <p className="text-sm text-white/80">
                    Know exactly where your orders are at all times
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Quality Monitoring</h4>
                  <p className="text-sm text-white/80">
                    Ensure product quality throughout the delivery process
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Direct Communication</h4>
                  <p className="text-sm text-white/80">
                    Stay connected with suppliers throughout fulfillment
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
