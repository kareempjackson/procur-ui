import type { Metadata } from "next";
import Link from "next/link";
import PublicPageShell from "@/components/layout/PublicPageShell";

export const metadata: Metadata = {
  title: "Pricing | Procur",
  description:
    "Transparent pricing for farmers, buyers, and enterprise teams on the Procur platform.",
};

const CHECK = (
  <span
    aria-hidden="true"
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 18,
      height: 18,
      borderRadius: "50%",
      background: "#2d4a3e",
      flexShrink: 0,
      marginRight: 10,
    }}
  >
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
      <path
        d="M1 4l2.5 2.5L9 1"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

const CHECK_LIGHT = (
  <span
    aria-hidden="true"
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 18,
      height: 18,
      borderRadius: "50%",
      background: "rgba(255,255,255,0.18)",
      flexShrink: 0,
      marginRight: 10,
    }}
  >
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
      <path
        d="M1 4l2.5 2.5L9 1"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

function FeatureItem({
  children,
  light,
}: {
  children: string;
  light?: boolean;
}) {
  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        fontSize: 14,
        color: light ? "rgba(245,241,234,0.85)" : "#3a4f44",
        marginBottom: 10,
        lineHeight: 1.4,
      }}
    >
      {light ? CHECK_LIGHT : CHECK}
      {children}
    </li>
  );
}

const FAQ_ITEMS = [
  {
    q: "Is there a free trial for the Growth plan?",
    a: "Yes. You get 14 days free, no credit card required.",
  },
  {
    q: "Can I switch plans later?",
    a: "You can upgrade or downgrade at any time from your account settings.",
  },
  {
    q: "How does pricing work for teams?",
    a: "Each plan covers one organization. If you need seats for a larger team, contact us for a custom quote.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept major credit cards and bank transfers. Caribbean businesses can also pay via local wire.",
  },
];

