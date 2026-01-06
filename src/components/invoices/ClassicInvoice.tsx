import React, { forwardRef } from "react";

export type ClassicInvoiceParty = {
  name?: string;
  contact?: string;
  addressLines?: string[];
  country?: string;
  email?: string;
  phone?: string;
  taxId?: string;
};

export type ClassicInvoiceItem = {
  description: string;
  details?: string;
  unit?: string;
  quantity: number;
  unitPrice: number;
};

export type ClassicInvoiceCharges = {
  currency: string;
  delivery?: number;
  platformFee?: number;
  discount?: number;
  taxRate?: number; // 0.15 => 15%
};

export type ClassicInvoiceProps = {
  logoUrl?: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate?: string;
  purchaseOrder?: string;
  paymentStatusLabel?: string;
  seller: ClassicInvoiceParty;
  buyer: ClassicInvoiceParty;
  metaLines?: string[];
  items: ClassicInvoiceItem[];
  charges: ClassicInvoiceCharges;
  paymentInstructions?: string[];
  footerNote?: string;
  showBrandHeader?: boolean;
  showBrandFooter?: boolean;
};

const DEFAULT_LOGO_URL =
  "https://dbuxyviftwahgrgiftrw.supabase.co/storage/v1/object/public/public/main-logo/procur-logo.svg";

const CURRENT_YEAR = new Date().getFullYear();

