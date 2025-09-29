"use client";

import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import type { Metadata } from "next";
import Image from "next/image";
import { useState } from "react";

// Note: This would typically be handled server-side with proper metadata export
const metadata = {
  title: "FAQ - Procur",
  description:
    "Frequently asked questions about Procur. Find quick answers to common questions about our produce procurement platform.",
};

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const categories = [
    { id: "all", name: "All Questions", count: 24 },
    { id: "getting-started", name: "Getting Started", count: 6 },
    { id: "buying", name: "Buying & Sourcing", count: 5 },
    { id: "selling", name: "Selling & Suppliers", count: 4 },
    { id: "payments", name: "Payments & Billing", count: 4 },
    { id: "logistics", name: "Logistics & Shipping", count: 3 },
    { id: "technical", name: "Technical & API", count: 2 },
  ];

  const faqs = [
    {
      id: 1,
      category: "getting-started",
      question: "How do I get started as a buyer on Procur?",
      answer:
        "Getting started as a buyer is simple. First, create an account and complete our verification process, which includes providing business documentation and contact information. Once verified, you can browse our marketplace, request quotes from suppliers, and place orders. Our onboarding team will guide you through your first purchase and help you understand our quality standards and logistics options.",
    },
    {
      id: 2,
      category: "getting-started",
      question: "What's required to become a supplier on Procur?",
      answer:
        "Suppliers need to complete our comprehensive verification process, which includes food safety certifications (such as HACCP, GAP, or organic certifications), business registration documents, insurance verification, and quality standards compliance. We also require product samples for quality testing and a facility inspection for larger suppliers. Our supplier success team provides support throughout the entire onboarding process.",
    },
    {
      id: 3,
      category: "getting-started",
      question: "Is there a minimum order requirement?",
      answer:
        "Minimum order requirements vary by supplier and product type. Most suppliers set their own minimums based on their operational needs and logistics constraints. Typically, minimums range from 500 lbs to full pallet quantities (2,000-4,000 lbs) depending on the product. You can see specific minimums on each product listing, and our team can help negotiate terms for larger volume commitments.",
    },
    {
      id: 4,
      category: "getting-started",
      question: "How long does the verification process take?",
      answer:
        "The verification process typically takes 3-5 business days for buyers and 7-14 business days for suppliers. Buyers need to provide basic business documentation and contact verification. Suppliers require more extensive documentation including certifications, insurance, and quality compliance materials. We'll keep you updated throughout the process and our team is available to help expedite if needed.",
    },
    {
      id: 5,
      category: "getting-started",
      question: "Can I use Procur if I'm located outside the United States?",
      answer:
        "Currently, Procur operates primarily within the United States and Canada, with plans to expand internationally. We can work with international buyers who want to source from North American suppliers, and we&apos;re developing partnerships to serve other regions. Contact our team to discuss your specific location and requirements.",
    },
    {
      id: 6,
      category: "getting-started",
      question: "What types of produce are available on the platform?",
      answer:
        "Procur offers a wide variety of fresh produce including fruits, vegetables, herbs, and specialty items. We work with suppliers ranging from small family farms to large commercial growers, offering both conventional and organic options. Popular categories include citrus, berries, leafy greens, root vegetables, stone fruits, and seasonal specialties. Our catalog is constantly expanding based on supplier availability and buyer demand.",
    },
    {
      id: 7,
      category: "buying",
      question: "How do I request quotes from suppliers?",
      answer:
        "You can request quotes directly through our platform by browsing products and clicking 'Request Quote' on any item. Provide details about quantity, delivery timeline, quality specifications, and any special requirements. Suppliers typically respond within 24-48 hours with pricing, availability, and terms. You can request quotes from multiple suppliers to compare options.",
    },
    {
      id: 8,
      category: "buying",
      question: "How are quality standards maintained?",
      answer:
        "We maintain strict quality standards through multiple checkpoints: supplier certification requirements, pre-shipment quality inspections, temperature monitoring throughout the cold chain, and post-delivery quality verification. All suppliers must meet food safety standards, and we conduct regular audits. If quality issues arise, we have a dispute resolution process and quality guarantee policies.",
    },
    {
      id: 9,
      category: "buying",
      question: "Can I schedule recurring orders?",
      answer:
        "Yes, you can set up recurring orders for regular purchases. This is particularly useful for restaurants, retailers, and food service companies with consistent needs. You can specify frequency (weekly, bi-weekly, monthly), quantities, and delivery preferences. Pricing and availability are confirmed before each shipment, and you can modify or pause recurring orders at any time.",
    },
    {
      id: 10,
      category: "buying",
      question: "What happens if I'm not satisfied with my order?",
      answer:
        "We have a comprehensive quality guarantee policy. If you receive products that don&apos;t meet the agreed specifications, contact our support team within 24 hours of delivery with photos and details. We'll work with the supplier to resolve the issue, which may include partial refunds, replacement products, or credits for future orders. Our goal is to ensure every transaction meets your expectations.",
    },
    {
      id: 11,
      category: "buying",
      question: "How far in advance should I place orders?",
      answer:
        "Lead times vary by product type and season. For most fresh produce, we recommend placing orders 3-7 days in advance. Seasonal items or specialty products may require 1-2 weeks notice. During peak seasons or for large quantities, earlier ordering is recommended. Our platform shows estimated lead times for each product, and suppliers will confirm availability when you request quotes.",
    },
    {
      id: 12,
      category: "selling",
      question: "How do I add products to my supplier catalog?",
      answer:
        "Once your supplier account is verified, you can add products through your dashboard. For each product, provide detailed descriptions, specifications, available quantities, pricing, and high-quality photos. Include information about growing methods, certifications, packaging options, and seasonal availability. Our team reviews new listings to ensure they meet our quality and information standards.",
    },
    {
      id: 13,
      category: "selling",
      question: "What fees does Procur charge suppliers?",
      answer:
        "Procur charges a transaction fee on completed sales, typically ranging from 3-8% depending on your volume and product category. There are no listing fees or monthly charges. We also offer premium services like enhanced marketing, priority placement, and dedicated account management for additional fees. Detailed fee structures are provided during the onboarding process.",
    },
    {
      id: 14,
      category: "selling",
      question: "How do I manage inventory and availability?",
      answer:
        "Use your supplier dashboard to update inventory levels, seasonal availability, and product specifications in real-time. You can set automatic low-stock alerts, bulk update multiple products, and integrate with your existing inventory management systems via our API. Keeping accurate inventory helps buyers plan their orders and improves your supplier rating.",
    },
    {
      id: 15,
      category: "selling",
      question: "When and how do I get paid?",
      answer:
        "Payments are processed after successful delivery confirmation, typically within 2-5 business days. We offer multiple payment options including ACH transfers, wire transfers, and checks. Payment terms can be net 15, 30, or 60 days depending on your agreement with buyers. You can track all payments and download invoices through your supplier dashboard.",
    },
    {
      id: 16,
      category: "payments",
      question: "What payment methods do you accept?",
      answer:
        "We accept various payment methods including credit cards, ACH bank transfers, wire transfers, and trade financing options. For larger orders, we offer net payment terms (15, 30, or 60 days) subject to credit approval. All payments are processed securely through our verified payment partners, and you'll receive confirmation and receipts for all transactions.",
    },
    {
      id: 17,
      category: "payments",
      question: "Are there any transaction fees?",
      answer:
        "Transaction fees vary based on payment method and order size. Credit card payments typically incur a 2.9% processing fee, while ACH transfers have lower fees around 0.8%. Wire transfers may have fixed fees depending on your bank. Large volume buyers and suppliers may qualify for reduced fee structures. All fees are clearly disclosed before payment processing.",
    },
    {
      id: 18,
      category: "payments",
      question: "How do refunds and disputes work?",
      answer:
        "If there&apos;s a quality issue or dispute, we facilitate resolution between buyers and suppliers. Refunds can be processed as credits to your account, refunds to your original payment method, or replacement products. Our dispute resolution team investigates all claims with documentation and photos. Most disputes are resolved within 3-5 business days.",
    },
    {
      id: 19,
      category: "payments",
      question: "Do you offer trade financing or credit terms?",
      answer:
        "Yes, we partner with financial institutions to offer trade financing options for qualified buyers. This includes net payment terms, seasonal financing, and working capital solutions. Credit approval is based on business history, financial statements, and order volume. Contact our finance team to discuss options that fit your business needs.",
    },
    {
      id: 20,
      category: "logistics",
      question: "How does shipping and delivery work?",
      answer:
        "We partner with certified logistics providers specializing in cold chain transportation. Shipping options include standard ground delivery, expedited shipping, and full truckload for large orders. All shipments include temperature monitoring and tracking. Delivery times typically range from 1-5 days depending on distance and shipping method selected.",
    },
    {
      id: 21,
      category: "logistics",
      question: "Can I arrange my own pickup or delivery?",
      answer:
        "Yes, you can arrange your own transportation or pickup directly from suppliers. This is common for local buyers or those with existing logistics relationships. Coordinate pickup times directly with suppliers through our platform messaging system. You're still covered by our quality guarantee and transaction protection.",
    },
    {
      id: 22,
      category: "logistics",
      question: "What if my shipment is damaged or delayed?",
      answer:
        "All shipments are insured and tracked throughout delivery. If products are damaged in transit, contact our support team immediately with photos and documentation. We'll work with the logistics provider and supplier to resolve the issue quickly. For delays, you'll receive automatic notifications and updates on new delivery estimates.",
    },
    {
      id: 23,
      category: "technical",
      question: "Do you offer API access for integration?",
      answer:
        "Yes, we provide REST API access for qualified businesses to integrate Procur with their existing systems. Our API supports product catalog access, order management, inventory updates, and webhook notifications. Technical documentation, authentication guides, and code examples are available in our developer portal. Contact our technical team to discuss your integration needs.",
    },
    {
      id: 24,
      category: "technical",
      question: "Is my data secure on Procur?",
      answer:
        "Data security is our top priority. We use enterprise-grade encryption, secure data centers, and regular security audits. All payment processing is PCI DSS compliant, and we follow SOC 2 Type II standards. Your business information, transaction data, and personal details are protected with industry-leading security measures. We never share your data with third parties without explicit consent.",
    },
  ];

  const toggleExpanded = (id: number) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--secondary-black)] text-balance">
            Frequently Asked Questions
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            Find quick answers to the most common questions about Procur. Can't
            find what you&apos;re looking for? Our support team is here to help.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search frequently asked questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input w-full pl-12 pr-4 py-4 text-base"
                style={{ borderRadius: "9999px", height: "auto" }}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <div className="relative mx-auto rounded-3xl overflow-hidden shadow-xl border border-black/5 w-full max-w-6xl h-96 md:h-[520px]">
              <Image
                src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                alt="FAQ and support resources"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Category Filter */}
        <section className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? "bg-[var(--primary-accent2)] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </section>

        {/* FAQ List */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length > 0 ? (
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <div key={faq.id} className="card">
                    <button
                      onClick={() => toggleExpanded(faq.id)}
                      className="w-full text-left flex items-center justify-between gap-4 group"
                    >
                      <h3 className="font-semibold text-[var(--secondary-black)] group-hover:text-[var(--primary-accent2)] transition-colors">
                        {faq.question}
                      </h3>
                      <div
                        className={`flex-shrink-0 transform transition-transform duration-200 ${
                          expandedItems.includes(faq.id) ? "rotate-180" : ""
                        }`}
                      >
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </button>
                    {expandedItems.includes(faq.id) && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">
                  No questions found matching your search.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="btn btn-ghost px-6 py-2"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Popular Topics */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Popular topics
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Quick links to the most searched topics and common questions from
              our community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Getting Started",
                description: "Account setup and verification",
                questions: 6,
                href: "#getting-started",
              },
              {
                title: "Quality Standards",
                description: "Food safety and compliance",
                questions: 8,
                href: "/help/quality-compliance",
              },
              {
                title: "Payment Processing",
                description: "Billing and transaction fees",
                questions: 5,
                href: "#payments",
              },
              {
                title: "Shipping & Logistics",
                description: "Delivery and cold chain",
                questions: 4,
                href: "#logistics",
              },
            ].map((topic, index) => (
              <a
                key={index}
                href={topic.href}
                className="card hover:shadow-lg transition-all duration-200 text-center group"
              >
                <h3 className="font-semibold mb-2 text-[var(--secondary-black)] group-hover:text-[var(--primary-accent2)] transition-colors">
                  {topic.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  {topic.description}
                </p>
                <span className="text-xs text-[var(--primary-accent2)] font-medium">
                  {topic.questions} questions
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Still Need Help */}
        <section>
          <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-black to-black/90 text-white px-8 md:px-14 py-12 md:py-16">
            <div className="max-w-5xl">
              <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Still have questions?
              </h3>
              <p className="mt-4 md:mt-5 text-base md:text-lg text-white/80 max-w-2xl">
                Can't find the answer you&apos;re looking for? Our support team is
                standing by to help. Get personalized assistance from our
                produce procurement experts.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 md:gap-4">
                <a
                  href="mailto:support@procur.com"
                  className="btn btn-primary px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  Contact Support
                </a>
                <a
                  href="/help/support"
                  className="btn btn-ghost text-white border-white px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  Visit Support Center
                </a>
              </div>

              {/* FAQ Stats */}
              <div className="mt-12 grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold mb-1">24+</div>
                  <div className="text-sm text-white/80">
                    Questions answered
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold mb-1">95%</div>
                  <div className="text-sm text-white/80">
                    Self-service success rate
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold mb-1">Updated</div>
                  <div className="text-sm text-white/80">
                    Weekly content updates
                  </div>
                </div>
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
