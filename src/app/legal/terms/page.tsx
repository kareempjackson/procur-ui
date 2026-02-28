import PublicPageShell from "@/components/layout/PublicPageShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions - Procur",
  description:
    "Procur's Terms & Conditions. Understand the rules for using our marketplace, logistics, and delivery services.",
};

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: "#1c2b23",
  margin: "0 0 12px",
  paddingBottom: 12,
  borderBottom: "1px solid #e8e4dc",
};

const bodyTextStyle: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.75,
  color: "#374151",
  margin: 0,
};

const subsectionHeadingStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: "#1c2b23",
  margin: "0 0 8px",
};

const listStyle: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: "10px 0 0",
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const listItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
  fontSize: 15,
  lineHeight: 1.75,
  color: "#374151",
};

const bulletStyle: React.CSSProperties = {
  display: "inline-block",
  width: 7,
  height: 7,
  borderRadius: "50%",
  background: "#d4783c",
  flexShrink: 0,
  marginTop: 8,
};

const sectionStyle: React.CSSProperties = {
  marginBottom: 40,
};

function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul style={listStyle}>
      {items.map((item, i) => (
        <li key={i} style={listItemStyle}>
          <span style={bulletStyle} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function TermsOfServicePage() {
  return (
    <PublicPageShell>
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "80px 24px 96px",
        }}
      >
        {/* Page header */}
        <div style={{ marginBottom: 48 }}>
          <h1
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: "#1c2b23",
              margin: "0 0 10px",
              lineHeight: 1.15,
            }}
          >
            Terms &amp; Conditions
          </h1>
          <p
            style={{
              fontSize: 12,
              color: "#6b7280",
              margin: "0 0 24px",
              fontWeight: 500,
              letterSpacing: ".01em",
            }}
          >
            Effective Date: December 5, 2025
          </p>
          <p style={bodyTextStyle}>
            These Terms &amp; Conditions (&quot;Terms&quot;) govern your use of
            the Procur platform (&quot;the Service&quot;). By accessing or using
            Procur, you agree to be bound by these Terms.
          </p>
        </div>

        {/* Intro */}
        <div style={sectionStyle}>
          <p style={bodyTextStyle}>
            These Terms &amp; Conditions (&quot;Terms&quot;) govern your use
            of the Procur platform (&quot;the Service&quot;). By accessing or
            using Procur, you agree to be bound by these Terms.
          </p>
        </div>

        {/* 1. Definitions */}
        <div style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>1. Definitions</h2>
          <p style={bodyTextStyle}>
            <span style={{ fontWeight: 700, color: "#1c2b23" }}>
              &quot;User&quot;
            </span>{" "}
            refers to farmers, buyers, logistics partners, and any individual
            accessing the platform.
          </p>
          <p style={{ ...bodyTextStyle, marginTop: 12 }}>
            <span style={{ fontWeight: 700, color: "#1c2b23" }}>
              &quot;Platform&quot;
            </span>{" "}
            refers to the Procur website, app, and associated systems.
          </p>
          <p style={{ ...bodyTextStyle, marginTop: 12 }}>
            <span style={{ fontWeight: 700, color: "#1c2b23" }}>
              &quot;Produce&quot;
            </span>{" "}
            refers to agricultural goods listed or purchased through the
            platform.
          </p>
        </div>

        {/* 2. Eligibility */}
        <div style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>2. Eligibility</h2>
          <p style={bodyTextStyle}>
            You must be at least 18 years old and legally authorized to enter
            contracts to use the platform.
          </p>
        </div>

        {/* 3. User Responsibilities */}
        <div style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>3. User Responsibilities</h2>

          <div style={{ marginBottom: 28 }}>
            <h3 style={subsectionHeadingStyle}>3.1 Farmers</h3>
            <BulletList
              items={[
                "Provide accurate details about produce, pricing, and availability",
                "Ensure honest representation of quality",
                "Prepare items for pickup at agreed times",
              ]}
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <h3 style={subsectionHeadingStyle}>3.2 Buyers</h3>
            <BulletList
              items={[
                "Place accurate orders",
                "Ensure timely payment (cash, digital, or invoiced)",
                "Provide correct delivery information",
              ]}
            />
          </div>

          <div>
            <h3 style={subsectionHeadingStyle}>3.3 Logistics Partners</h3>
            <BulletList
              items={[
                "Execute pickups and deliveries on time",
                "Handle produce responsibly",
                "Maintain professionalism and safety standards",
              ]}
            />
          </div>
        </div>

        {/* 4. Platform Responsibilities */}
        <div style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>4. Platform Responsibilities</h2>
          <p style={bodyTextStyle}>Procur will:</p>
          <BulletList
            items={[
              "Facilitate listings, orders, and delivery coordination",
              "Provide customer support",
              "Maintain reasonable uptime and service quality",
              "Ensure proper handling of personal and transactional data",
            ]}
          />
          <p style={{ ...bodyTextStyle, marginTop: 16 }}>
            Procur does not guarantee availability of produce or pricing set
            by farmers.
          </p>
        </div>

        {/* 5. Payments */}
        <div style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>5. Payments</h2>
          <p style={bodyTextStyle}>Payments may be made via:</p>
          <BulletList
            items={[
              "Cash",
              "Bank transfer",
              "Mobile wallets (when available)",
              "Invoice billing for approved buyers",
            ]}
          />
          <p style={{ ...bodyTextStyle, marginTop: 16 }}>
            Procur reserves the right to suspend accounts with overdue
            payments.
          </p>
        </div>

        {/* 6. Delivery & Logistics */}
        <div style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>6. Delivery &amp; Logistics</h2>
          <p style={bodyTextStyle}>
            Delivery windows are estimates. Procur will make reasonable
            efforts to ensure timely delivery but is not liable for delays
            caused by weather, traffic, farming conditions, or other external
            factors.
          </p>
        </div>

        {/* 7. Disputes & Refunds */}
        <div style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>7. Disputes &amp; Refunds</h2>
          <p style={bodyTextStyle}>
            Buyers must report issues within 24 hours of delivery. Procur may
            investigate and, at its discretion, issue refunds or credits.
            Farmers may dispute buyer claims, subject to verification.
          </p>
        </div>

        {/* 8. Prohibited Activities */}
        <div style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>8. Prohibited Activities</h2>
          <p style={bodyTextStyle}>Users must not:</p>
          <BulletList
            items={[
              "Provide false or misleading information",
              "Attempt to bypass the platform for transactions",
              "Upload harmful or malicious content",
              "Harass or abuse staff, farmers, or buyers",
            ]}
          />
          <p style={{ ...bodyTextStyle, marginTop: 16 }}>
            Violations may result in suspension or termination of access.
          </p>
        </div>

        {/* 9. Limitation of Liability */}
        <div style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>9. Limitation of Liability</h2>
          <p style={bodyTextStyle}>Procur is not liable for:</p>
          <BulletList
            items={[
              "Produce quality beyond what was reasonably represented",
              "Losses from delays, shortages, or inaccuracies caused by external factors",
              "Any indirect, incidental, or consequential damages",
            ]}
          />
          <p style={{ ...bodyTextStyle, marginTop: 16 }}>
            Your use of the platform is at your own risk.
          </p>
        </div>

        {/* 10. Termination */}
        <div style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>10. Termination</h2>
          <p style={bodyTextStyle}>
            Procur may suspend or terminate your account if you violate these
            Terms or engage in harmful behavior.
          </p>
          <p style={{ ...bodyTextStyle, marginTop: 12 }}>
            Users may deactivate their accounts by contacting{" "}
            <a
              href="mailto:support@procurapp.co"
              style={{
                color: "#d4783c",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              support@procurapp.co
            </a>
            .
          </p>
        </div>

        {/* 11. Governing Law */}
        <div style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>11. Governing Law</h2>
          <p style={bodyTextStyle}>
            These Terms are governed by the laws of Grenada.
          </p>
        </div>

        {/* 12. Contact Information */}
        <div style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>12. Contact Information</h2>
          <p style={bodyTextStyle}>
            Questions or concerns may be directed to:{" "}
            <a
              href="mailto:support@procurapp.co"
              style={{
                color: "#d4783c",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              support@procurapp.co
            </a>
            .
          </p>
        </div>

        {/* Contact card */}
        <div
          style={{
            marginTop: 56,
            background: "#ffffff",
            border: "1px solid #e8e4dc",
            borderRadius: 12,
            padding: 28,
          }}
        >
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#1c2b23",
              margin: "0 0 10px",
            }}
          >
            Questions About These Terms
          </h2>
          <p style={{ ...bodyTextStyle, marginBottom: 20 }}>
            If you have questions about these Terms &amp; Conditions or need
            clarification on any provisions, please contact us:
          </p>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#1c2b23",
              margin: "0 0 4px",
              textTransform: "uppercase",
              letterSpacing: ".06em",
            }}
          >
            Email
          </p>
          <a
            href="mailto:support@procurapp.co"
            style={{
              fontSize: 15,
              color: "#d4783c",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            support@procurapp.co
          </a>
        </div>
      </div>
    </PublicPageShell>
  );
}
