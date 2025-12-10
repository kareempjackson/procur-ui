"use client";

import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type InvoiceVariant = "classic";

const EMAIL_LOGO_URL =
  "https://dbuxyviftwahgrgiftrw.supabase.co/storage/v1/object/public/public/main-logo/procur-logo.svg";
const CURRENT_YEAR = new Date().getFullYear();

const sampleInvoice = {
  invoiceNumber: "INV-2025-00127",
  issueDate: "03 Dec 2025",
  dueDate: "17 Dec 2025",
  seller: {
    name: "Procur Marketplace",
    address: "12 Harvest Lane, Kingston",
    country: "Jamaica",
    email: "billing@procur.ag",
    phone: "+1 (876) 555-0123",
    taxId: "TRN 123 456 789",
  },
  buyer: {
    name: "Green Valley Grocers",
    contact: "Alicia Johnson",
    address: "48 Market Street, Montego Bay",
    country: "Jamaica",
    email: "invoices@greenvalleygrocers.com",
  },
  meta: {
    purchaseOrder: "PO-7842",
    paymentTerms: "Net 14 days",
    reference: "Bulk Farm Produce – Winter Cycle",
  },
  items: [
    {
      description: "Roma Tomatoes – Grade A",
      details: "Packed in 20kg crates • Field-packed and pre-cooled",
      unit: "kg",
      quantity: 1200,
      unitPrice: 1.35,
    },
    {
      description: "Green Leaf Lettuce – Hydroponic",
      details: "Boxed in 10kg cartons • Pre-washed and trimmed",
      unit: "kg",
      quantity: 450,
      unitPrice: 2.1,
    },
    {
      description: "Mixed Sweet Peppers",
      details: "Red, yellow and green mix • 15kg crates",
      unit: "kg",
      quantity: 300,
      unitPrice: 2.6,
    },
  ],
  charges: {
    currency: "USD",
    delivery: 185,
    platformFee: 79,
    taxRate: 0.15,
    discount: 120,
  },
  footerNote:
    "Thank you for sourcing fresh produce through Procur. Payments help us keep farmers on the land and buyers fully supplied.",
  paymentInstructions: [
    "Bank transfer to Procur Settlement Account within 14 days.",
    "Include invoice number as payment reference.",
    "Forward proof of payment to billing@procur.ag for faster allocation.",
  ],
};

const computeTotals = () => {
  const lineSubtotal = sampleInvoice.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const tax =
    (lineSubtotal + sampleInvoice.charges.delivery) *
    sampleInvoice.charges.taxRate;
  const gross =
    lineSubtotal +
    sampleInvoice.charges.delivery +
    sampleInvoice.charges.platformFee +
    tax;
  const total = gross - sampleInvoice.charges.discount;

  return { lineSubtotal, tax, total };
};

