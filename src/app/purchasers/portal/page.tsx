import TopNavigation from "@/components/navigation/TopNavigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Purchasers - Procur",
  description:
    "See how Procur helps buyers plan better, trust deliveries, and keep budgets under control across your produce procurement.",
};

export default function BuyersPortalPage() {
  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      {/* Hero / story header */}
      <section className="max-w-4xl mx-auto px-6 pt-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--secondary-black)] text-balance">
            How Procur helps purchasers buy with more confidence
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            We help you move from chasing trucks and spreadsheets to running a
            calm, predictable produce program your team can rely on.
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
              Many buyers we speak with are juggling:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>
                Orders spread across email, messaging apps, and phone calls
              </li>
              <li>Unclear delivery windows that disrupt kitchens and stores</li>
              <li>Different formats for invoices and prices every week</li>
              <li>Limited visibility into supplier performance and spend</li>
            </ul>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-[var(--secondary-black)] mb-3">
              With Procur
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              We pull the moving parts into one place so you can:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>
                Request and confirm orders with clear quantities and prices
              </li>
              <li>See what is on the way and when it is expected to arrive</li>
              <li>Compare suppliers on reliability, quality, and cost</li>
              <li>
                Understand where your budget is going and what is changing
              </li>
            </ul>
          </div>
        </section>

        {/* Story of a week with Procur */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-[var(--secondary-black)]">
            What a week looks like with Procur
          </h2>
          <div className="card space-y-4">
            <div>
              <h3 className="font-semibold text-[var(--secondary-black)]">
                Early in the week: plan with real numbers
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Instead of guessing availability, you open Procur and see what
                your preferred suppliers have listed, at what price, and on what
                schedule. You request what you need and lock in terms while
                there is still room to adjust menus or promotions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--secondary-black)]">
                Mid‑week: keep kitchens and stores running smoothly
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                As deliveries move, everyone shares the same source of truth:
                what is in transit, what has landed, and what is delayed. Fewer
                surprises, fewer rush calls, and more time to focus on service.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--secondary-black)]">
                End of week: review, do not reconstruct
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Instead of rebuilding the week from invoices, you can quickly
                review spend by category, see which suppliers performed well,
                and spot trends you want to lean into or correct.
              </p>
            </div>
          </div>
        </section>

        {/* How we help purchasers specifically */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--secondary-black)]">
            How Procur fits into your procurement work
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                Better sourcing conversations
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Clear requests, responses, and history in one place make it
                easier to negotiate fairly and keep long‑term supplier
                relationships healthy.
              </p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                Fewer surprises on delivery day
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                When quantities, specs, and arrival windows are agreed up front,
                the handover at the dock is simpler, with less back‑and‑forth.
              </p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                Spend that makes sense
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                You can see how much you are spending with whom, on what, and
                how that is shifting over time, instead of hunting through
                disconnected reports.
              </p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                Space for strategy, not just tasks
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                With the routine details organized, there is more room to think
                about new suppliers, new products, and how procurement can
                support your wider business goals.
              </p>
            </div>
          </div>
        </section>

        {/* Simple CTA */}
        <section>
          <div className="card text-center">
            <h2 className="text-2xl font-semibold text-[var(--secondary-black)] mb-3">
              Start as a Procur purchaser
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-5">
              If you want procurement to feel more planned and less reactive,
              you can create a buyer account or speak with our team about your
              setup.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="/signup?type=buyer"
                className="btn btn-primary px-6 py-2 text-sm"
              >
                Create buyer account
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