const currency = (currencyCode: string, value: number) =>
  `${currencyCode} ${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const BrandHeader: React.FC<{ logoUrl?: string }> = ({ logoUrl }) => (
  <div className="border border-gray-200 rounded-2xl bg-white px-6 py-4 flex items-center justify-center">
    <img
      src={logoUrl || DEFAULT_LOGO_URL}
      alt="Procur logo"
      crossOrigin="anonymous"
      className="h-9 w-auto"
    />
  </div>
);

const BrandFooter: React.FC = () => (
  <div className="border border-gray-200 rounded-2xl bg-[#fafafa] px-6 py-3 text-[0.68rem] text-[var(--primary-base)] text-center">
    <p>© {CURRENT_YEAR} Procur Grenada Ltd. All rights reserved.</p>
    <p>Procur Grenada Ltd. Annandale, St. Georges, Grenada W.I., 473-538-4365</p>
  </div>
);

export const ClassicInvoice = forwardRef<HTMLDivElement, ClassicInvoiceProps>(
  function ClassicInvoice(
    {
      logoUrl,
      invoiceNumber,
      issueDate,
      dueDate,
      purchaseOrder,
      paymentStatusLabel,
      seller,
      buyer,
      metaLines,
      items,
      charges,
      paymentInstructions,
      footerNote,
      showBrandHeader = true,
      showBrandFooter = true,
    },
    ref
  ) {
    const lineSubtotal = (items || []).reduce(
      (sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0),
      0
    );
    const delivery = Number(charges.delivery || 0);
    const platformFee = Number(charges.platformFee || 0);
    const taxRate = Number(charges.taxRate || 0);
    const discount = Number(charges.discount || 0);
    const tax = (lineSubtotal + delivery) * taxRate;
    const gross = lineSubtotal + delivery + platformFee + tax;
    const total = gross - discount;

    const unitLabel =
      items?.length && items[0]?.unit ? ` (${items[0].unit})` : "";

    const instructions =
      paymentInstructions && paymentInstructions.length > 0
        ? paymentInstructions
        : [
            "Bank transfer to Procur Settlement Account within 14 days.",
            "Include invoice number as payment reference.",
          ];

    const note =
      footerNote ||
      "Thank you for sourcing fresh produce through Procur. Payments help us keep farmers on the land and buyers fully supplied.";

    return (
      <div ref={ref} className="space-y-4 w-[900px] max-w-[900px]">
        {showBrandHeader ? <BrandHeader logoUrl={logoUrl} /> : null}

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
                {seller.addressLines?.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                {seller.country ? <p>{seller.country}</p> : null}
                {seller.email ? <p>{seller.email}</p> : null}
                {seller.phone ? <p>{seller.phone}</p> : null}
                {seller.taxId ? <p>{seller.taxId}</p> : null}
              </div>
            </div>

            <div className="space-y-3 text-sm sm:text-right">
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--secondary-soft-highlight)]/40 px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-[var(--secondary-black)]">
                  {paymentStatusLabel || "Payment pending"}
                </span>
              </div>
              <dl className="grid grid-cols-2 sm:grid-cols-1 gap-x-6 gap-y-1 text-xs text-[var(--primary-base)]">
                <div className="flex justify-between sm:justify-end gap-3">
                  <dt className="uppercase tracking-[0.16em]">Invoice</dt>
                  <dd className="font-medium text-[var(--secondary-black)]">
                    {invoiceNumber}
                  </dd>
                </div>
                <div className="flex justify-between sm:justify-end gap-3">
                  <dt className="uppercase tracking-[0.16em]">Issued</dt>
                  <dd className="font-medium text-[var(--secondary-black)]">
                    {issueDate}
                  </dd>
                </div>
                {dueDate ? (
                  <div className="flex justify-between sm:justify-end gap-3">
                    <dt className="uppercase tracking-[0.16em]">Due</dt>
                    <dd className="font-medium text-[var(--secondary-black)]">
                      {dueDate}
                    </dd>
                  </div>
                ) : null}
                {purchaseOrder ? (
                  <div className="flex justify-between sm:justify-end gap-3">
                    <dt className="uppercase tracking-[0.16em]">PO</dt>
                    <dd className="font-medium text-[var(--secondary-black)]">
                      {purchaseOrder}
                    </dd>
                  </div>
                ) : null}
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
                {buyer.name ? (
                  <p className="font-medium text-[var(--secondary-black)]">
                    {buyer.name}
                  </p>
                ) : null}
                {buyer.contact ? (
                  <p className="text-[var(--primary-base)]">
                    Attn: {buyer.contact}
                  </p>
                ) : null}
                {buyer.addressLines?.map((line) => (
                  <p key={line} className="text-[var(--primary-base)]">
                    {line}
                  </p>
                ))}
                {buyer.country ? (
                  <p className="text-[var(--primary-base)]">{buyer.country}</p>
                ) : null}
                {buyer.email ? (
                  <p className="text-[var(--primary-base)]">{buyer.email}</p>
                ) : null}
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--primary-base)]">
                Order reference
              </p>
              <div className="space-y-1 text-sm text-[var(--primary-base)]">
                {(metaLines || []).map((line) => (
                  <p key={line}>{line}</p>
                ))}
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
                    Qty{unitLabel}
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
                {(items || []).map((item, idx) => {
                  const lineTotal =
                    Number(item.quantity || 0) * Number(item.unitPrice || 0);
                  return (
                    <tr
                      key={`${item.description}-${idx}`}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/60"}
                    >
                      <td className="px-4 py-3 align-top">
                        <p className="font-medium text-[var(--secondary-black)]">
                          {item.description}
                        </p>
                        {item.details ? (
                          <p className="text-[var(--primary-base)] sm:hidden mt-1">
                            {item.details}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 align-top text-[var(--primary-base)] hidden sm:table-cell">
                        {item.details || ""}
                      </td>
                      <td className="px-4 py-3 align-top text-right text-[var(--secondary-black)]">
                        {Number(item.quantity || 0).toLocaleString("en-US")}
                      </td>
                      <td className="px-4 py-3 align-top text-right text-[var(--secondary-black)]">
                        {currency(charges.currency, item.unitPrice)}
                      </td>
                      <td className="px-4 py-3 align-top text-right font-medium text-[var(--secondary-black)]">
                        {currency(charges.currency, lineTotal)}
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
                {instructions.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div className="w-full sm:max-w-xs">
              <dl className="space-y-1 text-xs">
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--primary-base)]">Subtotal</dt>
                  <dd className="font-medium text-[var(--secondary-black)]">
                    {currency(charges.currency, lineSubtotal)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--primary-base)]">
                    Delivery &amp; handling
                  </dt>
                  <dd className="font-medium text-[var(--secondary-black)]">
                    {currency(charges.currency, delivery)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--primary-base)]">Platform fee</dt>
                  <dd className="font-medium text-[var(--secondary-black)]">
                    {currency(charges.currency, platformFee)}
                  </dd>
                </div>
                {taxRate > 0 ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--primary-base)]">
                      Tax ({(taxRate * 100).toFixed(0)}%)
                    </dt>
                    <dd className="font-medium text-[var(--secondary-black)]">
                      {currency(charges.currency, tax)}
                    </dd>
                  </div>
                ) : null}
                {discount > 0 ? (
                  <div className="flex justify-between gap-4 pt-2 border-t border-dashed border-gray-200 mt-1">
                    <dt className="text-[var(--primary-base)]">Discount</dt>
                    <dd className="font-medium text-emerald-600">
                      -{currency(charges.currency, discount)}
                    </dd>
                  </div>
                ) : null}
                <div className="flex justify-between gap-4 pt-2 border-t border-gray-900/10 mt-2">
                  <dt className="text-xs font-semibold text-[var(--secondary-black)] uppercase tracking-[0.16em]">
                    Amount due
                  </dt>
                  <dd className="text-base font-semibold text-[var(--secondary-black)]">
                    {currency(charges.currency, total)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <p className="mt-8 text-[0.68rem] text-[var(--primary-base)] leading-relaxed">
          {note}
        </p>

        {showBrandFooter ? <BrandFooter /> : null}
      </div>
    );
  }
);


