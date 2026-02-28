import type { Metadata } from "next";
import Link from "next/link";
import PublicPageShell from "@/components/layout/PublicPageShell";

export const metadata: Metadata = {
  title: "Grocery | Procur",
  description:
    "Fresh local produce sourcing for grocery retailers. Real availability, direct farm pricing, and reorder tools on Procur.",
};

export default function GroceryPage() {
  return (
    <PublicPageShell>
      {/* Hero */}
      <section
        style={{
          backgroundColor: "#faf8f4",
          color: "#1c2b23",
          padding: "80px 24px 56px",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 64,
            flexWrap: "wrap",
          }}
        >
          {/* Left */}
          <div style={{ flex: "1 1 340px" }}>
            <p
              style={{
                fontSize: 10,
                color: "#2d4a3e",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              For Grocery Retailers
            </p>
            <h1
              style={{
                fontSize: 44,
                fontWeight: 700,
                lineHeight: 1.15,
                color: "#1c2b23",
                marginBottom: 24,
                margin: "0 0 24px",
              }}
            >
              Stock your shelves with verified local produce
            </h1>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.65,
                color: "#3d4f47",
                marginBottom: 36,
              }}
            >
              Grocery retailers use Procur to source fresh local produce
              directly from farms. Get real availability, fair pricing, and
              reliable delivery windows.
            </p>
            <Link
              href="/signup?accountType=buyer"
              style={{
                display: "inline-block",
                backgroundColor: "#d4783c",
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                padding: "14px 32px",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              Start sourcing
            </Link>
          </div>

          {/* Right stat block */}
          <div
            style={{
              flex: "0 1 300px",
              backgroundColor: "#f5f1ea",
              border: "1px solid #e8e4dc",
              borderRadius: 12,
              padding: "32px 36px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {[
              "Real-time availability",
              "Direct farm pricing",
              "Order history and records",
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#2d4a3e",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#1c2b23",
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section
        style={{
          backgroundColor: "#faf8f4",
          padding: "72px 24px 0",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {[
              {
                title: "Live inventory",
                body: "Only see produce that is actually available. Listings are updated by farmers regularly.",
              },
              {
                title: "Competitive pricing",
                body: "Cut out intermediaries and access farm-gate pricing on everyday staples and seasonal items.",
              },
              {
                title: "Reorder in seconds",
                body: "Build a supplier list and reorder your regular items without starting from scratch each week.",
              },
            ].map((card) => (
              <div
                key={card.title}
                style={{
                  backgroundColor: "#f5f1ea",
                  border: "1px solid #e8e4dc",
                  borderRadius: 12,
                  padding: "32px 28px",
                }}
              >
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#1c2b23",
                    marginBottom: 12,
                    margin: "0 0 12px",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.65,
                    color: "#3d4f47",
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

      {/* How it works */}
      <section
        style={{
          backgroundColor: "#faf8f4",
          padding: "80px 24px 0",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#1c2b23",
              marginBottom: 40,
              margin: "0 0 40px",
            }}
          >
            How it works
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {[
              "Create a buyer account and browse produce from farms across the region.",
              "Place orders with the farms and quantities that work for your shop.",
              "Receive and track deliveries, then reorder with one click when stock runs low.",
            ].map((step, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 24,
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: "#d4783c",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {index + 1}
                </span>
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: 1.65,
                    color: "#1c2b23",
                    margin: 0,
                    paddingTop: 8,
                  }}
                >
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section
        style={{
          backgroundColor: "#faf8f4",
          padding: "64px 24px 0",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              backgroundColor: "#f5f1ea",
              border: "1px solid #e8e4dc",
              borderRadius: 12,
              padding: "40px 48px",
              borderLeft: "4px solid #2d4a3e",
            }}
          >
            <p
              style={{
                fontSize: 20,
                lineHeight: 1.6,
                fontStyle: "italic",
                color: "#1c2b23",
                margin: "0 0 20px",
              }}
            >
              "We switched to Procur for our local section and the difference
              was immediate. Better produce, lower cost."
            </p>
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#2d4a3e",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: 0,
              }}
            >
              Purchasing Manager, Grocery Partner
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        style={{
          padding: "72px 24px 80px",
          backgroundColor: "#faf8f4",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              backgroundColor: "#1c2b23",
              borderRadius: 12,
              padding: "56px 48px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "#fff",
                marginBottom: 32,
                margin: "0 0 32px",
                lineHeight: 1.25,
              }}
            >
              Local produce, directly from the farm to your shelves.
            </h2>
            <Link
              href="/signup?accountType=buyer"
              style={{
                display: "inline-block",
                backgroundColor: "#d4783c",
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                padding: "16px 40px",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              Create a buyer account
            </Link>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
