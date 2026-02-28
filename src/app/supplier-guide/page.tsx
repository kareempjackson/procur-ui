import type { Metadata } from "next";
import Link from "next/link";
import PublicPageShell from "@/components/layout/PublicPageShell";

export const metadata: Metadata = {
  title: "Supplier Guide | Procur",
  description:
    "A step-by-step guide for farms and suppliers listing fresh produce on Procur.",
};

const STEPS = [
  {
    number: 1,
    title: "Create your account",
    body: "Sign up with your farm or business details. We review accounts to maintain quality on the marketplace.",
  },
  {
    number: 2,
    title: "Add your produce listings",
    body: "Use our listing tool to describe what you grow. Include variety, unit size, pricing, and available quantity.",
  },
  {
    number: 3,
    title: "Set your availability",
    body: "Mark when produce is ready for pickup or delivery. Buyers see live availability, so keep it current.",
  },
  {
    number: 4,
    title: "Receive and accept orders",
    body: "When a buyer places an order, you get notified via email or WhatsApp. Confirm or suggest changes within 24 hours.",
  },
  {
    number: 5,
    title: "Arrange delivery or pickup",
    body: "Coordinate with the buyer on logistics. Procur shows you delivery options and local transport contacts.",
  },
  {
    number: 6,
    title: "Get paid",
    body: "Payments are processed once orders are confirmed and delivered. Standard payout time is 3 to 5 business days.",
  },
];

const TIPS = [
  "Keep your listings accurate. Buyers rely on your stated weight and quality.",
  "Respond to orders promptly. Slow responses push buyers to other suppliers.",
  "Upload clear photos. Listings with real photos get significantly more views.",
  "Update availability weekly. Stale availability data reduces your order rate.",
];

const FAQS = [
  {
    q: "Do I need to pay to list produce?",
    a: "Listing is free on the Starter plan. See our pricing page for details on premium features.",
  },
  {
    q: "What happens if I cannot fulfill an order?",
    a: "You can cancel with a reason, but frequent cancellations may affect your account standing. Contact support if you have a recurring issue.",
  },
  {
    q: "Can I sell across multiple product categories?",
    a: "Yes. You can list any fresh produce category your farm produces.",
  },
];

export default function SupplierGuidePage() {
  return (
    <PublicPageShell>
      {/* Hero */}
      <section
        style={{
          background: "#faf8f4",
          paddingTop: 80,
          paddingBottom: 64,
          paddingLeft: 24,
          paddingRight: 24,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#2d4a3e",
            letterSpacing: ".1em",
            textTransform: "uppercase",
            margin: "0 0 18px",
          }}
        >
          SUPPLIER GUIDE
        </p>
        <h1
          style={{
            fontSize: 38,
            fontWeight: 800,
            color: "#1c2b23",
            lineHeight: 1.15,
            margin: "0 0 18px",
            maxWidth: 640,
            marginInline: "auto",
          }}
        >
          Everything you need to sell on Procur
        </h1>
        <p
          style={{
            fontSize: 17,
            color: "rgba(28,43,35,.55)",
            margin: "0 0 36px",
            maxWidth: 500,
            marginInline: "auto",
            lineHeight: 1.6,
          }}
        >
          A step-by-step guide for farms and suppliers listing fresh produce.
        </p>
        <Link
          href="/signup?accountType=seller"
          style={{
            display: "inline-block",
            padding: "14px 32px",
            background: "#d4783c",
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
            borderRadius: 999,
            textDecoration: "none",
          }}
        >
          Create a supplier account
        </Link>
      </section>

      {/* Steps */}
      <section
        style={{
          maxWidth: 800,
          margin: "72px auto 0",
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#1c2b23",
            margin: "0 0 32px",
          }}
        >
          Getting started
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {STEPS.map((step) => (
            <div
              key={step.number}
              style={{
                background: "#f5f1ea",
                border: "1px solid #e8e4dc",
                borderRadius: 12,
                padding: 28,
                display: "flex",
                gap: 20,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#2d4a3e",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {step.number}
              </div>
              <div>
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#1c2b23",
                    margin: "0 0 6px",
                    lineHeight: 1.3,
                  }}
                >
                  {step.title}
                </p>
                <p
                  style={{
                    fontSize: 14,
                    color: "rgba(28,43,35,.65)",
                    margin: 0,
                    lineHeight: 1.65,
                  }}
                >
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tips */}
      <section
        style={{
          maxWidth: 800,
          margin: "56px auto 0",
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        <div
          style={{
            background: "#f5f1ea",
            border: "1px solid #e8e4dc",
            borderRadius: 12,
            padding: 32,
          }}
        >
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#1c2b23",
              margin: "0 0 20px",
            }}
          >
            Tips for success
          </h2>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {TIPS.map((tip, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  fontSize: 14,
                  color: "rgba(28,43,35,.75)",
                  lineHeight: 1.6,
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#d4783c",
                    marginTop: 8,
                  }}
                />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section
        style={{
          maxWidth: 800,
          margin: "56px auto 0",
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#1c2b23",
            margin: "0 0 24px",
          }}
        >
          Supplier FAQ
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {FAQS.map((faq, i) => (
            <div
              key={i}
              style={{
                background: "#f5f1ea",
                border: "1px solid #e8e4dc",
                borderRadius: 12,
                padding: 28,
              }}
            >
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#1c2b23",
                  margin: "0 0 10px",
                  lineHeight: 1.4,
                }}
              >
                {faq.q}
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(28,43,35,.65)",
                  margin: 0,
                  lineHeight: 1.65,
                }}
              >
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section
        style={{
          maxWidth: 800,
          margin: "72px auto 80px",
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        <div
          style={{
            background: "#1c2b23",
            borderRadius: 16,
            padding: "56px 40px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#f5f1ea",
              margin: "0 0 14px",
              lineHeight: 1.25,
            }}
          >
            Ready to reach more buyers? Join Procur today.
          </h2>
          <Link
            href="/signup?accountType=seller"
            style={{
              display: "inline-block",
              marginTop: 8,
              padding: "14px 32px",
              background: "#d4783c",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              borderRadius: 999,
              textDecoration: "none",
            }}
          >
            Create supplier account
          </Link>
        </div>
      </section>
    </PublicPageShell>
  );
}
