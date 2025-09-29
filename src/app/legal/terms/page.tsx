import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Terms of Service - Procur",
  description:
    "Procur's Terms of Service. Understand the terms and conditions for using our produce procurement platform and marketplace services.",
};

export default function TermsOfServicePage() {
  const lastUpdated = "January 15, 2025";

  const sections = [
    {
      title: "Acceptance of Terms",
      content: [
        {
          subtitle: "Agreement to Terms",
          text: "By accessing or using Procur's platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using our services.",
        },
        {
          subtitle: "Eligibility",
          text: "You must be at least 18 years old and have the legal authority to enter into contracts to use our platform. By using our services, you represent and warrant that you meet these requirements.",
        },
        {
          subtitle: "Business Use",
          text: "Our platform is designed for business-to-business transactions in the produce industry. Personal or consumer use is not permitted unless specifically authorized.",
        },
      ],
    },
    {
      title: "Platform Services",
      content: [
        {
          subtitle: "Marketplace Services",
          text: "Procur provides a digital marketplace platform that connects produce buyers and suppliers. We facilitate transactions but are not a party to the underlying contracts between users.",
        },
        {
          subtitle: "Additional Services",
          text: "We may offer additional services including logistics coordination, quality assurance, payment processing, and business intelligence tools. These services are subject to separate terms and conditions.",
        },
        {
          subtitle: "Service Availability",
          text: "We strive to maintain platform availability but do not guarantee uninterrupted service. We may temporarily suspend services for maintenance, updates, or other operational reasons.",
        },
      ],
    },
    {
      title: "User Accounts and Registration",
      content: [
        {
          subtitle: "Account Creation",
          text: "To use our platform, you must create an account and provide accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account credentials.",
        },
        {
          subtitle: "Verification Process",
          text: "All users must complete our verification process, which may include business documentation, certifications, and background checks. We reserve the right to reject applications or suspend accounts that fail verification.",
        },
        {
          subtitle: "Account Responsibility",
          text: "You are responsible for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account or any other breach of security.",
        },
      ],
    },
    {
      title: "User Conduct and Responsibilities",
      content: [
        {
          subtitle: "Acceptable Use",
          text: "You agree to use our platform only for lawful purposes and in accordance with these terms. You will not engage in any activity that could harm, disable, or impair our platform or interfere with other users' access.",
        },
        {
          subtitle: "Prohibited Activities",
          text: "You may not use our platform to transmit harmful content, engage in fraudulent activities, violate intellectual property rights, or circumvent security measures. Detailed prohibited activities are outlined in our Usage Policy.",
        },
        {
          subtitle: "Content Standards",
          text: "All content you submit must be accurate, lawful, and not infringe on third-party rights. You are solely responsible for the content you post and its compliance with applicable laws and regulations.",
        },
      ],
    },
    {
      title: "Transactions and Payments",
      content: [
        {
          subtitle: "Transaction Terms",
          text: "Transactions between buyers and suppliers are governed by the specific terms agreed upon by the parties. Procur facilitates these transactions but is not responsible for the performance of either party.",
        },
        {
          subtitle: "Payment Processing",
          text: "We use third-party payment processors to handle transactions. By using our payment services, you agree to the terms and conditions of our payment partners and authorize us to charge your designated payment method.",
        },
        {
          subtitle: "Fees and Charges",
          text: "We charge transaction fees and other service fees as outlined in our fee schedule. All fees are non-refundable unless otherwise specified. We reserve the right to change our fee structure with appropriate notice.",
        },
        {
          subtitle: "Disputes",
          text: "We provide dispute resolution services for transaction-related issues. However, we are not obligated to resolve disputes and may require parties to resolve issues directly or through legal channels.",
        },
      ],
    },
    {
      title: "Intellectual Property",
      content: [
        {
          subtitle: "Platform Rights",
          text: "Procur owns all rights, title, and interest in our platform, including software, trademarks, copyrights, and other intellectual property. You may not copy, modify, or distribute our platform without permission.",
        },
        {
          subtitle: "User Content",
          text: "You retain ownership of content you submit but grant us a license to use, display, and distribute your content as necessary to provide our services. You represent that you have the right to grant this license.",
        },
        {
          subtitle: "Trademark Policy",
          text: "You may not use our trademarks, logos, or brand names without our prior written consent. Any unauthorized use of our intellectual property may result in account termination and legal action.",
        },
      ],
    },
    {
      title: "Privacy and Data Protection",
      content: [
        {
          subtitle: "Privacy Policy",
          text: "Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these terms by reference. By using our services, you consent to our privacy practices.",
        },
        {
          subtitle: "Data Security",
          text: "We implement reasonable security measures to protect user data, but we cannot guarantee absolute security. You are responsible for maintaining the security of your account and any sensitive information you share.",
        },
      ],
    },
    {
      title: "Disclaimers and Limitations",
      content: [
        {
          subtitle: "Service Disclaimers",
          text: "Our platform is provided 'as is' without warranties of any kind. We disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement.",
        },
        {
          subtitle: "Limitation of Liability",
          text: "To the maximum extent permitted by law, Procur shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our platform, even if we have been advised of the possibility of such damages.",
        },
        {
          subtitle: "Maximum Liability",
          text: "Our total liability to you for all claims arising from your use of our platform shall not exceed the amount you paid to us in the twelve months preceding the claim.",
        },
      ],
    },
    {
      title: "Indemnification",
      content: [
        {
          subtitle: "User Indemnification",
          text: "You agree to indemnify and hold harmless Procur, its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of our platform, violation of these terms, or infringement of third-party rights.",
        },
      ],
    },
    {
      title: "Termination",
      content: [
        {
          subtitle: "Termination Rights",
          text: "Either party may terminate this agreement at any time. We may suspend or terminate your account immediately for violation of these terms, illegal activity, or other reasons at our sole discretion.",
        },
        {
          subtitle: "Effect of Termination",
          text: "Upon termination, your right to use our platform ceases immediately. Provisions regarding intellectual property, indemnification, and limitations of liability survive termination.",
        },
      ],
    },
    {
      title: "Governing Law and Disputes",
      content: [
        {
          subtitle: "Governing Law",
          text: "These terms are governed by the laws of the State of California, without regard to conflict of law principles. Any disputes will be resolved in the courts of San Francisco County, California.",
        },
        {
          subtitle: "Dispute Resolution",
          text: "Before filing any lawsuit, you agree to first attempt to resolve disputes through good faith negotiations. If unsuccessful, disputes may be resolved through binding arbitration as outlined in our dispute resolution procedures.",
        },
      ],
    },
    {
      title: "General Provisions",
      content: [
        {
          subtitle: "Entire Agreement",
          text: "These terms, together with our Privacy Policy and other referenced policies, constitute the entire agreement between you and Procur regarding your use of our platform.",
        },
        {
          subtitle: "Modifications",
          text: "We may modify these terms at any time by posting updated terms on our platform. Your continued use after modifications constitutes acceptance of the new terms.",
        },
        {
          subtitle: "Severability",
          text: "If any provision of these terms is found to be unenforceable, the remaining provisions will remain in full force and effect.",
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
            Terms of Service
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            These terms govern your use of Procur's platform and services.
            Please read them carefully as they contain important information
            about your rights and obligations.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Last updated: {lastUpdated}
          </div>
          <div className="mt-10">
            <div className="relative mx-auto rounded-3xl overflow-hidden shadow-xl border border-black/5 w-full max-w-6xl h-96 md:h-[520px]">
              <Image
                src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                alt="Terms and legal agreements"
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
              Welcome to Procur. These Terms of Service ("Terms") govern your
              access to and use of our produce procurement platform and related
              services. By using our platform, you enter into a legally binding
              agreement with Procur, Inc.
            </p>
            <p className="mt-6 text-gray-700 leading-8">
              These terms apply to all users of our platform, including buyers,
              suppliers, and any other parties who access our services. Please
              read these terms carefully before using our platform.
            </p>
          </div>
        </section>

        {/* Terms Sections */}
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
              Questions About These Terms
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you have questions about these Terms of Service or need
              clarification on any provisions, please contact our legal team:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                  Email
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
                  Mailing Address
                </h3>
                <div className="text-gray-700 text-sm">
                  <p>Procur, Inc.</p>
                  <p>Attn: Legal Department</p>
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
