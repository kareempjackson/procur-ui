import TopNavigation from "@/components/navigation/TopNavigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Suppliers - Procur",
  description:
    "See how Procur helps suppliers turn reliable demand, clear logistics, and predictable payments into a calmer, more profitable business.",
};

export default function SupplierPortalPage() {
  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      {/* Hero / story header */}
      <section className="max-w-4xl mx-auto px-6 pt-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--secondary-black)] text-balance">
            How Procur helps suppliers grow with less chaos
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            We help you turn good crops into good business: steadier demand,
            fewer surprises on delivery day, and clearer cash flow.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        {/* Before vs with Procur */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-xl font-semibold text-[var(--secondary-black)] mb-3">
              Before Procur
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              Most suppliers we work with started here:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>Orders arriving by calls, texts, and screenshots</li>
              <li>Last‑minute changes that disrupt harvest and packing</li>
              <li>No single place to see who owes what, and when</li>
              <li>Guesswork around which buyers will reorder next week</li>
            </ul>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-[var(--secondary-black)] mb-3">
              With Procur
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              We give you one place to manage the important parts of your
              business:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>Clear order requests you can confirm or adjust in a click</li>
              <li>Shared view of quantities, pricing, and delivery windows</li>
              <li>
                Simple tracking from &quot;promised&quot; to &quot;paid&quot;
              </li>
              <li>Signals about repeat buyers and growing relationships</li>
            </ul>
          </div>
        </section>

        {/* A day in the life */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-[var(--secondary-black)]">
            A day in the life with Procur
          </h2>
          <div className="card space-y-4">
            <div>
              <h3 className="font-semibold text-[var(--secondary-black)]">
                Morning: know what is coming
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                You start the day with a single view of confirmed orders:
                varieties, volumes, and delivery dates. You can adjust
                availability in a few clicks so the sales you agree to match
                what the field can actually produce.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--secondary-black)]">
                During the day: ship with confidence
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                As trucks are loaded, everyone sees the same plan: which pallets
                are going where, who is receiving them, and when. Fewer
                last‑minute phone calls, fewer surprises at the dock.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--secondary-black)]">
                End of week: see how you are doing
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Instead of piecing numbers together from messages and notebooks,
                you can glance at volumes sold, on‑time performance, and what is
                still outstanding on payments. It becomes easier to decide what
                to plant, who to prioritize, and where to improve.
              </p>
            </div>
          </div>
        </section>

        {/* What you get as a supplier */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--secondary-black)]">
            What we help suppliers with
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                Make demand more predictable
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                We help you turn irregular enquiries into recurring orders, so
                you can plan harvest, packing, and labor with more confidence.
              </p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                Protect your time and margins
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Clear terms up front mean fewer disputes later. That leaves more
                time for managing fields and teams, not chasing paperwork.
              </p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                Build better buyer relationships
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Consistency builds trust. Procur makes it easier to keep your
                promises, communicate changes early, and become a preferred
                supplier.
              </p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                Keep money flowing
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                You see what has been delivered, what has been invoiced, and
                what is still pending, so cash flow is less of a guessing game.
              </p>
            </div>
          </div>
        </section>

        {/* Simple CTA */}
        <section>
          <div className="card text-center">
            <h2 className="text-2xl font-semibold text-[var(--secondary-black)] mb-3">
              Start as a Procur supplier
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-5">
              If this sounds like the kind of support you want around your
              crops, you can create a supplier account or talk with our team
              about how Procur would fit your operation.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="/signup?type=supplier"
                className="btn btn-primary px-6 py-2 text-sm"
              >
                Create supplier account
              </a>
              <a
                href="mailto:support@procurapp.co"
                className="btn btn-ghost px-6 py-2 text-sm"
              >
                Talk with Procur
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
