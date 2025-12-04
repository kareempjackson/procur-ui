"use client";

import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type InvoiceVariant = "classic" | "soft" | "statement";

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
    subtotal: 0,
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

// Pre-calculate monetary values
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

  return {
    lineSubtotal,
    tax,
    gross,
    total,
  };
};

const currency = (value: number) =>
  `${sampleInvoice.charges.currency} ${value.toLocaleString("en-US", {
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
      // Narrow supports rules that declare lab() colors
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
  const softRef = useRef<HTMLDivElement | null>(null);
  const statementRef = useRef<HTMLDivElement | null>(null);

  const { lineSubtotal, tax, total } = computeTotals();

  const downloadAsPdf = async (variant: InvoiceVariant) => {
    let targetRef: React.RefObject<HTMLDivElement | null>;

    switch (variant) {
      case "classic":
        targetRef = classicRef;
        break;
      case "soft":
        targetRef = softRef;
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

    // Tailwind v4 can emit color functions like lab() which html2canvas
    // cannot parse. Temporarily wrap getComputedStyle so any lab() values
    // are stripped before html2canvas processes styles.
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
    pdf.save(`procur-invoice-${variant}.pdf`);
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
                Preview on-brand invoice layouts that we can send to buyers and
                sellers. Each concept is designed to feel calm, trustworthy, and
                aligned with the Procur marketplace experience.
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

        {/* Invoice variants */}
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
            <div
              ref={classicRef}
              className="bg-white rounded-3xl border border-gray-200 shadow-[0_18px_40px_rgba(15,23,42,0.06)] p-8 sm:p-10"
            >
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
                    <div className="flex justify-between sm:justify-end gap-3">
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
                    {sampleInvoice.items.map((item, index) => {
                      const lineTotal = item.quantity * item.unitPrice;
                      return (
                        <tr
                          key={item.description}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50/60"
                          }
                        >
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
                        Tax ({(sampleInvoice.charges.taxRate * 100).toFixed(0)}
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

              <p className="mt-8 text-[0.68rem] text-[var(--primary-base)] leading-relaxed">
                {sampleInvoice.footerNote}
              </p>
            </div>
          </section>

          {/* Soft invoice */}
          <section>
            <div className="flex items-center justify-between gap-4 mb-4">
              {renderHeader(
                "Soft harvest",
                "Full-bleed section with a soft agricultural backdrop. Friendly for buyer-facing emails."
              )}
              {renderDownloadButton("soft")}
            </div>
            <div
              ref={softRef}
              className="rounded-3xl overflow-hidden border border-gray-200 shadow-[0_18px_40px_rgba(15,23,42,0.06)] bg-gradient-to-br from-[var(--primary-background)] via-white to-[var(--secondary-soft-highlight)]/35"
            >
              <div className="px-8 sm:px-10 pt-8 pb-6 border-b border-gray-200/70 bg-[var(--primary-background)]/60">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 border border-gray-200/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--secondary-muted-edge)]" />
                      <span className="text-xs font-medium tracking-[0.18em] uppercase text-[var(--secondary-black)]">
                        Procur invoice
                      </span>
                    </div>
                    <h2 className="text-2xl font-semibold text-[var(--secondary-black)]">
                      Settlement summary
                    </h2>
                    <p className="text-sm text-[var(--primary-base)] max-w-md">
                      This is a summary of your recent order processed through
                      Procur. Keep this for your records and internal matching.
                    </p>
                  </div>
                  <div className="text-xs text-[var(--primary-base)] space-y-1 sm:text-right">
                    <p>
                      <span className="font-medium text-[var(--secondary-black)]">
                        Invoice
                      </span>{" "}
                      · {sampleInvoice.invoiceNumber}
                    </p>
                    <p>
                      Issue date: {sampleInvoice.issueDate} · Due:{" "}
                      {sampleInvoice.dueDate}
                    </p>
                    <p>PO: {sampleInvoice.meta.purchaseOrder}</p>
                    <p>Currency: {sampleInvoice.charges.currency}</p>
                  </div>
                </div>
              </div>

              <div className="px-8 sm:px-10 py-8 space-y-6 bg-white/90 backdrop-blur">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <p className="text-[0.7rem] uppercase tracking-[0.16em] text-[var(--primary-base)]">
                      Seller
                    </p>
                    <p className="text-sm font-medium text-[var(--secondary-black)]">
                      {sampleInvoice.seller.name}
                    </p>
                    <p className="text-xs text-[var(--primary-base)]">
                      {sampleInvoice.seller.address}
                    </p>
                    <p className="text-xs text-[var(--primary-base)]">
                      {sampleInvoice.seller.country}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[0.7rem] uppercase tracking-[0.16em] text-[var(--primary-base)]">
                      Buyer
                    </p>
                    <p className="text-sm font-medium text-[var(--secondary-black)]">
                      {sampleInvoice.buyer.name}
                    </p>
                    <p className="text-xs text-[var(--primary-base)]">
                      {sampleInvoice.buyer.address}
                    </p>
                    <p className="text-xs text-[var(--primary-base)]">
                      {sampleInvoice.buyer.country}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[0.7rem] uppercase tracking-[0.16em] text-[var(--primary-base)]">
                      Order details
                    </p>
                    <p className="text-xs text-[var(--primary-base)]">
                      Payment terms: {sampleInvoice.meta.paymentTerms}
                    </p>
                    <p className="text-xs text-[var(--primary-base)]">
                      Reference: {sampleInvoice.meta.reference}
                    </p>
                    <p className="text-xs text-[var(--primary-base)]">
                      Contact: {sampleInvoice.buyer.contact}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200/80 bg-[var(--primary-background)]/60 overflow-hidden">
                  <table className="w-full border-collapse text-xs">
                    <thead className="bg-white/80">
                      <tr className="text-[var(--primary-base)] text-left">
                        <th className="px-4 py-2.5 font-medium">Produce</th>
                        <th className="px-4 py-2.5 font-medium text-right">
                          Qty
                        </th>
                        <th className="px-4 py-2.5 font-medium text-right">
                          Rate
                        </th>
                        <th className="px-4 py-2.5 font-medium text-right">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleInvoice.items.map((item, index) => {
                        const lineTotal = item.quantity * item.unitPrice;
                        return (
                          <tr
                            key={`${item.description}-${index}`}
                            className={
                              index % 2 === 0
                                ? "bg-white/70"
                                : "bg-[var(--primary-background)]/70"
                            }
                          >
                            <td className="px-4 py-3 align-top">
                              <p className="text-xs font-medium text-[var(--secondary-black)]">
                                {item.description}
                              </p>
                              <p className="text-[0.7rem] text-[var(--primary-base)] mt-0.5">
                                {item.details}
                              </p>
                            </td>
                            <td className="px-4 py-3 align-top text-right text-[var(--secondary-black)]">
                              {item.quantity.toLocaleString("en-US")}{" "}
                              <span className="text-[var(--primary-base)]">
                                {item.unit}
                              </span>
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
              </div>

              <div className="px-8 sm:px-10 pt-4 pb-7 bg-[var(--secondary-soft-highlight)]/20 border-t border-gray-200/80 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div className="text-[0.7rem] text-[var(--primary-base)] max-w-md">
                  <p className="font-medium text-[var(--secondary-black)] mb-1">
                    How to pay
                  </p>
                  <p>
                    Please settle the amount due within{" "}
                    {sampleInvoice.meta.paymentTerms.toLowerCase()}. Payments
                    are reconciled automatically once received in the Procur
                    settlement account.
                  </p>
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
                      <dt className="text-[var(--primary-base)]">Delivery</dt>
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
                        Tax ({(sampleInvoice.charges.taxRate * 100).toFixed(0)}
                        %)
                      </dt>
                      <dd className="font-medium text-[var(--secondary-black)]">
                        {currency(tax)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-[var(--primary-base)]">Discount</dt>
                      <dd className="font-medium text-emerald-600">
                        -{currency(sampleInvoice.charges.discount)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4 pt-2 border-t border-gray-900/15 mt-2">
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
          </section>

          {/* Statement style */}
          <section>
            <div className="flex items-center justify-between gap-4 mb-4">
              {renderHeader(
                "Statement style",
                "Compact, ledger-inspired layout. Ideal for embedding inside emails with a minimal footprint."
              )}
              {renderDownloadButton("statement")}
            </div>
            <div
              ref={statementRef}
              className="bg-white rounded-3xl border border-gray-200 shadow-[0_18px_40px_rgba(15,23,42,0.06)] overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-52 bg-[var(--secondary-muted-edge)] text-white px-6 py-7 flex flex-col justify-between gap-6">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.16em]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--secondary-highlight1)]" />
                      <span>Procur</span>
                    </div>
                    <div>
                      <p className="text-xs opacity-80 mb-1">Invoice</p>
                      <p className="text-sm font-semibold">
                        {sampleInvoice.invoiceNumber}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1 text-[0.68rem] opacity-90">
                    <p>{sampleInvoice.seller.name}</p>
                    <p>{sampleInvoice.seller.address}</p>
                    <p>{sampleInvoice.seller.country}</p>
                    <p>{sampleInvoice.seller.taxId}</p>
                  </div>
                </div>

                <div className="flex-1 px-6 sm:px-8 py-7 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="space-y-1 text-xs">
                      <p className="text-[0.7rem] uppercase tracking-[0.16em] text-[var(--primary-base)]">
                        Buyer
                      </p>
                      <p className="text-sm font-medium text-[var(--secondary-black)]">
                        {sampleInvoice.buyer.name}
                      </p>
                      <p className="text-xs text-[var(--primary-base)]">
                        {sampleInvoice.buyer.address}
                      </p>
                      <p className="text-xs text-[var(--primary-base)]">
                        {sampleInvoice.buyer.country}
                      </p>
                    </div>
                    <div className="space-y-1 text-xs text-[var(--primary-base)] sm:text-right">
                      <p>
                        Issued: {sampleInvoice.issueDate} · Due:{" "}
                        {sampleInvoice.dueDate}
                      </p>
                      <p>PO: {sampleInvoice.meta.purchaseOrder}</p>
                      <p>Terms: {sampleInvoice.meta.paymentTerms}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-100 overflow-hidden">
                    <table className="w-full border-collapse text-[0.7rem]">
                      <thead className="bg-gray-50">
                        <tr className="text-[var(--primary-base)] text-left">
                          <th className="px-3 py-2 font-medium w-5/12">Item</th>
                          <th className="px-3 py-2 font-medium text-right">
                            Qty
                          </th>
                          <th className="px-3 py-2 font-medium text-right">
                            Rate
                          </th>
                          <th className="px-3 py-2 font-medium text-right">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sampleInvoice.items.map((item, index) => {
                          const lineTotal = item.quantity * item.unitPrice;
                          return (
                            <tr key={item.description}>
                              <td className="px-3 py-2 align-top">
                                <p className="font-medium text-[var(--secondary-black)]">
                                  {item.description}
                                </p>
                                <p className="text-[0.65rem] text-[var(--primary-base)] mt-0.5">
                                  {item.details}
                                </p>
                              </td>
                              <td className="px-3 py-2 align-top text-right text-[var(--secondary-black)]">
                                {item.quantity.toLocaleString("en-US")}
                              </td>
                              <td className="px-3 py-2 align-top text-right text-[var(--secondary-black)]">
                                {currency(item.unitPrice)}
                              </td>
                              <td className="px-3 py-2 align-top text-right font-medium text-[var(--secondary-black)]">
                                {currency(lineTotal)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div className="text-[0.68rem] text-[var(--primary-base)] max-w-xs">
                      <p className="font-medium text-[var(--secondary-black)] mb-1">
                        Notes
                      </p>
                      <p>{sampleInvoice.footerNote}</p>
                    </div>
                    <div className="w-full sm:max-w-xs">
                      <dl className="space-y-1 text-[0.7rem]">
                        <div className="flex justify-between gap-4">
                          <dt className="text-[var(--primary-base)]">
                            Subtotal
                          </dt>
                          <dd className="font-medium text-[var(--secondary-black)]">
                            {currency(lineSubtotal)}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-[var(--primary-base)]">
                            Delivery
                          </dt>
                          <dd className="font-medium text-[var(--secondary-black)]">
                            {currency(sampleInvoice.charges.delivery)}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-[var(--primary-base)]">
                            Platform
                          </dt>
                          <dd className="font-medium text-[var(--secondary-black)]">
                            {currency(sampleInvoice.charges.platformFee)}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-[var(--primary-base)]">Tax</dt>
                          <dd className="font-medium text-[var(--secondary-black)]">
                            {currency(tax)}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-[var(--primary-base)]">
                            Discount
                          </dt>
                          <dd className="font-medium text-emerald-600">
                            -{currency(sampleInvoice.charges.discount)}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-4 pt-2 border-t border-gray-900/15 mt-1">
                          <dt className="text-[0.7rem] font-semibold text-[var(--secondary-black)] uppercase tracking-[0.16em]">
                            Amount due
                          </dt>
                          <dd className="text-sm font-semibold text-[var(--secondary-black)]">
                            {currency(total)}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTestPage;
