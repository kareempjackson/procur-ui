"use client";

import { ReactNode } from "react";

type MetricCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
  variant?: "default" | "danger" | "success";
};

export default function MetricCard({
  label,
  value,
  hint,
  icon,
  variant = "default",
}: MetricCardProps) {
  const variantStyles = {
    default: {
      border: "border-[color:var(--secondary-soft-highlight)]",
      bg: "bg-white",
      text: "text-[color:var(--secondary-black)]",
      hint: "text-[color:var(--secondary-muted-edge)]",
      iconBg: "bg-black/[0.03] text-[color:var(--secondary-muted-edge)]",
    },
    danger: {
      border: "border-red-200",
      bg: "bg-red-50",
      text: "text-red-700",
      hint: "text-red-600",
      iconBg: "bg-red-100 text-red-600",
    },
    success: {
      border: "border-emerald-200",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      hint: "text-emerald-600",
      iconBg: "bg-emerald-100 text-emerald-600",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={`rounded-2xl border ${styles.border} ${styles.bg} p-6`}>
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className={`text-xs uppercase tracking-wide ${styles.hint}`}>
            {label}
          </div>
          <div className={`mt-1 text-3xl font-semibold ${styles.text}`}>
            {value}
          </div>
          {hint && (
            <div className={`mt-1 text-xs ${styles.hint}`}>
              {hint}
            </div>
          )}
        </div>
        {icon && (
          <div className={`h-10 w-10 rounded-xl ${styles.iconBg} flex items-center justify-center`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
