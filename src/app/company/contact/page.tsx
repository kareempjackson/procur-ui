"use client";

import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import type { Metadata } from "next";
import Image from "next/image";
import { useState } from "react";

// Note: This would typically be handled server-side with proper metadata export
// For now, we'll handle it client-side
const metadata = {
  title: "Contact Procur",
  description:
    "Get in touch with Procur. Whether you&apos;re a buyer, supplier, or partner, we&apos;re here to help you navigate the global produce marketplace.",
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        company: "",
        role: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      title: "General Inquiries",
      description: "Questions about our platform, partnerships, or services",
      email: "hello@procur.com",
      icon: "💬",
    },
    {
      title: "Sales & Partnerships",
      description:
        "Interested in joining our marketplace or partnering with us",
      email: "sales@procur.com",
      icon: "🤝",
    },
    {
      title: "Support",
      description: "Technical support and account assistance",
      email: "support@procur.com",
      icon: "🛠️",
    },
    {
      title: "Careers",
      description: "Join our team building the future of produce procurement",
      email: "careers@procur.com",
      icon: "🚀",
    },
    {
      title: "Press & Media",
      description: "Media inquiries and press-related questions",
      email: "press@procur.com",
      icon: "📰",
    },
    {
      title: "Legal & Compliance",
      description: "Legal matters, compliance, and regulatory questions",
      email: "legal@procur.com",
      icon: "⚖️",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--secondary-black)] text-balance">
            Let's build the future of produce procurement together
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            Whether you&apos;re a grower, buyer, logistics partner, or just curious
            about our mission, we'd love to hear from you. Get in touch and
            let&apos;s explore how we can work together.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="#contact-form"
              className="btn btn-primary px-8 py-3 text-base"
            >
              Send us a message
            </a>
            <a
              href="mailto:hello@procur.com"
              className="btn btn-ghost px-8 py-3 text-base"
            >
              Email us directly
            </a>
          </div>
          <div className="mt-10">
            <div className="relative mx-auto rounded-3xl overflow-hidden shadow-xl border border-black/5 w-full max-w-6xl h-96 md:h-[520px]">
              <Image
                src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                alt="Fresh produce and global connections"
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
            Every conversation starts with understanding. Whether you&apos;re looking
            to source premium produce, expand your market reach, or explore
            partnership opportunities, we&apos;re here to listen and find solutions
            that work for your business.
          </p>
          <p className="mt-6 text-lg text-gray-700 leading-8">
            Our team combines deep expertise in agriculture, technology, and
            logistics with a commitment to transparency and reliability. We
            believe the best solutions emerge from collaboration, and we&apos;re
            excited to learn about your unique challenges and opportunities.
          </p>
          <blockquote className="mt-8 md:mt-10 border-l-4 border-[var(--primary-accent2)] pl-5 italic text-xl text-gray-800">
            "Great partnerships begin with great conversations."
          </blockquote>
        </section>

        {/* Contact Methods */}
        <section className="mt-28">
          <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
            How can we help?
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl">
            Choose the best way to reach us based on your needs. Our team is
            standing by to provide the support and information you&apos;re looking
            for.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="card hover:shadow-lg transition-shadow duration-200"
              >
                <div className="text-2xl mb-3">{method.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-[var(--secondary-black)]">
                  {method.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {method.description}
                </p>
                <a
                  href={`mailto:${method.email}`}
                  className="text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] font-medium text-sm transition-colors duration-200"
                >
                  {method.email}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact-form" className="mt-28">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
                Send us a message
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Have a specific question or want to discuss a partnership? Fill
                out the form and we'll get back to you within 24 hours.
              </p>

              <div className="space-y-6">
                <div className="card bg-gradient-to-br from-[var(--primary-background)] to-white border border-[var(--primary-accent2)]/20">
                  <h3 className="font-semibold mb-2 text-[var(--secondary-black)]">
                    Response time
                  </h3>
                  <p className="text-gray-600 text-sm">
                    We typically respond to all inquiries within 24 hours during
                    business days. For urgent matters, please call our main
                    office.
                  </p>
                </div>

                <div className="card">
                  <h3 className="font-semibold mb-2 text-[var(--secondary-black)]">
                    Prefer to talk?
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Schedule a call with our team to discuss your needs in
                    detail.
                  </p>
                  <a
                    href="https://calendly.com/procur-team"
                    className="btn btn-ghost px-4 py-2 text-sm"
                  >
                    Schedule a call
                  </a>
                </div>
              </div>
            </div>

            <div className="card">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input w-full"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input w-full"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="input w-full"
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      I'm a...
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="input w-full"
                    >
                      <option value="">Select your role</option>
                      <option value="buyer">Buyer</option>
                      <option value="supplier">Supplier/Grower</option>
                      <option value="logistics">Logistics Partner</option>
                      <option value="government">Government Agency</option>
                      <option value="investor">Investor</option>
                      <option value="media">Media/Press</option>
                      <option value="job-seeker">Job Seeker</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="input w-full"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="input w-full resize-none"
                    style={{
                      borderRadius: "18px",
                      height: "auto",
                      padding: "1rem",
                    }}
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                {submitStatus === "success" && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-green-800 text-sm">
                      ✅ Message sent successfully! We'll get back to you within
                      24 hours.
                    </p>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-800 text-sm">
                      ❌ Something went wrong. Please try again or email us
                      directly.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By submitting this form, you agree to our privacy policy and
                  terms of service.
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-28">
          <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-black to-black/90 text-white px-8 md:px-14 py-12 md:py-16">
            <div className="max-w-5xl">
              <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Ready to transform your produce procurement?
              </h3>
              <p className="mt-4 md:mt-5 text-base md:text-lg text-white/80 max-w-2xl">
                Join thousands of buyers and suppliers who trust Procur for
                reliable, transparent produce procurement. Let's discuss how we
                can help your business grow.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 md:gap-4">
                <a
                  href="/signup"
                  className="btn btn-primary px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  Get Started Today
                </a>
                <a
                  href="mailto:sales@procur.com"
                  className="btn btn-ghost text-white border-white px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  Talk to Sales
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
