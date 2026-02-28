import type { Metadata } from "next";
import Link from "next/link";
import PublicPageShell from "@/components/layout/PublicPageShell";

export const metadata: Metadata = {
  title: "Accessibility | Procur",
  description:
    "Procur's commitment to web accessibility and how to report barriers.",
};

export default function AccessibilityPage() {
  return (
    <PublicPageShell>
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "80px 24px",
          color: "#1c2b23",
        }}
      >
        {/* Page heading */}
        <h1
          style={{
            fontSize: 38,
            fontWeight: 700,
            lineHeight: 1.15,
            margin: "0 0 10px",
            color: "#1c2b23",
          }}
        >
          Accessibility
        </h1>
        <p
          style={{
            fontSize: 12,
            color: "#6b7a6e",
            margin: "0 0 36px",
          }}
        >
          Last updated: February 2026
        </p>

        {/* Intro */}
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.7,
            margin: "0 0 48px",
            color: "#1c2b23",
          }}
        >
          Procur is committed to making its platform usable by everyone. We work
          to meet the Web Content Accessibility Guidelines (WCAG) 2.1 at Level
          AA.
        </p>

        {/* Section: Our commitment */}
        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              margin: "0 0 12px",
              color: "#1c2b23",
            }}
          >
            Our commitment
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, margin: 0, color: "#1c2b23" }}>
            We design with accessibility in mind from the start. Our team
            regularly reviews the platform against WCAG guidelines and addresses
            issues as they are identified.
          </p>
        </section>

        {/* Section: What we support */}
        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              margin: "0 0 12px",
              color: "#1c2b23",
            }}
          >
            What we support
          </h2>
          <ul
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              margin: 0,
              paddingLeft: 20,
              color: "#1c2b23",
            }}
          >
            <li style={{ marginBottom: 6 }}>
              Keyboard navigation throughout the platform
            </li>
            <li style={{ marginBottom: 6 }}>
              Screen reader compatibility with ARIA labels and semantic HTML
            </li>
            <li style={{ marginBottom: 6 }}>
              Sufficient color contrast ratios across all page elements
            </li>
            <li style={{ marginBottom: 6 }}>
              Resizable text without loss of content or functionality
            </li>
            <li style={{ marginBottom: 0 }}>
              Alt text on images and meaningful link labels
            </li>
          </ul>
        </section>

        {/* Section: Known limitations */}
        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              margin: "0 0 12px",
              color: "#1c2b23",
            }}
          >
            Known limitations
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, margin: 0, color: "#1c2b23" }}>
            Some parts of the platform are still being updated. Older PDF
            documents and some dynamic map features may not yet meet full AA
            compliance. We are actively working on these.
          </p>
        </section>

        {/* Section: Third-party content */}
        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              margin: "0 0 12px",
              color: "#1c2b23",
            }}
          >
            Third-party content
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, margin: 0, color: "#1c2b23" }}>
            Some marketplace content is provided by sellers. We ask sellers to
            follow our accessibility guidelines, but we cannot guarantee full
            compliance for all third-party uploaded content.
          </p>
        </section>

        {/* Section: Feedback and contact */}
        <section style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              margin: "0 0 12px",
              color: "#1c2b23",
            }}
          >
            Feedback and contact
          </h2>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              margin: "0 0 14px",
              color: "#1c2b23",
            }}
          >
            If you experience a barrier on Procur, please contact us. We take
            accessibility feedback seriously and aim to respond within 5
            business days.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.7, margin: 0, color: "#1c2b23" }}>
            Contact:{" "}
            <a
              href="mailto:accessibility@procurapp.co"
              style={{
                color: "#2d4a3e",
                fontWeight: 600,
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              accessibility@procurapp.co
            </a>
          </p>
        </section>

        {/* Support card */}
        <div
          style={{
            background: "#f5f1ea",
            border: "1px solid #e8e4dc",
            borderRadius: 12,
            padding: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <p
            style={{
              fontSize: 15,
              fontWeight: 600,
              margin: 0,
              color: "#1c2b23",
            }}
          >
            Need help using Procur?
          </p>
          <Link
            href="/help/support"
            style={{
              display: "inline-block",
              padding: "10px 22px",
              background: "#d4783c",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              borderRadius: 999,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Visit support center
          </Link>
        </div>
      </div>
    </PublicPageShell>
  );
}
