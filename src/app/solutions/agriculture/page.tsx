import type { Metadata } from "next";
import Link from "next/link";
import PublicPageShell from "@/components/layout/PublicPageShell";

export const metadata: Metadata = {
  title: "Agriculture | Procur",
  description:
    "Procur helps farms and agricultural cooperatives reach more buyers and manage orders directly.",
};

export default function AgriculturePage() {
  return (
    <PublicPageShell>
      {/* ── Hero ── */}
      <section
        style={{
          background: "#faf8f4",
          paddingTop: 80,
          paddingBottom: 56,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
        >
          {/* Left column */}
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
              For Agricultural Producers
            </p>
            <h1
              style={{
                fontSize: 44,
                fontWeight: 800,
                color: "#1c2b23",
                lineHeight: 1.15,
                margin: "0 0 20px",
              }}
            >
              Reach more buyers and get paid faster for what you grow
            </h1>
            <p
              style={{
                fontSize: 17,
                color: "#4a5e56",
                lineHeight: 1.65,
                margin: "0 0 32px",
              }}
            >
              Procur gives farms and agricultural cooperatives direct access to
              buyers across hospitality, retail, and government. List your
              produce, manage orders, and track payments in one place.
            </p>
            <Link
              href="/signup?accountType=seller"
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
              List your produce
            </Link>
          </div>

          {/* Right stat block */}
          <div
            style={{
              background: "#f5f1ea",
              border: "1px solid #e8e4dc",
              borderRadius: 12,
              padding: "36px 32px",
              display: "flex",
              flexDirection: "column",
              gap: 28,
            }}
          >
            {[
              {
                label: "Direct buyer access",
                detail:
                  "Connect with restaurants, hotels, grocery stores, and government programs without an intermediary.",
              },
              {
                label: "Faster payments",
                detail:
                  "Receive payment directly through Procur once your order is confirmed and delivered.",
              },
              {
                label: "No sales commission on Starter",
                detail:
                  "Get started without giving up a percentage of your earnings. Upgrade when you need more.",
              },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#d4783c",
                    flexShrink: 0,
                    marginTop: 7,
                  }}
                />
                <div>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#1c2b23",
                      margin: "0 0 4px",
                    }}
                  >
                    {item.label}
                  </p>
                  <p style={{ fontSize: 13.5, color: "#5a6e65", lineHeight: 1.55, margin: 0 }}>
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section
        style={{
          background: "#faf8f4",
          marginTop: 72,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#1c2b23",
              margin: "0 0 36px",
              textAlign: "center",
            }}
          >
            Built for farmers and cooperatives
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 24,
            }}
          >
            {[
              {
                title: "Market access",
                body: "Reach buyers you could not find on your own. Restaurants, hotels, grocery stores, and government programs all source on Procur.",
              },
              {
                title: "Fair pricing",
                body: "Set your own prices. No middleman taking a cut on your listings.",
              },
              {
                title: "Order management",
                body: "Handle inquiries, confirmations, and delivery scheduling in one dashboard. Spend less time on admin and more time farming.",
              },
            ].map((card) => (
              <div
                key={card.title}
                style={{
                  background: "#f5f1ea",
                  border: "1px solid #e8e4dc",
                  borderRadius: 12,
                  padding: "28px 24px",
                }}
              >
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#1c2b23",
                    margin: "0 0 12px",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontSize: 14.5,
                    color: "#4a5e56",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section
        style={{
          background: "#faf8f4",
          marginTop: 80,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#1c2b23",
              margin: "0 0 12px",
              textAlign: "center",
            }}
          >
            How it works for farmers
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "#5a6e65",
              textAlign: "center",
              margin: "0 0 48px",
            }}
          >
            Three steps from sign-up to first order.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 32,
            }}
          >
            {[
              {
                step: "1",
                text: "Create a supplier account with your farm or cooperative details.",
              },
              {
                step: "2",
                text: "Add listings for each produce type including variety, quantity, and pricing.",
              },
              {
                step: "3",
                text: "Receive and confirm orders, then arrange delivery or pickup with your buyer.",
              },
            ].map((item) => (
              <div
                key={item.step}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "#d4783c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: "#fff",
                    }}
                  >
                    {item.step}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 15,
                    color: "#1c2b23",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section
        style={{
          background: "#faf8f4",
          marginTop: 64,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <div
            style={{
              background: "#f5f1ea",
              border: "1px solid #e8e4dc",
              borderRadius: 12,
              padding: "40px 40px",
              maxWidth: 680,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: "#1c2b23",
                lineHeight: 1.55,
                margin: "0 0 20px",
              }}
            >
              "I listed my plantains and had my first order within three days.
              The buyers on Procur are serious."
            </p>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#5a6e65",
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Small Farm Owner, Grenada
            </p>
          </div>
        </div>
      </section>

      {/* ── Cooperatives section ── */}
      <section
        style={{
          background: "#faf8f4",
          marginTop: 56,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <div
            style={{
              background: "#f5f1ea",
              border: "1px solid #e8e4dc",
              borderRadius: 12,
              padding: "32px 36px",
            }}
          >
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#1c2b23",
                margin: "0 0 14px",
              }}
            >
              Agricultural cooperatives
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "#4a5e56",
                lineHeight: 1.65,
                margin: "0 0 20px",
                maxWidth: 640,
              }}
            >
              Cooperatives can manage multiple member farms under a single
              Procur account. Set up a shared supplier profile and allocate
              orders to individual members. Contact our team to learn more about
              cooperative accounts.
            </p>
            <Link
              href="/company/contact"
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#d4783c",
                textDecoration: "none",
              }}
            >
              Talk to our team
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section
        style={{
          marginTop: 72,
          background: "#1c2b23",
          padding: "72px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: "#f5f1ea",
              lineHeight: 1.25,
              margin: "0 0 32px",
            }}
          >
            Grown locally. Sold directly. Paid reliably.
          </h2>
          <Link
            href="/signup?accountType=seller"
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
            Start listing produce
          </Link>
        </div>
      </section>
    </PublicPageShell>
  );
}
