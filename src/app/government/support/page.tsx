"use client";

import { useState } from "react";
import {
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { useToast } from "@/components/ui/Toast";

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: "",
    category: "general",
    message: "",
    priority: "normal",
  });
  const { show } = useToast();

  const categories = [
    { id: "all", name: "All Topics" },
    { id: "vendors", name: "Vendor Management" },
    { id: "products", name: "Product Listings" },
    { id: "reporting", name: "Reports & Analytics" },
    { id: "compliance", name: "Compliance" },
    { id: "technical", name: "Technical Issues" },
  ];

  const faqs: FAQ[] = [
    {
      question: "How do I register a new vendor?",
      answer:
        'To register a new vendor, navigate to the Vendors page and click "Register New Vendor". Fill in the required information including personal details, farm information, and program enrollment. The vendor will receive an email confirmation once registered.',
      category: "vendors",
    },
    {
      question: "How can I upload products on behalf of a vendor?",
      answer:
        'Go to the Products page and select "Upload Product". Choose the vendor from the dropdown, enter product details, upload images, and provide a reason for the upload. This is useful when vendors need assistance with product listings.',
      category: "products",
    },
    {
      question: "How do I generate a compliance report?",
      answer:
        'Navigate to the Reporting page, select "Compliance Report" from the report types, choose your date range and filters, then click "Generate Report". You can preview the report before exporting it in PDF, Excel, or CSV format.',
      category: "reporting",
    },
    {
      question: "What data can I export from the system?",
      answer:
        "You can export vendor data, production records, market transactions, compliance status, and custom reports. Visit the Data page to access export tools. All exports can be scheduled for automatic generation.",
      category: "reporting",
    },
    {
      question: "How do I track vendor compliance status?",
      answer:
        "The Compliance page shows real-time compliance status for all registered vendors. You can filter by compliance level, view alerts, and schedule inspections. Click on any vendor to see detailed compliance history.",
      category: "compliance",
    },
    {
      question: "How often is the production data updated?",
      answer:
        "Production data is updated in real-time as vendors log their harvest cycles. The system automatically syncs every 15 minutes to ensure data accuracy. Historical data is available for up to 5 years.",
      category: "technical",
    },
    {
      question: "Can I customize dashboard widgets?",
      answer:
        "Yes, you can customize your dashboard by clicking the settings icon on each widget. You can rearrange, hide, or show different KPIs based on your preferences. Changes are saved automatically to your profile.",
      category: "technical",
    },
    {
      question: "How do I assign program incentives to vendors?",
      answer:
        "When registering or editing a vendor profile, navigate to the Programs tab. Select the relevant government programs the vendor qualifies for. You can also bulk-assign programs from the Programs page.",
      category: "vendors",
    },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleContactFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to API
    console.log("Submitting contact form:", contactForm);
    show("Your message has been sent. We'll get back to you soon!");
    setContactForm({
      subject: "",
      category: "general",
      message: "",
      priority: "normal",
    });
  };

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-[color:var(--secondary-black)] mb-3">
            How can we help you?
          </h1>
          <p className="text-base text-[color:var(--secondary-muted-edge)]">
            Find answers, get support, and explore resources
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[color:var(--secondary-muted-edge)]" />
            <input
              type="text"
              placeholder="Search for help articles, guides, or FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm transition-all duration-200 shadow-sm focus:shadow-md"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            {
              icon: DocumentTextIcon,
              title: "Documentation",
              desc: "Browse user guides",
              color: "bg-blue-50",
              iconColor: "text-blue-600",
            },
            {
              icon: VideoCameraIcon,
              title: "Video Tutorials",
              desc: "Watch how-to videos",
              color: "bg-purple-50",
              iconColor: "text-purple-600",
            },
            {
              icon: ChatBubbleLeftRightIcon,
              title: "Live Chat",
              desc: "Chat with support",
              color: "bg-green-50",
              iconColor: "text-green-600",
            },
            {
              icon: QuestionMarkCircleIcon,
              title: "FAQs",
              desc: "Common questions",
              color: "bg-orange-50",
              iconColor: "text-orange-600",
            },
          ].map((action, index) => (
            <button
              key={index}
              className="p-6 rounded-xl border border-[color:var(--secondary-soft-highlight)] bg-white hover:shadow-lg transition-all duration-200 text-left"
            >
              <div
                className={`inline-flex p-3 rounded-lg ${action.color} mb-3`}
              >
                <action.icon className={`h-6 w-6 ${action.iconColor}`} />
              </div>
              <div className="text-sm font-semibold text-[color:var(--secondary-black)] mb-1">
                {action.title}
              </div>
              <div className="text-xs text-[color:var(--secondary-muted-edge)]">
                {action.desc}
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - FAQs */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
              <div className="p-6 border-b border-[color:var(--secondary-soft-highlight)] bg-gray-50/50">
                <h2 className="text-xl font-semibold text-[color:var(--secondary-black)] mb-4">
                  Frequently Asked Questions
                </h2>
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md ${
                        selectedCategory === category.id
                          ? "bg-[var(--secondary-highlight2)] text-white shadow-lg"
                          : "bg-white text-[color:var(--secondary-black)] border border-[color:var(--secondary-soft-highlight)] hover:bg-gray-50"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-6">
                {filteredFAQs.length === 0 ? (
                  <div className="text-center py-12">
                    <QuestionMarkCircleIcon className="h-12 w-12 text-[color:var(--secondary-muted-edge)] mx-auto mb-3" />
                    <p className="text-sm text-[color:var(--secondary-muted-edge)]">
                      No FAQs found matching your search
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredFAQs.map((faq, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-[color:var(--secondary-soft-highlight)] overflow-hidden"
                      >
                        <button
                          onClick={() =>
                            setExpandedFAQ(expandedFAQ === index ? null : index)
                          }
                          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-sm font-medium text-[color:var(--secondary-black)] text-left">
                            {faq.question}
                          </span>
                          {expandedFAQ === index ? (
                            <ChevronUpIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)] flex-shrink-0" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5 text-[color:var(--secondary-muted-edge)] flex-shrink-0" />
                          )}
                        </button>
                        {expandedFAQ === index && (
                          <div className="px-4 pb-4 pt-0 border-t border-[color:var(--secondary-soft-highlight)] bg-gray-50/50">
                            <p className="text-sm text-[color:var(--secondary-black)] leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Contact & Resources */}
          <div className="space-y-6">
            {/* Contact Support */}
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
              <h3 className="text-lg font-semibold text-[color:var(--secondary-black)] mb-4">
                Contact Support
              </h3>
              <form onSubmit={handleSubmitContact} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-[color:var(--secondary-black)] mb-1 block">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleContactFormChange}
                    placeholder="Brief description"
                    required
                    className="w-full px-4 py-2 rounded-full border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm transition-all duration-200 shadow-sm focus:shadow-md"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[color:var(--secondary-black)] mb-1 block">
                    Category
                  </label>
                  <select
                    name="category"
                    value={contactForm.category}
                    onChange={handleContactFormChange}
                    className="w-full px-4 py-2 rounded-full border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm transition-all duration-200 shadow-sm focus:shadow-md"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Issue</option>
                    <option value="account">Account Support</option>
                    <option value="feature">Feature Request</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-[color:var(--secondary-black)] mb-1 block">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={contactForm.priority}
                    onChange={handleContactFormChange}
                    className="w-full px-4 py-2 rounded-full border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm transition-all duration-200 shadow-sm focus:shadow-md"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-[color:var(--secondary-black)] mb-1 block">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactFormChange}
                    placeholder="Describe your issue or question"
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-2xl border border-[color:var(--secondary-soft-highlight)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] text-sm resize-none transition-all duration-200 shadow-sm focus:shadow-md"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2.5 rounded-full bg-[var(--secondary-highlight2)] text-white text-sm font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Direct Contact */}
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
              <h3 className="text-lg font-semibold text-[color:var(--secondary-black)] mb-4">
                Direct Contact
              </h3>
              <div className="space-y-3">
                <a
                  href="mailto:support@procur.gov.gd"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <EnvelopeIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[color:var(--secondary-black)]">
                      Email Support
                    </div>
                    <div className="text-xs text-[color:var(--secondary-muted-edge)]">
                      support@procur.gov.gd
                    </div>
                  </div>
                </a>

                <a
                  href="tel:+14734402708"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                    <PhoneIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[color:var(--secondary-black)]">
                      Phone Support
                    </div>
                    <div className="text-xs text-[color:var(--secondary-muted-edge)]">
                      +1 473-440-2708
                    </div>
                  </div>
                </a>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-100">
                <p className="text-xs text-blue-800">
                  <strong>Business Hours:</strong> Monday - Friday, 8:00 AM -
                  4:30 PM AST
                </p>
              </div>
            </div>

            {/* System Status */}
            <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
              <h3 className="text-lg font-semibold text-[color:var(--secondary-black)] mb-4">
                System Status
              </h3>
              <div className="space-y-2">
                {[
                  { service: "API Services", status: "Operational" },
                  { service: "Database", status: "Operational" },
                  { service: "File Storage", status: "Operational" },
                  { service: "Email Delivery", status: "Operational" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-[color:var(--secondary-black)]">
                      {item.service}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
