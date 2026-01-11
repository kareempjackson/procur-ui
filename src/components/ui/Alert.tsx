"use client";

import React from "react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export type AlertVariant = "info" | "success" | "warning" | "error";

const variantStyles: Record<
  AlertVariant,
  { container: string; iconWrap: string; Icon: React.ComponentType<any> }
> = {
  info: {
    container:
      "border-[color:var(--secondary-soft-highlight)] bg-white text-[color:var(--secondary-black)]",
    iconWrap: "bg-[color:var(--primary-background)] text-[color:var(--primary-base)]",
    Icon: InformationCircleIcon,
  },
  success: {
    container: "border-green-200 bg-green-50 text-green-900",
    iconWrap: "bg-green-100 text-green-700",
    Icon: CheckCircleIcon,
  },
  warning: {
    container: "border-amber-200 bg-amber-50 text-amber-900",
    iconWrap: "bg-amber-100 text-amber-700",
    Icon: ExclamationTriangleIcon,
  },
  error: {
    container: "border-red-200 bg-red-50 text-red-900",
    iconWrap: "bg-red-100 text-red-700",
    Icon: XCircleIcon,
  },
};

export function Alert({
  variant = "info",
  title,
  description,
  children,
  actions,
  onDismiss,
  className,
}: {
  variant?: AlertVariant;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}) {
  const v = variantStyles[variant];
  const Icon = v.Icon;

  return (
    <section
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      className={[
        "w-full rounded-2xl border px-4 py-3 shadow-sm",
        v.container,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-start gap-3">
        <div
          className={[
            "mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl",
            v.iconWrap,
          ].join(" ")}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          {title ? <div className="text-sm font-semibold">{title}</div> : null}
          {description ? (
            <div className="mt-1 text-xs opacity-90">{description}</div>
          ) : null}
          {children ? <div className="mt-2">{children}</div> : null}
          {actions ? <div className="mt-3 flex flex-wrap gap-2">{actions}</div> : null}
        </div>

        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-full p-1.5 text-current/70 hover:text-current hover:bg-black/5 transition-colors"
            aria-label="Dismiss"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </section>
  );
}


