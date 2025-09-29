import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import type { Metadata } from "next";
import Image from "next/image";
import {
  CheckCircleIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  BoltIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  ShieldExclamationIcon,
  FlagIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Government Vendor Management - Procur",
  description:
    "Comprehensive vendor management tools for government procurement. Streamline supplier relationships, ensure compliance, and optimize vendor performance with Procur.",
};

export default function GovernmentVendorManagementPage() {
  const vendorFeatures = [
    {
      title: "Vendor Registration & Verification",
      description:
        "Streamlined onboarding process with comprehensive verification",
      icon: CheckCircleIcon,
      features: [
        "Automated vendor registration portal",
        "Document verification system",
        "Certification tracking and alerts",
        "Background check integration",
        "Insurance and bonding verification",
      ],
    },
    {
      title: "Performance Management",
      description:
        "Monitor and evaluate vendor performance across all contracts",
      icon: ChartBarIcon,
      features: [
        "Performance scorecards and ratings",
        "Delivery and quality tracking",
        "Contract compliance monitoring",
        "Automated performance alerts",
        "Historical performance analysis",
      ],
    },
    {
      title: "Compliance & Risk Management",
      description: "Ensure all vendors meet regulatory and policy requirements",
      icon: ShieldCheckIcon,
      features: [
        "Regulatory compliance tracking",
        "Risk assessment and scoring",
        "Audit trail documentation",
        "Policy violation alerts",
        "Corrective action management",
      ],
    },
    {
      title: "Vendor Diversity & Inclusion",
      description: "Promote diversity and track inclusion goals in procurement",
      icon: UserGroupIcon,
      features: [
        "Diversity certification tracking",
        "Inclusion goal monitoring",
        "Minority-owned business identification",
        "Diversity reporting and analytics",
        "Outreach program management",
      ],
    },
  ];

  const managementTools = [
    {
      category: "Vendor Database",
      description: "Centralized repository of all vendor information",
      tools: [
        "Comprehensive vendor profiles",
        "Contact and capability information",
        "Certification and license tracking",
        "Performance history records",
        "Communication logs",
      ],
    },
    {
      category: "Contract Management",
      description: "Manage all aspects of vendor contracts and agreements",
      tools: [
        "Contract lifecycle management",
        "Renewal and expiration tracking",
        "Amendment and modification logs",
        "Performance milestone tracking",
        "Payment and invoice management",
      ],
    },
    {
      category: "Evaluation & Scoring",
      description:
        "Systematic evaluation of vendor capabilities and performance",
      tools: [
        "Multi-criteria evaluation framework",
        "Weighted scoring systems",
        "Peer review and collaboration",
        "Historical comparison analysis",
        "Benchmarking against standards",
      ],
    },
    {
      category: "Communication Hub",
      description: "Centralized communication platform for vendor interactions",
      tools: [
        "Secure messaging system",
        "Document sharing portal",
        "Meeting and event scheduling",
        "Notification and alert system",
        "Feedback and survey tools",
      ],
    },
  ];

  const complianceFeatures = [
    {
      title: "Regulatory Compliance",
      items: [
        "Federal, state, and local regulation tracking",
        "Industry-specific compliance requirements",
        "Automated compliance status updates",
        "Violation tracking and remediation",
      ],
    },
    {
      title: "Documentation Management",
      items: [
        "Centralized document repository",
        "Version control and audit trails",
        "Automated document expiration alerts",
        "Secure document sharing",
      ],
    },
    {
      title: "Risk Assessment",
      items: [
        "Financial stability analysis",
        "Operational risk evaluation",
        "Reputation and background checks",
        "Continuous risk monitoring",
      ],
    },
  ];

  const benefits = [
    {
      title: "Streamlined Operations",
      description: "Reduce administrative burden and improve efficiency",
      icon: BoltIcon,
      stats: "75% reduction in vendor onboarding time",
    },
    {
      title: "Enhanced Compliance",
      description: "Ensure all vendors meet regulatory requirements",
      icon: CheckCircleIcon,
      stats: "99% compliance rate across all vendors",
    },
    {
      title: "Improved Performance",
      description: "Better vendor relationships and service delivery",
      icon: TrophyIcon,
      stats: "40% improvement in vendor performance scores",
    },
    {
      title: "Cost Savings",
      description: "Optimize vendor relationships and reduce costs",
      icon: CurrencyDollarIcon,
      stats: "Average 15% cost savings through better vendor management",
    },
    {
      title: "Risk Mitigation",
      description: "Identify and address vendor risks proactively",
      icon: ShieldExclamationIcon,
      stats: "85% reduction in vendor-related incidents",
    },
    {
      title: "Diversity Goals",
      description: "Achieve and exceed diversity and inclusion targets",
      icon: FlagIcon,
      stats: "Meet 100% of diversity procurement goals",
    },
  ];

  const processSteps = [
    {
      step: "1",
      title: "Vendor Registration",
      description:
        "Suppliers complete comprehensive registration through our secure portal",
    },
    {
      step: "2",
      title: "Verification & Approval",
      description:
        "Automated verification of credentials, certifications, and compliance",
    },
    {
      step: "3",
      title: "Performance Monitoring",
      description:
        "Continuous tracking of vendor performance across all contracts",
    },
    {
      step: "4",
      title: "Relationship Management",
      description:
        "Ongoing communication, evaluation, and relationship optimization",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--secondary-black)] text-balance">
            Government Vendor Management
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            Comprehensive vendor management platform designed for government
            procurement. Streamline supplier relationships, ensure compliance,
            and optimize vendor performance with powerful management tools.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a href="#features" className="btn btn-primary px-8 py-3 text-base">
              Explore Features
            </a>
            <a href="#demo" className="btn btn-ghost px-8 py-3 text-base">
              Request Demo
            </a>
          </div>
          <div className="mt-10">
            <div className="relative mx-auto rounded-3xl overflow-hidden shadow-xl border border-black/5 w-full max-w-6xl h-96 md:h-[520px]">
              <Image
                src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                alt="Government vendor management platform"
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
              Effective vendor management is critical to successful government
              procurement. Our platform provides comprehensive tools to manage
              supplier relationships, ensure compliance, and optimize
              performance across all vendor interactions.
            </p>
            <p className="mt-6 text-lg text-gray-700 leading-8">
              From initial registration through ongoing performance monitoring,
              we help government agencies build stronger, more compliant, and
              more productive relationships with their vendor ecosystem.
            </p>
            <blockquote className="mt-8 md:mt-10 border-l-4 border-[var(--primary-accent2)] pl-5 italic text-xl text-gray-800">
              "Strong vendor relationships are the foundation of effective
              government procurement."
            </blockquote>
          </div>
        </section>

        {/* Key Features */}
        <section id="features" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Comprehensive Vendor Management
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our vendor management suite covers every aspect of supplier
              relationships, from onboarding to performance optimization and
              compliance monitoring.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {vendorFeatures.map((feature, index) => (
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

        {/* Management Tools */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Integrated Management Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A complete suite of tools to manage every aspect of your vendor
              relationships, from initial contact through contract completion.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {managementTools.map((tool, index) => (
              <div key={index} className="card">
                <h3 className="text-xl font-semibold text-[var(--secondary-black)] mb-3">
                  {tool.category}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {tool.description}
                </p>
                <ul className="space-y-2">
                  {tool.tools.map((item, itemIndex) => (
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
            ))}
          </div>
        </section>

        {/* Process Flow */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Vendor Management Process
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our streamlined process ensures efficient vendor onboarding and
              ongoing management while maintaining compliance and performance
              standards.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <div key={index} className="card text-center">
                <div className="w-12 h-12 bg-[var(--primary-accent2)] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
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

        {/* Compliance Features */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Compliance & Risk Management
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive compliance monitoring and risk management tools to
              ensure all vendors meet regulatory requirements and maintain high
              standards.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {complianceFeatures.map((feature, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-4">
                  {feature.title}
                </h3>
                <ul className="space-y-3">
                  {feature.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)] mt-2 flex-shrink-0" />
                      {item}
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
              Proven Results for Government Agencies
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Government agencies using our vendor management platform see
              significant improvements in efficiency, compliance, and cost
              savings.
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
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {benefit.description}
                </p>
                <div className="bg-[var(--primary-background)] rounded-lg p-3">
                  <div className="text-xs font-medium text-[var(--primary-accent2)]">
                    {benefit.stats}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="mb-20">
          <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-black to-black/90 text-white px-8 md:px-14 py-12 md:py-16">
            <div className="max-w-5xl">
              <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Transform Your Vendor Management Today
              </h3>
              <p className="mt-4 md:mt-5 text-base md:text-lg text-white/80 max-w-2xl">
                See how our vendor management platform can streamline your
                procurement processes, improve compliance, and strengthen vendor
                relationships. Schedule a personalized demo with our government
                specialists.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 md:gap-4">
                <a
                  href="https://calendly.com/procur-government-demo"
                  className="btn btn-primary px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  Schedule Demo
                </a>
                <a
                  href="/signup?type=government"
                  className="btn btn-ghost text-white border-white px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  Create Account
                </a>
              </div>

              {/* Demo Features */}
              <div className="mt-12 grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Vendor Portal Demo</h4>
                  <p className="text-sm text-white/80">
                    See the vendor registration and management interface
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Performance Tracking</h4>
                  <p className="text-sm text-white/80">
                    Learn how to monitor and evaluate vendor performance
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Compliance Dashboard</h4>
                  <p className="text-sm text-white/80">
                    Explore compliance monitoring and risk management tools
                  </p>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <div className="card text-center">
            <h3 className="text-2xl font-bold text-[var(--secondary-black)] mb-4">
              Ready to Optimize Your Vendor Management?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join government agencies nationwide who have transformed their
              vendor management with Procur. Get started with a free
              consultation and see immediate improvements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:government@procur.com"
                className="btn btn-primary px-8 py-3"
              >
                Contact Government Team
              </a>
              <a
                href="/government/reporting"
                className="btn btn-ghost px-8 py-3"
              >
                Explore Reporting & Analytics
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
