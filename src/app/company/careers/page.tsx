import type { Metadata } from "next";
import Link from "next/link";
import PublicPageShell from "@/components/layout/PublicPageShell";

export const metadata: Metadata = {
  title: "Careers at Procur",
  description:
    "Join the team building the future of produce procurement. We're hiring across engineering, operations, and business development.",
};

const benefits = [
  {
    category: "Health & Wellness",
    items: [
      "Comprehensive health, dental, and vision insurance for you and your dependents",
      "Inclusive fertility benefits and family planning support",
      "16 weeks of paid parental leave",
      "Flexible paid time off and mental health days",
      "Generous mental health support and wellness programs",
      "$500/month flexible wellness and lifestyle stipend",
    ],
  },
  {
    category: "Compensation & Support",
    items: [
      "Competitive salary and equity packages",
      "Performance-based bonuses and equity refreshers",
      "Robust retirement plans with company matching",
      "Life and disability insurance coverage",
      "Annual education and conference stipend",
      "Home office setup and equipment allowance",
    ],
  },
  {
    category: "Work & Culture",
    items: [
      "Hybrid work model with flexible schedules",
      "Daily meals and snacks in the office",
      "Commuter benefits and transportation support",
      "Team retreats and company events",
      "Professional development opportunities",
      "Relocation support for qualifying roles",
    ],
  },
];

const values = [
  {
    number: "01",
    title: "Build for the global good",
    description:
      "We optimize for long-term outcomes that benefit growers, buyers, and the entire food system. Every decision considers the broader impact on global food security and sustainability.",
  },
  {
    number: "02",
    title: "Embrace transparency",
    description:
      "We believe in radical transparency across our supply chains, operations, and decision-making. Trust is built through openness and accountability.",
  },
  {
    number: "03",
    title: "Be good to our users",
    description:
      "Our users include farmers, suppliers, buyers, and communities. We cultivate empathy and kindness in all interactions, going above and beyond to serve their needs.",
  },
  {
    number: "04",
    title: "Drive industry standards",
    description:
      "As a safety-first company, we work to inspire a race to the top where the industry competes on quality, safety, and sustainability standards.",
  },
  {
    number: "05",
    title: "Do the simple thing that works",
    description:
      "We take an empirical approach to problems and care about impact over sophistication. We identify the simplest solution and iterate from there.",
  },
  {
    number: "06",
    title: "Put the mission first",
    description:
      "Building the world's most trusted produce marketplace is what unites us. The mission gives us shared purpose and guides our decisions.",
  },
];

const interviewInfo = [
  {
    title: "Diverse backgrounds welcome",
    description:
      "We value different perspectives and experiences. Many of our team members come from non-traditional backgrounds in agriculture, logistics, and technology.",
  },
  {
    title: "Practical problem-solving",
    description:
      "Our interviews focus on how you think through real-world challenges. We use collaborative environments and encourage looking up documentation.",
  },
  {
    title: "Mission alignment",
    description:
      "We are interested in what motivates you and how you think about building systems that serve the global food supply chain.",
  },
];

const additionalInfo = [
  {
    title: "Remote & hybrid work",
    description:
      "Most team members work hybrid with regular office days. We support fully remote work for certain roles and during transitions.",
  },
  {
    title: "Visa sponsorship",
    description:
      "We sponsor visas for qualifying candidates and roles. We retain immigration lawyers to support the process.",
  },
  {
    title: "Educational backgrounds vary",
    description:
      "We do not require specific degrees or previous industry experience. About half our team has advanced degrees; others bring diverse professional experience.",
  },
  {
    title: "Re-applying welcome",
    description:
      "If interviews do not work out, you are welcome to re-apply after 12 months, or earlier if your experience changes significantly.",
  },
  {
    title: "Offer flexibility",
    description:
      "We give candidates time to consider offers and finish other interview processes. We want you to make the best decision for your career.",
  },
  {
    title: "Internships",
    description:
      "We currently focus on full-time roles but occasionally offer project-based opportunities for exceptional candidates.",
  },
];

