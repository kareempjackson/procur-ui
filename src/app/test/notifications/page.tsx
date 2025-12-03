"use client";

import React from "react";

type Channel = "email" | "whatsapp" | "in-app";

type NotificationTemplate = {
  id: string;
  label: string;
  channel: Channel;
  audience: "buyer" | "seller";
  useCase:
    | "request-created"
    | "request-responded"
    | "request-accepted"
    | "request-rejected"
    | "request-expiring"
    | "request-reminder";
  subject?: string;
  previewTitle: string;
  body: string;
  meta?: string;
};

const templates: NotificationTemplate[] = [
  {
    id: "buyer-request-created-email",
    label: "Buyer – Request created (email)",
    channel: "email",
    audience: "buyer",
    useCase: "request-created",
    subject: "We’ve shared your sourcing request with vetted suppliers",
    previewTitle: "Your Procur request is live",
    meta: "Trigger: buyer submits a new sourcing request.",
    body: [
      "Hi {{buyer_first_name}},",
      "",
      "Thanks for submitting your sourcing request on Procur. We’ve shared it with vetted suppliers who match your location and requirements.",
      "",
      "Request summary:",
      "• Request ID: {{request_code}}",
      "• Product: {{product_name}}",
      "• Quantity: {{quantity}} {{unit}}",
      "• Location: {{delivery_location}}",
      "• Requested by: {{requested_by_date}}",
      "",
      "What happens next:",
      "• Suppliers will respond with availability, pricing and delivery options.",
      "• You’ll receive notifications in Procur as new responses come in.",
      "• You can compare offers and confirm the supplier that works best for you.",
      "",
      "You can view or edit this request anytime:",
      "{{request_url}}",
      "",
      "Thank you for sourcing through Procur.",
      "",
      "— The Procur team",
    ].join("\n"),
  },
  {
    id: "seller-new-request-whatsapp",
    label: "Seller – New request received (WhatsApp)",
    channel: "whatsapp",
    audience: "seller",
    useCase: "request-created",
    previewTitle: "New buyer request near you",
    meta: "Trigger: request matches seller’s products and region.",
    body: [
      "🌱 New buyer request on Procur",
      "",
      "{{buyer_name}} just shared a sourcing request that matches your farm or product profile.",
      "",
      "Product: {{product_name}}",
      "Quantity: {{quantity}} {{unit}}",
      "Location: {{delivery_location}}",
      "Target date: {{requested_by_date}}",
      "",
      "Reply with your availability and pricing here:",
      "{{request_manage_url}}",
      "",
      "If you’re not able to fulfil this request, you can mark yourself as unavailable so we don’t keep nudging you.",
      "",
      "— Procur",
    ].join("\n"),
  },
  {
    id: "buyer-request-response-email",
    label: "Buyer – Supplier responded (email)",
    channel: "email",
    audience: "buyer",
    useCase: "request-responded",
    subject: "{{supplier_name}} responded to your request on Procur",
    previewTitle: "You have a new response",
    meta: "Trigger: a supplier sends the first response to a request.",
    body: [
      "Hi {{buyer_first_name}},",
      "",
      "{{supplier_name}} just responded to your sourcing request on Procur.",
      "",
      "Request: {{product_name}} · {{quantity}} {{unit}}",
      "Supplier: {{supplier_name}}",
      "",
      "They’ve shared:",
      "• Proposed price: {{price_per_unit}} / {{unit}}",
      "• Available quantity: {{supplier_quantity}} {{unit}}",
      "• Earliest delivery: {{delivery_start_date}}",
      "",
      "You can review the full details and chat with this supplier here:",
      "{{request_thread_url}}",
      "",
      "Tip: You can keep this request open while you compare multiple offers. When you’re ready, confirm the supplier that works best for you.",
      "",
      "— The Procur team",
    ].join("\n"),
  },
  {
    id: "seller-request-accepted-whatsapp",
    label: "Seller – Request accepted (WhatsApp)",
    channel: "whatsapp",
    audience: "seller",
    useCase: "request-accepted",
    previewTitle: "Your offer was accepted",
    meta: "Trigger: buyer accepts a supplier’s response on a request.",
    body: [
      "✅ Good news from Procur",
      "",
      "{{buyer_name}} accepted your offer for:",
      "{{product_name}} · {{quantity}} {{unit}}",
      "",
      "Next steps:",
      "• Review the order details and confirm harvest / delivery schedule.",
      "• Keep all updates inside Procur so the buyer stays informed.",
      "",
      "View order and confirm details:",
      "{{order_url}}",
      "",
      "Thank you for supplying through Procur.",
      "",
      "— Procur",
    ].join("\n"),
  },
  {
    id: "buyer-request-expiring-email",
    label: "Buyer – Request expiring (email)",
    channel: "email",
    audience: "buyer",
    useCase: "request-expiring",
    subject: "Your Procur request is about to expire",
    previewTitle: "Do you still need this order?",
    meta: "Trigger: request is about to auto-expire with no recent activity.",
    body: [
      "Hi {{buyer_first_name}},",
      "",
      "A quick check-in on your Procur request:",
      "",
      "Request ID: {{request_code}}",
      "Product: {{product_name}}",
      "Quantity: {{quantity}} {{unit}}",
      "",
      "This request will expire on {{expiry_date}} unless you extend or close it.",
      "",
      "You can:",
      "• Extend the request if you still need suppliers to respond.",
      "• Close the request if you no longer need this order.",
      "",
      "Manage this request:",
      "{{request_url}}",
      "",
      "Keeping expired requests tidy helps suppliers focus on current opportunities.",
      "",
      "— The Procur team",
    ].join("\n"),
  },
  {
    id: "inapp-request-reminder",
    label: "Buyer – Gentle in-app reminder",
    channel: "in-app",
    audience: "buyer",
    useCase: "request-reminder",
    previewTitle: "You have open requests waiting on you",
    meta: "Trigger: buyer has unread responses on one or more requests.",
    body: [
      "You have new responses on your sourcing request for {{product_name}}.",
      "",
      "Compare offers, chat with suppliers and confirm your order so farmers can plan harvest and logistics.",
      "",
      "View responses →",
    ].join("\n"),
  },
];

