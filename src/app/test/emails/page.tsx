"use client";

import React, { useMemo, useState } from "react";
import { getApiClient } from "@/lib/apiClient";

type Audience = "buyer" | "seller" | "admin" | "platform";
type Area = "account" | "organization" | "orders";

type EmailTemplate = {
  id: string;
  label: string;
  audience: Audience;
  area: Area;
  useCase: string;
  subject: string;
  previewTitle: string;
  meta: string;
  body: string;
};

const CURRENT_YEAR = new Date().getFullYear();
const EMAIL_LOGO_URL = "/images/logos/procur_logo.png";

const templates: EmailTemplate[] = [
  {
    id: "account-verify-email",
    label: "Account – Verify email address",
    audience: "buyer",
    area: "account",
    useCase: "New user sign-up · Awaiting verification",
    subject: "Verify Your Procur Account",
    previewTitle: "Confirm your email to finish setting up Procur",
    meta: "Trigger: a user signs up for Procur and needs to verify their email before using the platform.",
    body: [
      "Hi {{full_name}},",
      "",
      "Thanks for joining Procur. Please verify your email address to complete your account setup.",
      "",
      "Verify your email:",
      "{{verification_url}}",
      "",
      "This link will expire in 24 hours. If you didn’t create a Procur account, you can safely ignore this email.",
      "",
      "— The Procur team",
    ].join("\n"),
  },
  {
    id: "account-welcome-email",
    label: "Account – Welcome after verification",
    audience: "buyer",
    area: "account",
    useCase: "User has successfully verified their email",
    subject: "Welcome to Procur!",
    previewTitle: "Your Procur account is ready to use",
    meta: "Trigger: verification completes successfully and the account is ready for first login.",
    body: [
      "Hi {{full_name}},",
      "",
      "🎉 Your account has been verified. Welcome to Procur.",
      "",
      "Here’s what you can do next:",
      "• Complete your profile setup",
      "• Explore opportunities and suppliers",
      "• Connect with buyers and sellers",
      "",
      "Go to your dashboard:",
      "{{dashboard_url}}",
      "",
      "If you have any questions, just reply to this email.",
      "",
      "— The Procur team",
    ].join("\n"),
  },
  {
    id: "account-organization-invitation",
    label: "Account – Invitation to join an organization",
    audience: "buyer",
    area: "organization",
    useCase: "User invited to join an existing organization on Procur",
    subject: "Invitation to join {{organization_name}} on Procur",
    previewTitle: "You’ve been invited to join an organization on Procur",
    meta: "Trigger: an existing member invites a colleague to join their Procur organization.",
    body: [
      "Hi,",
      "",
      "{{inviter_name}} has invited you to join {{organization_name}} on Procur.",
      "",
      "Accept your invitation:",
      "{{invitation_url}}",
      "",
      "By accepting, you’ll be able to collaborate with your team and access organization resources.",
      "",
      "This invitation will expire in 7 days.",
      "",
      "— The Procur team",
    ].join("\n"),
  },
  {
    id: "account-buyer-created-by-admin",
    label: "Account – Buyer account created by admin",
    audience: "buyer",
    area: "organization",
    useCase: "An admin creates a buyer user on behalf of an organization",
    subject: "Your Procur buyer account has been created",
    previewTitle: "You have a new Procur buyer account",
    meta: "Trigger: internal buyer onboarding flow from the admin console.",
    body: [
      "Hi {{admin_fullname}},",
      "",
      "A Procur buyer account has been created for you for “{{business_name}}”.",
      "",
      "You can sign in with this email address and the password provided by your admin.",
      "",
      "Go to Procur login:",
      "{{login_url}}",
      "",
      "— The Procur team",
    ].join("\n"),
  },
  {
    id: "account-seller-created-by-admin",
    label: "Account – Seller account created by admin",
    audience: "seller",
    area: "organization",
    useCase: "An admin creates a seller user on behalf of an organization",
    subject: "Your Procur seller account has been created",
    previewTitle: "You have a new Procur seller account",
    meta: "Trigger: internal seller onboarding flow from the admin console.",
    body: [
      "Hi {{admin_fullname}},",
      "",
      "A Procur seller account has been created for you for “{{business_name}}”.",
      "",
      "You can sign in with this email address and the password provided by your admin.",
      "",
      "Go to Procur login:",
      "{{login_url}}",
      "",
      "— The Procur team",
    ].join("\n"),
  },
  {
    id: "orders-seller-new-order",
    label: "Orders – Seller notified of new order",
    audience: "seller",
    area: "orders",
    useCase:
      "Buyer places an order and the seller organization needs to be notified",
    subject: "New order {{order_number}} received",
    previewTitle: "You have a new Procur order from {{buyer_name}}",
    meta: "Trigger: buyer order is created (non-card path) and seller org users with email addresses are notified.",
    body: [
      "Hello,",
      "",
      "You have a new order {{order_number}} from {{buyer_name}}.",
      "",
      "Total: {{currency}} {{total_amount}}",
      "",
      "Manage this order:",
      "{{order_manage_url}}",
      "",
      "— The Procur team",
    ].join("\n"),
  },
  {
    id: "orders-buyer-receipt",
    label: "Orders – Buyer order receipt",
    audience: "buyer",
    area: "orders",
    useCase: "Buyer completes checkout and should receive an email receipt",
    subject: "Your order receipt",
    previewTitle: "Thanks for your order on Procur",
    meta: "Trigger: successful order creation or card payment confirmation. Used by both buyers and payments services.",
    body: [
      "Hi {{buyer_full_name}},",
      "",
      "Thanks for your order on Procur.",
      "",
      "You can view your full order receipt here:",
      "{{order_receipt_url}}",
      "",
      "We’ll keep you updated as your order is prepared, shipped, and delivered.",
      "",
      "— The Procur team",
    ].join("\n"),
  },
];

