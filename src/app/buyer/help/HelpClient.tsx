"use client";

import React, { useState } from "react";
import {
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

export default function HelpClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: "",
    category: "general",
    message: "",
  });

  const faqs = [
    {
      id: 1,
      question: "How do I place an order?",
      answer:
        "Browse the marketplace, select your desired products, and add them to your cart. When ready, proceed to checkout to complete your order. You can also make custom requests using the 'Make Request' button.",
    },
    {
      id: 2,
      question: "What payment methods do you accept?",
      answer:
        "We accept credit cards (Visa, Mastercard, Amex), bank transfers, cash on delivery, and certified checks. You can manage your payment methods in your account settings.",
    },
    {
      id: 3,
      question: "How can I track my order?",
      answer:
        "Once your order is placed, you can track its status in the Orders section. You'll receive notifications at each stage of the delivery process.",
    },
    {
      id: 4,
      question: "What is the return policy?",
      answer:
        "Due to the nature of fresh produce, returns are handled on a case-by-case basis. If you receive damaged or incorrect items, please contact the supplier within 24 hours of delivery.",
    },
    {
      id: 5,
      question: "How do I save my favorite suppliers?",
      answer:
        "You can save suppliers by clicking the heart icon on their profile or product listings. Access your saved suppliers from the navigation menu.",
    },
    {
      id: 6,
      question: "Can I set up recurring orders?",
      answer:
        "Yes! When making a request, you can specify if you want recurring deliveries. Choose from weekly, biweekly, or monthly frequencies.",
    },
    {
      id: 7,
      question: "How do I contact a supplier?",
      answer:
        "You can message suppliers directly through the platform. Click the 'Message' button on a supplier's profile to start a conversation.",
    },
    {
      id: 8,
      question: "What if I have special delivery requirements?",
      answer:
        "You can specify special delivery instructions when placing an order or making a request. Suppliers will be notified of your requirements.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", contactForm);
    alert("Your message has been sent! We'll get back to you within 24 hours.");
    setContactForm({ subject: "", category: "general", message: "" });
  };

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--secondary-black)] mb-2">
            How can we help you?
          </h1>
          <p className="text-[var(--secondary-muted-edge)]">
            Search our knowledge base or contact support
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--secondary-muted-edge)]" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-white outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Contact Options */}
          <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20 text-center hover:shadow-md transition-shadow duration-200">
            <div className="w-12 h-12 mx-auto mb-3 bg-[var(--primary-accent2)]/10 rounded-full flex items-center justify-center">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-[var(--primary-accent2)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-1">
              Live Chat
            </h3>
            <p className="text-sm text-[var(--secondary-muted-edge)] mb-3">
              Chat with our support team
            </p>
            <button className="px-4 py-2 bg-[var(--primary-accent2)] text-white rounded-full text-sm font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200">
              Start Chat
            </button>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20 text-center hover:shadow-md transition-shadow duration-200">
            <div className="w-12 h-12 mx-auto mb-3 bg-[var(--primary-accent2)]/10 rounded-full flex items-center justify-center">
              <EnvelopeIcon className="h-6 w-6 text-[var(--primary-accent2)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-1">
              Email Support
            </h3>
            <p className="text-sm text-[var(--secondary-muted-edge)] mb-3">
              support@procur.com
            </p>
            <a
              href="mailto:support@procur.com"
              className="inline-block px-4 py-2 bg-[var(--secondary-black)] text-white rounded-full text-sm font-medium hover:bg-[var(--secondary-muted-edge)] transition-all duration-200"
            >
              Send Email
            </a>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20 text-center hover:shadow-md transition-shadow duration-200">
            <div className="w-12 h-12 mx-auto mb-3 bg-[var(--primary-accent2)]/10 rounded-full flex items-center justify-center">
              <PhoneIcon className="h-6 w-6 text-[var(--primary-accent2)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-1">
              Phone Support
            </h3>
            <p className="text-sm text-[var(--secondary-muted-edge)] mb-3">
              +1 (555) 123-4567
            </p>
            <a
              href="tel:+15551234567"
              className="inline-block px-4 py-2 bg-[var(--secondary-black)] text-white rounded-full text-sm font-medium hover:bg-[var(--secondary-muted-edge)] transition-all duration-200"
            >
              Call Us
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FAQs */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20">
              <div className="flex items-center gap-2 mb-4">
                <QuestionMarkCircleIcon className="h-6 w-6 text-[var(--primary-accent2)]" />
                <h2 className="text-xl font-semibold text-[var(--secondary-black)]">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-3">
                {filteredFaqs.length === 0 ? (
                  <div className="text-center py-8 text-[var(--secondary-muted-edge)]">
                    No results found. Try a different search term.
                  </div>
                ) : (
                  filteredFaqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="border border-[var(--secondary-soft-highlight)]/30 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                        }
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--primary-background)] transition-colors duration-200"
                      >
                        <span className="font-medium text-[var(--secondary-black)] text-sm">
                          {faq.question}
                        </span>
                        {expandedFaq === faq.id ? (
                          <ChevronUpIcon className="h-5 w-5 text-[var(--secondary-muted-edge)] flex-shrink-0" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-[var(--secondary-muted-edge)] flex-shrink-0" />
                        )}
                      </button>
                      {expandedFaq === faq.id && (
                        <div className="px-4 pb-4 text-sm text-[var(--secondary-muted-edge)] border-t border-[var(--secondary-soft-highlight)]/30">
                          <p className="pt-3">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-5 border border-[var(--secondary-soft-highlight)]/20">
              <div className="flex items-center gap-2 mb-4">
                <DocumentTextIcon className="h-6 w-6 text-[var(--primary-accent2)]" />
                <h2 className="text-xl font-semibold text-[var(--secondary-black)]">
                  Contact Us
                </h2>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    placeholder="Brief description"
                    className="w-full px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                    Category
                  </label>
                  <select
                    value={contactForm.category}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 text-sm rounded-full border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)]"
                  >
                    <option value="general">General Question</option>
                    <option value="order">Order Issue</option>
                    <option value="payment">Payment Issue</option>
                    <option value="technical">Technical Support</option>
                    <option value="account">Account Issue</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--secondary-black)] mb-1.5">
                    Message *
                  </label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    rows={5}
                    placeholder="Describe your issue or question..."
                    className="w-full px-4 py-2.5 text-sm rounded-2xl border border-[var(--secondary-soft-highlight)]/30 bg-[var(--primary-background)] outline-none focus:border-[var(--primary-accent2)] transition-colors text-[var(--secondary-black)] resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[var(--primary-accent2)] text-white rounded-full text-sm font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200"
                >
                  Send Message
                </button>
              </form>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-xs text-blue-800">
                  <strong>Response Time:</strong> We typically respond within 24
                  hours during business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
