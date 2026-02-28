import Link from "next/link";
import type { Metadata } from "next";
import PublicPageShell from "@/components/layout/PublicPageShell";

export const metadata: Metadata = {
  title: "Government | Procur",
  description:
    "Transparent produce procurement for government food programs. Verified suppliers, audit trails, and bulk order support on Procur.",
};

const BENEFITS = [
  {
    title: "Traceable sourcing",
    body: "Every order is recorded with supplier details, quantities, and pricing. Export records for audit requirements.",
  },
  {
    title: "Verified local suppliers",
    body: "All farms and distributors on Procur are reviewed and approved before listing. Supporting the local economy by default.",
  },
  {
    title: "Competitive and transparent pricing",
    body: "Market pricing is visible across suppliers. Compare options and document your procurement rationale.",
  },
  {
    title: "School and institutional programs",
    body: "Procur has handled produce supply for school feeding programs. Talk to us about your specific requirements.",
  },
];

const STEPS = [
  "Contact our team to set up a government or institutional account with your procurement requirements.",
  "Browse verified suppliers and collect quotes for your program needs.",
  "Place orders, receive invoices, and maintain a complete audit trail automatically.",
];

const USE_CASES = [
  "School nutrition programs",
  "Hospital and health facility catering",
  "Public canteen and cafeteria supply",
  "Food assistance and distribution programs",
  "Agricultural development monitoring",
];

export default function GovernmentPage() {
  return (
    <PublicPageShell>
      {/* Hero */}
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
          {/* Left */}
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#2d4a3e",
                textTransform: "uppercase",
                letterSpacing: ".1em",
                margin: "0 0 16px",
              }}
            >
              FOR GOVERNMENT PROCUREMENT
            </p>
            <h1
              style={{
                fontSize: 44,
                fontWeight: 800,
                color: "#1c2b23",
                lineHeight: 1.12,
                margin: "0 0 20px",
              }}
            >
              Transparent procurement for public sector food programs
            </h1>
            <p
              style={{
                fontSize: 16,
                color: "#3d5247",
                lineHeight: 1.65,
                margin: "0 0 32px",
              }}
            >
              Government agencies use Procur to source locally grown produce for
              school feeding programs, public canteens, and food assistance
              initiatives. Full audit trails and verified supplier records are
              included.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link
                href="/company/contact"
                style={{
                  display: "inline-block",
                  padding: "13px 28px",
                  background: "#d4783c",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  borderRadius: 999,
                  textDecoration: "none",
                }}
              >
                Contact our team
              </Link>
              <Link
                href="/signup"
                style={{
                  display: "inline-block",
                  padding: "13px 28px",
                  background: "transparent",
                  color: "#1c2b23",
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: 999,
                  border: "1px solid #c8c2b8",
                  textDecoration: "none",
                }}
              >
                Create account
              </Link>
            </div>
          </div>

          {/* Right: stat block */}
          <div
            style={{
              background: "#f5f1ea",
              border: "1px solid #e8e4dc",
              borderRadius: 12,
              padding: "36px 32px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {["Full audit trail", "Verified suppliers only", "Bulk order support"].map(
              (item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#2d4a3e",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#1c2b23",
                    }}
                  >
                    {item}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Benefits */}
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
            }}
          >
            Built for public sector requirements
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
            }}
          >
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                style={{
                  background: "#f5f1ea",
                  border: "1px solid #e8e4dc",
                  borderRadius: 12,
                  padding: "28px 28px",
                }}
              >
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#1c2b23",
                    margin: "0 0 10px",
                  }}
                >
                  {b.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "#3d5247",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {b.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
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
              margin: "0 0 36px",
            }}
          >
            How it works
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 24,
            }}
          >
            {STEPS.map((step, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#2d4a3e",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>
                <p
                  style={{
                    fontSize: 14,
                    color: "#3d5247",
                    lineHeight: 1.65,
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

      {/* Use cases */}
      <section
        style={{
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
            }}
          >
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#1c2b23",
                margin: "0 0 24px",
              }}
            >
              Common government use cases
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
              {USE_CASES.map((uc) => (
                <li
                  key={uc}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    fontSize: 15,
                    color: "#1c2b23",
                    fontWeight: 500,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#d4783c",
                      flexShrink: 0,
                    }}
                  />
                  {uc}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        style={{
          marginTop: 72,
          marginBottom: 0,
        }}
      >
        <div
          style={{
            background: "#1c2b23",
            padding: "72px 24px",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <p
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: "#f5f1ea",
                lineHeight: 1.25,
                margin: "0 0 32px",
              }}
            >
              Supporting food security and local agriculture across the
              Caribbean.
            </p>
            <Link
              href="/company/contact"
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
              Contact our team
            </Link>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
