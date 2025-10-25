"use client";

import { ReactNode } from "react";

type MetricCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
};

export default function MetricCard({
  label,
  value,
  hint,
  icon,
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide text-[color:var(--secondary-muted-edge)]">
            {label}
          </div>
          <div className="mt-1 text-3xl font-semibold text-[color:var(--secondary-black)]">
            {value}
          </div>
          {hint && (
            <div className="mt-1 text-xs text-[color:var(--secondary-muted-edge)]">
              {hint}
            </div>
          )}
        </div>
        {icon && (
          <div className="h-10 w-10 rounded-xl bg-black/[0.03] text-[color:var(--secondary-muted-edge)] flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
