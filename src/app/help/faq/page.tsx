"use client";

import { useState } from "react";
import PublicPageShell from "@/components/layout/PublicPageShell";

export default function FAQPage() {
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
        "Currently, Procur operates primarily within the United States and Canada, with plans to expand internationally. We can work with international buyers who want to source from North American suppliers, and we're developing partnerships to serve other regions. Contact our team to discuss your specific location and requirements.",
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
        "We have a comprehensive quality guarantee policy. If you receive products that don't meet the agreed specifications, contact our support team within 24 hours of delivery with photos and details. We'll work with the supplier to resolve the issue, which may include partial refunds, replacement products, or credits for future orders. Our goal is to ensure every transaction meets your expectations.",
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
        "If there's a quality issue or dispute, we facilitate resolution between buyers and suppliers. Refunds can be processed as credits to your account, refunds to your original payment method, or replacement products. Our dispute resolution team investigates all claims with documentation and photos. Most disputes are resolved within 3-5 business days.",
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
    return matchesCategory;
  });

  return (
    <PublicPageShell>
      {/* Hero */}
      <div
        style={{
          paddingTop: 80,
          paddingBottom: 48,
          textAlign: "center",
          maxWidth: 800,
          margin: "0 auto",
          padding: "80px 24px 48px",
        }}
      >
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#2d4a3e",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          FAQ
        </p>
        <h1
          style={{
            fontSize: 38,
            fontWeight: 800,
            color: "#1c2b23",
            lineHeight: 1.2,
            margin: "0 0 16px",
          }}
        >
          Frequently asked questions
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "#5a6b63",
            lineHeight: 1.6,
            maxWidth: 560,
            margin: "0 auto",
          }}
        >
          Find quick answers to common questions about Procur. Can't find what
          you're looking for? Our support team is here to help.
        </p>
      </div>

      {/* Category filter chips */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          justifyContent: "center",
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 24px",
          marginTop: 40,
        }}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              border:
                selectedCategory === category.id
                  ? "1px solid #2d4a3e"
                  : "1px solid #e8e4dc",
              background:
                selectedCategory === category.id ? "#2d4a3e" : "#f5f1ea",
              color:
                selectedCategory === category.id ? "#ffffff" : "#1c2b23",
              transition: "background 0.15s, color 0.15s, border-color 0.15s",
              fontFamily: "inherit",
            }}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* FAQ list */}
      <div
        style={{
          maxWidth: 760,
          margin: "32px auto 80px",
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq) => (
            <div
              key={faq.id}
              style={{
                background: "#f5f1ea",
                border: "1px solid #e8e4dc",
                borderRadius: 12,
                padding: "20px 24px",
              }}
            >
              <button
                onClick={() => toggleExpanded(faq.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
              >
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#1c2b23",
                    lineHeight: 1.4,
                  }}
                >
                  {faq.question}
                </span>
                <span
                  style={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: expandedItems.includes(faq.id)
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="#5a6b63"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              {expandedItems.includes(faq.id) && (
                <div
                  style={{
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: "1px solid #e8e4dc",
                  }}
                >
                  <p
                    style={{
                      fontSize: 14,
                      color: "#5a6b63",
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <p style={{ color: "#5a6b63", marginBottom: 16, fontSize: 14 }}>
              No questions found for this category.
            </p>
            <button
              onClick={() => setSelectedCategory("all")}
              style={{
                padding: "8px 20px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                border: "1px solid #e8e4dc",
                background: "#f5f1ea",
                color: "#1c2b23",
                fontFamily: "inherit",
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </PublicPageShell>
  );
}
