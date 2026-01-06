"use client";

import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ClassicInvoice } from "@/components/invoices/ClassicInvoice";

type InvoiceVariant = "classic";

const EMAIL_LOGO_URL =
  "https://dbuxyviftwahgrgiftrw.supabase.co/storage/v1/object/public/public/main-logo/procur-logo.svg";

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

            <ClassicInvoice
              ref={classicRef}
              logoUrl={EMAIL_LOGO_URL}
              invoiceNumber={sampleInvoice.invoiceNumber}
              issueDate={sampleInvoice.issueDate}
              dueDate={sampleInvoice.dueDate}
              purchaseOrder={sampleInvoice.meta.purchaseOrder}
              paymentStatusLabel="Payment pending"
              seller={{
                addressLines: [sampleInvoice.seller.address],
                country: sampleInvoice.seller.country,
                email: sampleInvoice.seller.email,
                phone: sampleInvoice.seller.phone,
                taxId: sampleInvoice.seller.taxId,
              }}
              buyer={{
                name: sampleInvoice.buyer.name,
                contact: sampleInvoice.buyer.contact,
                addressLines: [sampleInvoice.buyer.address],
                country: sampleInvoice.buyer.country,
                email: sampleInvoice.buyer.email,
              }}
              metaLines={[
                `Payment terms: ${sampleInvoice.meta.paymentTerms}`,
                `Reference: ${sampleInvoice.meta.reference}`,
              ]}
              items={sampleInvoice.items.map((item) => ({
                description: item.description,
                details: item.details,
                unit: item.unit,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
              }))}
              charges={{
                currency: sampleInvoice.charges.currency,
                delivery: sampleInvoice.charges.delivery,
                platformFee: sampleInvoice.charges.platformFee,
                discount: sampleInvoice.charges.discount,
                taxRate: sampleInvoice.charges.taxRate,
              }}
              paymentInstructions={sampleInvoice.paymentInstructions}
              footerNote={sampleInvoice.footerNote}
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTestPage;
