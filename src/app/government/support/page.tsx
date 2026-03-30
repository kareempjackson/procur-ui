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
import {
  GOV,
  govCard,
  govPageTitle,
  govPageSubtitle,
  govPillButton,
  govPrimaryButton,
  govHoverBg,
} from "../styles";

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
  const [hoveredAction, setHoveredAction] = useState<number | null>(null);
  const [hoveredFAQ, setHoveredFAQ] = useState<number | null>(null);
  const [hoveredContact, setHoveredContact] = useState<string | null>(null);
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

  const quickActions = [
    {
      icon: DocumentTextIcon,
      title: "Documentation",
      desc: "Browse user guides",
      iconBg: GOV.infoBg,
      iconColor: GOV.info,
    },
    {
      icon: VideoCameraIcon,
      title: "Video Tutorials",
      desc: "Watch how-to videos",
      iconBg: "#f3e8ff",
      iconColor: "#7c3aed",
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: "Live Chat",
      desc: "Chat with support",
      iconBg: GOV.successBg,
      iconColor: GOV.success,
    },
    {
      icon: QuestionMarkCircleIcon,
      title: "FAQs",
      desc: "Common questions",
      iconBg: "#fff7ed",
      iconColor: GOV.accent,
    },
  ];

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "9px 16px",
    borderRadius: 999,
    border: `1px solid ${GOV.border}`,
    fontSize: 13,
    fontFamily: "inherit",
    color: GOV.text,
    outline: "none",
    background: GOV.cardBg,
  };

  const textareaStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 16px",
    borderRadius: 12,
    border: `1px solid ${GOV.border}`,
    fontSize: 13,
    fontFamily: "inherit",
    color: GOV.text,
    outline: "none",
    background: GOV.cardBg,
    resize: "none" as const,
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    color: GOV.text,
    marginBottom: 4,
  };

  return (
    <div style={{ minHeight: "100vh", background: GOV.bg, color: GOV.text }}>
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={govPageTitle}>How can we help you?</h1>
          <p style={govPageSubtitle}>
            Find answers, get support, and explore resources
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ maxWidth: 640, margin: "0 auto 40px" }}>
          <div style={{ position: "relative" }}>
            <MagnifyingGlassIcon
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                height: 18,
                width: 18,
                color: GOV.muted,
              }}
            />
            <input
              type="text"
              placeholder="Search for help articles, guides, or FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                ...inputStyle,
                paddingLeft: 44,
                paddingTop: 14,
                paddingBottom: 14,
              }}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 14,
            marginBottom: 40,
          }}
        >
          {quickActions.map((action, index) => (
            <button
              key={index}
              onMouseEnter={() => setHoveredAction(index)}
              onMouseLeave={() => setHoveredAction(null)}
              style={{
                ...govCard,
                padding: "20px 18px",
                textAlign: "left" as const,
                cursor: "pointer",
                background:
                  hoveredAction === index ? govHoverBg : GOV.cardBg,
                transition: "background .15s",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  padding: 10,
                  borderRadius: 8,
                  background: action.iconBg,
                  marginBottom: 10,
                }}
              >
                <action.icon
                  style={{ height: 20, width: 20, color: action.iconColor }}
                />
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: GOV.text,
                  marginBottom: 2,
                }}
              >
                {action.title}
              </div>
              <div style={{ fontSize: 11.5, color: GOV.muted, fontWeight: 500 }}>
                {action.desc}
              </div>
            </button>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* Left Column - FAQs */}
          <div>
            <div style={{ ...govCard, overflow: "hidden" }}>
              <div
                style={{
                  padding: "18px 20px",
                  borderBottom: `1px solid ${GOV.border}`,
                  background: GOV.bg,
                }}
              >
                <h2
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: GOV.text,
                    margin: "0 0 14px",
                  }}
                >
                  Frequently Asked Questions
                </h2>
                {/* Category Filter */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      style={
                        selectedCategory === category.id
                          ? {
                              ...govPrimaryButton,
                              padding: "7px 16px",
                              fontSize: 12,
                              background: GOV.brand,
                            }
                          : {
                              ...govPillButton,
                              padding: "7px 16px",
                              fontSize: 12,
                            }
                      }
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ padding: "18px 20px" }}>
                {filteredFAQs.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "48px 0",
                    }}
                  >
                    <QuestionMarkCircleIcon
                      style={{
                        height: 40,
                        width: 40,
                        color: GOV.lightMuted,
                        margin: "0 auto 10px",
                        display: "block",
                      }}
                    />
                    <p style={{ fontSize: 13, color: GOV.muted }}>
                      No FAQs found matching your search
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {filteredFAQs.map((faq, index) => (
                      <div
                        key={index}
                        style={{
                          borderRadius: 8,
                          border: `1px solid ${GOV.border}`,
                          overflow: "hidden",
                        }}
                      >
                        <button
                          onClick={() =>
                            setExpandedFAQ(expandedFAQ === index ? null : index)
                          }
                          onMouseEnter={() => setHoveredFAQ(index)}
                          onMouseLeave={() => setHoveredFAQ(null)}
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background:
                              hoveredFAQ === index ? govHoverBg : "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontFamily: "inherit",
                            transition: "background .15s",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: GOV.text,
                              textAlign: "left" as const,
                            }}
                          >
                            {faq.question}
                          </span>
                          {expandedFAQ === index ? (
                            <ChevronUpIcon
                              style={{
                                height: 16,
                                width: 16,
                                color: GOV.muted,
                                flexShrink: 0,
                              }}
                            />
                          ) : (
                            <ChevronDownIcon
                              style={{
                                height: 16,
                                width: 16,
                                color: GOV.muted,
                                flexShrink: 0,
                              }}
                            />
                          )}
                        </button>
                        {expandedFAQ === index && (
                          <div
                            style={{
                              padding: "0 16px 14px",
                              borderTop: `1px solid ${GOV.border}`,
                              background: GOV.bg,
                            }}
                          >
                            <p
                              style={{
                                fontSize: 13,
                                color: GOV.textSecondary,
                                lineHeight: 1.6,
                                marginTop: 12,
                                fontWeight: 500,
                              }}
                            >
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
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Contact Support */}
            <div style={{ ...govCard, padding: "18px 20px" }}>
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: GOV.text,
                  margin: "0 0 14px",
                }}
              >
                Contact Support
              </h3>
              <form
                onSubmit={handleSubmitContact}
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <div>
                  <label style={labelStyle}>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleContactFormChange}
                    placeholder="Brief description"
                    required
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Category</label>
                  <select
                    name="category"
                    value={contactForm.category}
                    onChange={handleContactFormChange}
                    style={inputStyle}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Issue</option>
                    <option value="account">Account Support</option>
                    <option value="feature">Feature Request</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Priority</label>
                  <select
                    name="priority"
                    value={contactForm.priority}
                    onChange={handleContactFormChange}
                    style={inputStyle}
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Message</label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactFormChange}
                    placeholder="Describe your issue or question"
                    required
                    rows={4}
                    style={textareaStyle}
                  />
                </div>

                <button type="submit" style={{ ...govPrimaryButton, justifyContent: "center", width: "100%" }}>
                  Send Message
                </button>
              </form>
            </div>

            {/* Direct Contact */}
            <div style={{ ...govCard, padding: "18px 20px" }}>
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: GOV.text,
                  margin: "0 0 14px",
                }}
              >
                Direct Contact
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <a
                  href="mailto:support@procur.gov.gd"
                  onMouseEnter={() => setHoveredContact("email")}
                  onMouseLeave={() => setHoveredContact(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 10,
                    borderRadius: 8,
                    textDecoration: "none",
                    background:
                      hoveredContact === "email" ? govHoverBg : "transparent",
                    transition: "background .15s",
                  }}
                >
                  <div
                    style={{
                      flexShrink: 0,
                      height: 36,
                      width: 36,
                      borderRadius: "50%",
                      background: GOV.infoBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <EnvelopeIcon
                      style={{ height: 16, width: 16, color: GOV.info }}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: GOV.text,
                      }}
                    >
                      Email Support
                    </div>
                    <div
                      style={{ fontSize: 11, color: GOV.muted, fontWeight: 500 }}
                    >
                      support@procur.gov.gd
                    </div>
                  </div>
                </a>

                <a
                  href="tel:+14734402708"
                  onMouseEnter={() => setHoveredContact("phone")}
                  onMouseLeave={() => setHoveredContact(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 10,
                    borderRadius: 8,
                    textDecoration: "none",
                    background:
                      hoveredContact === "phone" ? govHoverBg : "transparent",
                    transition: "background .15s",
                  }}
                >
                  <div
                    style={{
                      flexShrink: 0,
                      height: 36,
                      width: 36,
                      borderRadius: "50%",
                      background: GOV.successBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PhoneIcon
                      style={{ height: 16, width: 16, color: GOV.success }}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: GOV.text,
                      }}
                    >
                      Phone Support
                    </div>
                    <div
                      style={{ fontSize: 11, color: GOV.muted, fontWeight: 500 }}
                    >
                      +1 473-440-2708
                    </div>
                  </div>
                </a>
              </div>

              <div
                style={{
                  marginTop: 14,
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: GOV.infoBg,
                  border: `1px solid #bfdbfe`,
                }}
              >
                <p style={{ fontSize: 11, color: GOV.info, fontWeight: 600, margin: 0 }}>
                  <strong>Business Hours:</strong> Monday - Friday, 8:00 AM -
                  4:30 PM AST
                </p>
              </div>
            </div>

            {/* System Status */}
            <div style={{ ...govCard, padding: "18px 20px" }}>
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: GOV.text,
                  margin: "0 0 14px",
                }}
              >
                System Status
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { service: "API Services", status: "Operational" },
                  { service: "Database", status: "Operational" },
                  { service: "File Storage", status: "Operational" },
                  { service: "Email Delivery", status: "Operational" },
                ].map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: 13, color: GOV.text, fontWeight: 500 }}>
                      {item.service}
                    </span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 11,
                        fontWeight: 700,
                        color: GOV.success,
                      }}
                    >
                      <span
                        style={{
                          height: 7,
                          width: 7,
                          borderRadius: "50%",
                          background: "#22c55e",
                          display: "inline-block",
                        }}
                      />
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
