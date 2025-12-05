import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Procur",
  description:
    "Get in touch with the Procur team for support, questions, or partnership inquiries.",
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      {/* Simple hero */}
      <section className="max-w-3xl mx-auto px-6 pt-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--secondary-black)] text-balance">
            Contact Us
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            If you need help with Procur or want to talk about working together,
            you can reach our team using the details below.
          </p>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Contact card */}
        <section>
          <div className="card">
            <h2 className="text-2xl font-semibold text-[var(--secondary-black)] mb-4">
              How to reach us
            </h2>
            <p className="text-gray-700 mb-4">
              Our team monitors this inbox and aims to respond as quickly as
              possible during business hours.
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-[var(--secondary-black)] mb-1">
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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
