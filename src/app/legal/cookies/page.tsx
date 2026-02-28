"use client";

import { useState } from "react";
import PublicPageShell from "@/components/layout/PublicPageShell";

export default function CookiePolicyPage() {
  const lastUpdated = "January 15, 2025";
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    analytics: true,
    marketing: false,
    functional: true,
  });

  const handlePreferenceChange = (category: string, value: boolean) => {
    if (category === "necessary") return;
    setCookiePreferences((prev) => ({ ...prev, [category]: value }));
  };

  const savePreferences = () => {
    console.log("Saving cookie preferences:", cookiePreferences);
  };

  const cookieTypes = [
    {
      category: "Necessary Cookies",
      required: true,
      description:
        "Essential for the platform to function properly. These cannot be disabled.",
      examples: [
        "Authentication and session management",
        "Security and fraud prevention",
        "Load balancing and performance",
        "Shopping cart and order processing",
      ],
      retention: "Session or up to 1 year",
    },
    {
      category: "Analytics Cookies",
      required: false,
      description:
        "Help us understand how users interact with our platform to improve services.",
      examples: [
        "Page views and user behavior tracking",
        "Performance monitoring and optimization",
        "Error tracking and debugging",
        "A/B testing and feature usage",
      ],
      retention: "Up to 2 years",
    },
    {
      category: "Marketing Cookies",
      required: false,
      description:
        "Used to deliver relevant advertisements and measure campaign effectiveness.",
      examples: [
        "Targeted advertising and retargeting",
        "Social media integration",
        "Email marketing optimization",
        "Conversion tracking and attribution",
      ],
      retention: "Up to 1 year",
    },
    {
      category: "Functional Cookies",
      required: false,
      description:
        "Enable enhanced functionality and personalization features.",
      examples: [
        "Language and region preferences",
        "User interface customization",
        "Saved searches and filters",
        "Accessibility settings",
      ],
      retention: "Up to 1 year",
    },
  ];

  const thirdPartyServices = [
    {
      name: "Google Analytics",
      purpose: "Website analytics and user behavior tracking",
      type: "Analytics",
      retention: "26 months",
      optOut: "https://tools.google.com/dlpage/gaoptout",
    },
    {
      name: "Stripe",
      purpose: "Payment processing and fraud prevention",
      type: "Necessary",
      retention: "Varies by cookie",
      optOut: "Required for payment processing",
    },
    {
      name: "Intercom",
      purpose: "Customer support and communication",
      type: "Functional",
      retention: "1 year",
      optOut: "Can be disabled in preferences",
    },
    {
      name: "LinkedIn Ads",
      purpose: "Advertising and conversion tracking",
      type: "Marketing",
      retention: "1 year",
      optOut: "Can be disabled in preferences",
    },
    {
      name: "Hotjar",
      purpose: "User experience analysis and heatmaps",
      type: "Analytics",
      retention: "1 year",
      optOut: "https://www.hotjar.com/legal/compliance/opt-out",
    },
  ];

  const sections = [
    {
      title: "What Are Cookies",
      content: [
        {
          subtitle: "Definition",
          text: "Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and enabling certain functionality.",
        },
        {
          subtitle: "Similar Technologies",
          text: "We also use similar technologies such as web beacons, pixels, and local storage to collect information about your use of our platform and improve our services.",
        },
      ],
    },
    {
      title: "How We Use Cookies",
      content: [
        {
          subtitle: "Platform Functionality",
          text: "We use cookies to enable core platform features, maintain your session, remember your preferences, and provide security protections against fraud and unauthorized access.",
        },
        {
          subtitle: "Performance and Analytics",
          text: "Analytics cookies help us understand how users interact with our platform, which pages are most popular, and how we can improve the user experience and platform performance.",
        },
        {
          subtitle: "Personalization",
          text: "We use cookies to personalize your experience, including remembering your language preferences, customizing content, and providing relevant product recommendations.",
        },
        {
          subtitle: "Marketing and Advertising",
          text: "With your consent, we use marketing cookies to deliver targeted advertisements, measure campaign effectiveness, and provide social media integration features.",
        },
      ],
    },
    {
      title: "Managing Your Cookie Preferences",
      content: [
        {
          subtitle: "Browser Settings",
          text: "You can control cookies through your browser settings. Most browsers allow you to block or delete cookies, though this may affect platform functionality. Consult your browser's help documentation for specific instructions.",
        },
        {
          subtitle: "Opt-Out Tools",
          text: "For advertising cookies, you can opt out through industry tools like the Digital Advertising Alliance's opt-out page or the Network Advertising Initiative's opt-out tool.",
        },
        {
          subtitle: "Mobile Devices",
          text: "On mobile devices, you can control advertising tracking through your device settings. Look for 'Limit Ad Tracking' on iOS or 'Opt out of Ads Personalization' on Android.",
        },
      ],
    },
  ];

  const typeColorMap: Record<string, string> = {
    Analytics: "#2d4a3e",
    Necessary: "#5a6b63",
    Functional: "#d4783c",
    Marketing: "#8b5e3c",
  };

  return (
    <PublicPageShell>
      {/* Page wrapper */}
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "80px 24px 80px",
        }}
      >
        {/* Page header */}
        <div style={{ marginBottom: 48 }}>
          <h1
            style={{
              fontSize: 38,
              fontWeight: 800,
              color: "#1c2b23",
              lineHeight: 1.2,
              margin: "0 0 10px",
            }}
          >
            Cookie Policy
          </h1>
          <p
            style={{
              fontSize: 12,
              color: "#8a9b93",
              margin: "0 0 20px",
            }}
          >
            Last updated: {lastUpdated}
          </p>
          <p
            style={{
              fontSize: 15,
              color: "#5a6b63",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            This Cookie Policy explains how Procur uses cookies and similar
            technologies when you visit our website or use our platform. We
            believe in transparency about our data practices and want you to
            understand how these technologies work. By continuing to use our
            platform, you consent to our use of cookies in accordance with this
            policy. You can manage your cookie preferences at any time using
            the controls below.
          </p>
        </div>

        {/* Cookie Preference Center */}
        <div
          style={{
            background: "#f5f1ea",
            border: "1px solid #e8e4dc",
            borderRadius: 12,
            padding: 36,
            marginBottom: 56,
          }}
        >
          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#1c2b23",
              margin: "0 0 8px",
            }}
          >
            Your cookie preferences
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "#5a6b63",
              margin: "0 0 32px",
              lineHeight: 1.6,
            }}
          >
            Manage your cookie preferences below. Disabling certain cookies may
            affect platform functionality.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {cookieTypes.map((type, index) => {
              const prefKey = type.category
                .toLowerCase()
                .split(" ")[0] as keyof typeof cookiePreferences;
              const isChecked = cookiePreferences[prefKey];

              return (
                <div key={index}>
                  {/* Row */}
                  <div style={{ paddingTop: index === 0 ? 0 : 24, paddingBottom: 24 }}>
                    {/* Header row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#1c2b23",
                        }}
                      >
                        {type.category}
                      </span>
                      {type.required ? (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#2d4a3e",
                            background: "rgba(45,74,62,0.1)",
                            padding: "3px 10px",
                            borderRadius: 999,
                            letterSpacing: "0.04em",
                          }}
                        >
                          Always active
                        </span>
                      ) : (
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            cursor: "pointer",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) =>
                              handlePreferenceChange(prefKey, e.target.checked)
                            }
                            style={{
                              width: 16,
                              height: 16,
                              accentColor: "#d4783c",
                              cursor: "pointer",
                            }}
                          />
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: isChecked ? "#d4783c" : "#8a9b93",
                            }}
                          >
                            {isChecked ? "Enabled" : "Disabled"}
                          </span>
                        </label>
                      )}
                    </div>

                    {/* Description */}
                    <p
                      style={{
                        fontSize: 14,
                        color: "#5a6b63",
                        lineHeight: 1.6,
                        margin: "0 0 12px",
                      }}
                    >
                      {type.description}
                    </p>

                    {/* Examples */}
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: "0 0 10px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      {type.examples.map((example, exIndex) => (
                        <li
                          key={exIndex}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontSize: 13,
                            color: "#5a6b63",
                          }}
                        >
                          <span
                            style={{
                              width: 4,
                              height: 4,
                              borderRadius: "50%",
                              background: "#2d4a3e",
                              flexShrink: 0,
                              display: "inline-block",
                            }}
                          />
                          {example}
                        </li>
                      ))}
                    </ul>

                    {/* Retention */}
                    <p
                      style={{
                        fontSize: 13,
                        color: "#8a9b93",
                        margin: 0,
                      }}
                    >
                      Retention: {type.retention}
                    </p>
                  </div>

                  {/* Divider between items (not after last) */}
                  {index < cookieTypes.length - 1 && (
                    <div
                      style={{
                        borderTop: "1px solid #e8e4dc",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 32,
            }}
          >
            <button
              onClick={savePreferences}
              style={{
                padding: "11px 28px",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 700,
                background: "#d4783c",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Save preferences
            </button>
            <button
              onClick={() =>
                setCookiePreferences({
                  necessary: true,
                  analytics: false,
                  marketing: false,
                  functional: false,
                })
              }
              style={{
                padding: "11px 28px",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 600,
                background: "transparent",
                color: "#1c2b23",
                border: "1px solid #e8e4dc",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Reject all optional
            </button>
          </div>
        </div>

        {/* Policy sections */}
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} style={{ marginBottom: 48 }}>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#1c2b23",
                margin: "0 0 12px",
                paddingBottom: 12,
                borderBottom: "1px solid #e8e4dc",
              }}
            >
              {section.title}
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
                marginTop: 20,
              }}
            >
              {section.content.map((item, itemIndex) => (
                <div key={itemIndex}>
                  <h3
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#1c2b23",
                      margin: "0 0 6px",
                    }}
                  >
                    {item.subtitle}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "#5a6b63",
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Third-party services */}
        <div style={{ marginBottom: 56 }}>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#1c2b23",
              margin: "0 0 12px",
              paddingBottom: 12,
              borderBottom: "1px solid #e8e4dc",
            }}
          >
            Third-party services
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "#5a6b63",
              margin: "16px 0 24px",
              lineHeight: 1.6,
            }}
          >
            We work with trusted third-party services that may set their own
            cookies. Here's information about the main services we use:
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {thirdPartyServices.map((service, index) => (
              <div
                key={index}
                style={{
                  background: "#f5f1ea",
                  border: "1px solid #e8e4dc",
                  borderRadius: 12,
                  padding: "20px 24px",
                }}
              >
                {/* Service name + type badge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#1c2b23",
                    }}
                  >
                    {service.name}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: typeColorMap[service.type] ?? "#5a6b63",
                      background: `${typeColorMap[service.type] ?? "#5a6b63"}18`,
                      padding: "2px 8px",
                      borderRadius: 999,
                    }}
                  >
                    {service.type}
                  </span>
                </div>

                {/* Details */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <div style={{ display: "flex", gap: 8 }}>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#1c2b23",
                        minWidth: 80,
                      }}
                    >
                      Purpose
                    </span>
                    <span style={{ fontSize: 13, color: "#5a6b63" }}>
                      {service.purpose}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#1c2b23",
                        minWidth: 80,
                      }}
                    >
                      Retention
                    </span>
                    <span style={{ fontSize: 13, color: "#5a6b63" }}>
                      {service.retention}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#1c2b23",
                        minWidth: 80,
                      }}
                    >
                      Opt-out
                    </span>
                    {service.optOut.startsWith("http") ? (
                      <a
                        href={service.optOut}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: 13,
                          color: "#d4783c",
                          textDecoration: "none",
                        }}
                      >
                        Opt-out link
                      </a>
                    ) : (
                      <span style={{ fontSize: 13, color: "#5a6b63" }}>
                        {service.optOut}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact card */}
        <div
          style={{
            background: "#f5f1ea",
            border: "1px solid #e8e4dc",
            borderRadius: 12,
            padding: 28,
            marginBottom: 48,
            marginTop: 48,
          }}
        >
          <h2
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#1c2b23",
              margin: "0 0 10px",
            }}
          >
            Questions about cookies?
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "#5a6b63",
              lineHeight: 1.6,
              margin: "0 0 20px",
            }}
          >
            If you have questions about our use of cookies or need help managing
            your preferences, please reach out.
          </p>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <div>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#8a9b93",
                  margin: "0 0 4px",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Email
              </p>
              <a
                href="mailto:privacy@procur.com"
                style={{
                  fontSize: 14,
                  color: "#d4783c",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                privacy@procur.com
              </a>
            </div>
            <div>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#8a9b93",
                  margin: "0 0 4px",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Help Center
              </p>
              <a
                href="/help/support"
                style={{
                  fontSize: 14,
                  color: "#d4783c",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Visit our help center
              </a>
            </div>
          </div>
        </div>

        {/* Related policies */}
        <div>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#1c2b23",
              margin: "0 0 16px",
            }}
          >
            Related policies
          </h2>
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <a
              href="/legal/privacy"
              style={{
                flex: "1 1 220px",
                background: "#f5f1ea",
                border: "1px solid #e8e4dc",
                borderRadius: 12,
                padding: "20px 22px",
                textDecoration: "none",
                display: "block",
              }}
            >
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#1c2b23",
                  margin: "0 0 6px",
                }}
              >
                Privacy Policy
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "#5a6b63",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                How we collect and protect your data
              </p>
            </a>
            <a
              href="/legal/terms"
              style={{
                flex: "1 1 220px",
                background: "#f5f1ea",
                border: "1px solid #e8e4dc",
                borderRadius: 12,
                padding: "20px 22px",
                textDecoration: "none",
                display: "block",
              }}
            >
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#1c2b23",
                  margin: "0 0 6px",
                }}
              >
                Terms of Service
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "#5a6b63",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                Platform usage terms and conditions
              </p>
            </a>
          </div>
        </div>
      </div>
    </PublicPageShell>
  );
}