const currency = (value: number) =>
  `${sampleInvoice.charges.currency} ${value.toLocaleString("en-US", {
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

// Tailwind v4 can emit lab() colors in @supports blocks that html2canvas
// doesn't understand; we strip those rules out before capture.
const stripLabColorRules = () => {
  if (typeof document === "undefined") return;
  const styleSheets = Array.from(document.styleSheets || []);

  for (const sheet of styleSheets) {
    const cssSheet = sheet as CSSStyleSheet;
    let rules: CSSRuleList;
    try {
      rules = cssSheet.cssRules;
    } catch {
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

const InvoiceTestPage: React.FC = () => {
  const classicRef = useRef<HTMLDivElement | null>(null);
  const { lineSubtotal, tax, total } = computeTotals();

  const downloadAsPdf = async (variant: InvoiceVariant) => {
    if (variant !== "classic" || !classicRef.current) return;

    const element = classicRef.current;
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
    pdf.save("procur-invoice-classic.pdf");
  };

  const renderHeader = (label: string, description: string) => (
    <div className="flex flex-col gap-2 mb-6">
      <span className="uppercase tracking-[0.16em] text-xs text-[var(--primary-base)]">
        Invoice concept
      </span>
      <h2 className="text-xl font-semibold text-[var(--secondary-black)]">
        {label}
      </h2>
      <p className="text-sm text-[var(--primary-base)] max-w-xl">
        {description}
      </p>
    </div>
  );

  const renderDownloadButton = (variant: InvoiceVariant) => (
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
                Test · Invoices
              </p>
              <h1 className="text-3xl sm:text-4xl font-semibold text-[var(--secondary-black)] mb-3">
                Virtual invoice gallery
              </h1>
              <p className="text-sm sm:text-base text-[var(--primary-base)] max-w-2xl">
                Preview a classic Procur invoice layout with branded header and
                footer. This is the baseline we can use for email and PDF
                invoices.
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-2 text-right">
              <span className="text-xs uppercase tracking-[0.16em] text-[var(--primary-base)]">
                Internal
              </span>
              <span className="text-sm text-[var(--primary-base)]">
                Route:{" "}
                <code className="px-2 py-1 rounded-full bg-white border border-gray-200 text-xs">
                  /test/invoices
                </code>
              </span>
            </div>
          </div>
        </header>

        <div className="space-y-10">
          {/* Classic invoice */}
          <section>
            <div className="flex items-center justify-between gap-4 mb-4">
              {renderHeader(
                "Classic balance",
                "Neutral, receipt-style layout with Procur accents. Optimised for clarity in email and print."
              )}
              {renderDownloadButton("classic")}
            </div>

            <div ref={classicRef} className="space-y-4">
              <BrandHeader />

              <div className="bg-white rounded-3xl border border-gray-200 shadow-[0_18px_40px_rgba(15,23,42,0.06)] p-8 sm:p-10">
                {/* Top meta */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8 border-b border-gray-100 pb-6">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[var(--primary-background)] px-3 py-1">
                      <span className="w-2 h-2 rounded-full bg-[var(--primary-accent2)]" />
                      <span className="text-xs font-medium tracking-wide text-[var(--primary-base)]">
                        Procur marketplace
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold tracking-tight text-[var(--secondary-black)]">
                        Tax invoice
                      </h2>
                      <p className="text-sm text-[var(--primary-base)] mt-1">
                        Official summary of your order on Procur.
                      </p>
                    </div>
                    <div className="text-xs text-[var(--primary-base)] space-y-0.5">
                      <p>{sampleInvoice.seller.address}</p>
                      <p>{sampleInvoice.seller.country}</p>
                      <p>{sampleInvoice.seller.email}</p>
                      <p>{sampleInvoice.seller.phone}</p>
                      <p>{sampleInvoice.seller.taxId}</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm sm:text-right">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[var(--secondary-soft-highlight)]/40 px-3 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-xs font-medium text-[var(--secondary-black)]">
                        Payment pending
                      </span>
                    </div>
                    <dl className="grid grid-cols-2 sm:grid-cols-1 gap-x-6 gap-y-1 text-xs text-[var(--primary-base)]">
                      <div className="flex justify-between sm:justify-end gap-3">
                        <dt className="uppercase tracking-[0.16em]">Invoice</dt>
                        <dd className="font-medium text-[var(--secondary-black)]">
                          {sampleInvoice.invoiceNumber}
                        </dd>
                      </div>
                      <div className="flex justify-between sm:justify-end gap-3">
                        <dt className="uppercase tracking-[0.16em]">Issued</dt>
                        <dd className="font-medium text-[var(--secondary-black)]">
                          {sampleInvoice.issueDate}
                        </dd>
                      </div>
                      <div className="flex justify-between sm:justify-end gap-3">
                        <dt className="uppercase tracking-[0.16em]">Due</dt>
                        <dd className="font-medium text-[var(--secondary-black)]">
                          {sampleInvoice.dueDate}
                        </dd>
                      </div>
                      <div className="flex justify_between sm:justify-end gap-3">
                        <dt className="uppercase tracking-[0.16em]">PO</dt>
                        <dd className="font-medium text-[var(--secondary-black)]">
                          {sampleInvoice.meta.purchaseOrder}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Parties */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--primary-base)]">
                      Billed to
                    </p>
                    <div className="space-y-0.5 text-sm">
                      <p className="font-medium text-[var(--secondary-black)]">
                        {sampleInvoice.buyer.name}
                      </p>
                      <p className="text-[var(--primary-base)]">
                        Attn: {sampleInvoice.buyer.contact}
                      </p>
                      <p className="text-[var(--primary-base)]">
                        {sampleInvoice.buyer.address}
                      </p>
                      <p className="text-[var(--primary-base)]">
                        {sampleInvoice.buyer.country}
                      </p>
                      <p className="text-[var(--primary-base)]">
                        {sampleInvoice.buyer.email}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--primary-base)]">
                      Order reference
                    </p>
                    <div className="space-y-1 text-sm text-[var(--primary-base)]">
                      <p>Payment terms: {sampleInvoice.meta.paymentTerms}</p>
                      <p>Reference: {sampleInvoice.meta.reference}</p>
                    </div>
                  </div>
                </div>

                {/* Line items */}
                <div className="rounded-2xl border border-gray-100 overflow-hidden mb-8">
                  <table className="w-full border-collapse text-xs">
                    <thead className="bg-[var(--primary-background)]">
                      <tr className="text-[var(--primary-base)] text-left">
                        <th className="px-4 py-3 font-medium">Item</th>
                        <th className="px-4 py-3 font-medium hidden sm:table-cell">
                          Details
                        </th>
                        <th className="px-4 py-3 font-medium text-right">
                          Qty ({sampleInvoice.items[0].unit})
                        </th>
                        <th className="px-4 py-3 font-medium text-right">
                          Unit price
                        </th>
                        <th className="px-4 py-3 font-medium text-right">
                          Line total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleInvoice.items.map((item) => {
                        const lineTotal = item.quantity * item.unitPrice;
                        return (
                          <tr key={item.description}>
                            <td className="px-4 py-3 align-top">
                              <p className="font-medium text-[var(--secondary-black)]">
                                {item.description}
                              </p>
                              <p className="text-[var(--primary-base)] sm:hidden mt-1">
                                {item.details}
                              </p>
                            </td>
                            <td className="px-4 py-3 align-top text-[var(--primary-base)] hidden sm:table-cell">
                              {item.details}
                            </td>
                            <td className="px-4 py-3 align-top text-right text-[var(--secondary-black)]">
                              {item.quantity.toLocaleString("en-US")}
                            </td>
                            <td className="px-4 py-3 align-top text-right text-[var(--secondary-black)]">
                              {currency(item.unitPrice)}
                            </td>
                            <td className="px-4 py-3 align-top text-right font-medium text-[var(--secondary-black)]">
                              {currency(lineTotal)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                  <div className="text-xs text-[var(--primary-base)] max-w-sm">
                    <p className="font-medium text-[var(--secondary-black)] mb-1">
                      Payment instructions
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      {sampleInvoice.paymentInstructions.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="w-full sm:max-w-xs">
                    <dl className="space-y-1 text-xs">
                      <div className="flex justify-between gap-4">
                        <dt className="text-[var(--primary-base)]">Subtotal</dt>
                        <dd className="font-medium text-[var(--secondary-black)]">
                          {currency(lineSubtotal)}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-[var(--primary-base)]">
                          Delivery &amp; handling
                        </dt>
                        <dd className="font-medium text-[var(--secondary-black)]">
                          {currency(sampleInvoice.charges.delivery)}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-[var(--primary-base)]">
                          Platform fee
                        </dt>
                        <dd className="font-medium text-[var(--secondary-black)]">
                          {currency(sampleInvoice.charges.platformFee)}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-[var(--primary-base)]">
                          Tax (
                          {(sampleInvoice.charges.taxRate * 100).toFixed(0)}
                          %)
                        </dt>
                        <dd className="font-medium text-[var(--secondary-black)]">
                          {currency(tax)}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4 pt-2 border-t border-dashed border-gray-200 mt-1">
                        <dt className="text-[var(--primary-base)]">Discount</dt>
                        <dd className="font-medium text-emerald-600">
                          -{currency(sampleInvoice.charges.discount)}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4 pt-2 border-t border-gray-900/10 mt-2">
                        <dt className="text-xs font-semibold text-[var(--secondary-black)] uppercase tracking-[0.16em]">
                          Amount due
                        </dt>
                        <dd className="text-base font-semibold text-[var(--secondary-black)]">
                          {currency(total)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>

              <p className="mt-8 text-[0.68rem] text-[var(--primary-base)] leading-relaxed">
                {sampleInvoice.footerNote}
              </p>
              <BrandFooter />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTestPage;
