import Link from "next/link";
import type { Metadata } from "next";
import PublicPageShell from "@/components/layout/PublicPageShell";

export const metadata: Metadata = {
  title: "Restaurants | Procur",
  description:
    "Fresh, locally sourced produce for restaurants. Direct farm relationships and transparent pricing on Procur.",
};

const BENEFITS = [
  {
    title: "Consistent quality",
    body: "Work directly with verified farms that list real inventory. What you see is what arrives.",
  },
  {
    title: "Flexible ordering",
    body: "Order what you need when you need it. No long-term contracts or volume commitments required.",
  },
  {
    title: "Full transparency",
    body: "See farm names, growing practices, and pricing upfront. No surprises on invoice day.",
  },
];

const STEPS = [
  "Browse available produce and find the farms your kitchen needs.",
  "Place orders with your preferred suppliers directly through Procur.",
  "Receive produce and manage delivery schedules from your buyer dashboard.",
];

export default function RestaurantsPage() {
  return (
    <PublicPageShell>
      <div style={{ background: "#faf8f4", color: "#1c2b23", fontFamily: "'Urbanist', system-ui, sans-serif" }}>

        {/* Hero */}
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 56px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 64,
              alignItems: "center",
            }}
          >
            {/* Left */}
            <div>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#2d4a3e",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  margin: "0 0 16px",
                }}
              >
                For Restaurants
              </p>
              <h1
                style={{
                  fontSize: 44,
                  fontWeight: 800,
                  lineHeight: 1.15,
                  margin: "0 0 20px",
                  color: "#1c2b23",
                }}
              >
                Fresh produce, reliably sourced for your kitchen
              </h1>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: "#4a5f57",
                  margin: "0 0 32px",
                  maxWidth: 460,
                }}
              >
                Procur helps restaurants build direct relationships with local farms. Get consistent
                quality and transparent pricing without the middleman markup.
              </p>
              <Link
                href="/signup?accountType=buyer"
                style={{
                  display: "inline-block",
                  padding: "14px 32px",
                  background: "#d4783c",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 700,
                  borderRadius: 999,
                  textDecoration: "none",
                }}
              >
                Start sourcing
              </Link>
            </div>

            {/* Right: stat block */}
            <div
              style={{
                background: "#f5f1ea",
                border: "1px solid #e8e4dc",
                borderRadius: 16,
                padding: 32,
              }}
            >
              {[
                { value: "50+", label: "suppliers" },
                { value: "2 day", label: "average lead time" },
                { value: "No minimum", label: "order" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  style={{
                    paddingTop: i === 0 ? 0 : 24,
                    marginTop: i === 0 ? 0 : 24,
                    borderTop: i === 0 ? "none" : "1px solid #e8e4dc",
                  }}
                >
                  <p
                    style={{
                      fontSize: 32,
                      fontWeight: 800,
                      color: "#1c2b23",
                      margin: "0 0 4px",
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      color: "#6b7f78",
                      margin: 0,
                      fontWeight: 500,
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefit cards */}
        <section style={{ maxWidth: 1100, margin: "72px auto 0", padding: "0 24px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 24,
            }}
          >
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                style={{
                  background: "#f5f1ea",
                  border: "1px solid #e8e4dc",
                  borderRadius: 12,
                  padding: 28,
                }}
              >
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#1c2b23",
                    margin: "0 0 10px",
                    lineHeight: 1.3,
                  }}
                >
                  {benefit.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.65,
                    color: "#4a5f57",
                    margin: 0,
                  }}
                >
                  {benefit.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section
          style={{
            maxWidth: 800,
            margin: "80px auto 0",
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#1c2b23",
              margin: "0 0 40px",
              lineHeight: 1.2,
            }}
          >
            How restaurants use Procur
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24, textAlign: "left" }}>
            {STEPS.map((step, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 20,
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: 36,
                    height: 36,
                    borderRadius: 999,
                    background: "#d4783c",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  {i + 1}
                </div>
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: 1.65,
                    color: "#1c2b23",
                    margin: "6px 0 0",
                    fontWeight: 500,
                  }}
                >
                  {step}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Pull quote */}
        <section
          style={{
            maxWidth: 700,
            margin: "64px auto 0",
            padding: "0 24px",
          }}
        >
          <div
            style={{
              background: "#f5f1ea",
              border: "1px solid #e8e4dc",
              borderRadius: 12,
              padding: "36px 40px",
            }}
          >
            <p
              style={{
                fontSize: 18,
                lineHeight: 1.7,
                color: "#1c2b23",
                fontWeight: 500,
                fontStyle: "italic",
                margin: "0 0 20px",
              }}
            >
              We reduced our produce cost by sourcing directly from farms through Procur. The
              transparency alone was worth switching.
            </p>
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#6b7f78",
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Executive Chef, Restaurant Partner
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section style={{ maxWidth: 1100, margin: "72px auto 0", padding: "0 24px 80px" }}>
          <div
            style={{
              background: "#1c2b23",
              borderRadius: 16,
              padding: 60,
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: "#f5f1ea",
                margin: "0 0 28px",
                lineHeight: 1.25,
              }}
            >
              Built for restaurant kitchens. Grown on Caribbean farms.
            </h2>
            <Link
              href="/signup?accountType=buyer"
              style={{
                display: "inline-block",
                padding: "14px 36px",
                background: "#d4783c",
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                borderRadius: 999,
                textDecoration: "none",
              }}
            >
              Create a buyer account
            </Link>
          </div>
        </section>

      </div>
    </PublicPageShell>
  );
}
