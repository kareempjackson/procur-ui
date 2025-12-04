"use client";

import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type ReceiptVariant = "compact" | "summary" | "statement";

const sampleReceipt = {
  receiptNumber: "RCT-2025-00491",
  paymentDate: "03 Dec 2025 · 14:27",
  orderNumber: "ORD-2025-00987",
  buyer: {
    name: "Green Valley Grocers",
    contact: "Alicia Johnson",
    email: "invoices@greenvalleygrocers.com",
  },
  seller: {
    name: "Procur Marketplace",
    email: "billing@procur.ag",
  },
  amounts: {
    currency: "USD",
    subtotal: 4965.0,
    delivery: 185.0,
    platformFee: 79.0,
    taxRate: 0.15,
    discount: 120.0,
  },
  payment: {
    method: "Bank transfer",
    reference: "TRX-284919-AGRI",
    accountEnding: "4421",
    status: "settled",
  },
  note: "This receipt confirms payment received via Procur for the above order. Keep this for your internal reconciliation and audit records.",
};

const receiptCurrency = (value: number) =>
  `${sampleReceipt.amounts.currency} ${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// Tailwind v4 can emit color values using lab() inside @supports blocks.
// html2canvas does not understand lab(), so we proactively strip those
// fallback rules from runtime stylesheets before capturing.
const stripLabColorRules = () => {
  if (typeof document === "undefined") return;

  const styleSheets = Array.from(document.styleSheets || []);

  for (const sheet of styleSheets) {
    const cssSheet = sheet as CSSStyleSheet;
    let rules: CSSRuleList;

    try {
      rules = cssSheet.cssRules;
    } catch {
      // Ignore cross-origin or locked stylesheets
      continue;
    }

    for (let i = rules.length - 1; i >= 0; i -= 1) {
      const rule = rules[i];
      if (
        rule instanceof CSSSupportsRule &&
        rule.conditionText.includes("color: lab(")
      ) {
        cssSheet.deleteRule(i);
      }
    }
  }
};

const computeReceiptTotals = () => {
  const { subtotal, delivery, platformFee, taxRate, discount } =
    sampleReceipt.amounts;
  const tax = (subtotal + delivery) * taxRate;
  const gross = subtotal + delivery + platformFee + tax;
  const total = gross - discount;

  return { tax, total };
};

const ReceiptTestPage: React.FC = () => {
  const compactRef = useRef<HTMLDivElement | null>(null);
  const summaryRef = useRef<HTMLDivElement | null>(null);
  const statementRef = useRef<HTMLDivElement | null>(null);

  const { tax, total } = computeReceiptTotals();

  const downloadAsPdf = async (variant: ReceiptVariant) => {
    let targetRef: React.RefObject<HTMLDivElement | null>;

    switch (variant) {
      case "compact":
        targetRef = compactRef;
        break;
      case "summary":
        targetRef = summaryRef;
        break;
      case "statement":
        targetRef = statementRef;
        break;
      default:
        return;
    }

    if (!targetRef.current) return;

    const element = targetRef.current;

    // Remove any @supports blocks that redefine palette variables using lab()
    // so html2canvas doesn't attempt to parse unsupported color functions.
    stripLabColorRules();

    // Tailwind v4 may output color functions like lab() which html2canvas
    // cannot parse. Wrap getComputedStyle to strip unsupported values.
    const originalGetComputedStyle = window.getComputedStyle;
    (window as any).getComputedStyle = (
      elt: Element,
      pseudoElt?: string | null
    ) => {
      const style = originalGetComputedStyle.call(
        window,
        elt,
        pseudoElt as any
      );
      if (!style) return style;

      const originalGetPropertyValue = style.getPropertyValue.bind(style);
      (style as any).getPropertyValue = (prop: string) => {
        const value = originalGetPropertyValue(prop);
        if (typeof value === "string" && value.includes("lab(")) {
          return "";
        }
        return value;
      };

      return style;
    };

    let canvas: HTMLCanvasElement;
    try {
      canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
    } finally {
      (window as any).getComputedStyle = originalGetComputedStyle;
    }

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`procur-receipt-${variant}.pdf`);
  };

  const renderHeader = (title: string, description: string) => (
    <div className="flex flex-col gap-2 mb-4">
      <span className="uppercase tracking-[0.16em] text-xs text-[var(--primary-base)]">
        Receipt concept
      </span>
      <h2 className="text-xl font-semibold text-[var(--secondary-black)]">
        {title}
      </h2>
      <p className="text-sm text-[var(--primary-base)] max-w-xl">
        {description}
      </p>
    </div>
  );

  const renderDownloadButton = (variant: ReceiptVariant) => (
    <button
      type="button"
      onClick={() => downloadAsPdf(variant)}
      className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium bg-[var(--primary-accent2)] text-white hover:bg-[var(--primary-accent3)] transition-colors"
    >
      Download as PDF
    </button>
  );

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Page header */}
        <header className="mb-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--primary-base)] mb-2">
                Test · Receipts
              </p>
              <h1 className="text-3xl sm:text-4xl font-semibold text-[var(--secondary-black)] mb-3">
                Payment receipt gallery
              </h1>
              <p className="text-sm sm:text-base text-[var(--primary-base)] max-w-2xl">
                Explore different receipt layouts that confirm payment for
                Procur orders. These can be used for email receipts, PDF
                downloads, or embedded confirmations in the buyer and seller
                dashboards.
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-2 text-right">
              <span className="text-xs uppercase tracking-[0.16em] text-[var(--primary-base)]">
                Internal
              </span>
              <span className="text-sm text-[var(--primary-base)]">
                Route:{" "}
                <code className="px-2 py-1 rounded-full bg-white border border-gray-200 text-xs">
                  /test/receipts
                </code>
              </span>
            </div>
          </div>
        </header>

        <div className="space-y-10">
          {/* Compact receipt */}
          <section>
            <div className="flex items-center justify-between gap-4 mb-4">
              {renderHeader(
                "Compact slip",
                "A slim, POS-style receipt that fits nicely inside emails and can be printed to a single A4 page."
              )}
              {renderDownloadButton("compact")}
            </div>
            <div
              ref={compactRef}
              className="max-w-2xl bg-white rounded-3xl border border-gray-200 shadow-[0_18px_40px_rgba(15,23,42,0.06)] px-6 py-7"
            >
              <div className="flex items-start justify-between gap-4 border-b border-dashed border-gray-200 pb-4 mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--primary-base)] mb-1">
                    Procur
                  </p>
                  <p className="text-lg font-semibold text-[var(--secondary-black)]">
                    Payment receipt
                  </p>
                  <p className="text-xs text-[var(--primary-base)] mt-1">
                    Thank you for paying your Procur order.
                  </p>
                </div>
                <div className="text-xs text-right text-[var(--primary-base)] space-y-0.5">
                  <p>
                    Receipt:{" "}
                    <span className="font-medium text-[var(--secondary-black)]">
                      {sampleReceipt.receiptNumber}
                    </span>
                  </p>
                  <p>{sampleReceipt.paymentDate}</p>
                  <p>Order: {sampleReceipt.orderNumber}</p>
                </div>
              </div>

              <div className="flex items-start justify-between gap-4 text-xs mb-4">
                <div className="space-y-0.5">
                  <p className="uppercase tracking-[0.16em] text-[var(--primary-base)]">
                    Paid by
                  </p>
                  <p className="text-[var(--secondary-black)] font-medium">
                    {sampleReceipt.buyer.name}
                  </p>
                  <p className="text-[var(--primary-base)]">
                    {sampleReceipt.buyer.email}
                  </p>
                  <p className="text-[var(--primary-base)]">
                    Contact: {sampleReceipt.buyer.contact}
                  </p>
                </div>
                <div className="space-y-0.5 text-right">
                  <p className="uppercase tracking-[0.16em] text-[var(--primary-base)]">
                    Payment
                  </p>
                  <p className="text-[var(--secondary-black)] font-medium">
                    {sampleReceipt.payment.method}
                  </p>
                  <p className="text-[var(--primary-base)]">
                    Ref: {sampleReceipt.payment.reference}
                  </p>
                  <p className="text-[var(--primary-base)]">
                    Status:{" "}
                    <span className="capitalize">
                      {sampleReceipt.payment.status}
                    </span>
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 p-4 text-xs mb-4">
                <dl className="space-y-1">
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--primary-base)]">Subtotal</dt>
                    <dd className="font-medium text-[var(--secondary-black)]">
                      {receiptCurrency(sampleReceipt.amounts.subtotal)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--primary-base)]">Delivery</dt>
                    <dd className="font-medium text-[var(--secondary-black)]">
                      {receiptCurrency(sampleReceipt.amounts.delivery)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--primary-base)]">Platform fee</dt>
                    <dd className="font-medium text-[var(--secondary-black)]">
                      {receiptCurrency(sampleReceipt.amounts.platformFee)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--primary-base)]">
                      Tax ({(sampleReceipt.amounts.taxRate * 100).toFixed(0)}
                      %)
                    </dt>
                    <dd className="font-medium text-[var(--secondary-black)]">
                      {receiptCurrency(tax)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 pt-1 border-t border-dashed border-gray-200 mt-1">
                    <dt className="text-[var(--primary-base)]">Discount</dt>
                    <dd className="font-medium text-emerald-600">
                      -{receiptCurrency(sampleReceipt.amounts.discount)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 pt-2 border-t border-gray-900/10 mt-2">
                    <dt className="text-[0.7rem] font-semibold text-[var(--secondary-black)] uppercase tracking-[0.16em]">
                      Total paid
                    </dt>
                    <dd className="text-base font-semibold text-[var(--secondary-black)]">
                      {receiptCurrency(total)}
                    </dd>
                  </div>
                </dl>
              </div>

              <p className="text-[0.68rem] text-[var(--primary-base)] leading-relaxed">
                {sampleReceipt.note}
              </p>
            </div>
          </section>

          {/* Summary card receipt */}
          <section>
            <div className="flex items-center justify-between gap-4 mb-4">
              {renderHeader(
                "Summary card",
                "A card-style receipt that we can show inside the dashboard or attach as a PDF in email confirmations."
              )}
              {renderDownloadButton("summary")}
            </div>
            <div
              ref={summaryRef}
              className="bg-gradient-to-br from-[var(--primary-background)] via-white to-[var(--secondary-soft-highlight)]/40 rounded-3xl border border-gray-200 shadow-[0_18px_40px_rgba(15,23,42,0.06)] p-8 sm:p-10"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 border border-gray-200/70">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium tracking-[0.18em] uppercase text-[var(--secondary-black)]">
                      Payment received
                    </span>
                  </div>
                  <h2 className="text-2xl font-semibold text-[var(--secondary-black)]">
                    Procur receipt
                  </h2>
                  <p className="text-sm text-[var(--primary-base)]">
                    This confirms that payment has been received in full for
                    order {sampleReceipt.orderNumber}.
                  </p>
                </div>
                <div className="space-y-1 text-xs text-[var(--primary-base)] sm:text-right">
                  <p>
                    Receipt:{" "}
                    <span className="font-medium text-[var(--secondary-black)]">
                      {sampleReceipt.receiptNumber}
                    </span>
                  </p>
                  <p>{sampleReceipt.paymentDate}</p>
                  <p>Method: {sampleReceipt.payment.method}</p>
                  <p>Ref: {sampleReceipt.payment.reference}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 text-xs">
                <div className="space-y-1">
                  <p className="text-[0.7rem] uppercase tracking-[0.16em] text-[var(--primary-base)]">
                    Buyer
                  </p>
                  <p className="text-sm font-medium text-[var(--secondary-black)]">
                    {sampleReceipt.buyer.name}
                  </p>
                  <p className="text-[var(--primary-base)]">
                    {sampleReceipt.buyer.email}
                  </p>
                  <p className="text-[var(--primary-base)]">
                    Contact: {sampleReceipt.buyer.contact}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[0.7rem] uppercase tracking-[0.16em] text-[var(--primary-base)]">
                    Processed by
                  </p>
                  <p className="text-sm font-medium text-[var(--secondary-black)]">
                    {sampleReceipt.seller.name}
                  </p>
                  <p className="text-[var(--primary-base)]">
                    {sampleReceipt.seller.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[0.7rem] uppercase tracking-[0.16em] text-[var(--primary-base)]">
                    Payment status
                  </p>
                  <p className="text-sm font-medium text-emerald-600">
                    Settled
                  </p>
                  <p className="text-[var(--primary-base)]">
                    Account ending • {sampleReceipt.payment.accountEnding}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                <div className="text-[0.7rem] text-[var(--primary-base)] max-w-md">
                  <p className="font-medium text-[var(--secondary-black)] mb-1">
                    Internal matching
                  </p>
                  <p>
                    Match this receipt to your internal records using the order,
                    receipt number, and payment reference above. For any
                    questions, contact billing@procur.ag.
                  </p>
                </div>
                <div className="w-full sm:max-w-xs">
                  <dl className="space-y-1 text-xs">
                    <div className="flex justify-between gap-4">
                      <dt className="text-[var(--primary-base)]">
                        Amount paid
                      </dt>
                      <dd className="font-semibold text-[var(--secondary-black)]">
                        {receiptCurrency(total)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-[var(--primary-base)]">
                        Includes tax
                      </dt>
                      <dd className="font-medium text-[var(--secondary-black)]">
                        {receiptCurrency(tax)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </section>

          {/* Statement style receipt */}
          <section>
            <div className="flex items-center justify-between gap-4 mb-4">
              {renderHeader(
                "Statement row",
                "Ledger-style confirmation that could sit alongside other transactions in a statement export."
              )}
              {renderDownloadButton("statement")}
            </div>
            <div
              ref={statementRef}
              className="bg-white rounded-3xl border border-gray-200 shadow-[0_18px_40px_rgba(15,23,42,0.06)] overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--primary-base)]">
                    Procur · Receipt
                  </p>
                  <p className="text-sm font-medium text-[var(--secondary-black)]">
                    {sampleReceipt.receiptNumber}
                  </p>
                </div>
                <div className="text-xs text-right text-[var(--primary-base)]">
                  <p>{sampleReceipt.paymentDate}</p>
                  <p>Method: {sampleReceipt.payment.method}</p>
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-[0.7rem]">
                  <div className="space-y-0.5">
                    <p className="text-[var(--primary-base)]">
                      Buyer:{" "}
                      <span className="font-medium text-[var(--secondary-black)]">
                        {sampleReceipt.buyer.name}
                      </span>
                    </p>
                    <p className="text-[var(--primary-base)]">
                      Order: {sampleReceipt.orderNumber}
                    </p>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <p className="text-[var(--primary-base)]">
                      Amount paid:{" "}
                      <span className="font-semibold text-[var(--secondary-black)]">
                        {receiptCurrency(total)}
                      </span>
                    </p>
                    <p className="text-[var(--primary-base)]">
                      Tax included: {receiptCurrency(tax)}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-[0.68rem] text-[var(--primary-base)] leading-relaxed">
                  {sampleReceipt.note}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReceiptTestPage;
