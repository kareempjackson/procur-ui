import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Procur",
  description:
    "Learn what Procur does and how we support farmers, buyers, and logistics partners.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      {/* Simple hero */}
      <section className="max-w-4xl mx-auto px-6 pt-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--secondary-black)] text-balance">
            About Procur
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Procur connects farmers, buyers, and logistics partners so fresh
            produce can move more reliably, transparently, and safely.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Short narrative */}
        <section className="mb-16">
          <div className="card">
            <p className="text-gray-700 leading-7">
              We focus on the basics that matter most in produce: clear
              standards, dependable delivery, and simple tools for getting work
              done. Our platform helps farmers reach the right buyers, gives
              buyers confidence in quality and timing, and makes coordination
              easier for everyone involved.
            </p>
          </div>
        </section>

        {/* What we do */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-4">
            What Procur does
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold mb-2">For farmers</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Publish offers, confirm orders, and get clearer visibility into
                demand and logistics.
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold mb-2">For buyers</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                See reliable options, agree on terms, and track orders from
                confirmation to delivery.
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold mb-2">For logistics</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Coordinate routes, pickups, and drops with the information you
                need in one place.
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold mb-2">For the system</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Support safer, more transparent trade that reduces waste and
                builds long-term relationships.
              </p>
            </div>
          </div>
        </section>

        {/* Simple CTA */}
        <section className="mb-8">
          <div className="card text-center">
            <h2 className="text-xl font-semibold text-[var(--secondary-black)] mb-3">
              Work with Procur
            </h2>
            <p className="text-gray-700 mb-5">
              If you&apos;d like to use Procur or explore a partnership, you can
              create an account or reach out to our team.
            </p>
            <div className="flex justify-center gap-3">
              <a href="/signup" className="btn btn-primary px-6 py-2 text-sm">
                Get started
              </a>
              <a
                href="mailto:support@procurapp.co"
                className="btn btn-ghost px-6 py-2 text-sm"
              >
                Contact us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
