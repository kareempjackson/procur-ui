import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Procur",
  description:
    "Procur's Privacy Policy. Learn how we collect, use, and protect your personal information on our produce procurement platform.",
};

export default function PrivacyPolicyPage() {
  const effectiveDate = "December 5, 2025";

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
            Procur (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is
            committed to protecting the privacy and confidentiality of everyone
            who uses our platform, including farmers, buyers, agents, and
            partners. This Privacy Policy explains how we collect, use, store,
            and protect your personal information.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Effective Date: {effectiveDate}
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-20">
        {/* Introduction */}
        <section className="mb-16">
          <div className="card">
            <p className="text-lg text-gray-700 leading-8 first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:leading-[0.9]">
              This Privacy Policy applies to everyone who uses our platform,
              including farmers, buyers, agents, and partners. By using Procur,
              you agree to the collection, use, and protection of your
              information as described below.
            </p>
          </div>
        </section>

        {/* 1. Information We Collect */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
            1. Information We Collect
          </h2>
          <div className="space-y-8">
            <div className="card">
              <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-3">
                1.1 Personal Information
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We collect personal information you provide when you sign up,
                use our services, or communicate with us, including:
              </p>
              <ul className="mt-3 list-disc pl-6 space-y-1 text-gray-700">
                <li>Name</li>
                <li>Phone number</li>
                <li>Email address</li>
                <li>Business name (for buyers)</li>
                <li>Farm name and location (for farmers)</li>
              </ul>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-3">
                1.2 Transaction &amp; Platform Data
              </h3>
              <p className="text-gray-700 leading-relaxed">
                As you use Procur, we collect information related to your
                activity on the platform, such as:
              </p>
              <ul className="mt-3 list-disc pl-6 space-y-1 text-gray-700">
                <li>Orders placed</li>
                <li>Delivery schedules</li>
                <li>Payment details (excluding full card numbers)</li>
                <li>Produce listings</li>
                <li>Communication logs with support</li>
              </ul>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-3">
                1.3 Technical Information
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We also collect certain technical data to help us secure and
                improve the platform, including:
              </p>
              <ul className="mt-3 list-disc pl-6 space-y-1 text-gray-700">
                <li>IP address</li>
                <li>Device type</li>
                <li>Browser information</li>
                <li>
                  Usage analytics for improving platform performance and
                  reliability
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 2. How We Use Your Information */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
            2. How We Use Your Information
          </h2>
          <div className="card">
            <p className="text-gray-700 leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-1 text-gray-700">
              <li>Provide marketplace, logistics, and delivery services</li>
              <li>Process and manage orders and payments</li>
              <li>Verify farmer, buyer, and partner accounts</li>
              <li>
                Improve platform features, usability, and overall user
                experience
              </li>
              <li>
                Communicate updates, receipts, notifications, and support
                responses
              </li>
              <li>
                Generate anonymized agricultural insights and platform analytics
              </li>
            </ul>
            <p className="mt-4 text-gray-700 leading-relaxed font-semibold">
              We do not sell your data to third parties.
            </p>
          </div>
        </section>

        {/* 3. Sharing of Information */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
            3. Sharing of Information
          </h2>
          <div className="card">
            <p className="text-gray-700 leading-relaxed">
              We only share your information when it is necessary to deliver
              Procur’s services or when required by law. This may include:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-1 text-gray-700">
              <li>Logistics partners for pickups and deliveries</li>
              <li>Payment processors for secure billing and settlements</li>
              <li>Regulatory authorities, if required by applicable law</li>
              <li>
                Data analytics providers, but only in anonymized or aggregated
                form
              </li>
            </ul>
            <p className="mt-4 text-gray-700 leading-relaxed">
              Any sharing of information is strictly limited to the purpose of
              operating, maintaining, and improving Procur’s services.
            </p>
          </div>
        </section>

        {/* 4. Data Security */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
            4. Data Security
          </h2>
          <div className="card">
            <p className="text-gray-700 leading-relaxed">
              We implement reasonable administrative, technical, and physical
              safeguards to protect your data from unauthorized access,
              alteration, or loss. While we work hard to secure your
              information, no online system is entirely risk-free. We encourage
              you to use strong passwords, keep your login details confidential,
              and report any suspicious activity to us immediately.
            </p>
          </div>
        </section>

        {/* 5. Data Retention */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
            5. Data Retention
          </h2>
          <div className="card">
            <p className="text-gray-700 leading-relaxed">
              We retain your information for as long as your account is active
              or as needed to provide Procur’s services. We may also retain
              certain information for a longer period if required for legal,
              regulatory, accounting, or operational purposes.
            </p>
          </div>
        </section>

        {/* 6. Your Rights */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
            6. Your Rights
          </h2>
          <div className="card">
            <p className="text-gray-700 leading-relaxed">
              You have the right, subject to applicable law, to:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-1 text-gray-700">
              <li>Access the personal information we hold about you</li>
              <li>
                Request corrections to inaccurate or incomplete information
              </li>
              <li>
                Request deletion of your personal information, where legally
                permissible
              </li>
              <li>
                Object to or restrict certain types of processing in specific
                circumstances
              </li>
              <li>
                Contact us with questions or concerns about how your data is
                handled
              </li>
            </ul>
            <p className="mt-4 text-gray-700 leading-relaxed">
              To exercise any of these rights, please reach out to us using the
              contact details in the &quot;Contact Us About Privacy&quot;
              section below.
            </p>
          </div>
        </section>

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
            <div>
              <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                Email
              </h3>
              <a
                href="mailto:privacy@procur.com"
                className="text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] transition-colors"
              >
                support@procurapp.co
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
