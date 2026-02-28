import Link from "next/link";
import type { Metadata } from "next";
import PublicPageShell from "@/components/layout/PublicPageShell";

export const metadata: Metadata = {
  title: "Hotels | Procur",
  description:
    "Fresh local produce sourcing for hotels and resorts in the Caribbean. Bulk orders, scheduled deliveries, and verified farms.",
};

export default function HotelsPage() {
  return (
    <PublicPageShell>
      {/* ── Hero ── */}
      <section
        style={{
          background: "#faf8f4",
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
          <div style={{ flex: "1 1 420px" }}>
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
              For Hotels
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
              Reliable fresh produce for your guests and kitchen team
            </h1>
            <p
              style={{
                fontSize: 17,
                color: "#3d5c50",
                lineHeight: 1.65,
                margin: "0 0 36px",
                maxWidth: 480,
              }}
            >
              Hotels on Procur source fresh local produce at scale. Manage
              multiple kitchen orders, track deliveries, and build dependable
              supplier relationships.
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
              Get started
            </Link>
          </div>

          {/* Right stat block */}
          <div
            style={{
              flex: "0 1 320px",
              background: "#f5f1ea",
              border: "1px solid #e8e4dc",
              borderRadius: 16,
              padding: 32,
            }}
          >
            {[
              "Bulk order support",
              "Scheduled deliveries",
              "Verified Caribbean farms",
            ].map((item, i) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  paddingBottom: i < 2 ? 20 : 0,
                  marginBottom: i < 2 ? 20 : 0,
                  borderBottom: i < 2 ? "1px solid #e8e4dc" : "none",
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#d4783c",
                    flexShrink: 0,
                    display: "inline-block",
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

      {/* ── Benefits ── */}
      <section
        style={{
          background: "#faf8f4",
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
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
            }}
          >
            {[
              {
                title: "Scale without complexity",
                body: "Manage produce orders for multiple outlets and kitchen teams from one account.",
              },
              {
                title: "Scheduled deliveries",
                body: "Set delivery schedules that match your kitchen prep windows and event calendar.",
              },
              {
                title: "Local sourcing, reliably",
                body: "Build a consistent local supply that supports your farm-to-table positioning.",
              },
            ].map((card) => (
              <div
                key={card.title}
                style={{
                  background: "#f5f1ea",
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
                    margin: "0 0 12px",
                    lineHeight: 1.3,
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontSize: 14.5,
                    color: "#3d5c50",
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
          padding: "80px 24px 0",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: "#1c2b23",
              margin: "0 0 40px",
              textAlign: "center",
            }}
          >
            How it works
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 32,
            }}
          >
            {[
              "Set up your hotel or resort account and add your kitchen contacts.",
              "Browse and order from verified farms with the quantities your operation needs.",
              "Track deliveries and manage invoices across all your outlets in one place.",
            ].map((step, i) => (
              <div
                key={i}
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
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <p
                  style={{
                    fontSize: 15,
                    color: "#1c2b23",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quote card ── */}
      <section
        style={{
          background: "#faf8f4",
          padding: "64px 24px 0",
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            background: "#f5f1ea",
            border: "1px solid #e8e4dc",
            borderRadius: 12,
            padding: "40px 44px",
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
              fontStyle: "italic",
            }}
          >
            "Our F&B team uses Procur to manage all our local produce sourcing.
            It replaced the endless WhatsApp group chats."
          </p>
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#2d4a3e",
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
            }}
          >
            F&B Director, Hotel Partner
          </p>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section
        style={{
          padding: "72px 24px 80px",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            background: "#1c2b23",
            borderRadius: 16,
            padding: "64px 48px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "#f5f1ea",
              lineHeight: 1.4,
              margin: "0 0 32px",
              maxWidth: 560,
              marginInline: "auto",
            }}
          >
            From boutique guesthouses to large resorts, Procur works for your
            scale.
          </p>
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
    </PublicPageShell>
  );
}
