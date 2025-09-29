import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Procur",
  description:
    "Procur is building a safer, more transparent global marketplace for fresh produce — reliable logistics, quality, and secure payments.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      {/* Centered hero with rounded image */}
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--secondary-black)] text-balance">
            Making produce procurement you can rely on
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            We’re building a trusted marketplace that connects growers,
            suppliers, and buyers through reliable logistics, transparent
            standards, and secure payments.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a href="/signup" className="btn btn-primary px-8 py-3 text-base">
              Get Started
            </a>
            <a href="#values" className="btn btn-ghost px-8 py-3 text-base">
              Our Values
            </a>
          </div>
          <div className="mt-10">
            <div className="relative mx-auto rounded-3xl overflow-hidden shadow-xl border border-black/5 w-full max-w-6xl h-96 md:h-[520px]">
              <Image
                src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                alt="Fresh produce at market"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Editorial narrative with drop cap */}
        <section className="md:columns-2 md:gap-10">
          <p className="text-lg text-gray-700 leading-8 first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:leading-[0.9]">
            In every crate, pallet, and bill of lading is a promise: that the
            food on our tables is fresh, fairly sourced, and traceable. Procur
            exists to make that promise dependable — aligning growers,
            suppliers, logistics partners, and buyers in a marketplace designed
            for transparency and speed.
          </p>
          <p className="mt-6 text-lg text-gray-700 leading-8">
            We focus on the essentials: clear standards, reliable operations,
            and tooling that makes trade simpler. It’s not about flashy
            features. It’s about trust — earned one delivery, one settlement,
            one season at a time.
          </p>
          <blockquote className="mt-8 md:mt-10 border-l-4 border-[var(--primary-accent2)] pl-5 italic text-xl text-gray-800">
            “Trust is a product feature. In produce, it’s the most important
            one.”
          </blockquote>
        </section>

        {/* Purpose */}
        <section className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="card">
            <h2 className="text-xl font-semibold mb-2">
              We build safer systems
            </h2>
            <p className="text-gray-600">
              Reliability across sourcing, quality, and delivery. We prioritize
              clear standards and resilient operations so every transaction
              earns trust.
            </p>
          </div>
          <div className="card">
            <h2 className="text-xl font-semibold mb-2">Data guides our work</h2>
            <p className="text-gray-600">
              We iterate quickly with real signals from buyers and suppliers —
              improving routing, settlement, and quality control with measurable
              outcomes.
            </p>
          </div>
          <div className="card">
            <h2 className="text-xl font-semibold mb-2">
              Industry collaboration
            </h2>
            <p className="text-gray-600">
              We partner across farms, logistics, regulators, and finance to
              raise the bar on transparency and performance in produce trade.
            </p>
          </div>
        </section>

        {/* Editorial photo strip */}
        <section className="mt-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <figure className="relative h-60 md:h-64 rounded-xl overflow-hidden">
              <Image
                src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                alt="Market morning"
                fill
                className="object-cover"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 p-3 text-white text-xs tracking-wide uppercase bg-gradient-to-t from-black/60 to-transparent">
                Market morning
              </figcaption>
            </figure>
            <figure className="relative h-60 md:h-64 rounded-xl overflow-hidden">
              <Image
                src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                alt="Cold chain in motion"
                fill
                className="object-cover scale-110"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 p-3 text-white text-xs tracking-wide uppercase bg-gradient-to-t from-black/60 to-transparent">
                Cold chain in motion
              </figcaption>
            </figure>
            <figure className="relative h-60 md:h-64 rounded-xl overflow-hidden">
              <Image
                src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                alt="Quality at source"
                fill
                className="object-cover"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 p-3 text-white text-xs tracking-wide uppercase bg-gradient-to-t from-black/60 to-transparent">
                Quality at source
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Values */}
        <section id="values" className="mt-28">
          <h2 className="text-3xl font-bold text-[var(--secondary-black)]">
            What we value
          </h2>
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Act for the global good",
                body: "Optimize long-term outcomes for growers, buyers, and the food system.",
              },
              {
                title: "Hold light and shade",
                body: "Name the risks, design for resilience, and unlock the upside.",
              },
              {
                title: "Be good to our users",
                body: "Earn trust with clarity, empathy, and dependable follow-through.",
              },
              {
                title: "Raise the standard on safety",
                body: "Inspire an industry-wide race to the top on quality and compliance.",
              },
              {
                title: "Do the simple thing that works",
                body: "Favor clear solutions, iterate, and scale what proves itself.",
              },
              {
                title: "Put the mission first",
                body: "Stay focused on building the most trusted produce marketplace.",
              },
            ].map((v, i) => (
              <div key={i} className="card">
                <div className="text-sm text-gray-500 mb-2">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-lg font-semibold mb-2">{v.title}</h3>
                <p className="text-gray-600">{v.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team snapshot */}
        <section className="mt-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
                The team
              </h2>
              <p className="text-gray-600 text-lg">
                We’re operators, technologists, and produce experts who’ve
                shipped marketplaces, scaled logistics, and modernized
                procurement. We’re united by a belief that trust is a product
                feature — and it’s earned every day.
              </p>
            </div>
            <div className="space-y-6">
              <figure className="relative h-56 md:h-72 rounded-xl overflow-hidden">
                <Image
                  src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                  alt="Team at the market"
                  fill
                  className="object-cover"
                />
                <figcaption className="absolute bottom-0 left-0 right-0 p-3 text-white text-xs tracking-wide uppercase bg-gradient-to-t from-black/50 to-transparent">
                  Field work, not just paperwork
                </figcaption>
              </figure>
              <div className="card">
                <ul className="grid sm:grid-cols-2 gap-4">
                  {[
                    "Marketplace engineering",
                    "Cold chain logistics",
                    "Food safety & QA",
                    "Payments & risk",
                    "Supplier success",
                    "Gov procurement",
                  ].map((s) => (
                    <li key={s} className="flex items-center gap-3">
                      <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary-accent2)]" />
                      <span className="text-gray-700">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Governance */}
        <section className="mt-28">
          <h2 className="text-3xl font-bold text-[var(--secondary-black)]">
            Governance
          </h2>
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold mb-2">Our approach</h3>
              <p className="text-gray-600">
                We maintain clear standards on supplier verification, product
                quality, compliance, and data privacy. Our goal is to keep the
                marketplace fair, transparent, and resilient for every
                participant.
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold mb-2">Advisors</h3>
              <p className="text-gray-600">
                We collaborate with experienced operators across agriculture,
                logistics, and public procurement to continuously improve
                oversight and safety.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-28">
          <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-black to-black/90 text-white px-8 md:px-14 py-12 md:py-16">
            <div className="max-w-5xl">
              <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Join us
              </h3>
              <p className="mt-4 md:mt-5 text-base md:text-lg text-white/80 max-w-2xl">
                Ready to help modernize global produce procurement? Create an
                account or get in touch — we’re hiring across product,
                engineering, and operations.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 md:gap-4">
                <a
                  href="/signup"
                  className="btn btn-primary px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  Create account
                </a>
                <a
                  href="/company/careers"
                  className="btn btn-ghost text-white border-white px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  See careers
                </a>
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