export default function PricingPage() {
  return (
    <PublicPageShell>
      {/* Hero */}
      <section
        style={{
          paddingTop: 80,
          paddingBottom: 48,
          textAlign: "center",
          background: "#faf8f4",
        }}
      >
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#2d4a3e",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            margin: "0 0 16px",
          }}
        >
          PRICING
        </p>
        <h1
          style={{
            fontSize: 42,
            fontWeight: 800,
            color: "#1c2b23",
            margin: "0 0 18px",
            lineHeight: 1.15,
          }}
        >
          Simple pricing for every operation
        </h1>
        <p
          style={{
            fontSize: 17,
            color: "#6b7c74",
            margin: 0,
          }}
        >
          No hidden fees. Pay for what your team actually needs.
        </p>
      </section>

      {/* Pricing cards */}
      <section
        style={{
          padding: "0 24px 80px",
          background: "#faf8f4",
        }}
      >
        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1.08fr 1fr",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* Starter */}
          <div
            style={{
              background: "#f5f1ea",
              border: "1px solid #e8e4dc",
              borderRadius: 12,
              padding: "36px 32px 32px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span
              style={{
                display: "inline-block",
                fontSize: 11,
                fontWeight: 700,
                color: "#2d4a3e",
                background: "rgba(45,74,62,0.1)",
                borderRadius: 999,
                padding: "4px 12px",
                marginBottom: 24,
                alignSelf: "flex-start",
              }}
            >
              Free forever
            </span>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#1c2b23",
                margin: "0 0 6px",
              }}
            >
              Starter
            </h2>
            <div style={{ margin: "0 0 8px" }}>
              <span style={{ fontSize: 38, fontWeight: 800, color: "#1c2b23" }}>
                $0
              </span>
              <span style={{ fontSize: 14, color: "#6b7c74", marginLeft: 4 }}>
                /month
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#6b7c74", margin: "0 0 28px", lineHeight: 1.5 }}>
              Small farms and individual buyers getting started
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px", flex: 1 }}>
              <FeatureItem>Up to 3 active listings</FeatureItem>
              <FeatureItem>Basic order management</FeatureItem>
              <FeatureItem>Buyer discovery</FeatureItem>
              <FeatureItem>Email support</FeatureItem>
            </ul>
            <Link
              href="/signup"
              style={{
                display: "block",
                textAlign: "center",
                padding: "12px 20px",
                fontSize: 14,
                fontWeight: 700,
                color: "#1c2b23",
                background: "transparent",
                border: "1.5px solid #c8c2b8",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              Get started free
            </Link>
          </div>

          {/* Growth (featured) */}
          <div
            style={{
              background: "#f5f1ea",
              border: "2px solid #d4783c",
              borderRadius: 12,
              padding: "36px 32px 32px",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <span
              style={{
                display: "inline-block",
                fontSize: 11,
                fontWeight: 700,
                color: "#d4783c",
                background: "rgba(212,120,60,0.1)",
                borderRadius: 999,
                padding: "4px 12px",
                marginBottom: 24,
                alignSelf: "flex-start",
              }}
            >
              Most popular
            </span>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#1c2b23",
                margin: "0 0 6px",
              }}
            >
              Growth
            </h2>
            <div style={{ margin: "0 0 8px" }}>
              <span style={{ fontSize: 38, fontWeight: 800, color: "#1c2b23" }}>
                $49
              </span>
              <span style={{ fontSize: 14, color: "#6b7c74", marginLeft: 4 }}>
                /month
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#6b7c74", margin: "0 0 28px", lineHeight: 1.5 }}>
              Growing farms and active buyers sourcing regularly
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px", flex: 1 }}>
              <FeatureItem>Unlimited listings</FeatureItem>
              <FeatureItem>Advanced order tracking</FeatureItem>
              <FeatureItem>Analytics dashboard</FeatureItem>
              <FeatureItem>Priority support</FeatureItem>
              <FeatureItem>WhatsApp notifications</FeatureItem>
            </ul>
            <Link
              href="/signup?plan=growth"
              style={{
                display: "block",
                textAlign: "center",
                padding: "12px 20px",
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                background: "#d4783c",
                border: "none",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              Start free trial
            </Link>
          </div>

          {/* Enterprise */}
          <div
            style={{
              background: "#1c2b23",
              border: "1px solid #1c2b23",
              borderRadius: 12,
              padding: "36px 32px 32px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span
              style={{
                display: "inline-block",
                fontSize: 11,
                fontWeight: 700,
                color: "rgba(245,241,234,0.7)",
                background: "rgba(245,241,234,0.1)",
                borderRadius: 999,
                padding: "4px 12px",
                marginBottom: 24,
                alignSelf: "flex-start",
              }}
            >
              Custom
            </span>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#f5f1ea",
                margin: "0 0 6px",
              }}
            >
              Enterprise
            </h2>
            <div style={{ margin: "0 0 8px" }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: "#f5f1ea", lineHeight: 1.3 }}>
                Let&apos;s talk
              </span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(245,241,234,0.6)", margin: "0 0 28px", lineHeight: 1.5 }}>
              Distributors, government procurement, and large buyers
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px", flex: 1 }}>
              <FeatureItem light>Everything in Growth</FeatureItem>
              <FeatureItem light>Dedicated account manager</FeatureItem>
              <FeatureItem light>Custom integrations</FeatureItem>
              <FeatureItem light>Volume pricing</FeatureItem>
              <FeatureItem light>SLA guarantees</FeatureItem>
            </ul>
            <Link
              href="/company/contact"
              style={{
                display: "block",
                textAlign: "center",
                padding: "12px 20px",
                fontSize: 14,
                fontWeight: 700,
                color: "#1c2b23",
                background: "#f5f1ea",
                border: "none",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              Contact sales
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        style={{
          padding: "0 24px 80px",
          background: "#faf8f4",
        }}
      >
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#1c2b23",
              margin: "0 0 40px",
              textAlign: "center",
            }}
          >
            Common questions
          </h2>
          <dl style={{ margin: 0 }}>
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                style={{
                  borderTop: i === 0 ? "1px solid #e8e4dc" : "none",
                  borderBottom: "1px solid #e8e4dc",
                  padding: "24px 0",
                }}
              >
                <dt
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#1c2b23",
                    margin: "0 0 10px",
                  }}
                >
                  {item.q}
                </dt>
                <dd
                  style={{
                    fontSize: 14,
                    color: "#6b7c74",
                    margin: 0,
                    lineHeight: 1.65,
                  }}
                >
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Final CTA banner */}
      <section
        style={{
          padding: "0 24px 80px",
          background: "#faf8f4",
        }}
      >
        <div
          style={{
            maxWidth: 780,
            margin: "0 auto",
            background: "#1c2b23",
            borderRadius: 16,
            padding: "56px 40px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: "#f5f1ea",
              margin: "0 0 18px",
              lineHeight: 1.25,
            }}
          >
            Still deciding? Talk to us.
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "rgba(245,241,234,0.6)",
              margin: "0 0 32px",
            }}
          >
            Our team can help you find the right plan for your operation.
          </p>
          <Link
            href="/company/contact"
            style={{
              display: "inline-block",
              padding: "13px 32px",
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
              background: "#d4783c",
              borderRadius: 999,
              textDecoration: "none",
            }}
          >
            Get in touch
          </Link>
        </div>
      </section>
    </PublicPageShell>
  );
}