const audienceLabel: Record<Audience, string> = {
  buyer: "Buyer",
  seller: "Seller",
  admin: "Admin",
  platform: "Platform",
};

const areaLabel: Record<Area, string> = {
  account: "Account & identity",
  organization: "Organization access",
  orders: "Orders & payments",
};

const BrandedEmailPreview: React.FC<{ subject: string; body: string }> = ({
  subject: _subject,
  body,
}) => {
  return (
    <div className="bg-[#f6f6f6] rounded-2xl p-4 sm:p-5">
      <div className="max-w-[640px] mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          {/* Logo header at the very top */}
          <div className="border-b border-gray-100 px-6 py-5 flex items-center justify-center">
            <img
              src={EMAIL_LOGO_URL}
              alt="Procur logo"
              className="h-9 w-auto"
            />
          </div>

          {/* Pure email body copy */}
          <div className="px-6 py-8">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--secondary-black)]">
              {body}
            </pre>
          </div>

          {/* Footer locked to the bottom */}
          <div className="border-t border-gray-100 px-6 py-4 text-[0.68rem] text-[var(--primary-base)] text-center bg-[#fafafa]">
            <p>© {CURRENT_YEAR} Procur Grenada Ltd. All rights reserved.</p>
            <p>
              Procur Grenada Ltd. Annandale, St. Georges, Grenada W.I.,
              473-538-4365
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestEmailsPage: React.FC = () => {
  const testEmailsKey = useMemo(
    () => process.env.NEXT_PUBLIC_TEST_EMAILS_KEY,
    []
  );
  const [sendStateById, setSendStateById] = useState<
    Record<
      string,
      | { state: "idle" }
      | { state: "sending" }
      | { state: "sent"; messageId?: string | null }
      | { state: "error"; error: string }
    >
  >({});

  const sendTest = async (tpl: EmailTemplate) => {
    setSendStateById((prev) => ({ ...prev, [tpl.id]: { state: "sending" } }));
    try {
      // Force unauthenticated call (this endpoint is public and should not require login)
      const api = getApiClient(() => null);
      const res = await api.post(
        "/email/test-template",
        {
          subject: tpl.subject,
          body: tpl.body,
          previewTitle: tpl.previewTitle,
          templateId: tpl.id,
        },
        {
          headers: testEmailsKey
            ? { "x-test-emails-key": testEmailsKey }
            : undefined,
        }
      );

      setSendStateById((prev) => ({
        ...prev,
        [tpl.id]: { state: "sent", messageId: res?.data?.messageId ?? null },
      }));
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to send test email";
      setSendStateById((prev) => ({
        ...prev,
        [tpl.id]: { state: "error", error: String(message) },
      }));
    }
  };

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <header className="mb-10 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--primary-base)] mb-2">
                Test · Emails
              </p>
              <h1 className="text-3xl sm:text-4xl font-semibold text-[var(--secondary-black)] mb-3">
                Account & order email templates
              </h1>
              <p className="text-sm sm:text-base text-[var(--primary-base)] max-w-2xl">
                Copy-ready examples of the transactional emails we send from the
                API: account verification, welcome flows, organization
                invitations, and order receipts. Use these as the single source
                of truth when adjusting wording or wiring new journeys.
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-2 text-right">
              <span className="text-xs uppercase tracking-[0.16em] text-[var(--primary-base)]">
                Internal
              </span>
              <span className="text-sm text-[var(--primary-base)]">
                Route:{" "}
                <code className="px-2 py-1 rounded-full bg-white border border-gray-200 text-xs">
                  /test/emails
                </code>
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-gray-300 bg-white/70 px-4 py-3 sm:px-5 sm:py-4 text-xs sm:text-sm text-[var(--primary-base)]">
            <p className="font-medium text-[var(--secondary-black)] mb-1">
              Shared HTML layout (applied to every template)
            </p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>
                Header: Procur logo in a clean card layout, centered above the
                email content.
              </li>
              <li>
                Footer:{" "}
                <span className="font-mono text-[0.7rem] sm:text-xs">
                  © {CURRENT_YEAR} Procur Grenada Ltd. All rights reserved.
                </span>
              </li>
              <li>
                Footer (address line):{" "}
                <span className="font-mono text-[0.7rem] sm:text-xs">
                  Procur Grenada Ltd. Annandale, St. Georges, Grenada W.I.,
                  473-538-4365
                </span>
              </li>
            </ul>
          </div>
        </header>

        <main className="space-y-6">
          {templates.map((tpl) => (
            <section
              key={tpl.id}
              className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-7"
            >
              {(() => {
                const sendState = sendStateById[tpl.id];
                return (
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center rounded-full bg-[var(--primary-background)] px-3 py-1 text-[var(--primary-base)] font-medium">
                      {audienceLabel[tpl.audience]}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-[var(--primary-base)] font-medium">
                      {areaLabel[tpl.area]}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-[var(--primary-base)] font-medium">
                      {tpl.useCase}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
                    {tpl.previewTitle}
                  </h2>
                  <p className="text-sm text-[var(--primary-base)]">
                    {tpl.label}
                  </p>
                  {tpl.meta && (
                    <p className="text-xs text-[var(--primary-base)] mt-1">
                      {tpl.meta}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-start sm:items-end gap-2">
                  <button
                    type="button"
                    onClick={() => sendTest(tpl)}
                    disabled={sendState?.state === "sending"}
                    className="inline-flex items-center justify-center rounded-full bg-[var(--secondary-black)] text-white px-4 py-2 text-xs font-medium hover:opacity-90 disabled:opacity-50"
                  >
                    Send test to kareem@procurapp.co
                  </button>
                  {sendState && sendState.state === "sending" && (
                    <span className="text-xs text-[var(--primary-base)]">
                      Sending…
                    </span>
                  )}
                  {sendState && sendState.state === "sent" && (
                    <span className="text-xs text-green-700">
                      Sent
                      {sendState.messageId
                        ? ` (id: ${sendState.messageId})`
                        : ""}
                    </span>
                  )}
                  {sendState && sendState.state === "error" && (
                    <span className="text-xs text-red-700">
                      {sendState.error}
                    </span>
                  )}
                </div>
              </div>
                );
              })()}

              <div className="space-y-3">
                <div className="text-sm">
                  <p className="text-[var(--primary-base)] font-medium mb-1">
                    Subject
                  </p>
                  <p className="rounded-2xl bg-gray-50 border border-gray-100 px-4 py-2 text-[var(--secondary-black)]">
                    {tpl.subject}
                  </p>
                </div>

                <div className="text-sm">
                  <p className="text-[var(--primary-base)] font-medium mb-1">
                    Body
                  </p>
                  <pre className="whitespace-pre-wrap rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3 text-[var(--secondary-black)] text-sm font-normal leading-relaxed">
                    {tpl.body}
                  </pre>
                </div>

                <p className="text-[0.68rem] text-[var(--primary-base)]">
                  Placeholders like{" "}
                  <code className="px-1 py-0.5 rounded bg-white border border-gray-200 text-[0.68rem]">
                    {"{{order_receipt_url}}"}
                  </code>{" "}
                  or{" "}
                  <code className="px-1 py-0.5 rounded bg-white border border-gray-200 text-[0.68rem]">
                    {"{{business_name}}"}
                  </code>{" "}
                  are populated by the API from user, organization, and order
                  data at send time.
                </p>
                <div className="pt-4 border-t border-dashed border-gray-200">
                  <p className="text-xs font-medium text-[var(--primary-base)] mb-2">
                    Rendered email (with Procur header & footer)
                  </p>
                  <BrandedEmailPreview subject={tpl.subject} body={tpl.body} />
                </div>
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};

export default TestEmailsPage;
