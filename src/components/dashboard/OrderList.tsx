"use client";

import Link from "next/link";
import { ReactNode } from "react";

export type OrderListItem = {
  id: string;
  buyer: string;
  date: string; // ISO string
  status: "new" | "preparing" | "in_transit" | "delivered" | "issue";
};

type OrderListProps = {
  title?: string;
  subtitle?: string;
  items: OrderListItem[];
  actions?: ReactNode;
};

export default function OrderList({
  title = "Orders at a glance",
  subtitle = "Track shipments and fulfillment",
  items,
  actions,
}: OrderListProps) {
  const statusConfig: Record<
    OrderListItem["status"],
    { label: string; className: string }
  > = {
    new: { label: "New", className: "bg-amber-100 text-amber-800" },
    preparing: { label: "Preparing", className: "bg-blue-100 text-blue-800" },
    in_transit: {
      label: "In transit",
      className: "bg-purple-100 text-purple-800",
    },
    delivered: {
      label: "Delivered",
      className: "bg-emerald-100 text-emerald-700",
    },
    issue: { label: "Issue", className: "bg-rose-100 text-rose-700" },
  };

  return (
    <section className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 border-b border-[color:var(--secondary-soft-highlight)]">
        <div>
          <h2 className="text-base font-semibold text-[color:var(--secondary-black)]">
            {title}
          </h2>
          <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
            {subtitle}
          </p>
        </div>
        {actions}
      </div>

      {items.length === 0 ? (
        <div className="px-5 py-12 text-center text-sm text-[color:var(--secondary-muted-edge)]">
          No orders
        </div>
      ) : (
        <div className="divide-y divide-[color:var(--secondary-soft-highlight)]/30">
          {items.map((order) => {
            const conf = statusConfig[order.status];
            return (
              <div
                key={order.id}
                className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center hover:bg-black/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-[var(--primary-accent1)]/20 flex items-center justify-center text-xs font-medium text-[color:var(--primary-accent3)]">
                    {order.buyer.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/seller/orders/${order.id.replace("#", "")}`}
                      className="text-sm text-[color:var(--secondary-black)] font-medium hover:text-[var(--primary-accent2)] truncate"
                    >
                      {order.id}
                    </Link>
                    <div className="text-xs text-[color:var(--secondary-muted-edge)] truncate">
                      {order.buyer}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="text-xs text-[color:var(--secondary-muted-edge)] hidden sm:inline">
                    {new Date(order.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${conf.className}`}
                  >
                    {conf.label}
                  </span>
                  <div className="flex items-center gap-2 text-[color:var(--secondary-muted-edge)]">
                    <button
                      className="p-1.5 rounded-full hover:bg-black/[0.06]"
                      title="Refund"
                    >
                      ⟲
                    </button>
                    <button
                      className="p-1.5 rounded-full hover:bg-black/[0.06]"
                      title="Hold"
                    >
                      ⏸
                    </button>
                    <button
                      className="p-1.5 rounded-full hover:bg-black/[0.06]"
                      title="Print"
                    >
                      ⎙
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
