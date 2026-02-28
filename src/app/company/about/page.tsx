import PublicPageShell from "@/components/layout/PublicPageShell";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Procur",
  description:
    "Learn what Procur does and how we support farmers, buyers, and logistics partners.",
};

const WHAT_WE_DO = [
  {
    title: "For farmers",
    body: "Publish offers, confirm orders, and get clearer visibility into demand and logistics.",
  },
  {
    title: "For buyers",
    body: "See reliable options, agree on terms, and track orders from confirmation to delivery.",
  },
  {
    title: "For logistics",
    body: "Coordinate routes, pickups, and drops with the information you need in one place.",
  },
  {
    title: "For the system",
    body: "Support safer, more transparent trade that reduces waste and builds long-term relationships.",
  },
];

const HOW_WE_WORK = [
  {
    title: "We start with the basics",
    body: "Clear standards, dependable delivery, and simple tools for getting work done.",
  },
  {
    title: "We focus on trust",
    body: "Every seller is reviewed. Every listing reflects real availability.",
  },
  {
    title: "We stay close to the ground",
    body: "Our team is based in Grenada and understands local agriculture.",
  },
];

export default function AboutPage() {
  return (
    <PublicPageShell>
      {/* Hero */}
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "80px 24px 48px",
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
          ABOUT
        </p>
        <h1
          style={{
            fontSize: 38,
            fontWeight: 800,
            color: "#1c2b23",
            lineHeight: 1.2,
            margin: "0 0 20px",
            maxWidth: 700,
            marginInline: "auto",
          }}
        >
          Connecting farmers, buyers, and logistics across the Caribbean
        </h1>
        <p
          style={{
            fontSize: 17,
            color: "#5a6b62",
            lineHeight: 1.65,
            maxWidth: 580,
            margin: "0 auto",
          }}
        >
          Procur is a produce marketplace built for the realities of Caribbean
          agriculture. Direct connections, clear pricing, and reliable
          coordination.
        </p>
      </section>

      {/* What Procur does */}
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 24px 64px",
        }}
      >
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#1c2b23",
            margin: "0 0 28px",
          }}
        >
          What Procur does
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 16,
          }}
        >
          {WHAT_WE_DO.map((item) => (
            <div
              key={item.title}
              style={{
                background: "#f5f1ea",
                border: "1px solid #e8e4dc",
                borderRadius: 12,
                padding: "28px 24px",
              }}
            >
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#1c2b23",
                  margin: "0 0 10px",
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "#5a6b62",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How we work */}
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 24px 64px",
        }}
      >
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#1c2b23",
            margin: "0 0 28px",
          }}
        >
          How we work
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {HOW_WE_WORK.map((item) => (
            <div
              key={item.title}
              style={{
                background: "#f5f1ea",
                border: "1px solid #e8e4dc",
                borderRadius: 12,
                padding: "28px 24px",
              }}
            >
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#1c2b23",
                  margin: "0 0 10px",
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "#5a6b62",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 24px 80px",
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
              fontSize: 28,
              fontWeight: 800,
              color: "#f5f1ea",
              margin: "0 0 14px",
              lineHeight: 1.25,
            }}
          >
            Work with Procur
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "rgba(245,241,234,.6)",
              margin: "0 0 32px",
              maxWidth: 440,
              marginInline: "auto",
              lineHeight: 1.65,
            }}
          >
            Create an account to start buying or selling, or reach out to talk
            about how Procur can work for your business.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link
              href="/signup"
              style={{
                padding: "12px 28px",
                background: "#d4783c",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                borderRadius: 999,
                textDecoration: "none",
              }}
            >
              Get started
            </Link>
            <Link
              href="/company/contact"
              style={{
                padding: "12px 28px",
                background: "transparent",
                color: "#f5f1ea",
                fontSize: 14,
                fontWeight: 600,
                borderRadius: 999,
                border: "1px solid rgba(245,241,234,.22)",
                textDecoration: "none",
              }}
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
