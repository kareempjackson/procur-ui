import TopNavigation from "@/components/navigation/TopNavigation";
import type { Metadata } from "next";
import Image from "next/image";
import {
  TruckIcon,
  MapPinIcon,
  ClockIcon,
  FireIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  DocumentTextIcon,
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Logistics & Shipping - Procur",
  description:
    "Reliable logistics solutions for fresh produce delivery. From cold chain management to global shipping, ensure your products arrive fresh and on time with Procur's logistics network.",
};

export default function BuyersLogisticsPage() {
  const logisticsFeatures = [
    {
      title: "Cold Chain Management",
      description:
        "Temperature-controlled logistics to preserve product freshness",
      icon: FireIcon,
      features: [
        "Continuous temperature monitoring",
        "Refrigerated transportation fleet",
        "Cold storage facilities network",
        "Temperature deviation alerts",
        "Quality preservation protocols",
      ],
    },
    {
      title: "Global Shipping Network",
      description: "Worldwide delivery capabilities with local expertise",
      icon: GlobeAltIcon,
      features: [
        "International shipping partnerships",
        "Customs clearance support",
        "Multi-modal transportation options",
        "Regional distribution centers",
        "Local delivery networks",
      ],
    },
    {
      title: "Real-Time Tracking",
      description: "Complete visibility into shipment location and status",
      icon: MapPinIcon,
      features: [
        "GPS tracking for all shipments",
        "Live location updates",
        "Estimated delivery times",
        "Route optimization",
        "Delivery confirmation alerts",
      ],
    },
    {
      title: "Flexible Delivery Options",
      description:
        "Customizable delivery solutions to meet your specific needs",
      icon: CalendarIcon,
      features: [
        "Scheduled delivery windows",
        "Express and standard options",
        "Consolidated shipments",
        "Direct store delivery",
        "Cross-docking services",
      ],
    },
  ];

  const shippingOptions = [
    {
      option: "Express Delivery",
      description:
        "Fast delivery for urgent orders and time-sensitive products",
      icon: ClockIcon,
      features: [
        "Same-day and next-day delivery",
        "Priority handling and routing",
        "Dedicated transportation",
        "Premium cold chain service",
      ],
      timeframe: "Same day - 24 hours",
    },
    {
      option: "Standard Shipping",
      description: "Cost-effective delivery for regular orders",
      icon: TruckIcon,
      features: [
        "Reliable 2-5 day delivery",
        "Consolidated shipping savings",
        "Standard cold chain service",
        "Flexible delivery windows",
      ],
      timeframe: "2-5 business days",
    },
    {
      option: "Scheduled Delivery",
      description: "Regular deliveries for recurring orders",
      icon: CalendarIcon,
      features: [
        "Fixed delivery schedules",
        "Route optimization",
        "Consistent service levels",
        "Volume discount pricing",
      ],
      timeframe: "Custom schedule",
    },
    {
      option: "International Shipping",
      description: "Global delivery with customs and compliance support",
      icon: GlobeAltIcon,
      features: [
        "Customs documentation",
        "International cold chain",
        "Compliance management",
        "Local delivery partners",
      ],
      timeframe: "5-14 business days",
    },
  ];

  const logisticsProcess = [
    {
      step: "1",
      title: "Order Processing",
      description:
        "Immediate processing and logistics planning upon order confirmation",
      icon: DocumentTextIcon,
    },
    {
      step: "2",
      title: "Pickup & Loading",
      description:
        "Professional pickup from suppliers with proper handling procedures",
      icon: TruckIcon,
    },
    {
      step: "3",
      title: "Transportation",
      description: "Temperature-controlled transport with real-time monitoring",
      icon: FireIcon,
    },
    {
      step: "4",
      title: "Delivery",
      description:
        "On-time delivery with quality verification and confirmation",
      icon: CheckCircleIcon,
    },
  ];

  const qualityProtection = [
    {
      protection: "Temperature Control",
      description: "Maintain optimal temperatures throughout transit",
      icon: FireIcon,
      measures: [
        "Pre-cooled vehicles and containers",
        "Continuous temperature logging",
        "Automated climate control systems",
        "Emergency backup cooling",
      ],
    },
    {
      protection: "Handling Protocols",
      description: "Proper handling to prevent damage and contamination",
      icon: ShieldCheckIcon,
      measures: [
        "Trained handling personnel",
        "Specialized equipment usage",
        "Contamination prevention protocols",
        "Damage prevention procedures",
      ],
    },
    {
      protection: "Time Optimization",
      description: "Minimize transit time to preserve freshness",
      icon: ClockIcon,
      measures: [
        "Route optimization algorithms",
        "Priority processing systems",
        "Direct transportation options",
        "Expedited customs clearance",
      ],
    },
    {
      protection: "Quality Monitoring",
      description: "Continuous monitoring of product condition",
      icon: CheckCircleIcon,
      measures: [
        "Regular quality checkpoints",
        "Condition documentation",
        "Issue identification protocols",
        "Corrective action procedures",
      ],
    },
  ];

  const benefits = [
    {
      title: "On-Time Delivery",
      description:
        "Reliable delivery performance with industry-leading on-time rates",
      metric: "98.5% on-time",
      icon: ClockIcon,
    },
    {
      title: "Product Freshness",
      description: "Advanced cold chain management preserves product quality",
      metric: "99% quality retention",
      icon: FireIcon,
    },
    {
      title: "Global Reach",
      description: "Deliver anywhere in the world with our logistics network",
      metric: "150+ countries",
      icon: GlobeAltIcon,
    },
    {
      title: "Cost Efficiency",
      description: "Competitive shipping rates with volume discounts",
      metric: "25% cost savings",
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
            Logistics That Preserve Freshness
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            From farm to your door, our advanced logistics network ensures your
            produce arrives fresh, on time, and in perfect condition. With
            temperature-controlled transport and global reach, we make fresh
            delivery simple.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="/signup?type=buyer"
              className="btn btn-primary px-8 py-3 text-base"
            >
              Optimize Your Logistics
            </a>
            <a href="#features" className="btn btn-ghost px-8 py-3 text-base">
              Explore Shipping Options
            </a>
          </div>
          <div className="mt-10">
            <div className="relative mx-auto rounded-3xl overflow-hidden shadow-xl border border-black/5 w-full max-w-6xl h-96 md:h-[520px]">
              <Image
                src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                alt="Advanced logistics and cold chain transportation"
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
              Fresh produce is a race against time. Every hour in transit, every
              degree of temperature variation, every handling decision affects
              the quality that reaches your customers. Traditional logistics
              providers treat produce like any other cargo, but we understand
              that freshness is everything.
            </p>
            <p className="mt-6 text-lg text-gray-700 leading-8">
              Our logistics network is purpose-built for fresh produce, with
              temperature-controlled vehicles, trained handlers, and optimized
              routes that prioritize freshness preservation. From local
              deliveries to international shipping, we ensure your products
              arrive in peak condition.
            </p>
            <blockquote className="mt-8 md:mt-10 border-l-4 border-[var(--primary-accent2)] pl-5 italic text-xl text-gray-800">
              "The best logistics are invisible — you only notice the results:
              fresh products, on time, every time."
            </blockquote>
          </div>
        </section>

        {/* Core Features */}
        <section id="features" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Advanced Logistics Solutions
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive logistics platform combines cutting-edge
              technology with industry expertise to deliver fresh produce
              reliably and efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {logisticsFeatures.map((feature, index) => (
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

        {/* Shipping Options */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Flexible Shipping Solutions
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose from multiple shipping options designed to meet different
              needs, timelines, and budgets while maintaining product quality.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {shippingOptions.map((option, index) => (
              <div key={index} className="card">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <option.icon className="h-6 w-6 text-[var(--primary-accent2)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-2">
                      {option.option}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                      {option.description}
                    </p>
                    <div className="text-xs font-medium text-[var(--primary-accent2)] mb-4">
                      {option.timeframe}
                    </div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {option.features.map((feature, featureIndex) => (
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

        {/* Logistics Process */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Streamlined Logistics Process
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our proven process ensures efficient handling and delivery of your
              produce orders from pickup to final destination.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {logisticsProcess.map((step, index) => (
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

        {/* Quality Protection */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Quality Protection Measures
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Multiple layers of protection ensure your produce maintains peak
              quality throughout the entire logistics journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {qualityProtection.map((protection, index) => (
              <div key={index} className="card">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <protection.icon className="h-6 w-6 text-[var(--primary-accent2)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-2">
                      {protection.protection}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {protection.description}
                    </p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {protection.measures.map((measure, measureIndex) => (
                    <li
                      key={measureIndex}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)] flex-shrink-0" />
                      {measure}
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
              Proven Logistics Performance
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our logistics network delivers measurable results that protect
              your investment and ensure customer satisfaction.
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
                Ready for Reliable Fresh Delivery?
              </h3>
              <p className="mt-4 md:mt-5 text-base md:text-lg text-white/80 max-w-2xl">
                Stop worrying about delivery delays and quality issues. With our
                advanced logistics network, you can trust that your produce will
                arrive fresh, on time, and in perfect condition, every single
                time.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 md:gap-4">
                <a
                  href="/signup?type=buyer"
                  className="btn btn-primary px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  Optimize Your Logistics
                </a>
                <a
                  href="https://calendly.com/procur-logistics-demo"
                  className="btn btn-ghost text-white border-white px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  See Logistics Demo
                </a>
              </div>

              {/* Logistics Highlights */}
              <div className="mt-12 grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Cold Chain Excellence</h4>
                  <p className="text-sm text-white/80">
                    Temperature-controlled transport preserves freshness
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Global Network</h4>
                  <p className="text-sm text-white/80">
                    Worldwide delivery with local expertise and support
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Real-Time Tracking</h4>
                  <p className="text-sm text-white/80">
                    Complete visibility into every shipment's journey
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
