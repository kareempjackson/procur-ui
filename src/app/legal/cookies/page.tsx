"use client";

import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import type { Metadata } from "next";
import Image from "next/image";
import { useState } from "react";

// Note: This would typically be handled server-side with proper metadata export
const metadata = {
  title: "Cookie Policy - Procur",
  description:
    "Procur's Cookie Policy. Learn how we use cookies and similar technologies to improve your experience on our platform.",
};

export default function CookiePolicyPage() {
  const lastUpdated = "January 15, 2025";
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Always required
    analytics: true,
    marketing: false,
    functional: true,
  });

  const handlePreferenceChange = (category: string, value: boolean) => {
    if (category === "necessary") return; // Cannot disable necessary cookies
    setCookiePreferences((prev) => ({ ...prev, [category]: value }));
  };

  const savePreferences = () => {
    // In a real implementation, this would save to localStorage and update cookie consent
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

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--secondary-black)] text-balance">
            Cookie Policy
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            Learn how we use cookies and similar technologies to improve your
            experience on our platform. Manage your preferences and understand
            your choices.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Last updated: {lastUpdated}
          </div>
          <div className="mt-10">
            <div className="relative mx-auto rounded-3xl overflow-hidden shadow-xl border border-black/5 w-full max-w-6xl h-96 md:h-[520px]">
              <Image
                src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                alt="Cookie policy and privacy settings"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-20">
        {/* Introduction */}
        <section className="mb-16">
          <div className="card">
            <p className="text-lg text-gray-700 leading-8 first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:leading-[0.9]">
              This Cookie Policy explains how Procur uses cookies and similar
              technologies when you visit our website or use our platform. We
              believe in transparency about our data practices and want you to
              understand how these technologies work.
            </p>
            <p className="mt-6 text-gray-700 leading-8">
              By continuing to use our platform, you consent to our use of
              cookies in accordance with this policy. You can manage your cookie
              preferences at any time using the controls provided below.
            </p>
          </div>
        </section>

        {/* Cookie Preference Center */}
        <section className="mb-16">
          <div className="card bg-gradient-to-br from-[var(--primary-background)] to-white border border-[var(--primary-accent2)]/20">
            <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
              Cookie Preference Center
            </h2>
            <p className="text-gray-700 mb-8">
              Manage your cookie preferences below. Note that disabling certain
              cookies may affect platform functionality.
            </p>

            <div className="space-y-6">
              {cookieTypes.map((type, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[var(--secondary-black)]">
                      {type.category}
                    </h3>
                    <div className="flex items-center">
                      {type.required ? (
                        <span className="text-sm text-gray-500 mr-3">
                          Always Active
                        </span>
                      ) : (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={
                              cookiePreferences[
                                type.category
                                  .toLowerCase()
                                  .split(
                                    " "
                                  )[0] as keyof typeof cookiePreferences
                              ]
                            }
                            onChange={(e) =>
                              handlePreferenceChange(
                                type.category.toLowerCase().split(" ")[0],
                                e.target.checked
                              )
                            }
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-accent2)]"></div>
                        </label>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {type.description}
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">
                        Examples:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {type.examples.map((example, exampleIndex) => (
                          <li
                            key={exampleIndex}
                            className="flex items-center gap-2"
                          >
                            <span className="h-1 w-1 rounded-full bg-[var(--primary-accent2)]" />
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">
                        Retention:
                      </h4>
                      <p className="text-sm text-gray-600">{type.retention}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={savePreferences}
                className="btn btn-primary px-6 py-2"
              >
                Save Preferences
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
                className="btn btn-ghost px-6 py-2"
              >
                Reject All Optional
              </button>
            </div>
          </div>
        </section>

        {/* Policy Sections */}
        {sections.map((section, sectionIndex) => (
          <section key={sectionIndex} className="mb-12">
            <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
              {section.title}
            </h2>
            <div className="space-y-6">
              {section.content.map((item, itemIndex) => (
                <div key={itemIndex} className="card">
                  <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-3">
                    {item.subtitle}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Third-Party Services */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
            Third-Party Services
          </h2>
          <p className="text-gray-700 mb-8">
            We work with trusted third-party services that may set their own
            cookies. Here's information about the main services we use:
          </p>

          <div className="space-y-4">
            {thirdPartyServices.map((service, index) => (
              <div key={index} className="card">
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <h3 className="font-semibold text-[var(--secondary-black)] mb-1">
                      {service.name}
                    </h3>
                    <span className="text-xs text-[var(--primary-accent2)] font-medium">
                      {service.type}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Purpose</h4>
                    <p className="text-sm text-gray-600">{service.purpose}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">
                      Retention
                    </h4>
                    <p className="text-sm text-gray-600">{service.retention}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Opt-Out</h4>
                    {service.optOut.startsWith("http") ? (
                      <a
                        href={service.optOut}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] transition-colors"
                      >
                        Opt-out link
                      </a>
                    ) : (
                      <p className="text-sm text-gray-600">{service.optOut}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Information */}
        <section className="mt-16">
          <div className="card bg-gradient-to-br from-[var(--primary-background)] to-white border border-[var(--primary-accent2)]/20">
            <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-4">
              Questions About Cookies
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you have questions about our use of cookies or need help
              managing your preferences, please contact us:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                  Email
                </h3>
                <a
                  href="mailto:privacy@procur.com"
                  className="text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] transition-colors"
                >
                  privacy@procur.com
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                  Support Center
                </h3>
                <a
                  href="/help/support"
                  className="text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] transition-colors"
                >
                  Visit our help center
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Related Policies */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
            Related Policies
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="/legal/privacy"
              className="card hover:shadow-lg transition-all duration-200 group"
            >
              <h3 className="font-semibold text-[var(--secondary-black)] group-hover:text-[var(--primary-accent2)] transition-colors mb-2">
                Privacy Policy
              </h3>
              <p className="text-gray-600 text-sm">
                How we collect and protect your data
              </p>
            </a>
            <a
              href="/legal/terms"
              className="card hover:shadow-lg transition-all duration-200 group"
            >
              <h3 className="font-semibold text-[var(--secondary-black)] group-hover:text-[var(--primary-accent2)] transition-colors mb-2">
                Terms of Service
              </h3>
              <p className="text-gray-600 text-sm">
                Platform usage terms and conditions
              </p>
            </a>
            <a
              href="/legal/usage"
              className="card hover:shadow-lg transition-all duration-200 group"
            >
              <h3 className="font-semibold text-[var(--secondary-black)] group-hover:text-[var(--primary-accent2)] transition-colors mb-2">
                Usage Policy
              </h3>
              <p className="text-gray-600 text-sm">
                Acceptable use and conduct guidelines
              </p>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
