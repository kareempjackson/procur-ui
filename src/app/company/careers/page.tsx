import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Careers at Procur",
  description:
    "Join the team building the future of produce procurement. We're hiring across engineering, operations, and business development.",
};

export default function CareersPage() {
  const benefits = [
    {
      category: "Health & Wellness",
      items: [
        "Comprehensive health, dental, and vision insurance for you and your dependents",
        "Inclusive fertility benefits and family planning support",
        "16 weeks of paid parental leave",
        "Flexible paid time off and mental health days",
        "Generous mental health support and wellness programs",
        "$500/month flexible wellness and lifestyle stipend",
      ],
    },
    {
      category: "Compensation & Support",
      items: [
        "Competitive salary and equity packages",
        "Performance-based bonuses and equity refreshers",
        "Robust retirement plans with company matching",
        "Life and disability insurance coverage",
        "Annual education and conference stipend",
        "Home office setup and equipment allowance",
      ],
    },
    {
      category: "Work & Culture",
      items: [
        "Hybrid work model with flexible schedules",
        "Daily meals and snacks in the office",
        "Commuter benefits and transportation support",
        "Team retreats and company events",
        "Professional development opportunities",
        "Relocation support for qualifying roles",
      ],
    },
  ];

  const values = [
    {
      number: "01",
      title: "Build for the global good",
      description:
        "We optimize for long-term outcomes that benefit growers, buyers, and the entire food system. Every decision considers the broader impact on global food security and sustainability.",
    },
    {
      number: "02",
      title: "Embrace transparency",
      description:
        "We believe in radical transparency across our supply chains, operations, and decision-making. Trust is built through openness and accountability.",
    },
    {
      number: "03",
      title: "Be good to our users",
      description:
        "Our users include farmers, suppliers, buyers, and communities. We cultivate empathy and kindness in all interactions, going above and beyond to serve their needs.",
    },
    {
      number: "04",
      title: "Drive industry standards",
      description:
        "As a safety-first company, we work to inspire a 'race to the top' where the industry competes on quality, safety, and sustainability standards.",
    },
    {
      number: "05",
      title: "Do the simple thing that works",
      description:
        "We take an empirical approach to problems and care about impact over sophistication. We identify the simplest solution and iterate from there.",
    },
    {
      number: "06",
      title: "Put the mission first",
      description:
        "Building the world's most trusted produce marketplace is what unites us. The mission gives us shared purpose and guides our decisions.",
    },
  ];

  const interviewInfo = [
    {
      title: "Diverse backgrounds welcome",
      description:
        "We value different perspectives and experiences. Many of our team members come from non-traditional backgrounds in agriculture, logistics, and technology.",
    },
    {
      title: "Practical problem-solving",
      description:
        "Our interviews focus on how you think through real-world challenges. We use collaborative environments and encourage looking up documentation.",
    },
    {
      title: "Mission alignment",
      description:
        "We're interested in what motivates you and how you think about building systems that serve the global food supply chain.",
    },
  ];

  const additionalInfo = [
    {
      title: "Remote & hybrid work",
      description:
        "Most team members work hybrid with regular office days. We support fully remote work for certain roles and during transitions.",
    },
    {
      title: "Visa sponsorship",
      description:
        "We sponsor visas for qualifying candidates and roles. We retain immigration lawyers to support the process.",
    },
    {
      title: "Educational backgrounds vary",
      description:
        "We don&apos;t require specific degrees or previous industry experience. About half our team has advanced degrees; others bring diverse professional experience.",
    },
    {
      title: "Re-applying welcome",
      description:
        "If interviews don&apos;t work out, you&apos;re welcome to re-apply after 12 months, or earlier if your experience changes significantly.",
    },
    {
      title: "Offer flexibility",
      description:
        "We give candidates time to consider offers and finish other interview processes. We want you to make the best decision for your career.",
    },
    {
      title: "Internships",
      description:
        "We currently focus on full-time roles but occasionally offer project-based opportunities for exceptional candidates.",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--secondary-black)] text-balance">
            Join the team building the future of produce procurement
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            We're a mission-driven company headquartered in San Francisco. Our
            team spans agriculture, technology, logistics, and policy — united
            by a vision of transparent, reliable global food systems.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="#open-roles"
              className="btn btn-primary px-8 py-3 text-base"
            >
              See Open Roles
            </a>
            <a href="#values" className="btn btn-ghost px-8 py-3 text-base">
              Our Values
            </a>
          </div>
          <div className="mt-10">
            <div className="relative mx-auto rounded-3xl overflow-hidden shadow-xl border border-black/5 w-full max-w-6xl h-96 md:h-[520px]">
              <Image
                src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                alt="Team working on produce procurement solutions"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Mission Statement */}
        <section className="md:columns-2 md:gap-10">
          <p className="text-lg text-gray-700 leading-8 first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:leading-[0.9]">
            Every day, we make critical decisions that shape the future of
            global food procurement. Building systems that connect farmers to
            markets, ensure food safety, and create economic opportunity is both
            a responsibility and a privilege.
          </p>
          <p className="mt-6 text-lg text-gray-700 leading-8">
            Our work impacts millions of people — from smallholder farmers to
            large-scale buyers, from logistics partners to end consumers. We
            take this responsibility seriously and are committed to building
            technology that makes the food system more transparent, efficient,
            and equitable.
          </p>
          <blockquote className="mt-8 md:mt-10 border-l-4 border-[var(--primary-accent2)] pl-5 italic text-xl text-gray-800">
            "We're not just building a marketplace — we&apos;re building the
            infrastructure for global food security."
          </blockquote>
        </section>

        {/* What We Offer */}
        <section className="mt-28">
          <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
            What We Offer
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl">
            At Procur, we believe that supporting our team is crucial to our
            collective success. We offer comprehensive benefits to support you
            and your family, now and in the future.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="card">
                <h3 className="text-xl font-semibold mb-4 text-[var(--secondary-black)]">
                  {benefit.category}
                </h3>
                <ul className="space-y-3">
                  {benefit.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <span className="h-2 w-2 rounded-full bg-[var(--primary-accent2)] mt-2 flex-shrink-0" />
                      <span className="text-gray-600 text-sm leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section id="values" className="mt-28">
          <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
            What we value and how we act
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-4xl">
            Every day, we make critical decisions that inform our ability to
            achieve our mission. Our values guide how we work together, the
            decisions we make, and ultimately how we show up for each other and
            work toward building the future of produce procurement.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div key={index} className="card">
                <div className="text-sm text-gray-500 mb-2">{value.number}</div>
                <h3 className="text-lg font-semibold mb-3 text-[var(--secondary-black)]">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Interview Process */}
        <section className="mt-28">
          <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
            Our Interview Process
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-4xl">
            The challenges we tackle at Procur demand diverse expertise and
            perspectives. Our interview process is designed to identify
            thoughtful candidates who bring unique strengths to our
            multidisciplinary team.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {interviewInfo.map((info, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold mb-3 text-[var(--secondary-black)]">
                  {info.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {info.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 card bg-gradient-to-br from-[var(--primary-background)] to-white border border-[var(--primary-accent2)]/20">
            <h3 className="text-lg font-semibold mb-3 text-[var(--secondary-black)]">
              What to expect
            </h3>
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
              <p>
                We use collaborative environments like Colab and Replit for
                technical interviews. You'll be able to look things up in
                documentation or on the web, just like in real work.
              </p>
              <p>
                We're interested in how you think through problems and analyze
                tradeoffs between approaches. You'll also have time to ask us
                about Procur and what motivates our work.
              </p>
              <p>
                All interviews are conducted over video call. We prefer Pacific
                time office hours but can be flexible for international
                candidates.
              </p>
            </div>
          </div>
        </section>

        {/* Additional Information */}
        <section className="mt-28">
          <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-12">
            Good to know
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {additionalInfo.map((info, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold mb-3 text-[var(--secondary-black)]">
                  {info.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {info.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Open Roles CTA */}
        <section id="open-roles" className="mt-28">
          <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-black to-black/90 text-white px-8 md:px-14 py-12 md:py-16">
            <div className="max-w-5xl">
              <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Ready to help build the future of produce procurement?
              </h3>
              <p className="mt-4 md:mt-5 text-base md:text-lg text-white/80 max-w-2xl">
                We're actively hiring across engineering, operations, business
                development, and partnerships. Join us in building systems that
                serve the global food supply chain.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 md:gap-4">
                <a
                  href="mailto:careers@procur.com"
                  className="btn btn-primary px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  View Open Roles
                </a>
                <a
                  href="/company/about"
                  className="btn btn-ghost text-white border-white px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  Learn About Us
                </a>
              </div>

              {/* Current Open Positions */}
              <div className="mt-12 grid md:grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Engineering</h4>
                  <ul className="text-sm text-white/80 space-y-1">
                    <li>• Senior Full-Stack Engineer</li>
                    <li>• Platform Engineer</li>
                    <li>• Mobile Engineer (React Native)</li>
                  </ul>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Operations</h4>
                  <ul className="text-sm text-white/80 space-y-1">
                    <li>• Supply Chain Operations Manager</li>
                    <li>• Quality Assurance Specialist</li>
                    <li>• Logistics Coordinator</li>
                  </ul>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Business</h4>
                  <ul className="text-sm text-white/80 space-y-1">
                    <li>• Business Development Manager</li>
                    <li>• Partnership Manager</li>
                    <li>• Customer Success Manager</li>
                  </ul>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Specialized</h4>
                  <ul className="text-sm text-white/80 space-y-1">
                    <li>• Food Safety Compliance Officer</li>
                    <li>• Data Analyst</li>
                    <li>• Government Relations Specialist</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
          </div>
        </section>

        {/* Contact Information */}
        <section className="mt-20">
          <div className="card text-center">
            <h3 className="text-xl font-semibold mb-4 text-[var(--secondary-black)]">
              Questions about working at Procur?
            </h3>
            <p className="text-gray-600 mb-6">
              We'd love to hear from you. Reach out to learn more about our
              mission, culture, and open opportunities.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:careers@procur.com"
                className="btn btn-primary px-6 py-2"
              >
                careers@procur.com
              </a>
              <a
                href="https://linkedin.com/company/procur"
                className="btn btn-ghost px-6 py-2"
              >
                Follow us on LinkedIn
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
