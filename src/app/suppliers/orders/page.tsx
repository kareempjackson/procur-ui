import TopNavigation from "@/components/navigation/TopNavigation";
import type { Metadata } from "next";
import Image from "next/image";
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  BellIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Order Management - Procur",
  description:
    "Streamline your order fulfillment process with Procur's comprehensive order management system. Track orders, manage logistics, and ensure on-time delivery.",
};

export default function SupplierOrdersPage() {
  const orderFeatures = [
    {
      title: "Order Processing",
      description: "Efficient workflow from order receipt to confirmation",
      icon: ClipboardDocumentListIcon,
      features: [
        "Centralized order inbox and notifications",
        "Quick order review and approval",
        "Automated inventory allocation",
        "Bulk order processing capabilities",
        "Custom order status tracking",
      ],
    },
    {
      title: "Logistics Coordination",
      description: "Seamless shipping and delivery management",
      icon: TruckIcon,
      features: [
        "Integrated shipping partner network",
        "Real-time delivery tracking",
        "Cold chain monitoring and alerts",
        "Flexible delivery scheduling",
        "Proof of delivery documentation",
      ],
    },
    {
      title: "Communication Hub",
      description: "Stay connected with buyers throughout the process",
      icon: ChatBubbleLeftRightIcon,
      features: [
        "Direct messaging with buyers",
        "Automated status notifications",
        "Order change request handling",
        "Issue resolution and support",
        "Delivery confirmation alerts",
      ],
    },
    {
      title: "Financial Tracking",
      description: "Complete visibility into payments and invoicing",
      icon: CurrencyDollarIcon,
      features: [
        "Automated invoice generation",
        "Payment status tracking",
        "Revenue reporting and analytics",
        "Dispute resolution support",
        "Financial performance metrics",
      ],
    },
  ];

  const orderStages = [
    {
      stage: "New Orders",
      description: "Recently received orders awaiting review",
      icon: BellIcon,
      actions: ["Review Details", "Check Inventory", "Confirm or Decline"],
    },
    {
      stage: "Processing",
      description: "Confirmed orders being prepared for shipment",
      icon: ClockIcon,
      actions: ["Prepare Products", "Schedule Pickup", "Update Status"],
    },
    {
      stage: "In Transit",
      description: "Orders shipped and en route to buyers",
      icon: TruckIcon,
      actions: ["Track Shipment", "Monitor Temperature", "Communicate Updates"],
    },
    {
      stage: "Delivered",
      description: "Successfully completed orders",
      icon: CheckCircleIcon,
      actions: ["Confirm Delivery", "Process Payment", "Collect Feedback"],
    },
  ];

  const managementTools = [
    {
      tool: "Smart Notifications",
      description: "Stay informed with intelligent alerts and updates",
      icon: BellIcon,
      capabilities: [
        "New order instant notifications",
        "Delivery deadline reminders",
        "Payment status updates",
        "Quality issue alerts",
      ],
    },
    {
      tool: "Batch Processing",
      description: "Handle multiple orders efficiently",
      icon: ArrowPathIcon,
      capabilities: [
        "Bulk order confirmation",
        "Mass status updates",
        "Group shipping coordination",
        "Batch invoice generation",
      ],
    },
    {
      tool: "Exception Management",
      description: "Handle issues and special cases smoothly",
      icon: ExclamationTriangleIcon,
      capabilities: [
        "Quality issue reporting",
        "Delivery delay notifications",
        "Order modification requests",
        "Dispute resolution workflow",
      ],
    },
    {
      tool: "Performance Analytics",
      description: "Track and improve your fulfillment metrics",
      icon: DocumentTextIcon,
      capabilities: [
        "On-time delivery rates",
        "Order fulfillment speed",
        "Customer satisfaction scores",
        "Revenue per order trends",
      ],
    },
  ];

  const fulfillmentProcess = [
    {
      step: "1",
      title: "Order Receipt",
      description: "Receive instant notifications when buyers place orders",
      icon: BellIcon,
      timeframe: "Immediate",
    },
    {
      step: "2",
      title: "Review & Confirm",
      description:
        "Review order details, check inventory, and confirm availability",
      icon: ClipboardDocumentListIcon,
      timeframe: "Within 2 hours",
    },
    {
      step: "3",
      title: "Prepare & Package",
      description:
        "Harvest, prepare, and package products according to specifications",
      icon: CheckCircleIcon,
      timeframe: "1-2 days",
    },
    {
      step: "4",
      title: "Ship & Track",
      description:
        "Coordinate shipping and provide real-time tracking information",
      icon: TruckIcon,
      timeframe: "2-5 days",
    },
  ];

  const benefits = [
    {
      title: "Faster Processing",
      description: "Reduce order processing time with automated workflows",
      metric: "60% faster",
      icon: ClockIcon,
    },
    {
      title: "Better Communication",
      description: "Keep buyers informed with automatic status updates",
      metric: "95% satisfaction",
      icon: ChatBubbleLeftRightIcon,
    },
    {
      title: "On-Time Delivery",
      description: "Improve delivery performance with better coordination",
      metric: "98% on-time",
      icon: TruckIcon,
    },
    {
      title: "Higher Revenue",
      description: "Process more orders and increase your earning potential",
      metric: "40% increase",
      icon: CurrencyDollarIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--secondary-black)] text-balance">
            Master Your Order Fulfillment
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            Transform chaos into clarity with Procur's comprehensive order
            management system. From the moment an order arrives to final
            delivery, we help you deliver excellence every time.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="/signup?type=supplier"
              className="btn btn-primary px-8 py-3 text-base"
            >
              Streamline Your Orders
            </a>
            <a href="#features" className="btn btn-ghost px-8 py-3 text-base">
              See How It Works
            </a>
          </div>
          <div className="mt-10">
            <div className="relative mx-auto rounded-3xl overflow-hidden shadow-xl border border-black/5 w-full max-w-6xl h-96 md:h-[520px]">
              <Image
                src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                alt="Order management dashboard and fulfillment workflow"
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
              Every order is a promise. A promise of quality, freshness, and
              reliability that your buyers depend on. In the fast-paced world of
              produce, fulfilling that promise requires more than good
              intentions — it requires systems that work flawlessly under
              pressure.
            </p>
            <p className="mt-6 text-lg text-gray-700 leading-8">
              Our order management platform is built by people who understand
              the unique challenges of produce fulfillment. From managing
              perishable inventory to coordinating cold chain logistics, every
              feature is designed to help you deliver on your promises,
              profitably and consistently.
            </p>
            <blockquote className="mt-8 md:mt-10 border-l-4 border-[var(--primary-accent2)] pl-5 italic text-xl text-gray-800">
              "Great suppliers don&apos;t just fulfill orders — they exceed
              expectations. Our platform helps you do both."
            </blockquote>
          </div>
        </section>

        {/* Core Features */}
        <section id="features" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Complete Order Management Solution
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to process orders efficiently, communicate
              effectively, and deliver consistently.
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
              Order Lifecycle Management
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Track and manage orders through every stage of the fulfillment
              process with clear visibility and control.
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

        {/* Management Tools */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Advanced Management Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Powerful features that help you handle orders more efficiently and
              provide better service to your buyers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {managementTools.map((tool, index) => (
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

        {/* Fulfillment Process */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Streamlined Fulfillment Process
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our proven workflow helps you deliver orders on time, every time,
              with clear timelines and expectations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fulfillmentProcess.map((step, index) => (
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

        {/* Benefits & Results */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Proven Results for Suppliers
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Suppliers using our order management system see significant
              improvements in efficiency, customer satisfaction, and revenue.
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
                Ready to Transform Your Order Management?
              </h3>
              <p className="mt-4 md:mt-5 text-base md:text-lg text-white/80 max-w-2xl">
                Join thousands of suppliers who have streamlined their order
                fulfillment and improved customer satisfaction with Procur's
                order management system. Start processing orders more
                efficiently today.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 md:gap-4">
                <a
                  href="/signup?type=supplier"
                  className="btn btn-primary px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  Start Managing Orders
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
                  <h4 className="font-semibold mb-2">Instant Setup</h4>
                  <p className="text-sm text-white/80">
                    Start processing orders immediately with our intuitive
                    interface
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Mobile Ready</h4>
                  <p className="text-sm text-white/80">
                    Manage orders on the go with our mobile-optimized platform
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">24/7 Support</h4>
                  <p className="text-sm text-white/80">
                    Get help when you need it with our dedicated support team
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
