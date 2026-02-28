import PublicPageShell from "@/components/layout/PublicPageShell";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support | Procur",
  description: "Get in touch with the Procur support team.",
};

export default function SupportPage() {
  return (
    <PublicPageShell>
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "80px 24px 80px",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <h1
            style={{
              fontSize: 38,
              fontWeight: 800,
              color: "#1c2b23",
              margin: "0 0 16px",
              lineHeight: 1.2,
            }}
          >
            Support
          </h1>
          <p
            style={{
              fontSize: 17,
              color: "#5a6b62",
              lineHeight: 1.65,
              margin: 0,
              maxWidth: 520,
            }}
          >
            Our team is available to help with questions about orders, accounts,
            and the platform.
          </p>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginBottom: 40,
          }}
        >
          {/* Email support */}
          <div
            style={{
              background: "#f5f1ea",
              border: "1px solid #e8e4dc",
              borderRadius: 12,
              padding: 28,
            }}
          >
            <h2
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#1c2b23",
                margin: "0 0 8px",
              }}
            >
              Email support
            </h2>
            <a
              href="mailto:support@procurapp.co"
              style={{
                fontSize: 15,
                color: "#2d4a3e",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              support@procurapp.co
            </a>
            <p
              style={{
                fontSize: 13.5,
                color: "#7a8c84",
                margin: "10px 0 0",
                lineHeight: 1.55,
              }}
            >
              Response time: within 1 business day
            </p>
          </div>

          {/* Help Center */}
          <div
            style={{
              background: "#f5f1ea",
              border: "1px solid #e8e4dc",
              borderRadius: 12,
              padding: 28,
            }}
          >
            <h2
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#1c2b23",
                margin: "0 0 8px",
              }}
            >
              Help Center
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "#5a6b62",
                margin: "0 0 16px",
                lineHeight: 1.65,
              }}
            >
              Browse answers to common questions about the platform.
            </p>
            <Link
              href="/help"
              style={{
                display: "inline-block",
                padding: "9px 22px",
                background: "#d4783c",
                color: "#fff",
                fontSize: 13.5,
                fontWeight: 700,
                borderRadius: 999,
                textDecoration: "none",
              }}
            >
              Visit Help Center
            </Link>
          </div>

          {/* FAQ */}
          <div
            style={{
              background: "#f5f1ea",
              border: "1px solid #e8e4dc",
              borderRadius: 12,
              padding: 28,
            }}
          >
            <h2
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#1c2b23",
                margin: "0 0 8px",
              }}
            >
              FAQ
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "#5a6b62",
                margin: "0 0 16px",
                lineHeight: 1.65,
              }}
            >
              Find quick answers to frequently asked questions.
            </p>
            <Link
              href="/help/faq"
              style={{
                display: "inline-block",
                padding: "9px 22px",
                background: "#d4783c",
                color: "#fff",
                fontSize: 13.5,
                fontWeight: 700,
                borderRadius: 999,
                textDecoration: "none",
              }}
            >
              View FAQ
            </Link>
          </div>
        </div>

        {/* Footer note */}
        <p
          style={{
            fontSize: 13.5,
            color: "#7a8c84",
            lineHeight: 1.65,
            margin: 0,
          }}
        >
          For urgent issues, email us directly and include your order number if
          relevant.
        </p>
      </div>
    </PublicPageShell>
  );
}
