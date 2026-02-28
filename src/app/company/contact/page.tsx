"use client";

import { useState } from "react";
import PublicPageShell from "@/components/layout/PublicPageShell";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1px solid #d4d0c8",
  borderRadius: 8,
  fontSize: 14,
  fontFamily: "inherit",
  color: "#1c2b23",
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "#1c2b23",
  marginBottom: 6,
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
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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

  return (
    <PublicPageShell>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "80px 24px 80px", background: "#faf8f4" }}>
        {/* Eyebrow */}
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#2d4a3e", marginBottom: 12 }}>
          Contact
        </p>

        {/* Heading */}
        <h1 style={{ fontSize: 38, fontWeight: 700, color: "#1c2b23", margin: "0 0 12px" }}>
          Get in touch
        </h1>

        {/* Subtext */}
        <p style={{ fontSize: 15, color: "#4a5e52", lineHeight: 1.6, margin: "0 0 40px" }}>
          Fill out the form below and our team will get back to you within one business day.
        </p>

        {/* Form card */}
        <div
          style={{
            background: "#f5f1ea",
            border: "1px solid #e8e4dc",
            borderRadius: 16,
            padding: 40,
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Row 1: Name + Email */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div>
                <label htmlFor="name" style={labelStyle}>
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="email" style={labelStyle}>
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Row 2: Company + Role */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div>
                <label htmlFor="company" style={labelStyle}>
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Your company name"
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="role" style={labelStyle}>
                  I&apos;m a...
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  style={inputStyle}
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

            {/* Subject */}
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="subject" style={labelStyle}>
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="What is this about?"
                style={inputStyle}
              />
            </div>

            {/* Message */}
            <div style={{ marginBottom: 24 }}>
              <label htmlFor="message" style={labelStyle}>
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                placeholder="Tell us more about your inquiry..."
                style={{ ...inputStyle, resize: "none" }}
              />
            </div>

            {/* Success banner */}
            {submitStatus === "success" && (
              <div
                style={{
                  background: "#ecfdf5",
                  border: "1px solid #6ee7b7",
                  borderRadius: 10,
                  padding: "12px 16px",
                  color: "#065f46",
                  fontSize: 14,
                  marginBottom: 20,
                }}
              >
                Message sent. We will get back to you within 24 hours.
              </div>
            )}

            {/* Error banner */}
            {submitStatus === "error" && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fca5a5",
                  borderRadius: 10,
                  padding: "12px 16px",
                  color: "#991b1b",
                  fontSize: 14,
                  marginBottom: 20,
                }}
              >
                Something went wrong. Please try again or email us directly.
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "13px",
                background: isSubmitting ? "#b8986a" : "#d4783c",
                color: "#fff",
                border: "none",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 700,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                transition: "background 0.2s",
              }}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>

            {/* Privacy note */}
            <p style={{ fontSize: 12, color: "#8a9e93", textAlign: "center", marginTop: 16, marginBottom: 0 }}>
              By submitting this form, you agree to our privacy policy and terms of service.
            </p>
          </form>
        </div>
      </div>
    </PublicPageShell>
  );
}
