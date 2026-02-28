import PublicPageShell from "@/components/layout/PublicPageShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Procur",
  description:
    "Procur's Privacy Policy. Learn how we collect, use, and protect your personal information on our produce procurement platform.",
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

export default function PrivacyPolicyPage() {
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
            Privacy Policy
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
            Procur (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is
            committed to protecting the privacy and confidentiality of everyone
            who uses our platform, including farmers, buyers, agents, and
            partners. This Privacy Policy explains how we collect, use, store,
            and protect your personal information.
          </p>
        </div>

        {/* Intro */}
        <div style={sectionStyle}>
          <p style={bodyTextStyle}>
            This Privacy Policy applies to everyone who uses our platform,
            including farmers, buyers, agents, and partners. By using Procur,
            you agree to the collection, use, and protection of your
            information as described below.
          </p>
        </div>

        {/* 1. Information We Collect */}
        <div style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>1. Information We Collect</h2>

          <div style={{ marginBottom: 28 }}>
            <h3 style={subsectionHeadingStyle}>1.1 Personal Information</h3>
            <p style={bodyTextStyle}>
              We collect personal information you provide when you sign up,
              use our services, or communicate with us, including:
            </p>
            <BulletList
              items={[
                "Name",
                "Phone number",
                "Email address",
                "Business name (for buyers)",
                "Farm name and location (for farmers)",
              ]}
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <h3 style={subsectionHeadingStyle}>
              1.2 Transaction &amp; Platform Data
            </h3>
            <p style={bodyTextStyle}>
              As you use Procur, we collect information related to your
              activity on the platform, such as:
            </p>
            <BulletList
              items={[
                "Orders placed",
                "Delivery schedules",
                "Payment details (excluding full card numbers)",
                "Produce listings",
                "Communication logs with support",
              ]}
            />
          </div>

          <div>
            <h3 style={subsectionHeadingStyle}>1.3 Technical Information</h3>
            <p style={bodyTextStyle}>
              We also collect certain technical data to help us secure and
              improve the platform, including:
            </p>
            <BulletList
              items={[
                "IP address",
                "Device type",
                "Browser information",
                "Usage analytics for improving platform performance and reliability",
              ]}
            />
          </div>
        </div>

        {/* 2. How We Use Your Information */}
        <div style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>2. How We Use Your Information</h2>
          <p style={bodyTextStyle}>We use the information we collect to:</p>
          <BulletList
            items={[
              "Provide marketplace, logistics, and delivery services",
              "Process and manage orders and payments",
              "Verify farmer, buyer, and partner accounts",
              "Improve platform features, usability, and overall user experience",
              "Communicate updates, receipts, notifications, and support responses",
              "Generate anonymized agricultural insights and platform analytics",
            ]}
          />
          <p
            style={{
              ...bodyTextStyle,
              marginTop: 16,
              fontWeight: 700,
              color: "#1c2b23",
            }}
          >
            We do not sell your data to third parties.
          </p>
        </div>

        {/* 3. Sharing of Information */}
        <div style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>3. Sharing of Information</h2>
          <p style={bodyTextStyle}>
            We only share your information when it is necessary to deliver
            Procur&apos;s services or when required by law. This may include:
          </p>
          <BulletList
            items={[
              "Logistics partners for pickups and deliveries",
              "Payment processors for secure billing and settlements",
              "Regulatory authorities, if required by applicable law",
              "Data analytics providers, but only in anonymized or aggregated form",
            ]}
          />
          <p style={{ ...bodyTextStyle, marginTop: 16 }}>
            Any sharing of information is strictly limited to the purpose of
            operating, maintaining, and improving Procur&apos;s services.
          </p>
        </div>

        {/* 4. Data Security */}
        <div style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>4. Data Security</h2>
          <p style={bodyTextStyle}>
            We implement reasonable administrative, technical, and physical
            safeguards to protect your data from unauthorized access,
            alteration, or loss. While we work hard to secure your
            information, no online system is entirely risk-free. We encourage
            you to use strong passwords, keep your login details confidential,
            and report any suspicious activity to us immediately.
          </p>
        </div>

        {/* 5. Data Retention */}
        <div style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>5. Data Retention</h2>
          <p style={bodyTextStyle}>
            We retain your information for as long as your account is active
            or as needed to provide Procur&apos;s services. We may also retain
            certain information for a longer period if required for legal,
            regulatory, accounting, or operational purposes.
          </p>
        </div>

        {/* 6. Your Rights */}
        <div style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>6. Your Rights</h2>
          <p style={bodyTextStyle}>
            You have the right, subject to applicable law, to:
          </p>
          <BulletList
            items={[
              "Access the personal information we hold about you",
              "Request corrections to inaccurate or incomplete information",
              "Request deletion of your personal information, where legally permissible",
              "Object to or restrict certain types of processing in specific circumstances",
              "Contact us with questions or concerns about how your data is handled",
            ]}
          />
          <p style={{ ...bodyTextStyle, marginTop: 16 }}>
            To exercise any of these rights, please reach out to us using the
            contact details in the &quot;Contact Us About Privacy&quot; section
            below.
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
            Contact Us About Privacy
          </h2>
          <p style={{ ...bodyTextStyle, marginBottom: 20 }}>
            If you have questions about this Privacy Policy, our data
            practices, or would like to exercise your privacy rights, please
            contact us:
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
