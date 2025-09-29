import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import type { Metadata } from "next";
import Image from "next/image";
import {
  CurrencyDollarIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  BanknotesIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  CalendarIcon,
  UserGroupIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Payment Solutions - Procur",
  description:
    "Secure, flexible payment solutions for produce procurement. From instant payments to trade financing, manage your cash flow and supplier relationships with Procur's payment platform.",
};

export default function BuyersPaymentsPage() {
  const paymentFeatures = [
    {
      title: "Multiple Payment Methods",
      description: "Flexible payment options to suit your business preferences",
      icon: CreditCardIcon,
      features: [
        "Credit and debit card processing",
        "ACH and wire transfers",
        "Digital wallet integration",
        "Cryptocurrency options",
        "International payment support",
      ],
    },
    {
      title: "Secure Transactions",
      description:
        "Bank-level security for all payment processing and data protection",
      icon: ShieldCheckIcon,
      features: [
        "PCI DSS compliance",
        "End-to-end encryption",
        "Fraud detection and prevention",
        "Multi-factor authentication",
        "Secure payment tokenization",
      ],
    },
    {
      title: "Trade Financing",
      description:
        "Flexible financing options to optimize cash flow and growth",
      icon: BanknotesIcon,
      features: [
        "Net payment terms (15, 30, 60 days)",
        "Early payment discounts",
        "Invoice factoring services",
        "Credit line facilities",
        "Seasonal financing programs",
      ],
    },
    {
      title: "Payment Analytics",
      description:
        "Comprehensive insights into spending patterns and cash flow",
      icon: ChartBarIcon,
      features: [
        "Spending analysis and reporting",
        "Cash flow forecasting",
        "Supplier payment tracking",
        "Cost center allocation",
        "Budget management tools",
      ],
    },
  ];

  const paymentMethods = [
    {
      method: "Instant Payments",
      description: "Immediate payment processing for urgent orders",
      icon: ClockIcon,
      features: [
        "Real-time payment processing",
        "Instant supplier notification",
        "Same-day fund transfer",
        "Priority order processing",
      ],
      processing: "Immediate",
    },
    {
      method: "Credit Terms",
      description: "Extended payment terms for better cash flow management",
      icon: CalendarIcon,
      features: [
        "15, 30, 60, or 90-day terms",
        "Credit limit management",
        "Automated payment scheduling",
        "Early payment discounts",
      ],
      processing: "Net terms",
    },
    {
      method: "Escrow Services",
      description: "Secure payment holding for high-value transactions",
      icon: ShieldCheckIcon,
      features: [
        "Third-party payment protection",
        "Quality verification release",
        "Dispute resolution support",
        "International trade security",
      ],
      processing: "Upon delivery",
    },
    {
      method: "Recurring Payments",
      description: "Automated payments for regular supplier relationships",
      icon: ArrowPathIcon,
      features: [
        "Automated payment scheduling",
        "Contract-based pricing",
        "Volume discount application",
        "Relationship management",
      ],
      processing: "Scheduled",
    },
  ];

  const securityMeasures = [
    {
      measure: "Fraud Prevention",
      description: "Advanced fraud detection and prevention systems",
      icon: ExclamationTriangleIcon,
      protections: [
        "Machine learning fraud detection",
        "Real-time transaction monitoring",
        "Suspicious activity alerts",
        "Identity verification protocols",
      ],
    },
    {
      measure: "Data Protection",
      description: "Comprehensive data security and privacy protection",
      icon: ShieldCheckIcon,
      protections: [
        "End-to-end encryption",
        "Secure data storage",
        "Access control systems",
        "Regular security audits",
      ],
    },
    {
      measure: "Compliance",
      description: "Full compliance with financial regulations and standards",
      icon: DocumentTextIcon,
      protections: [
        "PCI DSS certification",
        "SOX compliance",
        "GDPR data protection",
        "Industry standard adherence",
      ],
    },
    {
      measure: "Dispute Resolution",
      description: "Comprehensive support for payment disputes and issues",
      icon: UserGroupIcon,
      protections: [
        "Dedicated dispute team",
        "Evidence collection support",
        "Mediation services",
        "Resolution tracking",
      ],
    },
  ];

  const financingOptions = [
    {
      option: "Trade Credit",
      description: "Extended payment terms to improve cash flow",
      icon: CalendarIcon,
      benefits: [
        "Preserve working capital",
        "Flexible payment schedules",
        "Competitive interest rates",
        "Quick approval process",
      ],
    },
    {
      option: "Invoice Factoring",
      description: "Convert invoices to immediate cash",
      icon: CurrencyDollarIcon,
      benefits: [
        "Immediate cash access",
        "No debt on balance sheet",
        "Flexible factoring rates",
        "Credit protection services",
      ],
    },
    {
      option: "Seasonal Financing",
      description: "Specialized financing for seasonal purchasing needs",
      icon: ChartBarIcon,
      benefits: [
        "Peak season support",
        "Flexible repayment terms",
        "Inventory financing",
        "Growth capital access",
      ],
    },
    {
      option: "Credit Lines",
      description: "Revolving credit facilities for ongoing operations",
      icon: BanknotesIcon,
      benefits: [
        "On-demand funding access",
        "Competitive interest rates",
        "Flexible draw schedules",
        "Credit limit increases",
      ],
    },
  ];

  const benefits = [
    {
      title: "Secure Transactions",
      description: "Bank-level security protects every payment and transaction",
      metric: "100% secure",
      icon: ShieldCheckIcon,
    },
    {
      title: "Fast Processing",
      description: "Quick payment processing keeps your supply chain moving",
      metric: "Instant payments",
      icon: ClockIcon,
    },
    {
      title: "Better Cash Flow",
      description: "Flexible payment terms optimize your working capital",
      metric: "30% improvement",
      icon: CurrencyDollarIcon,
    },
    {
      title: "Global Support",
      description: "International payment capabilities for worldwide sourcing",
      icon: CheckCircleIcon,
      metric: "150+ currencies",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--secondary-black)] text-balance">
            Payments Made Simple and Secure
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            Streamline your procurement payments with secure, flexible solutions
            designed for the produce industry. From instant payments to trade
            financing, manage your cash flow and supplier relationships with
            confidence.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="/signup?type=buyer"
              className="btn btn-primary px-8 py-3 text-base"
            >
              Optimize Your Payments
            </a>
            <a href="#features" className="btn btn-ghost px-8 py-3 text-base">
              Explore Payment Options
            </a>
          </div>
          <div className="mt-10">
            <div className="relative mx-auto rounded-3xl overflow-hidden shadow-xl border border-black/5 w-full max-w-6xl h-96 md:h-[520px]">
              <Image
                src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                alt="Secure payment processing and financial management"
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
              Cash flow is the lifeblood of any business, and in the produce
              industry, timing is everything. Seasonal fluctuations, perishable
              inventory, and varying supplier terms create unique financial
              challenges that generic payment systems simply can&apos;t address
              effectively.
            </p>
            <p className="mt-6 text-lg text-gray-700 leading-8">
              Our payment platform is built specifically for produce
              procurement, with flexible terms, secure processing, and financing
              options that help you optimize cash flow while maintaining strong
              supplier relationships. From instant payments to extended credit
              terms, we provide the financial tools you need to grow your
              business.
            </p>
            <blockquote className="mt-8 md:mt-10 border-l-4 border-[var(--primary-accent2)] pl-5 italic text-xl text-gray-800">
              "The best payment system is one you never have to think about — it
              just works, securely and efficiently, every time."
            </blockquote>
          </div>
        </section>

        {/* Core Features */}
        <section id="features" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Comprehensive Payment Solutions
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our payment platform combines security, flexibility, and
              intelligence to provide the most comprehensive payment solution
              for produce procurement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {paymentFeatures.map((feature, index) => (
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

        {/* Payment Methods */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Flexible Payment Methods
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose from multiple payment options designed to meet different
              business needs, cash flow requirements, and supplier preferences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {paymentMethods.map((method, index) => (
              <div key={index} className="card">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <method.icon className="h-6 w-6 text-[var(--primary-accent2)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-2">
                      {method.method}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                      {method.description}
                    </p>
                    <div className="text-xs font-medium text-[var(--primary-accent2)] mb-4">
                      Processing: {method.processing}
                    </div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {method.features.map((feature, featureIndex) => (
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

        {/* Security Measures */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Bank-Level Security & Protection
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Multiple layers of security protect your payments, data, and
              business from fraud and cyber threats.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {securityMeasures.map((measure, index) => (
              <div key={index} className="card">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <measure.icon className="h-6 w-6 text-[var(--primary-accent2)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-2">
                      {measure.measure}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {measure.description}
                    </p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {measure.protections.map((protection, protectionIndex) => (
                    <li
                      key={protectionIndex}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)] flex-shrink-0" />
                      {protection}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Financing Options */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Trade Financing Solutions
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Access flexible financing options designed to optimize cash flow
              and support business growth in the produce industry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {financingOptions.map((option, index) => (
              <div key={index} className="card">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <option.icon className="h-6 w-6 text-[var(--primary-accent2)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-2">
                      {option.option}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {option.benefits.map((benefit, benefitIndex) => (
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
              Proven Payment Performance
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our payment solutions deliver measurable benefits that improve
              cash flow, reduce costs, and strengthen supplier relationships.
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
                Ready to Optimize Your Payments?
              </h3>
              <p className="mt-4 md:mt-5 text-base md:text-lg text-white/80 max-w-2xl">
                Stop struggling with cash flow constraints and payment
                complexities. With our comprehensive payment solutions, you can
                focus on growing your business while we handle the financial
                infrastructure securely and efficiently.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 md:gap-4">
                <a
                  href="/signup?type=buyer"
                  className="btn btn-primary px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  Start Optimizing Payments
                </a>
                <a
                  href="https://calendly.com/procur-payments-demo"
                  className="btn btn-ghost text-white border-white px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  See Payment Demo
                </a>
              </div>

              {/* Payment Highlights */}
              <div className="mt-12 grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Secure Processing</h4>
                  <p className="text-sm text-white/80">
                    Bank-level security protects every transaction
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Flexible Terms</h4>
                  <p className="text-sm text-white/80">
                    Payment options that optimize your cash flow
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Trade Financing</h4>
                  <p className="text-sm text-white/80">
                    Access capital to grow your business faster
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
