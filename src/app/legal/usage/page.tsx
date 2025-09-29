import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Usage Policy - Procur",
  description:
    "Procur's Usage Policy. Understand acceptable use guidelines and prohibited activities on our produce procurement platform.",
};

export default function UsagePolicyPage() {
  const lastUpdated = "January 15, 2025";

  const sections = [
    {
      title: "Acceptable Use",
      content: [
        {
          subtitle: "Lawful Use",
          text: "You may only use our platform for lawful purposes and in accordance with applicable laws and regulations. All activities must comply with local, state, federal, and international laws.",
        },
        {
          subtitle: "Business Purposes",
          text: "Our platform is designed for legitimate business-to-business transactions in the produce industry. Use for personal consumption or non-commercial purposes requires prior authorization.",
        },
        {
          subtitle: "Accurate Information",
          text: "You must provide accurate, complete, and up-to-date information in all interactions on our platform. This includes product descriptions, business details, certifications, and transaction information.",
        },
        {
          subtitle: "Respectful Conduct",
          text: "Treat all users with respect and professionalism. Maintain courteous communication and conduct business in good faith with other platform participants.",
        },
      ],
    },
    {
      title: "Prohibited Activities",
      content: [
        {
          subtitle: "Fraudulent Activities",
          text: "You may not engage in any fraudulent, deceptive, or misleading activities, including false advertising, misrepresentation of products, fake reviews, or any form of financial fraud.",
        },
        {
          subtitle: "Illegal Content",
          text: "You may not post, transmit, or distribute any content that is illegal, harmful, threatening, abusive, defamatory, obscene, or otherwise objectionable under applicable laws.",
        },
        {
          subtitle: "Intellectual Property Violations",
          text: "You may not infringe on the intellectual property rights of others, including copyrights, trademarks, patents, or trade secrets. Do not use unauthorized logos, images, or content.",
        },
        {
          subtitle: "System Interference",
          text: "You may not interfere with or disrupt our platform, servers, or networks. This includes introducing viruses, malware, or any code designed to harm or disable our systems.",
        },
        {
          subtitle: "Unauthorized Access",
          text: "You may not attempt to gain unauthorized access to our platform, other user accounts, or any systems or networks connected to our services.",
        },
        {
          subtitle: "Data Mining",
          text: "You may not use automated tools, bots, or scrapers to extract data from our platform without explicit written permission. This includes harvesting user information or product data.",
        },
      ],
    },
    {
      title: "Content Guidelines",
      content: [
        {
          subtitle: "Product Listings",
          text: "Product listings must be accurate, complete, and include all relevant information such as specifications, certifications, origin, and quality standards. Images must accurately represent the actual products.",
        },
        {
          subtitle: "User-Generated Content",
          text: "All content you submit, including reviews, messages, and forum posts, must be truthful, relevant, and respectful. Content should add value to the community and marketplace.",
        },
        {
          subtitle: "Prohibited Content",
          text: "Do not post content that is spam, off-topic, promotional (outside designated areas), discriminatory, harassing, or violates the privacy of others.",
        },
        {
          subtitle: "Content Ownership",
          text: "You retain ownership of content you create but grant us license to use it as necessary to provide our services. Ensure you have rights to any content you submit.",
        },
      ],
    },
    {
      title: "Trading and Transaction Guidelines",
      content: [
        {
          subtitle: "Good Faith Dealing",
          text: "Conduct all transactions in good faith. Honor your commitments, meet agreed-upon specifications, and communicate promptly about any issues or changes.",
        },
        {
          subtitle: "Quality Standards",
          text: "Suppliers must meet all stated quality standards and certifications. Buyers should clearly communicate their requirements and inspect products upon delivery.",
        },
        {
          subtitle: "Payment Terms",
          text: "Adhere to agreed payment terms and conditions. Process payments promptly and resolve any payment disputes through appropriate channels.",
        },
        {
          subtitle: "Dispute Resolution",
          text: "Work collaboratively to resolve disputes. Use our dispute resolution services when direct negotiation fails, and provide accurate information during the process.",
        },
      ],
    },
    {
      title: "Account Security",
      content: [
        {
          subtitle: "Account Protection",
          text: "Maintain the security of your account credentials. Use strong passwords, enable two-factor authentication when available, and do not share your login information.",
        },
        {
          subtitle: "Authorized Users",
          text: "You are responsible for all activities under your account. Only authorize trusted individuals to access your account and monitor their activities.",
        },
        {
          subtitle: "Security Incidents",
          text: "Report any suspected security breaches, unauthorized access, or suspicious activities immediately to our support team.",
        },
      ],
    },
    {
      title: "Privacy and Data Protection",
      content: [
        {
          subtitle: "Personal Information",
          text: "Respect the privacy of other users. Do not collect, store, or misuse personal information obtained through our platform for purposes outside of legitimate business transactions.",
        },
        {
          subtitle: "Data Sharing",
          text: "Only share personal or business information as necessary for transactions. Do not share sensitive information with unauthorized parties.",
        },
        {
          subtitle: "Compliance",
          text: "Comply with applicable data protection laws and regulations, including GDPR, CCPA, and other privacy legislation relevant to your jurisdiction.",
        },
      ],
    },
    {
      title: "Platform Integrity",
      content: [
        {
          subtitle: "Fair Competition",
          text: "Engage in fair competition. Do not manipulate reviews, ratings, or search results. Compete based on the quality of your products and services.",
        },
        {
          subtitle: "Market Manipulation",
          text: "Do not engage in activities designed to artificially inflate or deflate prices, create false demand, or manipulate market conditions.",
        },
        {
          subtitle: "System Resources",
          text: "Use platform resources responsibly. Do not overload our systems with excessive requests or consume unreasonable amounts of bandwidth or storage.",
        },
      ],
    },
    {
      title: "Compliance and Reporting",
      content: [
        {
          subtitle: "Regulatory Compliance",
          text: "Ensure compliance with all applicable regulations in your industry and jurisdiction, including food safety, import/export, and business licensing requirements.",
        },
        {
          subtitle: "Reporting Violations",
          text: "Report any violations of this policy or suspicious activities to our support team. We investigate all reports and take appropriate action.",
        },
        {
          subtitle: "Cooperation",
          text: "Cooperate with our investigations and provide accurate information when requested. Failure to cooperate may result in account suspension or termination.",
        },
      ],
    },
    {
      title: "Enforcement and Consequences",
      content: [
        {
          subtitle: "Policy Violations",
          text: "Violations of this policy may result in warnings, account restrictions, suspension, or permanent termination, depending on the severity and frequency of violations.",
        },
        {
          subtitle: "Content Removal",
          text: "We reserve the right to remove any content that violates this policy without prior notice. Repeated violations may result in account termination.",
        },
        {
          subtitle: "Legal Action",
          text: "Serious violations may result in legal action, including but not limited to civil lawsuits and cooperation with law enforcement agencies.",
        },
        {
          subtitle: "Appeal Process",
          text: "If you believe your account has been restricted or terminated in error, you may appeal through our designated process. Appeals will be reviewed fairly and promptly.",
        },
      ],
    },
  ];

  const reportingCategories = [
    {
      category: "Fraudulent Activity",
      description: "Fake products, misleading descriptions, payment fraud",
      contact: "fraud@procur.com",
      icon: "⚠️",
    },
    {
      category: "Inappropriate Content",
      description: "Spam, harassment, offensive material",
      contact: "abuse@procur.com",
      icon: "🚫",
    },
    {
      category: "Intellectual Property",
      description: "Copyright infringement, trademark violations",
      contact: "ip@procur.com",
      icon: "©️",
    },
    {
      category: "Security Issues",
      description: "Unauthorized access, data breaches, system vulnerabilities",
      contact: "security@procur.com",
      icon: "🔒",
    },
    {
      category: "Quality Concerns",
      description: "Product quality issues, certification problems",
      contact: "quality@procur.com",
      icon: "✅",
    },
    {
      category: "General Violations",
      description: "Other policy violations or concerns",
      contact: "support@procur.com",
      icon: "📧",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--secondary-black)] text-balance">
            Usage Policy
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            Guidelines for acceptable use of our platform. These policies help
            maintain a safe, trustworthy, and productive marketplace for all
            users.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Last updated: {lastUpdated}
          </div>
          <div className="mt-10">
            <div className="relative mx-auto rounded-3xl overflow-hidden shadow-xl border border-black/5 w-full max-w-6xl h-96 md:h-[520px]">
              <Image
                src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                alt="Usage policy and platform guidelines"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-20">
        {/* Introduction */}
        <section className="mb-16">
          <div className="card">
            <p className="text-lg text-gray-700 leading-8 first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:leading-[0.9]">
              This Usage Policy outlines the acceptable use of Procur's platform
              and services. By using our platform, you agree to comply with
              these guidelines and help us maintain a professional, secure, and
              trustworthy marketplace.
            </p>
            <p className="mt-6 text-gray-700 leading-8">
              These policies apply to all users, including buyers, suppliers,
              and any other parties who access our services. Violations may
              result in account restrictions or termination.
            </p>
          </div>
        </section>

        {/* Policy Sections */}
        {sections.map((section, sectionIndex) => (
          <section key={sectionIndex} className="mb-12">
            <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
              {sectionIndex + 1}. {section.title}
            </h2>
            <div className="space-y-6">
              {section.content.map((item, itemIndex) => (
                <div key={itemIndex} className="card">
                  <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-3">
                    {item.subtitle}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Reporting Section */}
        <section className="mt-16 mb-16">
          <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
            Report Policy Violations
          </h2>
          <p className="text-gray-700 mb-8">
            Help us maintain platform integrity by reporting violations. Choose
            the appropriate category below for fastest response:
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportingCategories.map((category, index) => (
              <div
                key={index}
                className="card hover:shadow-lg transition-all duration-200"
              >
                <div className="text-2xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                  {category.category}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {category.description}
                </p>
                <a
                  href={`mailto:${category.contact}`}
                  className="text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] font-medium text-sm transition-colors duration-200"
                >
                  {category.contact}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
            Best Practices for Success
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="card">
                <h3 className="font-semibold text-[var(--secondary-black)] mb-3">
                  For Suppliers
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)] mt-2 flex-shrink-0" />
                    Maintain accurate product listings and inventory
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)] mt-2 flex-shrink-0" />
                    Respond promptly to buyer inquiries
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)] mt-2 flex-shrink-0" />
                    Meet quality standards and delivery commitments
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)] mt-2 flex-shrink-0" />
                    Keep certifications and documentation current
                  </li>
                </ul>
              </div>

              <div className="card">
                <h3 className="font-semibold text-[var(--secondary-black)] mb-3">
                  For Buyers
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)] mt-2 flex-shrink-0" />
                    Clearly communicate requirements and specifications
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)] mt-2 flex-shrink-0" />
                    Process payments according to agreed terms
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)] mt-2 flex-shrink-0" />
                    Provide constructive feedback and reviews
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)] mt-2 flex-shrink-0" />
                    Report quality issues promptly and fairly
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card">
                <h3 className="font-semibold text-[var(--secondary-black)] mb-3">
                  Communication Guidelines
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)] mt-2 flex-shrink-0" />
                    Use professional and respectful language
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)] mt-2 flex-shrink-0" />
                    Respond to messages within 24 hours
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)] mt-2 flex-shrink-0" />
                    Keep discussions relevant to business matters
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)] mt-2 flex-shrink-0" />
                    Document important agreements and changes
                  </li>
                </ul>
              </div>

              <div className="card">
                <h3 className="font-semibold text-[var(--secondary-black)] mb-3">
                  Security Best Practices
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)] mt-2 flex-shrink-0" />
                    Use strong, unique passwords for your account
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)] mt-2 flex-shrink-0" />
                    Enable two-factor authentication when available
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)] mt-2 flex-shrink-0" />
                    Log out from shared or public computers
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)] mt-2 flex-shrink-0" />
                    Report suspicious activities immediately
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mt-16">
          <div className="card bg-gradient-to-br from-[var(--primary-background)] to-white border border-[var(--primary-accent2)]/20">
            <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-4">
              Questions About Usage Policy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you have questions about this Usage Policy or need
              clarification on acceptable use guidelines, please contact us:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                  Policy Questions
                </h3>
                <a
                  href="mailto:legal@procur.com"
                  className="text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] transition-colors"
                >
                  legal@procur.com
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                  General Support
                </h3>
                <a
                  href="mailto:support@procur.com"
                  className="text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] transition-colors"
                >
                  support@procur.com
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Related Policies */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
            Related Policies
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="/legal/terms"
              className="card hover:shadow-lg transition-all duration-200 group"
            >
              <h3 className="font-semibold text-[var(--secondary-black)] group-hover:text-[var(--primary-accent2)] transition-colors mb-2">
                Terms of Service
              </h3>
              <p className="text-gray-600 text-sm">
                Platform usage terms and conditions
              </p>
            </a>
            <a
              href="/legal/privacy"
              className="card hover:shadow-lg transition-all duration-200 group"
            >
              <h3 className="font-semibold text-[var(--secondary-black)] group-hover:text-[var(--primary-accent2)] transition-colors mb-2">
                Privacy Policy
              </h3>
              <p className="text-gray-600 text-sm">
                How we collect and protect your data
              </p>
            </a>
            <a
              href="/legal/cookies"
              className="card hover:shadow-lg transition-all duration-200 group"
            >
              <h3 className="font-semibold text-[var(--secondary-black)] group-hover:text-[var(--primary-accent2)] transition-colors mb-2">
                Cookie Policy
              </h3>
              <p className="text-gray-600 text-sm">
                How we use cookies and tracking
              </p>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
