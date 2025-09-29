import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import type { Metadata } from "next";
import Image from "next/image";
import {
  ShieldCheckIcon,
  CheckBadgeIcon,
  DocumentMagnifyingGlassIcon,
  StarIcon,
  BeakerIcon,
  ClipboardDocumentCheckIcon,
  ExclamationTriangleIcon,
  TruckIcon,
  UserGroupIcon,
  ChartBarIcon,
  CameraIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Quality Assurance - Procur",
  description:
    "Ensure premium quality with Procur's comprehensive quality assurance program. From supplier verification to delivery inspection, we guarantee the quality you expect.",
};

export default function BuyersQualityPage() {
  const qualityFeatures = [
    {
      title: "Supplier Verification",
      description:
        "Comprehensive vetting of all suppliers for quality standards",
      icon: CheckBadgeIcon,
      features: [
        "Multi-point verification process",
        "Certification and compliance checks",
        "Facility inspections and audits",
        "Quality management system reviews",
        "Continuous monitoring and updates",
      ],
    },
    {
      title: "Product Inspection",
      description: "Rigorous quality checks at every stage of the supply chain",
      icon: DocumentMagnifyingGlassIcon,
      features: [
        "Pre-shipment quality inspections",
        "Third-party laboratory testing",
        "Visual and physical quality checks",
        "Packaging and labeling verification",
        "Documentation and traceability",
      ],
    },
    {
      title: "Quality Monitoring",
      description: "Continuous tracking of quality metrics and performance",
      icon: ChartBarIcon,
      features: [
        "Real-time quality score tracking",
        "Trend analysis and reporting",
        "Supplier performance benchmarking",
        "Customer feedback integration",
        "Predictive quality analytics",
      ],
    },
    {
      title: "Issue Resolution",
      description: "Fast response and resolution for any quality concerns",
      icon: ExclamationTriangleIcon,
      features: [
        "24/7 quality issue reporting",
        "Rapid response protocols",
        "Root cause analysis",
        "Corrective action tracking",
        "Compensation and replacement programs",
      ],
    },
  ];

  const qualityStandards = [
    {
      standard: "Organic Certification",
      description: "USDA Organic and international organic standards",
      icon: "🌱",
      requirements: [
        "Certified organic production",
        "No synthetic pesticides or fertilizers",
        "Non-GMO verification",
        "Soil health maintenance",
        "Annual certification audits",
      ],
    },
    {
      standard: "GAP Compliance",
      description: "Good Agricultural Practices for food safety",
      icon: "🛡️",
      requirements: [
        "Food safety management systems",
        "Worker health and hygiene",
        "Water quality testing",
        "Pest management protocols",
        "Traceability systems",
      ],
    },
    {
      standard: "Fair Trade",
      description: "Ethical sourcing and fair labor practices",
      icon: "🤝",
      requirements: [
        "Fair wages for workers",
        "Safe working conditions",
        "Community development",
        "Environmental protection",
        "Democratic organization",
      ],
    },
    {
      standard: "Sustainability",
      description: "Environmental and social responsibility standards",
      icon: "♻️",
      requirements: [
        "Sustainable farming practices",
        "Water conservation",
        "Biodiversity protection",
        "Carbon footprint reduction",
        "Waste minimization",
      ],
    },
  ];

  const inspectionProcess = [
    {
      step: "1",
      title: "Pre-Harvest Inspection",
      description:
        "Quality assessment before harvesting to ensure optimal timing",
      icon: BeakerIcon,
      checks: [
        "Ripeness assessment",
        "Size and color evaluation",
        "Pest inspection",
        "Weather impact review",
      ],
    },
    {
      step: "2",
      title: "Post-Harvest Processing",
      description: "Quality control during cleaning, sorting, and packaging",
      icon: ClipboardDocumentCheckIcon,
      checks: [
        "Cleaning and washing",
        "Size and grade sorting",
        "Defect removal",
        "Packaging quality",
      ],
    },
    {
      step: "3",
      title: "Pre-Shipment Verification",
      description: "Final quality check before products leave the facility",
      icon: CameraIcon,
      checks: [
        "Final quality inspection",
        "Documentation review",
        "Temperature verification",
        "Load confirmation",
      ],
    },
    {
      step: "4",
      title: "Delivery Confirmation",
      description:
        "Quality verification upon delivery to ensure standards are met",
      icon: TruckIcon,
      checks: [
        "Condition assessment",
        "Temperature log review",
        "Damage inspection",
        "Customer acceptance",
      ],
    },
  ];

  const qualityMetrics = [
    {
      metric: "Quality Score",
      description: "Overall quality rating based on multiple factors",
      icon: StarIcon,
      components: [
        "Visual appearance and freshness",
        "Size and weight consistency",
        "Absence of defects and damage",
        "Packaging and presentation quality",
      ],
    },
    {
      metric: "Compliance Rating",
      description: "Adherence to certifications and standards",
      icon: ShieldCheckIcon,
      components: [
        "Certification maintenance",
        "Audit results and findings",
        "Corrective action completion",
        "Documentation accuracy",
      ],
    },
    {
      metric: "Customer Satisfaction",
      description: "Buyer feedback and satisfaction scores",
      icon: UserGroupIcon,
      components: [
        "Product quality ratings",
        "Delivery condition feedback",
        "Service experience scores",
        "Repeat purchase rates",
      ],
    },
    {
      metric: "Performance Trends",
      description: "Historical quality performance analysis",
      icon: ChartBarIcon,
      components: [
        "Quality score trends",
        "Issue frequency tracking",
        "Improvement initiatives",
        "Seasonal performance patterns",
      ],
    },
  ];

  const benefits = [
    {
      title: "Guaranteed Quality",
      description:
        "Confidence in every order with comprehensive quality assurance",
      metric: "99.5% quality rate",
      icon: ShieldCheckIcon,
    },
    {
      title: "Reduced Risk",
      description: "Minimize quality-related issues and business disruptions",
      metric: "85% fewer issues",
      icon: ExclamationTriangleIcon,
    },
    {
      title: "Supplier Reliability",
      description:
        "Work with verified suppliers who meet strict quality standards",
      metric: "98% supplier rating",
      icon: CheckBadgeIcon,
    },
    {
      title: "Customer Satisfaction",
      description: "Deliver consistent quality that keeps your customers happy",
      metric: "96% satisfaction",
      icon: StarIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--secondary-black)] text-balance">
            Quality You Can Trust, Every Time
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            Never compromise on quality again. Our comprehensive quality
            assurance program ensures every product meets your standards, from
            verified suppliers to rigorous inspections and continuous
            monitoring.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="/signup?type=buyer"
              className="btn btn-primary px-8 py-3 text-base"
            >
              Ensure Quality Standards
            </a>
            <a href="#features" className="btn btn-ghost px-8 py-3 text-base">
              Learn About Quality
            </a>
          </div>
          <div className="mt-10">
            <div className="relative mx-auto rounded-3xl overflow-hidden shadow-xl border border-black/5 w-full max-w-6xl h-96 md:h-[520px]">
              <Image
                src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                alt="Quality assurance and inspection processes"
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
              Quality isn't just a promise — it&apos;s a process. Every piece of
              produce that reaches your business carries your reputation with
              it. One bad shipment can damage customer relationships, waste
              resources, and hurt your bottom line. That's why we've built the
              most comprehensive quality assurance program in the industry.
            </p>
            <p className="mt-6 text-lg text-gray-700 leading-8">
              From the farms where products are grown to the moment they arrive
              at your door, every step is monitored, verified, and documented.
              Our quality standards aren't just guidelines — they're guarantees
              backed by rigorous processes and continuous improvement.
            </p>
            <blockquote className="mt-8 md:mt-10 border-l-4 border-[var(--primary-accent2)] pl-5 italic text-xl text-gray-800">
              "Quality is never an accident; it is always the result of
              intelligent effort, careful planning, and skillful execution."
            </blockquote>
          </div>
        </section>

        {/* Core Features */}
        <section id="features" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Comprehensive Quality Assurance
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our multi-layered quality assurance program ensures every product
              meets your standards through rigorous verification, inspection,
              and monitoring processes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {qualityFeatures.map((feature, index) => (
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

        {/* Quality Standards */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Recognized Quality Standards
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We work with suppliers who meet the highest industry standards for
              quality, safety, and sustainability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {qualityStandards.map((standard, index) => (
              <div key={index} className="card">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-3xl">{standard.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[var(--secondary-black)] mb-2">
                      {standard.standard}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {standard.description}
                    </p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {standard.requirements.map((requirement, reqIndex) => (
                    <li
                      key={reqIndex}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)] flex-shrink-0" />
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Inspection Process */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Four-Stage Quality Process
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our systematic approach ensures quality at every stage, from
              pre-harvest assessment to final delivery confirmation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {inspectionProcess.map((step, index) => (
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
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {step.description}
                </p>
                <div className="space-y-1">
                  {step.checks.map((check, checkIndex) => (
                    <div
                      key={checkIndex}
                      className="text-xs text-[var(--primary-accent2)] font-medium"
                    >
                      {check}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quality Metrics */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Quality Measurement & Tracking
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We measure quality across multiple dimensions to provide
              comprehensive insights and continuous improvement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {qualityMetrics.map((metric, index) => (
              <div key={index} className="card">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <metric.icon className="h-6 w-6 text-[var(--primary-accent2)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-2">
                      {metric.metric}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {metric.description}
                    </p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {metric.components.map((component, compIndex) => (
                    <li
                      key={compIndex}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)] flex-shrink-0" />
                      {component}
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
              Proven Quality Results
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our quality assurance program delivers measurable results that
              protect your business and enhance customer satisfaction.
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
                Ready for Guaranteed Quality?
              </h3>
              <p className="mt-4 md:mt-5 text-base md:text-lg text-white/80 max-w-2xl">
                Stop worrying about quality issues and start focusing on growing
                your business. With our comprehensive quality assurance program,
                you can trust that every order meets your standards and exceeds
                your customers' expectations.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 md:gap-4">
                <a
                  href="/signup?type=buyer"
                  className="btn btn-primary px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  Ensure Quality Standards
                </a>
                <a
                  href="https://calendly.com/procur-quality-demo"
                  className="btn btn-ghost text-white border-white px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  See Quality Process
                </a>
              </div>

              {/* Quality Highlights */}
              <div className="mt-12 grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Verified Suppliers</h4>
                  <p className="text-sm text-white/80">
                    All suppliers meet strict quality and certification
                    standards
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Rigorous Inspections</h4>
                  <p className="text-sm text-white/80">
                    Multi-stage quality checks ensure consistent standards
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Quality Guarantee</h4>
                  <p className="text-sm text-white/80">
                    Backed by our comprehensive quality assurance program
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
