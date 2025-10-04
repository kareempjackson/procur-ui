import TopNavigation from "@/components/navigation/TopNavigation";
import type { Metadata } from "next";
import Image from "next/image";
import {
  ChartBarIcon,
  CheckCircleIcon,
  ChartPieIcon,
  MagnifyingGlassIcon,
  CurrencyDollarIcon,
  BuildingLibraryIcon,
  BoltIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Government Reporting & Analytics - Procur",
  description:
    "Comprehensive reporting and analytics tools for government procurement. Track spending, monitor compliance, and optimize your procurement processes with Procur.",
};

export default function GovernmentReportingPage() {
  const reportingFeatures = [
    {
      title: "Spend Analytics",
      description:
        "Track procurement spending across departments, categories, and time periods",
      icon: ChartBarIcon,
      features: [
        "Real-time spending dashboards",
        "Budget vs. actual analysis",
        "Department-wise breakdowns",
        "Vendor spending patterns",
        "Cost savings identification",
      ],
    },
    {
      title: "Compliance Monitoring",
      description:
        "Ensure all procurement activities meet regulatory requirements",
      icon: CheckCircleIcon,
      features: [
        "Regulatory compliance tracking",
        "Audit trail documentation",
        "Policy adherence monitoring",
        "Exception reporting",
        "Automated compliance alerts",
      ],
    },
    {
      title: "Performance Metrics",
      description: "Monitor procurement efficiency and vendor performance",
      icon: ChartPieIcon,
      features: [
        "Procurement cycle time analysis",
        "Vendor performance scorecards",
        "Contract utilization rates",
        "Savings achievement tracking",
        "Process efficiency metrics",
      ],
    },
    {
      title: "Transparency Reports",
      description:
        "Generate public-facing reports for transparency and accountability",
      icon: MagnifyingGlassIcon,
      features: [
        "Public procurement summaries",
        "Vendor diversity reporting",
        "Contract award notifications",
        "Spending transparency portals",
        "FOIA-ready documentation",
      ],
    },
  ];

  const dashboardFeatures = [
    {
      title: "Executive Dashboard",
      description: "High-level overview for leadership and decision makers",
      metrics: [
        "Total Spend",
        "Active Contracts",
        "Vendor Count",
        "Savings Achieved",
      ],
    },
    {
      title: "Procurement Manager Dashboard",
      description: "Operational insights for procurement professionals",
      metrics: [
        "Pending Approvals",
        "Contract Renewals",
        "Vendor Performance",
        "Budget Status",
      ],
    },
    {
      title: "Department Dashboard",
      description: "Department-specific procurement insights and controls",
      metrics: [
        "Department Spend",
        "Active Orders",
        "Preferred Vendors",
        "Compliance Score",
      ],
    },
    {
      title: "Public Dashboard",
      description: "Transparent view of procurement activities for citizens",
      metrics: [
        "Public Contracts",
        "Vendor Directory",
        "Spending Summaries",
        "Award Notices",
      ],
    },
  ];

  const reportTypes = [
    {
      category: "Financial Reports",
      reports: [
        "Monthly Spending Summary",
        "Budget vs. Actual Analysis",
        "Cost Savings Report",
        "Vendor Payment Summary",
        "Department Budget Utilization",
      ],
    },
    {
      category: "Compliance Reports",
      reports: [
        "Regulatory Compliance Status",
        "Audit Trail Documentation",
        "Policy Exception Report",
        "Certification Tracking",
        "Risk Assessment Summary",
      ],
    },
    {
      category: "Performance Reports",
      reports: [
        "Vendor Performance Scorecard",
        "Procurement Cycle Analysis",
        "Contract Utilization Report",
        "Process Efficiency Metrics",
        "Quality Assessment Summary",
      ],
    },
    {
      category: "Transparency Reports",
      reports: [
        "Public Procurement Summary",
        "Vendor Diversity Report",
        "Contract Award Notices",
        "Spending Transparency Portal",
        "FOIA Response Package",
      ],
    },
  ];

  const benefits = [
    {
      title: "Enhanced Transparency",
      description:
        "Provide clear visibility into procurement processes and spending",
      icon: MagnifyingGlassIcon,
    },
    {
      title: "Improved Compliance",
      description: "Ensure adherence to regulations and internal policies",
      icon: ScaleIcon,
    },
    {
      title: "Cost Optimization",
      description:
        "Identify savings opportunities and optimize procurement spend",
      icon: CurrencyDollarIcon,
    },
    {
      title: "Data-Driven Decisions",
      description: "Make informed decisions based on comprehensive analytics",
      icon: ChartBarIcon,
    },
    {
      title: "Streamlined Reporting",
      description: "Automate report generation and reduce manual effort",
      icon: BoltIcon,
    },
    {
      title: "Public Accountability",
      description: "Demonstrate responsible stewardship of public funds",
      icon: BuildingLibraryIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--secondary-black)] text-balance">
            Government Reporting & Analytics
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            Comprehensive reporting tools designed for government procurement.
            Track spending, monitor compliance, and demonstrate transparency
            with powerful analytics and automated reporting.
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
                alt="Government reporting and analytics dashboard"
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
              Modern government procurement requires sophisticated reporting and
              analytics capabilities. Our platform provides comprehensive tools
              to track spending, monitor compliance, and demonstrate
              transparency in all procurement activities.
            </p>
            <p className="mt-6 text-lg text-gray-700 leading-8">
              From real-time dashboards to automated compliance reports, we help
              government agencies make data-driven decisions while maintaining
              the highest standards of accountability and transparency.
            </p>
            <blockquote className="mt-8 md:mt-10 border-l-4 border-[var(--primary-accent2)] pl-5 italic text-xl text-gray-800">
              "Transparency and accountability are the cornerstones of effective
              government procurement."
            </blockquote>
          </div>
        </section>

        {/* Key Features */}
        <section id="features" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Comprehensive Reporting Capabilities
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our reporting suite covers every aspect of government procurement,
              from financial analytics to compliance monitoring and public
              transparency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {reportingFeatures.map((feature, index) => (
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

        {/* Dashboard Overview */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Role-Based Dashboards
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Customized dashboards for different roles and responsibilities
              within your organization, from executives to procurement
              professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {dashboardFeatures.map((dashboard, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-3">
                  {dashboard.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {dashboard.description}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {dashboard.metrics.map((metric, metricIndex) => (
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

        {/* Report Types */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Comprehensive Report Library
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Pre-built reports covering all aspects of government procurement,
              with customization options to meet your specific requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reportTypes.map((category, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-4">
                  {category.category}
                </h3>
                <ul className="space-y-2">
                  {category.reports.map((report, reportIndex) => (
                    <li
                      key={reportIndex}
                      className="text-sm text-gray-700 flex items-start gap-2"
                    >
                      <span className="h-1 w-1 rounded-full bg-[var(--primary-accent2)] mt-2 flex-shrink-0" />
                      {report}
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
              Why Choose Our Reporting Platform
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Designed specifically for government needs, our platform delivers
              the insights and transparency required for effective procurement
              management.
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

        {/* Demo Section */}
        <section id="demo" className="mb-20">
          <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-black to-black/90 text-white px-8 md:px-14 py-12 md:py-16">
            <div className="max-w-5xl">
              <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
                See Our Reporting Platform in Action
              </h3>
              <p className="mt-4 md:mt-5 text-base md:text-lg text-white/80 max-w-2xl">
                Schedule a personalized demo to see how our reporting and
                analytics tools can transform your government procurement
                processes. Our experts will show you real-world examples and
                answer your questions.
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
                  <h4 className="font-semibold mb-2">Live Dashboard Demo</h4>
                  <p className="text-sm text-white/80">
                    Interactive walkthrough of reporting dashboards
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Custom Report Builder</h4>
                  <p className="text-sm text-white/80">
                    See how to create reports tailored to your needs
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Integration Options</h4>
                  <p className="text-sm text-white/80">
                    Learn about connecting with existing systems
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
              Ready to Transform Your Procurement Reporting?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join government agencies across the country who trust Procur for
              their procurement reporting and analytics needs. Get started today
              with a free consultation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:government@procur.com"
                className="btn btn-primary px-8 py-3"
              >
                Contact Government Team
              </a>
              <a href="/government/vendors" className="btn btn-ghost px-8 py-3">
                Explore Vendor Management
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
