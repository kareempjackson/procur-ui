"use client";

import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type ReceiptVariant = "compact";

const EMAIL_LOGO_URL =
  "https://dbuxyviftwahgrgiftrw.supabase.co/storage/v1/object/public/public/main-logo/procur-logo.svg";
const CURRENT_YEAR = new Date().getFullYear();

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

const BrandHeader: React.FC = () => (
  <div className="border border-gray-200 rounded-2xl bg-white px-6 py-4 flex items-center justify-center">
    <img src={EMAIL_LOGO_URL} alt="Procur logo" className="h-9 w-auto" />
  </div>
);

const BrandFooter: React.FC = () => (
  <div className="border border-gray-200 rounded-2xl bg-[#fafafa] px-6 py-3 text-[0.68rem] text-[var(--primary-base)] text-center">
    <p>© {CURRENT_YEAR} Procur Grenada Ltd. All rights reserved.</p>
    <p>
      Procur Grenada Ltd. Annandale, St. Georges, Grenada W.I., 473-538-4365
    </p>
  </div>
);

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
  const { tax, total } = computeReceiptTotals();

  const downloadAsPdf = async (variant: ReceiptVariant) => {
    if (variant !== "compact" || !compactRef.current) return;

    const element = compactRef.current;

    stripLabColorRules();

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
    pdf.save("procur-receipt-compact.pdf");
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
                Preview a simple Procur payment receipt with branded header and
                footer. This layout can be reused for email receipts and PDF
                downloads.
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

            <div ref={compactRef} className="space-y-4">
              <BrandHeader />

              <div className="w-full bg-white rounded-3xl border border-gray-200 shadow-[0_18px_40px_rgba(15,23,42,0.06)] px-6 py-7">
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
                      <dt className="text-[var(--primary-base)]">
                        Platform fee
                      </dt>
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

              <BrandFooter />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReceiptTestPage;
