import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions - Procur",
  description:
    "Procur's Terms & Conditions. Understand the rules for using our marketplace, logistics, and delivery services.",
};

export default function TermsOfServicePage() {
  const effectiveDate = "December 5, 2025";

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--secondary-black)] text-balance">
            Terms &amp; Conditions
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            These Terms &amp; Conditions (&quot;Terms&quot;) govern your use of
            the Procur platform (&quot;the Service&quot;). By accessing or using
            Procur, you agree to be bound by these Terms.
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
              These Terms &amp; Conditions (&quot;Terms&quot;) govern your use
              of the Procur platform (&quot;the Service&quot;). By accessing or
              using Procur, you agree to be bound by these Terms.
            </p>
          </div>
        </section>

        {/* 1. Definitions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
            1. Definitions
          </h2>
          <div className="card space-y-3">
            <p className="text-gray-700 leading-relaxed">
              <span className="font-semibold">“User”</span> refers to farmers,
              buyers, logistics partners, and any individual accessing the
              platform.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <span className="font-semibold">“Platform”</span> refers to the
              Procur website, app, and associated systems.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <span className="font-semibold">“Produce”</span> refers to
              agricultural goods listed or purchased through the platform.
            </p>
          </div>
        </section>

        {/* 2. Eligibility */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
            2. Eligibility
          </h2>
          <div className="card">
            <p className="text-gray-700 leading-relaxed">
              You must be at least 18 years old and legally authorized to enter
              contracts to use the platform.
            </p>
          </div>
        </section>

        {/* 3. User Responsibilities */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
            3. User Responsibilities
          </h2>
          <div className="space-y-8">
            <div className="card">
              <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-3">
                3.1 Farmers
              </h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>
                  Provide accurate details about produce, pricing, and
                  availability
                </li>
                <li>Ensure honest representation of quality</li>
                <li>Prepare items for pickup at agreed times</li>
              </ul>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-3">
                3.2 Buyers
              </h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Place accurate orders</li>
                <li>Ensure timely payment (cash, digital, or invoiced)</li>
                <li>Provide correct delivery information</li>
              </ul>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-3">
                3.3 Logistics Partners
              </h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Execute pickups and deliveries on time</li>
                <li>Handle produce responsibly</li>
                <li>Maintain professionalism and safety standards</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. Platform Responsibilities */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
            4. Platform Responsibilities
          </h2>
          <div className="card space-y-3 text-gray-700 leading-relaxed">
            <p>Procur will:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Facilitate listings, orders, and delivery coordination</li>
              <li>Provide customer support</li>
              <li>Maintain reasonable uptime and service quality</li>
              <li>Ensure proper handling of personal and transactional data</li>
            </ul>
            <p className="mt-3">
              Procur does not guarantee availability of produce or pricing set
              by farmers.
            </p>
          </div>
        </section>

        {/* 5. Payments */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
            5. Payments
          </h2>
          <div className="card space-y-3 text-gray-700 leading-relaxed">
            <p>Payments may be made via:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Cash</li>
              <li>Bank transfer</li>
              <li>Mobile wallets (when available)</li>
              <li>Invoice billing for approved buyers</li>
            </ul>
            <p className="mt-3">
              Procur reserves the right to suspend accounts with overdue
              payments.
            </p>
          </div>
        </section>

        {/* 6. Delivery & Logistics */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
            6. Delivery &amp; Logistics
          </h2>
          <div className="card">
            <p className="text-gray-700 leading-relaxed">
              Delivery windows are estimates. Procur will make reasonable
              efforts to ensure timely delivery but is not liable for delays
              caused by weather, traffic, farming conditions, or other external
              factors.
            </p>
          </div>
        </section>

        {/* 7. Disputes & Refunds */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
            7. Disputes &amp; Refunds
          </h2>
          <div className="card">
            <p className="text-gray-700 leading-relaxed">
              Buyers must report issues within 24 hours of delivery. Procur may
              investigate and, at its discretion, issue refunds or credits.
              Farmers may dispute buyer claims, subject to verification.
            </p>
          </div>
        </section>

        {/* 8. Prohibited Activities */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
            8. Prohibited Activities
          </h2>
          <div className="card">
            <p className="text-gray-700 leading-relaxed">Users must not:</p>
            <ul className="mt-3 list-disc pl-6 space-y-1 text-gray-700">
              <li>Provide false or misleading information</li>
              <li>Attempt to bypass the platform for transactions</li>
              <li>Upload harmful or malicious content</li>
              <li>Harass or abuse staff, farmers, or buyers</li>
            </ul>
            <p className="mt-3 text-gray-700 leading-relaxed">
              Violations may result in suspension or termination of access.
            </p>
          </div>
        </section>

        {/* 9. Limitation of Liability */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
            9. Limitation of Liability
          </h2>
          <div className="card space-y-3 text-gray-700 leading-relaxed">
            <p>Procur is not liable for:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Produce quality beyond what was reasonably represented</li>
              <li>
                Losses from delays, shortages, or inaccuracies caused by
                external factors
              </li>
              <li>Any indirect, incidental, or consequential damages</li>
            </ul>
            <p className="mt-3">
              Your use of the platform is at your own risk.
            </p>
          </div>
        </section>

        {/* 10. Termination */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
            10. Termination
          </h2>
          <div className="card text-gray-700 leading-relaxed space-y-3">
            <p>
              Procur may suspend or terminate your account if you violate these
              Terms or engage in harmful behavior.
            </p>
            <p>
              Users may deactivate their accounts by contacting{" "}
              <a
                href="mailto:support@procurapp.co"
                className="text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] transition-colors"
              >
                support@procurapp.co
              </a>
              .
            </p>
          </div>
        </section>

        {/* 11. Governing Law */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
            11. Governing Law
          </h2>
          <div className="card">
            <p className="text-gray-700 leading-relaxed">
              These Terms are governed by the laws of Grenada.
            </p>
          </div>
        </section>

        {/* 12. Contact Information */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
            12. Contact Information
          </h2>
          <div className="card">
            <p className="text-gray-700 leading-relaxed">
              Questions or concerns may be directed to:{" "}
              <a
                href="mailto:support@procurapp.co"
                className="text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] transition-colors"
              >
                support@procurapp.co
              </a>
              .
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mt-16">
          <div className="card bg-gradient-to-br from-[var(--primary-background)] to-white border border-[var(--primary-accent2)]/20">
            <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-4">
              Questions About These Terms
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you have questions about these Terms &amp; Conditions or need
              clarification on any provisions, please contact us:
            </p>
            <div>
              <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                Email
              </h3>
              <a
                href="mailto:support@procurapp.co"
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
