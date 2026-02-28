import type { Metadata } from "next";
import Link from "next/link";
import PublicPageShell from "@/components/layout/PublicPageShell";

export const metadata: Metadata = {
  title: "Buyer Guide | Procur",
  description: "How buyers find, order, and receive fresh produce on Procur.",
};

const STEPS = [
  {
    number: 1,
    title: "Set up your buyer account",
    body: "Create your account with your business details. Tell us what you typically source so we can surface relevant suppliers.",
  },
  {
    number: 2,
    title: "Browse or search produce",
    body: "Use the marketplace to browse by category or search for a specific product. Filter by availability, price, and region.",
  },
  {
    number: 3,
    title: "Review supplier profiles",
    body: "Check ratings, product history, and listed availability before placing an order.",
  },
  {
    number: 4,
    title: "Place your order",
    body: "Select quantity and confirm your order details. You can add a note with specific requirements.",
  },
  {
    number: 5,
    title: "Confirm logistics",
    body: "Work with the supplier to arrange delivery or pickup. Procur shows logistics options if you need them.",
  },
  {
    number: 6,
    title: "Receive and review",
    body: "Once your order arrives, mark it as received and leave a review. Your feedback helps other buyers.",
  },
];

const BENEFITS = [
  {
    title: "Verified suppliers",
    body: "Every supplier is reviewed before they can sell.",
  },
  {
    title: "Real availability",
    body: "Listings reflect what is actually ready to ship.",
  },
  {
    title: "Order tracking",
    body: "Follow every order from confirmation to delivery.",
  },
  {
    title: "Simple reordering",
    body: "Place repeat orders in seconds from your order history.",
  },
];

const FAQS = [
  {
    q: "Can I negotiate pricing?",
    a: "Some suppliers accept quote requests. You can use the message system to discuss pricing before placing a formal order.",
  },
  {
    q: "What if my order arrives with quality issues?",
    a: "Contact support within 48 hours with photos. We will work with you and the supplier to resolve it.",
  },
  {
    q: "Can I place recurring orders?",
    a: "Yes. You can schedule repeat orders from your buyer dashboard on the Growth and Enterprise plans.",
  },
];

export default function BuyerGuidePage() {
  return (
    <PublicPageShell>
      {/* Hero */}
      <section
        style={{
          background: "#faf8f4",
          paddingTop: 80,
          paddingBottom: 72,
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#2d4a3e",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              margin: "0 0 18px",
            }}
          >
            BUYER GUIDE
          </p>
          <h1
            style={{
              fontSize: 38,
              fontWeight: 800,
              color: "#1c2b23",
              lineHeight: 1.18,
              margin: "0 0 20px",
            }}
          >
            Source fresh produce with confidence
          </h1>
          <p
            style={{
              fontSize: 17,
              color: "rgba(28,43,35,0.58)",
              margin: "0 0 36px",
              lineHeight: 1.6,
            }}
          >
            How buyers find, order, and receive quality produce on Procur.
          </p>
          <Link
            href="/signup?accountType=buyer"
            style={{
              display: "inline-block",
              padding: "13px 30px",
              background: "#d4783c",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              borderRadius: 999,
              textDecoration: "none",
            }}
          >
            Create a buyer account
          </Link>
        </div>
      </section>

      {/* How buying works */}
      <section
        style={{
          maxWidth: 800,
          margin: "0 auto",
          marginTop: 72,
          paddingLeft: 24,
          paddingRight: 24,
          paddingBottom: 0,
        }}
      >
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#1c2b23",
            margin: "0 0 36px",
          }}
        >
          How buying works
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {STEPS.map((step) => (
            <div
              key={step.number}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 20,
                background: "#f5f1ea",
                border: "1px solid #e8e4dc",
                borderRadius: 12,
                padding: "24px 28px",
              }}
            >
              {/* Step number circle */}
              <div
                style={{
                  flexShrink: 0,
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#d4783c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 800,
                  marginTop: 2,
                }}
              >
                {step.number}
              </div>
              <div>
                <p
                  style={{
                    fontSize: 15,
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
                    color: "rgba(28,43,35,0.62)",
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why buyers choose Procur */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          marginTop: 56,
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
          Why buyers choose Procur
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
          }}
        >
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              style={{
                background: "#f5f1ea",
                border: "1px solid #e8e4dc",
                borderRadius: 12,
                padding: "28px 24px",
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#1c2b23",
                  margin: "0 0 10px",
                  lineHeight: 1.3,
                }}
              >
                {benefit.title}
              </p>
              <p
                style={{
                  fontSize: 13.5,
                  color: "rgba(28,43,35,0.6)",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {benefit.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section
        style={{
          maxWidth: 800,
          margin: "0 auto",
          marginTop: 56,
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
          Buyer FAQ
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {FAQS.map((faq) => (
            <div
              key={faq.q}
              style={{
                background: "#f5f1ea",
                border: "1px solid #e8e4dc",
                borderRadius: 12,
                padding: "24px 28px",
              }}
            >
              <p
                style={{
                  fontSize: 14.5,
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
                  color: "rgba(28,43,35,0.62)",
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
          maxWidth: 1100,
          margin: "0 auto",
          marginTop: 72,
          paddingLeft: 24,
          paddingRight: 24,
          paddingBottom: 80,
        }}
      >
        <div
          style={{
            background: "#1c2b23",
            borderRadius: 16,
            padding: "64px 40px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#f5f1ea",
              margin: "0 0 18px",
              lineHeight: 1.25,
            }}
          >
            Start sourcing smarter. Join Procur.
          </h2>
          <Link
            href="/signup?accountType=buyer"
            style={{
              display: "inline-block",
              padding: "13px 32px",
              background: "#d4783c",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              borderRadius: 999,
              textDecoration: "none",
            }}
          >
            Create buyer account
          </Link>
        </div>
      </section>
    </PublicPageShell>
  );
}