export default function CareersPage() {
  return (
    <PublicPageShell>
      {/* Hero */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "80px 24px 56px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 10,
            color: "#2d4a3e",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          CAREERS
        </p>
        <h1
          style={{
            fontSize: 42,
            fontWeight: 700,
            color: "#1c2b23",
            lineHeight: 1.15,
            margin: "0 auto 20px",
            maxWidth: 720,
          }}
        >
          Build the future of Caribbean food trade
        </h1>
        <p
          style={{
            fontSize: 17,
            color: "#5a6b63",
            lineHeight: 1.7,
            maxWidth: 600,
            margin: "0 auto 36px",
          }}
        >
          We are a mission-driven team based in Grenada. Join us to build tools
          that help farmers reach buyers and food move more reliably.
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="#open-roles"
            style={{
              display: "inline-block",
              background: "#d4783c",
              color: "#fff",
              fontWeight: 600,
              fontSize: 15,
              padding: "12px 28px",
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            See open roles
          </Link>
          <Link
            href="#values"
            style={{
              display: "inline-block",
              background: "transparent",
              color: "#1c2b23",
              fontWeight: 600,
              fontSize: 15,
              padding: "12px 28px",
              borderRadius: 8,
              border: "1px solid #c8c2b8",
              textDecoration: "none",
            }}
          >
            Our values
          </Link>
        </div>
      </section>

      {/* Mission */}
      <section
        style={{
          maxWidth: 900,
          margin: "72px auto 0",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px 48px",
        }}
      >
        <div>
          <p
            style={{
              fontSize: 16,
              color: "#3a4f46",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            Every day, we make critical decisions that shape the future of
            global food procurement. Building systems that connect farmers to
            markets, ensure food safety, and create economic opportunity is both
            a responsibility and a privilege.
          </p>
        </div>
        <div>
          <p
            style={{
              fontSize: 16,
              color: "#3a4f46",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            Our work impacts millions of people from smallholder farmers to
            large-scale buyers, from logistics partners to end consumers. We
            take this responsibility seriously and are committed to building
            technology that makes the food system more transparent, efficient,
            and equitable.
          </p>
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <blockquote
            style={{
              margin: 0,
              borderLeft: "4px solid #2d4a3e",
              background: "#f5f1ea",
              border: "1px solid #e8e4dc",
              borderLeftWidth: 4,
              borderLeftColor: "#2d4a3e",
              borderRadius: 12,
              padding: "24px 28px",
              fontSize: 18,
              fontStyle: "italic",
              color: "#1c2b23",
              lineHeight: 1.6,
            }}
          >
            We are not just building a marketplace. We are building the
            infrastructure for global food security.
          </blockquote>
        </div>
      </section>

      {/* Benefits */}
      <section
        style={{
          maxWidth: 1100,
          margin: "72px auto 0",
          padding: "0 24px",
        }}
      >
        <h2
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#1c2b23",
            marginBottom: 8,
          }}
        >
          What we offer
        </h2>
        <p
          style={{
            fontSize: 16,
            color: "#5a6b63",
            lineHeight: 1.7,
            maxWidth: 640,
            marginBottom: 36,
          }}
        >
          At Procur, we believe that supporting our team is crucial to our
          collective success. We offer comprehensive benefits to support you and
          your family, now and in the future.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {benefits.map((benefit, i) => (
            <div
              key={i}
              style={{
                background: "#f5f1ea",
                border: "1px solid #e8e4dc",
                borderRadius: 12,
                padding: "28px 24px",
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#1c2b23",
                  marginBottom: 16,
                }}
              >
                {benefit.category}
              </h3>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {benefit.items.map((item, j) => (
                  <li
                    key={j}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "#d4783c",
                        marginTop: 6,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 14,
                        color: "#3a4f46",
                        lineHeight: 1.6,
                      }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section
        id="values"
        style={{
          maxWidth: 1100,
          margin: "72px auto 0",
          padding: "0 24px",
        }}
      >
        <h2
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#1c2b23",
            marginBottom: 8,
          }}
        >
          What we value
        </h2>
        <p
          style={{
            fontSize: 16,
            color: "#5a6b63",
            lineHeight: 1.7,
            maxWidth: 640,
            marginBottom: 36,
          }}
        >
          Our values guide how we work together, the decisions we make, and
          ultimately how we show up for each other and work toward building the
          future of Caribbean food trade.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {values.map((value, i) => (
            <div
              key={i}
              style={{
                background: "#f5f1ea",
                border: "1px solid #e8e4dc",
                borderRadius: 12,
                padding: "28px 24px",
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  color: "#8a9e96",
                  marginBottom: 8,
                  fontWeight: 500,
                }}
              >
                {value.number}
              </p>
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#1c2b23",
                  marginBottom: 10,
                }}
              >
                {value.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "#3a4f46",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Interview Process */}
      <section
        style={{
          maxWidth: 1100,
          margin: "72px auto 0",
          padding: "0 24px",
        }}
      >
        <h2
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#1c2b23",
            marginBottom: 8,
          }}
        >
          Our interview process
        </h2>
        <p
          style={{
            fontSize: 16,
            color: "#5a6b63",
            lineHeight: 1.7,
            maxWidth: 640,
            marginBottom: 36,
          }}
        >
          The challenges we tackle at Procur demand diverse expertise and
          perspectives. Our interview process is designed to identify
          thoughtful candidates who bring unique strengths to our
          multidisciplinary team.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {interviewInfo.map((info, i) => (
            <div
              key={i}
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
                  marginBottom: 10,
                }}
              >
                {info.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "#3a4f46",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {info.description}
              </p>
            </div>
          ))}
        </div>

        {/* What to expect */}
        <div
          style={{
            background: "#f5f1ea",
            border: "1px solid #e8e4dc",
            borderRadius: 12,
            padding: "32px 28px",
            marginTop: 24,
          }}
        >
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#1c2b23",
              marginBottom: 16,
            }}
          >
            What to expect
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <p style={{ fontSize: 14, color: "#3a4f46", lineHeight: 1.7, margin: 0 }}>
              We use collaborative environments like Colab and Replit for
              technical interviews. You will be able to look things up in
              documentation or on the web, just like in real work.
            </p>
            <p style={{ fontSize: 14, color: "#3a4f46", lineHeight: 1.7, margin: 0 }}>
              We are interested in how you think through problems and analyze
              tradeoffs between approaches. You will also have time to ask us
              about Procur and what motivates our work.
            </p>
            <p style={{ fontSize: 14, color: "#3a4f46", lineHeight: 1.7, margin: 0 }}>
              All interviews are conducted over video call. We prefer Atlantic
              time office hours but can be flexible for international candidates.
            </p>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section
        style={{
          maxWidth: 1100,
          margin: "72px auto 0",
          padding: "0 24px",
        }}
      >
        <h2
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#1c2b23",
            marginBottom: 36,
          }}
        >
          Good to know
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 20,
          }}
        >
          {additionalInfo.map((info, i) => (
            <div
              key={i}
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
                  marginBottom: 10,
                }}
              >
                {info.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "#3a4f46",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {info.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Open Roles CTA */}
      <section
        id="open-roles"
        style={{
          maxWidth: 1100,
          margin: "72px auto 0",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            background: "#1c2b23",
            borderRadius: 16,
            padding: "60px 48px",
            color: "#fff",
          }}
        >
          <h2
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#fff",
              marginBottom: 16,
              lineHeight: 1.2,
            }}
          >
            Ready to join the team?
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.7,
              maxWidth: 560,
              marginBottom: 36,
            }}
          >
            We are actively hiring across engineering, operations, and business
            development.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 16,
              marginBottom: 40,
            }}
          >
            {/* Engineering */}
            <div
              style={{
                background: "rgba(255,255,255,.08)",
                borderRadius: 12,
                padding: "20px 22px",
              }}
            >
              <h4
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: 10,
                }}
              >
                Engineering
              </h4>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                {[
                  "Senior Full-Stack Engineer",
                  "Platform Engineer",
                  "Mobile Engineer (React Native)",
                ].map((role) => (
                  <li
                    key={role}
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    {role}
                  </li>
                ))}
              </ul>
            </div>

            {/* Operations */}
            <div
              style={{
                background: "rgba(255,255,255,.08)",
                borderRadius: 12,
                padding: "20px 22px",
              }}
            >
              <h4
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: 10,
                }}
              >
                Operations
              </h4>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                {[
                  "Supply Chain Operations Manager",
                  "Quality Assurance Specialist",
                  "Logistics Coordinator",
                ].map((role) => (
                  <li
                    key={role}
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    {role}
                  </li>
                ))}
              </ul>
            </div>

            {/* Business */}
            <div
              style={{
                background: "rgba(255,255,255,.08)",
                borderRadius: 12,
                padding: "20px 22px",
              }}
            >
              <h4
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: 10,
                }}
              >
                Business
              </h4>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                {[
                  "Business Development Manager",
                  "Partnership Manager",
                  "Customer Success Manager",
                ].map((role) => (
                  <li
                    key={role}
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    {role}
                  </li>
                ))}
              </ul>
            </div>

            {/* Specialized */}
            <div
              style={{
                background: "rgba(255,255,255,.08)",
                borderRadius: 12,
                padding: "20px 22px",
              }}
            >
              <h4
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: 10,
                }}
              >
                Specialized
              </h4>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                {[
                  "Food Safety Compliance Officer",
                  "Data Analyst",
                  "Government Relations Specialist",
                ].map((role) => (
                  <li
                    key={role}
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    {role}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <a
            href="mailto:careers@procur.com"
            style={{
              display: "inline-block",
              background: "#d4783c",
              color: "#fff",
              fontWeight: 600,
              fontSize: 15,
              padding: "13px 30px",
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            Email careers@procur.com
          </a>
        </div>
      </section>

      {/* Contact card */}
      <section
        style={{
          maxWidth: 1100,
          margin: "48px auto 80px",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            background: "#f5f1ea",
            border: "1px solid #e8e4dc",
            borderRadius: 12,
            padding: "40px 24px",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#1c2b23",
              marginBottom: 10,
            }}
          >
            Questions about working at Procur?
          </h3>
          <p
            style={{
              fontSize: 15,
              color: "#5a6b63",
              lineHeight: 1.6,
              marginBottom: 24,
            }}
          >
            We would love to hear from you. Reach out to learn more about our
            mission, culture, and open opportunities.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="mailto:careers@procur.com"
              style={{
                display: "inline-block",
                background: "#d4783c",
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
                padding: "10px 24px",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              careers@procur.com
            </a>
            <a
              href="https://linkedin.com/company/procur"
              style={{
                display: "inline-block",
                background: "transparent",
                color: "#1c2b23",
                fontWeight: 600,
                fontSize: 14,
                padding: "10px 24px",
                borderRadius: 8,
                border: "1px solid #c8c2b8",
                textDecoration: "none",
              }}
            >
              Follow us on LinkedIn
            </a>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
