import type { Metadata } from "next";
import Link from "next/link";
import PublicPageShell from "@/components/layout/PublicPageShell";

export const metadata: Metadata = {
  title: "Help Center | Procur",
  description:
    "Find guides, answers, and support for buyers and suppliers on Procur.",
};

const CATEGORY_CARDS = [
  {
    title: "Getting Started",
    description: "Set up your account and learn the basics.",
    href: "/help/faq",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M14 3L17.5 10.5L26 11.5L20 17.5L21.5 26L14 22L6.5 26L8 17.5L2 11.5L10.5 10.5L14 3Z"
          fill="none"
          stroke="#d4783c"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <circle cx="14" cy="14" r="3" fill="#d4783c" />
        <line
          x1="14"
          y1="2"
          x2="14"
          y2="5"
          stroke="#d4783c"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <line
          x1="22"
          y1="6"
          x2="20"
          y2="8"
          stroke="#d4783c"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "For Buyers",
    description: "Browse produce, place orders, and manage deliveries.",
    href: "/buyer-guide",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M5 7H23L21 20H7L5 7Z"
          stroke="#2d4a3e"
          strokeWidth="1.8"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M5 7L4 3H2"
          stroke="#2d4a3e"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M10 7V5C10 3.9 10.9 3 12 3H16C17.1 3 18 3.9 18 5V7"
          stroke="#2d4a3e"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="10" cy="23" r="1.5" fill="#2d4a3e" />
        <circle cx="18" cy="23" r="1.5" fill="#2d4a3e" />
      </svg>
    ),
  },
  {
    title: "For Suppliers",
    description: "List produce, accept orders, and get paid.",
    href: "/supplier-guide",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M14 3C14 3 7 9 7 15C7 18.866 10.134 22 14 22C17.866 22 21 18.866 21 15C21 9 14 3 14 3Z"
          stroke="#2d4a3e"
          strokeWidth="1.8"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M14 22V26"
          stroke="#2d4a3e"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M10 26H18"
          stroke="#2d4a3e"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M14 15C14 15 11 12 11 10"
          stroke="#2d4a3e"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
    ),
  },
  {
    title: "Account and Billing",
    description: "Manage your subscription, payments, and settings.",
    href: "/help/faq",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="2"
          y="7"
          width="24"
          height="16"
          rx="3"
          stroke="#2d4a3e"
          strokeWidth="1.8"
          fill="none"
        />
        <path
          d="M2 12H26"
          stroke="#2d4a3e"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <rect x="5" y="16" width="5" height="3" rx="1" fill="#2d4a3e" />
        <rect x="12" y="16" width="3" height="3" rx="1" fill="#2d4a3e" opacity="0.4" />
      </svg>
    ),
  },
];

const POPULAR_ARTICLES = [
  { label: "How to create your first listing", href: "/supplier-guide" },
  { label: "Understanding order statuses", href: "/help/faq" },
  { label: "How buyers can request a quote", href: "/buyer-guide" },
  { label: "Setting up WhatsApp notifications", href: "/help/faq" },
  { label: "How to track a delivery", href: "/help/faq" },
  { label: "Cancelling or editing an order", href: "/help/faq" },
];

export default function HelpPage() {
  return (
    <PublicPageShell>
      {/* Hero */}
      <section
        style={{
          background: "#2d4a3e",
          paddingTop: 80,
          paddingBottom: 88,
          textAlign: "center",
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        <h1
          style={{
            fontSize: 42,
            fontWeight: 800,
            color: "#ffffff",
            margin: "0 0 16px",
            lineHeight: 1.15,
          }}
        >
          How can we help?
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.72)",
            margin: 0,
            maxWidth: 440,
            marginInline: "auto",
            lineHeight: 1.6,
          }}
        >
          Find guides, answers, and support for every part of Procur.
        </p>
      </section>

      {/* Category Cards -- overlap hero by 40px */}
      <div
        style={{
          maxWidth: 900,
          marginInline: "auto",
          marginTop: -40,
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
          }}
        >
          {CATEGORY_CARDS.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              style={{
                display: "block",
                background: "#ffffff",
                border: "1px solid #e8e4dc",
                borderRadius: 12,
                padding: 28,
                textDecoration: "none",
                color: "#1c2b23",
                transition: "border-color 0.15s",
              }}
            >
              <div style={{ marginBottom: 14 }}>{card.icon}</div>
              <h2
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  margin: "0 0 8px",
                  color: "#1c2b23",
                }}
              >
                {card.title}
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(28,43,35,0.62)",
                  margin: 0,
                  lineHeight: 1.55,
                }}
              >
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Articles */}
      <div
        style={{
          maxWidth: 720,
          marginInline: "auto",
          marginTop: 64,
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            margin: "0 0 24px",
            color: "#1c2b23",
          }}
        >
          Popular articles
        </h2>
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e8e4dc",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {POPULAR_ARTICLES.map((article, index) => (
            <Link
              key={article.label}
              href={article.href}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 20px",
                borderBottom:
                  index < POPULAR_ARTICLES.length - 1
                    ? "1px solid #e8e4dc"
                    : "none",
                textDecoration: "none",
                color: "#1c2b23",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              <span>{article.label}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                style={{ flexShrink: 0, marginLeft: 12, opacity: 0.4 }}
              >
                <path
                  d="M6 3L11 8L6 13"
                  stroke="#1c2b23"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Support Options */}
      <div
        style={{
          maxWidth: 720,
          marginInline: "auto",
          marginTop: 64,
          marginBottom: 96,
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            margin: "0 0 24px",
            color: "#1c2b23",
          }}
        >
          Still need help?
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
          }}
        >
          {/* Browse FAQ */}
          <Link
            href="/help/faq"
            style={{
              display: "block",
              background: "#f5f1ea",
              border: "1px solid #e8e4dc",
              borderRadius: 12,
              padding: 28,
              textDecoration: "none",
              color: "#1c2b23",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: "rgba(45,74,62,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="9"
                  stroke="#2d4a3e"
                  strokeWidth="1.7"
                />
                <path
                  d="M8.5 8.5C8.5 7.1 9.6 6 11 6C12.4 6 13.5 7.1 13.5 8.5C13.5 9.9 11 11 11 12.5"
                  stroke="#2d4a3e"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
                <circle cx="11" cy="15.5" r="0.9" fill="#2d4a3e" />
              </svg>
            </div>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                margin: "0 0 6px",
                color: "#1c2b23",
              }}
            >
              Browse FAQ
            </h3>
            <p
              style={{
                fontSize: 13,
                color: "rgba(28,43,35,0.6)",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Search common questions and answers across all topics.
            </p>
          </Link>

          {/* Contact Support */}
          <Link
            href="/help/support"
            style={{
              display: "block",
              background: "#f5f1ea",
              border: "1px solid #e8e4dc",
              borderRadius: 12,
              padding: 28,
              textDecoration: "none",
              color: "#1c2b23",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: "rgba(212,120,60,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 4H18C19.1 4 20 4.9 20 6V14C20 15.1 19.1 16 18 16H7L3 20V6C3 4.9 3.9 4 4 4Z"
                  stroke="#d4783c"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="M7 9H15M7 12H12"
                  stroke="#d4783c"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                margin: "0 0 6px",
                color: "#1c2b23",
              }}
            >
              Contact Support
            </h3>
            <p
              style={{
                fontSize: 13,
                color: "rgba(28,43,35,0.6)",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Reach our team directly for account or order issues.
            </p>
          </Link>
        </div>
      </div>
    </PublicPageShell>
  );
}
