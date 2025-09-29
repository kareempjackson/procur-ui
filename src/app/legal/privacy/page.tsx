import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Privacy Policy - Procur",
  description:
    "Procur's Privacy Policy. Learn how we collect, use, and protect your personal information on our produce procurement platform.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "January 15, 2025";

  const sections = [
    {
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          text: "We collect personal information you provide directly to us, such as when you create an account, make a purchase, or contact us. This includes your name, email address, phone number, business information, and payment details.",
        },
        {
          subtitle: "Usage Information",
          text: "We automatically collect information about how you use our platform, including your IP address, browser type, device information, pages visited, and interaction patterns. This helps us improve our services and user experience.",
        },
        {
          subtitle: "Business Information",
          text: "For suppliers and buyers, we collect business-related information including company details, certifications, product specifications, transaction history, and quality ratings to facilitate marketplace operations.",
        },
        {
          subtitle: "Location Data",
          text: "We may collect location information to provide location-based services, optimize logistics, and ensure compliance with regional regulations. You can control location sharing through your device settings.",
        },
      ],
    },
    {
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Platform Operations",
          text: "We use your information to operate our marketplace, process transactions, facilitate communications between buyers and suppliers, and provide customer support services.",
        },
        {
          subtitle: "Service Improvement",
          text: "We analyze usage patterns and feedback to improve our platform features, develop new services, and enhance user experience. This includes personalizing content and recommendations.",
        },
        {
          subtitle: "Communication",
          text: "We use your contact information to send important updates about your account, transactions, platform changes, and promotional materials (which you can opt out of at any time).",
        },
        {
          subtitle: "Legal Compliance",
          text: "We may use your information to comply with legal obligations, enforce our terms of service, protect our rights and property, and ensure platform security and integrity.",
        },
      ],
    },
    {
      title: "Information Sharing",
      content: [
        {
          subtitle: "With Other Users",
          text: "We share necessary business information between buyers and suppliers to facilitate transactions, including contact details, product specifications, and transaction history.",
        },
        {
          subtitle: "Service Providers",
          text: "We share information with trusted third-party service providers who help us operate our platform, including payment processors, logistics partners, and technology vendors.",
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose information when required by law, court order, or government request, or when necessary to protect our rights, property, or the safety of our users.",
        },
        {
          subtitle: "Business Transfers",
          text: "In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity, subject to the same privacy protections outlined in this policy.",
        },
      ],
    },
    {
      title: "Data Security",
      content: [
        {
          subtitle: "Security Measures",
          text: "We implement industry-standard security measures including encryption, secure data centers, regular security audits, and access controls to protect your personal information from unauthorized access, disclosure, or misuse.",
        },
        {
          subtitle: "Payment Security",
          text: "All payment processing is handled by PCI DSS compliant payment processors. We do not store complete credit card information on our servers and use tokenization for secure payment processing.",
        },
        {
          subtitle: "Data Breach Response",
          text: "In the unlikely event of a data breach, we will notify affected users and relevant authorities as required by law, and take immediate steps to secure the affected systems and prevent further unauthorized access.",
        },
      ],
    },
    {
      title: "Your Rights and Choices",
      content: [
        {
          subtitle: "Account Access",
          text: "You can access, update, or delete your account information at any time through your account settings. You can also request a copy of your personal data by contacting our support team.",
        },
        {
          subtitle: "Communication Preferences",
          text: "You can opt out of promotional emails by clicking the unsubscribe link in any email or updating your communication preferences in your account settings. Transactional emails cannot be disabled.",
        },
        {
          subtitle: "Data Deletion",
          text: "You can request deletion of your personal data, subject to legal and contractual obligations. Some information may be retained for legitimate business purposes or legal compliance.",
        },
        {
          subtitle: "Cookie Controls",
          text: "You can control cookie preferences through your browser settings or our cookie preference center. Note that disabling certain cookies may affect platform functionality.",
        },
      ],
    },
    {
      title: "International Data Transfers",
      content: [
        {
          subtitle: "Cross-Border Transfers",
          text: "Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your data during international transfers.",
        },
        {
          subtitle: "Adequacy Decisions",
          text: "We rely on adequacy decisions, standard contractual clauses, and other approved transfer mechanisms to ensure your data receives adequate protection when transferred internationally.",
        },
      ],
    },
    {
      title: "Children's Privacy",
      content: [
        {
          subtitle: "Age Restrictions",
          text: "Our platform is not intended for children under 18 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child, we will take steps to delete it promptly.",
        },
      ],
    },
    {
      title: "Changes to This Policy",
      content: [
        {
          subtitle: "Policy Updates",
          text: "We may update this privacy policy from time to time to reflect changes in our practices, technology, or legal requirements. We will notify users of material changes through email or platform notifications.",
        },
        {
          subtitle: "Continued Use",
          text: "Your continued use of our platform after policy changes constitutes acceptance of the updated policy. We encourage you to review this policy periodically to stay informed about our privacy practices.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--secondary-black)] text-balance">
            Privacy Policy
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            We're committed to protecting your privacy and being transparent
            about how we collect, use, and share your information. This policy
            explains our data practices in detail.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Last updated: {lastUpdated}
          </div>
          <div className="mt-10">
            <div className="relative mx-auto rounded-3xl overflow-hidden shadow-xl border border-black/5 w-full max-w-6xl h-96 md:h-[520px]">
              <Image
                src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                alt="Privacy and data protection"
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
              At Procur, we understand that trust is fundamental to our
              marketplace. This Privacy Policy describes how we collect, use,
              protect, and share information about you when you use our produce
              procurement platform and related services.
            </p>
            <p className="mt-6 text-gray-700 leading-8">
              This policy applies to all users of our platform, including
              buyers, suppliers, and visitors to our website. By using Procur,
              you agree to the collection and use of information in accordance
              with this policy.
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

        {/* Contact Information */}
        <section className="mt-16">
          <div className="card bg-gradient-to-br from-[var(--primary-background)] to-white border border-[var(--primary-accent2)]/20">
            <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-4">
              Contact Us About Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you have questions about this Privacy Policy, our data
              practices, or would like to exercise your privacy rights, please
              contact us:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                  Email
                </h3>
                <a
                  href="mailto:privacy@procur.com"
                  className="text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] transition-colors"
                >
                  privacy@procur.com
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                  Mailing Address
                </h3>
                <div className="text-gray-700 text-sm">
                  <p>Procur, Inc.</p>
                  <p>Attn: Privacy Officer</p>
                  <p>123 Market Street, Suite 400</p>
                  <p>San Francisco, CA 94105</p>
                </div>
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
            <a
              href="/legal/usage"
              className="card hover:shadow-lg transition-all duration-200 group"
            >
              <h3 className="font-semibold text-[var(--secondary-black)] group-hover:text-[var(--primary-accent2)] transition-colors mb-2">
                Usage Policy
              </h3>
              <p className="text-gray-600 text-sm">
                Acceptable use and conduct guidelines
              </p>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