const channelLabel: Record<Channel, string> = {
  email: "Email",
  whatsapp: "WhatsApp",
  "in-app": "In-app",
};

const TestNotificationsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <header className="mb-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--primary-base)] mb-2">
                Test · Notifications
              </p>
              <h1 className="text-3xl sm:text-4xl font-semibold text-[var(--secondary-black)] mb-3">
                Request notification templates
              </h1>
              <p className="text-sm sm:text-base text-[var(--primary-base)] max-w-2xl">
                Copy-ready templates for how we notify buyers and sellers about
                sourcing requests on Procur. These can power email, WhatsApp and
                in-app messages.
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-2 text-right">
              <span className="text-xs uppercase tracking-[0.16em] text-[var(--primary-base)]">
                Internal
              </span>
              <span className="text-sm text-[var(--primary-base)]">
                Route:{" "}
                <code className="px-2 py-1 rounded-full bg-white border border-gray-200 text-xs">
                  /test/notifications
                </code>
              </span>
            </div>
          </div>
        </header>

        <main className="space-y-6">
          {templates.map((tpl) => (
            <section
              key={tpl.id}
              className="bg-white rounded-3xl border border-gray-200 shadow-[0_16px_30px_rgba(15,23,42,0.04)] p-6 sm:p-7"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center rounded-full bg-[var(--primary-background)] px-3 py-1 text-[var(--primary-base)] font-medium">
                      {tpl.audience === "buyer" ? "Buyer" : "Seller"}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-[var(--primary-base)] font-medium">
                      {channelLabel[tpl.channel]}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-[var(--primary-base)] font-medium">
                      {tpl.useCase
                        .replace("request-", "Request: ")
                        .replace("-", " ")}
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
              </div>

              <div className="space-y-3">
                {tpl.subject && (
                  <div className="text-sm">
                    <p className="text-[var(--primary-base)] font-medium mb-1">
                      Subject
                    </p>
                    <p className="rounded-2xl bg-gray-50 border border-gray-100 px-4 py-2 text-[var(--secondary-black)]">
                      {tpl.subject}
                    </p>
                  </div>
                )}

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
                    {"{{product_name}}"}
                  </code>{" "}
                  will be filled dynamically from the request and order data.
                </p>
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};

export default TestNotificationsPage;
